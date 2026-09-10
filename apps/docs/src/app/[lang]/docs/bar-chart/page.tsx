import { BarChart } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("bar-chart")!.title[lang] };
}

const T = {
  tr: {
    stackH: "Yığılmış hâli",
    stackP: (
      <>
        Aynı çubuk, birkaç seriye bölünmüş. Toplam okunur kalıyor ama parçaların KARŞILAŞTIRMASI
        zorlaşıyor: yalnız en alttaki seri ortak bir tabandan başlıyor, ötekiler kayan bir
        zeminin üstünde duruyor. Toplam sorunun cevabıysa yığ; parçalar cevapsa yan yana koy.
      </>
    ),
    lead: (
      <>
        Sıralamak ve karşılaştırmak için. Uzunluk doğrudan <strong>sayıyı</strong> gösteriyor, yani
        iki satırı karşılaştırmak için hiçbir hesap gerekmiyor.
      </>
    ),
    whyH: "Neden yatay",
    whyP: (
      <>
        Kategori adları uzun olur, ve dikey bir çubukta o adlar eksene eğik yazılır ya da kırpılır.
        Yatayda ad kendi satırında düz durur; okumak için kafa çevirmek gerekmez.
      </>
    ),
    rules: "Kurallar",
    zero: (
      <>
        <strong>Hangi satırların çizileceği çağıranın kararı.</strong> Bileşen verdiğin her satırı
        çizer. Sıfırları ayıklamak, ilk N&apos;i almak ve sıralamak veriyi bilenin işi: bir grafiğe
        boş satır doldurmak, dört çubuğu üç yüz boş satırın arasında kaybetmek demektir.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Parça-bütün için <Xref to="pie-chart">Pie chart</Xref>, zaman içinde değer için{" "}
        <Xref to="line-chart">Line chart</Xref>.
      </>
    ),
    rows: [
      ["İstanbul", 3380],
      ["Ankara", 2660],
      ["İzmir", 1560],
      ["Bursa", 660],
      ["Antalya", 590],
    ] as const,
  },
  en: {
    stackH: "The stacked form",
    stackP: (
      <>
        The same bar, split across several series. The total stays readable but COMPARING the
        parts gets harder: only the bottom series starts from a shared baseline, the rest sit on a
        moving floor. Stack when the total is the answer; put bars side by side when the parts
        are.
      </>
    ),
    lead: (
      <>
        For ranking and comparison. Length maps straight onto the <strong>number</strong>, so
        comparing two rows takes no arithmetic.
      </>
    ),
    whyH: "Why horizontal",
    whyP: (
      <>
        Category names get long, and on a vertical bar those names end up tilted against the axis or
        truncated. Horizontally the name sits flat on its own row; nobody has to turn their head.
      </>
    ),
    rules: "Rules",
    zero: (
      <>
        <strong>Which rows get drawn is the caller&apos;s call.</strong> The component draws every
        row you hand it. Dropping zeros, taking the top N and sorting belong to whoever knows the
        data: padding a chart with empty rows means losing four bars among three hundred blanks.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For part of a whole use <Xref to="pie-chart">Pie chart</Xref>, for value over time{" "}
        <Xref to="line-chart">Line chart</Xref>.
      </>
    ),
    rows: [
      ["Istanbul", 3380],
      ["Ankara", 2660],
      ["Izmir", 1560],
      ["Bursa", 660],
      ["Antalya", 590],
    ] as const,
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("bar-chart")!;
  const t = T[lang];
  const bars = t.rows.map(([label, value]) => ({ label, value }));
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo
        labels={dict.demo}
        align="start"
        code={`<BarChart
  bars={[
${bars.map((b) => `    { label: "${b.label}", value: ${b.value} },`).join("\n")}
  ]}
/>`}
      >
        <BarChart bars={bars} className="w-full" labelWidth="7rem" />
      </Demo>
      <P>{t.lead}</P>

      <H2>{t.whyH}</H2>
      <P>{t.whyP}</P>

      <H2>{t.rules}</H2>
      <Note>{t.zero}</Note>

      <H2>{t.stackH}</H2>
      <P>{t.stackP}</P>
      <Props of="StackedBarChart" lang={lang} />

      <H2>Props</H2>
      <Props of="BarChart" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
