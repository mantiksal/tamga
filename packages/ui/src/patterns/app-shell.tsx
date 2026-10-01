"use client";

import { Fragment } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "../components/icon.js";
import { RailLink } from "../components/rail-link.js";
import { cn } from "../lib/cn.js";
import { PlainLink, type LinkComponent } from "./shared.js";

/**
 * Oturum açmış her ekranın içinde durduğu çerçeve: ray, üst şerit, yüzey.
 *
 * Menü ve açık giriş DIŞARIDAN gelir; kabuk hiçbir ürünün sözlüğünü ve hiçbir
 * yönlendiriciyi tanımaz. Gerekçe: docs/adr/0004-sablon-katmani.md
 */

export type NavEntry = {
  /**
   * The entry's identity. With `onSelect` it is also what `activePath` is compared against.
   * TR: Girişin kimliği. `onSelect` ile birlikte `activePath`in karşılaştırıldığı değer de bu.
   */
  key: string;
  /**
   * Where the entry goes. A desktop app has no addresses: it gives `onSelect` instead, and one of
   * the two is required.
   * TR: Girişin gittiği yer. Masaüstü uygulamasının adresi yok; onun yerine `onSelect` veriyor ve
   * ikisinden biri zorunlu.
   */
  href?: string;
  /**
   * Runs instead of navigating. For a shell whose screens are state, not addresses.
   * TR: Gezinmenin yerine koşuyor · ekranları adres değil durum olan bir kabuk için.
   */
  onSelect?: () => void;
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
   * BAŞLIK YALNIZ GENİŞ RAYDA ÇİZİLİYOR. Dar rayda 40 piksellik bir kutuda bir başlık okunmuyor;
   * orada grup değişimi bir ÇİZGİYLE anlatılıyor, rayın tepesindeki marka ayracının aynısı.
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
  /**
   * A state class on the content surface, for something the shell cannot know: a window-wide drop
   * target marking its edge, say. Layout stays the kit's.
   * TR: İçerik yüzeyine binen durum sınıfı · kabuğun bilemeyeceği bir şey için: pencere genelinde
   * bir bırakma hedefinin kenarını işaretlemesi gibi. Düzen kitte kalıyor.
   */
  mainClassName?: string;
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
  mainClassName,
  linkComponent: Link = PlainLink,
  labels,
  children,
}: AppShellProps) {
  /* Bir giriş kendi alt ağacına sahip, ve EN UZUN EŞLEŞEN KAZANIR: kökün `/`
     olmadığı bir panelde kök giriş altındaki her rotayı yutuyordu.
     Gerekçe: docs/gerekce/08-blok-ve-sablon.md */
  const kapsiyor = (href: string) => activePath === href || activePath.startsWith(`${href}/`);
  const enOzel = nav.reduce<string | null>(
    (kazanan, entry) =>
      entry.href && kapsiyor(entry.href) && (kazanan === null || entry.href.length > kazanan.length)
        ? entry.href
        : kazanan,
    null,
  );
  /* ADRESİ OLMAYAN GİRİŞ ANAHTARIYLA EŞLEŞİYOR: masaüstü kabuğunda ekran bir durum, yol değil. */
  const isCurrent = (entry: NavEntry) =>
    entry.href ? entry.href === enOzel : entry.key === activePath;

  const wide = rail === "wide";

  return (
    /* ÇERÇEVE KENDİ ZEMİNİNDE, ve bu 2026-09-24'e kadar öyle DEĞİLDİ.
       Kabuk `bg-shell` ile boyanıyordu, yani kartların yüzey rengiyle. Sonuç:
       `--color-rail` ve `--color-band` token olarak tanımlı, belgelenmiş ve
       HİÇBİR YERDE kullanılmıyordu · rolü olup tüketicisi olmayan iki token.
       Zeminleri değiştiren biri hiçbir şeyin değişmediğini görüyor ve sebebini
       renkte arıyordu. */
    <div className="flex h-dvh w-full overflow-hidden bg-rail text-ink-soft">
      {/* Rayın genişliği yüzeyin sol boşluğunu da içeriyor: aşağıdaki kap
          soldan dolgu vermiyor, yoksa rayın zemini yüzeyin dolgusuyla birleşip
          simgeleri sola yaslı gösteriyor. */}
      <aside
        className={`flex shrink-0 flex-col gap-2 bg-rail py-4 ${
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
              {entry.section && entry.section !== nav[i - 1]?.section ? (
                wide ? (
                  <p className={`px-2.5 text-caption font-bold uppercase tracking-label text-ink-faint ${i > 0 ? "mt-5 pb-1.5" : "pb-1.5"}`}>
                    {entry.section}
                  </p>
                ) : i > 0 ? (
                  /* DAR RAYDA GRUP BİR ÇİZGİ, ve bir süre HİÇBİR ŞEYDİ: başlık `wide`
                     koşuluna bağlıydı, dolayısıyla daralan ray altı simgeyi tek bir
                     ayrımsız sütuna çeviriyordu · "başlangıç" ile "araçlar" aynı şey
                     gibi okunuyordu. İlk grubun önüne çizgi girmiyor: marka ayracı
                     orada zaten var, ikisi üst üste biner. */
                  <span className="my-1.5 h-0 w-6 shrink-0 border-t border-line" aria-hidden />
                ) : null
              ) : null}
            {/* RAY BAĞLANTISI KİTİN `RailLink`İ, ELLE ÇİZİLMİYOR: elle yazılan kopya geniş
                rayda `tamga-rail-link-wide`ı atlıyordu ve etiket kırpılıyordu. `RailLink`
                artık `linkComponent` de alıyor.
                Gerekçe: docs/gerekce/08-blok-ve-sablon.md */}
            <RailLink
              href={entry.href}
              onClick={entry.onSelect}
              label={entry.label}
              active={isCurrent(entry)}
              showLabel={wide}
              linkComponent={Link}
              data-nav={entry.key}
            >
              {/* 20px: ikon rayda tek başına da taşınıyor (dar hâlde etiket
                  yok), yani satırı tanıtan şey o · 18px'te bir metin glifi
                  kadar kalıyordu. AĞIRLIK SEÇİLİYKEN DEĞİŞİYOR: seçili glif
                  dolu, ötekiler ince · tasarımın "buradasın" işareti bu, ve
                  çerçeveyle birlikte iki kanaldan okunuyor. Bir ara hepsi iki
                  tonluydu ve fark yalnız çerçeveden okunuyordu. */}
              <Icon
                icon={entry.icon}
                size="md"
                weight={isCurrent(entry) ? "fill" : "regular"}
              />
            </RailLink>
            </Fragment>
          ))}
        </nav>

        {railFooter ? <div className="shrink-0">{railFooter}</div> : null}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Üst şerit rayla aynı zemini paylaşıyor: ikisi içeriğin etrafındaki
            tek çerçeve, ve köşede ton değiştiren bir çerçeve iki ayrı şey gibi
            okunuyor. */}
        <header className="tamga-gutter flex items-center gap-4 bg-band py-4">{topbar}</header>

        {/* Sağ ve alt boşluk kartın kendi ofsetine yer bırakıyor: kırpma tuzağı. */}
        <div className="min-h-0 flex-1 overflow-hidden pr-4 pb-4">
          {/* `relative` BİR SÜS DEĞİL, BİR SİGORTA: kaydırılan yüzey konumlu değilse
              içindeki her `position: absolute` eleman (örneğin `sr-only`) kapsayıcı
              bloğunu `html`de bulup belgeyi uzatıyor, ve `h-dvh overflow-hidden` olmasına
              rağmen SAYFANIN KENDİSİ kayıyor.
              Gerekçe: docs/gerekce/08-blok-ve-sablon.md */}
          {/* İÇERİK ÇERÇEVENİN İÇİNDE YÜZEN BİR KUTU. Zemin ve kenar zaten
              `tamga-surface`tan geliyordu; eksik olan köşeydi. Kontrol
              yarıçapıyla (6px) çizilen bir ekran kutusu, içindeki girdilerle
              aynı köşeyi taşıyor ve bir kap gibi okunmuyor. */}
          <main className={cn("tamga-surface tamga-app-main relative h-full min-h-0 overflow-y-auto", mainClassName)}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
