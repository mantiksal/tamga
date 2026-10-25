import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { SortHeader } from "./data-table.js";

/* SIRALANMAMIŞ GLİFİN ARKASINDA GRİ KARE: `Icon`ın varsayılanı `duotone`, ve
   Phosphor'un ⇅ glifi o ağırlıkta aşağı okun arkasına %20 dolu bir dikdörtgen
   koyuyor. Davet glifi düz çizgi; dolgu taşımaz. */
describe("SortHeader", () => {
  it("sıralanmamış glif dolgu katmanı taşımıyor", () => {
    const { container } = render(<table><thead><tr><SortHeader>Mülk</SortHeader></tr></thead></table>);
    const svg = container.querySelector("th[aria-sort=none] svg")!;
    expect(svg).not.toBeNull();
    expect(svg.innerHTML).not.toMatch(/opacity="0\.2"/);
  });
  it("kart içindeki tablonun başlık satırı kartın üst köşelerini izliyor (açık kartta da)", () => {
    const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
    expect(css).toMatch(/\.tamga-card \.tamga-table thead th:first-child\s*\{\s*border-start-start-radius:\s*calc\(var\(--radius-card\) - 1px\)/);
    expect(css).toMatch(/\.tamga-card \.tamga-table thead th:last-child\s*\{\s*border-start-end-radius:\s*calc\(var\(--radius-card\) - 1px\)/);
  });
});
