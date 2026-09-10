import { CheckboxDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("checkbox")!.title[lang] };
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
    lead: (
      <>
        İşaretlendiğinde <strong>dolar</strong>. Yasa 2&apos;nin istisnası değil, teyidi: dolgu
        &quot;bu seçildi&quot; demiyor, &quot;bu değer açık&quot; diyor.
      </>
    ),
    rules: "Kurallar",
    role: (
      <>
        <strong>Kitte yıllarca yalnız bir CSS sınıfı olarak vardı</strong>
        (<code>.tamga-check</code>) ve işaretlemesini her çağıran kendi yazdı. Bedeli görünmezdi
        ama gerçekti: referans uygulaması <code>role</code> bile taşımıyordu; ekran okuyucuya düz
        bir buton olarak bildiriliyor, işaretli olup olmadığı hiç söylenmiyordu. Sınıf aynı;
        değişen tek şey artık tek bir doğru işaretlemenin var olması.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Üçüncü bir durum (kısmen seçili) bir tablonun baş satırında doğar;{" "}
        <Xref to="selection-bar">Selection bar</Xref> sayfasında. Tek bir değerin açık/kapalı
        hâli için <Xref to="switch">Switch</Xref>, birbirini dışlayan seçenekler için{" "}
        <Xref to="radio-group">Radio group</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        It <strong>fills</strong> when checked. Not an exception to Law 2 but a confirmation of it:
        the fill does not say &quot;this is selected&quot;, it says &quot;this value is on&quot;.
      </>
    ),
    rules: "Rules",
    role: (
      <>
        <strong>For years it existed in the kit only as a CSS class</strong>
        (<code>.tamga-check</code>) and every caller wrote its markup by hand. The cost was
        invisible but real: the reference implementation carried no <code>role</code> at all: a
        screen reader announced a plain button and never said whether it was checked. The class is
        unchanged; what is new is that one correct markup now exists.
      </>
    ),
    related: "Related",
    rel: (
      <>
        A third state (partly selected) is born in a table header row; see{" "}
        <Xref to="selection-bar">Selection bar</Xref>. For a single on/off value use{" "}
        <Xref to="switch">Switch</Xref>, and for mutually exclusive options{" "}
        <Xref to="radio-group">Radio group</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("checkbox")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<Checkbox label="…" checked={a} onChange={setA} />
<Checkbox label="…" checked={false} disabled />`}>
        <CheckboxDemo lang={lang} />
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.role}</Note>

      <H2>Props</H2>
      <Props of="Checkbox" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
