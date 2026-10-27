import { Tooltip, Button } from "tamga-ui";
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
  return sayfaMeta("tooltip", lang);
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
    hover: "Üstüne gel",
    label: "Son 24 saatteki değişim",
    top: "üstte", bottom: "altta", left: "solda", right: "sağda",
    short: "Son 24 saat",
    placements: "Dört yerleşim",
    placementsWhy: (
      <>
        <code>placement</code> dördü de destekliyor ve <strong>varsayılan
        <code> bottom</code></strong>. Seçim estetik değil <em>yer</em> meselesi: bir tooltip
        ekranın kenarına taşarsa okunmaz olur, ve bileşen bunu kendi kendine düzeltmiyor:
        sayfanın tepesindeki bir kontrol <code>bottom</code>, altındaki <code>top</code> almalı.
      </>
    ),
    arrow: (
      <>
        Ok da yerleşimle birlikte dönüyor. Kutu bir zamanlar dört yerleşimde de 12×6&apos;ydı ve
        yatay olanlarda ok yamuk duruyordu; şimdi yön başına ayrı ölçü var.
      </>
    ),
    extra: (
      <>
        Tooltip <strong>ek bilgi</strong> taşır, gerekli bilgi değil. Telefonda dokununca açılıyor,
        ama kimse dokunmak zorunda olduğunu bilmiyor: zorunlu bilgi sayfada yazılı durmalı.
      </>
    ),
    open: (
      <>
        Masaüstünde üstüne gelince ve odakla açılır. Dokunmatik ekranda <strong>dokununca</strong>{" "}
        açılır, başka yere dokununca kapanır: telefonda üstüne gelmek yok, ve iOS Safari dokunulan
        düğmeye odak da vermiyor.
      </>
    ),
    sentence: "Cümle · wrap",
    sentenceWhy: (
      <>
        Tooltip bir etikettir ve tek satırdır. Açıklama gerçekten bir cümleyse (bir durumun neden
        öyle okunduğu) <code>wrap</code> onu <strong>288px</strong>&apos;te, Popover&apos;ın
        genişliğinde satır kırdırır; tek satır olarak ekranı boydan boya geçmez. Kabarcık ekranın
        kenarına yakınsa 16px pay kalacak kadar içeri kayar, ok tetikleyiciyi göstermeye devam
        eder.
      </>
    ),
    sentenceLabel:
      "Şimdiye kadar yaptığımız ölçümlerde acil bir sorun görmedik. Ölçümler henüz tamamlanmadı; tamamlandıkça durum güncellenir.",
    sentenceTrigger: "Eksik ölçüm var",
    gecikme: (
      <>
        Fare <strong>400ms bekliyor</strong> (<code>delay</code>), klavye odağı{" "}
        <strong>beklemiyor</strong>: ekranı geçen bir farenin arkasında sıra sıra kabarcık
        açılmamalı, ama Tab&apos;la buraya gelen kişi onu bilerek istedi. <code>Esc</code>{" "}
        kapatıyor, çünkü odak tetikleyicide kalıyor ve kabarcığın başka çıkışı yok.
      </>
    ),
    bag: (
      <>
        Etiket <code>aria-describedby</code> ile tetikleyiciye <strong>bağlı</strong>, ve bağın
        hedefi her zaman DOM&apos;da: ekran okuyucu açıklamayı odak anında okuyor, kabarcık ise o
        an henüz açılmamış olabiliyor. Görünen kopya <code>aria-hidden</code>, yani metin iki kez
        okunmuyor.
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
    hover: "Hover me",
    label: "Change over the last 24 hours",
    top: "top", bottom: "bottom", left: "left", right: "right",
    short: "Last 24 hours",
    placements: "Four placements",
    placementsWhy: (
      <>
        <code>placement</code> supports all four and <strong>defaults to
        <code> bottom</code></strong>. The choice is not aesthetic but a matter of <em>room</em>: a
        tooltip that spills off the edge of the screen is unreadable, and the component does not
        fix that for you: a control at the top of the page wants <code>bottom</code>, one at the
        bottom wants <code>top</code>.
      </>
    ),
    arrow: (
      <>
        The arrow turns with the placement too. The box was once 12×6 for all four, and on the
        sideways ones the arrow sat crooked; now each direction has its own measurement.
      </>
    ),
    extra: (
      <>
        A tooltip carries <strong>extra</strong> information, never required information. On a phone
        it opens on a tap, but nobody knows they have to tap: anything mandatory belongs written on
        the page.
      </>
    ),
    open: (
      <>
        On a desktop it opens on hover and on focus. On a touch screen it opens on a{" "}
        <strong>tap</strong> and closes on a tap elsewhere: a phone has no hover, and iOS Safari
        does not even focus a tapped button.
      </>
    ),
    sentence: "A sentence · wrap",
    sentenceWhy: (
      <>
        A tooltip is a label, and a label is one line. When the explanation really is a sentence
        (why a status reads as it does), <code>wrap</code> breaks it into lines at{" "}
        <strong>288px</strong>, the Popover&apos;s width, instead of running it across the screen.
        Near the screen&apos;s edge the bubble slides in until 16px is left, and the arrow keeps
        pointing at the trigger.
      </>
    ),
    sentenceLabel:
      "We found nothing urgent in the measurements made so far. Measuring is not finished yet; the status updates as the rest comes in.",
    sentenceTrigger: "Missing measurements",
    gecikme: (
      <>
        The pointer <strong>waits 400ms</strong> (<code>delay</code>), keyboard focus{" "}
        <strong>does not</strong>: a mouse crossing the screen should not leave a trail of
        bubbles behind it, but someone who tabbed here asked for it. <code>Esc</code> closes it,
        because focus stays on the trigger and the bubble has no other way out.
      </>
    ),
    bag: (
      <>
        The label is tied to the trigger with <code>aria-describedby</code>, and the target of
        that tie is <strong>always</strong> in the DOM: a screen reader reads the description the
        moment focus lands, while the bubble may not be open yet. The visible copy is{" "}
        <code>aria-hidden</code>, so the text is not read twice.
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
  const p = findPage("tooltip")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <H2>{t.placements}</H2>
      <P>{t.placementsWhy}</P>
      <Demo
        labels={dict.demo}
        code={`<Tooltip label="…" placement="top">…</Tooltip>
<Tooltip label="…" placement="right">…</Tooltip>
<Tooltip label="…" placement="bottom">…</Tooltip>
<Tooltip label="…" placement="left">…</Tooltip>`}
      >
        {/* Dört yerleşim de görünmeli — ve her biri kendi yönünde yer bulabilsin
            diye örnekler bol boşluklu bir ızgarada duruyor. */}
        <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-x-6 gap-y-12 py-8">
          {(
            [
              ["top", t.top],
              ["right", t.right],
              ["bottom", t.bottom],
              ["left", t.left],
            ] as const
          ).map(([p, name]) => (
            <span key={p} className="flex justify-center">
              <Tooltip label={t.short} placement={p}>
                <Button>{name}</Button>
              </Tooltip>
            </span>
          ))}
        </div>
      </Demo>
      <P>{t.arrow}</P>
      <P>{t.open}</P>

      <H2>{t.sentence}</H2>
      <P>{t.sentenceWhy}</P>
      <Demo labels={dict.demo} code={`<Tooltip wrap label="…">…</Tooltip>`}>
        <div className="flex justify-center py-6">
          <Tooltip wrap label={t.sentenceLabel}>
            <Button>{t.sentenceTrigger}</Button>
          </Tooltip>
        </div>
      </Demo>

      <H2>{t.rules}</H2>
      <P>{t.gecikme}</P>
      <P>{t.bag}</P>
      <Note>{t.extra}</Note>
      <Note>{t.plane}</Note>

      <H2>Props</H2>
      <Props of="Tooltip" lang={lang} />
    </>
  );
}
