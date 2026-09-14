import { Button, Card, CardBody, Input, StatusChip } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("measure")!.title[lang] };
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
        <strong>Tam yuvarlak iki şeye ayrıldı: avatar ve canlı nokta.</strong> Hap şeklinde rozet
        yok, hap şeklinde çip yok. Bir rozeti hap yapmak onu ikinci bir yarıçap ailesi hâline
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
        <strong>Fully round is reserved for two things: the avatar and the live dot.</strong> No
        pill-shaped badges, no pill-shaped chips. Making a badge a pill turns it into a second
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
      {/* AYNI EKRANDA İKİ YARIÇAP: kural yan yana konunca bir cümleden hızlı
          okunuyor — kontrol keskin, yüzey bir kademe yumuşak. */}
      <Demo
        labels={dict.demo}
        code={`<Card>
  <CardBody>
    <Input placeholder="${t.search}" />
    <Button variant="primary">${t.save}</Button>
  </CardBody>
</Card>`}
      >
        <Card className="w-full max-w-100">
          <CardBody className="flex flex-wrap items-center gap-3">
            <Input placeholder={t.search} />
            <Button variant="primary">{t.save}</Button>
            <StatusChip label={t.live} state="positive" dot />
          </CardBody>
        </Card>
      </Demo>
      <P>{t.radiusKnob}</P>
      <Note>{t.radiusFull}</Note>

      <H2>{t.border}</H2>
      <P>{t.borderP}</P>

      <H2>{t.rhythm}</H2>
      <P>{t.rhythmP}</P>
      <P>{t.rhythmHalf}</P>

      <H2>{t.enforce}</H2>
      <P>{t.enforceP}</P>

      <Note>
        {t.tokensNote} <Xref to="tokens">{t.tokensLink}</Xref> ·{" "}
        <Xref to="physics">{t.physicsLink}</Xref>
      </Note>
    </>
  );
}
