"use client";

import { useState } from "react";
import { cn } from "../lib/cn.js";

/**
 * Yığılmış sütun grafiği — HER GÜN İÇİN HEM TOPLAM HEM KIRILIM.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */

export type StackSeries = {
  name: string;
  values: readonly number[];
};

/** Sayıyı ızgara çizgisine yuvarlar: 87 → 100, 412 → 500. */
function niceMax(v: number): number {
  if (v <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / mag) * mag;
}

export function StackedBarChart({
  series,
  labels,
  height = 260,
  formatValue = String,
  className,
}: {
  series: readonly StackSeries[];
  /**
   * The marks on the X axis; the same length as `series[n].values`. TR: X eksenindeki
   * işaretler; `series[n].values` ile aynı uzunlukta.
   */
  labels: readonly string[];
  height?: number;
  formatValue?: (v: number) => string;
  className?: string;
}) {
  const [uzerinde, setUzerinde] = useState<number | null>(null);

  const toplamlar = labels.map((_, i) => series.reduce((n, s) => n + (s.values[i] ?? 0), 0));
  const enBuyuk = niceMax(Math.max(0, ...toplamlar));
  /* Dört ızgara çizgisi: daha fazlası okumayı kolaylaştırmıyor, zemini
     kirletiyor. */
  const cizgiler = [0, 0.25, 0.5, 0.75, 1].map((o) => enBuyuk * o);

  return (
    <figure className={cn("flex flex-col", className)}>
      <div className="flex gap-3" style={{ height }}>
        {/* Y ekseni etiketleri: en üstte en büyük. */}
        <div className="flex shrink-0 flex-col justify-between py-1 text-right text-micro tabular-nums text-ink-faint">
          {[...cizgiler].reverse().map((v) => (
            <span key={v}>{formatValue(v)}</span>
          ))}
        </div>

        <div
          className="relative min-w-0 flex-1"
          onMouseLeave={() => setUzerinde(null)}
        >
          {/* Izgara çizgileri sütunların ARDINDA: önünde olsaydı dilimleri
              böler ve renkleri okunmaz hâle getirirdi. */}
          {cizgiler.map((v, i) => (
            <span
              key={v}
              aria-hidden
              className="absolute inset-x-0 h-px bg-[var(--color-line)]"
              style={{ bottom: `${(i / (cizgiler.length - 1)) * 100}%` }}
            />
          ))}

          <div className="absolute inset-0 flex items-end gap-1">
            {labels.map((etiket, i) => {
              const toplam = toplamlar[i] ?? 0;
              const secili = uzerinde === i;
              return (
                <div
                  key={etiket}
                  className="flex h-full min-w-0 flex-1 cursor-default flex-col justify-end"
                  onMouseEnter={() => setUzerinde(i)}
                >
                  {/* Dilimler YUKARIDAN AŞAĞI diziliyor ki `flex-col`da
                      serilerin sırası legend'daki sırayla aynı olsun. */}
                  {[...series].reverse().map((s, ri) => {
                    const si = series.length - 1 - ri;
                    const v = s.values[i] ?? 0;
                    if (v <= 0) return null;
                    return (
                      <span
                        key={s.name}
                        className="w-full transition-opacity duration-(--duration-press)"
                        style={{
                          height: `${(v / enBuyuk) * 100}%`,
                          background: `var(--color-chart-${(si % 5) + 1})`,
                          opacity: uzerinde === null || secili ? 1 : 0.45,
                        }}
                      />
                    );
                  })}
                  {/* Toplam sütunun ÜSTÜNDE, yalnız üzerine gelince: her
                      sütunda sürekli duran bir sayı, otuz günde otuz sayı
                      demek ve grafiği tabloya çevirir. */}
                  {secili && toplam > 0 && (
                    <span className="pointer-events-none absolute -translate-y-full whitespace-nowrap rounded-(--radius-mark) bg-[var(--color-ink)] px-1.5 py-0.5 text-micro tabular-nums text-[var(--color-page)]"
                      style={{ bottom: `${(toplam / enBuyuk) * 100}%` }}
                    >
                      {formatValue(toplam)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X ekseni: ARALIK UZUNLUĞA GÖRE.
          Sabit "beşte bir" kuralı iki uçta da bozuluyordu: dokuz günlük bir
          ayda üç etiket kalıyor (oysa dokuzu da sığar), otuz bir günlükte
          yedi etiket birbirine giriyor. On iki etiketi hedefleyen bir aralık
          ikisini de çözüyor, ve ilk ile son her zaman yazılıyor. */}
      <div className="mt-2 flex gap-1 text-micro tabular-nums text-ink-faint">
        {labels.map((e, i) => {
          const aralik = Math.max(1, Math.ceil(labels.length / 12));
          const yaz = i === 0 || i === labels.length - 1 || i % aralik === 0;
          return (
            <span key={e} className="min-w-0 flex-1 truncate text-center">
              {yaz ? e : ""}
            </span>
          );
        })}
      </div>

      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
        {series.map((s, i) => {
          const v = uzerinde !== null ? (s.values[uzerinde] ?? 0) : s.values.reduce((a, b) => a + b, 0);
          return (
            <span key={s.name} className="flex items-center gap-2 text-small text-ink-soft">
              <span
                aria-hidden
                className="size-2.5 rounded-(--radius-mark)"
                style={{ background: `var(--color-chart-${(i % 5) + 1})` }}
              />
              {s.name}
              <span className="font-mono tabular-nums text-ink">{formatValue(v)}</span>
            </span>
          );
        })}
      </figcaption>
    </figure>
  );
}
