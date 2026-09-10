import { DataTableDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("sort-header")!.title[lang] };
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
        Bir <code>&lt;th&gt;</code>, tıklanabilir hâli. Yönü çağırandan alır, kendi
        state&apos;ini tutmaz, çünkü sıralamanın sunucuda mı istemcide mi yapıldığı ürünün
        kararı.
      </>
    ),
    arrow: (
      <>
        Yön oku <strong>yalnız sıralı sütunda</strong> görünür. Her başlıkta soluk bir ok
        göstermek, hangisinin etkin olduğunu okunmaz hâle getirir, ve bir tabloda &quot;neye göre
        sıralı&quot; sorusu, sıralamanın kendisinden daha sık sorulur.
      </>
    ),
    noEngine: (
      <>
        <strong>Kit bir tablo MOTORU göndermiyor.</strong> Bir tabloya veri verdiğin an, o bileşen
        veri katmanı hakkında karar vermeye başlar: sıralama sunucuda mı istemcide mi, sayfa
        URL&apos;de mi state&apos;te mi. Bunlar ürün kararlarıdır. Kit motorun{" "}
        <em>eksik olan parçalarını</em> gönderiyor: <Xref to="table">Table</Xref> ·{" "}
        <Xref to="sort-header">Sort header</Xref> ·{" "}
        <Xref to="selection-bar">Selection bar</Xref> ·{" "}
        <Xref to="pagination">Pagination</Xref>. Hiçbiri veri görmez.
      </>
    ),
    align: (
      <>
        <code>align</code> başlığın hizası: <code>left</code> (varsayılan) metin sütunları için,
        <code>right</code> sayı sütunları için; sayılar sağdan hizalandığında basamaklar alt alta
        gelir ve büyüklük göz kararı okunur.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
  },
  en: {
    lead: (
      <>
        A <code>&lt;th&gt;</code>, made clickable. It takes the direction from the caller and keeps
        no state of its own, because whether sorting happens on the server or the client is the
        product&apos;s decision.
      </>
    ),
    arrow: (
      <>
        The arrow appears <strong>only on the sorted column</strong>. A faint arrow on every header
        makes it unreadable which one is active, and in a table, &quot;sorted by what&quot; is
        asked more often than sorting itself.
      </>
    ),
    noEngine: (
      <>
        <strong>The kit does not ship a table ENGINE.</strong> The moment you hand a table your
        data, that component starts deciding things about the data layer: server or client
        sorting, page in the URL or in state. Those are product decisions. The kit ships the{" "}
        <em>missing pieces</em> of the engine: <Xref to="table">Table</Xref> ·{" "}
        <Xref to="sort-header">Sort header</Xref> ·{" "}
        <Xref to="selection-bar">Selection bar</Xref> ·{" "}
        <Xref to="pagination">Pagination</Xref>. None of them sees data.
      </>
    ),
    align: (
      <>
        <code>align</code> is the header's alignment: <code>left</code> (the default) for text
        columns, <code>right</code> for number columns; right-aligned digits line up by place
        value, so magnitude reads at a glance.
      </>
    ),
    rules: "Rules",
    related: "Related",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("sort-header")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<Table>
  <thead><tr>
    <th>…</th>
    <SortHeader direction={dir} onSort={setDir} align="right">…</SortHeader>
  </tr></thead>
</Table>`}>
        <DataTableDemo lang={lang} />
      </Demo>
      <P>{t.arrow}</P>

      <P>{t.align}</P>

      <H2>{t.rules}</H2>
      <Note>{t.noEngine}</Note>

      <H2>Props</H2>
      <Props of="SortHeader" lang={lang} />
    </>
  );
}
