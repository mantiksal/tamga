"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn, Icon, Sheet } from "tamga-ui";
import { ArrowLeft, ArrowRight, CaretRight, GithubLogo, Menu, Moon, Sun } from "tamga-ui/icons";
import sayilar from "@/content/counts.json";
import { findPage, grupAdi, komsular, navGruplari } from "@/content/nav";
import { icSlug, yol } from "@/content/yollar";
import { DocsSearch } from "@/components/docs-search";
import { Toc } from "@/components/toc";
import { useTema } from "@/components/tema";
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
      {/* DOSYA ADI TEMAYI SÖYLÜYOR, MÜREKKEBİ DEĞİL: `tamga-light.svg` AÇIK
          temada kullanılan dosya ve kelime işareti lacivert; `tamga-dark.svg`
          koyu temada kullanılır ve kelime işareti beyaz. Ters okunup
          değiştirilmesi en kolay şey bu.

          SEÇİM CSS İLE, JS İLE DEĞİL. İkisi de DOM'da duruyor, `dark:`
          varyantı birini gizliyor. Temayı JS okuyup tek bir `src` seçseydi
          ilk boyamada yanlış logo bir kare görünürdü; CSS'te o kare yok.
          İki dosya toplam 6 kB, indirme maliyeti tartışmaya değmez.

          İKİ YÜKSEKLİK FARKLI, VE BİLEREK: dosyalar aynı çizimi taşıyor ama
          aynı tuvalde değil, o yüzden aynı `height` ikisini aynı boyda
          göstermiyor. Hesap ve gerekçe `--docs-logo*` token'larının yanında.

          `alt=""` çünkü erişilebilir ad saran `span`in `aria-label`ında. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/tamga-light.svg" alt="" className="h-(--docs-logo) w-auto dark:hidden" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/tamga-dark.svg" alt="" className="hidden h-(--docs-logo-dark) w-auto dark:block" />
    </span>
  );
}

/**
 * Dil değiştirici — TR / EN segmenti.
 *
 * Aynı sayfanın öteki dildeki hâline gider, ana sayfaya değil: bir okuyucuyu
 * dil değiştirdiği için başa göndermek, okuduğu yeri kaybettirmektir.
 *
 * NEDEN SEGMENT. Bir süre anahtardı (`Switch`) ve yanındaki tema anahtarıyla
 * karışıyordu: iki anahtar yan yana, hangisinin dili hangisinin temayı
 * değiştirdiği bakarak anlaşılmıyordu. İkisi de segment olunca şerit tek bir
 * dil konuşuyor, ve seçili olan kendi adıyla yazılı duruyor.
 *
 * Etiketler kod ("TR" · "EN"), endonim değil: iki etiket YAN YANA duruyor ve
 * "Türkçe"/"English" yan yana yazıldığında segment iki kat yer kaplıyor. Menüde
 * ya da bir dil listesinde endonim doğru cevaptır, iki hücreli bir segmentte
 * değil.
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

  return (
    <div className="hidden dil:flex docs-seg" role="radiogroup" aria-label={dict.chrome.language}>
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={l === lang}
          className="docs-seg-btn"
          onClick={() => {
            if (l === lang) return;
            router.push(bulunanSlug ? yol(l, bulunanSlug) : `/${l}${rest}`);
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
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
  tur,
  onGit,
}: {
  lang: Locale;
  slug: string;
  pathname: string;
  children: ReactNode;
  /** Bileşen satırı bir tık küçük: aynı rayda 78 tanesi var. */
  tur?: "bilesen";
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
      data-tur={tur}
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
 * Ayrı yazılsalardı biri güncellenip öteki unutulurdu, ve bir sitenin
 * başlığının iki sayfada farklı olması ziyaretçiye iki ayrı siteye girmiş hissi
 * verir.
 *
 * `cta` ile `bolumler` yalnız tanıtım tarafında doluyor: dokümanın içindeyken
 * "dokümana git" demek anlamsız, ve doküman sayfasının bölümleri rayda.
 *
 * Gerekçe: docs/07-dokuman-sitesi.md
 */
export function SiteHeader({
  lang,
  dict,
  cta,
  bolumler,
  onMenu,
  duzen = "dokuman",
}: {
  lang: Locale;
  dict: Dictionary;
  cta?: ReactNode;
  /** Tanıtım sayfasının bölüm bağlantıları. Dokümanda rayın işi. */
  bolumler?: ReactNode;
  /** Verilirse dar ekranda bir menü düğmesi çıkıyor. Tanıtım sayfası vermiyor. */
  onMenu?: () => void;
  /**
   * Altındaki sayfanın kabı. Şerit onunla aynı genişliği kullanıyor, yoksa
   * logo ile ilk başlık aynı hizada başlamıyor.
   */
  duzen?: "tanitim" | "dokuman";
}) {
  const [tema, setTema] = useTema();
  return (
    <header
      className="sticky top-0 z-20 border-b border-[var(--color-edge)]"
      style={{ background: "var(--color-band)" }}
    >
      {/* TEK SATIR, VE SARMIYOR. Şeritteki her şey `flex:none`; esneyen tek şey
          arama kutusu (`flex:0 1 300px`), yani yer daraldığında kısalan o
          oluyor. Sarması, sticky yüksekliğinin değişmesi demek: rayın ve
          içindekilerin `top`u kaçar. */}
      <div
        className={cn(
          "mx-auto flex items-center gap-3 px-6",
          duzen === "tanitim" ? "max-w-(--home-wrap)" : "max-w-(--docs-wrap)",
        )}
        style={{ minHeight: "var(--docs-top)" }}
      >
        {/* MENÜ DÜĞMESİ SOLDA, LOGONUN ÖNÜNDE. Telefonda gezinme aracı ilk
            ulaşılan şey olmalı; sağ üst köşe başparmağın en uzak noktası. */}
        {onMenu ? (
          <button
            type="button"
            onClick={onMenu}
            aria-label={dict.nav.menuAc}
            className="tamga-icon-btn shrink-0 ray:hidden"
          >
            <Icon icon={Menu} size="sm" />
          </button>
        ) : null}

        <Link href={`/${lang}`} className="flex-none no-underline">
          <LogoMark />
        </Link>

        {/* SÜRÜM ETİKETİ MONO VE KUTULU: bir sürüm numarası okunan bir sözcük
            değil, karşılaştırılan bir sayı. Sayı `counts.json`dan geliyor. */}
        <span className="docs-surum hidden dil:inline-flex">v{sayilar.surum}</span>

        {bolumler ? <nav className="hidden bolum:flex items-center gap-1">{bolumler}</nav> : null}

        <span className="flex-1" />

        {duzen === "dokuman" ? <DocsSearch lang={lang} dict={dict} /> : null}
        <LocaleSwitcher lang={lang} dict={dict} />
        {/* İKİ HÜCRE: açık ve koyu. Kitin `ThemeToggle`u bir de "sistem"
            tutuyor ve ölçüsü panel kontrolü (40px); şeridin ölçüsü 36. Glifler
            tek başına anlam taşımıyor, `sr-only` etiket ekran okuyucuya adı
            veriyor. */}
        <div className="docs-seg" role="radiogroup" aria-label={dict.chrome.language}>
          {(
            [
              ["light", Sun, dict.chrome.themeState.light],
              ["dark", Moon, dict.chrome.themeState.dark],
            ] as const
          ).map(([deger, glif, ad]) => (
            <button
              key={deger}
              type="button"
              role="radio"
              aria-checked={tema === deger}
              data-glif
              className="docs-seg-btn"
              onClick={() => setTema(deger)}
              title={ad}
            >
              <Icon icon={glif} size="sm" weight={deger === "light" ? "fill" : "regular"} />
              <span className="sr-only">{ad}</span>
            </button>
          ))}
        </div>
        <a
          href="https://github.com/mantiksal/tamga"
          className="docs-ikon-btn no-underline"
          title="GitHub"
          aria-label="GitHub"
        >
          <Icon icon={GithubLogo} size="sm" />
        </a>
        {cta ? <span className="hidden flex-none sm:inline-flex">{cta}</span> : null}
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
    <div className="flex flex-col gap-(--docs-grup-gap)">
      {/* ANA SAYFA, menünün ilk satırı ve grupsuz.

          Logo zaten oraya gidiyor, ama bir logo bir MARKA işaretidir, gezinme
          öğesi değil; ve menüde karşılığı olmayan bir sayfa, menüye bakan biri
          için var olmayan bir sayfadır. */}
      <div className="flex flex-col gap-0.5">
        <NavLink lang={lang} slug="" pathname={pathname} onGit={onGit}>
          {dict.nav.home}
        </NavLink>
      </div>

      {/* GRUPLAR: gerekçe content/nav.ts'te. Kısaca: sayfa sayısı 96'ya çıktı
          ve 78'i bileşen; Kurulum, Token'lar ve Bloklar o listenin içinde
          kayboluyordu. Gruplama bileşenleri BÖLMÜYOR, tek bir satıra katlıyor. */}
      {navGruplari(lang).map((g) => (
        <div key={g.key} className="flex flex-col gap-0.5">
          {g.katlanir ? (
            /* AÇIK GELİYOR, VE KATLANIR OLMASI BUNU DEĞİŞTİRMİYOR. Bir doküman
               menüsünün ilk işi neyin VAR olduğunu söylemek; katlama, yer açmak
               isteyen okuyucu için duruyor, karşılama hâli olarak değil. */
            <details open className="docs-nav-grup">
              <summary className="docs-nav-baslik">
                <span className="flex-1">{g.baslik[lang]}</span>
                <span className="font-mono tabular-nums">{g.sayfalar.length}</span>
              </summary>
              <div className="mt-1 flex flex-col gap-0.5">
                {g.sayfalar.map((page) => (
                  <NavLink
                    key={page.slug}
                    lang={lang}
                    slug={page.slug}
                    pathname={pathname}
                    onGit={onGit}
                    tur="bilesen"
                  >
                    {page.title[lang]}
                  </NavLink>
                ))}
              </div>
            </details>
          ) : (
            <>
              <p className="docs-nav-baslik pb-1.5">{g.baslik[lang]}</p>
              {g.sayfalar.map((page) => (
                <NavLink key={page.slug} lang={lang} slug={page.slug} pathname={pathname} onGit={onGit}>
                  {page.title[lang]}
                </NavLink>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Rotadan sayfanın iç slug'u.
 *
 * Adres çevriliyor (`/tr/docs/ikonlar` · `/en/docs/icons`), o yüzden segment
 * doğrudan slug değil: `icSlug` onu iç ada çeviriyor. Doküman dışındaki bir
 * yolda `undefined` dönüyor ve iki bileşen de hiç çizilmiyor.
 */
function slugOf(lang: Locale, pathname: string): string | undefined {
  const p = pathname.split("/");
  if (p[2] !== "docs" || !p[3]) return undefined;
  return icSlug(lang, p[3]) ?? p[3];
}

/** `Doküman › Grup › Sayfa`. Grup adı nav.ts'ten; elle yazılmıyor. */
function Breadcrumb({ lang, pathname, dict }: { lang: Locale; pathname: string; dict: Dictionary }) {
  const slug = slugOf(lang, pathname);
  const sayfa = slug ? findPage(slug) : undefined;
  if (!sayfa || !slug) return null;
  const grup = grupAdi(lang, slug);
  return (
    <nav className="docs-crumb mb-5" aria-label={dict.nav.crumbRoot}>
      <Link href={`/${lang}`}>{dict.nav.crumbRoot}</Link>
      {grup ? (
        <>
          <Icon icon={CaretRight} size="xs" weight="bold" />
          <span>{grup}</span>
        </>
      ) : null}
      <Icon icon={CaretRight} size="xs" weight="bold" />
      <strong>{sayfa.title[lang]}</strong>
    </nav>
  );
}

/** Okuma sırası nav.ts'ten; iki kart da onun komşularından. */
function PrevNext({ lang, pathname, dict }: { lang: Locale; pathname: string; dict: Dictionary }) {
  const slug = slugOf(lang, pathname);
  if (!slug) return null;
  const { onceki, sonraki } = komsular(lang, slug);
  if (!onceki && !sonraki) return null;
  return (
    <nav className="docs-pn">
      {onceki ? (
        <Link href={yol(lang, onceki.sayfa.slug)} className="docs-pn-card" data-yon="onceki">
          <span className="docs-pn-yon">
            <Icon icon={ArrowLeft} size="xs" weight="bold" />
            {dict.nav.prev}
          </span>
          <strong>{onceki.sayfa.title[lang]}</strong>
        </Link>
      ) : (
        <span />
      )}
      {sonraki ? (
        <Link href={yol(lang, sonraki.sayfa.slug)} className="docs-pn-card" data-yon="sonraki">
          <span className="docs-pn-yon">
            {dict.nav.next}
            <Icon icon={ArrowRight} size="xs" weight="bold" />
          </span>
          <strong>{sonraki.sayfa.title[lang]}</strong>
          <span className="docs-crumb">{sonraki.sayfa.blurb[lang]}</span>
        </Link>
      ) : null}
    </nav>
  );
}

/**
 * Doküman düzeni — üç sütun, ve ikisi ölçüye göre kayboluyor.
 *
 * Tanıtım sayfası bunu KULLANMIYOR: bir landing'in rayı olmaz, ve 96 satırlık
 * bir menü "bu nedir" diye gelen birine hiçbir şey anlatmaz. İkisi ayrı
 * `layout.tsx` altında yaşıyor.
 */
export function DocsShell({ children, lang, dict }: { children: ReactNode; lang: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  /* MENÜ DAR EKRANDA BİR ÇEKMECE. Ray gizliydi ve yerine hiçbir şey
     konmamıştı: 96 sayfalık bir doküman sitesi telefonda GEZİLEMİYORDU. */
  const [menuAcik, setMenuAcik] = useState(false);

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-band)" }}>
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
        {/* MARKA ÇEKMECENİN TEPESİNDE, şeritte değil: çekmece açıkken şerit
            görünmüyor, ve ana sayfaya giden yol menünün içinde kalıyor. */}
        <Link href={`/${lang}`} onClick={() => setMenuAcik(false)} className="mb-6 inline-flex no-underline">
          <LogoMark />
        </Link>
        <MenuGovdesi lang={lang} dict={dict} pathname={pathname} onGit={() => setMenuAcik(false)} />
      </Sheet>

      <div className="mx-auto flex max-w-(--docs-wrap) items-start">
        {/* ① Ray — kilitli menü, content/nav.ts'ten map'leniyor. Kendi içinde
            kayıyor: sayfa kayarken menünün de kayması, uzun bir listede
            okuyucunun yerini kaybettiriyor. */}
        <nav
          className="sticky hidden shrink-0 overflow-y-auto border-r border-[var(--color-edge)] px-4 pt-6 pb-10 ray:block"
          style={{
            width: "var(--docs-rail)",
            top: "var(--docs-top)",
            height: "calc(100dvh - var(--docs-top))",
          }}
          aria-label={dict.nav.docs}
        >
          <MenuGovdesi lang={lang} dict={dict} pathname={pathname} />
        </nav>

        {/* ② İçerik. Kırıntı yolu ve önceki/sonraki BURADA, sayfalarda değil:
            ikisi de rotadan türüyor, yani 96 sayfaya elle yazıldığında 96 kez
            unutulabilecek şeyler. Sayfa yalnız kendi gövdesini yazıyor. */}
        <main className="min-w-0 flex-1 px-5 pt-11 pb-24 sm:px-(--docs-govde-pad)">
          <article className="mx-auto flex flex-col" style={{ maxWidth: "var(--docs-measure)" }}>
            <Breadcrumb lang={lang} pathname={pathname} dict={dict} />
            {children}
            <PrevNext lang={lang} pathname={pathname} dict={dict} />
          </article>
        </main>

        {/* ③ İçindekiler — geniş ekranda, sayfanın kendi başlıklarından.
            Sütunun kendisi Toc içinde: başlık yoksa sütun da yok. */}
        <Toc key={pathname} label={dict.nav.toc} ornek={dict.nav.example} />
      </div>
    </div>
  );
}
