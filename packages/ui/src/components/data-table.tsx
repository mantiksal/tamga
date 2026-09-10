"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { Icon } from "./icon.js";
import { CaretDown, Close } from "./icons.js";
import { Checkbox } from "./checkbox.js";

/**
 * DATA TABLE — ve neden tek bir `<DataTable data={…} />` DEĞİL.
 *
 * Gerekçe: docs/gerekce/02-veri-ve-liste.md
 */

export type SortDirection = "asc" | "desc";

/**
 * Sıralanabilir sütun başlığı.
 *
 * `<th>` içinde bir `<button>`: başlığın kendisini tıklanabilir yapmak,
 * ekran okuyucuya sütunun aynı zamanda bir kontrol olduğunu söylemez.
 * `aria-sort` da `<th>`de olmak zorunda — okuyucu sıralama durumunu oradan alır.
 */
export function SortHeader({
  children,
  direction,
  onSort,
  align = "left",
  className,
  ...rest
}: {
  children: ReactNode;
  /** `undefined` when this column is not sorted. TR: Bu sütun sıralı değilse `undefined`. */
  direction?: SortDirection;
  onSort?: (next: SortDirection) => void;
  align?: "left" | "right";
  className?: string;
} & Omit<React.ComponentProps<"th">, "children" | "onClick">) {
  const next: SortDirection = direction === "asc" ? "desc" : "asc";
  return (
    <th
      scope="col"
      aria-sort={direction ? (direction === "asc" ? "ascending" : "descending") : "none"}
      className={cn(align === "right" && "text-right", className)}
      {...rest}
    >
      <button
        type="button"
        onClick={() => onSort?.(next)}
        className={cn(
          "inline-flex items-center gap-1.5",
          align === "right" && "flex-row-reverse",
          direction ? "text-ink" : undefined,
        )}
      >
        {children}
        {/* Yön oku YALNIZ sıralı sütunda görünür. Her başlıkta soluk bir ok
            göstermek, hangisinin etkin olduğunu okunmaz hâle getirir. */}
        {direction ? (
          <Icon
            icon={CaretDown}
            size="xs"
            className={direction === "asc" ? "rotate-180" : undefined}
          />
        ) : null}
      </button>
    </th>
  );
}

/**
 * Baş onay kutusu — ve `indeterminate` neden önemli.
 *
 * Beş satırın ikisi seçiliyse baş kutu ne işaretli ne boştur; üçüncü bir
 * durumdadır. Boş göstermek "hiçbiri seçili değil" der ve yalandır; işaretli
 * göstermek "hepsi seçili" der ve daha kötüdür — kullanıcı silmeye basar.
 */
export function SelectAll({
  checked,
  indeterminate,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange?: (next: boolean) => void;
  label: string;
}) {
  return (
    <span
      /* `aria-checked="mixed"` üçüncü durumun standart karşılığı. */
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={label}
      tabIndex={0}
      onClick={() => onChange?.(!checked)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange?.(!checked);
        }
      }}
      className="inline-flex cursor-pointer"
    >
      <span className="tamga-check" data-checked={checked || indeterminate}>
        {indeterminate ? (
          <span className="block h-0.5 w-2 bg-current" aria-hidden />
        ) : checked ? (
          <Icon icon={CaretDown} size="xs" className="hidden" />
        ) : null}
        {checked && !indeterminate ? <span className="block h-2 w-2 bg-current" aria-hidden /> : null}
      </span>
    </span>
  );
}

/** Satır seçim kutusu — baş kutunun küçük kardeşi. */
export function SelectRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange?: (next: boolean) => void;
  label: string;
}) {
  return <Checkbox label={<span className="sr-only">{label}</span>} checked={checked} onChange={onChange} />;
}

/**
 * Seçim çubuğu — "3 kayıt seçildi" ve yanındaki toplu eylemler.
 *
 * Tablonun ÜSTÜNDE durur, altında değil: seçim yukarıdan yapılır ve eylem
 * gözün gittiği yerde olmalı. Ve seçim boşken hiç render edilmez — boş bir
 * çubuk yer kaplar, bilgi vermez.
 */
export function SelectionBar({
  count,
  onClear,
  children,
  labels,
  className,
}: {
  count: number;
  onClear?: () => void;
  /**
   * The bulk actions, usually a few `<Button size="sm">`. TR: Toplu eylemler, genelde birkaç
   * `<Button size="sm">`.
   */
  children?: ReactNode;
  /**
   * `selected` may return a ReactNode: in "3 records selected" the bold number is the only
   * thing that makes the sentence scannable. TR: `selected` ReactNode döndürebiliyor: "3 kayıt
   * seçili" cümlesinde sayının kalın olması, cümleyi taranabilir kılan tek şey.
   */
  labels: { selected: (n: number) => ReactNode; clear: string };
  className?: string;
}) {
  if (count === 0) return null;
  return (
    <div
      role="status"
      className={cn(
        "tamga-gutter flex flex-wrap items-center gap-3 border-b border-[var(--color-line)] py-3",
        className,
      )}
      style={{ background: "var(--color-accent-bg)" }}
    >
      <span className="text-body font-medium text-ink tabular-nums">{labels.selected(count)}</span>
      {children ? <span className="flex flex-wrap items-center gap-2">{children}</span> : null}
      <button
        type="button"
        className="tamga-icon-btn ml-auto"
        aria-label={labels.clear}
        onClick={onClear}
      >
        <Icon icon={Close} size="xs" />
      </button>
    </div>
  );
}
