import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

/**
 * SEGMENT DAR EKRANDA SARAR. `inline-flex` tek satırda tutuyordu; 390 px'te
 * beş filtre sağdan taşıyordu ve panel `.tamga-segment { flex-wrap: wrap }`
 * ile dışarıdan yamalamıştı. Sarınca kuyu büyüyebilmeli ama tek satırda
 * kontrol yüksekliğinin altına inmemeli: `min-height: var(--control)`.
 * Yüksekliğin kendisini `check-olcu-hizasi` sınıyor; burada sarma kararı.
 */
describe(".tamga-segment", () => {
  /* vitest'in `import.meta.url`i `file:` değil; dosya çalışma dizininden bulunuyor. */
  const yol = ["src/kit.css", "packages/ui/src/kit.css"].find((y) => existsSync(y))!;
  const css = readFileSync(yol, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const i = css.indexOf("\n  .tamga-segment {");
  const govde = css.slice(i, css.indexOf("\n  }", i));
  it("sarıyor ve kontrol yüksekliğinin altına inmiyor", () => {
    expect(govde).toMatch(/flex-wrap:\s*wrap/);
    expect(govde).toMatch(/min-height:\s*var\(--control\)/);
  });
});
