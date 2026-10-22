"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { makePalette } from "../lib/palette.js";
import { dataProps } from "../lib/data-props.js";
import { IMAGE_ACCEPT, RAW_LIMIT, prepareImage } from "../lib/image.js";
import { uyar } from "../lib/uyar.js";
import { Alert } from "./primitives.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { Check, Eyedropper, Close } from "./icons.js";

/* ------------------------------------------------------------------ *
 * Bir görünüm ayarı ekranının üç parçası: renk, tema, görsel.
 *
 * Üçü de bir üründe doğdu. Kite taşınma gerekçesi ADR-0003'ün sayma kuralı:
 * ikinci ürün üçünü de istedi ve hiçbirini bulamadı, o yüzden çıplak bir hex
 * girdisiyle yetindi. Sayı iki, tahmin değil.
 * ------------------------------------------------------------------ */

export type SwatchOption = {
  /** The hex the swatch applies. TR: Kutunun uyguladığı hex. */
  hex: string;
  /** Its name, translated, used as the accessible label. TR: Çevrilmiş adı; erişilebilir ad olarak kullanılıyor. */
  label: string;
} & Record<string, unknown>;

/**
 * Brand colour chosen from a few squares, or written by hand.
 * TR: Birkaç kareden seçilen ya da elle yazılan marka rengi.
 */
export function ColorSwatches({
  options,
  value,
  onChange,
  customLabel,
  custom = true,
  noneLabel,
  className,
  ...rest
}: {
  options: readonly SwatchOption[];
  /** The chosen hex; `""` means "no colour" when `noneLabel` is given. TR: Seçili hex; `noneLabel` verilmişse `""` "renk yok" demek. */
  value: string;
  /** Fires with the hex, or `""` for the "no colour" box. TR: Hex ile ateşlenir; "renk yok" kutusu için `""`. */
  onChange: (hex: string) => void;
  /** Accessible name of the "my own colour" control. TR: "Kendi rengim" kontrolünün erişilebilir adı. */
  customLabel: string;
  /** Whether a free colour is offered at all. TR: Serbest rengin hiç sunulup sunulmadığı. */
  custom?: boolean;
  /**
   * Given, a first box means "no colour" and an empty `value` selects it. Without it an empty
   * value lit the custom box, so an optional colour read as a choice. TR: Verilirse ilk kutu
   * "renk yok" demek ve boş `value` onu seçer. Yokken boş değer "kendi rengim" kutusunu
   * yakıyordu, isteğe bağlı bir renk bir seçim gibi okunuyordu.
   */
  noneLabel?: string;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const secili = (hex: string) => hex.toLowerCase() === value.toLowerCase();
  const yokSecili = noneLabel !== undefined && value === "";
  const hazirMi = yokSecili || options.some((o) => secili(o.hex));

  return (
    <span {...dataProps(rest)} className={cn("flex flex-wrap items-center gap-3", className)}>
      {noneLabel !== undefined ? (
        /* "RENK YOK" DA BİR KUTU: kesik kenar, boş zemin · kitin "henüz bir şey
           değil" dili. Boş değer onu seçer, kendi-rengim kutusunu değil. */
        <button
          type="button"
          className="tamga-swatch tamga-swatch-none"
          data-selected={yokSecili}
          aria-pressed={yokSecili}
          aria-label={noneLabel}
          title={noneLabel}
          onClick={() => onChange("")}
        >
          {yokSecili ? <Icon icon={Check} size="base" weight="bold" /> : <Icon icon={Close} size="base" weight="bold" />}
        </button>
      ) : null}
      {options.map(({ hex, label: etiket, ...rest }) => (
        <button
          key={hex}
          {...rest}
          type="button"
          className="tamga-swatch"
          style={{ background: hex, color: mürekkep(hex) }}
          data-selected={secili(hex)}
          aria-pressed={secili(hex)}
          aria-label={etiket}
          title={etiket}
          onClick={() => onChange(hex)}
        >
          {secili(hex) ? <Icon icon={Check} size="base" weight="bold" /> : null}
        </button>
      ))}

      {custom ? (
        /* SERBEST RENK DE BİR KUTU, ayrı bir alan değil: altı hazır rengin
           yanında duran bir metin girdisi, yedinci seçeneği ötekilerden başka
           bir şey gibi gösteriyordu. */
        <label
          className="tamga-swatch tamga-swatch-custom"
          data-selected={!hazirMi}
          title={customLabel}
          style={
            hazirMi
              ? /* Hiçbir hazır renk seçili değilken kutu o rengi giyiyor;
                   seçiliyken damalı zemin "burada henüz bir renk yok" diyor. */
                { background: DAMA }
              : { background: value, color: mürekkep(value) }
          }
        >
          <span className="sr-only">{customLabel}</span>
          {/* BOŞ HÂLDE DAMLALIK DURUYOR, kutu bomboş değil: damalı zemin
              "burada renk yok" diyor ama ne YAPILACAĞINI söylemiyordu, ve
              yedinci kutu ötekilerden farklı bir şey yapıyor · glif o farkı
              söylüyor. Renk seçilince yerini çentik alıyor. */}
          <Icon
            icon={hazirMi ? Eyedropper : Check}
            size="base"
            weight="bold"
            style={hazirMi ? { color: "var(--color-ink)" } : undefined}
          />
          <input
            type="color"
            value={hazirMi ? options[0]!.hex : value}
            onChange={(e) => onChange(e.target.value)}
            className="tamga-color-input"
            aria-label={customLabel}
          />
        </label>
      ) : null}
    </span>
  );
}

/* Damalı zemin: "burada renk yok". Kutunun kendisi bir renk olduğu için boş
   hâlin de bir zemini olmak zorunda, ve düz bir gri yedinci bir renk gibi
   okunuyordu. */
const DAMA =
  "repeating-linear-gradient(135deg, var(--color-hover) 0 6px, var(--color-sunk) 6px 12px)";

/**
 * Ink that stays readable on a given fill.
 * TR: Verilen dolgunun üstünde okunur kalan mürekkep.
 *
 * TOKEN DEĞİL, HESAP · ve önce token'dı: `--color-accent-ink`. Kusuru
 * tarayıcıda göründü. Kutular SEÇİLEN ham rengi gösteriyor, token ise o an
 * YÜRÜRLÜKTEKİ paletin mürekkebi; koyu temada antrasit marka seçilince palet
 * vurguyu açıyor (#838c9d) ve mürekkebini koyulaştırıyor (#222326), oysa
 * kutunun zemini hâlâ ham #3f4756. Sonuç koyunun üstünde koyu çentik: 1.4
 * kontrast, yani görünmez.
 *
 * Cevap paletin kendisinde: o rengin PALETİ hangi mürekkebi seçiyorsa kutu da
 * onu giyiyor. Eşik uydurmuyoruz, üreteci ikinci kez yazmıyoruz.
 */
const MUREKKEP = new Map<string, string>();
function mürekkep(hex: string): string {
  const anahtar = hex.toLowerCase();
  let m = MUREKKEP.get(anahtar);
  if (m === undefined) {
    m = makePalette(anahtar).light.accentInk;
    MUREKKEP.set(anahtar, m);
  }
  return m;
}

export type ThemeChoice = "light" | "dark" | "system";

/* Panelin yarısı: ray ve gövde. Bir tema kartı bunu bir kez çiziyor,
   "Sistem" kartı iki kez · ikincisi çapraz kesilerek üstüne biniyor.

   MİNYATÜR SABİT RENKLERLE, ve kitin tek istisnası bu. Seçenekler o an
   yürürlükteki temayı değil SEÇİLİRSE ne olacağını gösteriyor; token
   kullanılsaydı üçü de aynı görünürdü. Tek token: marka vurgusu, çünkü
   önizlemenin yarısı o. */
function Yarim({ theme, clip = false }: { theme: "light" | "dark"; clip?: boolean }) {
  return (
    <span className="tamga-theme-half" data-theme={theme} data-clip={clip || undefined} aria-hidden>
      <span className="tamga-theme-rail">
        <span className="tamga-theme-dot" data-accent="true" style={{ width: "80%" }} />
        <span className="tamga-theme-dot" style={{ width: "100%" }} />
        <span className="tamga-theme-dot" style={{ width: "70%" }} />
        <span className="tamga-theme-dot" style={{ width: "60%" }} />
      </span>
      <span className="tamga-theme-body">
        <span className="tamga-theme-line" data-accent="true" style={{ width: "50%" }} />
        <span className="tamga-theme-line" style={{ width: "100%" }} />
        <span className="tamga-theme-line" style={{ width: "70%" }} />
      </span>
    </span>
  );
}

/**
 * A miniature of the panel with a radio and a name under it.
 * TR: Altında bir radyo ve bir ad duran panel minyatürü.
 *
 * Tema ve kenar çubuğu aynı soruyu soruyor ("hangisi olsun") ve ayrı
 * çizilmişlerdi; ortak olan kap, farklı olan yalnız minyatürün içi.
 */
function OnizlemeKarti({
  selected,
  onSelect,
  label,
  sub,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  sub?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      data-selected={selected}
      className="tamga-preview-card"
      onClick={onSelect}
    >
      <span className="tamga-preview-box">{children}</span>
      <span className="tamga-preview-foot">
        {/* Kitin kendi radyosu, ikinci bir daire değil: kart tıklanan şey, bu
            yalnız hangisinin seçili olduğunu söyleyen işaret · o yüzden
            `aria-hidden`, erişilebilir hâli kartın `role="radio"`su. */}
        <span className="tamga-radio" data-checked={selected} aria-hidden />
        <span className="tamga-preview-text">
          <strong>{label}</strong>
          {sub ? <span>{sub}</span> : null}
        </span>
      </span>
    </button>
  );
}

/**
 * Theme picked from three little pictures of the panel.
 * TR: Panelin üç küçük resminden seçilen tema.
 *
 * "Light · Dark · System" were three words, and a theme is not chosen with
 * words: the person wants to see the result. "System" shows both halves in one
 * frame, which is exactly what it means.
 * TR: "Açık · Koyu · Sistem" üç kelimeydi, ve bir tema kelimeyle seçilmiyor:
 * kullanıcı sonucu görmek istiyor. "Sistem" iki yarımı tek karede gösteriyor,
 * anlamı tam olarak bu.
 */
export function ThemeCards({
  value,
  onChange,
  labels,
  className,
  ...rest
}: {
  value: ThemeChoice;
  onChange: (next: ThemeChoice) => void;
  /** The three names, a one-line note under each, and the group's accessible name. TR: Üç ad, her birinin altındaki tek satır, ve kümenin erişilebilir adı. */
  labels: {
    light: string;
    dark: string;
    system: string;
    group: string;
    lightNote?: string;
    darkNote?: string;
    systemNote?: string;
  };
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const secenekler: { deger: ThemeChoice; ad: string; alt?: string }[] = [
    { deger: "light", ad: labels.light, alt: labels.lightNote },
    { deger: "dark", ad: labels.dark, alt: labels.darkNote },
    { deger: "system", ad: labels.system, alt: labels.systemNote },
  ];

  return (
    <div
      {...dataProps(rest)}
      role="radiogroup"
      aria-label={labels.group}
      className={cn("tamga-preview-grid", className)}
    >
      {secenekler.map((s) => (
        <OnizlemeKarti
          key={s.deger}
          selected={value === s.deger}
          onSelect={() => onChange(s.deger)}
          label={s.ad}
          sub={s.alt}
        >
          <span className="tamga-theme-box">
            <Yarim theme={s.deger === "dark" ? "dark" : "light"} />
            {s.deger === "system" ? <Yarim theme="dark" clip /> : null}
          </span>
        </OnizlemeKarti>
      ))}
    </div>
  );
}

export type RailChoice = "narrow" | "wide" | "free";

/**
 * Sidebar width picked from three little pictures of the panel.
 * TR: Panelin üç küçük resminden seçilen kenar çubuğu genişliği.
 *
 * This was a `Segmented` of three words. On the same screen the theme was
 * asked with pictures and this with words, and how much room a menu takes is
 * the kind of thing you see rather than read.
 * TR: Bu üç kelimelik bir `Segmented` idi. Aynı ekranda tema resimle, bu
 * kelimeyle soruluyordu; oysa bir menünün ne kadar yer kapladığı okunacak
 * değil görülecek bir şey.
 */
export function RailCards({
  value,
  onChange,
  labels,
  className,
  ...rest
}: {
  value: RailChoice;
  onChange: (next: RailChoice) => void;
  /** The three names, a one-line note under each, and the group's accessible name. TR: Üç ad, her birinin altındaki tek satır, ve kümenin erişilebilir adı. */
  labels: {
    narrow: string;
    wide: string;
    free: string;
    group: string;
    narrowNote?: string;
    wideNote?: string;
    freeNote?: string;
  };
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const secenekler: { deger: RailChoice; ad: string; alt?: string }[] = [
    { deger: "wide", ad: labels.wide, alt: labels.wideNote },
    { deger: "narrow", ad: labels.narrow, alt: labels.narrowNote },
    { deger: "free", ad: labels.free, alt: labels.freeNote },
  ];

  return (
    <div
      {...dataProps(rest)}
      role="radiogroup"
      aria-label={labels.group}
      className={cn("tamga-preview-grid", className)}
    >
      {secenekler.map((s) => (
        <OnizlemeKarti
          key={s.deger}
          selected={value === s.deger}
          onSelect={() => onChange(s.deger)}
          label={s.ad}
          sub={s.alt}
        >
          <span className="tamga-rail-mini" data-mode={s.deger} aria-hidden>
            <span className="tamga-rail-mini-rail">
              <span data-accent="true" />
              <span />
              <span />
              <span />
              {/* Daraltma düğmesi yalnız "serbest"te çiziliyor: öteki ikisinde
                  menü sabit, yani basılacak bir şey de yok. */}
              {s.deger === "free" ? <span className="tamga-rail-mini-toggle" /> : null}
            </span>
            <span className="tamga-rail-mini-body">
              <span />
              <span />
            </span>
          </span>
        </OnizlemeKarti>
      ))}
    </div>
  );
}

/**
 * One image with a preview, a replace and a remove.
 * TR: Önizlemesi, değiştirmesi ve kaldırması olan tek bir görsel.
 *
 * NOT `FileUpload`: that one is a GALLERY (multi select, reorder arrows, a
 * "cover" badge). Right for product photos, wrong for a single logo, where it
 * offers reorder arrows with nothing to reorder.
 * TR: `FileUpload` DEĞİL: o bir GALERİ (çoklu seçim, sıralama okları, "kapak"
 * rozeti). Ürün fotoğrafları için doğru, tek bir logo için yanlış.
 *
 * Two paths, one field. Without `onUpload` the image is shrunk in the browser
 * and a data URL goes to `onChange`. With `onUpload` the file goes to the
 * caller and the field carries the states: waiting, failure, a quiet
 * confirmation. TR: İki yol, tek alan. `onUpload` yokken görsel tarayıcıda
 * küçültülür, data-URL `onChange`'e gider. `onUpload` verilince dosya çağırana
 * gider; alan bekleme, hata ve sessiz onayı taşır.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */
export function ImageField({
  value,
  onChange,
  maxEdge,
  labels,
  preview,
  extra,
  onUpload,
  onRemove,
  confirm = false,
  accept = IMAGE_ACCEPT,
  maxBytes = RAW_LIMIT,
  disabled = false,
  lockedNote,
  className,
  ...rest
}: {
  value: string | null;
  onChange: (next: string | null) => void;
  /**
   * Longest edge of the stored image, in pixels; the browser path shrinks to it, so give it
   * there. Not used with `onUpload`: the server decides. TR: Saklanan görselin en uzun kenarı,
   * piksel; tarayıcı yolu ona küçültür, orada ver. `onUpload` ile kullanılmaz: sunucu karar verir.
   */
  maxEdge?: number;
  labels: {
    /** "Logo", "Mark": used inside the buttons. TR: "Logo", "Amblem": düğmelerin içinde geçiyor. */
    name: string;
    upload: string;
    replace: string;
    remove: string;
    /** The empty state's content: a sentence, or a node. TR: Boş durumun içeriği: bir cümle ya da bir düğüm. */
    empty: ReactNode;
    errorType: string;
    errorSize: string;
    errorUnreadable: string;
    /**
     * Shown when `onUpload` or `onRemove` rejects without a message (an empty string, `undefined`);
     * falls back to `errorUnreadable`. TR: `onUpload` ya da `onRemove` mesajsız reddedince (boş
     * metin, `undefined`); yoksa `errorUnreadable`.
     */
    errorUpload?: string;
    /** The button's name while `onUpload` runs; falls back to `upload`. TR: `onUpload` sürerken düğmenin adı; yoksa `upload`. */
    uploading?: string;
    /** The button's name while `onRemove` runs; falls back to `remove`. TR: `onRemove` sürerken düğmenin adı; yoksa `remove`. */
    removing?: string;
    /** The quiet line after a successful upload; omitted, nothing is said. TR: Başarılı yüklemeden sonraki sessiz satır; yoksa susar. */
    uploaded?: string;
    /** The quiet line after a successful removal. TR: Başarılı kaldırmadan sonraki sessiz satır. */
    removed?: string;
    /** The button that sends a previewed pick; falls back to `upload`. TR: Önizlenen seçimi gönderen düğme; yoksa `upload`. */
    confirm?: string;
    /** The button that drops a previewed pick; falls back to `remove`. TR: Önizlenen seçimi bırakan düğme; yoksa `remove`. */
    cancel?: string;
  };
  /** The caller draws the preview: a logo is wide, a mark is square. TR: Önizlemeyi çağıran çiziyor: logo geniş, amblem kare. */
  preview: (src: string) => ReactNode;
  /** An extra control beside the buttons. TR: Düğmelerin yanına giren ek kontrol. */
  extra?: ReactNode;
  /**
   * Hands the chosen file to the caller instead of converting it. Resolve with the stored
   * address: it goes to `onChange` and `labels.uploaded` is announced. Resolve with `false` when
   * you handled the result yourself (a plan-wall dialog, your own `onChange`): the kit stays
   * silent. Anything else is a bug and warns in development, because a forgotten `return` must
   * not read as "uploaded". Reject with a string, an `Error` or `{ message }`: that text is shown
   * under the field AS IT IS, so map a raw network error to your own words before rejecting; an
   * empty reason shows `labels.errorUpload`. The file and its preview stay, "confirm" retries. A
   * result that arrives after `value` changed from outside, or after unmount, is dropped. TR:
   * Seçilen dosyayı dönüştürmek yerine çağırana verir. Saklanan adresle çözülür: `onChange`'e
   * gider, `labels.uploaded` duyurulur. Sonucu kendin ele aldıysan `false` ile çöz: kit susar.
   * Başka bir değer geliştirmede uyarır; unutulan bir `return` "yüklendi" sayılmaz. Metin, `Error`
   * ya da `{ message }` ile reddedilirse metin alanın altında OLDUĞU GİBİ gösterilir, ağ hatasını
   * reddetmeden önce kendi sözüne çevir; boş sebep `labels.errorUpload` gösterir. Dosya ve
   * önizleme kalır, "confirm" yeniden dener. `value` dışarıdan değiştikten ya da bileşen
   * kalktıktan sonra gelen sonuç atılır.
   */
  onUpload?: (file: File) => Promise<string | false>;
  /**
   * Awaited before `onChange(null)`; `false` keeps the kit silent (you handled it); a rejection
   * shows under the field like `onUpload`'s. TR: `onChange(null)`'dan önce beklenir; `false` kiti
   * susturur (sen ele aldın); red `onUpload`'daki gibi alanın altında.
   */
  onRemove?: () => Promise<boolean | void>;
  /**
   * Preview first, send on a click: for a logo, a chance to notice the wrong file. Off, the pick
   * uploads at once (an avatar). TR: Önce önizle, tıklayınca gönder: logo için yanlış dosyayı fark
   * etme şansı. Kapalıyken seçim hemen gider (avatar).
   */
  confirm?: boolean;
  /**
   * The input's accept list; the pick is checked against it on both paths, before `prepareImage`
   * or `onUpload`. TR: Girdinin accept listesi; seçim iki yolda da `prepareImage` ya da
   * `onUpload`'dan önce buna göre denetlenir.
   */
  accept?: string;
  /** Refused on both paths with `errorSize`; 8 MB by default. TR: İki yolda da `errorSize` ile reddedilir; varsayılan 8 MB. */
  maxBytes?: number;
  disabled?: boolean;
  /**
   * Why the field is locked, as visible text under it and `aria-describedby` on the buttons; a
   * tooltip hides from touch and keyboards. TR: Alanın neden kilitli olduğu, altında görünür
   * metin ve düğmelerde `aria-describedby`; ipucu dokunmatikten ve klavyeden saklanır.
   */
  lockedNote?: string;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const id = useId();
  const girdi = useRef<HTMLInputElement>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [bekleyen, setBekleyen] = useState<{ file: File; url: string } | null>(null);
  const [mesgul, setMesgul] = useState<"upload" | "remove" | null>(null);
  const [onay, setOnay] = useState<string | null>(null);
  /* Adres ref'te de: kalkışta son adresi bırakmak için state okunamıyor. İstek
     sayacı, "canlı" bayrağı ve son değer bayat cevabı ayırıyor: kalkıştan ya da
     dış değer değişiminden sonra gelen sonuç ne onChange'e gider ne ekrana. */
  const adres = useRef<string | null>(null);
  const istek = useRef(0);
  const canli = useRef(true);
  const sonDeger = useRef(value);
  sonDeger.current = value;

  function birak() {
    if (adres.current) URL.revokeObjectURL(adres.current);
    adres.current = null;
    setBekleyen(null);
  }
  useEffect(() => {
    canli.current = true;
    return () => {
      canli.current = false;
      if (adres.current) URL.revokeObjectURL(adres.current);
      adres.current = null;
    };
  }, []);
  /* Değer dışarıdan geldiyse bekleyen önizleme bayat kaldı. */
  useEffect(() => {
    if (value && adres.current) birak();
  }, [value]);

  const kilit = disabled || mesgul !== null;
  /* Dış değer değiştiyse sonuç bayat · ama çağıranın KENDİ güncellemesi değil:
     onUpload içinde önbelleği sonuçla, onRemove içinde null ile güncelleyen bir
     çağıran "yüklendi"yi yine duymalı. */
  const bayat = (benim: number, baslangic: string | null, beklenen: string | null | undefined) =>
    !canli.current ||
    istek.current !== benim ||
    (sonDeger.current !== baslangic && (beklenen === undefined || sonDeger.current !== beklenen));

  function sifirla() {
    /* GİRDİ SIFIRLANIYOR: aynı dosya ikinci kez seçilince `change` hiç
       çıkmıyor, çünkü değer değişmiyor. Kullanıcı için bu "ikinci denemede
       çalışmıyor" demek. */
    if (girdi.current) girdi.current.value = "";
  }

  async function al(file: File | undefined) {
    if (!file || kilit) return;
    sifirla();
    setHata(null);
    setOnay(null);
    if (!kabul(file, accept)) return setHata(labels.errorType);
    if (file.size === 0) return setHata(labels.errorUnreadable);
    if (file.size > maxBytes) return setHata(labels.errorSize);
    if (!onUpload) {
      try {
        onChange(await prepareImage(file, maxEdge ?? Infinity));
      } catch (e) {
        const kod = e instanceof Error ? e.message : "unreadable";
        setHata(
          kod === "type" ? labels.errorType : kod === "size" ? labels.errorSize : labels.errorUnreadable,
        );
      }
      return;
    }
    birak();
    const url = URL.createObjectURL(file);
    adres.current = url;
    setBekleyen({ file, url });
    if (!confirm) await gonder(file);
  }

  async function gonder(file: File) {
    if (!onUpload || mesgul) return;
    const benim = ++istek.current;
    const baslangic = sonDeger.current;
    setHata(null);
    setOnay(null);
    setMesgul("upload");
    try {
      const sonuc = await onUpload(file);
      if (bayat(benim, baslangic, typeof sonuc === "string" ? sonuc : undefined)) return;
      if (typeof sonuc === "string") {
        birak();
        onChange(sonuc);
        setOnay(labels.uploaded ?? null);
      } else if (sonuc !== false) {
        uyar("ImageField: onUpload resolved with neither an address nor `false`; nothing was announced. Return the stored address, or `false` when you handled the result yourself.");
      }
    } catch (e) {
      if (bayat(benim, baslangic, undefined)) return;
      setHata(metin(e, labels));
    } finally {
      if (canli.current) setMesgul(null);
    }
  }

  async function kaldir() {
    if (kilit) return;
    setHata(null);
    setOnay(null);
    if (!onRemove) return onChange(null);
    const benim = ++istek.current;
    const baslangic = sonDeger.current;
    setMesgul("remove");
    try {
      const sonuc = await onRemove();
      if (bayat(benim, baslangic, null) || sonuc === false) return;
      onChange(null);
      setOnay(labels.removed ?? null);
    } catch (e) {
      if (bayat(benim, baslangic, undefined)) return;
      setHata(metin(e, labels));
    } finally {
      if (canli.current) setMesgul(null);
    }
  }

  const gosterilen = bekleyen?.url ?? value;
  const asenkron = Boolean(onUpload || onRemove);
  const notKimligi = `${id}-kilit`;
  const tarif = disabled && lockedNote ? notKimligi : undefined;

  return (
    <div {...dataProps(rest)} className={cn("flex flex-col gap-3", className)}>
      <input
        ref={girdi}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={kilit || undefined}
        onChange={(e) => al(e.target.files?.[0])}
      />
      <div className="flex flex-wrap items-center gap-4">
        <span className="tamga-image-field" data-empty={gosterilen ? undefined : "true"}>
          {gosterilen ? preview(gosterilen) : labels.empty}
        </span>
        <span className="flex flex-wrap items-center gap-2">
          {bekleyen ? (
            <>
              <Button
                type="button"
                busy={mesgul === "upload"}
                busyLabel={labels.uploading ?? labels.upload}
                disabled={kilit || undefined}
                aria-describedby={tarif}
                onClick={() => gonder(bekleyen.file)}
              >
                {labels.confirm ?? labels.upload}
              </Button>
              <Button type="button" variant="ghost" disabled={kilit || undefined} onClick={birak}>
                {labels.cancel ?? labels.remove}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              busy={mesgul === "upload"}
              busyLabel={labels.uploading ?? labels.upload}
              disabled={kilit || undefined}
              aria-describedby={tarif}
              onClick={() => girdi.current?.click()}
            >
              {value ? labels.replace : labels.upload}
            </Button>
          )}
          {extra}
          {value && !bekleyen ? (
            <Button
              type="button"
              variant="ghost"
              busy={mesgul === "remove"}
              busyLabel={labels.removing ?? labels.remove}
              disabled={kilit || undefined}
              aria-describedby={tarif}
              onClick={kaldir}
            >
              {labels.remove}
            </Button>
          ) : null}
        </span>
      </div>
      {lockedNote && disabled ? (
        <p id={notKimligi} className="text-small text-ink-faint">
          {lockedNote}
        </p>
      ) : null}
      {/* CANLI BÖLGE HEP DOM'DA, yalnız metni değişiyor: sonradan eklenen bir
          `role=status` çoğu ekran okuyucuda hiç okunmuyor. Boşken sr-only, yani
          yer kaplamıyor ama ağaçta duruyor. */}
      {asenkron ? (
        <p role="status" className={cn("text-small text-ink-faint", !onay && "sr-only")}>
          {onay}
        </p>
      ) : null}
      {/* Hata bölgesi de hep DOM'da: sonradan eklenen `Alert` okunmuyordu. Senkron
          yol eski markup'ını koruyor. */}
      {asenkron ? (
        <div role="alert" className={cn(!hata && "sr-only")}>
          {hata ? <Alert state="danger" title={hata} /> : null}
        </div>
      ) : hata ? (
        <Alert state="danger" title={hata} />
      ) : null}
    </div>
  );
}

/** `accept` listesine karşı ön denetim: MIME, `image/*` ve `.png` biçimleri. Boş liste her şeyi geçirir. */
function kabul(file: File, accept: string) {
  const liste = accept.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (liste.length === 0) return true;
  const tur = file.type.toLowerCase();
  const ad = file.name.toLowerCase();
  return liste.some((k) =>
    k.startsWith(".") ? ad.endsWith(k) : k.endsWith("/*") ? tur.startsWith(k.slice(0, -1)) : tur === k,
  );
}

/** Çağıranın reddi: metin, `Error` ya da `{ message }` olduğu gibi; boşsa kitin genel sözü. */
function metin(e: unknown, labels: { errorUpload?: string; errorUnreadable: string }) {
  const yedek = labels.errorUpload ?? labels.errorUnreadable;
  if (typeof e === "string") return e || yedek;
  if (e && typeof e === "object" && "message" in e && typeof e.message === "string" && e.message) return e.message;
  return yedek;
}
