"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import { CaretDown, Close, Sort } from "./icons.js";
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
        {/* YÖN oku yalnız sıralı sütunda, ve vurgu renginde. Sıralı olmayan
            sütun yön DEĞİL, iki yönlü nötr bir glif taşıyor: bu ok değil bir
            davet · "bu başlık tıklanabilir". İkisi aynı glif olsaydı hangi
            sütunun etkin olduğu okunmaz olurdu, hiç glif olmasaydı da
            başlığın bir kontrol olduğu görünmüyordu. */}
        {direction ? (
          <Icon
            icon={CaretDown}
            size="xs"
            className={cn("text-accent", direction === "asc" && "rotate-180")}
          />
        ) : (
          <Icon icon={Sort} size="xs" className="text-ink-faint" />
        )}
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
  ...rest
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange?: (next: boolean) => void;
  label: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <Checkbox
      {...dataProps(rest)}
      compact
      /* İKİSİ DE TABLONUN KUTUSU (`compact`): başlıktaki ile satırdakinin aynı
         ölçüde olması şart · yarım piksellik bir fark bile sütunu eğri
         gösteriyor. Baş kutu bir zamanlar elle çiziliyordu ve işaretliyken
         `Checkbox`ın çentiği yerine düz bir kare basıyordu: aynı sütunda iki
         farklı işaret. */
      label={<span className="sr-only">{label}</span>}
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
    />
  );
}

/** Satır seçim kutusu — baş kutunun küçük kardeşi. */
export function SelectRow({
  checked,
  onChange,
  label,
  ...rest
}: {
  checked: boolean;
  onChange?: (next: boolean) => void;
  label: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <Checkbox
      {...dataProps(rest)}
      compact
      label={<span className="sr-only">{label}</span>}
      checked={checked}
      onChange={onChange}
    />
  );
}

/**
 * Seçim çubuğu · bir şerit değil bir ADA: kendi genişliği kadar, ortalanmış,
 * ters zeminde. `sticky`, yani kaydırılan bir alanın içindeyse altta asılı
 * kalıyor. Seçim boşken hiç render edilmiyor.
 *
 * Gerekçe: docs/gerekce/02-veri-ve-liste.md
 */
export function SelectionBar({
  count,
  onClear,
  children,
  labels,
  className,
  ...rest
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
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  if (count === 0) return null;
  return (
    <div
{...dataProps(rest)}
      role="status"
      className={cn("tamga-selection-bar", className)}
    >
      <span className="text-body font-semibold tabular-nums whitespace-nowrap">
        {labels.selected(count)}
      </span>
      {children ? <span className="flex items-center gap-2">{children}</span> : null}
      <button
        type="button"
        className="tamga-icon-btn"
        aria-label={labels.clear}
        onClick={onClear}
      >
        <Icon icon={Close} size="xs" />
      </button>
    </div>
  );
}
