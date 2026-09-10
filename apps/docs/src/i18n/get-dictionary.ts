import "server-only";
import type { Locale } from "./config";

/**
 * Arayüz metinlerinin sözlüğü — Next.js'in App Router i18n kalıbı.
 *
 * Dinamik import bilinçli: her dilin katalogu YALNIZ o dil istendiğinde
 * yüklenir. Statik import etseydik iki dilin metni de her sayfanın paketine
 * girerdi ve dil sayısı arttıkça büyürdü.
 *
 * Burada YALNIZ arayüz metinleri var — menü etiketleri, düğme adları. Sayfa
 * İÇERİĞİ burada değil: bir doküman sayfasının paragrafını JSON anahtarına
 * çevirmek onu okunamaz hâle getirir. İçerik kendi dosyasında, iki dilli.
 */
const dictionaries = {
  tr: () => import("./dictionaries/tr.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
} as const;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["tr"]>>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> => dictionaries[locale]();
