import { SecretDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("secret-field")!.title[lang] };
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
    lead: (
      <>
        <Xref to="password-input">Password input</Xref>&apos;un kardeşi ama işi{" "}
        <strong>ters</strong>: parola alanına bir şey <em>yazılır</em>, buraya yazılmaz; okunur
        ve kopyalanır. O yüzden salt-okunur, ve asıl düğmesi kopyalama.
      </>
    ),
    mask: (
      <>
        Maske ilk ve son birkaç karakteri <strong>bırakıyor</strong>. Tamamen gizlemek,
        kullanıcının &quot;hangi anahtar bu&quot; sorusunu cevapsız bırakır; üç anahtarı olan biri
        hangisine baktığını bilemez.
      </>
    ),
    focus: (
      <>
        Salt-okunur ama <strong>devre dışı değil</strong>: kullanıcı alanı seçip elle
        kopyalayabilmeli. <code>disabled</code> bunu imkânsız kılardı, ve kopyalama panosunun
        çalışmadığı bir ortamda tek yol o.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Gizlenmesi gerekmeyen bir komut için <Xref to="code">Code</Xref>; parola girişi{" "}
        <Xref to="password-input">Password input</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        A sibling of <Xref to="password-input">Password input</Xref> with the{" "}
        <strong>opposite</strong> job: a password field is <em>written</em> into; this one is not:
        it is read and copied. Hence read-only, and its real button is copy.
      </>
    ),
    mask: (
      <>
        The mask <strong>leaves</strong> the first and last few characters. Hiding it completely
        leaves &quot;which key is this&quot; unanswered; someone with three keys cannot tell which
        one they are looking at.
      </>
    ),
    focus: (
      <>
        Read-only but <strong>not disabled</strong>: the user must be able to select the field and
        copy by hand. <code>disabled</code> would make that impossible, and in an environment
        where the clipboard does not work, it is the only way.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        For a command that needs no hiding, <Xref to="code">Code</Xref>; for password entry,{" "}
        <Xref to="password-input">Password input</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("secret-field")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<SecretField
  value={apiKey}
  labels={{ reveal: "…", hide: "…", copy: "…", copied: "…", failed: "…" }}
/>`}>
        <SecretDemo lang={lang} />
      </Demo>
      <P>{t.mask}</P>

      <H2>{t.rules}</H2>
      <Note>{t.focus}</Note>

      <H2>Props</H2>
      <Props of="SecretField" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
