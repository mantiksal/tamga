import { Kbd } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("kbd")!.title[lang] };
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
    lead: "Basılacak tuş.",
    save: "kaydet",
    search: "ara",
    semantic: (
      <>
        <code>&lt;kbd&gt;</code> kullanılıyor, <code>&lt;span&gt;</code> değil: bir ekran okuyucu
        için &quot;Ctrl&quot; ile &quot;bir tuşa basılacak&quot; arasındaki fark bu elemanda
        yaşıyor.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Kopyalanacak bir komut için <Xref to="code">Code</Xref>; kısa bir etiket için{" "}
        <Xref to="label">Label</Xref>.
      </>
    ),
  },
  en: {
    lead: "The key to press.",
    save: "save",
    search: "search",
    semantic: (
      <>
        <code>&lt;kbd&gt;</code> is used, not <code>&lt;span&gt;</code>: for a screen reader, the
        difference between &quot;Ctrl&quot; and &quot;a key to be pressed&quot; lives in this
        element.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        For a command to copy, <Xref to="code">Code</Xref>; for a short label,{" "}
        <Xref to="label">Label</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("kbd")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} code={`<Kbd>⌘</Kbd> <Kbd>S</Kbd>`}>
        <span className="flex items-center gap-2 text-[length:var(--docs-small)] text-ink-soft">
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
          <span className="ml-1">{t.save}</span>
        </span>
        <span className="ml-6 flex items-center gap-2 text-[length:var(--docs-small)] text-ink-soft">
          <Kbd>/</Kbd>
          <span className="ml-1">{t.search}</span>
        </span>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.semantic}</Note>

      <H2>Props</H2>
      <Props of="Kbd" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
