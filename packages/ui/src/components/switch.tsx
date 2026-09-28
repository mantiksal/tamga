"use client";

import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";

/* ---------------------------------------------------------------- *
 * Switch — akranlar arası seçim DEĞİL, açık/kapalı durumu.
 *
 * Dolgu burada Yasa 2'nin üçüncü bilinçli istisnası: dolu iz metaforun
 * kendisidir, bir devrenin kapalı olması demektir.
 * ---------------------------------------------------------------- */
export function Switch({
  on,
  onChange,
  label,
  disabled = false,
  className,
  compact = false,
  ...rest
}: {
  on: boolean;
  onChange?: (next: boolean) => void;
  /**
   * The accessible name. There is no text inside a switch; without it, it is nameless. TR:
   * Erişilebilir ad. Anahtarın içinde metin yoktur; onsuz adsızdır.
   */
  label: string;
  disabled?: boolean;
  className?: string;
  /**
   * The switch a TABLE row wears. TR: Bir TABLO satırının giydiği anahtar.
   *
   * Smaller, and its layer is a step shallower. A form switch answers one
   * question on a settings page and can afford the room; in a table it is one
   * of twenty-five down a column, and at full size it is the tallest thing in
   * the row · the row's rhythm ends up set by a control rather than by its
   * content. TR: Daha küçük, ve katmanı bir basamak sığ. Form anahtarı bir
   * ayarlar sayfasında tek bir soruyu yanıtlıyor ve yeri var; tabloda ise bir
   * sütunda yirmi beş taneden biri, ve tam boyunda satırın en uzun şeyi oluyor
   * · satırın ritmini içeriği değil bir kontrol belirliyor.
   */
  compact?: boolean;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <button
{...dataProps(rest)}
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!on)}
      className={cn("tamga-switch", compact && "tamga-switch-sm", className)}
      data-on={on && !disabled}
      data-off={disabled || undefined}
    >
      {/* Topuz. CSS onu `> span` ile hedefliyor ve `data-on` geldiğinde 16px
          kaydırıyor — yani anahtarın hareket eden yarısı bu eleman. Boş bir
          <button/> render etmek zemini renklendirir ama topuzu hiç çizmez:
          anahtar "açık" görünür, ama AÇILDIĞI görünmez. */}
      <span aria-hidden />
    </button>
  );
}
