import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { Alert } from "./primitives.js";
import { Button } from "./button.js";

/* TEK SATIRLI UYARI: başlık tek başına gelince karo, eylem ve kapatma düğmesi
   başlıkla ortalanır (`data-rows="single"`). Gövdeliyse (`multi`) hepsi başlığın
   İLK satırına hizalanır; bugün karo 4 px, kapatma 5 px aşağıdaydı. */
describe("Alert · satır sayısı ve hiza", () => {
  const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
  it("gövdesiz uyarı single, gövdeli multi; eylem ve kapatma kit sınıfı taşıyor", () => {
    const a = render(<Alert state="info" title="Hazır" action={<Button size="sm">Aç</Button>} dismissLabel="Kapat" onDismiss={vi.fn()} />);
    const kutu = a.container.querySelector(".tamga-alert")!;
    expect(kutu.getAttribute("data-rows")).toBe("single");
    expect(kutu.querySelector(".tamga-alert-eylem")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Kapat" }).className).toMatch(/tamga-alert-kapat/);
    a.unmount();
    const b = render(<Alert state="info" title="Hazır">Gövde</Alert>);
    expect(b.container.querySelector(".tamga-alert")!.getAttribute("data-rows")).toBe("multi");
  });
  it("CSS: single ortalı; multi'de karo, eylem ve kapatma ilk satıra", () => {
    expect(css).toMatch(/\.tamga-alert\[data-rows="single"\]\s*\{\s*align-items:\s*center/);
    expect(css).toMatch(/\.tamga-alert\[data-rows="multi"\] > \.tamga-alert-tile\s*\{\s*margin-top:\s*calc\(\(1lh - 28px\) \/ 2\)/);
    expect(css).toMatch(/\.tamga-alert\[data-rows="multi"\] > \.tamga-alert-eylem\s*\{\s*margin-top:\s*calc\(\(1lh - 32px\) \/ 2\)/);
    expect(css).toMatch(/\.tamga-alert\[data-rows="multi"\] > \.tamga-alert-kapat\s*\{\s*margin-top:\s*calc\(\(1lh - 30px\) \/ 2\)/);
  });
});
