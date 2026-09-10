"use client";

import type { ReactNode } from "react";
import { Icon } from "../components/icon.js";
import { Check } from "../components/icons.js";
import { ErrorSlot, type ErrorLabels, type TemplateError } from "./shared.js";

/**
 * Sonu belli olan bir akış: kuruluş, bir kayıt ekleme.
 *
 * Verdiği söz "bu kadar adım ve bitti"; "bitti" konumsal.
 * Gerekçe: docs/adr/0004-sablon-katmani.md
 */

export type WizardStep = {
  key: string;
  /** Çevrilmiş etiket. */
  label: string;
};

export type WizardState = "ready" | "error";

export type WizardTemplateProps = {
  steps: readonly WizardStep[];
  activeStep: string;
  title: string;
  subtitle?: string;

  back?: ReactNode;
  next?: ReactNode;

  state?: WizardState;
  error?: TemplateError;
  labels: ErrorLabels;
  children?: ReactNode;
};

export function WizardTemplate({
  steps,
  activeStep,
  title,
  subtitle,
  back,
  next,
  state = "ready",
  error,
  labels,
  children,
}: WizardTemplateProps) {
  const activeIndex = steps.findIndex((s) => s.key === activeStep);

  return (
    <div className="flex min-h-0 flex-col" data-wizard-state={state}>
      {/* Söz, görünür tutuluyor. Uzunluğunu gizleyen bir sihirbaz, bir şey daha
          istemeye devam eden bir formdan başka bir şey değil. */}
      <ol className="tamga-section tamga-gutter flex flex-wrap items-center gap-x-6 gap-y-2 py-4">
        {steps.map((step, i) => {
          const current = step.key === activeStep;
          /* "Bitti" konumsal, çağıranın taşıması gereken bir bayrak değil: açık
             adımdan öncekilerin hepsinden geçilmiş. Tek kaynak, kayma yok. */
          const done = activeIndex >= 0 && i < activeIndex;
          return (
            <li
              key={step.key}
              data-step={step.key}
              data-current={current}
              data-done={done}
              aria-current={current ? "step" : undefined}
              className={`flex items-center gap-2 text-small ${
                current ? "font-medium text-ink" : done ? "text-ink-soft" : "text-ink-faint"
              }`}
            >
              {/* İŞARETİN GENİŞLİĞİ SABİT. İçeriğe bırakıldığında "02" ile
                  `Check` glifi farklı genişlikteydi ve bir adım tamamlanır
                  tamamlanmaz yanındaki etiket yana kayıyordu: ilerleme
                  işaretinin kendisi şeridi oynatıyordu. `Steps` bileşeninde de
                  aynı kaçak vardı. */}
              <span className="inline-flex w-5 shrink-0 justify-center font-mono text-caption tabular-nums">
                {done ? (
                  <Icon icon={Check} size="xs" weight="bold" />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              {step.label}
            </li>
          );
        })}
      </ol>

      <div className="tamga-gutter min-h-0 flex-1 py-6">
        <div className="max-w-[var(--measure)]">
          <h2 className="text-title font-semibold text-ink">{title}</h2>
          {subtitle ? <p className="mt-1 text-small text-ink-faint">{subtitle}</p> : null}
          <div className="mt-6">
            {state === "error" ? <ErrorSlot error={error} labels={labels} /> : children}
          </div>
        </div>
      </div>

      {back || next ? (
        <div className="tamga-section tamga-gutter flex items-center gap-2 py-4">
          {back}
          {/* İleri, geri olmasa bile sağda: ileriye götüren eylem adımlar
              arasında YER DEĞİŞTİRMİYOR, ve bakmadan tıklanan tek kontrol o. */}
          <div className="ml-auto flex items-center gap-2">{next}</div>
        </div>
      ) : null}

      {/* Sihirbazın kendi yükleme hâli yok: bir adımın ya formu vardır ya da
          veri çeken bir adımdır, ve o çekme adımın kendi gövdesine aittir. Tüm
          çerçeveyi meşgul ilan etmek, asla titrememesi gereken ilerleme
          listesini gizlerdi. */}
      <span className="sr-only" aria-live="polite">
        {activeIndex >= 0 ? `${activeIndex + 1} / ${steps.length}` : ""}
      </span>
    </div>
  );
}
