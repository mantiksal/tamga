import type { Metadata } from "next";
import { findPage } from "@/content/nav";
import { SITE } from "@/content/site";
import { yol } from "@/content/yollar";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

/**
 * Bir doküman sayfasının meta verisi · TEK yerde.
 *
 * 98 sayfa yalnız başlığını veriyor, açıklamayı kök layout'tan miras alıyordu:
 * arama sonucunda 99 sayfanın HEPSİ aynı cümleyi gösteriyordu. Sayfanın kendi
 * cümlesi zaten `nav.ts`te duruyor (`blurb`) ve menüde de o yazıyor.
 */
export function sayfaMeta(slug: string, lang: Locale): Metadata {
  const sayfa = findPage(slug)!;
  const title = sayfa.title[lang];
  /* Blurb MENÜ UZUNLUĞUNDA ("Basılacak tuş"): tek başına bir arama sonucunu
     doldurmuyor, o yüzden arkasına sitenin ne olduğunu söyleyen sabit cümle
     geliyor. İkisi birlikte ~90 karakter, ve her sayfada farklı. */
  const description =
    lang === "tr"
      ? `${sayfa.blurb.tr} · Tamga, yönetim panelleri için açık kaynak tasarım sistemi.`
      : `${sayfa.blurb.en} · Tamga is an open source design system for admin panels.`;
  /* Kanonik ve hreflang SAYFA BAŞINA: Türkçe yol `/tr/docs/ikonlar`, İngilizce
     `/en/docs/icons`. Kök layout'un dil haritası yalnız ana sayfayı gösteriyor. */
  const diller = {
    ...Object.fromEntries(locales.map((l) => [l, `${SITE}${yol(l, slug)}`])),
    "x-default": `${SITE}${yol(defaultLocale, slug)}`,
  };
  return {
    title,
    description,
    alternates: { canonical: yol(lang, slug), languages: diller },
    openGraph: {
      type: "article",
      siteName: "Tamga Design System",
      locale: lang === "tr" ? "tr_TR" : "en_US",
      url: `${SITE}${yol(lang, slug)}`,
      title: `${title} · Tamga Design System`,
      description,
      images: [{ url: `/og-${lang}.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`/og-${lang}.png`] },
  };
}
