"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
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
  look = "list",
  disabled = false,
  className,
  ...rest
}: {
  options: readonly { value: T; label: ReactNode }[];
  value: T;
  onChange?: (next: T) => void;
  /**
   * The group's accessible name: the answer to "one of which options". TR: Grubun erişilebilir
   * adı: "hangi seçeneklerden biri" sorusunun cevabı.
   */
  label: string;
  /**
   * The shell each option is drawn in. TR: Her seçeneğin çizildiği kabuk.
   *
   * `list` alt alta, işaret ve etiket; `chip` yan yana sarılan küçük kabuklar; `card` ikinci bir
   * satır taşıyacak kadar yer veren bir kart yüzeyi.
   *
   * Değişen yalnız kabuk: `role="radiogroup"`, `role="radio"`, `aria-checked` ve klavye davranışı
   * üçünde de aynı. Seçili kabuk çerçeve ve sert offset alıyor, dolgu değil (Yasa 2).
   *
   * İkinci satır `label`in içine yazılıyor; ayrı bir `hint` alanı yok, çünkü etiket zaten
   * `ReactNode` ve yalnız tek bir kabukta anlamı olan bir prop props tablosunda herkese görünürdü.
   */
  look?: "list" | "chip" | "card";
  disabled?: boolean;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <div
      {...dataProps(rest)}
      role="radiogroup"
      aria-label={label}
      data-look={look}
      className={cn(
        look === "list" ? "flex flex-col gap-2" : "flex flex-wrap gap-2",
        look === "card" && "sm:grid sm:grid-cols-3",
        className,
      )}
    >
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
          className={cn(
            "text-body",
            look === "list" && "flex w-full items-start gap-2 text-left",
            look === "chip" && "tamga-choice-chip",
            look === "card" && "tamga-choice-card",
          )}
          style={disabled ? OFF : undefined}
        >
          {/* ÜSTTEN HİZA YALNIZ İKİ SATIR OLABİLEN BİÇİMLERDE. `tamga-choice-mark`
              işareti ilk satırın ortasına çekiyor; bir çipte tek satır var, orada
              aynı kural işareti aşağı kaydırırdı. */}
          <span
            className={cn("tamga-radio", look !== "chip" && "tamga-choice-mark")}
            data-checked={value === o.value}
          />
          <span className="min-w-0 flex-1">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
