"use client";

import { useId, useState } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import { CaretDown, Minus, Plus } from "./icons.js";

/**
 * NumberInput — fiyat, stok, ağırlık.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

export function NumberInput({
  value,
  onChange,
  look = "field",
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
  locale,
  className,
  ...rest
}: {
  value: number | null;
  onChange?: (next: number | null) => void;
  /**
   * `field` a text field with the stepper on its right edge · for a threshold, a rate, a price:
   * numbers that are TYPED and only nudged. `quantity` the joined control with the buttons
   * flanking the value · for a count that is CLICKED into place ("3 adet"), where the number is
   * small and the two buttons are the whole interaction. TR: `field` sağ kenarında sayaç olan
   * metin alanı · eşik, oran, fiyat için: YAZILAN ve yalnız dürtülen sayılar. `quantity`
   * düğmeleri değerin iki yanında duran birleşik kontrol · TIKLANARAK ayarlanan adet için
   * ("3 adet"), sayı küçükken ve etkileşimin tamamı o iki düğmeyken.
   */
  look?: "field" | "quantity";
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  disabled?: boolean;
  invalid?: boolean;
  full?: boolean;
  labels: { increase: string; decrease: string };
  /**
   * BCP-47 tag for how the number is SHOWN: "tr-TR" prints 249,9 and "en-US" prints 249.9. Not
   * given, the number is shown as typed. This is formatting, not translation: the kit does not
   * pick the tag, the caller does. TR: Sayının NASIL GÖSTERİLECEĞİ: "tr-TR" 249,9 yazar,
   * "en-US" 249.9. Verilmezse sayı yazıldığı gibi görünür. Bu çeviri değil biçimleme: etiketi
   * kit seçmiyor, çağıran veriyor.
   */
  locale?: string;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const id = useId();
  /* YAZARKEN BİÇİMLENMİYOR, BIRAKINCA BİÇİMLENİYOR.
     Her tuşta biçimlemek "249," yazan birinin virgülünü siliyor, yani ondalık
     yazılamıyor. Taslak yalnız odaktayken yaşıyor; odak çıkınca değerin kendisi
     yerel biçimde görünüyor. */
  const [taslak, setTaslak] = useState<string | null>(null);

  const goster = (n: number | null) => {
    if (n === null) return "";
    return locale ? n.toLocaleString(locale) : String(n);
  };

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

  if (look === "quantity") {
    /* DEĞER BİR GİRDİ DEĞİL BİR METİN: adet kontrolünde sayı tıklanarak
       ayarlanıyor, ve yazılabilir bir alan burada klavyeyle girilen geçersiz
       değerin kapısını açıyor. Yazmak gerekiyorsa `field` var. */
    return (
      <span
        {...dataProps(rest)}
        className={cn("tamga-qty", full && "w-full", className)}
        data-disabled={disabled || undefined}
      >
        <button
          type="button"
          aria-label={labels.decrease}
          disabled={disabled || atMin}
          onClick={() => bump(-1)}
        >
          {/* OPERATÖR GLİFİ KALIN, duotone DEĞİL: duotone ikinci katmanı daha
              sessiz çiziyor ve artı/eksi gibi tek çizgili bir işaret orada
              soluk bir taslağa dönüşüyor · tasarım da burada `bold` yazıyor. */}
          <Icon icon={Minus} size="sm" weight="bold" />
        </button>
        <span className="tamga-qty-deger tabular-nums" aria-live="polite">
          {goster(value)}
          {suffix ? <span className="tamga-qty-birim">{suffix}</span> : null}
        </span>
        <button
          type="button"
          aria-label={labels.increase}
          disabled={disabled || atMax}
          onClick={() => bump(1)}
        >
          <Icon icon={Plus} size="sm" weight="bold" />
        </button>
      </span>
    );
  }

  return (
    <span {...dataProps(rest)} className={cn("relative inline-flex items-center", full && "w-full", className)}>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={taslak ?? goster(value)}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={(e) => {
          setTaslak(e.target.value);
          /* Binlik ayracı temizleniyor, ondalık ayracı noktaya çevriliyor:
             kullanıcı "1.234,5" de yazabilir "1234.5" de. */
          const raw = e.target.value.replace(/\s/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", ".");
          if (raw === "") return onChange?.(null);
          const n = Number(raw);
          if (!Number.isNaN(n)) onChange?.(n);
        }}
        onBlur={() => {
          setTaslak(null);
          if (value !== null) onChange?.(clamp(value));
        }}
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
        /* Sağ boşluk spinner'ın genişliği (38px) artı kenar payı; birim varsa
           onun yeri de eklenir. Elle sayı yazmak yerine hesaplanıyor, çünkü
           birim "₺" da olabilir "adet" de. */
        className={cn("tamga-input tamga-sayi w-full", invalid && "tamga-input-invalid")}
        style={{ paddingRight: suffix ? 96 : 48 }}
      />

      {suffix ? (
        <span className="tamga-stepper-birim">{suffix}</span>
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
          <Icon icon={CaretDown} size="xs" weight="bold" className="rotate-180" />
        </button>
        <button
          type="button"
          aria-label={labels.decrease}
          aria-controls={id}
          disabled={disabled || atMin}
          onClick={() => bump(-1)}
        >
          <Icon icon={CaretDown} size="xs" weight="bold" />
        </button>
      </span>
    </span>
  );
}
