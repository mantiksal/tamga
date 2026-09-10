import { Tooltip, Button } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("tooltip")!.title[lang] };
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
        Tooltip <strong>ek bilgi</strong> taşır, gerekli bilgi değil. Dokunmatik bir ekranda hover
        yoktur; bir tooltip&apos;te saklanan zorunlu bilgi telefonda hiç görünmez.
      </>
    ),
    open: "Hover ve odakla açılır; asla tıklama gerektirmez.",
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
        A tooltip carries <strong>extra</strong> information, never required information. There is
        no hover on a touch screen; anything mandatory hidden in a tooltip is invisible on a phone.
      </>
    ),
    open: "It opens on hover and on focus; it never requires a click.",
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

      <H2>{t.rules}</H2>
      <Note>{t.extra}</Note>
      <Note>{t.plane}</Note>

      <H2>Props</H2>
      <Props of="Tooltip" lang={lang} />
    </>
  );
}
