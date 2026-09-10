import { AccordionDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("accordion")!.title[lang] };
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
        Ayar grupları, SSS, uzun formlar. Ürün bunu dört dosyada ham{" "}
        <code>&lt;details&gt;</code> ile yazıyordu.
      </>
    ),
    whyNotDetails: (
      <>
        <strong>Neden <code>&lt;details&gt;</code> değil.</strong> O doğru bir eleman ve
        klavyeyle çalışıyor; sorun davranışta değil, <strong>üçgende</strong>: tarayıcının kendi{" "}
        <code>▶</code> işareti tema tanımaz, boyutu her tarayıcıda farklıdır ve{" "}
        <code>list-style</code> ile gizlemek Safari&apos;de çalışmaz. Yani her kullanım kendi
        geçici çözümünü yazıyordu. Burada <code>aria-expanded</code> +{" "}
        <code>aria-controls</code> elle kuruluyor, karşılığında ok kitin kendi ikonu oluyor.
      </>
    ),
    search: (
      <>
        <strong>Arama uyarısı:</strong> kapalı içerik DOM&apos;da duruyor, yalnız gizli.
        Tarayıcının Ctrl+F&apos;i onu bulamaz. İçinde aranacak metin varsa (uzun bir SSS) bunu
        bilerek kabul et ya da bölümü açık başlat.
      </>
    ),
    single: (
      <>
        &quot;Aynı anda tek bölüm açık&quot; davranışı <strong>bilerek yok</strong>. Bir ayarlar
        sayfasında iki bölümü yan yana karşılaştırmak yaygın bir iş, ve otomatik kapanma onu
        imkânsız kılar. Gerekiyorsa çağıran kendi durumunu tutar.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Bir panelin içeriğini değiştiren sekmeler <Xref to="tabs">Tabs</Xref>; anahtar/değer
        listesi <Xref to="descriptions">Descriptions</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        Settings groups, FAQs, long forms. The product was writing this as raw{" "}
        <code>&lt;details&gt;</code> in four files.
      </>
    ),
    whyNotDetails: (
      <>
        <strong>Why not <code>&lt;details&gt;</code>.</strong> It is the correct element and it
        works with a keyboard; the problem is not behaviour but the <strong>triangle</strong>:
        the browser&apos;s own <code>▶</code> ignores your theme, differs in size between
        browsers, and hiding it with <code>list-style</code> does not work in Safari. So every
        use wrote its own workaround. Here <code>aria-expanded</code> and{" "}
        <code>aria-controls</code> are wired by hand, and in return the arrow is the kit&apos;s
        own icon.
      </>
    ),
    search: (
      <>
        <strong>A search warning:</strong> collapsed content stays in the DOM, merely hidden. The
        browser&apos;s Ctrl+F will not find it. If there is text worth searching inside (a long
        FAQ), accept that knowingly or start the section open.
      </>
    ),
    single: (
      <>
        &quot;Only one section open at a time&quot; is <strong>deliberately absent</strong>.
        Comparing two sections side by side on a settings page is common, and auto-closing makes
        it impossible. If you need it, the caller holds the state.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        Tabs that change a panel&apos;s content are <Xref to="tabs">Tabs</Xref>; a term/value list
        is <Xref to="descriptions">Descriptions</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("accordion")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<Accordion>
  <Collapsible title="…" meta="…" defaultOpen>…</Collapsible>
  <Collapsible title="…">…</Collapsible>
</Accordion>`}>
        <div className="w-full">
          <AccordionDemo lang={lang} />
        </div>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.whyNotDetails}</Note>
      <Note>{t.search}</Note>
      <P>{t.single}</P>

      <H2>Props</H2>
      <Props of="Collapsible" lang={lang} />
      <Props of="Accordion" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
