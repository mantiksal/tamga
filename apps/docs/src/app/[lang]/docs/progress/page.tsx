import { Progress } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("progress")!.title[lang] };
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
    aria: "Dosya yükleme ilerlemesi",
    neutral: (
      <>
        <strong>Her zaman nötr.</strong> Progress tamamlanmayı bildirir, durumu değil: %38 kalmış
        olmak kötü bir haber değildir, o yüzden bir durum rengi almaz.
      </>
    ),
    rules: "Kurallar",
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
    aria: "File upload progress",
    neutral: (
      <>
        <strong>Always neutral.</strong> Progress reports completion, not condition: 38% left is
        not bad news, so it never takes a status colour.
      </>
    ),
    rules: "Rules",
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
      <Demo labels={dict.demo} align="start" code={`<Progress value={62} label="${t.loading}" ariaLabel="${t.aria}" />
<Progress value={62} showScale ariaLabel="${t.aria}" />`}>
        <div className="flex w-full max-w-96 flex-col gap-7">
          <Progress value={62} label={t.loading} ariaLabel={t.aria} />
          <Progress value={62} showScale ariaLabel={t.aria} />
        </div>
      </Demo>
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
