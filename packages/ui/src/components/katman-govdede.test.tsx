import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dialog } from "./overlay.js";
import { Sheet } from "./primitives.js";

/* TAM EKRAN KATMAN GÖVDEDE: `transform` taşıyan bir atanın içinde yazılan diyalog o ataya göre
   konumlanıyor, üzerine gelince kalkan kartta açılıp kapanıyormuş gibi titriyordu. Portal
   bağlandıktan sonra geliyor: sunucuyla ilk istemci çizimi aynı (boş), hidrasyon uyuşuyor. */
describe("tam ekran katman document.body'de çizilir", () => {
  it("Dialog, kalkan bir kartın içinde yazılsa da kartın dışında", () => {
    const { container } = render(
      <div style={{ transform: "translateY(-2px)" }}>
        <Dialog open onClose={() => {}} title="Plan değişikliği" closeLabel="Kapat">
          gövde
        </Dialog>
      </div>,
    );
    const dialog = screen.getByRole("dialog");
    expect(container.contains(dialog)).toBe(false);
    expect(dialog.parentElement).toBe(document.body);
  });

  it("Sheet de", () => {
    const { container } = render(
      <div style={{ transform: "translateY(-2px)" }}>
        <Sheet open onClose={() => {}} title="Ayrıntı" closeLabel="Kapat">
          gövde
        </Sheet>
      </div>,
    );
    const sheet = screen.getByRole("dialog");
    expect(container.contains(sheet)).toBe(false);
    expect(document.body.contains(sheet)).toBe(true);
  });
});
