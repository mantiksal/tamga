import { Beacon, LiveScope } from "tamga-ui";
import { BeaconOrnegi } from "./ornek";
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
    raporlar: "Raporlar",
    yeniden: "Yeniden göster",
    ikiSes: (
      <>
        <strong>İki biçim, iki cümle.</strong> <code>pulse</code> işaretin yerinde nefes alması:
        bir <strong>durum</strong> · canlı, akıyor. <code>ping</code> içinden dışarı genişleyip
        sönen halka: bir <strong>çağrı</strong> · &quot;yeni bir şey var, bak&quot;. Halka tek
        başına yetmiyor, altındaki çekirdek kalıyor: yoksa işaret sönük anında kayboluyor.
      </>
    ),
    konum: (
      <>
        Köşedeki işaret <code>edged</code> alıyor: bir basamak büyüyor (12 → 14) ve{" "}
        <strong>basılan kenarı</strong> taşıyor, dolgusu da tonun yıkamasına dönüyor · düğmenin
        kendi kenarına değen dolu bir kare, o kenarın parçası gibi okunuyor. Köşeye iliştirmeyi{" "}
        <strong>çağıran</strong> yapıyor, kit değil: kitin bir{" "}
        <code>corner</code> propu, bilmediği bir kabın ölçüsünü varsaymak olurdu. Örnekteki
        sarmalayıcı <code>relative</code>, işaret <code>absolute</code>.
      </>
    ),
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
    raporlar: "Reports",
    yeniden: "Show it again",
    ikiSes: (
      <>
        <strong>Two looks, two sentences.</strong> <code>pulse</code> is the mark breathing in
        place: a <strong>state</strong> · live, streaming. <code>ping</code> is a ring expanding
        out of it and fading: a <strong>call</strong> · &quot;there is something new here&quot;.
        The ring alone is not enough, so the core stays underneath: otherwise the mark
        disappears at the faint end of the beat.
      </>
    ),
    konum: (
      <>
        The mark in the corner takes <code>edged</code>: it grows a step (12 → 14) and carries
        the <strong>pressed edge</strong>, with its fill turning into the tone&apos;s wash · a
        solid square touching a button&apos;s own edge reads as part of that edge. Attaching it
        to a corner is the <strong>caller&apos;s</strong> job, not the kit&apos;s: a{" "}
        <code>corner</code> prop would assume the measure of a container the kit never sees. In
        the example the wrapper is <code>relative</code> and the mark <code>absolute</code>.
      </>
    ),
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

      <Demo labels={dict.demo} code={`<span className="relative inline-flex">
  <Button>${t.raporlar}</Button>
  <span className="absolute -top-1.5 -right-1.5">
    <Beacon look="ping" state="info" edged />
  </span>
</span>`}>
        <BeaconOrnegi raporlar={t.raporlar} yeniden={t.yeniden} />
      </Demo>
      <P>{t.ikiSes}</P>
      <P>{t.konum}</P>

      <H2>{t.rules}</H2>
      <Note>{t.label}</Note>

      <H2>Props</H2>
      <Props of="Beacon" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
