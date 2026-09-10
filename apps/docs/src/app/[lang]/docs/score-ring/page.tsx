import { ScoreRing } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("score-ring")!.title[lang] };
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
        0-100 arası bir sayıyı okunur kılan halka. <strong>Sert kare segmentler</strong>:
        pürüzsüz yay ve ibre yok; süpürülen bir yay skeuomorfik bir göstergedir ve bu kit
        skeuomorf çizmez.
      </>
    ),
    size: "Boyut",
    sizeWhy: (
      <>
        Küçük boyutlarda banttaki kelime kendiliğinden kaybolur: 10px&apos;in altına düşen bir
        etiket okunmaz, okunmayan etiket leke olur.
      </>
    ),
    rel: (
      <>
        Yatık hâli <Xref to="score-meter">Score meter</Xref>; ızgara hâli{" "}
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
        The ring that makes a number between 0 and 100 readable. <strong>Hard square
        segments</strong>: no smooth arc, no needle; a swept arc is a skeuomorphic gauge, and this
        kit does not draw skeuomorphs.
      </>
    ),
    size: "Size",
    sizeWhy: (
      <>
        At small sizes the band word disappears on its own: a label below 10px is unreadable, and
        an unreadable label is a smudge.
      </>
    ),
    rel: (
      <>
        Laid flat, <Xref to="score-meter">Score meter</Xref>; as a grid,{" "}
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
  const p = findPage("score-ring")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo
        labels={dict.demo}
        code={`<ScoreRing value={96} label="${t.score(96)}" bandLabel="${t.good}" />`}
      >
        <ScoreRing value={96} label={t.score(96)} bandLabel={t.good} />
        <ScoreRing value={78} label={t.score(78)} bandLabel={t.mid} />
        <ScoreRing value={41} label={t.score(41)} bandLabel={t.low} />
      </Demo>

      <H2>{t.size}</H2>
      <Demo
        labels={dict.demo}
        code={`<ScoreRing value={87} size={72}  label="…" showLabel={false} />
<ScoreRing value={87} size={112} label="…" showLabel={false} />
<ScoreRing value={87} size={168} label="…" bandLabel="…" />`}
      >
        <ScoreRing value={87} size={72} label={t.score(87)} showLabel={false} />
        <ScoreRing value={87} size={112} label={t.score(87)} showLabel={false} />
        <ScoreRing value={87} size={168} label={t.score(87)} bandLabel={t.good} />
      </Demo>
      <P>{t.sizeWhy}</P>

      <H2>{t.bands}</H2>
      <pre className="docs-code my-4">{`>= 90   positive
>= 70   caution
<  70   danger`}</pre>
      <P>{t.bandsWhy}</P>

      <H2>{t.rules}</H2>
      <Note>{t.labelRule}</Note>
      <Note>{t.noField}</Note>

      <H2>Props</H2>
      <Props of="ScoreRing" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
