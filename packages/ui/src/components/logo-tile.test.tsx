import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { LogoTile } from "./chrome.js";

/**
 * ZEMİN BİR PROP, TEMA SINIFI DEĞİL. Bir ürün koyuya göre çizilmiş logoyu
 * açık sayfada göstermek için karoya `.dark` sınıfını yerel olarak sarmıştı:
 * çalışıyordu ama kitin tema mekanizmasının iç ayrıntısına dayanıyordu.
 * `surface` o ihtiyacı adıyla karşılıyor; `auto` bugünkü çıktıyla birebir.
 */
describe("LogoTile · surface", () => {
  it("auto bugünkü çıktı: kökte zemin niteliği yok", () => {
    render(<LogoTile name="Tamga" data-testid="t" />);
    const kok = document.querySelector('[data-testid="t"]')!;
    expect(kok.classList.contains("tamga-logo-tile")).toBe(true);
    expect(kok.hasAttribute("data-surface")).toBe(false);
    expect(kok.textContent).toBe("T");
  });

  it("light ve dark kökte niteliğe iniyor, kanca da kökte", () => {
    render(
      <>
        <LogoTile name="Açık" surface="light" data-testid="a" />
        <LogoTile name="Koyu" surface="dark" size="sm" data-testid="k" />
      </>,
    );
    const a = document.querySelector('[data-testid="a"]')!;
    const k = document.querySelector('[data-testid="k"]')!;
    expect(a.getAttribute("data-surface")).toBe("light");
    expect(k.getAttribute("data-surface")).toBe("dark");
    expect(k.classList.contains("tamga-logo-tile-sm")).toBe(true);
  });

  it("görsel varken harf çizilmiyor, zemin yine kökte", () => {
    render(<LogoTile name="Tamga" src="/m.svg" surface="dark" data-testid="g" />);
    const g = document.querySelector('[data-testid="g"]')!;
    expect(g.querySelector("img")).not.toBeNull();
    expect(g.textContent).toBe("");
    expect(g.getAttribute("data-surface")).toBe("dark");
  });
});
