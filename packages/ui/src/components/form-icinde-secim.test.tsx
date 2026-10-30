import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { DropdownMenu } from "./overlay.js";
import { Select } from "./primitives.js";

/* FORMU GÖNDERMİYOR. Menü ve seçim listesi portalsız, yerinde çiziliyor; öğeleri tür
   verilmemiş `<button>` olunca bir formun içinde her seçim formu gönderiyordu. Tek kayıtlı
   bir düzenleyicide menüden "gruba taşı" demek, Kaydet'e basmadan kaydetti ve taşımayı
   kaybetti (bir tüketici ürünün düzenleyicisi, 2026-10-30). */
describe("form içinde seçim", () => {
  it("menü öğesi formu göndermez", () => {
    const submit = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    const onSelect = vi.fn();
    const { getByRole } = render(
      <form onSubmit={submit}>
        <DropdownMenu
          trigger={<button type="button">İşlemler</button>}
          items={[{ label: "Gruba taşı", onSelect }]}
        />
      </form>,
    );
    fireEvent.click(getByRole("button", { name: "İşlemler" }));
    fireEvent.click(getByRole("menuitem", { name: "Gruba taşı" }));
    expect(onSelect).toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
  });

  it("seçim listesindeki seçenek formu göndermez", () => {
    const submit = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    const onChange = vi.fn();
    const { getByRole } = render(
      <form onSubmit={submit}>
        <Select
          aria-label="Görünüm"
          options={["Geçmişli", "Yalnız durum"]}
          value="Geçmişli"
          onChange={onChange}
        />
      </form>,
    );
    fireEvent.click(getByRole("button", { name: /Görünüm|Geçmişli/ }));
    fireEvent.click(getByRole("option", { name: "Yalnız durum" }));
    expect(onChange).toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
  });
});
