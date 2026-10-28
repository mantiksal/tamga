import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { Progress } from "./progress.js";

/* İNCE ÇUBUK (`size="sm"`): tablo hücresine sığan 4px, kenarsız, etiketsiz.
   `md` bugünkü hâl ve piksel piksel kilitli. */
describe("Progress", () => {
  const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
  it("md birebir aynı (kilit)", () => {
    const a = render(<Progress value={64} label="Yükleniyor" ariaLabel="Dosya" />);
    expect(a.container.innerHTML).toBe('<div class=""><div class="tamga-progress-ust"><span>Yükleniyor</span><span class="tamga-progress-deger">%64</span></div><div class="tamga-progress" role="progressbar" aria-valuenow="64" aria-valuemin="0" aria-valuemax="100" aria-label="Yükleniyor"><div class="tamga-progress-fill" style="width: 64%;"></div></div></div>');
    a.unmount();
    const b = render(<Progress value={30} ariaLabel="Kapsam" className="w-24" />);
    expect(b.container.innerHTML).toBe('<div class="w-24"><div class="tamga-progress" role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" aria-label="Kapsam"><div class="tamga-progress-fill" style="width: 30%;"></div></div></div>');
  });
  it("sm: etiket satırı yok, sınıf var, rol ve ad aynen; genişlik çağıranın", () => {
    const { container } = render(<Progress size="sm" value={94} label="Kapsam" valueText="%94" ariaLabel="Kapsam" className="w-24" />);
    expect(container.querySelector(".tamga-progress-ust")).toBeNull();
    const bar = container.querySelector('[role="progressbar"]')!;
    expect(bar.classList.contains("tamga-progress-sm")).toBe(true);
    expect(bar.getAttribute("aria-valuenow")).toBe("94");
    expect(bar.getAttribute("aria-label")).toBe("Kapsam");
    expect(container.firstElementChild!.className).toBe("w-24");
  });
  it("tone dolgunun rengini kitin rolünden alıyor; yoksa vurgu", () => {
    const a = render(<Progress size="sm" value={50} ariaLabel="x" tone="positive" />);
    expect((a.container.querySelector(".tamga-progress-fill") as HTMLElement).style.background).toContain("var(--color-resolved-mark)");
    a.unmount();
    const b = render(<Progress size="sm" value={50} ariaLabel="x" />);
    expect((b.container.querySelector(".tamga-progress-fill") as HTMLElement).style.background).toBe("");
  });
  it("md çubukta tone çizgiyi korur: tonun iki gölgesi", () => {
    const { container } = render(<Progress value={40} ariaLabel="x" tone="danger" />);
    const fill = container.querySelector(".tamga-progress-fill") as HTMLElement;
    expect(fill.getAttribute("data-tone")).toBe("danger");
    expect(fill.style.getPropertyValue("--tamga-progress-tint")).toContain("var(--color-critical-mark)");
    expect(fill.style.background).toBe("");
    const k = css.match(/\.tamga-progress-fill\[data-tone\]\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(k).toMatch(/repeating-linear-gradient/);
  });
  it("CSS: 4px, kenarsız, gölgesiz, düz dolgu", () => {
    const k = css.match(/\.tamga-progress-sm\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(k).toMatch(/height:\s*4px/);
    expect(k).toMatch(/border:\s*0/);
    expect(k).toMatch(/box-shadow:\s*none/);
    const d = css.match(/\.tamga-progress-sm > \.tamga-progress-fill\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(d).toMatch(/background:\s*var\(--color-accent\)/);
    expect(d).toMatch(/border-right:\s*0/);
  });
});

/* PASTEL: tonun yumuşak hâli, düz dolgu; çizgi yok. */
describe("Progress · soft", () => {
  it("tonlu md çubuk pastel tint ve data-soft taşıyor", () => {
    const { container } = render(<Progress value={48} tone="elevated" soft ariaLabel="Erişim" />);
    const fill = container.querySelector<HTMLElement>(".tamga-progress-fill")!;
    expect(fill.dataset.soft).toBe("true");
    expect(fill.style.getPropertyValue("--tamga-progress-tint")).toContain("color-mix");
  });
});
