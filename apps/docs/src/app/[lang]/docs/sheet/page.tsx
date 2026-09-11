import { SheetDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("sheet")!.title[lang] };
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
        Yandan girer ve bilgi verir. Karar istemediği için dışarı tıklamak kapatır; okumayı
        bitiren kişi kapatma düğmesini aramak zorunda kalmaz.
      </>
    ),
    use: (
      <>
        Bir listeden bir satırın ayrıntısına bakmak için: sayfayı terk etmeden bakılır, kapatılır,
        listedeki yer korunur.
      </>
    ),
    rules: "Kurallar",
    yonH: "Hangi kenardan girdiği bir anlam taşır",
    yonP: (
      <>
        <code>side</code> iki değer alıyor. <code>end</code> (varsayılan) bakılan şeyin
        AYRINTISI için: kaydın yanında, gözün zaten bittiği tarafta açılıyor. <code>start</code>{" "}
        GEZİNME için, çünkü bu kitin kurduğu her panelde menü solda yaşıyor; ters taraftan giren
        bir menü başka bir şey gibi okunuyor. Panel girdiği kenardan kayarak geliyor, ve bu da
        bir öğretme: nereden geldiğini gören, onu nereye geri iteceğini de biliyor.{" "}
        <code>prefers-reduced-motion</code> açıksa kayma yok, panel yerinde beliriyor.
      </>
    ),
    plane: (
      <>
        <strong>Beşi de aynı düzlemde yaşar:</strong> 6px sert offset, sayfadaki hiçbir nesnenin
        ulaşamayacağı yükseklik. Ayrım ne kadar yükseldiklerinde değil, ne istediklerinde:{" "}
        <Xref to="dialog">Dialog</Xref> karar ister · <Xref to="sheet">Sheet</Xref> bilgi verir ·{" "}
        <Xref to="popover">Popover</Xref> küçük bir iş yaptırır ·{" "}
        <Xref to="dropdown-menu">Dropdown menu</Xref> eylem listeler ·{" "}
        <Xref to="tooltip">Tooltip</Xref> tek satır açıklar.
      </>
    ),
  },
  en: {
    lead: (
      <>
        It enters from the side and informs. Because it asks for nothing, clicking outside closes
        it; whoever finished reading does not have to hunt for a close button.
      </>
    ),
    use: (
      <>
        For looking at one row&apos;s detail from a list: you look without leaving the page, close
        it, and your place in the list is still there.
      </>
    ),
    rules: "Rules",
    yonH: "Which edge it enters from carries meaning",
    yonP: (
      <>
        <code>side</code> takes two values. <code>end</code> (the default) is for DETAIL about
        the thing you were looking at: it opens beside the record, on the side the eye already
        ended on. <code>start</code> is for NAVIGATION, because a menu lives on the left in every
        panel this kit builds, and a menu that slides in from the opposite side reads as a
        different kind of thing. The panel slides in from the edge it belongs to, and that too
        teaches something: seeing where it came from tells you where to push it back. With{" "}
        <code>prefers-reduced-motion</code> the slide is dropped and the panel simply appears.
      </>
    ),
    plane: (
      <>
        <strong>All five live on the same plane:</strong> a 6px hard offset, a height no other
        object on the page can reach. What separates them is not how far they lift but what they
        want: <Xref to="dialog">Dialog</Xref> asks for a decision ·{" "}
        <Xref to="sheet">Sheet</Xref> informs · <Xref to="popover">Popover</Xref> gets a small job
        done · <Xref to="dropdown-menu">Dropdown menu</Xref> lists actions ·{" "}
        <Xref to="tooltip">Tooltip</Xref> explains in one line.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("sheet")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} code={`<Sheet open={open} onClose={close} title="…" closeLabel="…">
  …
</Sheet>`}>
        <SheetDemo lang={lang} />
      </Demo>
      <P>{t.use}</P>

      <H2>{t.yonH}</H2>
      <P>{t.yonP}</P>

      <H2>{t.rules}</H2>
      <Note>{t.plane}</Note>

      <H2>Props</H2>
      <Props of="Sheet" lang={lang} />
    </>
  );
}
