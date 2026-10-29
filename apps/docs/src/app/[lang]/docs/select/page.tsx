import { Field, Select } from "tamga-ui";
import { SelectDemo } from "@/components/interactive";
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
  return sayfaMeta("select", lang);
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
    hataH: "Field içinde hata",
    hataP: (
      <>
        <Xref to="field">Field</Xref> hata satırını çocuğuna <code>aria-describedby</code> ve{" "}
        <code>aria-invalid</code> ile bağlıyor; Select ikisini de tetik düğmesine geçirir, kenar
        hatalı girdiyle aynı kritik rengi giyer. Eskiden ikisi yutuluyordu ve hata metni seçiciye
        hiç bağlanmıyordu.
      </>
    ),
    kargo: "Kargo",
    kargoHata: "Bir kargo seç.",
    kargoSec: "Kargo seç",
    aciklama: (
      <>
        <code>hint</code> etiketin yanındaki sessiz bir değer: &quot;2-3 gün&quot;, &quot;₺49&quot;.
        Seçeneğin ne yaptığını bir cümleyle söylemek gerekiyorsa <code>description</code> verin:
        etiketin altına, ikinci satıra iner. Cümle yana sığmıyordu, kesiliyordu; örnekteki
        ikinci kutu öyle.
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
    hataH: "An error inside Field",
    hataP: (
      <>
        <Xref to="field">Field</Xref> wires its error line to the child with{" "}
        <code>aria-describedby</code> and <code>aria-invalid</code>; Select passes both to the
        trigger button and its edge wears the same critical colour as a failing input. Both used to
        be swallowed, so the error text never reached the select.
      </>
    ),
    kargo: "Carrier",
    kargoHata: "Pick a carrier.",
    kargoSec: "Pick a carrier",
    aciklama: (
      <>
        <code>hint</code> is a quiet value beside the label: &quot;2-3 days&quot;, &quot;$9&quot;.
        When an option needs a sentence to say what it does, pass <code>description</code>: it
        goes under the label, on a second line. The sentence did not fit beside it and was cut;
        the second box in the example is like that.
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

      <H2>{t.hataH}</H2>
      <P>{t.hataP}</P>
      <Demo labels={dict.demo} align="start" code={`<Field label="${t.kargo}" htmlFor="kargo">
  <Select options={[…]} placeholder="${t.kargoSec}" className="w-full" />
</Field>
<Field label="${t.kargo}" error="${t.kargoHata}" htmlFor="kargo2">
  <Select options={[…]} placeholder="${t.kargoSec}" className="w-full" />
</Field>`}>
        <div className="grid w-full gap-7 sm:grid-cols-2" data-not-ornek>
          <Field label={t.kargo} htmlFor="kargo">
            <Select options={["Atlas", "Aras", "MNG"]} placeholder={t.kargoSec} className="w-full" />
          </Field>
          <Field label={t.kargo} error={t.kargoHata} htmlFor="kargo2">
            <Select options={["Atlas", "Aras", "MNG"]} placeholder={t.kargoSec} className="w-full" />
          </Field>
        </div>
      </Demo>

      <P>{t.aciklama}</P>

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
