import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button.js";

/* MEŞGUL DÜĞMENİN ADI BOŞ KALMAZ: `busyLabel` verilmezse düğmenin kendi metni
   ad olarak kalır (görünmez ama okunur). Belge zaten böyle diyordu; kod demiyordu. */
describe("Button · busy", () => {
  it("busyLabel yoksa düğmenin kendi metni erişilebilir ad", () => {
    render(<Button busy>Kaydet</Button>);
    const b = screen.getByRole("button", { name: "Kaydet" });
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute("aria-busy", "true");
  });
  it("busyLabel varsa ad odur", () => {
    render(<Button busy busyLabel="Kaydediliyor">Kaydet</Button>);
    expect(screen.getByRole("button", { name: "Kaydediliyor" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Kaydet" })).toBeNull();
  });
});

/* MEŞGUL DÜĞMEDE SPINNER ORTADA: `position: absolute` tek başına spinner'ı statik
   yerinde (solda) bırakıyordu. Dört yandan sıfırlanıp ortalanıyor; görünmez etiket
   genişliği korumaya devam ediyor. Tarayıcı ölçümü: scripts/olc/dugme-mesgul.mjs */
describe("Button · busy (kit.css)", () => {
  it("spinner düğmenin tam ortasında konumlanıyor", () => {
    const { existsSync, readFileSync } = require("node:fs") as typeof import("node:fs");
    const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
    const k = css.match(/\.tamga-btn\[data-busy\] > \[role="status"\]\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(k).toMatch(/position:\s*absolute/);
    expect(k).toMatch(/inset:\s*0/);
    expect(k).toMatch(/margin:\s*auto/);
  });
});
