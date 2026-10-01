import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config";
import { SITE } from "@/content/site";
import "../globals.css";

/**
 * Kök layout — ve dilin `<html lang>` niteliğine ulaştığı yer.
 *
 * `app/layout.tsx` yok: kök layout doğrudan `[lang]` içinde, çünkü `lang`
 * niteliği segmenti bilmek zorunda. Ekran okuyucu telaffuzunu, tarayıcı çeviri
 * teklifini ve tireleme kurallarını o nitelik belirler.
 */

/* DÖRDÜNCÜ YÜZ YOK. Site bir ara Chakra Petch taşıyordu (Google'dan çekilen bir
   marka yüzü, yalnız en büyük başlık tierinde). Kitin üç yüzü pakette geliyor ve
   "üç yüz, her birinin bir işi var" kitin kilitli kararı; dördüncüsü hem bir
   ağ isteği hem o kararla çelişen bir istisnaydı. Başlıklar artık kitin
   `--font-display`i (Red Hat Display) ile çiziliyor.
   Gerekçe: docs/07-dokuman-sitesi.md */

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * ARAMA SONUCUNDAKİ TEK CÜMLE · ve iki kuralı var.
 *
 * BİRİNCİSİ, ÜRÜNLE BAŞLAR, SAHİBİYLE DEĞİL. Cümle "Mantıksal'ın tasarım
 * sistemi" diye başlıyordu: arayan kişi Mantıksal'ı aramıyor, panelini
 * kuracak bir şey arıyor.
 *
 * İKİNCİSİ, YALNIZ `/` ÜZERİNDE GÖRÜNEN ŞEYİ VAAT EDER. Bir ara "dört yasa"
 * diyordu ve yasalar tanıtım sayfasında geçmiyordu; tıklayan vaat edileni
 * bulamıyordu. Markaya göre özelleştirme burada duruyor, çünkü sayfadaki
 * panelin marka rengi kontrolü tam olarak onu yapıyor.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const tr = lang === "tr";
  /* BAŞLIK SAYFANIN KENDİ CÜMLESİ, marka adı değil: arama sonucunda "Tamga
     Design System" yazıyordu ve ne olduğunu söyleyen tek satır açıklamaya
     kalıyordu. Bu cümle sayfanın H1'iyle aynı şeyi söylüyor. */
  const baslik = tr
    ? "Tamga · yönetim panelleri için açık kaynak tasarım sistemi"
    : "Tamga · an open source design system for admin panels";
  const aciklama = tr
    ? "Tamga, yönetim panelleri için geliştirilmiş açık kaynak bir tasarım sistemidir. Hazır bileşenleri, ekranları ve temayı markanıza göre özelleştirebilirsiniz."
    : "Tamga is an open source design system built for admin panels. Its components, ready made screens and theme can be tailored to your brand.";
  /* Adresler MUTLAK. Göreli `hreflang` ve kanonik yoktu: Google'a /tr ile /en'in
     aynı sayfanın iki dili olduğunu söyleyen bir şey kalmıyordu. */
  const diller = {
    ...Object.fromEntries(locales.map((l) => [l, `${SITE}/${l}`])),
    "x-default": `${SITE}/${defaultLocale}`,
  };
  return {
    metadataBase: new URL(SITE),
    title: { default: baslik, template: "%s · Tamga Design System" },
    description: aciklama,
    alternates: { canonical: `/${lang}`, languages: diller },
    /* Link önizlemesi: Slack'e, WhatsApp'a yapıştırılan adres çıplak
       görünüyordu, tek bir `og:` etiketi yoktu. Görsel dilin kendi kartı
       (`scripts/og-kart.mjs`), çünkü sayılar ve cümle çevrili. */
    openGraph: {
      type: "website",
      siteName: "Tamga Design System",
      locale: tr ? "tr_TR" : "en_US",
      url: `${SITE}/${lang}`,
      title: baslik,
      description: aciklama,
      images: [{ url: `/og-${lang}.png`, width: 1200, height: 630, alt: baslik }],
    },
    twitter: { card: "summary_large_image", title: baslik, description: aciklama, images: [`/og-${lang}.png`] },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  /* Segment kullanıcı girdisidir. Doğrulanmadan bir `import()` şablonuna girmesi
     yol geçişinin (path traversal) başladığı yerdir — bilinmeyen değer 404. */
  if (!isLocale(lang)) notFound();

  /* KABUK BURADA DEĞİL.

     İki düzen var: tanıtım sayfası (`/`) rayı olmayan, tam genişlikte bir
     sayfa; doküman (`/docs/*`) üç sütunlu. İkisini tek bir layout'ta tutmak,
     landing'in yanında 81 satırlık bir menü bırakırdı — "bu nedir" diye gelen
     birine hiçbir şey anlatmayan bir menü.

     Kök layout yalnız `<html lang>` için var; kabuğu her dal kendi seçiyor. */
  /* ARAMA MOTORUNA YAPILANDIRILMIŞ TANIM. Sayfadaki metinden çıkarılamayan üç
     şeyi söylüyor: bunu kim yayınlıyor, kaynak nerede, lisans ne.
     Gerekçe: docs/07-dokuman-sitesi.md */
  const veri = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE}/#site`,
        url: `${SITE}/${lang}`,
        name: "Tamga Design System",
        inLanguage: lang,
        publisher: { "@id": `${SITE}/#yayinci` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE}/#yayinci`,
        name: "Mantıksal",
        url: SITE,
        logo: `${SITE}/tamga-light.svg`,
      },
      {
        "@type": "SoftwareSourceCode",
        name: "tamga-ui",
        description: lang === "tr"
          ? "Yönetim panelleri için açık kaynak React bileşen kütüphanesi."
          : "An open source React component library for admin panels.",
        codeRepository: "https://github.com/mantiksal/tamga",
        programmingLanguage: "TypeScript",
        license: "https://opensource.org/licenses/MIT",
        url: `${SITE}/${lang}`,
      },
    ],
  };

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* TEMA İLK BOYAMADAN ÖNCE. Bu script engelleyici ve öyle olmak zorunda:
            React bağlandıktan sonra çalışan bir etki, koyu tema seçmiş birine bir
            kare açık ekran gösteriyor. Kitin dokümanı da bunu söylüyor, çünkü
            kitin bir `<head>`i yok ve bu iş uygulamanın.

            Anahtar `components/tema.tsx` ile AYNI; iki taraf farklı anahtar
            okursa tercih sessizce kaybolur. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var p=localStorage.getItem('docs-theme');" +
              "var d=p==='dark'||(!p&&matchMedia('(prefers-color-scheme: dark)').matches);" +
              "document.documentElement.classList.toggle('dark',d);" +
              "document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}",
          }}
        />
      </head>
      <body>
        {/* `afterInteractive` değil satır içi: arama motoru HTML'i okurken burada olmalı. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(veri) }}
        />{children}</body>
    </html>
  );
}
