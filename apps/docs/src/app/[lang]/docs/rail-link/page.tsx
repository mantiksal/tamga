import { RayOrnegi } from "./ornek";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("rail-link")!.title[lang] };
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
/* Referansın kendi rayı: dört satır, ikisi rozetli, seçili olan üçüncü ·
   seçilinin ötekilerden nasıl ayrıldığı ancak liste uzayınca görülüyor. */
const T = {
  tr: {
    overview: "Genel bakış",
    orders: "Siparişler",
    rozetAd: (n: number) => `${n} bekleyen`,
    products: "Ürünler",
    stock: "Stok",
    robots: "Kayıtlar",
    settings: "Ayarlar",
    lead: "Bir kenar çubuğunun tek satırı. Dar hâlinde 52×40 ve yalnız bir ikon; geniş hâlinde ikonun yanında etiket, sağında rozet.",
    label: (
      <>
        <code>label</code> <strong>zorunlu</strong> ve iki iş birden yapıyor:{" "}
        <code>aria-label</code> olarak ekran okuyucuya adı veriyor, kitin kendi{" "}
        <Xref to="tooltip">Tooltip</Xref>&apos;i olarak fareyle bekleyene aynı adı veriyor
        (tarayıcının gri <code>title</code> balonu değil · o, kitin her yerdeki ipucundan başka
        türlü görünüyordu). İkon-yalnız bir gezinmede bu ad tek tanımlayıcıdır;
        olmadığında kullanıcı her simgeyi ezberlemek zorunda kalır.
      </>
    ),
    wide: (
      <>
        <code>showLabel</code> aynı kontrolün <strong>ikinci genişliği</strong>, ayrı bir bileşen
        değil. Varsayılan <code>false</code>: dar ray, etiket yalnız erişilebilir ad olarak yaşar.
        <code>true</code> verildiğinde satır kabına yayılır ve etiket ikonun yanında görünür,
        ipucu ise kalkar: görünen bir metnin üstünde beliren ipucu aynı şeyi ikinci
        kez söyler. İkiye bölünseydi hover, seçili ve odak fizikleri iki yerde yaşar ve zamanla
        ayrışırdı.
      </>
    ),
    current: (
      <>
        <code>active</code> hem <code>data-active</code> (görsel) hem{" "}
        <code>aria-current=&quot;page&quot;</code> (anlam) veriyor. Yalnız görseli vermek, gören
        biri için doğru ekranı çizip görmeyene hiçbir şey söylememek olurdu.
      </>
    ),
    rel: (
      <>
        Metinli gezinme satırı için <Xref to="list-row">List row</Xref>; nerede olduğunu söyleyen{" "}
        <Xref to="breadcrumb">Breadcrumb</Xref>.
      </>
    ),
    twice: (
      <>
        <strong>Bu bileşen iki yerde birden yazılmıştı</strong>: dashboard-v5&apos;te ve bu kitin
        doküman sitesinde, birbirinden habersizce. İkisi de aynı kararları vermek zorunda kaldı.
        Bir mekanizmanın kite ait olduğunun en güçlü kanıtı budur: iki proje onu yeniden icat
        etmişse, o mekanizma ikisinin de altındadır.
      </>
    ),
    rozet: (
      <>
        <code>badge</code> girişin arkasında bekleyen sayıyı taşıyor: geniş rayda{" "}
        <strong>sayı</strong>, dar rayda yalnız bir <strong>kare</strong>. 40 piksellik bir kutuda
        iki haneli bir sayı ikonun üstüne biniyor, ve okunmayan bir sayı &quot;bir şey
        var&quot;dan fazlasını söylemiyor · o zaman kareyi göster, sayıyı{" "}
        <code>badgeLabel</code> ile ekran okuyucuya söyle.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
  },
  en: {
    overview: "Overview",
    orders: "Orders",
    rozetAd: (n: number) => `${n} waiting`,
    products: "Products",
    stock: "Stock",
    robots: "Records",
    settings: "Settings",
    lead: "One row of a sidebar. Narrow it is 52×40 and an icon; wide it puts the label beside the icon with its badge on the right.",
    label: (
      <>
        <code>label</code> is <strong>required</strong> and does two jobs at once: as{" "}
        <code>aria-label</code> it gives the name to a screen reader, as <code>title</code> it
        gives the same name to whoever hovers. In icon-only navigation that name is the only
        identifier; without it the user has to memorise every glyph.
      </>
    ),
    wide: (
      <>
        <code>showLabel</code> is the same control at a <strong>second width</strong>, not a second
        component. It defaults to <code>false</code>: a narrow rail, where the label lives only as
        the accessible name. Set to <code>true</code> the row fills its container, the label appears
        beside the icon, and <code>title</code> drops away, because a tooltip over visible text says
        the same thing twice. Split into two components, the hover, selected and focus physics would
        live in two places and drift apart.
      </>
    ),
    current: (
      <>
        <code>active</code> sets both <code>data-active</code> (visual) and{" "}
        <code>aria-current=&quot;page&quot;</code> (meaning). Setting only the visual would draw
        the right screen for someone who sees and say nothing to someone who does not.
      </>
    ),
    rel: (
      <>
        For a navigation row with text, <Xref to="list-row">List row</Xref>; for saying where you
        are, <Xref to="breadcrumb">Breadcrumb</Xref>.
      </>
    ),
    twice: (
      <>
        <strong>This component had been written in two places</strong>: in dashboard-v5 and in
        this kit&apos;s own docs site, independently. Both had to make the same decisions. That is
        the strongest evidence a mechanism belongs in the kit: if two projects reinvented it, it
        sits underneath both.
      </>
    ),
    rozet: (
      <>
        <code>badge</code> carries the number waiting behind the entry: a <strong>number</strong>
        {" "}on a wide rail, only a <strong>square</strong> on a narrow one. In a 40px box a
        two-digit number sits on top of the icon, and an unreadable number says no more than
        &quot;there is something&quot; · so show the square and hand the number to the screen
        reader with <code>badgeLabel</code>.
      </>
    ),
    rules: "Rules",
    related: "Related",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("rail-link")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} grid={false} align="start" code={`<RailLink label="${t.overview}" href="/overview" active>
  <Icon icon={BoardView} size="sm" />
</RailLink>

<RailLink label="${t.orders}" href="/orders" showLabel badge={12} badgeLabel="${t.rozetAd(12)}">
  <Icon icon={ListView} size="sm" />
</RailLink>`}>
        {/* İki genişlik yan yana: aynı kontrol, aynı fizik, iki kap. Referans
            da böyle gösteriyor · ray 72px ya da 230px, arası yok. */}
        <RayOrnegi
          ogeler={[
            { key: "overview", label: t.overview },
            { key: "orders", label: t.orders, badge: 12, badgeLabel: t.rozetAd(12) },
            { key: "products", label: t.products },
            { key: "stock", label: t.stock, badge: 7, badgeLabel: t.rozetAd(7) },
          ]}
        />
      </Demo>

      <P>{t.rozet}</P>

      <H2>{t.rules}</H2>
      <Note>{t.label}</Note>
      <Note>{t.wide}</Note>
      <Note>{t.current}</Note>

      <H2>Props</H2>
      <Props of="RailLink" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
