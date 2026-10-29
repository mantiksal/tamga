import { SwitchDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { sayfaMeta } from "@/content/meta";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return sayfaMeta("switch", lang);
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
    fill: (
      <>
        Dolgu burada Yasa 2&apos;nin <strong>üçüncü bilinçli istisnası</strong>: akranlar arası bir
        seçim değil, açık/kapalı durumu: dolu iz metaforun kendisidir, bir devrenin kapalı olması
        demektir.
      </>
    ),
    thumb: (
      <>
        <code>label</code> zorunlu, çünkü anahtarın içinde metin yoktur. Topuz{" "}
        <code>data-on</code> geldiğinde kayar; anahtarın açık OLDUĞUNU değil,{" "}
        <strong>AÇILDIĞINI</strong> gösteren şey o hareket.
      </>
    ),
    row: (
      <>
        <strong>Anahtar tek başına neyi açtığını söylemez.</strong> Bir ayar ekranında{" "}
        <code>showLabel</code> verin: <code>label</code> görünür bir soru olur, solda durur ve
        anahtar onu satırın sonunda cevaplar. Soruya tıklamak anahtarı çevirir.{" "}
        <code>description</code> sorunun altındaki sonuç cümlesidir (&quot;Açıkken sayfanın
        başında tema düğmesi görünür&quot;) ve anahtarla birlikte okunur. Bu satırı her ekran
        elle kuruyordu; şimdi anahtarın kendisi. <code>showLabel</code> olmadan anahtar bir
        tablonun ya da bir araç çubuğunun içinde yalnız durur, adı <code>label</code>&apos;dan
        erişilebilir ad olarak gelir. <code>disabled</code> iken soru soluklaşır ve tıklanmaz;
        üstteki örneğin üçüncü satırı öyle.
      </>
    ),
    rules: "Kurallar",
    notChoice: (
      <>
        <strong>İki şey arasında seçim yapıyorsan bu bileşen değil.</strong> &quot;Liste mi pano
        mu&quot;, &quot;aylık mı yıllık mı&quot; akranlar arası bir seçimdir ve{" "}
        <Xref to="segmented">Segmented</Xref>&apos;in işidir. Switch bir şeyin açık mı kapalı mı
        olduğunu söyler; ikinci bir seçenek adı yoktur.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Akranlar arası seçim <Xref to="segmented">Segmented</Xref>; bir listede birden çok değer
        açıp kapatmak <Xref to="checkbox">Checkbox</Xref>.
      </>
    ),
  },
  en: {
    fill: (
      <>
        The fill here is the <strong>third deliberate exception</strong> to Law 2: this is not a
        choice among peers but an on/off state: the filled track <em>is</em> the metaphor, a
        circuit that is closed.
      </>
    ),
    thumb: (
      <>
        <code>label</code> is required, because there is no text inside a switch. The thumb slides
        when <code>data-on</code> arrives; that movement is what shows the switch was{" "}
        <strong>turned on</strong>, not merely that it is on.
      </>
    ),
    row: (
      <>
        <strong>A switch alone does not say what it turns on.</strong> On a settings screen, pass{" "}
        <code>showLabel</code>: <code>label</code> becomes a visible question on the left, and the
        switch answers it at the end of the line. Clicking the question flips the switch.{" "}
        <code>description</code> is the consequence under the question (&quot;When on, a theme
        button shows at the top of the page&quot;) and is read with the switch. Every screen was
        building this row by hand; now it is the switch itself. Without <code>showLabel</code> the
        switch stands alone inside a table or a toolbar, and <code>label</code> is its accessible
        name. With <code>disabled</code> the question fades and takes no click; the third row
        above is like that.
      </>
    ),
    rules: "Rules",
    notChoice: (
      <>
        <strong>If you are choosing between two things, this is not the component.</strong>{" "}
        &quot;List or board&quot;, &quot;monthly or yearly&quot; is a choice among peers and it
        belongs to <Xref to="segmented">Segmented</Xref>. A switch says whether one thing is on or
        off; the off side has no name.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For a choice among peers, <Xref to="segmented">Segmented</Xref>; to turn several values on
        and off in a list, <Xref to="checkbox">Checkbox</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("switch")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} code={`<Switch
  showLabel
  label="…"
  description="…"
  on={on}
  onChange={setOn}
/>`}>
        <SwitchDemo lang={lang} />
      </Demo>
      <P>{t.row}</P>
      <P>{t.fill}</P>
      <P>{t.thumb}</P>

      <H2>{t.rules}</H2>
      <Note>{t.notChoice}</Note>

      <H2>Props</H2>
      <Props of="Switch" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
