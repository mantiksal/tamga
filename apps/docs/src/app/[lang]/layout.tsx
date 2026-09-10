import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import "../globals.css";

/**
 * Kök layout — ve dilin `<html lang>` niteliğine ulaştığı yer.
 *
 * `app/layout.tsx` yok: kök layout doğrudan `[lang]` içinde, çünkü `lang`
 * niteliği segmenti bilmek zorunda. Ekran okuyucu telaffuzunu, tarayıcı çeviri
 * teklifini ve tireleme kurallarını o nitelik belirler.
 */

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const tr = lang === "tr";
  return {
    title: { default: "Tamga Design System", template: "%s · Tamga Design System" },
    description: tr
      ? "Mantıksal'ın tasarım sistemi. Token'lar, dört yasa ve doksan altı bileşen; on panel tek karakterde."
      : "A design system by Mantıksal. Tokens, four laws and ninety six components, so ten panels keep one character.",
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
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
  return (
    <html lang={lang} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
