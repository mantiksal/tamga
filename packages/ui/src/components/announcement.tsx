import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import type { IconGlyph } from "./icons.js";

/**
 * Duyuru şeridi · sayfanın en üstünde, tüm genişlikte.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
export function Announcement({
  look = "loud",
  icon,
  tag,
  title,
  children,
  action,
  className,
  ...rest
}: {
  /**
   * `loud` the filled accent strip, for something the reader should ACT on (a campaign, a
   * deadline). `quiet` the washed strip, for a standing condition that only needs to be READ
   * ("you are in test mode"). TR: `loud` dolu vurgu şeridi · okuyanın bir şey YAPMASI gereken
   * durum için (kampanya, son tarih). `quiet` yıkanmış şerit · yalnız OKUNMASI yeten, duran bir
   * koşul için ("test modundasın").
   */
  look?: "loud" | "quiet";
  /** The glyph at the head of the strip. TR: Şeridin başındaki glif. */
  icon?: IconGlyph;
  /**
   * A short word in a dark plate before the text, for the quiet strip: "TEST MODE", "BETA".
   * It is the one place a mode names itself. TR: Sessiz şeritte metinden önce, koyu bir plaka
   * içinde kısa bir sözcük: "TEST MODU", "BETA". Bir kipin kendi adını söylediği tek yer.
   */
  tag?: string;
  /** TR: Kalın ilk satır. Sessiz şeritte yok: orada tek bir cümle var. */
  title?: string;
  children: ReactNode;
  /** The button or link at the end. TR: Sondaki düğme ya da bağlantı. */
  action?: ReactNode;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <div
      {...dataProps(rest)}
      className={cn(
        "tamga-announce",
        look === "loud" && "tamga-announce-loud",
        look === "quiet" && "tamga-announce-quiet",
        className,
      )}
    >
      {icon ? <Icon icon={icon} size="md" weight="fill" /> : null}
      {tag ? <span className="tamga-announce-tag">{tag}</span> : null}
      <div className="flex min-w-0 flex-1 basis-55 flex-col gap-0.5">
        {title ? <strong className="font-display text-subhead">{title}</strong> : null}
        <span className="text-small">{children}</span>
      </div>
      {action}
    </div>
  );
}
