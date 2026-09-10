import { SliderDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("slider")!.title[lang] };
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
    native: (
      <>
        Native <code>&lt;input type=&quot;range&quot;&gt;</code> kullanılıyor ve bu bilinçli:
        klavye desteği, <code>aria-valuenow</code>, dokunmatik sürükleme; hepsi bedava geliyor ve
        elle yazılan her kopyası bunların birini kaçırıyor. Değişen tek şey görünüm.
      </>
    ),
    value: (
      <>
        <strong>Değer her zaman görünür.</strong> Bir kaydırıcı tek başına yalan söyler: kullanıcı
        &quot;yaklaşık üçte iki&quot; görür, &quot;%67&quot; göremez. Eşik ayarlayan biri için o
        fark ayarın kendisidir.
      </>
    ),
    thumb: (
      <>
        <code>appearance: none</code> çubuğu bize bırakıyor ama <strong>topuzu da siliyor</strong>
, ve silinen topuz hata vermiyor, sadece kaydırıcı tutulamaz hâle geliyor. WebKit ve
        Firefox iki ayrı sözde-eleman kullanıyor; ikisi de yazılmak zorunda.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Kesin bir sayı yazdırmak için <Xref to="number-input">Number input</Xref>; açık/kapalı için{" "}
        <Xref to="switch">Switch</Xref>.
      </>
    ),
  },
  en: {
    native: (
      <>
        A native <code>&lt;input type=&quot;range&quot;&gt;</code> is used, deliberately: keyboard
        support, <code>aria-valuenow</code>, touch dragging; all free, and every hand-written
        copy misses one of them. Only the appearance changes.
      </>
    ),
    value: (
      <>
        <strong>The value is always visible.</strong> A slider on its own lies: the user sees
        &quot;about two thirds&quot;, not &quot;67%&quot;. For someone setting a threshold, that
        difference is the setting.
      </>
    ),
    thumb: (
      <>
        <code>appearance: none</code> hands us the track but <strong>also deletes the
        thumb</strong>, and a deleted thumb raises no error, the slider simply cannot be grabbed.
        WebKit and Firefox use two different pseudo-elements; both have to be written.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        To type an exact number, <Xref to="number-input">Number input</Xref>; for on/off,{" "}
        <Xref to="switch">Switch</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("slider")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} align="start" code={`<Slider value={v} onChange={setV} min={0} max={100} suffix="%" label="…" />`}>
        <SliderDemo lang={lang} />
      </Demo>
      <P>{t.value}</P>

      <H2>{t.rules}</H2>
      <Note>{t.native}</Note>
      <Note>{t.thumb}</Note>

      <H2>Props</H2>
      <Props of="Slider" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
