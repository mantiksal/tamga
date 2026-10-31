import { PhoneFieldDemo } from "@/components/interactive";
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
  return sayfaMeta("phone-field", lang);
}

const T = {
  tr: {
    lead: (
      <>
        Telefon numarası iki parça: <strong>ülke</strong> ve o ülkedeki numara. Kişi &quot;+&quot;
        işaretini ve ülke kodunu yazmaz; listeden ülkesini seçer, numarasını yazar. Kaydedilen
        değer <code>value</code>: E.164 (<code>+905551234567</code>) ya da boş.
      </>
    ),
    guess: (
      <>
        İlk tahmin çağıranın: <code>defaultCountry</code>. Çoğu zaman kişinin saat diliminden gelir;{" "}
        <code>countryForTimeZone(&quot;Europe/Istanbul&quot;)</code> <code>&quot;TR&quot;</code>{" "}
        döndürür. Kayıtlı bir numara kendi ülkesini kendisi söyler. Ülke adları{" "}
        <code>locale</code> dilinde yazılır; verilmezse tarayıcınınki.
      </>
    ),
    rules: "Kurallar",
    one: (
      <>
        <strong>Tek kutu ve bir örnek yetmez.</strong> Örnek tek bir ülkeninkini gösterir; başka
        ülkeden okuyan kendi kodunu ve &quot;+&quot;yı bilmek zorunda kalır. Liste adla da kodla da
        aranır.
      </>
    ),
    old: (
      <>
        <strong>Başında &quot;+&quot; olmayan değer de okunur.</strong> Yalnız rakamla saklanmış eski
        bir numara (<code>905551234567</code>) doğru ülkeyle açılır. Baştaki sıfır düşer: 0555
        yazan +90555 kaydeder.
      </>
    ),
    states: (
      <>
        <code>disabled</code> ikisini birden kapatır; <code>invalid</code> ikisini birden işaretler
        (sunucu numarayı reddettiyse). <code>id</code> ve <code>aria-describedby</code> numara
        kutusuna gider, böylece <Xref to="field">Field</Xref> etiketi yazılan yeri gösterir. Görünen
        her metin <code>labels</code> ile gelir; <code>className</code> dış kutuya.
      </>
    ),
    disabledT: "Kapalı",
    invalidT: "Geçersiz",
    related: "İlgili",
    rel: (
      <>
        Ülke listesi <Xref to="combobox">Combobox</Xref>; etiket ve hata için{" "}
        <Xref to="field">Field</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        A phone number is two parts: the <strong>country</strong> and the number within it. Nobody
        types the &quot;+&quot; or the country code; they pick their country and type their number.
        The stored <code>value</code> is E.164 (<code>+905551234567</code>) or empty.
      </>
    ),
    guess: (
      <>
        The first guess is the caller&apos;s: <code>defaultCountry</code>. Usually it comes from the
        person&apos;s time zone; <code>countryForTimeZone(&quot;Europe/Istanbul&quot;)</code> returns{" "}
        <code>&quot;TR&quot;</code>. A stored number names its own country. Country names are
        written in <code>locale</code>; the browser&apos;s when omitted.
      </>
    ),
    rules: "Rules",
    one: (
      <>
        <strong>One box with an example is not enough.</strong> The example can show one
        country&apos;s format; a reader from elsewhere is left to know their code and the
        &quot;+&quot;. The list searches by name and by code.
      </>
    ),
    old: (
      <>
        <strong>A value without the &quot;+&quot; is read too.</strong> An old number stored as
        digits only (<code>905551234567</code>) opens with the right country. A leading zero is
        dropped: typing 0555 stores +90555.
      </>
    ),
    states: (
      <>
        <code>disabled</code> closes both parts; <code>invalid</code> marks both (the server
        refused the number). <code>id</code> and <code>aria-describedby</code> go to the number
        box, so a <Xref to="field">Field</Xref> label points at what is typed. Every visible word
        comes through <code>labels</code>; <code>className</code> goes to the outer box.
      </>
    ),
    disabledT: "Disabled",
    invalidT: "Invalid",
    related: "Related",
    rel: (
      <>
        The country list is a <Xref to="combobox">Combobox</Xref>; for a label and an error,{" "}
        <Xref to="field">Field</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("phone-field")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<PhoneField
  value={phone}
  onChange={setPhone}
  defaultCountry={countryForTimeZone(profile.timeZone) ?? "TR"}
  locale="tr-TR"
  labels={{ country: "…", number: "…", empty: "…", clear: "…", open: "…" }}
/>`}>
        <PhoneFieldDemo lang={lang} />
      </Demo>
      <P>{t.guess}</P>

      <H2>{t.rules}</H2>
      <Note>{t.one}</Note>
      <Note>{t.old}</Note>
      <P>{t.states}</P>
      <Demo labels={dict.demo} align="start" code={`<PhoneField disabled … />`}>
        <PhoneFieldDemo lang={lang} disabled />
      </Demo>
      <Demo labels={dict.demo} align="start" code={`<PhoneField invalid … />`}>
        <PhoneFieldDemo lang={lang} invalid />
      </Demo>

      <H2>Props</H2>
      <Props of="PhoneField" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
