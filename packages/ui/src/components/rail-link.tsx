"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";

/**
 * Kendi dosyasında, çünkü YENİ BİR KONTROL.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */

/** İkon raylı gezinme öğesi. */
export function RailLink({
  label,
  active = false,
  href,
  onClick,
  className,
  children,
  showLabel = false,
}: {
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** The icon. TR: İkon. */
  children: ReactNode;
  /**
   * SHOW the label beside the icon. A narrow rail is the default (`false`) and the label lives
   * only as the accessible name; `true` in a wide sidebar. TR: Etiketi ikonun yanında GÖSTER.
   * Dar ray varsayılan (`false`) ve etiket yalnız erişilebilir ad olarak yaşar; geniş bir kenar
   * çubuğunda `true`.
   */
  showLabel?: boolean;
}) {
  const shared = {
    className: cn("tamga-rail-link", showLabel && "tamga-rail-link-wide", className),
    "data-active": active,
    "aria-label": label,
    /* Etiket görünürken `title` yoktur: görünen bir metnin üstünde beliren
       ipucu aynı şeyi ikinci kez söyler ve imleci geciktirir. */
    title: showLabel ? undefined : label,
    "aria-current": active ? ("page" as const) : undefined,
  };
  if (href) {
    return (
      <a href={href} {...shared}>
        {children}
        {showLabel && <span className="truncate">{label}</span>}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} {...shared}>
      {children}
      {showLabel && <span className="truncate">{label}</span>}
    </button>
  );
}
