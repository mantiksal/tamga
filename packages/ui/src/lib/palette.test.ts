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

  /* BUGÜNKÜ PALETİ YENİDEN ÜRETİYOR. Elle seçilmiş aksan #2069c9 ve kaynaktaki
     yorum "beyaz mürekkep 5.22:1" diyor. Üretici aynı markadan aynı ölçüyü
     buluyorsa, elle yapılan iş ile aritmetik aynı şeyi söylüyor demektir. */
  it("elle seçilmiş mavi paletin ölçüsünü yeniden üretiyor", () => {
    const { light } = makePalette("#2069c9");
    expect(contrast(light.accent, light.accentInk)).toBeCloseTo(5.22, 1);
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

  /* NÖTRLER MARKANIN TONUNU TAŞIYOR: mor bir markanın grisi mor grisi.
   *
   * Ton AİLESİ denetleniyor, açı değil. Doyum bilerek çok düşük (0.006) ve o
   * kadar düşük bir renkte 8 bitlik hex nicelemesi tonu birkaç derece
   * kaydırıyor — mor zemin 293°'den 286°'ye düşüyor. Sıkı bir açı testi bu
   * yüzden yanlış yerde kırılırdı: ölçülmesi gereken şey "gri kaldı mı" ve
   * "markanın ailesinde mi". */
  it("zemin markanın tonunu alıyor, grisi kalarak", () => {
    const mor = makePalette("#7c3aed").light;
    const yesil = makePalette("#0a7a5f").light;
    expect(mor.page).not.toBe(yesil.page);
    expect(Math.abs(hexToOklch(mor.page).h - hexToOklch("#7c3aed").h)).toBeLessThan(15);
    expect(hexToOklch(mor.page).c).toBeLessThan(0.02);
  });
});
