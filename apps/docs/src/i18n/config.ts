/**
 * Desteklenen dillerin TEK kaynağı.
 *
 * v1'in i18n'i kendisiyle çelişiyordu: bir dosya sekiz dil diyordu, provider
 * sekizini import ediyordu, layout ikisini sabitliyordu — üç ayrı doğruluk
 * kaynağı (dashboard-v5 `docs/08`). Middleware, sözlük yükleyici, dil
 * değiştirici ve `generateStaticParams` hepsi BURAYI import eder.
 */
export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

/** Dillerin kendi dillerindeki adı — bir dil değiştirici asla çeviri göstermez. */
export const endonym: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
};

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}
