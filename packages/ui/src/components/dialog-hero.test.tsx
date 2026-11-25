import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { Dialog } from "./overlay.js";

/**
 * `hero` başlığın ÜSTÜNDE ve kayan gövdenin DIŞINDA durur: ürün kendi işaretini pencerenin
 * tepesine koyabilsin, başlık yine soruyu taşısın. Gövdenin içine düşerse kayınca kaybolur ve
 * başlığın altında kalır; bu test sırayı ölçüyor.
 */
describe("Dialog hero", () => {
  it("başlığın üstünde, gövdenin dışında", () => {
    render(
      <Dialog open onClose={() => {}} title="Soru" closeLabel="Kapat" hero={<div data-testid="hero">şerit</div>}>
        gövde
      </Dialog>,
    );
    const hero = document.querySelector('[data-testid="hero"]')!;
    const title = Array.from(document.querySelectorAll("h3")).find((h) => h.textContent === "Soru")!;
    expect(hero.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(hero.closest(".overflow-y-auto")).toBeNull();
  });

  it("verilmezse hiçbir şey çizmez", () => {
    render(
      <Dialog open onClose={() => {}} title="Soru" closeLabel="Kapat">
        gövde
      </Dialog>,
    );
    expect(document.querySelector(".tamga-head")?.previousElementSibling).toBeNull();
  });
});
