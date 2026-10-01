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

      <H2>{t.rules}</H2>
      <Note>{t.fake}</Note>

      <H2>Props</H2>
      <Props of="Progress" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.three}</P>
    </>
  );
}
