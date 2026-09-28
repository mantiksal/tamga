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
export function Toc({ label, ornek }: { label: string; ornek: string }) {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState<string>();

  useEffect(() => {
    /* ÖRNEK KUTUSU DA BİR SATIR, ve başlığı yok: bileşen sayfalarında ilk
       görülen şey o kutu, ve içindekilerde karşılığı olmayan bir bölüm
       okuyucuya "buraya dönemezsin" demek. Kimliği BURADA veriliyor, kutunun
       kendisinde değil: bir sayfada birden çok örnek olabiliyor ve aynı id'yi
       iki kez basmak geçersiz HTML olurdu. */
    const kutu = document.querySelector<HTMLElement>("main .docs-demo");
    if (kutu && !kutu.id) kutu.id = "ornek";

    const heads = Array.from(document.querySelectorAll<HTMLHeadingElement>("main h2[id]"));
    /* `data-toc` varsa o kazanıyor: numaralı adımların başlığı numarayı
       tekrar etmiyor (numara kutuda), ama içindekiler sırayı söylemek zorunda. */
    setItems([
      ...(kutu ? [{ id: kutu.id, text: ornek }] : []),
      ...heads.map((h) => ({ id: h.id, text: h.dataset.toc ?? h.textContent ?? "" })),
    ]);
    if (heads.length === 0 && !kutu) return;

    /* AKTİF BAŞLIK KONUMDAN HESAPLANIYOR, "kesişiyor mu" sorusundan değil.

       Önce gözlemcinin kendi cevabı kullanılıyordu: ekranın üst şeridinde dar
       bir bant tanımlanıp o banda giren başlık aktif sayılıyordu. Bant dardı ve
       iki başlık arasında BOŞ kalıyordu: uzun bir bölümün ortasında hiçbir
       satır yanmıyordu, yani içindekiler tam da en çok işe yarayacağı yerde
       susuyordu. (Ölçüldü: dört bölümlük bir sayfada `aria-current` hiç
       basılmadı.)

       Kural artık konumsal ve boşluk bırakmıyor: şeridin altını geçmiş SON
       başlık aktif. Gözlemci yalnız TETİKLEYİCİ, cevabın kendisi değil; her
       piksel için kaydırma dinlemek yerine geçişlerde uyanıyor. */
    const esik = 92;
    const hedefler = [...(kutu ? [kutu] : []), ...heads];
    const hesapla = () => {
      let aktif = hedefler[0]?.id;
      for (const h of hedefler) if (h.getBoundingClientRect().top <= esik) aktif = h.id;
      setActive(aktif);
    };
    const io = new IntersectionObserver(hesapla, { rootMargin: `-${esik}px 0px 0px 0px` });
    hedefler.forEach((h) => io.observe(h));
    hesapla();
    return () => io.disconnect();
  }, [ornek]);

  /* Başlığı olmayan bir sayfada bu sütun HİÇ var olmamalı — boş bir <aside>
     yer kaplar ve sayfayı sola yaslanmış gösterir. O yüzden sarmalayıcı da
     burada; null dönünce sütun tamamen yok olur. */
  if (items.length < 2) return null;

  return (
    <aside
      className="sticky hidden shrink-0 flex-col overflow-y-auto pt-11 pr-5 pb-10 toc:flex"
      style={{ width: "var(--docs-toc)", top: "var(--docs-top)", height: "calc(100dvh - var(--docs-top))" }}
      aria-label={label}
    >
      <p className="docs-toc-baslik pb-2 pl-3">{label}</p>
      <ul className="flex list-none flex-col p-0">
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
