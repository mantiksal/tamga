import { Link } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("link")!.title[lang] };
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
      <Demo labels={dict.demo} code={`<Link href="/docs">${t.docs}</Link>
<Link href="https://example.com" external>${t.ext}</Link>`}>
        <Link href="#">{t.docs}</Link>
        <Link href="https://example.com" external>
          {t.ext}
        </Link>
      </Demo>

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
