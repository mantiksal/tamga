import { EmptyNote, Button } from "tamga-ui";
/* Vitrin için basit bir yer tutucu çizim: kit "ne çizildiğini" sormaz. */
const box = ({ size }: { size: number; float: boolean }) => (
  <span
    aria-hidden
    className="tamga-card flex items-center justify-center font-mono text-caption text-ink-faint"
    style={{ width: size * 0.7, height: size * 0.7 }}
  >
    art
  </span>
);
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("empty-note")!.title[lang] };
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
    title: "Henüz kayıt yok",
    body: "İlk kaydı eklediğinde burada listelenir.",
    add: "Ekle",
    where: (
      <>
        Bir <Xref to="table">Table</Xref> gövdesinin ya da bir listenin içine girer: etrafındaki
        kart zaten vardır, o yüzden kendi kutusunu çizmez.
      </>
    ),
    which: (
      <>
        <strong>Dördü arasında seçim boşluğun NEREDE olduğuna göre yapılır</strong>, ne kadar boş
        olduğuna değil: <Xref to="empty-note">Empty note</Xref> içinde hiçbir şey olmayan SATIR ·{" "}
        <Xref to="empty-state">Empty state</Xref> içinde hiçbir şey olmayan YÜZEY ·{" "}
        <Xref to="empty-tile">Empty tile</Xref> sunduğun bir SEÇİM ·{" "}
        <Xref to="empty-blank">Empty blank</Xref> içinde hiçbir şey olmayan GÖVDE.
      </>
    ),
    art: (
      <>
        <strong>Çizim dışarıdan gelir.</strong> <code>art</code> bir render fonksiyonudur: slot
        kendi boyutunu bilir, çizim kendini o boyutta çizer. Her ürün kendi karakterini,
        fotoğrafını ya da hiçbir şeyini koyar; kit hangisi olduğunu sormaz.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
  },
  en: {
    title: "No records yet",
    body: "The first record you add is listed here.",
    add: "Add",
    where: (
      <>
        It goes inside a <Xref to="table">Table</Xref> body or a list: the card around it already
        exists, so it draws no box of its own.
      </>
    ),
    which: (
      <>
        <strong>Choosing between the four depends on WHERE the emptiness is</strong>, not how empty
        it is: <Xref to="empty-note">Empty note</Xref> is a ROW with nothing in it ·{" "}
        <Xref to="empty-state">Empty state</Xref> a SURFACE with nothing on it ·{" "}
        <Xref to="empty-tile">Empty tile</Xref> a CHOICE you are offering ·{" "}
        <Xref to="empty-blank">Empty blank</Xref> a BODY with nothing in it.
      </>
    ),
    art: (
      <>
        <strong>The drawing comes from outside.</strong> <code>art</code> is a render function: the
        slot knows its own size, the drawing draws itself at that size. Every product puts in its
        own character, a photograph, or nothing at all; the kit never asks which.
      </>
    ),
    rules: "Rules",
    related: "Related",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("empty-note")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Note>{t.art}</Note>
      <Demo
        labels={dict.demo}
        align="start"
        code={`<EmptyNote art={myArt} title="${t.title}" action={<Button size="sm">${t.add}</Button>}>
  ${t.body}
</EmptyNote>`}
      >
        <div className="tamga-card w-full overflow-hidden">
          <EmptyNote art={box} title={t.title} action={<Button size="sm">{t.add}</Button>}>
            {t.body}
          </EmptyNote>
        </div>
      </Demo>
      <P>{t.where}</P>

      <H2>{t.rules}</H2>
      <Note>{t.which}</Note>

      <H2>Props</H2>
      <Props of="EmptyNote" lang={lang} />
    </>
  );
}
