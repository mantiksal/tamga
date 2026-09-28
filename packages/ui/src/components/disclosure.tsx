"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import type { IconGlyph } from "./icons.js";
import { CaretRight } from "./icons.js";

/**
 * Açılıp kapanan bölümler.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

/** Tek bir açılır bölüm. */
export function Collapsible({
  title,
  defaultOpen = false,
  icon,
  meta,
  className,
  children,
  ...rest
}: {
  title: string;
  /**
   * The glyph at the head of the row, in the accent. It says what KIND of section this is before
   * the words are read. TR: Satırın başındaki glif, vurgu renginde. Sözcükler okunmadan önce bu
   * bölümün NE TÜR bir bölüm olduğunu söylüyor.
   */
  icon?: IconGlyph;
  defaultOpen?: boolean;
  /**
   * The secondary text to the right of the title: a count, a state. TR: Başlığın sağındaki
   * ikincil metin: sayı, durum.
   */
  meta?: ReactNode;
  className?: string;
  children: ReactNode;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  return (
    /* KILIĞI KAP VERİYOR (`Accordion look`): satır mı kart mı · aynı kararı
       her çağrı yerinde tekrar almamak için. */
    <div
      {...dataProps(rest)}
      className={cn("tamga-collapsible", className)}
      data-open={open || undefined}
    >
      <button
        type="button"
        className="tamga-collapsible-head"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {icon ? <Icon icon={icon} size="base" className="shrink-0 text-accent" /> : null}
        {/* Ok DÖNÜYOR, değişmiyor: iki ayrı ikon (sağ/aşağı) kullanmak geçişi
            bir takas yapardı; döndürmek onu bir hareket yapıyor ve hangi
            yönde gittiğini gösteriyor. */}
        <span className="min-w-0 flex-1 text-body font-bold text-ink">{title}</span>
        {meta ? <span className="text-small text-ink-faint">{meta}</span> : null}
        {/* Ok DÖNÜYOR, değişmiyor: iki ayrı ikon (sağ/aşağı) kullanmak geçişi
            bir takas yapardı; döndürmek onu bir hareket yapıyor. */}
        <Icon
          icon={CaretRight}
          size="xs"
          weight="bold"
          className="shrink-0 transition-transform"
          style={{ transform: open ? "rotate(90deg)" : undefined }}
        />
      </button>
      <div
        id={id}
        hidden={!open}
        className="tamga-collapsible-body"
        data-indent={icon ? "true" : undefined}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Açılır bölümler grubu.
 *
 * Yalnız bir kap: her bölüm kendi durumunu tutuyor. "Aynı anda tek bölüm
 * açık" davranışı BİLEREK yok — bir ayarlar sayfasında iki bölümü yan yana
 * karşılaştırmak yaygın bir iş, ve otomatik kapanma onu imkânsız kılar.
 * Gerekiyorsa çağıran kendi durumunu tutar.
 */
export function Accordion({
  look = "cards",
  className,
  children,
  ...rest
}: {
  /**
   * `cards` each section is its own card and the open one rises · a list where which one is open
   * can be read from across the screen. `list` the quiet stack inside one surface, for a card
   * that already has an edge. TR: `cards` her bölüm kendi kartı ve açık olan yükseliyor · bir
   * listede hangisinin açık olduğu uzaktan okunuyor. `list` tek bir yüzeyin içindeki sessiz
   * yığın, kenarı zaten olan bir kartın içi için.
   */
  look?: "cards" | "list";
  className?: string;
  children: ReactNode;
  [k: `data-${string}`]: unknown;
}) {
  return (
    <div
      {...dataProps(rest)}
      className={cn(look === "cards" ? "tamga-accordion-cards" : "tamga-surface overflow-hidden", className)}
    >
      {children}
    </div>
  );
}
