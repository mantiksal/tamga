import { describe, expect, it } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Dialog } from "./overlay.js";
import { Sheet } from "./primitives.js";

/* TAB EN ÜSTTEKİ KATMANIN: çekmeceden açılan pencerede Tab odağı pencerede tutar. Katmanlar
   gövdeye portallanınca çekmecenin tuzağı pencereyi "dışarıda" sayıp odağı Kapat'a çekiyordu. */
describe("iç içe katmanda odak", () => {
  it("Sheet içinde Dialog: Tab Dialog'un içinde sarıyor, çekmeceye kaçmıyor; Dialog kapanınca Sheet yine yönetiyor", async () => {
    function Ekran() {
      return (
        <Sheet open onClose={() => {}} title="Çekmece" closeLabel="Çekmeceyi kapat">
          <button type="button">Çekmece düğmesi</button>
          <Dialog open onClose={() => {}} title="Pencere" closeLabel="Pencereyi kapat">
            <button type="button">İlk</button>
            <button type="button">Son</button>
          </Dialog>
        </Sheet>
      );
    }
    render(<Ekran />);
    await act(async () => {});
    const son = screen.getByRole("button", { name: "Son" });
    son.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    const pencere = screen.getAllByRole("dialog").find((d) => d.textContent?.includes("Pencere"))!;
    expect(pencere.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).not.toBe(screen.getByRole("button", { name: "Çekmeceyi kapat" }));
  });
});
