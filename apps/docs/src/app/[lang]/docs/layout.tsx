import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { DocsShell } from "@/components/shell";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

/**
 * Doküman dalının kabuğu — ray, içerik, içindekiler.
 *
 * Tanıtım sayfası bunu almıyor. Ayrım burada, `layout.tsx` seviyesinde: bir
 * `if (pathname === "/")` ile aynı kabuğun içinde çözülebilirdi ve çözülmedi,
 * çünkü o koşul zamanla dallanır — "landing'de rayı gizle", "landing'de
 * içindekiler yok", "landing'de kap daha geniş". Üç koşul yerine iki dosya.
 */
export default async function DocsLayout({
  children,
  params,
}: {
  children: ReactNode;
  /* `Locale` DEĞİL, `string`. Next'in ürettiği `LayoutConfig` bir layout'un
     segment parametresini `string` olarak tipliyor, ve daraltılmış bir tip o
     kısıtı sağlamıyor: `next build` `validator.ts`'te TS2344 veriyor. Daraltma
     burada, kodda yapılıyor. */
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <DocsShell lang={lang} dict={dict}>
      {children}
    </DocsShell>
  );
}
