import {
  KapiOrnegi,
  KenarOrnegi,
  RitimOrnegi,
  YaricapOrnegi,
  YarimOrnegi,
  YuvarlakOrnegi,
} from "./ornek";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { sayfaMeta } from "@/content/meta";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return sayfaMeta("measure", lang);
}

/**
 * Ölçünün gerekçesi: yarıçap, ritim, satır ve kontrol yükseklikleri, kenarlık.
 *
 * Değerlerin tam listesi Token'lar sayfasında; burada yalnız neden o değer.
 */
const T = {
  tr: {
    save: "Kaydet",
    search: "Ara",
    live: "Yayında",
    tokensLink: "Token'lar",
    physicsLink: "Fizik",

    demo: {
      search: "Ara",
      save: "Kaydet",
      live: "Yayında",
      knob: "--radius",
      roles: ["çip, segment içi", "girdi, küçük düğme", "düğme, uyarı", "kart", "içerik kutusu, çekmece"],
      right: "böyle",
      wrong: "böyle değil",
      draft: "Taslak",
      name: "Ayşe Demir",
      roundOk: "Avatar, canlı nokta ve çip: üçü de kendi rol yarıçapında.",
      roundNo: "Hap rozet ve hap çip: ikinci bir yarıçap ailesi.",
      rows: [
        ["#10482", "Ayşe Demir", "₺1.249"],
        ["#10481", "Mert Aksoy", "₺489"],
        ["#10480", "Zeynep Kaya", "₺2.310"],
        ["#10479", "Can Öztürk", "₺349"],
      ] as const,
      showGrid: "8px ızgarayı göster",
      view: "Görünüm",
      segA: "Liste",
      segB: "Kart",
      ritimRows: [
        ["Liste satırı", "--row"],
        ["Liste satırı", "--row"],
        ["Sık satır", "--row-sm"],
        ["Sık satır", "--row-sm"],
      ] as const,
      ritimTags: [
        ["--gutter", "oluk, her şeyin başladığı çizgi"],
        ["--row", "liste satırı"],
        ["--row-sm", "sık satır"],
        ["--control", "her kontrol"],
      ] as const,
      halfOk: "1px · 8px",
      halfNo: "0.5px · 7.5px · 13px",
      gateTitle: "check:scale · check:css (örnek çıktı)",
      gate: [
        ["✗", "src/order-card.tsx:14", "padding: 13px → ölçü skalada yok, bir token kullan"],
        ["✗", "src/badge.tsx:8", "border-radius: 999px → tam yuvarlak yalnız radio, skor halkası ve halka spinner'da"],
        ["✗", "kit.css:212", "border-width: 0.5px → yarım piksel yok"],
        ["✓", "293 sınıf", "temiz"],
      ] as const,
    },
    ipucu: {
      radius: "Düğmeyi kaydır: beş rol yarıçapı tek değerden türüyor.",
      round: "Avatar, canlı nokta, çip: üçü de köşeli.",
      border: "Aynı tablo, iki kenar kalınlığı.",
      rhythm: "Izgarayı aç: kontroller aynı yükseklikte, satırlar 8px çizgisinde.",
      half: "Yarım piksel ekranda bulanık basar.",
      enforce: "Kapı ham ölçüyü bulunca build durur.",
    },

    whatFor: "Bu sayfa ne işe yarıyor",
    whatForP: (
      <>
        <strong>Bir ölçü yazmadan önce buraya bakılır.</strong> Kitte keyfi piksel yok: bir yarıçap,
        bir yükseklik ya da bir boşluk her zaman bir token'dan geliyor. &laquo;Burası biraz dar
        duruyor&raquo; diye 13 piksel yazmak, skalayı bitiren tek hamledir.
      </>
    ),

    radius: "İki yarıçap, tek düğme",
    radiusP: (
      <>
        Yalnız iki yarıçap var ve ikisi <em>role</em> göre okunuyor, boyuta göre değil:{" "}
        <strong>kontrol</strong> (düğme, girdi, çip, segment) ve <strong>yüzey</strong> (kart,
        katman, panel). Çağrı yeri &laquo;4 piksel&raquo; demiyor, &laquo;ben bir kontrolüm&raquo;
        diyor.
      </>
    ),
    radiusKnob: (
      <>
        <strong>Arkalarında tek bir düğme var.</strong> Kök yarıçap değişince ikisi de onunla
        kayıyor, çünkü ötekiler ondan <code>calc</code> ile türüyor. &laquo;Ürün biraz daha yumuşak
        olsun&raquo; tek satırlık bir düzenleme olarak kalmalı, on ayrı dosyada aranan bir sayı
        olarak değil.
      </>
    ),
    radiusFull: (
      <>
        <strong>
          Tam yuvarlak üç şeye ayrıldı: tekli seçim, skor halkası ve halka spinner.
        </strong>{" "}
        Avatar da canlı nokta da köşeli; hap şeklinde rozet yok, hap şeklinde çip yok. Bir rozeti hap yapmak onu ikinci bir yarıçap ailesi hâline
        getiriyor, ve iki aile bir gün üç olur.
      </>
    ),

    border: "Kenarlık: her zaman görünür, her zaman 1 piksel",
    borderP: (
      <>
        Tek kalınlık, tek renk. <strong>İkinci bir kenar kalınlığı yok.</strong> Vurgu gölgeden
        gelir, kalın kenarlıktan değil; klasik neobrutalizmin 3 piksellik kenarları alınmadı, ve
        sebebi ölçülebilir: bilgi yoğun bir tabloda her satırı kalınlaştırmak okunurluğu bitiriyor.
      </>
    ),

    rhythm: "8 piksel ritmi ve sabit yükseklikler",
    rhythmP: (
      <>
        Bir oluk değeri var ve <strong>her başlık, etiket, satır ve hücre o çizgide başlıyor</strong>
        . Liste satırının bir yüksekliği var, yoğun satırın ayrı bir yüksekliği, ve her kontrolün
        tek bir yüksekliği. Bunlar yan yana duran bileşenlerin kendiliğinden hizalanmasını
        sağlıyor: bir düğme bir girdinin yanına konduğunda ikisi de aynı yüksekliktedir, çünkü
        ikisi de aynı token'ı okuyor.
      </>
    ),
    rhythmHalf: (
      <>
        <strong>Yarım piksel yok.</strong> Hiçbir ekranda temiz basmıyor, ve kimse onu bilerek
        seçmiyor: yarım pikseller her zaman &laquo;12 ile 14 arası bir yer&raquo; arayan bir elin
        izidir.
      </>
    ),

    enforce: "Zorlama",
    enforceP: (
      <>
        Bu sayfadaki kuralların hepsi bir kapıyla korunuyor: skala denetimi ham ölçüleri, CSS
        denetimi de kitin kendi sınıflarını tarıyor. Zorlaması olmayan bir ölçü kuralı, ilk yoğun
        haftada sessizce çürüyen bir kuraldır.
      </>
    ),

    tokensNote: (
      <>
        Yarıçapların, olukların ve yüksekliklerin <strong>tam listesi ve değerleri</strong> Token'lar
        sayfasında, kaynaktan üretiliyor.
      </>
    ),
  },
  en: {
    save: "Save",
    search: "Search",
    live: "Live",
    tokensLink: "Tokens",
    physicsLink: "Physics",

    demo: {
      search: "Search",
      save: "Save",
      live: "Live",
      knob: "--radius",
      roles: ["chip, segment item", "input, small button", "button, alert", "card", "content box, drawer"],
      right: "this",
      wrong: "not this",
      draft: "Draft",
      name: "Ayşe Demir",
      roundOk: "Avatar, live dot and chip: each on its own role radius.",
      roundNo: "A pill badge and a pill chip: a second radius family.",
      rows: [
        ["#10482", "Ayşe Demir", "₺1,249"],
        ["#10481", "Mert Aksoy", "₺489"],
        ["#10480", "Zeynep Kaya", "₺2,310"],
        ["#10479", "Can Öztürk", "₺349"],
      ] as const,
      showGrid: "Show the 8px grid",
      view: "View",
      segA: "List",
      segB: "Card",
      ritimRows: [
        ["List row", "--row"],
        ["List row", "--row"],
        ["Dense row", "--row-sm"],
        ["Dense row", "--row-sm"],
      ] as const,
      ritimTags: [
        ["--gutter", "the gutter, the line everything starts on"],
        ["--row", "list row"],
        ["--row-sm", "dense row"],
        ["--control", "every control"],
      ] as const,
      halfOk: "1px · 8px",
      halfNo: "0.5px · 7.5px · 13px",
      gateTitle: "check:scale · check:css (example output)",
      gate: [
        ["✗", "src/order-card.tsx:14", "padding: 13px → not on the scale, use a token"],
        ["✗", "src/badge.tsx:8", "border-radius: 999px → fully round is only for the radio, the score ring and the ring spinner"],
        ["✗", "kit.css:212", "border-width: 0.5px → no half pixels"],
        ["✓", "293 classes", "clean"],
      ] as const,
    },
    ipucu: {
      radius: "Move the knob: five role radii derive from one value.",
      round: "Avatar, live dot, chip: all three keep their corners.",
      border: "The same table, two border weights.",
      rhythm: "Turn the grid on: controls share one height, rows sit on the 8px line.",
      half: "A half pixel prints blurry on screen.",
      enforce: "When the gate finds a raw measurement, the build stops.",
    },

    whatFor: "What this page is for",
    whatForP: (
      <>
        <strong>Read this before writing a measurement.</strong> The kit has no arbitrary pixels: a
        radius, a height or a gap always comes from a token. Writing 13px because &ldquo;this looks
        a bit tight&rdquo; is the single move that ends a scale.
      </>
    ),

    radius: "Two radii, one knob",
    radiusP: (
      <>
        There are only two radii and both are read by <em>role</em>, never by size:{" "}
        <strong>control</strong> (button, input, chip, segment) and <strong>surface</strong> (card,
        overlay, panel). A call site does not say &ldquo;4px&rdquo;, it says &ldquo;I am a
        control&rdquo;.
      </>
    ),
    radiusKnob: (
      <>
        <strong>One knob sits behind them.</strong> Change the root radius and both move with it,
        because the others derive from it with <code>calc</code>. &ldquo;Make the product a little
        softer&rdquo; has to stay a one-line edit, not a number hunted across ten files.
      </>
    ),
    radiusFull: (
      <>
        <strong>
          Fully round is reserved for three things: the radio, the score ring and the ring spinner.
        </strong>{" "}
        The avatar and the live dot keep their corners too; no pill-shaped badges, no pill-shaped
        chips. Making a badge a pill turns it into a second
        radius family, and two families eventually become three.
      </>
    ),

    border: "Borders: always visible, always 1px",
    borderP: (
      <>
        One thickness, one colour. <strong>There is no second border weight.</strong> Emphasis comes
        from the shadow, not from a thicker edge; classic neobrutalism&rsquo;s 3px borders were not
        taken, and the reason is measurable: in a dense table, thickening every row destroys
        readability.
      </>
    ),

    rhythm: "An 8px rhythm and fixed heights",
    rhythmP: (
      <>
        There is one gutter value and{" "}
        <strong>every heading, label, row and cell starts on that line</strong>. A list row has a
        height, a dense row has its own, and every control has a single height. That is what makes
        neighbouring components line up by themselves: put a button next to an input and they match,
        because both read the same token.
      </>
    ),
    rhythmHalf: (
      <>
        <strong>No half pixels.</strong> They do not print cleanly on any screen and nobody chooses
        them deliberately: a half pixel is always the fingerprint of a hand looking for
        &ldquo;somewhere between 12 and 14&rdquo;.
      </>
    ),

    enforce: "Enforcement",
    enforceP: (
      <>
        Every rule on this page is held by a gate: the scale check scans for raw measurements, the
        CSS check scans the kit&rsquo;s own classes. A measurement rule without enforcement is a
        rule that quietly rots in the first busy week.
      </>
    ),

    tokensNote: (
      <>
        The <strong>full list of radii, gutters and heights, with their values</strong>, is on the
        Tokens page, generated from source.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("measure")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <H2>{t.whatFor}</H2>
      <P>{t.whatForP}</P>

      <H2>{t.radius}</H2>
      <P>{t.radiusP}</P>
      {/* AYNI EKRANDA BEŞ YARIÇAP, VE HEPSİ TEK DEĞERDEN: kural yan yana
          konunca bir cümleden hızlı okunuyor · kontrol keskin, yüzey bir
          kademe yumuşak, ve ikisi birlikte kayıyor. */}
      <Demo
        ipucu={t.ipucu.radius}
        labels={dict.demo}
        align="start"
        code={`<Card>
  <CardBody>
    <Input placeholder="${t.search}" />
    <Button variant="primary">${t.save}</Button>
  </CardBody>
</Card>

:root { --radius: 6px; }
--radius-chip:  calc(var(--radius) - 2px);
--radius-ctl:   var(--radius);
--radius-btn:   calc(var(--radius) + 1px);
--radius-card:  calc(var(--radius) + 2px);
--radius-panel: calc(var(--radius) + 4px);`}
      >
        <YaricapOrnegi labels={t.demo} />
      </Demo>
      <P>{t.radiusKnob}</P>
      <Demo
        ipucu={t.ipucu.round}
        labels={dict.demo}
        align="start"
        code={`--radius-full   /* ${lang === "tr" ? "yalnız radio, skor halkası ve halka spinner" : "the radio, the score ring and the ring spinner only"} */`}
      >
        <YuvarlakOrnegi labels={t.demo} />
      </Demo>
      <Note>{t.radiusFull}</Note>

      <H2>{t.border}</H2>
      <P>{t.borderP}</P>
      <Demo
        ipucu={t.ipucu.border}
        labels={dict.demo}
        align="start"
        code={`--color-edge   /* ${lang === "tr" ? "tek çizgi rengi" : "the single rule colour"} */`}
      >
        <KenarOrnegi labels={t.demo} />
      </Demo>

      <H2>{t.rhythm}</H2>
      <P>{t.rhythmP}</P>
      <Demo
        ipucu={t.ipucu.rhythm}
        labels={dict.demo}
        align="start"
        code={`--gutter
--row
--row-sm
--control`}
      >
        <RitimOrnegi labels={t.demo} />
      </Demo>
      <P>{t.rhythmHalf}</P>
      <Demo
        ipucu={t.ipucu.half}
        labels={dict.demo}
        align="start"
        code={`/* ${t.demo.wrong} */
border-width: 0.5px;
margin-top: 7.5px;`}
      >
        <YarimOrnegi labels={t.demo} />
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
        <Xref to="physics">{t.physicsLink}</Xref>
      </Note>
    </>
  );
}
