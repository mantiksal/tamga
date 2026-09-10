import { PasswordDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("password-input")!.title[lang] };
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
        <strong>Neden göster düğmesi.</strong> Yazdığını göremeyen kişi hata yapar ve hatayı
        göremez; parola alanlarındaki en yaygın başarısızlık yanlış yazımdır, çalınma değil.
        Görünürlük varsayılan olarak kapalı, ama açılabilir olmalı.
      </>
    ),
    type: (
      <>
        Düğme <code>type=&quot;button&quot;</code>. Unutulursa forma gönderim tetikler ve
        kullanıcı parolasını <em>görmeye çalışırken</em> formu yollar; <code>&lt;button&gt;</code>
        varsayılanının <code>submit</code> olmasından doğan klasik hata.
      </>
    ),
    autocomplete: (
      <>
        <code>autoComplete</code> çağırandan geliyor ve boş bırakılamaz: giriş ekranında{" "}
        <code>current-password</code>, kayıt ekranında <code>new-password</code>. Yanlış olan,
        parola yöneticisine yanlış şeyi kaydettirir.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Okunacak ve kopyalanacak bir sır için <Xref to="secret-field">Secret field</Xref>; etiket
        ve hata satırı için <Xref to="field">Field</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        <strong>Why a reveal button.</strong> Someone who cannot see what they typed makes
        mistakes and cannot see them; the most common failure in password fields is mistyping, not
        theft. Visibility is off by default, but it must be available.
      </>
    ),
    type: (
      <>
        The button is <code>type=&quot;button&quot;</code>. Forgotten, it submits the form; the
        user sends the form <em>while trying to see</em> their password. The classic consequence
        of <code>&lt;button&gt;</code> defaulting to <code>submit</code>.
      </>
    ),
    autocomplete: (
      <>
        <code>autoComplete</code> comes from the caller and cannot be left empty:{" "}
        <code>current-password</code> on a sign-in screen, <code>new-password</code> on sign-up.
        The wrong one makes a password manager save the wrong thing.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        For a secret that is read and copied, <Xref to="secret-field">Secret field</Xref>; for a
        label and an error line, <Xref to="field">Field</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("password-input")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} align="start" code={`<PasswordInput
  autoComplete="current-password"
  placeholder="…"
  labels={{ show: "…", hide: "…" }}
/>`}>
        <PasswordDemo lang={lang} />
      </Demo>
      <P>{t.lead}</P>

      <H2>{t.rules}</H2>
      <Note>{t.type}</Note>
      <Note>{t.autocomplete}</Note>

      <H2>Props</H2>
      <Props of="PasswordInput" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
