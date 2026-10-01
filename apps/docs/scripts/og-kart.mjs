import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Paylaşım kartının (`og:image`) kaynağı · 1200x630.
 *
 * KART TARAYICIDA ÇİZİLİP PNG'YE ALINIYOR, `next/og` ile üretilmiyor: Satori
 * woff2 okumuyor ve kitin üç yüzü de woff2. Jenerik bir yüzle çizilen bir kart,
 * tipografisini kendi satan bir sistemin vitrinine yakışmıyor.
 *
 * Yeniden üretmek için (her dil ayrı):
 *   node apps/docs/scripts/og-kart.mjs tr > /tmp/og-tr.html
 *   chrome --headless --screenshot=apps/docs/public/og-tr.png \
 *          --window-size=1200,630 --default-background-color=0 /tmp/og-tr.html
 */

const kok = fileURLToPath(new URL("../../../", import.meta.url));
const SAYILAR = JSON.parse(readFileSync(new URL("../src/content/counts.json", import.meta.url), "utf8"));

/* TOKEN'LAR SAYFAYA GÖMÜLÜYOR, bağlanmıyor: `theme.css` Tailwind kaynağı
   (`@theme static`), yani tarayıcı onu okuduğunda tek bir değişken tanımlamıyor.
   Blok adı `:root`a çevrilince aynı dosya düz CSS oluyor ve açık palet geliyor;
   koyu değerler `.dark` altında, kart onları hiç istemiyor. */
const TOKENLAR = readFileSync(new URL("../../../packages/ui/dist/theme.css", import.meta.url), "utf8")
  .replace(/@custom-variant[^;]*;/g, "")
  .replace(/@theme (static|inline) \{/g, ":root {");

const METIN = {
  tr: {
    baslik: "Yönetim panelleri için<br>açık kaynak tasarım sistemi",
    alt: `${SAYILAR.bilesen} bileşen · ${SAYILAR.token} token · ${SAYILAR.ikon} ikon · MIT`,
  },
  en: {
    baslik: "An open source design system<br>for admin panels",
    alt: `${SAYILAR.bilesen} components · ${SAYILAR.token} tokens · ${SAYILAR.ikon} icons · MIT`,
  },
};

const lang = process.argv[2] === "en" ? "en" : "tr";
const t = METIN[lang];

process.stdout.write(`<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="file://${kok}packages/ui/dist/fonts.css">
<style>
${TOKENLAR}
</style>
<style>
  /* Ölçü kartın kendisi: 1200x630 dışında bir piksel yok. */
  html, body { margin: 0; width: 1200px; height: 630px; }
  body {
    display: flex; flex-direction: column; justify-content: space-between;
    box-sizing: border-box; padding: 72px;
    background: var(--color-page); color: var(--color-ink);
    font-family: var(--font-sans);
  }
  .ust { display: flex; align-items: center; justify-content: space-between; }
  .logo { height: 64px; }
  /* Sürüm rozeti kitin kendi fiziğinde: kenar, ve 3px kaymış gölge. */
  .surum {
    display: inline-flex; align-items: center; height: 40px; padding: 0 16px;
    border: 1.5px solid var(--color-edge-strong); border-radius: var(--radius-ctl);
    background: var(--color-shell); box-shadow: 3px 3px 0 var(--color-accent-shadow);
    font-family: var(--font-mono); font-size: 20px; font-weight: 700; color: var(--color-ink);
  }
  h1 {
    margin: 0; font-family: var(--font-display); font-weight: 800;
    font-size: 64px; line-height: 1.08; letter-spacing: -0.02em; color: var(--color-ink);
  }
  .alt { display: flex; align-items: baseline; justify-content: space-between; }
  .sayilar { font-family: var(--font-mono); font-size: 22px; color: var(--color-ink-soft); }
  .adres { font-size: 24px; font-weight: 700; color: var(--color-accent); }
</style>
</head>
<body>
  <div class="ust">
    <img class="logo" src="file://${kok}apps/docs/public/tamga-light.svg" alt="">
    <span class="surum">v${SAYILAR.surum}</span>
  </div>
  <h1>${t.baslik}</h1>
  <div class="alt">
    <span class="sayilar">${t.alt}</span>
    <span class="adres">tamga.org.tr</span>
  </div>
</body>
</html>
`);
