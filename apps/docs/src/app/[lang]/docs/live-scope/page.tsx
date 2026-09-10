import { LiveScope, StatusChip, Beacon } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("live-scope")!.title[lang] };
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
    critical: "Kritik",
    warning: "Uyarı",
    healthy: "Sağlıklı",
    law: (
      <>
        <strong>Yasa 4: ekranda tek parlaklık nabzı.</strong> Bu bileşen o yasanın mekanik
        karşılığı: bir kural değil, bir hakem.
      </>
    ),
    race: (
      <>
        İçindeki her <code>live</code> öğe &quot;ben atmak istiyorum&quot; diye bir TALEP bırakır;
        LiveScope en yüksek rütbeliyi seçer ve yalnız ona izin verir. Aşağıda dört öğe istiyor,
        biri atıyor:
      </>
    ),
    rules: "Kurallar",
    why: (
      <>
        <strong>Neden bir bileşen, bir kural değil.</strong> &quot;Sayfada tek nabız&quot; yazılı
        bir kural olarak kalsaydı, iki ayrı geliştiricinin iki ayrı bileşene koyduğu iki nabız
        kimsenin hatası olmadan bir arada belirirdi. Kapsam bunu imkânsız kılıyor: talep etmek
        serbest, atmak yarışmalı.
      </>
    ),
    rank: (
      <>
        Rütbe varsayılanı: yalnız <code>danger</code> atar. <code>caution</code> zaten kendi
        rengini taşıyor; nabız &quot;şuraya bak, şimdi&quot; için ayrılmış. Ürün kendi sırasını{" "}
        <code>severity</code> prop&apos;uyla verir.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Nabız isteyenler: <Xref to="status-chip">Status chip</Xref> ·{" "}
        <Xref to="dot">Dot</Xref> · <Xref to="beacon">Beacon</Xref>.
      </>
    ),
  },
  en: {
    liveLabel: "Live",
    critical: "Critical",
    warning: "Warning",
    healthy: "Healthy",
    law: (
      <>
        <strong>Law 4: one brightness pulse per screen.</strong> This component is that law made
        mechanical, not a rule, a referee.
      </>
    ),
    race: (
      <>
        Every <code>live</code> element inside leaves a REQUEST saying &quot;I would like to
        pulse&quot;; LiveScope picks the highest-ranked one and allows only that. Below, four ask
        and one pulses:
      </>
    ),
    rules: "Rules",
    why: (
      <>
        <strong>Why a component and not a rule.</strong> Had &quot;one pulse per page&quot; stayed
        a written rule, two pulses placed by two developers in two different components would show
        up together without anyone being at fault. The scope makes that impossible: asking is
        free, pulsing is contested.
      </>
    ),
    rank: (
      <>
        The default rank: only <code>danger</code> pulses. <code>caution</code> already carries its
        own colour; the pulse is reserved for &quot;look here, now&quot;. A product sets its own
        order with the <code>severity</code> prop.
      </>
    ),
    related: "Related",
    rel: (
      <>
        The ones that ask to pulse: <Xref to="status-chip">Status chip</Xref> ·{" "}
        <Xref to="dot">Dot</Xref> · <Xref to="beacon">Beacon</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("live-scope")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.law}</P>
      <P>{t.race}</P>
      <Demo labels={dict.demo} align="start" code={`<LiveScope>
  <Beacon live label="${t.liveLabel}" />
  <StatusChip label="${t.critical}" state="danger"   dot live />
  <StatusChip label="${t.warning}"  state="caution"  dot live />
  <StatusChip label="${t.healthy}"  state="positive" dot live />
</LiveScope>`}>
        <LiveScope>
          <span className="flex flex-wrap items-center gap-4">
            <Beacon live label={t.liveLabel} />
            <StatusChip label={t.critical} state="danger" dot live />
            <StatusChip label={t.warning} state="caution" dot live />
            <StatusChip label={t.healthy} state="positive" dot live />
          </span>
        </LiveScope>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.why}</Note>
      <P>{t.rank}</P>

      <H2>Props</H2>
      <Props of="LiveScope" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
