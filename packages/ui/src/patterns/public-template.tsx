"use client";

import type { ReactNode } from "react";
import { SkeletonPanel } from "../components/skeleton.js";
import { Busy, ErrorSlot, type ErrorLabels, type TemplateError } from "./shared.js";

/**
 * Oturumsuz ulaşılan yüzeyler: durum sayfası, rapor doğrulama, kamusal fatura.
 *
 * Kendi şablonu, rayı gizlenmiş uygulama çerçevesi değil: beyaz etiketli bir
 * alan adında bu sayfa müşterinin kendisidir.
 * Gerekçe: docs/adr/0004-sablon-katmani.md
 */

export type PublicState = "ready" | "loading" | "error";

export type PublicTemplateProps = {
  /** The owner's mark. With none, nothing is drawn; the product supplies the default. TR: Sahibin işareti. Verilmezse hiçbir şey çizilmiyor; varsayılanı ürün koyar. */
  brand?: ReactNode;
  title: string;
  subtitle?: string;
  /** The right of the title: a subscribe control, a period picker, a verification stamp. TR: Başlığın sağı: abone ol kontrolü, dönem seçici, bir doğrulama damgası. */
  headerAside?: ReactNode;
  /** The bottom line. On a white-labelled page it belongs to the owner; what it says is a plan question. TR: Alttaki satır. Beyaz etiketli sayfada sahibin; ne yazacağı bir plan sorusu. */
  footer?: ReactNode;

  state?: PublicState;
  error?: TemplateError;
  labels: { loading: string } & ErrorLabels;
  children?: ReactNode;
};

export function PublicTemplate({
  brand,
  title,
  subtitle,
  headerAside,
  footer,
  state = "ready",
  error,
  labels,
  children,
}: PublicTemplateProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-page" data-public-state={state}>
      <header className="tamga-section tamga-gutter flex flex-wrap items-center gap-4 py-6">
        <div className="flex min-w-0 items-center gap-3" data-brand>
          {brand}
          <div className="min-w-0">
            <h1 className="truncate text-title font-semibold text-ink">{title}</h1>
            {subtitle ? <p className="text-small text-ink-faint">{subtitle}</p> : null}
          </div>
        </div>
        {headerAside ? (
          <div className="ml-auto flex flex-wrap items-center gap-2">{headerAside}</div>
        ) : null}
      </header>

      <main className="tamga-gutter flex-1 py-8">
        {state === "loading" ? (
          <Busy label={labels.loading}>
            <SkeletonPanel lines={4} block={120} />
          </Busy>
        ) : null}
        {state === "error" ? <ErrorSlot error={error} labels={labels} /> : null}
        {state === "ready" ? children : null}
      </main>

      {footer ? (
        <footer className="tamga-section tamga-gutter py-6 text-caption text-ink-faint">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}
