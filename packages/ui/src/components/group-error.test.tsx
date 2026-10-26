import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { Field, Select } from "./primitives.js";
import { Input } from "./input.js";
import { RadioGroup } from "./radio-group.js";
import { Checkbox } from "./checkbox.js";

/**
 * GRUP KONTROLLERİ HATA METNİNİ KENDİSİ TAŞIYOR. RadioGroup ve Checkbox Field'ın
 * içine giremiyordu; altlarına kitle aynı görünen bir hata satırı yazmanın yolu
 * yoktu ve ürünler Field'ın satırını elle kopyalıyordu. Tek satır, üç yer.
 */
const SEC = [
  { value: "std", label: "Standart" },
  { value: "exp", label: "Ekspres" },
] as const;
const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");

describe("Hata satırı · tek çizim", () => {
  it("Field, RadioGroup ve Checkbox aynı sınıfı ve glifi taşıyor; görünmez önek errorPrefix", () => {
    render(
      <>
        <Field label="Ad" htmlFor="ad" error="Boş olamaz" errorPrefix="Hata:"><Input id="ad" /></Field>
        <RadioGroup options={SEC} value="std" label="Kargo" error="Birini seç" errorPrefix="Hata:" />
        <Checkbox label="Kabul" checked={false} error="Onay gerekli" errorPrefix="Hata:" />
      </>,
    );
    const satirlar = document.querySelectorAll(".tamga-field-hata");
    expect(satirlar).toHaveLength(3);
    for (const s of satirlar) {
      expect(s.querySelector("svg")).not.toBeNull();
      const onek = s.querySelector(".sr-only");
      expect(onek?.textContent?.trim()).toBe("Hata:");
    }
    expect(screen.getByRole("textbox", { name: "Ad" }).getAttribute("aria-describedby")).toBe(document.querySelector(".tamga-field-hata")!.id);
  });
  it("önek verilmezse görünmez metin yok", () => {
    render(<Checkbox label="Kabul" checked={false} error="Onay gerekli" />);
    expect(document.querySelector(".sr-only")).toBeNull();
  });
});

describe("RadioGroup · açıklama, hata, görünür başlık", () => {
  it("description grubun aria-describedby'ı; hata varken açıklama gizlenir ve aria-invalid gelir", () => {
    const { rerender } = render(<RadioGroup options={SEC} value="std" label="Kargo" description="Teslimat süresi değişir." />);
    const grup = screen.getByRole("radiogroup", { name: "Kargo" });
    expect(grup.getAttribute("aria-invalid")).toBeNull();
    expect(document.getElementById(grup.getAttribute("aria-describedby")!)!.textContent).toBe("Teslimat süresi değişir.");
    rerender(<RadioGroup options={SEC} value="std" label="Kargo" description="Teslimat süresi değişir." error="Birini seç" />);
    expect(screen.queryByText("Teslimat süresi değişir.")).toBeNull();
    const g2 = screen.getByRole("radiogroup", { name: "Kargo" });
    expect(g2.getAttribute("aria-invalid")).toBe("true");
    expect(document.getElementById(g2.getAttribute("aria-describedby")!)!.textContent).toContain("Birini seç");
  });
  it("showLabel: başlık görünür, Field etiketiyle aynı sınıf, aria-labelledby ile bağlı; aria-label yok", () => {
    render(<RadioGroup options={SEC} value="std" label="Kargo" showLabel />);
    const grup = screen.getByRole("radiogroup", { name: "Kargo" });
    expect(grup.getAttribute("aria-label")).toBeNull();
    const baslik = document.getElementById(grup.getAttribute("aria-labelledby")!)!;
    expect(baslik.textContent).toBe("Kargo");
    expect(baslik.className).toBe("text-body font-bold text-ink");
    expect(baslik.parentElement!.className).toBe("mb-0.5 flex items-baseline gap-2");
    expect(grup.className).toBe("flex flex-col gap-1.5");
    expect(grup.firstElementChild).toBe(baslik.parentElement);
  });
  it("varsayılan değişmedi: kök radiogroup, iç kap yok, data-* ve className kökte", () => {
    const { container } = render(<RadioGroup options={SEC} value="std" label="Kargo" data-testid="g" className="w-60" />);
    expect(container.firstElementChild!.getAttribute("role")).toBe("radiogroup");
    expect(screen.getByTestId("g").className).toContain("w-60");
    expect(screen.getByTestId("g").firstElementChild!.getAttribute("role")).toBe("radio");
  });
  for (const look of ["list", "card", "chip"] as const) {
    it(`${look}: kök yine radiogroup ve kancayı taşıyor; hata satırı seçeneklerin altında, kabuk sınıfı iç kapta`, () => {
      render(<RadioGroup options={SEC} value="std" label="Kargo" look={look} error="Birini seç" className="w-60" data-testid="g" />);
      const grup = screen.getByTestId("g");
      expect(grup.getAttribute("role")).toBe("radiogroup");
      expect(grup.lastElementChild!.className).toContain("tamga-field-hata");
      const kap = grup.lastElementChild!.previousElementSibling!;
      expect(kap.className).toContain("w-60");
      expect(kap.querySelectorAll("[role=radio]")).toHaveLength(2);
    });
  }
});

describe("Checkbox · açıklama ve hata", () => {
  it("description kutunun aria-describedby'ı; hata aria-invalid; metin kutunun altında, etiketle hizalı", () => {
    const { rerender } = render(<Checkbox label="Kabul" checked={false} description="Sözleşmeyi okudum." data-testid="k" />);
    const kutu = screen.getByRole("checkbox", { name: "Kabul" });
    expect(document.getElementById(kutu.getAttribute("aria-describedby")!)!.textContent).toBe("Sözleşmeyi okudum.");
    expect(kutu.getAttribute("aria-invalid")).toBeNull();
    rerender(<Checkbox label="Kabul" checked={false} description="Sözleşmeyi okudum." error="Onay gerekli" data-testid="k" />);
    const k2 = screen.getByRole("checkbox", { name: "Kabul" });
    expect(k2.getAttribute("aria-invalid")).toBe("true");
    expect(screen.queryByText("Sözleşmeyi okudum.")).toBeNull();
    const not = k2.querySelector(".tamga-check-not")!;
    expect(not.tagName).toBe("SPAN");
    expect(not.className).toContain("col-start-2");
    expect(k2.className).toMatch(/grid-cols-\[auto_1fr\]/);
    expect(screen.getByTestId("k").getAttribute("role")).toBe("checkbox");
  });
  it("not yoksa düğme eskisi gibi: flex, aria-labelledby yok", () => {
    const { container } = render(<Checkbox label="Kabul" checked={false} />);
    const k = container.firstElementChild!;
    expect(k.getAttribute("role")).toBe("checkbox");
    expect(k.getAttribute("aria-labelledby")).toBeNull();
    expect(k.className).toMatch(/\bflex\b/);
  });
});

describe("Select · Field'ın bağladığı nitelikleri yutmuyor", () => {
  it("aria-describedby ve aria-invalid tetik düğmesine iniyor", () => {
    render(
      <Field label="Kargo" htmlFor="k" error="Birini seç">
        <Select options={["A", "B"]} placeholder="Seç" />
      </Field>,
    );
    const tetik = screen.getByRole("button", { name: "Seç" });
    expect(tetik.getAttribute("aria-invalid")).toBe("true");
    expect(document.getElementById(tetik.getAttribute("aria-describedby")!)!.textContent).toContain("Birini seç");
  });
  it("hatalı tetik kutunun hatalı girdiyle aynı kenarını giyiyor", () => {
    expect(css).toMatch(/\.tamga-select\[aria-invalid="true"\][^{]*\{[^}]*border-color:\s*var\(--color-critical\)/);
  });
  it("onChange hâlâ çalışıyor", () => {
    const onChange = vi.fn();
    render(<Select options={["A", "B"]} placeholder="Seç" onChange={onChange} aria-describedby="x" />);
    fireEvent.click(screen.getByRole("button", { name: "Seç" }));
    fireEvent.click(screen.getByRole("option", { name: "B" }));
    expect(onChange).toHaveBeenCalledWith("B");
  });
});
