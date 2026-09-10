#!/usr/bin/env node
/**
 * Palet üreticisi kapısı.
 *
 * NEDEN VAR. Üretici bir formül değil bir ARAMA: her ton için açıklık, eşiği
 * tutturana kadar ölçülerek bulunuyor. Bir formül düzeltmesi bugün doğru
 * olabilir ve başka bir tonda yanlış olur — ve yanlışlığı ancak o markanın
 * paneli kurulunca görülür. Kapı ton çemberini tarayıp her birini ölçüyor.
 *
 * OTUZ ALTI TON, iki tema, on bir ölçüm: 792 ölçüm. Hepsi geçmezse build durur.
 * Ayrıca `check-token-contrast` ile AYNI eşikler kullanılıyor; ikisi ayrışırsa
 * elle kurulmuş palet ile üretilen palet farklı kurallara tabi olurdu.
 */
import { paletUret, paletiOlc } from "../packages/ui/dist/lib/palette.js";
import { oklchHex } from "../packages/ui/dist/lib/color.js";

const tonlar = Array.from({ length: 36 }, (_, i) => ({
  ad: `${i * 10}°`,
  hex: oklchHex({ l: 0.58, c: 0.15, h: i * 10 }),
}));
/* Gerçek markalar da listede: doygunluğu düşük ve çok yüksek uçlar. */
tonlar.push(
  { ad: "bugünkü mavi", hex: "#2069c9" },
  { ad: "soluk gri-mavi", hex: "#64748b" },
  { ad: "çok doygun mor", hex: "#7c3aed" },
  { ad: "sarı", hex: "#eab308" },
);

const hatalar = [];
let olcum = 0;
for (const { ad, hex } of tonlar) {
  const cift = paletUret(hex);
  for (const [tema, palet] of [["açık", cift.light], ["koyu", cift.dark]]) {
    for (const o of paletiOlc(palet)) {
      olcum++;
      if (!o.gecti) {
        hatalar.push(
          `  ${ad} · ${tema} · ${o.ad}: ${o.deger} (eşik ${o.tur === "oran" ? "≥" : "ΔL* ≥"} ${o.esik})`,
        );
      }
    }
  }
}

if (hatalar.length) {
  console.error("✗ Palet üreticisi eşiği tutturamıyor:\n");
  for (const h of hatalar) console.error(h);
  console.error(`\n${hatalar.length} / ${olcum} ölçüm başarısız.`);
  process.exit(1);
}
console.log(`✓ Palet üreticisi tamam — ${tonlar.length} ton, iki tema, ${olcum} ölçüm.`);
