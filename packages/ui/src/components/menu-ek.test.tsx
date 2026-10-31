import { describe, expect, it, vi } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { DropdownMenu } from "./overlay.js";
import { Combobox } from "./combobox.js";
import { IconButton } from "./button.js";

const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");

/* HESAP MENÜSÜ: kimlik satırı komut değil, odak almıyor; tema yerinde seçiliyor ve menü
   kapanmıyor; oklar yalnız seçili ikona iniyor. */
describe("DropdownMenu · header ve choice", () => {
  it("header odak almıyor; choice ikonlarının adı var, seçim menüyü kapatmıyor, oklar seçili ikona iniyor", () => {
    const onChange = vi.fn();
    render(
      <DropdownMenu
        trigger={<button type="button">Hesap</button>}
        items={[
          { kind: "header", title: "Ada Korkmaz", detail: "ada@ornek.com" },
          { kind: "choice", label: "Tema", value: "light", onChange, options: [
            { value: "light", label: "Açık", icon: <span>☀</span> },
            { value: "dark", label: "Koyu", icon: <span>☾</span> },
          ] },
          { kind: "item", label: "Çıkış", onSelect: vi.fn() },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Hesap" }));
    const baslik = document.querySelector("[data-menu-header]")!;
    expect(baslik.textContent).toContain("ada@ornek.com");
    expect(baslik.querySelector("button, a, [tabindex]")).toBeNull();
    expect(screen.getByRole("radio", { name: "Koyu" })).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "Koyu" }));
    expect(onChange).toHaveBeenCalledWith("dark");
    expect(screen.getByRole("menu")).toBeTruthy();
    const duraklar = [...document.querySelectorAll("[data-tamga-option]")];
    expect(duraklar.filter((d) => d.getAttribute("role") === "radio")).toHaveLength(1);
    expect(duraklar.find((d) => d.getAttribute("role") === "radio")!.getAttribute("aria-label")).toBe("Açık");
  });
});

/* ARAMA GÖRÜNÜMÜ: ok yok, boş kutuya odaklanınca liste açılmıyor, yazınca açılıyor, seçilen
   kutuda kalmıyor; ⌘K kutuya odaklıyor; altlık panelin içinde. */
describe("Combobox · look=search", () => {
  const SEC = [{ value: "a", label: "Ankara" }, { value: "b", label: "Bursa" }];
  const L = { empty: "Yok", clear: "Temizle", open: "Aç" };
  it("ok yok; liste yazınca; seçim onChange ve kutu boş; altlık; kısayol tuşu ve ⌘K odağı", () => {
    const onChange = vi.fn();
    render(<Combobox look="search" shortcut="k" footer={<span>Her yerde ara</span>} options={SEC} onChange={onChange} placeholder="Ara" aria-label="Arama" labels={L} />);
    const kutu = screen.getByRole("combobox", { name: "Arama" });
    expect(screen.queryByRole("button", { name: "Aç" })).toBeNull();
    expect(kutu.parentElement!.textContent).toMatch(/K$/);
    fireEvent.focus(kutu);
    expect(screen.queryByRole("listbox")).toBeNull();
    fireEvent.change(kutu, { target: { value: "bu" } });
    expect(screen.getByRole("listbox")).toBeTruthy();
    expect(screen.getByText("Her yerde ara")).toBeTruthy();
    /* Eşleşen harfler <b> içinde: ad yerine metinle bulunuyor. */
    const secenek = screen.getAllByRole("option").find((o) => o.textContent === "Bursa")!;
    fireEvent.click(secenek);
    expect(onChange).toHaveBeenCalledWith("b");
    expect(kutu).toHaveValue("");
    kutu.blur();
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(document.activeElement).toBe(kutu);
  });
  it("select görünümü eskisi gibi: ok var, odaklanınca liste", () => {
    render(<Combobox options={SEC} onChange={vi.fn()} placeholder="Seç" aria-label="Şehir" labels={L} />);
    expect(screen.getByRole("button", { name: "Aç" })).toBeTruthy();
    fireEvent.focus(screen.getByRole("combobox", { name: "Şehir" }));
    expect(screen.getByRole("listbox")).toBeTruthy();
  });
});

describe("IconButton · tooltip", () => {
  it("varsayılanda ipucu yok; tooltip ile odakta adı görünür, ad yine erişilebilir ad", () => {
    const { rerender } = render(<IconButton aria-label="Ayarlar">⚙</IconButton>);
    fireEvent.focus(screen.getByRole("button", { name: "Ayarlar" }));
    expect(document.querySelector("span.fixed")).toBeNull();
    rerender(<IconButton aria-label="Ayarlar" tooltip>⚙</IconButton>);
    const dugme = screen.getByRole("button", { name: "Ayarlar" });
    fireEvent.focus(dugme);
    expect(document.querySelector("span.fixed")!.textContent).toBe("Ayarlar");
    expect(dugme.getAttribute("aria-describedby")).toBeNull();
  });
});

describe("AccountButton · şeridin ölçüsü", () => {
  it("kit.css: --control boy, düğme köşesi, flex", () => {
    const kural = css.match(/\.tamga-account-btn\s*\{([^}]*)\}/)![1]!;
    expect(kural).toMatch(/width:\s*var\(--control\)/);
    expect(kural).toMatch(/height:\s*var\(--control\)/);
    expect(kural).toMatch(/border-radius:\s*var\(--radius-btn\)/);
    expect(kural).toMatch(/display:\s*flex/);
  });
});
