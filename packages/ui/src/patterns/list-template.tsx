"use client";

import type { ReactNode } from "react";
import { PageBand } from "../components/layout.js";
import { SkeletonTable } from "../components/skeleton.js";
import { Busy, ErrorSlot, type ErrorLabels, type TemplateError } from "./shared.js";

/**
 * Her liste ekranının şekli: şerit, filtreler, gövde.
 *
 * Dört durum tek sahipte (`loading` · `error` · `empty` · `ready`); yalnız
 * `empty` bir slot. Gerekçe: docs/adr/0004-sablon-katmani.md
 */

export type ListState = "ready" | "loading" | "empty" | "error";

export type ListTemplateProps = {
  title: string;
  /** Başlığın altındaki satır: sayı, kapsam, tazelik. Çağıran çevirmiş olarak veriyor. */
  subtitle?: string;
  /** Bu listenin birincil eylemleri. Şeridin sağında. */
  actions?: ReactNode;
  /** Filtre satırı: arama, kırılımlar, aralıklar. Şeridin altında, içeriğin üstünde. */
  filters?: ReactNode;

  state?: ListState;

  /** Yüklenirken tutulacak satır sayısı: gerçekten kaç kayıt geliyorsa o. */
  loadingRows?: number;
  /** İskeletin sütun genişlikleri, yerini tuttuğu tablonun şekline uysun diye. */
  loadingColumns?: string[];

  /** `state === "empty"` iken görünen. Ekrana özel, o yüzden ekran yazıyor. */
  empty?: ReactNode;
  error?: TemplateError;

  labels: { loading: string } & ErrorLabels;

  children?: ReactNode;
};

export function ListTemplate({
  title,
  subtitle,
  actions,
  filters,
  state = "ready",
  loadingRows = 25,
  loadingColumns,
  empty,
  error,
  labels,
  children,
}: ListTemplateProps) {
  return (
    <div className="flex min-h-0 flex-col" data-list-state={state}>
      <PageBand title={title} subtitle={subtitle} actions={actions} />

      {filters ? (
        <div
          className="tamga-section tamga-gutter flex flex-wrap items-center gap-2 py-3"
          data-filters
        >
          {filters}
        </div>
      ) : null}

      <div className="tamga-gutter min-h-0 flex-1 py-6">
        {state === "loading" ? (
          <Busy label={labels.loading}>
            <SkeletonTable rows={loadingRows} {...(loadingColumns ? { cols: loadingColumns } : {})} />
          </Busy>
        ) : null}

        {state === "error" ? <ErrorSlot error={error} labels={labels} /> : null}
        {state === "empty" ? empty : null}
        {state === "ready" ? children : null}
      </div>
    </div>
  );
}
