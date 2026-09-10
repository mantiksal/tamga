import { neutral, toneOf, type Tone } from "./tone.js";

/**
 * Sparkline — satır içi, eksensiz mini grafik.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */
export function Sparkline({
  values,
  tone = "neutral",
  width = 108,
  height = 30,
}: {
  values: number[];
  /**
   * Colour's job here is to report a status. A neutral line takes ink-faint. TR: Rengin işi
   * durum bildirmek. Nötr olan çizgi rengini ink-faint alır.
   */
  tone?: Tone;
  width?: number;
  height?: number;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);
  const y = (v: number) => height - 2 - ((v - min) / span) * (height - 4);

  const line = values.map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${y(v)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const t = toneOf(tone);
  const stroke = tone === "neutral" || tone === "positive" ? neutral.muted : t.mark;

  return (
    <svg
      className="w-full"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      shapeRendering="crispEdges"
    >
      <path d={area} style={{ fill: t.bg }} />
      <path d={line} fill="none" style={{ stroke }} strokeWidth="1.5" shapeRendering="geometricPrecision" />
      <rect
        x={width - 2.5}
        y={y(values[values.length - 1] ?? 0) - 2.5}
        width="5"
        height="5"
        style={{ fill: stroke }}
      />
      <line x1="0" y1={height} x2={width} y2={height} style={{ stroke: neutral.line }} strokeWidth="1" />
    </svg>
  );
}
