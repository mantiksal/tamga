import { PieChart } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("pie-chart")!.title[lang] };
}

const T = {
  tr: {
    lead: (
      <>
        Dilimler bir <strong>bütünü</strong> oluşturuyorsa ve sayıları azsa. İki ya da üç dilimde göz
        oranı bir bakışta okur; beşi geçtiğinde okumaz, ve okunmayan bir grafik yanlış bilgidir. O
        yüzden <code>slices</code> beşle sınırlı.
      </>
    ),
    rules: "Kurallar",
    ranking: (
      <>
        <strong>Bir sıralama parça-bütün değildir.</strong> &ldquo;En çok sipariş veren on
        müşteri&rdquo; otuz altı binin onudur; oradaki yüzde &ldquo;bu on kişinin içinde&rdquo;
        demektir ve hiçbir soruya cevap vermez. Sıralama <Xref to="bar-chart">Bar chart</Xref>&apos;ın
        işi.
      </>
    ),
    totalH: "Payda görünür",
    totalP: (
      <>
        Halka varsayılan, ve sebebi ortadaki boşluk: bir yüzde, paydası görünmediğinde yarım
        bilgidir. <code>%75</code> ile <code>188/250</code> aynı şey değil.{" "}
        <code>total</code> ayrıca <strong>verilebilir</strong>, çünkü dilimler her zaman bütünü
        kapsamaz: cinsiyeti boş olan müşterileri dışarıda bırakan bir sorguda yüzdeler o eksik
        kümenin yüzdesidir, ve bunu ancak çağıran bilir. <code>inner={"{0}"}</code> tam pasta çizer.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Zaman içinde değer için <Xref to="line-chart">Line chart</Xref>, eksensiz yön için{" "}
        <Xref to="sparkline">Sparkline</Xref>, sıralama için <Xref to="bar-chart">Bar chart</Xref>.
      </>
    ),
    kadin: "Kadın",
    erkek: "Erkek",
    uye: "üye",
  },
  en: {
    lead: (
      <>
        Use it when the slices make up a <strong>whole</strong> and there are few of them. At two or
        three slices the eye reads the ratio at a glance; past five it does not, and a chart nobody
        can read is wrong information. That is why <code>slices</code> stops at five.
      </>
    ),
    rules: "Rules",
    ranking: (
      <>
        <strong>A ranking is not a part of a whole.</strong> &ldquo;The ten customers who order
        most&rdquo; is ten out of thirty-six thousand; the percentage there means &ldquo;within
        these ten&rdquo; and answers nothing. Ranking belongs to{" "}
        <Xref to="bar-chart">Bar chart</Xref>.
      </>
    ),
    totalH: "The denominator is visible",
    totalP: (
      <>
        The donut is the default, and the hole is the reason: a percentage without its denominator
        is half a fact. <code>75%</code> and <code>188/250</code> are not the same thing.{" "}
        <code>total</code> can also be <strong>passed in</strong>, because the slices do not always
        cover the whole: in a query that drops customers with no gender on file, the percentages
        belong to that reduced set, and only the caller knows it. <code>inner={"{0}"}</code> draws a
        full pie.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For value over time use <Xref to="line-chart">Line chart</Xref>, for direction without axes{" "}
        <Xref to="sparkline">Sparkline</Xref>, for ranking <Xref to="bar-chart">Bar chart</Xref>.
      </>
    ),
    kadin: "Women",
    erkek: "Men",
    uye: "members",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("pie-chart")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo
        labels={dict.demo}
        align="start"
        code={`<PieChart
  slices={[
    { label: "${t.erkek}", value: 188 },
    { label: "${t.kadin}", value: 62 },
  ]}
  totalLabel="${t.uye}"
/>`}
      >
        <PieChart
          slices={[
            { label: t.erkek, value: 188 },
            { label: t.kadin, value: 62 },
          ]}
          totalLabel={t.uye}
          className="w-full"
        />
      </Demo>
      <P>{t.lead}</P>

      <H2>{t.totalH}</H2>
      <P>{t.totalP}</P>

      <H2>{t.rules}</H2>
      <Note>{t.ranking}</Note>

      <H2>Props</H2>
      <Props of="PieChart" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
