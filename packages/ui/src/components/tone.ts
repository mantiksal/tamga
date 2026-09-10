/**
 * The tone scale — layer 3 of the palette.
 *
 * Gerekçe: docs/gerekce/06-isaret-ve-ton.md
 */

/** What a tone paints. */
export type ToneStyle = {
  /** text + border colour for chips and labels */
  fg: string;
  /** solid mark: dots, bars, spines, chart marks */
  mark: string;
  /** chip / cell wash */
  bg: string;
};

/**
 * Four roles, and nothing outside them.
 *
 * `neutral` is the one that carries meaning by NOT carrying colour: a grey row
 * says "this is not reporting" on its own. That only works while it stays the
 * single uncoloured state — which is why healthy is green here rather than
 * neutral, a deliberate reversal recorded in the product's design notes.
 */
export type Tone = "neutral" | "positive" | "caution" | "danger";

export const tones: Record<Tone, ToneStyle> = {
  positive: {
    fg: "var(--color-resolved)",
    /* the classic status-strip green */
    mark: "var(--color-resolved)",
    bg: "var(--color-resolved-bg)",
  },
  caution: {
    fg: "var(--color-warn)",
    mark: "var(--color-warn)",
    bg: "var(--color-warn-bg)",
  },
  danger: {
    fg: "var(--color-critical)",
    mark: "var(--color-critical)",
    bg: "var(--color-critical-bg)",
  },
  neutral: {
    fg: "var(--color-silent)",
    mark: "var(--color-line)",
    bg: "var(--color-chart-fill)",
  },
};

export function toneOf(tone: Tone): ToneStyle {
  return tones[tone];
}

/**
 * How loudly a tone asks for the screen's single pulse (see live-scope).
 *
 * `null` means "never pulses". Only `danger` breathes, and the reasoning is the
 * same in every domain the kit serves: too few signals is a smaller failure
 * than a signal that has stopped meaning anything. `caution` already carries
 * its own colour; the pulse stays reserved for "look here, now".
 *
 * A product that ranks its own states more finely passes an explicit rank
 * instead — this is the DEFAULT, not the policy.
 */
export const TONE_RANK: Record<Tone, number | null> = {
  danger: 90,
  caution: null,
  positive: null,
  neutral: null,
};

export function rankOf(tone: Tone, override?: number | null): number | null {
  return override === undefined ? TONE_RANK[tone] : override;
}

/** Layer 1 — neutral ramp, for anything that is not reporting a state. */
export const neutral = {
  page: "var(--color-page)",
  surface: "var(--color-shell)",
  hover: "var(--color-hover)",
  chartFill: "var(--color-chart-fill)",
  line: "var(--color-line)",
  edge: "var(--color-edge)",
  lineStrong: "var(--color-edge)",
  muted: "var(--color-ink-faint)",
  body: "var(--color-ink-soft)",
  title: "var(--color-ink)",
};

/** Layer 2 — interaction only. */
export const accent = {
  fg: "var(--color-accent)",
  bg: "var(--color-accent-bg)",
  ink: "var(--color-accent-ink)",
};
