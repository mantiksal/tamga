import { ScoreMatrix } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("score-matrix")!.title[lang] };
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
/* Bir mağazanın haftası: gündüz yoğun, gece boş, hafta sonu öğlen zirve.
   Uydurma bir desen değil · tasarımın örneği de tam bunu gösteriyor. */
const SAATLER = ["08", "10", "12", "14", "16", "18", "20", "22", "00", "02", "04", "06"];
const YOGUNLUK = [
  [8, 34, 38, 36, 33, 9, 6, 0, 0, 0, 0, 0],
  [16, 18, 36, 38, 34, 15, 7, 0, 0, 0, 0, 0],
  [17, 33, 37, 35, 16, 14, 6, 0, 0, 0, 0, 0],
  [15, 32, 36, 34, 31, 13, 5, 0, 0, 0, 0, 0],
  [30, 31, 44, 46, 33, 30, 14, 7, 0, 0, 0, 0],
  [14, 45, 46, 44, 32, 15, 13, 6, 5, 0, 0, 0],
  [29, 30, 45, 46, 44, 28, 6, 5, 0, 0, 0, 0],
];

const T = {
  tr: {
    lead: (
      <>
        İki boyutlu <strong>yoğunluk ızgarası</strong>: satır bir bandı (gün, bölge), sütun
        ötekini (saat, hafta) taşıyor, ve hücrenin rengi kesişimdeki <em>miktarı</em> söylüyor.
        Skor göstergeleriyle aynı aileden değil · onlar tek bir sayıyı okutuyor, bu bir{" "}
        <strong>desen</strong> gösteriyor: yoğunluğun nerede toplandığını, saymadan.
      </>
    ),
    az: "Az",
    cok: "Çok",
    gunler: ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"],
    siparisBaslik: "Gün ve saate göre sipariş sayısı",
    hucreAd: (gun: string, saat: string, n: number) => `${gun} ${saat}: ${n} sipariş`,
    miktarP: (
      <>
        Renk burada bir <strong>durum</strong> değil bir <strong>miktar</strong>: o yüzden ton
        ailesinden değil markanın kendi rampasından geliyor, ve beş basamak bir gözün yanında
        sayı olmadan okuyabileceği en fazlası. Basamak ızgaranın <strong>kendi en
        büyüğüne</strong> göre hesaplanıyor · mutlak bir eşik, bir ızgarayı başka bir haftanın
        rakamlarıyla kıyaslanamaz yapardı.
      </>
    ),
    rel: (
      <>
        Halka hâli <Xref to="score-ring">Score ring</Xref>; yatık hâli{" "}
        <Xref to="score-meter">Score meter</Xref>.
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
        A two-dimensional <strong>density grid</strong>: the rows carry one band (a weekday, a
        region), the columns the other (an hour, a week), and a cell's colour reports the{" "}
        <em>amount</em> at their crossing. Not a relative of the score gauges · those read out a
        single number, this one shows a <strong>pattern</strong>: where the density gathers,
        without counting.
      </>
    ),
    az: "Few",
    cok: "Many",
    gunler: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    siparisBaslik: "Orders by day and hour",
    hucreAd: (gun: string, saat: string, n: number) => `${gun} ${saat}: ${n} orders`,
    miktarP: (
      <>
        Colour here is not a <strong>state</strong> but an <strong>amount</strong>: it comes from
        the brand's own ramp rather than the tone family, and five steps is about the most an eye
        reads off a grid with no number beside it. The step is computed against the grid's{" "}
        <strong>own maximum</strong> · an absolute threshold would make one grid impossible to
        compare with another week's numbers.
      </>
    ),
    rel: (
      <>
        As a ring, <Xref to="score-ring">Score ring</Xref>; laid flat,{" "}
        <Xref to="score-meter">Score meter</Xref>.
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
  const p = findPage("score-matrix")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo
        labels={dict.demo}
        align="start"
        code={`<ScoreMatrix
  label="${t.siparisBaslik}"
  columns={["08", "10", "12", "14", "16", "18", "20", "22", "00", "02", "04", "06"]}
  rows={[{ label: "${t.gunler[0]}", values: [8, 34, 38, 36, 33, 9, 6, 0, 0, 0, 0, 0] }, …]}
  legend={{ low: "${t.az}", high: "${t.cok}" }}
/>`}
      >
        <div className="w-full">
          <ScoreMatrix
            label={t.siparisBaslik}
            columns={SAATLER}
            rows={YOGUNLUK.map((values, i) => ({ label: t.gunler[i] ?? "", values }))}
            legend={{ low: t.az, high: t.cok }}
            cellTitle={(gun, saat, n) => t.hucreAd(gun, saat, n)}
          />
        </div>
      </Demo>
      <P>{t.miktarP}</P>

      <H2>{t.rules}</H2>
      <Note>{t.labelRule}</Note>
      <Note>{t.noField}</Note>

      <H2>Props</H2>
      <Props of="ScoreMatrix" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
