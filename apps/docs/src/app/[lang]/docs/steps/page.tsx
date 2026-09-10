import { StepsDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("steps")!.title[lang] };
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
        Üründe bir sihirbaz şablonu vardı ve <strong>adım göstergesi yoktu</strong>, yani
        kullanıcı kaçıncı adımda olduğunu ve kaç adım kaldığını bilmiyordu. Bir sihirbazın varlık
        sebebi tam olarak budur.
      </>
    ),
    ol: (
      <>
        <code>&lt;ol&gt;</code> kullanılıyor: adımlar <strong>sıralı</strong> ve sıra bilgi
        taşıyor. Ekran okuyucu &quot;3 öğeli liste, öğe 2&quot; der;{" "}
        <code>&lt;div&gt;</code>&apos;lerle bu bilgi kaybolur.
      </>
    ),
    three: (
      <>
        Tamamlanan adım bir onay işareti, aktif olan aksan kenarı, gelecek olan sönük. Üç durum üç
        ayrı görsel dil, çünkü &quot;neredeyim&quot; ve &quot;ne kaldı&quot; ayrı iki soru.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Yüzde biliniyorsa <Xref to="progress">Progress</Xref>; sekmeler arası geçiş için{" "}
        <Xref to="tabs">Tabs</Xref>, ama sekmeler bir SIRA taşımaz.
      </>
    ),
  },
  en: {
    lead: (
      <>
        The product had a wizard template and <strong>no step indicator</strong>, so the user did
        not know which step they were on or how many were left. That is precisely why a wizard
        exists.
      </>
    ),
    ol: (
      <>
        <code>&lt;ol&gt;</code> is used: the steps are <strong>ordered</strong> and the order
        carries information. A screen reader says &quot;list of 3 items, item 2&quot;; with{" "}
        <code>&lt;div&gt;</code>s that information is gone.
      </>
    ),
    three: (
      <>
        A completed step gets a check, the active one an accent edge, an upcoming one stays faint.
        Three states, three visual languages, because &quot;where am I&quot; and &quot;what is
        left&quot; are two different questions.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        If you know the percentage, <Xref to="progress">Progress</Xref>; to move between panels,{" "}
        <Xref to="tabs">Tabs</Xref>, but tabs carry no ORDER.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("steps")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<Steps steps={["…", "…", "…"]} current={1} />`}>
        <div className="w-full">
          <StepsDemo lang={lang} />
        </div>
      </Demo>
      <P>{t.three}</P>

      <H2>{t.rules}</H2>
      <Note>{t.ol}</Note>

      <H2>Props</H2>
      <Props of="Steps" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
