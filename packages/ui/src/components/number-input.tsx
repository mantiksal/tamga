"use client";

import { useId } from "react";
import { cn } from "../lib/cn.js";
import { Icon } from "./icon.js";
import { CaretDown } from "./icons.js";

/**
 * NumberInput — fiyat, stok, ağırlık.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  /** Değerin sonuna yapışan birim: "₺", "kg", "%" */
  suffix,
  disabled = false,
  invalid = false,
  full = false,
  /** Artır/azalt düğmelerinin erişilebilir adları. Kit çeviri çekmez. */
  labels,
  className,
}: {
  value: number | null;
  onChange?: (next: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  disabled?: boolean;
  invalid?: boolean;
  full?: boolean;
  labels: { increase: string; decrease: string };
  className?: string;
}) {
  const id = useId();

  const clamp = (n: number) => {
    if (min !== undefined && n < min) return min;
    if (max !== undefined && n > max) return max;
    return n;
  };

  const bump = (dir: 1 | -1) => {
    if (disabled) return;
    const base = value ?? min ?? 0;
    /* Kayan nokta toplamasının `0.1 + 0.2 = 0.30000000000000004` üretmesini
       engellemek için adım hassasiyetinde yuvarlanıyor. */
    const decimals = (String(step).split(".")[1] ?? "").length;
    onChange?.(clamp(Number((base + dir * step).toFixed(decimals))));
  };

  const atMin = min !== undefined && value !== null && value <= min;
  const atMax = max !== undefined && value !== null && value >= max;

  return (
    <span className={cn("relative inline-flex items-center", full && "w-full", className)}>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value ?? ""}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={(e) => {
          const raw = e.target.value.replace(",", ".").trim();
          if (raw === "") return onChange?.(null);
          const n = Number(raw);
          if (!Number.isNaN(n)) onChange?.(n);
        }}
        onBlur={() => value !== null && onChange?.(clamp(value))}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            bump(1);
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            bump(-1);
          }
        }}
        /* Sağ boşluk spinner'ın genişliği (22px) artı kenar payı; birim varsa
           onun yeri de eklenir. Elle sayı yazmak yerine hesaplanıyor, çünkü
           birim "₺" da olabilir "adet" de. */
        className={cn("tamga-input w-full tabular-nums", invalid && "tamga-input-invalid")}
        style={{ paddingRight: suffix ? 76 : 32 }}
      />

      {suffix ? (
        <span className="pointer-events-none absolute right-8 font-mono text-small text-ink-faint">
          {suffix}
        </span>
      ) : null}

      {/* Girdinin İÇİNDE, sağ kenarına yapışık. Gerekçesi `.tamga-stepper`'ın
          üstünde: iki mini buton üst üste 65px eder ve girdi 40px'tir. */}
      <span className="tamga-stepper">
        <button
          type="button"
          aria-label={labels.increase}
          aria-controls={id}
          disabled={disabled || atMax}
          onClick={() => bump(1)}
        >
          <Icon icon={CaretDown} size="xs" className="rotate-180" />
        </button>
        <button
          type="button"
          aria-label={labels.decrease}
          aria-controls={id}
          disabled={disabled || atMin}
          onClick={() => bump(-1)}
        >
          <Icon icon={CaretDown} size="xs" />
        </button>
      </span>
    </span>
  );
}
