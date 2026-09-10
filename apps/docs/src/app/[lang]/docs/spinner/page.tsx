import { Spinner } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("spinner")!.title[lang] };
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
    loading: "Yükleniyor",
    bars: (
      <>
        Dönen bir halka değil, <strong>yürüyen üç çubuk</strong>; bu kitte hiçbir şey dönmez.
      </>
    ),
    rules: "Kurallar",
    label: (
      <>
        <code>label</code> zorunlu: sesli okuyucuya &quot;bekleniyor&quot; diyen tek şey o. Dönen
        bir şeyin ekran okuyucuda karşılığı yoktur.
      </>
    ),
    related: "İlgili",
    three: (
      <>
        Üçü farklı soruya cevap veriyor: <Xref to="skeleton">Skeleton</Xref> &quot;ne
        geleceğini&quot;, <Xref to="spinner">Spinner</Xref> &quot;bir şeyin sürdüğünü&quot;,{" "}
        <Xref to="progress">Progress</Xref> &quot;ne kadar kaldığını&quot; söyler.
      </>
    ),
  },
  en: {
    loading: "Loading",
    bars: (
      <>
        Not a spinning ring but <strong>three walking bars</strong>; nothing in this kit spins.
      </>
    ),
    rules: "Rules",
    label: (
      <>
        <code>label</code> is required: it is the only thing that says &quot;waiting&quot; to a
        screen reader. A spinning shape has no equivalent in speech.
      </>
    ),
    related: "Related",
    three: (
      <>
        The three answer different questions: <Xref to="skeleton">Skeleton</Xref> says what is
        coming, <Xref to="spinner">Spinner</Xref> says something is taking time, and{" "}
        <Xref to="progress">Progress</Xref> says how much is left.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("spinner")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} code={`<Spinner label="${t.loading}" />
<Spinner size={24} label="${t.loading}" />`}>
        <Spinner label={t.loading} />
        <Spinner size={24} label={t.loading} />
        <Spinner size={32} label={t.loading} />
      </Demo>
      <P>{t.bars}</P>

      <H2>{t.rules}</H2>
      <Note>{t.label}</Note>

      <H2>Props</H2>
      <Props of="Spinner" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.three}</P>
    </>
  );
}
