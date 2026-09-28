"use client";

import { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from "react";
import type { Tone } from "./tone.js";
import type { IconGlyph } from "./icons.js";
import { toneOf } from "./tone.js";
import { Icon } from "./icon.js";
import { CaretRight, Check, Close, Failure, Info, Success, Warning } from "./icons.js";
import { SkeletonOptions, SkeletonPanel } from "./skeleton.js";
import { useScrollLock } from "../lib/scroll-lock.js";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { useFocusTrap, useListKeys } from "./a11y.js";
import { useLiveClaim } from "./live-scope.js";
import { Button, MiniButton } from "./button.js";

export { Spinner } from "./spinner.js";

/* ------------------------------------------------------------------ *
 * Small primitives. Each one is the design language applied, not a new
 * idea — if a component here needs a rule that Foundations does not
 * already state, the rule is missing, not the component.
 * ------------------------------------------------------------------ */

export function Separator({
  vertical = false,
  look = "plain",
  label,
  ...rest
}: {
  vertical?: boolean;
  /**
   * `plain` the quiet rule between two rows, `dashed` a provisional one (a forecast row, the
   * end of a draft), `strong` the one that separates two SECTIONS and therefore takes the edge
   * colour rather than the line colour. TR: `plain` iki satır arasındaki sessiz kural, `dashed`
   * geçici olan (tahmin satırı, taslağın sonu), `strong` iki BÖLÜMÜ ayıran · bu yüzden çizgi
   * rengini değil kenar rengini alıyor.
   */
  look?: "plain" | "dashed" | "strong";
  /**
   * A word in the middle of the rule ("or"). It makes the separator a CHOICE rather than a
   * break, which is the only reason to put a word on a line. TR: Kuralın ortasındaki sözcük
   * ("veya"). Ayracı bir kesinti değil bir SEÇİM yapıyor, ve bir çizginin üstüne sözcük
   * koymanın tek sebebi de bu.
   */
  label?: string;
  [k: `data-${string}`]: unknown;
}) {
  if (label && !vertical) {
    return (
      <span {...dataProps(rest)} className="tamga-rule-etiket" role="separator" aria-label={label}>
        <span className="tamga-rule-h" />
        <span className="tamga-rule-yazi">{label}</span>
        <span className="tamga-rule-h" />
      </span>
    );
  }
  /* Sınıf adları açık yazılıyor, şablonla üretilmiyor: `check-kit-class`
     şablon içindeki adı çözemiyor ve tanımsız sanıyor. */
  const sinif = vertical
    ? "tamga-rule-v"
    : look === "dashed"
      ? "tamga-rule-dashed"
      : look === "strong"
        ? "tamga-rule-strong"
        : "tamga-rule-h";
  return <span {...dataProps(rest)} className={sinif} role="separator" />;
}

/** Running is not a deviation, so the live mark stays neutral — the pulse carries it. */
export function Beacon({
  live = true,
  label,
  look = "pulse",
  state = "neutral",
  edged = false,
  severity = 50,
  ...rest
}: {
  live?: boolean;
  label?: string;
  /**
   * `pulse` the mark breathing in place: a STATE (it is live, it is streaming). `ping` a ring
   * expanding out of it: a CALL ("a new thing is here, look"), which is what the design attaches
   * to a control's corner. TR: `pulse` işaretin yerinde nefes alması · bir DURUM (canlı, akıyor).
   * `ping` içinden dışarı genişleyen halka · bir ÇAĞRI ("yeni bir şey var, bak"), ve tasarım
   * bunu bir kontrolün köşesine iliştiriyor.
   */
  look?: "pulse" | "ping";
  /**
   * The mark's colour. `neutral` by default and on purpose: running is not a deviation, so a
   * live mark carries no status colour · the pulse is what says "live". TR: İşaretin rengi.
   * Varsayılanı `neutral`, ve bilerek: çalışmak bir sapma değil, yani canlı bir işaret durum
   * rengi taşımıyor · "canlı" diyen şey nabzın kendisi.
   */
  state?: Tone;
  /**
   * For a mark that sits ON a control (a button's corner). It grows a step and takes the pressed
   * edge, and its fill turns into the tone's wash: a solid square touching a button's own edge
   * reads as part of that edge. TR: Bir KONTROLÜN üstünde duran işaret için (bir düğmenin
   * köşesi). Bir basamak büyüyor ve basılan kenarı alıyor, dolgusu da tonun yıkamasına dönüyor:
   * düğmenin kendi kenarına değen dolu bir kare, o kenarın parçası gibi okunuyor.
   */
  edged?: boolean;
  /**
   * a bare beacon outranks nothing in particular; give it a rank to compete TR: çıplak bir
   * işaret hiçbir şeye üstün gelmez; yarışması için ona bir sıra verin
   */
  severity?: number | null;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const pulses = useLiveClaim(live ? severity : null);
  const h = toneOf(state);
  return (
    <span {...dataProps(rest)} className="inline-flex items-center gap-2">
      <span
        className={`tamga-mark tamga-beacon ${edged ? "tamga-beacon-edged" : ""} ${
          look === "ping" && pulses ? "tamga-beacon-ping" : ""
        }`}
        data-live={look === "pulse" && pulses}
        style={
          state === "neutral" && !edged ? undefined : { background: edged ? h.bg : h.mark }
        }
      />
      {label ? <span className="text-small text-ink-faint">{label}</span> : null}
    </span>
  );
}

/* Tonun glifi · dört geri bildirim işareti, tonun kendisinden türüyor.
   Çağıran ayrıca vermek zorunda değil: aynı ton her ekranda aynı glifi
   taşımalı, yoksa "uyarı" bir sayfada üçgen, ötekinde ünlem oluyor. */
const TON_GLIFI: Record<Tone, IconGlyph> = {
  neutral: Info,
  info: Info,
  positive: Success,
  caution: Warning,
  elevated: Warning,
  danger: Failure,
};

export function Alert({
  state = "caution",
  title,
  icon,
  children,
  action,
  onDismiss,
  dismissLabel,
  ...rest
}: {
  state?: Tone;
  title: string;
  /**
   * Called when the reader dismisses it. Given, a close control appears at the end of the row.
   * An alert WITHOUT it is a standing condition the reader cannot clear; with it, a message
   * they have finished with. TR: Okuyan kapattığında çağrılıyor. Verilirse satırın sonunda bir
   * kapatma kontrolü beliriyor. Onsuz uyarı, okuyanın kaldıramadığı duran bir koşul; onunla,
   * işi bitmiş bir mesaj.
   */
  onDismiss?: () => void;
  /** The close control's accessible name. Required with `onDismiss`. TR: Kapatma kontrolünün erişilebilir adı. `onDismiss` ile zorunlu. */
  dismissLabel?: string;
  /**
   * Overrides the tone's own glyph. Rarely needed: the same tone should carry the same glyph on
   * every screen. TR: Tonun kendi glifinin yerine geçiyor. Nadiren gerekiyor: aynı ton her
   * ekranda aynı glifi taşımalı.
   */
  icon?: IconGlyph;
  children?: React.ReactNode;
  action?: React.ReactNode;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const h = toneOf(state);
  return (
    /* TON ZEMİNDE, SOL ÇİZGİDE DEĞİL. Kalın sol kenar tonu üç piksele
       sıkıştırıyordu; kutunun kendisi hiçbir şey söylemiyordu. Yıkama zaten
       bunun için var ("bir dolgu değil bir ton"). Nötr uyarı yıkama almıyor:
       renksizlik onun anlamı. */
    <div
      {...dataProps(rest)}
      className="tamga-alert"
      style={state === "neutral" ? undefined : { background: h.bg }}
      role="status"
    >
      {/* GLİF KENDİ KARESİNDE, metnin yanında çıplak değil: yıkanmış bir
          kutunun üstünde çıplak bir glif zemine karışıyor, ve dört uyarı yan
          yana geldiğinde hangisinin hangisi olduğu ancak renkten okunuyordu. */}
      <span
        aria-hidden
        className="tamga-alert-tile"
        style={{ background: h.mark, color: h.markInk }}
      >
        <Icon icon={icon ?? TON_GLIFI[state]} size="sm" weight="fill" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium text-ink">{title}</p>
        {/* GÖVDE BİR `div`, `p` DEĞİL: bir uyarının gövdesi çoğu zaman bir LİSTE, ve
            `<p>` içindeki `<ul>` geçersiz HTML · tarayıcı listeyi paragrafın dışına
            çıkarıyor ve hidrasyon patlıyor.
            Gerekçe: docs/gerekce/01-form-ve-girdi.md */}
        {children ? (
          <div className="mt-1 text-small leading-relaxed text-ink-soft">{children}</div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
      {onDismiss ? (
        /* KAPATMA HAYALET: yıkanmış bir kutunun içinde ikinci bir kenarlı
           nesne, mesajın kendisiyle yarışıyor. */
        <button
          type="button"
          className="tamga-icon-btn tamga-icon-btn-sm tamga-icon-btn-ghost shrink-0"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <Icon icon={Close} size="xs" />
        </button>
      ) : null}
    </div>
  );
}

export function Breadcrumb({
  items,
  label,
  ...rest
}: {
  items: { label: string; href?: string }[];
  /**
   * The landmark's accessible name; see the note on Spinner. TR: Landmark'ın erişilebilir adı;
   * Spinner'daki nota bakın.
   */
  label: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <nav {...dataProps(rest)} aria-label={label}>
      <ol className="tamga-crumb">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {/* SON ÖĞE BİR KUTU, ve bağlantı değil: bulunduğun sayfaya link
                  vermek gezinmeyi değil kafa karışıklığını üretiyor. Kutu o
                  farkı gözle de söylüyor · ötekiler düz metin, bu durak. */}
              {last ? (
                <span aria-current="page" className="tamga-crumb-son">
                  {item.label}
                </span>
              ) : (
                <a href={item.href ?? "#"} className="tamga-crumb-link">
                  {item.label}
                </a>
              )}
              {last ? null : (
                <Icon icon={CaretRight} size="xs" weight="bold" className="text-ink-faint" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Field({
  label,
  description,
  error,
  required = false,
  note,
  info,
  count,
  children,
  htmlFor,
  ...rest
}: {
  label: string;
  description?: string;
  error?: string;
  /**
   * Draws the red asterisk beside the label. A glyph rather than a word, because the word is a
   * translation and the kit makes none. TR: Etiketin yanına kırmızı yıldızı çiziyor. Sözcük
   * değil glif, çünkü sözcük bir çeviri ve kit çeviri yapmıyor.
   */
  required?: boolean;
  /**
   * A quiet mark after the label: an info glyph carrying a `title`, a badge. It sits OUTSIDE the
   * `<label>` element, so clicking it does not focus the control. TR: Etiketin ardındaki sessiz
   * işaret: `title` taşıyan bir bilgi glifi, bir rozet. `<label>` elemanının DIŞINDA duruyor,
   * yani ona tıklamak kontrolü odaklamıyor.
   */
  info?: React.ReactNode;
  /**
   * The character counter under the control: `{ value, max }`. It turns critical once the limit
   * is passed, and it is here rather than on the control because the counter belongs to the
   * FIELD: a textarea knows how many characters it holds, not how many it is allowed. TR:
   * Kontrolün altındaki karakter sayacı. Sınır aşılınca kritik renge dönüyor, ve kontrolde değil
   * ALANDA duruyor: bir metin alanı kaç karakter taşıdığını bilir, kaçına izin verildiğini
   * bilmez.
   */
  count?: { value: number; max: number };
  /**
   * The quiet word at the far end of the label row: "Zorunlu", "optional", "max 120". The
   * caller writes it. TR: Etiket satırının öteki ucundaki sessiz sözcük: "Zorunlu", "isteğe
   * bağlı", "en çok 120". Sözcüğü çağıran yazıyor.
   */
  note?: string;
  children: React.ReactNode;
  htmlFor?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  /* THE NOTE UNDER THE FIELD IS WIRED TO THE CONTROL: `description` and `error`
     get ids and an `aria-describedby`. Done here rather than left to the caller,
     because 94 call sites in one product alone had not done it. A single element
     child is cloned; an existing `aria-describedby` is kept and this one appended.
     Gerekçe: docs/09-testler-ve-degismezler.md */
  const kok = useId();
  const notId = error ? `${kok}-error` : description ? `${kok}-description` : undefined;
  const kontrol =
    notId && isValidElement<{ "aria-describedby"?: string; "aria-invalid"?: boolean }>(children)
      ? cloneElement(children, {
          "aria-describedby": [children.props["aria-describedby"], notId]
            .filter(Boolean)
            .join(" "),
          "aria-invalid": error ? true : children.props["aria-invalid"],
        })
      : children;

  return (
    <div {...dataProps(rest)} className="flex flex-col gap-1.5">
      {/* ETİKET SATIRI İKİ UÇLU: solda ad ve zorunluluk, sağda sessiz not.
          Notu etiketin ARDINA koymak, uzun bir etikette onu satırın ortasında
          bırakıyor ve göz onu etiketin parçası sanıyor. */}
      <span className="flex items-baseline gap-2">
        <label htmlFor={htmlFor} className="text-small font-bold text-ink">
          {label}
          {required ? (
            <span aria-hidden className="ml-1" style={{ color: toneOf("danger").fg }}>
              *
            </span>
          ) : null}
        </label>
        {info ? <span className="flex items-center text-ink-faint">{info}</span> : null}
        <span className="flex-1" />
        {note ? <span className="text-caption text-ink-faint">{note}</span> : null}
      </span>
      {kontrol}
      {count ? (
        <span
          className="self-end font-mono text-small font-bold tabular-nums"
          style={count.value > count.max ? { color: toneOf("danger").fg } : { color: "var(--color-ink-faint)" }}
        >
          {count.value} / {count.max}
        </span>
      ) : null}
      {error ? (
        /* HATA SATIRI BİR GLİF TAŞIYOR: renk tek başına bir işaret değil ·
           kırmızıyı görmeyen biri için satır sıradan bir yardım metni kalıyor. */
        <p
          id={notId}
          className="flex items-center gap-1.5 text-small font-medium"
          style={{ color: toneOf("danger").fg }}
        >
          <Icon icon={Warning} size="xs" weight="fill" />
          {error}
        </p>
      ) : description ? (
        <p id={notId} className="text-small text-ink-faint">
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** A plain select: the same overlay as the searchable one, without the search. */
export function Select({
  options,
  icon,
  set,
  value,
  onChange,
  placeholder,
  loading = false,
  loadingRows = 4,
  "aria-label": ariaLabel,
  className,
  ...rest
}: {
  /**
   * Plain strings, or options that carry a tone. TR: Düz dizgiler, ya da ton
   * taşıyan seçenekler.
   *
   * A tone draws a small square before the label. It is for lists whose items
   * ARE states (an order status, a severity): the eye matches the colour in the
   * list to the colour in the table without reading either. Give it only when
   * the option really is a state; a swatch beside a cargo company name is
   * decoration. TR: Ton, etiketin önüne küçük bir kare çiziyor. Öğeleri birer
   * DURUM olan listeler için (sipariş durumu, önem derecesi): göz, listedeki
   * rengi tablodaki renge okumadan eşliyor. Yalnız seçenek gerçekten bir
   * durumsa verin; bir kargo firmasının yanındaki kare süstür.
   */
  options: readonly (
    | string
    | ({ value: string; label?: string; tone?: Tone; hint?: string } & Record<string, unknown>)
  )[];
  /**
   * `label` is the option's TEXT when it differs from its identity: a locale is stored as "tr"
   * and read as "Türkçe". Without it the value is shown as written. TR: `label`, seçeneğin
   * kimliğinden farklı olan METNİ: bir dil "tr" diye saklanıp "Türkçe" diye okunuyor.
   * Verilmezse değer yazıldığı gibi görünüyor.
   */
  /**
   * Whether a real choice has been made. TR: Gerçek bir seçim yapılıp
   * yapılmadığı.
   *
   * WHY IT IS NOT DERIVED FROM `value`. A filter's "all" row is a real option
   * with a real label, so it is `value` too, and a select showing "All" would
   * otherwise report itself as filled: every box in the bar firms its rule and
   * the one box that actually filters stops standing out. Left out, the control
   * falls back to "has a value". TR: NEDEN `value`DAN TÜRETİLMİYOR. Bir
   * filtrenin "tümü" satırı gerçek bir seçenek ve gerçek bir etiket, yani o da
   * `value` · "Tümü" yazan bir kutu kendini dolu sayıyor, çubuktaki her kutu
   * çizgisini sertleştiriyor ve asıl süzen kutu öne çıkmayı bırakıyor.
   * Verilmezse "değeri var mı" kuralına düşüyor.
   */
  set?: boolean;
  /**
   * A glyph before the value, naming what the list is about. TR: Değerin
   * önünde, listenin neyle ilgili olduğunu söyleyen glif.
   */
  icon?: IconGlyph;
  value?: string;
  onChange?: (v: string) => void;
  /**
   * Visible when nothing is chosen; user-facing, so the caller supplies it translated. TR:
   * Hiçbir şey seçilmemişken görünür; kullanıcıya gösterildiği için çevirisini çağıran veriyor.
   */
  placeholder: string;
  /**
   * options not in yet; the list holds its shape instead of showing a spinner TR: seçenekler
   * henüz gelmedi; liste bir dönen simge göstermek yerine şeklini koruyor
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
  /**
   * Accessible name when the control has no visible label. TR: Görünür etiketi
   * olmayan kontrolün erişilebilir adı.
   *
   * WHY IT EXISTS. Inside a `Field` the label is already wired and this is not
   * needed. But a select can also sit alone in a toolbar (a language picker, a
   * page-size chooser) where there is no room for a label, and there it was
   * announced as just "button": a screen reader user heard the current value
   * and no clue what changing it would do. TR: NEDEN VAR. Bir `Field` içinde
   * etiket zaten bağlı ve bu gerekmiyor. Ama bir seçim kutusu bir araç
   * çubuğunda tek başına da durabiliyor (dil seçici, sayfa boyu) ve orada
   * etikete yer yok; o hâliyle yalnız "düğme" diye duyuruluyordu: ekran
   * okuyucu kullanıcısı o anki değeri duyuyor, değiştirince ne olacağına dair
   * hiçbir şey duymuyordu.
   */
  "aria-label"?: string;
  /** Genişlik ve konum çağıranın. Varsayılan `w-56`; `w-full` verildiğinde
   *  tailwind-merge onu ezer, yani kontrol kabına uyar. */
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const [open, setOpen] = useState(false);
  const [inner, setInner] = useState(value ?? "");
  const box = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const current = value ?? inner;
  /* DÜĞMEDE DEĞER DEĞİL ETİKETİ YAZIYOR: kimliği "tr" olan bir seçenek
     "Türkçe" diye okunur, ve düğme listeyle aynı sözcüğü göstermek zorunda. */
  const gorunen =
    options
      .map((o) => (typeof o === "string" ? { value: o } : o))
      .find((o) => o.value === current)?.label ?? current;
  const close = useCallback(() => setOpen(false), []);
  useListKeys({ open: open && !loading, containerRef: list, onClose: close });

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  return (
    /* GENİŞLİK SABİT DEĞİL. Bir süre `w-56` yazılıydı ve `className` bile
       alınmıyordu; sonuç, kontrolün hiçbir ızgaraya ya da filtre çubuğuna
       sığmaması ve kabından taşarak yatay kaydırma açması. Bir form kontrolü
       kendi genişliğine karar veremez; kabı karar verir. */
    <div {...dataProps(rest)} ref={box} className={cn("relative w-56", className)}>
      {/* DÜĞME DEĞİL, KENDİ SINIFI. `Button` olarak çiziliyordu ve bir filtre
          çubuğunda yedi kara kutu yan yana geliyordu; hangisinin DOLU olduğu
          okunmuyordu, oysa bir filtrenin taşıdığı tek bilgi o. `data-set` boş
          ile dolu hâli ayırıyor: boşken bir alan, doluyken bir nesne. */}
      <button
        type="button"
        className="tamga-select justify-between"
        data-set={(set ?? Boolean(current)) ? "true" : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
      >
        {/* ETİKET KIRPILIR, OK KIRPILMAZ: `.tamga-btn` `nowrap` taşıyor ve `min-width:
            auto` metni küçültmüyordu, yani ok metnin dibine yapışıp sağ dolguyu
            taşıyordu. `min-w-0` + `truncate` + `shrink-0`.
            Gerekçe: docs/gerekce/01-form-ve-girdi.md */}
        {/* BAŞTAKİ GLİF LİSTENİN ADI. Bir filtre çubuğunda beş kutu yan yana
            duruyor ve hepsinin metni "Tümü" · ayırt eden tek şey üstlerindeki
            etiket oluyordu, yani göz her seferinde yukarı çıkıp geri iniyordu.
            Glif o yolculuğu kaldırıyor. Sessiz renkte: bir işaret değil bir
            başlık. */}
        {icon ? <Icon icon={icon} size="sm" className="shrink-0 text-ink-faint" /> : null}
        <span className={cn("min-w-0 flex-1 truncate", current ? "" : "text-ink-faint")}>
          {gorunen || placeholder}
        </span>
        <Icon icon={CaretRight} size="xs" className="shrink-0 rotate-90" />
      </button>
      {open && (
        <div
          ref={list}
          role="listbox"
          className="tamga-overlay tamga-menu absolute left-0 top-[var(--overlay-below)] z-40 flex w-full flex-col gap-0.5 overflow-hidden"
          aria-busy={loading || undefined}
        >
          {loading && <SkeletonOptions rows={loadingRows} />}
          {!loading && options.map((ham) => {
            const nesne = typeof ham === "string" ? { value: ham } : ham;
            const { value: o, label: etiket, tone: ton, hint: ipucu, ...kanca } = nesne;
            return (
            <button
              /* KANCA ÖNCE, KİTİN KENDİ NİTELİKLERİ SONRA: çağıranın geçirdiği
                 bir `data-*` yayması `aria-selected` ya da `role` gibi bir
                 sözleşmeyi ezebilirdi, ve ezdiği gün hata bir stil hatası gibi
                 görünürdü. */
              {...kanca}
              key={o}
              role="option"
              aria-selected={o === current}
              data-tamga-option
              className="tamga-option"
              data-selected={o === current}
              onClick={() => {
                setInner(o);
                onChange?.(o);
                setOpen(false);
              }}
            >
              {/* Renk karesi işaret ailesinin ölçüsünde (`tamga-mark`), yeni bir
                  boyut değil: aynı kare tabloda çipin içinde de duruyor ve
                  ikisinin ayrı çizilmesi, gözün eşleştirmesi gereken şeyi
                  bozardı. */}
              {ton ? (
                <span
                  aria-hidden
                  className="tamga-mark shrink-0"
                  style={{ background: toneOf(ton).mark }}
                />
              ) : null}
              <span className="min-w-0 flex-1 truncate">{etiket ?? o}</span>
              {/* SEÇENEĞİN SESSİZ İKİNCİ SATIRI YAN YANA: "2-3 gün", "₺49",
                  "son 30 gün". Alta koymak listeyi iki kat uzatıyor, ve okunan
                  şey hâlâ tek bir seçim. */}
              {ipucu ? <span className="shrink-0 text-small text-ink-faint">{ipucu}</span> : null}
              {o === current && (
                <Icon
                  icon={Check}
                  size="xs"
                  weight="bold"
                  className="shrink-0 text-[var(--color-accent-line)]"
                />
              )}
            </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Side panel. Overlay plane, so it carries the 6px offset and a scrim. */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  loading = false,
  closeLabel,
  side = "end",
  ...rest
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * Which edge the panel enters from. TR: Panelin hangi kenardan girdiği.
   *
   * NOT A TASTE, A MEANING. `end` is for detail about the thing you were
   * looking at: it opens beside the record, on the side the eye already ended
   * on. `start` is for NAVIGATION, because a menu lives on the left in every
   * panel this kit builds, and a menu that slides in from the opposite side
   * reads as a different kind of thing. TR: Zevk değil, ANLAM. `end` bakılan
   * şeyin ayrıntısı için: kaydın yanında, gözün zaten bittiği tarafta
   * açılıyor. `start` GEZİNME için, çünkü bu kitin kurduğu her panelde menü
   * solda yaşıyor, ve ters taraftan giren bir menü başka bir şey gibi
   * okunuyor.
   */
  side?: "start" | "end";
  /**
   * Accessible name for the close control, supplied by the caller (docs/08 rule 5). TR: Kapatma
   * kontrolünün erişilebilir adı, çağıran veriyor (docs/08 kural 5).
   */
  closeLabel: string;
  /**
   * contents not in yet; the panel holds its shape instead of showing a spinner TR: içerik
   * henüz gelmedi; panel bir dönen simge göstermek yerine şeklini koruyor
   */
  loading?: boolean;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  /* the trap has to be called before any early return, so the hook lives here
     and the null is returned after it */
  const panel = useFocusTrap<HTMLElement>(open);
  useScrollLock(open);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    /* ÇEKMECE KENARDAN İÇERİDE DURUYOR (2026-09-24). Öncesinde ekranın kenarına
       YAPIŞIKTI ve iki şeyi birden kaybediyordu: köşeleri elle sıfırlanmak
       zorundaydı (`borderRadius: 0`), ve katmanı ekran dışında kalıyordu ·
       yani sayfanın üstünde duran bir panel, üstünde durduğunu söyleyen tek
       işareti taşımıyordu. 12px'lik boşluk ikisini de geri veriyor: köşe
       görünüyor, 6px'lik taban da sığıyor. */
    <div
      {...dataProps(rest)}
      className={cn("fixed inset-0 z-50 flex p-3", side === "start" ? "justify-start" : "justify-end")}
    >
      {/* mouse affordance only: Escape and the Close button already cover the
            keyboard, and leaving this in the a11y tree gave the panel two
            controls both announced as "Close"
            `fixed`, `absolute` DEĞİL: kap artık dolgulu, ve `absolute inset-0`
            o dolguyu örtmezdi · perdesiz bir şerit kalırdı. */}
        <div className="tamga-scrim tamga-scrim-in fixed inset-0" aria-hidden onClick={onClose} />
      <aside
        ref={panel}
        role="dialog"
        aria-modal
        aria-label={title}
        /* PANEL KAYARAK GİRİYOR, VE GİRDİĞİ KENARDAN.
           Animasyonsuz hâli bir kare içinde beliriyordu: nereden geldiği,
           dolayısıyla nereye geri gideceği okunmuyordu. Kayma yönü `side` ile
           aynı; ters yönden kayan bir panel, kapatma hareketini de ters
           öğretiyor. `prefers-reduced-motion` açıksa kayma yok, panel yerinde
           beliriyor. */
        className={cn(
          "tamga-overlay relative z-10 flex h-full w-full max-w-md flex-col",
          side === "start" ? "tamga-sheet-start" : "tamga-sheet-end",
        )}
        aria-busy={loading || undefined}
      >
        {/* ÇEKMECENİN BAŞLIĞI KART BAŞLIĞI DEĞİL. `tamga-head tamga-section`
            kullanıyordu, yani kartların gömülü şeridini alıyordu: bir
            çekmecenin tepesi sayfanın üstünde duran bir panelin tepesi, kartın
            içine gömülmüş bir şerit değil. Kendi yüzeyinde duruyor ve altını
            tek bir çizgi kapatıyor. Başlık da display yüzünde ve bir basamak
            büyük: panelin adı, kart başlığıyla aynı ağırlıkta okunmamalı. */}
        <div className="flex items-center gap-2.5 border-b border-line px-4.5 py-4">
          <h3 className="font-display text-title font-extrabold">{title}</h3>
          <MiniButton onClick={onClose} aria-label={closeLabel} className="ml-auto">
            <Icon icon={Close} size="xs" />
          </MiniButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4.5 py-4">
          {loading ? <SkeletonPanel lines={5} block={120} /> : children}
        </div>
        {footer ? (
          <div className="flex justify-end gap-2 border-t border-line px-4.5 py-4">{footer}</div>
        ) : null}
      </aside>
    </div>
  );
}
