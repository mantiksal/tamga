import type { MetadataRoute } from "next";
import { ALL_PAGES } from "@/content/nav";
import { SITE } from "@/content/site";
import { yol } from "@/content/yollar";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * `/sitemap.xml` · her sayfa, iki dilde, YEREL ADRESİYLE.
 *
 * Adresi `yol()` üretiyor, elle birleştirilmiyor: Türkçe sayfa `/tr/docs/ikonlar`
 * ve bu haritaya `/tr/docs/icons` yazılsaydı Google 308'e bakardı.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  /* Her girdi öteki dildeki eşini de söylüyor: Google ikisini ayrı sayfa değil
     aynı sayfanın iki dili sayıyor. */
  const diller = (slug?: string) => ({
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `${SITE}${yol(l, slug)}`])),
      "x-default": `${SITE}${yol(defaultLocale, slug)}`,
    },
  });
  const girdi = (slug?: string) =>
    locales.map((lang) => ({
      url: `${SITE}${yol(lang, slug)}`,
      alternates: diller(slug),
      priority: slug ? 0.7 : 1,
    }));

  return [...girdi(), ...ALL_PAGES.flatMap((sayfa) => girdi(sayfa.slug))];
}
