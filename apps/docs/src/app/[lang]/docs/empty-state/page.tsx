import { EmptyState, Button } from "tamga-ui";
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
  return { title: findPage("empty-state")!.title[lang] };
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
    lead: "Üç düzen, ve varsayılan yok: her biri altındaki ekran hakkında farklı bir soruya cevap veriyor.",
    kicker: "Ürün yok",
    title: "Kataloğun boş",
    note: "İlk ürünü ekleyince burada görünür.",
    action: "Ürün ekle",
    body: "Bir ürün eklediğinde stok, fiyat ve görselleri buradan yönetirsin.",
    layouts: (
      <>
        <code>banner</code> çalışan bir ekranın tepesindeki şerit · <code>ticket</code> tek ve
        tartışmasız bir sonraki adım · <code>routes</code> &quot;burada ne yapabilirim ki&quot;
        sorusu.
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
    lead: "Three layouts, and no default: each answers a different question about the screen beneath it.",
    kicker: "No products",
    title: "Your catalogue is empty",
    note: "Add your first product and it appears here.",
    action: "Add a product",
    body: "Once you add a product you manage its stock, price and images from here.",
    layouts: (
      <>
        <code>banner</code> is a strip at the top of a working screen · <code>ticket</code> is one
        undisputed next step · <code>routes</code> answers &quot;what can I even do here&quot;.
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
  const p = findPage("empty-state")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Note>{t.art}</Note>
      <Demo
        labels={dict.demo}
        align="start"
        code={`<EmptyState
  layout="ticket"
  art={myArt}
  kicker="${t.kicker}"
  title="${t.title}"
  note="${t.note}"
  action={<Button variant="primary">${t.action}</Button>}
>
  ${t.body}
</EmptyState>`}
      >
        <div className="w-full">
          <EmptyState
            layout="ticket"
            art={box}
            kicker={t.kicker}
            title={t.title}
            note={t.note}
            action={<Button variant="primary">{t.action}</Button>}
          >
            {t.body}
          </EmptyState>
        </div>
      </Demo>
      <P>{t.layouts}</P>

      <H2>{t.rules}</H2>
      <Note>{t.which}</Note>

      <H2>Props</H2>
      <Props of="EmptyState" lang={lang} />
    </>
  );
}
