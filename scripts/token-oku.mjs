/**
 * Token okuyucu — iki kapının da (parite, kontrast) ortak gözü.
 *
 * NEDEN AYRI BİR DOSYA. İki betik de aynı dört bloğu ayrıştırıyor. İki kopya
 * ayrıştırıcı zamanla iki farklı ayrıştırıcı olur, ve o an bir kapı ötekinin
 * görmediği bir token'a bakıyor demektir.
 *
 * BLOKLARI YORUM İŞARETÇİSİYLE BULUYOR, sırasıyla ya da satır numarasıyla
 * değil: `:root` CSS'te birden çok kez geçiyor (biri rol takma adları, biri
 * tema değerleri) ve "ilkini al" diyen bir ayrıştırıcı, dosyaya bir blok
 * eklenince sessizce yanlış bloğu okumaya başlar.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const KIT = join(root, "packages", "ui", "src");

/** Bir işaretçiden sonraki ilk bloğun bildirimleri. */
export function blok(dosya, isaretci) {
  const src = readFileSync(join(KIT, dosya), "utf8");
  const i = src.indexOf(isaretci);
  if (i < 0) throw new Error(`${dosya}: "${isaretci}" işaretçisi yok`);
  const bas = src.indexOf("{", i);
  const son = src.indexOf("\n}", bas);
  if (bas < 0 || son < 0) throw new Error(`${dosya}: "${isaretci}" bloğu kapanmamış`);
  /* Yorumlar önce siliniyor: bir yorumun içindeki örnek bildirim
     (`:root { --color-accent: #d6336c; }`) gerçek bir token sanılıyordu. */
  const govde = src.slice(bas, son).replace(/\/\*[\s\S]*?\*\//g, "");
  const m = new Map();
  for (const [, ad, deger] of govde.matchAll(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gm)) {
    m.set(ad, deger.trim());
  }
  return m;
}

/** Dört blok: iki ad ailesi × iki tema. */
export const bloklar = () => ({
  temaAcik: blok("theme.css", "tamga:tema-acik"),
  temaKoyu: blok("theme.css", "tamga:tema-koyu"),
  kitAcik: blok("theme.css", "tamga:kit-acik"),
  kitKoyu: blok("kit.css", "tamga:kit-koyu"),
});

/* ---- renk matematiği ---- */

const kanal = (hex) => {
  const s = hex.replace("#", "");
  const n = s.length === 3 ? [...s].map((c) => c + c).join("") : s.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
};
const dogrusal = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const parlaklik = (hex) => {
  const [r, g, b] = kanal(hex).map(dogrusal);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const hexMi = (v) => typeof v === "string" && /^#[0-9a-fA-F]{3,8}$/.test(v);

/** WCAG kontrast oranı. */
export function oran(a, b) {
  const [ust, alt] = [parlaklik(a), parlaklik(b)].sort((x, y) => y - x);
  return (ust + 0.05) / (alt + 0.05);
}

/** CIE L* — algısal açıklık. İki yüzeyin AYRI okunup okunmadığı bununla
    ölçülüyor; kontrast oranı metin içindir, yüzey için değil. */
export function acikligi(hex) {
  const y = parlaklik(hex);
  return y > 216 / 24389 ? 116 * Math.cbrt(y) - 16 : (y * 24389) / 27;
}

export const dL = (a, b) => Math.abs(acikligi(a) - acikligi(b));
