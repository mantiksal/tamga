import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { uyar } from "./uyar.js";

/* ÜRETİMDE SUSAR, ve susması bundler'ın yerine koyduğu kalıba bağlı: webpack
   DefinePlugin ve Vite `define` yalnız düz `process.env.NODE_ENV` yazımını
   değiştiriyor; `globalThis.process?.env` kalıbı tarayıcıda hiç değişmiyordu
   ve uyarılar üretim konsoluna düşüyordu. */
describe("uyar", () => {
  const eski = process.env.NODE_ENV;
  afterEach(() => { process.env.NODE_ENV = eski; });
  it("geliştirmede konsola yazıyor, üretimde susuyor", () => {
    const w = vi.spyOn(console, "warn").mockImplementation(() => {});
    process.env.NODE_ENV = "development";
    uyar("a");
    expect(w).toHaveBeenCalledTimes(1);
    process.env.NODE_ENV = "production";
    uyar("b");
    expect(w).toHaveBeenCalledTimes(1);
    w.mockRestore();
  });
  it("kaynak düz `process.env.NODE_ENV` yazımını taşıyor (bundler yerine koyabilsin)", () => {
    /* vitest'in `import.meta.url`i `file:` değil; dosya çalışma dizininden bulunuyor. */
    const kaynak = readFileSync(["src/lib/uyar.ts", "packages/ui/src/lib/uyar.ts"].find(existsSync)!, "utf8");
    expect(kaynak).toMatch(/process\.env\.NODE_ENV/);
    expect(kaynak).not.toMatch(/globalThis/);
  });
});
