"use client";

import type { ComponentProps, ReactNode } from "react";
import { Icon } from "../components/icon.js";
import { PlainLink, type LinkComponent } from "./shared.js";

/**
 * Oturum açmış her ekranın içinde durduğu çerçeve: ray, üst şerit, yüzey.
 *
 * Menü ve açık giriş DIŞARIDAN gelir; kabuk hiçbir ürünün sözlüğünü ve hiçbir
 * yönlendiriciyi tanımaz. Gerekçe: docs/adr/0004-sablon-katmani.md
 */

export type NavEntry = {
  key: string;
  href: string;
  /** Çevrilmiş etiket. Ray dar olduğu için ekranda değil, `title` ve etikette. */
  label: string;
  icon: ComponentProps<typeof Icon>["icon"];
};

export type AppShellProps = {
  /** Rayın tepesindeki marka işareti; kendi bağlantısını çağıran veriyor. */
  brand?: ReactNode;
  nav: readonly NavEntry[];
  /** Açık yol. Rota `usePathname()` geçiyor. */
  activePath: string;
  /**
   * Üst şerit KÜRESEL BAĞLAM, iş değil. İçerik çağıranın; şablon yalnız yerini
   * garanti ediyor.
   */
  topbar?: ReactNode;
  linkComponent?: LinkComponent;
  labels: { home: string; primaryNav: string };
  children: ReactNode;
};

export function AppShell({
  brand,
  nav,
  activePath,
  topbar,
  linkComponent: Link = PlainLink,
  labels,
  children,
}: AppShellProps) {
  /* Bir giriş kendi alt ağacına sahip: `/urunler`, `/urunler/42/fotograflar`
     üzerinde de açık giriştir. Tam eşleşme yalnız kök yol için, yoksa kısa href
     altındaki her rotayı yutar. */
  const isCurrent = (href: string) =>
    href === "/" ? activePath === href : activePath === href || activePath.startsWith(`${href}/`);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-shell text-ink-soft">
      <aside className="flex w-16 shrink-0 flex-col items-center gap-2 bg-shell px-1 py-4">
        {brand ? (
          <>
            <span
              aria-label={labels.home}
              className="mb-2 flex size-10 shrink-0 items-center justify-center text-ink"
            >
              {brand}
            </span>
            <span className="h-0 w-6 border-t border-line" />
          </>
        ) : null}

        <nav
          aria-label={labels.primaryNav}
          className="tamga-rail-scroll flex w-full flex-1 flex-col items-center gap-2 py-1"
        >
          {nav.map((entry) => {
            const current = isCurrent(entry.href);
            return (
              <Link
                key={entry.key}
                href={entry.href}
                aria-label={entry.label}
                title={entry.label}
                aria-current={current ? "page" : undefined}
                data-active={current}
                data-nav={entry.key}
                className="tamga-rail-link"
              >
                <Icon icon={entry.icon} size="base" />
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="tamga-gutter flex items-center gap-4 py-4">{topbar}</header>

        {/* Sağ ve alt boşluk kartın kendi ofsetine yer bırakıyor: kırpma tuzağı. */}
        <div className="min-h-0 flex-1 overflow-hidden p-4 pt-0">
          <main className="tamga-surface h-full min-h-0 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
