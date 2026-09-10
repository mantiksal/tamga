import { Card, Table } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { PageHead, H2, H3, P, Note } from "@/components/prose";
import { Xref } from "@/components/xref";
import { findPage } from "@/content/nav";
import { CrudOrnegi, type OrnekMetinleri } from "./ornek";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("list-screen")!.title[lang] };
}

const T = {
  tr: {
    lead: (
      <>
        Kit bir <strong>CRUD motoru göndermiyor</strong>, ve bu bir eksik değil bir karar:{" "}
        <Xref to="table">Table</Xref>&apos;a veri verdiğin an o bileşen &ldquo;sıralama sunucuda
        mı istemcide mi, sayfa adreste mi durumda mı, filtre hangi biçimde gider&rdquo; diye
        karar vermeye başlar. Bunlar <strong>ürün</strong> kararları. Kit motorun parçalarını
        gönderiyor; bu sayfa parçaların bir ekranda nasıl bir araya geldiğini yazıyor.
      </>
    ),
    fiillerH: "Yedi fiil, ve her birinin sahibi",
    fiillerP: (
      <>
        Aşağıdaki örnek bir ekran görüntüsü değil: ekle gerçekten ekliyor, sil gerçekten
        siliyor, sıralama gerçekten sıralıyor. Yedi fiilin hepsi tek listede duruyor, ve
        <strong> kite tek bir bileşen eklenmeden</strong>: her parça zaten oradaydı, yeni olan
        yalnız düzen.
      </>
    ),
    fiillerBaslik: ["Fiil", "Nerede", "Parça"],
    fiiller: [
      ["Listele", "Kabuk", "Table"],
      ["Ara", "Kabuk, tek kutu", "Input"],
      ["Filtrele", "Kabuk, çip olarak görünür kalır", "Select"],
      ["Sırala", "Kabuk çiziyor, durumu ürün tutuyor", "SortHeader"],
      ["Sayfala", "Kabuk, yalnız bir sayfayı aşınca", "Pagination"],
      ["Ekle", "Yeri kabuğun, formu ekranın", "Button, Dialog"],
      ["Düzenle", "Ekranın: satır içi, çekmece ya da ayrı sayfa", "Sheet"],
      ["Sil", "Yeri kabuğun, onay cümlesi ekranın", "ConfirmDialog"],
    ],
    fiillerN: (
      <>
        Sekiz satır, yedi fiil: <strong>ekle ile düzenle aynı formu paylaşıyor</strong> ama aynı
        yüzeyi paylaşmıyor. Yeni bir kayıt kendi işidir, var olan bir kaydı düzenlemek listenin
        içinde bir iştir; birincisi diyalogda, ikincisi çekmecede açılıyor.
      </>
    ),
    ornek: {
      ara: "Ara",
      durum: "Durum",
      durumlar: ["Tümü", "Stokta", "Azalıyor", "Tükendi"],
      ekle: "Yeni kayıt",
      ad: "Kayıt",
      stok: "Stok",
      kayit: "kayıt",
      secili: "kayıt seçili",
      seciliSil: "Seçilenleri sil",
      secimiKaldir: "Seçimi kaldır",
      duzenle: "Düzenle",
      duzenleBaslik: "Plağı düzenle",
      sil: "Sil",
      silBaslik: "Plağı sil",
      silGovde: "{ad} kaydı ve stok bilgisi kalıcı olarak silinecek.",
      topluSilBaslik: "Seçilen kayıtları sil",
      topluSilGovde: "{n} kayıt kalıcı olarak silinecek. Bu işlem geri alınamaz.",
      vazgec: "Vazgeç",
      kapat: "Kapat",
      kaydet: "Kaydet",
      bos: "Bu filtreyle kayıt kalmadı. Durum filtresini gevşetin.",
      sayfadakileriSec: "Sayfadaki kayıtları seç",
      satirSec: "{ad} plağını seç",
      artir: "Artır",
      azalt: "Azalt",
      onceki: "Önceki",
      sonraki: "Sonraki",
      sayfa: "{n}. sayfa",
      filtreKaldir: "Durum filtresini kaldır",
    } satisfies OrnekMetinleri,
    anatomiH: "Anatomi: altı bölge, bu sırayla",
    anatomiP: (
      <>
        Sıra keyfi değil, <strong>daralma sırası</strong>: yukarıdan aşağı her bölge listeyi
        biraz daha daraltıyor. Başlık ekranın ne olduğunu, özet nerede iş olduğunu, filtre neyi
        gördüğünü, sayaç kaç kayda baktığını söylüyor; tablo onları çiziyor, sayfalama gerisini
        saklıyor.
      </>
    ),
    anatomi: [
      ["Başlık ve birincil eylem", "Ekranın adı solda, tek birincil eylem sağda: “Yeni ürün”. İkinci bir birincil eylem varsa biri birincil değildir."],
      ["Üst bölüm (isteğe bağlı)", "Ekrana özel özet: durum kartları, adım şeridi. Filtrenin ÜSTÜNDE, çünkü bir sayıya tıklamak da bir filtredir."],
      ["Filtre çubuğu", "Bir arama kutusu artı en çok dört alan; gerisi çekmecede. Uygulanan her filtre çip olarak görünür kalır."],
      ["Sayaç", "“1.284 sipariş”. Filtreden sonra kaç kayda bakıldığını söylemeyen liste, kullanıcıya saydırıyor."],
      ["Tablo", "Sıralanabilir başlıklar, sabit satır yüksekliği, taşan içerik kendi kabında kayar."],
      ["Sayfalama", "Yalnız toplam bir sayfayı aşınca çizilir. Aşmıyorsa çizmek, olmayan bir kontrolü öğretmek."],
    ],
    siralamaH: "Sıralamayı kim tutar",
    siralamaP: (
      <>
        Durumu <strong>ürün</strong> tutar, kit yalnız okunur kılar.{" "}
        <Xref to="sort-header">SortHeader</Xref> yönü çiziyor ve <code>aria-sort</code>&apos;u{" "}
        <code>&lt;th&gt;</code>&apos;ye koyuyor: ekran okuyucu sıralama durumunu oradan alıyor,
        başlığın içindeki düğmeden değil.
      </>
    ),
    siralamaN: (
      <>
        Metin sıralarken <code>localeCompare</code> kullan, ham karşılaştırma değil. Türkçede{" "}
        <code>&ldquo;ı&rdquo; &lt; &ldquo;i&rdquo;</code> varsayılan sıralamada yanlış çıkar ve
        kimse fark etmez.
      </>
    ),
    aramaH: "Arama ile filtre ayrı şeyler",
    aramaP: (
      <>
        Arama kutusu bir <strong>bulma</strong> aracı: &ldquo;şu kaydı getir&rdquo;. Filtre bir{" "}
        <strong>daraltma</strong> aracı: &ldquo;bu kümeye bak&rdquo;. Sekiz ayrı alan (sipariş
        no, müşteri no, ad, soyad, e-posta, telefon…) aynı soruyu soruyorsa hepsi tek bir arama
        kutusudur; hassas arama gerekiyorsa sekizi de çekmecede tek tek durur.
      </>
    ),
    aramaN: (
      <>
        Gizlenmiş bir filtre açıkken kullanıcı listeyi eksik görür ve sebebini bulamaz. Filtreyi
        çekmeceye koymanın tek gerçek riski budur, ve tek çaresi: uygulanan her filtre tablonun
        üstünde bir çip olarak durur, tek tıkla kalkar.
      </>
    ),
    formH: "Ekle, düzenle, sil nerede açılır",
    formP: (
      <>
        Üç yer var ve seçimi <strong>alan sayısı değil bağlam</strong> belirliyor: kullanıcının
        listeyi görmeye devam etmesi gerekiyor mu?
      </>
    ),
    form: [
      ["Satır içinde", "Tek alan, anında etkili: stok sayısı, yayında/değil. Liste hiç kaybolmuyor."],
      ["Çekmecede", "Birkaç alan, ve liste bağlam: “bu satırı düzenliyorum”. Arkadaki liste görünür kalır."],
      ["Ayrı sayfada", "Kayıt kendi başına bir iş: sekmeleri, kendi kaydetmesi, kendi geçmişi var. Ürün düzenleme böyle."],
    ],
    silH: "Silme",
    silP: (
      <>
        <Xref to="dialog">ConfirmDialog</Xref> arkasında, ve onay düğmesi{" "}
        <strong>fiili taşır</strong>: &ldquo;Sil&rdquo;, &ldquo;Tamam&rdquo; değil. Gövde neyin
        gideceğini sayar (&ldquo;bu varyasyonun 14 adetlik stoğu da gider&rdquo;). Odak
        Vazgeç&apos;te açılır. Silme bir bağlantı değil bir eylemdir: adres çubuğuna yazılan ya
        da bir önizleyicinin ısıttığı bir GET, kayıt silmemeli.
      </>
    ),
    bosH: "Boş durum üç farklı cümledir",
    bos: [
      ["Hiç kayıt yok", "Ekran yeni: ne olduğunu ve ilk kaydın nasıl açılacağını söyle."],
      ["Filtre boş döndürdü", "Kayıt var, filtre eledi: hangi filtrenin gevşetileceğini söyle."],
      ["Yükleniyor", "İskelet, dönen çark değil; ve iskeletin satır sayısı gerçekten gelecek olan sayı."],
    ],
    yapmaH: "Yapma: jenerik CRUD",
    yapmaP: (
      <>
        Tek bir <code>&lt;Crud table=&quot;…&quot; /&gt;</code> yazmak cazip ve sonucu ölçüldü.
        Böyle bir motorun üstüne kurulmuş bir yönetim panelinde ayarlar ekranı şöyle çıkıyor: her
        değer aynı tek satırlık kutuda düzenleniyor (sayı da, renk kodu da, çok satırlı bir
        robots.txt de), tip yok, doğrulama yok, kodun okuduğu anahtar ekranda görünmüyor, dışa
        aktarma parolaları da dosyaya döküyor, ve ekleme/silme her tablo için topluca kapatılmış.
        Hiçbiri o ekranın kararı değil; hepsi motorun.
      </>
    ),
    yapmaN: (
      <>
        Ortaklaştırılacak şey <strong>düzen</strong>, form değil. Bir liste kabuğu sütunları,
        satırları ve eylemleri dışarıdan alır; ne çizeceğini bilmez. Ekleme ve düzenleme
        formları ekrana ait kalır, çünkü aralarındaki fark gerçektir: beş sekmeli bir ürün ile
        tek alanlı bir ayar aynı forma sığmaz.
      </>
    ),
    parcalarH: "Kullanılan parçalar",
    parcalar: (
      <>
        <Xref to="table">Table</Xref> · <Xref to="sort-header">SortHeader</Xref> ·{" "}
        <Xref to="pagination">Pagination</Xref> · <Xref to="empty-state">Empty state</Xref> ·{" "}
        <Xref to="dialog">ConfirmDialog</Xref> · <Xref to="sheet">Sheet</Xref> ·{" "}
        <Xref to="multi-select">Multi select</Xref> · <Xref to="date-picker">Date picker</Xref>
      </>
    ),
  },
  en: {
    lead: (
      <>
        The kit does not ship a <strong>CRUD engine</strong>, and that is a decision rather than
        a gap: the moment you hand <Xref to="table">Table</Xref> your data, it starts deciding
        &ldquo;is sorting done on the server or the client, does the page live in the URL or in
        state, what shape does a filter take&rdquo;. Those are <strong>product</strong>{" "}
        decisions. The kit ships the engine&apos;s parts; this page describes how they come
        together on a screen.
      </>
    ),
    fiillerH: "Seven verbs, and who owns each",
    fiillerP: (
      <>
        The example below is not a screenshot: add really adds, delete really deletes, sorting
        really sorts. All seven verbs stand on one list, and
        <strong> without a single component added to the kit</strong>: every part was already
        there, only the layout is new.
      </>
    ),
    fiillerBaslik: ["Verb", "Where", "Part"],
    fiiller: [
      ["List", "The shell", "Table"],
      ["Search", "The shell, one box", "Input"],
      ["Filter", "The shell, stays visible as a chip", "Select"],
      ["Sort", "The shell draws it, the product owns the state", "SortHeader"],
      ["Paginate", "The shell, only past one page", "Pagination"],
      ["Add", "The place is the shell's, the form is the screen's", "Button, Dialog"],
      ["Edit", "The screen's: inline, drawer or its own page", "Sheet"],
      ["Delete", "The place is the shell's, the sentence is the screen's", "ConfirmDialog"],
    ],
    fiillerN: (
      <>
        Eight rows, seven verbs: <strong>add and edit share a form</strong> but not a surface. A
        new record is a job of its own; editing an existing one is a job inside the list. The
        first opens in a dialog, the second in a drawer.
      </>
    ),
    ornek: {
      ara: "Search",
      durum: "State",
      durumlar: ["All", "In stock", "Running low", "Out of stock"],
      ekle: "New record",
      ad: "Record",
      stok: "Stock",
      kayit: "records",
      secili: "records selected",
      seciliSil: "Delete selected",
      secimiKaldir: "Clear selection",
      duzenle: "Edit",
      duzenleBaslik: "Edit record",
      sil: "Delete",
      silBaslik: "Delete record",
      silGovde: "{ad} and its stock figure will be permanently deleted.",
      topluSilBaslik: "Delete selected records",
      topluSilGovde: "{n} records will be permanently deleted. This cannot be undone.",
      vazgec: "Cancel",
      kapat: "Close",
      kaydet: "Save",
      bos: "Nothing left under this filter. Loosen the state filter.",
      sayfadakileriSec: "Select the records on this page",
      satirSec: "Select {ad}",
      artir: "Increase",
      azalt: "Decrease",
      onceki: "Previous",
      sonraki: "Next",
      sayfa: "Page {n}",
      filtreKaldir: "Remove the state filter",
    } satisfies OrnekMetinleri,
    anatomiH: "Anatomy: six regions, in this order",
    anatomiP: (
      <>
        The order is not arbitrary, it is the <strong>order of narrowing</strong>: each region
        narrows the list a little further. The title says what the screen is, the summary says
        where the work is, the filter says what you are seeing, the counter says how many
        records you are looking at; the table draws them and pagination hides the rest.
      </>
    ),
    anatomi: [
      ["Title and primary action", "Screen name on the left, one primary action on the right: “New product”. If there is a second primary action, one of them is not primary."],
      ["Summary (optional)", "Screen-specific overview: status cards, a step strip. It sits ABOVE the filter, because clicking a number is also a filter."],
      ["Filter bar", "One search box plus at most four fields; the rest live in a drawer. Every applied filter stays visible as a chip."],
      ["Counter", "“1,284 orders”. A list that does not say how many records survived the filter is making the user count."],
      ["Table", "Sortable headers, a fixed row height, overflowing content scrolls in its own container."],
      ["Pagination", "Drawn only when the total exceeds one page. Drawing it otherwise teaches a control that does not exist."],
    ],
    siralamaH: "Who owns the sort",
    siralamaP: (
      <>
        The <strong>product</strong> owns the state; the kit only makes it legible.{" "}
        <Xref to="sort-header">SortHeader</Xref> draws the direction and puts{" "}
        <code>aria-sort</code> on the <code>&lt;th&gt;</code>: a screen reader takes the sort
        state from there, not from the button inside the header.
      </>
    ),
    siralamaN: (
      <>
        Sort text with <code>localeCompare</code>, never a raw comparison. In Turkish,{" "}
        <code>&ldquo;ı&rdquo; &lt; &ldquo;i&rdquo;</code> comes out wrong under the default
        ordering and nobody notices.
      </>
    ),
    aramaH: "Search and filter are different things",
    aramaP: (
      <>
        Search is a <strong>finding</strong> tool: &ldquo;bring me this record&rdquo;. A filter
        is a <strong>narrowing</strong> tool: &ldquo;look at this subset&rdquo;. If eight
        separate fields (order no, customer no, first name, surname, email, phone…) all ask the
        same question, they are one search box; when precise search is needed, all eight still
        stand in the drawer.
      </>
    ),
    aramaN: (
      <>
        With a hidden filter active, the user sees an incomplete list and cannot find out why.
        That is the only real risk of putting filters in a drawer, and it has one remedy: every
        applied filter stands above the table as a chip and comes off in one click.
      </>
    ),
    formH: "Where add, edit and delete open",
    formP: (
      <>
        There are three places, and the choice is made by <strong>context, not field count</strong>:
        does the user need to keep seeing the list?
      </>
    ),
    form: [
      ["Inline", "One field, immediate effect: stock count, published or not. The list never goes away."],
      ["In a drawer", "A few fields, and the list is the context: “I am editing this row”. The list behind stays visible."],
      ["On its own page", "The record is a job of its own: it has tabs, its own save, its own history. Product editing is like this."],
    ],
    silH: "Deleting",
    silP: (
      <>
        Behind a <Xref to="dialog">ConfirmDialog</Xref>, with the confirm button carrying
        the <strong>verb</strong>: &ldquo;Delete&rdquo;, never &ldquo;OK&rdquo;. The body counts
        what will go (&ldquo;the 14 units of stock on this variant go too&rdquo;). Focus opens on
        Cancel. Deleting is an action, not a link: a GET typed into the address bar or warmed by
        a previewer must not delete a record.
      </>
    ),
    bosH: "An empty state is three different sentences",
    bos: [
      ["No records at all", "The screen is new: say what it is and how the first record gets created."],
      ["The filter returned nothing", "Records exist, the filter removed them: say which filter to loosen."],
      ["Loading", "A skeleton, not a spinner; and the skeleton's row count is the number that is actually coming."],
    ],
    yapmaH: "Do not: the generic CRUD",
    yapmaP: (
      <>
        Writing a single <code>&lt;Crud table=&quot;…&quot; /&gt;</code> is tempting, and the
        result has been measured. In an admin panel built on such an engine, the settings screen
        comes out like this: every value is edited in the same single-line box (a number, a
        colour code, a multi-line robots.txt alike), no types, no validation, the key the code
        actually reads is not shown, export dumps the passwords into the file too, and add and
        delete are switched off wholesale for every table. None of that is that screen&apos;s
        decision; all of it is the engine&apos;s.
      </>
    ),
    yapmaN: (
      <>
        What gets shared is the <strong>layout</strong>, not the form. A list shell takes its
        columns, rows and actions from the outside; it does not know what it is drawing. Add and
        edit forms stay with the screen, because the difference between them is real: a product
        with five tabs and a setting with one field do not fit the same form.
      </>
    ),
    parcalarH: "Parts used",
    parcalar: (
      <>
        <Xref to="table">Table</Xref> · <Xref to="sort-header">SortHeader</Xref> ·{" "}
        <Xref to="pagination">Pagination</Xref> · <Xref to="empty-state">Empty state</Xref> ·{" "}
        <Xref to="dialog">ConfirmDialog</Xref> · <Xref to="sheet">Sheet</Xref> ·{" "}
        <Xref to="multi-select">Multi select</Xref> · <Xref to="date-picker">Date picker</Xref>
      </>
    ),
  },
};

/**
 * Fiil tablosu: soruyu soran kişiye tek bakışta cevap.
 *
 * "Sağlam bir CRUD yapısı" isteyen biri anlatı okumak istemiyor; hangi fiilin
 * kimde olduğunu görmek istiyor. Sekiz satır, üç sütun.
 */
function Fiiller({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="tamga-scroll-x my-4">
      <Table>
        <thead>
          <tr>
            <th scope="col" className="w-32">
              {head[0]}
            </th>
            <th scope="col">{head[1]}</th>
            <th scope="col" className="w-52">
              {head[2]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([fiil, yer, parca]) => (
            <tr key={fiil}>
              <td className="font-semibold text-ink">{fiil}</td>
              <td className="text-ink-soft">{yer}</td>
              <td className="font-mono text-small text-ink-soft">{parca}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function Sayilar({ items }: { items: string[][] }) {
  return (
    <ol className="tamga-prose my-4 flex list-none flex-col gap-3 p-0">
      {items.map(([ad, aciklama], i) => (
        <li key={ad} className="flex gap-3">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-(--radius-mark) bg-[var(--color-ink)] font-mono text-micro font-bold text-[var(--color-page)]">
            {i + 1}
          </span>
          <span>
            <strong className="text-ink">{ad}</strong>
            <span className="block text-ink-soft">{aciklama}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const p = findPage("list-screen")!;
  const t = T[lang];

  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>

      <H2>{t.fiillerH}</H2>
      <P>{t.fiillerP}</P>
      {/* ÖRNEK KUTUNUN İÇİNDE DEĞİL, sayfanın genişliğinde: `Demo` bir
          bileşeni yalıtmak için var ve burada gösterilen şey tek bir bileşen
          değil, bir EKRAN. Kareli zemine oturtmak onu bir parça gibi
          gösterirdi. */}
      <Card>
        <div className="px-4 pb-5 pt-1">
          <CrudOrnegi t={t.ornek} />
        </div>
      </Card>
      <Fiiller head={t.fiillerBaslik} rows={t.fiiller} />
      <Note>{t.fiillerN}</Note>

      <H2>{t.anatomiH}</H2>
      <P>{t.anatomiP}</P>
      <Sayilar items={t.anatomi} />

      <H2>{t.siralamaH}</H2>
      <P>{t.siralamaP}</P>
      <Note>{t.siralamaN}</Note>

      <H2>{t.aramaH}</H2>
      <P>{t.aramaP}</P>
      <Note>{t.aramaN}</Note>

      <H2>{t.formH}</H2>
      <P>{t.formP}</P>
      <Sayilar items={t.form} />

      <H3>{t.silH}</H3>
      <P>{t.silP}</P>

      <H2>{t.bosH}</H2>
      <Sayilar items={t.bos} />

      <H2>{t.yapmaH}</H2>
      <P>{t.yapmaP}</P>
      <Note>{t.yapmaN}</Note>

      <H2>{t.parcalarH}</H2>
      <P>{t.parcalar}</P>
    </>
  );
}
