import { CodeDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("code")!.title[lang] };
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
        Bir panelde bu her zaman aynı üç şeydir: API anahtarı, webhook adresi, kurulum komutu.
        Üçünde de kullanıcının yaptığı tek şey <strong>kopyalamak</strong>, o yüzden kopyalama
        düğmesi bir seçenek değil, bileşenin kendisi.
      </>
    ),
    fail: (
      <>
        <strong>Kopyalama panosu her yerde çalışmaz</strong> (HTTPS olmayan bir kaynakta, ya da
        izin verilmemişse). Başarısızlık <strong>sessiz olmamalı</strong>: düğme metni değişmezse
        kullanıcı kopyalandığını sanır ve boş yapıştırır. O yüzden üçüncü bir durum var.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Gizlenmesi gereken bir değer için <Xref to="secret-field">Secret field</Xref>; satır içi
        tek bir tuş için <Xref to="kbd">Kbd</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        In a panel this is always the same three things: an API key, a webhook address, an install
        command. In all three the only thing the user does is <strong>copy</strong>, which is why
        the copy button is not an option but the component itself.
      </>
    ),
    fail: (
      <>
        <strong>The clipboard does not work everywhere</strong> (on a non-HTTPS origin, or without
        permission). The failure <strong>must not be silent</strong>: if the button text does not
        change, the user believes it copied and pastes nothing. Hence a third state.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        For a value that should be hidden, <Xref to="secret-field">Secret field</Xref>; for a
        single inline key, <Xref to="kbd">Kbd</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("code")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" grid={false} code={`<Code labels={{ copy: "…", copied: "…", failed: "…" }}>
  npm install tamga-ui
</Code>`}>
        <div className="w-full">
          <CodeDemo lang={lang} />
        </div>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.fail}</Note>

      <H2>Props</H2>
      <Props of="Code" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
