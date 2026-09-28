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
import { readFileSync } from "node:fs";
import { bloklar, hexMi, oran, dL } from "./token-oku.mjs";

const AA = 4.5;
/** Bir yüzeyin YÜKSELMİŞ okunması için kenarının zeminden farkı. */
const KENAR_TABANI = 10;
/** Kural çizgisi: görünür olacak (alt), sert bir bölme olmayacak (üst). */
const CIZGI_BANDI = [4, 16];
/** Bir zeminin üstündeki ikinci zemin "değişti" diye okunsun: en az fark. */
const VURGU_TABANI = 2;
/* GLİF METİN DEĞİL. Bir ikon grafik bir nesne, ve WCAG onun için 3.0 diyor ·
   metnin 4.5'i bir HARFİN okunması için, bir şeklin seçilmesi için değil. Ayrı
   bir eşik olmasaydı ya glif listesi hiç ölçülmezdi ya da metin eşiği kalıp
   tonların yarısı düşerdi. */
const ISARET = 3;

/* Karonun üstündeki glif · ÇİFTLER `tone.ts`TEN OKUNUYOR, buraya elle
   yazılmıyor. İlk hâli elle yazılmıştı ve kâğıt bir kapıydı: `tone.ts`teki
   eşleşme bozulduğunda kapı yine geçiyordu, çünkü ölçtüğü şey kaynağın
   kullandığı çift değil kendi listesiydi · kasıtlı bir ihlalle görüldü. */
const ISARETLER = (() => {
  const src = readFileSync(new URL("../packages/ui/src/components/tone.ts", import.meta.url), "utf8");
  const govde = src.slice(src.indexOf("export const tones"));
  return [...govde.matchAll(/mark:\s*"var\((--[a-z0-9-]+)\)"[\s\S]{0,200}?markInk:\s*"var\((--[a-z0-9-]+)\)"/g)].map(
    (m) => [m[2], m[1]],
  );
})();

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
  /* DURUM RENGİ KENDİ YIKAMASININ ÜSTÜNDE. Buraya kadar denetlenmiyordu ve bir
     ton eklendiğinde kapı sessizce geçiyordu: tek denetlenen durum çifti
     critical/shell'di. Oysa bir çip, bir satır ve bir bildirim tonu kendi
     yıkamasının üstüne koyuyor — okunması gereken asıl zemin o. */
  ["--color-critical", "--color-critical-bg"],
  /* DOLU kritik plaka: yıkama metin taşımıyor ama dolu kırmızı taşıyor, ve
     kırmızı koyu temada açık somona dönüyor — beyaz orada 2.15'e düşüyordu.
     Çift burada durmazsa dönüş bir daha sessizce yapılabilir. */
  ["--color-critical-ink", "--color-critical"],
  ["--color-warn", "--color-warn-bg"],
  ["--color-resolved", "--color-resolved-bg"],
  ["--color-info", "--color-info-bg"],
  ["--color-elevated", "--color-elevated-bg"],
  ["--color-silent", "--color-silent-bg"],
  /* TERS YÜZEY: iki temada da koyu kalan tek yüzey (bildirim). Ton işaretleri
     orada bir kez düşmüştü (kritik 2.79, bilgi 1.99) ve bu ölçümler yorumda
     duruyordu, kapıda değil · yani aynı düşüş ikinci kez sessizce olabilirdi. */
  ["--color-inverse-ink", "--color-inverse"],
  ["--color-critical-inverse", "--color-inverse"],
  ["--color-warn-inverse", "--color-inverse"],
  ["--color-resolved-inverse", "--color-inverse"],
  ["--color-info-inverse", "--color-inverse"],
  ["--color-silent-inverse", "--color-inverse"],
  ["--color-elevated-inverse", "--color-inverse"],
  /* Bu çift zaten `--color-silent`in yorumunda ölçülmüş ve bir kez düşmüştü
     (4.41). Ölçümün yorumda durup kapıda durmaması, aynı düşüşün ikinci kez
     sessizce olabileceği anlamına geliyordu. */
  ["--color-silent", "--color-chart-fill"],
  /* KİP PLAKASI · duyuru şeridindeki "TEST MODU". İki temada da sabit bir çift
     (koyu zemin, sarı yazı) ve tam bu yüzden ölçülüyor: sabit çiftleri hiçbir
     kapı kontrol etmiyor, `check-tema-cifti` yalnız KARIŞIK olanlara bakıyor. */
  ["--color-warning", "--color-inverse"],
  /* SABİT BORDO PLAKA · tehlike ikon düğmesi. Zemin iki temada aynı, mürekkep
     bir süre `--color-page` idi ve koyu temada 2.96'ya düşüyordu. Çift burada
     durmazsa aynı dönüş ikinci kez sessizce yapılabilir. */
  ["--color-inverse-ink", "--color-critical-mark"],
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

  for (const [m, z] of ISARETLER) {
    const [a, b] = [oku(m), oku(z)];
    if (!a || !b) continue;
    olcum++;
    const r = oran(a, b);
    if (r < ISARET) {
      hatalar.push(`${tema}: ${m} (${a}) / ${z} (${b}) = ${r.toFixed(2)}, işaret eşiği ${ISARET} altında`);
    }
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

  /* HOVER ZEMİNİ RAYIN ÜSTÜNDE GÖRÜNÜYOR MU. Bir okunurluk değil GÖRÜNÜRLÜK
     ölçüsü: burada metin yok, yalnız iki zemin var, ve soru "değişti mi" diye
     okunuyor mu. 2026-09-24'te ray kendi basamağına indi ve bu çift ΔL* 0.1'e
     düştü — rayda fareyle gezinmek hiçbir şey göstermiyordu, hiçbir kapı da
     görmüyordu. Taban `measurePalette`taki ile aynı: 2.0. */
  {
    const [k, b] = [oku("--color-nav-hover-bg"), oku("--color-rail")];
    if (k && b) {
      olcum++;
      const d = dL(k, b);
      if (d < VURGU_TABANI) {
        hatalar.push(
          `${tema}: --color-nav-hover-bg (${k}) / --color-rail (${b}) = ΔL* ${d.toFixed(1)}, ` +
            `${VURGU_TABANI} tabanının altında — rayda hover görünmüyor`,
        );
      }
    }
  }

  /* GÖMÜLÜ YÜZEY ZEMİNİNDEN AYRILIYOR MU. Hover/ray çiftiyle aynı soru ve aynı
     taban: metin yok, iki zemin var, "değişti mi" diye okunuyor mu. Koyu temada
     --color-sunk sayfadan ΔL* 1.1 ayrılıyordu (açıkta 7.3) — filtre çubuğu, tablo
     başlığı ve iskelet sayfanın üstünde YOKTU, ve hiçbir kapı görmüyordu; iskelet
     nefesinin dibinde tümden kayboluyordu.
     Gerekçe: docs/gerekce/10-kit-css.md */
  for (const z of ["--color-page", "--color-shell"]) {
    const [k, b] = [oku("--color-sunk"), oku(z)];
    if (!k || !b) continue;
    olcum++;
    const d = dL(k, b);
    if (d < VURGU_TABANI) {
      hatalar.push(
        `${tema}: --color-sunk (${k}) / ${z} (${b}) = ΔL* ${d.toFixed(1)}, ` +
          `${VURGU_TABANI} tabanının altında — gömülü yüzey zemininden ayrılmıyor`,
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
