"use client";

import type { ReactNode } from "react";
import { Label } from "../components/surface.js";
import { Select } from "../components/primitives.js";

/**
 * SAYAÇ SATIRI: tablonun tepesindeki tek satırlık okuma.
 *
 * KAÇ KAYIT OLDUĞU HER ZAMAN YAZIYOR. Filtre uygulandıktan sonra kaç kayda
 * bakıldığını söylemeyen bir liste, kullanıcıya saydırıyor.
 *
 * SAĞ TARAF İKİ ŞEY TAŞIYABİLİR ve ikisi de isteğe bağlı: ekrana özel ikinci
 * bir okuma (`aside` — "12 tanesi eşiği geçti" gibi) ve sayfa boyu seçimi.
 * İkincisi verilmezse hiç çizilmiyor: sayfalanmayan bir listeye sayfa boyu
 * sormak, olmayan bir kontrolü öğretmek.
 */
export function CountRow({
  count,
  unit,
  aside,
  pageSize,
  pageSizeOptions,
  onPageSize,
  labels,
}: {
  count: number;
  /** "sipariş", "müşteri": sayının yanında ne yazacağı. */
  unit: string;
  /** Ekrana özel ikinci okuma. */
  aside?: ReactNode;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSize?: (n: number) => void;
  /** Sayının biçimi çağıranın: binlik ayıracı dile bağlı. */
  labels?: { format?: (n: number) => string; perPage?: string; records?: string };
}) {
  const format = labels?.format ?? ((n: number) => String(n));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-line)] px-4 py-3">
      <Label>
        <strong className="tabular-nums text-ink">{format(count)}</strong> {unit}
      </Label>

      {aside}

      {pageSizeOptions && onPageSize && pageSize !== undefined && (
        <label className="flex items-center gap-2 text-small text-ink-soft">
          {labels?.perPage}
          <Select
            className="w-24"
            options={pageSizeOptions.map(String)}
            value={String(pageSize)}
            onChange={(v) => onPageSize(Number(v))}
            placeholder={String(pageSizeOptions[0])}
          />
          {labels?.records}
        </label>
      )}
    </div>
  );
}
