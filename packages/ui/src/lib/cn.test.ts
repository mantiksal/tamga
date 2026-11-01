import { describe, expect, it } from "vitest";
import { cn } from "./cn.js";

/* BOY VE RENK AYRI GRUPLAR: `text-body` ile `text-ink-soft` birlikte kalıyor; iki boy
   gelince sonuncusu kazanıyor; iki renk gelince de sonuncusu. */
describe("cn · kitin yazı boyları", () => {
  it("boy ve mürekkep birbirini düşürmüyor", () => {
    expect(cn("text-body", "text-ink-soft")).toBe("text-body text-ink-soft");
    expect(cn("text-small text-ink-faint", "text-ink")).toBe("text-small text-ink");
    expect(cn("text-body font-bold", false, "text-ink-faint")).toBe("text-body font-bold text-ink-faint");
  });
  it("iki boy gelince çağıranınki kazanıyor", () => {
    expect(cn("text-body", "text-display-sm")).toBe("text-display-sm");
    expect(cn("text-title", "text-sm")).toBe("text-sm");
  });
  it("kullanıcının utility'si bileşeninkini eziyor", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });
});
