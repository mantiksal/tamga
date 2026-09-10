import { DialogDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("dialog")!.title[lang] };
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
        Bir karar istiyorsa diyalog. Dışarı tıklamak kapatmaz, çünkü yanlışlıkla kapatılan bir
        karar, sorulmamış bir karardır.
      </>
    ),
    scrim: (
      <>
        Sayfayı karartır: arkadaki her şey erişilemez hâle gelir, odak diyaloğun içinde döner.
        Karartmıyorsa diyalog değildir.
      </>
    ),
    rules: "Kurallar",
    boyH: "Dört boy",
    boyP: (
      <>
        <code>md</code> varsayılan ve bir KARAR kutusudur; geniş bir karar kutusu kararı daha
        kolay yapmıyor. <code>lg</code> karara bir tablo ya da bir form eşlik ediyorsa.{" "}
        <code>wide</code> bir ÖNİZLEME için: tam bir ekranı 448 pikselde göstermek, gösterdiğini
        gizlemek olur. <code>full</code> ise bir ÇALIŞMA YÜZEYİ için: bir görsel düzenleyici, bir
        tuval, bir harita seçici.
      </>
    ),
    boyN: (
      <>
        <code>full</code> boyda panelin kenarı, yarıçapı ve kaydırma gölgesi kalkıyor:{" "}
        <strong>üçü de &ldquo;bu şey sayfanın üstünde duruyor&rdquo; demek için var</strong>, ve
        sayfanın tamamını kaplayan bir şeyin altında sayfa kalmıyor. Gövde kendi içinde kayıyor,
        başlık ile ayak yerinde duruyor. Nadir olması gerekiyor: bir formu tam ekran açmak, formu
        daha kolay doldurmuyor.
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
    related: "İlgili",
    confirmH: "Onay diyaloğu",
    confirmP: (
      <>
        Yıkıcı bir eylemin önündeki kapı. <code>Dialog</code>&apos;un üstüne kurulu ama üç kararı
        kendi veriyor: onay düğmesi işin <strong>fiilini</strong> taşır (&ldquo;Tamam&rdquo; değil),
        odak <strong>Vazgeç</strong>&apos;te açılır, ve gövde metni ne olacağını değil neyin geri
        gelmeyeceğini söyler.
      </>
    ),
    confirmTone: (
      <>
        <code>tone</code> onay düğmesinin ağırlığını seçiyor: <code>danger</code> geri alınamaz bir
        kayıp için, <code>primary</code> ise yalnızca dikkat isteyen bir adım için. Her iki durumda
        da diyalog aynı kapıyı kuruyor; değişen tek şey kaybın büyüklüğü.
      </>
    ),
    confirmNote: (
      <>
        Odağın onay düğmesinde açılması, Enter&apos;a basan birinin kaydı silmesi demek. Güvenli
        olan varsayılan olmalı; yıkıcı düğme en sağda, yani farenin ileri yönünde değil.
      </>
    ),
  },
  en: {
    lead: (
      <>
        If it asks for a decision, it is a dialog. Clicking outside does not close it: a decision
        dismissed by accident is a decision that was never asked.
      </>
    ),
    scrim: (
      <>
        It dims the page: everything behind becomes unreachable and focus cycles inside the
        dialog. If it does not dim, it is not a dialog.
      </>
    ),
    rules: "Rules",
    boyH: "Four sizes",
    boyP: (
      <>
        <code>md</code> is the default and it is a DECISION box; a wider decision box does not make
        the decision easier. <code>lg</code> is for when a table or a form comes with the decision.{" "}
        <code>wide</code> is for a PREVIEW: showing a whole screen at 448px hides the thing you are
        showing. <code>full</code> is for a WORK SURFACE, such as an image editor, a canvas, or a
        map picker.
      </>
    ),
    boyN: (
      <>
        At <code>full</code> the panel loses its edge, its radius and its offset shadow:{" "}
        <strong>all three exist to say &ldquo;this thing sits on top of the page&rdquo;</strong>,
        and nothing is left underneath something that covers the whole page. The body scrolls inside
        itself while the head and the foot stay put. It should stay rare: opening a form full screen
        does not make the form easier to fill in.
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
    related: "Related",
    confirmH: "Confirm dialog",
    confirmP: (
      <>
        The gate in front of a destructive action. Built on <code>Dialog</code>, but it makes three
        decisions of its own: the confirm button carries the <strong>verb</strong> (never
        &ldquo;OK&rdquo;), focus opens on <strong>Cancel</strong>, and the body says what will not
        come back rather than what will happen.
      </>
    ),
    confirmTone: (
      <>
        <code>tone</code> picks the weight of the confirm button: <code>danger</code> for an
        irreversible loss, <code>primary</code> for a step that only needs attention. The gate is
        the same either way; what changes is the size of the loss.
      </>
    ),
    confirmNote: (
      <>
        Opening focus on the confirm button means anyone who hits Enter deletes the record. The safe
        choice has to be the default; the destructive button sits furthest right, away from the
        mouse&apos;s forward direction.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("dialog")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} code={`<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="…"
  closeLabel="…"
  footer={<><Button>…</Button><Button variant="danger">…</Button></>}
>
  …
</Dialog>`}>
        <DialogDemo lang={lang} />
      </Demo>

      <H2>{t.rules}</H2>
      <P>{t.scrim}</P>
      <Note>{t.plane}</Note>

      <H2>{t.boyH}</H2>
      <P>{t.boyP}</P>
      <Note>{t.boyN}</Note>

      <H2>Props</H2>
      <Props of="Dialog" lang={lang} />

      <H2>{t.confirmH}</H2>
      <P>{t.confirmP}</P>
      <P>{t.confirmTone}</P>
      <Note>{t.confirmNote}</Note>
      <Props of="ConfirmDialog" lang={lang} />
    </>
  );
}
