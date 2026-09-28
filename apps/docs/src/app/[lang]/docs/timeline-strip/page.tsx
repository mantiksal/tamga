import { TimelineStrip } from "tamga-ui";
import { OlayOrnegi } from "./ornek";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("timeline-strip")!.title[lang] };
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
/* 24 kova = son 24 saat, kova başına bir saat. İki "yavaş" ve bir kesinti:
   bir şeridin işi tam olarak bunları göstermek, ve hepsi yeşilken şerit
   hiçbir şey anlatmıyor. */
const SAATLER = [
  "positive", "positive", "positive", "caution", "positive", "positive",
  "positive", "positive", "danger", "positive", "positive", "positive",
  "positive", "caution", "positive", "positive", "positive", "positive",
  "positive", "positive", "positive", "positive", "positive", "positive",
] as const;

const T = {
  tr: {
    lead: (
      <>
        Kova başına bir işaret, renk durumu taşır. Bir e-ticaret panelinde günlük sipariş
        yoğunluğu, bir depoda stok durumu, bir kontrol panelinde erişilebilirlik; aynı şerit.
      </>
    ),
    from: "24 saat önce",
    olayH: "Olay şeridi",
    olayP: (
      <>
        Aynı sorunun ikinci biçimi. Kovalar bir <strong>akışı</strong> ölçüyor (24 saat, her
        kovada bir sağlık), adımlar ise <strong>durakları</strong> adlandırıyor: siparişin
        geçmişi. Çizgi iki parça · arkada sessiz olan baştan sona, üstünde vurgu olan şu an
        durduğu yere kadar. Karolardan yalnız olmuş olanlar yükseliyor; olmamış bir adımın
        tabanı, olmuş gibi okunuyordu.
      </>
    ),
    olaylar: [
      { label: "Sipariş alındı", time: "14:02", state: "done" as const },
      { label: "Ödeme onaylandı", time: "14:03", state: "done" as const },
      { label: "Hazırlandı", time: "16:40", state: "done" as const },
      { label: "Kargoya verildi", time: "Yarın 10:00", state: "current" as const },
      { label: "Teslim", time: "–", state: "todo" as const },
    ],
    to: "şimdi",
    durum: { positive: "sorunsuz", caution: "yavaş", danger: "kesinti" } as Record<string, string>,
    saatAraligi: (i: number) => `${String((i + 0) % 24).padStart(2, "0")}:00 - ${String((i + 1) % 24).padStart(2, "0")}:00`,
    gap: (
      <>
        Kovalar arasında <strong>boşluk var</strong>: bitişik bir şerit tek bir sürekli çubuk gibi
        okunur, boşluk &quot;bunlar ayrı ölçümler&quot; der.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Bir SAYININ zaman içindeki seyri için <Xref to="sparkline">Sparkline</Xref>; o değeri
        çizer, bu durumu.
      </>
    ),
  },
  en: {
    lead: (
      <>
        One mark per bucket, carrying a colour for its state. Daily order volume in an e-commerce
        panel, stock condition in a warehouse, availability in a control panel; the same strip.
      </>
    ),
    from: "24 hours ago",
    olayH: "The event strip",
    olayP: (
      <>
        The second shape of the same question. Buckets measure a <strong>run</strong> (24 hours,
        one health per bucket); steps name the <strong>stations</strong>: an order's history. The
        line is two pieces · a quiet one end to end, an accent one up to where it stands now.
        Only the steps that happened are raised; a base under something that has not happened
        read as if it had.
      </>
    ),
    olaylar: [
      { label: "Order placed", time: "14:02", state: "done" as const },
      { label: "Payment approved", time: "14:03", state: "done" as const },
      { label: "Prepared", time: "16:40", state: "done" as const },
      { label: "Handed to courier", time: "Tomorrow 10:00", state: "current" as const },
      { label: "Delivered", time: "–", state: "todo" as const },
    ],
    to: "now",
    durum: { positive: "healthy", caution: "slow", danger: "outage" } as Record<string, string>,
    saatAraligi: (i: number) => `${String((i + 0) % 24).padStart(2, "0")}:00 - ${String((i + 1) % 24).padStart(2, "0")}:00`,
    gap: (
      <>
        There is a <strong>gap</strong> between buckets: a continuous strip reads as one single
        bar, while the gap says &quot;these are separate measurements&quot;.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For a NUMBER moving over time, <Xref to="sparkline">Sparkline</Xref>; that draws a value,
        this draws a state.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("timeline-strip")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo yuzey labels={dict.demo} align="start" code={`<TimelineStrip data={strip} labels={["${t.from}", "${t.to}"]} />`}>
        <div className="w-full">
          <TimelineStrip
            data={SAATLER}
            labels={[t.from, t.to]}
            /* `describe` olmadan şerit ekran okuyucuya 24 boş kutu · ve fareyle
               bakan da hangi saate baktığını bilmiyor. */
            describe={(i, tone) => `${t.saatAraligi(i)} · ${t.durum[tone] ?? tone}`}
          />
        </div>
      </Demo>
      <P>{t.gap}</P>

      <H2>{t.olayH}</H2>
      <Demo yuzey labels={dict.demo} align="start" grid={false} code={`<TimelineStrip
  steps={[
    { label: "${t.olaylar[0]?.label}", time: "${t.olaylar[0]?.time}", state: "done", icon: ShoppingCart },
    { label: "${t.olaylar[3]?.label}", time: "${t.olaylar[3]?.time}", state: "current", icon: Truck },
    { label: "${t.olaylar[4]?.label}", time: "–", state: "todo", icon: House },
  ]}
/>`}>
        <OlayOrnegi adimlar={t.olaylar} />
      </Demo>
      <P>{t.olayP}</P>

      <H2>Props</H2>
      <Props of="TimelineStrip" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
