"use client";

import type { ReactNode } from "react";
import { PageBand } from "../components/layout.js";
import { SkeletonCard, SkeletonPanel } from "../components/skeleton.js";
import { Busy, ErrorSlot, type ErrorLabels, type TemplateError } from "./shared.js";

/**
 * Özet (pano) ekranlarının şekli: bir kahraman, sonra ızgara.
 *
 * Kahraman bir slot, ama bir tane. Gerekçe: docs/adr/0004-sablon-katmani.md
 */

export type OverviewState = "ready" | "loading" | "error";

export type OverviewTemplateProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;

  /** The single most important thing on the screen. One, never two. TR: Ekrandaki en önemli tek şey. Bir tane, asla iki. */
  hero?: ReactNode;
  /** The supporting cards. The template supplies the layout so two overview screens cannot drift apart. TR: Destekleyen kartlar. Düzeni şablon veriyor ki iki özet ekranı ayrışamasın. */
  children?: ReactNode;

  state?: OverviewState;
  error?: TemplateError;
  /** How many cards the grid holds, so the loading state reserves the right shape. TR: Izgaranın kaç kart tutacağı, yükleme hâli doğru şekli ayırsın diye. */
  loadingCards?: number;

  labels: { loading: string } & ErrorLabels;
};

export function OverviewTemplate({
  title,
  subtitle,
  actions,
  hero,
  children,
  state = "ready",
  error,
  loadingCards = 4,
  labels,
}: OverviewTemplateProps) {
  return (
    <div className="flex min-h-0 flex-col" data-overview-state={state}>
      <PageBand title={title} subtitle={subtitle} actions={actions} />

      <div className="tamga-gutter min-h-0 flex-1 py-6">
        {state === "loading" ? (
          <Busy label={labels.loading}>
            <div className="flex flex-col gap-6">
              {/* Önce kahramanın bloğu, sonra ızgara: oturmuş ekranın dikey
                  ritminin aynısı, ki veri indiğinde kat yeri kaymasın. */}
              <SkeletonPanel lines={2} block={140} />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: loadingCards }, (_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          </Busy>
        ) : null}

        {state === "error" ? <ErrorSlot error={error} labels={labels} /> : null}

        {state === "ready" ? (
          <div className="flex flex-col gap-6">
            {hero ? <div data-hero>{hero}</div> : null}
            {children ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" data-card-grid>
                {children}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
