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
  /* Düğme iki metin taşıyor (geniş/dar); jsdom CSS bilmediği için adı ikisinin toplamı. */
  fireEvent.click(screen.getByRole("button", { name: /Tüm filtreler/ }));
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

/* İLK GERÇEK TÜKETİCİNİN BULDUKLARI (0.7.3): alanların adı yoktu, telefonda
   çubuk ilk ekranı kaplıyordu, seçeneğin değeri ile adı aynı dizgeydi. */
import type { FilterField } from "./filter-bar.js";
const ALANLAR: FilterField[] = [
  { key: "durum", label: "Durum", kind: "select", options: ["Açık", "Kapalı"] },
  { key: "musteri", label: "Müşteri", kind: "searchable", options: ["A", "B"] },
  { key: "etiket", label: "Etiket", kind: "multi", options: ["x", "y"] },
  { key: "tarih", label: "Tarih", kind: "dateRange" },
  { key: "not", label: "Not", kind: "text" },
];
const cubuk = (props: Partial<Parameters<typeof FilterBar>[0]> = {}) => {
  const onChange = vi.fn();
  render(<FilterBar values={{}} onChange={onChange} top={ALANLAR} drawer={[]} labels={ETIKETLER} {...props} />);
  return onChange;
};

describe("FilterBar · erişilebilir ad (1)", () => {
  it("her üst alan kendi adıyla bulunuyor; tarih aralığı iki kutu, iki ad", () => {
    cubuk();
    expect(screen.getByRole("button", { name: "Durum" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Müşteri" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Etiket" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Tarih Başlangıç" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Tarih Bitiş" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Not" })).toBeTruthy();
  });
  it("çekmecedeki alanlar da", () => {
    cubuk({ top: [], drawer: [{ title: "Diğer", fields: [{ key: "oncelik", label: "Öncelik", kind: "select", options: ["Düşük"] }] }] });
    fireEvent.click(screen.getByRole("button", { name: /Tüm filtreler/ }));
    expect(screen.getByRole("button", { name: "Öncelik" })).toBeTruthy();
  });
});

describe("FilterBar · dar ekran (2 · 4)", () => {
  const css = (() => {
    const { existsSync, readFileSync } = require("node:fs") as typeof import("node:fs");
    return readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
  })();
  it("düğme iki metin taşıyor: genişte 'Tüm filtreler' + sayaç, darda 'Filtrele · N' (N aramayı saymıyor)", () => {
    cubuk({ values: { durum: "Açık", q: "x" }, top: [ALANLAR[0]!], labels: { ...ETIKETLER, filter: "Filtrele" } });
    const dugme = screen.getByRole("button", { name: /Filtrele/ });
    expect(dugme.querySelector(".tamga-filter-genis")?.textContent).toBe("Tüm filtreler");
    expect(dugme.querySelector(".tamga-filter-dar")?.textContent).toBe("Filtrele · 1");
  });
  it("etiket yoksa allFilters; uygulanan yoksa sayı yok; çekmece boş ama üst alan varsa düğme dar görünüm için duruyor", () => {
    cubuk({ top: [ALANLAR[0]!] });
    const dugme = screen.getByRole("button", { name: /Tüm filtreler/ });
    expect(dugme.querySelector(".tamga-filter-dar")?.textContent).toBe("Tüm filtreler");
    expect(dugme.classList.contains("tamga-filter-dar")).toBe(true);
  });
  it("çekmece de üst alan da yoksa düğme yok", () => {
    cubuk({ top: [] });
    expect(screen.queryByRole("button", { name: /Tüm filtreler/ })).toBeNull();
  });
  it("üst alanlar satırda `tamga-filter-genis`; çekmecede başlıksız ilk grup `tamga-filter-dar`; arama `tamga-filter-ara`", () => {
    cubuk({ top: [ALANLAR[0]!], drawer: [{ title: "Diğer", fields: [ALANLAR[4]!] }] });
    expect(document.querySelector(".tamga-filter-row .tamga-filter-genis .tamga-select")).not.toBeNull();
    expect(document.querySelector(".tamga-filter-row .tamga-filter-ara input[type=search]")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Tüm filtreler/ }));
    const form = document.querySelector("form")!;
    const ilk = form.firstElementChild!;
    expect(ilk.classList.contains("tamga-filter-dar")).toBe(true);
    expect(ilk.querySelector("p")).toBeNull();
    expect(ilk.querySelector(".tamga-select")).not.toBeNull();
    expect(form.children[1]!.querySelector("p")?.textContent).toBe("Diğer");
  });
  it("dar düzen kabın genişliğine bağlı: çubuk bir container, esnek atalar min-width 0", () => {
    expect(css).toMatch(/\.tamga-filter-bar\s*\{[^}]*container-type:\s*inline-size/);
    expect(css).toMatch(/\.tamga-filter-bar\s*\{[^}]*min-width:\s*0/);
    expect(css).toMatch(/\.tamga-filter-cips\s*\{[^}]*min-width:\s*0/);
    /* Çipin kendisi küçülmez: min-width 0 sırada ve atalarında kalıyor. */
    expect(css).toMatch(/\.tamga-filter-cip\s*\{[^}]*flex-shrink:\s*0/);
    expect(css).toMatch(/\.tamga-filter-cip\s*\{[^}]*white-space:\s*nowrap/);
    expect(css).not.toMatch(/\.tamga-filter-cip\s*\{[^}]*min-width:\s*0/);
    expect(css).toMatch(/\.tamga-filter-cip-sira > \.tamga-filter-cip,\s*\.tamga-filter-cip-sira > \.tamga-filter-cip-temizle\s*\{\s*flex:\s*0 0 auto/);
    expect(css).toMatch(/\.tamga-filter-cips > \.tamga-btn,\s*\.tamga-filter-row > \.tamga-btn\s*\{\s*flex-shrink:\s*0/);
  });
  it("geçiş CSS kırılımıyla: dar sınıf genişte, geniş sınıf darda gizli; arama darda tabansız; aynı kök", () => {
    expect(css).toMatch(/@container \(min-width: 40rem\)\s*\{\s*\.tamga-filter-dar\s*\{\s*display:\s*none/);
    expect(css).toMatch(/@container \(max-width: 39\.9375rem\)\s*\{[^@]*\.tamga-filter-genis\s*\{\s*display:\s*none/);
    expect(css).toMatch(/\.tamga-filter-row > \.tamga-filter-ara\s*\{\s*flex-basis:\s*0/);
    cubuk({ top: [ALANLAR[0]!] });
    expect(document.querySelectorAll(".tamga-filter-bar").length).toBe(1);
  });
});

describe("FilterBar · değer ve etiket ayrı (5)", () => {
  const SECENEKLI: FilterField = {
    key: "state", label: "Durum", kind: "select",
    options: [{ value: "ok", label: "Sağlam" }, { value: "critical", label: "Kritik" }],
    tones: { critical: "danger" },
  };
  it("nesne seçenek: kutu ve çip etiketi gösteriyor, yazılan değer; ton değere göre", () => {
    const onChange = cubuk({ values: { state: "critical" }, top: [SECENEKLI] });
    const kutu = screen.getByRole("button", { name: "Durum" });
    expect(kutu.textContent).toBe("Kritik");
    const cip = document.querySelector(".tamga-token")!;
    expect(cip.textContent).toContain("Kritik");
    expect(cip.textContent).not.toContain("critical");
    fireEvent.click(kutu);
    const kritik = screen.getByRole("option", { name: "Kritik" });
    expect(kritik.innerHTML).toMatch(/var\(--color-/);
    fireEvent.click(screen.getByRole("option", { name: "Sağlam" }));
    expect(onChange).toHaveBeenCalledWith({ state: "ok" });
  });
  it("çoklu ve aranabilir de etiketle; optionSource nesne de kabul ediyor", () => {
    cubuk({
      values: { etiket: "x,y", musteri: "b" },
      top: [{ key: "etiket", label: "Etiket", kind: "multi", options: [{ value: "x", label: "Bir" }, { value: "y", label: "İki" }] }, { key: "musteri", label: "Müşteri", kind: "searchable" }],
      optionSource: { musteri: [{ value: "b", label: "Beta" }] },
    });
    const cipler = [...document.querySelectorAll(".tamga-token")].map((c) => c.textContent);
    expect(cipler.some((c) => c?.includes("Bir, İki"))).toBe(true);
    expect(cipler.some((c) => c?.includes("Beta"))).toBe(true);
  });
  it("düz string[] bugünkü gibi", () => {
    cubuk({ values: { durum: "Açık" }, top: [ALANLAR[0]!] });
    expect(screen.getByRole("button", { name: "Durum" }).textContent).toBe("Açık");
    expect(document.querySelector(".tamga-token")?.textContent).toContain("Açık");
  });
});

/* GÖRÜNÜM VE TABAN KİT SINIFINDA: `tamga-filter-genis`/`-dar` taşıyan bir
   elemanda Tailwind'in `flex`/`hidden`/`basis-*` sınıfı kalırsa yardımcı
   katman bileşen katmanını ezer ve `display: none` hiç işlemez (tarayıcıda
   ölçüldü: 390 px'te üç alan `flex` kaldı). Tarayıcı kapısı: scripts/olc/filtre-dar.mjs */
describe("FilterBar · dar/geniş sınıfı taşıyan eleman yardımcı görünüm sınıfı taşımaz", () => {
  const YARDIMCI = /(^|\s)(flex|inline-flex|hidden|block|grid|flex-col|basis-\S+|grow\S*|shrink\S*|min-w-0)(\s|$)/;
  it("satırda, düğmede ve çekmecede", () => {
    cubuk({ top: ALANLAR, drawer: [{ title: "Diğer", fields: [ALANLAR[4]!] }], labels: { ...ETIKETLER, filter: "Filtrele" } });
    fireEvent.click(screen.getByRole("button", { name: /Filtrele/ }));
    const tasiyanlar = [...document.querySelectorAll(".tamga-filter-genis, .tamga-filter-dar, .tamga-filter-ara")];
    expect(tasiyanlar.length).toBeGreaterThan(5);
    for (const el of tasiyanlar) expect(el.className, el.className).not.toMatch(YARDIMCI);
  });
  it("kit sınıfları eski ölçüleri taşıyor: arama 2/1/18.75rem, alan 1/1/10rem (aralık 20rem), 6px aralık", () => {
    const { existsSync, readFileSync } = require("node:fs") as typeof import("node:fs");
    const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
    const kural = (secici: string) => css.match(new RegExp(secici.replace(/[.*+?^${}()|[\]\\>]/g, "\\$&") + "\\s*\\{([^}]*)\\}"))?.[1] ?? "";
    /* Kendi kuralı ortak kuralın (`-ara, -alan`) hemen ardında; seçici tek başına aranıyor. */
    expect(css).toMatch(/\n  \.tamga-filter-ara\s*\{\s*flex:\s*2 1 18\.75rem/);
    /* Görünüm ve aralık ikisinin ortak kuralında. */
    expect(css).toMatch(/\.tamga-filter-ara,\s*\.tamga-filter-alan\s*\{[^}]*display:\s*flex[^}]*gap:\s*6px/);
    expect(css).toMatch(/\n  \.tamga-filter-alan\s*\{\s*flex:\s*1 1 10rem/);
    expect(kural(".tamga-filter-alan[data-range]")).toMatch(/flex-basis:\s*20rem/);
    expect(kural(".tamga-filter-grup")).toMatch(/gap:\s*14px/);
  });
});

/* ÇİP DÜZENİ (`look="chips"`): arama sabit genişlikte, her üst alan bir çip-düğme
   ("Durum: Tümü ▾" / "Durum: Kritik ✕"), paneli SelectPanel ve ilk seçeneği
   "Tümü". Ayrı bir "uygulanan filtreler" satırı yok: çipin kendisi özet. */
describe("FilterBar · look=chips", () => {
  const CIP: FilterField[] = [
    { key: "state", label: "Durum", kind: "select", options: [{ value: "ok", label: "Sağlam" }, { value: "critical", label: "Kritik" }], tones: { critical: "danger" } },
    { key: "musteri", label: "Müşteri", kind: "searchable", panelTitle: "Müşteri seçin", options: ["Alfa", "Beta"] },
    { key: "etiket", label: "Etiket", kind: "multi", options: [{ value: "x", label: "Bir" }, { value: "y", label: "İki" }] },
  ];
  const cips = (props: Partial<Parameters<typeof FilterBar>[0]> = {}) =>
    cubuk({ look: "chips", top: CIP, labels: { ...ETIKETLER, filter: "Filtrele" }, ...props });
  const css = (() => {
    const { existsSync, readFileSync } = require("node:fs") as typeof import("node:fs");
    return readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
  })();

  it("satır çip satırı: arama sabit, alan kutusu yok, uygulanan çip satırı yok", () => {
    cips({ values: { state: "critical" } });
    expect(document.querySelector(".tamga-filter-row")).toBeNull();
    expect(document.querySelector(".tamga-filter-cips .tamga-filter-ara-sabit input[type=search]")).not.toBeNull();
    expect(document.querySelector(".tamga-filter-cips .tamga-select")).toBeNull();
    expect(document.querySelector(".tamga-token")).toBeNull();
  });
  it("boş çip: 'Durum: Tümü' + ok, kenarlı küçük; dolu çip: 'Durum: Kritik' yumuşak, oksuz, ayrı ✕ kaldırıyor", () => {
    const onChange = cips({ values: { state: "critical" } });
    const durum = screen.getByRole("button", { name: "Durum" });
    expect(durum.textContent).toBe("Durum:Kritik");
    expect(durum.className).toMatch(/tamga-btn-soft/);
    expect(durum.className).toMatch(/tamga-btn-sm/);
    expect(durum.querySelector("svg")).toBeNull();
    const musteri = screen.getByRole("button", { name: "Müşteri" });
    expect(musteri.textContent).toBe("Müşteri:Tümü");
    expect(musteri.className).not.toMatch(/tamga-btn-soft/);
    expect(musteri.querySelector("svg")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Durum filtresini kaldır" }));
    expect(onChange).toHaveBeenCalledWith({});
    expect(screen.queryByRole("button", { name: "Müşteri filtresini kaldır" })).toBeNull();
  });
  it("çipin paneli: başlık panelTitle ya da ad; ilk seçenek Tümü; aranabilir alanda arama; seçim değeri yazıyor", () => {
    const onChange = cips();
    fireEvent.click(screen.getByRole("button", { name: "Müşteri" }));
    expect(screen.getByText("Müşteri seçin")).toBeTruthy();
    /* Çubuğun araması + panelin araması: iki arama kutusu. */
    expect(screen.getAllByRole("searchbox").length).toBe(2);
    expect(screen.getAllByRole("option")[0]!.textContent).toBe("Tümü");
    fireEvent.click(screen.getByRole("option", { name: "Beta" }));
    expect(onChange).toHaveBeenCalledWith({ musteri: "Beta" });
    fireEvent.click(screen.getByRole("button", { name: "Durum" }));
    expect(screen.getByRole("listbox", { name: "Durum" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "Kritik" }).querySelector(".tamga-mark")).not.toBeNull();
  });
  it("çoklu alan: panel çoklu, çip özet 'Bir +1'", () => {
    cips({ values: { etiket: "x,y" } });
    expect(screen.getByRole("button", { name: "Etiket" }).textContent).toBe("Etiket:Bir +1");
    fireEvent.click(screen.getByRole("button", { name: "Etiket" }));
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
  });
  it("en az bir filtre doluysa çiplerin sonunda 'Hepsini temizle'; yalnız arama doluysa yok", () => {
    cips({ values: { q: "x" } });
    expect(screen.queryByRole("button", { name: "Hepsini temizle" })).toBeNull();
    const onChange = cips({ values: { state: "ok" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Hepsini temizle" })[0]!);
    expect(onChange).toHaveBeenCalledWith({});
  });
  it("çekmecede (dar) alanlar SelectPanel, boşken Tümü; başlık labels.filter", () => {
    cips({ drawer: [{ title: "Diğer", fields: [{ key: "oncelik", label: "Öncelik", kind: "select", options: ["Düşük"] }] }] });
    fireEvent.click(screen.getByRole("button", { name: /Tüm filtreler/ }));
    const form = document.querySelector("form")!;
    expect(form.querySelectorAll(".tamga-select-panel").length).toBe(4);
    expect(form.querySelector(".tamga-select")).toBeNull();
    /* Panelde alanın adı zaten üstte; tetikte önek yok (0.8.1). */
    expect(screen.getByRole("button", { name: "Öncelik" }).textContent).toBe("Tümü");
    expect(screen.getByRole("dialog", { name: "Filtrele" })).toBeTruthy();
  });
  it("CSS: arama 17.5rem sabit; darda boş çip gizli, dolu çipler yatay kayıyor", () => {
    expect(css).toMatch(/\.tamga-filter-ara-sabit\s*\{[^}]*flex:\s*0 0 17\.5rem/);
    expect(css).toMatch(/@container \(max-width: 39\.9375rem\)\s*\{[^@]*\.tamga-filter-cips \.tamga-filter-cip:not\(\[data-set\]\)\s*\{\s*display:\s*none/);
    expect(css).toMatch(/@container \(max-width: 39\.9375rem\)\s*\{[^@]*\.tamga-filter-cip-sira\s*\{[^}]*overflow-x:\s*auto/);
  });
});

/* 0.8.1 · ilk tüketicinin gerçek sayfasında görülen beş şey: aramanın görünür
   etiketi, "Hepsini temizle"nin satırı, dolu çipin tek nesne olması, panelde
   çifte ad, darda taşma. Görünümler kit sınıfında; tarayıcı ölçümü olc:filtre. */
describe("FilterBar · look=chips · 0.8.1", () => {
  const CIP: FilterField[] = [
    { key: "state", label: "Durum", kind: "select", options: [{ value: "ok", label: "Sağlıklı" }] },
    { key: "oncelik", label: "Öncelik", kind: "select", options: ["Düşük"] },
  ];
  const css = (() => {
    const { existsSync, readFileSync } = require("node:fs") as typeof import("node:fs");
    return readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
  })();
  const kural = (secici: string) => css.match(new RegExp(secici.replace(/[.*+?^${}()|[\]\\>]/g, "\\$&") + "\\s*\\{([^}]*)\\}"))?.[1] ?? "";
  const cips = (props: Partial<Parameters<typeof FilterBar>[0]> = {}) =>
    cubuk({ look: "chips", top: CIP, labels: { ...ETIKETLER, filter: "Filtrele" }, ...props });

  it("1 · aramanın etiketi ekran okuyucuda, gözde değil; kutu çiplerle aynı boy (sm)", () => {
    cips();
    const etiket = document.querySelector(".tamga-filter-ara-sabit .tamga-filter-ara-etiket")!;
    expect(etiket).not.toBeNull();
    expect(etiket.textContent).toBe("Ara");
    expect(kural(".tamga-filter-ara-etiket")).toMatch(/width:\s*1px/);
    expect(document.querySelector(".tamga-filter-ara-sabit input")!.className).toMatch(/tamga-input-sm/);
    expect(kural(".tamga-filter-cips")).toMatch(/align-items:\s*center/);
  });
  it("2 · Hepsini temizle çip sırasının içinde düz bir bağlantı", () => {
    cips({ values: { state: "ok" } });
    const temizle = screen.getByRole("button", { name: "Hepsini temizle" });
    expect(temizle.className).toMatch(/tamga-filter-cip-temizle/);
    expect(temizle.className).not.toMatch(/tamga-btn/);
    expect(temizle.closest(".tamga-filter-cip-sira")).not.toBeNull();
  });
  it("3 · dolu çip tek nesne: kenar ve gölge çipte, tetik ve ✕ kenarsız; ✕ ayrı düğme ve adlı", () => {
    cips({ values: { state: "ok" } });
    const cip = document.querySelector(".tamga-filter-cip[data-set]")!;
    expect(cip.querySelector("button.tamga-filter-cip-x")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Durum filtresini kaldır" })).toBeTruthy();
    expect(kural(".tamga-filter-cip[data-set]")).toMatch(/border:\s*1\.5px solid var\(--color-edge-strong\)/);
    expect(kural(".tamga-filter-cip[data-set]")).toMatch(/box-shadow:\s*3px 3px 0/);
    expect(kural(".tamga-filter-cip[data-set] > .tamga-select-panel > .tamga-select-panel-tetik")).toMatch(/border:\s*0/);
    expect(kural(".tamga-filter-cip[data-set] > .tamga-select-panel > .tamga-select-panel-tetik")).toMatch(/box-shadow:\s*none/);
    expect(kural(".tamga-filter-cip-x")).toMatch(/border:\s*0/);
    expect(kural(".tamga-filter-cip-x")).toMatch(/box-shadow:\s*none/);
  });
  it("4 · dar ekran panelinde önek yok: yalnız değer", () => {
    cips({ values: { state: "ok" } });
    fireEvent.click(screen.getByRole("button", { name: /Tüm filtreler/ }));
    const form = document.querySelector("form")!;
    const tetikler = [...form.querySelectorAll(".tamga-select-panel-tetik")].map((b) => b.textContent);
    expect(tetikler).toEqual(["Sağlıklı", "Tümü"]);
  });
  it("5 · darda çip sırası küçülebiliyor: min-width 0, kartın içinde", () => {
    const dar = css.match(/@container \(max-width: 39\.9375rem\)\s*\{([\s\S]*?)\n  \}/)?.[1] ?? "";
    expect(dar).toMatch(/\.tamga-filter-cip-sira\s*\{[^}]*min-width:\s*0/);
    expect(dar).toMatch(/\.tamga-filter-cip-sira\s*\{[^}]*max-width:\s*100%/);
  });
});

/* PANELİN ARAMASI KENDİ METNİNİ TAŞIR: ana arama kutusunun yer tutucusu ("Ad ya
   da adres ara") aranabilir alanın panelinde çıkıyordu. Sıra: alanın
   searchPlaceholder'ı, yoksa labels.searchIn(label), o da yoksa alanın adı. */
describe("FilterBar · look=chips · panel araması", () => {
  const ALAN: FilterField = { key: "etiket", label: "Etiket", kind: "searchable", options: ["a", "b"] };
  const ac = (props: Partial<Parameters<typeof FilterBar>[0]> = {}) => {
    cubuk({ look: "chips", top: [ALAN], labels: { ...ETIKETLER, search: "Ad ya da adres ara" }, ...props });
    fireEvent.click(screen.getByRole("button", { name: "Etiket" }));
    return screen.getAllByRole("searchbox").find((k) => k.closest(".tamga-select-panel-kutu"))!;
  };
  it("searchPlaceholder verilirse o", () => {
    const kutu = ac({ top: [{ ...ALAN, searchPlaceholder: "Etiket ara" }] });
    expect(kutu.getAttribute("placeholder")).toBe("Etiket ara");
    expect(kutu.getAttribute("aria-label")).toBe("Etiket ara");
  });
  it("yoksa labels.searchIn(label)", () => {
    const kutu = ac({ labels: { ...ETIKETLER, search: "Ad ya da adres ara", searchIn: (l: string) => `${l} içinde ara` } });
    expect(kutu.getAttribute("placeholder")).toBe("Etiket içinde ara");
  });
  it("o da yoksa alanın adı; ana aramanın metni hiçbir panelde yok", () => {
    const kutu = ac();
    expect(kutu.getAttribute("placeholder")).toBe("Etiket");
    expect(document.querySelector('.tamga-select-panel-kutu [placeholder="Ad ya da adres ara"]')).toBeNull();
  });
});


/* 0.9.0 · İKİ İSTEĞE BAĞLI SEÇENEK, varsayılan birebir aynı: `grid` eşit sütunlu
   ızgara (kabın genişliğine göre tek ya da iki satır), `searchableAs="panel"`
   aramalı alanın tetiği kutu görünümlü SelectPanel. İlk test varsayılan satırın
   markup'ını kilitliyor: seçenekleri vermeyen projede hiçbir şey değişmiyor. */
describe("FilterBar · varsayılan satır kilidi", () => {
  it("grid ve searchableAs verilmeyince satır birebir eski", () => {
    const { container } = render(<FilterBar values={{ durum: "Açık" }} onChange={() => {}} top={[{ key: "durum", label: "Durum", kind: "select", options: ["Açık", "Kapalı"] }, { key: "sahip", label: "Sahip", kind: "searchable", options: ["Ada"] }]} drawer={[]} labels={ETIKETLER} />);
    /* useId sayaçla gidiyor, dosyadaki öbür testlerden sonra numara kayıyor: kimlikler eşitleniyor. */
    const kimliksiz = (h: string) => h.replace(/_r_[0-9a-z]+_/g, "ID");
    expect(kimliksiz(container.querySelector(".tamga-filter-row")!.outerHTML)).toBe(kimliksiz("<div class=\"tamga-filter-row\"><label class=\"tamga-filter-ara\"><span class=\"text-small font-bold text-ink-faint\">Ara</span><span class=\"relative flex items-center\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" fill=\"currentColor\" viewBox=\"0 0 256 256\" class=\"shrink-0 pointer-events-none absolute left-2.5 text-ink-faint\" aria-hidden=\"true\"><path d=\"M192,112a80,80,0,1,1-80-80A80,80,0,0,1,192,112Z\" opacity=\"0.2\"></path><path d=\"M229.66,218.34,179.6,168.28a88.21,88.21,0,1,0-11.32,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z\"></path></svg><input data-slot=\"input\" data-leading=\"true\" class=\"tamga-input w-full\" placeholder=\"Ara\" type=\"search\" value=\"\"></span></label><div class=\"tamga-filter-genis tamga-filter-alan tamga-filter-cap\"><span class=\"text-small font-bold text-ink-faint\">Durum</span><div class=\"relative w-full\"><button type=\"button\" class=\"tamga-select justify-between\" data-set=\"true\" aria-haspopup=\"listbox\" aria-expanded=\"false\" aria-label=\"Durum\"><span class=\"min-w-0 flex-1 truncate\">Açık</span><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" fill=\"currentColor\" viewBox=\"0 0 256 256\" class=\"shrink-0 shrink-0 rotate-90\"><path d=\"M176,128,96,208V48Z\" opacity=\"0.2\"></path><path d=\"M181.66,122.34l-80-80A8,8,0,0,0,88,48V208a8,8,0,0,0,13.66,5.66l80-80A8,8,0,0,0,181.66,122.34ZM104,188.69V67.31L164.69,128Z\"></path></svg></button></div></div><div class=\"tamga-filter-genis tamga-filter-alan tamga-filter-cap\"><span class=\"text-small font-bold text-ink-faint\">Sahip</span><div class=\"relative w-full\"><span class=\"relative flex items-center\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" fill=\"currentColor\" viewBox=\"0 0 256 256\" class=\"shrink-0 pointer-events-none absolute left-3 text-ink-faint\"><path d=\"M192,112a80,80,0,1,1-80-80A80,80,0,0,1,192,112Z\" opacity=\"0.2\"></path><path d=\"M229.66,218.34,179.6,168.28a88.21,88.21,0,1,0-11.32,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z\"></path></svg><input role=\"combobox\" aria-expanded=\"false\" aria-controls=\"_r_1_-list\" aria-autocomplete=\"list\" aria-label=\"Sahip\" placeholder=\"Tümü\" class=\"tamga-input w-full pl-9\" type=\"text\" value=\"\"><span class=\"absolute right-1.5 flex items-center gap-0.5\"><button type=\"button\" class=\"tamga-mini-btn\" data-inset=\"true\" aria-label=\"Sahip seç\" aria-expanded=\"false\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" fill=\"currentColor\" viewBox=\"0 0 256 256\" class=\"shrink-0\"><path d=\"M208,96l-80,80L48,96Z\" opacity=\"0.2\"></path><path d=\"M215.39,92.94A8,8,0,0,0,208,88H48a8,8,0,0,0-5.66,13.66l80,80a8,8,0,0,0,11.32,0l80-80A8,8,0,0,0,215.39,92.94ZM128,164.69,67.31,104H188.69Z\"></path></svg></button></span></span></div></div><button data-slot=\"button\" class=\"tamga-btn tamga-filter-dar ml-auto\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" fill=\"currentColor\" viewBox=\"0 0 256 256\" class=\"shrink-0\"><path d=\"M128,80a24,24,0,1,1-24-24A24,24,0,0,1,128,80Zm40,72a24,24,0,1,0,24,24A24,24,0,0,0,168,152Z\" opacity=\"0.2\"></path><path d=\"M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z\"></path></svg><span class=\"tamga-filter-genis\">Tüm filtreler</span><span class=\"tamga-filter-dar\">Tüm filtreler · 1</span></button></div>"));
  });
});

describe("FilterBar · grid (0.9.0)", () => {
  const ALTI: FilterField[] = [
    { key: "durum", label: "Durum", kind: "select", options: ["Açık"] },
    { key: "oncelik", label: "Öncelik", kind: "select", options: ["Düşük"] },
    { key: "sahip", label: "Sahip", kind: "searchable", options: ["Ada"] },
    { key: "kanal", label: "Kanal", kind: "select", options: ["Web"] },
    { key: "etiket", label: "Etiket", kind: "multi", options: ["x"] },
    { key: "kod", label: "Kod", kind: "text" },
  ];
  const css = (() => {
    const { existsSync, readFileSync } = require("node:fs") as typeof import("node:fs");
    return readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
  })();
  it("satır ızgara sınıfı ve alan sayısını taşıyor; iki satırlık sütun sayısı ceil((N+2)/2)", () => {
    cubuk({ grid: true, top: ALTI });
    const satir = document.querySelector(".tamga-filter-row") as HTMLElement;
    expect(satir.classList.contains("tamga-filter-izgara")).toBe(true);
    expect(satir.getAttribute("data-alan")).toBe("6");
    expect(satir.style.getPropertyValue("--filter-sutun")).toBe("4");
    expect(satir.hasAttribute("data-kuyruk")).toBe(false);
    expect(satir.className).not.toMatch(/(^|\s)(grid|flex|hidden)(\s|$)/);
  });
  it("tarih aralığı iki birim; çekmece ya da extra varsa kuyruk sütunu", () => {
    cubuk({ grid: true, top: [ALTI[0]!, { key: "tarih", label: "Tarih", kind: "dateRange" }], drawer: [{ title: "D", fields: [ALTI[5]!] }] });
    const satir = document.querySelector(".tamga-filter-row") as HTMLElement;
    expect(satir.getAttribute("data-alan")).toBe("3");
    expect(satir.style.getPropertyValue("--filter-sutun")).toBe("3");
    expect(satir.hasAttribute("data-kuyruk")).toBe(true);
  });
  it("CSS: geniş kapta ızgara, arama iki sütun; 6 alan için tek satır eşiği 1204px, kuyrukla 1360px; cap kalkıyor", () => {
    const genis = css.match(/@container \(min-width: 40rem\)\s*\{([\s\S]*?)\n  \}/g)!.join("\n");
    expect(genis).toMatch(/\.tamga-filter-row\.tamga-filter-izgara\s*\{[^}]*display:\s*grid/);
    expect(genis).toMatch(/\.tamga-filter-row\.tamga-filter-izgara\s*\{[^}]*grid-template-columns:\s*repeat\(var\(--filter-sutun\), minmax\(0, 1fr\)\)/);
    expect(genis).toMatch(/\.tamga-filter-izgara > \.tamga-filter-ara\s*\{[^}]*grid-column:\s*span 2/);
    expect(genis).toMatch(/\.tamga-filter-row\.tamga-filter-izgara > \.tamga-filter-cap\s*\{[^}]*max-width:\s*none/);
    expect(css).toMatch(/@container \(min-width: 1204px\)\s*\{\s*\.tamga-filter-row\.tamga-filter-izgara\[data-alan="6"\]:not\(\[data-kuyruk\]\)\s*\{\s*grid-template-columns:\s*16rem repeat\(6, minmax\(0, 1fr\)\)/);
    expect(css).toMatch(/@container \(min-width: 1360px\)\s*\{\s*\.tamga-filter-row\.tamga-filter-izgara\[data-alan="6"\]\[data-kuyruk\]\s*\{\s*grid-template-columns:\s*16rem repeat\(6, minmax\(0, 1fr\)\) auto/);
  });
  it("uzun değer kutuda kesilir, tam metin title'da", () => {
    cubuk({ grid: true, top: [ALTI[0]!], values: { durum: "Açık" } });
    expect(screen.getByRole("button", { name: "Durum" }).getAttribute("title")).toBe("Açık");
  });
});

describe("FilterBar · searchableAs (0.9.0)", () => {
  const ALAN: FilterField = { key: "sahip", label: "Sahip", kind: "searchable", panelTitle: "Sahip seçin", options: ["Ada", "Baran"] };
  it("varsayılan combobox: metin kutusu", () => {
    cubuk({ top: [ALAN] });
    expect(screen.getByRole("combobox", { name: "Sahip" }).tagName).toBe("INPUT");
    expect(document.querySelector(".tamga-select-panel")).toBeNull();
  });
  it("panel: kutu görünümlü SelectPanel; adı alanın adı; başlık, arama metni, ilk seçenek Tümü; üstte ve çekmecede", () => {
    const onChange = cubuk({ searchableAs: "panel", top: [ALAN], drawer: [{ title: "D", fields: [{ ...ALAN, key: "sahip2", label: "Sahip 2", panelTitle: undefined, searchPlaceholder: "Kişi ara" }] }], labels: { ...ETIKETLER, searchIn: (l: string) => `${l} ara` } });
    const tetik = screen.getByRole("button", { name: "Sahip" });
    expect(tetik.className).toMatch(/tamga-select\b/);
    expect(tetik.className).not.toMatch(/tamga-btn/);
    expect(tetik.textContent).toBe("Tümü");
    expect(tetik.querySelector("svg")).not.toBeNull();
    fireEvent.click(tetik);
    expect(screen.getByText("Sahip seçin")).toBeTruthy();
    expect(screen.getAllByRole("searchbox").find((k) => k.closest(".tamga-select-panel-kutu"))!.getAttribute("placeholder")).toBe("Sahip ara");
    expect(screen.getAllByRole("option")[0]!.textContent).toBe("Tümü");
    fireEvent.click(screen.getByRole("option", { name: "Baran" }));
    expect(onChange).toHaveBeenCalledWith({ sahip: "Baran" });
    fireEvent.click(screen.getByRole("button", { name: /Tüm filtreler/ }));
    /* Çekmecede üst alanın dar kopyası da var; ikinci alan adıyla bulunuyor. */
    const ikinci = screen.getAllByRole("button", { name: "Sahip 2" })[0]!;
    expect(ikinci.className).toMatch(/tamga-select\b/);
    fireEvent.click(ikinci);
    expect(screen.getAllByRole("searchbox").find((k) => k.closest(".tamga-select-panel-kutu"))!.getAttribute("placeholder")).toBe("Kişi ara");
  });
});
