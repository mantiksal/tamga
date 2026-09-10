"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { Icon } from "./icon.js";
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
  meta,
  className,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  /**
   * The secondary text to the right of the title: a count, a state. TR: Başlığın sağındaki
   * ikincil metin: sayı, durum.
   */
  meta?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  return (
    /* Son bölümün alt kuralı kalkıyor: kabın kendi kenarıyla üst üste binip
       çift çizgi oluşturuyordu. */
    <div className={cn("border-b border-[var(--color-line)] last:border-b-0", className)}>
      <button
        type="button"
        /* `tamga-gutter` şart: `.tamga-head` yalnız DİKEY boşluk taşıyor.
           Onsuz başlık kabın kenarına yapışıyordu — ve altındaki gövde
           gutter'lı olduğu için ikisi hizasız duruyordu. */
        className="tamga-head tamga-gutter w-full text-left"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {/* Ok DÖNÜYOR, değişmiyor: iki ayrı ikon (sağ/aşağı) kullanmak geçişi
            bir takas yapardı; döndürmek onu bir hareket yapıyor ve hangi
            yönde gittiğini gösteriyor. */}
        <Icon
          icon={CaretRight}
          size="xs"
          className="shrink-0 transition-transform"
          style={{ transform: open ? "rotate(90deg)" : undefined }}
        />
        <span className="min-w-0 flex-1 text-body font-medium text-ink">{title}</span>
        {meta ? <span className="text-small text-ink-faint">{meta}</span> : null}
      </button>
      <div id={id} hidden={!open} className="tamga-gutter pb-4">
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
export function Accordion({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("tamga-surface overflow-hidden", className)}>{children}</div>;
}
