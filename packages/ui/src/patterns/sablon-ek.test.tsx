import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthTemplate } from "./auth-template.js";
import { OverviewTemplate } from "./overview-template.js";
import { SectionHead } from "../components/section.js";

const LABELS = { loading: "Yükleniyor", title: "Hata", body: "Tekrar", retry: "Dene" };

/* Berika, 2026-11-01: bölünmüş giriş ekranında başlık sayfa başlığı gibi; kartta sessiz. Kartın
   arkasından bakan figür yalnız tek sütunda. Özet şablonunun gövdesi şeridin altına yapışık.
   Kart başlığı bold. */
describe("AuthTemplate · peek ve bölünmüş başlık", () => {
  it("tek sütunda peek kartın arkasında ve aria-hidden; başlık sessiz", () => {
    render(<AuthTemplate title="Giriş" subtitle="Hoş geldin" peek={<img alt="" data-figur />}><input aria-label="E-posta" /></AuthTemplate>);
    const figur = document.querySelector("[data-figur]")!.parentElement!;
    expect(figur.getAttribute("aria-hidden")).toBe("true");
    expect(figur.className).toMatch(/z-0/);
    expect(figur.nextElementSibling!.className).toMatch(/z-10/);
    expect(screen.getByRole("heading", { level: 1 }).className).toMatch(/text-title/);
  });
  it("bölünmüş ekranda peek çizilmiyor, başlık gösterim yüzünde", () => {
    render(<AuthTemplate title="Giriş" subtitle="Hoş geldin" aside={<p>yan</p>} peek={<img alt="" data-figur />}><input aria-label="E-posta" /></AuthTemplate>);
    expect(document.querySelector("[data-figur]")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 }).className).toMatch(/text-display-sm/);
    expect(screen.getByText("Hoş geldin").className).toMatch(/text-body/);
  });
});

describe("OverviewTemplate · başlık düğüm, gövde şeride yakın", () => {
  it("title bir düğüm olabilir; gövdenin üst dolgusu 8px (pt-2)", () => {
    render(<OverviewTemplate title={<>27 <em>mülk</em></>} labels={LABELS}><p>kart</p></OverviewTemplate>);
    expect(screen.getByRole("heading", { level: 1 }).querySelector("em")!.textContent).toBe("mülk");
    expect(document.querySelector("[data-card-grid]")!.closest(".tamga-gutter")!.className).toMatch(/\bpt-2\b/);
  });
});

describe("SectionHead · kalınlık", () => {
  it("kart başlığı bold", () => {
    render(<SectionHead title="Siparişler" />);
    expect(screen.getByRole("heading", { level: 3 }).className).toMatch(/font-bold/);
  });
});
