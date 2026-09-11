"use client";

import type { ComponentProps, ReactNode } from "react";
import { Icon } from "../components/icon.js";
import { Tooltip } from "../components/overlay.js";
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
  /** The translated label. In the tooltip on a narrow rail, on the row itself on a wide one. TR: Çevrilmiş etiket. Dar rayda ipucunda, geniş rayda satırın kendisinde. */
  label: string;
  icon: ComponentProps<typeof Icon>["icon"];
};

export type AppShellProps = {
  /** The brand mark at the top of the rail; the caller supplies its own link. TR: Rayın tepesindeki marka işareti; kendi bağlantısını çağıran veriyor. */
  brand?: ReactNode;
  nav: readonly NavEntry[];
  /** The open path. The route passes `usePathname()`. TR: Açık yol. Rota `usePathname()` geçiyor. */
  activePath: string;
  /**
   * How wide the rail is. TR: Rayın genişliği.
   *
   * `narrow` yalnız simge, etiket ipucunda; `wide` simge ve etiket yan yana.
   * Dar ray ekranı içeriğe bırakıyor ve simgeleri tanıyan birine yetiyor;
   * geniş ray yeni gelen birine menüyü okutuyor. Hangisinin doğru olduğu
   * ürüne bağlı, o yüzden şablon karar vermiyor, soruyor.
   *
   * "Kullanıcı seçsin" diye bir üçüncü değer YOK ve olmamalı: o bir TERCİH,
   * ve tercihin nerede saklandığını (oturum, hesap, tarayıcı) kit bilemez.
   * Ürün tercihi okur, buraya `narrow` ya da `wide` geçer.
   */
  rail?: "narrow" | "wide";
  /**
   * The top bar is GLOBAL CONTEXT, not work. The content belongs to the caller; the template
   * only guarantees its place. TR: Üst şerit KÜRESEL BAĞLAM, iş değil. İçerik çağıranın; şablon
   * yalnız yerini garanti ediyor.
   */
  topbar?: ReactNode;
  /** A control at the foot of the rail: an expand/collapse button, say. TR: Rayın dibine giren kontrol: genişlet/daralt düğmesi gibi. */
  railFooter?: ReactNode;
  linkComponent?: LinkComponent;
  labels: { home: string; primaryNav: string };
  children: ReactNode;
};

export function AppShell({
  brand,
  nav,
  activePath,
  rail = "narrow",
  topbar,
  railFooter,
  linkComponent: Link = PlainLink,
  labels,
  children,
}: AppShellProps) {
  /* Bir giriş kendi alt ağacına sahip: `/urunler`, `/urunler/42/fotograflar`
     üzerinde de açık giriştir. Tam eşleşme yalnız kök yol için, yoksa kısa href
     altındaki her rotayı yutar. */
  const isCurrent = (href: string) =>
    href === "/" ? activePath === href : activePath === href || activePath.startsWith(`${href}/`);

  const wide = rail === "wide";

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-shell text-ink-soft">
      {/* Rayın genişliği yüzeyin sol boşluğunu da içeriyor: aşağıdaki kap
          soldan dolgu vermiyor, yoksa rayın zemini yüzeyin dolgusuyla birleşip
          simgeleri sola yaslı gösteriyor. */}
      <aside
        className={`flex shrink-0 flex-col gap-2 bg-shell py-4 ${
          wide ? "w-60 px-3" : "w-20 items-center px-1"
        }`}
        data-rail={rail}
      >
        {brand ? (
          <>
            <span
              aria-label={labels.home}
              className={`mb-2 flex h-10 shrink-0 items-center text-ink ${wide ? "px-2" : "w-10 justify-center"}`}
            >
              {brand}
            </span>
            <span className={`h-0 w-6 border-t border-line ${wide ? "ml-2" : ""}`} />
          </>
        ) : null}

        <nav
          aria-label={labels.primaryNav}
          className={`tamga-rail-scroll flex w-full flex-1 flex-col gap-2 py-1 ${wide ? "" : "items-center"}`}
        >
          {nav.map((entry) => {
            const current = isCurrent(entry.href);
            const link = (
              <Link
                key={entry.key}
                href={entry.href}
                aria-label={wide ? undefined : entry.label}
                aria-current={current ? "page" : undefined}
                data-active={current}
                data-nav={entry.key}
                className="tamga-rail-link"
              >
                <Icon icon={entry.icon} size="base" />
                {wide ? <span className="min-w-0 truncate">{entry.label}</span> : null}
              </Link>
            );

            /* DAR RAYDA KİTİN İPUCU, `title` DEĞİL.
               Burada `title={entry.label}` vardı: tarayıcının kendi gecikmeli
               gri balonu. Kullanan kişi bunu "ipucu yok" diye okuyor, çünkü
               kitin her yerdeki ipucu başka türlü görünüyor ve hemen çıkıyor.
               Geniş rayda etiket zaten yazılı; orada ipucu aynı sözcüğü ikinci
               kez söylemek olurdu. */
            return wide ? (
              link
            ) : (
              <Tooltip key={entry.key} label={entry.label} placement="right">
                {link}
              </Tooltip>
            );
          })}
        </nav>

        {railFooter ? <div className="shrink-0">{railFooter}</div> : null}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="tamga-gutter flex items-center gap-4 py-4">{topbar}</header>

        {/* Sağ ve alt boşluk kartın kendi ofsetine yer bırakıyor: kırpma tuzağı. */}
        <div className="min-h-0 flex-1 overflow-hidden pr-4 pb-4">
          <main className="tamga-surface h-full min-h-0 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
