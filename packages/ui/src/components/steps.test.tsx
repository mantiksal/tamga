import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Steps } from "./display.js";

/* ADIMLAR BÜTÜN GENİŞLİĞE: aradaki çizgiler boşluğu dolduruyor; kapalıyken kendi boyunda ve sarıyor. */
describe("Steps · stretch", () => {
  const ADIMLAR = [{ key: "a", label: "Bilgi" }, { key: "b", label: "Ödeme" }, { key: "c", label: "Onay" }];
  it("kapalı: sarıyor, adımlar kendi boyunda", () => {
    const { container } = render(<Steps steps={ADIMLAR} current={1} />);
    const ol = container.querySelector("ol")!;
    expect(ol.className).toMatch(/flex-wrap/);
    expect(ol.querySelector("li.flex-1")).toBeNull();
  });
  it("açık: tam genişlik, sarmıyor; son adım hariç her adım ve çizgi esniyor", () => {
    const { container } = render(<Steps steps={ADIMLAR} current={1} stretch />);
    const ol = container.querySelector("ol")!;
    expect(ol.className).toMatch(/w-full/);
    expect(ol.className).toMatch(/flex-nowrap/);
    const adimlar = [...ol.querySelectorAll(":scope > li")];
    expect(adimlar.slice(0, -1).every((li) => li.className.includes("flex-1"))).toBe(true);
    expect(adimlar.at(-1)!.className).not.toMatch(/flex-1/);
    expect([...ol.querySelectorAll(".tamga-step-line")].every((l) => l.className.includes("flex-1"))).toBe(true);
  });
});
