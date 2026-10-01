import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

/**
 * `/robots.txt` · ve bir süre YOKTU.
 *
 * Dosya olmayınca istek `[lang]` rotasına düşüyor, middleware onu
 * `/tr/robots.txt`e yönlendiriyordu: isteyen taraf dosya yerine 307 görüyor.
 * Site haritasının haber verildiği tek yer burası.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
