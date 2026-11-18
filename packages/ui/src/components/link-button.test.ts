import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Düğme görünümlü bağlantı düğmenin rengini taşır. `.tamga-link` dosyada düğmelerden sonra
 * geliyor ve aynı ağırlıkta; düğme sınıflarını dışarıda bırakmazsa dolu düğmede vurgu zemine
 * vurgu yazı çıkıyor (açık bir tema renginde koyu temada kontrast 1,35). Tarayıcısız bir test
 * kaskadı hesaplayamıyor, o yüzden kuralın kendisine bakıyor.
 */
const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find((y) => existsSync(y))!, "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);

describe("Link · düğme görünümünde", () => {
  it("bağlantının rengi ve alt çizgisi düğme sınıfı taşıyan elemana uygulanmaz", () => {
    const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .map((m) => ({ selector: m[1]!.trim(), body: m[2]! }))
      .filter((r) => /^\.tamga-link(?![-\w])/.test(r.selector));
    const painting = rules.filter((r) => /\bcolor:|text-decoration:\s*underline/.test(r.body));
    expect(painting.length).toBeGreaterThan(0);
    for (const rule of painting) {
      for (const cls of [".tamga-btn", ".tamga-icon-btn", ".tamga-mini-btn"])
        expect(rule.selector, rule.selector).toMatch(new RegExp(`:where\\(:not\\([^)]*\\${cls}\\b`));
    }
  });
});
