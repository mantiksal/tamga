import type { ComponentType, ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";

/**
 * YÜZEYLER — kart, tablo, sessiz etiket.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */

/**
 * Kart — kitin tek yükseltilmiş yüzeyi.
 *
 * 1px kenar + 2px sert offset (Yasa 1). İçindeki her şey `Gutter`ın ritmini
 * paylaşır, böylece iki kart yan yana geldiğinde iç boşlukları hizalanır.
 */
export function Card({
  as: Tag = "div",
  overflow = "clip",
  href,
  onClick,
  linkComponent: Link,
  children,
  className,
  ...rest
}: {
  /**
   * The element the card is drawn as. TR: Kartın hangi eleman olarak çizileceği.
   *
   * Belge yapısı, sunum değil: bir kart çoğu zaman bir `section`dır. Varsayılan `div`.
   */
  as?: "div" | "section" | "article" | "ul";
  /**
   * Whether the card's content may spill past its edge. `clip` by default, because the card's
   * rounded corners depend on it: a table inside would run out of the corners without clipping.
   * BUT THE SAME CLIP CUTS EVERY PANEL THAT OPENS INSIDE THE CARD: a Combobox list, a
   * DatePicker calendar, a row menu. The panel works and takes clicks, but half of it is
   * invisible; and because nothing errors, the first suspect is z-index. Z-index does not fix
   * this: no stacking order beats an `overflow` clip. Pass `visible` when a control inside
   * opens something. TR: Kartın içeriği kenarından taşabilir mi. Varsayılan `clip`, çünkü
   * kartın köşe yuvarlaması ona bağlı: içindeki bir tablo, kırpma olmadan köşelerden dışarı
   * taşar. AMA AYNI KIRPMA, KARTIN İÇİNDE AÇILAN HER PANELİ KESER: bir Combobox listesi, bir
   * DatePicker takvimi, bir satır menüsü. Panel çalışır, tıklanır, ama yarısı görünmez; ve hata
   * vermediği için sebebi aranırken ilk akla gelen z-index olur. Z-index bunu çözmez: hiçbir
   * yığın sırası bir `overflow` kırpmasını aşamaz. İçinde açılır bir kontrol varsa `visible`
   * ver.
   */
  overflow?: "clip" | "visible";
  /**
   * Where the whole card leads. It becomes a link and takes the raised physics: it lifts under
   * the pointer and presses flat. A product card, a report card. TR: Kartın tamamının götürdüğü
   * yer. Kart bir bağlantıya dönüyor ve yükselen fiziği alıyor: işaretçinin altında kalkıyor,
   * tıklanınca tabanına oturuyor. Bir ürün kartı, bir rapor kartı.
   *
   * A CARD THAT LEADS SOMEWHERE HAS TO SAY SO. A clickable `div` is invisible to the keyboard
   * and silent to a screen reader; the anchor is the contract, the physics only the promise.
   * TR: BİR YERE GÖTÜREN KART BUNU SÖYLEMEK ZORUNDA. Tıklanabilir bir `div` klavyeye görünmez,
   * ekran okuyucuya sessizdir; sözleşme bağlantının kendisi, fizik yalnızca sözü.
   */
  href?: string;
  /** What the card does when there is nowhere to go. Makes it a `button`. TR: Gidilecek bir yer yokken kartın yaptığı şey. Kartı `button` yapar. */
  onClick?: () => void;
  /** The router's link, so the card does not force a full page load. TR: Yönlendiricinin bağlantısı, kart tam sayfa yüklemeye zorlamasın diye. */
  linkComponent?: ComponentType<{ href: string; className?: string; children?: ReactNode; [k: string]: unknown }>;
  children: ReactNode;
  className?: string;
  /** `data-*` hooks pass through; nothing else does. TR: `data-*` kancaları geçiyor, başkası değil. */
  [k: `data-${string}`]: unknown;
}) {
  const sinif = cn(
    "tamga-card",
    overflow === "visible" && "tamga-card-open",
    (href || onClick) && "tamga-card-live",
    className,
  );

  if (href) {
    return Link ? (
      <Link {...dataProps(rest)} href={href} className={sinif}>
        {children}
      </Link>
    ) : (
      <a {...dataProps(rest)} href={href} className={sinif}>
        {children}
      </a>
    );
  }

  if (onClick) {
    return (
      <button {...dataProps(rest)} type="button" onClick={onClick} className={cn(sinif, "w-full text-left")}>
        {children}
      </button>
    );
  }

  return (
    <Tag {...dataProps(rest)} className={sinif}>
      {children}
    </Tag>
  );
}

/**
 * Kart başlığı — başlık solda, eylem sağda, ikisi aynı taban çizgisinde.
 *
 * Eylemin yeri tartışmaya kapalı: üründeki her satır kontrolünü sağda tutar,
 * ve başka yere koyan bir başlık listeden kopmuş görünür.
 */
export function CardHead({
  children,
  action,
  className,
  ...rest
}: {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <div {...dataProps(rest)} className={cn("tamga-head tamga-gutter tamga-section", className)}>
      {children}
      {action ? <span className="ml-auto">{action}</span> : null}
    </div>
  );
}

/** Kart gövdesi — başlıkla aynı yatay ritim, kendi dikey nefesi. */
export function CardBody({ children, className, ...rest }: { children: ReactNode; className?: string; [k: `data-${string}`]: unknown }) {
  return <div {...dataProps(rest)} className={cn("tamga-gutter py-6", className)}>{children}</div>;
}

/**
 * Tablo.
 *
 * `overflow-x` sarmalayıcısı bileşenin İÇİNDE, çünkü dar bir ekranda taşan bir
 * tablo tüm sayfayı yana kaydırır — ve bunu unutmak, unutulduğu yerde fark
 * edilmeyen bir hatadır.
 */
export function Table({ children, className, ...rest }: { children: ReactNode; className?: string; [k: `data-${string}`]: unknown }) {
  return (
    <div {...dataProps(rest)} className="w-full overflow-x-auto">
      <table className={cn("tamga-table", className)}>{children}</table>
    </div>
  );
}

/**
 * Sessiz etiket — bir başlığın yanındaki ya da bir grubun üstündeki meta satır.
 *
 * Form etiketi DEĞİLDİR: bir kontrolü adlandırmaz, bir şeyi niteler
 * (`p95 · 24h`, `10 kontrol`). Form etiketi için `Field` kullan — o `htmlFor`
 * bağını da kurar.
 */
export function Label({
  children,
  look = "quiet",
  mono = false,
  className,
  ...rest
}: {
  children: ReactNode;
  /**
   * `quiet` the micro-label beside a value ("p95 · 24s"). `section` the heading OVER a group of
   * fields ("delivery details"): letter-spaced and heavier, because it is naming a region rather
   * than annotating a number. TR: `quiet` bir değerin yanındaki mikro etiket ("p95 · 24s").
   * `section` bir alan grubunun ÜSTÜNDEKİ başlık ("teslimat bilgileri"): harf aralıklı ve daha
   * ağır, çünkü bir sayıyı işaretlemiyor bir bölgeyi adlandırıyor.
   */
  look?: "quiet" | "section";
  /**
   * Identifier-shaped text (codes, SKUs) keeps the mono face. TR: Tanımlayıcı biçimli metinler
   * (kodlar, SKU) mono yüzü korur.
   */
  mono?: boolean;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <span
      {...dataProps(rest)}
      className={cn(
        look === "section" ? "tamga-label-section" : "tamga-label",
        mono && "font-mono",
        className,
      )}
    >
      {children}
    </span>
  );
}
