import { ComboboxDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("combobox")!.title[lang] };
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
        <Xref to="select">Select</Xref> sabit ve kısa bir küme içindir: durum, öncelik, tema. Beş
        yüz ürünün olduğu bir listede kaydırarak seçim yapılmaz; kullanıcı{" "}
        <strong>arar</strong>.
      </>
    ),
    search: (
      <>
        <code>onSearch</code> verilirse süzme yapılmaz, gelen liste olduğu gibi gösterilir: beş
        yüz kayıt istemcide süzülür, elli bin kayıt sunucuda, ve bu kararı ürün verir.
      </>
    ),
    rules: "Kurallar",
    focus: (
      <>
        <strong>Odak girdide kalır.</strong> Ok tuşları seçimi{" "}
        <code>aria-activedescendant</code> ile taşır; odağı listeye taşımak yazmayı imkânsız
        kılardı. Bir combobox&apos;ı yanlış yapmak kolaydır ve yanlışlığını yalnız ekran okuyucu
        kullanan biri fark eder.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Kısa ve sabit bir küme için <Xref to="select">Select</Xref>; etiket için{" "}
        <Xref to="field">Field</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        <Xref to="select">Select</Xref> is for a fixed, short set: status, priority, theme. Nobody
        picks from a list of five hundred products by scrolling; they{" "}
        <strong>search</strong>.
      </>
    ),
    search: (
      <>
        If <code>onSearch</code> is given, no filtering happens and the incoming list is shown as
        it is: five hundred rows filter on the client, fifty thousand on the server, and the
        product makes that call.
      </>
    ),
    rules: "Rules",
    focus: (
      <>
        <strong>Focus stays in the input.</strong> The arrow keys move the selection with{" "}
        <code>aria-activedescendant</code>; moving focus into the list would make typing
        impossible. A combobox is easy to get wrong, and only someone using a screen reader ever
        notices.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For a short, fixed set, <Xref to="select">Select</Xref>; for a label,{" "}
        <Xref to="field">Field</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("combobox")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<Combobox
  value={v}
  onChange={setV}
  placeholder="…"
  labels={{ empty: "…", clear: "…", open: "…" }}
  options={[{ value: "p1", label: "Blue Train · LP", hint: "SKU-4471" }, …]}
/>`}>
        <ComboboxDemo lang={lang} />
      </Demo>
      <P>{t.search}</P>

      <H2>{t.rules}</H2>
      <Note>{t.focus}</Note>

      <H2>Props</H2>
      <Props of="Combobox" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
