import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RadioGroup } from "./radio-group.js";
import { PasswordInput } from "./advanced-input.js";

/**
 * İki kusurun kapısı. İkisi de ürün tarafında bulundu ve ikisinin de sebebi
 * kitteydi: bir bileşen yapabileceği şeyi yapmayınca tüketen taraf kitin
 * sınıfını ELLE yazıyor, ve sınıfla gelen her şey orada kalıyor.
 */

const SECENEKLER = [
  { value: "site", label: "Site" },
  { value: "api", label: "API" },
  { value: "host", label: "Sunucu" },
] as const;

describe("RadioGroup · biçim varyantı", () => {
  /* DEĞİŞEN YALNIZ KABUK. Bu testin ölçtüğü şey görünüm değil, görünüm
     değişirken ANLAMIN sabit kalması: bir ürün "N'den biri"ni kart olarak
     çizmek istediğinde rolü ve klavyeyi kaybetmemeli. Elle çizilen hâli tam
     bunu kaybediyordu: ekran okuyucuya üç ayrı düğme diye duyuruluyordu. */
  for (const look of ["list", "chip", "card"] as const) {
    it(`${look}: rol ve seçim durumu değişmiyor`, () => {
      render(<RadioGroup options={SECENEKLER} value="api" label="Tür" look={look} />);
      expect(screen.getByRole("radiogroup", { name: "Tür" })).toBeTruthy();
      expect(screen.getAllByRole("radio")).toHaveLength(3);
      expect(screen.getByRole("radio", { name: "API" }).getAttribute("aria-checked")).toBe("true");
      expect(screen.getByRole("radio", { name: "Site" }).getAttribute("aria-checked")).toBe("false");
    });
  }

  it("kabuk sınıfı biçime göre iniyor", () => {
    const { rerender } = render(<RadioGroup options={SECENEKLER} value="site" label="Tür" look="card" />);
    expect(screen.getByRole("radio", { name: "Site" }).className).toContain("tamga-choice-card");
    rerender(<RadioGroup options={SECENEKLER} value="site" label="Tür" look="chip" />);
    expect(screen.getByRole("radio", { name: "Site" }).className).toContain("tamga-choice-chip");
  });

  it("seçeneğin kancası kendi düğmesine iniyor", () => {
    /* KARDEŞLERİYLE AYNI SÖZLEŞME. `Segmented` ve `Steps` seçenek başına
       öznitelik taşıyordu, `RadioGroup` taşımıyordu — ve bunu tüketen taraf
       ödüyordu: bir seçeneğe kanca takmak için bileşen BIRAKILIP sınıf elle
       yazılıyordu, yani rol ve klavye de bırakılıyordu. */
    render(
      <RadioGroup
        label="Tür"
        value="api"
        options={SECENEKLER.map((o) => ({ ...o, "data-tur": o.value }))}
      />,
    );
    const api = document.querySelector('[data-tur="api"]');
    expect(api).not.toBeNull();
    expect(api!.getAttribute("role")).toBe("radio");
    /* Kitin kendi nitelikleri çağıranınkinden SONRA yazılıyor: bir kanca
       `aria-checked`i kazara ezemez. */
    expect(api!.getAttribute("aria-checked")).toBe("true");
  });

  it("varsayılan biçim `list` ve kabuk sınıfı almıyor", () => {
    render(<RadioGroup options={SECENEKLER} value="site" label="Tür" />);
    const s = screen.getByRole("radio", { name: "Site" }).className;
    expect(s).not.toContain("tamga-choice-card");
    expect(s).not.toContain("tamga-choice-chip");
  });
});

describe("PasswordInput · invalid", () => {
  /* KARDEŞİNDE VARDI, BURADA YOKTU. Tüketen taraf hatalı parolayı göstermek
     için kitin sınıfını elle yazıyordu; `aria-invalid` de o yolda hiç
     gelmiyordu, yani hata yalnız GÖRÜNÜYOR, duyurulmuyordu. */
  const labels = { show: "Göster", hide: "Gizle" };

  it("geçersizken hem sınıfı hem duyuruyu taşıyor", () => {
    render(<PasswordInput labels={labels} invalid aria-label="Parola" />);
    const alan = screen.getByLabelText("Parola");
    expect(alan.getAttribute("aria-invalid")).toBe("true");
    expect(alan.className).toContain("tamga-input-invalid");
  });

  it("geçerliyken ikisi de yok", () => {
    render(<PasswordInput labels={labels} aria-label="Parola" />);
    const alan = screen.getByLabelText("Parola");
    expect(alan.getAttribute("aria-invalid")).toBeNull();
    expect(alan.className).not.toContain("tamga-input-invalid");
  });

  it("sınıf tablosu kitin kendi tablosundan geliyor", () => {
    render(<PasswordInput labels={labels} aria-label="Parola" />);
    expect(screen.getByLabelText("Parola").className).toContain("tamga-input");
  });
});

/* TEK SATIRDA İŞARET METİNLE ORTALI. `tamga-choice-mark`ın üst boşluğu 18 px'e
   göre hesaplanıyordu; radyo 20 px, onay kutusu 22 px. Fark her satırda işareti
   1-2 px aşağı itiyordu. Seçili kartın zemini de `accent-soft`tan `accent-bg`ye:
   doygun mavi seçili kartı düğme gibi ağırlaştırıyordu. */
describe("Seçenek işareti ve seçili kart (kit.css)", () => {
  const { existsSync, readFileSync } = require("node:fs") as typeof import("node:fs");
  const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
  it("işaretin üst boşluğu kendi boyuna göre: radyo 20px, onay kutusu 22px", () => {
    expect(css).toMatch(/\.tamga-radio\.tamga-choice-mark\s*\{\s*margin-top:\s*calc\(\(1lh - 20px\) \/ 2\)/);
    expect(css).toMatch(/\.tamga-check\.tamga-choice-mark\s*\{\s*margin-top:\s*calc\(\(1lh - 22px\) \/ 2\)/);
    expect(css).not.toMatch(/\.tamga-choice-mark\s*\{[^}]*18px/);
  });
  it("seçili kartın zemini yıkama (accent-bg), mürekkep sayfanın mürekkebi", () => {
    const k = css.match(/\.tamga-choice-card\[aria-checked="true"\]\s*\{([^}]*)\}/g)!.join("\n");
    expect(k).toMatch(/background:\s*var\(--color-accent-bg\)/);
    expect(k).not.toMatch(/accent-soft/);
  });
});
