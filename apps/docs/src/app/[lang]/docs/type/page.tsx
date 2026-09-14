import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("type")!.title[lang] };
}

/**
 * Tipografinin gerekçesi.
 *
 * Kademelerin tam listesi ve px değerleri Token'lar sayfasında; burada yalnız
 * neden on kademe, neden tek yüz, ve neyin yasak olduğu.
 */
const T = {
  tr: {
    tokensLink: "Token'lar",
    measureLink: "Ölçü",

    whatFor: "Bu sayfa ne işe yarıyor",
    whatForP: (
      <>
        <strong>Bir yazı boyu seçmeden önce buraya bakılır.</strong> Kademe <em>rol</em> ile
        seçiliyor, gözle değil: bu bir tablo alt satırı mı, bir kart başlığı mı, bir KPI sayısı mı?
        &laquo;Burada 13 biraz büyük duruyor&raquo; diye 12.5 yazmak skalayı bitiren şeydir.
      </>
    ),
    born: (
      <>
        Bu skala bir borçtan doğdu. Bir arayüzde <strong>on dokuz farklı yazı boyu 272 yerde</strong>{" "}
        elle yazılmıştı; 12.5, 13.5 ve 14.5 dahil. Yarım piksel hiçbir ekranda temiz basmıyor ve
        kimse onu bilerek seçmemişti; her biri ihtiyaç anında yazıldığı için &laquo;gövde metni kaç
        punto&raquo; sorusunun cevabı &laquo;12 ile 14 arası bir yer&raquo; olmuştu.
      </>
    ),

    scale: "On kademe, ve her birinin bir işi var",
    scaleP: (
      <>
        En küçüğü eksen etiketleri ve ölçek uçları için; sonra yoğun eşaralıklı kimlikler ve çip
        metni; sonra üstveri ve tablo alt satırları. <strong>Varsayılan gövde kademesi</strong>{" "}
        satır, hücre ve gövde metni için. Yukarı doğru: girdiler, kart ve bölüm başlıkları, sayfa
        başlığı, ve en üstte KPI sayıları için üç görüntü kademesi.
      </>
    ),

    oneFace: "Tek yüz",
    oneFaceP: (
      <>
        Kit <strong>sistem arayüz yığınını</strong> kullanıyor ve ikinci bir yüz indirmiyor. Bunun
        somut bir sebebi var: bir arayüzde ayrı bir başlık yüzü kuruldu, değişkenler{" "}
        <code>body</code>&rsquo;ye konurken skala <code>:root</code>&rsquo;ta çözülüyordu, zincir
        koptu: yüz <em>indiriliyor ama hiç basılmıyordu</em>. Üstünde anlaşılan tasarım baştan beri
        sistem yüzündeydi. İndirilen ama kullanılmayan bir yüz, yalnızca ilk boyanın gecikmesidir.
      </>
    ),
    headings: (
      <>
        <strong>Başlıklar ayrı bir yüz değil</strong>, aynı yüzün ağırlığı.{" "}
        <strong>İtalik yok.</strong>
      </>
    ),
    numbers: (
      <>
        <strong>Bedeli açıkça yazılıyor:</strong> eşaralıklı yüz de aynı aileden geldiği için
        rakamlar kendiliğinden tablo genişliğinde değil. Bir sütunun hizalanması gerekiyorsa{" "}
        <code>tabular-nums</code> hâlâ elde, ama artık <em>istenerek</em> konuluyor, varsayılan
        olarak gelmiyor. Her metrik, skor, sayaç ve zaman damgası onu istemek zorunda.
      </>
    ),

    upper: "Büyük harf dönüşümü yok",
    upperP: (
      <>
        <code>text-transform: uppercase</code> ve harf aralığı ayarı kaldırıldı, ve sebebi bir zevk
        değil bir <strong>hata</strong>: Türkçe yerelinde tarayıcı{" "}
        <strong>&laquo;LIMIT&raquo; kelimesini &laquo;LİMİT&raquo;</strong> diye basıyor. Çok
        dilli bir üründe büyük harf dönüşümü sessiz bir hata kaynağı: kimse şikâyet etmiyor, yalnız
        metin yanlış.
      </>
    ),

    enforce: "Zorlama",
    enforceP: (
      <>
        Ham bir yazı boyu skala denetiminde hata veriyor: köşeli parantezle yazılmış keyfi bir
        punto da, satır içi bir <code>fontSize</code> da. Kademelerin kendisi de kaynaktan üretiliyor, yani bir kademe
        eklendiğinde doküman kendiliğinden güncelleniyor.
      </>
    ),

    tokensNote: (
      <>
        Kademelerin <strong>tam listesi ve piksel değerleri</strong> Token'lar sayfasında.
      </>
    ),

    demoMicro: "eksen etiketi",
    demoSmall: "tablo alt satırı",
    demoBody: "varsayılan gövde metni",
    demoSubhead: "Kart başlığı",
    demoTitle: "Sayfa başlığı",
    demoDisplay: "1.284",
  },
  en: {
    tokensLink: "Tokens",
    measureLink: "Measure",

    whatFor: "What this page is for",
    whatForP: (
      <>
        <strong>Read this before picking a text size.</strong> A step is chosen by <em>role</em>,
        never by eye: is this a table sub-line, a card title, a KPI number? Writing 12.5 because
        &ldquo;13 looks a bit large here&rdquo; is the thing that ends a scale.
      </>
    ),
    born: (
      <>
        This scale came out of a debt. One interface had{" "}
        <strong>nineteen different text sizes written by hand in 272 places</strong>, including
        12.5, 13.5 and 14.5. Half a pixel prints cleanly on no screen and nobody had chosen one
        deliberately; each was written in the moment, so the answer to &ldquo;how big is body
        text&rdquo; had become &ldquo;somewhere between 12 and 14&rdquo;.
      </>
    ),

    scale: "Ten steps, each with a job",
    scaleP: (
      <>
        The smallest is for axis ticks and scale ends; then dense mono identifiers and chip text;
        then meta and table sub-lines. <strong>The default body step</strong> is for rows, cells and
        body copy. Upward: inputs, card and section titles, page titles, and at the top three
        display steps for KPI numbers.
      </>
    ),

    oneFace: "One face",
    oneFaceP: (
      <>
        The kit uses the <strong>system UI stack</strong> and downloads no second face. There is a
        concrete reason: one interface set up a separate display face, the variables were put on{" "}
        <code>body</code> while the scale resolved on <code>:root</code>, the chain broke: the face
        was <em>downloaded but never painted</em>. The design everyone had signed off was on the
        system face all along. A face that is fetched but unused is only a slower first paint.
      </>
    ),
    headings: (
      <>
        <strong>Headings are not a separate face</strong>, they are a weight of the same one.{" "}
        <strong>No italics.</strong>
      </>
    ),
    numbers: (
      <>
        <strong>The cost is stated plainly:</strong> because the mono face comes from the same
        family, digits are not tabular by default. If a column has to line up,{" "}
        <code>tabular-nums</code> is still there, but it is now asked for <em>deliberately</em>{" "}
        rather than inherited. Every metric, score, counter and timestamp has to ask.
      </>
    ),

    upper: "No uppercase transform",
    upperP: (
      <>
        <code>text-transform: uppercase</code> and letter-spacing adjustments were removed, and the
        reason is a <strong>bug</strong> rather than a taste: in the Turkish locale the browser
        renders <strong>&ldquo;LIMIT&rdquo; as &ldquo;L&#304;MIT&rdquo;</strong>. In a
        multilingual product an uppercase transform is a silent source of error: nobody complains,
        the text is simply wrong.
      </>
    ),

    enforce: "Enforcement",
    enforceP: (
      <>
        A raw text size fails the scale check: an arbitrary point size in square brackets, or an
        inline <code>fontSize</code>. The steps themselves are generated from source, so adding one updates the
        documentation by itself.
      </>
    ),

    tokensNote: (
      <>
        The <strong>full list of steps with their pixel values</strong> is on the Tokens page.
      </>
    ),

    demoMicro: "axis label",
    demoSmall: "table sub-line",
    demoBody: "default body copy",
    demoSubhead: "Card title",
    demoTitle: "Page title",
    demoDisplay: "1,284",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("type")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <H2>{t.whatFor}</H2>
      <P>{t.whatForP}</P>
      <P>{t.born}</P>

      <H2>{t.scale}</H2>
      <P>{t.scaleP}</P>
      {/* KADEMELER YAN YANA DEĞİL ALT ALTA: bir skala ancak sırayla okunduğunda
          skala gibi görünüyor. */}
      <Demo
        labels={dict.demo}
        align="start"
        grid={false}
        code={`<span className="text-micro">…</span>
<span className="text-small">…</span>
<span className="text-body">…</span>
<h2 className="text-subhead">…</h2>
<h1 className="text-title">…</h1>
<span className="text-display">…</span>`}
      >
        <div className="flex w-full flex-col gap-2 text-ink">
          <span className="text-micro text-ink-faint">{t.demoMicro}</span>
          <span className="text-small text-ink-soft">{t.demoSmall}</span>
          <span className="text-body">{t.demoBody}</span>
          <span className="text-subhead font-semibold">{t.demoSubhead}</span>
          <span className="text-title font-semibold">{t.demoTitle}</span>
          <span className="text-display font-semibold tabular-nums">{t.demoDisplay}</span>
        </div>
      </Demo>

      <H2>{t.oneFace}</H2>
      <P>{t.oneFaceP}</P>
      <P>{t.headings}</P>
      <Note>{t.numbers}</Note>

      <H2>{t.upper}</H2>
      <P>{t.upperP}</P>

      <H2>{t.enforce}</H2>
      <P>{t.enforceP}</P>

      <Note>
        {t.tokensNote} <Xref to="tokens">{t.tokensLink}</Xref> ·{" "}
        <Xref to="measure">{t.measureLink}</Xref>
      </Note>
    </>
  );
}
