import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SortableList } from "./sortable-list.js";

/* TUTAMAK BİR DÜĞME: Boşluk tutar, oklar taşır, Boşluk bırakır, Esc vazgeçer; her adım
   duyurulur; `onReorder` bırakınca BİR kez. Sürüklemek tek yol değil. */
const ITEMS = [
  { key: "web", ad: "Web sitesi" },
  { key: "api", ad: "API" },
  { key: "dns", ad: "DNS" },
];
const LABELS = {
  handle: (n: string) => `${n} taşı`,
  instructions: "Boşluk tutar, oklar taşır",
  picked: (n: string, p: number, t: number) => `${n} tutuldu, ${t} öğeden ${p}.`,
  moved: (n: string, p: number, t: number) => `${n} ${t} öğeden ${p}. sırada`,
  dropped: (n: string, p: number, t: number) => `${n} bırakıldı, ${t} öğeden ${p}.`,
  cancelled: (n: string) => `${n} taşıma iptal`,
};
const kur = (onReorder = vi.fn(), disabled = false) => {
  render(
    <SortableList
      items={ITEMS}
      itemLabel={(i) => i.ad}
      onReorder={onReorder}
      labels={LABELS}
      disabled={disabled}
      renderItem={(item, { handle, dragging }) => (
        <span data-row={item.key} data-drag={dragging || undefined}>
          {handle}
          {item.ad}
        </span>
      )}
    />,
  );
  return onReorder;
};
const sira = () => [...document.querySelectorAll("[data-key]")].map((li) => li.getAttribute("data-key"));
const duyuru = () => document.querySelector("[aria-live]")!.textContent;

describe("SortableList · klavye", () => {
  it("Boşluk tutar ve duyurur, aşağı ok taşır, Boşluk bırakır ve onReorder bir kez yeni sırayla", () => {
    const onReorder = kur();
    const tutamak = screen.getByRole("button", { name: "Web sitesi taşı" });
    expect(tutamak.getAttribute("aria-describedby")).toBe(document.querySelector(".sr-only")!.id);
    fireEvent.keyDown(tutamak, { key: " " });
    expect(tutamak.getAttribute("aria-pressed")).toBe("true");
    expect(duyuru()).toBe("Web sitesi tutuldu, 3 öğeden 1.");
    fireEvent.keyDown(tutamak, { key: "ArrowDown" });
    expect(sira()).toEqual(["api", "web", "dns"]);
    expect(duyuru()).toBe("Web sitesi 3 öğeden 2. sırada");
    expect(document.querySelector("[data-key=web]")!.hasAttribute("data-dragging")).toBe(true);
    expect(onReorder).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByRole("button", { name: "Web sitesi taşı" }), { key: " " });
    expect(onReorder).toHaveBeenCalledTimes(1);
    expect(onReorder).toHaveBeenCalledWith(["api", "web", "dns"]);
    expect(duyuru()).toBe("Web sitesi bırakıldı, 3 öğeden 2.");
  });
  it("Esc vazgeçer: sıra geri gelir, onReorder ateşlenmez", () => {
    const onReorder = kur();
    const tutamak = screen.getByRole("button", { name: "DNS taşı" });
    fireEvent.keyDown(tutamak, { key: " " });
    fireEvent.keyDown(tutamak, { key: "ArrowUp" });
    expect(sira()).toEqual(["web", "dns", "api"]);
    fireEvent.keyDown(screen.getByRole("button", { name: "DNS taşı" }), { key: "Escape" });
    expect(sira()).toEqual(["web", "api", "dns"]);
    expect(duyuru()).toBe("DNS taşıma iptal");
    expect(onReorder).not.toHaveBeenCalled();
  });
  it("sırası değişmeden bırakılırsa onReorder ateşlenmez; disabled'da tutamak yok", () => {
    const onReorder = kur();
    const tutamak = screen.getByRole("button", { name: "API taşı" });
    fireEvent.keyDown(tutamak, { key: " " });
    fireEvent.keyDown(tutamak, { key: " " });
    expect(onReorder).not.toHaveBeenCalled();
    document.body.innerHTML = "";
    kur(vi.fn(), true);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(sira()).toEqual(["web", "api", "dns"]);
  });
});
