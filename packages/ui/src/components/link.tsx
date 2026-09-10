import type { ComponentType, ReactNode } from "react";

/**
 * Yönlendiricinin bağlantısı, dışarıdan verilir.
 *
 * NEDEN KİTİN İÇİNDE DEĞİL: kit hangi yönlendiricinin kullanıldığını
 * bilmiyor ve bilmemeli (`next/link`, `react-router`, ya da düz `a`).
 * Bileşen bir `href` alıp `a` yazsaydı her tıklama tam sayfa yüklerdi.
 *
 * NEDEN `components/` ALTINDA, `patterns/` ALTINDA DEĞİL: burada doğmuştu,
 * ama bir BİLEŞEN de (`Kpi`) bağlantı olabildiği için şablon katmanına
 * bağımlı olması gerekiyordu. Bir bileşenin şablondan import etmesi katmanı
 * ters çevirir; tip aşağı indi, `patterns/shared.tsx` onu yeniden dışa
 * vuruyor ve dışarıdan bakan API hiç değişmedi.
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
