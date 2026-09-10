import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";
import { TreeSelectDemo } from "@/components/interactive";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("tree-select")!.title[lang] };
}

const T = {
  tr: {
    lead: (
      <>
        Seçenekler düz bir liste değil bir <strong>ağaç</strong>, ve seçim birden çok olabiliyor.
        Düz bir çoklu seçim bunu veremez: &ldquo;Ayakkabı &rsaquo; Erkek &rsaquo; Koşu&rdquo; ile
        &ldquo;Giyim &rsaquo; Erkek &rsaquo; Koşu&rdquo; aynı adı taşır ve ancak yolu görününce
        ayırt edilir.
      </>
    ),
    cascadeH: "Aşağı yayılır, yukarı yayılmaz",
    cascadeP: (
      <>
        Bir dalı işaretlemek altındakileri de işaretler; bir çocuğu işaretlemek üstünü işaretlemez.
        Üç durumlu (yarı işaretli) bir ağaç &ldquo;üst kategori de seçildi mi&rdquo; sorusunu
        belirsiz bırakır: üç çocuktan üçünü seçmek üst kategoriyi de seçmiş saymak olur ve bu çoğu
        zaman istenmez. Seçim ne ise odur.
      </>
    ),
    rules: "Kurallar",
    search: (
      <>
        Arama <strong>yaprakları</strong> süzer ama <strong>atalarını da gösterir</strong>: yolu
        görünmeyen bir eşleşme hangi ağaçtan geldiğini söylemez. Ataları eşleşmese bile durur ve
        seçilebilir kalır; süzme bir görünürlük işidir, bir kilit değil.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Düz bir listeden çoklu seçim için <Xref to="multi-select">Multi select</Xref>, tek seçim
        için <Xref to="combobox">Combobox</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        The options are a <strong>tree</strong>, not a flat list, and more than one can be picked. A
        flat multi select cannot express this: &ldquo;Shoes &rsaquo; Men &rsaquo; Running&rdquo; and
        &ldquo;Clothing &rsaquo; Men &rsaquo; Running&rdquo; carry the same name and only the path
        tells them apart.
      </>
    ),
    cascadeH: "It cascades down, never up",
    cascadeP: (
      <>
        Checking a branch checks everything under it; checking a child does not check its parent. A
        three-state (indeterminate) tree leaves &ldquo;was the parent selected too?&rdquo; open to
        interpretation: picking all three children would count as picking the parent, which is
        usually not what anyone meant. The selection is what it says it is.
      </>
    ),
    rules: "Rules",
    search: (
      <>
        Search filters the <strong>leaves</strong> but <strong>keeps their ancestors</strong>: a
        match without its path does not say which tree it came from. Ancestors stay even when they
        do not match, and stay selectable; filtering is about visibility, not about locking.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For many out of a flat list use <Xref to="multi-select">Multi select</Xref>, for one{" "}
        <Xref to="combobox">Combobox</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("tree-select")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} align="start" code={`<TreeSelect nodes={nodes} value={value} onChange={setValue} labels={labels} />`}>
        <TreeSelectDemo lang={lang} />
      </Demo>
      <P>{t.lead}</P>

      <H2>{t.cascadeH}</H2>
      <P>{t.cascadeP}</P>

      <H2>{t.rules}</H2>
      <Note>{t.search}</Note>

      <H2>Props</H2>
      <Props of="TreeSelect" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
