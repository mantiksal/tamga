import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { SelectPanel } from "./select-panel.js";

/**
 * SEÇİM PANELİ · tetik sıradan bir düğme, panelde başlık, isteğe bağlı arama,
 * seçenekler; "Tümü" listenin içinde ve ararken de başta. Combobox'ın metin
 * kutusu "buraya yaz" diyordu; bir seçim yapıldığı anlaşılmıyordu.
 */
const SEC = [
  { value: "atlas", label: "Atlas Lojistik" },
  { value: "aras", label: "Aras Kargo", tone: "positive" as const },
  { value: "mng", label: "MNG Kargo" },
];
const ETIKET = { noMatch: "Eşleşen yok", search: "Ara", clear: "Temizle" };
const tetik = () => screen.getByRole("button", { name: "Kargo" });
const bekle = () => act(() => new Promise((r) => setTimeout(r, 0)));

describe("SelectPanel · tek seçim", () => {
  it("tetik: haspopup listbox, expanded, yer tutucu; açılınca başlık ve seçenekler", () => {
    render(<SelectPanel options={SEC} title="Kargo seçin" placeholder="Kargo seç" aria-label="Kargo" onChange={vi.fn()} labels={ETIKET} />);
    const t = tetik();
    expect(t).toHaveAttribute("aria-haspopup", "listbox");
    expect(t).toHaveAttribute("aria-expanded", "false");
    expect(t.textContent).toContain("Kargo seç");
    fireEvent.click(t);
    expect(t).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Kargo seçin")).toBeTruthy();
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Atlas Lojistik", "Aras Kargo", "MNG Kargo"]);
  });
  it("seçince değer gider, panel kapanır, odak tetiğe döner; seçili olanın yanında onay", async () => {
    const onChange = vi.fn();
    render(<SelectPanel options={SEC} value="aras" title="Kargo seçin" placeholder="Kargo seç" aria-label="Kargo" onChange={onChange} labels={ETIKET} />);
    expect(tetik().textContent).toContain("Aras Kargo");
    fireEvent.click(tetik());
    expect(screen.getByRole("option", { name: "Aras Kargo" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Aras Kargo" }).querySelector("svg")).not.toBeNull();
    fireEvent.click(screen.getByRole("option", { name: "MNG Kargo" }));
    expect(onChange).toHaveBeenCalledWith("mng");
    await bekle();
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(tetik());
  });
  it("allLabel: ilk seçenek 'Tümü', boş değerde onay onda, seçilince değer boşalır, ararken de başta", () => {
    const onChange = vi.fn();
    render(<SelectPanel options={SEC} value="aras" allLabel="Tümü" searchable title="Kargo" placeholder="Kargo seç" aria-label="Kargo" onChange={onChange} labels={ETIKET} />);
    fireEvent.click(tetik());
    expect(screen.getAllByRole("option")[0]!.textContent).toBe("Tümü");
    fireEvent.change(screen.getByRole("searchbox", { name: "Ara" }), { target: { value: "mng" } });
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Tümü", "MNG Kargo"]);
    fireEvent.click(screen.getByRole("option", { name: "Tümü" }));
    expect(onChange).toHaveBeenCalledWith("");
  });
  it("boş değerde onay 'Tümü'de", () => {
    render(<SelectPanel options={SEC} value="" allLabel="Tümü" title="Kargo" placeholder="Tümü" aria-label="Kargo" onChange={vi.fn()} labels={ETIKET} />);
    fireEvent.click(tetik());
    expect(screen.getByRole("option", { name: "Tümü" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Aras Kargo" })).toHaveAttribute("aria-selected", "false");
  });
  it("arama: açılınca odak kutuda, yazdıkça süzülür, eşleşme yoksa noMatch; aşağı ok listeye iner", () => {
    render(<SelectPanel options={SEC} searchable title="Kargo" placeholder="Kargo seç" aria-label="Kargo" onChange={vi.fn()} labels={ETIKET} />);
    fireEvent.click(tetik());
    const kutu = screen.getByRole("searchbox", { name: "Ara" });
    expect(document.activeElement).toBe(kutu);
    fireEvent.change(kutu, { target: { value: "zzz" } });
    expect(screen.getByText("Eşleşen yok")).toBeTruthy();
    fireEvent.change(kutu, { target: { value: "kargo" } });
    expect(screen.getAllByRole("option").length).toBe(2);
    fireEvent.keyDown(kutu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getAllByRole("option")[0]);
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getAllByRole("option")[1]);
  });
  it("Esc kapatır ve odak tetiğe döner; dışarı tıklama kapatır", async () => {
    render(<SelectPanel options={SEC} title="Kargo" placeholder="Kargo seç" aria-label="Kargo" onChange={vi.fn()} labels={ETIKET} />);
    fireEvent.click(tetik());
    fireEvent.keyDown(screen.getAllByRole("option")[0]!, { key: "Escape" });
    await bekle();
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(tetik());
    fireEvent.click(tetik());
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).toBeNull();
  });
  it("tonlu seçenek işaret taşıyor; prefix ve caret", () => {
    render(<SelectPanel options={SEC} value="aras" prefix="Durum:" caret={false} title="Kargo" placeholder="Tümü" aria-label="Kargo" onChange={vi.fn()} labels={ETIKET} />);
    expect(tetik().textContent).toBe("Durum:Aras Kargo");
    expect(tetik().querySelector("svg")).toBeNull();
    fireEvent.click(tetik());
    expect(screen.getByRole("option", { name: "Aras Kargo" }).querySelector(".tamga-mark")).not.toBeNull();
  });
});

describe("SelectPanel · çoklu", () => {
  function Sahip({ onChange = vi.fn() }: { onChange?: (v: string[]) => void }) {
    const [v, setV] = useState<string[]>(["atlas", "aras", "mng"]);
    return <SelectPanel multiple options={SEC} value={v} title="Kargo" placeholder="Kargo seç" aria-label="Kargo" onChange={(n) => { setV(n); onChange(n); }} labels={ETIKET} />;
  }
  it("özet 'İlk +N'; seçim panelde kalır, toggle; Temizle hepsini boşaltır", () => {
    const onChange = vi.fn();
    render(<Sahip onChange={onChange} />);
    expect(tetik().textContent).toContain("Atlas Lojistik +2");
    fireEvent.click(tetik());
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
    fireEvent.click(screen.getByRole("option", { name: "Aras Kargo" }));
    expect(onChange).toHaveBeenLastCalledWith(["atlas", "mng"]);
    expect(screen.getByRole("listbox")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Temizle" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(tetik().textContent).toContain("Kargo seç");
  });
});
