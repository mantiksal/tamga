"use client";

import { Fragment } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "../components/icon.js";
import { RailLink } from "../components/rail-link.js";
import { PlainLink, type LinkComponent } from "./shared.js";

/**
 * Oturum açmış her ekranın içinde durduğu çerçeve: ray, üst şerit, yüzey.
 *
 * Menü ve açık giriş DIŞARIDAN gelir; kabuk hiçbir ürünün sözlüğünü ve hiçbir
 * yönlendiriciyi tanımaz. Gerekçe: docs/adr/0004-sablon-katmani.md
 */

export type NavEntry = {
  key: string;
  href: string;
  /** The translated label. In the tooltip on a narrow rail, on the row itself on a wide one. TR: Çevrilmiş etiket. Dar rayda ipucunda, geniş rayda satırın kendisinde. */
  label: string;
  icon: ComponentProps<typeof Icon>["icon"];
  /**
   * The group this entry belongs to, already translated. TR: Bu girişin ait olduğu grup, çevrilmiş
   * hâliyle.
   *
   * Ray, ardışık girişleri bu ada göre kümeliyor ve grup değiştiğinde bir başlık çiziyor. Verilmezse
   * giriş başlıksız kalıyor; hiçbiri vermezse ray tek bir liste olarak çiziliyor, yani eski davranış.
   *
   * ALAN DÜZ, VERİ İÇ İÇE DEĞİL. `nav` bir gruplar dizisi olsaydı bu kırıcı bir değişiklik olurdu,
   * ve boş bir grup kurmak mümkün hâle gelirdi. Düz listede o iki sorun da yok: grup başlığı
   * verinin bir alanı, ve başlık ancak bir girişi varsa görünüyor.
   *
   * YALNIZ GENİŞ RAYDA ÇİZİLİYOR. Dar rayda 40 piksellik bir kutuda başlık okunmuyor; orada
   * gruplama boşlukla anlatılıyor.
   */
  section?: string;
};

export type AppShellProps = {
  /** The brand mark at the top of the rail; the caller supplies its own link. TR: Rayın tepesindeki marka işareti; kendi bağlantısını çağıran veriyor. */
  brand?: ReactNode;
  nav: readonly NavEntry[];
  /** The open path. The route passes `usePathname()`. TR: Açık yol. Rota `usePathname()` geçiyor. */
  activePath: string;
  /**
   * How wide the rail is. TR: Rayın genişliği.
   *
   * `narrow` yalnız simge, etiket ipucunda; `wide` simge ve etiket yan yana.
   * Dar ray ekranı içeriğe bırakıyor ve simgeleri tanıyan birine yetiyor;
   * geniş ray yeni gelen birine menüyü okutuyor. Hangisinin doğru olduğu
   * ürüne bağlı, o yüzden şablon karar vermiyor, soruyor.
   *
   * "Kullanıcı seçsin" diye bir üçüncü değer YOK ve olmamalı: o bir TERCİH,
   * ve tercihin nerede saklandığını (oturum, hesap, tarayıcı) kit bilemez.
   * Ürün tercihi okur, buraya `narrow` ya da `wide` geçer.
   */
  rail?: "narrow" | "wide";
  /**
   * The top bar is GLOBAL CONTEXT, not work. The content belongs to the caller; the template
   * only guarantees its place. TR: Üst şerit KÜRESEL BAĞLAM, iş değil. İçerik çağıranın; şablon
   * yalnız yerini garanti ediyor.
   */
  topbar?: ReactNode;
  /** A control at the foot of the rail: an expand/collapse button, say. TR: Rayın dibine giren kontrol: genişlet/daralt düğmesi gibi. */
  railFooter?: ReactNode;
  linkComponent?: LinkComponent;
  labels: { home: string; primaryNav: string };
  children: ReactNode;
};

export function AppShell({
  brand,
  nav,
  activePath,
  rail = "narrow",
  topbar,
  railFooter,
  linkComponent: Link = PlainLink,
  labels,
  children,
}: AppShellProps) {
  /* Bir giriş kendi alt ağacına sahip: `/urunler`, `/urunler/42/fotograflar`
     üzerinde de açık giriştir.

     AMA EN UZUN EŞLEŞEN KAZANIR, ve bu bir özel durumu ortadan kaldırdı. Önce
     kural "tam eşleşme yalnız `/` için" diye yazılıydı: kökün `/` olmadığı bir
     panelde (`/panel`) kök giriş altındaki HER rotayı yutuyordu, yani sipariş
     detayında hem "Pano" hem "Siparişler" açık görünüyordu. Ölçüldü.

     Kökün hangi yol olduğu ürünün bilgisi, kitin değil — o yüzden kite yeni bir
     prop eklemek yerine kural genelleştirildi: yolu kapsayan girişlerden EN
     ÖZELİ açık. `/` de bu kuralın kendiliğinden bir örneği, artık ayrıca
     yazılmıyor. */
  const kapsiyor = (href: string) => activePath === href || activePath.startsWith(`${href}/`);
  const enOzel = nav.reduce<string | null>(
    (kazanan, entry) =>
      kapsiyor(entry.href) && (kazanan === null || entry.href.length > kazanan.length)
        ? entry.href
        : kazanan,
    null,
  );
  const isCurrent = (href: string) => href === enOzel;

  const wide = rail === "wide";

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-shell text-ink-soft">
      {/* Rayın genişliği yüzeyin sol boşluğunu da içeriyor: aşağıdaki kap
          soldan dolgu vermiyor, yoksa rayın zemini yüzeyin dolgusuyla birleşip
          simgeleri sola yaslı gösteriyor. */}
      <aside
        className={`flex shrink-0 flex-col gap-2 bg-shell py-4 ${
          wide ? "w-60 px-3" : "w-20 items-center px-1"
        }`}
        data-rail={rail}
      >
        {brand ? (
          <>
            <span
              aria-label={labels.home}
              className={`mb-2 flex h-10 shrink-0 items-center text-ink ${wide ? "px-2" : "w-10 justify-center"}`}
            >
              {brand}
            </span>
            <span className={`h-0 w-6 border-t border-line ${wide ? "ml-2" : ""}`} />
          </>
        ) : null}

        <nav
          aria-label={labels.primaryNav}
          className={`tamga-rail-scroll flex w-full flex-1 flex-col gap-2 py-1 ${wide ? "" : "items-center"}`}
        >
          {nav.map((entry, i) => (
            <Fragment key={entry.key}>
              {/* BAŞLIK GRUP DEĞİŞTİĞİNDE. Ardışık girişler aynı adı taşıdığı sürece tek grup;
                  ad değişince yeni bir başlık çıkıyor. Tıklanmaz ve tıklanır GÖRÜNMEZ: bir
                  gezinme listesinde tıklanamayan bir şeyin bağlantıya benzemesi, kullanıcıya
                  çalışmayan bir hedef gösterir. */}
              {wide && entry.section && entry.section !== nav[i - 1]?.section ? (
                <p className={`px-2.5 text-micro font-semibold uppercase tracking-wide text-ink-faint ${i > 0 ? "mt-4 pb-1" : "pb-1"}`}>
                  {entry.section}
                </p>
              ) : null}
            {/* RAY BAĞLANTISI KİTİN `RailLink`İ, ELLE ÇİZİLMİYOR.
               Burada elle bir `<Link className="tamga-rail-link">` vardı ve
               geniş rayda `tamga-rail-link-wide` sınıfını atlıyordu: etiket
               40 piksellik kutuda "İ..." diye kırpılıyordu. Aynı kontrolün iki
               uygulaması vardı ve yenisi eksikti. `RailLink` artık
               `linkComponent` de aldığı için elle çizmenin sebebi kalmadı; dar
               raydaki ipucu da onun kendi işi. */}
            <RailLink
              href={entry.href}
              label={entry.label}
              active={isCurrent(entry.href)}
              showLabel={wide}
              linkComponent={Link}
              data-nav={entry.key}
            >
              <Icon icon={entry.icon} size="base" />
            </RailLink>
            </Fragment>
          ))}
        </nav>

        {railFooter ? <div className="shrink-0">{railFooter}</div> : null}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="tamga-gutter flex items-center gap-4 py-4">{topbar}</header>

        {/* Sağ ve alt boşluk kartın kendi ofsetine yer bırakıyor: kırpma tuzağı. */}
        <div className="min-h-0 flex-1 overflow-hidden pr-4 pb-4">
          {/* `relative` BİR SÜS DEĞİL, BİR SİGORTA.

              Kaydırılan yüzey KONUMLU DEĞİLSE, içindeki her `position: absolute`
              eleman kapsayıcı bloğunu `html`de arıyor — ve `sr-only` tam olarak
              öyle bir eleman. Bulduğu an belge koordinatlarına yerleşiyor,
              belgeyi uzatıyor, ve `h-dvh overflow-hidden` olmasına rağmen
              SAYFANIN KENDİSİ kayıyor: gövdenin altında boş bir alan beliriyor.

              Bir tüketicide iki kez çıktı, ikisi de gözle bulundu ve ikisinde de
              ilk şüpheli yanlış yerdeydi. Yüzeyi konumlu yapmak sınıfın tamamını
              kapatıyor: içeride kaçan bir mutlak eleman artık en fazla bu yüzeyin
              içinde kayıyor. */}
          <main className="tamga-surface relative h-full min-h-0 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
