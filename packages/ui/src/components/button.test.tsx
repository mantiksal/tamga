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
