import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FilterBar } from "./filter-bar.js";

/**
 * Dosyayla aramanın kapısı: blok bir dosya seçtiriyor ama dosyanın kendisini
 * hiçbir yere vermiyordu. `values` dizgi tuttuğu için oraya ancak AD yazılıyor,
 * ve ekranın okuyacağı şey kayboluyordu · ürün bu yüzden kendi düğmesini
 * çekmecenin dışına koymuştu.
 */

const ETIKETLER = {
  search: "Ara",
  all: "Tümü",
  allFilters: "Tüm filtreler",
  clearAll: "Hepsini temizle",
  clear: "Temizle",
  apply: "Uygula",
  noMatch: "Eşleşen yok",
  open: (l: string) => `${l} seç`,
  remove: (l: string) => `${l} filtresini kaldır`,
  rangeStart: "Başlangıç",
  rangeEnd: "Bitiş",
  calendar: { previousMonth: "Önceki ay", nextMonth: "Sonraki ay", open: "Takvimi aç", clear: "Temizle" },
  fileSearch: { label: "Dosya araması", title: "Dosyayla ara", help: "Bir dosya seç", choose: "Dosya seç", remove: "Kaldır" },
};

const DOSYA = new File(["id\n1"], "siparisler.xlsx", { type: "text/csv" });

function kur(props: Partial<Parameters<typeof FilterBar>[0]> = {}) {
  const onChange = vi.fn();
  const onFile = vi.fn();
  render(
    <FilterBar
      values={{}}
      onChange={onChange}
      top={[]}
      /* Çekmece düğmesi ancak çekmecede bir şey varsa çiziliyor (0.5.4). */
      drawer={[{ title: "Durum", fields: [{ key: "durum", label: "Durum", kind: "select", options: ["Yeni"] }] }]}
      fileSearchKey="dosya"
      onFile={onFile}
      labels={ETIKETLER}
      {...props}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Tüm filtreler" }));
  return { onChange, onFile };
}

describe("FilterBar · dosyayla arama", () => {
  it("dosyanın kendisi çağırana gidiyor, adı filtre değerine", () => {
    const { onChange, onFile } = kur();
    const girdi = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(girdi, { target: { files: [DOSYA] } });
    expect(onFile).toHaveBeenCalledWith(DOSYA);
    expect(onChange).toHaveBeenCalledWith({ dosya: "siparisler.xlsx" });
  });

  it("kaldırınca dosya da bırakılıyor", () => {
    const { onChange, onFile } = kur({ values: { dosya: "siparisler.xlsx" } });
    fireEvent.click(screen.getByRole("button", { name: "Kaldır" }));
    expect(onFile).toHaveBeenCalledWith(null);
    expect(onChange).toHaveBeenCalledWith({});
  });

  it("kabul edilen tür çağıranın kararı · kit bir biçim adı taşımıyor", () => {
    kur({ fileAccept: ".xlsx,.csv" });
    const girdi = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(girdi.getAttribute("accept")).toBe(".xlsx,.csv");
  });
});
