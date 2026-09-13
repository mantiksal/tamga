import type { Locale } from "@/i18n/config";
import { PageHead, H2, H3, P, Note } from "@/components/prose";
import { Xref } from "@/components/xref";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("new-panel")!.title[lang] };
}

/**
 * "Yeni bir müşteriye panel kurarken neyi değiştiriyoruz."
 *
 * BU SAYFA UYDURULMADI, gerçek bir kurulumdan çıkarıldı: bir müşteri panelinin
 * `src/brand/brand.css` dosyası. Oradaki blok gerçekten çalışıyor, ölçüldü, ve
 *
 * MÜŞTERİNİN ADI GEÇMİYOR, ve geçmemeli: depo public, ve bir kurulumun
 * dersini anlatmak için o kurulumun kimin olduğunu söylemek gerekmiyor.
 * Öğretici olan ÖLÇÜM, ad değil.
 * bir hatayı da içinde taşıyor (markanın resmi kırmızısı dolgu olamadı).
 * Bir kurulum kılavuzunun en değerli kısmı o hatadır; hiç kimse "renkleri
 * değiştir" cümlesinden bir şey öğrenmiyor.
 */

const BLOK = `/* src/brand/brand.css */

:root {
  --color-accent:        #e02938;  /* yüz: üstünde yazı var, AA geçmeli */
  --color-accent-hover:  #c9242f;  /* ışıkta KOYULAŞIR */
  --color-accent-active: #b0202c;
  --color-accent-ink:    #fdfcfa;  /* yüzün üstündeki yazı */
  --color-accent-line:   #9c1a25;  /* bağlantı, odak halkası */
  --color-accent-bg:     #fbeaec;  /* seçili satır yıkaması */
  --color-accent-shadow: #5c0d12;  /* yüzün üstünde durduğu taban */
}

.dark {
  /* Nötrler: kitin koyusu lacivert. Kırmızı bir markanın yanında o zemin
     ikinci bir marka gibi durur, o yüzden tonu markaya çevrildi. Her
     nötrün OKLCH PARLAKLIĞI kitteki değerin aynısı; değişen tek şey ton. */
  --color-page:      #1c100f;
  --color-shell:     #241615;
  --color-hover:     #31201f;
  --color-line:      #3f2b29;
  --color-edge:      #523d3b;
  --color-ink-faint: #9e9392;
  --color-ink-soft:  #dad4d3;
  --color-ink:       #f1eeee;

  /* Aksan koyuda TERSİNE döner: yüz parlaklaşır, mürekkep koyulaşır. */
  --color-accent:        #ef7772;
  --color-accent-hover:  #f6908a;
  --color-accent-active: #e06965;
  --color-accent-ink:    #52090e;
  --color-accent-line:   #ea8b85;
  --color-accent-bg:     #4e0b0f;
  --color-accent-shadow: #71312f;
}`;

const T = {
  tr: {
    lead: (
      <>
        Bir müşteriye panel kurmak, kitin dosyalarına dokunmak değil: kendi CSS girişinde bir
        marka bloğu yazmak. Bu sayfa o bloğun ne kadar olduğunu söylüyor, ve içindeki asıl bilgi
        şu: <strong>çoğu şeye dokunmuyorsun.</strong>
      </>
    ),
    ayarH: "Her panelin bir Ayarlar alanı olur",
    ayarP: (
      <>
        Bu bir öneri değil bir <strong>kural</strong>: kurulumda sorulan her şey, üçüncü ayda da
        değiştirilebilir olmalı. Bir müşteri rengini değiştirmek istediğinde cevap &ldquo;bir
        geliştirici CSS yazıp yeniden yayın alacak&rdquo; ise, o şey aslında yapılandırılabilir
        değildir: sabit yazılmıştır, ve öyle olduğu ilk talepte anlaşılır.
      </>
    ),
    ayarN: (
      <>
        <strong>Panelin ayarı ile ürünün ayarı ayrı yerlerde.</strong> &ldquo;Kargo limiti&rdquo;
        mağazanın ayarı; &ldquo;marka rengi&rdquo; panelin kendisi. İkisini aynı listeye koymak, iki
        farklı şeyi aynı yerde aratıyor. Şekli <Xref to="templates">SettingsTemplate</Xref> veriyor,
        bölümleri ürün.
      </>
    ),
    ayarListe: [
      ["Marka rengi", "Tek renk. Palet, iki tema ve zemin ondan üretiliyor."],
      ["Tema", "Açık · koyu · sistem. Üçüncüsü işletim sistemini dinliyor."],
      ["Kenar çubuğu", "Hep dar · hep geniş · kullanıcı seçsin."],
      ["Marka varlıkları", "Logo ve amblem. Dar ray amblemi, geniş ray logoyu gösteriyor."],
    ],
    paletH: "Tek renkten palet",
    paletP: (
      <>
        <code>tamga-ui/palette</code> bir marka renginden iki temanın tamamını üretiyor: yüz, taban,
        yüzün mürekkebi, bağlantı, seçili satır zemini ve <strong>nötrler</strong>. Nötrler markanın
        tonunu çok düşük doyumla taşıyor, yani gri kalıyorlar ama markanın grisi oluyorlar.
      </>
    ),
    paletN: (
      <>
        <strong>Eşikler tahmin değil arama.</strong> Her renk bir formülle değil, hedef orana
        ulaşana kadar ölçülerek bulunuyor; bir tonun beyaz mürekkebi hangi açıklıkta taşıdığı tona
        göre değişiyor. Sarı bir markanın yüzü sarı kalıyor ve mürekkebi koyuya dönüyor; koyulaşıp
        kahverengi olmuyor. Sonuç <code>measurePalette()</code> ile ölçülebiliyor, ve ölçüm{" "}
        <Xref to="theme">Tema</Xref> sayfasındaki kapıyla aynı eşikleri kullanıyor.
      </>
    ),
    ucH: "Üç küme",
    uc: [
      [
        "Değiştir",
        "Yedi aksan token'ı, iki temada. Logo. İstersen yazı ailesi.",
        "Markanın gerçekten ayrıştığı yer burası. On beş satır, iki blok.",
      ],
      [
        "İsteğe bağlı",
        "Koyu temanın nötrleri, sayfa zemininin sıcaklığı, yarıçaplar, grafik paleti.",
        "Aksan nötrlerden uzaksa nötrler ikinci bir marka gibi durmaya başlıyor. Yarıçap bir şekil dili kararı: keskin mi yumuşak mı.",
      ],
      [
        "Dokunma",
        "Sınıf adları, hareket (süre ve eğri), durum renkleri, boşluk ve satır ölçüleri.",
        "Hareket kitin imzası. Durum renkleri marka değil ANLAM taşıyor: kırmızı her panelde aynı şeyi demeli, yoksa on panel on ayrı dil konuşur.",
      ],
    ],
    blokH: "Bir markanın tamamı",
    blokP: (
      <>
        Aşağıdaki blok uydurma değil, çalışan bir müşteri panelinin{" "}
        <code>brand.css</code>&apos;i. Kendi markanda değişecek olan yalnız değerler.
      </>
    ),
    dersH: "Markanın resmi rengi dolgu olamayabilir",
    dersP: (
      <>
        Bu kurulumun en pahalı dersi. Müşterinin resmi kırmızısı <code>#f93140</code>, ve
        üstünde beyaz yazının kontrastı <strong>3.70</strong>. AA sınırı 4.5. Yani o renk bir
        buton dolgusu olarak <strong>yazı taşıyamıyor</strong>. Kıyas için kitin kendi mavisi
        5.22&apos;de.
      </>
    ),
    dersP2: (
      <>
        Çözüm rengi değiştirmek değil, <strong>ailenin içinden bir basamak aşağı inmek</strong>:{" "}
        <code>#e02938</code> zaten markanın kendi hover rengi, göze aynı kırmızı, beyaz yazıyla
        4.51. Ham <code>#f93140</code> de kaybolmuyor, üstünde yazı olmayan yere gidiyor: logo ve
        ince işaretler. Bunun için panelin kendi token&apos;ı var (
        <code>--marka-ham-kirmizi</code> gibi), çünkü kit onu bilmez.
      </>
    ),
    dersN: (
      <>
        Bu ölçüm elle yapılmıştı ve doğru çıktı; artık <code>check-token-contrast</code> aynı
        soruyu her koşuda soruyor. Kendi paletini yazdıktan sonra o kapıyı kendi deponda koştur:
        eşikler <Xref to="theme">Tema</Xref>&apos;da, adların tam listesi{" "}
        <Xref to="tokens">Token&apos;lar</Xref>&apos;da.
      </>
    ),
    logoH: "Logo koyu zeminde",
    logoP: (
      <>
        Kolayca atlanan yer. O panelin logosunun bir yarısı gri (
        <code>#7f7f7f</code>) ve koyu zeminde kontrastı 3.0&apos;a düşüyor, yani okunmuyor. Koyu
        için ayrı bir logo varlığı yoksa bir parlaklık filtresi yamalıyor; ama bu bir çözüm değil
        bir yama, ve müşteriden açık zemin için bir logo istemek doğrusu.
      </>
    ),
  },
  en: {
    lead: (
      <>
        Setting a panel up for a customer does not mean touching the kit&apos;s files: it means
        writing one brand block in your own CSS entry. This page says how large that block is,
        and the real information in it is this: <strong>most things you do not touch.</strong>
      </>
    ),
    ayarH: "Every panel has a Settings area",
    ayarP: (
      <>
        This is a <strong>rule</strong> rather than a suggestion: everything asked at setup must
        still be changeable in month three. If a customer wants to change their colour and the
        answer is &ldquo;a developer will write CSS and ship a release&rdquo;, then the thing was
        never configurable: it was hard-coded, and the first request is when everyone finds out.
      </>
    ),
    ayarN: (
      <>
        <strong>The panel&apos;s settings and the product&apos;s settings live apart.</strong>
        &ldquo;Shipping threshold&rdquo; belongs to the store; &ldquo;brand colour&rdquo; belongs to
        the panel itself. Putting them in one list makes people search for two different things in
        the same place. <Xref to="templates">SettingsTemplate</Xref> gives the shape; the product
        gives the sections.
      </>
    ),
    ayarListe: [
      ["Brand colour", "One colour. The palette, both themes and the grounds come from it."],
      ["Theme", "Light · dark · system. The third one listens to the operating system."],
      ["Sidebar", "Always narrow · always wide · let the user choose."],
      ["Brand assets", "Logo and mark. A narrow rail shows the mark, a wide one the logo."],
    ],
    paletH: "A palette from one colour",
    paletP: (
      <>
        <code>tamga-ui/palette</code> builds both themes from a single brand colour: the face, its
        base, the ink on it, links, the selected-row ground and the <strong>neutrals</strong>. The
        neutrals carry the brand&apos;s hue at very low chroma, so they stay grey while being the
        brand&apos;s grey.
      </>
    ),
    paletN: (
      <>
        <strong>Thresholds are searched, not guessed.</strong> Every colour is found by measuring
        until it meets its target rather than by a formula, because the lightness at which a hue can
        carry white ink depends on the hue. A yellow brand keeps a yellow face and flips its ink to
        dark; it does not darken into brown. The result can be measured with{" "}
        <code>measurePalette()</code>, against the same thresholds as the gate on the{" "}
        <Xref to="theme">Theme</Xref> page.
      </>
    ),
    ucH: "Three sets",
    uc: [
      [
        "Change",
        "Seven accent tokens, in both themes. The logo. The type family if you want one.",
        "This is where a brand actually differs. Fifteen lines, two blocks.",
      ],
      [
        "Optional",
        "The dark theme's neutrals, the warmth of the page ground, the radii, the chart palette.",
        "When the accent sits far from the neutrals, the neutrals start reading as a second brand. Radius is a shape-language decision: sharp or soft.",
      ],
      [
        "Never",
        "Class names, motion (durations and curves), status colours, spacing and row measures.",
        "Motion is the kit's signature. Status colours carry MEANING, not brand: red must mean the same thing on every panel, or ten panels speak ten languages.",
      ],
    ],
    blokH: "A whole brand",
    blokP: (
      <>
        The block below is not invented, it comes from a working customer panel:{" "}
        <code>brand.css</code>. On your own brand only the values change.
      </>
    ),
    dersH: "A brand's official colour may not be able to be a fill",
    dersP: (
      <>
        The most expensive lesson from that setup. The customer&apos;s official red is{" "}
        <code>#f93140</code>, and white text on it measures <strong>3.70</strong>. The AA floor
        is 4.5. That colour <strong>cannot carry text</strong> as a button fill. For comparison,
        the kit&apos;s own blue sits at 5.22.
      </>
    ),
    dersP2: (
      <>
        The fix is not a different colour, it is{" "}
        <strong>one step down inside the same family</strong>: <code>#e02938</code> is already
        the brand&apos;s own hover red, reads as the same red, and carries white text at 4.51.
        The raw <code>#f93140</code> is not lost either, it moves to where no text sits on it:
        the logo and fine marks. The panel keeps its own token for that (
        <code>--marka-ham-kirmizi</code>), because the kit does not know about it.
      </>
    ),
    dersN: (
      <>
        That measurement was made by hand and it was right; <code>check-token-contrast</code> now
        asks the same question on every run. After writing your own palette, run that gate in
        your own repo: the thresholds are in <Xref to="theme">Theme</Xref>, the full list of names
        in <Xref to="tokens">Tokens</Xref>.
      </>
    ),
    logoH: "The logo on a dark ground",
    logoP: (
      <>
        The easily missed one. Half of that panel&apos;s logo is grey (
        <code>#7f7f7f</code>) and drops to 3.0 on a dark ground, which is unreadable. With no
        separate dark asset a brightness filter patches it, but that is a patch rather than a
        fix, and asking the customer for a light-ground logo is the right answer.
      </>
    ),
  },
};

/**
 * TABLO DEĞİL, LİSTE. Üç sütunlu bir tablo olarak yazılmıştı ve üçüncü sütun
 * ekranın dışında kaldı: kitin tablosunun 720px'lik bir taban genişliği var
 * (--table-min) ve doküman sütunu ondan dar, yani tablo yatay kaydırıyordu.
 * Okurun "neden" sütununu görmek için kaydırması gereken bir tablo, o sütunu
 * hiç yazmamakla aynı kapıya çıkıyor.
 */
function Kumeler({ rows }: { rows: string[][] }) {
  return (
    <ol className="tamga-prose my-4 flex list-none flex-col gap-4 p-0">
      {rows.map(([kume, ne, neden]) => (
        <li key={kume} className="flex flex-col gap-1 border-l-2 border-[var(--color-edge)] pl-4">
          <span className="text-small font-semibold uppercase tracking-wide text-ink-faint">
            {kume}
          </span>
          <span className="text-ink">{ne}</span>
          <span className="text-ink-soft">{neden}</span>
        </li>
      ))}
    </ol>
  );
}

const PALET = `import { makePalette, paletteCss } from "tamga-ui/palette";

const { light, dark } = makePalette("#7c3aed");

// derleme zamanında: CSS olarak yaz
paletteCss({ light, dark });   // :root { … }  .dark { … }

// çalışma zamanında: köke yaz, panel anında döner
for (const [alan, deger] of Object.entries(light)) {
  document.documentElement.style.setProperty(AD[alan], deger);
}`;

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const p = findPage("new-panel")!;
  const t = T[lang];

  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>

      <H2>{t.ucH}</H2>
      <Kumeler rows={t.uc} />

      <H2>{t.ayarH}</H2>
      <P>{t.ayarP}</P>
      <Kumeler rows={t.ayarListe} />
      <Note>{t.ayarN}</Note>

      <H2>{t.paletH}</H2>
      <P>{t.paletP}</P>
      <pre className="docs-code my-4">{PALET}</pre>
      <Note>{t.paletN}</Note>

      <H2>{t.blokH}</H2>
      <P>{t.blokP}</P>
      <pre className="docs-code my-4">{BLOK}</pre>

      <H2>{t.dersH}</H2>
      <P>{t.dersP}</P>
      <P>{t.dersP2}</P>
      <Note>{t.dersN}</Note>

      <H3>{t.logoH}</H3>
      <P>{t.logoP}</P>
    </>
  );
}
