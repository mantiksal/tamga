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
  /** The line under the title: a count, a scope, a freshness. The caller supplies it translated. TR: Başlığın altındaki satır: sayı, kapsam, tazelik. Çağıran çevirmiş olarak veriyor. */
  subtitle?: string;
  /** This list's primary actions. On the right of the bar. TR: Bu listenin birincil eylemleri. Şeridin sağında. */
  actions?: ReactNode;
  /** The filter row: search, breakdowns, ranges. Below the bar, above the content. TR: Filtre satırı: arama, kırılımlar, aralıklar. Şeridin altında, içeriğin üstünde. */
  filters?: ReactNode;

  state?: ListState;

  /** How many rows to hold while loading: however many records are actually coming. TR: Yüklenirken tutulacak satır sayısı: gerçekten kaç kayıt geliyorsa o. */
  loadingRows?: number;
  /** The skeleton's column widths, so it holds the shape of the table it stands in for. TR: İskeletin sütun genişlikleri, yerini tuttuğu tablonun şekline uysun diye. */
  loadingColumns?: string[];

  /** What shows when `state === "empty"`. Screen-specific, so the screen writes it. TR: `state === "empty"` iken görünen. Ekrana özel, o yüzden ekran yazıyor. */
  empty?: ReactNode;
  error?: TemplateError;

  labels: { loading: string } & ErrorLabels;

  /**
   * The strip at the foot of the list surface: the pagination, a total, a bulk action. It sits
   * INSIDE the card, divided by a line and given its own padding, because the rows are flush with
   * the card's edge and anything following them lands on that edge.
   * TR: Liste yüzeyinin dibindeki şerit: sayfalama, bir toplam, toplu bir eylem. Kartın İÇİNDE,
   * bir çizgiyle ayrılmış ve kendi dolgusuyla duruyor · satırlar kartın kenarına dayalı olduğu
   * için ardından gelen her şey o kenara yapışıyor.
   */
  footer?: ReactNode;
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
  footer,
  children,
}: ListTemplateProps) {
  return (
    <div className="flex min-h-0 flex-col" data-list-state={state}>
      {/* ŞERİDİN OLUĞUNU KAP VERİYOR. `PageBand` kendi yatay dolgusunu
          bıraktı · bir blok kendi yerini değil yalnız kendi içini bilir. */}
      <div className="tamga-gutter py-4">
        <PageBand title={title} subtitle={subtitle} actions={actions} />
      </div>

      {/* FİLTRELER VE LİSTE BİRER YÜZEYDE: çıplak iki satır tek bir şerit gibi
          okunuyordu. `tamga-card-open` şart, yoksa kart açılır listeleri ve
          satır menülerini kenarında kesiyor.
          Gerekçe: docs/gerekce/08-blok-ve-sablon.md */}
      {filters ? (
        <div className="tamga-gutter pb-4">
          <div
            className="tamga-card tamga-card-open flex flex-wrap items-center gap-2 p-4"
            data-filters
          >
            {filters}
          </div>
        </div>
      ) : null}

      <div className="tamga-gutter min-h-0 flex-1 pb-6">
        <div className="tamga-card tamga-card-open">
          {state === "loading" ? (
            <Busy label={labels.loading}>
              <SkeletonTable rows={loadingRows} {...(loadingColumns ? { cols: loadingColumns } : {})} />
            </Busy>
          ) : null}

          {state === "error" ? <ErrorSlot error={error} labels={labels} /> : null}
          {state === "empty" ? empty : null}
          {state === "ready" ? children : null}

          {/* Dip şerit yalnız liste gerçekten dururken: boş bir listenin altında
              sayfalayıcı, olmayan bir yolu gösterir. */}
          {footer && state === "ready" ? (
            <div className="border-t border-line px-4 py-3">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
