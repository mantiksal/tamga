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
 * Yatay taşma kabı — ve bu bileşenin asıl işi erişilebilirlik.
 *
 * `overflow-x: auto` tek başına FARE için çalışır. Klavye kullanan biri o
 * kutuya hiç giremez: kaydırılabilir bir alan odaklanabilir değilse içindeki
 * geniş tabloyu yana kaydırmanın yolu yoktur. Tarayıcılar bunu kendiliğinden
 * çözmüyor.
 *
 * `tabIndex={0}` + `role="region"` + bir ad, o kutuyu klavyeye açıyor. Ad
 * zorunlu: adsız bir `region` ekran okuyucunun landmark listesinde
 * "bölge, bölge, bölge" olarak birikir ve hiçbirinin ne olduğu bilinmez.
 */
export function ScrollX({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { label: string }) {
  return (
    <div
      className={cn("tamga-scroll-x", className)}
      role="region"
      aria-label={label}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Aşağıdan giren blok.
 *
 * `.tamga-rise` bir HOVER etkisi değil, bir GİRİŞ animasyonu: sekiz piksel
 * aşağıdan, sönükten. Azaltılmış harekette CSS onu tamamen kapatıyor.
 *
 * `delay` bir listeyi sırayla açmak için. Basamak küçük tutulmalı — otuz
 * satırlık bir listede 60ms'lik bir gecikme, sonuncuyu iki saniye sonra
 * gösterir ve bekleme hissi yaratır.
 */
export function Rise({
  delay = 0,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { delay?: number }) {
  return (
    <div
      className={cn("tamga-rise", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * İki durumun aynı yerde durması.
 *
 * Bir düğmenin yazısı "Kaydet" iken "Kaydediliyor…" olduğunda düğme genişler
 * ve yanındaki her şey kayar. Swap ikisini de aynı ızgara hücresine koyuyor:
 * kutu her zaman UZUN olanın genişliğinde, yani hiçbir şey oynamıyor.
 *
 * Gizlenen taraf `aria-hidden` alıyor. Almasaydı ekran okuyucu iki metni
 * arka arkaya okurdu — "Kaydet Kaydediliyor" — ve hangisinin geçerli olduğu
 * anlaşılmazdı.
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
 * Liste satırı — tablo olmayan listeler için.
 *
 * Bir tabloya yetmeyen ama bir listeden fazlası olan şey: ayarlar satırı,
 * entegrasyon satırı, üye satırı. Sabit yükseklik ve alt kural, satırların
 * taranabilir kalmasını sağlıyor.
 *
 * `href` verilirse bir bağlantıya, `onClick` verilirse bir düğmeye döner —
 * ikisi de yoksa düz bir satır kalır. Bu ayrım önemli: tıklanabilir bir
 * `<div>` klavyeyle erişilemez ve ekran okuyucuya hiçbir şey söylemez.
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
 * İçinde bir panel AÇILAN tablo hücresi.
 *
 * Tek işi kırpmayı kapatmak — ve o tek iş, unutulduğunda görünmeyen bir hata
 * üretiyor: hücrenin içindeki bir menü, ipucu ya da açılır panel hücre
 * sınırında KESİLİYOR. Kontrol çalışıyor, tıklanıyor, ama yarısı yok. Hata
 * mesajı yok, konsol sessiz, ve ilk akla gelen z-index oluyor. Z-index bunu
 * çözmez: hiçbir yığın sırası bir `overflow` kırpmasını aşamaz.
 *
 * `align` VARSAYILAN OLARAK SAĞDA, çünkü en sık kullanımı satır sonundaki
 * eylem menüsü. Ama hiza ile kırpma AYRI iki karar: sola yaslı bir hücrede
 * ipucu barındırmak isteyen, hizasını feda etmek zorunda kalmasın diye
 * `align="start"` var. (Uzun süre tek parçaydı ve tam bu yüzden yakalandı.)
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
 * Sayfa başlığı şeridi.
 *
 * Ürün bunu kendi yazmıştı (23 satır) ve doğru yazmıştı — ama her ekranın
 * tepesinde duran bir şeyin her projede yeniden yazılması, on panelde on
 * farklı boşluk demek.
 *
 * Eylem SAĞA yaslı ve başlığın taban çizgisinde. Başka yere koyan bir başlık
 * altındaki listeden kopmuş görünüyor — bu bir tercih değil, ölçülmüş bir şey.
 */
export function PageBand({
  title,
  subtitle,
  actions,
  className,
  ...rest
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <div {...dataProps(rest)} className={cn("tamga-section tamga-gutter flex flex-wrap items-center gap-4 py-4", className)}>
      <div className="min-w-0">
        <h2 className="text-title font-semibold text-ink">{title}</h2>
        {subtitle ? <p className="text-small text-ink-faint">{subtitle}</p> : null}
      </div>
      {actions ? <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/**
 * Gezinen bağlantı.
 *
 * `.tamga-link` sınıfı kitte yıllarca vardı, bileşeni yoktu — ve doküman
 * sitesi kendi sarmalayıcısını yazmak zorunda kaldı. Sınıfın olup bileşenin
 * olmaması, tam olarak checkbox'ın yaşadığı boşluk.
 *
 * NEDEN `Button variant="link"` DEĞİL. O bir `<button>`; bir bağlantı gibi
 * GÖRÜNÜR ama gezinmez. Orta tuşla yeni sekmede açılamaz, sağ tıkla
 * kopyalanamaz, ve ekran okuyucuya "düğme" der. Görünüm aynı, sözleşme
 * ters.
 *
 * `external` verilince `rel="noopener noreferrer"` geliyor. `noopener`
 * olmadan açılan sayfa `window.opener` üzerinden seninkini yönlendirebilir —
 * eski ve hâlâ geçerli bir açık.
 */
export function Link({
  external = false,
  className,
  children,
  href,
  linkComponent: Router,
  ...props
}: React.ComponentProps<"a"> & {
  external?: boolean;
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
    className: cn("tamga-link", className),
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
