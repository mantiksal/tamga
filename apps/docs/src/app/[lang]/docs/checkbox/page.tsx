import { Checkbox } from "tamga-ui";
import { CheckboxDemo } from "@/components/interactive";
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
  return sayfaMeta("checkbox", lang);
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
    notH: "Açıklama ve hata",
    notP: (
      <>
        <code>description</code> kutu ile etiketin altındaki sessiz satır, <code>error</code>{" "}
        kritik renkte ve uyarı glifli hata satırı; <Xref to="field">Field</Xref>&apos;ın satırıyla
        aynı çizim. Metin etiketle hizalı (kutu + aralık kadar girintili); kutu{" "}
        <code>aria-describedby</code> ile satıra bağlanır ve hata varken <code>aria-invalid</code>{" "}
        taşır. <code>errorPrefix</code> yalnız ekran okuyucunun duyduğu önek. Checkbox Field&apos;ın
        içine giremiyordu; bir sözleşme onayı hatasını ürünler elle çiziyordu.
      </>
    ),
    sozlesme: "Sözleşmeyi okudum",
    sozlesmeAlt: "Satış koşulları ve iade politikası.",
    sozlesmeHata: "Devam etmek için onayla.",
    hataOnek: "Hata:",
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
    notH: "Description and error",
    notP: (
      <>
        <code>description</code> is the quiet line under the box and its label, <code>error</code>{" "}
        the critical-coloured line with a warning glyph; the same drawing as{" "}
        <Xref to="field">Field</Xref>&apos;s line. The text lines up with the label (indented by the
        box plus the gap); the box is wired to the line with <code>aria-describedby</code> and
        carries <code>aria-invalid</code> while there is an error. <code>errorPrefix</code> is a
        prefix only screen readers hear. Checkbox could not sit inside Field; products drew a
        terms-consent error by hand.
      </>
    ),
    sozlesme: "I have read the terms",
    sozlesmeAlt: "Sales conditions and the return policy.",
    sozlesmeHata: "Tick this to continue.",
    hataOnek: "Error:",
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
<Checkbox label="…" checked={false} disabled />
<Checkbox compact label="…" checked={c} onChange={setC} />`}>
        <CheckboxDemo lang={lang} />
      </Demo>

      <H2>{t.notH}</H2>
      <P>{t.notP}</P>
      <Demo labels={dict.demo} align="start" code={`<Checkbox label="${t.sozlesme}" description="${t.sozlesmeAlt}" checked={a} onChange={setA} />
<Checkbox label="${t.sozlesme}" error="${t.sozlesmeHata}" errorPrefix="${t.hataOnek}" checked={false} onChange={setB} />`}>
        <div className="flex flex-col gap-5" data-not-ornek>
          <Checkbox label={t.sozlesme} description={t.sozlesmeAlt} checked />
          <Checkbox label={t.sozlesme} error={t.sozlesmeHata} errorPrefix={t.hataOnek} checked={false} />
        </div>
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
