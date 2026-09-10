"use client";

import { cn } from "../lib/cn.js";
import { Icon } from "./icon.js";
import { CaretLeft, CaretRight } from "./icons.js";

/**
 * Pagination.
 *
 * Gerekçe: docs/gerekce/02-veri-ve-liste.md
 */

/** Gösterilecek numaraları hesaplar. `null` = kısaltma. */
export function pageWindow(page: number, pages: number, span = 1): (number | null)[] {
  /* Kısaltmasız sığan sayfa adedi `span`den TÜRETİLİYOR, sabit 7 değil:
     pencere ilk + [kısaltma] + (2·span+1) + [kısaltma] + son, yani 2·span+5.
     Sabit 7 yazılıydı ve `span` büyütüldüğünde sekiz sayfalık bir liste
     gereksiz yere kısaltılıyordu. */
  const sigan = span * 2 + 5;
  if (pages <= sigan) return Array.from({ length: pages }, (_, i) => i + 1);

  const out: (number | null)[] = [1];
  const from = Math.max(2, page - span);
  const to = Math.min(pages - 1, page + span);

  if (from > 2) out.push(null);
  for (let i = from; i <= to; i++) out.push(i);
  if (to < pages - 1) out.push(null);
  out.push(pages);
  return out;
}

export function Pagination({
  page,
  pageSize,
  total,
  onChange,
  labels,
  span = 1,
  className,
}: {
  /** Starts at 1. TR: 1'den başlar. */
  page: number;
  pageSize: number;
  /**
   * Total records. Unknown, the numbers are hidden. TR: Toplam kayıt. Bilinmiyorsa numaralar
   * gizlenir.
   */
  total?: number;
  onChange?: (next: number) => void;
  /**
   * How many numbers show on each side of the active page. The window is `2·span + 5`: seven
   * numbers at the default 1, nine at 2. TR: Aktif sayfanın her iki yanında kaç numara
   * görünsün. Pencere genişliği `2·span + 5`: varsayılan 1 ile yedi, 2 ile dokuz numara.
   */
  span?: number;
  /**
   * Every visible string. The kit pulls no translations. `summary` is a function: languages
   * place numbers differently ("1-25 / 240" · "1–25 of 240"), so the caller builds the
   * template. TR: Görünen her metin. Kit çeviri çekmez. `summary` bir fonksiyon: dillerin sayı
   * yerleşimi farklı ("1-25 / 240" · "1–25 of 240"), şablonu çağıran kurar.
   */
  labels: {
    previous: string;
    next: string;
    page: (n: number) => string;
    summary?: (from: number, to: number, total: number) => string;
  };
  className?: string;
}) {
  const pages = total !== undefined ? Math.max(1, Math.ceil(total / pageSize)) : undefined;
  const canPrev = page > 1;
  const canNext = pages === undefined ? true : page < pages;

  const from = (page - 1) * pageSize + 1;
  const to = total !== undefined ? Math.min(page * pageSize, total) : page * pageSize;

  return (
    <nav className={cn("flex flex-wrap items-center gap-3", className)} aria-label={labels.page(page)}>
      {total !== undefined && labels.summary ? (
        <span className="tamga-label tabular-nums">{labels.summary(from, to, total)}</span>
      ) : null}

      <span className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          className="tamga-icon-btn shrink-0"
          aria-label={labels.previous}
          disabled={!canPrev}
          onClick={() => canPrev && onChange?.(page - 1)}
        >
          <Icon icon={CaretLeft} size="sm" />
        </button>

        {pages !== undefined
          ? pageWindow(page, pages, span).map((n, i) =>
              n === null ? (
                <span key={`gap-${i}`} className="px-1 text-small text-ink-faint" aria-hidden>
                  …
                </span>
              ) : (
                <button
                  key={n}
                  type="button"
                  /* Seçili sayfa DOLGU almaz: "buradasın" bir eylem değildir
                     (Yasa 2). Gerekçesi `.tamga-page`'in üstünde — bu satır
                     bir zamanlar `.tamga-option` diyordu ve yorumun tersini
                     yapıyordu. */
                  className="tamga-page tabular-nums"
                  aria-current={n === page ? "page" : undefined}
                  aria-label={labels.page(n)}
                  onClick={() => onChange?.(n)}
                >
                  {n}
                </button>
              ),
            )
          : null}

        <button
          type="button"
          className="tamga-icon-btn shrink-0"
          aria-label={labels.next}
          disabled={!canNext}
          onClick={() => canNext && onChange?.(page + 1)}
        >
          <Icon icon={CaretRight} size="sm" />
        </button>
      </span>
    </nav>
  );
}
