"use client";

import type { ComponentType, ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { Tooltip } from "./overlay.js";

/**
 * Kendi dosyasında, çünkü YENİ BİR KONTROL.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */

/** İkon raylı gezinme öğesi. */
export function RailLink({
  label,
  active = false,
  href,
  onClick,
  className,
  children,
  showLabel = false,
  linkComponent: Link,
  ...rest
}: {
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** The icon. TR: İkon. */
  children: ReactNode;
  /**
   * SHOW the label beside the icon. A narrow rail is the default (`false`) and the label lives
   * only as the accessible name; `true` in a wide sidebar. TR: Etiketi ikonun yanında GÖSTER.
   * Dar ray varsayılan (`false`) ve etiket yalnız erişilebilir ad olarak yaşar; geniş bir kenar
   * çubuğunda `true`.
   */
  showLabel?: boolean;
  /**
   * The router's link, so the rail does not force a full page load. Without it this component
   * can only draw a plain `<a>`, and a shell that needs client routing ends up writing its own
   * rail link instead of using this one. TR: Yönlendiricinin bağlantısı, ray tam sayfa
   * yüklemeye zorlamasın diye. Olmadığında bu bileşen yalnız düz bir `<a>` çizebiliyor, ve
   * istemci yönlendirmesi isteyen bir kabuk bunu kullanmak yerine kendi ray bağlantısını
   * yazıyor.
   */
  linkComponent?: ComponentType<{ href: string; children?: ReactNode; [k: string]: unknown }>;
  /**
   * Anything else lands on the control: a `data-*` hook a test or a style needs. TR: Geri kalan
   * her şey kontrolün üstüne iniyor: bir testin ya da stilin ihtiyaç duyduğu `data-*` kancası.
   *
   * SİLME: bu yayma olmadan `AppShell`in geçtiği `data-nav` sessizce düşüyor.
   */
  [k: string]: unknown;
}) {
  const shared = {
    ...rest,
    className: cn("tamga-rail-link", showLabel && "tamga-rail-link-wide", className),
    "data-active": active,
    "aria-label": label,
    "aria-current": active ? ("page" as const) : undefined,
  };

  const govde = (
    <>
      {children}
      {showLabel && <span className="min-w-0 truncate">{label}</span>}
    </>
  );

  const kontrol = href ? (
    Link ? (
      <Link href={href} {...shared}>
        {govde}
      </Link>
    ) : (
      <a href={href} {...shared}>
        {govde}
      </a>
    )
  ) : (
    <button type="button" onClick={onClick} {...shared}>
      {govde}
    </button>
  );

  /* İPUCU BİLEŞENİN KENDİ İŞİ, ÇAĞIRANIN DEĞİL.
     Burada `title={label}` vardı: tarayıcının gecikmeli gri balonu, kitin her
     yerdeki ipucundan başka türlü görünüyor. Çağıranlar bu yüzden bir de elle
     `Tooltip` sarıyordu ve ikisi üst üste biniyordu. Etiket görünürken ipucu
     yok: görünen bir metnin üstünde beliren ipucu aynı şeyi ikinci kez söyler. */
  return showLabel ? (
    kontrol
  ) : (
    <Tooltip label={label} placement="right">
      {kontrol}
    </Tooltip>
  );
}
