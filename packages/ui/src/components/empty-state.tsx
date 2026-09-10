import type { ReactNode } from "react";
import { Icon } from "./icon.js";
import { cn } from "../lib/cn.js";
import { CaretRight } from "./icons.js";

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
 * The speech bubble — the answer to "and the figure says …".
 *
 * It is the one part of the mascot that IS in the system: 1px edge plus a 2px
 * hard offset, exactly like every other raised object. That pairing is the
 * whole trick — it lets pixel art sit inside a strict interface without either
 * one looking lost.
 *
 * The line is real text, not decoration, so it is readable. Keep it to one
 * short sentence: the bubble is a voice, not a paragraph.
 */
export function SaysBubble({
  children,
  art,
  size = 168,
  float = true,
  className,
}: {
  children: React.ReactNode;
  art: Art;
  size?: number;
  float?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative shrink-0 pt-11", float && "tamga-float", className)}>
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
  title,
  children,
  action,
  className,
}: {
  art: Art;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("tamga-gutter flex items-center gap-4 py-6", className)}>
      <span className="tamga-art-port tamga-art-well">
        <ArtFigure art={art} size={56} ground={false} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium text-ink">{title}</p>
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

export type EmptyLayout = "banner" | "ticket" | "routes";

export type EmptyRoute = { label: string; note?: string; onClick?: () => void };

/**
 * A surface that has nothing in it.
 *
 * Three layouts, one set of content. They are NOT three styles of the same
 * picture — each answers a different question about the screen underneath:
 *
 *   banner  wide and horizontal: art left, words centre, action at the far
 *           right edge, numbered base plate underneath. Reads as a strip
 *           across the top of a working screen.
 *   ticket  a narrow tag pinned to a big surface, with a perforation and one
 *           full-width action. For a single unambiguous next step.
 *   routes  the words and the figure on the left, a list of ways in on the right.
 *           Two buttons ask a yes/no question; a list answers "what can I even
 *           do here", which is what somebody arriving actually wants to know.
 *
 * Each one also wants a different drawing. The layout decides the shape; the
 * drawing decides what the emptiness FEELS like, and those are two choices,
 * not one.
 */
export function EmptyState({
  layout = "banner",
  art,
  kicker,
  title,
  children,
  action,
  note,
  says,
  steps,
  routes,
  size = 150,
  className,
}: {
  layout?: EmptyLayout;
  art: Art;
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
  size?: number;
  className?: string;
}) {
  const figure =
    says !== undefined ? (
      <SaysBubble art={art} size={size}>
        {says}
      </SaysBubble>
    ) : (
      <ArtFigure art={art} size={size} float />
    );

  const words = (
    <>
      {kicker ? <p className="tamga-kicker mb-2">{kicker}</p> : null}
      <h3 className="text-display-sm font-semibold tracking-tight text-ink">{title}</h3>
      {children ? (
        <p className="mt-3 max-w-[var(--measure)] text-control leading-relaxed text-ink-soft">
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
      <div className="flex shrink-0 items-end">
        {says !== undefined ? (
          <SaysBubble art={art} size={size}>
            {says}
          </SaysBubble>
        ) : (
          <ArtFigure art={art} size={size} float />
        )}
      </div>

      <div className="min-w-0 flex-1">
        {words}
        {action ? <div className="mt-6 flex flex-wrap gap-3">{action}</div> : null}
      </div>

      <div className="flex w-full shrink-0 flex-col gap-2.5 sm:max-w-76">
        <p className="tamga-kicker mb-0.5">ways in</p>
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
 * A whole body with nothing in it — and no box drawn around the nothing.
 *
 * This is the one that goes straight onto the page, not inside a card. A
 * bordered panel needs content to bound; when the entire screen is empty there
 * is nothing to bound, and the border becomes a frame around a void. So there
 * is no border, no ground, no offset. The only structure is a hard floor rule
 * as wide as the figure — enough to say he is standing somewhere, not enough to be a
 * box.
 *
 * Reach for it when somebody lands on a section they have never used. For an
 * empty area INSIDE a working screen, use EmptyState instead: that one has a
 * card around it because the rest of the screen does too.
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
}: {
  art: Art;
  kicker?: string;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  says?: React.ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      {says !== undefined ? (
        <SaysBubble art={art} size={size}>
          {says}
        </SaysBubble>
      ) : (
        <ArtFigure art={art} size={size} float ground={false} />
      )}
      {/* the floor is as wide as he is, so it reads as ground and not as a rule */}
      <span className="tamga-art-blank-floor mt-1 mb-8" style={{ width: size * 0.72 }} />

      {kicker ? <p className="tamga-kicker mb-2">{kicker}</p> : null}
      <h3 className="text-display-sm font-semibold tracking-tight text-ink">{title}</h3>
      {children ? (
        <p className="mt-3 max-w-[var(--measure)] text-control leading-relaxed text-ink-soft">
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
 * A choice you are offering — a template, a starting point, a preset.
 *
 * It is a real button, so it obeys raised physics: 1px edge, 2px offset, lifts
 * under the cursor, presses flat when clicked. A template you cannot pick has
 * no business looking like a card.
 *
 * The category colour is a 3px SPINE under the art rather than a coloured
 * banner behind it. A wall of coloured banners would out-shout a real event
 * (Yasa 3); a rule carries the same grouping and outranks nothing.
 */
export function EmptyTile({
  art,
  kicker,
  title,
  children,
  tone = 1,
  onClick,
  className,
}: {
  art: Art;
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
}) {
  return (
    <button type="button" onClick={onClick} className={cn("tamga-art-tile", className)}>
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
