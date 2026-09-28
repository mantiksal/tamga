import type { ComponentType, ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";

/**
 * Sınıfı olan ama bileşeni olmayan şeyler.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */

/**
 * Düz yüzey — kenarı var, yükselmiyor.
 *
 * `raised` verilince kartın fiziğini alır (1px kenar + 2px sert offset).
 * İkisi ayrı bileşen değil, çünkü aralarındaki fark bir varyant: aynı şekil,
 * artı yükseklik. Yasa 1 zaten "yükselme tek formül" diyor.
 */
export function Surface({
  raised = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { raised?: boolean }) {
  return (
    <div className={cn(raised ? "tamga-raised" : "tamga-surface", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Yatay taşma kabı · asıl işi erişilebilirlik. `overflow-x: auto` tek başına
 * yalnız FARE için çalışıyor; `tabIndex={0}` + `role="region"` + zorunlu bir ad
 * o kutuyu klavyeye açıyor.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
/**
 * Aşağıdan giren blok · GİRİŞ animasyonu, hover etkisi değil.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
export function Reveal({
  delay = 0,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { delay?: number }) {
  return (
    <div
      className={cn("tamga-reveal", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * İki durumun aynı yerde durması · kutu her zaman UZUN olanın genişliğinde,
 * yani "Kaydet" → "Kaydediliyor…" yanındaki hiçbir şeyi kaydırmıyor. Gizlenen
 * taraf `aria-hidden` alıyor.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
export function Swap({
  showing,
  a,
  b,
  className,
  ...rest
}: {
  /** Which side is visible: `"a"` or `"b"`. TR: Hangi taraf görünür: `"a"` ya da `"b"`. */
  showing: "a" | "b";
  a: ReactNode;
  b: ReactNode;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <span {...dataProps(rest)} className={cn("tamga-swap", className)}>
      <span data-hidden={showing !== "a"} aria-hidden={showing !== "a"}>
        {a}
      </span>
      <span data-hidden={showing !== "b"} aria-hidden={showing !== "b"}>
        {b}
      </span>
    </span>
  );
}

/**
 * Liste satırı · tablo olmayan listeler için. `href` verilirse bağlantı,
 * `onClick` verilirse düğme, ikisi de yoksa düz satır: tıklanabilir bir `<div>`
 * klavyeyle erişilemiyor.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
export function ListRow({
  size = "base",
  href,
  onClick,
  className,
  children,
  ...rest
}: {
  size?: "base" | "sm";
  href?: string;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const cls = cn("tamga-list-row", size === "sm" && "tamga-list-row-sm", className);
  if (href) {
    return (
      <a {...dataProps(rest)} href={href} className={cls}>
        {children}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(cls, "w-full text-left")}>
        {children}
      </button>
    );
  }
  return <div className={cls}>{children}</div>;
}

/**
 * İçinde bir panel AÇILAN tablo hücresi. Tek işi kırpmayı kapatmak, ve
 * unutulduğunda görünmeyen bir hata üretiyor: hücredeki menü hücre sınırında
 * KESİLİYOR, konsol sessiz, ve ilk akla gelen z-index oluyor. Z-index bunu
 * çözmez · hiçbir yığın sırası bir `overflow` kırpmasını aşamaz.
 *
 * `align` varsayılan olarak sağda: en sık kullanımı satır sonundaki eylem.
 */
export function CellActions({
  className,
  children,
  align = "end",
  ...props
  /* `Omit`: `<td>`in kendi `align` niteliği var (HTML 4'ten kalma, artık
     kullanılmıyor) ve tipi bizimkiyle çakışıyor. */
}: Omit<React.ComponentProps<"td">, "align"> & { align?: "start" | "end" }) {
  return (
    <td
      className={cn("tamga-cell-open", align === "end" && "tamga-cell-actions", className)}
      {...props}
    >
      <span className={cn("flex items-center gap-1", align === "end" ? "justify-end" : "justify-start")}>
        {children}
      </span>
    </td>
  );
}

/**
 * Sayfa başlığı şeridi. Eylem SAĞA yaslı ve başlığın taban çizgisinde.
 *
 * Doküman: /docs/page-band
 */
export function PageBand({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
  ...rest
}: {
  /**
   * A short line above the title saying what KIND of page this is, or whose it is.
   * TR: Başlığın üstünde, bu sayfanın NE TÜR bir sayfa olduğunu ya da kimin olduğunu söyleyen kısa satır.
   *
   * Use it when the title alone leaves a question the reader would otherwise ask, such as whether a
   * setting applies to everyone or only to them.
   * TR: Başlığın tek başına cevapsız bıraktığı bir soru varsa kullanılıyor · bir ayarın herkesi mi
   * yoksa yalnız o kişiyi mi ilgilendirdiği gibi.
   */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    /* BU BİR `h1`, `h2` DEĞİL: kabuk bir başlık çizmiyor, yani `h2` kalırsa
       her ekran belgesinin birinci düzey başlığını kaybediyor. Bir sayfada tek
       şerit olur; bölüm başlığı gereken yerde `SectionHead` var.
       Kendi dolgusu yok: yerini kap biliyor. Gerekçe: docs/ozel/10-tasarim-dili-yenileme.md */
    <div {...dataProps(rest)} className={cn("flex flex-wrap items-end gap-4", className)}>
      <div className="min-w-0 flex-1 basis-65">
        {eyebrow ? (
          <p className="mb-1.5 text-small font-semibold text-ink-faint">{eyebrow}</p>
        ) : null}
        <h1 className="font-display text-display-lg leading-tight font-extrabold text-ink">{title}</h1>
        {subtitle ? <p className="mt-1.5 text-body text-ink-soft">{subtitle}</p> : null}
      </div>
      {actions ? <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/**
 * Gezinen bağlantı. `Button variant="link"` DEĞİL: o bir `<button>`, yani orta
 * tuşla yeni sekmede açılmıyor, kopyalanmıyor, ve ekran okuyucuya "düğme"
 * diyor. `external` verilince `rel="noopener noreferrer"` geliyor · `noopener`
 * olmadan açılan sayfa `window.opener` ile seninkini yönlendirebilir.
 */
export function Link({
  external = false,
  look = "inline",
  className,
  children,
  href,
  linkComponent: Router,
  ...props
}: React.ComponentProps<"a"> & {
  external?: boolean;
  /**
   * `inline` inside a sentence, `standalone` on its own line with an arrow that steps forward
   * under the pointer, `quiet` a link that waits until it is looked at, `marked` a link carrying
   * a wash, for the one address in a paragraph that must be found. TR: `inline` bir cümlenin
   * içinde, `standalone` kendi satırında ve işaretçi altında bir adım ileri giden okuyla,
   * `quiet` bakılana kadar bekleyen bağlantı, `marked` yıkama taşıyan bağlantı · bir paragrafta
   * bulunması gereken tek adres için.
   */
  look?: "inline" | "standalone" | "quiet" | "marked";
  /**
   * The router's link, so an in-app link does not reload the page. TR: Yönlendiricinin
   * bağlantısı, uygulama içi bir bağlantı sayfayı yeniden yüklemesin diye.
   *
   * Verilmezse düz bir `<a>` çiziliyor. `external` ile birlikte yok sayılıyor: uygulamanın
   * dışına çıkan bir adres istemci yönlendirmesiyle açılamaz.
   */
  linkComponent?: ComponentType<{ href: string; className?: string; children?: ReactNode; [k: string]: unknown }>;
}) {
  const shared = {
    className: cn(
      "tamga-link",
      look === "standalone" && "tamga-link-standalone",
      look === "quiet" && "tamga-link-quiet",
      look === "marked" && "tamga-link-marked",
      className,
    ),
    target: external ? ("_blank" as const) : undefined,
    rel: external ? ("noopener noreferrer" as const) : undefined,
    ...props,
  };
  /* YÖNLENDİRİCİ İKİ DURUMDA DEVREDE DEĞİL. Dış bağlantıda, çünkü uygulamanın dışına çıkan bir
     adres istemci yönlendirmesiyle açılamaz ve denemek sessizce bir sekme kaybettirir. Ve adres
     hiç yokken, çünkü yönlendiricinin bağlantısı adressiz çağrılamaz — `<a>` çağrılabilir. */
  return Router && !external && href !== undefined ? (
    <Router {...shared} href={href}>
      {children}
    </Router>
  ) : (
    <a {...shared} href={href}>
      {children}
    </a>
  );
}
