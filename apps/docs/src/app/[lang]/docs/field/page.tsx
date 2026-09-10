import { Input, Field } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("field")!.title[lang] };
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
    lead: "Etiket, açıklama ve hata satırını bir arada tutar; üçü de aynı ritimde durur.",
    mail: "E-posta",
    mailDesc: "Fatura buraya gider.",
    mailPh: "ornek@sirket.com",
    vkn: "Vergi no",
    vknErr: "On bir hane olmalı.",
    rules: "Kurallar",
    htmlFor: (
      <>
        <code>htmlFor</code> ile kontrolün <code>id</code>&apos;si eşleşmeli. Eşleşmezse etiket
        tıklandığında kontrol odaklanmaz ve ekran okuyucu alanı adsız okur; gözle görülmeyen,
        yalnız kullanan kişinin fark ettiği bir hata.
      </>
    ),
    notLabel: (
      <>
        <Xref to="label">Label</Xref> ile karıştırma: o bir şeyi <em>niteler</em>, Field bir
        kontrolü <em>adlandırır</em>.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        İçine girecek kontroller: <Xref to="input">Input</Xref> ·{" "}
        <Xref to="textarea">Textarea</Xref> · <Xref to="select">Select</Xref> ·{" "}
        <Xref to="combobox">Combobox</Xref>.
      </>
    ),
  },
  en: {
    lead: "It holds the label, the description and the error line together, on one rhythm.",
    mail: "Email",
    mailDesc: "The invoice goes here.",
    mailPh: "name@company.com",
    vkn: "Tax number",
    vknErr: "Must be eleven digits.",
    rules: "Rules",
    htmlFor: (
      <>
        <code>htmlFor</code> must match the control&apos;s <code>id</code>. If it does not, clicking
        the label focuses nothing and a screen reader announces the field with no name; a defect
        you cannot see, and only the person using it ever meets.
      </>
    ),
    notLabel: (
      <>
        Do not confuse it with <Xref to="label">Label</Xref>: that one <em>qualifies</em> a thing,
        while Field <em>names</em> a control.
      </>
    ),
    related: "Related",
    rel: (
      <>
        Controls that go inside it: <Xref to="input">Input</Xref> ·{" "}
        <Xref to="textarea">Textarea</Xref> · <Xref to="select">Select</Xref> ·{" "}
        <Xref to="combobox">Combobox</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("field")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo
        labels={dict.demo}
        align="start"
        code={`<Field label="${t.mail}" description="${t.mailDesc}" htmlFor="mail">
  <Input id="mail" placeholder="${t.mailPh}" full />
</Field>

<Field label="${t.vkn}" error="${t.vknErr}" htmlFor="vkn">
  <Input id="vkn" defaultValue="1234" invalid full />
</Field>`}
      >
        <div className="flex w-full max-w-96 flex-col gap-7">
          <Field label={t.mail} description={t.mailDesc} htmlFor="mail">
            <Input id="mail" placeholder={t.mailPh} full />
          </Field>
          <Field label={t.vkn} error={t.vknErr} htmlFor="vkn">
            <Input id="vkn" defaultValue="1234" invalid full />
          </Field>
        </div>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.htmlFor}</Note>
      <P>{t.notLabel}</P>

      <H2>Props</H2>
      <Props of="Field" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
