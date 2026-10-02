import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MultiSelect } from "./advanced-input.js";

/**
 * SAFARI'DE SEÇİM YAPILMIYORDU, ve sebebi odaktı.
 *
 * Liste odak kutudan çıkınca kapanıyor (klavyeyle çıkanı da görsün diye). Safari
 * tıklanan düğmeye odak VERMİYOR: girdi odağı kaybediyor, liste kapanıyor ve
 * seçenek, tıklama tamamlanmadan DOM'dan siliniyor.
 */

const SECENEKLER = [
  { value: "tr", label: "Türkiye" },
  { value: "de", label: "Almanya" },
];

const ETIKETLER = { empty: "Eşleşen yok", remove: (l: string) => `${l} kaldır`, open: "Ülke seç" };

function kur(value: string[] = []) {
  const onChange = vi.fn();
  render(
    <MultiSelect options={SECENEKLER} value={value} onChange={onChange} placeholder="Ülke" labels={ETIKETLER} />,
  );
  return onChange;
}

describe("MultiSelect · odak girdide kalıyor", () => {
  it("seçeneğe basmak odağı kaçırmıyor · yoksa Safari tıklamayı yutuyor", () => {
    kur();
    fireEvent.focus(screen.getByRole("combobox"));
    const secenek = screen.getByRole("option", { name: /Türkiye/ });
    /* `preventDefault` tarayıcının odağı taşımasını engelliyor; engellenmezse
       girdi `blur` alıyor ve liste tıklamadan önce kapanıyor. */
    expect(fireEvent.mouseDown(secenek)).toBe(false);
  });

  it("seçenek tıklanınca değer geliyor", () => {
    const onChange = kur();
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: /Almanya/ }));
    expect(onChange).toHaveBeenCalledWith(["de"]);
  });

  it("çipin çarpısı da odağı kaçırmıyor", () => {
    kur(["tr"]);
    expect(fireEvent.mouseDown(screen.getByRole("button", { name: "Türkiye kaldır" }))).toBe(false);
  });

  it("odak kutunun dışına çıkınca liste kapanıyor · klavyeyle çıkan da görülüyor", () => {
    kur();
    const girdi = screen.getByRole("combobox");
    fireEvent.focus(girdi);
    expect(screen.queryByRole("option", { name: /Türkiye/ })).toBeTruthy();
    fireEvent.blur(girdi, { relatedTarget: document.body });
    expect(screen.queryByRole("option", { name: /Türkiye/ })).toBeNull();
  });
});
