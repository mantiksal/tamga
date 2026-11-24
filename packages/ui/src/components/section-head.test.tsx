import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHead } from "./section.js";

/* BÖLÜM BAŞLIĞININ DÜZEYİ VE KİMLİĞİ: sayfa bölümü h2, kart başlığı h3; id başlığa iner ki
   bir section aria-labelledby ile adını alsın. İkisi de h3'tü ve id yoktu. */
describe("SectionHead · düzey ve id", () => {
  it("lg varsayılan h2, base h3; id başlık öğesinde", () => {
    render(
      <>
        <section aria-labelledby="siparisler"><SectionHead size="lg" id="siparisler" title="Siparişler" /></section>
        <SectionHead id="kart" title="Kimlik" />
      </>,
    );
    const h2 = screen.getByRole("heading", { level: 2, name: "Siparişler" });
    expect(h2.id).toBe("siparisler");
    expect(screen.getByRole("region", { name: "Siparişler" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Kimlik" }).id).toBe("kart");
  });
  it("level verilince o düzey; sub başlık değil ama id alıyor", () => {
    render(
      <>
        <SectionHead size="lg" level={3} title="Alt sayfa" />
        <SectionHead level={4} title="Derin" />
        <SectionHead size="sub" id="alt" title="Alt bölüm" />
      </>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Alt sayfa" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 4, name: "Derin" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Alt bölüm" })).toBeNull();
    expect(document.getElementById("alt")!.textContent).toBe("Alt bölüm");
  });
});
