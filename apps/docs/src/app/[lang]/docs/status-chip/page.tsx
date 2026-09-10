import { StatusChip, LiveScope } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("status-chip")!.title[lang] };
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
    live: "Yayında",
    waiting: "Bekliyor",
    failed: "Hata",
    quiet: "Sessiz",
    draft: "Taslak",
    critical: "Kritik",
    warning: "Uyarı",
    healthy: "Sağlıklı",
    noDot: "Noktasız",
    noDotWhy: "Satırda zaten bir durum işareti varsa nokta gürültüdür.",
    mono: (
      <>
        <code>mono</code>: tanımlayıcı biçimli etiketler (kodlar, kısa anahtarlar) mono yüzü korur
, çünkü onlar okunmaz, <em>eşleştirilir</em>.
      </>
    ),
    pulse: "Nabız",
    pulseWhy: (
      <>
        <code>live</code> bir <strong>talep</strong>tir, karar değil. Öğe en yakın{" "}
        <Xref to="live-scope">Live scope</Xref>&apos;a &quot;ben nabız atmak istiyorum&quot; der;
        sadece en yüksek rütbeli kazanır. Aşağıda üçü de istiyor, biri atıyor:
      </>
    ),
    rules: "Kurallar",
    roles: (
      <>
        <strong>Roller senin sözlüğün değil.</strong> Kit dört rol bilir:{" "}
        <code>neutral · positive · caution · danger</code>. Senin ürünün durumları
        (<em>teslim edildi · kargoda · iptal</em>) bu rollere kendi tarafında eşlenir: tek bir
        dosyada, tek bir tabloyla. Kit hangi alanda çalıştığını bilmez ve bilmemeli.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Yazısız hâli <Xref to="dot">Dot</Xref>; durum rengi taşımayan çıplak nabız{" "}
        <Xref to="beacon">Beacon</Xref>; nabız hakemi{" "}
        <Xref to="live-scope">Live scope</Xref>.
      </>
    ),
  },
  en: {
    live: "Live",
    waiting: "Waiting",
    failed: "Failed",
    quiet: "Quiet",
    draft: "Draft",
    critical: "Critical",
    warning: "Warning",
    healthy: "Healthy",
    noDot: "Without a dot",
    noDotWhy: "If the row already carries a status marker, the dot is noise.",
    mono: (
      <>
        <code>mono</code>: identifier-shaped labels (codes, short keys) keep the mono face;
        because those are not read, they are <em>matched</em>.
      </>
    ),
    pulse: "Pulse",
    pulseWhy: (
      <>
        <code>live</code> is a <strong>request</strong>, not a decision. The element tells its
        nearest <Xref to="live-scope">Live scope</Xref> &quot;I would like to pulse&quot;; only the
        highest-ranked one wins. Below, three ask and one pulses:
      </>
    ),
    rules: "Rules",
    roles: (
      <>
        <strong>The roles are not your vocabulary.</strong> The kit knows four:{" "}
        <code>neutral · positive · caution · danger</code>. Your product&apos;s states
        (<em>delivered · shipping · cancelled</em>) map onto them on your side: one file, one
        table. The kit does not know what field it is working in, and it must not.
      </>
    ),
    related: "Related",
    rel: (
      <>
        Without text, <Xref to="dot">Dot</Xref>; a bare pulse with no status colour,{" "}
        <Xref to="beacon">Beacon</Xref>; the referee for pulses,{" "}
        <Xref to="live-scope">Live scope</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("status-chip")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo
        labels={dict.demo}
        code={`<StatusChip label="${t.live}"    state="positive" dot />
<StatusChip label="${t.waiting}" state="caution"  dot />
<StatusChip label="${t.failed}"  state="danger"   dot />
<StatusChip label="${t.quiet}"   state="neutral"  dot />`}
      >
        <StatusChip label={t.live} state="positive" dot />
        <StatusChip label={t.waiting} state="caution" dot />
        <StatusChip label={t.failed} state="danger" dot />
        <StatusChip label={t.quiet} state="neutral" dot />
      </Demo>
      <Note>{t.roles}</Note>
      <pre className="docs-code my-4">{`import type { Tone } from "tamga-ui";

export const ORDER_TONE: Record<OrderState, Tone> = {
  delivered: "positive",
  shipping:  "caution",
  cancelled: "danger",
  draft:     "neutral",
};`}</pre>

      <H2>{t.noDot}</H2>
      <P>{t.noDotWhy}</P>
      <Demo
        labels={dict.demo}
        code={`<StatusChip label="${t.draft}" state="neutral" dot={false} />
<StatusChip label="EVT-2481" state="danger" mono dot={false} />`}
      >
        <StatusChip label={t.draft} state="neutral" dot={false} />
        <StatusChip label="EVT-2481" state="danger" mono dot={false} />
      </Demo>
      <P>{t.mono}</P>

      <H2>{t.pulse}</H2>
      <P>{t.pulseWhy}</P>
      <Demo
        labels={dict.demo}
        code={`<LiveScope>
  <StatusChip label="${t.critical}" state="danger"   dot live />
  <StatusChip label="${t.warning}"  state="caution"  dot live />
  <StatusChip label="${t.healthy}"  state="positive" dot live />
</LiveScope>`}
      >
        <LiveScope>
          <StatusChip label={t.critical} state="danger" dot live />
          <StatusChip label={t.warning} state="caution" dot live />
          <StatusChip label={t.healthy} state="positive" dot live />
        </LiveScope>
      </Demo>

      <H2>Props</H2>
      <Props of="StatusChip" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
