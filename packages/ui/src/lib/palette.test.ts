import { describe, expect, it } from "vitest";
import { contrast, hexToOklch } from "./color.js";
import { makePalette, measurePalette } from "./palette.js";

/**
 * Palet üreticisinin sözleşmesi.
 *
 * Üreticinin işi "makul renk üretmek" değil, ÖLÇÜLEBİLİR bir sözleşmeyi
 * tutturmak: her ton, iki temada, on bir ölçümün hepsinden geçecek. Test bu
 * yüzden bir görsel yargı değil bir eşik denetimi.
 */

const TONLAR = {
  mavi: "#2069c9",
  mor: "#7c3aed",
  pembe: "#d6336c",
  yesil: "#0a7a5f",
  turuncu: "#ea580c",
  sari: "#eab308",
  kirmizi: "#dc2626",
  turkuaz: "#0891b2",
  lacivert: "#1e3a8a",
  gri: "#64748b",
};

describe("makePalette", () => {
  for (const [ad, hex] of Object.entries(TONLAR)) {
    it(`${ad}: iki temada da bütün eşikleri geçiyor`, () => {
      const { light, dark } = makePalette(hex);
      for (const [tema, p] of [["acik", light], ["koyu", dark]] as const) {
        for (const o of measurePalette(p)) {
          expect(o.passed, `${tema} · ${o.name} = ${o.value}, eşik ${o.threshold}`).toBe(true);
        }
      }
    });
  }

  /* Sayıyla duruyor: sessizce 4.5'in altına düşmesi mümkün. */
  it("varsayılan markanın mürekkep kontrastını yeniden üretiyor", () => {
    const { light } = makePalette("#1e4fd8");
    expect(contrast(light.accent, light.accentInk)).toBeCloseTo(6.58, 1);
  });

  /* MARKA TANINIR KALIYOR. İlk hâli sarıyı beyaz mürekkep geçene kadar
     koyulaştırıp #8f6c00 yapıyordu: ölçüm geçiyor, marka gidiyor. */
  it("açık tonlarda yüzü koyulaştırmıyor, mürekkebi çeviriyor", () => {
    const { light } = makePalette("#eab308");
    expect(hexToOklch(light.accent).l).toBeGreaterThan(0.72);
    expect(light.accentInk).toBe(light.ink);
  });

  it("koyu tonlarda beyaz mürekkep kalıyor", () => {
    const { light } = makePalette("#1e3a8a");
    expect(light.accentInk).toBe(light.shell);
  });

  /* GEÇERSİZ GİRDİ SESSİZ KALMIYOR. Önce `NaN` üretip griye düşüyordu ve
     panel, hex yazılırken ara adımlarda griye dönüyordu. */
  it("geçersiz kodda fırlatıyor", () => {
    for (const kotu of ["#zz", "#7", "", "mor", "#12345"]) {
      expect(() => makePalette(kotu)).toThrow();
    }
  });

  it("kısa biçimi ve boşluğu kabul ediyor", () => {
    expect(() => makePalette("#abc")).not.toThrow();
    expect(() => makePalette(" #7c3aed ")).not.toThrow();
  });

  /* ÜÇ KADEME: TAM · KISITLI · SABİT. Aşağıdaki dördü o kademeleri tutuyor; biri
     düşerse kademe kaymış demektir, ve kayma gözle zor fark ediliyor.
     Gerekçe: docs/09-testler-ve-degismezler.md */

  it("TAM kademe: mürekkep ve buton kenarı markanın tonunu alıyor", () => {
    const kirmizi = makePalette("#e02938").light;
    const yesil = makePalette("#0a7a5f").light;
    for (const rol of ["ink", "edgeStrong"] as const) {
      expect(kirmizi[rol], rol).not.toBe(yesil[rol]);
      /* Ton markaya yakın · gri bir mürekkep bu kademenin başarısızlığı. */
      expect(hexToOklch(kirmizi[rol]).c, rol).toBeGreaterThan(0.03);
    }
  });

  it("KISITLI kademe: ara mürekkepler markayı hissettiriyor ama gri kalıyor", () => {
    const kirmizi = makePalette("#e02938").light;
    const yesil = makePalette("#0a7a5f").light;
    for (const rol of ["inkFaint", "edge", "edgeHover"] as const) {
      expect(kirmizi[rol], rol).not.toBe(yesil[rol]);
      /* Tavan 0.022 · bir gri, tonlanmış bile olsa gri kalmalı. */
      expect(hexToOklch(kirmizi[rol]).c, rol).toBeLessThanOrEqual(0.023);
    }
  });

  it("açık yüzeyler markadan ton alıyor, parlaklığı değişmiyor", () => {
    const mavi = makePalette("#1e4fd8").light;
    const yesil = makePalette("#0a7a5f").light;
    for (const rol of ["page", "shell", "rail", "band", "sunk", "hover", "line", "div"] as const) {
      /* Kâğıtlar bir zamanlar her markada AYNIYDI; koyu tema markanın tonunda nefes alırken
         açık tema almıyordu. */
      expect(mavi[rol], rol).not.toBe(yesil[rol]);
      /* Değişen yalnız ton: aynı basamak iki markada da aynı parlaklıkta kalıyor, göz
         konforunu veren o. */
      expect(hexToOklch(mavi[rol]).l, rol).toBeCloseTo(hexToOklch(yesil[rol]).l, 2);
      /* Yüzey hâlâ bir gri: tonlanmış ama renk değil. */
      expect(hexToOklch(mavi[rol]).c, rol).toBeLessThanOrEqual(0.023);
    }
  });

  it("sıcak marka kâğıdı kirletmiyor: kırmızı krem bandında kalıyor", () => {
    /* Muhafız açık nötrlerde duruyor (`b.l > 0.7`): kırmızı ya da turuncu bir markada yüzey
       markanın tonuna gitseydi kâğıt kirli görünürdü, 78'e kaçıyor. */
    const kirmizi = makePalette("#e02938").light;
    for (const rol of ["page", "shell", "rail", "sunk", "line", "div"] as const) {
      expect(hexToOklch(kirmizi[rol]).h, rol).toBeGreaterThan(60);
      expect(hexToOklch(kirmizi[rol]).h, rol).toBeLessThan(110);
    }
  });

  /* TASARIMIN ÜRETİCİSİYLE BİREBİR. Sayılar `docs/ozel/tasarim-dili/palette.js`
     koşturularak alındı, elle yazılmadı · formül oradan port edildiği için bu
     test iki uygulamanın aynı kaldığını söylüyor. Referans mavinin kendisi
     dışarıda: orada tasarım hex'i aynen döndürüyor, buradaki formülü koşturuyor
     ve OKLCH yuvarlaması 1-2 birim sapıyor (palette.ts'te yazılı). */
  it("tasarımın üreticisiyle aynı çıktıyı veriyor", () => {
    const k = makePalette("#e02938").light;
    expect(k.ink).toBe("#381110");
    expect(k.inkFaint).toBe("#645352");
    expect(k.edge).toBe("#cdc8c0");
    expect(k.edgeHover).toBe("#a59291");
    expect(k.edgeStrong).toBe("#381110");

    const kahve = makePalette("#8B5E2B").light;
    expect(kahve.ink).toBe("#281d12");
    expect(kahve.inkFaint).toBe("#60564d");
    expect(kahve.edge).toBe("#cac8c5");

    /* SEÇİLİ ZEMİN · sıcak markada muhafız devreye giriyor ve doygunluğu
       kısıyor. Elle bir formülle üretilirken şeftali (#f5e3d2) çıkıyordu,
       tasarımın üreticisi nötr bej (#ebe7e1) veriyor · fark gözle bakınca
       "seçili kart neden pembe" diye okunuyordu. */
    expect(kahve.accentBg).toBe("#ebe7e1");
    expect(makePalette("#e02938").light.accentBg).toBe("#f0e6d8");
  });

  /* RENK KUTUSUNUN ÇENTİĞİ: kutular HAM rengi gösteriyor, çentik de o rengin
     kendi mürekkebini · token'la çizilince koyu temada 1.4 kontrasta düşüyordu.
     Eşik metin değil işaret eşiği (3.0).
     Gerekçe: docs/09-testler-ve-degismezler.md */
  it("bir rengin mürekkebi o rengin HAM hâlinin üstünde okunuyor", () => {
    const kutular = [
      "#e02938", // kırmızı
      "#ff7024", // turuncu
      "#0a7a5f", // yeşil
      "#2069c9", // mavi
      "#7c3aed", // mor
      "#3f4756", // antrasit · kusurun çıktığı renk
      "#f5e050", // açık sarı · mürekkebin koyuya döndüğü uç
      "#ffffff", // beyaz · öteki uç
      "#000000",
    ];
    for (const hex of kutular) {
      const murekkep = makePalette(hex).light.accentInk;
      expect(contrast(murekkep, hex), `${hex} üstünde ${murekkep}`).toBeGreaterThanOrEqual(3);
    }
  });
});
