import { ScheduleDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("schedule-input")!.title[lang] };
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
    lead: "Bir işin ne sıklıkla çalışacağı: kontrol aralığı, rapor zamanlaması, yedekleme sıklığı.",
    noCron: (
      <>
        <strong>Neden cron değil.</strong> Bir cron ifadesi bir geliştirici için okunur, bir panel
        kullanıcısı için değildir, ve yanlış yazılan bir cron ifadesi{" "}
        <strong>hata vermez</strong>, sadece yanlış zamanda çalışır. Bu bileşen kürasyonlu bir
        liste sunuyor: kürasyonlu seçenek, serbestlik değil.
      </>
    ),
    minutes: (
      <>
        Özet cümleyi <strong>çağıran kuruyor</strong>: &quot;Her hafta içi&quot; ile &quot;Her
        gün&quot; arasındaki fark bir dilbilgisi kararı, ve kit çeviri yapmaz. Kontroller
        kombinasyonu üretiyor, cümleyi ürün yazıyor.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Belirli bir gün için <Xref to="date-picker">Date picker</Xref>; serbest bir sayı için{" "}
        <Xref to="number-input">Number input</Xref>.
      </>
    ),
  },
  en: {
    lead: "How often a job runs: a check interval, a report schedule, a backup frequency.",
    noCron: (
      <>
        <strong>Why not cron.</strong> A cron expression is readable to a developer and not to a
        panel user, and a mistyped cron expression <strong>raises no error</strong>, it simply
        runs at the wrong time. This component offers a curated list: curated options, not
        freedom.
      </>
    ),
    minutes: (
      <>
        The caller writes the <strong>summary sentence</strong>: the difference between "Every
        weekday" and "Every day" is a decision about grammar, and the kit does not translate. The
        controls produce the combination; the product writes the sentence.
      </>
    ),

    rules: "Rules",
    related: "Related",
    rel: (
      <>
        For a specific day, <Xref to="date-picker">Date picker</Xref>; for a free number,{" "}
        <Xref to="number-input">Number input</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("schedule-input")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo yuzey labels={dict.demo} align="start" code={`<ScheduleInput
  days={days}
  onDaysChange={setDays}
  from="09:00"
  to="18:00"
  onFromChange={setFrom}
  onToChange={setTo}
  labels={{ days: "…", dayNames: ["…"], hours: "…", between: "…" }}
  summary="…"
/>`}>
        <ScheduleDemo lang={lang} />
      </Demo>
      <P>{t.minutes}</P>

      <H2>{t.rules}</H2>
      <Note>{t.noCron}</Note>

      <H2>Props</H2>
      <Props of="ScheduleInput" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
