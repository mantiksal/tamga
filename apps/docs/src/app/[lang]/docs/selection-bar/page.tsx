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
  return { title: findPage("selection-bar")!.title[lang] };
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
        Satır seçmenin görünen yarısı: kaç şey seçildi, onlarla ne yapılabilir, ve seçim nasıl
        bırakılır. Yanındaki iki yardımcı, <code>SelectAll</code> ve <code>SelectRow</code>,
        onay kutularını doğru <code>aria</code> bağlarıyla kuran hâlleri.
      </>
    ),
    mixed: (
      <>
        <strong>Baş onay kutusunun üçüncü bir durumu var.</strong> Beş satırın ikisi seçiliyse
        kutu ne işaretli ne boştur. Boş göstermek &quot;hiçbiri seçili değil&quot; der ve
        yalandır; işaretli göstermek &quot;hepsi seçili&quot; der ve daha kötüdür: kullanıcı
        silmeye basar. Standardı <code>aria-checked=&quot;mixed&quot;</code>.
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
        The visible half of selecting rows: how many are selected, what can be done with them, and
        how to let go. The two helpers beside it, <code>SelectAll</code> and{" "}
        <code>SelectRow</code>, are the checkboxes wired up with the right <code>aria</code>{" "}
        bindings.
      </>
    ),
    mixed: (
      <>
        <strong>The header checkbox has a third state.</strong> With two of five rows selected the
        box is neither checked nor empty. Showing it empty says &quot;none selected&quot; and is a
        lie; showing it checked says &quot;all selected&quot; and is worse: the user presses
        delete. The standard for it is <code>aria-checked=&quot;mixed&quot;</code>.
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
  const p = findPage("selection-bar")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<SelectionBar count={sel.length} onClear={clear} labels={{ … }}>
  <Button size="sm">…</Button>
  <Button size="sm" variant="danger">…</Button>
</SelectionBar>

<SelectAll checked={all} indeterminate={some} onChange={…} label="…" />`}>
        <DataTableDemo lang={lang} />
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.mixed}</Note>
      <Note>{t.noEngine}</Note>

      <H2>Props</H2>
      <Props of="SelectionBar" lang={lang} />
      <Props of="SelectAll" lang={lang} />
    </>
  );
}
