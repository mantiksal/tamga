"use client";

import { useEffect, useRef } from "react";
import { cn } from "../lib/cn.js";
import { toneOf, type Tone } from "./tone.js";

/**
 * Log görüntüleyici.
 *
 * Gerekçe: docs/gerekce/02-veri-ve-liste.md
 */

export type LogLine = {
  id: string;
  /**
   * Pre-formatted; the kit knows no time format. TR: Önceden biçimlendirilmiş; kit saat biçimi
   * bilmez.
   */
  time?: string;
  text: string;
  tone?: Tone;
};

export function LogView({
  lines,
  label,
  height = 320,
  follow = true,
  wrap = false,
  className,
}: {
  lines: readonly LogLine[];
  /**
   * The region's name; it shows in the landmark list for keyboard navigation. TR: Bölgenin adı;
   * klavyeyle gezinende landmark listesinde görünür.
   */
  label: string;
  height?: number;
  /** Scroll to the bottom when a new line arrives. TR: Yeni satır geldiğinde en alta kay. */
  follow?: boolean;
  /**
   * Wrap long lines. Off, it scrolls horizontally. TR: Uzun satırları sar. Kapalıyken yatay
   * kayar.
   */
  wrap?: boolean;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!follow) return;
    const el = box.current;
    if (!el) return;
    /* SADECE ZATEN ALTTAYSA kaydır. Yukarıda bir şey okuyan kişiyi aşağı
       fırlatmak, bu bileşenin yapabileceği en can sıkıcı şey — ve "hep en
       alta git" davranışının varsayılan olduğu her log görüntüleyicide
       yaşanır. 32px'lik tolerans, tam altta olmayı beklemeden çalışsın diye. */
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 32;
    if (atBottom) el.scrollTop = el.scrollHeight;
  }, [lines, follow]);

  return (
    <div
      ref={box}
      className={cn("tamga-surface overflow-y-auto p-3 font-mono text-caption", className)}
      style={{ height }}
      /* `log` rolü: ekran okuyucu bunu bir günlük olarak tanır ve — kritik
         olarak — `aria-live` OLMADAN sessiz kalır. Akan bir bölgeyi
         duyurmak sesli okuyucuyu boğar; kullanıcı isterse kendisi okur. */
      role="log"
      aria-label={label}
      tabIndex={0}
    >
      {lines.map((l) => {
        const c = l.tone ? toneOf(l.tone) : null;
        return (
          <div
            key={l.id}
            className={cn(
              "flex gap-3 py-0.5",
              wrap ? "break-words" : "whitespace-nowrap",
            )}
          >
            {l.time ? (
              /* Zaman damgası SABİT GENİŞLİKTE ve `tabular-nums`: değişken
                 genişlikli rakamlarda her satırın metni birkaç piksel kayar
                 ve sütun okunmaz olur. */
              <span className="w-20 shrink-0 text-ink-faint tabular-nums">{l.time}</span>
            ) : null}
            <span className="min-w-0" style={c ? { color: c.mark } : undefined}>
              {l.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
