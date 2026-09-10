import { TagsDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("tags-input")!.title[lang] };
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
    lead: "Ürün etiketleri, kategoriler, alıcı listeleri.",
    keys: (
      <>
        Enter ya da virgül bir etiketi kapatıyor; <strong>boşken Backspace sonuncuyu siliyor</strong>.
        İkincisi küçük görünür ama en çok kullanılan yoldur: yanlış yazılan bir etiketi silmek
        için fareye uzanmak, akışı kesen tek şeydir.
      </>
    ),
    dupe: (
      <>
        <strong>Yinelenen etiket sessizce yutuluyor</strong>, hata verilmiyor: aynı etiketi iki
        kez yazmak bir hata değil, bir tekrardır, ve kullanıcı zaten istediğini almış olur. Bir
        hata mesajı burada yalnız yolu keserdi.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Hazır bir listeden çoklu seçim için <Xref to="multi-select">Multi select</Xref>; bu
        serbest metin alır, o bir kümeden seçtirir.
      </>
    ),
  },
  en: {
    lead: "Product tags, categories, recipient lists.",
    keys: (
      <>
        Enter or a comma commits a tag; <strong>Backspace on an empty field removes the last
        one</strong>. The second one looks small but is the most-used path: reaching for the
        mouse to delete a mistyped tag is the one thing that breaks the flow.
      </>
    ),
    dupe: (
      <>
        <strong>A duplicate tag is swallowed silently</strong>, with no error: typing the same tag
        twice is a repetition, not a mistake, and the user already has what they wanted. An error
        message here would only get in the way.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        To pick several from a ready list, <Xref to="multi-select">Multi select</Xref>; this
        takes free text, that one picks from a set.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("tags-input")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<TagsInput
  value={tags}
  onChange={setTags}
  placeholder="…"
  labels={{ remove: (tag) => \`\${tag} kaldır\` }}
/>`}>
        <TagsDemo lang={lang} />
      </Demo>
      <P>{t.keys}</P>

      <H2>{t.rules}</H2>
      <Note>{t.dupe}</Note>

      <H2>Props</H2>
      <Props of="TagsInput" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
