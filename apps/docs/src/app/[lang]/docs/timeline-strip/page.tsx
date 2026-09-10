import { TimelineStrip } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("timeline-strip")!.title[lang] };
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
        Kova başına bir işaret, renk durumu taşır. Bir e-ticaret panelinde günlük sipariş
        yoğunluğu, bir depoda stok durumu, bir kontrol panelinde erişilebilirlik; aynı şerit.
      </>
    ),
    from: "12 gün önce",
    to: "bugün",
    gap: (
      <>
        Kovalar arasında <strong>boşluk var</strong>: bitişik bir şerit tek bir sürekli çubuk gibi
        okunur, boşluk &quot;bunlar ayrı ölçümler&quot; der.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Bir SAYININ zaman içindeki seyri için <Xref to="sparkline">Sparkline</Xref>; o değeri
        çizer, bu durumu.
      </>
    ),
  },
  en: {
    lead: (
      <>
        One mark per bucket, carrying a colour for its state. Daily order volume in an e-commerce
        panel, stock condition in a warehouse, availability in a control panel; the same strip.
      </>
    ),
    from: "12 days ago",
    to: "today",
    gap: (
      <>
        There is a <strong>gap</strong> between buckets: a continuous strip reads as one single
        bar, while the gap says &quot;these are separate measurements&quot;.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For a NUMBER moving over time, <Xref to="sparkline">Sparkline</Xref>; that draws a value,
        this draws a state.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("timeline-strip")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<TimelineStrip data={strip} labels={["${t.from}", "${t.to}"]} />`}>
        <div className="w-full">
          <TimelineStrip
            data={["positive", "positive", "caution", "positive", "positive", "danger",
              "positive", "positive", "positive", "caution", "positive", "positive"]}
            labels={[t.from, t.to]}
          />
        </div>
      </Demo>
      <P>{t.gap}</P>

      <H2>Props</H2>
      <Props of="TimelineStrip" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
