"use client";

import type { MouseEvent, ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";

/* Satırın içinde kendi işi olan her şey: ona basmak satırın bağlantısını açmaz. */
const OWN_JOB =
  "a,button,input,select,textarea,label,summary,[role=button],[role=link],[role=checkbox],[contenteditable=true]";

/**
 * Tablo satırı, tamamı bir bağlantı.
 *
 * Bağlantı satırın İÇİNDE gerçek bir `<a>` olarak kalır (ad hücresi gibi): klavyeyle ona gelinir,
 * ekran okuyucu onu okur, yeni sekmede o açılır. Satırın geri kalanına basmak o bağlantıya basmak
 * demektir. `<tr>`'yi bir bağlantıyla sarmak geçersiz HTML; bağlantıyı `::after` ile satıra yaymak
 * da `<tr>` konumlandırılamadığı için tarayıcıdan tarayıcıya tutmuyor. Bu yüzden tık satırda
 * yakalanıp bağlantıya iletiliyor.
 */
export function LinkRow({
  children,
  className,
  ...rest
}: {
  /**
   * The cells. One of them holds the row's link; mark it `data-row-link` when the row has more
   * than one, otherwise the first link is the row's. TR: Hücreler. Biri satırın bağlantısını
   * taşır; satırda birden çok bağlantı varsa onu `data-row-link` ile işaretle, yoksa ilk bağlantı
   * satırınkidir.
   */
  children: ReactNode;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const open = (e: MouseEvent<HTMLTableRowElement>) => {
    if (e.defaultPrevented) return;
    if ((e.target as Element).closest(OWN_JOB)) return;
    /* Bir hücreden metin seçmek tıklamak değil. */
    if (window.getSelection()?.toString()) return;
    const row = e.currentTarget;
    const link =
      row.querySelector<HTMLAnchorElement>("a[data-row-link]") ??
      row.querySelector<HTMLAnchorElement>("a[href]");
    if (!link) return;
    /* Yeni sekme isteği sentetik bir tıkla iletilirse tarayıcı açılır pencere sayıp engelliyor. */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) {
      window.open(link.href, "_blank", "noopener");
      return;
    }
    link.click();
  };
  return (
    <tr
      {...dataProps(rest)}
      data-row-link=""
      className={cn(className)}
      onClick={open}
      onAuxClick={(e) => {
        if (e.button === 1) open(e);
      }}
    >
      {children}
    </tr>
  );
}
