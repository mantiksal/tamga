"use client";

import { useId, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { FieldNote, noteId, type NoteProps } from "./field-note.js";

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
  showLabel = false,
  description,
  error,
  errorPrefix,
  look = "list",
  disabled = false,
  className,
  ...rest
}: NoteProps & {
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
   * Draws `label` above the options as a visible heading, in `Field`'s label size and weight,
   * 8px above the first option, wired with `aria-labelledby`. Off by default: the group used to
   * carry its name only for screen readers, and that stays the default. TR: `label`ı
   * seçeneklerin üstüne görünür bir başlık olarak çiziyor; `Field` etiketiyle aynı boy ve
   * kalınlık, ilk seçenekten 8px yukarıda, `aria-labelledby` ile bağlı. Varsayılan kapalı: grup
   * adını yalnız ekran okuyucuya taşıyordu, varsayılan bu kalıyor.
   */
  showLabel?: boolean;
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
  const kok = useId();
  const notId = noteId(kok, error, description);
  const baslikId = showLabel ? `${kok}-label` : undefined;
  /* KARTLAR SÜTUN, ızgara DEĞİL · bir süre `sm:grid-cols-3` basılıydı ve
     kabın kararını bileşen veriyordu: üç fiyatlı kargo seçeneği yan yana
     dizildiğinde ikinci satırları hizasız kalıyor, alt alta okunuyorlar.
     Izgara isteyen çağıran `className` ile söylüyor. */
  const kabuk = cn(look === "chip" ? "flex flex-wrap gap-2" : "flex flex-col gap-2.5", className);
  const secenekler = options.map(({ value: v, label: etiket, ...rest }) => (
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
  ));
  /* BAŞLIK VE NOT GRUBUN İÇİNDE, fieldset/legend gibi: kök her zaman
     `role="radiogroup"`, kanca ve `data-look` hep aynı elemanda. Yalnız başlık
     ya da not varken seçenekler bir iç kaba iniyor ve ritim Field'ınki olur:
     etiket 8px üstte (gap 6 + mb 2), not 6px altta. */
  const sarili = showLabel || Boolean(notId);
  return (
    <div
      {...dataProps(rest)}
      role="radiogroup"
      aria-label={showLabel ? undefined : label}
      aria-labelledby={baslikId}
      aria-describedby={notId}
      aria-invalid={error ? true : undefined}
      data-look={look}
      className={sarili ? "flex flex-col gap-1.5" : kabuk}
    >
      {/* FIELD'IN ETİKET SATIRI BİREBİR: aynı satır kabı, aynı sınıf · aralık
          yapıdan eşit, ölçümle değil. */}
      {showLabel ? (
        <span className="mb-0.5 flex items-baseline gap-2">
          <span id={baslikId} className="text-body font-bold text-ink">
            {label}
          </span>
        </span>
      ) : null}
      {sarili ? <div className={kabuk}>{secenekler}</div> : secenekler}
      <FieldNote id={notId} error={error} description={description} errorPrefix={errorPrefix} />
    </div>
  );
}
