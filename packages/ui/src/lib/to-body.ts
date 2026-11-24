import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

/* TAM EKRAN KATMAN GÖVDEDE ÇİZİLİR: `transform` taşıyan bir atanın içinde `fixed`
   o ataya göre konumlanıyor, kalkan kartta açılan diyalog titriyordu (2026-11-24).
   Bağlanana kadar hiç çizilmiyor: sunucuda yerinde, istemcide portalda çizilen
   katman hidrasyonda uyuşmazlık veriyordu. Gerekçe: docs/gerekce/07-katman-ve-diyalog.md */
const abonelikYok = () => () => {};

/** `true` once the component is mounted in a browser; `false` on the server and the first client paint. */
export function useMounted(): boolean {
  return useSyncExternalStore(abonelikYok, () => true, () => false);
}

export function toBody(node: ReactNode, mounted: boolean): ReactNode {
  return mounted ? createPortal(node, document.body) : null;
}
