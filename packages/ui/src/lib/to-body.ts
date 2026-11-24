import type { ReactNode } from "react";
import { createPortal } from "react-dom";

/*
 * TAM EKRAN KATMAN GÖVDEDE ÇİZİLİR (2026-11-24). `fixed inset-0` ekrana göre konumlanır, ama bir
 * atası `transform` taşıyorsa o ataya göre konumlanır. Üzerine gelince kalkan bir kartın
 * (`tamga-card-live`) içinde açılan diyalog kartın içine düşüyor, fare diyaloğa geçince kart iniyor,
 * diyalog ekrana dönüyordu: açılıp kapanıyormuş gibi titreyen bir döngü. Katman artık nerede yazılırsa yazılsın `document.body`'de çizilir. Sunucuda belge
 * yoktur; orada olduğu yerde kalır (katman zaten yalnız açıkken, tarayıcıda çizilir).
 */
export function toBody(node: ReactNode): ReactNode {
  return typeof document === "undefined" ? node : createPortal(node, document.body);
}
