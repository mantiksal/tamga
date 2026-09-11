import type { Locale } from "@/i18n/config";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

/**
 * Sayfa metni, iki dilli. Gerekçe `docs/07-dokuman-sitesi.md`de: bir doküman
 * paragrafını JSON anahtarına çevirmek onu okunamaz yapıyor, ve asıl risk
 * çeviri değil AYRIŞMA.
 */
const T = {
  tr: {
    lead: "Her panelin bir görünüm ayarı oluyor, ve bu ekran kitin içinde geliyor.",
    nedenH: "Neden tek bir ekran, beş parça değil",
    nedenP: (
      <>
        Bu ekran iki üründe ayrı ayrı kuruldu, ve ikincisinde kit bir hex girdisi ile bir
        anahtardan başka bir şey vermediği için çıplak çıktı: renk kutuları yok, tema kelimeydi,
        logo alanı yoktu. Parçaları verip &ldquo;kendin diz&rdquo; demek bunu çözmezdi; her ürün
        başka türlü dizer ve ayrışma geri gelir. Şablon katmanı tam olarak bunun için var
        (ADR-0004).
      </>
    ),
    saklaH: "Hiçbir şey saklamıyor",
    saklaP: (
      <>
        <code>value</code> giriyor, <code>onChange</code> çıkıyor, <code>onSave</code> çağıranın.
        Tercihin nerede yaşadığı (oturum, hesap, tarayıcı) bir ÜRÜN kararı, ve onu öğrenen bir
        şablon şablon olmaktan çıkıyor. Paleti uygulamak da burada değil: seçilen rengi{" "}
        <Xref to="tokens">token</Xref>&apos;a çeviren <code>makePalette</code> ve{" "}
        <code>paletteVars</code>, ve bunu ne zaman yapacağına ürün karar veriyor çünkü kök eleman
        onun.
      </>
    ),
    parcaH: "Parçalar ayrı ayrı da alınabiliyor",
    parcaP: (
      <>
        Ekranın beş bloğu var ama dördü tek başına da kullanılabiliyor:{" "}
        <code>ColorSwatches</code>, <code>ThemeCards</code>, <code>ImageField</code> ve{" "}
        <code>SquarePicker</code>. Bir ürünün ayarları farklıysa şablonu hiç almayıp parçaları
        dizmesi meşru; yasak olan şablonu alıp kromunu değiştirmek.
      </>
    ),
    temaH: "Tema üç kelime değil üç resim",
    temaP: (
      <>
        &ldquo;Açık · Koyu · Sistem&rdquo; üç kelimeydi, ve bir tema kelimeyle seçilmiyor:
        kullanıcı sonucu görmek istiyor. Her seçenek panelin minyatürünü çiziyor ve
        &ldquo;Sistem&rdquo; ikisini tek karede yan yana gösteriyor, çünkü anlamı tam olarak bu.
        Minyatürler kitin tek SABİT RENK istisnası: seçenekler o an yürürlükteki temayı değil
        seçilirse ne olacağını gösteriyor, token kullanılsaydı üçü de aynı görünürdü.
      </>
    ),
    amblemN: (
      <>
        <strong>Yüklenen bir logodan amblem otomatik çıkarılamaz.</strong> Bir görsel dosyasında
        &ldquo;amblem&rdquo; diye işaretli bir şey yok, konumu sabit değil (solda, üstte, yazının
        içinde ya da hiç yok), ve yanlış kesim sessiz. Yarım bir harf panelin her sayfasının sol
        üstünde durur ve kimse bunun otomatik kesildiğini bilmez. <code>SquarePicker</code> kesimi
        İNSANA yaptırıyor: kare bir çerçeve, sürükleniyor ve boyutlanıyor. Amblem hiç
        yüklenmezse <Xref to="logo-tile">LogoTile</Xref> baş harften bir karo üretiyor, ve bu
        çalışan bir cevap.
      </>
    ),
    propsH: "Props",
  },
  en: {
    lead: "Every panel grows an appearance setting, and this one ships inside the kit.",
    nedenH: "Why one screen and not five parts",
    nedenP: (
      <>
        This screen was built twice in two products, and the second came out bare because the kit
        offered nothing but a hex input and a switch: no colour squares, the theme was a word,
        there was no logo field. Handing over the parts and saying &ldquo;arrange them
        yourself&rdquo; would not have fixed it; each product arranges them differently and they
        drift apart again. The pattern layer exists for exactly this (ADR-0004).
      </>
    ),
    saklaH: "It stores nothing",
    saklaP: (
      <>
        <code>value</code> comes in, <code>onChange</code> goes out, <code>onSave</code> belongs
        to the caller. Where the preference lives (session, account, browser) is a PRODUCT
        decision, and a template that learns it stops being a template. Applying the palette is
        not here either: turning the chosen colour into <Xref to="tokens">tokens</Xref> is{" "}
        <code>makePalette</code> plus <code>paletteVars</code>, and the product decides when that
        happens because the root element is its own.
      </>
    ),
    parcaH: "The parts can be taken on their own",
    parcaP: (
      <>
        The screen has five blocks, but four of them work alone: <code>ColorSwatches</code>,{" "}
        <code>ThemeCards</code>, <code>ImageField</code> and <code>SquarePicker</code>. If a
        product's settings are different, not taking the template and arranging the parts is
        legitimate; what is not allowed is taking the template and changing its chrome.
      </>
    ),
    temaH: "A theme is three pictures, not three words",
    temaP: (
      <>
        &ldquo;Light · Dark · System&rdquo; were three words, and a theme is not chosen with
        words: the person wants to see the result. Each option draws a miniature of the panel, and
        &ldquo;System&rdquo; shows both halves in one frame because that is exactly what it means.
        The miniatures are the kit's one HARDCODED COLOUR exception: the options show what the
        panel would look like if chosen, not the theme currently in force, and with tokens all
        three would look the same.
      </>
    ),
    amblemN: (
      <>
        <strong>A mark cannot be extracted from an uploaded logo.</strong> Nothing in an image
        file is marked as &ldquo;the mark&rdquo;, its position is not fixed (left, on top, inside
        the wordmark, or absent), and a wrong crop is silent. Half a letter then sits in the top
        left of every page and nobody knows it was cropped automatically.{" "}
        <code>SquarePicker</code> gives the cut to a HUMAN: a square frame, dragged and resized.
        With no mark at all, <Xref to="logo-tile">LogoTile</Xref> draws a tile from the initial,
        and that is a working answer.
      </>
    ),
    propsH: "Props",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("appearance")!.title[lang] };
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const p = findPage("appearance")!;
  const t = T[lang];

  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>

      <H2>{t.nedenH}</H2>
      <P>{t.nedenP}</P>

      <H2>{t.saklaH}</H2>
      <P>{t.saklaP}</P>

      <H2>{t.temaH}</H2>
      <P>{t.temaP}</P>
      <Note>{t.amblemN}</Note>

      <H2>{t.parcaH}</H2>
      <P>{t.parcaP}</P>

      <H2>{t.propsH}</H2>
      {(["AppearanceTemplate", "ColorSwatches", "ThemeCards", "ImageField", "SquarePicker"] as const).map(
        (ad) => (
          <div key={ad} className="mt-8">
            <h3 className="text-subhead font-semibold text-ink">{ad}</h3>
            <Props of={ad} lang={lang} />
          </div>
        ),
      )}
    </>
  );
}
