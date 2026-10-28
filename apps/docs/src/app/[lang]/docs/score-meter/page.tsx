import { ScoreMeter } from "tamga-ui";
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
  return sayfaMeta("score-meter", lang);
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
    olcekH: "Ürünün kendi ölçeği",
    olcekP: (
      <>
        <code>scale</code> kitin beş eşit bandı yerine ürünün kendi bantları: her bant{" "}
        <code>to</code>&apos;da biter, genişlik aralığı izler (bir harf notunun F 0–39&apos;u A+
        95–100&apos;den geniştir; eşit çizilse değerin yeri hakkında yalan söylerdi). Her bant tonunun
        pasteli (<code>faintTint</code>), değerin düştüğü bant daha güçlü (<code>softTint</code>) ve
        tonunun mürekkebiyle çevrili, adı da o mürekkepte. <code>display</code> sayıyı ürünün
        söylediği gibi yazar (&laquo;66,3&raquo;), <code>markLabel</code> onu işaretin üstüne koyar,{" "}
        <code>head={"{false}"}</code> üst satırı kapatır; sayfa adı ve sayıyı kendisi söylüyorsa.
        Dar ölçekte değerin olmadığı bantlar <code>short</code> adını alır.
      </>
    ),
    saglik: "Sağlık puanı",
    olcek: [
      { to: 40, label: "F 0–39", short: "F", tone: "danger" },
      { to: 60, label: "D 40–59", short: "D", tone: "elevated" },
      { to: 75, label: "C 60–74", short: "C", tone: "caution" },
      { to: 85, label: "B 75–84", short: "B", tone: "info" },
      { to: 95, label: "A 85–94", short: "A", tone: "positive" },
      { to: 100, label: "A+ 95–100", short: "A+", tone: "positive" },
    ] as const,
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
    satisfaction: "Müşteri memnuniyeti",
    risk: "Risk skoru",
    bandNames: ["Kötü", "Zayıf", "Orta", "İyi", "Mükemmel"] as [string, string, string, string, string],
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
    olcekH: "The product's own scale",
    olcekP: (
      <>
        <code>scale</code> puts the product&apos;s own bands in place of the kit&apos;s five even
        ones: each band ends at <code>to</code>, widths follow the ranges (a letter grade&apos;s F
        0–39 is wider than its A+ 95–100; drawn even they would lie about where the value stands).
        Every band is its tone&apos;s pastel (<code>faintTint</code>); the band the value falls in
        is stronger (<code>softTint</code>), edged in its tone&apos;s ink, its name in that ink too.{" "}
        <code>display</code> writes the number as the product says it (&ldquo;66.3&rdquo;),{" "}
        <code>markLabel</code> puts it over the mark, <code>head={"{false}"}</code> drops the top
        line when the page says the name and number itself. On a narrow meter the bands the value
        is not in take their <code>short</code> name.
      </>
    ),
    saglik: "Health score",
    olcek: [
      { to: 40, label: "F 0–39", short: "F", tone: "danger" },
      { to: 60, label: "D 40–59", short: "D", tone: "elevated" },
      { to: 75, label: "C 60–74", short: "C", tone: "caution" },
      { to: 85, label: "B 75–84", short: "B", tone: "info" },
      { to: 95, label: "A 85–94", short: "A", tone: "positive" },
      { to: 100, label: "A+ 95–100", short: "A+", tone: "positive" },
    ] as const,
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
    satisfaction: "Customer satisfaction",
    risk: "Risk score",
    bandNames: ["Poor", "Weak", "Fair", "Good", "Excellent"] as [string, string, string, string, string],
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
        code={`<ScoreMeter value={72} label="${t.satisfaction}" bands={[${t.bandNames.map((b) => `"${b}"`).join(", ")}]} />`}
      >
        <div className="flex w-full flex-col gap-10">
          <ScoreMeter value={72} label={t.satisfaction} bands={t.bandNames} />
          <ScoreMeter value={91} label={t.risk} bands={t.bandNames} />
        </div>
      </Demo>
      <P>{t.delta}</P>

      <H2>{t.olcekH}</H2>
      <P>{t.olcekP}</P>
      <Demo
        labels={dict.demo}
        align="start"
        code={`<ScoreMeter
  value={66.3}
  display="66,3"
  label="${t.saglik}"
  markLabel
  scale={[
    { to: 40, label: "F 0–39", short: "F", tone: "danger" },
    { to: 60, label: "D 40–59", short: "D", tone: "elevated" },
    { to: 75, label: "C 60–74", short: "C", tone: "caution" },
    { to: 85, label: "B 75–84", short: "B", tone: "info" },
    { to: 95, label: "A 85–94", short: "A", tone: "positive" },
    { to: 100, label: "A+ 95–100", short: "A+", tone: "positive" },
  ]}
/>
<ScoreMeter value={91} label="${t.saglik}" scale={…} head={false} markLabel />`}
      >
        <div className="flex w-full flex-col gap-10" data-olcek-ornek>
          <ScoreMeter value={66.3} display="66,3" label={t.saglik} markLabel scale={t.olcek} />
          <ScoreMeter value={91} label={t.saglik} scale={t.olcek} head={false} markLabel />
        </div>
      </Demo>

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
