import { neutral, toneOf, type Tone } from "./tone.js";

/**
 * Sparkline · eksensiz mini çizgi, tek soru: YÖN NE. Etkileşim yok ve alan
 * dolgusu da yok: ikisi de eksensiz bir çizgiye ölçek taklidi verir.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */
export function Sparkline({
  values,
  tone = "neutral",
  width = 108,
  height = 30,
  mark = false,
}: {
  values: number[];
  /**
   * Colour's job here is to report a status. A neutral line takes ink-faint. TR: Rengin işi
   * durum bildirmek. Nötr olan çizgi rengini ink-faint alır.
   */
  tone?: Tone;
  width?: number;
  height?: number;
  /**
   * A 5px square on the last point: where the line ENDED. Off by default, because in a column of
   * sparklines it repeats on every row. TR: Son noktada 5px kare: çizginin NEREDE bittiği. Kapalı
   * geliyor, çünkü bir sütun dolusu sparkline'da her satırda tekrar ediyor.
   */
  mark?: boolean;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);
  const y = (v: number) => height - 2 - ((v - min) / span) * (height - 4);

  const line = values.map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${y(v)}`).join(" ");
  const t = toneOf(tone);
  /* YÜKSELEN ÇİZGİ VURGU RENGİNDE, gri değil · `Delta` çipinde yazılı olan
     kararın aynısı: `positive` yeşili bir DURUM rengi ("çözüldü"), oysa
     yükselen bir eğilim bir durum değil bir hareket. Nötr olan sessiz kalıyor;
     bir eğilim çizgisinin rengi ancak iyi ya da kötü haber verdiğinde var. */
  const stroke =
    tone === "neutral" ? neutral.muted : tone === "positive" ? "var(--color-accent)" : t.mark;

  return (
    <svg
      className="w-full"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={line}
        fill="none"
        style={{ stroke }}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {mark ? (
        <rect
          x={width - 2.5}
          y={y(values[values.length - 1] ?? 0) - 2.5}
          width="5"
          height="5"
          style={{ fill: stroke }}
        />
      ) : null}
    </svg>
  );
}
