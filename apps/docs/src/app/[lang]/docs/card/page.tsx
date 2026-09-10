import { Card, CardHead, CardBody, Label, Button } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("card")!.title[lang] };
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
      <Demo labels={dict.demo} align="start" code={`<Card>
  <CardHead action={<Button size="sm">${t.edit}</Button>}>
    <h3 className="text-subhead font-semibold text-ink">${t.stock}</h3>
    <Label>${t.count}</Label>
  </CardHead>
  <CardBody>${t.body}</CardBody>
</Card>`}>
        <div className="w-full max-w-md">
          <Card>
            <CardHead action={<Button size="sm">{t.edit}</Button>}>
              <h3 className="text-subhead font-semibold text-ink">{t.stock}</h3>
              <Label>{t.count}</Label>
            </CardHead>
            <CardBody>{t.body}</CardBody>
          </Card>
        </div>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.head}</Note>
      <Note>{t.overflow}</Note>

      <H2>Props</H2>
      <Props of="Card" lang={lang} />
      <Props of="CardHead" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
