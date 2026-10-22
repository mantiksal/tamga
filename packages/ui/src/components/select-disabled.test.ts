import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

/* KAPALI SELECT KAPALI GÖRÜNÜR: `disabled` prop'u (0.7.0) gelince kutunun
   görünümü yoktu; hover kenarı koyulaşıyor, imleç el oluyordu. Kitin diğer
   kapalı kontrolleriyle aynı dil: çukur zemin, kesik kenar, soluk mürekkep. */
describe(".tamga-select:disabled", () => {
  const yol = ["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!;
  const css = readFileSync(yol, "utf8");
  const kural = css.match(/\.tamga-select:disabled\s*\{([^}]*)\}/)?.[1] ?? "";
  it("kuralı var ve diğer kapalı kontrollerle aynı dili konuşuyor", () => {
    expect(kural).toMatch(/cursor:\s*default/);
    expect(kural).toMatch(/border-style:\s*dashed/);
    expect(kural).toMatch(/color:\s*var\(--color-ink-faint\)/);
  });
  it("hover kapalı kutunun kenarını koyulaştırmıyor", () => {
    expect(css).toMatch(/\.tamga-select:hover:not\(:disabled\)/);
  });
});
