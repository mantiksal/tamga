"use client";

import type { ReactNode } from "react";
import { ErrorState } from "../components/error-state.js";

/**
 * Şablon katmanının ortak parçaları.
 *
 * Katmanın gerekçesi ve üç kuralı (slot alır · sözcükler dışarıdan · bağlantılar
 * dışarıdan): docs/adr/0004-sablon-katmani.md
 *
 * Adlar İngilizce, yorumlar Türkçe: bir ad tanımlayıcıdır ve çevrilmez
 * (ADR-0001, K12).
 */

/* Bağlantı tipi `components/link.tsx`e indi (bir BİLEŞEN de bağlantı
   olabildiği için); burada yeniden dışa vuruluyor ki bu dosyadan import eden
   şablonlar değişmesin. */
export { PlainLink, type LinkComponent } from "../components/link.js";

/**
 * Bir şablonun çerçevelediği şey yüklenemediğinde ne gösterdiği. Tek dosyada,
 * çünkü teknik satırın biçimi (`code · request_id`) tek bir karar.
 */
export type TemplateError = {
  /** Zarfın makine tarafından okunan `code`u: kararlı, çevrilmez, desteğin dallandığı şey. */
  code?: string;
  /** `meta.request_id`; sunucu günlüğüne giden tek iplik. */
  requestId?: string;
  /** Yalnız çağıran gerçekten yeniden deneyebiliyorsa; yoksa düğme hiç çizilmiyor. */
  onRetry?: () => void;
};

export type ErrorLabels = {
  title: string;
  body: string;
  retry: string;
};

/** `code · request_id`, eksik olanı atlayarak: yarım bir zarf da okunur kalmalı. */
export function errorDetail(error?: TemplateError): string | undefined {
  return [error?.code, error?.requestId].filter(Boolean).join(" · ") || undefined;
}

export function ErrorSlot({ error, labels }: { error?: TemplateError; labels: ErrorLabels }) {
  return (
    <ErrorState
      title={labels.title}
      description={labels.body}
      detail={errorDetail(error)}
      retryLabel={labels.retry}
      {...(error?.onRetry ? { onRetry: error.onRetry } : {})}
    />
  );
}

/** Yüklenirken bölgenin oturmadığını söyleyen sarmalayıcı. */
export function Busy({ label, children }: { label: string; children: ReactNode }) {
  /* `aria-busy`, canlı bölge değil: iskelet dekoratif (`aria-hidden`), ve ekran
     okuyucunun bilmesi gereken şey bu bölgenin henüz oturmadığı. */
  return (
    <div aria-busy="true" aria-label={label}>
      {children}
    </div>
  );
}
