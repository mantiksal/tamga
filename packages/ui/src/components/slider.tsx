"use client";

import { cn } from "../lib/cn.js";

/**
 * Kendi dosyasında, çünkü YENİ BİR KONTROL.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

/** Kaydırıcı. */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  suffix,
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  /** The unit beside the value: "%", "ms", "₺". TR: Değerin yanındaki birim: "%", "ms", "₺". */
  suffix?: string;
  className?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <span className={cn("flex items-center gap-4", className)}>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="tamga-slider h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
        style={{
          background: `linear-gradient(to right, var(--color-accent-line) ${pct}%, var(--color-edge) ${pct}%)`,
        }}
      />
      <span className="w-16 shrink-0 text-right font-mono text-body text-ink tabular-nums">
        {value}
        {suffix}
      </span>
    </span>
  );
}

