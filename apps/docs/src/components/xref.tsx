"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { defaultLocale, isLocale } from "@/i18n/config";
import { yol } from "@/content/yollar";

/**
 * Başka bir doküman sayfasına bağlantı — dili kendisi bulur.
 *
 * NEDEN BİR BİLEŞEN. Sayfa metinleri modül seviyesindeki bir `T` nesnesinde
 * yaşıyor; orada `lang` diye bir şey YOK, çünkü `lang` sayfa çizilirken
 * parametreden geliyor. Bağlantıları elle kurmak için her metin girdisini
 * `(lang) => …` biçiminde bir fonksiyona çevirmek gerekirdi — elli beş sayfada,
 * yüzlerce girdide, ve unutulan her birinde bağlantı dili düşürürdü.
 *
 * Burada dil YOLDAN okunuyor. Bir okuyucu İngilizce bir sayfadan bağlantıya
 * bastığında İngilizce sayfaya gider; kimse bunu hatırlamak zorunda değil.
 *
 * `to` bir SLUG, bir yol değil: `<Xref to="mini-button">`. Slug İÇ addır ve
 * çevrilmez; okuyucunun gördüğü adresi `yol()` üretiyor (bkz. `content/yollar.ts`).
 */
export function Xref({ to, children }: { to: string; children: ReactNode }) {
  const pathname = usePathname();
  const first = pathname.split("/")[1] ?? "";
  const lang = isLocale(first) ? first : defaultLocale;
  /* Sınıf kitten: bu site kitin dilini konuşmuyorsa kit bir dil değildir. */
  return (
    <Link href={yol(lang, to)} className="tamga-link">
      {children}
    </Link>
  );
}
