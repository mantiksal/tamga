import { IconButton, Icon } from "tamga-ui";
import { Plus, Refresh, Delete } from "tamga-ui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("icon-button")!.title[lang] };
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
    add: "Ekle",
    refresh: "Yenile",
    remove: "Sil",
    size: (
      <>
        <code>size</code> iki değer alır: <code>base</code> (40px, varsayılan) ve <code>sm</code>
        (32px). Daha küçüğü <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
    rules: "Kurallar",
    label: (
      <>
        <code>aria-label</code> tip olarak zorunlu ama asıl mesele o değil:{" "}
        <strong>içinde metin olmayan bir kontrolün ekran okuyucuda adı yoktur.</strong> Kitin
        kuralı gereği çeviriyi kit yapmaz; hazır metni çağıran geçer.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Metinli hâli <Xref to="button">Button</Xref>; bir girdinin ya da kartın içine
        sığması gereken daha küçüğü <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
  },
  en: {
    add: "Add",
    refresh: "Refresh",
    remove: "Delete",
    size: (
      <>
        <code>size</code> takes two values: <code>base</code> (40px, the default) and{" "}
        <code>sm</code> (32px). Anything smaller is <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
    rules: "Rules",
    label: (
      <>
        <code>aria-label</code> is required by the type, but that is not the point:{" "}
        <strong>a control with no text inside it has no name in a screen reader.</strong> By the
        kit&apos;s rule the kit never translates; the caller passes text that is already written.
      </>
    ),
    related: "Related",
    rel: (
      <>
        With text, <Xref to="button">Button</Xref>; smaller, to sit inside a field or a
        card, <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("icon-button")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo
        labels={dict.demo}
        code={`<IconButton aria-label="${t.add}"><Icon icon={Plus} size="sm" /></IconButton>
<IconButton aria-label="${t.refresh}"><Icon icon={Refresh} size="sm" /></IconButton>
<IconButton aria-label="${t.remove}"><Icon icon={Delete} size="sm" /></IconButton>`}
      >
        <IconButton aria-label={t.add}>
          <Icon icon={Plus} size="sm" />
        </IconButton>
        <IconButton aria-label={t.refresh}>
          <Icon icon={Refresh} size="sm" />
        </IconButton>
        <IconButton aria-label={t.remove}>
          <Icon icon={Delete} size="sm" />
        </IconButton>
      </Demo>

      <P>{t.size}</P>

      <H2>{t.rules}</H2>
      <Note>{t.label}</Note>

      <H2>Props</H2>
      <Props of="IconButton" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
