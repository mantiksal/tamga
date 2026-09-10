import type { Locale } from "@/i18n/config";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Xref } from "@/components/xref";
import { findPage } from "@/content/nav";
import { SablonGalerisi } from "./ornekler";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("templates")!.title[lang] };
}

const T = {
  tr: {
    lead: (
      <>
        Bir bileşen bir <strong>nesnedir</strong>: düğme, tablo, çip. Bir şablon bir{" "}
        <strong>ekranın şeklidir</strong>: başlık nerede durur, filtre nereye girer, yüklenirken ne
        görünür. Sekiz tane var ve <code>tamga-ui/patterns</code>&apos;ten geliyorlar.
      </>
    ),
    nedenH: "Neden ayrı bir katman",
    nedenP: (
      <>
        Ölçülmüş bir gerekçe: bir önceki üründe &ldquo;bir ekran&rdquo; diye bir nesne olmadığı için
        on altı neredeyse özdeş rota doğdu, ve on altı kopya zamanla birbirinden kaydı. Şablon
        seçip slot dolduran bir rota kendi kromunu icat edemez. Mekanizmanın tamamı bu: çoğaltma
        önerilmez değil, <strong>imkânsız</strong> olur.
      </>
    ),
    kuralH: "Üç kural, hepsinde geçerli",
    kural: [
      [
        "Şablon slot alır, veri çekmez",
        "Hiçbiri istek atmaz, sorgu bilmez. Durum bir prop olarak geliyor; sorgunun sahibi kararı veriyor. Bir şablonun ne olduğunu öğrendiği an, o artık bir şablon değil bir ekran.",
      ],
      [
        "Sözcükler dışarıdan",
        "Şablonlar labels alıyor, bir çeviri kancası çağırmıyor. Kütüphane bir i18n kütüphanesi seçemez, çünkü seçtiği an tüketiciye de onu dayatır. Asılları next-intl çağırıyordu ve tam bu yüzden Next dışına çıkamıyorlardı.",
      ],
      [
        "Bağlantılar da dışarıdan",
        "linkComponent verilmezse düz a. Next uygulaması next/link geçiyor, bir örnek hiçbir şey geçmiyor. Yönlendirici bilen bir şablon yalnız o yönlendiricinin içinde çizilebilirdi.",
      ],
    ],
    listeH: "Liste",
    listeP: (
      <>
        Her liste ekranının şekli. <strong>Dört durum, tek sahip</strong>: yüklenirken iskelet,
        hatada <code>code · request_id</code>, boşta bir <strong>slot</strong>, hazırda çağıranın
        tablosu. Boş bilerek slot: boş bir &ldquo;Plaklar&rdquo; ilkini eklemeye davettir, boş bir
        &ldquo;İadeler&rdquo; iyi haberdir, ve bunlar farklı cümleler.
      </>
    ),
    listeDurum: "Aynı şablon, dört durum",
    ozetH: "Özet",
    ozetP: (
      <>
        <strong>Bir kahraman, sonra ızgara.</strong> Kahraman bir slot çünkü iki özet ekranı oraya
        farklı şeyler koyuyor; ama ilişki aynı: tam olarak bir şey cevaptır. İki kahramanı olan bir
        ekranın kahramanı yoktur, ve bir pano tam böyle eşit karolardan oluşan bir duvara dönüşür.
      </>
    ),
    detayH: "Detay",
    detayP: (
      <>
        <strong>Sekmeler rota, durum değil.</strong> Her biri adresi değiştirdiği için bir bağlantı;
        düğme olarak çizmek geri düğmesini, orta tıkı ve birine sekme bağlantısı göndermeyi
        kaybettirirdi. Burada &ldquo;boş&rdquo; hâli yok: bir liste meşru olarak boş olabilir, bir
        nesne olamaz. Olmayan bir kayıt 404&apos;tür, ve o bir rotanın cevabıdır.
      </>
    ),
    ayarH: "Ayarlar",
    ayarP: (
      <>
        Kazara dokuzuncu bir bölüm büyütmeye en açık ekran burası: her yeni özellik anahtarını
        koyacak bir yer arıyor. Bölüm listesi dışarıdan geliyor, yani bölüm eklemek olması gerektiği
        şey oluyor: bir karar. <strong>Kapsam gösteriliyor, tahmin edilmiyor</strong>: bir ayarın
        kişiye mi çalışma alanına mı ait olduğu, onu kimin değiştirebileceğini belirliyor.
      </>
    ),
    sihirbazH: "Sihirbaz",
    sihirbazP: (
      <>
        Form her şeyi bir kerede sorar. Sihirbaz bir <strong>söz</strong> verir: &ldquo;bu kadar adım
        ve bitti&rdquo;, ve söz özelliğin kendisidir. &ldquo;Bitti&rdquo; konumsal, çağıranın
        taşıması gereken bir bayrak değil: o anki adımdan öncekilerin hepsinden geçilmiş.
      </>
    ),
    oturumH: "Oturum",
    oturumP: (
      <>
        Uygulama çerçevesi yok: gidilecek bir yer henüz yok, ve açamayacağın menüler sunan bir
        çerçeve yalan söyler. Kayıtta yan panel var, girişte yok, ve asimetri kasıtlı: giriş yapan
        kişi acelesi olan dönen bir kullanıcı, kaydolan kişi hâlâ karar veriyor.
      </>
    ),
    kamusalH: "Kamusal",
    kamusalP: (
      <>
        Oturumsuz ulaşılan yüzeyler. Neden rayı gizlenmiş uygulama çerçevesi değil: bu sayfa çoğu
        zaman <strong>bizim değil</strong>. Beyaz etiketli bir alan adında müşterinin kendi
        sayfasıdır, ve orada bizim rayımızın belirmesi bir müşterinin tedarikçisinin bir başka
        müşterinin markasına sızması olur.
      </>
    ),
    kabukH: "Kabuk",
    kabukP: (
      <>
        Oturum açmış her ekranın içinde durduğu çerçeve. <strong>Menü burada yazılmıyor</strong>:
        bir kenar çubuğundaki her giriş o ürünün sözlüğüdür ve kütüphane hiçbir ürünün sözlüğünü
        taşımaz (<Xref to="icons">İkonlar</Xref>&apos;daki kuralın aynısı). O anki girişi de
        çağıran söylüyor, bir yönlendirici kancası değil.
      </>
    ),
    sonN: (
      <>
        Şablonlar ayrı bir girişte (<code>tamga-ui/patterns</code>), ana <code>tamga-ui</code>&apos;de
        değil. Bir bileşen ile bir ekran şekli aynı şey değil: kitin bileşenleri hiçbir düzen
        dayatmıyor, şablonlar dayatıyor. Ayrı giriş, bir ürünün &ldquo;yalnız bileşenleri
        alayım&rdquo; diyebilmesi demek.
      </>
    ),
  },
  en: {
    lead: (
      <>
        A component is an <strong>object</strong>: a button, a table, a chip. A template is the{" "}
        <strong>shape of a screen</strong>: where the title sits, where the filter goes, what shows
        while it loads. There are eight, and they come from <code>tamga-ui/patterns</code>.
      </>
    ),
    nedenH: "Why a separate layer",
    nedenP: (
      <>
        A measured reason: in an earlier product there was no object called &ldquo;a screen&rdquo;,
        so sixteen near-parallel routes grew and the sixteen copies drifted apart. A route that
        picks a template and fills slots cannot invent its own chrome. That is the whole mechanism:
        duplication becomes <strong>impossible</strong> rather than discouraged.
      </>
    ),
    kuralH: "Three rules, all of them",
    kural: [
      [
        "A template takes slots, it does not fetch",
        "None of them issue a request or know what a query is. State arrives as a prop, decided by whoever owns the query. The moment a template learns what it is showing, it is a screen rather than a template.",
      ],
      [
        "The words come from outside",
        "Templates take labels; they never call a translation hook. A library cannot pick an i18n library, because picking one imposes it on every consumer. The originals called next-intl, which is exactly why they could not leave Next.",
      ],
      [
        "So do the links",
        "Without linkComponent it is a plain a. A Next app passes next/link, an example passes nothing. A template that knew a router could only be drawn inside that router.",
      ],
    ],
    listeH: "List",
    listeP: (
      <>
        The shape of every list screen. <strong>Four states, one owner</strong>: a skeleton while
        loading, <code>code · request_id</code> on error, a <strong>slot</strong> when empty, the
        caller&apos;s table when ready. Empty is a slot on purpose: an empty &ldquo;Records&rdquo; is
        an invitation to add the first one, an empty &ldquo;Returns&rdquo; is good news, and those
        are different sentences.
      </>
    ),
    listeDurum: "One template, four states",
    ozetH: "Overview",
    ozetP: (
      <>
        <strong>One hero, then a grid.</strong> The hero is a slot because two overview screens put
        different things in it, but the relationship is the same: exactly one thing is the answer. A
        screen with two heroes has no hero, which is how a dashboard becomes a wall of equal tiles.
      </>
    ),
    detayH: "Detail",
    detayP: (
      <>
        <strong>Tabs are routes, not state.</strong> Each one changes the address, so each is a
        link; drawing them as buttons would cost the back button, middle-click, and any chance of
        linking someone to a tab. There is no &ldquo;empty&rdquo; here: a list can legitimately be
        empty, an object cannot. A missing record is a 404, and that is a route&apos;s answer.
      </>
    ),
    ayarH: "Settings",
    ayarP: (
      <>
        This is the screen most likely to grow a ninth section by accident: every new feature wants
        somewhere to put its toggle. The section list comes from outside, so adding one becomes what
        it should be: a decision. <strong>Scope is shown, not guessed</strong>: whether a setting
        belongs to the person or the workspace decides who may change it.
      </>
    ),
    sihirbazH: "Wizard",
    sihirbazP: (
      <>
        A form asks for everything at once. A wizard makes a <strong>promise</strong>: &ldquo;this
        many steps and you are done&rdquo;, and the promise is the feature. &ldquo;Done&rdquo; is
        positional rather than a flag the caller has to maintain: everything before the current step
        has been passed through.
      </>
    ),
    oturumH: "Auth",
    oturumP: (
      <>
        No app chrome: there is nothing to navigate to yet, and a chrome that offers menus you
        cannot open is a chrome that lies. Register has a side panel, sign in does not, and the
        asymmetry is the point: somebody signing in is a returning user in a hurry, somebody
        registering is still deciding.
      </>
    ),
    kamusalH: "Public",
    kamusalP: (
      <>
        The surfaces reachable without a session. Why not the app shell with the rail hidden: this
        page is often <strong>not ours</strong>. On a white-label domain it is the customer&apos;s
        own page, and our rail appearing there would leak one customer&apos;s vendor into another
        customer&apos;s brand.
      </>
    ),
    kabukH: "App shell",
    kabukP: (
      <>
        The frame every signed-in screen sits in. <strong>The menu is not written here</strong>:
        every entry in a sidebar is that product&apos;s vocabulary, and the library carries no
        product&apos;s vocabulary (the same rule as in <Xref to="icons">Icons</Xref>). The current
        entry is passed in too, not read from a router hook.
      </>
    ),
    sonN: (
      <>
        Templates live behind their own entry point (<code>tamga-ui/patterns</code>), not the main{" "}
        <code>tamga-ui</code>. A component and the shape of a screen are not the same thing: the
        kit&apos;s components impose no layout, templates do. A separate entry means a product can
        say &ldquo;just the components, thanks&rdquo;.
      </>
    ),
  },
};

function Kurallar({ rows }: { rows: string[][] }) {
  return (
    <ol className="tamga-prose my-4 flex list-none flex-col gap-4 p-0">
      {rows.map(([ad, aciklama]) => (
        <li key={ad} className="flex flex-col gap-1 border-l-2 border-[var(--color-edge)] pl-4">
          <strong className="text-ink">{ad}</strong>
          <span className="text-ink-soft">{aciklama}</span>
        </li>
      ))}
    </ol>
  );
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const p = findPage("templates")!;
  const t = T[lang];

  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>

      {/* KATALOG ÖNCE, GEREKÇE SONRA. Bu sayfaya gelen kişinin ilk sorusu
          "ne var ne yok"; bir süre sekiz şablon sekiz başlığın altına
          dağılmıştı ve cevap ancak sonuna kadar kaydırınca çıkıyordu. */}
      <SablonGalerisi lang={lang} />

      <H2>{t.nedenH}</H2>
      <P>{t.nedenP}</P>

      <H2>{t.kuralH}</H2>
      <Kurallar rows={t.kural} />

      <Note>{t.sonN}</Note>
    </>
  );
}
