import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { Alert } from "./primitives.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";

/* KARO BAŞLIĞIN İLK SATIRININ ORTASINDA, satır sayısından ve gövdeden bağımsız:
   kutu üstten hizalı, başlık kendi `1lh`ini 28 piksele göre aşağı alıyor. Tek
   satırda `center` üç satırlık başlıkta karoyu bloğun ortasına kaçırıyordu
   (390px'te ilk satır karodan 22 px yukarıda, üründe ölçüldü). */
describe("Alert · hiza satır sayısından bağımsız", () => {
  const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
  it("başlık, eylem ve kapatma kit sınıfı taşıyor; satır sayısı niteliği yok", () => {
    const a = render(<Alert state="info" title="Hazır" action={<Button size="sm">Aç</Button>} dismissLabel="Kapat" onDismiss={vi.fn()} />);
    const kutu = a.container.querySelector(".tamga-alert")!;
    expect(kutu.getAttribute("data-rows")).toBeNull();
    expect(kutu.getAttribute("data-body")).toBeNull();
    expect(kutu.querySelector("p")!.className).toMatch(/tamga-alert-baslik/);
    expect(kutu.querySelector(".tamga-alert-eylem")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Kapat" }).className).toMatch(/tamga-alert-kapat/);
    a.unmount();
    const b = render(<Alert state="info" title="Hazır">Gövde</Alert>);
    expect(b.container.querySelector(".tamga-alert")!.getAttribute("data-body")).toBe("true");
  });
  it("CSS: kutu üstten; başlık (28px - 1lh)/2; eylem -2, kapatma -1", () => {
    expect(css).toMatch(/\.tamga-alert\s*\{[^}]*align-items:\s*flex-start/);
    expect(css).not.toMatch(/data-rows/);
    expect(css).toMatch(/\.tamga-alert-baslik\s*\{[^}]*margin-top:\s*calc\(\(28px - 1lh\) \/ 2\)/);
    /* Boşluksuz bir adres kutudan taşıyordu: başlık her yerden kırılabilir. */
    expect(css).toMatch(/\.tamga-alert-baslik\s*\{[^}]*overflow-wrap:\s*anywhere/);
    expect(css).toMatch(/\.tamga-alert\[data-body\] > \.tamga-alert-tile\s*\{\s*margin-top:\s*2px/);
    expect(css).toMatch(/\.tamga-alert-eylem\s*\{\s*margin-top:\s*-2px/);
    expect(css).toMatch(/\.tamga-alert-kapat\s*\{\s*margin-top:\s*-1px/);
  });
});

/* BAŞARI KAROSU: lacivert glif (`--color-inverse`) yeşil karoda siyah okunuyordu;
   beyaz disk de onayı yutuyordu (denendi, beğenilmedi). Eski görünüm kalıyor:
   dolu daire, glif yeşilden açık soluk nane (`--color-resolved-mark-ink`, 3.2:1). */
describe("Alert · başarı karosunun glifi", () => {
  it("positive tonunun işaret mürekkebi resolved-mark-ink; glif dolu CheckCircle", async () => {
    const { tones } = await import("./tone.js");
    expect(tones.positive.markInk).toBe("var(--color-resolved-mark-ink)");
    const { Success } = await import("./icons.js");
    const a = render(<Alert state="positive" title="Kaydedildi" />);
    const b = render(<Icon icon={Success} size="sm" weight="fill" />);
    expect(a.container.querySelector(".tamga-alert-tile svg")!.innerHTML).toBe(b.container.querySelector("svg")!.innerHTML);
  });
});

/* SAYFA DÜZEYİNDE DURUM KUTUSU: bir nesnenin sayfasının en üstünde tek cümle.
   Satır içi uyarı orada küçük ve kenarsız kalıyordu. Varsayılan görünüm
   DEĞİŞMİYOR: `look` verilmeyince `data-look` yok. */
describe("Alert · look=banner", () => {
  const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
  it("varsayılanda data-look yok, glif sm; banner'da data-look ve glif md", () => {
    const a = render(<Alert state="danger" title="Erişilemiyor" />);
    expect(a.container.querySelector(".tamga-alert")!.getAttribute("data-look")).toBeNull();
    expect(a.container.querySelector(".tamga-alert-tile svg")!.getAttribute("width")).toBe("16");
    a.unmount();
    const b = render(<Alert look="banner" state="danger" title="Erişilemiyor">Son kontrol 2 dakika önce.</Alert>);
    expect(b.container.querySelector(".tamga-alert")!.getAttribute("data-look")).toBe("banner");
    expect(b.container.querySelector(".tamga-alert-tile svg")!.getAttribute("width")).toBe("20");
    expect(b.container.querySelector(".tamga-alert-govde")).not.toBeNull();
  });
  it("CSS: koyu kenar 1.5px, 4px sert gölge, 44px karo, gösterim yüzü başlık, gövde text-body; satır içi boyları kit sınıfında", () => {
    expect(css).toMatch(/\.tamga-alert\[data-look="banner"\]\s*\{[^}]*border:\s*1\.5px solid var\(--color-edge-strong\)/);
    expect(css).toMatch(/\.tamga-alert\[data-look="banner"\]\s*\{[^}]*box-shadow:\s*4px 4px 0 var\(--color-edge-strong\)/);
    expect(css).toMatch(/\.tamga-alert\[data-look="banner"\] > \.tamga-alert-tile\s*\{[^}]*height:\s*44px/);
    const baslik = css.match(/\.tamga-alert\[data-look="banner"\] \.tamga-alert-baslik\s*\{([^}]*)\}/)![1]!;
    expect(baslik).toMatch(/font-family:\s*var\(--font-display\)/);
    expect(baslik).toMatch(/font-size:\s*var\(--text-display-sm\)/);
    expect(baslik).toMatch(/margin-top:\s*calc\(\(44px - 1lh\) \/ 2\)/);
    expect(css).toMatch(/\.tamga-alert\[data-look="banner"\] \.tamga-alert-govde\s*\{[^}]*font-size:\s*var\(--text-body\)/);
    expect(css).toMatch(/\.tamga-alert-baslik\s*\{[^}]*font-size:\s*var\(--text-body\)/);
    expect(css).toMatch(/\.tamga-alert-govde\s*\{[^}]*font-size:\s*var\(--text-small\)/);
    /* Dar ekranda eylem alta: metin sütunu en az 12rem, kutu sarıyor. */
    expect(css).toMatch(/\.tamga-alert\[data-look="banner"\]\s*\{[^}]*flex-wrap:\s*wrap/);
    expect(css).toMatch(/\.tamga-alert\[data-look="banner"\] > \.tamga-alert-metin\s*\{[^}]*min-width:\s*9rem/);
  });
});

describe("Alert · actionAlign", () => {
  it("varsayılan işaretsiz; center bloğun ortasına alıyor", () => {
    const a = render(<Alert state="info" title="Başlık" action={<button type="button">Aç</button>}>Gövde</Alert>);
    expect(a.container.querySelector(".tamga-alert")!.getAttribute("data-action-align")).toBeNull();
    a.unmount();
    const b = render(
      <Alert state="info" title="Başlık" actionAlign="center" action={<button type="button">Aç</button>}>
        Gövde
      </Alert>,
    );
    expect(b.container.querySelector(".tamga-alert")!.getAttribute("data-action-align")).toBe("center");
    const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
    expect(css).toMatch(/\.tamga-alert\[data-action-align="center"\] > \.tamga-alert-eylem\s*\{[^}]*align-self:\s*center/);
  });
});
