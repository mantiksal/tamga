import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* KİTİN YAZI BOYLARI BİR BOY, RENK DEĞİL. tailwind-merge tanımadığı `text-*`
   sınıfını renk sayıyor: `cn("text-body", "text-ink-soft")` boyu düşürüyordu,
   kapalı radyo ve onay kutusu gövde boyunu kaybediyordu. Liste theme.css'teki
   `--text-*` token'ları. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["micro", "caption", "small", "body", "control", "subhead", "title", "display-sm", "display", "display-lg"] },
      ],
    },
  },
});

/**
 * Joins class names and lets a caller's utility win over the component's own.
 *
 * Without the merge, `<Button className="px-8">` produces "px-4 px-8" and which
 * one applies depends on their order in the stylesheet, not on which the caller
 * asked for. twMerge drops the loser, so an override is an override.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
