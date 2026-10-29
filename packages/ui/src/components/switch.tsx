"use client";

import { useId } from "react";
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
  showLabel = false,
  description,
  id: verilenId,
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
  /**
   * Writes `label` beside the switch: the question on the left, the switch answering it right
   * after it. A switch alone does not say what it turns on, and every settings screen was
   * building this row by hand. Clicking the question flips the switch. TR: `label`'ı anahtarın
   * yanına yazar: soru solda, onu cevaplayan anahtar hemen ardında. Tek başına bir anahtar neyi
   * açtığını söylemiyor, ve her ayar ekranı bu satırı elle kuruyordu. Soruya tıklamak anahtarı
   * çevirir.
   */
  showLabel?: boolean;
  /**
   * The consequence under the question: "Visitors see a theme button". Read with the switch
   * (`aria-describedby`). Only with `showLabel`. TR: Sorunun altındaki sonuç: "Ziyaretçi tema
   * düğmesini görür". Anahtarla birlikte okunur (`aria-describedby`). Yalnız `showLabel` ile.
   */
  description?: string;
  /** The switch's id, when something outside points at it. TR: Dışarıdan bir şey ona işaret ediyorsa anahtarın id'si. */
  id?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const uretilen = useId();
  const id = verilenId ?? uretilen;
  const anahtar = (
    <button
{...(showLabel ? {} : dataProps(rest))}
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={showLabel ? undefined : label}
      aria-labelledby={showLabel ? `${id}-ad` : undefined}
      aria-describedby={showLabel && description ? `${id}-not` : undefined}
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
  if (!showLabel) return anahtar;
  /* SORU BİR `<label>`: tıklanınca anahtarı çeviriyor ve adını o veriyor. Açıklama
     etiketin DIŞINDA, yoksa her açıklama anahtarın adının parçası okunurdu. */
  return (
    /* Satır biçiminde kancalar SATIRDA: sunulan öğe artık bu, ve aynı kanca iki
       elemanda dursaydı bir test hangisine tıkladığını bilemezdi. */
    /* ANAHTAR SORUSUNUN HEMEN YANINDA, ortada: satırın sonuna itildiğinde geniş bir kartta
       cevapladığı sorudan bir ekran uzakta duruyordu. */
    <span {...dataProps(rest)} className="flex items-center gap-6" data-switch-row>
      <span className="flex min-w-0 flex-col gap-0.5">
        <label id={`${id}-ad`} htmlFor={id} className={cn("text-body font-bold", disabled ? "text-ink-faint" : "cursor-pointer text-ink")}>
          {label}
        </label>
        {description ? (
          <span id={`${id}-not`} className="text-small leading-relaxed text-ink-soft">
            {description}
          </span>
        ) : null}
      </span>
      {anahtar}
    </span>
  );
}
