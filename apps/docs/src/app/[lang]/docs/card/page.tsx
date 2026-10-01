import { Card, CardHead, CardBody, Icon, MiniButton } from "tamga-ui";
import { More } from "tamga-ui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { sayfaMeta } from "@/content/meta";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return sayfaMeta("card", lang);
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
    lead: "Kitin tek yükseltilmiş yüzeyi: 1px kenar + 2px sert offset.",
    stock: "Stok",
    count: "48 kalem",
    edit: "Düzenle",
    body: "Gövde, başlıkla aynı yatay ritmi paylaşır.",
    temelAd: "Temel kart",
    temelGovde: "Kısa bir açıklama ve içerik için sade kap.",
    baslikliAd: "Başlıklı kart",
    baslikliGovde: "Başlık şeridi ve eylem butonu olan kart.",
    urunAd: "Keten gömlek · Kum",
    urunSatis: "412 satış",
    urunFiyat: "₺1.249",
    urunGorsel: "ürün görseli",
    ucBicim: (
      <>
        <strong>Üç biçim, tek bileşen.</strong> Sade kap; başlık şeridi olan (
        <code>CardHead</code>); ve <strong>bir yere götüren</strong> kart (<code>href</code>).
        Sonuncusu yükselen fiziği alıyor · işaretçinin altında kalkıyor, tıklanınca tabanına
        oturuyor, ve gerçekten bir <code>&lt;a&gt;</code> oluyor: tıklanabilir bir{" "}
        <code>div</code> klavyeye görünmez, ekran okuyucuya sessizdir.
      </>
    ),
    overflow: (
      <>
        <strong>Kart varsayılan olarak KIRPAR</strong> (<code>overflow=&quot;clip&quot;</code>):
        köşe yuvarlaması buna bağlı: içindeki bir tablo, kırpma olmadan köşelerden taşar.
        <br />
        <br />
        Ama aynı kırpma, kartın içinde AÇILAN her paneli keser: bir{" "}
        <Xref to="combobox">Combobox</Xref> listesi, bir{" "}
        <Xref to="date-picker">Date picker</Xref> takvimi, bir satır menüsü. Panel çalışır,
        tıklanır, ama yarısı görünmez, ve hata vermediği için sebebi aranırken ilk akla gelen
        z-index olur. <strong>Z-index bunu çözmez:</strong> hiçbir yığın sırası bir{" "}
        <code>overflow</code> kırpmasını aşamaz. İçinde açılır bir kontrol varsa{" "}
        <code>overflow=&quot;visible&quot;</code> ver.
      </>
    ),
    rules: "Kurallar",
    element: (
      <>
        Kart varsayılan olarak bir <code>div</code>, ama <code>as</code> ile{" "}
        <code>section</code>, <code>article</code> ya da <code>ul</code> olabiliyor. Etiket bir
        sunum tercihi değil belge yapısı: bir kart çoğu zaman bir <strong>bölümdür</strong>.
        Doğru etiketi bileşene söyle; sınıfı elle yazmak <code>overflow</code> korumasını
        birlikte götürür.
      </>
    ),
    head: (
      <>
        <code>CardHead</code> üç sınıfı birden ister (<code>head</code> · <code>gutter</code> ·{" "}
        <code>section</code>) ve biri unutulduğunda kart <strong>sessizce</strong> yanlış boşlukla
        çizilir; hata vermez, sadece ötekilere benzemez. Bileşen tam bunun için var.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Kartların ÜSTÜNDE duran bölüm başlığı için{" "}
        <Xref to="section-head">Section head</Xref>; kartın içine giren tablo için{" "}
        <Xref to="table">Table</Xref>.
      </>
    ),
  },
  en: {
    lead: "The kit's one raised surface: a 1px edge plus a 2px hard offset.",
    stock: "Stock",
    temelAd: "Plain card",
    temelGovde: "A quiet box for a short description and some content.",
    baslikliAd: "Card with a head",
    baslikliGovde: "A card with a title strip and an action button.",
    urunAd: "Linen shirt · Sand",
    urunSatis: "412 sold",
    urunFiyat: "£1,249",
    urunGorsel: "product image",
    ucBicim: (
      <>
        <strong>Three shapes, one component.</strong> The plain box; the one with a title strip
        (<code>CardHead</code>); and the card that <strong>leads somewhere</strong> (
        <code>href</code>). The last takes the raised physics · it lifts under the pointer and
        presses flat, and it really becomes an <code>&lt;a&gt;</code>: a clickable{" "}
        <code>div</code> is invisible to the keyboard and silent to a screen reader.
      </>
    ),
    count: "48 items",
    edit: "Edit",
    body: "The body shares the header's horizontal rhythm.",
    overflow: (
      <>
        <strong>A card clips by default</strong> (<code>overflow=&quot;clip&quot;</code>): its
        corner rounding depends on it: a table inside would otherwise spill past the corners.
        <br />
        <br />
        But the same clip cuts off every panel that OPENS inside the card: a{" "}
        <Xref to="combobox">Combobox</Xref> list, a{" "}
        <Xref to="date-picker">Date picker</Xref> calendar, a row menu. The panel works, it
        responds to clicks, but half of it is missing, and because nothing errors, the first
        suspect is always z-index. <strong>Z-index does not fix this:</strong> no stacking order
        beats an <code>overflow</code> clip. If there is an opening control inside, pass{" "}
        <code>overflow=&quot;visible&quot;</code>.
      </>
    ),
    rules: "Rules",
    element: (
      <>
        A card is a <code>div</code> by default, and <code>as</code> makes it a{" "}
        <code>section</code>, an <code>article</code> or a <code>ul</code>. The element is
        document structure, not a presentation choice: a card is usually a{" "}
        <strong>section</strong>. Tell the component which element you need; writing the class
        by hand takes the <code>overflow</code> guard away with it.
      </>
    ),
    head: (
      <>
        <code>CardHead</code> needs three classes at once (<code>head</code> · <code>gutter</code>{" "}
        · <code>section</code>) and if one is missing the card is drawn with the wrong spacing{" "}
        <strong>silently</strong>: no error, it just stops matching the others. That is exactly
        what the component is for.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For the section heading that sits ABOVE cards, <Xref to="section-head">Section head</Xref>;
        for a table inside one, <Xref to="table">Table</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("card")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" grid={false} code={`<Card>…</Card>

<Card>
  <CardHead action={<MiniButton aria-label="…"><Icon icon={More} size="xs" /></MiniButton>}>
    <h3 className="text-subhead font-semibold text-ink">${t.baslikliAd}</h3>
  </CardHead>
  <CardBody>${t.baslikliGovde}</CardBody>
</Card>

<Card href="/products/keten-gomlek">…</Card>`}>
        <div className="grid w-full gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardBody className="flex flex-col gap-2">
              <strong className="font-display text-subhead font-extrabold text-ink">
                {t.temelAd}
              </strong>
              <span className="text-body leading-relaxed text-ink-faint">{t.temelGovde}</span>
            </CardBody>
          </Card>

          <Card>
            <CardHead
              action={
                <MiniButton aria-label={t.edit}>
                  <Icon icon={More} size="xs" />
                </MiniButton>
              }
            >
              <h3 className="text-subhead font-semibold text-ink">{t.baslikliAd}</h3>
            </CardHead>
            <CardBody className="text-body leading-relaxed text-ink-faint">
              {t.baslikliGovde}
            </CardBody>
          </Card>

          {/* Tıklanabilir kart: görsel alanı çağıranın içeriği, kartın işi onu
              taşımak ve bir yere götürdüğünü söylemek. */}
          <Card href="#card">
            <span className="tamga-art-well flex h-30 items-center justify-center rounded-none border-0 border-b border-[var(--color-line)] font-mono text-caption text-ink-faint">
              {t.urunGorsel}
            </span>
            <span className="flex flex-col gap-1 px-4 py-3.5">
              <strong className="text-control font-semibold text-ink">{t.urunAd}</strong>
              <span className="flex justify-between text-small text-ink-faint">
                {t.urunSatis}
                <span className="font-mono font-bold text-ink">{t.urunFiyat}</span>
              </span>
            </span>
          </Card>
        </div>
      </Demo>
      <P>{t.ucBicim}</P>

      <H2>{t.rules}</H2>
      <Note>{t.head}</Note>
      <Note>{t.overflow}</Note>
      <Note>{t.element}</Note>

      <H2>Props</H2>
      <Props of="Card" lang={lang} etiketli />
      <Props of="CardHead" lang={lang} etiketli />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
