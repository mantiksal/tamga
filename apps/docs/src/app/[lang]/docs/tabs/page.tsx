import { TabsDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("tabs")!.title[lang] };
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
    underline: (
      <>
        Alt çizgi, kutu değil. Bir sekmeyi kutuya almak onu altındaki panelden koparır. Alttaki
        kural çizgisi <strong>bileşenin içinde</strong>: çağıranın hatırlaması gereken bir layout
        kuralı olarak bırakılırsa, unutulduğu her yerde sekmeler boşlukta durur.
      </>
    ),
    rules: "Kurallar",
    panel: (
      <>
        <strong>Altında bir panel yoksa Tabs değildir.</strong> Aynı içeriğin görünümünü ya da
        süzgecini değiştiriyorsan aradığın şey <Xref to="segmented">Segmented</Xref>.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Görünüm değiştiren akran seçimi <Xref to="segmented">Segmented</Xref>; sayfalar arası
        gezinme için sekme değil, gezinme kullanılır (<Xref to="breadcrumb">Breadcrumb</Xref>).
      </>
    ),
  },
  en: {
    underline: (
      <>
        An underline, not a box. Putting a tab in a box cuts it off from the panel beneath it.
        The rule line at the bottom lives <strong>inside the component</strong>: left as a layout
        rule the caller has to remember, the tabs float in space everywhere it is forgotten.
      </>
    ),
    rules: "Rules",
    panel: (
      <>
        <strong>With no panel underneath, it is not Tabs.</strong> If you are switching the view
        or the filter of the same content, what you want is{" "}
        <Xref to="segmented">Segmented</Xref>.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For a peer choice that changes the view, <Xref to="segmented">Segmented</Xref>; moving
        between pages is navigation, not tabs (<Xref to="breadcrumb">Breadcrumb</Xref>).
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("tabs")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} align="start" code={`<Tabs
  label="…"
  value={t}
  onChange={setT}
  items={[{ value: "general", label: "…" }, { value: "stock", label: "…" }]}
/>`}>
        <TabsDemo lang={lang} />
      </Demo>
      <P>{t.underline}</P>

      <H2>{t.rules}</H2>
      <Note>{t.panel}</Note>

      <H2>Props</H2>
      <Props of="Tabs" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
