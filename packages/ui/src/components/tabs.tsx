"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";

/**
 * Sekme şeridi.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */

export type TabItem<T extends string> = {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  /** Verilirse sekme bir BAĞLANTI olur ve şerit bir gezinme alanına döner. */
  href?: string;
  /**
   * Sekme YERİNDE ama henüz gidilemiyor · gizlemek yerine kapatmak, çünkü kapalı
   * sekme yapılacak işin şeklini baştan gösteriyor. Bir bağlantı DEĞİL: `<a>`
   * üretmiyor, yani yeni sekmede açılabilen ölü bir adres bırakmıyor.
   *
   * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
   */
  disabled?: boolean;
  /**
   * The number beside the label: how many rows are in that tab. A mono chip, because it is a
   * count being compared with the other tabs' counts. TR: Etiketin yanındaki sayı: o sekmede kaç
   * satır olduğu. Mono bir çip, çünkü öteki sekmelerin sayılarıyla karşılaştırılan bir SAYI.
   */
  count?: number;
} & Record<string, unknown>;

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  look = "line",
  scroll = false,
  linkAs,
  className,
  ...rest
}: {
  items: readonly TabItem<T>[];
  value: T;
  onChange?: (next: T) => void;
  /** The tab strip's accessible name. TR: Sekme şeridinin erişilebilir adı. */
  label: string;
  /**
   * `line` an underline under the active tab, `folder` tabs that sit ON the panel. The folder
   * shape is for a panel that is a SURFACE of its own, a form's sections inside a card; the
   * line is for views of the page itself. With `folder`, put a `TabPanel` right under the strip:
   * the active tab's bottom edge merges into it. TR: `line` aktif sekmenin altında çizgi,
   * `folder` panelin ÜSTÜNE oturan sekmeler. Klasör biçimi, panelin kendi başına bir YÜZEY
   * olduğu yerler için · bir kartın içindeki form bölümleri; çizgi ise sayfanın kendi
   * görünümleri için. `folder` ile şeridin hemen altına bir `TabPanel` koy: aktif sekmenin alt
   * kenarı onunla birleşiyor.
   */
  look?: "line" | "folder";
  /**
   * Scroll the tabs horizontally when they do not fit; no wrapping. TR: Sekmeler sığmıyorsa
   * yatay kaydır; sarma yok.
   */
  scroll?: boolean;
  /**
   * The link component, such as Next.js's `Link`. Left out, a plain `<a>`. The kit knows no
   * router, so the caller supplies one. TR: Bağlantı bileşeni: Next.js'in `Link`i gibi.
   * Verilmezse düz `<a>`. Kit bir yönlendirici tanımıyor, o yüzden çağıran veriyor.
   */
  linkAs?: React.ElementType;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const klasor = look === "folder";
  const kap = cn(
    klasor ? "tamga-tabs-folder" : "tamga-tabs",
    scroll && "overflow-x-auto",
    className,
  );
  const sekmeSinifi = cn(klasor ? "tamga-tab-folder" : "tamga-tab", scroll && "shrink-0");
  const bagliMi = items.some((t) => t.href);
  const A = linkAs ?? "a";

  const govde = (etiket: ReactNode, icon: ReactNode, count?: number) => (
    <>
      {icon}
      {etiket}
      {count !== undefined ? <span className="tamga-sayac tabular-nums">{count}</span> : null}
    </>
  );

  /* OK TUŞLARI ŞERİTTE GEZİYOR, Tab TUŞU DEĞİL. `role="tablist"` verilen bir
     şerit, ekran okuyucuya "buradan oklarla geçilir" diye duyuruluyor · ve
     oklar çalışmadığında kullanıcı şeritte sıkışıyor.
     Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md */
  function oklar(e: React.KeyboardEvent<HTMLDivElement>) {
    const yon = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const uc = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : -1;
    if (yon === 0 && uc < 0) return;

    const secilebilir = items.filter((t) => !t.disabled);
    if (secilebilir.length === 0) return;
    const simdi = secilebilir.findIndex((t) => t.value === value);

    const hedef =
      uc >= 0
        ? uc === 0
          ? secilebilir[0]
          : secilebilir[secilebilir.length - 1]
        : secilebilir[(simdi + yon + secilebilir.length) % secilebilir.length];
    if (!hedef) return;

    e.preventDefault();
    onChange?.(hedef.value);
    /* Odak da gidiyor: seçili sekme değişip odak eskisinde kalırsa, ekran
       okuyucu hâlâ öncekini okuyor. */
    const dugme = e.currentTarget.querySelector<HTMLElement>(`[data-tab="${hedef.value}"]`);
    dugme?.focus();
  }

  if (bagliMi) {
    return (
      <nav {...dataProps(rest)} aria-label={label} className={kap}>
        {items.map(({ value: v, label: etiket, icon, href, disabled, count, ...rest }) =>
          disabled ? (
            <span
              key={v}
              {...rest}
              aria-disabled="true"
              className={sekmeSinifi}
              data-disabled="true"
            >
              {govde(etiket, icon, count)}
            </span>
          ) : (
            <A
              key={v}
              {...rest}
              href={href}
              className={sekmeSinifi}
              data-active={value === v}
              aria-current={value === v ? "page" : undefined}
            >
              {govde(etiket, icon, count)}
            </A>
          ),
        )}
      </nav>
    );
  }

  return (
    <div role="tablist" aria-label={label} className={kap} onKeyDown={oklar}>
      {items.map(({ value: v, label: etiket, icon, href: _href, disabled, count, ...rest }) => (
        <button
          key={v}
          {...rest}
          type="button"
          role="tab"
          data-tab={v}
          aria-selected={value === v}
          /* Şeritte TEK durak var: seçili sekme. Öteki sekmelere oklarla
             gidiliyor, Tab tuşu şeridi bir bütün olarak geçiyor. */
          tabIndex={value === v ? 0 : -1}
          disabled={disabled}
          className={sekmeSinifi}
          data-active={value === v}
          data-disabled={disabled || undefined}
          onClick={() => onChange?.(v)}
        >
          {govde(etiket, icon, count)}
        </button>
      ))}
    </div>
  );
}

/**
 * Klasör sekmelerinin gövdesi · kendi kenarı ve tabanı olan bir yüzey.
 *
 * Şeridin hemen ALTINDA duruyor: aktif sekmenin alt kenarı saydam olduğu için
 * ikisi tek gövde okunuyor. Çizgili şeritte buna gerek yok · orada panel
 * sayfanın kendisi.
 */
export function TabPanel({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <div {...dataProps(rest)} className={cn("tamga-tab-govde", className)}>
      {children}
    </div>
  );
}
