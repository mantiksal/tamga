import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Tabs } from "./tabs.js";
import { Segmented } from "./segmented.js";

/**
 * Şeritlerin klavyesi · `tablist` ve `radiogroup` ekran okuyucuya "buradan
 * oklarla geçilir" diye duyuruluyor, ve okların çalışması bir SÖZ.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */

const SEKMELER = [
  { value: "general", label: "Genel" },
  { value: "stock", label: "Stok", count: 12 },
  { value: "seo", label: "SEO" },
] as const;

describe("Tabs · klavye", () => {
  it("ok tuşları sekme değiştiriyor ve uçlarda dönüyor", () => {
    const onChange = vi.fn();
    render(<Tabs label="Ürün" items={SEKMELER} value="stock" onChange={onChange} />);
    const serit = screen.getByRole("tablist");

    fireEvent.keyDown(serit, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("seo");

    fireEvent.keyDown(serit, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith("general");

    /* Baştaki sekmede sola basmak sona gidiyor: şerit bir halka, çünkü
       dördüncü sekmeye gitmek için üç kez sağa basmak istemiyorsun. */
    render(<Tabs label="Ürün" items={SEKMELER} value="general" onChange={onChange} />);
    fireEvent.keyDown(screen.getAllByRole("tablist")[1]!, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith("seo");
  });

  it("Home ve End uçlara gidiyor", () => {
    const onChange = vi.fn();
    render(<Tabs label="Ürün" items={SEKMELER} value="stock" onChange={onChange} />);
    const serit = screen.getByRole("tablist");

    fireEvent.keyDown(serit, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith("seo");
    fireEvent.keyDown(serit, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith("general");
  });

  /* Kapalı sekme atlanıyor: ok tuşu gidilemeyen bir durağa götürürse şerit
     kilitlenmiş gibi duruyor. */
  it("kapalı sekme atlanıyor", () => {
    const onChange = vi.fn();
    render(
      <Tabs
        label="Ürün"
        value="general"
        onChange={onChange}
        items={[
          { value: "general", label: "Genel" },
          { value: "stock", label: "Stok", disabled: true },
          { value: "seo", label: "SEO" },
        ]}
      />,
    );
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("seo");
  });

  it("şeritte tek durak var: seçili sekme", () => {
    render(<Tabs label="Ürün" items={SEKMELER} value="stock" />);
    const duraklar = screen.getAllByRole("tab").filter((t) => t.tabIndex === 0);
    expect(duraklar).toHaveLength(1);
    expect(duraklar[0]!.getAttribute("aria-selected")).toBe("true");
  });

  it("sayaç yalnız verilen sekmede çiziliyor", () => {
    const { container } = render(<Tabs label="Ürün" items={SEKMELER} value="general" />);
    const sayaclar = container.querySelectorAll(".tamga-sayac");
    expect(sayaclar).toHaveLength(1);
    expect(sayaclar[0]!.textContent).toBe("12");
  });
});

const GORUNUMLER = [
  { value: "list", label: "Liste" },
  { value: "board", label: "Kart" },
  { value: "calendar", label: "Takvim" },
] as const;

describe("Segmented · klavye ve anlam", () => {
  /* Akranlar arasından TEK seçim: `radiogroup`. Bir düğme grubu olarak
     duyurulunca ekran okuyucu kaç seçenek olduğunu ve hangisinin seçili
     olduğunu söylemiyordu. */
  it("radyo grubu olarak duyuruluyor", () => {
    render(<Segmented label="Görünüm" options={GORUNUMLER} value="board" />);
    expect(screen.getByRole("radiogroup", { name: "Görünüm" })).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Kart" }).getAttribute("aria-checked")).toBe("true");
  });

  it("oklar seçimi taşıyor, Tab için tek durak kalıyor", () => {
    const onChange = vi.fn();
    render(<Segmented label="Görünüm" options={GORUNUMLER} value="board" onChange={onChange} />);
    const grup = screen.getByRole("radiogroup");

    fireEvent.keyDown(grup, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("calendar");
    fireEvent.keyDown(grup, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith("list");

    expect(screen.getAllByRole("radio").filter((b) => b.tabIndex === 0)).toHaveLength(1);
  });
});
