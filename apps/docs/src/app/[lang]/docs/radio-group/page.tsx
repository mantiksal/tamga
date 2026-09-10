import { RadioDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("radio-group")!.title[lang] };
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
    rules: "Kurallar",
    roles: (
      <>
        Grup <code>role=&quot;radiogroup&quot;</code>, satırlar <code>role=&quot;radio&quot;</code>.
        İkisi birden olmadan ekran okuyucu &quot;üç ayrı düğme&quot; duyurur, &quot;üç seçenekten
        biri&quot; değil.
      </>
    ),
    when: (
      <>
        Seçenekler uzunsa ya da üçten çoksa doğru olan bu. İki-üç kısa seçenek yatay sığıyorsa{" "}
        <Xref to="segmented">Segmented</Xref> daha az yer kaplar.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Çoklu seçim için <Xref to="checkbox">Checkbox</Xref>; uzun bir küme için{" "}
        <Xref to="select">Select</Xref> ya da <Xref to="combobox">Combobox</Xref>.
      </>
    ),
  },
  en: {
    rules: "Rules",
    roles: (
      <>
        The group is <code>role=&quot;radiogroup&quot;</code>, the rows are{" "}
        <code>role=&quot;radio&quot;</code>. Without both, a screen reader announces &quot;three
        separate buttons&quot; rather than &quot;one of three&quot;.
      </>
    ),
    when: (
      <>
        This is the right control when the options are long or there are more than three. If two
        or three short options fit side by side, <Xref to="segmented">Segmented</Xref> takes less
        room.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For multiple choice, <Xref to="checkbox">Checkbox</Xref>; for a long set,{" "}
        <Xref to="select">Select</Xref> or <Xref to="combobox">Combobox</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("radio-group")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} align="start" code={`<RadioGroup
  label="…"
  value={v}
  onChange={setV}
  options={[
    { value: "pending",   label: "…" },
    { value: "shipping",  label: "…" },
    { value: "delivered", label: "…" },
  ]}
/>`}>
        <RadioDemo lang={lang} />
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.roles}</Note>
      <P>{t.when}</P>

      <H2>Props</H2>
      <Props of="RadioGroup" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
