"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { IMAGE_ACCEPT, prepareImage } from "../lib/image.js";
import { Alert } from "./primitives.js";
import { Button } from "./button.js";

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
};

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
}: {
  options: readonly SwatchOption[];
  value: string;
  onChange: (hex: string) => void;
  /** Accessible name of the "my own colour" control. TR: "Kendi rengim" kontrolünün erişilebilir adı. */
  customLabel: string;
  /** Whether a free colour is offered at all. TR: Serbest rengin hiç sunulup sunulmadığı. */
  custom?: boolean;
  className?: string;
}) {
  const secili = (hex: string) => hex.toLowerCase() === value.toLowerCase();
  const hazirMi = options.some((o) => secili(o.hex));

  return (
    <span className={cn("flex flex-wrap items-center gap-3", className)}>
      {options.map((o) => (
        <button
          key={o.hex}
          type="button"
          className="tamga-swatch"
          data-selected={secili(o.hex)}
          aria-label={o.label}
          title={o.label}
          onClick={() => onChange(o.hex)}
        >
          <span aria-hidden style={{ background: o.hex }} />
        </button>
      ))}

      {custom ? (
        /* SERBEST RENK DE BİR KUTU, ayrı bir alan değil: altı hazır rengin
           yanında duran bir metin girdisi, yedinci seçeneği ötekilerden başka
           bir şey gibi gösteriyordu. */
        <label className="tamga-swatch" data-selected={!hazirMi} title={customLabel}>
          <span className="sr-only">{customLabel}</span>
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

export type ThemeChoice = "light" | "dark" | "system";

function Yarim({ theme }: { theme: "light" | "dark" }) {
  return (
    <span className="tamga-theme-half" data-theme={theme} aria-hidden>
      <span className="tamga-theme-rail">
        <span className="tamga-theme-dot" data-accent="true" />
        <span className="tamga-theme-dot" />
        <span className="tamga-theme-dot" />
      </span>
      <span className="tamga-theme-body">
        <span className="tamga-theme-line" style={{ width: "70%" }} />
        <span className="tamga-theme-line" style={{ width: "45%" }} />
        <span className="tamga-theme-line" data-accent="true" style={{ width: "30%" }} />
        <span className="tamga-theme-line" style={{ width: "60%" }} />
      </span>
    </span>
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
}: {
  value: ThemeChoice;
  onChange: (next: ThemeChoice) => void;
  /** The three names and the group's accessible name. TR: Üç ad ve kümenin erişilebilir adı. */
  labels: { light: string; dark: string; system: string; group: string };
  className?: string;
}) {
  const secenekler: { deger: ThemeChoice; ad: string }[] = [
    { deger: "light", ad: labels.light },
    { deger: "dark", ad: labels.dark },
    { deger: "system", ad: labels.system },
  ];

  return (
    <div role="radiogroup" aria-label={labels.group} className={cn("flex flex-wrap gap-3", className)}>
      {secenekler.map((s) => (
        <button
          key={s.deger}
          type="button"
          role="radio"
          aria-checked={value === s.deger}
          tabIndex={value === s.deger ? 0 : -1}
          data-selected={value === s.deger}
          className="tamga-theme-card"
          onClick={() => onChange(s.deger)}
        >
          <span className="tamga-theme-box">
            {s.deger === "dark" ? <Yarim theme="dark" /> : <Yarim theme="light" />}
            {s.deger === "system" ? <Yarim theme="dark" /> : null}
          </span>
          <span className="tamga-theme-name">{s.ad}</span>
        </button>
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
    <div className={cn("flex flex-col gap-3", className)}>
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
