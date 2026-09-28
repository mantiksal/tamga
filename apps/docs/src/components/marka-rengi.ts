"use client";

import { useSyncExternalStore } from "react";

/**
 * Marka rengi: ana sayfanın iki bölümünün PAYLAŞTIĞI tek değer.
 *
 * NEDEN SAĞLAYICI DEĞİL. "01 · Canlı önizleme" ile "02 · Bileşenler" sayfanın
 * iki ayrı bölümü ve aralarında ortak bir React ağacı yok; ikisini saran bir
 * `Provider` koymak, sunucuda çizilen her şeyi o istemci bileşeninin çocuğu
 * yapardı. Modül seviyesindeki bir abonelik ikisini de sarmalamadan bağlıyor,
 * ve `useSyncExternalStore` sunucu çiziminde de aynı başlangıç değerini
 * veriyor.
 */

const VARSAYILAN = "#1e4fd8";

let renk = VARSAYILAN;
const dinleyiciler = new Set<() => void>();

const abone = (f: () => void) => {
  dinleyiciler.add(f);
  return () => {
    dinleyiciler.delete(f);
  };
};
const oku = () => renk;

export function useMarkaRengi(): [string, (hex: string) => void] {
  const deger = useSyncExternalStore(abone, oku, oku);
  return [
    deger,
    (hex: string) => {
      renk = hex.toLowerCase();
      for (const f of dinleyiciler) f();
    },
  ];
}

export { VARSAYILAN as VARSAYILAN_RENK };
