import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Combobox } from "./combobox.js";
import { Select } from "./primitives.js";
import { Dialog } from "./overlay.js";

/* SUNUCUDA ARAYAN KUTU "sonuç yok"u erken söylemez: yüklenirken loading, kısa sorguda short,
   boşta empty (ya da ileri bir yol); gruplar başlıklı, durumlu seçenek kareli; oklar döngüsel;
   Esc önce kapatır sonra siler; sonuç sayısı ekran okuyucuya. */
const SEC = [
  { value: "a", label: "Ankara", group: "Türkiye" },
  { value: "b", label: "Berlin", group: "Almanya", tone: "positive" as const },
  { value: "c", label: "Bremen", group: "Almanya" },
];
const L = { empty: "Sonuç yok", clear: "Temizle", open: "Aç", loading: "Aranıyor", short: "En az 2 harf", count: (n: number) => `${n} sonuç` };
const kutu = () => screen.getByRole("combobox", { name: "Şehir" });

describe("Combobox · durumlar", () => {
  it("minQuery altında short; loading'de spinner satırı; boşta empty yerine verilen yol", () => {
    const { rerender } = render(<Combobox options={SEC} onChange={vi.fn()} placeholder="Ara" aria-label="Şehir" labels={L} minQuery={2} />);
    fireEvent.change(kutu(), { target: { value: "b" } });
    expect(screen.getByText("En az 2 harf")).toBeTruthy();
    rerender(<Combobox options={[]} onSearch={vi.fn()} loading onChange={vi.fn()} placeholder="Ara" aria-label="Şehir" labels={L} />);
    expect(screen.getByText("Aranıyor")).toBeTruthy();
    expect(screen.queryByText("Sonuç yok")).toBeNull();
    rerender(<Combobox options={[]} onChange={vi.fn()} placeholder="Ara" aria-label="Şehir" labels={L} empty={<button type="button">Her yerde ara</button>} />);
    expect(screen.getByRole("button", { name: "Her yerde ara" })).toBeTruthy();
  });
  it("grup başlıkları yalnız grup değişince; tonlu seçenekte kare; header listenin üstünde; sayı duyurulur", () => {
    render(<Combobox options={SEC} onChange={vi.fn()} placeholder="Ara" aria-label="Şehir" labels={L} header={<span>Avrupa içinde</span>} />);
    fireEvent.focus(kutu());
    const liste = screen.getByRole("listbox");
    const basliklar = [...liste.querySelectorAll('[role="presentation"]')].map((b) => b.textContent);
    expect(basliklar).toEqual(["Türkiye", "Almanya"]);
    expect(liste.firstElementChild!.textContent).toBe("Avrupa içinde");
    const berlin = screen.getAllByRole("option").find((o) => o.textContent === "Berlin")!;
    expect(berlin.querySelector(".tamga-mark")).not.toBeNull();
    expect(document.querySelector("[aria-live]")!.textContent).toBe("3 sonuç");
  });
  it("oklar döngüsel, yalnız etkin satır data-active; Esc önce kapatır, sonra yazılanı siler", () => {
    const onSearch = vi.fn();
    render(<Combobox options={SEC} onSearch={onSearch} onChange={vi.fn()} placeholder="Ara" aria-label="Şehir" labels={L} />);
    fireEvent.change(kutu(), { target: { value: "br" } });
    fireEvent.keyDown(kutu(), { key: "ArrowUp" });
    const aktif = () => screen.getAllByRole("option").filter((o) => o.hasAttribute("data-active"));
    expect(aktif()).toHaveLength(1);
    expect(aktif()[0]!.textContent).toBe("Bremen");
    fireEvent.keyDown(kutu(), { key: "ArrowDown" });
    expect(aktif()[0]!.textContent).toBe("Ankara");
    fireEvent.keyDown(kutu(), { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(kutu()).toHaveValue("br");
    fireEvent.keyDown(kutu(), { key: "Escape" });
    expect(kutu()).toHaveValue("");
    expect(onSearch).toHaveBeenLastCalledWith("");
  });
});

/* SELECT LİSTESİ `fixed`: bir diyaloğun kaydırılan gövdesi onu kırpıyordu. */
describe("Select · sabit liste", () => {
  it("liste fixed, tetiğin genişliğinde; kaydırma kapatmıyor", () => {
    const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect");
    rect.mockImplementation(function (this: HTMLElement) {
      const liste = this.getAttribute("role") === "listbox";
      return { top: liste ? 0 : 200, bottom: liste ? 100 : 240, left: 50, right: 290, width: 240, height: liste ? 100 : 40, x: 50, y: 0, toJSON() {} } as DOMRect;
    });
    render(<div data-kap><Select options={["A", "B"]} placeholder="Seç" aria-label="Harf" /></div>);
    fireEvent.click(screen.getByRole("button", { name: "Harf" }));
    const liste = screen.getByRole("listbox");
    expect(liste.className).toMatch(/\bfixed\b/);
    expect(liste.style.width).toBe("240px");
    expect(liste.style.left).toBe("50px");
    expect(liste.style.visibility).toBe("");
    fireEvent.scroll(document.querySelector("[data-kap]")!);
    expect(screen.queryByRole("listbox")).not.toBeNull();
    rect.mockRestore();
  });
});

/* ESC EN ÜSTTEKİ KATMANIN: diyaloğun içinde açık bir liste Esc'i tüketiyor,
   diyalog kapanmıyor (yazılan form gidiyordu). */
describe("Diyalog içinde Esc", () => {
  it("Select: ilk Esc listeyi kapatır, diyalog açık kalır; ikincisi diyaloğu kapatır", () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Form" closeLabel="Kapat">
        <Select options={["A", "B"]} placeholder="Seç" aria-label="Harf" />
      </Dialog>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Harf" }));
    fireEvent.keyDown(screen.getAllByRole("option")[0]!, { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByRole("button", { name: "Harf" }), { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
  it("Combobox: açıkken ve yazılıyken Esc tüketilir; kapalı ve boşken diyaloğa gider", () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Form" closeLabel="Kapat">
        <Combobox options={SEC} onChange={vi.fn()} placeholder="Ara" aria-label="Şehir" labels={L} />
      </Dialog>,
    );
    fireEvent.change(kutu(), { target: { value: "br" } });
    fireEvent.keyDown(kutu(), { key: "Escape" });
    fireEvent.keyDown(kutu(), { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.keyDown(kutu(), { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
