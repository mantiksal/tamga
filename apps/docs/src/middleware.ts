import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { genelSegment, icSlug } from "@/content/yollar";

/**
 * Dil öneki olmayan her adresi bir dile yönlendirir — Next.js'in App Router
 * i18n kalıbı.
 *
 * NEDEN ÖNEK VAR. Bir doküman sitesinin sayfaları paylaşılır ve indekslenir;
 * dil adresin parçası olmalı. Slack'e yapıştırılan bir link, yazıldığı dilde
 * açılmalı — okuyanın tarayıcı ayarında değil. (Bu, oturum arkasındaki bir
 * ÜRÜNÜN tersidir: orada dil hesabın kararıdır ve önek ikinci bir doğruluk
 * kaynağı olur. dashboard-v5 Karar #5 · 5f tam olarak bu ayrımı yapıyor.)
 *
 * NEDEN KÜTÜPHANE YOK. Resmî örnek `negotiator` + `@formatjs/intl-localematcher`
 * kullanıyor. Burada iki dil var ve tek yapılan iş `Accept-Language`'ın ilk
 * eşleşmesini bulmak — iki bağımlılık, on satırlık bir işe fazla.
 */
function pickLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  /* `tr-TR,tr;q=0.9,en-US;q=0.8` → kalite sırasına göre temel diller */
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: (tag ?? "").trim().toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter((x) => x.tag)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    const hit = locales.find((l) => l === base);
    if (hit) return hit;
  }
  return defaultLocale;
}

/**
 * Yerelleştirilmiş yolun iç rotaya çevrilmesi.
 *
 * `/tr/docs/ikonlar` REWRITE ile `/tr/docs/icons`e gidiyor: adres çubuğunda
 * Türkçe yazım kalıyor, dosya sistemindeki tek klasör çiziliyor.
 *
 * Ters yön REDIRECT: `/tr/docs/icons` doğrudan girilirse 308 ile
 * `/tr/docs/ikonlar`a gidiyor. Yoksa aynı sayfanın iki adresi olur ve hangisinin
 * kanonik olduğu belirsizleşir; eski bağlantılar da böylece ölmüyor.
 */
function yerelYol(request: NextRequest, locale: Locale) {
  const parcalar = request.nextUrl.pathname.split("/");
  /* ["", lang, "docs", segment] */
  if (parcalar[2] !== "docs" || !parcalar[3]) return null;
  const segment = parcalar[3];

  const ic = icSlug(locale, segment);
  if (ic && ic !== segment) {
    const url = request.nextUrl.clone();
    parcalar[3] = ic;
    url.pathname = parcalar.join("/");
    return NextResponse.rewrite(url);
  }

  const genel = genelSegment(locale, segment);
  if (genel !== segment) {
    const url = request.nextUrl.clone();
    parcalar[3] = genel;
    url.pathname = parcalar.join("/");
    return NextResponse.redirect(url, 308);
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Zaten dilli mi? Öyleyse yalnız yol çevirisine bak. */
  const mevcut = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (mevcut) return yerelYol(request, mevcut) ?? NextResponse.next();

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /* Statik dosyalar ve API yolları dışarıda: bir SVG'nin dili yok. */
  matcher: ["/((?!_next|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)"],
};
