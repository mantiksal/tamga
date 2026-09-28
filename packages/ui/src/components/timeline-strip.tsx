import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import type { IconGlyph } from "./icons.js";
import { toneOf, type Tone } from "./tone.js";

/**
 * TimelineStrip — kova başına bir işaret, renk durumu taşır.
 *
 * Gerekçe: docs/gerekce/02-veri-ve-liste.md
 */
export type TimelineStep = {
  label: string;
  /** Pre-formatted; the kit knows no time format. TR: Önceden biçimlendirilmiş; kit saat biçimi bilmez. */
  time?: string;
  icon?: IconGlyph;
  /**
   * `done` behind us, `current` where it stands now, `todo` not yet. The line between the steps
   * is accent up to `current` and quiet after it · what a strip like this answers is "how far
   * did it get". TR: `done` arkada kalan, `current` şu an durduğu yer, `todo` henüz olmayan.
   * Adımlar arasındaki çizgi `current`a kadar vurgu, sonrası sessiz · böyle bir şeridin cevabı
   * "nereye kadar geldi".
   */
  state?: "done" | "current" | "todo";
} & Record<string, unknown>;

export function TimelineStrip({
  data,
  steps,
  height = 32,
  gap = 2,
  minWidth = 3,
  /** Şeridin iki ucundaki zaman etiketi — "90 gün önce" · "bugün". */
  labels,
  /** Her kovanın erişilebilir açıklaması. Kit çeviri çekmez. */
  describe,
  className,
  ...rest
}: {
  /** The buckets, one tone each · a run of health over time. TR: Kovalar, her biri bir ton · zaman içinde sağlık dizisi. */
  data?: readonly Tone[];
  /**
   * The events, in order · given, the strip draws a line of steps instead of buckets. Two shapes
   * of the same question ("what happened along this line"): one measures a RUN, the other names
   * the STATIONS. TR: Olaylar, sırayla · verilirse şerit kovalar yerine adımlardan oluşan bir
   * çizgi çiziyor. Aynı sorunun iki biçimi ("bu çizgi boyunca ne oldu"): biri bir AKIŞI ölçüyor,
   * öteki DURAKLARI adlandırıyor.
   */
  steps?: readonly TimelineStep[];
  height?: number;
  gap?: number;
  minWidth?: number;
  labels?: [string, string];
  describe?: (index: number, tone: Tone) => string;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  if (steps?.length) {
    /* ÇİZGİ İKİ PARÇA: arkada sessiz olan baştan sona, üstünde vurgu olan
       `current`a kadar · tek bir çizgiyi renklendirmek "nereye kadar geldi"
       sorusunu okutmuyordu. Çizgi ilk ve son ikonun ORTASINDA duruyor
       (kenarlardan %8), yoksa şeridin dışına taşıyor. */
    const suAn = steps.findIndex((s) => s.state === "current");
    const gecen = suAn < 0 ? steps.length - 1 : suAn;
    const oran = steps.length > 1 ? (gecen / (steps.length - 1)) * 84 : 0;
    return (
      <div {...dataProps(rest)} className={cn("tamga-zaman", className)}>
        <div
          className="tamga-zaman-izgara"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(120px, 1fr))` }}
        >
          <span className="tamga-zaman-yol" />
          <span className="tamga-zaman-yol tamga-zaman-yol-gecen" style={{ width: `${oran}%` }} />
          {steps.map(({ label, time, icon, state = "todo", ...kanca }) => (
            <div {...kanca} key={label} className="tamga-zaman-adim">
              <span className="tamga-zaman-karo" data-state={state}>
                {icon ? <Icon icon={icon} size="xs" weight="bold" /> : null}
              </span>
              <strong className="text-small">{label}</strong>
              {time ? <span className="font-mono text-caption text-ink-faint">{time}</span> : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div {...dataProps(rest)} className={className}>
      <div className="flex items-end" style={{ gap }}>
        {(data ?? []).map((tone, i) => (
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
