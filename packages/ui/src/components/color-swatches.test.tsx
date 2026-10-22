import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ColorSwatches } from "./appearance.js";

/**
 * "RENK YOK" BİR SEÇENEK. Üründe etiket rengi isteğe bağlı; `value=""` verilince
 * "kendi rengim" kutusu seçili görünüyordu · boşluk bir seçim gibi okunuyordu.
 * `noneLabel` verilince ilk kutu "renksiz", ve boş değer onu seçili gösteriyor.
 */
const SECENEKLER = [{ hex: "#1e4fd8", label: "Mavi" }, { hex: "#1f7a46", label: "Yeşil" }];

describe("ColorSwatches · renksiz", () => {
  it("noneLabel ile boş değer renksiz kutuyu seçili gösteriyor, kendi rengimi değil", () => {
    const onChange = vi.fn();
    render(<ColorSwatches options={SECENEKLER} value="" onChange={onChange} customLabel="Kendi rengim" noneLabel="Renk yok" />);
    const yok = screen.getByRole("button", { name: "Renk yok" });
    expect(yok).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".tamga-swatch-custom")).toHaveAttribute("data-selected", "false");
    fireEvent.click(screen.getByRole("button", { name: "Yeşil" }));
    expect(onChange).toHaveBeenCalledWith("#1f7a46");
    fireEvent.click(yok);
    expect(onChange).toHaveBeenLastCalledWith("");
  });

  it("noneLabel yoksa eskisi gibi: renksiz kutu yok", () => {
    render(<ColorSwatches options={SECENEKLER} value="#1e4fd8" onChange={vi.fn()} customLabel="Kendi rengim" />);
    expect(screen.queryByRole("button", { name: "Renk yok" })).toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
