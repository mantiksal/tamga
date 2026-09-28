"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import { Check, Minus } from "./icons.js";

/* ---------------------------------------------------------------- *
 * Checkbox — bir DEĞER, bir hedef değil.
 *
 * İşaretlendiğinde DOLAR. Yasa 2'nin istisnası değil, teyidi: dolgu "bu
 * seçildi" demiyor, "bu değer açık" diyor. Mini butonun 1px kenarını ve 1px
 * offsetini taşır, böylece kontrol ailesinin bir üyesi gibi okunur.
 * ---------------------------------------------------------------- */
export function Checkbox({
  label,
  checked,
  indeterminate = false,
  onChange,
  disabled = false,
  className,
  compact = false,
  ...rest
}: {
  /**
   * The visible label. The kit does not translate; the caller passes ready text. TR: Görünen
   * etiket. Kit çeviri yapmaz; hazır metni çağıran geçer.
   */
  label: ReactNode;
  checked: boolean;
  /**
   * The third state: SOME of what this box stands for is checked, not all. A tree's parent row
   * wears it. Visible as a dash, announced as "mixed"; clicking still hands the caller a plain
   * true/false. TR: Üçüncü hâl: bu kutunun temsil ettiği şeyin BİR KISMI işaretli, hepsi değil.
   * Bir ağacın üst satırı bunu giyiyor. Görünüşü tire, ekran okuyucuya "mixed"; tıklanınca
   * çağırana yine düz bir true/false gidiyor.
   */
  indeterminate?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
  /**
   * The box a TABLE row wears. TR: Bir TABLO satırının giydiği kutu.
   *
   * Smaller and flat. A form checkbox is a control someone walks up to and
   * answers, so it is a raised object; a table checkbox is one of twenty-five
   * down a column, and twenty-five raised boxes turn a list into a grid of
   * buttons. The size drops too · the form box stands beside a sentence, this
   * one beside a row. TR: Daha küçük ve düz. Form onay kutusu, birinin karşısına
   * geçip yanıtladığı bir kontrol · o yüzden yükselmiş bir nesne. Tablo kutusu
   * ise bir sütunda yirmi beş taneden biri, ve yirmi beş yükselmiş kutu listeyi
   * bir düğme ızgarasına çeviriyor. Ölçü de düşüyor · form kutusu bir cümlenin
   * yanında duruyor, bu bir satırın.
   */
  compact?: boolean;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <button
{...dataProps(rest)}
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={cn("flex items-center gap-2 text-body", disabled && "text-ink-faint", className)}
    >
      <span
        className={cn("tamga-check", compact && "tamga-check-sm")}
        data-checked={(checked || indeterminate) && !disabled}
        data-off={disabled || undefined}
      >
        {/* Kısmi hâl TİRE, yarım bir onay işareti değil: yarım çizilmiş bir
            işaret "bu kutu bozuk" diye okunuyor, tire ise "bir kısmı" diyor. */}
        {indeterminate ? (
          <Icon icon={Minus} size="xs" weight="bold" />
        ) : checked ? (
          <Icon icon={Check} size="xs" weight="bold" />
        ) : null}
      </span>
      {label}
    </button>
  );
}
