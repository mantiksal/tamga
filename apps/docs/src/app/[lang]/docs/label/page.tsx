import { Label } from "tamga-ui";
import { EtiketTurleri } from "./ornek";
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
    alanH: "Alan etiketi",
    alanP: (
      <>
        Beş tür, ve beşi de <code>Field</code>&apos;ın işi: standart, zorunlu (kırmızı yıldız ·
        sözcük değil <strong>glif</strong>, çünkü sözcük bir çeviri ve kit çeviri yapmıyor),
        isteğe bağlı (etiketin ardında sessiz bir çip), bilgi ipuçlu (<code>title</code> taşıyan
        glif, <code>&lt;label&gt;</code>&apos;ın DIŞINDA · tıklayınca kontrol odaklanmasın diye)
        ve bölüm etiketi. Sonuncusu bu bileşenin <code>look=&quot;section&quot;</code>&apos;ı:
        bir sayıyı işaretlemiyor, bir <strong>bölgeyi</strong> adlandırıyor.
      </>
    ),
    fiyat: "Fiyat",
    indirim: "İndirim",
    istegeBagli: "isteğe bağlı",
    kdv: "KDV oranı",
    kdvIpucu: "Ürün kategorisine göre otomatik gelir",
    teslimat: "TESLİMAT BİLGİLERİ",
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
    alanH: "The field label",
    alanP: (
      <>
        Five kinds, and all five belong to <code>Field</code>: plain, required (a red asterisk ·
        a <strong>glyph</strong> rather than a word, because the word would be a translation and
        the kit makes none), optional (a quiet chip after the label), with a hint (a glyph
        carrying a <code>title</code>, OUTSIDE the <code>&lt;label&gt;</code> so clicking it does
        not focus the control) and the section label. The last one is this component&apos;s{" "}
        <code>look=&quot;section&quot;</code>: it does not annotate a number, it names a{" "}
        <strong>region</strong>.
      </>
    ),
    fiyat: "Price",
    indirim: "Discount",
    istegeBagli: "optional",
    kdv: "VAT rate",
    kdvIpucu: "Filled automatically from the product category",
    teslimat: "DELIVERY DETAILS",
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

      <H2>{t.alanH}</H2>
      <Demo labels={dict.demo} align="start" code={`<Field label="${t.fiyat}" required>…</Field>
<Field label="${t.indirim}" info={<Tag look="outline">${t.istegeBagli}</Tag>}>…</Field>
<Label look="section">${t.teslimat}</Label>`}>
        <EtiketTurleri
          fiyat={t.fiyat}
          indirim={t.indirim}
          istegeBagli={t.istegeBagli}
          kdv={t.kdv}
          kdvIpucu={t.kdvIpucu}
          teslimat={t.teslimat}
        />
      </Demo>
      <P>{t.alanP}</P>

      <H2>{t.rules}</H2>
      <Note>{t.notField}</Note>

      <H2>Props</H2>
      <Props of="Label" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
