import { LineChartDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("line-chart")!.title[lang] };
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
        <Xref to="sparkline">Sparkline</Xref> eksensizdir ve tek soruya cevap verir: yön ne? Bu
        onun yapamadığını yapıyor: <strong>değer okutuyor</strong>. Bir gecikme grafiğinde
        &quot;yükseliyor&quot; yetmez; &quot;kaç milisaniye&quot; gerekir.
      </>
    ),
    noLib: (
      <>
        <strong>Neden bir grafik kütüphanesi değil.</strong> Recharts ya da Chart.js bir
        bağımlılıktır ve <em>kendi görsel dilini</em> getirir: kendi gölgesi, kendi yuvarlatılmış
        çizgisi, kendi tooltip&apos;i. Kitin dört yasasını o kütüphaneye dayatmak, onu yeniden
        yazmakla aynı işi çıkarır. Buradaki SVG üç yüz satır değil, ve tamamı kitin
        token&apos;larıyla çiziliyor.
      </>
    ),
    notDoing: (
      <>
        <strong>Ne yapmıyor:</strong> yığılmış alanlar, ikinci eksen, zum, legend sürükleme.
        Onlar gerekirse bir bağımlılık doğru cevap olur, ama gerekmeden getirilmez.
      </>
    ),
    labels: (
      <>
        Y ekseni etiketleri SVG&apos;nin <strong>dışında</strong>. İçine konsaydı{" "}
        <code>viewBox</code> ölçeklendikçe yazı da ölçeklenir ve dar ekranda okunmaz olurdu.
      </>
    ),
    format: (
      <>
        <code>formatValue</code> zorunlu değil ama <strong>şart</strong>: kit birim bilmez.
        &quot;24&quot; ile &quot;24ms&quot; arasındaki fark, grafiğin ne söylediğidir.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Satır içi, eksensiz hâli <Xref to="sparkline">Sparkline</Xref>; zaman içinde DURUM için{" "}
        <Xref to="timeline-strip">Timeline strip</Xref>; tek bir okuma için{" "}
        <Xref to="score-ring">Score ring</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        <Xref to="sparkline">Sparkline</Xref> has no axes and answers one question: which way?
        This does what it cannot: it <strong>lets you read the value</strong>. On a latency chart
        &quot;rising&quot; is not enough; &quot;how many milliseconds&quot; is.
      </>
    ),
    noLib: (
      <>
        <strong>Why not a charting library.</strong> Recharts or Chart.js is a dependency, and it
        brings <em>its own visual language</em>: its shadow, its rounded line, its tooltip.
        Imposing the kit&apos;s four laws on that library is the same work as writing it again.
        The SVG here is not three hundred lines, and all of it is drawn with the kit&apos;s tokens.
      </>
    ),
    notDoing: (
      <>
        <strong>What it does not do:</strong> stacked areas, a second axis, zoom, draggable
        legends. If those are needed, a dependency becomes the right answer, but it is not
        brought in before then.
      </>
    ),
    labels: (
      <>
        The Y-axis labels sit <strong>outside</strong> the SVG. Inside, they would scale with the{" "}
        <code>viewBox</code> and become unreadable on a narrow screen.
      </>
    ),
    format: (
      <>
        <code>formatValue</code> is not required but is <strong>essential</strong>: the kit knows
        no units. The difference between &quot;24&quot; and &quot;24ms&quot; is what the chart is
        saying.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        The inline, axis-free form is <Xref to="sparkline">Sparkline</Xref>; for STATE over time,{" "}
        <Xref to="timeline-strip">Timeline strip</Xref>; for a single reading,{" "}
        <Xref to="score-ring">Score ring</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("line-chart")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" grid={false} code={`<LineChart
  series={[
    { name: "p50", values: [...], tone: "neutral" },
    { name: "p95", values: [...], tone: "caution" },
  ]}
  labels={["00:00", "06:00", "12:00", "18:00"]}
  formatValue={(v) => \`\${v}ms\`}
/>`}>
        <div className="w-full">
          <LineChartDemo lang={lang} />
        </div>
      </Demo>
      <P>{t.format}</P>

      <H2>{t.rules}</H2>
      <Note>{t.noLib}</Note>
      <Note>{t.notDoing}</Note>
      <P>{t.labels}</P>

      <H2>Props</H2>
      <Props of="LineChart" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
