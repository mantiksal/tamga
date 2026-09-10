"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";

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
};

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  scroll = false,
  linkAs,
  className,
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
      <nav aria-label={label} className={kap}>
        {items.map((t) =>
          t.disabled ? (
            <span
              key={t.value}
              aria-disabled="true"
              className={cn("tamga-tab", scroll && "shrink-0")}
              data-disabled="true"
            >
              {t.icon}
              {t.label}
            </span>
          ) : (
            <A
              key={t.value}
              href={t.href}
              className={cn("tamga-tab", scroll && "shrink-0")}
              data-active={value === t.value}
              aria-current={value === t.value ? "page" : undefined}
            >
              {t.icon}
              {t.label}
            </A>
          ),
        )}
      </nav>
    );
  }

  return (
    <div role="tablist" aria-label={label} className={kap}>
      {items.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={value === t.value}
          disabled={t.disabled}
          className={cn("tamga-tab", scroll && "shrink-0")}
          data-active={value === t.value}
          data-disabled={t.disabled || undefined}
          onClick={() => onChange?.(t.value)}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}
