import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Chakra_Petch } from "next/font/google";
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

/**
 * Marka yüzü: YALNIZ EN BÜYÜK BAŞLIK TİERİNDE.
 *
 * DEĞİŞKEN `<html>`DE, ve bu tek satır bir olaydan öğrenildi: bir arayüzde
 * yüz `body`ye bağlanmış ama ölçek `:root`ta çözülmüştü; zincir koptu ve yüz
 * indirilip hiç boyanmadı. `docs/type` sayfası o olayı anlatıyor. Kural:
 * değişken, onu kullanan kuralın çözüldüğü yerden YUKARIDA tanımlanır.
 *
 * AĞIRLIKLAR GERÇEK KESİMLER. Chakra Petch değişken bir yüz değil; `.docs-h1`
 * 650 istiyordu ve o kesim yok, tarayıcı sentetik kalın üretirdi. Kural 600'e
 * çekildi, `.home-h1` zaten 700; ikisi de dosyada var olan kesimler.
 *
 * `latin-ext` ŞART: ğ ş İ ı ç ö ü onunla geliyor, site iki dilli.
 *
 * KİTE GİRMİYOR. `--font-display` sistem yığını olarak kalıyor: kit mekanizma
 * taşır, kimlik taşımaz. Orayı değiştirmek, kiti tüketen her panelin
 * başlıklarını bu sitenin markasına çevirirdi; gerekçe `docs/adr/0003`te.
 */
const markaYuzu = Chakra_Petch({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-brand",
});

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
    <html lang={lang} className={markaYuzu.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
