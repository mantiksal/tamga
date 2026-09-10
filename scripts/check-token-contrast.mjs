#!/usr/bin/env node
/**
 * KONTRAST KAPISI — renk seçmek serbest, okunmayan renk değil.
 *
 * Bu kapı kitin VARSAYILAN paletini ölçüyor. Bir ürün token'ları ezerek kendi
 * markasını verdiğinde onun paleti kendi deposunda ölçülür; buradaki eşikler
 * o ölçümün de tarifidir.
 *
 * ÜÇ FARKLI SORU, ÜÇ FARKLI MATEMATİK — ve karıştırılırsa kapı yalan söyler:
 *
 *   metin okunuyor mu     WCAG kontrast oranı, eşik 4.5 (AA, gövde metni)
 *   yüzey ayrı mı duruyor CIE L* farkı — kontrast oranı yüzey için yanlış araç
 *   çizgi görünüyor mu    yine ΔL*, ama İKİ YANLI: görünür olacak, sert olmayacak
 *
 * YÜKSELMEYİ KENAR TAŞIYOR, DOLGU DEĞİL. Kitin kartı sayfadan yalnız 3.4 ΔL*
 * ayrı; kart yükselmiş okunuyor çünkü 1px kenarı ve sert ofseti var (13 Yasa 1).
 * O yüzden 10'luk taban --color-edge'e uygulanıyor, --color-shell'e değil.
 * Kaynaktaki not bunu zaten söylüyordu: eski kenar rengi #d9d6d1 sayfaya karşı
 * ΔL* 9.8 ölçülmüş ve tabanın altında kaldığı için koyulaştırılmış. Bu betik
 * o ölçümü 9.8 olarak yeniden üretiyor, yani aynı matematiği konuşuyor.
 *
 * ÖLÜ TOKEN ÖLÇÜLMÜYOR. theme.css'te bir `.rail-link` bloğu ve onu besleyen
 * --sidebar-* renkleri duruyor ama kit `.tamga-rail-link` çiziyor ve
 * --color-nav-* okuyor. Ölçülen şey EKRANA ÇIKAN şey; çıkmayan bir rengin
 * kontrastı bir kapıyı kırmamalı, o ayrı bir temizlik işi.
 */
import { bloklar, hexMi, oran, dL } from "./token-oku.mjs";

const AA = 4.5;
/** Bir yüzeyin YÜKSELMİŞ okunması için kenarının zeminden farkı. */
const KENAR_TABANI = 10;
/** Kural çizgisi: görünür olacak (alt), sert bir bölme olmayacak (üst). */
const CIZGI_BANDI = [4, 16];

/* Metin × zemin: hangi mürekkep hangi yüzeyin üstüne gerçekten düşüyor. */
const METIN = ["--color-ink", "--color-ink-soft", "--color-ink-faint"];
const ZEMIN = ["--color-page", "--color-shell", "--color-sunk", "--color-hover"];

/* Kendi zeminini taşıyan metin çiftleri. */
const CIFTLER = [
  ["--color-accent-ink", "--color-accent"],
  ["--color-accent-ink", "--color-accent-hover"],
  ["--color-accent-ink", "--color-accent-active"],
  ["--color-nav-idle", "--color-rail"],
  ["--color-nav-hover", "--color-nav-hover-bg"],
  ["--color-critical", "--color-shell"],
];

const { kitAcik, kitKoyu } = bloklar();
const hatalar = [];
let olcum = 0;

function olc(tema, t) {
  const oku = (ad) => {
    const v = t.get(ad);
    return hexMi(v) ? v : null;
  };

  for (const m of METIN) {
    for (const z of ZEMIN) {
      const [a, b] = [oku(m), oku(z)];
      if (!a || !b) continue;
      olcum++;
      const r = oran(a, b);
      if (r < AA) hatalar.push(`${tema}: ${m} (${a}) / ${z} (${b}) = ${r.toFixed(2)}, AA ${AA} altında`);
    }
  }

  for (const [m, z] of CIFTLER) {
    const [a, b] = [oku(m), oku(z)];
    if (!a || !b) continue;
    olcum++;
    const r = oran(a, b);
    if (r < AA) hatalar.push(`${tema}: ${m} (${a}) / ${z} (${b}) = ${r.toFixed(2)}, AA ${AA} altında`);
  }

  for (const z of ["--color-page", "--color-shell"]) {
    const [k, b] = [oku("--color-edge"), oku(z)];
    if (!k || !b) continue;
    olcum++;
    const d = dL(k, b);
    if (d < KENAR_TABANI) {
      hatalar.push(
        `${tema}: --color-edge (${k}) / ${z} (${b}) = ΔL* ${d.toFixed(1)}, ` +
          `${KENAR_TABANI} tabanının altında — yükselmiş yüzey yükselmiş okunmuyor`,
      );
    }
  }

  for (const z of ["--color-page", "--color-shell"]) {
    const [c, b] = [oku("--color-line"), oku(z)];
    if (!c || !b) continue;
    olcum++;
    const d = dL(c, b);
    const [alt, ust] = CIZGI_BANDI;
    if (d < alt) hatalar.push(`${tema}: --color-line / ${z} = ΔL* ${d.toFixed(1)}, ${alt} altında — çizgi görünmüyor`);
    if (d > ust) hatalar.push(`${tema}: --color-line / ${z} = ΔL* ${d.toFixed(1)}, ${ust} üstünde — çizgi sert bir bölmeye dönüşmüş`);
  }
}

olc("açık", kitAcik);
olc("koyu", kitKoyu);

if (hatalar.length) {
  console.error("✗ Kontrast eşikleri karşılanmıyor:\n");
  for (const h of hatalar) console.error("  " + h);
  console.error(
    `\nEşikler: metin WCAG ${AA} (AA gövde metni) · kenar ΔL* ${KENAR_TABANI} ·` +
      ` kural çizgisi ΔL* ${CIZGI_BANDI[0]}-${CIZGI_BANDI[1]}.\n` +
      "Bir eşiği gevşetmek bir karardır: önce docs/tema'daki cümleyi değiştir, sonra sayıyı.",
  );
  process.exit(1);
}

console.log(`✓ Kontrast tamam — ${olcum} ölçüm, iki tema, metin AA ${AA} üstünde.`);
