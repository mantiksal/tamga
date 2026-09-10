import { SaysBubble } from "tamga-ui";
/* Vitrin için basit bir yer tutucu çizim: kit "ne çizildiğini" sormaz. */
const box = ({ size }: { size: number; float: boolean }) => (
  <span
    aria-hidden
    className="tamga-card flex items-center justify-center font-mono text-caption text-ink-faint"
    style={{ width: size * 0.7, height: size * 0.7 }}
  >
    art
  </span>
);
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("says-bubble")!.title[lang] };
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
    lead: (
      <>
        Çizimin bir cümle söylemesi gerektiğinde. Balon kitin sisteminin içindedir: 1px kenar +
        2px sert offset, tıpkı yükselen her nesne gibi; piksel sanatın katı bir arayüzün içinde
        kaybolmadan durmasını sağlayan şey bu eşleşme.
      </>
    ),
    line: "Burada henüz bir şey yok.",
    one: "Tek kısa cümle: balon bir ses, paragraf değil.",
    rules: "Kurallar",
    own: (
      <>
        <strong>Kendi çizimini takmak</strong>: <code>art</code> bir render fonksiyonu, yani
        maskot da fotoğraf da olabilir:
      </>
    ),
    slot: (
      <>
        Yeni bir çizim bir prop&apos;a mal olur. Yeni bir <strong>slot</strong> ise bir tasarım
        kararıdır ve gerekçe ister; sistemin klip-art&apos;a dönüşmesini engelleyen çizgi bu.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Boş bir yüzey için <Xref to="empty-state">Empty state</Xref>; boş bir satır için{" "}
        <Xref to="empty-note">Empty note</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        For when the drawing has to say a line. The bubble sits inside the kit&apos;s system: a 1px
        edge plus a 2px hard offset, like every object that lifts; that match is what lets pixel
        art sit inside a strict interface without dissolving.
      </>
    ),
    line: "There is nothing here yet.",
    one: "One short line: a bubble is a voice, not a paragraph.",
    rules: "Rules",
    own: (
      <>
        <strong>Using your own drawing</strong>: <code>art</code> is a render function, so it can
        be a mascot or a photograph:
      </>
    ),
    slot: (
      <>
        A new drawing costs one prop. A new <strong>slot</strong> is a design decision and needs a
        reason; that line is what stops the system turning into clip art.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For an empty surface, <Xref to="empty-state">Empty state</Xref>; for an empty row,{" "}
        <Xref to="empty-note">Empty note</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("says-bubble")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} code={`<SaysBubble art={myArt} size={132}>${t.line}</SaysBubble>`}>
        <SaysBubble art={box} size={120}>
          {t.line}
        </SaysBubble>
      </Demo>
      <P>{t.one}</P>

      <H2>{t.rules}</H2>
      <Note>{t.own}</Note>
      <pre className="docs-code my-4">{`import type { Art } from "tamga-ui";

const mascot = (name: string): Art =>
  function Mascot({ size }) {
    return <img src={\`/mascot/\${name}.png\`} height={size} alt="" aria-hidden />;
  };

<SaysBubble art={mascot("fish")}>…</SaysBubble>`}</pre>
      <P>{t.slot}</P>

      <H2>Props</H2>
      <Props of="SaysBubble" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
