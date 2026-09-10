import { Breadcrumb } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("breadcrumb")!.title[lang] };
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
    products: "Ürünler",
    records: "Plaklar",
    lastItem: (
      <>
        Son öğe <code>href</code> almaz: zaten oradasın, ve bulunduğun sayfaya link vermek
        gezinmeyi değil kafa karışıklığını üretir.
      </>
    ),
    rules: "Kurallar",
    label: (
      <>
        <code>label</code> zorunlu: ekran okuyucu bu listeyi &quot;gezinme&quot; olarak
        duyurabilsin diye. Adsız bir <code>&lt;nav&gt;</code> sayfadaki öteki gezinmelerden
        ayırt edilemez.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Bir sayfanın içindeki bölümler arasında geçiş için <Xref to="tabs">Tabs</Xref>; bölüm
        başlıkları için <Xref to="section-head">Section head</Xref>.
      </>
    ),
  },
  en: {
    products: "Products",
    records: "Records",
    lastItem: (
      <>
        The last item takes no <code>href</code>: you are already there, and linking to the page
        you are on produces confusion, not navigation.
      </>
    ),
    rules: "Rules",
    label: (
      <>
        <code>label</code> is required so a screen reader can announce this list as
        &quot;navigation&quot;. An unnamed <code>&lt;nav&gt;</code> cannot be told apart from the
        other navigations on the page.
      </>
    ),
    related: "Related",
    rel: (
      <>
        To move between sections inside one page, <Xref to="tabs">Tabs</Xref>; for section
        headings, <Xref to="section-head">Section head</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("breadcrumb")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} align="start" code={`<Breadcrumb
  label="…"
  items={[
    { label: "${t.products}", href: "/products" },
    { label: "${t.records}", href: "/products/records" },
    { label: "Blue Train" },
  ]}
/>`}>
        <Breadcrumb
          label={t.products}
          items={[
            { label: t.products, href: "/products" },
            { label: t.records, href: "/products/records" },
            { label: "Blue Train" },
          ]}
        />
      </Demo>
      <P>{t.lastItem}</P>

      <H2>{t.rules}</H2>
      <Note>{t.label}</Note>

      <H2>Props</H2>
      <Props of="Breadcrumb" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
