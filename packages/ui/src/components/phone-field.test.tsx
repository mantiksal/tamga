import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { Combobox } from "./combobox.js";
import { PhoneField, countryForTimeZone } from "./phone-field.js";

/* Seçili ülke kutunun yer tutucusunda yazılı (Combobox böyle gösteriyor), değerinde değil. */
/* TELEFON ALANI: ülke listeden, numara kutudan; değer E.164 ya da boş. Kayıtlı bir numara kendi
   ülkesini kendisi söylüyor; +1 gibi paylaşılan kodda alanın kendi ülkesi önce geliyor. */
const ETIKET = { country: "Ülke", number: "Numara", empty: "Ülke yok", clear: "Temizle", open: "Listeyi aç" };

describe("PhoneField", () => {
  it("saat diliminden ülke: İstanbul TR, UTC yok", () => {
    expect(countryForTimeZone("Europe/Istanbul")).toBe("TR");
    expect(countryForTimeZone("America/Toronto")).toBe("CA");
    expect(countryForTimeZone("UTC")).toBeUndefined();
    expect(countryForTimeZone(undefined)).toBeUndefined();
  });
  it("yazılan ulusal numara E.164 olur, baştaki 0 düşer; boşalınca değer boş", () => {
    const onChange = vi.fn();
    /* Kontrollü: değer geri besleniyor, gerçek formdaki gibi. */
    function Sahip() {
      const [v, setV] = useState("");
      return <PhoneField value={v} onChange={(n) => { setV(n); onChange(n); }} defaultCountry="DE" locale="en-US" labels={ETIKET} />;
    }
    render(<Sahip />);
    expect(screen.getByRole("combobox", { name: "Ülke" }).getAttribute("placeholder")).toBe("Germany +49");
    const numara = screen.getByRole("textbox", { name: "Numara" });
    fireEvent.change(numara, { target: { value: "0151 2345678" } });
    expect(onChange).toHaveBeenLastCalledWith("+491512345678");
    fireEvent.change(numara, { target: { value: "" } });
    expect(onChange).toHaveBeenLastCalledWith("");
  });
  it("kayıtlı değer kendi ülkesini çözüyor; + olmadan da; +1'de alanın ülkesi önce, en uzun kod kazanır", () => {
    const { rerender } = render(<PhoneField value="905550000000" onChange={vi.fn()} defaultCountry="DE" locale="en-US" labels={ETIKET} />);
    expect(screen.getByRole("combobox", { name: "Ülke" }).getAttribute("placeholder")).toBe("Türkiye +90");
    expect(screen.getByRole("textbox", { name: "Numara" })).toHaveValue("5550000000");
    rerender(<PhoneField value="+12125551234" onChange={vi.fn()} defaultCountry="CA" locale="en-US" labels={ETIKET} />);
    expect(screen.getByRole("combobox", { name: "Ülke" }).getAttribute("placeholder")).toBe("Canada +1");
    rerender(<PhoneField value="+12685551234" onChange={vi.fn()} defaultCountry="CA" locale="en-US" labels={ETIKET} />);
    expect(screen.getByRole("combobox", { name: "Ülke" }).getAttribute("placeholder")).toBe("Antigua & Barbuda +1268");
  });
  it("ülke listesi boşaltılamıyor (× yok); id ve aria-describedby numara kutusuna", () => {
    render(<PhoneField id="tel" value="+905550000000" onChange={vi.fn()} aria-describedby="not" locale="en-US" labels={ETIKET} />);
    expect(screen.queryByRole("button", { name: "Temizle" })).toBeNull();
    const numara = screen.getByRole("textbox", { name: "Numara" });
    expect(numara.id).toBe("tel");
    expect(numara.getAttribute("aria-describedby")).toBe("not");
  });
});

describe("Combobox · clearable ve sabit liste", () => {
  const SEC = [{ value: "a", label: "Alfa" }, { value: "b", label: "Beta" }];
  const L = { empty: "Yok", clear: "Temizle", open: "Aç" };
  it("clearable varsayılan açık: × var; false: yok", () => {
    const { rerender } = render(<Combobox options={SEC} value="a" onChange={vi.fn()} placeholder="Seç" aria-label="Harf" labels={L} />);
    expect(screen.getByRole("button", { name: "Temizle" })).toBeTruthy();
    rerender(<Combobox options={SEC} value="a" onChange={vi.fn()} placeholder="Seç" aria-label="Harf" labels={L} clearable={false} />);
    expect(screen.queryByRole("button", { name: "Temizle" })).toBeNull();
  });
  it("liste açılınca fixed ve kutunun genişliğinde; altında yer yoksa üstüne açılıyor", () => {
    const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect");
    rect.mockImplementation(function (this: HTMLElement) {
      const liste = this.getAttribute("role") === "listbox";
      const h = liste ? 300 : 40;
      const top = liste ? 0 : 500;
      return { top, bottom: top + h, left: 100, right: 420, width: 320, height: h, x: 100, y: top, toJSON() {} } as DOMRect;
    });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 600 });
    render(<Combobox options={SEC} onChange={vi.fn()} placeholder="Seç" aria-label="Harf" labels={L} />);
    fireEvent.click(screen.getByRole("button", { name: "Aç" }));
    const liste = screen.getByRole("listbox");
    expect(liste.style.position).toBe("fixed");
    expect(liste.style.width).toBe("320px");
    expect(liste.style.left).toBe("100px");
    expect(liste.style.top).toBe("192px");
    rect.mockRestore();
  });
});
