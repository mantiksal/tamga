import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

/* KESME KUTUSU İÇERİKTEN BÜYÜK. Grup gövdesinin iç kutusu `overflow: hidden`
   taşıyor (0fr↔1fr animasyonu için şart) ve seçili girişin 1px kalkışını, 3px
   gölgesini ve odak çerçevesini kesiyordu. Dolgu kadar eksi kenar boşluğu:
   düzen oynamıyor, kesme sınırı dışarı çıkıyor; kapalı grup animasyon bitince
   `visibility: hidden` ile saklanıyor, dolgu alanından sızmasın diye.
   Tarayıcıda ölçümü: scripts/olc/ray-kirpma.mjs */
describe(".tamga-rail-group-body > div", () => {
  const yol = ["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!;
  const css = readFileSync(yol, "utf8");
  const kural = (secici: string) => css.match(new RegExp(secici.replace(/[.*+?^${}()|[\]\\>]/g, "\\$&") + "\\s*\\{([^}]*)\\}"))?.[1] ?? "";
  it("içeriğin etrafında --offset-room-ring kadar yer var ve düzen oynamıyor", () => {
    const k = kural(".tamga-rail-group-body > div");
    expect(k).toMatch(/overflow:\s*hidden/);
    expect(k).toMatch(/padding:\s*var\(--offset-room-ring\)/);
    expect(k).toMatch(/margin:\s*calc\(-1 \* var\(--offset-room-ring\)\)/);
  });
  it("rayın kendi dolgusu da aynı yeri açıyor: seçili ve odaklı giriş nav'da da kesilmiyor", () => {
    expect(kural(".tamga-rail-scroll")).toMatch(/padding:\s*var\(--offset-room-ring\)/);
  });
  it("kapalı grup animasyon bitince görünmez: gecikme animasyon süresi kadar", () => {
    const k = kural('.tamga-rail-group-body[data-open="false"] > div');
    expect(k).toMatch(/visibility:\s*hidden/);
    expect(k).toMatch(/transition:\s*visibility 0s var\(--duration-press\)/);
  });
});
