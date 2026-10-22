import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Collapsible } from "./disclosure.js";

/**
 * AÇIK DURUM DIŞARIDAN OKUNABİLİR. Bir kontrol listesi satırı açılınca ağdan
 * veri çekiyordu; ürün açık olup olmadığını bilmek zorundaydı ve bileşen bunu
 * dışarı vermediği için satırı elle yazdı · kitin görünümünü taklit eden,
 * tutarlılığını kaybeden bir kopya. Kontrollü mod, zengin başlık ve kapalıyken
 * de görünen not bu kopyayı gereksiz kılıyor.
 */
describe("Collapsible · kontrollü", () => {
  it("dış durum tek kaynak: tık yalnız haber verir, kendi başına açmaz", () => {
    const onOpenChange = vi.fn();
    render(
      <Collapsible title="Erişilebilirlik" open={false} onOpenChange={onOpenChange}>
        gövde
      </Collapsible>,
    );
    const b = screen.getByRole("button", { name: "Erişilebilirlik" });
    fireEvent.click(b);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(b).toHaveAttribute("aria-expanded", "false");
  });

  it("dış durum değişince açılıyor; kapanışta false ile çağrılıyor", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Collapsible title="Bölüm" open={false} onOpenChange={onOpenChange}>gövde</Collapsible>,
    );
    rerender(<Collapsible title="Bölüm" open onOpenChange={onOpenChange}>gövde</Collapsible>);
    const b = screen.getByRole("button", { name: "Bölüm" });
    expect(b).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById(b.getAttribute("aria-controls")!)).not.toHaveAttribute("hidden");
    fireEvent.click(b);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("kontrolsüz mod eskisi gibi: defaultOpen ile kendi içinde, onOpenChange yine haber verir", () => {
    const onOpenChange = vi.fn();
    render(<Collapsible title="Bölüm" defaultOpen onOpenChange={onOpenChange}>gövde</Collapsible>);
    const b = screen.getByRole("button", { name: "Bölüm" });
    expect(b).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(b);
    expect(b).toHaveAttribute("aria-expanded", "false");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("zengin başlık: erişilebilir ad metnin tamamı", () => {
    render(
      <Collapsible
        title={
          <>
            Erişilebilirlik <span className="text-ink-faint">· /fiyatlar</span>
          </>
        }
      >
        gövde
      </Collapsible>,
    );
    expect(screen.getByRole("button", { name: "Erişilebilirlik · /fiyatlar" })).toBeTruthy();
  });

  it("not kapalıyken de görünüyor, gövde değil", () => {
    render(
      <Collapsible title="Bölüm" note="Son ölçüm sayılmadı: 3 gün önce">
        <p>gövde</p>
      </Collapsible>,
    );
    expect(screen.getByText("Son ölçüm sayılmadı: 3 gün önce")).toBeVisible();
    expect(screen.getByText("gövde")).not.toBeVisible();
  });

  it("unmountOnClose: kapalıyken gövde DOM'da yok; varsayılan hâlde gizli ama var", () => {
    render(
      <>
        <Collapsible title="A" unmountOnClose><p>ağır</p></Collapsible>
        <Collapsible title="B"><p>hafif</p></Collapsible>
      </>,
    );
    expect(screen.queryByText("ağır")).toBeNull();
    expect(screen.getByText("hafif")).not.toBeVisible();
  });

  it("unmountOnClose: kapalıyken aria-controls yok, açınca var ve gövdeyi gösteriyor; aç→kapat döngüsü", () => {
    const { rerender } = render(<Collapsible title="A" open={false} unmountOnClose><p>ağır</p></Collapsible>);
    const b = screen.getByRole("button", { name: "A" });
    expect(b).not.toHaveAttribute("aria-controls");
    rerender(<Collapsible title="A" open unmountOnClose><p>ağır</p></Collapsible>);
    const id = b.getAttribute("aria-controls")!;
    expect(document.getElementById(id)?.textContent).toBe("ağır");
    rerender(<Collapsible title="A" open={false} unmountOnClose><p>ağır</p></Collapsible>);
    expect(screen.queryByText("ağır")).toBeNull();
    expect(b).not.toHaveAttribute("aria-controls");
  });

  it("not düğmeye aria-describedby ile bağlı", () => {
    render(<Collapsible title="Bölüm" note="Son ölçüm 3 gün önce">gövde</Collapsible>);
    const b = screen.getByRole("button", { name: "Bölüm" });
    const id = b.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)?.textContent).toBe("Son ölçüm 3 gün önce");
  });
});
