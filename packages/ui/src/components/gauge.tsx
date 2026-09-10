import { toneOf, neutral, type Tone } from "./tone.js";

/*
 * Three score readouts, all built from the same mark a segmented strip
 * uses: hard square segments. No smooth arc and no needle — a swept arc
 * is a skeuomorphic gauge, and this kit does not draw skeuomorphs.
 */

export type ScoreProps = {
  value: number;
  /**
   * The accessible name. REQUIRED, and never derived here: the kit does not translate (docs/08:
   * primitives stay translation-free, the caller passes ready text). It used to build "Health
   * score 87 of 100, Degraded" in English inside this file, which shipped an untranslatable
   * string to every locale. TR: Erişilebilir ad. ZORUNLU, ve burada asla türetilmiyor: kit
   * çeviri yapmaz (docs/08: primitive'ler çevirisiz kalır, hazır metni çağıran geçer). Eskiden
   * bu dosyanın içinde İngilizce "Health score 87 of 100, Degraded" kuruluyordu, yani her dile
   * çevrilemez bir dizgi gönderiliyordu.
   */
  label: string;
  /**
   * Visible band text under the readout. Omitted = the readout shows no word. TR: Okumanın
   * altında görünen bant metni. Verilmezse okuma hiçbir sözcük göstermiyor.
   */
  bandLabel?: string;
  size?: number;
  showLabel?: boolean;
  /**
   * The PRODUCT decides the band's tone. The `band()` below is the kit's default (90 / 70 / 50)
   * and does not fit every product: in a warehouse dispatch rate the thresholds are 85 / 65 /
   * 50, and in an SLA they could be something else entirely. Without this prop a product would
   * write a label against its own threshold and stand it beside a dial the kit painted against
   * another: the text and the colour contradicted each other. Left out, the kit's default
   * thresholds. TR: Bandın tonunu ÜRÜN belirler. Aşağıdaki `band()` kitin varsayılanı (90 / 70
   * / 50) ve her ürüne uymuyor: depo sevk oranında eşikler 85 / 65 / 50, bir SLA'de bambaşka
   * olabilir. Bu prop olmadan ürün kendi eşiğine göre bir metin yazıp kitin başka bir eşiğe
   * göre boyadığı bir kadranla yan yana koyuyordu: yazı ile renk birbirini yalanlıyordu.
   * Verilmezse kitin varsayılan eşikleri.
   */
  tone?: Tone;
};

/* Where the readout changes colour. The thresholds are a kit default; a product
   that scores differently passes its own tone instead. Words are NOT decided
   here — see ScoreProps.label. */
function band(v: number): Tone {
  if (v >= 90) return "positive";
  if (v >= 70) return "caution";
  return "danger";
}

function Delta({ delta }: { delta: number }) {
  const up = delta >= 0;
  return (
    <span
      className="font-mono text-small font-medium"
      style={{ color: up ? neutral.muted : toneOf("danger").fg }}
    >
      {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}
    </span>
  );
}

/* ---------- A · Ring — the segmented strip bent round ---------- */

export function ScoreRing({
  value,
  label,
  bandLabel,
  size = 168,
  showLabel = true,
  segments = 32,
  tone,
}: ScoreProps & { segments?: number }) {
  const v = Math.min(100, Math.max(0, value));
  const c = toneOf(tone ?? band(v));

  const sweep = 270;
  const start = 135;
  const cx = size / 2;
  const cy = size / 2;

  const segLength = size * 0.1;
  const segWidth = Math.max(2, size * 0.032);
  const ringRadius = size * 0.42 - segLength / 2;
  const filled = Math.round((v / 100) * segments);

  /* every fifth of the scale gets a longer mark, like a rule */
  const majorEvery = segments / 5;
  const labelReads = size * 0.065 >= 10;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      {Array.from({ length: segments }).map((_, i) => {
        const angle = start + (sweep * i) / (segments - 1);
        const major = i % majorEvery === 0;
        const len = major ? segLength * 1.28 : segLength;
        return (
          <rect
            key={i}
            x={cx - segWidth / 2}
            y={cy - ringRadius - len / 2}
            width={segWidth}
            height={len}
            transform={`rotate(${angle} ${cx} ${cy})`}
            style={{ fill: i < filled ? c.mark : neutral.line }}
          />
        );
      })}

      <text
        x={cx}
        y={cy - size * 0.01}
        textAnchor="middle"
        dominantBaseline="central"
        className="font-mono"
        shapeRendering="auto"
        style={{
          /* derived from the ring's own size, not the type scale: this glyph
             has to stay in proportion to the dial at any diameter */
          fontSize: size * 0.28,
          fontWeight: 700,
          fill: neutral.title,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.round(v)}
      </text>

      {showLabel && labelReads ? (
        <text
          x={cx}
          y={cy + size * 0.26}
          textAnchor="middle"
          shapeRendering="auto"
          style={{ fontSize: size * 0.065, fontWeight: 500, fill: c.fg }}
        >
          {bandLabel}
        </text>
      ) : null}
    </svg>
  );
}

/* ---------- B · Linear meter — the same strip, left straight ---------- */

export function ScoreMeter({
  value,
  label,
  bandLabel,
  target = 90,
  delta,
  segments = 40,
  tone,
}: ScoreProps & { target?: number; delta?: number; segments?: number }) {
  const v = Math.min(100, Math.max(0, value));
  const c = toneOf(tone ?? band(v));
  const filled = Math.round((v / 100) * segments);

  return (
    <div className="w-full max-w-sm" role="group" aria-label={label}>
      <div className="flex items-end gap-4">
        <span className="font-mono text-display-lg font-bold leading-none tabular-nums text-ink">
          {Math.round(v)}
        </span>
        <span className="mb-1 font-mono text-body text-ink-faint">/ 100</span>
        {delta !== undefined ? (
          <span className="mb-1 ml-auto">
            <Delta delta={delta} />
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-small" style={{ color: c.fg }}>
        {bandLabel}
      </p>

      <div className="relative mt-4">
        <div className="flex items-end gap-[var(--mark-tick)]">
          {Array.from({ length: segments }).map((_, i) => (
            <span
              key={i}
              className="h-6 flex-1"
              style={{ background: i < filled ? c.mark : neutral.line }}
            />
          ))}
        </div>
        {/* the target, as a hard rule through the scale */}
        <span
          className="absolute -top-1 bottom-[var(--dial-label-drop)] w-[var(--mark-tick)]"
          style={{ left: `${target}%`, background: neutral.title }}
        />
      </div>

      <div className="mt-2 flex justify-between font-mono text-micro text-ink-faint">
        <span>0</span>
        <span>target {target}</span>
        <span>100</span>
      </div>
    </div>
  );
}

/* ---------- C · Block matrix — one square is one point ---------- */

export function ScoreMatrix({
  value,
  label,
  bandLabel,
  delta,
  size = 176,
}: ScoreProps & { delta?: number }) {
  const v = Math.round(Math.min(100, Math.max(0, value)));
  const c = toneOf(band(v));
  const cell = (size - 9 * 2) / 10;

  return (
    <div style={{ width: size }} role="group" aria-label={label}>
      <div className="flex items-end gap-2">
        <span className="font-mono text-display font-bold leading-none tabular-nums text-ink">
          {v}
        </span>
        {delta !== undefined ? (
          <span className="mb-1 ml-auto">
            <Delta delta={delta} />
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-small" style={{ color: c.fg }}>
        {bandLabel}
      </p>

      <div className="mt-4 grid grid-cols-10 gap-[var(--mark-tick)]">
        {Array.from({ length: 100 }).map((_, i) => {
          /* fill bottom-up so the block grows like a column of evidence */
          const row = 9 - Math.floor(i / 10);
          const index = row * 10 + (i % 10);
          const on = index < v;
          return (
            <span key={i} style={{ height: cell, background: on ? c.mark : neutral.line }} />
          );
        })}
      </div>
      <p className="mt-3 font-mono text-micro text-ink-faint">one square is one point</p>
    </div>
  );
}

/** default export keeps the existing call sites working */
