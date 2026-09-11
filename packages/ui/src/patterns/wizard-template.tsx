"use client";

import type { ReactNode } from "react";
import { Steps } from "../components/display.js";
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
      {/* ŞERİDİ ŞABLON DEĞİL `Steps` ÇİZİYOR, VE BU BİR DÜZELTME.

          Burada elle yazılmış bir şerit vardı: mono "01", çıplak, aralarında
          çizgi yok. `Steps` bileşeni ise aynı fikri başka türlü çiziyordu:
          24px'lik bir karo ve aralarında bir çizgi. Yani kit "bir dizide
          neredeyim" sorusunu İKİ farklı görsel dille cevaplıyordu, ve bunu
          dışarıdan bir tüketici fark etti.

          Bir tasarım sisteminin tek sözü "aynı şey her yerde aynı görünür".
          Şerit artık tek yerde çiziliyor; `Steps`e dokunan onu her sihirbazda
          birden değiştiriyor.

          `aria` ŞERİDİN İÇİNDE: `Steps` kendi `<ol>`unu ve `aria-current`ini
          taşıyor, o yüzden buradaki sarmalayıcı yalnız yerleşim veriyor. */}
      <div className="tamga-section tamga-gutter py-4">
        <Steps steps={steps.map((s) => s.label)} current={activeIndex < 0 ? 0 : activeIndex} />
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

      {/* ALT ŞERİT YAPIŞKAN. Uzun bir adım formunda "İleri" ekranın altına
          kayıyordu: kullanıcı formu doldurup devam edemiyor, önce aşağı
          kaydırması gerektiğini keşfetmesi gerekiyordu. Bir sihirbazın ileriye
          götüren düğmesi her an erişilebilir olmalı — akışın kendisi o.

          `bottom-0` + zemin: yapışkan bir şerit saydam olursa altından geçen
          içerik okunuyor ve şerit kirli görünüyor. */}
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
