import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DangerZone } from "./danger-zone.js";
import { Alert } from "../components/primitives.js";

/**
 * TEHLİKELİ BÖLGE TEK BİÇİM. Bir ürün üç ayar sayfasında aynı bölgeyi üç ayrı
 * biçimde elle yazmıştı; birinde kapalı düğmenin gerekçesi yalnız `title=`
 * ipucundaydı · kapalı düğmede ipucu çoğu tarayıcıda görünmez, klavyede ve
 * dokunmatikte hiç. Burada gerekçe GÖRÜNÜR METİN ve düğmeye bağlı.
 */
const ETIKET = { title: "Tehlikeli bölge", description: "Buradaki işlemler geri alınamaz." };

describe("DangerZone", () => {
  it("kapalı satırda gerekçe görünür metin, düğme kapalı ve gerekçeye bağlı", () => {
    render(
      <DangerZone
        {...ETIKET}
        actions={[
          { key: "devret", title: "Çalışma alanını devret", description: "Sahiplik başka bir üyeye geçer.", label: "Devret", disabledReason: "Yalnız sahip devredebilir." },
        ]}
      />,
    );
    const b = screen.getByRole("button", { name: "Devret" });
    expect(b).toBeDisabled();
    const gerekce = screen.getByText("Yalnız sahip devredebilir.");
    expect(gerekce).toBeVisible();
    expect(b.getAttribute("aria-describedby")).toBe(gerekce.id);
    expect(b).not.toHaveAttribute("title");
  });

  it("açık satırda tık çağırana gidiyor; blok onay penceresi açmıyor", () => {
    const onClick = vi.fn();
    render(
      <DangerZone {...ETIKET} actions={[{ key: "sil", title: "Sil", description: "Her şey gider.", label: "Müşteriyi sil", onClick }]} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Müşteriyi sil" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("önkoşul uyarısı satırın altında; kanca kökte ve her satırda", () => {
    render(
      <DangerZone
        {...ETIKET}
        data-testid="bolge"
        actions={[
          { key: "sil", title: "Sil", description: "Her şey gider.", label: "Sil", "data-testid": "satir-sil", warning: <Alert state="caution" title="Önce canlı mülkleri kapat">2 mülk yayında.</Alert> },
        ]}
      />,
    );
    const kok = document.querySelector('[data-testid="bolge"]')!;
    expect(kok.tagName).toBe("SECTION");
    const satir = document.querySelector('[data-testid="satir-sil"]')!;
    expect(satir.tagName).toBe("LI");
    expect(satir.textContent).toContain("Önce canlı mülkleri kapat");
  });

  it("başlık düğmeyi değil bölgeyi adlandırıyor; tehlike yalnız renkle söylenmiyor", () => {
    render(<DangerZone {...ETIKET} actions={[{ key: "a", title: "A", description: "b", label: "Sil" }]} />);
    const bolge = screen.getByRole("region", { name: "Tehlikeli bölge" });
    expect(bolge).toBeTruthy();
    expect(bolge.querySelector("svg")).not.toBeNull();
  });
});
