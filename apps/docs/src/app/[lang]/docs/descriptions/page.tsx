import { Descriptions, StatusChip } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("descriptions")!.title[lang] };
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
    lead: "Detay sayfalarının omurgası: sipariş bilgisi, müşteri kartı, kayıt ayrıntısı.",
    order: "Sipariş",
    date: "Tarih",
    state: "Durum",
    shipped: "Kargoda",
    total: "Tutar",
    addr: "Adres",
    addrValue: "Moda Cad. 14/3, Kadıköy, İstanbul",
    dl: (
      <>
        <strong><code>&lt;dl&gt;</code> kullanılıyor</strong> ve bu görsel değil{" "}
        <em>anlamsal</em> bir seçim: bir ekran okuyucu <code>&lt;dl&gt;</code> içinde &quot;üç
        terim&quot; der ve her terimi tanımıyla birlikte okur. Aynı şeyi{" "}
        <code>&lt;div&gt;</code>&apos;lerle çizmek görüntüyü verir, ilişkiyi vermez, ve gören biri
        için apaçık olan &quot;bu değer bu etikete ait&quot; bağı, görmeyen biri için hiç
        kurulmaz.
      </>
    ),
    breakpoint: (
      <>
        Dar ekranda alt alta, geniş ekranda iki sütun. Kırılma noktası bileşenin{" "}
        <strong>içinde</strong>: çağıranın hatırlaması gereken bir kural olarak bırakılırsa,
        unutulduğu her yerde uzun bir değer etiketin üstüne biner.
      </>
    ),
    mono: (
      <>
        <code>mono</code> tanımlayıcı biçimli değerler için: sipariş numarası, SKU, IP. Onlar
        okunmaz, eşleştirilir.
      </>
    ),
    layout: (
      <>
        <code>layout</code> iki genişlik veriyor. Varsayılan <code>wide</code>, terim sütunu 14rem:
        bir <em>sayfa</em> genişliğinde doğru oran. <code>compact</code> ise 8rem ve bir{" "}
        <em>kartın içi</em> için: yarım genişlikte bir kartta 14rem terim sütunu değeri kartın
        ucuna itiyor, ve &quot;Banka / Kredi Kartı&quot; gibi normal bir değer üç satıra iniyor.
        Sonradan eklendi, çünkü aynı sorun üç ayrı yerde tekrarladı ve her çağıran onu{" "}
        <code>className</code> ile eziyordu; ezilen bir varsayılan, varsayılan değildir.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Tek bir sayıyı büyük göstermek için <Xref to="kpi">Kpi</Xref>; sütunlu veri için{" "}
        <Xref to="table">Table</Xref>.
      </>
    ),
  },
  en: {
    lead: "The backbone of detail pages: order information, a customer card, a record's detail.",
    order: "Order",
    date: "Date",
    state: "Status",
    shipped: "Shipping",
    total: "Total",
    addr: "Address",
    addrValue: "14 Moda Ave, Apt 3, Kadıköy, İstanbul",
    dl: (
      <>
        <strong><code>&lt;dl&gt;</code> is used</strong> and that is a <em>semantic</em> choice,
        not a visual one: inside a <code>&lt;dl&gt;</code> a screen reader says &quot;three
        terms&quot; and reads each term with its definition. Drawing the same thing with{" "}
        <code>&lt;div&gt;</code>s gives the picture but not the relation, and the link
        &quot;this value belongs to this label&quot;, obvious to someone who sees it, is never
        made for someone who does not.
      </>
    ),
    breakpoint: (
      <>
        Stacked on a narrow screen, two columns on a wide one. The breakpoint lives{" "}
        <strong>inside</strong> the component: left as a rule the caller has to remember, a long
        value rides over its label everywhere it is forgotten.
      </>
    ),
    layout: (
      <>
        <code>layout</code> gives two widths. The default <code>wide</code> uses a 14rem term
        column, which is the right proportion at <em>page</em> width. <code>compact</code> uses
        8rem and is for the inside of a <em>card</em>: in a half-width card a 14rem term column
        pushes the value to the far edge, and an ordinary value like &quot;Banka / Kredi
        Kartı&quot; wraps to three lines. It was added later, because the same problem recurred in
        three places and every caller was overriding the default with <code>className</code>; a
        default that gets overridden is not a default.
      </>
    ),
    mono: (
      <>
        <code>mono</code> is for identifier-shaped values: an order number, a SKU, an IP. Those
        are not read, they are matched.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        To show one number large, <Xref to="kpi">Kpi</Xref>; for columnar data,{" "}
        <Xref to="table">Table</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("descriptions")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<Descriptions
  items={[
    { term: "${t.order}", value: "ORD-4471", mono: true },
    { term: "${t.state}", value: <StatusChip label="${t.shipped}" state="caution" dot /> },
  ]}
/>`}>
        <div className="w-full">
          <Descriptions
            items={[
              { term: t.order, value: "ORD-4471", mono: true },
              { term: t.date, value: "15.04.2026", mono: true },
              { term: t.state, value: <StatusChip label={t.shipped} state="caution" dot /> },
              { term: t.total, value: "1.249,90 ₺", mono: true },
              { term: t.addr, value: t.addrValue },
            ]}
          />
        </div>
      </Demo>
      <P>{t.mono}</P>

      <H2>{t.rules}</H2>
      <Note>{t.dl}</Note>
      <Note>{t.breakpoint}</Note>

      <H2>Props</H2>
      <Props of="Descriptions" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
