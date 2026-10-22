import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Tag, ColorMark } from "./display.js";

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

  it("GÜVENLİK: yalnız hex; `;` ya da url(...) taşıyan değer işareti hiç çizdirmiyor", () => {
    render(
      <>
        <Tag swatch="red;background-image:url(https://x.test/t.png);width:400px" data-testid="k1">a</Tag>
        <Tag swatch="url(https://x.test/t.png)" data-testid="k2">b</Tag>
        <Tag swatch="" data-testid="k3">c</Tag>
        <Tag swatch="#abc" data-testid="k4">d</Tag>
        <Tag swatch="#A1B2C3D4" data-testid="k5">e</Tag>
      </>,
    );
    for (const id of ["k1", "k2", "k3"]) expect(document.querySelector(`[data-testid="${id}"]`)!.childElementCount, id).toBe(0);
    for (const id of ["k4", "k5"]) expect(document.querySelector(`[data-testid="${id}"]`)!.childElementCount, id).toBe(1);
    expect(document.body.innerHTML).not.toContain("x.test");
  });

  it("işaret kitin işaret ailesinden (tamga-mark) ve ayrı dışa aktarılıyor (ColorMark)", () => {
    render(
      <>
        <Tag swatch="#1f7a46" data-testid="t">a</Tag>
        <ColorMark color="#1f7a46" data-testid="m" />
      </>,
    );
    const ic = document.querySelector('[data-testid="t"]')!.firstElementChild!;
    expect(ic.classList.contains("tamga-mark")).toBe(true);
    expect(document.querySelector('[data-testid="m"]')!.classList.contains("tamga-mark")).toBe(true);
  });
});
