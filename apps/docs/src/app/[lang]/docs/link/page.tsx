import { Link, Icon } from "tamga-ui";
import { ArrowRight, ExternalLink } from "tamga-ui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { sayfaMeta } from "@/content/meta";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return sayfaMeta("link", lang);
}

/**
 * Sayfa metni, iki dilli.
 *
 * Neden burada ve sözlükte değil: bir doküman paragrafını JSON anahtarına
 * çevirmek onu okunamaz hâle getirir ve yapıyı metinden koparır. Sözlük ARAYÜZ
 * metinleri içindir ("Kopyala", "Önizleme"); sayfa içeriği sayfayla yaşar.
 *
 * İkisi aynı dosyada, çünkü asıl risk çeviri değil AYRIŞMA: Türkçesi
 * güncellenip İngilizcesi unutulursa iki farklı gerçek doğar. Yan yana
 * durduklarında bu unutuş görünür olur.
 *
 * ÖRNEKLERİN İÇİ DE ÇEVRİLİYOR — buton yazıları, yer tutucular, örnek veri.
 * Bir İngilizce sayfada "Kaydet" yazan bir buton, çevrilmemiş bir sayfadan
 * daha kötüdür: sayfa çevrilmiş görünür, ama ekrandaki şey değildir.
 */
const T = {
  tr: {
    docs: "Dokümana git",
    ext: "Dış bağlantı",
    lead: (
      <>
        Gezinen bağlantı. <code>.tamga-link</code> sınıfı kitte yıllarca vardı, bileşeni yoktu;
        ve bu kitin doküman sitesi kendi sarmalayıcısını yazmak zorunda kaldı.
      </>
    ),
    notButton: (
      <>
        <strong>Neden <code>Button variant=&quot;link&quot;</code> değil.</strong> O bir{" "}
        <code>&lt;button&gt;</code>; bir bağlantı gibi <em>görünür</em> ama gezinmez. Orta tuşla
        yeni sekmede açılamaz, sağ tıkla adresi kopyalanamaz, ve ekran okuyucuya
        &quot;düğme&quot; der. Görünüm aynı, sözleşme ters.
      </>
    ),
    ext2: (
      <>
        <code>external</code> verilince <code>rel=&quot;noopener noreferrer&quot;</code> geliyor.{" "}
        <code>noopener</code> olmadan açılan sayfa <code>window.opener</code> üzerinden seninkini
        yönlendirebilir, eski ve hâlâ geçerli bir açık.
      </>
    ),
    rel: (
      <>
        Kod çalıştıran ama gezinmeyen bir tıklama için{" "}
        <Xref to="button">Button</Xref> (<code>variant=&quot;link&quot;</code>).
      </>
    ),
    gap: (
      <>
        <strong>Bu bileşen yeni bir şey icat etmiyor.</strong> Sınıfı kitte zaten vardı; eksik
        olan, doğru işaretlemenin tek bir yerde durmasıydı. <code>.tamga-link</code> kitte yıllarca
        vardı ve işaretlemesini her çağıran kendi yazıyordu; bedeli görünmezdi ama gerçekti.
      </>
    ),
    hepsi: "Tüm siparişler",
    sessiz: "Sessiz bağlantı",
    vurgulu: "Vurgulu",
    cumleBas: "Kargo ayarlarını",
    cumleBag: "teslimat bölümünden",
    cumleSon: "değiştirebilirsin. Değişiklikler yeni siparişlerde geçerli olur.",
    bicimler: (
      <>
        Dört biçim: <code>inline</code> bir cümlenin içinde (altı çizili),{" "}
        <code>standalone</code> kendi satırında ve <strong>oku işaretçi altında bir adım ileri
        gidiyor</strong>, <code>quiet</code> bakılana kadar bekliyor (bir ayak satırında yirmi
        bağlantının yirmisi birden vurgu renginde olamaz), <code>marked</code> ise yıkama
        taşıyor · bir paragrafta bulunması gereken tek adres için.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
  },
  en: {
    docs: "Go to the docs",
    ext: "External link",
    lead: (
      <>
        A link that navigates. The <code>.tamga-link</code> class existed in the kit for years
        with no component, and this kit&apos;s own docs site had to write its own wrapper.
      </>
    ),
    notButton: (
      <>
        <strong>Why not <code>Button variant=&quot;link&quot;</code>.</strong> That is a{" "}
        <code>&lt;button&gt;</code>; it <em>looks</em> like a link but does not navigate. It
        cannot be middle-clicked into a new tab, its address cannot be copied, and it announces
        itself as &quot;button&quot;. Same appearance, opposite contract.
      </>
    ),
    ext2: (
      <>
        With <code>external</code> it gets <code>rel=&quot;noopener noreferrer&quot;</code>.
        Without <code>noopener</code> the opened page can redirect yours through{" "}
        <code>window.opener</code>, an old hole that is still open.
      </>
    ),
    rel: (
      <>
        For a click that runs code but does not navigate,{" "}
        <Xref to="button">Button</Xref> (<code>variant=&quot;link&quot;</code>).
      </>
    ),
    gap: (
      <>
        <strong>This component invents nothing.</strong> The class was already in the kit; what
        was missing was one place holding the correct markup. <code>.tamga-link</code> was in the kit for
        years and every caller wrote its markup by hand: the cost was invisible but real.
      </>
    ),
    hepsi: "All orders",
    sessiz: "Quiet link",
    vurgulu: "Marked",
    cumleBas: "You can change the shipping settings from the",
    cumleBag: "delivery section",
    cumleSon: ". Changes apply to new orders.",
    bicimler: (
      <>
        Four looks: <code>inline</code> inside a sentence (underlined),{" "}
        <code>standalone</code> on its own line with an arrow that{" "}
        <strong>steps forward under the pointer</strong>, <code>quiet</code> waiting until it is
        looked at (twenty links in a footer cannot all be in the accent), and <code>marked</code>{" "}
        carrying a wash · for the one address in a paragraph that has to be found.
      </>
    ),
    rules: "Rules",
    related: "Related",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("link")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" grid={false} code={`<Link href="/shipping">${t.docs}</Link>
<Link href="/orders" look="standalone">${t.hepsi} <Icon icon={ArrowRight} size="xs" weight="bold" /></Link>
<Link href="https://example.com" external>${t.ext}</Link>
<Link href="/help" look="quiet">${t.sessiz}</Link>
<Link href="/campaign" look="marked">${t.vurgulu}</Link>`}>
        <div className="flex w-full flex-col gap-4">
          {/* Cümlenin içinde: bağlantı metnin ritmini bozmuyor, altı çiziliyor. */}
          <p className="max-w-140 text-control leading-relaxed text-ink">
            {t.cumleBas} <Link href="#link">{t.cumleBag}</Link> {t.cumleSon}
          </p>
          <div className="flex flex-wrap items-center gap-7">
            <Link href="#link" look="standalone">
              {t.hepsi}
              <Icon icon={ArrowRight} size="xs" weight="bold" />
            </Link>
            <Link href="https://example.com" external>
              {t.ext}
              <Icon icon={ExternalLink} size="xs" weight="bold" className="ml-1.5 inline align-[-2px]" />
            </Link>
            <Link href="#link" look="quiet">
              {t.sessiz}
            </Link>
            <Link href="#link" look="marked">
              {t.vurgulu}
            </Link>
          </div>
        </div>
      </Demo>
      <P>{t.bicimler}</P>

      <H2>{t.rules}</H2>
      <Note>{t.notButton}</Note>
      <Note>{t.ext2}</Note>
      <Note>{t.gap}</Note>

      <H2>Props</H2>
      <Props of="Link" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
