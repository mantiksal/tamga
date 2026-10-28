import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ScoreRing } from "./gauge.js";

/* HALKANIN İÇİ ÜRÜNÜN SÖYLEDİĞİ: yay değeri izler, metin verildiyse o yazılır
   (kesin puanı tam sayının altına ayrıca yazmak tekrar oluyordu). */
describe("ScoreRing · display", () => {
  it("verilmezse yuvarlanmış değer", () => {
    const { container } = render(<ScoreRing value={66.3} label="Puan 66" />);
    expect(container.querySelector(".tamga-ring-ic")!.textContent).toBe("66");
  });
  it("verilirse metin, yay yine değerden", () => {
    const { container } = render(<ScoreRing value={66.3} label="Puan 66,3" display="66,3" />);
    expect(container.querySelector(".tamga-ring-ic")!.textContent).toBe("66,3");
    const ring = container.querySelector<HTMLElement>(".tamga-ring")!;
    expect(ring.style.getPropertyValue("--ring-yay")).toBe(`${66.3 * 3.6}deg`);
  });
  it("üç karakterden uzun metin bir kademe küçük", () => {
    const { container } = render(<ScoreRing value={66.3} label="Puan" display="66,3" size={100} />);
    expect(container.querySelector<HTMLElement>(".tamga-ring-ic")!.style.fontSize).toBe("20px");
    const tam = render(<ScoreRing value={100} label="Puan" size={100} />);
    expect(tam.container.querySelector<HTMLElement>(".tamga-ring-ic")!.style.fontSize).toBe("25px");
  });
});
