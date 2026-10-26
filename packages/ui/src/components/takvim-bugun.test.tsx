import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { Select } from "./primitives.js";

const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");

/* BUGÜN ÇERÇEVESİZ: boş bir çerçeve seçili günle yarışıyordu ("hangisi ne").
   Primer'ın tarih seçicisi (primer/react #1582, Day.tsx) bugünü kalın ve vurgu
   renkli bir rakamla, altında 2px vurgu çizgisiyle işaretliyor; seçiliyken
   çizgi dolgunun mürekkebine dönüyor. Aynısı. */
describe("Takvim · bugün işareti", () => {
  it("kit.css: bugün kenar almıyor; kalın, vurgu renkli, altında 2px çizgi; seçiliyken çizgi mürekkep renginde", () => {
    const bugun = css.match(/\.tamga-gun\[data-today\]:not\(:disabled\)\s*\{([^}]*)\}/)![1]!;
    expect(bugun).not.toMatch(/border/);
    expect(bugun).toMatch(/font-weight:\s*var\(--weight-strong\)/);
    expect(bugun).toMatch(/color:\s*var\(--color-accent-line\)/);
    const cizgi = css.match(/\.tamga-gun\[data-today\]:not\(:disabled\)::after\s*\{([^}]*)\}/)![1]!;
    expect(cizgi).toMatch(/height:\s*2px/);
    expect(cizgi).toMatch(/background:\s*var\(--color-accent\)/);
    expect(css).toMatch(/\.tamga-gun\[data-today\]\[data-selected="true"\]::after\s*\{[^}]*background:\s*var\(--color-accent-ink\)/);
  });
});

/* UZUN LİSTE KAYDIRIYOR: 24 saatlik bir liste sayfanın dibine kadar iniyordu.
   Primer'ın Overlay ölçeği: xsmall 192 · small 256 · medium 320 · large 432;
   liste "small". Açılınca seçili satır görünür yere kayıyor. */
describe("Select · uzun liste", () => {
  it("kit.css: liste en çok 256px ve dikey kaydırıyor", () => {
    expect(css).toMatch(/\.tamga-select-liste\s*\{[^}]*max-height:\s*256px/);
    expect(css).toMatch(/\.tamga-select-liste\s*\{[^}]*overflow-y:\s*auto/);
  });
  it("liste kit sınıfını taşıyor; seçili seçenek işaretli", () => {
    const saatler = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    render(<Select options={saatler} value="17" placeholder="Saat" aria-label="Saat" />);
    fireEvent.click(screen.getByRole("button", { name: "Saat" }));
    expect(screen.getByRole("listbox").className).toMatch(/tamga-select-liste/);
    expect(screen.getByRole("option", { name: "17" }).getAttribute("aria-selected")).toBe("true");
  });
});

/* ÜÇ KUSUR (Berika, 2026-10-26): seçili günün üstüne gelince hover yıkaması dolguyu
   eziyordu (beyaz rakam soluk zeminde kayboluyordu); saat listesi açılınca
   `scrollIntoView` SAYFAYI kaydırıyordu; çekmecenin içinde takvim sağdan taşıp
   yarısı görünmüyordu. */
import { DatePicker } from "./date-picker.js";
const ETIKET = { previousMonth: "Önceki ay", nextMonth: "Sonraki ay", open: "Takvimi aç", clear: "Temizle" };

describe("Takvim · seçili gün, liste kaydırma, çekmece", () => {
  it("kit.css: hover seçili günü dışarıda bırakıyor", () => {
    expect(css).toMatch(/\.tamga-gun:hover:not\(:disabled\):not\(\[data-selected="true"\]\)\s*\{/);
  });
  it("Select açılınca yalnız liste kaydırıyor, sayfa değil: scrollIntoView yok, scrollTop seçiliyi ortalıyor", () => {
    const kaydir = vi.fn();
    Element.prototype.scrollIntoView = kaydir;
    const yazilan: number[] = [];
    const eski = Object.getOwnPropertyDescriptor(Element.prototype, "scrollTop")!;
    Object.defineProperty(Element.prototype, "scrollTop", { configurable: true, get: () => 0, set: (v: number) => { yazilan.push(v); } });
    Object.defineProperty(HTMLElement.prototype, "offsetTop", { configurable: true, get() { return (this as HTMLElement).dataset.selected === "true" ? 500 : 0; } });
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", { configurable: true, get: () => 34 });
    Object.defineProperty(Element.prototype, "clientHeight", { configurable: true, get: () => 256 });
    const saatler = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    render(<Select options={saatler} value="17" placeholder="Saat" aria-label="Saat 2" />);
    fireEvent.click(screen.getByRole("button", { name: "Saat 2" }));
    expect(kaydir).not.toHaveBeenCalled();
    expect(yazilan).toEqual([500 - (256 - 34) / 2]);
    Object.defineProperty(Element.prototype, "scrollTop", eski);
  });
  it("takvim sağdan taşıyorsa sağa hizalanıyor (data-align=end), sığıyorsa start", () => {
    const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect");
    rect.mockImplementation(function (this: HTMLElement) {
      const genis = this.classList.contains("tamga-takvim-kutu") ? 300 : 0;
      return { left: 900, right: 900 + genis, top: 0, bottom: 0, width: genis, height: 0, x: 900, y: 0, toJSON() {} } as DOMRect;
    });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1000 });
    render(<DatePicker locale="tr-TR" onChange={vi.fn()} placeholder="Tarih" labels={ETIKET} />);
    fireEvent.click(screen.getByRole("textbox"));
    expect(document.querySelector(".tamga-takvim-kutu")!.getAttribute("data-align")).toBe("end");
    rect.mockRestore();
  });
});
