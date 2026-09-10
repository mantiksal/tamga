"use client";

import { cn } from "../lib/cn.js";
import { OFF } from "./control-base.js";

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
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!on)}
      className={cn("tamga-switch", className)}
      data-on={on}
      style={disabled ? OFF : undefined}
    >
      {/* Topuz. CSS onu `> span` ile hedefliyor ve `data-on` geldiğinde 16px
          kaydırıyor — yani anahtarın hareket eden yarısı bu eleman. Boş bir
          <button/> render etmek zemini renklendirir ama topuzu hiç çizmez:
          anahtar "açık" görünür, ama AÇILDIĞI görünmez. */}
      <span aria-hidden />
    </button>
  );
}
