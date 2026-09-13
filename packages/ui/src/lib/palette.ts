import { lightness, deltaL, isHex, hexToOklch, oklchToHex, contrast, type Oklch } from "./color.js";

/**
 * Tek bir marka renginden iki temalık palet.
 *
 * NEDEN ÜRETİLİYOR. Bugüne kadar bir müşterinin rengi elle geçiriliyordu: yüz,
 * taban, mürekkep, seçili satır zemini ve koyu tema karşılıkları tek tek
 * seçiliyordu. Beş token için makul, otuz altı token için değil, ve her seferinde
 * kontrast eşiği elle kontrol ediliyordu.
 *
 * ZEMİN DE DÖNÜYOR. Bugünün zemini sıcak kâğıt (#f5f2ec) ve aksandan bağımsız;
 * mor bir markanın yanında sarıya çalıyor. Nötrler markanın TONUNU çok düşük
 * doyumla taşıyor: gri kalıyorlar ama markanın grisi oluyorlar.
 *
 * EŞİKLER TAHMİN DEĞİL ARAMA. Her renk "şu formülle koyulaştır" ile değil,
 * hedef orana ulaşana kadar ÖLÇÜLEREK bulunuyor — çünkü bir tonun beyaz
 * mürekkebi hangi açıklıkta taşıdığı tona göre değişiyor. Sonuç
 * `check-token-contrast` ile aynı aritmetikten geçiyor (bkz. `lib/color.ts`).
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
  edge: string;
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
  accentShadow: string;
  navIdle: string;
  navHover: string;
  navHoverBg: string;
};

export type PalettePair = { light: Palette; dark: Palette };

/**
 * Nötrlerin AÇIKLIK basamakları, iki temada.
 *
 * Sayılar bugünkü paletten ölçüldü, uydurulmadı: `#f5f2ec` ile `#fdfcfa`
 * arasındaki fark ne ise mor bir markada da o. Böylece marka değişince
 * yüzeylerin BİRBİRİNE göre yeri sabit kalıyor, yalnız tonu dönüyor.
 */
const BASAMAK = {
  light: { page: 0.962, shell: 0.991, hover: 0.933, sunk: 0.933, line: 0.891, edge: 0.845, tick: 0.771, ink: 0.246, inkSoft: 0.372, inkFaint: 0.516, navIdle: 0.523, navHover: 0.386 },
  dark: { page: 0.166, shell: 0.212, hover: 0.262, sunk: 0.262, line: 0.302, edge: 0.372, tick: 0.409, ink: 0.951, inkSoft: 0.869, inkFaint: 0.643, navIdle: 0.606, navHover: 0.869 },
} as const;

/**
 * Nötrlerin doyumu: gri kalacak kadar az, markayı taşıyacak kadar çok.
 *
 * YÜKSELEN YÜZEY TONSUZ, ve bu bir tutarsızlık değil bir ayrım. Marka rengi
 * ZEMİNE giriyor: sayfa, şerit, ray, satır vurgusu. Kart ise zeminin üstünde
 * DURAN şey, ve beyaza yakın kalması onu her markada aynı yükseklikte
 * tutuyor — kartın rengi değil kenarı yükseltiyor (13 Yasa 1).
 *
 * Pratik karşılığı: müşteri rengini değiştirdiğinde sayfanın zemini dönüyor
 * ama kenar çubuğu, üst şerit ve kartlar yerinde kalıyor. Panelin iskeleti
 * sabit, rengi değişken.
 */
const NOTR_DOYUM = { zemin: 0.006, yuzey: 0, cizgi: 0.009, murekkep: 0.014 } as const;

const notr = (h: number, l: number, c: number) => oklchToHex({ l, c, h });

/**
 * Yüzün üstündeki mürekkep: beyaz mı koyu mu.
 *
 * ÖLÇÜLEREK seçiliyor, kurala göre değil. Lacivert bir yüz beyaz mürekkep
 * taşıyor, sarı bir yüz taşımıyor — ve "markalar koyu olur" varsayımı ilk sarı
 * markada okunmayan bir düğme üretiyor.
 */
function yuzMurekkebi(yuz: string, acikNotr: string, koyuNotr: string): string {
  return contrast(acikNotr, yuz) >= contrast(koyuNotr, yuz) ? acikNotr : koyuNotr;
}

function temaUret(marka: Oklch, koyu: boolean): Palette {
  const h = marka.h;
  const b = koyu ? BASAMAK.dark : BASAMAK.light;
  const page = notr(h, b.page, NOTR_DOYUM.zemin);
  /* Kart · üst şerit · kenar çubuğu: markadan bağımsız. */
  const shell = notr(h, b.shell, NOTR_DOYUM.yuzey);
  const hover = notr(h, b.hover, NOTR_DOYUM.zemin);
  const ink = notr(h, b.ink, NOTR_DOYUM.murekkep);

  /* YÜZ: markanın KENDİ açıklığından başlıyor.
   *
   * İlk hâli sabit bir açıklıktan başlayıp beyaz mürekkep geçene kadar
   * koyulaştırıyordu, ve sarı bir markayı `#8f6c00` yapıyordu: ölçüm geçiyor
   * ama kimse ona sarı demiyor. Marka rengini tanınmaz hâle getiren bir palet
   * üreticisi işini yapmıyor.
   *
   * Doğrusu: yüz markanın açıklığında kalıyor (kullanılabilir bir banda
   * kırpılarak), MÜREKKEP ona göre seçiliyor. Lacivert bir yüz beyaz taşır,
   * sarı bir yüz koyu taşır — ikisi de markasını koruyor. Yalnız hiçbir
   * mürekkeple 4.5'e ulaşılamıyorsa yüz mürekkepten UZAĞA itiliyor. */
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
    band: page,
    rail: page,
    sunk: hover,
    chartFill: hover,
    line: notr(h, b.line, NOTR_DOYUM.cizgi),
    edge: notr(h, b.edge, NOTR_DOYUM.cizgi),
    tick: notr(h, b.tick, NOTR_DOYUM.cizgi),
    ink,
    inkSoft: notr(h, b.inkSoft, NOTR_DOYUM.murekkep),
    inkFaint: notr(h, b.inkFaint, NOTR_DOYUM.murekkep),
    accent: yuz,
    accentHover: adim(koyu ? 0.05 : -0.06),
    accentActive: adim(koyu ? -0.04 : -0.11),
    accentInk: murekkep,
    accentLine: cizgi,
    /* Seçili satır zemini: sayfaya çok yakın, ama ayrı okunuyor. */
    accentBg: oklchToHex({ l: koyu ? b.page + 0.06 : b.page - 0.035, c: 0.03, h }),
    /* Taban: yüzün ALTINDA duran koyu, doygun renk (13 Yasa 1). */
    accentShadow: oklchToHex({ l: koyu ? 0.42 : 0.28, c: Math.min(marka.c, 0.13), h }),
    navIdle: notr(h, b.navIdle, NOTR_DOYUM.murekkep),
    navHover: notr(h, b.navHover, NOTR_DOYUM.murekkep),
    navHoverBg: notr(h, koyu ? b.hover : b.hover - 0.01, NOTR_DOYUM.zemin),
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
    yuzey("edge · page", p.edge, p.page, 10),
    yuzey("line · page", p.line, p.page, 4),
    yuzey("accentBg · page", p.accentBg, p.page, 1.2),
  ];
}

/** `:root` bloğuna yapıştırılabilir CSS. */
/**
 * Palette alanı → CSS simge adı.
 *
 * DIŞARI AÇIK, ÇÜNKÜ ÜÇÜNCÜ KOPYASI DOĞACAKTI. Bu eşleme `paletteCss`in içinde
 * özeldi; bir ürün paneli aynısını kendi dosyasına elle yazmıştı (rengi
 * çalışma zamanında köke yazmak için), ve doküman sitesi de üçüncüsünü
 * yazacaktı. Aynı yirmi iki satırın üç kopyası, kite bir simge eklendiği gün
 * ikisinin sessizce eksik kalması demek.
 */
const AD: Record<keyof Palette, string> = {
  page: "--color-page", shell: "--color-shell", hover: "--color-hover", band: "--color-band",
  rail: "--color-rail", sunk: "--color-sunk", chartFill: "--color-chart-fill",
  line: "--color-line", edge: "--color-edge", tick: "--color-tick",
  ink: "--color-ink", inkSoft: "--color-ink-soft", inkFaint: "--color-ink-faint",
  accent: "--color-accent", accentHover: "--color-accent-hover",
  accentActive: "--color-accent-active", accentInk: "--color-accent-ink",
  accentLine: "--color-accent-line", accentBg: "--color-accent-bg",
  accentShadow: "--color-accent-shadow", navIdle: "--color-nav-idle",
  navHover: "--color-nav-hover", navHoverBg: "--color-nav-hover-bg",
};

/**
 * Bir paleti CSS değişkeni sözlüğüne çevirir: `{ "--color-accent": "#..." }`.
 *
 * NEDEN `paletteCss` YETMİYOR: o bir STİL SAYFASI dizgisi üretiyor (`:root { … }`),
 * ve bir stil sayfası ancak belgenin tamamına uygulanabiliyor. Bir paleti tek
 * bir kutuya uygulamak (bir önizleme, bir tema seçici) ya da köke çalışma
 * zamanında yazmak için gereken şey bir SÖZLÜK. Simge adları kalıtsal olduğu
 * için bir kutuya yazılan palet, içindeki her bileşeni birlikte döndürüyor.
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
