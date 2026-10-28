"use client";

import { useEffect, type RefObject } from "react";

/**
 * KAYAN ALANIN KONUMU ADRESE GÖRE. Tarayıcı geri dönüşte yalnız pencerenin konumunu getiriyor;
 * kabukta `main` kayıyor ve okur listenin başına atılıyordu. Yer adres başına tutulur, yalnız
 * geri/ileri ile dönülünce gelir. İçerik sonradan yükleniyorsa alan uzayana dek birkaç kare
 * denenir; okur kendisi kaydırırsa ya da süre dolarsa bırakılır.
 */

const KEY = "tamga:scroll";
const TRY_MS = 3000;
const GRACE_MS = 600;

const read = (): Record<string, number> => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as Record<string, number>;
  } catch {
    return {};
  }
};
const write = (map: Record<string, number>) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* Gizli pencere ya da dolu depo: bellek bu oturumda tutulmaz, sayfa yine çalışır. */
  }
};
const here = () => `${location.pathname}${location.search}`;

export function useScrollMemory(ref: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const positions = read();
    let saveTimer = 0;
    let frame = 0;

    const save = (at = here(), top = el.scrollTop) => {
      positions[at] = top;
      write(positions);
    };
    /* Kaydırma bitince yazılır; adres o anki adrestir. Yönlendiricinin yeni sayfa için yaptığı
       "başa dön" sıçraması da bekleyip yeni adresin altına yazılır, eskisini ezmez. */
    const onScroll = () => {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => save(), 150);
    };
    /* Bir bağlantıya basıldığı an da yazılır: gezinme kaydırma bitmeden başlayabilir. */
    const onPress = () => {
      window.clearTimeout(saveTimer);
      save();
    };

    let startedAt = 0;
    const stop = () => {
      window.cancelAnimationFrame(frame);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
    /* Touchpad'in "geri" kaydırması da wheel olayı üretiyor (yatay, ve ardından ataletle): onu
       okurun kendi kaydırması sanmak yeri hiç getirmiyordu. Yalnız dikey ve ilk anlardan sonra. */
    const onWheel = (e: WheelEvent) => {
      if (performance.now() - startedAt < GRACE_MS) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) stop();
    };
    const onPop = () => {
      stop();
      /* Hatırlanan yer yoksa da yeni sayfa başından açılır: alan sayfalar arasında aynı kalıyor ve
         bir önceki sayfanın kaydırmasını taşıyordu. */
      const target = positions[here()] ?? 0;
      startedAt = performance.now();
      const until = startedAt + TRY_MS;
      let reached = 0;
      el.addEventListener("wheel", onWheel, { passive: true });
      el.addEventListener("touchstart", stop, { passive: true });
      window.addEventListener("keydown", stop);
      const tick = () => {
        const now = performance.now();
        if (el.scrollHeight - el.clientHeight >= target) {
          el.scrollTop = target;
          reached ||= now;
          /* Ulaşıldıktan sonra kısa bir süre tutulur: yeni sayfanın kendi "başa dön"ü sonradan
             gelebilir. */
          if (now - reached > 200) return stop();
        }
        if (now < until) frame = window.requestAnimationFrame(tick);
        else stop();
      };
      frame = window.requestAnimationFrame(tick);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", onPress, true);
    window.addEventListener("popstate", onPop);
    return () => {
      stop();
      window.clearTimeout(saveTimer);
      el.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", onPress, true);
      window.removeEventListener("popstate", onPop);
    };
  }, [ref, enabled]);
}
