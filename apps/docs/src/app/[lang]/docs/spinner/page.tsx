import { Spinner } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("spinner")!.title[lang] };
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
    loading: "Yükleniyor",
    bars: (
      <>
        Dönen bir halka değil, <strong>yürüyen üç çubuk</strong>; bu kitte hiçbir şey dönmez.
      </>
    ),
    ucBicim: (
      <>
        Beş biçim, beş yer: <code>bars</code> üç dikme · bir <strong>düğmenin içine</strong>
        sığan satır içi hâli ve varsayılan, çünkü bu kitte bekleme çoğunlukla bir kontrolün
        içinde oluyor ve orada dönen bir çember yabancı bir nesne. <code>dots</code> sırayla
        yanıp sönen üç eş kare, bir <strong>metin satırının</strong> yanına. <code>pixels</code>{" "}
        markanın kendi 3×3 ızgarası, köşegen boyunca nabızla · ilk verisini bekleyen bir{" "}
        <strong>panel</strong> için. <code>ring</code> alışıldık çember, bütün bir{" "}
        <strong>ekran</strong> için. <code>square</code> kendi ekseninde dönen yükselmiş bir
        kutu · gölgesi de onunla dönüyor, ve bu yüzden görüntüyü sahipleniyor.
      </>
    ),
    satirIci: (
      <>
        Satır içinde: spinner metnin <strong>yanında</strong> durur, önünde değil · cümle
        okunmaya devam ediyor.
      </>
    ),
    yukleniyor: "Siparişler yükleniyor…",
    rules: "Kurallar",
    label: (
      <>
        <code>label</code> zorunlu: sesli okuyucuya &quot;bekleniyor&quot; diyen tek şey o. Dönen
        bir şeyin ekran okuyucuda karşılığı yoktur.
      </>
    ),
    related: "İlgili",
    three: (
      <>
        Üçü farklı soruya cevap veriyor: <Xref to="skeleton">Skeleton</Xref> &quot;ne
        geleceğini&quot;, <Xref to="spinner">Spinner</Xref> &quot;bir şeyin sürdüğünü&quot;,{" "}
        <Xref to="progress">Progress</Xref> &quot;ne kadar kaldığını&quot; söyler.
      </>
    ),
  },
  en: {
    loading: "Loading",
    bars: (
      <>
        Not a spinning ring but <strong>three walking bars</strong>; nothing in this kit spins.
      </>
    ),
    ucBicim: (
      <>
        Five looks, five places: <code>bars</code>, three uprights · the inline one that fits{" "}
        <strong>inside a control</strong>, and the default, because in this kit most waiting
        happens inside one and a spinning circle is a foreign object there. <code>dots</code> is
        three equal squares blinking in turn, for the side of a <strong>line of text</strong>.{" "}
        <code>pixels</code> is the mark&apos;s own 3×3 grid pulsing along the diagonal, for a{" "}
        <strong>panel</strong> waiting on its first data. <code>ring</code> is the familiar
        circle, for a whole <strong>screen</strong>. <code>square</code> is a raised box turning
        on its own axis, shadow and all, which is how it owns the view.
      </>
    ),
    satirIci: (
      <>
        Inline, the spinner sits <strong>beside</strong> the text rather than in front of it, so
        the sentence still reads.
      </>
    ),
    yukleniyor: "Loading orders…",
    rules: "Rules",
    label: (
      <>
        <code>label</code> is required: it is the only thing that says &quot;waiting&quot; to a
        screen reader. A spinning shape has no equivalent in speech.
      </>
    ),
    related: "Related",
    three: (
      <>
        The three answer different questions: <Xref to="skeleton">Skeleton</Xref> says what is
        coming, <Xref to="spinner">Spinner</Xref> says something is taking time, and{" "}
        <Xref to="progress">Progress</Xref> says how much is left.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("spinner")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} code={`<Spinner label="${t.loading}" />
<Spinner look="dots" size={40} label="${t.loading}" />
<Spinner look="pixels" size={32} label="${t.loading}" />
<Spinner look="ring" size={40} label="${t.loading}" />
<Spinner look="square" size={32} label="${t.loading}" />`}>
        <span className="flex flex-col items-center gap-2.5">
          <Spinner size={32} label={t.loading} />
          <span className="text-caption font-bold text-ink-faint">bars</span>
        </span>
        <span className="flex flex-col items-center gap-2.5 text-accent">
          <Spinner look="dots" size={40} label={t.loading} />
          <span className="text-caption font-bold text-ink-faint">dots</span>
        </span>
        <span className="flex flex-col items-center gap-2.5 text-accent">
          <Spinner look="pixels" size={32} label={t.loading} />
          <span className="text-caption font-bold text-ink-faint">pixels</span>
        </span>
        <span className="flex flex-col items-center gap-2.5">
          <Spinner look="ring" size={40} label={t.loading} />
          <span className="text-caption font-bold text-ink-faint">ring</span>
        </span>
        <span className="flex flex-col items-center gap-2.5">
          <Spinner look="square" size={32} label={t.loading} />
          <span className="text-caption font-bold text-ink-faint">square</span>
        </span>
      </Demo>
      <P>{t.ucBicim}</P>

      <Demo
        labels={dict.demo}
        code={`<span className="flex items-center gap-2.5">
  <Spinner look="ring" size={16} label="${t.loading}" />
  ${t.yukleniyor}
</span>`}
      >
        <span className="text-body text-ink-soft flex items-center gap-2.5 font-semibold">
          <Spinner look="ring" size={16} label={t.loading} />
          {t.yukleniyor}
        </span>
      </Demo>
      <P>{t.satirIci}</P>
      <P>{t.bars}</P>

      <H2>{t.rules}</H2>
      <Note>{t.label}</Note>

      <H2>Props</H2>
      <Props of="Spinner" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.three}</P>
    </>
  );
}
