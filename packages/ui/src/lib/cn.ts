import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
