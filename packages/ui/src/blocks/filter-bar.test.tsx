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

/* ŞABLONUN İÇİNDE TEK KART. `ListTemplate` filtre alanını kendi kartına koyuyor
   (`data-filters`), çubuk da kökünde bir kart çiziyordu: iç içe iki kart, ve
   esnek sarmalayıcıda içeriği kadar daralan bir çubuk. Çubuğun kutusu artık bir
   kit sınıfı; şablonun alanında yüzeyini bırakıp tam genişlik alıyor. Dolgu
   CSS'te, Tailwind'de değil: yardımcı sınıf katmanı bileşen katmanını ezer,
   `padding: 0` ona işlemezdi. Tek başına çubuk piksel piksel aynı (16px/14px). */
describe("FilterBar · kök kutu", () => {
  const css = (() => {
    const { existsSync, readFileSync } = require("node:fs") as typeof import("node:fs");
    return readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
  })();
  const kural = (secici: string) => css.match(new RegExp(secici.replace(/[.*+?^${}()|[\]\\>]/g, "\\$&") + "\\s*\\{([^}]*)\\}"))?.[1] ?? "";
  it("kök `tamga-filter-bar`; dolgu ve aralık yardımcı sınıfla değil", () => {
    kur();
    const kok = document.querySelector(".tamga-card-open")!;
    expect(kok.classList.contains("tamga-filter-bar")).toBe(true);
    expect(kok.classList.contains("tamga-card-open")).toBe(true);
    expect(kok.className).not.toMatch(/\bp-4\b|\bgap-3\.5\b/);
  });
  it("kit sınıfı eski ölçüleri taşıyor: sütun, 14px aralık, 16px dolgu", () => {
    const k = kural(".tamga-filter-bar");
    expect(k).toMatch(/display:\s*flex/);
    expect(k).toMatch(/flex-direction:\s*column/);
    expect(k).toMatch(/gap:\s*14px/);
    expect(k).toMatch(/padding:\s*16px/);
  });
  it("şablonun filtre alanında yüzeyini bırakıyor ve tam genişlik alıyor", () => {
    const k = kural("[data-filters] > .tamga-filter-bar");
    expect(k).toMatch(/flex:\s*1 1 100%/);
    expect(k).toMatch(/padding:\s*0/);
    expect(k).toMatch(/border:\s*0/);
    expect(k).toMatch(/border-radius:\s*0/);
    expect(k).toMatch(/background:\s*none/);
    expect(k).toMatch(/box-shadow:\s*none/);
  });
});
