"use client";

import type { ReactNode } from "react";
import { Breadcrumb } from "../components/primitives.js";
import { SkeletonPanel } from "../components/skeleton.js";
import {
  Busy,
  ErrorSlot,
  PlainLink,
  type ErrorLabels,
  type LinkComponent,
  type TemplateError,
} from "./shared.js";

/**
 * Her nesne (detay) ekranının şekli: iz, başlık, eylemler, sekmeler, gövde.
 *
 * Sekmeler rota (bağlantı), durum değil; sekmesiz kullanım "yeni kayıt"
 * ekranıdır. Boş hâli yok. Gerekçe: docs/adr/0004-sablon-katmani.md
 */

export type DetailState = "ready" | "loading" | "error";

export type DetailTab = {
  /** A stable identity; comparisons and tests use this. TR: Kararlı kimlik; karşılaştırma ve testler bununla. */
  key: string;
  /** The translated label: the template draws the word it is given, it does not look one up. TR: Çevrilmiş etiket: şablon kendisine verilen sözcüğü çiziyor, aramıyor. */
  label: string;
  href: string;
};

export type DetailTemplateProps = {
  /** The trail above the title. The last item is the current object and takes no href. TR: Başlığın üstündeki iz. Son öğe o anki nesnedir ve href almaz. */
  breadcrumb: { label: string; href?: string }[];
  title: string;
  /** Under the title: the object's identity line. TR: Başlığın altı: nesnenin kimlik satırı. */
  subtitle?: string;
  actions?: ReactNode;

  /**
   * Sekmeler. VERİLMEZSE ŞERİT ÇİZİLMİYOR, ve bu bir kolaylık değil bir
   * ihtiyaç: "yeni kayıt" ekranı da bir detay ekranıdır (aynı iz, aynı
   * başlık, aynı eylem şeridi) ama sekmesi yoktur, çünkü henüz bir kayıt
   * yoktur. Boş bir dizi verilse tek başına duran bir çizgi kalıyordu. TR:
   * Tabs. WITHOUT THEM THE STRIP IS NOT DRAWN, and that is a need rather than
   * a convenience: a "new record" screen is a detail screen too (same
   * breadcrumb, same title, same action band) but it has no tabs, because
   * there is no record yet. An empty array left a lone rule hanging.
   */
  tabs?: readonly DetailTab[];
  /** Hangi sekmenin açık olduğu, `key` ile. TR: Which tab is open, by `key`. */
  activeTab?: string;

  state?: DetailState;
  error?: TemplateError;

  linkComponent?: LinkComponent;
  labels: { loading: string; breadcrumb: string; tabs: string } & ErrorLabels;

  /** The body of the open tab. The template does not know which tab it is, and must not. TR: Açık sekmenin gövdesi. Şablon hangi sekme olduğunu bilmiyor, bilmemeli. */
  children?: ReactNode;
};

export function DetailTemplate({
  breadcrumb,
  title,
  subtitle,
  actions,
  tabs,
  activeTab,
  state = "ready",
  error,
  linkComponent: Link = PlainLink,
  labels,
  children,
}: DetailTemplateProps) {
  return (
    <div className="flex min-h-0 flex-col" data-detail-state={state}>
      <div className="tamga-gutter flex flex-wrap items-start gap-4 pt-4">
        <div className="min-w-0">
          <Breadcrumb label={labels.breadcrumb} items={breadcrumb} />
          <h2 className="mt-2 text-title font-semibold text-ink">{title}</h2>
          {subtitle ? <p className="text-small text-ink-faint">{subtitle}</p> : null}
        </div>
        {actions ? <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>

      {/* Sekme çubuğu her durumda YERİNDE KALIYOR: hâlâ yüklenen bir nesne yine
          BU nesnedir, ve o otururken gezinmesini oynatmak, iskeletin
          engellemek için var olduğu zıplamanın ta kendisi. */}
      {tabs && tabs.length > 0 ? (
        <nav aria-label={labels.tabs} className="tamga-gutter mt-4 flex gap-6 border-b border-line">
          {tabs.map((tab) => {
            const current = tab.key === activeTab;
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className="tamga-tab"
                data-active={current}
                data-tab={tab.key}
                aria-current={current ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      ) : null}

      <div className="tamga-gutter min-h-0 flex-1 py-6">
        {state === "loading" ? (
          <Busy label={labels.loading}>
            <SkeletonPanel />
          </Busy>
        ) : null}

        {state === "error" ? <ErrorSlot error={error} labels={labels} /> : null}
        {state === "ready" ? children : null}
      </div>
    </div>
  );
}
