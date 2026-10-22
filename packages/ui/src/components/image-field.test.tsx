import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";

vi.mock("../lib/image.js", async (orig) => {
  const m = await orig<typeof import("../lib/image.js")>();
  return { ...m, prepareImage: vi.fn(async () => "data:image/png;base64,AAA") };
});
import { ImageField } from "./appearance.js";
import { prepareImage } from "../lib/image.js";

/**
 * SUNUCUYA YÜKLEME YOLU. `onUpload` verilince alan dosyayı çağırana verir ve
 * durumları taşır: bekleme, hata (metin çağırandan), açık "sus" değeri.
 * Verilmezse senkron data-URL yolu birebir; ilk test onu kilitliyor.
 */
const ETIKET = {
  name: "Logo", upload: "Yükle", replace: "Değiştir", remove: "Kaldır", empty: "Henüz yok",
  errorType: "Desteklenmeyen tür", errorSize: "Çok büyük", errorUnreadable: "Okunamadı", errorUpload: "Yüklenemedi",
  uploading: "Yükleniyor…", removing: "Kaldırılıyor…", uploaded: "Yüklendi", removed: "Kaldırıldı",
  confirm: "Gönder", cancel: "Vazgeç",
};
const dosya = (ad = "a.png", tur = "image/png", boyut = 1000) => new File([new Uint8Array(boyut)], ad, { type: tur });
const girdi = () => document.querySelector('input[type="file"]') as HTMLInputElement;
const sec = (f: File) => {
  Object.defineProperty(girdi(), "files", { value: [f], configurable: true });
  fireEvent.change(girdi());
};
const bekle = () => act(() => new Promise((r) => setTimeout(r, 0)));
/* Onay satırı `p[role=status]`: `Alert` da `role="status"` taşıyor, rol tek başına ayırmıyor. */
const onay = () => document.querySelector('p[role="status"]');
const uyari = () => document.querySelector(".tamga-alert");
const onizleme = (src: string) => document.querySelector(`[data-src="${src}"]`);
const goster = (s: string) => <img alt="" src={s} data-src={s} />;
/** Çözümü elde tutulan bir yükleme: test ne zaman biteceğine kendisi karar veriyor. */
const askida = <T,>() => {
  let coz!: (v: T) => void;
  let reddet!: (e: unknown) => void;
  const soz = new Promise<T>((ok, hayir) => { coz = ok; reddet = hayir; });
  return { soz, coz, reddet };
};

describe("ImageField", () => {
  const olustur = vi.fn(() => "blob:önizleme");
  const birak = vi.fn();
  beforeEach(() => {
    (URL as unknown as { createObjectURL: unknown }).createObjectURL = olustur;
    (URL as unknown as { revokeObjectURL: unknown }).revokeObjectURL = birak;
    olustur.mockClear(); birak.mockClear(); vi.mocked(prepareImage).mockClear();
  });
  afterEach(() => vi.restoreAllMocks());

  describe("senkron yol", () => {
    it("onUpload yokken data-URL onChange'e gidiyor, markup eski", async () => {
      const onChange = vi.fn();
      const { container } = render(<ImageField value={null} onChange={onChange} maxEdge={256} labels={ETIKET} preview={(s) => <img alt="" src={s} />} />);
      expect(container.innerHTML).toBe(
        '<div class="flex flex-col gap-3"><input id="_r_0_" accept="image/png,image/jpeg,image/svg+xml,image/webp" class="sr-only" type="file"><div class="flex flex-wrap items-center gap-4"><span class="tamga-image-field" data-empty="true">Henüz yok</span><span class="flex flex-wrap items-center gap-2"><button data-slot="button" class="tamga-btn" type="button">Yükle</button></span></div></div>',
      );
      sec(dosya());
      await bekle();
      expect(onChange).toHaveBeenCalledWith("data:image/png;base64,AAA");
    });

    it("accept ve maxBytes bu yolda da sayılıyor: dosya prepareImage'a hiç gitmiyor (F4)", () => {
      render(<ImageField value={null} onChange={vi.fn()} maxEdge={256} labels={ETIKET} preview={goster} accept="image/png" maxBytes={500} />);
      sec(dosya("a.gif", "image/gif"));
      expect(screen.getByText("Desteklenmeyen tür")).toBeTruthy();
      sec(dosya("b.png", "image/png", 600));
      expect(screen.getByText("Çok büyük")).toBeTruthy();
      expect(prepareImage).not.toHaveBeenCalled();
    });
  });

  describe("yükleme", () => {
    it("hemen yükle: dosya çağırana gider, dönen adres onChange'e, onay satırı doluyor", async () => {
      const onUpload = vi.fn(async () => "https://cdn.test/logo.png");
      const onChange = vi.fn();
      render(<ImageField value={null} onChange={onChange} labels={ETIKET} preview={goster} onUpload={onUpload} />);
      sec(dosya());
      expect(onUpload).toHaveBeenCalledTimes(1);
      expect(onUpload.mock.calls[0]![0]).toBeInstanceOf(File);
      expect(screen.getByRole("button", { name: "Yükleniyor…" })).toBeDisabled();
      await bekle();
      expect(onChange).toHaveBeenCalledWith("https://cdn.test/logo.png");
      expect(onay()?.textContent).toBe("Yüklendi");
    });

    it("onay kabı hep DOM'da: metinsiz de duruyor, metin gelince dolan bir canlı bölge (F7)", async () => {
      render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={async () => "x"} />);
      expect(onay()).not.toBeNull();
      expect(onay()?.textContent).toBe("");
      sec(dosya());
      await bekle();
      expect(onay()?.textContent).toBe("Yüklendi");
    });

    it("onayla: önizle → Gönder/Vazgeç; Vazgeç önizlemeyi bırakıyor (revoke)", async () => {
      const onUpload = vi.fn(async () => "https://cdn.test/logo.png");
      render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={onUpload} confirm />);
      sec(dosya());
      expect(onUpload).not.toHaveBeenCalled();
      expect(olustur).toHaveBeenCalledTimes(1);
      expect(onizleme("blob:önizleme")).not.toBeNull();
      fireEvent.click(screen.getByRole("button", { name: "Vazgeç" }));
      expect(birak).toHaveBeenCalledWith("blob:önizleme");
      expect(document.querySelector("[data-src]")).toBeNull();
      sec(dosya());
      fireEvent.click(screen.getByRole("button", { name: "Gönder" }));
      expect(onUpload).toHaveBeenCalledTimes(1);
    });

    it("girdi her seçimde sıfırlanıyor: aynı dosya ikinci kez seçilebilsin", () => {
      const ayar = vi.spyOn(HTMLInputElement.prototype, "value", "set");
      render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={async () => false} confirm />);
      sec(dosya());
      expect(ayar).toHaveBeenCalledWith("");
    });

    it("ön denetim: tür ve boyut çağırana gitmeden yakalanıyor, metin labels'tan", () => {
      const onUpload = vi.fn(async () => "x");
      render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={onUpload} accept="image/png" maxBytes={500} />);
      sec(dosya("a.gif", "image/gif"));
      expect(screen.getByText("Desteklenmeyen tür")).toBeTruthy();
      sec(dosya("b.png", "image/png", 600));
      expect(screen.getByText("Çok büyük")).toBeTruthy();
      expect(onUpload).not.toHaveBeenCalled();
    });
  });

  describe("hata", () => {
    it("metinle red: alanın altında, dosya ve önizleme yerinde, Gönder yeniden deniyor", async () => {
      const onUpload = vi.fn(async () => { throw "Sunucu cevap vermedi (500)"; });
      render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={onUpload} />);
      sec(dosya());
      await bekle();
      expect(screen.getByText("Sunucu cevap vermedi (500)")).toBeTruthy();
      expect(onizleme("blob:önizleme")).not.toBeNull();
      expect(onay()?.textContent).toBe("");
      fireEvent.click(screen.getByRole("button", { name: "Gönder" }));
      expect(onUpload).toHaveBeenCalledTimes(2);
    });

    it("Error ve { message } ile red: mesaj olduğu gibi; boş ya da mesajsız red errorUpload (F5)", async () => {
      const { unmount } = render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={async () => { throw new Error("Kota doldu"); }} />);
      sec(dosya()); await bekle();
      expect(screen.getByText("Kota doldu")).toBeTruthy();
      unmount();
      const { unmount: u2 } = render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={async () => { throw { message: "Nesne mesajı" }; }} />);
      sec(dosya()); await bekle();
      expect(screen.getByText("Nesne mesajı")).toBeTruthy();
      u2();
      const { unmount: u3 } = render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={async () => { throw ""; }} />);
      sec(dosya()); await bekle();
      expect(screen.getByText("Yüklenemedi")).toBeTruthy();
      u3();
      render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={async () => { throw undefined; }} />);
      sec(dosya()); await bekle();
      expect(screen.getByText("Yüklenemedi")).toBeTruthy();
    });

    it("errorUpload yoksa errorUnreadable'a düşüyor", async () => {
      const { errorUpload: _, ...eski } = ETIKET;
      render(<ImageField value={null} onChange={vi.fn()} labels={eski} preview={goster} onUpload={async () => { throw ""; }} />);
      sec(dosya()); await bekle();
      expect(screen.getByText("Okunamadı")).toBeTruthy();
    });
  });

  describe("çağıran ele aldı (F3)", () => {
    it("onUpload false ile çözülünce kit susuyor: ne hata ne onay; dosya kalıyor", async () => {
      const onChange = vi.fn();
      render(<ImageField value={null} onChange={onChange} labels={ETIKET} preview={goster} onUpload={async () => false} />);
      sec(dosya());
      await bekle();
      expect(onay()?.textContent).toBe("");
      expect(uyari()).toBeNull();
      expect(onChange).not.toHaveBeenCalled();
      expect(onizleme("blob:önizleme")).not.toBeNull();
    });

    it("onUpload ne adres ne false dönerse: geliştirme uyarısı, 'yüklendi' DENMİYOR", async () => {
      const uyar = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={(async () => { /* return unutuldu */ }) as unknown as () => Promise<string | false>} />);
      sec(dosya());
      await bekle();
      expect(onay()?.textContent).toBe("");
      expect(uyar).toHaveBeenCalledTimes(1);
      expect(String(uyar.mock.calls[0]![0])).toMatch(/onUpload/);
    });

    it("onRemove false ile çözülünce kit susuyor: onChange(null) yok, onay yok", async () => {
      const onChange = vi.fn();
      render(<ImageField value="https://cdn.test/eski.png" onChange={onChange} labels={ETIKET} preview={goster} onUpload={async () => "x"} onRemove={async () => false} />);
      fireEvent.click(screen.getByRole("button", { name: "Kaldır" }));
      await bekle();
      expect(onChange).not.toHaveBeenCalled();
      expect(onay()?.textContent).toBe("");
      expect(uyari()).toBeNull();
    });
  });

  describe("kaldırma", () => {
    it("onRemove bekleniyor, bitince onChange(null) ve onay", async () => {
      const onRemove = vi.fn(async () => undefined);
      const onChange = vi.fn();
      render(<ImageField value="https://cdn.test/eski.png" onChange={onChange} labels={ETIKET} preview={goster} onUpload={async () => "x"} onRemove={onRemove} />);
      fireEvent.click(screen.getByRole("button", { name: "Kaldır" }));
      expect(screen.getByRole("button", { name: "Kaldırılıyor…" })).toBeDisabled();
      await bekle();
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(null);
      expect(onay()?.textContent).toBe("Kaldırıldı");
    });

    it("onRemove reddi: metin alanın altında, değer yerinde", async () => {
      const onChange = vi.fn();
      render(<ImageField value="https://cdn.test/eski.png" onChange={onChange} labels={ETIKET} preview={goster} onUpload={async () => "x"} onRemove={async () => { throw "Silinemedi"; }} />);
      fireEvent.click(screen.getByRole("button", { name: "Kaldır" }));
      await bekle();
      expect(screen.getByText("Silinemedi")).toBeTruthy();
      expect(onChange).not.toHaveBeenCalled();
      expect(onizleme("https://cdn.test/eski.png")).not.toBeNull();
    });

    it("kaldırma sürerken Değiştir de kapalı (F2)", async () => {
      const { soz, coz } = askida<void>();
      render(<ImageField value="https://cdn.test/eski.png" onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={async () => "x"} onRemove={() => soz} />);
      fireEvent.click(screen.getByRole("button", { name: "Kaldır" }));
      expect(screen.getByRole("button", { name: "Değiştir" })).toBeDisabled();
      expect(girdi()).toBeDisabled();
      coz(); await bekle();
    });
  });

  describe("kilit (F1 · F6)", () => {
    it("düğmeler ve girdi kapalı; gerekçe görünür metin ve aria-describedby; title yok", () => {
      render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={async () => "x"} disabled lockedNote="Logo yalnız Pro planda." />);
      const b = screen.getByRole("button", { name: "Yükle" });
      expect(b).toBeDisabled();
      expect(b).not.toHaveAttribute("title");
      expect(girdi()).toBeDisabled();
      const not = screen.getByText("Logo yalnız Pro planda.");
      expect(not).toBeVisible();
      expect(not.id).toBeTruthy();
      expect(b.getAttribute("aria-describedby")).toBe(not.id);
    });

    it("kilitliyken girdiden gelen seçim yok sayılıyor: onUpload çağrılmıyor", () => {
      const onUpload = vi.fn(async () => "x");
      render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={onUpload} disabled />);
      sec(dosya());
      expect(onUpload).not.toHaveBeenCalled();
      expect(olustur).not.toHaveBeenCalled();
    });

    it("yükleme sürerken ikinci seçim yok sayılıyor: tek onUpload, tek önizleme", async () => {
      const { soz, coz } = askida<string>();
      const onUpload = vi.fn(() => soz);
      render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={onUpload} />);
      sec(dosya());
      sec(dosya("b.png"));
      expect(onUpload).toHaveBeenCalledTimes(1);
      expect(olustur).toHaveBeenCalledTimes(1);
      expect(birak).not.toHaveBeenCalled();
      coz("x"); await bekle();
    });
  });

  describe("çağıranın kendi güncellemesi bayat değil (3)", () => {
    it("onUpload içinde value sonuçla güncellenirse yine 'yüklendi' deniyor", async () => {
      function Sahip() {
        const [v, setV] = useState<string | null>(null);
        const onUpload = async () => { setV("https://cdn.test/yeni.png"); return "https://cdn.test/yeni.png"; };
        return <ImageField value={v} onChange={setV} labels={ETIKET} preview={goster} onUpload={onUpload} />;
      }
      render(<Sahip />);
      sec(dosya());
      await bekle();
      expect(onay()?.textContent).toBe("Yüklendi");
      expect(onizleme("https://cdn.test/yeni.png")).not.toBeNull();
    });
    it("onRemove içinde value null yapılırsa yine 'kaldırıldı' deniyor", async () => {
      function Sahip() {
        const [v, setV] = useState<string | null>("https://cdn.test/eski.png");
        return <ImageField value={v} onChange={setV} labels={ETIKET} preview={goster} onUpload={async () => "x"} onRemove={async () => { setV(null); }} />;
      }
      render(<Sahip />);
      fireEvent.click(screen.getByRole("button", { name: "Kaldır" }));
      await bekle();
      expect(onay()?.textContent).toBe("Kaldırıldı");
    });
  });

  describe("duyuru bölgeleri (4 · 5)", () => {
    it("hata bölgesi hep DOM'da (role=alert), metin gelince doluyor", async () => {
      render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={async () => { throw "Olmadı"; }} />);
      const bolge = document.querySelector('[role="alert"]');
      expect(bolge).not.toBeNull();
      expect(bolge?.textContent).toBe("");
      sec(dosya()); await bekle();
      expect(document.querySelector('[role="alert"]')).toBe(bolge);
      expect(bolge?.textContent).toContain("Olmadı");
    });
    it("yalnız onRemove verilince de onay kabı var: 'kaldırıldı' kaybolmuyor", async () => {
      render(<ImageField value="https://cdn.test/eski.png" onChange={vi.fn()} maxEdge={256} labels={ETIKET} preview={goster} onRemove={async () => undefined} />);
      expect(onay()).not.toBeNull();
      fireEvent.click(screen.getByRole("button", { name: "Kaldır" }));
      await bekle();
      expect(onay()?.textContent).toBe("Kaldırıldı");
    });
  });

  describe("boş dosya ve boş durum (6 · 7)", () => {
    it("0 bayt iki yolda da errorUnreadable; ne prepareImage ne onUpload çağrılıyor", () => {
      const onUpload = vi.fn(async () => "x");
      const a = render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={onUpload} />);
      sec(dosya("bos.png", "image/png", 0));
      expect(screen.getByText("Okunamadı")).toBeTruthy();
      expect(onUpload).not.toHaveBeenCalled();
      a.unmount();
      render(<ImageField value={null} onChange={vi.fn()} maxEdge={256} labels={ETIKET} preview={goster} />);
      sec(dosya("bos.png", "image/png", 0));
      expect(screen.getByText("Okunamadı")).toBeTruthy();
      expect(prepareImage).not.toHaveBeenCalled();
    });
    it("labels.empty bir ReactNode olabiliyor", () => {
      render(<ImageField value={null} onChange={vi.fn()} maxEdge={256} labels={{ ...ETIKET, empty: <em data-bos>Henüz yok</em> }} preview={goster} />);
      expect(document.querySelector("em[data-bos]")).not.toBeNull();
    });
  });

  describe("bayat sonuç (F9)", () => {
    it("bileşen kalkınca gelen sonuç onChange'e gitmiyor; önizleme bırakılıyor", async () => {
      const { soz, coz } = askida<string>();
      const onChange = vi.fn();
      const { unmount } = render(<ImageField value={null} onChange={onChange} labels={ETIKET} preview={goster} onUpload={() => soz} />);
      sec(dosya());
      unmount();
      expect(birak).toHaveBeenCalledWith("blob:önizleme");
      coz("https://cdn.test/gec.png"); await bekle();
      expect(onChange).not.toHaveBeenCalled();
    });

    it("yükleme sürerken value dışarıdan değişirse gelen sonuç dış değerin üstüne yazmıyor", async () => {
      const { soz, coz } = askida<string>();
      const onChange = vi.fn();
      const { rerender } = render(<ImageField value={null} onChange={onChange} labels={ETIKET} preview={goster} onUpload={() => soz} />);
      sec(dosya());
      rerender(<ImageField value="https://cdn.test/disaridan.png" onChange={onChange} labels={ETIKET} preview={goster} onUpload={() => soz} />);
      coz("https://cdn.test/gec.png"); await bekle();
      expect(onChange).not.toHaveBeenCalled();
      expect(onay()?.textContent).toBe("");
    });

    it("bekleyen önizleme varken value dışarıdan değişirse önizleme bırakılıyor, yeni değer gösteriliyor", () => {
      const { rerender } = render(<ImageField value={null} onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={async () => false} confirm />);
      sec(dosya());
      expect(onizleme("blob:önizleme")).not.toBeNull();
      rerender(<ImageField value="https://cdn.test/disaridan.png" onChange={vi.fn()} labels={ETIKET} preview={goster} onUpload={async () => false} confirm />);
      expect(birak).toHaveBeenCalledWith("blob:önizleme");
      expect(onizleme("https://cdn.test/disaridan.png")).not.toBeNull();
      expect(onizleme("blob:önizleme")).toBeNull();
    });
  });
});
