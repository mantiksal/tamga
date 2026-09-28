"use client";

import { useCallback, useEffect, useState } from "react";

/** Sayfanın ve `<head>`teki engelleyici script'in paylaştığı tek anahtar. */
export const TEMA_ANAHTARI = "docs-theme";

export type Tema = "light" | "dark";

/**
 * Temanın sahibi BURASI, kit değil.
 *
 * İKİ SEÇENEK, ÜÇ DEĞİL. Kitin `ThemeToggle`u bir de "sistem" tutuyor; bu site
 * tutmuyor: okuyucu açık mı koyu mu istediğini söylüyor, o kadar. İlk ziyarette
 * başlangıç değerini yine işletim sistemi veriyor (aşağıdaki script), ama
 * seçildiği an tercih ikisinden biri oluyor.
 *
 * İLK BOYAMA `<head>`TEKİ SCRIPT'İN İŞİ. Bu etki React bağlandıktan sonra
 * koşuyor, yani koyu tema seçmiş biri bir kare açık ekran görürdü. Kitin
 * dokümanı da bunu böyle söylüyor: engelleyici script uygulamanın işi, çünkü
 * kitin bir `<head>`i yok.
 *
 * Gerekçe: docs/07-dokuman-sitesi.md
 */
export function useTema(): [Tema, (next: Tema) => void] {
  /* Başlangıç "light": sunucu tercihi bilmiyor. Buradaki değer yalnız KONTROLÜN
     hangi hücresinin seçili görüneceğini söylüyor; sayfanın rengini script
     zaten bastı, ve aşağıdaki etki kontrolü onunla eşitliyor. */
  const [tema, setTema] = useState<Tema>("light");

  useEffect(() => {
    setTema(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const sec = useCallback((next: Tema) => {
    setTema(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    /* `color-scheme` de yazılıyor: yoksa tarayıcının kendi çizdiği şeyler
       (kaydırma çubuğu, tarih seçicinin takvimi) açık kalıyor. */
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem(TEMA_ANAHTARI, next);
    } catch {
      /* Depolama kapalıysa tema yine çalışır, yalnız hatırlanmaz. */
    }
  }, []);

  return [tema, sec];
}
