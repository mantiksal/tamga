import { Sparkline } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("sparkline")!.title[lang] };
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
        Satır içi, eksensiz. Bir tablo hücresine sığar ve tek soruya cevap verir:{" "}
        <em>yön ne?</em> Eksen, ızgara ve etiket yok; onlar gerçek bir grafiğin işi. Bir
        sparkline okunmaz, göz ucuyla görülür.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Zaman içinde DURUM gösteriyorsan, değer değil, aradığın şey{" "}
        <Xref to="timeline-strip">Timeline strip</Xref>. Tek bir okuma için{" "}
        <Xref to="score-ring">Score ring</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        Inline, no axes. It fits in a table cell and answers one question: <em>which way?</em> No
        axis, no grid, no labels; those are a real chart&apos;s job. A sparkline is not read; it
        is caught out of the corner of the eye.
      </>
    ),
    related: "Related",
    rel: (
      <>
        If you are showing STATE over time rather than a value, what you want is{" "}
        <Xref to="timeline-strip">Timeline strip</Xref>. For a single reading,{" "}
        <Xref to="score-ring">Score ring</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("sparkline")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} code={`<Sparkline values={series} tone="positive" />`}>
        <span className="w-40">
          <Sparkline values={[42, 38, 45, 51, 47, 60, 58, 66, 61, 72, 68, 80]} tone="positive" />
        </span>
        <span className="w-40">
          <Sparkline values={[80, 68, 72, 61, 66, 58, 60, 47, 51, 45, 38, 42]} tone="danger" />
        </span>
        <span className="w-40">
          <Sparkline values={[42, 38, 45, 51, 47, 60, 58, 66, 61, 72, 68, 80]} tone="neutral" />
        </span>
      </Demo>

      <H2>Props</H2>
      <Props of="Sparkline" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
