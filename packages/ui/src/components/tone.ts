/**
 * The tone scale — layer 3 of the palette.
 *
 * Gerekçe: docs/gerekce/06-isaret-ve-ton.md
 */

/** What a tone paints. */
export type ToneStyle = {
  /** text + border colour for chips and labels */
  fg: string;
  /** solid mark: dots, bars, spines, chart marks */
  mark: string;
  /**
   * The glyph that reads ON `mark`, picked per tone by measurement · NOT one colour for all six:
   * `mark` is a fixed plate and a theme-following ink sank the alert glyph to 2.96 on critical
   * in dark. TR: `mark` üstünde okunan glif, ton başına ÖLÇÜLEREK seçiliyor · altısı için tek
   * renk DEĞİL: plaka sabit, temayla dönen bir mürekkep koyu temada kritikte 2.96'ya düşüyordu.
   * Gerekçe: docs/gerekce/06-isaret-ve-ton.md
   */
  markInk: string;
  /** chip / cell wash */
  bg: string;
  /**
   * The same tone on the INVERSE surface · the one surface that stays dark in
   * both themes (the toast). `mark` cannot be reused there: measured on
   * `--color-inverse`, the light-theme marks fall to 1.99-2.79 for info and
   * critical, under the 3:1 floor for graphical objects. These are the dark
   * theme's inks, which were built for a navy ground in the first place.
   */
  inverse: string;
};

/**
 * Five roles, and nothing outside them. `neutral` carries meaning by NOT
 * carrying colour, which only works while it stays the single uncoloured state.
 * `info` fills a hole rather than adding a shade.
 *
 * Gerekçe: docs/gerekce/06-isaret-ve-ton.md
 */
/**
 * Altı rol, ağırlık sırasına göre. Rol sayısı bir sözleşme: `kit.test.ts`
 * yedincisini yakalar. Gerekçeler: docs/gerekce/06-isaret-ve-ton.md
 */
export type Tone = "neutral" | "positive" | "caution" | "elevated" | "danger" | "info";

export const tones: Record<Tone, ToneStyle> = {
  positive: {
    fg: "var(--color-resolved)",
    mark: "var(--color-resolved-mark)",
    markInk: "var(--color-inverse)",
    bg: "var(--color-resolved-bg)",
    inverse: "var(--color-resolved-inverse)",
  },
  caution: {
    fg: "var(--color-warn)",
    mark: "var(--color-warn-mark)",
    markInk: "var(--color-inverse)",
    bg: "var(--color-warn-bg)",
    inverse: "var(--color-warn-inverse)",
  },
  elevated: {
    fg: "var(--color-elevated)",
    mark: "var(--color-elevated-mark)",
    markInk: "var(--color-inverse)",
    bg: "var(--color-elevated-bg)",
    inverse: "var(--color-elevated-inverse)",
  },
  danger: {
    fg: "var(--color-critical)",
    mark: "var(--color-critical-mark)",
    markInk: "var(--color-inverse-ink)",
    bg: "var(--color-critical-bg)",
    inverse: "var(--color-critical-inverse)",
  },
  info: {
    fg: "var(--color-info)",
    mark: "var(--color-info-mark)",
    markInk: "var(--color-page)",
    bg: "var(--color-info-bg)",
    inverse: "var(--color-info-inverse)",
  },
  neutral: {
    fg: "var(--color-silent)",
    mark: "var(--color-silent-mark)",
    markInk: "var(--color-inverse)",
    bg: "var(--color-silent-bg)",
    inverse: "var(--color-silent-inverse)",
  },
};

export function toneOf(tone: Tone): ToneStyle {
  return tones[tone];
}

/**
 * How loudly a tone asks for the screen's single pulse (see live-scope). `null`
 * means "never pulses"; only `danger` breathes. This is the DEFAULT, not the
 * policy: a product that ranks its own states passes an explicit rank.
 *
 * Gerekçe: docs/gerekce/06-isaret-ve-ton.md
 */
export const TONE_RANK: Record<Tone, number | null> = {
  danger: 90,
  /* `elevated` de nabız atmıyor. Sırası `danger`ın altında ama kural sıra
     değil: nabız "şimdi buraya bak" demek, ve yükselmiş bir durum bir
     müdahale çağrısı değil bir gidişat. İki şeyin birden nabız atması, nabzın
     hiçbir şey söylememesiyle aynı kapıya çıkıyor. */
  elevated: null,
  caution: null,
  positive: null,
  /* Bir bilgi asla nabız atmıyor: "bilinmesi iyi olur" ile "şimdi buraya bak"
     aynı cümle değil, ve nabzı ikincisi için saklı tutmak bu ölçeğin kuralı. */
  info: null,
  neutral: null,
};

export function rankOf(tone: Tone, override?: number | null): number | null {
  return override === undefined ? TONE_RANK[tone] : override;
}

/** Layer 1 — neutral ramp, for anything that is not reporting a state. */
export const neutral = {
  page: "var(--color-page)",
  surface: "var(--color-shell)",
  hover: "var(--color-hover)",
  chartFill: "var(--color-chart-fill)",
  line: "var(--color-line)",
  edge: "var(--color-edge)",
  lineStrong: "var(--color-edge)",
  muted: "var(--color-ink-faint)",
  body: "var(--color-ink-soft)",
  title: "var(--color-ink)",
};

/** Layer 2 — interaction only. */
export const accent = {
  fg: "var(--color-accent)",
  bg: "var(--color-accent-bg)",
  ink: "var(--color-accent-ink)",
};

/**
 * Bir grafikteki serilerin renk sırası.
 *
 * BİRİNCİ SERİ VURGU RENGİ, sonrakiler ton paleti. Sebebi şu: çoğu grafik tek
 * serilidir ve o tek seri sayfanın asıl bilgisi; nitel paletin ilk rengi
 * (zeytin) ona "beşten biri" muamelesi yapıyordu. İkinci seri geldiği an
 * ayrışma da gerekiyor, ve orada palet devreye giriyor.
 */
export const seriRenkleri = [
  "var(--color-accent)",
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
] as const;

/** Sıradaki seri rengi; beşten sonra başa dönüyor. */
export function seriRenk(i: number): string {
  return seriRenkleri[i % seriRenkleri.length] ?? seriRenkleri[0];
}

/**
 * YIĞILMIŞ bir sütunun dilimleri · TEK HUE'NUN basamakları, kategorik palet
 * değil. Yığılmış dilimler aynı ölçünün PARÇALARI (bir günün siparişleri: web,
 * mobil, pazaryeri); farklı renklere boyanınca her dilim ayrı bir ölçü gibi
 * okunuyor ve toplam gözden kayboluyor. `seriRenk` ayrı ölçüler için · orada
 * ayrı renk doğru olan.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */
export const yiginRenkleri = [
  "var(--color-accent)",
  "var(--color-brand-400)",
  "var(--color-brand-100)",
  "var(--color-brand-50)",
] as const;

export function yiginRenk(i: number): string {
  return yiginRenkleri[i % yiginRenkleri.length] as string;
}
