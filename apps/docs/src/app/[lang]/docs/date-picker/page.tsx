import { DatePickerDemo, DatePickerMinDemo, DateTimePickerDemo } from "@/components/interactive";
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
  return sayfaMeta("date-picker", lang);
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
    lead: (
      <>
        Ay ve gün adları <strong>çevrilmez, üretilir</strong>. Sebebi tembellik değil doğruluk:
        haftanın hangi günle başladığı yerele göre değişir (Türkçe&apos;de Pazartesi,
        İngilizce&apos;de Pazar), ay adları çekim alır, ve elle yazılan bir dil listesi dokuzuncu
        dilde eksik kalır. Bileşen <code>locale</code> alır, gerisini <code>Intl</code> bilir.
      </>
    ),
    readonly: (
      <>
        Girdi salt-okunur: elle tarih yazmak her yerelde farklı bir ayraç ve sıra demektir
        (<code>15/04/2026</code> · <code>04/15/2026</code> · <code>2026-04-15</code>), ve yanlış
        okunan bir tarih sessizce yanlış veri üretir.
      </>
    ),
    calendar: (
      <>
        Açılır kutu olmadan, gömülü bir takvim gerekiyorsa <code>Calendar</code> ayrıca dışa
        aktarılıyor; DatePicker onu kendi içinde kullanıyor.
      </>
    ),
    rules: "Kurallar",
    tz: (
      <>
        <strong>Zaman dilimi yok.</strong> Bileşen yalnız yıl-ay-gün ile çalışır. Bir sipariş
        filtresi &quot;15 Nisan&quot; ister, &quot;15 Nisan 00:00 UTC+3&quot; değil; saat
        karıştırıldığında gün sınırında bir kayma doğar ve kimse sebebini bulamaz. Saat
        gerekiyorsa aşağıdaki <code>DateTimePicker</code>: o bir <em>an</em> döndürür, dilimiyle.
      </>
    ),
    minH: "En erken, en geç",
    minP: (
      <>
        <code>min</code> ve <code>max</code> birer gün. Aralık dışı günler <strong>kapalı</strong>:
        tıklanmaz, ok tuşları atlar, ekran okuyucu &quot;kapalı&quot; der; ay tümüyle dışarıda
        kalınca ay düğmesi de kapanır. Bir API anahtarının bitiş tarihi geçmişte olamaz · takvim
        bunu hiç teklif etmiyor.
      </>
    ),
    zamanH: "Tarih + saat",
    zamanP: (
      <>
        <code>DateTimePicker</code> ayrı bir bileşen, <code>DatePicker</code>&apos;a bir prop değil:
        dönen değer gün değil bir <strong>an</strong>, <code>2026-04-15T14:30:00+03:00</code>
        gibi, kullanıcının kendi dilimiyle. Sunucuya <code>new Date(v).toISOString()</code> gider;
        dilim, &quot;İstanbul&apos;da 14:30&quot;u kaydırmadan taşıyan şey. Saat de yazılmaz,
        seçilir; 12 ya da 24 saat yerelin kararı. <code>min</code> aynı güne düşüyorsa önceki
        saatler sunulmaz · bitiş başlangıçtan önce olamaz.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Etiket ve hata satırı için <Xref to="field">Field</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        Month and day names are <strong>generated, not translated</strong>. Not out of laziness but
        for correctness: which day the week starts on changes by locale (Monday in Turkish, Sunday
        in English), month names inflect, and a hand-written language list falls short at the
        ninth language. The component takes a <code>locale</code> and <code>Intl</code> knows the
        rest.
      </>
    ),
    readonly: (
      <>
        The input is read-only: typing a date means a different separator and order in every
        locale (<code>15/04/2026</code> · <code>04/15/2026</code> · <code>2026-04-15</code>), and a
        misread date silently produces wrong data.
      </>
    ),
    calendar: (
      <>
        If you need an embedded calendar without the popover, <code>Calendar</code> is exported
        separately; DatePicker uses it internally.
      </>
    ),
    rules: "Rules",
    minH: "Earliest, latest",
    minP: (
      <>
        <code>min</code> and <code>max</code> are days. Days outside the range are{" "}
        <strong>disabled</strong>: not clickable, skipped by the arrow keys, announced as such; when
        a whole month is out of reach its button closes too. An API key cannot expire in the past ·
        the calendar never offers it.
      </>
    ),
    zamanH: "Date + time",
    zamanP: (
      <>
        <code>DateTimePicker</code> is a separate component, not a prop on <code>DatePicker</code>:
        the value is not a day but an <strong>instant</strong>, like{" "}
        <code>2026-04-15T14:30:00+03:00</code>, in the user&apos;s own offset. The server gets{" "}
        <code>new Date(v).toISOString()</code>; the offset is what carries &quot;14:30 in
        Istanbul&quot; without drift. Time is picked, not typed; 12 or 24 hours is the locale&apos;s
        call. With <code>min</code> on the same day, earlier hours are not offered · an end cannot
        precede its start.
      </>
    ),
    tz: (
      <>
        <strong>No time zone.</strong> The component works only with year-month-day. An order
        filter asks for &quot;15 April&quot;, not &quot;15 April 00:00 UTC+3&quot;; mixing in a
        clock creates a shift at the day boundary that nobody can trace.
      If you need the time, <code>DateTimePicker</code> below returns an <em>instant</em>, offset included.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For a label and an error line, <Xref to="field">Field</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("date-picker")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<DatePicker
  locale="${lang}-${lang === "tr" ? "TR" : "US"}"
  value={date}
  onChange={setDate}
  placeholder="…"
  labels={{ previousMonth: "…", nextMonth: "…", open: "…", clear: "…" }}
/>`}>
        <DatePickerDemo lang={lang} />
      </Demo>
      <P>{t.readonly}</P>
      <P>{t.calendar}</P>

      <H2>{t.rules}</H2>
      <Note>{t.tz}</Note>

      <H2>{t.minH}</H2>
      <P>{t.minP}</P>
      <Demo labels={dict.demo} align="start" code={`<DatePicker min={today} … />`}>
        <DatePickerMinDemo lang={lang} />
      </Demo>

      <H2>{t.zamanH}</H2>
      <P>{t.zamanP}</P>
      <Demo labels={dict.demo} align="start" code={`<DateTimePicker
  locale="${lang}-${lang === "tr" ? "TR" : "US"}"
  value={start}
  onChange={setStart}
  labels={{ …, hour: "…", minute: "…", period: "…" }}
/>
<DateTimePicker value={end} min={start} … />`}>
        <DateTimePickerDemo lang={lang} />
      </Demo>

      <H2>Props</H2>
      <Props of="DatePicker" lang={lang} />
      <Props of="DateTimePicker" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
