import { Beacon, LiveScope } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("beacon")!.title[lang] };
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
    liveLabel: "Canlı",
    waiting: "12 sipariş bekliyor",
    lead: (
      <>
        Nabzın çıplak hâli: bir durum rengi taşımaz, yalnız &quot;burası canlı&quot; der. Canlı bir
        akışın başlığında, bir sayacın yanında.
      </>
    ),
    rules: "Kurallar",
    label: (
      <>
        <code>label</code> zorunlu: yanıp sönen bir nokta ekran okuyucuda hiçbir şey değildir.{" "}
        <code>severity</code> ile rütbesini verebilirsin; vermezsen en yüksek rütbeyi ister ve{" "}
        <Xref to="live-scope">Live scope</Xref> içindeki yarışa girer.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Durum rengi taşıyan hâli <Xref to="dot">Dot</Xref>; yazılı hâli{" "}
        <Xref to="status-chip">Status chip</Xref>.
      </>
    ),
  },
  en: {
    liveLabel: "Live",
    waiting: "12 orders waiting",
    lead: (
      <>
        The pulse with nothing on it: no status colour, it only says &quot;this is live&quot;. In
        the header of a live feed, next to a counter.
      </>
    ),
    rules: "Rules",
    label: (
      <>
        <code>label</code> is required: a blinking dot is nothing at all to a screen reader. You
        can give it a rank with <code>severity</code>; without one it asks for the highest and
        enters the race inside <Xref to="live-scope">Live scope</Xref>.
      </>
    ),
    related: "Related",
    rel: (
      <>
        Carrying a status colour, <Xref to="dot">Dot</Xref>; with text,{" "}
        <Xref to="status-chip">Status chip</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("beacon")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} code={`<LiveScope>
  <Beacon live label="${t.liveLabel}" />
</LiveScope>`}>
        <LiveScope>
          <span className="flex items-center gap-3 text-[length:var(--docs-small)]">
            <Beacon live label={t.liveLabel} /> {t.waiting}
          </span>
        </LiveScope>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.label}</Note>

      <H2>Props</H2>
      <Props of="Beacon" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
