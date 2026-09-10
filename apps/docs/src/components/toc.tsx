"use client";

import { useEffect, useState } from "react";

/**
 * Sayfanın kendi başlıklarından üretilen içindekiler.
 *
 * NEDEN DOM'DAN OKUNUYOR. Alternatif, her sayfanın başlık listesini elle bir
 * dizide tutmasıydı — ve o dizi bir gün metinle ayrışırdı: biri başlığı
 * değiştirir, listeyi unutur, menü olmayan bir bölüme link verir. Başlıkların
 * tek kaynağı sayfanın kendisi olsun; liste ondan türesin.
 *
 * Aktif satır `IntersectionObserver` ile bulunuyor: kaydırma olayını her
 * piksellde dinlemek yerine tarayıcı hangi başlığın görünür olduğunu kendisi
 * söylüyor.
 */
export function Toc({ label }: { label: string }) {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState<string>();

  useEffect(() => {
    const heads = Array.from(document.querySelectorAll<HTMLHeadingElement>("main h2[id]"));
    setItems(heads.map((h) => ({ id: h.id, text: h.textContent ?? "" })));
    if (heads.length === 0) return;

    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        /* Ekranda birden çok başlık olabilir; en yukarıdaki kazanır. */
        const first = heads.find((h) => seen.get(h.id));
        if (first) setActive(first.id);
      },
      /* Üst şeridin altında kalan bir başlık "görünür" sayılmamalı. */
      { rootMargin: "-72px 0px -70% 0px" },
    );
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);

  /* Başlığı olmayan bir sayfada bu sütun HİÇ var olmamalı — boş bir <aside>
     yer kaplar ve sayfayı sola yaslanmış gösterir. O yüzden sarmalayıcı da
     burada; null dönünce sütun tamamen yok olur. */
  if (items.length < 2) return null;

  return (
    <aside
      className="sticky hidden shrink-0 overflow-y-auto py-9 pl-7 xl:block"
      style={{ width: "var(--docs-toc)", top: "var(--docs-top)", height: "calc(100dvh - var(--docs-top))" }}
      aria-label={label}>
      <p className="docs-eyebrow mb-3 pl-4">{label}</p>
      <ul className="border-l border-[var(--color-line)]">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className="docs-toc-link no-underline"
              aria-current={active === i.id ? "true" : undefined}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
