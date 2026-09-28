"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";

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
  /**
   * The choices. Anything beyond `value` and `label` lands on that option's button, so a choice can
   * carry the hook a test or a style needs. TR: Seçenekler. `value` ve `label` dışındaki her şey o
   * seçeneğin düğmesine iniyor, yani bir seçenek testin ya da stilin ihtiyaç duyduğu kancayı
   * taşıyabiliyor.
   */
  options: readonly ({ value: T; label: ReactNode } & Record<string, unknown>)[];
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
      /* KARTLAR SÜTUN, ızgara DEĞİL · bir süre `sm:grid-cols-3` basılıydı ve
         kabın kararını bileşen veriyordu: üç fiyatlı kargo seçeneği yan yana
         dizildiğinde ikinci satırları hizasız kalıyor, alt alta okunuyorlar.
         Izgara isteyen çağıran `className` ile söylüyor. */
      className={cn(
        look === "chip" ? "flex flex-wrap gap-2" : "flex flex-col gap-2.5",
        className,
      )}
    >
      {options.map(({ value: v, label: etiket, ...rest }) => (
        <button
          key={v}
          type="button"
          {...rest}
          role="radio"
          aria-checked={value === v}
          aria-disabled={disabled || undefined}
          onClick={() => !disabled && onChange?.(v)}
          /* ÜSTTEN HİZALI VE TAM GENİŞLİK, ikisi de iki satırlık bir seçenek yüzünden:
             `items-center` işareti iki satırın ortasına kaçırıyor (işaret ilk satıra ait),
             içerik kadar genişlik de seçenekleri tırtıklı bir sütun yapıyor.
             Gerekçe: docs/gerekce/01-form-ve-girdi.md */
          className={cn(
            "text-body",
            look === "list" && "flex w-full items-start gap-2 text-left",
            look === "chip" && "tamga-choice-chip",
            look === "card" && "tamga-choice-card",
            disabled && "text-ink-faint",
          )}
        >
          {/* ÜSTTEN HİZA YALNIZ İKİ SATIR OLABİLEN BİÇİMLERDE. `tamga-choice-mark`
              işareti ilk satırın ortasına çekiyor; bir çipte tek satır var, orada
              aynı kural işareti aşağı kaydırırdı. */}
          <span
            className={cn("tamga-radio", look !== "chip" && "tamga-choice-mark")}
            data-checked={value === v && !disabled}
            data-off={disabled || undefined}
          />
          <span className="min-w-0 flex-1">{etiket}</span>
        </button>
      ))}
    </div>
  );
}
