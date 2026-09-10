import { PaginationDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("pagination")!.title[lang] };
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
        Sayfalayıcının zor kısmı görünüşü değil <strong>aritmetiği</strong>: kaç sayfa var, hangi
        numaralar gösterilir, kısaltma nereye konur. 200 sayfalık bir listede 200 düğme anlamsız;
        pencere her zaman ilk, son ve aktif olanın komşularını gösterir.
      </>
    ),
    window: (
      <>
        Pencere <strong>sabit genişlikte</strong>: sayfa değiştikçe düğmeler yerinden oynamaz.
        Oynasaydı &quot;sonraki&quot;ye iki kez üst üste basmak imkânsız olurdu. Ve{" "}
        <code>total</code> opsiyonel: imleç tabanlı sayfalamada numaralar gizlenir, ileri/geri
        kalır.
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
    rules: "Kurallar",
    related: "İlgili",
  },
  en: {
    lead: (
      <>
        The hard part of a paginator is not how it looks but its <strong>arithmetic</strong>: how
        many pages there are, which numbers to show, where the ellipsis goes. Two hundred buttons
        for a two-hundred-page list is meaningless; the window always shows the first, the last
        and the neighbours of the current one.
      </>
    ),
    window: (
      <>
        The window is <strong>fixed width</strong>: the buttons do not move as the page changes.
        If they did, pressing &quot;next&quot; twice in a row would be impossible. And{" "}
        <code>total</code> is optional, with cursor-based paging the numbers hide and only
        forward/back remain.
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
    rules: "Rules",
    related: "Related",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("pagination")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<Pagination
  page={page}
  pageSize={25}
  total={240}
  onChange={setPage}
  labels={{ previous: "…", next: "…", page: (n) => \`…\`, summary: (f, t, tot) => \`…\` }}
/>`}>
        <PaginationDemo lang={lang} />
      </Demo>
      <P>{t.window}</P>

      <H2>{t.rules}</H2>
      <Note>{t.noEngine}</Note>

      <H2>Props</H2>
      <Props of="Pagination" lang={lang} />
    </>
  );
}
