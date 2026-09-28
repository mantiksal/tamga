import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import SAYILAR from "@/content/counts.json";
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
 * AÇIKLAMADAKİ SAYI ELLE YAZILMIYOR.
 *
 * Bu cümle "doksan altı bileşen" diyordu; gerçek sayı 122, ve 96 bileşenin
 * değil SAYFANIN sayısı. Ana sayfa aynı hatayı bir kez yapıp `counts.json`a
 * geçmişti, bu satır geride kalmıştı. Arama sonucunda ve link önizlemesinde
 * görünen tek cümlenin yanlış olması, kapılarla tutarlılık satan bir sistemin
 * verebileceği en kötü ilk izlenim.
 *
 * "DÖRT YASA" BURADAN ÇIKARILDI, ve sebebi üslup değil: yasalar tanıtım
 * sayfasında geçmiyor. Arama sonucunda verilen söz, tıklayanın indiği sayfada
 * karşılanmıyordu. Kural: bu cümle yalnız `/` üzerinde görünen şeyi vaat eder.
 * Yasalar tanıtım sayfasına çıkarsa bu satır geri gelebilir; yeri `docs/physics`.
 */
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
      ? `Mantıksal'ın tasarım sistemi. Token'lar ve ${SAYILAR.bilesen} bileşen; on panel tek karakterde.`
      : `A design system by Mantıksal. Tokens and ${SAYILAR.bilesen} components, so ten panels keep one character.`,
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
      <body>{children}</body>
    </html>
  );
}
