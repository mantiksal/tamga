"use client";

import { StatusChip } from "tamga-ui";
import type { Tone } from "tamga-ui";
import { ArrowUUpLeft, Check, Hourglass, Package, Prohibit, Sparkle, Truck } from "tamga-ui/icons";

/**
 * Siparişin yolu · yedi durum, altı rol.
 *
 * Neden istemci dosyası: glif bir BİLEŞEN, ve bir sunucu bileşeninden istemci
 * bileşenine fonksiyon geçilemiyor. Etiketler yine prop olarak geliyor, kit
 * gibi doküman da kendi metnini uydurmuyor.
 */
const GLIFLER = [Sparkle, Hourglass, Package, Truck, Check, ArrowUUpLeft, Prohibit];

export function SiparisCipleri({
  durumlar,
}: {
  durumlar: { state: Tone; label: string; look?: "wash" | "outline" | "solid" }[];
}) {
  return (
    <>
      {durumlar.map((d, i) => (
        <StatusChip key={d.label} label={d.label} state={d.state} look={d.look} icon={GLIFLER[i]} />
      ))}
    </>
  );
}
