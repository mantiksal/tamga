import { ScrollX, Table, Card } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("scroll-x")!.title[lang] };
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
        Yatay taşma kabı, ve asıl işi görünüm değil <strong>erişilebilirlik</strong>.
      </>
    ),
    keyboard: (
      <>
        <code>overflow-x: auto</code> tek başına <strong>yalnız fare için</strong> çalışır. Klavye
        kullanan biri o kutuya hiç giremez: kaydırılabilir bir alan odaklanabilir değilse
        içindeki geniş tabloyu yana kaydırmanın yolu yoktur. Tarayıcılar bunu kendiliğinden
        çözmüyor.
      </>
    ),
    label: (
      <>
        <code>label</code> zorunlu: adsız bir <code>region</code>, ekran okuyucunun landmark
        listesinde &quot;bölge, bölge, bölge&quot; olarak birikir ve hiçbirinin ne olduğu
        bilinmez.
      </>
    ),
    col: "Sütun",
    rel: (
      <>
        Tablo zaten kendi taşma kabını taşıyor: <Xref to="table">Table</Xref>. Bu, tablo
        olmayan geniş içerik için.
      </>
    ),
    gap: (
      <>
        <strong>Bu bileşen yeni bir şey icat etmiyor.</strong> Sınıfı kitte zaten vardı; eksik
        olan, doğru işaretlemenin tek bir yerde durmasıydı. <code>.tamga-scroll-x</code> kitte yıllarca
        vardı ve işaretlemesini her çağıran kendi yazıyordu; bedeli görünmezdi ama gerçekti.
      </>
    ),
    onerilen: "Önerilen ürünler",
    gorsel: "ürün görseli",
    urunler: [
      ["Deri kartlık", "₺349"],
      ["Pamuk havlu 2'li", "₺279"],
      ["Bambu çorap", "₺159"],
      ["Keten pantolon", "₺1.099"],
      ["Seramik kupa", "₺189"],
      ["Yün atkı", "₺429"],
    ],
    sola: "Sola kaydır",
    saga: "Sağa kaydır",
    oklar: (
      <>
        <code>controls</code> şeridin başına <strong>iki ok düğmesi</strong> koyuyor. Her tıklama
        şeridi <strong>bir görünür genişlik</strong> kaydırıyor, bir kart değil: kart boyu bir
        adım, şeridin kartın ne olduğunu bilmesini gerektirirdi. Tam genişlik yerine %90, çünkü
        kenardaki kart hiç görünmeden geçince okuyan kişi yerini kaybediyor. Oklar klavyeyi
        <strong> ikame etmiyor</strong>: şerit zaten odaklanabilir ve ok tuşlarıyla kayıyor.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
  },
  en: {
    lead: (
      <>
        A horizontal overflow container, and its real job is not appearance but{" "}
        <strong>accessibility</strong>.
      </>
    ),
    keyboard: (
      <>
        <code>overflow-x: auto</code> on its own works <strong>only for a mouse</strong>. Someone
        using a keyboard cannot enter that box at all: if a scrollable area is not focusable,
        there is no way to scroll the wide table inside it. Browsers do not solve this for you.
      </>
    ),
    label: (
      <>
        <code>label</code> is required: an unnamed <code>region</code> piles up in a screen
        reader&apos;s landmark list as &quot;region, region, region&quot; with no way to tell
        which is which.
      </>
    ),
    col: "Column",
    rel: (
      <>
        A table already carries its own overflow container: <Xref to="table">Table</Xref>. This
        is for wide content that is not a table.
      </>
    ),
    gap: (
      <>
        <strong>This component invents nothing.</strong> The class was already in the kit; what
        was missing was one place holding the correct markup. <code>.tamga-scroll-x</code> was in the kit for
        years and every caller wrote its markup by hand: the cost was invisible but real.
      </>
    ),
    onerilen: "Recommended products",
    gorsel: "product image",
    urunler: [
      ["Leather card holder", "₺349"],
      ["Cotton towels, 2", "₺279"],
      ["Bamboo socks", "₺159"],
      ["Linen trousers", "₺1.099"],
      ["Ceramic mug", "₺189"],
      ["Wool scarf", "₺429"],
    ],
    sola: "Scroll left",
    saga: "Scroll right",
    oklar: (
      <>
        <code>controls</code> puts <strong>two arrow buttons</strong> at the head of the strip.
        Each click moves it by <strong>one visible width</strong>, not by one card: a card-sized
        step would need the strip to know what a card is. 90% of the width rather than all of it,
        because a card that passes without ever being seen loses the reader&apos;s place. The
        arrows <strong>do not replace the keyboard</strong>: the strip is focusable and scrolls
        with the arrow keys already.
      </>
    ),
    rules: "Rules",
    related: "Related",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("scroll-x")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<ScrollX label="…">
  <div className="w-[var(--docs-overflow-demo)]">…</div>
</ScrollX>`}>
        <div className="w-full">
          <Card>
            <ScrollX
              label={t.col}
              title={t.onerilen}
              controls={{ left: t.sola, right: t.saga }}
              className="p-4"
            >
              <div className="flex gap-4">
                {t.urunler.map(([ad, fiyat]) => (
                  <span key={ad} className="tamga-card flex w-45 shrink-0 flex-col overflow-hidden">
                    <span className="docs-gorsel flex h-27 items-center justify-center border-b border-line font-mono text-caption text-ink-faint">
                      {t.gorsel}
                    </span>
                    <span className="flex flex-col gap-1 px-3 py-2.5">
                      <strong className="text-small">{ad}</strong>
                      <span className="font-mono text-small font-bold">{fiyat}</span>
                    </span>
                  </span>
                ))}
              </div>
            </ScrollX>
          </Card>
        </div>
      </Demo>

      <P>{t.oklar}</P>

      <H2>{t.rules}</H2>
      <Note>{t.keyboard}</Note>
      <Note>{t.label}</Note>
      <Note>{t.gap}</Note>

      <H2>Props</H2>
      <Props of="ScrollX" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
