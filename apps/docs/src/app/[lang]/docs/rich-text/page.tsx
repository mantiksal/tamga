import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";
import { RichTextDemo } from "@/components/interactive";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("rich-text")!.title[lang] };
}

const T = {
  tr: {
    lead: (
      <>
        <Xref to="textarea">Textarea</Xref> düz metin alır; bu, biçimlendirilmiş metin alır ve
        HTML üretir. Aradaki fark bir düğme sırası değil: burada kaydedilen şey{" "}
        <strong>işaretlenmiş bir belge</strong>, ve o belgeyi kimin okuyacağı ürüne göre değişir.
      </>
    ),
    allowH: "Hangi düğmelerin görüneceğini ürün seçer",
    allowP: (
      <>
        <code>allow</code> araç çubuğunu kuruyor, ve sırası da oradan geliyor. Sebebi şu: bir
        vitrin gelen HTML&apos;i süzüyor olabilir, ve süzgeçten geçmeyecek bir düğmeyi göstermek
        kullanıcıya <strong>var olmayan bir yetki sunmak</strong> demek. Tabloyu silen bir
        sitede tablo düğmesi göstermek, içeriği yazan kişiye kaydedip mağazaya bakana kadar
        fark ettirmiyor.
      </>
    ),
    pasteH: "Yapıştırma düz metin",
    pasteP: (
      <>
        Bir kelime işlemciden ya da başka bir siteden gelen içerik kendi{" "}
        <code>&lt;span style&gt;</code>larını, sınıflarını ve yazı tiplerini getirir. Hiçbiri bu
        kutuda görünmez, çoğu vitrinde de kalmaz, ama kaydedilen HTML&apos;i şişirir ve sonraki
        düzenlemeyi okunamaz yapar. Görünen biçim <strong>düğmelerden</strong> gelir,
        yapıştırmadan değil.
      </>
    ),
    caretH: "Kontrolsüz alan, bilinçli olarak",
    caretP: (
      <>
        Yazılan yer DOM&apos;un kendisi; <code>value</code> yalnız dışarıdan değiştiğinde
        (kayıt, vazgeç, başka bir kayda geçiş) alana yazılıyor. Her tuş vuruşunda alanı
        React&apos;ten yeniden kurmak imleci metnin başına atar, ve bunu ancak uzun bir
        paragraf yazarken fark edersin.
      </>
    ),
    rules: "Kurallar",
    sanitize: (
      <>
        Kit gelen HTML&apos;i <strong>temizlemez</strong>. Hangi etiketin geçerli olduğu ve
        güvenli olduğu ürünün kuralı; kit hangi vitrine gittiğini bilemez. Sunucu tarafında bir
        beyaz liste şart.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Düz metin için <Xref to="textarea">Textarea</Xref>, tek satır için{" "}
        <Xref to="input">Input</Xref>. Üretilen HTML&apos;i okunur çizmek için{" "}
        <code>.tamga-prose</code>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        <Xref to="textarea">Textarea</Xref> takes plain text; this takes formatted text and
        produces HTML. The difference is not a row of buttons: what gets saved here is{" "}
        <strong>a marked-up document</strong>, and who reads that document differs per product.
      </>
    ),
    allowH: "The product picks which buttons appear",
    allowP: (
      <>
        <code>allow</code> builds the toolbar, and its order too. The reason: a storefront may
        filter the HTML it receives, and showing a button whose output will not survive that
        filter <strong>offers the user a power that does not exist</strong>. On a site that
        strips tables, a table button goes unnoticed until the author saves and looks at the
        shop.
      </>
    ),
    pasteH: "Paste is plain text",
    pasteP: (
      <>
        Content from a word processor or another site brings its own{" "}
        <code>&lt;span style&gt;</code>, classes and typefaces. None of it shows in this box,
        most of it will not survive the storefront either, but it bloats the saved HTML and
        makes the next edit unreadable. Visible formatting comes from{" "}
        <strong>the buttons</strong>, not from the paste.
      </>
    ),
    caretH: "Uncontrolled field, deliberately",
    caretP: (
      <>
        The typing surface is the DOM itself; <code>value</code> is written into it only when it
        changes from the outside (a save, a cancel, moving to another record). Rebuilding the
        field from React on every keystroke throws the caret to the start of the text, and you
        only notice while writing a long paragraph.
      </>
    ),
    rules: "Rules",
    sanitize: (
      <>
        The kit does <strong>not</strong> sanitise the HTML. Which tags are valid, and which are
        safe, is the product&apos;s rule; the kit cannot know which storefront this reaches. A
        server-side allow list is required.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For plain text use <Xref to="textarea">Textarea</Xref>, for a single line{" "}
        <Xref to="input">Input</Xref>. To render the produced HTML legibly, use{" "}
        <code>.tamga-prose</code>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("rich-text")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo
        labels={dict.demo}
        align="start"
        code={`<RichText
  value={html}
  onChange={setHtml}
  allow={["bold", "italic", "link", "h3", "ul", "ol"]}
  labels={labels}
  ariaLabel="…"
/>`}
      >
        <RichTextDemo lang={lang} />
      </Demo>
      <P>{t.lead}</P>

      <H2>{t.allowH}</H2>
      <P>{t.allowP}</P>

      <H2>{t.pasteH}</H2>
      <P>{t.pasteP}</P>

      <H2>{t.caretH}</H2>
      <P>{t.caretP}</P>

      <H2>{t.rules}</H2>
      <Note>{t.sanitize}</Note>

      <H2>Props</H2>
      <Props of="RichText" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
