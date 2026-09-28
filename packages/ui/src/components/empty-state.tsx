import type { ReactNode } from "react";
import { Icon } from "./icon.js";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import type { IconGlyph } from "./icons.js";
import { CaretRight } from "./icons.js";
import type { Tone } from "./tone.js";
import { toneOf } from "./tone.js";

/**
 * BOŞ DURUM SİSTEMİ — dört slot, ve hiçbiri neyin eksik olduğunu bilmez.
 *
 * Gerekçe: docs/gerekce/04-bos-ve-hata.md
 */

/**
 * Çizimi çizen fonksiyon. Slot boyutu ve süzülme durumunu verir; ne çizildiği
 * çağıranın işi.
 */
export type Art = (opts: { size: number; float: boolean }) => ReactNode;

/**
 * The drawing standing on the ground.
 *
 * `ground` adds the hard cast shadow — a BAR, deliberately, not a copy of his
 * silhouette: a body-shaped offset is the pressable-object signature, and the figure
 * is not pressable. A bar reads as ground, not as affordance. It lands down and
 * to the right because that is where every other shadow in the kit lands.
 */
function ArtFigure({
  art,
  size,
  float,
  ground = true,
}: {
  art: Art;
  size: number;
  float?: boolean;
  ground?: boolean;
}) {
  return (
    <span className="tamga-art-fig" data-ground={ground}>
      {art({ size, float: Boolean(float) })}
    </span>
  );
}

/**
 * ÇİZİMİN balonu · "ve figür şunu diyor" sorusunun cevabı. Adı bir ara
 * `SaysBubble`dı ve tasarımda o ad KONUŞMA balonunun (04.14): müşteri
 * mesajları, sipariş notları. İkisi aynı adı taşıyınca boş durum arayan da
 * sohbet arayan da yanlış bileşeni buluyordu.
 *
 * Gerekçe: docs/gerekce/04-bos-ve-hata.md
 */
export function ArtSays({
  children,
  art,
  size = 168,
  float = true,
  className,
  ...rest
}: {
  children: React.ReactNode;
  art: Art;
  size?: number;
  float?: boolean;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <div {...dataProps(rest)} className={cn("relative shrink-0 pt-11", float && "tamga-float", className)}>
      {/* centred over the figure’s head, tail pointing straight down at him */}
      <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap">
        <div
          className="px-3 py-1.5 text-small font-medium text-ink"
          style={{
            background: "var(--color-shell)",
            border: "1px solid var(--color-edge)",
            borderRadius: "var(--radius-card)",
            boxShadow: "2px 2px 0 var(--color-edge)",
          }}
        >
          {children}
        </div>
        {/* tail: same fill and edge, rotated so two sides read as the point */}
        <span
          aria-hidden
          className="absolute top-full left-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-px rotate-45"
          style={{
            background: "var(--color-shell)",
            borderRight: "1px solid var(--color-edge)",
            borderBottom: "1px solid var(--color-edge)",
          }}
        />
      </div>
      <ArtFigure art={art} size={size} />
    </div>
  );
}

/**
 * A row that has nothing in it.
 *
 * The action goes hard right, on the row's own baseline — that is where every
 * other row in the product keeps its control, and an empty row that puts its
 * button somewhere else stops looking like part of the list.
 *
 * No border of its own: it drops into a table body or a list that already has
 * one, and it inherits that list's row rhythm.
 */
export function EmptyNote({
  art,
  icon,
  title,
  children,
  action,
  className,
  ...rest
}: {
  /** The drawing. With `icon` instead, the note collapses to a single line. TR: Çizim. Yerine `icon` verilirse not tek satıra iniyor. */
  art?: Art;
  /**
   * A glyph instead of the drawing · and with it the note becomes ONE LINE: a card that is empty
   * inside an otherwise full screen does not deserve a picture, it deserves a sentence. TR:
   * Çizim yerine bir glif · ve onunla birlikte not TEK SATIR oluyor: dolu bir ekranın içindeki
   * boş bir kart resim değil bir cümle hak ediyor.
   */
  icon?: IconGlyph;
  /** Omitted, the sentence stands alone · which is the one-line note's whole shape. TR: Verilmezse cümle tek başına duruyor · tek satırlık notun bütün biçimi bu. */
  title?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  if (icon || !art) {
    return (
      <div
        {...dataProps(rest)}
        className={cn("tamga-gutter flex items-center gap-2.5 py-4", className)}
      >
        {icon ? <Icon icon={icon} size="sm" className="shrink-0 text-ink-faint" /> : null}
        <span className="min-w-0 flex-1 text-body text-ink-faint">
          {title ? <span className="font-semibold text-ink">{title} </span> : null}
          {children}
        </span>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    );
  }

  return (
    <div {...dataProps(rest)} className={cn("tamga-gutter flex items-center gap-4 py-6", className)}>
      <span className="tamga-art-port tamga-art-well">
        <ArtFigure art={art} size={56} ground={false} />
      </span>
      <div className="min-w-0 flex-1">
        {title ? <p className="font-display text-subhead font-extrabold text-ink">{title}</p> : null}
        {children ? (
          <p className="mt-1 max-w-[var(--measure)] text-small leading-relaxed text-ink-faint">
            {children}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export type EmptyLayout = "plain" | "banner" | "ticket" | "routes";

export type EmptyRoute = { label: string; note?: string; onClick?: () => void };

/**
 * A surface that has nothing in it · three layouts (banner · ticket · routes),
 * one set of content. Not three styles of the same picture: each answers a
 * different question about the screen underneath, and each wants its own
 * drawing.
 *
 * Gerekçe: docs/gerekce/04-bos-ve-hata.md
 */
export function EmptyState({
  layout = "banner",
  art,
  icon,
  tone,
  kicker,
  title,
  children,
  action,
  note,
  says,
  steps,
  routes,
  routesLabel,
  size = 150,
  className,
  ...rest
}: {
  /**
   * `plain` the dashed card: an icon tile, a line and the first step · the shape most screens
   * need. The other three carry the drawing. TR: `plain` kesik kenarlı kart: bir ikon karosu,
   * bir satır ve ilk adım · çoğu ekranın ihtiyacı olan biçim. Ötekiler çizimi taşıyor.
   */
  layout?: EmptyLayout;
  /**
   * The drawing, for the three layouts built around one. TR: Çizim, etrafında kurulan üç
   * yerleşim için.
   */
  art?: Art;
  /** `plain` only: the glyph in the tile. TR: yalnız `plain`: karodaki glif. */
  icon?: IconGlyph;
  /**
   * `plain` only: the tile's wash. Left out it stays the accent's light tone, which is what an
   * empty state is: an invitation, not a fault. TR: yalnız `plain`: karonun yıkaması.
   * Verilmezse vurgunun açık tonunda kalıyor · bir boş durum bir davet, bir arıza değil.
   */
  tone?: Tone;
  /** what KIND of nothing this is: "no records", "no results" TR: bunun NE TÜR bir hiçlik olduğu: "kayıt yok", "sonuç yok" */
  kicker?: string;
  title: string;
  /** why it is empty, in the instrument's voice TR: neden boş olduğu, göstergenin diliyle */
  children?: React.ReactNode;
  action?: React.ReactNode;
  /** the quiet second line: what happens next TR: sessiz ikinci satır: bundan sonra ne olacağı */
  note?: string;
  /**
   * one short line in a bubble over the figure's head TR: figürün başının üstündeki balonda tek
   * kısa satır
   */
  says?: React.ReactNode;
  /**
   * banner only: what happens after the click, on a seated base plate TR: yalnız afişte:
   * tıklamadan sonra ne olacağı, oturmuş bir taban plakasında
   */
  steps?: string[];
  /** routes only: the ways in TR: yalnız rotalar: içeri giden yollar */
  routes?: EmptyRoute[];
  /**
   * routes only: the micro-label over the list. Omitted, the list stands on its
   * own. TR: yalnız rotalar: listenin üstündeki mikro etiket. Verilmezse liste
   * kendi başına duruyor.
   */
  routesLabel?: string;
  size?: number;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const figure = !art ? null : says !== undefined ? (
    <ArtSays art={art} size={size}>
      {says}
    </ArtSays>
  ) : (
    <ArtFigure art={art} size={size} float />
  );

  const words = (
    <>
      {kicker ? <p className="tamga-kicker mb-2">{kicker}</p> : null}
      <h3 {...dataProps(rest)} className="font-display text-display-sm font-extrabold tracking-tight text-ink">{title}</h3>
      {children ? (
        <p className="mt-3 max-w-[var(--measure)] text-body leading-relaxed text-ink-soft">
          {children}
        </p>
      ) : null}
      {note ? (
        <p className="mt-2 max-w-[var(--measure)] text-small leading-relaxed text-ink-faint">
          {note}
        </p>
      ) : null}
    </>
  );

  if (layout === "plain") {
    /* KESİK KENARLI KART: kitin her yerinde kesik çizgi "henüz gerçek içerik
       değil" demek, ve boş bir bölüm tam olarak o. Dolu hâlinde aynı yerde
       kesiksiz bir kart duruyor · ikisi aynı kutu, biri henüz dolmamış. */
    return (
      <div {...dataProps(rest)} className={cn("tamga-empty-plain", className)}>
        {icon ? (
          <span
            aria-hidden
            className="tamga-empty-tile"
            style={tone ? { background: toneOf(tone).bg, color: toneOf(tone).fg } : undefined}
          >
            <Icon icon={icon} size="xl" weight="bold" />
          </span>
        ) : null}
        {words}
        {action ? <div className="mt-2 flex flex-wrap justify-center gap-3">{action}</div> : null}
      </div>
    );
  }

  if (layout === "banner") {
    return (
      <div className={cn("flex flex-col overflow-hidden", className)}>
        <div className="flex flex-1 flex-col sm:flex-row sm:items-stretch">
          <div className="tamga-art-well tamga-art-stage tamga-art-floor sm:border-b-0">{figure}</div>
          <div className="flex min-w-0 flex-1 flex-col gap-7 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-9 sm:py-9">
            <div className="min-w-0">{words}</div>
            {action ? (
              <div className="flex shrink-0 flex-wrap items-center gap-3">{action}</div>
            ) : null}
          </div>
        </div>
        {steps?.length ? (
          <ol className="tamga-art-steps tamga-art-well">
            {steps.map((step, i) => (
              <li key={step} className="tamga-art-step">
                <span className="tamga-art-step-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-small leading-relaxed text-ink-soft">{step}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    );
  }

  if (layout === "ticket") {
    return (
      <div className={cn("flex justify-center px-6 py-10", className)}>
        <div className="tamga-card w-full max-w-90 overflow-hidden">
          <div className="tamga-art-well tamga-art-band">{figure}</div>
          <div className="px-6 pt-6 pb-7 text-center [&_p]:mx-auto">{words}</div>
          <div className="tamga-art-divider" />
          {action ? (
            <div className="flex flex-col gap-2 p-4 [&>*]:w-full [&>*]:justify-center">
              {action}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  /* routes — three columns on one line: the figure, the words, the ways in */
  return (
    <div
      className={cn(
        "flex flex-col gap-8 px-6 py-9 sm:flex-row sm:items-center sm:gap-10 sm:px-10 sm:py-10",
        className,
      )}
    >
      {/* the figure reads first, at the head of the line, standing on his own cast
          shadow rather than in a well: this layout has no divided ground, so a
          framed window here would be a box with nothing to bound. */}
      <div className="flex shrink-0 items-end">{figure}</div>

      <div className="min-w-0 flex-1">
        {words}
        {action ? <div className="mt-6 flex flex-wrap gap-3">{action}</div> : null}
      </div>

      <div className="flex w-full shrink-0 flex-col gap-2.5 sm:max-w-76">
        {routesLabel ? <p className="tamga-kicker mb-0.5">{routesLabel}</p> : null}
        {routes?.map((r) => (
          /* no mini figure here: a 26px scene is the smudge this kit just stopped
             shipping, and a route needs a direction, not a mascot */
          <button key={r.label} type="button" onClick={r.onClick} className="tamga-art-route">
            <span className="min-w-0 flex-1">
              <span className="block text-body font-medium text-ink">{r.label}</span>
              {r.note ? <span className="block text-small text-ink-faint">{r.note}</span> : null}
            </span>
            <Icon icon={CaretRight} size="sm" />
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * A whole body with nothing in it, and no box drawn around the nothing: no
 * border, no ground, no offset, just a hard floor rule as wide as the figure.
 * For an empty area INSIDE a working screen use EmptyState instead.
 *
 * Gerekçe: docs/gerekce/04-bos-ve-hata.md
 */
export function EmptyBlank({
  art,
  kicker,
  title,
  children,
  action,
  says,
  size = 230,
  className,
  ...rest
}: {
  art: Art;
  kicker?: string;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  says?: React.ReactNode;
  size?: number;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <div
{...dataProps(rest)}
      className={cn(
        "flex w-full flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      {says !== undefined ? (
        <ArtSays art={art} size={size}>
          {says}
        </ArtSays>
      ) : (
        <ArtFigure art={art} size={size} float ground={false} />
      )}
      {/* the floor is as wide as he is, so it reads as ground and not as a rule */}
      <span className="tamga-art-blank-floor mt-1 mb-8" style={{ width: size * 0.72 }} />

      {kicker ? <p className="tamga-kicker mb-2">{kicker}</p> : null}
      <h3 className="font-display text-display-sm font-extrabold tracking-tight text-ink">{title}</h3>
      {children ? (
        <p className="mt-3 max-w-[var(--measure)] text-body leading-relaxed text-ink-soft">
          {children}
        </p>
      ) : null}
      {action ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{action}</div>
      ) : null}
    </div>
  );
}

/**
 * A choice you are offering · a template, a preset. A real button, so it obeys
 * raised physics. The category colour is a 3px SPINE under the art, never a
 * coloured banner behind it (Yasa 3).
 *
 * Gerekçe: docs/gerekce/04-bos-ve-hata.md
 */
export function EmptyTile({
  art,
  icon,
  kicker,
  title,
  children,
  tone = 1,
  onClick,
  className,
  ...rest
}: {
  /** The drawing. With `icon` instead, the tile becomes the dashed ADD cell. TR: Çizim. Yerine `icon` verilirse karo kesik kenarlı EKLE hücresi oluyor. */
  art?: Art;
  /**
   * A glyph instead of the drawing · and the tile turns into the grid's empty cell: dashed while
   * it waits, solid and raised under the pointer. The dashed edge says "not content yet", the
   * lift says "this is a control". TR: Çizim yerine bir glif · ve karo ızgaranın boş hücresine
   * dönüşüyor: beklerken kesik, imleç altında kesiksiz ve yükselmiş. Kesik kenar "henüz içerik
   * değil" diyor, yükselme "bu bir kontrol".
   */
  icon?: IconGlyph;
  /** the identifier-shaped line above the title TR: başlığın üstündeki tanımlayıcı biçimli satır */
  kicker?: string;
  title: string;
  children?: React.ReactNode;
  /**
   * 1–5, the categorical series tones, deliberately not status colours TR: 1–5, kategorik seri
   * tonları, bilerek durum renkleri değil
   */
  tone?: 1 | 2 | 3 | 4 | 5;
  onClick?: () => void;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  if (icon || !art) {
    return (
      <button
        {...dataProps(rest)}
        type="button"
        onClick={onClick}
        className={cn("tamga-empty-add", className)}
      >
        {icon ? (
          <span aria-hidden className="tamga-empty-add-kare">
            <Icon icon={icon} size="sm" weight="bold" />
          </span>
        ) : null}
        <span className="text-body font-bold">{title}</span>
      </button>
    );
  }

  return (
    <button {...dataProps(rest)} type="button" onClick={onClick} className={cn("tamga-art-tile", className)}>
      <span className="tamga-art-well flex h-28 items-end justify-center pt-4">
        <ArtFigure art={art} size={86} />
      </span>
      <span className="tamga-art-spine" data-tone={tone} />
      <span className="tamga-gutter flex min-w-0 flex-1 flex-col py-4">
        {kicker ? <span className="tamga-kicker mb-1.5">{kicker}</span> : null}
        <span className="text-body font-semibold text-ink">{title}</span>
        {children ? (
          <span className="mt-1 text-small leading-relaxed text-ink-faint">{children}</span>
        ) : null}
      </span>
    </button>
  );
}
