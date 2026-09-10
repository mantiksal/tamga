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
            <ScrollX label={t.col}>
              <div className="flex w-[var(--docs-overflow-demo)] gap-4 p-4">
                {Array.from({ length: 9 }, (_, i) => (
                  <span
                    key={i}
                    className="tamga-surface flex h-16 w-24 shrink-0 items-center justify-center font-mono text-caption text-ink-faint"
                  >
                    {t.col} {i + 1}
                  </span>
                ))}
              </div>
            </ScrollX>
          </Card>
        </div>
      </Demo>

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
