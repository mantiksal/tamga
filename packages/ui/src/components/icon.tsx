import type { Icon as PhosphorIcon, IconWeight } from "@phosphor-icons/react";
import type { ComponentProps } from "react";
import type { Tone } from "./tone.js";
import { toneOf } from "./tone.js";

/**
 * The single icon wrapper.
 *
 * Weight and size live here so the icon character is one decision, not a
 * hundred. Default weight is duotone: its second layer inherits the accent,
 * which is the cheapest brand lever we have.
 */
const sizes = {
  xs: 14,
  sm: 16,
  base: 18,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type IconSize = keyof typeof sizes;

export function Icon({
  icon: Glyph,
  size = "base",
  weight = "duotone",
  tone,
  className,
  ...rest
}: {
  icon: PhosphorIcon;
  size?: IconSize;
  weight?: IconWeight;
  /**
   * paints the duotone second layer with a status colour TR: duotone ikinci katmanı bir durum
   * rengiyle boyar
   */
  tone?: Tone;
  className?: string;
} & Omit<ComponentProps<"svg">, "size" | "weight" | "ref">) {
  return (
    <Glyph
      size={sizes[size]}
      weight={weight}
      className={className ? `shrink-0 ${className}` : "shrink-0"}
      style={tone ? { color: toneOf(tone).fg } : undefined}
      {...rest}
    />
  );
}
