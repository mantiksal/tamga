"use client";

import { TimelineStrip } from "tamga-ui";
import { Check, House, Package, ShoppingCart, Truck } from "tamga-ui/icons";

/**
 * Olay şeridi · siparişin durakları.
 *
 * İstemci dosyası, çünkü glif bir BİLEŞEN ve sunucudan istemciye fonksiyon
 * geçilemiyor. Metinler yine prop olarak geliyor.
 */
const GLIFLER = [ShoppingCart, Check, Package, Truck, House];

export function OlayOrnegi({
  adimlar,
}: {
  adimlar: readonly { label: string; time?: string; state?: "done" | "current" | "todo" }[];
}) {
  return (
    <TimelineStrip
      steps={adimlar.map((a, i) => ({ ...a, icon: GLIFLER[i] }))}
      className="w-full"
    />
  );
}
