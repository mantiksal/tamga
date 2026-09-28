import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FileUpload } from "./file-upload.js";
import { TreeSelect } from "./tree-select.js";

/**
 * Sıra ve karışık durum — ikisi de "gözle bakınca doğru görünen" ama yanlış
 * olabilen şeyler, o yüzden sayıyla sınanıyor.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

const GORSELLER = [
  { id: "a", url: "blob:a", name: "Ön" },
  { id: "b", url: "blob:b", name: "Arka" },
  { id: "c", url: "blob:c", name: "Yan" },
];

const ETIKETLER = {
  drop: "Görselleri bırak",
  browse: "Seç",
  remove: "Kaldır",
  moveLeft: "Sola al",
  moveRight: "Sağa al",
  primary: "kapak",
};

/** Sürükleme olaylarının okuduğu tek şey: `setData` ve iki bayrak. */
function tasima() {
  return { setData: vi.fn(), getData: vi.fn(), effectAllowed: "", dropEffect: "", files: [] };
}

describe("FileUpload · sıra", () => {
  /* HEDEF SIRA, ADIM DEĞİL. İmza `(id, -1 | 1)` iken ok düğmeleri çalışıyordu
     ama sürükleme anlatılamıyordu; tek anlam kalınca okların da hedef sıra
     göndermesi gerekti, ve bu testin yakaladığı şey tam o kayma. */
  it("oklar hedef sırayı gönderiyor", () => {
    const onReorder = vi.fn();
    render(<FileUpload items={GORSELLER} labels={ETIKETLER} onReorder={onReorder} />);

    /* 1. karttan bakılıyor, 0.dan değil: 0. kartta hedef sıra da 1, yön de 1 —
       yanlış imza testten sessizce geçiyordu, ve bir kez geçti. */
    fireEvent.click(screen.getAllByLabelText("Sağa al")[1]!);
    expect(onReorder).toHaveBeenLastCalledWith("b", 2);

    fireEvent.click(screen.getAllByLabelText("Sola al")[2]!);
    expect(onReorder).toHaveBeenLastCalledWith("c", 1);
  });

  it("ilk kart sola, son kart sağa gidemiyor", () => {
    render(<FileUpload items={GORSELLER} labels={ETIKETLER} />);
    expect(screen.getAllByLabelText("Sola al")[0]!.hasAttribute("disabled")).toBe(true);
    expect(screen.getAllByLabelText("Sağa al")[2]!.hasAttribute("disabled")).toBe(true);
  });

  it("sürükleyip bırakmak hedefin sırasını gönderiyor", () => {
    const onReorder = vi.fn();
    const { container } = render(
      <FileUpload items={GORSELLER} labels={ETIKETLER} onReorder={onReorder} />,
    );
    const kartlar = container.querySelectorAll("li");
    const dataTransfer = tasima();

    fireEvent.dragStart(kartlar[2]!, { dataTransfer });
    fireEvent.dragOver(kartlar[0]!, { dataTransfer });
    fireEvent.drop(kartlar[0]!, { dataTransfer });

    expect(onReorder).toHaveBeenCalledWith("c", 0);
  });

  /* Kart ızgarası bırakma alanının KARDEŞİ, içinde değil: bir kartın üstüne
     bırakmak dosya eklemeye dönüşmemeli, ve bu iki alanı ayrı tutmakla
     sağlanıyor. Test o yapının bozulmasını yakalıyor. */
  it("kart üstüne bırakmak dosya eklemeye dönüşmüyor", () => {
    const onAdd = vi.fn();
    const { container } = render(
      <FileUpload items={GORSELLER} labels={ETIKETLER} onAdd={onAdd} onReorder={() => {}} />,
    );
    const kartlar = container.querySelectorAll("li");
    const dataTransfer = tasima();

    fireEvent.dragStart(kartlar[1]!, { dataTransfer });
    fireEvent.drop(kartlar[0]!, { dataTransfer });

    expect(onAdd).not.toHaveBeenCalled();
  });

  it("tek görsel sürüklenemiyor", () => {
    const { container } = render(<FileUpload items={[GORSELLER[0]!]} labels={ETIKETLER} />);
    expect(container.querySelector("li")!.getAttribute("draggable")).toBe("false");
  });
});

const AGAC = [
  {
    id: "giyim",
    label: "Giyim",
    children: [
      { id: "tisort", label: "Tişört" },
      { id: "gomlek", label: "Gömlek" },
    ],
  },
];

describe("TreeSelect · karışık durum", () => {
  /* ÜÇÜNCÜ DURUM YOKKEN ATA YALAN SÖYLÜYORDU: iki çocuğun biri seçiliyken
     ata ya işaretli (hepsi seçili gibi) ya boş (hiçbiri gibi) çiziliyordu. */
  it("çocukların biri seçiliyse ata mixed", () => {
    render(<TreeSelect nodes={AGAC} value={["tisort"]} onChange={() => {}} labels={{ search: "Ara", empty: "Yok", expand: "Aç", collapse: "Kapat" }} />);
    expect(screen.getByRole("checkbox", { name: "Giyim" }).getAttribute("aria-checked")).toBe("mixed");
  });

  it("hepsi seçiliyse ata true, hiçbiri seçili değilse false", () => {
    const { rerender } = render(<TreeSelect nodes={AGAC} value={["tisort", "gomlek"]} onChange={() => {}} labels={{ search: "Ara", empty: "Yok", expand: "Aç", collapse: "Kapat" }} />);
    expect(screen.getByRole("checkbox", { name: "Giyim" }).getAttribute("aria-checked")).toBe("true");

    rerender(<TreeSelect nodes={AGAC} value={[]} onChange={() => {}} labels={{ search: "Ara", empty: "Yok", expand: "Aç", collapse: "Kapat" }} />);
    expect(screen.getByRole("checkbox", { name: "Giyim" }).getAttribute("aria-checked")).toBe("false");
  });
});
