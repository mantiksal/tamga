"use client";

import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";

/**
 * Kendi dosyasında, çünkü YENİ BİR KONTROL.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

/**
 * Kaydırıcı · DEĞER HER ZAMAN GÖRÜNÜR.
 *
 * Bir kaydırıcı tek başına yalan söylüyor: kullanıcı "yaklaşık üçte iki"
 * görüyor, "%67" görmüyor. Eşik ayarlayan biri için o fark ayarın kendisi, o
 * yüzden değer bir çipte yazılı duruyor ve etiketle aynı satırda.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  suffix,
  scale,
  className,
  ...rest
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  /** The unit beside the value: "%", "ms", "₺". TR: Değerin yanındaki birim: "%", "ms", "₺". */
  suffix?: string;
  /**
   * The three marks under the track: start, middle, end. Pass them formatted, the kit does not
   * know the unit. Leave it out and the scale is not drawn. TR: Rayın altındaki üç işaret:
   * başlangıç, orta, son. Biçimlenmiş geliyor, kit birimi bilmiyor. Verilmezse ölçek çizilmiyor.
   */
  scale?: readonly [string, string, string];
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const metin = `${value}${suffix ?? ""}`;
  return (
    <span {...dataProps(rest)} className={cn("tamga-slider-wrap", className)}>
      <label className="tamga-slider-ust">
        <span>{label}</span>
        {/* Çip `aria-hidden`: aynı sayıyı `aria-valuetext` zaten okutuyor,
            ikisi birden okununca değer iki kez duyuluyor. */}
        <span aria-hidden className="tamga-slider-cip">
          {metin}
        </span>
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          aria-valuetext={metin}
          onChange={(e) => onChange(Number(e.target.value))}
          className="tamga-slider"
          style={{ "--p": `${pct}%` } as React.CSSProperties}
        />
      </label>
      {scale ? (
        <span className="tamga-slider-olcek" aria-hidden>
          {scale.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </span>
      ) : null}
    </span>
  );
}
