import { MiniButton, Icon } from "tamga-ui";
import { Delete, CaretLeft, CaretRight } from "tamga-ui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("mini-button")!.title[lang] };
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
    left: "Sola taşı",
    right: "Sağa taşı",
    remove: "Sil",
    lead: (
      <>
        Kitin en küçük kontrolü: bir girdinin içine, bir kartın köşesine, bir görselin üstüne sığar.
      </>
    ),
    rules: "Kurallar",
    noLift: (
      <>
        <strong>Yükselmez.</strong> Bu boyutta 2px&apos;lik bir offset düğmeyi taşıyacağı alandan
        taşırır, o yüzden oturur, ve basıldığında yalnız zemini koyulaşır. Yasa 1&apos;in boyut
        kaynaklı istisnası.
      </>
    ),
    name: (
      <>
        <code>aria-label</code> burada daha da kritik: bir <code>NumberInput</code>&apos;un
        içindeki iki ok, adları olmadan ekran okuyucuda yalnızca &quot;düğme, düğme&quot;dir.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Bir araç çubuğunda tek başına duracaksa{" "}
        <Xref to="icon-button">Icon button</Xref>; metinli hâli{" "}
        <Xref to="button">Button</Xref>.
      </>
    ),
  },
  en: {
    left: "Move left",
    right: "Move right",
    remove: "Delete",
    lead: (
      <>
        The kit&apos;s smallest control: it fits inside a field, in the corner of a card, on top of
        an image.
      </>
    ),
    rules: "Rules",
    noLift: (
      <>
        <strong>It does not lift.</strong> At this size a 2px offset pushes the button out of the
        space that has to hold it, so it sits, and a press only darkens its ground. The one
        exception to Law 1, and the reason is size.
      </>
    ),
    name: (
      <>
        <code>aria-label</code> matters even more here: the two arrows inside a{" "}
        <code>NumberInput</code> are, without names, simply &quot;button, button&quot; to a screen
        reader.
      </>
    ),
    related: "Related",
    rel: (
      <>
        If it stands alone in a toolbar, <Xref to="icon-button">Icon button</Xref>; with
        text, <Xref to="button">Button</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("mini-button")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo
        labels={dict.demo}
        code={`<MiniButton aria-label="${t.remove}"><Icon icon={Delete} size="xs" /></MiniButton>`}
      >
        <MiniButton aria-label={t.left}>
          <Icon icon={CaretLeft} size="xs" />
        </MiniButton>
        <MiniButton aria-label={t.right}>
          <Icon icon={CaretRight} size="xs" />
        </MiniButton>
        <MiniButton aria-label={t.remove}>
          <Icon icon={Delete} size="xs" />
        </MiniButton>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.noLift}</Note>
      <P>{t.name}</P>

      <H2>Props</H2>
      <Props of="MiniButton" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
