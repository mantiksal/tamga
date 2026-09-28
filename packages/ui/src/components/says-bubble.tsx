import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";

/**
 * Konuşma balonu — müşteri mesajı, ekibin yanıtı, asistanın önerisi.
 *
 * Gerekçe: docs/gerekce/04-bos-ve-hata.md
 */

export type SaysFrom = "them" | "me" | "assistant";

export function SaysBubble({
  from = "them",
  avatar,
  meta,
  children,
  className,
  ...rest
}: {
  /**
   * Who is speaking. `them` the other side (left, quiet surface), `me` this side (right, accent
   * fill), `assistant` a suggestion (dashed edge, warn wash). TR: Kimin konuştuğu. `them` karşı
   * taraf (solda, sessiz yüzey), `me` bu taraf (sağda, vurgu dolgusu), `assistant` bir öneri
   * (kesik kenar, uyarı yıkaması).
   *
   * THE SIDE IS THE SPEAKER, and that is the whole grammar of a conversation: a reader scans the
   * left edge for the other side and the right edge for their own words, without reading a name.
   * TR: TARAF KONUŞANDIR, ve bir sohbetin bütün grameri bu: okuyan kişi sol kenarda karşı
   * tarafı, sağ kenarda kendi sözlerini arıyor · ad okumadan.
   */
  from?: SaysFrom;
  /**
   * The square beside the bubble: initials, or a glyph for the assistant. TR: Balonun yanındaki
   * kare: baş harfler, ya da asistan için bir glif.
   */
  avatar?: ReactNode;
  /**
   * The quiet line inside the bubble: time, and delivery state. It lives INSIDE because a line
   * under the bubble breaks the rhythm of a long thread. TR: Balonun içindeki sessiz satır: saat
   * ve iletim durumu. İÇERİDE, çünkü balonun ALTINDAKİ bir satır uzun bir sohbetin ritmini
   * bozuyor.
   */
  meta?: string;
  children: ReactNode;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <div {...dataProps(rest)} className={cn("tamga-says", className)} data-from={from}>
      {avatar ? (
        <span className="tamga-says-avatar" aria-hidden>
          {avatar}
        </span>
      ) : null}
      <div className="tamga-says-balon">
        {children}
        {meta ? <span className="tamga-says-meta">{meta}</span> : null}
      </div>
    </div>
  );
}
