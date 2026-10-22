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

  it("data-action DÜĞMEDE, satırda data-key: e2e [data-action] ile düğmeye tıklıyor", () => {
    render(<DangerZone {...ETIKET} actions={[{ key: "delete-x", title: "Sil", description: "b", label: "Sil", disabledReason: "Yetki yok" }]} />);
    const dugme = document.querySelector('[data-action="delete-x"]')!;
    expect(dugme.tagName).toBe("BUTTON");
    expect(dugme).toBeDisabled();
    expect(document.querySelector('li[data-key="delete-x"]')).not.toBeNull();
  });

  it("kapalı ya da busy satırda tık onClick'i çağırmıyor; busy düğmenin adı boş değil", () => {
    const a = vi.fn(), b = vi.fn();
    render(
      <DangerZone {...ETIKET} actions={[
        { key: "a", title: "A", description: "b", label: "Sil", onClick: a, disabledReason: "Yetki yok" },
        { key: "b", title: "B", description: "b", label: "Devret", onClick: b, busy: true, busyLabel: "Devrediliyor" },
      ]} />,
    );
    fireEvent.click(document.querySelector('[data-action="a"]')!);
    fireEvent.click(document.querySelector('[data-action="b"]')!);
    expect(a).not.toHaveBeenCalled();
    expect(b).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Devrediliyor" })).toBeTruthy();
  });

  it("aynı sayfada iki bölge: id'ler benzersiz; açıklamasız bölge ve başlıksız satır çiziliyor", () => {
    render(
      <>
        <DangerZone title="Bir" actions={[{ key: "x", description: "Her şey gider.", label: "Sil", disabledReason: "Yok" }]} />
        <DangerZone title="İki" actions={[{ key: "y", description: "Her şey gider.", label: "Sil", disabledReason: "Yok" }]} />
      </>,
    );
    const idler = [...document.querySelectorAll("[id]")].map((e) => e.id);
    expect(new Set(idler).size).toBe(idler.length);
    expect(screen.getByRole("region", { name: "Bir" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "İki" })).toBeTruthy();
    expect(screen.getAllByText("Her şey gider.")).toHaveLength(2);
  });
});
