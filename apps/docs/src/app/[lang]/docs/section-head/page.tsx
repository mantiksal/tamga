import { SectionHead, Button } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("section-head")!.title[lang] };
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
    orders: "Son siparişler",
    ordersMeta: "24 kayıt",
    stock: "Stok",
    edit: "Düzenle",
    right: (
      <>
        Eylem her zaman <strong>sağa yaslı</strong>, başlığın kendi taban çizgisinde; üründeki her
        satır kontrolünü orada tutar, ve başka yere koyan bir başlık listeden kopmuş görünür.{" "}
        <code>mono</code> tanımlayıcı biçimli meta metinleri (kodlar, SKU&apos;lar) için.
      </>
    ),
    rules: "Kurallar",
    notCardHead: (
      <>
        Bir <Xref to="card">Card</Xref>&apos;ın İÇİNDEki başlık bu değil; o{" "}
        <code>CardHead</code>. Bu, kartların ÜSTÜNDE duran bölüm başlığı.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Meta metni için <Xref to="label">Label</Xref>; bölümleri ayırmak için{" "}
        <Xref to="separator">Separator</Xref>.
      </>
    ),
  },
  en: {
    orders: "Recent orders",
    ordersMeta: "24 records",
    stock: "Stock",
    edit: "Edit",
    right: (
      <>
        The action is always <strong>right-aligned</strong>, on the heading&apos;s own baseline;
        every row in the product keeps its control there, and a heading that puts it elsewhere
        looks detached from the list. <code>mono</code> is for identifier-shaped meta text (codes,
        SKUs).
      </>
    ),
    rules: "Rules",
    notCardHead: (
      <>
        This is not the heading INSIDE a <Xref to="card">Card</Xref>; that is{" "}
        <code>CardHead</code>. This is the section heading that sits ABOVE the cards.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For meta text, <Xref to="label">Label</Xref>; to separate sections,{" "}
        <Xref to="separator">Separator</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("section-head")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} align="start" code={`<SectionHead title="${t.orders}" meta="${t.ordersMeta}" />
<SectionHead title="${t.stock}" meta="SKU-4471" mono action={<Button size="sm">${t.edit}</Button>} />`}>
        <div className="flex w-full flex-col gap-8">
          <SectionHead title={t.orders} meta={t.ordersMeta} />
          <SectionHead title={t.stock} meta="SKU-4471" mono action={<Button size="sm">{t.edit}</Button>} />
        </div>
      </Demo>
      <P>{t.right}</P>

      <H2>{t.rules}</H2>
      <Note>{t.notCardHead}</Note>

      <H2>Props</H2>
      <Props of="SectionHead" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
