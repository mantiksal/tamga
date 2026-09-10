import { toneOf, type Tone } from "./tone.js";

/**
 * TimelineStrip — kova başına bir işaret, renk durumu taşır.
 *
 * Gerekçe: docs/gerekce/02-veri-ve-liste.md
 */
export function TimelineStrip({
  data,
  height = 32,
  gap = 2,
  minWidth = 3,
  /** Şeridin iki ucundaki zaman etiketi — "90 gün önce" · "bugün". */
  labels,
  /** Her kovanın erişilebilir açıklaması. Kit çeviri çekmez. */
  describe,
}: {
  data: readonly Tone[];
  height?: number;
  gap?: number;
  minWidth?: number;
  labels?: [string, string];
  describe?: (index: number, tone: Tone) => string;
}) {
  return (
    <div>
      <div className="flex items-end" style={{ gap }}>
        {data.map((tone, i) => (
          <span
            key={i}
            title={describe?.(i, tone)}
            className="flex-1 transition-opacity hover:opacity-60"
            style={{ height, minWidth, background: toneOf(tone).mark }}
          />
        ))}
      </div>
      {labels ? (
        <div className="mt-2 flex justify-between">
          <span className="font-mono text-micro text-ink-faint">{labels[0]}</span>
          <span className="font-mono text-micro text-ink-faint">{labels[1]}</span>
        </div>
      ) : null}
    </div>
  );
}
