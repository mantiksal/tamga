"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { makePalette } from "../lib/palette.js";
import { dataProps } from "../lib/data-props.js";
import { IMAGE_ACCEPT, prepareImage } from "../lib/image.js";
import { Alert } from "./primitives.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { Check, Eyedropper } from "./icons.js";

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
  className,
  ...rest
}: {
  options: readonly SwatchOption[];
  value: string;
  onChange: (hex: string) => void;
  /** Accessible name of the "my own colour" control. TR: "Kendi rengim" kontrolünün erişilebilir adı. */
  customLabel: string;
  /** Whether a free colour is offered at all. TR: Serbest rengin hiç sunulup sunulmadığı. */
  custom?: boolean;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const secili = (hex: string) => hex.toLowerCase() === value.toLowerCase();
  const hazirMi = options.some((o) => secili(o.hex));

  return (
    <span {...dataProps(rest)} className={cn("flex flex-wrap items-center gap-3", className)}>
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
 */
export function ImageField({
  value,
  onChange,
  maxEdge,
  labels,
  preview,
  extra,
  className,
  ...rest
}: {
  value: string | null;
  onChange: (next: string | null) => void;
  /** Longest edge of the stored image, in pixels. TR: Saklanan görselin en uzun kenarı, piksel. */
  maxEdge: number;
  labels: {
    /** "Logo", "Mark": used inside the buttons. TR: "Logo", "Amblem": düğmelerin içinde geçiyor. */
    name: string;
    upload: string;
    replace: string;
    remove: string;
    empty: string;
    errorType: string;
    errorSize: string;
    errorUnreadable: string;
  };
  /** The caller draws the preview: a logo is wide, a mark is square. TR: Önizlemeyi çağıran çiziyor: logo geniş, amblem kare. */
  preview: (src: string) => ReactNode;
  /** An extra control beside the buttons. TR: Düğmelerin yanına giren ek kontrol. */
  extra?: ReactNode;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const id = useId();
  const girdi = useRef<HTMLInputElement>(null);
  const [hata, setHata] = useState<string | null>(null);

  async function al(file: File | undefined) {
    if (!file) return;
    setHata(null);
    try {
      onChange(await prepareImage(file, maxEdge));
    } catch (e) {
      const kod = e instanceof Error ? e.message : "unreadable";
      setHata(
        kod === "type" ? labels.errorType : kod === "size" ? labels.errorSize : labels.errorUnreadable,
      );
    } finally {
      /* GİRDİ SIFIRLANIYOR: aynı dosya ikinci kez seçilince `change` hiç
         çıkmıyor, çünkü değer değişmiyor. Kullanıcı için bu "ikinci denemede
         çalışmıyor" demek. */
      if (girdi.current) girdi.current.value = "";
    }
  }

  return (
    <div {...dataProps(rest)} className={cn("flex flex-col gap-3", className)}>
      <input
        ref={girdi}
        id={id}
        type="file"
        accept={IMAGE_ACCEPT}
        className="sr-only"
        onChange={(e) => al(e.target.files?.[0])}
      />
      <div className="flex flex-wrap items-center gap-4">
        <span className="tamga-image-field" data-empty={value ? undefined : "true"}>
          {value ? preview(value) : labels.empty}
        </span>
        <span className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={() => girdi.current?.click()}>
            {value ? labels.replace : labels.upload}
          </Button>
          {extra}
          {value ? (
            <Button type="button" variant="ghost" onClick={() => onChange(null)}>
              {labels.remove}
            </Button>
          ) : null}
        </span>
      </div>
      {hata ? <Alert state="danger" title={hata} /> : null}
    </div>
  );
}
