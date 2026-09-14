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
   * Sekme YERİNDE ama henüz gidilemiyor.
   *
   * NEDEN GİZLEMEK YERİNE KAPATMAK. "Önce kaydet, sonra zenginleştir"
   * akışında bir kayıt doğmadan fotoğrafı ya da kategorisi olamaz. Sekmeleri
   * o ana kadar gizlemek, kaydettikten sonra ekranın altından dört yeni
   * sekme çıkması demek; kullanıcı ne kazandığını değil neyin değiştiğini
   * anlamaya çalışıyor. Kapalı sekme yapılacak işin ŞEKLİNİ baştan
   * gösteriyor.
   *
   * Kapalı sekme bir bağlantı DEĞİL: `<a>` üretmiyor, o yüzden sağ tıklayıp
   * yeni sekmede açılabilen ölü bir adres de bırakmıyor.
   */
  disabled?: boolean;
} & Record<string, unknown>;

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
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
  const kap = cn(
    "flex gap-6 border-b border-[var(--color-line)]",
    scroll && "overflow-x-auto",
    className,
  );
  const bagliMi = items.some((t) => t.href);
  const A = linkAs ?? "a";

  if (bagliMi) {
    return (
      <nav {...dataProps(rest)} aria-label={label} className={kap}>
        {items.map(({ value: v, label: etiket, icon, href, disabled, ...rest }) =>
          disabled ? (
            <span
              key={v}
              {...rest}
              aria-disabled="true"
              className={cn("tamga-tab", scroll && "shrink-0")}
              data-disabled="true"
            >
              {icon}
              {etiket}
            </span>
          ) : (
            <A
              key={v}
              {...rest}
              href={href}
              className={cn("tamga-tab", scroll && "shrink-0")}
              data-active={value === v}
              aria-current={value === v ? "page" : undefined}
            >
              {icon}
              {etiket}
            </A>
          ),
        )}
      </nav>
    );
  }

  return (
    <div role="tablist" aria-label={label} className={kap}>
      {items.map(({ value: v, label: etiket, icon, href: _href, disabled, ...rest }) => (
        <button
          key={v}
          {...rest}
          type="button"
          role="tab"
          aria-selected={value === v}
          disabled={disabled}
          className={cn("tamga-tab", scroll && "shrink-0")}
          data-active={value === v}
          data-disabled={disabled || undefined}
          onClick={() => onChange?.(v)}
        >
          {icon}
          {etiket}
        </button>
      ))}
    </div>
  );
}
