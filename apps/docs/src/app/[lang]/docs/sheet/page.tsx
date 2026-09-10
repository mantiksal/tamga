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

      <H2>{t.rules}</H2>
      <Note>{t.plane}</Note>

      <H2>Props</H2>
      <Props of="Sheet" lang={lang} />
    </>
  );
}
