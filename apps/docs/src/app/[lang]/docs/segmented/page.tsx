import { SegmentedDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("segmented")!.title[lang] };
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
    seated: (
      <>
        <strong>Oturmuş</strong> fizik: seçili olan yükselmez, yerine oturur.
        &quot;Buradasın&quot; bir eylem değildir.
      </>
    ),
    rules: "Kurallar",
    notTabs: (
      <>
        <Xref to="tabs">Tabs</Xref> ile aynı şey değil.{" "}
        <strong>Tabs sayfanın İÇERİĞİNİ değiştirir</strong>; altında bir panel vardır. Segmented
        aynı içeriğin görünümünü ya da süzgecini değiştirir. Panel yoksa Tabs değildir.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Açık/kapalı durumu için <Xref to="switch">Switch</Xref>; seçenekler uzunsa ya da üçten
        çoksa <Xref to="radio-group">Radio group</Xref>.
      </>
    ),
  },
  en: {
    seated: (
      <>
        <strong>Seated</strong> physics: the selected option does not lift, it settles.
        &quot;You are here&quot; is not an action.
      </>
    ),
    rules: "Rules",
    notTabs: (
      <>
        Not the same thing as <Xref to="tabs">Tabs</Xref>.{" "}
        <strong>Tabs change the page&apos;s CONTENT</strong>; there is a panel underneath.
        Segmented changes the view or the filter of the same content. With no panel, it is not
        Tabs.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For an on/off state, <Xref to="switch">Switch</Xref>; when the options are long or there
        are more than three, <Xref to="radio-group">Radio group</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("segmented")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} code={`<Segmented
  label="…"
  value={v}
  onChange={setV}
  options={[{ value: "list", label: "…" }, { value: "board", label: "…" }]}
/>`}>
        <SegmentedDemo lang={lang} />
      </Demo>
      <P>{t.seated}</P>

      <H2>{t.rules}</H2>
      <Note>{t.notTabs}</Note>

      <H2>Props</H2>
      <Props of="Segmented" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
