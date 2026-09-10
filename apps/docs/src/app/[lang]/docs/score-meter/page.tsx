import { ScoreMeter } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("score-meter")!.title[lang] };
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
        Aynı okuma, yatık. Bir halkanın yer bulamadığı yerde, bir kart başlığının altında, bir
        listenin sağında, aynı sayıyı aynı segment diliyle söyler.
      </>
    ),
    delta: (
      <>
        <code>delta</code> bir öncekine göre değişim. İşareti taşır ve rengini yönünden alır, ama
        yön iyi/kötü demek değildir; artan bir hata oranı da artıştır.
      </>
    ),
    rel: (
      <>
        Halka hâli <Xref to="score-ring">Score ring</Xref>; ızgara hâli{" "}
        <Xref to="score-matrix">Score matrix</Xref>.
      </>
    ),
    bands: "Bantlar",
    bandsWhy: (
      <>
        Bunlar kitin varsayılanı. Farklı eşikleri olan bir ürün kendi tonunu verir; sayı ile
        anlam arasındaki eşik bir ürün kararıdır.
      </>
    ),
    noField: (
      <>
        <strong>Bu bileşenin bir alanı yok.</strong> SEO skoru, stok doluluk oranı, sipariş
        karşılama yüzdesi, tamamlanma, memnuniyet; hepsi aynı bileşen. Adının nötr olması
        bilinçli.
      </>
    ),
    labelRule: (
      <>
        <code>label</code> isteğe bağlı değil. Bir gösterge ekran okuyucuya &quot;96&quot; demez;
        ne olduğunu söylemesi gerekir. Ve kit onu <em>üretemez</em>: çeviri çağıranın işi.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    good: "İyi",
    mid: "Orta",
    low: "Düşük",
    score: (n: number) => `Skor ${n} / 100`,
  },
  en: {
    lead: (
      <>
        The same reading, laid flat. Where a ring has no room, under a card header, to the right
        of a list, it says the same number in the same segment language.
      </>
    ),
    delta: (
      <>
        <code>delta</code> is the change since last time. It carries a sign and takes its colour
        from the direction, but direction does not mean good or bad; a rising error rate is also
        a rise.
      </>
    ),
    rel: (
      <>
        As a ring, <Xref to="score-ring">Score ring</Xref>; as a grid,{" "}
        <Xref to="score-matrix">Score matrix</Xref>.
      </>
    ),
    bands: "Bands",
    bandsWhy: (
      <>
        These are the kit&apos;s defaults. A product with different thresholds passes its own tone
, where a number turns into a meaning is a product decision.
      </>
    ),
    noField: (
      <>
        <strong>This component has no field.</strong> An SEO score, stock fill rate, order
        fulfilment percentage, completion, satisfaction; all the same component. Its neutral name
        is deliberate.
      </>
    ),
    labelRule: (
      <>
        <code>label</code> is not optional. A gauge does not say &quot;96&quot; to a screen
        reader; it has to say what it is. And the kit <em>cannot</em> produce it: translation is
        the caller&apos;s job.
      </>
    ),
    rules: "Rules",
    related: "Related",
    good: "Good",
    mid: "Fair",
    low: "Low",
    score: (n: number) => `Score ${n} / 100`,
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("score-meter")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo
        labels={dict.demo}
        align="start"
        code={`<ScoreMeter value={72} delta={-4.2} label="${t.score(72)}" bandLabel="${t.mid}" />`}
      >
        <div className="flex w-full flex-wrap items-start gap-10">
          <ScoreMeter value={72} delta={-4.2} label={t.score(72)} bandLabel={t.mid} />
          <ScoreMeter value={91} delta={1.8} label={t.score(91)} bandLabel={t.good} />
        </div>
      </Demo>
      <P>{t.delta}</P>

      <H2>{t.bands}</H2>
      <pre className="docs-code my-4">{`>= 90   positive
>= 70   caution
<  70   danger`}</pre>
      <P>{t.bandsWhy}</P>

      <H2>{t.rules}</H2>
      <Note>{t.labelRule}</Note>
      <Note>{t.noField}</Note>

      <H2>Props</H2>
      <Props of="ScoreMeter" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
