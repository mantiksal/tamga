import { PopoverDemo } from "@/components/interactive";
import { KontrolluPopover } from "./ornek";
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
  return sayfaMeta("popover", lang);
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
        Küçük bir iş: bir süzgeç, kısa bir form, bir açıklama. Sayfayı karartmaz; akışı
        kesmediği için arkadaki içerik okunur kalır.
      </>
    ),
    align: (
      <>
        <code>align</code>, panelin tetikleyiciye hangi kenardan hizalanacağı:{" "}
        <code>start</code> (varsayılan) sola, <code>end</code> sağa. Sayfanın sağ kenarına yakın
        bir tetikleyicide <code>end</code> gerekir, yoksa panel ekrandan taşar, ve bileşen bunu
        kendi kendine düzeltmez.
      </>
    ),
    kontrolH: "Durumu ürün tutuyor",
    kontrolP: (
      <>
        <code>open</code> verilince panel <strong>kontrollü</strong>: açık olup olmadığını ürün tutar,
        her değişikliği <code>onOpenChange</code> ile duyar (tetik, Escape, dışarı tıklama, kapatma
        kontrolü). Satırlarından biri seçilince kapanması gereken bir bildirim paneli için. Verilmezse
        panel durumunu kendisi tutar, eskisi gibi.
      </>
    ),
    bildirimler: "Bildirimler",
    bildirimSatirlari: ["Yedekleme tamamlandı", "Yeni yorum: Ada", "Fatura hazır"],
    secilenSayac: "Seçilen",
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
        A small job: a filter, a short form, an explanation. It does not dim the page, because it
        does not break the flow, the content behind stays readable.
      </>
    ),
    align: (
      <>
        <code>align</code> is which edge the panel lines up with: <code>start</code> (the
        default) to the left, <code>end</code> to the right. Near the right edge of the page you
        need <code>end</code>, otherwise the panel spills off screen, and the component does not
        fix that for you.
      </>
    ),
    kontrolH: "The product holds the state",
    kontrolP: (
      <>
        With <code>open</code> the panel is <strong>controlled</strong>: the product holds whether it
        is open and hears every change through <code>onOpenChange</code> (the trigger, Escape, a
        click away, the close control). For a notifications panel that must close once one of its
        rows is picked. Without it the panel keeps its own state, as before.
      </>
    ),
    bildirimler: "Notifications",
    bildirimSatirlari: ["Backup finished", "New comment: Ada", "Invoice ready"],
    secilenSayac: "Picked",
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
  const p = findPage("popover")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} code={`<Popover trigger={<Button>…</Button>} title="…" closeLabel="…">
  <p>…</p>
</Popover>`}>
        <PopoverDemo lang={lang} />
      </Demo>

      <P>{t.align}</P>

      <H2>{t.kontrolH}</H2>
      <P>{t.kontrolP}</P>
      <Demo labels={dict.demo} code={`const [open, setOpen] = useState(false);
<Popover open={open} onOpenChange={setOpen} trigger={<Button>${t.bildirimler}</Button>}>
  <ListRow onClick={() => { pick(row); setOpen(false); }}>…</ListRow>
</Popover>`}>
        <KontrolluPopover tetik={t.bildirimler} baslik={t.bildirimler} satirlar={[...t.bildirimSatirlari]} sayac={t.secilenSayac} />
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.plane}</Note>

      <H2>Props</H2>
      <Props of="Popover" lang={lang} />
    </>
  );
}
