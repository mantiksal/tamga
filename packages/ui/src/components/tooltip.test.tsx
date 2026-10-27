import { describe, expect, it } from "vitest";
import { createEvent, fireEvent, render } from "@testing-library/react";
import { Tooltip } from "./overlay.js";

/* jsdom'da PointerEvent yok; `pointerType` olaya elle konuyor. */
/* React `onPointerLeave`i `pointerout`tan türetiyor; çıkılan yer `relatedTarget`. */
const dokun = (el: Element, tur: "pointerDown" | "pointerOut") => {
  const e = createEvent[tur](el, tur === "pointerOut" ? { relatedTarget: document.body } : {});
  Object.defineProperty(e, "pointerType", { value: "touch" });
  fireEvent(el, e);
};

const kabarcik = (c: HTMLElement) => c.querySelector<HTMLElement>("span.fixed");

/* DOKUNMA AÇIYOR. Dokunuşun sonundaki `pointerleave` kabarcığı açılmadan
   kapatıyordu ve iOS Safari düğmeye odak vermiyor: telefonda hiç açılmıyordu. */
describe("Tooltip · dokunmatik", () => {
  it("dokunuş açar, dokunuşun pointerleave'i kapatmaz, dışarı dokunuş kapatır", () => {
    const { container } = render(
      <div>
        <Tooltip label="Açıklama">
          <button type="button">Tetik</button>
        </Tooltip>
        <p data-disari>dışarı</p>
      </div>,
    );
    const sarmal = container.querySelector("span.relative")!;
    dokun(sarmal, "pointerDown");
    expect(kabarcik(container)).not.toBeNull();
    dokun(sarmal, "pointerOut");
    expect(kabarcik(container)).not.toBeNull();
    dokun(container.querySelector("[data-disari]")!, "pointerDown");
    expect(kabarcik(container)).toBeNull();
  });
});

describe("Tooltip · wrap", () => {
  it("varsayılan tek satır; wrap 288px'te kırar", () => {
    const a = render(
      <Tooltip label="Etiket" delay={0}>
        <button type="button">A</button>
      </Tooltip>,
    );
    fireEvent.focus(a.getByRole("button"));
    expect(kabarcik(a.container)!.className).toMatch(/whitespace-nowrap/);
    a.unmount();
    const b = render(
      <Tooltip wrap label="Uzun bir cümle." delay={0}>
        <button type="button">B</button>
      </Tooltip>,
    );
    fireEvent.focus(b.getByRole("button"));
    const k = kabarcik(b.container)!;
    expect(k.className).toMatch(/whitespace-normal/);
    expect(k.style.maxWidth).toBe("min(18rem, calc(100vw - 2rem))");
  });
});

/* ŞERİDİN GÜNÜ KİTİN İPUCUYLA: `title` gecikiyordu ve görünmüyordu. */
describe("TimelineStrip · gün ipucu", () => {
  it("üstüne gelince kutunun sözünü hemen gösteriyor", async () => {
    const { TimelineStrip } = await import("./timeline-strip.js");
    const { container } = render(
      <TimelineStrip data={["positive", "danger"]} describe={(i) => (i === 1 ? "25 Ekim · %63" : "")} />,
    );
    const hucre = container.querySelector('[aria-label="25 Ekim · %63"]')!;
    expect(hucre).not.toBeNull();
    fireEvent.pointerEnter(hucre.parentElement!);
    expect(container.querySelector("span.fixed")?.textContent).toContain("25 Ekim · %63");
  });
});
