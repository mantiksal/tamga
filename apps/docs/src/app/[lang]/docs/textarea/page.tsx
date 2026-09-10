import { Textarea } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("textarea")!.title[lang] };
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
    ph: "Ürün açıklaması",
    same: (
      <>
        <Xref to="input">Input</Xref> ile aynı kenar, aynı odak fiziği, aynı <code>invalid</code>{" "}
        davranışı; tek fark yükseklik.
      </>
    ),
    rules: "Kurallar",
    rows: (
      <>
        <code>rows</code> <strong>başlangıç</strong> yüksekliğidir, tavan değil. Uzun bir metin
        alanı kaydırılır; kesilmez.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Tek satır için <Xref to="input">Input</Xref>; etiket ve hata satırı için{" "}
        <Xref to="field">Field</Xref>.
      </>
    ),
  },
  en: {
    ph: "Product description",
    same: (
      <>
        The same edge, the same focus physics and the same <code>invalid</code> behaviour as{" "}
        <Xref to="input">Input</Xref>; the only difference is height.
      </>
    ),
    rules: "Rules",
    rows: (
      <>
        <code>rows</code> is the <strong>starting</strong> height, not a ceiling. A long body of
        text scrolls; it is never cut off.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For a single line, <Xref to="input">Input</Xref>; for a label and an error line,{" "}
        <Xref to="field">Field</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("textarea")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo
        labels={dict.demo}
        align="start"
        code={`<Textarea rows={4} placeholder="${t.ph}" full />`}
      >
        <div className="w-full max-w-96">
          <Textarea rows={4} placeholder={t.ph} full />
        </div>
      </Demo>
      <P>{t.same}</P>

      <H2>{t.rules}</H2>
      <P>{t.rows}</P>

      <H2>Props</H2>
      <Props of="Textarea" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
