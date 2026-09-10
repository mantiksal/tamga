import { Dot, LiveScope } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("dot")!.title[lang] };
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
    tables: (
      <>
        Tablolar için: bir sütun dolusu chip gürültü olurdu, nokta aynı bilgiyi bir satır
        yüksekliğinde verir.
      </>
    ),
    rules: "Kurallar",
    alone: (
      <>
        <strong>Tek başına yeterli değil.</strong> Renk tek taşıyıcı olduğunda bilgi renk körü
        birinde kaybolur; nokta bir metnin YANINDA durmalı: satırın adı, ya da bir{" "}
        <Xref to="status-chip">Status chip</Xref>.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Yazılı hâli <Xref to="status-chip">Status chip</Xref>; durum rengi taşımayan nabız{" "}
        <Xref to="beacon">Beacon</Xref>.
      </>
    ),
  },
  en: {
    tables: (
      <>
        For tables: a column full of chips would be noise, while a dot gives the same information
        in one row&apos;s height.
      </>
    ),
    rules: "Rules",
    alone: (
      <>
        <strong>Not enough on its own.</strong> When colour is the only carrier, the information
        is lost for a colour-blind reader; a dot must sit BESIDE text: the row&apos;s name, or a{" "}
        <Xref to="status-chip">Status chip</Xref>.
      </>
    ),
    related: "Related",
    rel: (
      <>
        With text, <Xref to="status-chip">Status chip</Xref>; a pulse with no status colour,{" "}
        <Xref to="beacon">Beacon</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("dot")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo
        labels={dict.demo}
        code={`<Dot state="positive" />
<Dot state="caution" />
<Dot state="danger" live />
<Dot state="neutral" />`}
      >
        <span className="flex items-center gap-4">
          <Dot state="positive" />
          <Dot state="caution" />
          <LiveScope>
            <Dot state="danger" live />
          </LiveScope>
          <Dot state="neutral" />
        </span>
      </Demo>
      <P>{t.tables}</P>

      <H2>{t.rules}</H2>
      <Note>{t.alone}</Note>

      <H2>Props</H2>
      <Props of="Dot" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
