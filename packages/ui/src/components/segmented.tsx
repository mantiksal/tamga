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
  /**
   * The choices. Anything beyond `value` and `label` lands on that option's button, so a choice
   * can carry the hook a test or a style needs. TR: Seçenekler. `value` ve `label` dışındaki her
   * şey o seçeneğin düğmesine iniyor, yani bir seçenek testin ya da stilin ihtiyaç duyduğu
   * kancayı taşıyabiliyor.
   */
  options: readonly ({ value: T; label: ReactNode } & Record<string, unknown>)[];
  value: T;
  onChange?: (next: T) => void;
  /** The group's accessible name. TR: Grubun erişilebilir adı. */
  label: string;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cn("tamga-segment", className)}>
      {options.map(({ value: v, label: etiket, ...rest }) => (
        <button
          key={v}
          type="button"
          {...rest}
          aria-pressed={value === v}
          data-active={value === v}
          onClick={() => onChange?.(v)}
        >
          {etiket}
        </button>
      ))}
    </div>
  );
}
