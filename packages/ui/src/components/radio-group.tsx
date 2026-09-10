"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { OFF } from "./control-base.js";

/* ---------------------------------------------------------------- *
 * RadioGroup — akranlar arasından TEK seçim.
 *
 * Grubun kendisi `role="radiogroup"`, satırlar `role="radio"`. İkisi birden
 * olmadan ekran okuyucu "üç ayrı düğme" duyurur, "üç seçenekten biri" değil.
 * ---------------------------------------------------------------- */
export function RadioGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  disabled = false,
  className,
}: {
  options: readonly { value: T; label: ReactNode }[];
  value: T;
  onChange?: (next: T) => void;
  /**
   * The group's accessible name: the answer to "one of which options". TR: Grubun erişilebilir
   * adı: "hangi seçeneklerden biri" sorusunun cevabı.
   */
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex flex-col gap-2", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          aria-disabled={disabled || undefined}
          onClick={() => !disabled && onChange?.(o.value)}
          /* ÜSTTEN HİZALI VE TAM GENİŞLİK, ve ikisi de iki satırlık bir
             seçenek yüzünden değişti.
             `items-center` tek satırlık etiketlerde doğru duruyordu; altına
             bir açıklama satırı eklenince işaret iki satırın ORTASINA kaçıyor
             ve neyi işaretlediği belirsizleşiyor. İşaret ilk satıra ait.
             `w-full` de aynı sebeple: düğme içeriği kadar genişken açıklama
             erkenden sarıyor ve seçenekler farklı genişliklerde tırtıklı bir
             sütun oluşturuyordu. Tam genişlik hepsini aynı sol kenara ve aynı
             sarma noktasına oturtuyor. */
          className="flex w-full items-start gap-2 text-left text-body"
          style={disabled ? OFF : undefined}
        >
          <span className="tamga-radio tamga-choice-mark" data-checked={value === o.value} />
          <span className="min-w-0 flex-1">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
