import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ScoreMeter, ScoreRing } from "./gauge.js";

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

/* ÜRÜNÜN ÖLÇEĞİ: harf aralıkları eşit değil; bant genişliği aralığı izliyor, değerin bandı
   işaretli, sayı ürünün söylediği gibi. */
describe("ScoreMeter · scale", () => {
  const SCALE = [
    { to: 40, label: "F 0–39", tone: "danger" },
    { to: 60, label: "D 40–59", tone: "elevated" },
    { to: 75, label: "C 60–74", tone: "caution" },
    { to: 85, label: "B 75–84", tone: "info" },
    { to: 95, label: "A 85–94", tone: "positive" },
    { to: 100, label: "A+ 95–100", tone: "positive" },
  ] as const;
  it("bantlar aralık kadar geniş, değerin bandı işaretli", () => {
    const { container } = render(
      <ScoreMeter value={66.3} label="Sağlık puanı" scale={SCALE} display="66,3" head={false} markLabel />,
    );
    const yol = container.querySelector<HTMLElement>(".tamga-meter-bantlar")!;
    expect(yol.style.gridTemplateColumns).toBe("40fr 20fr 15fr 10fr 10fr 5fr");
    const on = container.querySelectorAll(".tamga-meter-adlar > [data-on]");
    expect(on).toHaveLength(1);
    expect(on[0]!.textContent).toBe("C 60–74");
    expect(container.querySelector(".tamga-meter-deger")!.textContent).toBe("66,3");
    expect(container.querySelector(".tamga-meter-ust")).toBeNull();
  });
  it("ölçeğin tepesi son bantta", () => {
    const { container } = render(<ScoreMeter value={100} label="Puan" scale={SCALE} />);
    expect(container.querySelector(".tamga-meter-adlar > [data-on]")!.textContent).toBe("A+ 95–100");
  });
});
