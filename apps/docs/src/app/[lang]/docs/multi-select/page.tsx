import { MultiSelectDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("multi-select")!.title[lang] };
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
        <Xref to="combobox">Combobox</Xref> tek seçim yapar; bu birden çok. Ayrı bileşen olmasının
        sebebi görünüm değil <strong>davranış</strong>: tek seçimde liste seçince kapanır, çoklu
        seçimde <strong>kapanmaz</strong>: üç şey seçecek biri listeyi üç kez açmak zorunda
        kalmamalı.
      </>
    ),
    chips: (
      <>
        Seçilenler girdinin <strong>içinde</strong> çip olarak duruyor, altında ayrı bir listede
        değil: seçim ile seçilenler arasındaki mesafe arttıkça, kullanıcı neyi seçtiğini görmek
        için gözünü iki yere birden koymak zorunda kalır.
      </>
    ),
    blur: (
      <>
        Liste, odak kutunun <strong>dışına çıkınca</strong> kapanıyor, dışarı tıklamayı
        dinleyerek değil. Tıklama dinleyicisi klavyeyle çıkanı görmez ve liste açık kalır.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Tek seçim için <Xref to="combobox">Combobox</Xref>; serbest metin için{" "}
        <Xref to="tags-input">Tags input</Xref>; kısa ve sabit bir küme için{" "}
        <Xref to="select">Select</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        <Xref to="combobox">Combobox</Xref> picks one; this picks several. It is a separate
        component not for its looks but for its <strong>behaviour</strong>: in single selection
        the list closes on pick, in multiple selection it <strong>does not</strong>: someone
        picking three things should not have to open the list three times.
      </>
    ),
    chips: (
      <>
        The chosen ones sit as chips <strong>inside</strong> the input, not in a separate list
        below it: the further apart the picking and the picked are, the more the user has to look
        in two places at once to see what they chose.
      </>
    ),
    blur: (
      <>
        The list closes when focus leaves the box, <strong>not</strong> by listening for an
        outside click. A click listener never sees someone leaving by keyboard, and the list stays
        open.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        For a single pick, <Xref to="combobox">Combobox</Xref>; for free text,{" "}
        <Xref to="tags-input">Tags input</Xref>; for a short, fixed set,{" "}
        <Xref to="select">Select</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("multi-select")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<MultiSelect
  options={regions}
  value={v}
  onChange={setV}
  placeholder="…"
  labels={{ empty: "…", remove: (l) => \`\${l} kaldır\`, open: "…" }}
/>`}>
        <MultiSelectDemo lang={lang} />
      </Demo>
      <P>{t.chips}</P>

      <H2>{t.rules}</H2>
      <Note>{t.blur}</Note>

      <H2>Props</H2>
      <Props of="MultiSelect" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
