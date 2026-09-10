import { Input } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("input")!.title[lang] };
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
    ph: "ornek@sirket.com",
    bad: "Hatalı bir değer",
    off: "Devre dışı",
    focus: (
      <>
        Odaklandığında kenar aksana döner ve 2px&apos;lik sert offset gelir, aynı yükseltme
        formülü, Yasa 1.
      </>
    ),
    rules: "Kurallar",
    invalid: (
      <>
        <code>invalid</code> kenarı kırmızıya çevirir, <strong>dolgu yapmaz</strong>. Yasa 2: dolgu
        eylem demektir, ve bir hata bir eylem değil bir durumdur.
      </>
    ),
    sizeH: "Boy",
    sizeP: (
      <>
        Varsayılan <code>md</code> 40px, sistemdeki her kontrolün boyu. <code>size=&quot;sm&quot;</code>{" "}
        32px&apos;e iner ve bu <Xref to="button">Button</Xref>&apos;ın <code>sm</code>&apos;iyle aynı
        basamaktır: yan yana dizilen bir alan ile bir düğme birbirini tutar.
      </>
    ),
    sizeNote: (
      <>
        <code>sm</code> yalnız <strong>yardımcı</strong> bir yüzey için: bir tablo başlığındaki filtre
        satırı, bir araç çubuğu. Formun kendi alanları <code>md</code> kalır; orada alan asıl iştir ve
        küçültmek onu ikinci plana atar.
      </>
    ),
    small: "Ara",
    related: "İlgili",
    rel: (
      <>
        Etiket, açıklama ve hata satırı için <Xref to="field">Field</Xref> ile sarmala; o{" "}
        <code>htmlFor</code> bağını da kurar. Çok satır için <Xref to="textarea">Textarea</Xref>,
        sayı için <Xref to="number-input">Number input</Xref>.
      </>
    ),
  },
  en: {
    ph: "name@company.com",
    bad: "An invalid value",
    off: "Disabled",
    focus: (
      <>
        On focus the edge turns accent and a 2px hard offset appears, the same lift formula,
        Law 1.
      </>
    ),
    rules: "Rules",
    invalid: (
      <>
        <code>invalid</code> turns the edge red and <strong>never fills</strong>. Law 2: a fill
        means an action, and an error is not an action; it is a state.
      </>
    ),
    sizeH: "Size",
    sizeP: (
      <>
        The default <code>md</code> is 40px, the height every control in the system shares.{" "}
        <code>size=&quot;sm&quot;</code> drops to 32px, the same step as{" "}
        <Xref to="button">Button</Xref>&apos;s <code>sm</code>, so a field and a button placed side by
        side line up.
      </>
    ),
    sizeNote: (
      <>
        Use <code>sm</code> on a <strong>supporting</strong> surface only: a filter row in a table
        header, a toolbar. A form&apos;s own fields stay <code>md</code>; there the field is the work
        itself, and shrinking it pushes the work into the background.
      </>
    ),
    small: "Search",
    related: "Related",
    rel: (
      <>
        For a label, a description and an error line, wrap it in <Xref to="field">Field</Xref>;
        that also wires up <code>htmlFor</code>. For many lines,{" "}
        <Xref to="textarea">Textarea</Xref>; for numbers,{" "}
        <Xref to="number-input">Number input</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("input")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo
        labels={dict.demo}
        align="start"
        code={`<Input placeholder="${t.ph}" />
<Input placeholder="${t.bad}" invalid />
<Input placeholder="${t.off}" disabled />`}
      >
        <div className="flex w-full max-w-96 flex-col gap-3">
          <Input placeholder={t.ph} />
          <Input placeholder={t.bad} invalid />
          <Input placeholder={t.off} disabled />
        </div>
      </Demo>
      <P>{t.focus}</P>

      <H2>{t.sizeH}</H2>
      <Demo
        labels={dict.demo}
        align="start"
        code={`<Input placeholder="${t.small}" />
<Input placeholder="${t.small}" size="sm" />`}
      >
        <div className="flex w-full max-w-96 flex-col gap-3">
          <Input placeholder={t.small} />
          <Input placeholder={t.small} size="sm" />
        </div>
      </Demo>
      <P>{t.sizeP}</P>
      <Note>{t.sizeNote}</Note>

      <H2>{t.rules}</H2>
      <Note>{t.invalid}</Note>

      <H2>Props</H2>
      <Props of="Input" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
