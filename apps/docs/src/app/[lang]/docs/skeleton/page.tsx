import {
  Skeleton, SkeletonText, SkeletonRows, SkeletonKpi, SkeletonCard,
  SkeletonTable, SkeletonOptions, SkeletonPanel, SkeletonPageBand,
} from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("skeleton")!.title[lang] };
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
    geometry: (
      <>
        <strong>İskelet, yerini tuttuğu şeyin GEOMETRİSİNİ birebir taşımalı.</strong> Kendi
        boyutunu tahmin eden bir iskelet hiç olmamasından kötüdür: boş bir bekleyişi, veri gelince
        yerinden zıplayan bir sayfayla takas eder. Hazır kalıplar tam bunun için var: her
        çağıranın yeniden ölçmesi gerekmesin diye.
      </>
    ),
    breath: (
      <>
        Nefes döngüsü <code>--duration-breath</code> (1100ms), ekrandaki tek yavaş hareket.
        Azaltılmış harekette tamamen durur ve düz bir blok kalır.
      </>
    ),
    band: "PageBand: sayfa başlığı şeridi",
    raw: "Ham blok",
    rules: "Kurallar",
    three: (
      <>
        Üçü farklı soruya cevap veriyor: <Xref to="skeleton">Skeleton</Xref> &quot;ne
        geleceğini&quot;, <Xref to="spinner">Spinner</Xref> &quot;bir şeyin sürdüğünü&quot;,{" "}
        <Xref to="progress">Progress</Xref> &quot;ne kadar kaldığını&quot; söyler.
      </>
    ),
    related: "İlgili",
  },
  en: {
    geometry: (
      <>
        <strong>A skeleton must carry the exact GEOMETRY of the thing it stands in for.</strong> A
        skeleton that guesses its own size is worse than none: it trades an empty wait for a page
        that jumps when the data lands. The ready-made shapes exist for exactly this, so nobody
        has to measure again.
      </>
    ),
    breath: (
      <>
        The breathing cycle is <code>--duration-breath</code> (1100ms), the only slow movement on
        screen. Under reduced motion it stops entirely and a flat block remains.
      </>
    ),
    band: "PageBand: the page header band",
    raw: "Raw block",
    rules: "Rules",
    three: (
      <>
        The three answer different questions: <Xref to="skeleton">Skeleton</Xref> says what is
        coming, <Xref to="spinner">Spinner</Xref> says something is taking time, and{" "}
        <Xref to="progress">Progress</Xref> says how much is left.
      </>
    ),
    related: "Related",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("skeleton")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Note>{t.geometry}</Note>
      <Demo labels={dict.demo} align="start" code={`<SkeletonText lines={3} />
<SkeletonRows rows={4} />
<SkeletonCard />
<SkeletonTable rows={5} />`}>
        <div className="grid w-full gap-8 sm:grid-cols-2">
          <div>
            <p className="docs-eyebrow mb-3">Text</p>
            <SkeletonText lines={3} />
          </div>
          <div>
            <p className="docs-eyebrow mb-3">Rows</p>
            <SkeletonRows rows={4} />
          </div>
          <div>
            <p className="docs-eyebrow mb-3">Card</p>
            <SkeletonCard />
          </div>
          <div>
            <p className="docs-eyebrow mb-3">Kpi</p>
            <div className="flex gap-3">
              <SkeletonKpi index={0} />
              <SkeletonKpi index={1} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <p className="docs-eyebrow mb-3">Table</p>
            <SkeletonTable rows={4} />
          </div>
          <div>
            <p className="docs-eyebrow mb-3">Options</p>
            <SkeletonOptions rows={3} />
          </div>
          <div>
            <p className="docs-eyebrow mb-3">Panel</p>
            <SkeletonPanel />
          </div>
          <div className="sm:col-span-2">
            <p className="docs-eyebrow mb-3">{t.band}</p>
            <SkeletonPageBand />
          </div>
          <div className="sm:col-span-2">
            <p className="docs-eyebrow mb-3">{t.raw}</p>
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </Demo>
      <P>{t.breath}</P>

      <H2>Props</H2>
      <Props of="Skeleton" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.three}</P>
    </>
  );
}
