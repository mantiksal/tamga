"use client";

import { useState } from "react";
import { cn } from "../lib/cn.js";

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
}: {
  bars: readonly Bar[];
  formatValue?: (v: number) => string;
  /**
   * The width of the name column; the caller picks it from the longest name. TR: Ad sütununun
   * genişliği; en uzun ada göre çağıran seçiyor.
   */
  labelWidth?: string;
  className?: string;
}) {
  const enBuyuk = niceMax(Math.max(0, ...bars.map((b) => b.value)));
  /* SATIRIN TAMAMI VURGULANIYOR, yalnız çubuk değil: uzun bir listede gözün
     kaydığı şey satır. Ad solda, sayı sağda, arada bir metre uzunluğunda
     çubuk var; hangi adın hangi sayıya ait olduğunu takip etmek zorlaşıyor ve
     satır zemini o izi tutuyor. */
  const [uzerinde, setUzerinde] = useState<string | null>(null);

  return (
    <div className={cn("flex flex-col gap-0.5", className)} onMouseLeave={() => setUzerinde(null)}>
      {bars.map((b) => {
        const oran = enBuyuk > 0 ? b.value / enBuyuk : 0;
        const secili = uzerinde === b.label;
        return (
          <div
            key={b.label}
            className="grid cursor-default items-center gap-3 rounded-(--radius-mark) px-1.5 py-1 transition-[background] duration-(--duration-press)"
            style={{
              gridTemplateColumns: `${labelWidth} minmax(0,1fr) auto`,
              background: secili ? "var(--color-hover)" : undefined,
            }}
            onMouseEnter={() => setUzerinde(b.label)}
          >
            <span
              className="truncate text-right text-small"
              style={{ color: secili ? "var(--color-ink)" : "var(--color-ink-soft)" }}
              title={b.label}
            >
              {b.label}
            </span>
            {/* Çubuğun ardında SOLUK BİR RAY var: bir çubuğun ne kadarının
                dolu olduğu, ancak kabı görünürse okunuyor. */}
            <span className="relative block h-4 rounded-(--radius-mark) bg-[var(--color-chart-fill)]">
              <span
                className="absolute inset-y-0 left-0 rounded-(--radius-mark) transition-[background] duration-(--duration-press)"
                style={{
                  width: `${Math.max(oran * 100, b.value > 0 ? 1.5 : 0)}%`,
                  /* Üzerine gelinen çubuk bir kademe koyu: aynı hue, farklı
                     ton. Renk değiştirmek çubuğu başka bir seriye ait
                     gösterirdi. */
                  background: secili ? "var(--color-accent-line)" : "var(--color-chart-3)",
                }}
              />
            </span>
            {/* SAYI ÇUBUĞUN İÇİNDE DEĞİL SAĞINDA. İçinde olsaydı kısa
                çubuklarda sığmaz, ve sığdığı yerde de zemine göre kontrastı
                çubuğun uzunluğuna bağlı olurdu. */}
            <span
              className="tabular-nums text-small"
              style={{ color: secili ? "var(--color-ink)" : "var(--color-ink-soft)" }}
            >
              {formatValue(b.value)}
              {b.note && <span className="ml-1.5 text-ink-faint">{b.note}</span>}
            </span>
          </div>
        );
      })}
      {bars.length === 0 && <p className="text-ink-faint">Gösterilecek veri yok.</p>}
    </div>
  );
}
