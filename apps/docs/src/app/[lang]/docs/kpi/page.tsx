import { Kpi, Sparkline } from "tamga-ui";
import { CanliKarolar } from "./ornek";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("kpi")!.title[lang] };
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
    deltaH: "Delta: değişimin kendisi",
    deltaP: (
      <>
        Bir sayının yanındaki &ldquo;+%12&rdquo;. <code>better</code> zorunlu ve bir tercih değil
        bir ANLAM: bir metrikte artış iyi (ciro), ötekinde kötü (yanıt süresi). Yönü renge
        çeviren kural burada, çağrı yerinde değil; yoksa aynı yeşil iki ekranda iki farklı şey
        söyler.
      </>
    ),
    orders: "Sipariş",
    revenue: "Ciro",
    latency: "Yanıt süresi",
    lead: "Tek bir sayı, büyük, ve yanında nereden geldiği.",
    skeletonFirst: (
      <>
        <strong><code>SkeletonKpi</code> kitte yıllarca vardı ve yerini tuttuğu bileşen
        yoktu.</strong> Bir iskelet, var olmayan bir şeyin yerini tutuyordu. Kitin en tuhaf
        açığıydı, ve bu sayfa onun kapanışı.
      </>
    ),
    tabular: (
      <>
        Sayı <code>tabular-nums</code>: değişen bir sayaç, rakam genişlikleri eşit olmadığı sürece
        her güncellemede yatay olarak zıplar.
      </>
    ),
    better: (
      <>
        <code>delta</code> bir <em>yön</em> taşır ama iyi/kötü taşımaz: artan bir hata oranı da
        artıştır. Anlamı <code>better</code> veriyor: yükselmesi mi iyi, düşmesi mi. Varsayılanı
        &quot;yükselmesi iyi&quot;, çünkü çoğu iş ölçütü öyle, ama bir gecikme grafiğinde
        <code>better=&quot;down&quot;</code> yazmak zorundasın.
      </>
    ),
    rules: "Kurallar",
    liveH: "Okunan karo, tıklanan karo",
    liveP: (
      <>
        Bir panodaki sayı neredeyse hiçbir zaman salt okunur değildir: ya bir ekran açar
        (&ldquo;37 iade bekliyor&rdquo; → iade listesi) ya bir filtre uygular. Karo bunu
        yapamadığı sürece her ekran kendi tıklanabilir kopyasını yazar; ölçüldü, bir üründe iki
        kopya doğmuştu ve ikisi birbirine benzemiyordu. <code>href</code> veren karo bir{" "}
        <code>a</code>, <code>onClick</code> veren bir <code>button</code>, hiçbirini vermeyen
        bir <code>div</code> oluyor. Kaldırma ve oturma fiziği yalnız ilk ikisinde: okunan bir
        karo hover&apos;da oynarsa tıklanabilir olduğu yalanını söyler.
      </>
    ),
    gridH: "Izgara: sütun sayısı sayılır, verilmez",
    gridP: (
      <>
        <code>KpiGrid</code> sütun sayısını çocuk sayısından alıyor (en çok altı). Elle yazılan
        bir sütun sayısı yeni bir karo eklendiğinde yalnız o ekranda güncelleniyor, ve tek başına
        kalan bir karo bütün satırı kaplayıp panoyu dengesiz gösteriyor.
      </>
    ),
    attentionH: "Karo her ekranda aynı görünür",
    attentionP: (
      <>
        Karonun kendini ekrana göre değiştirmesini sağlayan iki prop denendi ve ikisi de
        kaldırıldı. <code>attention</code> sayıyı kritik renge boyuyordu: tek tüketicisinde beş
        karonun üçü kırmızıydı, ve üç kırmızı hiçbir şeyi öne çıkarmıyor; yalnız paneli alarm
        hâlinde gösteriyor. Bir sayının kötü olduğunu söylemenin yeri <code>delta</code> (yönü ve
        anlamı olan bir değişim) ya da karonun açtığı ekranın kendisi; karonun rengi değil.
      </>
    ),
    accentP: (
      <>
        <strong>Karo her ekranda AYNI görünür.</strong> Bir süre <code>accent</code> diye bir prop
        vardı ve karonun sol kenarına verinin kendi rengini çiziyordu; kaldırıldı. Tek tüketicisi
        onu reddetti: renk zaten listedeki rozette duruyordu, kartın kenarında bir daha
        söylenince aynı bileşen iki ekranda farklı görünüyordu. Karoyu ekrana özel yapan her ek
        işaret, ortak bileşen olma sözünü bozuyor.
      </>
    ),
    queue: "İade başvurusu",
    action: "Aksiyon bekleyen",
    alarm: "Sistem alarmı",
    related: "İlgili",
    rel: (
      <>
        Yükleme hâli <Xref to="skeleton">Skeleton</Xref>; 0-100 arası bir okuma için{" "}
        <Xref to="score-ring">Score ring</Xref>; anahtar/değer listesi{" "}
        <Xref to="descriptions">Descriptions</Xref>.
      </>
    ),
  },
  en: {
    deltaH: "Delta: the change itself",
    deltaP: (
      <>
        The &ldquo;+12%&rdquo; beside a number. <code>better</code> is required and it is not a
        preference but a MEANING: on one metric a rise is good (revenue), on another it is bad
        (response time). The rule that turns direction into colour lives here rather than at the
        call site; otherwise the same green says two different things on two screens.
      </>
    ),
    orders: "Orders",
    revenue: "Revenue",
    latency: "Response time",
    lead: "One number, large, and beside it, where it came from.",
    skeletonFirst: (
      <>
        <strong><code>SkeletonKpi</code> lived in the kit for years with no component behind
        it.</strong> A skeleton was standing in for something that did not exist. It was the
        kit&apos;s strangest gap, and this page closes it.
      </>
    ),
    tabular: (
      <>
        The number is <code>tabular-nums</code>: a changing counter jumps sideways on every update
        unless the digit widths are equal.
      </>
    ),
    better: (
      <>
        <code>delta</code> carries a <em>direction</em> but not good or bad: a rising error rate
        is also a rise. <code>better</code> supplies the meaning: is up good, or down. The default
        is &quot;up is good&quot; because most business metrics are, but on a latency chart you
        have to write <code>better=&quot;down&quot;</code>.
      </>
    ),
    rules: "Rules",
    liveH: "A tile read, a tile pressed",
    liveP: (
      <>
        A number on a dashboard is almost never read-only: it either opens a screen
        (&ldquo;37 returns waiting&rdquo; → the returns list) or applies a filter. As long as the
        tile cannot do that, every screen writes its own clickable copy; this was measured, and
        one product had grown two copies that no longer resembled each other. A tile given{" "}
        <code>href</code> becomes an <code>a</code>, one given <code>onClick</code> a{" "}
        <code>button</code>, one given neither a <code>div</code>. The lift and settle physics
        apply only to the first two: a tile that moves on hover while doing nothing tells a lie.
      </>
    ),
    gridH: "The grid counts its columns, it is not told them",
    gridP: (
      <>
        <code>KpiGrid</code> takes the column count from how many children it has (six at most).
        A hand-written column count is updated only on the screen where a tile was added, and a
        tile left alone on its own row makes the dashboard look off balance.
      </>
    ),
    attentionH: "The tile looks the same on every screen",
    attentionP: (
      <>
        Two props that let the tile change itself per screen were tried, and both were removed.{" "}
        <code>attention</code> painted the number in the critical colour: on its only consumer
        three of five tiles were red, and three reds lead nowhere; they just make the panel look
        like an alarm. The place to say a number is bad is <code>delta</code> (a change with a
        direction and a meaning) or the screen the tile opens; not the tile&apos;s colour.
      </>
    ),
    accentP: (
      <>
        <strong>The tile looks the same on every screen.</strong> For a while there was an{" "}
        <code>accent</code> prop that drew the data&apos;s own colour down the left edge; it was
        removed. Its only consumer rejected it: the colour was already on the badge in the list,
        and saying it again on the card made the same component look different on two screens.
        Every extra mark that makes the tile screen-specific breaks its promise as a shared
        component.
      </>
    ),
    queue: "Return requests",
    action: "Awaiting action",
    alarm: "System alarms",
    related: "Related",
    rel: (
      <>
        Its loading state is <Xref to="skeleton">Skeleton</Xref>; for a 0–100 reading,{" "}
        <Xref to="score-ring">Score ring</Xref>; for a term/value list,{" "}
        <Xref to="descriptions">Descriptions</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("kpi")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" grid={false} code={`<Kpi
  label="${t.orders}"
  value={248}
  delta={12}
  chart={<Sparkline values={series} tone="positive" />}
/>`}>
        <div className="grid w-full gap-4 sm:grid-cols-3">
          <Kpi
            label={t.orders}
            value={248}
            delta={12}
            chart={<Sparkline values={[42, 38, 45, 51, 47, 60, 58, 66, 61, 72, 68, 80]} tone="positive" />}
          />
          <Kpi label={t.revenue} value="18.420" unit="₺" delta={-4} />
          <Kpi label={t.latency} value={24} unit="ms" delta={8} better="down" />
        </div>
      </Demo>
      <P>{t.tabular}</P>

      <H2>{t.liveH}</H2>
      <P>{t.liveP}</P>
      <Demo labels={dict.demo} align="start" grid={false} code={`<KpiGrid>
  <Kpi href="/returns" icon={ArrowUUpLeft} label="${t.queue}" value="207" />
  <Kpi href="/returns?step=action" icon={Gavel} label="${t.action}" value="95" />
  <Kpi href="/system" icon={Warning} label="${t.alarm}" value="2" />
</KpiGrid>`}>
        <CanliKarolar queue={t.queue} action={t.action} alarm={t.alarm} />
      </Demo>

      <H2>{t.gridH}</H2>
      <P>{t.gridP}</P>
      <Props of="KpiGrid" lang={lang} />

      <H2>{t.attentionH}</H2>
      <P>{t.attentionP}</P>
      <Note>{t.accentP}</Note>

      <H2>{t.rules}</H2>
      <Note>{t.better}</Note>
      <Note>{t.skeletonFirst}</Note>

      <H2>{t.deltaH}</H2>
      <P>{t.deltaP}</P>
      <Props of="Delta" lang={lang} />

      <H2>Props</H2>
      <Props of="Kpi" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
