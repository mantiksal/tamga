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

/**
 * BÖLÜM BAŞLIKLARI.
 *
 * Kit bunu vermiyorken bir panel kabuğu kendi rayını elle çiziyordu: menüsü yedi
 * bölüme ayrılmıştı ("Siparişler", "Ürünler", "Raporlar") ve başlıklar bilgi
 * taşıyordu, şablonun düz listesi ise taşıyamıyordu. Elle çizilen ray `AppShell`in
 * getirdiği her şeyi de dışarıda bırakıyor.
 */
describe("AppShell · bölüm başlıkları", () => {
  const bolumlu = [
    { key: "orders", href: "/orders", label: "Siparişler", icon: Search, section: "Satış" },
    { key: "returns", href: "/returns", label: "İadeler", icon: Search, section: "Satış" },
    { key: "products", href: "/products", label: "Ürünler", icon: Search, section: "Katalog" },
  ];

  it("geniş rayda grup başına BİR başlık çiziyor, giriş başına değil", () => {
    render(
      <AppShell nav={bolumlu} activePath="/orders" rail="wide" labels={LABELS}>
        <p>gövde</p>
      </AppShell>,
    );
    expect(screen.getAllByText("Satış")).toHaveLength(1);
    expect(screen.getAllByText("Katalog")).toHaveLength(1);
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("dar rayda başlık çizilmiyor: 40 piksellik kutuda okunmuyor", () => {
    render(
      <AppShell nav={bolumlu} activePath="/orders" rail="narrow" labels={LABELS}>
        <p>gövde</p>
      </AppShell>,
    );
    expect(screen.queryByText("Satış")).toBeNull();
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("`section` verilmeyen menü eskisi gibi tek liste", () => {
    const duz = bolumlu.map(({ section: _s, ...g }) => g);
    render(
      <AppShell nav={duz} activePath="/orders" rail="wide" labels={LABELS}>
        <p>gövde</p>
      </AppShell>,
    );
    expect(screen.queryByText("Satış")).toBeNull();
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });
});

/**
 * KAÇAN MUTLAK ELEMAN.
 *
 * Kaydırılan yüzey konumlu değilse içindeki `sr-only` gibi mutlak bir eleman
 * kapsayıcısını `html`de bulur, belgeyi uzatır ve `h-dvh overflow-hidden`
 * olmasına rağmen sayfanın kendisi kayar. Duruş hâlinde hiçbir şey yanlış
 * görünmüyor, o yüzden bu ancak kazara fark ediliyor.
 */
describe("AppShell · yüzey konumlu", () => {
  it("içerik yüzeyi `relative`, yani içeride kaçan mutlak bir eleman belgeyi uzatamıyor", () => {
    const { container } = render(
      <AppShell nav={nav} activePath="/" labels={LABELS}>
        <p>gövde</p>
      </AppShell>,
    );
    const yuzey = container.querySelector("main");
    expect(yuzey).not.toBeNull();
    expect(yuzey!.className).toContain("relative");
  });
});
