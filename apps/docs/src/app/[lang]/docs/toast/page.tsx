import { ToastDemo } from "@/components/interactive";
import { Toast, ToastViewport } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("toast")!.title[lang] };
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
    lead: "Bir eylemin sonucunu söyler ve çekilir. Tıkla, aşağı sağda görünecek:",
    corners: "Dört köşe",
    cornersWhy: (
      <>
        <code>ToastViewport</code> dört köşeyi de destekliyor ve <strong>varsayılan
        <code> top-right</code></strong>. Seçim ürünün şekline bağlı: altta sabit bir eylem çubuğu
        olan bir panelde alt köşeler onun altında kalır; üstte geniş bir başlık şeridi varsa üst
        köşeler onunla çakışır.
      </>
    ),
    saved: "Kaydedildi",
    stack: (
      <>
        En fazla üç toast üst üste durur ve yenisi eskisini iter. Dördüncüsü gelirse en eskisi
        düşer, çünkü dört bildirim aynı anda okunmaz, yalnız üst üste birikir.
      </>
    ),
    rules: "Kurallar",
    notError: (
      <>
        <strong>Toast bir hata mesajı değildir.</strong> Kaybolan bir kutuya, kullanıcının okuması{" "}
        <em>gereken</em> bir şey konmaz; bir işlem gerçekten başarısızsa yeri sayfanın içidir
        (<Xref to="alert">Alert</Xref> ya da{" "}
        <Xref to="error-state">Error state</Xref>). Toast &quot;oldu&quot; demek içindir.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Sayfada kalan uyarı <Xref to="alert">Alert</Xref>; yüklenemeyen bir şey{" "}
        <Xref to="error-state">Error state</Xref>.
      </>
    ),
  },
  en: {
    lead: "It reports the result of an action and withdraws. Click, and it appears at the bottom right:",
    corners: "Four corners",
    cornersWhy: (
      <>
        <code>ToastViewport</code> supports all four corners and <strong>defaults to
        <code> top-right</code></strong>. The choice depends on the product&apos;s shape: in a
        panel with a fixed action bar at the bottom, the bottom corners sit under it; with a wide
        header strip at the top, the top corners collide with it.
      </>
    ),
    saved: "Saved",
    stack: (
      <>
        At most three toasts stack, and a new one pushes the old ones down. A fourth drops the
        oldest, because four notifications are not read at once, they only pile up.
      </>
    ),
    rules: "Rules",
    notError: (
      <>
        <strong>A toast is not an error message.</strong> Nothing the user <em>needs</em> to read
        goes in a box that disappears, if an operation genuinely failed, its place is inside the
        page (<Xref to="alert">Alert</Xref> or{" "}
        <Xref to="error-state">Error state</Xref>). A toast is for saying &quot;done&quot;.
      </>
    ),
    related: "Related",
    rel: (
      <>
        A warning that stays on the page is <Xref to="alert">Alert</Xref>; something that failed to
        load is <Xref to="error-state">Error state</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("toast")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} code={`<ToastViewport position="bottom-right">
  {items.map((t) => (
    <Toast key={t.id} tone={t.tone} title={t.title} dismissLabel="…" onDismiss={…} />
  ))}
</ToastViewport>`}>
        <ToastDemo lang={lang} />
      </Demo>
      <P>{t.stack}</P>

      <H2>{t.corners}</H2>
      <P>{t.cornersWhy}</P>
      <Demo
        labels={dict.demo}
        align="start"
        grid={false}
        code={`<ToastViewport position="top-left">…</ToastViewport>
<ToastViewport position="top-right">…</ToastViewport>
<ToastViewport position="bottom-left">…</ToastViewport>
<ToastViewport position="bottom-right">…</ToastViewport>`}
      >
        {/* Gerçek `ToastViewport` sabit konumlu (`fixed`) — sayfanın köşesine
            yapışır. Bir örnekte onu kullanmak dört kutuyu ekranın gerçek
            köşelerine fırlatırdı, o yüzden burada yerleşim şeması var. */}
        <div className="relative h-56 w-full">
          {(
            [
              ["top-left", "top-2 left-2"],
              ["top-right", "top-2 right-2"],
              ["bottom-left", "bottom-2 left-2"],
              ["bottom-right", "bottom-2 right-2"],
            ] as const
          ).map(([pos, cls]) => (
            <span key={pos} className={`absolute w-52 ${cls}`}>
              <Toast tone="positive" title={t.saved} dismissLabel="✕" />
              <span className="mt-1 block text-center font-mono text-caption text-ink-faint">
                {pos}
              </span>
            </span>
          ))}
        </div>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.notError}</Note>

      <H2>Props</H2>
      <Props of="Toast" lang={lang} />
      <Props of="ToastViewport" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
