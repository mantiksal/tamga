"use client";

import { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from "react";
import type { Tone } from "./tone.js";
import { toneOf } from "./tone.js";
import { Icon } from "./icon.js";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Close } from "./icons.js";
import { SkeletonOptions, SkeletonPanel } from "./skeleton.js";
import { Kbd } from "./display.js";
import { Button } from "./button.js";
import { useDismiss, useFocusTrap, useListKeys } from "./a11y.js";
import { MiniButton } from "./button.js";
import { useScrollLock } from "../lib/scroll-lock.js";

/**
 * Katman düzlemi · 6 piksel, sayfanın ulaşabildiği 4 pikselin ötesi. Perde
 * yalnız `Dialog` ve `Sheet`te; `Tooltip` bir etiket, hiç yükselmiyor.
 *
 * Gerekçe: docs/gerekce/07-katman-ve-diyalog.md
 */

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
       * Menü bir SEÇİM ve bu satır seçili olan: satır `menuitem` değil
       * `menuitemradio` bildiriliyor. Verilmezse menü bir eylem listesi.
       * Gerekçe: docs/gerekce/07-katman-ve-diyalog.md
       */
      checked?: boolean;
      /**
       * The keyboard shortcut that runs the same command, drawn on the right as a `Kbd`. It does
       * NOT bind the key: a menu that binds a global shortcut would fight the page that already
       * has one. TR: Aynı komutu çalıştıran klavye kısayolu, sağda `Kbd` olarak çiziliyor. Tuşu
       * BAĞLAMIYOR: global bir kısayolu menünün bağlaması, zaten bağlayan sayfayla çakışırdı.
       */
      shortcut?: string;
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
  defaultOpen = false,
  ...rest
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
   * Starts open. For a DOCUMENTATION surface, where the point is to show what the panel looks
   * like, not to keep a corner tidy. TR: Açık başlıyor. Menünün nasıl göründüğünü GÖSTERMEK için
   * duran bir yüzey için · bir köşeyi toplu tutmak için değil.
   *
   * NOT FOR A PRODUCT SCREEN: a menu that is open before anyone asked for it covers the content
   * under it and has no reason to be there. TR: ÜRÜN EKRANINDA KULLANILMAZ: kimse istemeden açık
   * duran bir menü altındaki içeriği örtüyor ve orada durmasının bir sebebi yok.
   */
  defaultOpen?: boolean;
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
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const [open, setOpen] = useState(defaultOpen);
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
{...dataProps(rest)}
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
          className="tamga-overlay tamga-menu absolute top-[var(--overlay-below)] z-40 overflow-hidden"
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
                <span key={i} className="tamga-menu-baslik">
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
                <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                {item.shortcut ? <Kbd className="ml-auto shrink-0">{item.shortcut}</Kbd> : null}
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
  ...rest
}: {
  trigger: React.ReactNode;
  title?: string;
  /**
   * Given, a quiet close control appears in the corner · and without it there is none, which is
   * the panel's normal shape: a popover is dismissed by Escape or by clicking away, and a dialog
   * is the thing that must be closed deliberately. TR: Verilirse köşede sessiz bir kapatma
   * kontrolü beliriyor · verilmezse yok, ve panelin olağan hâli bu: bir popover Escape ile ya da
   * dışına tıklayınca kapanıyor, bilerek kapatılması gereken şey diyalog.
   */
  closeLabel?: string;
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
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const [open, setOpen] = useState(false);
  const box = useDismiss(open, () => setOpen(false));

  return (
    <div {...dataProps(rest)} ref={box} className="relative inline-flex">
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open && (
        <div
          className="tamga-overlay tamga-pop absolute top-[var(--overlay-below)] z-40"
          style={{ width, [align === "end" ? "right" : "left"]: 0 }}
          aria-busy={loading || undefined}
        >
          {/* Ok tetikleyicinin hizasında, panelin ortasında değil: panel 288px
              ve tetikleyici çoğu zaman ondan dar · ortadan çıkan bir ok neyin
              altından çıktığını göstermek yerine boşluğu işaret ediyor. */}
          <span
            aria-hidden
            className="tamga-pop-ok"
            style={{ [align === "end" ? "right" : "left"]: 22 }}
          />
          {/* BAŞLIK BİR ŞERİT DEĞİL BİR SATIR. Panel bir kart gibi çiziliyordu:
              zeminli bir başlık şeridi, altında kural, altta ikinci bir kural ·
              288 piksellik bir kutuda üç yatay çizgi, içeriği değil kutunun
              kendisini gösteriyordu. Tasarımın paneli dolgulu tek bir yüzey. */}
          {title ? <strong className="text-control font-semibold text-ink">{title}</strong> : null}
          <div className="text-small leading-relaxed">
            {loading ? <SkeletonPanel lines={3} block={loadingBlock} /> : children}
          </div>
          {footer ? <div className="flex justify-end gap-2.5">{footer}</div> : null}
          {closeLabel ? (
            <button
              type="button"
              className="tamga-icon-btn tamga-icon-btn-sm tamga-icon-btn-ghost absolute top-2 right-2"
              aria-label={closeLabel}
              onClick={() => setOpen(false)}
            >
              <Icon icon={Close} size="xs" />
            </button>
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

/* Sert üçgen `clip-path` ile: döndürülmüş kare yok, hizalanacak kenarlık yok.
   KUTU OKLA BİRLİKTE DÖNER · her ok 12 taban, 6 yükseklik, hangi yöne bakarsa.
   Gerekçe: docs/gerekce/07-katman-ve-diyalog.md */
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
 * İpucu · kabarcık `fixed`, `absolute` DEĞİL: kaydırılabilir bir kabın
 * `overflow`u onu kırpıyordu, ve z-index bir kırpmayı aşamaz. Bedeli konumun
 * açılışta ölçülmesi; kapalıyken maliyeti yok.
 *
 * Gerekçe: docs/gerekce/07-katman-ve-diyalog.md
 */
export function Tooltip({
  label,
  placement = "bottom",
  delay = 400,
  bind = true,
  children,
  ...rest
}: {
  label: string;
  placement?: keyof typeof placements;
  /**
   * How long the pointer has to rest before the bubble opens, in ms. Keyboard focus opens it
   * immediately: someone who tabbed here asked for it. `0` opens on contact, for a dense toolbar
   * where the labels are the only thing naming the icons. TR: Kabarcığın açılması için işaretçinin
   * ne kadar beklemesi gerektiği, ms. Klavye odağı ANINDA açıyor: buraya Tab'layan kişi zaten
   * istemiş. `0`, değince açıyor · etiketlerin ikonları adlandıran tek şey olduğu sık bir araç
   * çubuğu için.
   */
  delay?: number;
  /**
   * Ties the label to the trigger with `aria-describedby`. Turn it OFF when the trigger's
   * accessible name is already this same text (an icon rail item whose `aria-label` is the
   * label): a screen reader would then read it twice, once as the name and once as the
   * description. TR: Etiketi tetikleyiciye `aria-describedby` ile bağlar. Tetikleyicinin
   * erişilebilir adı zaten aynı metinse KAPAT: ikon rayının `aria-label`i etiketin kendisiyse,
   * ekran okuyucu metni iki kez okuyor · bir kez ad, bir kez açıklama olarak.
   */
  bind?: boolean;
  children: React.ReactNode;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const sarmal = useRef<HTMLSpanElement>(null);
  const [konum, setKonum] = useState<{ left: number; top: number } | null>(null);
  const id = useId();
  const bekleyen = useRef<number | null>(null);

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

  const kapat = useCallback(() => {
    if (bekleyen.current !== null) {
      clearTimeout(bekleyen.current);
      bekleyen.current = null;
    }
    setKonum(null);
  }, []);

  /* FARE BEKLİYOR, KLAVYE BEKLEMİYOR. Gecikmesiz bir ipucu, ekranı geçen
     farenin arkasında sıra sıra kabarcık açıyor; Tab'la gelen kişi ise onu
     bilerek istedi.
     Gerekçe: docs/gerekce/07-katman-ve-diyalog.md */
  const gecikmeliAc = useCallback(() => {
    if (delay <= 0) {
      olc();
      return;
    }
    if (bekleyen.current !== null) clearTimeout(bekleyen.current);
    bekleyen.current = window.setTimeout(() => {
      bekleyen.current = null;
      olc();
    }, delay);
  }, [delay, olc]);

  useEffect(() => () => {
    if (bekleyen.current !== null) clearTimeout(bekleyen.current);
  }, []);

  /* Kaydırma ya da yeniden boyutlanma ipucunun altından tetikleyiciyi çekiyor;
     o an kapanması, yanlış yerde durmasından iyi. */
  useEffect(() => {
    if (!konum) return;
    /* Esc bir ipucunu da kapatır: ekranı kapatan kabarcık, klavye kullanan
       biri için bir engel · ve odak tetikleyicide kaldığı için başka çıkışı
       yok. */
    const esc = (e: KeyboardEvent) => e.key === "Escape" && kapat();
    window.addEventListener("scroll", kapat, true);
    window.addEventListener("resize", kapat);
    document.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("scroll", kapat, true);
      window.removeEventListener("resize", kapat);
      document.removeEventListener("keydown", esc);
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
{...dataProps(rest)}
      ref={sarmal}
      className="relative inline-flex"
      onPointerEnter={gecikmeliAc}
      onPointerLeave={kapat}
      onFocusCapture={olc}
      onBlurCapture={kapat}
    >
      {/* ETİKET HER ZAMAN DOM'DA, görünür kabarcık ise yalnız açıkken. İpucu
          `aria-describedby` ile bağlanıyor ve bağın hedefi kaybolan bir eleman
          olamaz: okuyucu odak anında okumaya çalışıyor, kabarcık ise o an
          henüz açılmamış olabiliyor. Görünen kopya `aria-hidden`, yani metin
          iki kez okunmuyor. */}
      {bind ? (
        <span id={id} className="sr-only">
          {label}
        </span>
      ) : null}
      {bind && isValidElement(children)
        ? cloneElement(children as React.ReactElement<{ "aria-describedby"?: string }>, {
            "aria-describedby": id,
          })
        : children}
      {konum && (
        <span
          aria-hidden
          className="pointer-events-none fixed z-40 whitespace-nowrap px-2 py-1 text-small"
          style={{
            left: konum.left,
            top: konum.top,
            transform: kaydirma[placement],
            background: "var(--color-ink)",
            color: "var(--color-page)",
            /* KENDİ KENARI VAR. Kenarsız koyu bir kutu, koyu temada sayfadan
               ayrılmıyordu: iki koyu yüzey üst üste. `edge-strong` iki temada
               da koyu kaldığı için sınır her ikisinde de duruyor. */
            border: "1.5px solid var(--color-edge-strong)",
            borderRadius: "calc(var(--radius) - 1px)",
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
  duration,
  ...rest
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
  /**
   * How long it stays, in ms. Unset, it derives: 5000, or 8000 when there is an `action`, because
   * "Undo" has to be readable AND reachable before it goes. `0` keeps it until dismissed, for the
   * rare notice that must be acknowledged. The timer needs `onDismiss`: without it the kit has no
   * way to remove the toast. TR: Ne kadar durduğu, ms. Verilmezse türüyor: 5000, `action` varsa
   * 8000 · "Geri al" gitmeden önce hem OKUNABİLMELİ hem ULAŞILABİLMELİ. `0`, kapatılana kadar
   * duruyor · onaylanması gereken ender bildirim için. Sayaç `onDismiss` istiyor: onsuz kitin
   * bildirimi kaldırmak için bir yolu yok.
   */
  duration?: number;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  /* ÜSTÜNE GELİNCE SAYAÇ DURUYOR. Okumak için üstüne gelen kişiden bildirimi
     kaçırmak, bu bileşenin yapabileceği en can sıkıcı şey · ve "Geri al"
     düğmesine uzanan fare tam oradan geçiyor. Klavye odağı da durduruyor.
     Gerekçe: docs/gerekce/07-katman-ve-diyalog.md */
  const sure = duration ?? (action ? 8000 : 5000);
  const kapat = useRef(onDismiss);
  kapat.current = onDismiss;
  const sayac = useRef<number | null>(null);
  const bitis = useRef(0);
  const kalan = useRef(sure);

  const baslat = useCallback((ms: number) => {
    if (!kapat.current || ms <= 0) return;
    bitis.current = Date.now() + ms;
    sayac.current = window.setTimeout(() => kapat.current?.(), ms);
  }, []);

  const durdur = useCallback(() => {
    if (sayac.current === null) return;
    clearTimeout(sayac.current);
    sayac.current = null;
    kalan.current = Math.max(0, bitis.current - Date.now());
  }, []);

  useEffect(() => {
    kalan.current = sure;
    baslat(sure);
    return () => {
      if (sayac.current !== null) clearTimeout(sayac.current);
      sayac.current = null;
    };
  }, [sure, baslat]);

  /* NÖTR RENK ALMIYOR, VE BU ÖLÇEĞİN KURALI: renk taşımayarak anlam taşıyan tek
     ton o. Renkli değişkenler tanımsız bırakılıyor, CSS yedeğe düşüyor. */
  /* İŞARET TERS YÜZEYİN MÜREKKEBİNDEN. Bildirim iki temada da koyu, yani
     `mark` (açık zemin için üretilmiş) burada okunmuyor: ölçüm kritik için
     2.79, bilgi için 1.99 · grafik ögeleri için geçerli 3:1 eşiğinin altında.
     `inverse` o yüzey için üretilmiş olan (8.1-10.5). */
  const t = tone === "neutral" ? null : toneOf(tone);
  const mark = t ? t.inverse : "var(--color-inverse-ink)";
  return (
    <div
{...dataProps(rest)}
      /* `alert` YALNIZ `danger`DA: assertive bir bölge, ekran okuyucunun o an
         okuduğu cümleyi KESİYOR. Bir kayıt onayı için bu bedel fazla, bir
         başarısız ödeme için değil. */
      role={tone === "danger" ? "alert" : "status"}
      onPointerEnter={durdur}
      onPointerLeave={() => baslat(kalan.current)}
      onFocusCapture={durdur}
      onBlurCapture={() => baslat(kalan.current)}
      className="tamga-toast flex w-full max-w-80 items-start gap-3 py-2.5 pr-2.5 pl-3.5"
      style={
        {
          animation: "tamga-toast-in var(--duration-base) var(--ease-standard) both",
        } as React.CSSProperties
      }
    >
      <span className="tamga-toast-mark mt-1 size-2.5 shrink-0" style={{ background: mark }} />
      <div className="min-w-0 flex-1">
        <p className="text-body font-semibold">{title}</p>
        {/* GÖVDE DE TERS MÜREKKEPTE, yalnız biraz sönük. Kutunun rengini
            `.tamga-toast` veriyor; buraya bir `text-ink` yazmak, onu sayfanın
            temasına geri bağlardı. */}
        {description ? (
          <p className="mt-1 text-small leading-relaxed opacity-80">{description}</p>
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
  ...rest
}: {
  position?: keyof typeof corners;
  children: React.ReactNode;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <div {...dataProps(rest)} className={`pointer-events-none fixed z-50 flex flex-col gap-2 ${corners[position]}`}>
      {/* GENİŞLİK KABIN KARARI: 320 piksel burada veriliyor, bildirimin kendinde
          değil. Gerekçe: docs/gerekce/07-katman-ve-diyalog.md */}
      <div className="tamga-toast-stack pointer-events-auto flex flex-col gap-2">{children}</div>
    </div>
  );
}

/* ---------------------------- dialog --------------------------- */

/**
 * Diyalog genişliği · bir varyant, ayrı bileşen değil. `full` panelin
 * kenarını, yarıçapını ve gölgesini de kaldırıyor: yükseltilecek zemin
 * kalmıyor.
 *
 * Gerekçe: docs/gerekce/07-katman-ve-diyalog.md
 */
const DIALOG_GENISLIK = {
  md: "max-w-md",
  lg: "max-w-3xl",
  wide: "max-w-(--dialog-wide)",
  full: "max-w-none",
} as const;

export type DialogSize = keyof typeof DIALOG_GENISLIK;

/**
 * Kipli kabuk. Hook'lar erken bir `return`un arkasında çalışamaz, bu yüzden
 * tuzak burada duruyor ve alttaki yüzey düz bir bileşen kalıyor.
 */
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
      {/* Yalnız fare için: Escape ile Kapat düğmesi klavyeyi karşılıyor, ve bu
          a11y ağacında kalınca panel "Kapat" diye bildirilen iki kontrol oluyordu. */}
        <div className="tamga-scrim tamga-scrim-in absolute inset-0" aria-hidden onClick={onClose} />
      <div
        ref={panel}
        /* PANEL EKRANDAN TAŞAMAZ: `max-h-full` + `flex-col` + `overflow-hidden`.
           Yoksa uzun içerik ortalanıp başlıkla kapatma düğmesini kırpıyor.
           Gerekçe: docs/gerekce/07-katman-ve-diyalog.md */
        className={cn(
          "tamga-overlay tamga-dialog-in relative z-10 flex max-h-full w-full flex-col overflow-hidden",
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
 * Yıkıcı bir eylemin önündeki kapı · üç güvenlik kuralını tek yerde tutuyor:
 * onay düğmesi FİİLİ taşır, odak VAZGEÇ'te açılır, gövde metni geri
 * alınamazlığı yazar.
 *
 * Gerekçe: docs/gerekce/07-katman-ve-diyalog.md
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
  ...rest
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
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <DialogShell open={open} onClose={onClose} loading={loading} label={title} size={size}>
      <div {...dataProps(rest)} className="tamga-head tamga-gutter tamga-section shrink-0">
        <h3 className="text-subhead font-semibold">{title}</h3>
        <MiniButton onClick={onClose} aria-label={closeLabel} className="ml-auto">
          <Icon icon={Close} size="xs" />
        </MiniButton>
      </div>
      {/* KAYAN YER GÖVDE, panelin kendisi değil: başlık ve ayak yerinde
          kalmalı, çünkü kapatma düğmesi başlıkta ve kararı veren düğmeler
          ayakta. Bu kural bir süre yalnız `full` boyuna yazılmıştı ve öteki
          üç boy sessizce pencereden taşıyordu. */}
      <div className="tamga-gutter min-h-0 flex-1 overflow-y-auto py-6 text-body leading-relaxed">
        {loading ? <SkeletonPanel lines={4} /> : children}
      </div>
      {footer ? (
        <div className="tamga-gutter flex shrink-0 justify-end gap-2 border-t border-line py-4">
          {footer}
        </div>
      ) : null}
    </DialogShell>
  );
}
