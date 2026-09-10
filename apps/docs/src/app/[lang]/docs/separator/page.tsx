import { Separator } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("separator")!.title[lang] };
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
    above: "Üstteki",
    below: "Alttaki",
    left: "Sol",
    right: "Sağ",
    vertical: (
      <>
        <code>vertical</code> hâli satır içinde kullanılır ve yüksekliğini komşusundan alır;
        sabit bir yükseklik verseydik, yanındaki metin büyüdüğünde çizgi kısa kalırdı.
      </>
    ),
    rules: "Kurallar",
    grouping: (
      <>
        Bir ayraç <strong>gruplandırma</strong> anlamına gelir, dekorasyon değil. İki şey arasına
        çizgi koymak &quot;bunlar farklı şeyler&quot; demektir; aynı şeylerin arasına konursa
        okuyanı yanıltır. Boşluk çoğu zaman daha iyi bir ayraçtır.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Bir bölümü başlıkla ayırmak için <Xref to="section-head">Section head</Xref>; bir menü
        içindeki ayraç <Xref to="dropdown-menu">Dropdown menu</Xref>&apos;nün kendi öğesidir.
      </>
    ),
  },
  en: {
    above: "Above",
    below: "Below",
    left: "Left",
    right: "Right",
    vertical: (
      <>
        The <code>vertical</code> form is used inline and takes its height from its neighbour; had
        we fixed a height, the rule would fall short the moment the text beside it grew.
      </>
    ),
    rules: "Rules",
    grouping: (
      <>
        A separator means <strong>grouping</strong>, not decoration. Putting a line between two
        things says &quot;these are different things&quot;; placed between like things it misleads
        the reader. Space is often the better separator.
      </>
    ),
    related: "Related",
    rel: (
      <>
        To separate a section with a heading, <Xref to="section-head">Section head</Xref>; a
        separator inside a menu is <Xref to="dropdown-menu">Dropdown menu</Xref>&apos;s own item.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("separator")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} code={`<Separator />
<Separator vertical />`}>
        <div className="flex w-full max-w-80 flex-col gap-4">
          <span className="text-[length:var(--docs-small)]">{t.above}</span>
          <Separator />
          <span className="text-[length:var(--docs-small)]">{t.below}</span>
          <span className="mt-4 flex items-center gap-4 text-[length:var(--docs-small)]">
            {t.left} <Separator vertical /> {t.right}
          </span>
        </div>
      </Demo>
      <P>{t.vertical}</P>

      <H2>{t.rules}</H2>
      <Note>{t.grouping}</Note>

      <H2>Props</H2>
      <Props of="Separator" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
