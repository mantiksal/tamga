import { SwitchDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("switch")!.title[lang] };
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
      <Demo labels={dict.demo} code={`<Switch on={on} onChange={setOn} label="…" />`}>
        <SwitchDemo lang={lang} />
      </Demo>
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
