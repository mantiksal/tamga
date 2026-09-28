"use client";

import { useState } from "react";
import { Icon, RailLink } from "tamga-ui";
import { BoardView, ListView, Package, Warehouse, type IconGlyph } from "tamga-ui/icons";

/**
 * Ray · iki genişlik, tek seçim.
 *
 * TIKLAMA GEZİNMİYOR, SEÇİYOR. Demo `href="#"` taşıyordu: her tıklama sayfanın
 * adresine bir `#` ekliyor, ray hiç değişmiyordu · bu bileşenin bütün sözü
 * "seçili olan hangisi" ve bunu ancak seçim değişince gösteriyor. `RailLink`
 * `href` olmadan `onClick` alıyor, yani düğme olarak çiziliyor.
 */
const GLIF: Record<string, IconGlyph> = {
  overview: BoardView,
  orders: ListView,
  products: Package,
  stock: Warehouse,
};

/* SUNUCUDAN YALNIZ DİZGİ GEÇİYOR. Bir süre `rozetAd(n)` fonksiyonu prop olarak
   geliyordu ve build prerender'da düştü: React sunucudan istemciye fonksiyon
   geçirmiyor. Sayıyı metne çeviren şey sayfada kalıyor, buraya hazır metin
   iniyor. */
export function RayOrnegi({
  ogeler,
}: {
  ogeler: readonly { key: string; label: string; badge?: number; badgeLabel?: string }[];
}) {
  const [secili, setSecili] = useState(2);

  const ray = (showLabel: boolean) =>
    ogeler.map((o, i) => (
      <RailLink
        key={o.key}
        label={o.label}
        active={secili === i}
        showLabel={showLabel}
        badge={o.badge}
        badgeLabel={o.badgeLabel}
        onClick={() => setSecili(i)}
      >
        <Icon icon={GLIF[o.key] ?? BoardView} size="md" weight={secili === i ? "fill" : "regular"} />
      </RailLink>
    ));

  return (
    <div className="flex w-full flex-wrap items-start gap-10 rounded-(--radius-card) bg-[var(--color-band)] p-6">
      <div className="flex w-56 flex-col gap-2">{ray(true)}</div>
      <div className="flex flex-col gap-2">{ray(false)}</div>
    </div>
  );
}
