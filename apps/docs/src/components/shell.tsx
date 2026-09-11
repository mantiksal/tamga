"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn, Icon, Select, Sheet, Switch, ThemeToggle } from "tamga-ui";
import { Menu } from "tamga-ui/icons";
import { navGruplari } from "@/content/nav";
import { icSlug, yol } from "@/content/yollar";
import { Toc } from "@/components/toc";
import { endonym, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * Sitenin kabuğu — ve kitin en dürüst testi.
 *
 * Burada ayrı bir "doküman tasarımı" yok: rail, kural çizgileri, kartlar ve
 * kontroller kitin kendi token'larıyla çizildi. Site kitin dilini konuşmuyorsa
 * kit bir dil değildir.
 *
 * ÜÇ SÜTUN, ve orta sütun neden ortada değil. İlk hâli iki sütundu — rail +
 * içerik — ve içerik okunabilirlik için ~72ch'de kesildiği için sağda geniş bir
 * ölü alan kalıyordu; sayfa sola yaslanmış ve dengesiz görünüyordu. Üçüncü
 * sütun (içindekiler) o boşluğu iş yaparak dolduruyor: uzun bir sayfada nerede
 * olduğunu gösteriyor. Dar ekranda ikisi de kaybolur, içerik tam genişliğe yayılır.
 */

function LogoMark() {
  return (
    <span className="flex items-center" aria-label="Tamga Design System">
      {/* MANTIKSAL AMBLEMİ, ve artık geçici değil. Yerinde kitin kendi
          fiziğiyle çizilmiş bir mühür duruyordu ve yorumu da öyle diyordu:
          "gerçek logo gelene kadar". Geldi.

          Kaynak `brand/mantiksal-amblem.svg` ile birebir aynı üç poligon;
          yeniden çizilmedi, çünkü bir markanın işaretini yeniden çizmek onu
          uydurmakla aynı kapıya çıkıyor.

          RENGİ TOKEN, sabit değil. Marka lacivertine en yakın rol
          `--color-accent-line`, ve token olması işaretin temayla dönmesini
          sağlıyor: iki ayrı dosya tutmak gerekmiyor, ve `check-scale` de
          sabit renge zaten izin vermiyor.

          Inline SVG, dosya değil: `<img>` içindeki bir SVG'ye CSS değişkeni
          geçmez. */}
      <svg
        width="26"
        height="23"
        viewBox="0 0 3313 2898"
        fill="var(--color-accent-line)"
        aria-hidden
        focusable="false"
      >
        <polygon points="2285.07 464.04 2673.45 985.2 1656.57 1751.53 639.65 985.2 1028.03 464.04 2285.07 464.04" />
        <polygon points="3312.64 630.46 2811.23 985.2 2128.16 2897.01 3312.64 1898.32 3312.64 630.46" />
        <polygon points="0.5 632.22 501.96 985.2 1184.94 2897.01 0.5 1898.32 0.5 632.22" />
      </svg>
      <span className="ml-2.5 text-[length:var(--docs-brand)] font-semibold tracking-tight text-ink">tamga</span>
      {/* "ui" DEĞİL "design system", ve fark bir kelimeden fazlası: bir
          kütüphane kod gönderir, bir tasarım sistemi kural da gönderir. Site
          on üç kapı, token referansı, blok kataloğu ve şablon katmanı
          taşıyorken adının "ui" demesi, taşıdığından azını söylüyordu. */}
      {/* ALT BAŞLIK DAR EKRANDA GİZLİ. 390 pikselde logo tek başına 158 piksel
          yer kaplıyordu ve sağdaki iki kontrolü ezdiriyordu. Amblem ve "tamga"
          kalıyor: markayı taşıyan onlar, "design system" bir açıklama.
          Erişilebilir ad (`aria-label`) değişmiyor, yani ekran okuyucu yine
          tam adı duyuyor. */}
      <span className="ml-2.5 hidden border-l border-[var(--color-edge)] pl-2.5 font-mono text-[length:var(--docs-small)] text-ink-faint sm:inline">
        design system
      </span>
    </span>
  );
}

/**
 * Dil değiştirici.
 *
 * Aynı sayfanın öteki dildeki hâline gider — ana sayfaya değil. Bir okuyucuyu
 * dil değiştirdiği için başa göndermek, okuduğu yeri kaybettirmektir.
 *
 * NEDEN SWITCH, VE BU BİR İSTİSNA. Kitin kuralı (Yasa 2) net: akranlar arası
 * seçim `Segmented`'in işi, `Switch` bir şeyin açık mı kapalı mı olduğunu
 * söyler. TR ve EN akrandır; kurala harfiyen uyulsaydı burada Segmented
 * dururdu. Bilerek sapıldı: bu sitede tam olarak İKİ dil var ve ikisi de
 * kalıcı — üçüncü bir dil eklendiği gün bu kontrol Segmented'a döner. İki
 * kalıcı seçenek arasında anahtar, bir seçim listesinden daha az yer kaplıyor
 * ve üst şeritte tema düğmesiyle aynı ağırlıkta duruyor.
 *
 * Etiketler kod ("TR" · "EN"), endonim değil. Bu kontrolde iki etiket YAN YANA
 * duruyor; "Türkçe" ve "English" yan yana yazıldığında anahtarın kendisi
 * ikisinin arasında sıkışıp kayboluyordu. Menüde ya da bir dil listesinde
 * endonim doğru cevaptır — kayan bir anahtarın iki ucunda değil.
 *
 * Anahtarın erişilebilir adı sözlükten geliyor; iki harflik etiketler
 * `aria-hidden`. Ekran okuyucu "Dil, anahtar, açık" duyar ve neyin açık
 * olduğunu hemen ardından `lang` özniteliğinden bilir. Etiketleri de okutmak
 * aynı bilgiyi üç kez tekrarlardı.
 */
function LocaleSwitcher({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const router = useRouter();

  /* Yol öteki dilde YENİDEN KURULUYOR, öneki değiştirilerek değil.
     Kavram sayfalarının adresi çevriliyor (`/tr/docs/ikonlar` · `/en/docs/icons`),
     ve öneki değiştirmek `/en/docs/ikonlar` üretiyordu: dil değiştiren okuyucu
     404 alıyordu. İç slug bulunup öteki dilin adresi `yol()` ile kuruluyor. */
  const parcalar = pathname.split("/");
  const bulunanSlug =
    parcalar[2] === "docs" && parcalar[3] ? (icSlug(lang, parcalar[3]) ?? parcalar[3]) : null;
  const rest = pathname.replace(new RegExp(`^/${lang}`), "") || "";

  /* Anahtarın "açık" ucu VARSAYILAN OLMAYAN dil. Varsayılanı (tr) kapalı uçta
     tutmak, siteye ilk gelenin anahtarı dokunulmamış görmesini sağlıyor. */
  const on = lang === "en";

  function go(next: boolean) {
    const target: Locale = next ? "en" : "tr";
    if (target === lang) return;
    router.push(bulunanSlug ? yol(target, bulunanSlug) : `/${target}${rest}`);
  }

  return (
    <>
      {/* DAR EKRANDA SEÇİM KUTUSU, ANAHTAR DEĞİL.

          Anahtar "TR [•] EN" olarak 89 piksel yer kaplıyordu ve şeridin sağ
          ucunda tema anahtarıyla yan yana durunca iki anahtar birbirine
          karışıyordu: hangisinin dili hangisinin temayı değiştirdiği
          okunmuyordu. Kutu hem dar hem de ne olduğunu kendi söylüyor.

          İki ayrı kontrol render ediliyor ve biri gizleniyor: aynı bileşenin
          iki farklı biçimi değil, iki farklı bileşen. Tek bir işaretle
          ("mobilse şunu göster") yapılamıyor çünkü karar CSS kırılımında,
          JavaScript'te değil; `useEffect` ile ölçseydik ilk boyamada yanlış
          olanı gösterirdik. */}
      <span className="sm:hidden">
        <Select
          options={locales.map((l) => l.toUpperCase())}
          value={lang.toUpperCase()}
          onChange={(v) => go(v.toLowerCase() === "en")}
          placeholder={lang.toUpperCase()}
          aria-label={dict.chrome.language}
          className="w-20"
        />
      </span>

      <span className="hidden shrink-0 items-center gap-2 sm:flex">
        {locales.map((l) => (
          <span
            key={l}
            aria-hidden
            /* Etkin olmayan taraf soluk: anahtarın topuzu nerede olursa olsun,
               hangi dilde olduğun okunabilir kalıyor. */
            className={
              l === lang
                ? "font-mono text-small tracking-wide text-ink"
                : "font-mono text-small tracking-wide text-ink-faint"
            }
            /* Sırayı kaynaktan değil anahtardan alıyoruz: kapalı uç solda. */
            style={{ order: l === "tr" ? 0 : 2 }}
            title={endonym[l]}
          >
            {l.toUpperCase()}
          </span>
        ))}
        <Switch on={on} onChange={go} label={dict.chrome.language} className="order-1" />
      </span>
    </>
  );
}

/**
 * Menü satırı.
 *
 * SEÇİLİ SATIR DOLGU ALMIYOR, ve bu kitin kendi kuralı. `kit.css`'te
 * `.tamga-rail-link`'in başında şu yazıyor: *outlined and lifted when active —
 * never a solid fill*. Yasa 2 de aynı şeyi söylüyor: dolgu EYLEM demek, çerçeve
 * SEÇİM demek. "Buradasın" bir eylem değildir.
 *
 * İlk sürüm kitin `.tamga-option`'ını kullanıyordu — o bir açılır listedeki
 * satır ve dolgu alıyor, çünkü orada seçim bir DEĞER atamak demek. Bir menüde
 * aynı satır, dar bir rayı boydan boya dolduran ağır bir blok olarak çıkıyor.
 * Sınıf doğruydu, bağlamı yanlıştı.
 *
 * Şimdiki hâli rail'in dilinin metin ölçeğindeki karşılığı: kabuk zemini,
 * aksan kenarı, 2px sert offset. Yükselmiyor — oturuyor.
 */
function NavLink({
  lang,
  slug,
  pathname,
  children,
  onGit,
}: {
  lang: Locale;
  slug: string;
  pathname: string;
  children: ReactNode;
  /* ÇEKMECEDE TIKLAMA ÇEKMECEYİ KAPATIYOR. Next yönlendirmesi sayfayı
     yeniden yüklemiyor, yani çekmece açık kalıyordu: kullanıcı bağlantıya
     basıyor, hiçbir şey olmuyor sanıyor ve ikinci kez basıyor. Rayda bu geri
     çağırma verilmiyor, çünkü orada kapanacak bir şey yok. */
  onGit?: () => void;
}) {
  /* Boş slug ana sayfa: `/tr`. Ayrı bir bileşen yazmak yerine tek satır,
     çünkü satırın geri kalanı — seçili hâli, `aria-current`, fiziği —
     birebir aynı. */
  const href = yol(lang, slug);
  const here = pathname === href;
  return (
    <Link
      href={href}
      className="docs-nav-link no-underline"
      data-active={here}
      aria-current={here ? "page" : undefined}
      onClick={onGit}
    >
      {children}
    </Link>
  );
}

/**
 * Paylaşılan üst şerit.
 *
 * İKİ DÜZEN VAR ve şerit ikisinde de aynı: tanıtım sayfasında ve dokümanda.
 * Ayrı yazılsalardı biri güncellenip öteki unutulurdu — ve bir sitenin
 * başlığının iki sayfada farklı olması, ziyaretçiye iki ayrı siteye
 * girmiş hissi verir.
 *
 * `cta` yalnız tanıtım tarafında doluyor: dokümanın içindeyken "dokümana git"
 * demek anlamsız.
 */
export function SiteHeader({
  lang,
  dict,
  cta,
  onMenu,
}: {
  lang: Locale;
  dict: Dictionary;
  cta?: ReactNode;
  /** Verilirse dar ekranda bir menü düğmesi çıkıyor. Tanıtım sayfası vermiyor. */
  onMenu?: () => void;
}) {
  return (
    <header
      className="sticky top-0 z-20 border-b border-[var(--color-line)]"
      style={{ height: "var(--docs-top)", background: "var(--color-shell)" }}
    >
      {/* DOLGU İÇERİKLE AYNI (`px-5 sm:px-7`), ve bir ara `px-4` denendi.
          Şerit 390 pikselde sığıyordu ama logo, altındaki metinden dört piksel
          sola kayıyordu: kazanılan yer, kaybedilen hizaya değmiyor. Yer
          bunun yerine boşluklardan ve alt başlığı gizlemekten kazanıldı. */}
      <div className="mx-auto flex h-full max-w-(--docs-wrap) items-center gap-2 px-5 sm:gap-4 sm:px-7">
        {/* MENÜ DÜĞMESİ SOLDA, LOGONUN ÖNÜNDE. Telefonda gezinme aracı ilk
            ulaşılan şey olmalı; sağ üst köşe başparmağın en uzak noktası. */}
        {onMenu ? (
          <button
            type="button"
            onClick={onMenu}
            aria-label={dict.nav.menuAc}
            className="tamga-icon-btn shrink-0 md:hidden"
          >
            <Icon icon={Menu} size="sm" />
          </button>
        ) : null}

        {/* MENÜ DÜĞMESİ VARKEN LOGO DAR EKRANDA YOK.
            İkisi yan yana durunca şeridin solunda iki işaret oluyordu: biri
            gezinme aracı, öteki marka, ve ikisi de tıklanabilir. Hangisinin
            menüyü açacağı bakarak anlaşılmıyordu. Marka çekmecenin tepesine
            taşındı; menüyü açan kişi zaten oraya bakıyor. Menü düğmesi
            olmayan tanıtım sayfasında logo yerinde kalıyor. */}
        <Link
          href={`/${lang}`}
          className={cn("min-w-0 no-underline", onMenu && "hidden md:inline-flex")}
        >
          <LogoMark />
        </Link>

        <span className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
          {/* CTA DAR EKRANDA GİZLİ, VE KAYBOLMUYOR: tanıtım sayfasındaki
              "Doküman" düğmesi, hemen altındaki kahramanın kendi düğmesiyle
              aynı yere gidiyor. Şeritte tutmak, 390 pikselde üç kontrolü
              birbirine yapıştırmak demekti. */}
          {cta ? <span className="hidden sm:inline-flex">{cta}</span> : null}
          <span className="hidden font-mono text-body text-ink-faint sm:inline">v0.0.0</span>
          <LocaleSwitcher lang={lang} dict={dict} />
          {/* TELEFONDA KUTU, MASAÜSTÜNDE ANAHTAR.
              Dil kutu, tema anahtar olunca ikisi yan yana iki ayrı dilden
              konuşuyordu: biri kenarlı ve okluydu, öteki iki simge arasında
              bir topuz. Telefonda ikisi de kutu; ne olduklarını sözcükle
              söylüyorlar ve aynı şekli paylaşıyorlar. Geniş ekranda yer bol,
              anahtar duruyor: orada tema durumu hiç açmadan görünüyor. */}
          <span className="sm:hidden">
            <ThemeToggle
              variant="select"
              labels={dict.chrome.themeState}
              storageKey="docs-theme"
              className="w-24"
            />
          </span>
          <span className="hidden sm:inline-flex">
            <ThemeToggle variant="switch" labels={dict.chrome.theme} storageKey="docs-theme" />
          </span>
        </span>
      </div>
    </header>
  );
}

/* Menünün gövdesi tek yerde: hem ray hem çekmece bunu çiziyor. İki kopya,
   yeni bir sayfanın telefonda sessizce eksik kalması demek. */
function MenuGovdesi({
  lang,
  dict,
  pathname,
  onGit,
}: {
  lang: Locale;
  dict: Dictionary;
  pathname: string;
  /** Çekmecede bir bağlantıya basılınca çekmeceyi kapatan geri çağırma. */
  onGit?: () => void;
}) {
  return (
    <>
          {/* ANA SAYFA, menünün ilk satırı ve grupsuz.

              Logo zaten oraya gidiyor — ama bir logo bir MARKA işaretidir,
              gezinme öğesi değil; ve menüde karşılığı olmayan bir sayfa,
              menüye bakan biri için var olmayan bir sayfadır. */}
          <div className="mb-5">
            <NavLink lang={lang} slug="" pathname={pathname} onGit={onGit}>
              {dict.nav.home}
            </NavLink>
          </div>

          {/* GRUPLAR: gerekçe content/nav.ts'te. Kısaca: sayfa sayısı 92'ye
              çıktı ve 78'i bileşen; Kurulum, Token'lar ve Bloklar o listenin
              içinde kayboluyordu. Gruplama bileşenleri BÖLMÜYOR, tek bir
              satıra katlıyor. */}
          {navGruplari(lang).map((g) => {
            const acikMi = g.sayfalar.some((p) => pathname === yol(lang, p.slug));
            return (
              <div key={g.key} className="mb-5">
                {g.katlanir ? (
                  /* AÇIK MI KAPALI MI, O ANKİ SAYFAYA BAĞLI. Bir bileşen
                     sayfasındayken kapalı duran bir liste, komşularını
                     gizliyor demektir; okuyucu tam da orada gezinir. */
                  <details open={acikMi} className="docs-nav-grup">
                    <summary className="docs-nav-baslik">
                      {g.baslik[lang]}
                      <span className="ml-auto font-mono text-[length:var(--text-caption)] tabular-nums">
                        {g.sayfalar.length}
                      </span>
                    </summary>
                    <div className="mt-1">
                      {g.sayfalar.map((page) => (
                        <NavLink key={page.slug} lang={lang} slug={page.slug} pathname={pathname} onGit={onGit}>
                          {page.title[lang]}
                        </NavLink>
                      ))}
                    </div>
                  </details>
                ) : (
                  <>
                    <p className="docs-nav-baslik">{g.baslik[lang]}</p>
                    {g.sayfalar.map((page) => (
                      <NavLink key={page.slug} lang={lang} slug={page.slug} pathname={pathname} onGit={onGit}>
                        {page.title[lang]}
                      </NavLink>
                    ))}
                  </>
                )}
              </div>
            );
          })}
    </>
  );
}

/**
 * Doküman düzeni — üç sütun.
 *
 * Tanıtım sayfası bunu KULLANMIYOR: bir landing'in rayı olmaz, ve 81 satırlık
 * bir menü "bu nedir" diye gelen birine hiçbir şey anlatmaz. İkisi ayrı
 * `layout.tsx` altında yaşıyor — `/docs` bunu alıyor, `/` almıyor.
 */
export function DocsShell({ children, lang, dict }: { children: ReactNode; lang: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  /* MENÜ DAR EKRANDA BİR ÇEKMECE. Ray `md:` altında gizliydi ve yerine hiçbir
     şey konmamıştı: 92 sayfalık bir doküman sitesi telefonda GEZİLEMİYORDU.
     Ne menü ne arama; okuyucu ancak dışarıdan bir bağlantıyla gelebiliyor,
     geldiği sayfadan da hiçbir yere gidemiyordu. */
  const [menuAcik, setMenuAcik] = useState(false);

  return (
    <div className="min-h-dvh bg-page text-ink-soft">
      <SiteHeader lang={lang} dict={dict} onMenu={() => setMenuAcik(true)} />

      {/* Kitin kendi `Sheet`i: doküman sitesi kitin bileşenini kullanmazsa
          kitin o bileşeni gerçekten çalışıyor mu bilinmez. */}
      <Sheet
        open={menuAcik}
        onClose={() => setMenuAcik(false)}
        side="start"
        title={dict.nav.docs}
        closeLabel={dict.nav.menuKapat}
      >
        {/* MARKA ÇEKMECENİN TEPESİNDE, şeritte değil. Çekmece açıkken şerit
            zaten görünmüyor; marka buraya gelince hem yerini koruyor hem de
            ana sayfaya giden yol menünün içinde kalıyor. */}
        <Link
          href={`/${lang}`}
          onClick={() => setMenuAcik(false)}
          className="mb-6 inline-flex no-underline"
        >
          <LogoMark />
        </Link>
        <MenuGovdesi lang={lang} dict={dict} pathname={pathname} onGit={() => setMenuAcik(false)} />
      </Sheet>

      <div className="mx-auto flex max-w-(--docs-wrap) items-start gap-0 px-5 sm:px-7">
        {/* ① Rail — kilitli menü, content/nav.ts'ten map'leniyor */}
        <nav
          className="sticky hidden shrink-0 overflow-y-auto py-9 pr-7 md:block"
          style={{
            width: "var(--docs-rail)",
            top: "var(--docs-top)",
            height: "calc(100dvh - var(--docs-top))",
          }}
          aria-label={dict.nav.docs}
        >
          <MenuGovdesi lang={lang} dict={dict} pathname={pathname} />
        </nav>

        {/* ② İçerik */}
        <main className="min-w-0 flex-1 py-10 md:border-x md:border-[var(--color-line)] md:px-10">
          <div className="mx-auto" style={{ maxWidth: "var(--docs-measure)" }}>
            {children}
          </div>
        </main>

        {/* ③ İçindekiler — geniş ekranda, sayfanın kendi başlıklarından.
            Sütunun kendisi Toc içinde: başlık yoksa sütun da yok. */}
        <Toc key={pathname} label={dict.nav.toc} />
      </div>
    </div>
  );
}
