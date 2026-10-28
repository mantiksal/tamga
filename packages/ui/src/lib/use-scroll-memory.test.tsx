import { describe, expect, it } from "vitest";
import { act, render } from "@testing-library/react";
import { useRef } from "react";
import { useScrollMemory } from "./use-scroll-memory.js";

/* GERİ DÖNÜNCE BIRAKILAN YER: kayan alanın konumu adres başına tutulur, yalnız geri/ileri ile
   dönülünce geri gelir. jsdom yerleşim yapmıyor; alanın yüksekliği elle veriliyor. */
function Scroller() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollMemory(ref);
  return <div ref={ref} data-scroller />;
}
const frames = () => new Promise((r) => setTimeout(r, 400));

describe("useScrollMemory", () => {
  it("geri dönülen adresin konumunu geri getirir, yeni bağlantıda dokunmaz", async () => {
    sessionStorage.clear();
    history.replaceState(null, "", "/liste");
    render(<Scroller />);
    const el = document.querySelector<HTMLElement>("[data-scroller]")!;
    Object.defineProperty(el, "scrollHeight", { configurable: true, value: 5000 });
    Object.defineProperty(el, "clientHeight", { configurable: true, value: 800 });

    /* Listede aşağı inilip bir satıra basılıyor: basıldığı an yer yazılır. */
    el.scrollTop = 1200;
    act(() => {
      document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    });
    history.pushState(null, "", "/liste/1");
    el.scrollTop = 0;

    /* Geri: liste adresi, eski yer. */
    history.pushState(null, "", "/liste");
    await act(async () => {
      window.dispatchEvent(new PopStateEvent("popstate"));
      await frames();
    });
    expect(el.scrollTop).toBe(1200);

    /* Aynı adrese yeni bir bağlantıyla gelmek (popstate yok) yeri geri getirmez. */
    history.pushState(null, "", "/liste/1");
    el.scrollTop = 0;
    history.pushState(null, "", "/liste");
    await act(async () => {
      await frames();
    });
    expect(el.scrollTop).toBe(0);
  });

  it("touchpad'in geri kaydırması yeri getirmeyi durdurmaz", async () => {
    sessionStorage.clear();
    history.replaceState(null, "", "/liste");
    render(<Scroller />);
    const el = document.querySelector<HTMLElement>("[data-scroller]")!;
    Object.defineProperty(el, "scrollHeight", { configurable: true, value: 5000 });
    Object.defineProperty(el, "clientHeight", { configurable: true, value: 800 });
    el.scrollTop = 900;
    act(() => {
      document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    });
    history.pushState(null, "", "/liste/2");
    el.scrollTop = 0;
    history.pushState(null, "", "/liste");
    await act(async () => {
      window.dispatchEvent(new PopStateEvent("popstate"));
      /* Hareketin kendisi: yatay, ardından küçük dikey atalet. */
      el.dispatchEvent(new WheelEvent("wheel", { deltaX: -40, deltaY: 2 }));
      el.dispatchEvent(new WheelEvent("wheel", { deltaX: 0, deltaY: 3 }));
      await frames();
    });
    expect(el.scrollTop).toBe(900);
  });

  it("hatırlanan yer yoksa sayfa başından açılır, öncekinin kaydırmasını taşımaz", async () => {
    sessionStorage.clear();
    history.replaceState(null, "", "/a");
    render(<Scroller />);
    const el = document.querySelector<HTMLElement>("[data-scroller]")!;
    Object.defineProperty(el, "scrollHeight", { configurable: true, value: 5000 });
    Object.defineProperty(el, "clientHeight", { configurable: true, value: 800 });
    /* Bir sayfanın dibinden, hiç kaydırılmamış bir sayfaya geri. */
    history.pushState(null, "", "/b");
    el.scrollTop = 4200;
    history.pushState(null, "", "/a");
    await act(async () => {
      window.dispatchEvent(new PopStateEvent("popstate"));
      await frames();
    });
    expect(el.scrollTop).toBe(0);
  });
});
