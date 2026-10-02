"use client";

import { useEffect, useRef } from "react";

/**
 * The keyboard behaviour Radix would have given us for free.
 *
 * We hand-rolled the overlays, so we owe the keyboard the same contract a
 * library would have honoured. Two hooks, used by every overlay, so the
 * behaviour cannot drift between them.
 */

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Visibility is judged by `hidden` and `aria-hidden`, deliberately not by
 * `offsetParent`. offsetParent is null for anything inside a fixed-position
 * ancestor in some engines — and always null under jsdom — so a trap built on
 * it collapses to an empty list and silently stops trapping. The selector
 * already excludes disabled controls and tabindex="-1".
 */
function focusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("hidden") && el.getAttribute("aria-hidden") !== "true",
  );
}

/**
 * Traps Tab inside a modal surface and gives it back on close.
 *
 * Without this a dialog looks modal and is not: Tab walks straight out into
 * the page behind the scrim, where a keyboard user is stuck operating a page
 * they cannot see. The scrim only stops the mouse.
 */
export function useFocusTrap<T extends HTMLElement>(open: boolean) {
  const ref = useRef<T>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const root = ref.current;
    if (!root) return;

    restoreTo.current = document.activeElement as HTMLElement | null;

    /* İLK KONTROL, ya da AÇIKÇA İSTENEN kontrol: panelin içinde `data-autofocus`
       taşıyan bir eleman varsa odak onun. `autoFocus` NİTELİĞİ BURADA ÇALIŞMIYOR,
       tuzak odağı ilk elemana çekince etkisi siliniyor.
       Gerekçe: docs/gerekce/09-kitaplik.md */
    const adaylar = focusable(root);
    const istenen = adaylar.find((el) => el.hasAttribute("data-autofocus"));
    const first = istenen ?? adaylar[0];
    if (first) first.focus();
    else {
      root.setAttribute("tabindex", "-1");
      root.focus();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusable(root);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      /* v5 compiles with noUncheckedIndexedAccess, which the prototype did not. The guards below
         are not ceremony: `focusable()` genuinely returns [] when a dialog opens with everything
         inside it still disabled, and the old code would have thrown on the first Tab. */
      if (!first || !last) return;

      /* wrap at both ends, and pull focus back if it escaped some other way */
      if (e.shiftKey && (active === first || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !root.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      /* give focus back to whatever opened this, not to the top of the page */
      restoreTo.current?.focus?.();
    };
  }, [open]);

  return ref;
}

/**
 * Roving focus for a list of options — menus and selects.
 *
 * Arrow keys move, Home/End jump, Enter and Space choose, Escape closes.
 * `data-tamga-option` marks the items so separators and labels are skipped
 * without the hook needing to know what a separator is.
 */
export function useListKeys({
  open,
  containerRef,
  onClose,
}: {
  open: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  /* Ölçüt "açık mı" değil, "AÇILDI MI": `defaultOpen` ile açık doğan bir menüde
     ilk seçenek odağı alırsa tarayıcı sayfayı ona kaydırıyor.
     Gerekçe: docs/gerekce/07-katman-ve-diyalog.md */
  const acikDogdu = useRef(open);

  useEffect(() => {
    if (!open) {
      acikDogdu.current = false;
      return;
    }
    const root = containerRef.current;
    if (!root) return;

    const items = () =>
      Array.from(root.querySelectorAll<HTMLElement>("[data-tamga-option]:not([disabled])"));

    /* focus the first option on open, so the arrows have somewhere to start */
    if (!acikDogdu.current) items()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      const list = items();
      if (list.length === 0) return;
      const i = list.indexOf(document.activeElement as HTMLElement);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          list[i < 0 || i === list.length - 1 ? 0 : i + 1]?.focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          list[i <= 0 ? list.length - 1 : i - 1]?.focus();
          break;
        case "Home":
          e.preventDefault();
          list[0]?.focus();
          break;
        case "End":
          e.preventDefault();
          list[list.length - 1]?.focus();
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case " ":
          /* Enter fires a button natively; Space on a button does too, but only
             on keyup — pre-empting it here keeps the two keys identical. */
          e.preventDefault();
          (document.activeElement as HTMLElement)?.click?.();
          break;
      }
    };

    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, [open, containerRef, onClose]);
}

/**
 * Closes a popup when the pointer goes down outside it, or on Escape.
 *
 * Shared, because an overlay nobody can dismiss is a trap rather than a style:
 * `DatePicker` kept its own open state and had none of this. The returned ref
 * marks what counts as "inside", and that includes the trigger.
 */
export function useDismiss<T extends HTMLElement = HTMLDivElement>(open: boolean, close: () => void) {
  const box = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) close();
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open, close]);
  return box;
}
