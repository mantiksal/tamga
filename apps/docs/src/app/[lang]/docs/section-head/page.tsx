import { SectionHead, Button, Icon, Link } from "tamga-ui";
import { Export, Plus } from "tamga-ui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("section-head")!.title[lang] };
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
    orders: "Son siparişler",
    ordersMeta: "24 kayıt",
    stock: "Stok",
    edit: "Düzenle",
    right: (
      <>
        Eylem her zaman <strong>sağa yaslı</strong>, başlığın kendi taban çizgisinde; üründeki her
        satır kontrolünü orada tutar, ve başka yere koyan bir başlık listeden kopmuş görünür.{" "}
        <code>mono</code> tanımlayıcı biçimli meta metinleri (kodlar, SKU&apos;lar) için.
      </>
    ),
    magaza: "MAĞAZA",
    buyukAciklama: "Son 30 günde 1.284 sipariş · 12 tanesi onay bekliyor",
    disaAktar: "Dışa aktar",
    yeniSiparis: "Yeni sipariş",
    buyukH: "Üç boy: kartın şeridi, sayfanın bölümü, kartın içindeki alt bölüm",
    yeniSiparisIkonlu: "Manuel sipariş",
    altH: "Kartın içinde alt bölüm",
    altP: (
      <>
        <code>sub</code> bir kartın <strong>içinde</strong> ikinci bir başlık açıyor: arkasında
        şerit yok, çünkü kart zaten bir kere şerit taşıyor · ayıran şey <strong>altındaki
        kural</strong>. <code>meta</code> burada düz bir etiket değil, başlığın yanında duran bir{" "}
        <strong>sayı çipi</strong>.
      </>
    ),
    teslimat: "Teslimat adresleri",
    tumunuGor: "Tümünü gör",
    buyukP: (
      <>
        <code>base</code> bir <strong>kartın</strong> kendi başlık şeridi: 16px başlık, altında
        kartı kapatan kural. <code>lg</code> ise bir <strong>sayfanın</strong> bölümü · 30px
        başlık, üstünde <strong>vurgu renginde</strong> bir üst etiket, altında tek satır
        açıklama, ve kendi kuralı yok çünkü sayfanın ritmini kap veriyor. Üst etiket sessiz bir
        gri olduğunda başlıkla arasındaki bağ okunmuyordu.
      </>
    ),
    rules: "Kurallar",
    notCardHead: (
      <>
        Bir <Xref to="card">Card</Xref>&apos;ın İÇİNDEki başlık bu değil; o{" "}
        <code>CardHead</code>. Bu, kartların ÜSTÜNDE duran bölüm başlığı.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Meta metni için <Xref to="label">Label</Xref>; bölümleri ayırmak için{" "}
        <Xref to="separator">Separator</Xref>.
      </>
    ),
  },
  en: {
    orders: "Recent orders",
    ordersMeta: "24 records",
    stock: "Stock",
    edit: "Edit",
    right: (
      <>
        The action is always <strong>right-aligned</strong>, on the heading&apos;s own baseline;
        every row in the product keeps its control there, and a heading that puts it elsewhere
        looks detached from the list. <code>mono</code> is for identifier-shaped meta text (codes,
        SKUs).
      </>
    ),
    magaza: "STORE",
    buyukAciklama: "1,284 orders in the last 30 days · 12 waiting for approval",
    disaAktar: "Export",
    yeniSiparis: "New order",
    buyukH: "Three sizes: a card's strip, a page's section, a sub-section inside a card",
    yeniSiparisIkonlu: "Manual order",
    altH: "A sub-section inside a card",
    altP: (
      <>
        <code>sub</code> opens a second heading <strong>inside</strong> a card: no band behind
        it, because the card already carries one · what separates it is the{" "}
        <strong>rule underneath</strong>. Here <code>meta</code> is not a plain label but a{" "}
        <strong>count chip</strong> beside the title.
      </>
    ),
    teslimat: "Delivery addresses",
    tumunuGor: "See all",
    buyukP: (
      <>
        <code>base</code> is a <strong>card&apos;s</strong> own header strip: a 16px title with
        the rule that closes the card under it. <code>lg</code> is a section of a{" "}
        <strong>page</strong> · a 30px title, an eyebrow above it <strong>in the accent</strong>,
        one quiet line under it, and no rule of its own, because the container sets the page&apos;s
        rhythm. In a quiet grey the eyebrow read as a separate line rather than part of the title.
      </>
    ),
    rules: "Rules",
    notCardHead: (
      <>
        This is not the heading INSIDE a <Xref to="card">Card</Xref>; that is{" "}
        <code>CardHead</code>. This is the section heading that sits ABOVE the cards.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For meta text, <Xref to="label">Label</Xref>; to separate sections,{" "}
        <Xref to="separator">Separator</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("section-head")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} align="start" code={`<SectionHead title="${t.orders}" meta="${t.ordersMeta}" />
<SectionHead title="${t.stock}" meta="SKU-4471" mono action={<Button size="sm">${t.edit}</Button>} />`}>
        <div className="flex w-full flex-col gap-8">
          <SectionHead title={t.orders} meta={t.ordersMeta} />
          <SectionHead title={t.stock} meta="SKU-4471" mono action={<Button size="sm">{t.edit}</Button>} />
        </div>
      </Demo>
      <P>{t.right}</P>

      <H2>{t.buyukH}</H2>
      <P>{t.buyukP}</P>
      <Demo labels={dict.demo} align="start" grid={false} code={`<SectionHead
  size="lg"
  eyebrow="${t.magaza}"
  title="${t.orders}"
  description="${t.buyukAciklama}"
  action={<><Button>${t.disaAktar}</Button><Button variant="primary">${t.yeniSiparis}</Button></>}
/>`}>
        <div className="w-full">
          <SectionHead
            size="lg"
            eyebrow={t.magaza}
            title={t.orders}
            description={t.buyukAciklama}
            action={
              <>
                <Button>
                  <Icon icon={Export} size="xs" />
                  {t.disaAktar}
                </Button>
                <Button variant="primary">
                  <Icon icon={Plus} size="xs" />
                  {t.yeniSiparisIkonlu}
                </Button>
              </>
            }
          />
        </div>
      </Demo>

      <H2>{t.altH}</H2>
      <P>{t.altP}</P>
      <Demo labels={dict.demo} align="start" grid={false} code={`<SectionHead
  size="sub"
  title="${t.teslimat}"
  meta="3"
  action={<Link href="/addresses">${t.tumunuGor}</Link>}
/>`}>
        <div className="w-full">
          <SectionHead
            size="sub"
            title={t.teslimat}
            meta="3"
            action={<Link href="#section-head">{t.tumunuGor}</Link>}
          />
        </div>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.notCardHead}</Note>

      <H2>Props</H2>
      <Props of="SectionHead" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
