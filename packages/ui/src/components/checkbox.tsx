"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import { Check } from "./icons.js";
import { OFF } from "./control-base.js";

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
  onChange,
  disabled = false,
  className,
  ...rest
}: {
  /**
   * The visible label. The kit does not translate; the caller passes ready text. TR: Görünen
   * etiket. Kit çeviri yapmaz; hazır metni çağıran geçer.
   */
  label: ReactNode;
  checked: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <button
{...dataProps(rest)}
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={cn("flex items-center gap-2 text-body", className)}
      style={disabled ? OFF : undefined}
    >
      <span className="tamga-check" data-checked={checked}>
        {checked ? <Icon icon={Check} size="xs" weight="bold" /> : null}
      </span>
      {label}
    </button>
  );
}
