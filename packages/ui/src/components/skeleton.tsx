/**
 * Skeletons.
 *
 * Gerekçe: docs/gerekce/04-bos-ve-hata.md
 */

const STEP = 70;
const MAX_STEPS = 6;

function delay(i = 0): React.CSSProperties {
  return { ["--tamga-delay" as string]: `${(i % MAX_STEPS) * STEP}ms` };
}

export function Skeleton({
  className = "",
  index = 0,
  style,
}: {
  className?: string;
  index?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`tamga-skeleton block ${className}`} style={{ ...delay(index), ...style }} />
  );
}

/** Paragraph copy. The last line is always short — real text ends mid-line. */
export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  const widths = ["100%", "96%", "92%", "98%"];
  return (
    <span className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          index={i}
          className="h-3"
          style={{ width: i === lines - 1 ? "62%" : widths[i % widths.length] }}
        />
      ))}
    </span>
  );
}

/**
 * A list row. Mirrors `.tamga-list-row` exactly, including the 56px height, so the
 * skeleton list and the real list are the same object with the text removed.
 */
export function SkeletonRows({
  rows = 5,
  dense = false,
}: {
  rows?: number;
  dense?: boolean;
}) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className={`tamga-list-row ${dense ? "tamga-list-row-sm" : ""}`}
          aria-hidden
        >
          <Skeleton index={i} className="size-2.5 shrink-0" />
          <Skeleton index={i} className="h-3 w-40 shrink-0" />
          <Skeleton index={i} className="h-3 min-w-0 flex-1 max-w-28" />
          <Skeleton index={i} className="ml-auto h-3 w-14 shrink-0" />
        </div>
      ))}
    </>
  );
}

/**
 * The KPI tile: icon tile, label, big number.
 *
 * TR: İSKELET KARONUN KENDİSİYLE AYNI KALIPTA. `Kpi` ikon karosu alınca bu
 * iskelet eski hâlinde kaldıysa yükleme bittiğinde içerik yana zıplıyor, ve
 * bir iskeletin tek işi o zıplamayı önlemek. Bu yüzden ikisi aynı sınıfı
 * (`tamga-kpi`) paylaşıyor: kalıp bir yerde değişince ikisi birden değişiyor.
 */
export function SkeletonKpi({ index = 0 }: { index?: number }) {
  return (
    <section className="tamga-kpi" aria-hidden>
      <Skeleton index={index} className="size-10 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Skeleton index={index + 1} className="h-2.5 w-20" />
        <Skeleton index={index + 2} className="mt-2 h-7 w-24" />
      </div>
    </section>
  );
}

/** A card with a section head and a body area of a given height. */
export function SkeletonCard({
  height = 220,
  title = true,
}: {
  height?: number;
  title?: boolean;
}) {
  return (
    <section className="tamga-card flex min-w-0 flex-col" aria-hidden>
      {title ? (
        /* tamga-section, not just tamga-head — the closing rule lives on tamga-section,
           which is what the real SectionHead pairs them for. */
        <div className="tamga-head tamga-section tamga-gutter flex flex-nowrap items-center gap-3">
          <Skeleton className="h-3.5 w-32 shrink-0" />
          <Skeleton index={1} className="h-2.5 min-w-0 flex-1 max-w-20" />
          <Skeleton index={2} className="ml-auto h-6 w-20 shrink-0" />
        </div>
      ) : null}
      <div className="tamga-gutter flex-1 py-5">
        <Skeleton index={3} className="w-full" style={{ height }} />
      </div>
    </section>
  );
}

/** A table: header rule plus n body rows across the given column widths. */
export function SkeletonTable({
  rows = 6,
  cols = ["12rem", "5rem", "6rem", "4rem", "5rem"],
}: {
  rows?: number;
  cols?: string[];
}) {
  return (
    <div className="tamga-card overflow-hidden" aria-hidden>
      {/* Cells are flexible with the column width as a CEILING, not a fixed size.
          Fixed rem widths overflow the row — or wrap the header, since tamga-head
          wraps — the moment the card is narrower than their sum. */}
      <div className="tamga-head tamga-section tamga-gutter flex flex-nowrap items-center gap-6">
        {cols.map((w, i) => (
          <Skeleton
            key={i}
            index={i}
            className="h-2.5 min-w-0 flex-1"
            style={{ maxWidth: w }}
          />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="tamga-list-row flex flex-nowrap items-center gap-6">
          {cols.map((w, i) => (
            <Skeleton
              key={i}
              index={r + i}
              className="h-3 min-w-0 flex-1"
              style={{ maxWidth: w }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Panel contents.
 *
 * A panel that opens before its data arrives is the one place a spinner is most
 * tempting and most wrong: the panel already has a known width and a known row
 * height, so there is a real shape to hold. A spinner throws that away and then
 * makes the whole panel jump when the rows land.
 *
 * Matches `.tamga-option` — 40px tall, 16px side padding, icon slot then label.
 */
export function SkeletonOptions({ rows = 4 }: { rows?: number }) {
  const widths = ["68%", "84%", "56%", "76%", "64%"];
  return (
    <div className="py-1" aria-hidden>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex h-10 items-center gap-2 px-4">
          <Skeleton index={i} className="size-4 shrink-0" />
          <Skeleton
            index={i}
            className="h-3 min-w-0 flex-1"
            style={{ maxWidth: widths[i % widths.length] }}
          />
        </div>
      ))}
    </div>
  );
}

/** Free-form panel body — popover, dialog, sheet. */
export function SkeletonPanel({
  lines = 3,
  block,
}: {
  lines?: number;
  /**
   * height of a leading block (a chart, a map, an avatar row) if the panel has one TR: panelde
   * varsa baştaki bloğun (bir grafik, bir harita, bir avatar satırı) yüksekliği
   */
  block?: number;
}) {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      {block ? <Skeleton className="w-full" style={{ height: block }} /> : null}
      <SkeletonText lines={lines} />
    </div>
  );
}

/** Page band: title, subtitle, and the actions that sit on the right. */
export function SkeletonPageBand() {
  return (
    <div className="tamga-section tamga-gutter flex flex-wrap items-center gap-4 py-4" aria-hidden>
      <div className="min-w-0">
        <Skeleton className="h-4 w-40" />
        <Skeleton index={1} className="mt-2 h-2.5 w-64" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Skeleton index={2} className="h-10 w-32" />
        <Skeleton index={3} className="h-10 w-36" />
      </div>
    </div>
  );
}
