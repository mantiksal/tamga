"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";

/**
 * Segmented — akranlar arasından bir GÖRÜNÜM seçimi.
 *
 * Seçili olan KUYUDAN ÇIKIYOR: kabı çukur (`--color-sunk`), seçili segment ise
 * yüzey renginde, kenarlı ve tabanlı. Dolgu almıyor (Yasa 2). Bu yorum bir süre
 * bunun tersini yazıyordu.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "base",
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
  /**
   * `sm` is the strip that lives in a TOOLBAR (a card's header, a docs example box), where the
   * base size stands taller than the row it sits in. TR: `sm`, bir ARAÇ ÇUBUĞUNDA duran şerit ·
   * bir kart başlığı, bir doküman örnek kutusu: oralarda taban boy, içinde durduğu satırdan
   * uzun kalıyor.
   */
  size?: "base" | "sm";
  className?: string;
}) {
  /* OKLARLA GEZİLİYOR, VE ŞERİTTE TEK DURAK VAR. Bir radyo grubunda Tab tuşu
     grubu bir bütün olarak geçer, seçenekler arasında oklar gezer · seçenek
     başına bir Tab durağı koymak, beş görünümlü bir seçiciyi klavyede beş adım
     yapıyordu. Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md */
  function oklar(e: React.KeyboardEvent<HTMLDivElement>) {
    const yon = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const uc = e.key === "Home" ? 0 : e.key === "End" ? options.length - 1 : -1;
    if (yon === 0 && uc < 0) return;

    const simdi = options.findIndex((o) => o.value === value);
    const hedef =
      uc >= 0 ? options[uc] : options[(simdi + yon + options.length) % options.length];
    if (!hedef) return;

    e.preventDefault();
    onChange?.(hedef.value);
    e.currentTarget.querySelector<HTMLElement>(`[data-seg="${hedef.value}"]`)?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("tamga-segment", size === "sm" && "tamga-segment-sm", className)}
      onKeyDown={oklar}
    >
      {options.map(({ value: v, label: etiket, ...rest }) => (
        <button
          key={v}
          type="button"
          {...rest}
          role="radio"
          data-seg={v}
          aria-checked={value === v}
          tabIndex={value === v ? 0 : -1}
          data-active={value === v}
          onClick={() => onChange?.(v)}
        >
          {etiket}
        </button>
      ))}
    </div>
  );
}
