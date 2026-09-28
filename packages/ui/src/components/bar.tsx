"use client";

import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";

/**
 * Yatay çubuk grafik — SIRALAMA ve KARŞILAŞTIRMA.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */

export type Bar = {
  label: string;
  value: number;
  /**
   * The second, faint value beside the number: usually a share ("2.4%"). WHY THE COMPONENT DOES
   * NOT COMPUTE IT. In a bar chart the DENOMINATOR of a share is usually NOT the sum of the
   * rows drawn: in "top ten customers by orders" the meaningful denominator is every order in
   * the period, not the sum of those ten. The component cannot know the denominator, and if it
   * guessed it would guess wrong. TR: Sayının yanındaki ikinci, soluk değer: genelde bir pay
   * ("%2.4"). NEDEN BİLEŞEN HESAPLAMIYOR. Bir çubuk grafikte payın PAYDASI çoğu zaman çizilen
   * satırların toplamı DEĞİLDİR: "en çok sipariş veren on müşteri"de anlamlı payda dönemin
   * bütün siparişleridir, o on kişinin toplamı değil. Paydayı bileşen bilemez; bilse de yanlış
   * bilir.
   */
  note?: string;
};

/** Sayıyı ızgara çizgisine yuvarlar: 87 → 100, 412 → 500. */
function niceMax(v: number): number {
  if (v <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / mag) * mag;
}

export function BarChart({
  bars,
  formatValue = String,
  labelWidth = "10rem",
  className,
  ...rest
}: {
  bars: readonly Bar[];
  formatValue?: (v: number) => string;
  /**
   * The width of the name column; the caller picks it from the longest name. TR: Ad sütununun
   * genişliği; en uzun ada göre çağıran seçiyor.
   */
  labelWidth?: string;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const enBuyuk = niceMax(Math.max(0, ...bars.map((b) => b.value)));

  return (
    <div {...dataProps(rest)} className={cn("tamga-bar", className)}>
      {bars.map((b) => {
        const oran = enBuyuk > 0 ? b.value / enBuyuk : 0;
        return (
          <div key={b.label} className="tamga-bar-row" style={{ gridTemplateColumns: `${labelWidth} minmax(0,1fr) auto` }}>
            <span className="tamga-bar-ad" title={b.label}>
              {b.label}
            </span>
            <span className="tamga-bar-yol">
              <span
                className="tamga-bar-dolgu"
                style={{ width: `${Math.max(oran * 100, b.value > 0 ? 2 : 0)}%` }}
              />
            </span>
            {/* SAYI ÇUBUĞUN İÇİNDE DEĞİL SAĞINDA. İçinde olsaydı kısa
                çubuklarda sığmaz, ve sığdığı yerde de zemine göre kontrastı
                çubuğun uzunluğuna bağlı olurdu. */}
            <span className="tamga-bar-deger">
              {formatValue(b.value)}
              {b.note && <span className="tamga-bar-not">{b.note}</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}
