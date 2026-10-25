import { SelectPanelDemo } from "@/components/interactive";
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
  return sayfaMeta("select-panel", lang);
}

const T = {
  tr: {
    lead: (
      <>
        Tetik <strong>sıradan bir düğme</strong>: seçili değeri ya da yer tutucuyu gösterir, yanında
        bir ok. Panelde başlık, isteğe bağlı arama, seçenekler; seçili olanın yanında onay. GitHub
        Primer&apos;ın SelectPanel&apos;i gibi. <Xref to="combobox">Combobox</Xref>&apos;un tetiği bir
        metin kutusu ve insan oraya yazı yazacağını sanıyor; bir seçim yapıldığı anlaşılmıyor.
      </>
    ),
    rules: "Kurallar",
    tumu: (
      <>
        <code>allLabel</code> verilirse ilk seçenek &quot;Tümü&quot; olur: değer boşken onay onun
        yanında durur, seçilince değer boşalır, arama yapılırken de listenin başında kalır. Geri
        dönüş yolu gidiş yoluyla aynı yerde; tek seçimli bir filtrede GOV.UK&apos;nin &quot;Any&quot;
        önerisi de bu.
      </>
    ),
    klavye: (
      <>
        Oklar seçenekler arasında gezer, Enter seçer, Esc kapatır ve odak tetiğe döner. Aramada
        aşağı ok listeye iner. Dışarı tıklama kapatır.
      </>
    ),
    coklu: (
      <>
        <code>multiple</code> ile değer bir dizi: tetik &quot;Atlas Lojistik +2&quot; gibi özet gösterir,
        panel seçimde açık kalır, altında <code>labels.clear</code> &quot;Temizle&quot;. Tetiğin görünümü{" "}
        <code>variant</code> (<code>secondary</code>, <code>soft</code>, <code>ghost</code>) ve boyu{" "}
        <code>size</code> (<code>base</code>, <code>sm</code>) <Xref to="button">Button</Xref>&apos;dan;
        <code>prefix</code> değerin önüne &quot;Durum:&quot; koyar, <code>caret</code> oku kapatır ·
        filtre çipi ikisini birden kullanıyor.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Kısa, sabit küme için <Xref to="select">Select</Xref>; yazarak süzülen uzun liste için{" "}
        <Xref to="combobox">Combobox</Xref>; filtre çubuğundaki çipler için{" "}
        <Xref to="blocks">FilterBar</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        The trigger is <strong>an ordinary button</strong>: it shows the chosen value or the
        placeholder, with a caret. The panel has a title, an optional search box and the options,
        a check beside the chosen one. Like GitHub Primer&apos;s SelectPanel.{" "}
        <Xref to="combobox">Combobox</Xref>&apos;s trigger is a text box, and people expect to type
        into it; that a choice was made does not show.
      </>
    ),
    rules: "Rules",
    tumu: (
      <>
        Given <code>allLabel</code>, the first option is &quot;All&quot;: with an empty value the check
        sits beside it, choosing it empties the value, and it stays at the top while searching.
        The way back sits where the way in was; GOV.UK&apos;s &quot;Any&quot; for a single-choice
        filter is the same idea.
      </>
    ),
    klavye: (
      <>
        The arrows move between options, Enter chooses, Esc closes and focus returns to the
        trigger. In the search box the down arrow enters the list. Clicking outside closes.
      </>
    ),
    coklu: (
      <>
        With <code>multiple</code> the value is an array: the trigger shows a summary like
        &quot;Atlas Lojistik +2&quot;, the panel stays open on a pick, and <code>labels.clear</code>{" "}
        &quot;Clear&quot; sits under the list. The trigger&apos;s look is <code>variant</code>{" "}
        (<code>secondary</code>, <code>soft</code>, <code>ghost</code>) and its size{" "}
        <code>size</code> (<code>base</code>, <code>sm</code>), from <Xref to="button">Button</Xref>;{" "}
        <code>prefix</code> puts &quot;Status:&quot; before the value and <code>caret</code> drops the
        arrow · the filter chip uses both.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For a short, fixed set <Xref to="select">Select</Xref>; for a long list filtered by typing{" "}
        <Xref to="combobox">Combobox</Xref>; for the chips of a filter bar{" "}
        <Xref to="blocks">FilterBar</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("select-panel")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<SelectPanel
  options={[{ value: "aras", label: "Aras Kargo", hint: "1-2 ${lang === "tr" ? "gün" : "days"}" }, …]}
  value={value}
  onChange={setValue}
  allLabel="…"
  searchable
  title="…"
  placeholder="…"
  aria-label="…"
  labels={{ noMatch: "…", search: "…" }}
/>
<SelectPanel multiple value={values} onChange={setValues} labels={{ noMatch: "…", clear: "…" }} … />`}>
        <SelectPanelDemo lang={lang} />
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.tumu}</Note>
      <Note>{t.klavye}</Note>
      <P>{t.coklu}</P>

      <H2>Props</H2>
      <Props of="SelectPanel" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
