"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";

/* ---------------------------------------------------------------- *
 * Segmented — akranlar arasından bir GÖRÜNÜM seçimi.
 *
 * Oturmuş (seated) fizik: seçili olan yükselmez, tam tersine yerine oturur.
 * "Buradasın" bir eylem değildir, o yüzden dolgu almaz (Yasa 2).
 * ---------------------------------------------------------------- */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: readonly { value: T; label: ReactNode }[];
  value: T;
  onChange?: (next: T) => void;
  /** The group's accessible name. TR: Grubun erişilebilir adı. */
  label: string;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cn("tamga-segment", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          data-active={value === o.value}
          onClick={() => onChange?.(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
