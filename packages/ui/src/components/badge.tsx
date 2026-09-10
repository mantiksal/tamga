"use client";

import type { Tone } from "./tone.js";
import { toneOf, rankOf } from "./tone.js";
import { useLiveClaim } from "./live-scope.js";

/* `live` is a REQUEST, not a decision. The element asks the nearest LiveScope
   to pulse and only the most severe asker wins — see live-scope.tsx. Call sites
   keep writing `live={m.health === "down"}` exactly as before; the counting is
   no longer their problem. */

export function StatusChip({
  label,
  state,
  dot = true,
  live = false,
  mono = false,
  severity,
}: {
  label: string;
  state: Tone;
  dot?: boolean;
  live?: boolean;
  /**
   * identifier-shaped labels (codes, short keys) keep the mono face TR: tanımlayıcı biçimli
   * etiketler (kodlar, kısa anahtarlar) mono yüzü korur
   */
  mono?: boolean;
  /**
   * explicit rank, once the API carries one; otherwise derived from state TR: API bir sıra
   * taşıdığında açık sıra; yoksa durumdan türetiliyor
   */
  severity?: number | null;
}) {
  const h = toneOf(state);
  const pulses = useLiveClaim(live ? rankOf(state, severity) : null);
  return (
    <span
      className={`tamga-chip ${mono ? "tamga-chip-mono" : ""}`}
      style={{ background: h.bg, color: h.fg }}
    >
      {dot && (
        <span
          className={`inline-block size-[var(--mark-dot)] ${pulses ? "tamga-live" : ""}`}
          style={{ background: h.mark }}
        />
      )}
      {label}
    </span>
  );
}

export function Delta({
  value,
  better,
  mono = true,
}: {
  value: string;
  better: boolean;
  mono?: boolean;
}) {
  /* good movement stays neutral — color is reserved for deviation */
  const color = better ? "var(--color-ink-faint)" : "var(--color-critical)";
  const rising = !value.trimStart().startsWith("-");
  return (
    <span
      className={`inline-flex items-center gap-1 text-small font-bold ${mono ? "font-mono" : ""}`}
      style={{ color }}
    >
      <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden>
        <path d={rising ? "M5 1L9 8H1Z" : "M5 9L1 2H9Z"} style={{ fill: color }} />
      </svg>
      {value}
    </span>
  );
}

/**
 * Solid square status mark used in dense tables. Uses `fg` rather than `mark`
 * so a single 10px square still reads at rest — bars can afford to be quieter,
 * a lone dot cannot.
 */
export function Dot({
  state,
  live = false,
  severity,
}: {
  state: Tone;
  live?: boolean;
  /**
   * explicit rank, once the API carries one; otherwise derived from state TR: API bir sıra
   * taşıdığında açık sıra; yoksa durumdan türetiliyor
   */
  severity?: number | null;
}) {
  const h = toneOf(state);
  const pulses = useLiveClaim(live ? rankOf(state, severity) : null);
  return (
    <span
      className={`inline-block size-2.5 shrink-0 ${pulses ? "tamga-live" : ""}`}
      style={{ background: h.fg }}
      aria-hidden
    />
  );
}
