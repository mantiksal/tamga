import { Card, Table, StatusChip, Dot } from "tamga-ui";
import { TabloOrnegi } from "./ornek";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { CellActionsDemo } from "@/components/interactive";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("table")!.title[lang] };
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
    product: "Ürün",
    state: "Durum",
    stock: "Stok",
    inStock: "Stokta",
    low: "Azalıyor",
    out: "Tükendi",
    overflow: (
      <>
        Yatay taşma sarmalayıcısı <strong>bileşenin içinde</strong>: dar bir ekranda taşan bir
        tablo tüm sayfayı yana kaydırır, ve bunu unutmak fark edilmeyen bir hatadır.
      </>
    ),
    cellH: "Hücrenin içinde açılan bir şey varsa",
    cellP: (
      <>
        Kitin hücre kuralı <code>overflow: hidden</code> ve doğrusu da bu: taşan bir metin satırı
        oynatmamalı. Ama aynı kırpma, hücrenin İÇİNDE açılan bir menüyü, ipucunu ya da paneli
        hücre sınırında kesiyor. Kontrol çalışıyor, tıklanıyor, yarısı yok; hata mesajı yok,
        konsol sessiz, ve ilk akla gelen z-index oluyor. Z-index bunu çözmez: hiçbir yığın sırası
        bir <code>overflow</code> kırpmasını aşamaz. <code>CellActions</code> kırpmayı o hücre
        için kapatıyor.
        <br />
        <br />
        <code>align</code> varsayılan olarak <code>&quot;end&quot;</code>, çünkü en sık kullanımı
        satır sonundaki eylem sütunu. <code>&quot;start&quot;</code> ise kırpmayı kapatıp sağa
        yaslamayan hâli: sütunun içeriği bir eylem değil bir okuma olduğunda.
      </>
    ),
    cellN: (
      <>
        <strong>Kendisi bir <code>&lt;td&gt;</code>.</strong> Bir <code>&lt;td&gt;</code>&apos;nin
        içine konursa <code>&lt;td&gt;</code> içinde <code>&lt;td&gt;</code> çıkıyor: geçersiz
        HTML, tarayıcı içtekini dışarı atıyor, ve React hidrasyon hatası veriyor. Bir sarmalayıcı
        değil, hücrenin kendisi. Sütunu bir tablo kabuğu üretiyorsa bileşen yerine{" "}
        <code>tamga-cell-open</code> sınıfını kullan.
      </>
    ),
    rules: "Kurallar",
    tamH: "Seçim, sıralama ve satır eylemi",
    tamP: (
      <>
        Üçü bir arada: baştaki kutu <strong>seçiyor</strong>, başlıklar{" "}
        <strong>sıralıyor</strong>, sondaki düğme satırın kendi eylemi. Seç-hepsini kutusunun
        üçüncü bir hâli var (bazıları seçili) ve tire ile çiziliyor · yarım bir onay işareti,
        yarım bir onay demek. Seçili satır yıkamasını alıyor, ve kaç tanesinin seçili olduğu
        tablonun <strong>altında</strong> yazıyor: seçim satırlarda yapılıyor, sayı onlara yakın
        durmalı.
      </>
    ),
    tSiparis: "SİPARİŞ",
    tMusteri: "MÜŞTERİ",
    tTutar: "TUTAR",
    tDurum: "DURUM",
    tDetay: "Detay",
    tSecTumu: "Tümünü seç",
    tSecilen: ["Sipariş seçilmedi", "1 sipariş seçili", "2 sipariş seçili", "3 sipariş seçili", "4 sipariş seçili", "5 sipariş seçili"],
    tSatirlar: [
      { id: "#TG-10479", ad: "Ayşe Şahin", tutar: 3450, durum: "positive", etiket: "Teslim" },
      { id: "#TG-10482", ad: "Mert Aksoy", tutar: 1840, durum: "neutral", etiket: "Yeni" },
      { id: "#TG-10480", ad: "Burak Demir", tutar: 1290, durum: "info", etiket: "Kargoda" },
      { id: "#TG-10481", ad: "Zeynep Kaya", tutar: 420, durum: "caution", etiket: "Hazırlanıyor" },
      { id: "#TG-10478", ad: "Can Öztürk", tutar: 310, durum: "danger", etiket: "İade" },
    ] as const,
    noEngine: (
      <>
        <strong>Kit bir tablo MOTORU göndermiyor.</strong> Bu bileşen işaretlemeyi ve fiziği
        taşır, veriyi değil: sıralama sunucuda mı istemcide mi, sayfa URL&apos;de mi
        state&apos;te mi, bunlar ürün kararlarıdır.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Sıralama için <Xref to="sort-header">Sort header</Xref> · seçim için{" "}
        <Xref to="selection-bar">Selection bar</Xref> · sayfalama için{" "}
        <Xref to="pagination">Pagination</Xref> · boş gövde için{" "}
        <Xref to="empty-note">Empty note</Xref>.
      </>
    ),
  },
  en: {
    product: "Product",
    state: "Status",
    stock: "Stock",
    inStock: "In stock",
    low: "Running low",
    out: "Out of stock",
    overflow: (
      <>
        The horizontal overflow wrapper lives <strong>inside the component</strong>: on a narrow
        screen a table that overflows drags the whole page sideways, and forgetting it is a defect
        nobody notices.
      </>
    ),
    cellH: "When something opens inside a cell",
    cellP: (
      <>
        The kit&apos;s cell rule is <code>overflow: hidden</code>, and that is correct: an
        overflowing line of text must not move the row. But the same clip cuts a menu, tooltip or
        panel that opens INSIDE the cell at the cell border. The control works, it is clickable,
        half of it is missing; no error, a silent console, and the first guess is z-index. Z-index
        cannot fix it: no stacking order beats an <code>overflow</code> clip.{" "}
        <code>CellActions</code> turns the clip off for that cell.
        <br />
        <br />
        <code>align</code> defaults to <code>&quot;end&quot;</code>, because the common case is an
        action column at the end of the row. <code>&quot;start&quot;</code> unclips without
        right-aligning: for when the column holds a reading rather than an action.
      </>
    ),
    cellN: (
      <>
        <strong>It IS a <code>&lt;td&gt;</code>.</strong> Placed inside a{" "}
        <code>&lt;td&gt;</code> you get <code>&lt;td&gt;</code> inside <code>&lt;td&gt;</code>:
        invalid HTML, the browser hoists the inner one out, and React reports a hydration
        mismatch. It is not a wrapper, it is the cell. When a table shell generates the column,
        use the <code>tamga-cell-open</code> class instead of the component.
      </>
    ),
    rules: "Rules",
    tamH: "Selection, sorting and the row's action",
    tamP: (
      <>
        All three at once: the box at the start <strong>selects</strong>, the headers{" "}
        <strong>sort</strong>, the button at the end is the row's own action. The select-all box
        has a third state (some selected) drawn as a dash · half a checkmark would mean half a
        yes. A selected row takes its wash, and how many are selected is written{" "}
        <strong>below</strong> the table: the selecting happens in the rows, so the count belongs
        near them.
      </>
    ),
    tSiparis: "ORDER",
    tMusteri: "CUSTOMER",
    tTutar: "TOTAL",
    tDurum: "STATUS",
    tDetay: "Details",
    tSecTumu: "Select all",
    tSecilen: ["No orders selected", "1 order selected", "2 orders selected", "3 orders selected", "4 orders selected", "5 orders selected"],
    tSatirlar: [
      { id: "#TG-10479", ad: "Ayşe Şahin", tutar: 3450, durum: "positive", etiket: "Delivered" },
      { id: "#TG-10482", ad: "Mert Aksoy", tutar: 1840, durum: "neutral", etiket: "New" },
      { id: "#TG-10480", ad: "Burak Demir", tutar: 1290, durum: "info", etiket: "Shipping" },
      { id: "#TG-10481", ad: "Zeynep Kaya", tutar: 420, durum: "caution", etiket: "Preparing" },
      { id: "#TG-10478", ad: "Can Öztürk", tutar: 310, durum: "danger", etiket: "Returned" },
    ] as const,
    noEngine: (
      <>
        <strong>The kit does not ship a table ENGINE.</strong> This component carries the markup
        and the physics, not the data: whether sorting happens on the server or the client,
        whether the page lives in the URL or in state, those are product decisions.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For sorting, <Xref to="sort-header">Sort header</Xref>; for selection,{" "}
        <Xref to="selection-bar">Selection bar</Xref>; for paging,{" "}
        <Xref to="pagination">Pagination</Xref>; for an empty body,{" "}
        <Xref to="empty-note">Empty note</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("table")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} align="start" code={`<Table>
  <thead><tr><th>${t.product}</th><th>${t.state}</th><th className="text-right">${t.stock}</th></tr></thead>
  <tbody>…</tbody>
</Table>`}>
        <div className="w-full">
          <Card>
            <Table>
              <thead>
                <tr>
                  <th>{t.product}</th>
                  <th className="w-36">{t.state}</th>
                  <th className="w-24 text-right">{t.stock}</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ["Blue Train · LP", "positive", "12", t.inStock],
                    ["Kind of Blue · LP", "caution", "2", t.low],
                    ["A Love Supreme · LP", "danger", "0", t.out],
                  ] as const
                ).map(([name, tone, stock, label]) => (
                  <tr key={name}>
                    <td>
                      <span className="flex items-center gap-2">
                        <Dot state={tone} />
                        <span className="font-mono text-body text-ink">{name}</span>
                      </span>
                    </td>
                    <td>
                      <StatusChip label={label} state={tone} />
                    </td>
                    <td className="text-right font-mono tabular-nums">{stock}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </div>
      </Demo>
      <P>{t.overflow}</P>

      <H2>{t.rules}</H2>
      <Note>{t.noEngine}</Note>

      <H2>{t.cellH}</H2>
      <P>{t.cellP}</P>
      <H2>{t.tamH}</H2>
      <Demo labels={dict.demo} align="start" grid={false} code={`<SelectAll checked={…} indeterminate={…} label="${t.tSecTumu}" onChange={…} />
<SortHeader direction={dir} onSort={setDir}>${t.tTutar}</SortHeader>
<tr data-selected>…<Button size="sm">${t.tDetay}</Button></tr>`}>
        <TabloOrnegi
          satirlar={t.tSatirlar.map((r) => ({ ...r }))}
          basliklar={{
            id: t.tSiparis,
            musteri: t.tMusteri,
            tutar: t.tTutar,
            durum: t.tDurum,
          }}
          detay={t.tDetay}
          secTumu={t.tSecTumu}
          secilen={t.tSecilen}
        />
      </Demo>
      <P>{t.tamP}</P>

      <Demo labels={dict.demo} align="start" grid={false} code={`<CellActions>
  <MiniButton aria-label="…"><Icon icon={Edit} size="xs" /></MiniButton>
  <DropdownMenu trigger={…} items={…} align="end" />
</CellActions>`}>
        <div className="w-full">
          <CellActionsDemo lang={lang} />
        </div>
      </Demo>
      <Props of="CellActions" lang={lang} etiketli />
      <Note>{t.cellN}</Note>

      <H2>Props</H2>
      <Props of="Table" lang={lang} etiketli />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
