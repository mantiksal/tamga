import { useEffect } from "react";

/**
 * Modal açıkken arkadaki sayfanın kaymasını durdurur. Kaybolan kaydırma çubuğu
 * kadar sağdan dolgu veriliyor, yoksa sayfa sıçrıyor. Panelin KENDİ gövdesi
 * kaymaya devam ediyor: kilit yalnız `body`ye bakıyor.
 *
 * Gerekçe: docs/gerekce/09-kitaplik.md
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const { overflow, paddingRight } = document.body.style;
    const bosluk = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (bosluk > 0) document.body.style.paddingRight = `${bosluk}px`;

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [active]);
}
