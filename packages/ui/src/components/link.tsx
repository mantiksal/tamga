import type { ComponentType, ReactNode } from "react";

/**
 * Yönlendiricinin bağlantısı, dışarıdan verilir: kit hangi yönlendiricinin
 * kullanıldığını bilmiyor ve bilmemeli. `components/` altında, çünkü bir
 * BİLEŞEN de (`Kpi`) bağlantı olabiliyor ve şablondan import etmesi katmanı
 * ters çevirirdi; `patterns/shared.tsx` tipi yeniden dışa vuruyor.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
export type LinkComponent = ComponentType<{
  href: string;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}>;

export const PlainLink: LinkComponent = ({ href, children, ...rest }) => (
  <a href={href} {...rest}>
    {children}
  </a>
);
