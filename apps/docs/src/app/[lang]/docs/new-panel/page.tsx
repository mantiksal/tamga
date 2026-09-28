import { AyarlarDemosu, KontrastKartlari, LogoKartlari, UcKume } from "./ornek";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { CodeBlock } from "@/components/kod";
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
    demo: {
      baslik: "Ayarlar · Görünüm",
      kapsam: "panel",
      varliklar: "Marka varlıkları",
      varliklarNot:
        "Logo geniş rayda, amblem dar rayda görünüyor. Birini yükle, aşağıdaki önizleme onu okuyor.",
      logo: {
        name: "Logo",
        upload: "Logo yükle",
        replace: "Değiştir",
        remove: "Kaldır",
        empty: "Henüz logo yok",
        errorType: "Yalnız PNG, JPG ya da SVG.",
        errorSize: "Dosya çok büyük.",
        errorUnreadable: "Dosya okunamadı.",
      },
      amblem: {
        name: "Amblem",
        upload: "Amblem yükle",
        replace: "Değiştir",
        remove: "Kaldır",
        empty: "Henüz amblem yok",
        errorType: "Yalnız PNG, JPG ya da SVG.",
        errorSize: "Dosya çok büyük.",
        errorUnreadable: "Dosya okunamadı.",
      },
      renk: "Marka rengi",
      renkNot: "Tek renk. Paletin iki temadaki otuz token'ı bundan üretiliyor.",
      kutular: [
        { hex: "#1e4fd8", label: "Tamga mavisi" },
        { hex: "#0f766e", label: "Zümrüt" },
        { hex: "#9e2a3a", label: "Bordo" },
        { hex: "#b45309", label: "Kehribar" },
        { hex: "#5b21b6", label: "Mor" },
        { hex: "#0a1f3d", label: "Lacivert" },
      ] as const,
      ozelRenk: "Kendi rengim",
      ozelAd: "Özel renk",
      tema: "Tema",
      temaNot: "Panelin açılış teması.",
      acik: "Açık",
      koyu: "Koyu",
      sistem: "Sistem",
      acikNot: "Gündüz çalışan ekran",
      koyuNot: "Karanlık odada göz yormuyor",
      sistemNot: "İşletim sistemi ne derse",
      ray: "Kenar çubuğu",
      rayNot: "Menü ne kadar yer kaplasın.",
      rayDar: "Hep dar",
      rayGenis: "Hep geniş",
      raySecsin: "Kullanıcı seçsin",
      rayDarNot: "Yalnız simgeler",
      rayGenisNot: "Simge ve ad",
      raySecsinNot: "Tutamak kullanıcıda",
      markaAdi: "Marka",
      onizleme: "Önizleme",
      ornekBaslik: "Siparişler",
      ornekEylem: "Yeni sipariş",
      ornekBaglanti: "Tümünü gör",
      ornekSatir: ["#4821 · Ayşe Demir", "#4820 · Mert Aksoy", "#4819 · Zeynep Kaya"] as const,
      tokenlar: [
        ["--color-accent", "accent"],
        ["--color-accent-ink", "accentInk"],
        ["--color-accent-line", "accentLine"],
        ["--color-accent-bg", "accentBg"],
        ["--color-page", "page"],
        ["--color-shell", "shell"],
        ["--color-ink", "ink"],
        ["--color-edge", "edge"],
      ] as const,
      paletBaslik: "Üretilen palet",
      paletIpucu:
        "Otuz token, iki tema, tek bir hex'ten. Ürünün değiştirdiği tek şey soldaki renk; gerisini `makePalette` üretiyor, ve kapı da aynı çıktıyı ölçüyor.",
    },
    kontrast: {
      resmi: "Markanın resmi kırmızısı",
      birBasamak: "Bir basamak koyusu",
      kiyas: "Kitin kendi mavisi, kıyas için",
      gecti: "geçer",
      kaldi: "kalır",
      rol: [
        "Dolgu olamıyor: üstünde beyaz yazı AA'nın altında. Çizgi ve işaret olarak kalıyor.",
        "Aynı kırmızı, bir basamak koyu. Düğme dolgusu olabiliyor ve marka tanınıyor.",
        "Kitin varsayılanı. Kıyas için burada, bir hedef olarak değil.",
      ] as const,
    },
    logo: {
      acik: "Açık zemin",
      koyu: "Koyu zemin",
      yama: "Yama",
      acikNot: "Aynı logo, sorun yok.",
      koyuNot: "Gri yarı 3.0'a düşüyor: koyu zeminde okunmuyor.",
      yamaNot: "Parlaklık filtresi okunur yapıyor ama markanın rengini de değiştiriyor. Doğrusu: müşteriden koyu zemin için ikinci bir dosya istemek.",
    },
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
    demo: {
      baslik: "Settings · Appearance",
      kapsam: "panel",
      varliklar: "Brand assets",
      varliklarNot:
        "The logo shows on a wide rail, the mark on a narrow one. Upload either and the preview below reads it.",
      logo: {
        name: "Logo",
        upload: "Upload logo",
        replace: "Replace",
        remove: "Remove",
        empty: "No logo yet",
        errorType: "PNG, JPG or SVG only.",
        errorSize: "The file is too large.",
        errorUnreadable: "The file could not be read.",
      },
      amblem: {
        name: "Mark",
        upload: "Upload mark",
        replace: "Replace",
        remove: "Remove",
        empty: "No mark yet",
        errorType: "PNG, JPG or SVG only.",
        errorSize: "The file is too large.",
        errorUnreadable: "The file could not be read.",
      },
      renk: "Brand colour",
      renkNot: "One colour. The palette's thirty tokens, in two themes, come from it.",
      kutular: [
        { hex: "#1e4fd8", label: "Tamga blue" },
        { hex: "#0f766e", label: "Emerald" },
        { hex: "#9e2a3a", label: "Claret" },
        { hex: "#b45309", label: "Amber" },
        { hex: "#5b21b6", label: "Purple" },
        { hex: "#0a1f3d", label: "Navy" },
      ] as const,
      ozelRenk: "My own colour",
      ozelAd: "Custom colour",
      tema: "Theme",
      temaNot: "The theme the panel opens with.",
      acik: "Light",
      koyu: "Dark",
      sistem: "System",
      acikNot: "A screen that works by day",
      koyuNot: "Easy on the eyes in a dark room",
      sistemNot: "Whatever the operating system says",
      ray: "Sidebar",
      rayNot: "How much room the menu takes.",
      rayDar: "Always narrow",
      rayGenis: "Always wide",
      raySecsin: "Let the user choose",
      rayDarNot: "Icons only",
      rayGenisNot: "Icon and name",
      raySecsinNot: "The handle is the user's",
      markaAdi: "Brand",
      onizleme: "Preview",
      ornekBaslik: "Orders",
      ornekEylem: "New order",
      ornekBaglanti: "See all",
      ornekSatir: ["#4821 · Ayşe Demir", "#4820 · Mert Aksoy", "#4819 · Zeynep Kaya"] as const,
      tokenlar: [
        ["--color-accent", "accent"],
        ["--color-accent-ink", "accentInk"],
        ["--color-accent-line", "accentLine"],
        ["--color-accent-bg", "accentBg"],
        ["--color-page", "page"],
        ["--color-shell", "shell"],
        ["--color-ink", "ink"],
        ["--color-edge", "edge"],
      ] as const,
      paletBaslik: "The generated palette",
      paletIpucu:
        "Thirty tokens, two themes, from one hex. The only thing a product changes is the colour on the left; `makePalette` derives the rest, and the gate measures the same output.",
    },
    kontrast: {
      resmi: "The brand's official red",
      birBasamak: "One step darker",
      kiyas: "The kit's own blue, for comparison",
      gecti: "passes",
      kaldi: "fails",
      rol: [
        "It cannot be a fill: white text on it sits under AA. It stays a line and a mark.",
        "The same red, one step darker. It can carry a button, and the brand is still recognised.",
        "The kit's default. Here for comparison, not as a target.",
      ] as const,
    },
    logo: {
      acik: "Light ground",
      koyu: "Dark ground",
      yama: "The patch",
      acikNot: "The same logo, no problem.",
      koyuNot: "The grey half drops to 3.0: unreadable on a dark ground.",
      yamaNot: "A brightness filter makes it readable but changes the brand's colour too. The right answer: ask the customer for a second file for dark grounds.",
    },
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
  const dict = await getDictionary(lang);
  const p = findPage("new-panel")!;
  const t = T[lang];

  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>

      <H2>{t.ucH}</H2>
      {/* ÜÇ KÜME BİR TABLO DEĞİL ÜÇ KART: tablo 720 piksel taban genişliği
          istiyor ve üçüncü sütun dar ekranda dışarı düşüyordu. */}
      <UcKume rows={t.uc} />

      <H2>{t.ayarH}</H2>
      <P>{t.ayarP}</P>
      {/* DÖRT MADDELİK LİSTE ÇALIŞIR HÂLE GELDİ: bir rengin bütün paneli
          çevirdiği okunmuyor, görülüyor. */}
      <AyarlarDemosu labels={t.demo} />
      <Note>{t.ayarN}</Note>

      <H2>{t.paletH}</H2>
      <P>{t.paletP}</P>
      <CodeBlock code={PALET} file="src/theme/palette.ts" dict={dict} />
      <Note>{t.paletN}</Note>

      <H2>{t.blokH}</H2>
      <P>{t.blokP}</P>
      <CodeBlock code={BLOK} file="src/brand/brand.css" dict={dict} />

      <H2>{t.dersH}</H2>
      <P>{t.dersP}</P>
      <KontrastKartlari labels={t.kontrast} />
      <P>{t.dersP2}</P>
      <Note>{t.dersN}</Note>

      <H3>{t.logoH}</H3>
      <P>{t.logoP}</P>
      <LogoKartlari labels={t.logo} />
    </>
  );
}
