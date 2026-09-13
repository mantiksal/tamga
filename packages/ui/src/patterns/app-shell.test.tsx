import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppShell } from "./app-shell.js";
import { Search } from "../components/icons.js";

/**
 * Açık giriş, ALT AĞACIN SAHİBİ.
 *
 * Kabuk hangi menünün doğru olduğunu bilmiyor ve bilmemeli — o kararı veren
 * ürünün kendi testinin işi. Buradaki tek soru şu: verilen bir giriş listesinde
 * "şu an buradasın" doğru satıra düşüyor mu. Yanlış cevabı sinsi: kısa bir yol
 * (`/`) altındaki her rotayı yutar, ya da derin bir yol hiçbir satırı
 * işaretlemez ve kullanıcı menüde kendini kaybeder.
 */

const nav = [
  { key: "home", href: "/", label: "Ana sayfa", icon: Search },
  { key: "records", href: "/records", label: "Kayıtlar", icon: Search },
  { key: "events", href: "/events", label: "Olaylar", icon: Search },
];

const LABELS = { home: "Ana sayfa", primaryNav: "Birincil gezinme" };

const shell = (activePath: string) => (
  <AppShell nav={nav} activePath={activePath} labels={LABELS}>
    <p>gövde</p>
  </AppShell>
);

describe("AppShell · açık giriş", () => {
  it("bir giriş kendi alt ağacına sahip", () => {
    render(shell("/records/42/events"));

    expect(document.querySelector('[data-nav="records"]')).toHaveAttribute("aria-current", "page");
    /* …ve yalnız o. Derin bir kayıt rotası aynı zamanda "Olaylar" değildir,
       yol aynı sözcükle bitse bile. */
    expect(document.querySelector('[data-nav="events"]')).not.toHaveAttribute("aria-current");
  });

  it("kök yol TAM eşleşiyor, yoksa kısa href'i altındaki her rotayı yutardı", () => {
    render(shell("/events"));

    expect(document.querySelector('[data-nav="home"]')).not.toHaveAttribute("aria-current");
    expect(document.querySelector('[data-nav="events"]')).toHaveAttribute("aria-current", "page");
  });

  it("sayfanın gövdesi `main` içine iniyor", () => {
    render(shell("/"));
    expect(screen.getByRole("main")).toHaveTextContent("gövde");
  });
});
