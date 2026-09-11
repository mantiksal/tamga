import { defaultLocale, locales, type Locale } from "@/i18n/config";

/**
 * Yerelleştirilmiş yollar: bir sayfanın iç adı ile genel adresi ayrı şeyler.
 *
 * NEDEN GEREKİYORDU. Yönlendirme `app/[lang]/docs/<slug>/page.tsx`, ve Next'te
 * klasör adı doğrudan URL segmenti oluyor — yani bir klasör bir yazım demek.
 * Elle kurulmuş bir `[lang]` düzeni sayfa başına tek bir slug taşıyabiliyor, ve
 * Türkçe okuyan biri adres çubuğunda `docs/icons` görüyordu.
 *
 * Bu bir kısıttı, bir ilke değil; bir süre ilke gibi yazılmıştı ("slug'lar
 * çevrilmez") ve yanlıştı. Çözümün adı LOCALIZED PATHNAMES: uygulama iç rotaya
 * göre yazılır, middleware genel yolu ona yeniden yazar (`rewrite`).
 *
 * İÇ AD İNGİLİZCE KALIYOR, ve bu ilk gerekçenin doğru yarısı: `<Xref to="icons">`
 * bir tanımlayıcıdır, çevrilmez. Çevrilen şey yalnız okuyucunun gördüğü adres.
 *
 * BİLEŞEN SAYFALARI İKİ DİLDE DE AYNI. `Button` sayfasının başlığı iki dilde de
 * "Button" — `nav.ts` bunu bilerek yapıyor, çünkü kodda yazılacak şey
 * `<Button>`. Sayfa "Button" derken yolun "dugme" demesi ikinci bir ad üretir.
 * O yüzden yalnız KAVRAM sayfaları çevrildi.
 */
export const YOLLAR: Record<string, Partial<Record<Locale, string>>> = {
  installation: { tr: "kurulum" },
  theme: { tr: "tema" },
  physics: { tr: "fizik" },
  tokens: { tr: "tokenlar" },
  icons: { tr: "ikonlar" },
  blocks: { tr: "bloklar" },
  templates: { tr: "sablonlar" },
  "new-panel": { tr: "yeni-panel" },
  appearance: { tr: "gorunum" },
  "list-screen": { tr: "liste-ekrani" },
};

/** İç slug → o dildeki genel segment. Haritada yoksa slug'ın kendisi. */
export function genelSegment(lang: Locale, slug: string): string {
  return YOLLAR[slug]?.[lang] ?? slug;
}

/** Bir doküman sayfasının adresi. Yol biçimi TEK yerde. */
export function yol(lang: Locale, slug?: string): string {
  return slug ? `/${lang}/docs/${genelSegment(lang, slug)}` : `/${lang}`;
}

/* Ters yön middleware'in ihtiyacı: gelen segment hangi iç sayfa. Harita küçük
   ve build sırasında sabit, o yüzden bir kez kurulup saklanıyor. */
const TERS: Record<Locale, Record<string, string>> = Object.fromEntries(
  locales.map((l) => [
    l,
    Object.fromEntries(Object.entries(YOLLAR).map(([slug, m]) => [m[l] ?? slug, slug])),
  ]),
) as Record<Locale, Record<string, string>>;

/** O dildeki genel segment → iç slug. Eşleşme yoksa `undefined`. */
export function icSlug(lang: Locale, segment: string): string | undefined {
  return TERS[lang]?.[segment];
}

export { defaultLocale };
