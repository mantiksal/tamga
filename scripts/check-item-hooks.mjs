#!/usr/bin/env node
/**
 * KAPI: liste alan bir bileşenin ÖĞESİ kanca taşır.
 *
 * NEDEN VAR. Bu asimetri üç kez ayrı ayrı bulundu ve üçü de ayrı bir sürüme mal
 * oldu: `Segmented` taşıyordu, `Steps` taşımıyordu (0.4.0'da düzeltildi);
 * `RadioGroup` da taşımıyordu ama kimse o sırada sormadı (0.4.1); sonra bir
 * tarama kalan onu birden gösterdi (0.4.2).
 *
 * Belirti her seferinde aynıydı: kanca olmayınca tüketici BİLEŞENİ BIRAKIP
 * sınıfı elle yazıyor — ve rolü, klavyeyi, sarmalayıcıyı da bırakıyor. Yani bu
 * bir kolaylık eksiği değil, ADR-0012 ihlallerinin kaynağı.
 *
 * Kapı o yüzden var: bir sonraki liste alan bileşen eklendiğinde soru
 * SORULMASIN, cevap zorunlu olsun.
 *
 * NE YAKALAR: `options`/`items`/`steps`/`nav`/`entries`/`tabs` gibi bir liste
 * alan ve öğe başına bir eleman çizen bir bileşenin öğe tipinde
 * `Record<string, unknown>` yoksa hata.
 *
 * MUAF OLANLAR listede ve her birinin sebebi yazılı. Bir muafiyetin gerekçesi
 * kısıtın kendisi olamaz ("bileşen bunu almıyor" bir sebep değil, yapılacak iş).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const KOK = new URL("..", import.meta.url).pathname;
const KAYNAK = join(KOK, "packages/ui/src");
const LISTE = /\b(options|items|steps|nav|entries|tabs)\s*:\s*readonly\b/g;

/* Öğesi bir DOM elemanı OLMAYAN listeler. Kanca takılacak bir şey yok. */
const MUAF = new Map([
  ["LineChart.series", "çizilen bir eğri, öğe başına eleman yok; `series` zaten veri dizisi taşıyor"],
  ["PieChart.slices", "aynı sebep: dilim bir `path`, ve `slices` veri"],
  ["StackedBarChart.series", "aynı sebep"],
]);

function* gez(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) yield* gez(p);
    else if (/\.tsx$/.test(n) && !n.includes(".test.")) yield p;
  }
}

/**
 * Takma adların tanımı.
 *
 * SON `;` DERİNLİK SIFIRDA ARANIYOR, ve kapı bunu kendi üstünde öğrendi: ilk
 * hâli tembel bir `([\s\S]*?);` kullanıyordu ve tipi NESNENİN İÇİNDEKİ ilk
 * `;`de kesiyordu (`{ hex: string;` gibi). Sonuç, gövdenin sonundaki
 * `& Record<string, unknown>` parçasını hiç görmemekti: düzeltilmiş dört
 * bileşeni düzeltilmemiş sanıyordu.
 */
function takmaAdlar() {
  const harita = {};
  for (const f of gez(KAYNAK)) {
    const s = readFileSync(f, "utf8");
    for (const m of s.matchAll(/export type (\w+)(?:<[^>]*>)?\s*=\s*/g)) {
      let i = m.index + m[0].length, derinlik = 0, son = i;
      while (i < s.length) {
        const c = s[i];
        if ("{([<".includes(c)) derinlik++;
        else if ("})]>".includes(c)) derinlik--;
        else if (c === ";" && derinlik <= 0) { son = i; break; }
        i++;
      }
      harita[m[1]] = s.slice(m.index, son).replace(/\s+/g, " ");
    }
  }
  return harita;
}

const takma = takmaAdlar();
const hatalar = [];
let bakilan = 0;

for (const dosya of gez(KAYNAK)) {
  const src = readFileSync(dosya, "utf8");
  for (const parca of src.split(/(?=\nexport function )/)) {
    const ad = parca.match(/^\nexport function (\w+)/)?.[1];
    if (!ad) continue;
    for (const m of parca.matchAll(LISTE)) {
      /* Bildirimin sonu: derinlik sıfırda gelen ilk `;`. */
      let i = m.index + m[0].length, derinlik = 0, son = i;
      while (i < parca.length) {
        const c = parca[i];
        if ("{([<".includes(c)) derinlik++;
        else if ("})]>".includes(c)) derinlik--;
        else if (c === ";" && derinlik <= 0) { son = i; break; }
        i++;
      }
      let tip = parca.slice(m.index, son).replace(/\s+/g, " ");
      const takmaAd = tip.match(/readonly (\w+)(?:<[^>]*>)?\[\]/)?.[1];
      if (takmaAd && takma[takmaAd]) tip += " " + takma[takmaAd];

      const anahtar = `${ad}.${m[1]}`;
      bakilan++;
      if (MUAF.has(anahtar)) continue;
      if (/Record<string, unknown>/.test(tip)) continue;
      hatalar.push(`  ${relative(KOK, dosya)}  ${anahtar}`);
    }
  }
}

if (hatalar.length) {
  console.error(`check-item-hooks: ${hatalar.length} listede öğe kanca taşımıyor.\n`);
  for (const h of hatalar) console.error(h);
  console.error(
    "\n  Öğe tipine `& Record<string, unknown>` ekle, gövdede bilinen alanları\n" +
      "  ayırıp kalanı öğenin kendi elemanına yay. KİTİN KENDİ NİTELİKLERİ SONRA\n" +
      "  yazılmalı, yoksa bir kanca `aria-selected` gibi bir şeyi ezer.\n\n" +
      "  Öğesi bir eleman çizmiyorsa (bir grafik serisi gibi) betikteki MUAF\n" +
      "  listesine sebebiyle ekle.\n",
  );
  process.exit(1);
}
console.log(`✓ Öğe kancaları — ${bakilan} liste denetlendi, hepsi öğesine kanca geçiriyor.`);
