import {
  BuyukHarfOrnegi,
  KapiOrnegi,
  RakamOrnegi,
  SkalaOrnegi,
  YuzOrnegi,
} from "./ornek";
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
 * neden on kademe, neden üç yüz, ve neyin yasak olduğu.
 */
/* KAPI ÖRNEĞİNDEKİ İHLAL PARÇALI YAZILIYOR, ve sebebi kapının kendisi:
   `check-scale` bir `.tsx` dosyasında geçen `text-[13.5px]` kalıbını bir sınıf
   adı sanıyor ve haklı olarak durduruyor. Burada bir sınıf değil bir ÇIKTI
   METNİ var, ama kapının ikisini ayırt edememesi DOĞRU · ayırt edecek kadar
   akıllı olsaydı gerçek bir ihlali de kaçırırdı. Muafiyet yazmak yerine örnek
   bölünüyor: kapı olduğu gibi kalıyor. */
const HAM_PUNTO = "text-" + "[13.5px]";

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

    oneFace: "Üç yüz, üç iş",
    oneFaceP: (
      <>
        Kit <strong>üç yüz</strong> kullanıyor ve her birinin tek bir işi var:{" "}
        <strong>Red Hat Display</strong> başlıklar ve büyük sayılar, <strong>Onest</strong> akan
        arayüz metni, <strong>JetBrains Mono</strong> sütunda okunan her şey: kod, kimlik, tutar,
        zaman damgası. Üçü de paketin içinde geliyor; ürünün kendi <code>&lt;head&gt;</code>
        &rsquo;ine bir şey eklemesi gerekmiyor. Her aile değişken font ve iki dosya: latin ve
        latin-ext. Türkçe harfler için ikincisi şart.
      </>
    ),
    headings: (
      <>
        <strong>Başlıklar ayrı bir yüzde:</strong> Red Hat Display, kalın ağırlıkta. Gövde hiçbir
        zaman başlık yüzüyle yazılmaz, başlık hiçbir zaman gövde yüzüyle. <strong>İtalik yok.</strong>
      </>
    ),
    numbers: (
      <>
        <strong>Bedeli açıkça yazılıyor:</strong> akan metnin rakamları kendiliğinden tablo
        genişliğinde değil. Bir sütunun hizalanması gerekiyorsa ya <code>tabular-nums</code>{" "}
        <em>istenerek</em> konuluyor ya da sayı JetBrains Mono ile yazılıyor. Her metrik, skor,
        sayaç ve zaman damgası bunlardan birini seçmek zorunda.
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

    demo: {
      roles: [
        "eksen etiketi, ölçek ucu",
        "eşaralıklı kimlik, çip metni",
        "üstveri, tablo alt satırı",
        "VARSAYILAN: satır, hücre, gövde",
        "girdi, metin alanı",
        "kart ve bölüm başlığı",
        "sayfa başlığı",
        "küçük KPI",
        "KPI sayısı",
        "büyük KPI",
      ] as const,
      samples: [
        "eksen etiketi",
        "SIP-2481",
        "tablo alt satırı",
        "varsayılan gövde metni",
        "Ayşe Demir",
        "Kart başlığı",
        "Sayfa başlığı",
        "₺842K",
        "1.284",
        "98,6",
      ] as const,
      faces: [
        ["Red Hat Display", "Başlıklar, büyük sayılar, adım numaraları", "Siparişler · 1.284"],
        ["Onest", "Akan arayüz metni: paragraf, menü, buton, etiket", "Stok bu akşam sayılıyor."],
        ["JetBrains Mono", "Sütunda okunan her şey: kod, kimlik, tutar, zaman", "SIP-2481 · ₺1.249 · 09:42"],
      ] as const,
      /* Latin-ext'in yüklendiğini gösteren satır: her harf ikinci dosyadan. */
      letters: "ğ ü ş ı İ ö ç · Ğ Ü Ş I İ Ö Ç",
      tabular: "Tablo genişliğinde rakam",
      numLabels: ["Ciro", "Sipariş", "İade", "Sepet ort."] as const,
      /* 1'ler farkı görünür kılıyor: orantılı dizilişte en dar rakam onlar. */
      nums: ["₺111.111", "₺18.470", "₺1.204", "₺489"] as const,
      input: "Bir kelime yaz",
      word: "limit",
      right: "böyle",
      wrong: "böyle değil",
      asWritten: "yazıldığı gibi, büyük harfle",
      gateTitle: "check:scale (örnek çıktı)",
      gate: [
        ["✗", "src/kpi.tsx:21", `${HAM_PUNTO} → skalada yok, bir kademe kullan`],
        ["✗", "src/row.tsx:9", "style={{ fontSize: 15 }} → satır içi yazı boyu"],
        ["✗", "src/label.tsx:4", "uppercase → büyük harf dönüşümü kaldırıldı"],
        ["✓", "text-*", "10 kademe, kaynaktan üretildi"],
      ] as const,
    },
    ipucu: {
      scale: "Bir satıra tıkla: rolüyle birlikte öne çıkar.",
      faces: "Üç yüz, üç iş. Türkçe harfler üçünde de tam.",
      nums: "Anahtarı aç: Onest sütunu hizaya girer. Mono zaten hizalı.",
      upper: "Kelimeyi değiştir: Türkçe yerelde i harfi İ olur.",
      enforce: "Ham yazı boyu bulunduğunda build durur.",
    },
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

    oneFace: "Three faces, three jobs",
    oneFaceP: (
      <>
        The kit uses <strong>three faces</strong>, each with a single job:{" "}
        <strong>Red Hat Display</strong> for headings and large numbers, <strong>Onest</strong> for
        flowing interface text, <strong>JetBrains Mono</strong> for everything read in a column:
        code, identifiers, amounts, timestamps. All three ship inside the package; the product adds
        nothing to its own <code>&lt;head&gt;</code>. Each family is a variable font in two files,
        latin and latin-ext; Turkish letters need the second.
      </>
    ),
    headings: (
      <>
        <strong>Headings sit in their own face:</strong> Red Hat Display, at a heavy weight. Body
        copy is never set in the heading face, and headings never in the body face.{" "}
        <strong>No italics.</strong>
      </>
    ),
    numbers: (
      <>
        <strong>The cost is stated plainly:</strong> digits in flowing text are not tabular by
        default. If a column has to line up, either <code>tabular-nums</code> is asked for{" "}
        <em>deliberately</em> or the number is set in JetBrains Mono. Every metric, score, counter
        and timestamp has to pick one.
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

    demo: {
      roles: [
        "axis label, scale end",
        "mono identifier, chip text",
        "meta, table sub-line",
        "DEFAULT: rows, cells, body",
        "input, textarea",
        "card and section title",
        "page title",
        "small KPI",
        "KPI number",
        "large KPI",
      ] as const,
      samples: [
        "axis label",
        "ORD-2481",
        "table sub-line",
        "default body copy",
        "Ayşe Demir",
        "Card title",
        "Page title",
        "₺842K",
        "1,284",
        "98.6",
      ] as const,
      faces: [
        ["Red Hat Display", "Headings, large numbers, step numbers", "Orders · 1,284"],
        ["Onest", "Flowing interface text: paragraphs, menus, buttons, labels", "Stock is counted tonight."],
        ["JetBrains Mono", "Everything read in a column: code, IDs, amounts, times", "ORD-2481 · ₺1,249 · 09:42"],
      ] as const,
      letters: "ğ ü ş ı İ ö ç · Ğ Ü Ş I İ Ö Ç",
      tabular: "Tabular figures",
      numLabels: ["Revenue", "Orders", "Refunds", "Avg. basket"] as const,
      nums: ["₺111,111", "₺18,470", "₺1,204", "₺489"] as const,
      input: "Type a word",
      word: "limit",
      right: "this",
      wrong: "not this",
      asWritten: "as written, in capitals",
      gateTitle: "check:scale (example output)",
      gate: [
        ["✗", "src/kpi.tsx:21", `${HAM_PUNTO} → not on the scale, use a step`],
        ["✗", "src/row.tsx:9", "style={{ fontSize: 15 }} → inline text size"],
        ["✗", "src/label.tsx:4", "uppercase → the uppercase transform was removed"],
        ["✓", "text-*", "10 steps, generated from source"],
      ] as const,
    },
    ipucu: {
      scale: "Click a row: it comes forward with its role.",
      faces: "Three faces, three jobs. Turkish letters are complete in all three.",
      nums: "Turn the switch on: the Onest column lines up. Mono already does.",
      upper: "Change the word: in the Turkish locale i becomes İ.",
      enforce: "When a raw text size is found, the build stops.",
    },
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
          skala gibi görünüyor · on örnek bir satıra dizilince on ayrı etiket
          oluyor. Piksel değeri YOK, o Token'lar sayfasında. */}
      <Demo
        ipucu={t.ipucu.scale}
        labels={dict.demo}
        align="start"
        code={`--text-micro
--text-caption
--text-small
--text-body
--text-control
--text-subhead
--text-title
--text-display-sm
--text-display
--text-display-lg

<span className="text-micro">…</span>
<span className="text-small">…</span>
<span className="text-body">…</span>
<h2 className="text-subhead">…</h2>
<h1 className="text-title">…</h1>
<span className="text-display">…</span>`}
      >
        <SkalaOrnegi labels={t.demo} />
      </Demo>

      <H2>{t.oneFace}</H2>
      <P>{t.oneFaceP}</P>
      <Demo
        ipucu={t.ipucu.faces}
        labels={dict.demo}
        align="start"
        code={`--font-display: "Red Hat Display", …;
--font-sans:    "Onest", …;
--font-mono:    "JetBrains Mono", …;

@import "tamga-ui/styles.css";  /* ${lang === "tr" ? "fontlar paketin içinde" : "fonts ship in the package"} */`}
      >
        <YuzOrnegi labels={t.demo} />
      </Demo>
      <P>{t.headings}</P>
      <Note>{t.numbers}</Note>
      <Demo
        ipucu={t.ipucu.nums}
        labels={dict.demo}
        align="start"
        code={`<span className="tabular-nums">…</span>
<span className="font-mono">…</span>`}
      >
        <RakamOrnegi labels={t.demo} />
      </Demo>

      <H2>{t.upper}</H2>
      <P>{t.upperP}</P>
      <Demo
        ipucu={t.ipucu.upper}
        labels={dict.demo}
        align="start"
        code={`/* ${t.demo.wrong} */
text-transform: uppercase;
letter-spacing: .08em;`}
      >
        <BuyukHarfOrnegi labels={t.demo} />
      </Demo>

      <H2>{t.enforce}</H2>
      <P>{t.enforceP}</P>
      <Demo
        ipucu={t.ipucu.enforce}
        labels={dict.demo}
        align="start"
        code={t.demo.gate.map((g) => `${g[0]} ${g[1]}  ${g[2]}`).join("\n")}
      >
        <KapiOrnegi labels={t.demo} />
      </Demo>

      <Note>
        {t.tokensNote} <Xref to="tokens">{t.tokensLink}</Xref> ·{" "}
        <Xref to="measure">{t.measureLink}</Xref>
      </Note>
    </>
  );
}
