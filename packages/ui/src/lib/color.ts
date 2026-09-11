/**
 * Renk matematiği: sRGB · OKLab · WCAG oranı · CIE L*.
 *
 * Bir bağımlılık değil çünkü ihtiyaç küçük ve KAPI'ya bağlı: paletin doğru
 * olup olmadığını `check-token-contrast` ölçüyor, ve ölçenle üretenin aynı
 * aritmetiği kullanması gerekiyor. `lib/color.test.ts` ikisinin aynı sayıyı
 * verdiğini kanıtlıyor.
 *
 * NEDEN OKLCH. Palet "aynı açıklıkta, başka renk" üretmek zorunda: mor bir
 * markanın zemini ile mavi bir markanın zemini AYNI açıklıkta olmalı, yoksa
 * biri ötekinden koyu görünür ve kontrast eşikleri kayar. HSL bunu yapamıyor
 * (HSL'de %50 sarı ile %50 mavi bambaşka parlaklıkta); OKLab algısal olarak
 * düzgün, yani L sabit tutulduğunda açıklık gerçekten sabit kalıyor.
 */

export type Oklch = { l: number; c: number; h: number };

const srgbDoğrusal = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const doğrusalSrgb = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);

/** `#abc` ya da `#aabbcc`. Kısa biçim de sayılıyor, boşluk sayılmıyor. */
export const isHex = (v: string): boolean => /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim());

/**
 * Hex → RGB, GEÇERSİZ GİRDİDE FIRLATARAK.
 *
 * Önce sessizce `NaN` üretiyordu ve palet gri bir şeye düşüyordu: bir kullanıcı
 * hex kutusuna `#7c3aed` yazarken ara adımlarda (`#7`, `#7c`) panel griye
 * dönüyor, sonra geri geliyordu. Hata vermeyen bir bozulma en pahalısı, çünkü
 * sebebi rengin kendisinde aranıyor.
 *
 * Kit KATI, çağıran toleranslı: yarım yazılmış bir kodun ne anlama geldiği
 * ekranın kararı (bkz. `isHex`).
 */
export function hexToRgb(hex: string): [number, number, number] {
  if (!isHex(hex)) throw new Error(`Geçersiz hex: ${JSON.stringify(hex)}`);
  const s = hex.trim().replace("#", "");
  const t = s.length === 3 ? [...s].map((c) => c + c).join("") : s;
  const n = Number.parseInt(t, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const kanal = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)));
export const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => kanal(v).toString(16).padStart(2, "0")).join("");

/** WCAG bağıl parlaklık. Metin kontrastı bununla ölçülüyor. */
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => srgbDoğrusal(v / 255)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG kontrast oranı. AA metin eşiği 4.5. */
export function contrast(a: string, b: string): number {
  const [ust, alt] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (ust + 0.05) / (alt + 0.05);
}

/**
 * CIE L* · algısal açıklık.
 *
 * İki YÜZEYİN ayrı okunup okunmadığı bununla ölçülüyor; kontrast oranı metin
 * içindir, yüzey için değil. Bir kartın kenarı sayfadan ΔL* ≥ 10 ayrı olmalı.
 */
export function lightness(hex: string): number {
  const y = luminance(hex);
  return y > 216 / 24389 ? 116 * Math.cbrt(y) - 16 : (y * 24389) / 27;
}

export const deltaL = (a: string, b: string) => Math.abs(lightness(a) - lightness(b));

/* ---- OKLab ---- */

export function hexToOklch(hex: string): Oklch {
  const [r8, g8, b8] = hexToRgb(hex);
  const r = srgbDoğrusal(r8 / 255);
  const g = srgbDoğrusal(g8 / 255);
  const b = srgbDoğrusal(b8 / 255);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const c = Math.hypot(A, B);
  const h = c < 1e-6 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h };
}

/**
 * OKLCH → hex, GAMUT DIŞINA TAŞMADAN.
 *
 * Bir renk sRGB'ye sığmıyorsa kanalları kırpmak TONU kaydırıyor: mor bir yüz
 * kırpıldığında maviye dönüyor ve marka rengi olmaktan çıkıyor. Onun yerine
 * doyum (C) ikili aramayla sığana kadar düşürülüyor; ton ve açıklık korunuyor,
 * yalnız canlılık gerektiği kadar azalıyor.
 */
export function oklchToHex({ l, c, h }: Oklch): string {
  const dene = (kroma: number) => {
    const hr = (h * Math.PI) / 180;
    const A = Math.cos(hr) * kroma;
    const B = Math.sin(hr) * kroma;
    const l_ = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3;
    const m_ = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3;
    const s_ = (l - 0.0894841775 * A - 1.291485548 * B) ** 3;
    return [
      doğrusalSrgb(+4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
      doğrusalSrgb(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
      doğrusalSrgb(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
    ] as [number, number, number];
  };

  const sigiyorMu = (v: [number, number, number]) => v.every((x) => x >= -0.001 && x <= 1.001);

  let rgb = dene(c);
  if (!sigiyorMu(rgb)) {
    let alt = 0;
    let ust = c;
    for (let i = 0; i < 24; i++) {
      const orta = (alt + ust) / 2;
      if (sigiyorMu(dene(orta))) alt = orta;
      else ust = orta;
    }
    rgb = dene(alt);
  }
  return rgbToHex(...rgb);
}

/**
 * Verilen ton ve doyumda, HEDEF ORANI tutturan açıklığı arar.
 *
 * Palet "şu formülle koyulaştır" demiyor, ÖLÇÜP arıyor: bir rengin beyaz
 * mürekkebi 4.5'te taşıyıp taşımadığı tona göre değişiyor (sarı ile lacivert
 * aynı L'de aynı oranı vermiyor). Formül tahmin eder, arama ölçer.
 *
 * `yon` "koyulaş" (-1) ya da "açıl" (+1): koyu temada aynı hedef ters yönden
 * yakalanıyor.
 */
export function lightnessForContrast(
  taban: Oklch,
  karsi: string,
  hedef: number,
  yon: -1 | 1,
): Oklch {
  let en = { ...taban };
  for (let i = 0; i < 60; i++) {
    const aday = { ...taban, l: Math.max(0.02, Math.min(0.99, taban.l + yon * 0.01 * i)) };
    en = aday;
    if (contrast(oklchToHex(aday), karsi) >= hedef) break;
  }
  return en;
}

/* ------------------------------------------------------------------ *
 * ESKİ TÜRKÇE ADLAR, BİR SÜRÜM BOYUNCA.
 *
 * ADR-0001: "Adlar İngilizce, yorumlar Türkçe" — bir ad tanımlayıcıdır ve
 * çevrilmez. Bu modül o kuralı çiğniyordu ve kuralı yazan bizdik; dışarıdan
 * bir tüketici fark etti. `gecerliHex` gören bir yabancı ne yaptığını
 * bilmiyor, ve bir kütüphanenin kamusal yüzeyi bakımcısının ana dilinde
 * olamaz.
 *
 * ESKİLERİ SİLMEDİM çünkü `0.1.1` npm'de yayında ve şu an bu adları KULLANAN
 * bir tüketici var. Sessizce kırmak, bir sürüm numarasının söylemesi gereken
 * şeyi söylemeden kırmaktır. Bir sürüm daha duruyorlar, sonra gidiyorlar.
 * ------------------------------------------------------------------ */

/** @deprecated `isHex` kullan. 0.3.0'da kaldırılacak. */
export const gecerliHex = isHex;
/** @deprecated `hexToRgb` kullan. 0.3.0'da kaldırılacak. */
export const hexRgb = hexToRgb;
/** @deprecated `rgbToHex` kullan. 0.3.0'da kaldırılacak. */
export const rgbHex = rgbToHex;
/** @deprecated `luminance` kullan. 0.3.0'da kaldırılacak. */
export const parlaklik = luminance;
/** @deprecated `contrast` kullan. 0.3.0'da kaldırılacak. */
export const oran = contrast;
/** @deprecated `lightness` kullan. 0.3.0'da kaldırılacak. */
export const acikligi = lightness;
/** @deprecated `deltaL` kullan. 0.3.0'da kaldırılacak. */
export const dL = deltaL;
/** @deprecated `hexToOklch` kullan. 0.3.0'da kaldırılacak. */
export const hexOklch = hexToOklch;
/** @deprecated `oklchToHex` kullan. 0.3.0'da kaldırılacak. */
export const oklchHex = oklchToHex;
/** @deprecated `lightnessForContrast` kullan. 0.3.0'da kaldırılacak. */
export const oranaGoreAcikligi = lightnessForContrast;
