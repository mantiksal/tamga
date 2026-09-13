"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Tone } from "./tone.js";
import { toneOf } from "./tone.js";
import { Icon } from "./icon.js";
import { cn } from "../lib/cn.js";
import { Close } from "./icons.js";
import { SkeletonOptions, SkeletonPanel } from "./skeleton.js";
import { Button } from "./button.js";
import { useFocusTrap, useListKeys } from "./a11y.js";
import { MiniButton } from "./button.js";
import { useScrollLock } from "../lib/scroll-lock.js";

/* ------------------------------------------------------------------ *
 * The overlay plane. Everything here sits at 6px — past the 4px the
 * page can reach — which is the whole "this is floating" signal.
 * Only Dialog and Sheet add a scrim. Tooltip is the one exception:
 * it is a label, not a surface you act on, so it never lifts.
 * ------------------------------------------------------------------ */

function useDismiss(open: boolean, close: () => void) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) close();
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open, close]);
  return box;
}

/* ---------------------------- menu ---------------------------- */

export type MenuItem =
  | {
      kind?: "item";
      label: string;
      icon?: React.ReactNode;
      disabled?: boolean;
      state?: Tone;
      onSelect?: () => void;
      /**
       * The menu is a CHOICE, and this row is the one currently chosen.
       *
       * Set it and the row wears the kit's existing chosen treatment (`.tamga-option[data-selected]` —
       * wash plus a left rule, the same one the Select overlay uses) and reports itself as
       * `menuitemradio` / `aria-checked` instead of `menuitem`. Leave it undefined and the menu is
       * a list of ACTIONS, which is what most menus are — a plain `menuitem` with no state to
       * announce. The distinction is not decoration: a screen reader given six identical menu
       * items has no way to learn which language it is already in.
       */
      checked?: boolean;
    }
  | { kind: "separator" }
  | { kind: "label"; label: string };

export function DropdownMenu({
  trigger,
  items,
  align = "start",
  width = 200,
  loading = false,
  loadingRows = 4,
  openOnHover = false,
}: {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: "start" | "end";
  width?: number;
  /**
   * Opens when the pointer arrives, not only on click. TR: İşaretçi geldiğinde de açılır, yalnız
   * tıklamayla değil.
   *
   * FOR A MENU THAT IS THE ONLY THING IN ITS CORNER: an account avatar, a toolbar overflow. There
   * the hover costs nothing, because there is nothing beside it to open by accident.
   *
   * CLICK AND FOCUS STILL OPEN IT. Hover is an ADDITION, never the only way in: a touch screen
   * has no hover at all, and a keyboard reaches the trigger by focus. A menu that opens only on
   * hover is invisible to both. TR: Tıklama ve odak da açıyor. Hover bir EK, tek yol değil:
   * dokunmatik ekranda hover diye bir şey yok, klavye tetikleyiciye odakla geliyor. Yalnız
   * hover'da açılan bir menü ikisine de görünmez.
   */
  openOnHover?: boolean;
  /**
   * contents not in yet; the panel holds its shape instead of showing a spinner TR: içerik
   * henüz gelmedi; panel bir dönen simge göstermek yerine şeklini koruyor
   */
  loading?: boolean;
  /**
   * How many skeleton rows to hold while `loading`. TR: `loading` sürerken kaç iskelet satırı
   * tutulacağı.
   *
   * ZEVK DEĞERİ DEĞİL: gerçekten gelmekte olan kayıt sayısı, çünkü iskeletin bütün amacı kayıtlar
   * indiğinde panelin yeniden boyutlanmaması. Sayı çağıranın elinde: sayfa boyu, son sayfanın
   * kalanı, ya da menünün zaten bilinen öğe sayısı. Varsayılan 4 bir menüye uyuyor, bir listeye
   * değil; 4'te bırakılmış bir liste, tasarım kararı gibi görünen bir hatadır.
   */
  loadingRows?: number;
}) {
  const [open, setOpen] = useState(false);
  const box = useDismiss(open, () => setOpen(false));
  const close = useCallback(() => setOpen(false), []);
  const panel = useRef<HTMLDivElement>(null);
  useListKeys({ open: open && !loading, containerRef: panel, onClose: close });

  /* KAPANIŞ GECİKMELİ, ANINDA DEĞİL. Tetikleyici ile panel arasında birkaç
     piksellik bir boşluk var ve işaretçi oradan geçerken `pointerleave`
     tetikleniyor: menü tam üstüne gidilirken kapanıyordu. 120ms, o boşluğu
     geçmeye yeten ve "takılı kaldı" hissi vermeyen aralık. */
  const kapatmaSayaci = useRef<number | null>(null);
  const gecikmeliKapat = useCallback(() => {
    if (!openOnHover) return;
    kapatmaSayaci.current = window.setTimeout(() => setOpen(false), 120);
  }, [openOnHover]);
  const kapatmayiIptal = useCallback(() => {
    if (kapatmaSayaci.current !== null) {
      window.clearTimeout(kapatmaSayaci.current);
      kapatmaSayaci.current = null;
    }
  }, []);
  useEffect(() => () => kapatmayiIptal(), [kapatmayiIptal]);

  return (
    <div
      ref={box}
      className="relative inline-flex"
      onPointerEnter={
        openOnHover
          ? (e) => {
              /* YALNIZ FARE. Dokunmatik bir ekranda `pointerenter` dokunmayla
                 birlikte geliyor ve hemen ardından gelen `click` menüyü kapatıyor:
                 kullanıcı dokunuyor, menü açılıp anında kapanıyor. */
              if (e.pointerType !== "mouse") return;
              kapatmayiIptal();
              setOpen(true);
            }
          : undefined
      }
      onPointerLeave={openOnHover ? gecikmeliKapat : undefined}
    >
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open && (
        <div
          ref={panel}
          role="menu"
          className="tamga-overlay absolute top-[var(--overlay-below)] z-40 overflow-hidden py-1"
          style={{ width, [align === "end" ? "right" : "left"]: 0 }}
          aria-busy={loading || undefined}
        >
          {loading && <SkeletonOptions rows={loadingRows} />}
          {!loading && items.map((item, i) => {
            if (item.kind === "separator") {
              return <span key={i} className="my-1 block border-t border-line" />;
            }
            if (item.kind === "label") {
              return (
                <span key={i} className="tamga-label block px-4 py-2">
                  {item.label}
                </span>
              );
            }
            return (
              <button
                key={i}
                role={item.checked === undefined ? "menuitem" : "menuitemradio"}
                aria-checked={item.checked}
                data-selected={item.checked || undefined}
                data-tamga-option
                className="tamga-option"
                disabled={item.disabled}
                style={{
                  color: item.state ? toneOf(item.state).fg : undefined,
                  opacity: item.disabled ? 0.45 : undefined,
                  cursor: item.disabled ? "not-allowed" : undefined,
                }}
                onClick={() => {
                  item.onSelect?.();
                  setOpen(false);
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* --------------------------- popover --------------------------- */

export function Popover({
  trigger,
  title,
  children,
  footer,
  width = 288,
  align = "start",
  loading = false,
  loadingBlock,
  closeLabel,
}: {
  trigger: React.ReactNode;
  title?: string;
  /**
   * Accessible name for the close control, supplied by the caller (docs/08 rule 5). TR: Kapatma
   * kontrolünün erişilebilir adı, çağıran veriyor (docs/08 kural 5).
   */
  closeLabel: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
  align?: "start" | "end";
  /**
   * contents not in yet; the panel holds its shape instead of showing a spinner TR: içerik
   * henüz gelmedi; panel bir dönen simge göstermek yerine şeklini koruyor
   */
  loading?: boolean;
  /**
   * height of a leading block, if the panel's real body opens with one TR: panelin gerçek
   * gövdesi bir blokla açılıyorsa o baştaki bloğun yüksekliği
   */
  loadingBlock?: number;
}) {
  const [open, setOpen] = useState(false);
  const box = useDismiss(open, () => setOpen(false));

  return (
    <div ref={box} className="relative inline-flex">
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open && (
        <div
          className="tamga-overlay absolute top-[var(--overlay-below)] z-40"
          style={{ width, [align === "end" ? "right" : "left"]: 0 }}
          aria-busy={loading || undefined}
        >
          {title ? (
            <div className="tamga-head tamga-gutter tamga-section">
              <h4 className="text-control font-semibold">{title}</h4>
              <MiniButton className="ml-auto" aria-label={closeLabel} onClick={() => setOpen(false)}>
                <Icon icon={Close} size="xs" />
              </MiniButton>
            </div>
          ) : null}
          <div className="tamga-gutter py-4 text-small leading-relaxed">
            {loading ? <SkeletonPanel lines={3} block={loadingBlock} /> : children}
          </div>
          {footer ? (
            <div className="tamga-gutter flex justify-end gap-2 border-t border-line py-3">{footer}</div>
          ) : null}
        </div>
      )}
    </div>
  );
}

/* --------------------------- tooltip --------------------------- */

const placements = {
  top: "bottom-[var(--overlay-above)] left-1/2 -translate-x-1/2",
  bottom: "top-[var(--overlay-below)] left-1/2 -translate-x-1/2",
  left: "right-[var(--overlay-below)] top-1/2 -translate-y-1/2",
  right: "left-[var(--overlay-below)] top-1/2 -translate-y-1/2",
} as const;

/* A hard triangle cut with clip-path — no rotated square, no border to line up.
   Solid ink, square corners, same as the bubble it belongs to.

   The BOX turns with the arrow. It used to be 12×6 for all four placements, so the sideways ones
   were a 12-long spike where the vertical ones were a 12-wide wedge — the same clip-path in a box
   that had not been rotated with it. Every arrow is now a 12 base and a 6 rise, whichever way it
   points. */
const arrows = {
  top: {
    left: "50%", top: "100%", marginLeft: -6, width: 12, height: 6,
    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
  },
  bottom: {
    left: "50%", bottom: "100%", marginLeft: -6, width: 12, height: 6,
    clipPath: "polygon(50% 0, 0 100%, 100% 100%)",
  },
  left: {
    top: "50%", left: "100%", marginTop: -6, width: 6, height: 12,
    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
  },
  right: {
    top: "50%", right: "100%", marginTop: -6, width: 6, height: 12,
    clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
  },
} as const;

/**
 * KABARCIK `fixed`, `absolute` DEĞİL.
 *
 * Ölçülen hata: dar bir kenar çubuğunda ipucu hiç görünmüyordu. Sebep
 * `overflow`du — menü kaydırılabilir olduğu için (`overflow-y: auto`, ki yatayı
 * da `auto` yapıyor) ipucu doğuyor, çiziliyor ve kabın dışında kaldığı için
 * tamamen kırpılıyordu. Bu, kitin üç kez karşılaştığı aynı tuzağın üçüncü yüzü
 * (kart, ray, şimdi ipucu).
 *
 * Z-index çözmüyor: hiçbir yığın sırası bir `overflow` kırpmasını aşamaz.
 * Çözüm kabarcığı akıştan çıkarmak. `fixed` bir eleman en yakın kaydırma
 * kabına değil GÖRÜNTÜ ALANINA göre yerleşiyor, yani hiçbir kap onu kesemiyor.
 *
 * KONUM HOVER'DA ÖLÇÜLÜYOR, çünkü `fixed` bir elemanın CSS ile tetikleyiciye
 * hizalanmasının yolu yok. Ölçüm yalnız ipucu açılırken yapılıyor: kapalıyken
 * hiçbir maliyeti yok.
 */
export function Tooltip({
  label,
  placement = "bottom",
  children,
}: {
  label: string;
  placement?: keyof typeof placements;
  children: React.ReactNode;
}) {
  const sarmal = useRef<HTMLSpanElement>(null);
  const [konum, setKonum] = useState<{ left: number; top: number } | null>(null);

  const olc = useCallback(() => {
    const el = sarmal.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const bosluk = 8;
    const yerler = {
      top: { left: r.left + r.width / 2, top: r.top - bosluk },
      bottom: { left: r.left + r.width / 2, top: r.bottom + bosluk },
      left: { left: r.left - bosluk, top: r.top + r.height / 2 },
      right: { left: r.right + bosluk, top: r.top + r.height / 2 },
    } as const;
    setKonum(yerler[placement]);
  }, [placement]);

  const kapat = useCallback(() => setKonum(null), []);

  /* Kaydırma ya da yeniden boyutlanma ipucunun altından tetikleyiciyi çekiyor;
     o an kapanması, yanlış yerde durmasından iyi. */
  useEffect(() => {
    if (!konum) return;
    window.addEventListener("scroll", kapat, true);
    window.addEventListener("resize", kapat);
    return () => {
      window.removeEventListener("scroll", kapat, true);
      window.removeEventListener("resize", kapat);
    };
  }, [konum, kapat]);

  const kaydirma = {
    top: "translate(-50%, -100%)",
    bottom: "translate(-50%, 0)",
    left: "translate(-100%, -50%)",
    right: "translate(0, -50%)",
  } as const;

  return (
    <span
      ref={sarmal}
      className="relative inline-flex"
      onPointerEnter={olc}
      onPointerLeave={kapat}
      onFocusCapture={olc}
      onBlurCapture={kapat}
    >
      {children}
      {konum && (
        <span
          role="tooltip"
          className="pointer-events-none fixed z-40 whitespace-nowrap px-2 py-1 text-small"
          style={{
            left: konum.left,
            top: konum.top,
            transform: kaydirma[placement],
            background: "var(--color-ink)",
            color: "var(--color-page)",
            borderRadius: "var(--radius-ctl)",
          }}
        >
          {label}
          <span
            aria-hidden
            className="absolute block"
            style={{ background: "var(--color-ink)", ...arrows[placement] }}
          />
        </span>
      )}
    </span>
  );
}

/* ---------------------------- toast ---------------------------- */

export type ToastTone = Tone;

export function Toast({
  tone = "neutral",
  title,
  description,
  action,
  onDismiss,
  dismissLabel,
}: {
  tone?: ToastTone;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onDismiss?: () => void;
  /**
   * Accessible name for the dismiss control, supplied by the caller (docs/08 rule 5). TR:
   * Kapatma kontrolünün erişilebilir adı, çağıran veriyor (docs/08 kural 5).
   */
  dismissLabel: string;
}) {
  const mark = tone === "neutral" ? "var(--color-ink)" : toneOf(tone).mark;
  return (
    <div
      role="status"
      className="tamga-toast tamga-overlay flex w-80 items-start gap-4 p-4"
      style={{ animation: "tamga-toast-in var(--duration-base) var(--ease-standard) both" }}
    >
      <span className="mt-1 size-2.5 shrink-0" style={{ background: mark }} />
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium text-ink">{title}</p>
        {description ? (
          <p className="mt-1 text-small leading-relaxed text-ink-faint">{description}</p>
        ) : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
      {onDismiss ? (
        <MiniButton onClick={onDismiss} aria-label={dismissLabel}>
          <Icon icon={Close} size="xs" />
        </MiniButton>
      ) : null}
    </div>
  );
}

/**
 * Where toasts land. Top-right is the default: it is the one corner that
 * never covers a table's actions column or a form's footer buttons.
 */
const corners = {
  "top-right": "top-6 right-6 items-end",
  "top-left": "top-6 left-6 items-start",
  "bottom-right": "bottom-6 right-6 items-end",
  "bottom-left": "bottom-6 left-6 items-start",
} as const;

export function ToastViewport({
  position = "top-right",
  children,
}: {
  position?: keyof typeof corners;
  children: React.ReactNode;
}) {
  return (
    <div className={`pointer-events-none fixed z-50 flex flex-col gap-2 ${corners[position]}`}>
      <div className="pointer-events-auto flex flex-col gap-2">{children}</div>
    </div>
  );
}

/* ---------------------------- dialog --------------------------- */

/**
 * The modal shell. Hooks cannot run behind an early return, so the trap lives
 * here and the surface below stays a plain component.
 */
/**
 * Diyalog genişliği. Bir VARYANT, ayrı bir bileşen değil (kitin kuralı: adı
 * bölünen şey bileşen, ayarlanan şey prop).
 *
 * `wide` bir ÖNİZLEME için var: bir bloğu ya da tam bir ekran şablonunu 448
 * pikselde göstermek, gösterdiğini gizlemek olur. `md` hâlâ varsayılan, çünkü
 * bir diyaloğun asıl işi bir KARAR sormak ve geniş bir karar kutusu, kararı
 * daha kolay yapmıyor.
 *
 * `full` BİR ÇALIŞMA YÜZEYİ için: bir görsel düzenleyici, bir tuval, bir harita
 * seçici. Bunlar bir karar kutusu değil bir EKRAN, ve `wide` bile onlara az
 * geliyor — kalan kenar boşluğu tuvalden çalınan alan. Bu boyutta panelin
 * kenarı, yarıçapı ve kaydırma gölgesi de kalkıyor: yükseltilecek bir zemin
 * kalmadığında yükselme işareti de anlamsız. Nadir olması gerekiyor; bir formu
 * tam ekran açmak, formu daha kolay doldurmuyor.
 */
const DIALOG_GENISLIK = {
  md: "max-w-md",
  lg: "max-w-3xl",
  wide: "max-w-(--dialog-wide)",
  full: "max-w-none",
} as const;

export type DialogSize = keyof typeof DIALOG_GENISLIK;

function DialogShell({
  open,
  onClose,
  loading,
  label,
  size = "md",
  children,
}: {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  /** the accessible name — a dialog announced without one is just "dialog" */
  label: string;
  size?: DialogSize;
  children: React.ReactNode;
}) {
  const panel = useFocusTrap<HTMLDivElement>(open);
  /* Aynı kaçak `Dialog`da da vardı: odak hapsediliyor ama arkadaki sayfa
     kayıyordu. Kullanıcı etkileşemediği bir şeyi kaydırabiliyordu. */
  useScrollLock(open);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;
  /* Tam ekranda dış kenar boşluğu YOK: 24 piksel, bir tuvalden çalınan 24
     pikseldir. Panel de yüzeyi kaplıyor ve dikey bir akış oluyor, ki gövde
     kendi içinde kaysın ve başlık ile ayak yerinde kalsın. */
  const tam = size === "full";
  return (
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center", tam ? "p-0" : "p-6")}
      role="dialog"
      aria-modal
      aria-label={label}
    >
      {/* mouse affordance only: Escape and the Close button already cover the
            keyboard, and leaving this in the a11y tree gave the panel two
            controls both announced as "Close" */}
        <div className="tamga-scrim absolute inset-0" aria-hidden onClick={onClose} />
      <div
        ref={panel}
        className={cn(
          "tamga-overlay relative z-10 w-full",
          tam && "tamga-overlay-full",
          DIALOG_GENISLIK[size],
        )}
        aria-busy={loading || undefined}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Yıkıcı bir eylemin önündeki kapı.
 *
 * NEDEN AYRI BİR BİLEŞEN. `Dialog` zaten var ve bu onun üstüne kurulu; ama
 * "emin misin" diyaloğu her seferinde elle kurulduğunda üç şey kayıyor ve
 * üçü de güvenlikle ilgili:
 *
 *   1. ONAY DÜĞMESİ FİİLİ TAŞIR, "Tamam"ı değil. Bir kullanıcı diyaloğun
 *      metnini okumadan düğmeye basar; okuduğu tek şey düğmenin üstündeki
 *      kelimedir. "Tamam" hiçbir şey söylemez, "Sil" söyler.
 *   2. ODAK VAZGEÇ'TE AÇILIR. Yıkıcı bir diyalogda odağın onay düğmesinde
 *      olması, Enter'a basan birinin kaydı silmesi demek. Güvenli olan
 *      varsayılan olmalı.
 *   3. GERİ ALINAMAZLIK YAZILIR. Gövde metni ne olacağını değil NEYİN GERİ
 *      GELMEYECEĞİNİ söyler; kullanıcının kararı buna bağlı.
 *
 * KELİMELER ÇAĞIRANIN. Kit hiçbir dil bilmiyor: başlık, gövde ve iki düğmenin
 * etiketi dışarıdan geliyor.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel,
  cancelLabel,
  closeLabel,
  tone = "danger",
  busy = false,
  confirmDisabled = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  /**
   * The VERB of the thing that will happen: "Delete", "Unpublish". Never "OK". TR: Yapılacak
   * işin FİİLİ: "Sil", "Yayından kaldır". Asla "Tamam".
   */
  confirmLabel: string;
  cancelLabel: string;
  closeLabel: string;
  /**
   * `danger` an irreversible loss, `primary` a step that only asks for attention. TR: `danger`
   * geri alınamaz bir kayıp, `primary` yalnızca dikkat isteyen bir adım.
   */
  tone?: "danger" | "primary";
  /**
   * While the operation runs: both buttons lock, so nothing is submitted twice. TR: İşlem
   * sürerken: iki düğme de kilitleniyor, çift gönderim olmuyor.
   */
  busy?: boolean;
  /**
   * Disables the confirm button: the dialog OPENS but the action cannot be taken. WHY IT IS
   * NEEDED. Some destructive actions have a precondition ("a customer with orders cannot be
   * deleted") and that condition is only known by looking at the record. There are two ways:
   * let the click through and take an error from the server, or write the rule in the dialog
   * and close the confirm. The second does not spend the user's time and TEACHES the rule. The
   * body text has to say the reason; a disabled button is not a reason on its own. TR: Onay
   * düğmesini kapatır: diyalog AÇILIR ama işlem yapılamaz. NEDEN GEREKLİ. Bazı yıkıcı
   * işlemlerin bir ön koşulu var ("siparişi olan müşteri silinemez") ve o koşul ancak kayda
   * bakınca bilinir. İki yol var: düğmeyi tıklatıp sunucudan hata almak, ya da kuralı diyalogda
   * yazıp onayı kapatmak. İkincisi kullanıcının zamanını almıyor ve kuralı ÖĞRETİYOR. Gövde
   * metni sebebi söylemek zorunda; kapalı bir düğme tek başına sebep değildir.
   */
  confirmDisabled?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      closeLabel={closeLabel}
      footer={
        <>
          {/* VAZGEÇ ÖNCE VE ODAKTA. Sırası da bilinçli: yıkıcı düğme en sağda,
              yani farenin "ileri" yönünde değil. */}
          <Button type="button" onClick={onClose} disabled={busy} data-autofocus>
            {cancelLabel}
          </Button>
          <Button variant={tone} onClick={onConfirm} disabled={busy || confirmDisabled}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Dialog>
  );
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  loading = false,
  closeLabel,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * contents not in yet; the panel holds its shape instead of showing a spinner TR: içerik
   * henüz gelmedi; panel bir dönen simge göstermek yerine şeklini koruyor
   */
  loading?: boolean;
  /**
   * Accessible name for the close control, supplied by the caller (docs/08 rule 5). TR: Kapatma
   * kontrolünün erişilebilir adı, çağıran veriyor (docs/08 kural 5).
   */
  closeLabel: string;
  /**
   * `md` decides, `lg` decides with a table beside it, `wide` previews a whole screen, `full` is a
   * work surface (an image editor, a canvas). TR: `md` karar sorar, `lg` kararın yanında bir tablo
   * taşır, `wide` tam bir ekranı önizler, `full` ise bir çalışma yüzeyidir (görsel düzenleyici,
   * tuval).
   */
  size?: DialogSize;
}) {
  return (
    <DialogShell open={open} onClose={onClose} loading={loading} label={title} size={size}>
      <div className="tamga-head tamga-gutter tamga-section">
        <h3 className="text-subhead font-semibold">{title}</h3>
        <MiniButton onClick={onClose} aria-label={closeLabel} className="ml-auto">
          <Icon icon={Close} size="xs" />
        </MiniButton>
      </div>
      <div
        className={cn(
          "tamga-gutter py-6 text-body leading-relaxed",
          size === "full" && "min-h-0 flex-1 overflow-y-auto",
        )}
      >
        {loading ? <SkeletonPanel lines={4} /> : children}
      </div>
      {footer ? (
        <div className="tamga-gutter flex justify-end gap-2 border-t border-line py-4">{footer}</div>
      ) : null}
    </DialogShell>
  );
}
