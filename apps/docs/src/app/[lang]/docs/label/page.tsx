import { Label } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("label")!.title[lang] };
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
    checks: "10 kontrol",
    mono: (
      <>
        <code>mono</code> tanımlayıcı biçimli metinler için: kodlar, SKU&apos;lar, kısa anahtarlar.
        Onlar okunmaz, <em>eşleştirilir</em>.
      </>
    ),
    rules: "Kurallar",
    notField: (
      <>
        <strong>Form etiketi değildir.</strong> Bir kontrolü adlandırmaz, bir şeyi niteler. Form
        için <Xref to="field">Field</Xref> kullan; o <code>htmlFor</code> bağını da kurar.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Bir durumu kelimeyle söylemek için <Xref to="status-chip">Status chip</Xref>; bir bölüm
        başlığının metası için <Xref to="section-head">Section head</Xref>.
      </>
    ),
  },
  en: {
    checks: "10 checks",
    mono: (
      <>
        <code>mono</code> is for identifier-shaped text: codes, SKUs, short keys. Those are not
        read, they are <em>matched</em>.
      </>
    ),
    rules: "Rules",
    notField: (
      <>
        <strong>It is not a form label.</strong> It does not name a control; it qualifies a thing.
        For forms use <Xref to="field">Field</Xref>; that also wires up <code>htmlFor</code>.
      </>
    ),
    related: "Related",
    rel: (
      <>
        To say a state in one word, <Xref to="status-chip">Status chip</Xref>; for the meta line of
        a section heading, <Xref to="section-head">Section head</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("label")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} code={`<Label>p95 · 24s</Label>
<Label mono>SKU-4471</Label>`}>
        <Label>p95 · 24s</Label>
        <Label mono>SKU-4471</Label>
        <Label>{t.checks}</Label>
      </Demo>
      <P>{t.mono}</P>

      <H2>{t.rules}</H2>
      <Note>{t.notField}</Note>

      <H2>Props</H2>
      <Props of="Label" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
