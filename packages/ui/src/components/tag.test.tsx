import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Tag } from "./display.js";

/**
 * KULLANICI RENGİ YASA 3'E YAZILI İSTİSNA. Etiketin rengi kitin söylediği bir
 * şey değil, kullanıcının kendi verisi · bir kimlik işareti. Kit onu yalnız
 * taşır: küçük bir işaret, zemin ya da metin rengi değil, ve işaret `aria-hidden`
 * · adı etiket taşıyor, renk bilgi taşımıyor (1.4.1). Verilmezse çıktı birebir
 * eski.
 */
describe("Tag · swatch", () => {
  it("swatch yoksa çıktı eskisi gibi: tek metin, işaret yok", () => {
    render(<Tag look="outline" data-testid="t">PRO</Tag>);
    const kok = document.querySelector('[data-testid="t"]')!;
    expect(kok.className).toBe("tamga-tag tamga-tag-outline");
    expect(kok.childElementCount).toBe(0);
    expect(kok.textContent).toBe("PRO");
  });

  it("swatch verilince önde aria-hidden bir işaret, rengi kullanıcının", () => {
    render(<Tag swatch="#e11d48" data-testid="t">Acil</Tag>);
    const kok = document.querySelector('[data-testid="t"]')!;
    const isaret = kok.firstElementChild as HTMLElement | null;
    expect(isaret).not.toBeNull();
    expect(isaret!.getAttribute("aria-hidden")).toBe("true");
    expect(isaret!.style.backgroundColor).toBe("rgb(225, 29, 72)");
    /* Metin yine etiketin kendisi; işaret okunmuyor. */
    expect(kok.textContent).toBe("Acil");
  });
});
