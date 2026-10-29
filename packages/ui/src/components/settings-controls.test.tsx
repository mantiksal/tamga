import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { Switch } from "./switch.js";
import { Segmented } from "./segmented.js";
import { NumberInput } from "./number-input.js";
import { ColorField } from "./appearance.js";
import { Field, Select } from "./primitives.js";
import { DropdownMenu } from "./overlay.js";
import { SettingsPanel } from "../patterns/settings-template.js";

const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");

/* AYAR EKRANININ KONTROLLERİ: her ürün bu satırları elle kuruyordu. */
describe("Switch · showLabel", () => {
  it("soru bir <label>, anahtarı adlandırır ve çevirir; açıklama aria-describedby; kanca satırda", () => {
    const onChange = vi.fn();
    render(<Switch showLabel label="Tema düğmesi" description="Ziyaretçi tema düğmesini görür" on={false} onChange={onChange} data-testid="s" />);
    const anahtar = screen.getByRole("switch", { name: "Tema düğmesi" });
    expect(anahtar.getAttribute("aria-label")).toBeNull();
    expect(document.getElementById(anahtar.getAttribute("aria-describedby")!)!.textContent).toBe("Ziyaretçi tema düğmesini görür");
    const etiket = screen.getByText("Tema düğmesi");
    expect(etiket.tagName).toBe("LABEL");
    expect(etiket.getAttribute("for")).toBe(anahtar.id);
    expect(screen.getByTestId("s").hasAttribute("data-switch-row")).toBe(true);
    fireEvent.click(etiket);
    expect(onChange).toHaveBeenCalledWith(true);
  });
  it("showLabel yokken eskisi gibi: aria-label, kanca düğmede", () => {
    render(<Switch label="Bakım modu" on onChange={vi.fn()} data-testid="s" />);
    const anahtar = screen.getByRole("switch", { name: "Bakım modu" });
    expect(anahtar.getAttribute("aria-label")).toBe("Bakım modu");
    expect(screen.getByTestId("s")).toBe(anahtar);
  });
});

describe("Segmented · disabled", () => {
  it("seçili okunur, hiçbiri seçilemez, oklar taşımaz; kuyu kesik kenarlı", () => {
    const onChange = vi.fn();
    render(<Segmented label="Görünüm" value="list" onChange={onChange} disabled options={[{ value: "list", label: "Liste" }, { value: "grid", label: "Izgara" }]} />);
    const grup = screen.getByRole("radiogroup", { name: "Görünüm" });
    expect(grup.getAttribute("aria-disabled")).toBe("true");
    expect(screen.getByRole("radio", { name: "Liste" }).getAttribute("aria-checked")).toBe("true");
    for (const r of screen.getAllByRole("radio")) expect((r as HTMLButtonElement).disabled).toBe(true);
    fireEvent.keyDown(grup, { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
    expect(css).toMatch(/\.tamga-segment\[data-disabled\]\s*\{[^}]*border-style:\s*dashed/);
  });
});

describe("NumberInput · Field'a bağlanıyor", () => {
  it("id etiketi alana bağlar; aria-describedby ve aria-invalid metin alanına iner; placeholder", () => {
    render(
      <Field label="Deneme" htmlFor="deneme" error="En az 1" errorPrefix="Hata:">
        <NumberInput id="deneme" value={undefined} onChange={vi.fn()} placeholder="6" labels={{ increment: "Artır", decrement: "Azalt" }} />
      </Field>,
    );
    const alan = screen.getByRole("textbox", { name: "Deneme" });
    expect(alan.getAttribute("placeholder")).toBe("6");
    expect(alan.getAttribute("aria-invalid")).toBe("true");
    expect(document.getElementById(alan.getAttribute("aria-describedby")!)!.textContent).toContain("En az 1");
    expect(alan.className).toMatch(/tamga-input-invalid/);
  });
});

describe("ColorField", () => {
  it("boşken varsayılanda: kare kesik ve varsayılan renk, geri alma yok; yazılınca basılmış kare ve geri alma boş gönderir", () => {
    const onChange = vi.fn();
    const { rerender } = render(<ColorField value="" defaultValue="#f7f8fa" onChange={onChange} labels={{ pick: "Renk seç", reset: "Varsayılana dön" }} />);
    const kare = document.querySelector<HTMLElement>(".tamga-swatch-field")!;
    expect(kare.hasAttribute("data-default")).toBe(true);
    expect(kare.style.background).toBe("rgb(247, 248, 250)");
    expect(screen.getByPlaceholderText("#f7f8fa")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Varsayılana dön" })).toBeNull();
    rerender(<ColorField value="#7c3aed" defaultValue="#f7f8fa" onChange={onChange} labels={{ pick: "Renk seç", reset: "Varsayılana dön" }} />);
    expect(kare.hasAttribute("data-chosen")).toBe(true);
    expect(screen.getByLabelText("Renk seç").getAttribute("value")).toBe("#7c3aed");
    fireEvent.click(screen.getByRole("button", { name: "Varsayılana dön" }));
    expect(onChange).toHaveBeenCalledWith("");
  });
  it("Field içinde: id, aria-describedby ve aria-invalid kod alanına iniyor; kısa hex seçiciye altı hane", () => {
    render(
      <Field label="Sayfa zemini" htmlFor="zemin" error="Geçersiz renk">
        <ColorField id="zemin" value="#abc" defaultValue="#ffffff" onChange={vi.fn()} labels={{ pick: "Renk seç", reset: "Varsayılana dön" }} />
      </Field>,
    );
    const kod = screen.getByRole("textbox", { name: "Sayfa zemini" });
    expect(kod.getAttribute("aria-invalid")).toBe("true");
    expect(document.getElementById(kod.getAttribute("aria-describedby")!)!.textContent).toContain("Geçersiz renk");
    expect(screen.getByLabelText("Renk seç").getAttribute("value")).toBe("#aabbcc");
  });
});

describe("Select · seçenek açıklaması", () => {
  it("description etiketin altında ikinci satır, hint yanda", () => {
    render(<Select options={[{ value: "basic", label: "Temel", description: "Yalnız çalışıp çalışmadığı", hint: "ücretsiz" }]} placeholder="Seç" aria-label="Plan" />);
    fireEvent.click(screen.getByRole("button", { name: "Plan" }));
    const secenek = screen.getByRole("option", { name: /Temel/ });
    expect(secenek.textContent).toContain("Yalnız çalışıp çalışmadığı");
    expect(secenek.querySelector(".flex-col")!.textContent).toBe("TemelYalnız çalışıp çalışmadığı");
  });
});

describe("DropdownMenu · sabit konum", () => {
  it("panel fixed; açılınca ölçülüp yerleşiyor, görünür", () => {
    render(<DropdownMenu trigger={<button type="button">Eylemler</button>} items={[{ label: "Düzenle", onSelect: vi.fn() }]} defaultOpen />);
    const panel = screen.getByRole("menu");
    expect(panel.className).toMatch(/\bfixed\b/);
    expect(panel.className).not.toMatch(/\babsolute\b/);
    expect(panel.style.visibility).toBe("");
  });
});

describe("SettingsPanel · aside", () => {
  it("başlık satırının öteki ucunda işaret", () => {
    render(<SettingsPanel title="Renkler" aside={<span>Açık tema</span>}><p>gövde</p></SettingsPanel>);
    const isaret = document.querySelector("[data-panel-aside]")!;
    expect(isaret.textContent).toBe("Açık tema");
    expect(isaret.className).toMatch(/ml-auto/);
  });
});
