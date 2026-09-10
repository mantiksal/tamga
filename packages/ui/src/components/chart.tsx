"use client";

import { useId, useState } from "react";
import { cn } from "../lib/cn.js";
import { toneOf, type Tone } from "./tone.js";

/**
 * Çizgi grafik — eksenli, gerçek grafik.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */

export type Series = {
  /**
   * The line's name; the legend and the screen reader use it. TR: Çizginin adı; legend ve ekran
   * okuyucu bunu kullanır.
   */
  name: string;
  values: readonly number[];
  /**
   * A STATUS tone: for when a line says something good or bad. LEFT OUT, THE CATEGORICAL
   * PALETTE is used, and that is a correction. Every series without a tone used to fall to
   * `neutral`: plotting three products' daily sales drew three lines in the SAME faint grey,
   * with no way to match the legend's names to them. A series is often not a status but a
   * CATEGORY (product, store, channel), and a category's colour comes from the palette. TR:
   * DURUM tonu: bir çizgi iyi ya da kötü bir şeyi anlatıyorsa. VERİLMEZSE KATEGORİK PALET
   * kullanılıyor, ve bu bir düzeltme. Önce ton verilmeyen her seri `neutral`a düşüyordu: üç
   * ürünün günlük satışını çizdiğinde üç çizgi de AYNI soluk griydi ve legend'daki adları
   * çizgilere eşleştirmenin hiçbir yolu yoktu. Bir seri çoğu zaman bir durum değil bir
   * KATEGORİDİR (ürün, mağaza, kanal), ve kategorinin rengi paletten gelir.
   */
  tone?: Tone;
};

/** Ton verilmemiş serinin rengi: sırayla kategorik palet. */
function seriRengi(s: Series, i: number): string {
  return s.tone ? toneOf(s.tone).mark : `var(--color-chart-${(i % 5) + 1})`;
}

/** Sayıyı ızgara çizgisine yuvarlar: 87 → 100, 412 → 500. */
function niceMax(v: number): number {
  if (v <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / mag) * mag;
}

export function LineChart({
  series,
  labels,
  height = 200,
  formatValue = String,
  className,
}: {
  series: readonly Series[];
  /**
   * The marks under the X axis. The caller formats the numbers. TR: X ekseninin altındaki
   * işaretler. Sayıları çağıran biçimlendirir.
   */
  labels: readonly string[];
  height?: number;
  /**
   * "24ms", "98%"; the unit comes from the caller, the kit knows no units. TR: "24ms", "%98";
   * birim çağırandan gelir, kit birim bilmez.
   */
  formatValue?: (v: number) => string;
  className?: string;
}) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);

  const all = series.flatMap((s) => [...s.values]);
  const max = niceMax(Math.max(1, ...all));
  const count = Math.max(...series.map((s) => s.values.length), 1);

  /* viewBox birim kare: SVG ölçeklenirken çizgi kalınlığı bozulmasın diye
     `vector-effect` kullanılıyor, koordinatlar yüzde üzerinden. */
  const W = 100;
  const H = 100;
  const x = (i: number) => (count === 1 ? W / 2 : (i / (count - 1)) * W);
  const y = (v: number) => H - (v / max) * H;

  /* Dört ızgara çizgisi: daha azı okumayı zorlaştırır, daha çoğu grafiği
     kafese çevirir. */
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => max * f);

  return (
    <figure className={cn("tamga-surface p-4", className)}>
      <div className="flex gap-3">
        {/* Y ekseni ETİKETLERİ SVG'nin DIŞINDA. İçine konsaydı viewBox
            ölçeklendikçe yazı da ölçeklenir ve dar ekranda okunmaz olurdu. */}
        <div
          className="flex shrink-0 flex-col justify-between text-right font-mono text-caption text-ink-faint tabular-nums"
          style={{ height }}
          aria-hidden
        >
          {[...ticks].reverse().map((t) => (
            <span key={t}>{formatValue(Math.round(t))}</span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            style={{ height, width: "100%" }}
            role="img"
            aria-labelledby={id}
            onMouseLeave={() => setHover(null)}
          >
            <title id={id}>
              {series.map((s) => `${s.name}: ${formatValue(s.values[s.values.length - 1] ?? 0)}`).join(" · ")}
            </title>

            {ticks.map((t) => (
              <line
                key={t}
                x1={0}
                x2={W}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--color-line)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {series.map((s, si) => {
              const renk = seriRengi(s, si);
              const d = s.values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)} ${y(v)}`).join(" ");
              return (
                <path
                  key={s.name}
                  d={d}
                  fill="none"
                  stroke={renk}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            {/* Fare için görünmez şeritler: noktaların kendisini hedef yapmak
                iki piksellik bir hedef demek olurdu. */}
            {Array.from({ length: count }, (_, i) => (
              <rect
                key={i}
                x={x(i) - W / count / 2}
                y={0}
                width={W / count}
                height={H}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
            ))}

            {hover !== null ? (
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={0}
                y2={H}
                stroke="var(--color-ink-faint)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ) : null}
          </svg>

          <div className="mt-1 flex justify-between font-mono text-caption text-ink-faint" aria-hidden>
            {labels.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
        {series.map((s, si) => {
          const renk = seriRengi(s, si);
          const v = hover !== null ? s.values[hover] : s.values[s.values.length - 1];
          return (
            <span key={s.name} className="flex items-center gap-2 text-small text-ink-soft">
              <span aria-hidden className="h-0.5 w-4" style={{ background: renk }} />
              {s.name}
              <span className="font-mono text-ink tabular-nums">{formatValue(v ?? 0)}</span>
            </span>
          );
        })}
      </figcaption>
    </figure>
  );
}
