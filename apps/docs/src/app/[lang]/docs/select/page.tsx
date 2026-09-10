import { SelectDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("select")!.title[lang] };
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
        Native <code>&lt;select&gt;</code> değil: kitin overlay düzlemini ve klavye davranışını
        kullanır, böylece açık menü sayfanın geri kalanıyla aynı dili konuşur.
      </>
    ),
    rules: "Kurallar",
    ph: (
      <>
        <code>placeholder</code> <strong>zorunlu</strong>: kit çeviri yapmaz, hazır metni çağıran
        geçer. Etiket için <Xref to="field">Field</Xref> ile sarmala.
      </>
    ),
    scope: (
      <>
        Sabit ve <strong>kısa</strong> bir küme içindir: durum, öncelik, tema. Beş yüz kayıtlık bir
        listede kaydırarak seçim yapılmaz.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Uzun listede arayarak seçim için <Xref to="combobox">Combobox</Xref>; iki-üç akran arasında{" "}
        <Xref to="segmented">Segmented</Xref>; çoklu seçim için{" "}
        <Xref to="checkbox">Checkbox</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        Not a native <code>&lt;select&gt;</code>: it uses the kit&apos;s overlay plane and keyboard
        behaviour, so an open menu speaks the same language as the rest of the page.
      </>
    ),
    rules: "Rules",
    ph: (
      <>
        <code>placeholder</code> is <strong>required</strong>: the kit does not translate; the
        caller passes text that is already written. For a label, wrap it in{" "}
        <Xref to="field">Field</Xref>.
      </>
    ),
    scope: (
      <>
        It is for a fixed and <strong>short</strong> set: status, priority, theme. Nobody picks from
        five hundred rows by scrolling.
      </>
    ),
    related: "Related",
    rel: (
      <>
        To search a long list, <Xref to="combobox">Combobox</Xref>; between two or three peers,{" "}
        <Xref to="segmented">Segmented</Xref>; for multiple choice,{" "}
        <Xref to="checkbox">Checkbox</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("select")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<Select
  options={["Taslak", "Yayında", "Arşiv"]}
  value={value}
  onChange={setValue}
  placeholder="Durum seç"
/>`}>
        <SelectDemo lang={lang} />
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.ph}</Note>
      <P>{t.scope}</P>

      <H2>Props</H2>
      <Props of="Select" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
