import { Progress } from "tamga-ui";
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
  return sayfaMeta("progress", lang);
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
    loading: "Yükleniyor",
    step: "Adım",
    done: "Tamamlandı",
    aria: "Dosya yükleme ilerlemesi",
    neutral: (
      <>
        <strong>Her zaman nötr.</strong> Progress tamamlanmayı bildirir, durumu değil: %38 kalmış
        olmak kötü bir haber değildir, o yüzden bir durum rengi almaz.
      </>
    ),
    rules: "Kurallar",
    hedef: "Aylık hedef",
    depo: "Depo doluluğu",
    dagilim: "Sipariş durumu dağılımı",
    teslim: "Teslim %48",
    kargoda: "Kargoda %24",
    hazirlaniyor: "Hazırlanıyor %20",
    iade: "İade %8",
    ucBicim: (
      <>
        Üç biçim, üç soru. <code>bar</code> çizgili yol · <strong>sürekli</strong> bir nicelik.{" "}
        <code>blocks</code> hücre dizisi · <strong>sayılabilir</strong> bir kapasite, asıl
        cümlenin &quot;10&apos;da 7&quot; olduğu yerde: orada düz bir çubuk, olmayan bir
        hassasiyeti iddia ediyor. Son dolu hücre açık tonda, &quot;burada duruyoruz&quot; diyen
        tek işaret o. <code>split</code> paylara bölünmüş tek yol · bütünü tamamlayan bir{" "}
        <strong>dağılım</strong>, altında kendi lejantıyla. Lejant satırını çağıran yazıyor: kit
        yüzde biçimlemiyor, çünkü işaret de yeri de bir yerel.
      </>
    ),
    fake: (
      <>
        <strong>Yüzdeyi gerçekten bilmiyorsan bu bileşen değil.</strong>{" "}
        <Xref to="spinner">Spinner</Xref> kullan. Sahte bir ilerleme çubuğu, bittiğini sandığın
        anda durduğunda güveni bir daha geri gelmemek üzere kırar.
      </>
    ),
    inceH: "İnce: tablo hücresine",
    inceP: (
      <>
        <code>size</code> iki boy: <code>md</code> sayfanın çubuğu, bugünkü hâl. <code>sm</code> dört
        pikselllik bir çizgi: kenarsız, gölgesiz, çizgisiz dolgu, üstünde etiket satırı yok;
        genişliği <code>className</code> ile sen verirsin. Yirmi beş satırlık bir tabloda her satıra
        bir kapsam çubuğu koyunca ölçek bu. <code>role=&quot;progressbar&quot;</code>, değer ve{" "}
        <code>ariaLabel</code> aynen; <code>tone</code> dolguya kitin rollerinden bir renk verir,
        yoksa vurgu.
      </>
    ),
    kapsam: "Kapsam",
    softH: "Pastel · soft",
    softP: (
      <>
        <code>soft</code> bir <code>tone</code> ile: tonun çizgili tam işaret rengi yerine pasteli
        (<code>softTint</code>), düz dolgu. Aynı düz pastellerle çizilmiş bir ölçeğin altındaki
        çubuklar için: ikisi tek ölçek gibi okunsun, alarm gibi değil. Varsayılan tonlu çubuk
        çizgili kalıyor.
      </>
    ),
    hiz: "Hız", erisim: "Erişilebilirlik", guvenlik: "Güvenlik",
    related: "İlgili",
    three: (
      <>
        Üçü farklı soruya cevap veriyor: <Xref to="skeleton">Skeleton</Xref> &quot;ne
        geleceğini&quot;, <Xref to="spinner">Spinner</Xref> &quot;bir şeyin sürdüğünü&quot;,{" "}
        <Xref to="progress">Progress</Xref> &quot;ne kadar kaldığını&quot; söyler.
      </>
    ),
  },
  en: {
    loading: "Loading",
    step: "Step",
    done: "Completed",
    aria: "File upload progress",
    neutral: (
      <>
        <strong>Always neutral.</strong> Progress reports completion, not condition: 38% left is
        not bad news, so it never takes a status colour.
      </>
    ),
    rules: "Rules",
    hedef: "Monthly target",
    depo: "Warehouse capacity",
    dagilim: "Order status split",
    teslim: "Delivered 48%",
    kargoda: "Shipping 24%",
    hazirlaniyor: "Preparing 20%",
    iade: "Returned 8%",
    ucBicim: (
      <>
        Three looks, three questions. <code>bar</code> is the striped track · a{" "}
        <strong>continuous</strong> quantity. <code>blocks</code> is a row of cells · a{" "}
        <strong>countable</strong> capacity, for where the real sentence is &quot;7 of 10&quot;:
        a smooth bar there claims a precision that does not exist. The last filled cell takes the
        light tone, the one mark that says &quot;this is where we are&quot;. <code>split</code>{" "}
        is one track cut into shares · a <strong>distribution</strong> that adds up to a whole,
        with its legend underneath. The caller writes the legend line: the kit formats no
        percentages, because the sign and its place are a locale.
      </>
    ),
    fake: (
      <>
        <strong>If you do not actually know the percentage, this is not the component.</strong> Use{" "}
        <Xref to="spinner">Spinner</Xref>. A fake progress bar that stalls at the moment you think
        it is done breaks trust in a way it does not come back from.
      </>
    ),
    inceH: "Thin: for a table cell",
    inceP: (
      <>
        <code>size</code> has two sizes: <code>md</code>, the page&apos;s bar, today&apos;s look.{" "}
        <code>sm</code> is a four-pixel line: no edge, no shadow, no stripes, no label line above;
        you give the width with <code>className</code>. A coverage bar on every row of a 25-row
        table is this scale. <code>role=&quot;progressbar&quot;</code>, the value and{" "}
        <code>ariaLabel</code> stay; <code>tone</code> colours the fill from the kit&apos;s roles, else
        the accent.
      </>
    ),
    kapsam: "Coverage",
    softH: "Pastel · soft",
    softP: (
      <>
        <code>soft</code> with a <code>tone</code>: the tone&apos;s pastel (<code>softTint</code>) as
        a flat fill instead of its striped full mark. For bars under a score drawn in the same flat
        pastels, so the two read as one scale rather than as alarms. The default toned bar stays
        striped.
      </>
    ),
    hiz: "Speed", erisim: "Accessibility", guvenlik: "Security",
    related: "Related",
    three: (
      <>
        The three answer different questions: <Xref to="skeleton">Skeleton</Xref> says what is
        coming, <Xref to="spinner">Spinner</Xref> says something is taking time, and{" "}
        <Xref to="progress">Progress</Xref> says how much is left.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("progress")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo yuzey labels={dict.demo} align="start" code={`<Progress value={64} label="${t.loading}" ariaLabel="${t.aria}" />
<Progress value={60} label="${t.step}" valueText="3 / 5" ariaLabel="${t.aria}" />
<Progress value={100} label="${t.done}" ariaLabel="${t.aria}" />`}>
        <div className="flex w-full max-w-md flex-col gap-6">
          <Progress value={64} label={t.loading} ariaLabel={t.aria} />
          <Progress value={60} label={t.step} valueText="3 / 5" ariaLabel={t.aria} />
          <Progress value={100} label={t.done} ariaLabel={t.aria} />
        </div>
      </Demo>
      <Demo yuzey labels={dict.demo} align="start" code={`<Progress look="blocks" blocks={10} value={70} label="${t.depo}" valueText="7 / 10" />

<Progress
  look="split"
  label="${t.dagilim}"
  segments={[
    { value: 48, label: "${t.teslim}" },
    { value: 24, label: "${t.kargoda}" },
    { value: 20, label: "${t.hazirlaniyor}" },
    { value: 8, tone: "danger", label: "${t.iade}" },
  ]}
/>`}>
        <div className="flex w-full max-w-160 flex-col gap-6">
          <Progress value={84} label={t.hedef} ariaLabel={t.aria} />
          <Progress
            look="blocks"
            blocks={10}
            value={70}
            label={t.depo}
            valueText="7 / 10"
            ariaLabel={t.aria}
          />
          <Progress
            look="split"
            label={t.dagilim}
            ariaLabel={t.aria}
            segments={[
              { value: 48, label: t.teslim },
              { value: 24, label: t.kargoda },
              { value: 20, label: t.hazirlaniyor },
              { value: 8, tone: "danger", label: t.iade },
            ]}
          />
        </div>
      </Demo>
      <P>{t.ucBicim}</P>

      <P>{t.neutral}</P>

      <H2>{t.softH}</H2>
      <P>{t.softP}</P>
      <Demo yuzey labels={dict.demo} align="start" code={`<Progress value={82} tone="positive" soft label="${t.hiz}" valueText="82" ariaLabel="${t.hiz}" />
<Progress value={61} tone="caution" soft label="${t.erisim}" valueText="61" ariaLabel="${t.erisim}" />
<Progress value={34} tone="danger" soft label="${t.guvenlik}" valueText="34" ariaLabel="${t.guvenlik}" />`}>
        <div className="flex w-full max-w-md flex-col gap-6" data-soft-ornek>
          <Progress value={82} tone="positive" soft label={t.hiz} valueText="82" ariaLabel={t.hiz} />
          <Progress value={61} tone="caution" soft label={t.erisim} valueText="61" ariaLabel={t.erisim} />
          <Progress value={34} tone="danger" soft label={t.guvenlik} valueText="34" ariaLabel={t.guvenlik} />
        </div>
      </Demo>

      <H2>{t.inceH}</H2>
      <P>{t.inceP}</P>
      <Demo yuzey labels={dict.demo} align="start" code={`<Progress size="sm" value={94} ariaLabel="${t.kapsam}" className="w-32" />
<Progress size="sm" value={62} tone="caution" ariaLabel="${t.kapsam}" className="w-32" />
<Progress size="sm" value={18} tone="danger" ariaLabel="${t.kapsam}" className="w-32" />`}>
        <div className="flex flex-col gap-3">
          <Progress size="sm" value={94} ariaLabel={t.kapsam} className="w-32" />
          <Progress size="sm" value={62} tone="caution" ariaLabel={t.kapsam} className="w-32" />
          <Progress size="sm" value={18} tone="danger" ariaLabel={t.kapsam} className="w-32" />
        </div>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.fake}</Note>

      <H2>Props</H2>
      <Props of="Progress" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.three}</P>
    </>
  );
}
