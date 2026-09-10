import { FileUploadDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("file-upload")!.title[lang] };
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
        Bir e-ticaret panelinde görsellerin <strong>sırası veridir</strong>: ilk görsel kartta
        görünendir. Sıralamayı desteklemeyen bir yükleyici, kullanıcıyı hepsini silip doğru sırayla
        yeniden yüklemeye zorlar, ve gerçekten yapılan budur.
      </>
    ),
    arrows: (
      <>
        Sıralama <strong>ok düğmeleriyle de</strong> yapılır, yalnız sürükleyerek değil:
        sürükle-bırak klavye kullanan biri için yok hükmündedir, ve dokunmatik ekranda
        güvenilmezdir.
      </>
    ),
    rules: "Kurallar",
    noUpload: (
      <>
        <strong>Kit dosya yüklemez.</strong> <code>onAdd</code> seçilen <code>File</code>{" "}
        nesnelerini verir; nereye gideceği, hangi uçla, hangi ilerleme göstergesiyle, ürünün
        kararı. Kit seçmeyi, göstermeyi, sıralamayı ve silmeyi yapar.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Yükleme yüzdesini göstermek için <Xref to="progress">Progress</Xref>; küçük ok düğmeleri{" "}
        <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        In an e-commerce panel the <strong>order of images is data</strong>: the first image is the
        one on the card. An uploader that does not support reordering forces the user to delete
        them all and upload again in the right order, and that is what actually happens.
      </>
    ),
    arrows: (
      <>
        Reordering also works <strong>with arrow buttons</strong>, not only by dragging:
        drag-and-drop does not exist for someone using a keyboard, and it is unreliable on a touch
        screen.
      </>
    ),
    rules: "Rules",
    noUpload: (
      <>
        <strong>The kit does not upload files.</strong> <code>onAdd</code> hands you the selected{" "}
        <code>File</code> objects; where they go, through which endpoint, with which progress
        indicator: that is the product&apos;s decision. The kit does the choosing, showing,
        reordering and removing.
      </>
    ),
    related: "Related",
    rel: (
      <>
        To show upload percentage, <Xref to="progress">Progress</Xref>; the small arrow buttons are{" "}
        <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("file-upload")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" grid={false} code={`<FileUpload
  items={items}
  onAdd={(files) => …}
  onRemove={(id) => …}
  onReorder={(id, dir) => …}
  labels={{ drop: "…", browse: "…", remove: "…", moveLeft: "…", moveRight: "…", primary: "…" }}
/>`}>
        <FileUploadDemo lang={lang} />
      </Demo>
      <P>{t.arrows}</P>

      <H2>{t.rules}</H2>
      <Note>{t.noUpload}</Note>

      <H2>Props</H2>
      <Props of="FileUpload" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
