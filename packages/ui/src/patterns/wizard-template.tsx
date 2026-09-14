"use client";

import type { ReactNode } from "react";
import { Steps, type Step } from "../components/display.js";
import { ErrorSlot, type ErrorLabels, type TemplateError } from "./shared.js";

/**
 * Sonu belli olan bir akış: kuruluş, bir kayıt ekleme.
 *
 * Verdiği söz "bu kadar adım ve bitti"; "bitti" konumsal.
 * Gerekçe: docs/adr/0004-sablon-katmani.md
 */

/**
 * Bir sihirbaz adımı: kitin `Step`inin ta kendisi.
 *
 * AYRI BİR TİP DEĞİL, ve bir süre öyleydi: burada `{ key, label }` diye ikinci
 * kez tanımlıydı ve şerit çizilirken `steps.map((s) => s.label)` yapılıyordu,
 * yani KİMLİK TAM SINIRDA ÇÖPE GİDİYORDU. Şeridi çizen `Steps` kimliği hiç
 * görmediği için bir adıma kanca takmanın yolu yoktu, ve React anahtarı
 * çevrilmiş etiketti. İki tip tek tipe indi; kimlik artık aşağı akıyor.
 */
export type WizardStep = Step;

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
      {/* Şeridi `Steps` çiziyor, burada elle çizilmiyor: aynı fikrin iki
          görsel dili olmasın diye (ADR-0004). `Steps` kendi `<ol>`unu ve
          `aria-current`ini taşıyor; buradaki sarmalayıcı yalnız yerleşim. */}
      <div className="tamga-section tamga-gutter py-4">
        <Steps steps={steps} current={activeIndex < 0 ? 0 : activeIndex} />
      </div>

      <div className="tamga-gutter min-h-0 flex-1 py-6">
        <div className="max-w-[var(--measure)]">
          <h2 className="text-title font-semibold text-ink">{title}</h2>
          {subtitle ? <p className="mt-1 text-small text-ink-faint">{subtitle}</p> : null}
          <div className="mt-6">
            {state === "error" ? <ErrorSlot error={error} labels={labels} /> : children}
          </div>
        </div>
      </div>

      {/* `bg-shell` SÜS DEĞİL: yapışkan şerit saydam olursa altından geçen
          içerik okunur ve şerit kirlenir. */}
      {back || next ? (
        <div className="tamga-section tamga-gutter sticky bottom-0 z-10 flex items-center gap-2 bg-shell py-4">
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
