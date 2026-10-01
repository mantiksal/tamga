import { lightness, deltaL, isHex, hexToOklch, oklchToHex, contrast, type Oklch } from "./color.js";

/**
 * Tek bir marka renginden iki temalık palet · 36 token, ölçülerek.
 *
 * Kontrast eşikleri `measurePalette` ile sınanıyor (`check-token-contrast` ile
 * aynı aritmetik, bkz. `lib/color.ts`): bir formül bugün doğru olup yarın bir
 * ton için yanlış olabiliyor.
 *
 * Gerekçenin tamamı: docs/ozel/10-tasarim-dili-yenileme.md
 */

/** Bir temanın üreteceği token'lar. Adlar `theme.css`'teki kit ailesiyle birebir. */
export type Palette = {
  page: string;
  shell: string;
  hover: string;
  band: string;
  rail: string;
  sunk: string;
  chartFill: string;
  line: string;
  /** Kapatan çizgi: kart/tablo başlığının altı. `line` sıralar, `div` böler. */
  div: string;
  edge: string;
  /** Tıklanabilir kartın hover kenarı: soluk çizgi ile koyu kenar arası. */
  edgeHover: string;
  edgeStrong: string;
  tick: string;
  ink: string;
  inkSoft: string;
  inkFaint: string;
  accent: string;
  accentHover: string;
  accentActive: string;
  accentInk: string;
  accentLine: string;
  accentBg: string;
  /** Vurgunun yumuşak hâli: odak katmanı, sayaç rozeti, yumuşak düğme. */
  accentSoft: string;
  accentShadow: string;
  navIdle: string;
  navHover: string;
  navHoverBg: string;
};

export type PalettePair = { light: Palette; dark: Palette };

/**
 * Nötrler markadan ne kadar etkilenir · üç kademe.
 *
 *   TAM      `ink`, `edge` ve vurgu ailesi · doyumu ORANLA alıyor.
 *   KISITLI  `muted`, `line`, `bedge`, ara mürekkepler · doyum 0.022 tavanlı.
 *   SABİT    açık temanın KÂĞITLARI · sıcak krem her markada aynı.
 *
 * Gerekçe: docs/ozel/10-tasarim-dili-yenileme.md · docs/gerekce/09-kitaplik.md
 */
/* Referans marka: tasarımın varsayılan mavisi (#1E4FD8). Oranlar onun doyumuna
   göre. Referansın kendisinde OKLCH gidiş-dönüşünden 1-2 birimlik sapma var ve
   kabul edildi: literal bir tablo sapmayı kapatır ama üreticiyi ikiye böler. */
const REFERANS_MARKA = { l: 0.49, c: 0.2158, h: 264.4 };

/** `l` açıklık, `c` doyum, `k` marka kademesi. */
type Basamak = { l: number; c: number; k: "tam" | "kisitli" };

type NotrRol =
  | "page" | "shell" | "rail" | "hover" | "sunk" | "line" | "div" | "edge" | "edgeHover"
  | "edgeStrong" | "tick" | "ink" | "inkSoft" | "inkFaint" | "navIdle" | "navHover" | "navHoverBg";

const BASAMAK: Record<"light" | "dark", Record<NotrRol, Basamak>> = {
  light: {
    page: { l: 0.961, c: 0.0083, k: "kisitli" },
    shell: { l: 0.997, c: 0.0041, k: "kisitli" },
    rail: { l: 0.925, c: 0.0112, k: "kisitli" },
    hover: { l: 0.970, c: 0.0082, k: "kisitli" },
    sunk: { l: 0.898, c: 0.0142, k: "kisitli" },
    line: { l: 0.861, c: 0.0156, k: "kisitli" },
    div: { l: 0.904, c: 0.0129, k: "kisitli" },
    edge: { l: 0.834, c: 0.0154, k: "kisitli" },
    edgeHover: { l: 0.677, c: 0.0340, k: "kisitli" },
    edgeStrong: { l: 0.241, c: 0.0635, k: "tam" },
    tick: { l: 0.771, c: 0.0154, k: "kisitli" },
    ink: { l: 0.241, c: 0.0635, k: "tam" },
    inkSoft: { l: 0.372, c: 0.0550, k: "kisitli" },
    inkFaint: { l: 0.460, c: 0.0476, k: "kisitli" },
    navIdle: { l: 0.241, c: 0.0635, k: "tam" },
    navHover: { l: 0.241, c: 0.0635, k: "tam" },
    navHoverBg: { l: 0.997, c: 0.0041, k: "kisitli" },
  },
  dark: {
    page: { l: 0.218, c: 0.0385, k: "kisitli" },
    shell: { l: 0.257, c: 0.0473, k: "kisitli" },
    rail: { l: 0.187, c: 0.0331, k: "kisitli" },
    hover: { l: 0.278, c: 0.0521, k: "kisitli" },
    /* ÇUKUR SAYFANIN ALTINDA, ve koyu temada bu basamak neredeyse hiç yoktu:
       l 0.209 sayfanın 0.218'ine ΔL* 1.0 kadar yakındı — açık temada aynı çift
       ΔL* 7.3. Gömülü yüzey sayfanın üstünde görünmüyordu. Rayın altına indi
       (açık temadaki sıra da bu), kroma açıklıkla birlikte düşüyor.
       Gerekçe: docs/gerekce/10-kit-css.md */
    sunk: { l: 0.168, c: 0.0290, k: "kisitli" },
    line: { l: 0.352, c: 0.0535, k: "kisitli" },
    div: { l: 0.313, c: 0.0512, k: "kisitli" },
    edge: { l: 0.352, c: 0.0535, k: "kisitli" },
    edgeHover: { l: 0.437, c: 0.0618, k: "kisitli" },
    edgeStrong: { l: 0.120, c: 0.0209, k: "tam" },
    tick: { l: 0.409, c: 0.0535, k: "kisitli" },
    /* Koyu temada mürekkep TAM kademede DEĞİL · tasarımın üreticisi onu
       ailenin dışında tutuyor. Koyu bir zeminde açık bir yazı markanın
       doyumunu tam aldığında renkli bir metin oluyor ve okunurluğu düşüyor. */
    ink: { l: 0.935, c: 0.0150, k: "kisitli" },
    inkSoft: { l: 0.869, c: 0.0220, k: "kisitli" },
    inkFaint: { l: 0.725, c: 0.0352, k: "kisitli" },
    navIdle: { l: 0.935, c: 0.0150, k: "kisitli" },
    navHover: { l: 0.935, c: 0.0150, k: "kisitli" },
    navHoverBg: { l: 0.257, c: 0.0473, k: "kisitli" },
  },
};

/** Sıcak markada kâğıdın kaçtığı ton. */
const KAGIT_TONU = 78;

/* AÇIK YÜZEYLER DE MARKADAN TON ALIYOR. Kâğıtlar `h: 90`da sabitti: seçilen renk ne olursa
   olsun ray, zemin ve kartlar aynı sıcak griydi, oysa koyu tema markanın tonunda nefes
   alıyordu. Değişen yalnız TON · parlaklık ve doyum tavanı aynı kaldığı için kontrast ve
   göz konforu yerinde duruyor (ölçüldü: mürekkep/zemin 15.5+). */
function notrUret(b: Basamak, marka: Oklch, koyu: boolean): string {
  const oran = Math.max(0.12, Math.min(1.4, marka.c / REFERANS_MARKA.c));
  const tavan = koyu ? 0.02 : 0.022;
  let c = b.k === "tam" ? b.c * oran : Math.min(b.c * oran, tavan);
  let h = marka.h;
  /* Sıcak marka muhafızı · yalnız AÇIK nötrlerde. */
  if (b.l > 0.7 && (marka.h < 75 || marka.h > 340)) {
    h = KAGIT_TONU;
    c *= 0.8;
  }
  return oklchToHex({ l: b.l, c, h });
}


/**
 * Yüzün üstündeki mürekkep: beyaz mı koyu mu. ÖLÇÜLEREK seçiliyor · "markalar
 * koyu olur" varsayımı ilk sarı markada okunmayan bir düğme üretiyor.
 */
function yuzMurekkebi(yuz: string, acikNotr: string, koyuNotr: string): string {
  return contrast(acikNotr, yuz) >= contrast(koyuNotr, yuz) ? acikNotr : koyuNotr;
}

function temaUret(marka: Oklch, koyu: boolean): Palette {
  const h = marka.h;
  const b = koyu ? BASAMAK.dark : BASAMAK.light;
  const page = notrUret(b.page, marka, koyu);
  const shell = notrUret(b.shell, marka, koyu);
  const hover = notrUret(b.hover, marka, koyu);
  const railRengi = notrUret(b.rail, marka, koyu);
  const ink = notrUret(b.ink, marka, koyu);

  /* YÜZ markanın KENDİ açıklığında kalıyor (kullanılabilir bir banda kırpılarak),
     mürekkep ona göre seçiliyor · lacivert bir yüz beyaz, sarı bir yüz koyu
     taşıyor. Sabit bir açıklıktan başlayıp koyulaştırmak sarı bir markayı
     `#8f6c00` yapıyordu: ölçüm geçiyor ama kimse ona sarı demiyor. Hiçbir
     mürekkeple 4.5'e ulaşılamıyorsa yüz mürekkepten UZAĞA itiliyor. */
  const band = koyu ? { alt: 0.58, ust: 0.82 } : { alt: 0.45, ust: 0.78 };
  const yuzL = Math.max(band.alt, Math.min(band.ust, marka.l));
  /* DOYUM KIRPILMIYOR. Bir süre `min(marka.c, 0.16)` vardı ve doygun bir marka
     kırmızısını (C 0.215) `#c74a4a`ya soldurup markayı gözle görülür şekilde
     değiştiriyordu. Kırpma gereksizdi: `oklchToHex` zaten gamut'a sığmayan bir
     rengi ikili aramayla sığdırıyor ve TONU koruyor. Kırpmak, çözülmüş bir
     sorunu ikinci kez ve daha kötü çözmekti. */
  const kroma = marka.c;
  let yuz = oklchToHex({ l: yuzL, c: kroma, h });
  let murekkep = yuzMurekkebi(yuz, shell, ink);
  for (let i = 1; i <= 40 && contrast(yuz, murekkep) < 4.5; i++) {
    /* Mürekkep açıksa yüz koyulaşır, koyuysa açılır: mesafe hep açılıyor. */
    const yon = lightness(murekkep) > 50 ? -1 : 1;
    yuz = oklchToHex({ l: Math.max(0.2, Math.min(0.92, yuzL + yon * 0.01 * i)), c: kroma, h });
    murekkep = yuzMurekkebi(yuz, shell, ink);
  }

  const yuzOk = hexToOklch(yuz);
  const adim = (d: number) => oklchToHex({ ...yuzOk, l: Math.max(0.06, Math.min(0.96, yuzOk.l + d)) });

  /* ÇİZGİ RENGİ (bağlantı, odak halkası) sayfada AA geçmek zorunda: bir
     bağlantı metindir. Yüz genelde geçmiyor, o yüzden ayrıca aranıyor. */
  let cizgi = koyu ? adim(0.08) : adim(-0.18);
  for (let i = 0; i < 40 && contrast(cizgi, page) < 4.5; i++) {
    cizgi = oklchToHex({ ...yuzOk, l: Math.max(0.08, Math.min(0.95, yuzOk.l + (koyu ? 1 : -1) * (0.18 + 0.01 * i))) });
  }

  return {
    page,
    shell,
    hover,
    /* Ray ve şerit sayfadan ΔL* 3.6 KOYU, iki temada da aynı yönde. Koyu temada
       AÇMAK denendi ve kartı yok etti: ray ile shell arası ΔL* 0.4'e düşüyor. */
    band: railRengi,
    rail: railRengi,
    /* ÇUKUR İLE HOVER AYRI, ve bir süre aynı değerdi. Tasarımda hover kâğıdın
       bir tık ÜSTÜ (kartın içinde açılan bir satır), çukur ise bir tık ALTI
       (gömülü bir kuyu). Aynı değer verildiğinde gömülü alanlar kayboluyordu. */
    sunk: notrUret(b.sunk, marka, koyu),
    chartFill: notrUret(b.sunk, marka, koyu),
    line: notrUret(b.line, marka, koyu),
    edge: notrUret(b.edge, marka, koyu),
    /* Ayraç ile kart hover kenarı · ikisi de tasarımın kendi token'ı. */
    div: notrUret(b.div, marka, koyu),
    edgeHover: notrUret(b.edgeHover, marka, koyu),
    /* BASILAN KENAR: düğmenin altındaki taban. `edge`ten ayrı, çünkü o sessiz
       (kart çizer), bu ağır (tuş çizer). Koyu temada mürekkep açılırken bu
       koyu kalıyor, o yüzden mürekkebe de bağlanamıyor. */
    edgeStrong: notrUret(b.edgeStrong, marka, koyu),
    tick: notrUret(b.tick, marka, koyu),
    ink,
    inkSoft: notrUret(b.inkSoft, marka, koyu),
    inkFaint: notrUret(b.inkFaint, marka, koyu),
    accent: yuz,
    accentHover: adim(koyu ? 0.05 : -0.06),
    accentActive: adim(koyu ? -0.04 : -0.11),
    accentInk: murekkep,
    accentLine: cizgi,
    /* Seçili satır zemini: sayfaya çok yakın, ama ayrı okunuyor. */
    /* `notrUret`ten geçmek zorunda: sıcak-marka muhafızı oradan geliyor. */
    accentBg: notrUret({ l: koyu ? 0.318 : 0.930, c: koyu ? 0.075 : 0.0282, k: "tam" }, marka, koyu),
    /* Odak katmanı ve sayaç rozeti; markadan türüyor, sabit değil. */
    accentSoft: notrUret({ l: koyu ? 0.357 : 0.836, c: koyu ? 0.0964 : 0.0712, k: "tam" }, marka, koyu),
    /* Taban: yüzün ALTINDA duran koyu, doygun renk (13 Yasa 1). */
    accentShadow: oklchToHex({ l: koyu ? 0.42 : 0.28, c: Math.min(marka.c, 0.13), h }),
    navIdle: notrUret(b.navIdle, marka, koyu),
    navHover: notrUret(b.navHover, marka, koyu),
    /* Rayın basamağından türüyor, sayfanınkinden değil: ikisi eşitlenirse
       rayda hover görünmez olur (`check:palette` · `navHoverBg · rail`). */
    navHoverBg: notrUret(b.navHoverBg, marka, koyu),
  };
}

/**
 * Bir marka renginden iki tema.
 *
 * Geçersiz bir kodda FIRLATIYOR, sessizce griye düşmüyor: yarım yazılmış bir
 * hex'in ne anlama geldiğine çağıran karar veriyor (`isHex`).
 */
export function makePalette(markaHex: string): PalettePair {
  if (!isHex(markaHex)) throw new Error(`Geçersiz marka rengi: ${JSON.stringify(markaHex)}`);
  const marka = hexToOklch(markaHex);
  return { light: temaUret(marka, false), dark: temaUret(marka, true) };
}

/* ÖLÇÜNÜN KENDİSİ DE DIŞARI AÇIK. Bir ürün kendi rengini seçerken kapının
   sorduğu soruyu sorabilmeli, ve aynı matematikle: metin için WCAG oranı,
   yüzey ve çizgi için CIE L* farkı. İkisini yeniden yazan her taraf, kapıdan
   BAŞKA bir sonuç üretme riskini de yeniden yazıyor. */
export { isHex };

/* ---- doğrulama ---- */

/** Tek bir kontrast ölçümü. */
export type Measurement = {
  /** Neyin neye karşı ölçüldüğü: "ink · page". */
  name: string;
  /** `contrast` WCAG oranı, `deltaL` açıklık farkı. */
  kind: "contrast" | "deltaL";
  value: number;
  threshold: number;
  passed: boolean;
};

/**
 * Üretilen paleti `check-token-contrast` ile AYNI eşiklerden geçirir.
 *
 * Üreticiye güvenmek yerine ölçmek şart: bir formül bugün doğru olabilir ve
 * yarın bir ton için yanlış olur. Marka rengi değiştiğinde bu liste yeniden
 * koşuyor, ve geçmeyen bir palet build'i kırıyor.
 */
export function measurePalette(p: Palette): Measurement[] {
  const metin = (name: string, a: string, b: string, threshold = 4.5): Measurement => {
    const value = Number(contrast(a, b).toFixed(2));
    return { name, kind: "contrast", value, threshold, passed: value >= threshold };
  };
  const yuzey = (name: string, a: string, b: string, threshold: number): Measurement => {
    const value = Number(deltaL(a, b).toFixed(1));
    return { name, kind: "deltaL", value, threshold, passed: value >= threshold };
  };
  return [
    metin("ink · page", p.ink, p.page),
    metin("ink · shell", p.ink, p.shell),
    metin("inkSoft · page", p.inkSoft, p.page),
    metin("inkFaint · page", p.inkFaint, p.page),
    metin("inkFaint · sunk", p.inkFaint, p.sunk),
    metin("accentInk · accent", p.accentInk, p.accent),
    metin("accentLine · page", p.accentLine, p.page),
    metin("navIdle · rail", p.navIdle, p.rail),
    /* Ray kendi basamağına indiğinde bu çift ÜST ÜSTE bindi ve hiçbir kapı
       görmedi: hover zemini ölçülmüyordu. Taban 2.0 — bir satırın altındaki
       zeminin "değişti" diye okunması için gereken en az fark. */
    yuzey("navHoverBg · rail", p.navHoverBg, p.rail, 2),
    /* Gömülü yüzey sayfadan ayrılıyor mu, aynı 2.0 tabanı: koyu temada kitin
       kendi `--color-sunk`u sayfaya ΔL* 1.1 kadar yaklaşmıştı ve üretici de
       aynı kusuru bir marka rengi için üretebilir. */
    yuzey("sunk · page", p.sunk, p.page, 2),
    yuzey("edge · page", p.edge, p.page, 10),
    yuzey("line · page", p.line, p.page, 4),
    yuzey("accentBg · page", p.accentBg, p.page, 1.2),
  ];
}

/** `:root` bloğuna yapıştırılabilir CSS. */
/* Palette alanı → CSS simge adı. Yeni bir alan buraya da yazılmazsa
   sessizce dışarı çıkmıyor. */
const AD: Record<keyof Palette, string> = {
  page: "--color-page", shell: "--color-shell", hover: "--color-hover", band: "--color-band",
  rail: "--color-rail", sunk: "--color-sunk", chartFill: "--color-chart-fill",
  line: "--color-line", edge: "--color-edge", edgeHover: "--color-edge-hover",
  edgeStrong: "--color-edge-strong",
  div: "--color-div", tick: "--color-tick",
  ink: "--color-ink", inkSoft: "--color-ink-soft", inkFaint: "--color-ink-faint",
  accent: "--color-accent", accentHover: "--color-accent-hover",
  accentActive: "--color-accent-active", accentInk: "--color-accent-ink",
  accentLine: "--color-accent-line", accentBg: "--color-accent-bg",
  accentSoft: "--color-accent-soft",
  accentShadow: "--color-accent-shadow", navIdle: "--color-nav-idle",
  navHover: "--color-nav-hover", navHoverBg: "--color-nav-hover-bg",
};

/**
 * Bir paleti CSS değişkeni sözlüğüne çevirir. `paletteCss` bir STİL SAYFASI
 * dizgisi üretiyor ve o ancak belgenin tamamına uygulanabiliyor; bir paleti tek
 * bir kutuya (önizleme, tema seçici) ya da köke çalışma zamanında yazmak için
 * gereken şey bir SÖZLÜK.
 */
export function paletteVars(p: Palette): Record<string, string> {
  const stil: Record<string, string> = {};
  for (const alan of Object.keys(AD) as (keyof Palette)[]) stil[AD[alan]] = p[alan];
  return stil;
}

export function paletteCss(cift: PalettePair): string {
  const blok = (p: Palette) =>
    Object.entries(paletteVars(p))
      .map(([ad, deger]) => `  ${ad}: ${deger};`)
      .join("\n");
  return `:root {\n${blok(cift.light)}\n}\n\n.dark {\n${blok(cift.dark)}\n}\n`;
}

export { lightness, deltaL, contrast };
