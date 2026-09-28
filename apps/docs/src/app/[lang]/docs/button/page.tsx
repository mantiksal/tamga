import { Button, Icon } from "tamga-ui";
import { ArrowRight, Plus } from "tamga-ui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { ButtonPlayground } from "@/components/interactive";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("button")!.title[lang] };
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
    save: "Kaydet",
    cancel: "Vazgeç",
    confirm: "Onayla",
    remove: "Sil",
    close: "Kapat",
    details: "Ayrıntılar",
    submit: "Formu gönder",
    lead: (
      <>
        Altı varyant, ve hepsi <em>aynı şekil artı bir renk</em>. Yeni bir varyant yeni bir dosya
        değil, mevcut <code>cva</code> tablosuna bir satırdır.
      </>
    ),
    quietH: "`quiet`: bir listenin içinde yaşayan düğme",
    quietP: (
      <>
        <code>ghost</code> duruşta da hover&apos;da da bir düğmedir, yalnız kenarsız.{" "}
        <code>quiet</code> ise bir LİSTEDE yaşar: otuz satırın her birinde bir düğme varsa otuz
        düğme ekranı yönetir ve satırın asıl içeriği · kaydın kendisi · onların arasında
        kaybolur. Sessiz hâlde metin gibi durur, imleç geldiğinde kenarını ve tabanını kazanıp ne
        olduğunu söyler. Yükselmesi küçük (2px): satırın İÇİNDE duran bir şey, üstünde duran bir
        şey değil.
      </>
    ),
    ship: "Kargola",
    yeniUrun: "Yeni ürün",
    devamEt: "Devam et",
    yukleniyor: "Tıkla, yüklensin",
    pasif: "Pasif",
    buyuk: "Büyük",
    bekleniyor: "Yükleniyor",
    ikinciSatir: (
      <>
        İkon <strong>eylemin yönünü</strong> söylüyor: ekleme solda (<code>+</code> sözcükten
        önce gelir), ilerleme sağda (ok cümleden sonra). Süren bir düğme{" "}
        <strong>genişliğini korur</strong> · etiket yerinde kalıp görünmez oluyor, yoksa
        satırdaki öteki düğmeler kayıyor. Pasif olan kesikli: bu kitte kesik kenar
        &quot;henüz gerçek değil&quot; demek.
      </>
    ),
    yumusak: (
      <>
        <code>soft</code> birincil ile ikincil <strong>arasında bir basamak</strong>: vurgunun
        açık tonunda dolu. &ldquo;Bunu da yapabilirsin&rdquo; diyen ama sayfanın tek dolu
        düğmesiyle yarışmayan eylem · bir kartın içindeki ikinci eylem, bir şeridin yanındaki
        toplu işlem.
      </>
    ),
    rules: "Kurallar",
    oneFilled: (
      <>
        <strong>Sayfada tek bir <code>primary</code> olur.</strong> Onaylama ve silme ikisi de
        önemli olabilir, ama ikisi de <em>o sayfanın</em> eylemi değildir, o yüzden{" "}
        <code>success</code> ve <code>danger</code> dolgu değil, renkli kenar alır.
      </>
    ),
    sizes: (
      <>
        Varsayılanlar <code>variant=&quot;secondary&quot;</code> ve <code>size=&quot;base&quot;</code>,
        yani <code>&lt;Button&gt;</code> yazdığında aldığın şey bu. <code>sm</code> kart başlıkları ve sıkışık araç çubukları için. Üçüncü bir boyut yok; bir
        skala ancak sınırlıyken skala olur. Daha küçüğü gerekiyorsa aradığın şey{" "}
        <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
    rest: (
      <>
        Tabloda olmayan her şey <code>&lt;button&gt;</code>&apos;ın kendi niteliği; {" "}
        <code>onClick</code>, <code>disabled</code>, <code>type</code>, hepsi geçerli. Her bileşen
        ayrıca <code>className</code> alır.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Metinsiz bir kontrol için <Xref to="icon-button">Icon button</Xref>; bir alanın
        içine sığması gereken en küçüğü için <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
  },
  en: {
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    remove: "Delete",
    close: "Close",
    details: "Details",
    submit: "Submit form",
    lead: (
      <>
        Six variants, and every one of them is <em>the same shape plus a colour</em>. A new variant
        is not a new file; it is one more row in the existing <code>cva</code> table.
      </>
    ),
    quietH: "`quiet`: a button that lives inside a list",
    quietP: (
      <>
        <code>ghost</code> is a button at rest and on hover, only without an edge.{" "}
        <code>quiet</code> lives in a LIST: with a button on each of thirty rows, thirty buttons
        run the screen and the row&apos;s actual content · the record itself · is lost among
        them. At rest it reads as text; under the cursor it gains its edge and its offset and
        says what it is. The lift is small (2px): a thing INSIDE the row, not on top of it.
      </>
    ),
    ship: "Ship",
    yeniUrun: "New product",
    devamEt: "Continue",
    yukleniyor: "Click to load",
    pasif: "Disabled",
    buyuk: "Large",
    bekleniyor: "Loading",
    ikinciSatir: (
      <>
        The glyph says <strong>which way the action goes</strong>: adding sits on the left (a{" "}
        <code>+</code> comes before the word), moving forward on the right (an arrow after the
        sentence). A busy button <strong>keeps its width</strong> · the label stays in place and
        turns invisible, otherwise every other button on the row shifts. The disabled one is
        dashed: in this kit a dashed edge means &quot;not real yet&quot;.
      </>
    ),
    yumusak: (
      <>
        <code>soft</code> is a <strong>step between</strong> primary and secondary: filled in the
        accent&apos;s light tone. The action that says &ldquo;you can also do this&rdquo; without
        competing with the page&apos;s one filled button · a second action inside a card, a bulk
        action beside a strip.
      </>
    ),
    rules: "Rules",
    oneFilled: (
      <>
        <strong>One <code>primary</code> per page.</strong> Confirming and deleting can both matter,
        but neither is <em>the page&apos;s</em> action, which is why <code>success</code> and{" "}
        <code>danger</code> get a coloured edge, never a fill.
      </>
    ),
    sizes: (
      <>
        The defaults are <code>variant=&quot;secondary&quot;</code> and <code>size=&quot;base&quot;</code>:
        that is what a bare <code>&lt;Button&gt;</code> gives you. <code>sm</code> is for card headers and dense toolbars. There is no third size; a scale is
        only a scale while it stays small. If you need something smaller, what you want is{" "}
        <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
    rest: (
      <>
        Anything not in the table is a plain <code>&lt;button&gt;</code> attribute;{" "}
        <code>onClick</code>, <code>disabled</code>, <code>type</code>, all of them. Every component
        also takes <code>className</code>.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For a control with no text, <Xref to="icon-button">Icon button</Xref>; for the
        smallest one, meant to sit inside a field, <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("button")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo
        labels={dict.demo}
        code={`<Button variant="primary">${t.save}</Button>
<Button>${t.cancel}</Button>
<Button variant="soft">${t.ship}</Button>
<Button variant="success">${t.confirm}</Button>
<Button variant="danger">${t.remove}</Button>
<Button variant="ghost">${t.close}</Button>
<Button variant="link">${t.details}</Button>
<Button variant="quiet">${t.details}</Button>`}
      >
        <Button variant="primary">{t.save}</Button>
        <Button>{t.cancel}</Button>
        <Button variant="soft">{t.ship}</Button>
        <Button variant="success">{t.confirm}</Button>
        <Button variant="danger">{t.remove}</Button>
        <Button variant="ghost">{t.close}</Button>
        <Button variant="link">{t.details}</Button>
        <Button variant="quiet">{t.details}</Button>
      </Demo>

      <Demo
        labels={dict.demo}
        code={`<Button variant="primary"><Icon icon={Plus} size="xs" />${t.yeniUrun}</Button>
<Button>${t.devamEt}<Icon icon={ArrowRight} size="xs" /></Button>
<Button variant="primary" busy busyLabel="${t.bekleniyor}">${t.yukleniyor}</Button>
<Button disabled>${t.pasif}</Button>
<Button variant="primary" size="lg">${t.buyuk}</Button>`}
      >
        <Button variant="primary">
          <Icon icon={Plus} size="xs" />
          {t.yeniUrun}
        </Button>
        <Button>
          {t.devamEt}
          <Icon icon={ArrowRight} size="xs" />
        </Button>
        <Button variant="primary" busy busyLabel={t.bekleniyor}>
          {t.yukleniyor}
        </Button>
        <Button disabled>{t.pasif}</Button>
        <Button variant="primary" size="lg">
          {t.buyuk}
        </Button>
      </Demo>
      <P>{t.ikinciSatir}</P>

      <P>{t.yumusak}</P>

      <ButtonPlayground labels={dict.demo} label={t.save} />

      <H2>{t.quietH}</H2>
      <P>{t.quietP}</P>

      <H2>{t.rules}</H2>
      <Note>{t.oneFilled}</Note>
      <P>{t.sizes}</P>

      <H2>Props</H2>
      <Props of="Button" lang={lang} />
      <P>{t.rest}</P>

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
