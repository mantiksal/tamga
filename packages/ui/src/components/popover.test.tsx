import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { Popover } from "./overlay.js";

/* KONTROLLÜ PANEL: açık olup olmadığını ürün tutuyor, her değişikliği onOpenChange ile duyuyor;
   satır seçilince kapatabiliyor. Kontrolsüz kullanım eskisi gibi. */
describe("Popover · kontrollü", () => {
  it("open dışarıdan; tetik, dışarı tıklama ve Esc onOpenChange'e gidiyor, durum ürünün", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Popover trigger={<button type="button">Zil</button>} open={false} onOpenChange={onOpenChange}><p>panel</p></Popover>,
    );
    expect(screen.queryByText("panel")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Zil" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.queryByText("panel")).toBeNull();
    rerender(<Popover trigger={<button type="button">Zil</button>} open onOpenChange={onOpenChange}><p>panel</p></Popover>);
    expect(screen.getByText("panel")).toBeTruthy();
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByText("panel")).toBeTruthy();
  });
  it("ürün satır seçilince kapatıyor", () => {
    function Zil() {
      const [acik, setAcik] = useState(false);
      return (
        <Popover trigger={<button type="button">Zil</button>} open={acik} onOpenChange={setAcik}>
          <button type="button" onClick={() => setAcik(false)}>Bildirim 1</button>
        </Popover>
      );
    }
    render(<Zil />);
    fireEvent.click(screen.getByRole("button", { name: "Zil" }));
    fireEvent.click(screen.getByRole("button", { name: "Bildirim 1" }));
    expect(screen.queryByRole("button", { name: "Bildirim 1" })).toBeNull();
  });
  it("kontrolsüz: kendi durumunu tutuyor", () => {
    render(<Popover trigger={<button type="button">Aç</button>}><p>panel</p></Popover>);
    fireEvent.click(screen.getByRole("button", { name: "Aç" }));
    expect(screen.getByText("panel")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Aç" }));
    expect(screen.queryByText("panel")).toBeNull();
  });
});
