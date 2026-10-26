import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { Breadcrumb } from "./primitives.js";
import { AvatarStack } from "./avatar.js";

const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");

/* KIRINTI YOLU ETİKET SATIRI: yol tablo başlığının sesinde (büyük harf, aralıklı,
   soluk), ayraç küçük kare, bulunduğun sayfa mürekkep ve gövde boyu. Çipli ve
   kutulu hâli panelde sayfa başlığıyla yarışıyordu (Berika, 2026-10-26). */
describe("Breadcrumb · etiket satırı", () => {
  it("ayraç kare bir span, ok glifi değil; son öğe aria-current", () => {
    render(<Breadcrumb label="Konum" items={[{ label: "Ürünler", href: "/p" }, { label: "Plaklar", href: "/p/r" }, { label: "Blue Train" }]} />);
    const nav = screen.getByRole("navigation", { name: "Konum" });
    expect(nav.querySelectorAll("svg")).toHaveLength(0);
    expect(nav.querySelectorAll(".tamga-crumb-ayrac")).toHaveLength(2);
    expect(screen.getByText("Blue Train").getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Ürünler" }).className).toBe("tamga-crumb-link");
  });
  it("kit.css: bağlantı büyük harf ve aralıklı, son öğe kutusuz, ayraç 5px kare", () => {
    expect(css).toMatch(/\.tamga-crumb-link\s*\{[^}]*text-transform:\s*uppercase/);
    expect(css).toMatch(/\.tamga-crumb-link\s*\{[^}]*letter-spacing/);
    const son = css.match(/\.tamga-crumb-son\s*\{([^}]*)\}/)![1]!;
    expect(son).not.toMatch(/border|background/);
    expect(son).toMatch(/font-size:\s*var\(--text-body\)/);
    expect(css).toMatch(/\.tamga-crumb-ayrac\s*\{[^}]*width:\s*5px/);
  });
});

describe("AvatarStack · fotoğraflı kişi", () => {
  it("nesne verilen kişi img, dizgi verilen baş harf; duyuru adlardan", () => {
    render(<AvatarStack names={[{ name: "Ada Korkmaz", src: "/avatar-1.png" }, "Baran Demir"]} extra={2} />);
    const yigin = screen.getByRole("img", { name: "Ada Korkmaz, Baran Demir, +2" });
    expect(yigin.querySelector("img")!.getAttribute("src")).toBe("/avatar-1.png");
    expect(yigin.textContent).toContain("B");
  });
});

/* YIĞIN KATMANLI GÖRÜNÜYORDU: halkanın köşesi karonunkinden küçüktü, karo
   kendi tabanını da taşıyordu, +N karosu üstüne bir taban daha alıyordu, ve
   örtüşme dörtte birdi. Fotoğraf karosu da vurgu renginde zemin alıyordu. */
describe("AvatarStack · tek katman", () => {
  it("örtüşme sekizde bir; halkanın köşesi karonun köşesi; karoda taban yok; +N karosu yükselmiyor", () => {
    render(<AvatarStack names={["Ada Korkmaz", { name: "Baran Demir", src: "/a.png" }]} extra={3} size={40} />);
    const yigin = screen.getByRole("img", { name: "Ada Korkmaz, Baran Demir, +3" });
    const [ilk, ikinci, artan] = [...yigin.children] as HTMLElement[];
    expect(ikinci!.style.marginLeft).toBe("-5px");
    expect(artan!.style.marginLeft).toBe("-5px");
    const karo = ilk!.firstElementChild as HTMLElement;
    expect(ilk!.style.borderRadius).toBe(karo.style.borderRadius);
    expect(karo.style.boxShadow).toBe("");
    expect((ikinci!.firstElementChild as HTMLElement).style.boxShadow).toBe("");
    expect(artan!.style.borderRadius).toBe(karo.style.borderRadius);
    expect(artan!.style.boxShadow).not.toMatch(/3px 3px/);
  });
  it("kit.css: fotoğraf karosunun zemini kabuk rengi, vurgu değil", () => {
    expect(css).toMatch(/img\.tamga-avatar\s*\{[^}]*background:\s*var\(--color-shell\)/);
  });
});
