import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { AppShell } from "./app-shell.js";
import { Search } from "../components/icons.js";

/**
 * BÖLÜMLER KATLANIR, AKTİF OLAN KATLANMAZ.
 *
 * Bir müşteri raya sekiz bölüm açtı ve "kalabalık, kapatıp açabilelim" dedi.
 * Kapanan bölüm kullanıcının kararı; ama "neredeyim" raydan hep okunmalı:
 * açık sayfanın bölümü kapanamaz, ve yönlendirmeyle kapalı bir bölüme düşen
 * kullanıcı o bölümü açık bulur. Tercihin nerede saklandığını kit bilmez;
 * ürün `collapsedSections` ve `onSectionToggle` ile taşır.
 */

const nav = [
  { key: "home", href: "/", label: "Ana sayfa", icon: Search, section: "Plan" },
  { key: "tasks", href: "/tasks", label: "Görevler", icon: Search, section: "Plan" },
  { key: "budget", href: "/budget", label: "Bütçe", icon: Search, section: "Finans" },
  { key: "bills", href: "/bills", label: "Faturalar", icon: Search, section: "Finans" },
];
const LABELS = { home: "Ana sayfa", primaryNav: "Birincil gezinme" };

const baslik = (ad: string) =>
  [...document.querySelectorAll("button[aria-expanded]")].find((b) => b.textContent?.includes(ad)) as HTMLButtonElement | undefined;
const govde = (ad: string) => document.getElementById(baslik(ad)!.getAttribute("aria-controls")!)!;

describe("AppShell · katlanabilir bölümler", () => {
  it("başlık bir düğme; basınca bölüm kapanıyor, bağlantılar etkisiz kalıyor", () => {
    render(<AppShell nav={nav} activePath="/" rail="wide" labels={LABELS}><p>gövde</p></AppShell>);
    const b = baslik("Finans")!;
    expect(b).toHaveAttribute("aria-expanded", "true");
    expect(govde("Finans")).not.toHaveAttribute("inert");
    fireEvent.click(b);
    expect(b).toHaveAttribute("aria-expanded", "false");
    expect(govde("Finans")).toHaveAttribute("inert");
    /* Bağlantılar DOM'da kalıyor: ürün `data-nav` ile hâlâ bulabilir. */
    expect(document.querySelector('[data-nav="bills"]')).not.toBeNull();
  });

  it("açık sayfanın bölümü kapanmıyor", () => {
    render(<AppShell nav={nav} activePath="/budget" rail="wide" labels={LABELS}><p>gövde</p></AppShell>);
    const b = baslik("Finans")!;
    expect(b).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(b);
    expect(b).toHaveAttribute("aria-expanded", "true");
    expect(govde("Finans")).not.toHaveAttribute("inert");
  });

  it("kontrollü: ürün kapalıları veriyor, tık yalnız haber veriyor", () => {
    const onToggle = vi.fn();
    render(
      <AppShell nav={nav} activePath="/" rail="wide" labels={LABELS} collapsedSections={["Finans"]} onSectionToggle={onToggle}>
        <p>gövde</p>
      </AppShell>,
    );
    expect(baslik("Finans")).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(baslik("Finans")!);
    expect(onToggle).toHaveBeenCalledWith("Finans", true);
    /* Ürün henüz yeni değeri geçirmedi: kabuk kendi başına açmıyor. */
    expect(baslik("Finans")).toHaveAttribute("aria-expanded", "false");
  });

  it("kapalı bölüme yönlendirmeyle gelen kullanıcı onu açık buluyor", () => {
    render(
      <AppShell nav={nav} activePath="/bills" rail="wide" labels={LABELS} collapsedSections={["Finans"]}>
        <p>gövde</p>
      </AppShell>,
    );
    expect(baslik("Finans")).toHaveAttribute("aria-expanded", "true");
    expect(govde("Finans")).not.toHaveAttribute("inert");
  });

  it("dar rayda katlama yok: başlık düğmesi de, kapalı bölüm de yok", () => {
    render(
      <AppShell nav={nav} activePath="/" rail="narrow" labels={LABELS} collapsedSections={["Finans"]}>
        <p>gövde</p>
      </AppShell>,
    );
    expect(document.querySelector("button[aria-expanded]")).toBeNull();
    expect(document.querySelector("[inert]")).toBeNull();
    expect(document.querySelector('[data-nav="bills"]')).not.toBeNull();
  });

  it("`collapsibleSections={false}` eski başlığı çiziyor: düğme değil", () => {
    render(
      <AppShell nav={nav} activePath="/" rail="wide" labels={LABELS} collapsibleSections={false}>
        <p>gövde</p>
      </AppShell>,
    );
    expect(document.querySelector("button[aria-expanded]")).toBeNull();
    expect(document.body.textContent).toContain("Finans");
  });
});
