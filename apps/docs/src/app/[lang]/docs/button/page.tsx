import { Button } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { ButtonPlayground } from "@/components/interactive";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("button")!.title[lang] };
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
    save: "Kaydet",
    cancel: "Vazgeç",
    confirm: "Onayla",
    remove: "Sil",
    close: "Kapat",
    details: "Ayrıntılar",
    submit: "Formu gönder",
    lead: (
      <>
        Altı varyant, ve hepsi <em>aynı şekil artı bir renk</em>. Yeni bir varyant yeni bir dosya
        değil, mevcut <code>cva</code> tablosuna bir satırdır.
      </>
    ),
    rules: "Kurallar",
    oneFilled: (
      <>
        <strong>Sayfada tek bir <code>primary</code> olur.</strong> Onaylama ve silme ikisi de
        önemli olabilir, ama ikisi de <em>o sayfanın</em> eylemi değildir, o yüzden{" "}
        <code>success</code> ve <code>danger</code> dolgu değil, renkli kenar alır.
      </>
    ),
    sizes: (
      <>
        Varsayılanlar <code>variant=&quot;secondary&quot;</code> ve <code>size=&quot;base&quot;</code>,
        yani <code>&lt;Button&gt;</code> yazdığında aldığın şey bu. <code>sm</code> kart başlıkları ve sıkışık araç çubukları için. Üçüncü bir boyut yok; bir
        skala ancak sınırlıyken skala olur. Daha küçüğü gerekiyorsa aradığın şey{" "}
        <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
    rest: (
      <>
        Tabloda olmayan her şey <code>&lt;button&gt;</code>&apos;ın kendi niteliği; {" "}
        <code>onClick</code>, <code>disabled</code>, <code>type</code>, hepsi geçerli. Her bileşen
        ayrıca <code>className</code> alır.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Metinsiz bir kontrol için <Xref to="icon-button">Icon button</Xref>; bir alanın
        içine sığması gereken en küçüğü için <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
  },
  en: {
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    remove: "Delete",
    close: "Close",
    details: "Details",
    submit: "Submit form",
    lead: (
      <>
        Six variants, and every one of them is <em>the same shape plus a colour</em>. A new variant
        is not a new file; it is one more row in the existing <code>cva</code> table.
      </>
    ),
    rules: "Rules",
    oneFilled: (
      <>
        <strong>One <code>primary</code> per page.</strong> Confirming and deleting can both matter,
        but neither is <em>the page&apos;s</em> action, which is why <code>success</code> and{" "}
        <code>danger</code> get a coloured edge, never a fill.
      </>
    ),
    sizes: (
      <>
        The defaults are <code>variant=&quot;secondary&quot;</code> and <code>size=&quot;base&quot;</code>:
        that is what a bare <code>&lt;Button&gt;</code> gives you. <code>sm</code> is for card headers and dense toolbars. There is no third size; a scale is
        only a scale while it stays small. If you need something smaller, what you want is{" "}
        <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
    rest: (
      <>
        Anything not in the table is a plain <code>&lt;button&gt;</code> attribute;{" "}
        <code>onClick</code>, <code>disabled</code>, <code>type</code>, all of them. Every component
        also takes <code>className</code>.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For a control with no text, <Xref to="icon-button">Icon button</Xref>; for the
        smallest one, meant to sit inside a field, <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("button")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <ButtonPlayground labels={dict.demo} label={t.save} />
      <P>{t.lead}</P>
      <Demo
        labels={dict.demo}
        code={`<Button variant="primary">${t.save}</Button>
<Button>${t.cancel}</Button>
<Button variant="success">${t.confirm}</Button>
<Button variant="danger">${t.remove}</Button>
<Button variant="ghost">${t.close}</Button>
<Button variant="link">${t.details}</Button>`}
      >
        <Button variant="primary">{t.save}</Button>
        <Button>{t.cancel}</Button>
        <Button variant="success">{t.confirm}</Button>
        <Button variant="danger">{t.remove}</Button>
        <Button variant="ghost">{t.close}</Button>
        <Button variant="link">{t.details}</Button>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.oneFilled}</Note>
      <P>{t.sizes}</P>

      <H2>Props</H2>
      <Props of="Button" lang={lang} />
      <P>{t.rest}</P>

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
