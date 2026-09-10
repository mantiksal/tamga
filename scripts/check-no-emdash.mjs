#!/usr/bin/env node
/**
 * KAPI: doküman sitesinin okunan metninde uzun tire (—) yok.
 *
 * NEDEN VAR. Bu bir stil tercihinden fazlası: uzun tire, cümlenin yapısını
 * yazarken düşünmemeyi mümkün kılıyor. İki yargıyı bir çizgiyle yan yana
 * koyduğunda aralarındaki ilişkiyi seçmemiş olursun; iki nokta "şu yüzden"
 * der, noktalı virgül "ve ayrıca" der, virgül "bu arada" der, nokta "bitti"
 * der. Tire hiçbirini demez. Sitede 348 tane vardı ve hepsi tek tek okundu:
 * kimi iki nokta, kimi noktalı virgül, kimi virgül oldu, bir kısmı da cümleyi
 * ikiye böldü. Bu kapı o işin geri alınmasını engelliyor.
 *
 * NEREYE BAKIYOR. İki yere: doküman sitesinin okunan metnine, ve deponun
 * markdown'larına (README · CLAUDE · docs). İkisi de OKUNUYOR; biri ziyaretçi
 * tarafından, öteki ekibe katılan kişi tarafından.
 *
 * KOD YORUMLARI TARANMIYOR: orada tire bir düşünce çizgisi, ve yorumu okuyan
 * kişi zaten yazarın kendisi. Yorumlar maskeleniyor (karakterler boşluğa
 * çevriliyor, satır/sütun korunuyor), geri kalan her şey metin sayılıyor.
 *
 * KISA ÇİZGİ SERBEST. Tablodaki "değer yok" damgası (–) bir noktalama değil,
 * bir işaret. Bu kapı yalnız U+2014'e bakıyor.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN = [join(ROOT, "apps/docs/src"), join(ROOT, "docs")];
const LOOSE = ["README.md", "CLAUDE.md", ".changeset/README.md"].map((f) => join(ROOT, f));
const EM = "—";

/** Yorum karakterlerini boşluğa çevirir; ofsetler bozulmaz. */
function maskComments(s) {
  const out = [...s];
  let i = 0, block = false;
  while (i < s.length) {
    if (block) {
      if (s.startsWith("*/", i)) { block = false; out[i] = out[i + 1] = " "; i += 2; continue; }
      if (s[i] !== "\n") out[i] = " ";
      i += 1; continue;
    }
    if (s.startsWith("/*", i)) { block = true; out[i] = out[i + 1] = " "; i += 2; continue; }
    if (s.startsWith("//", i)) {
      const j = s.indexOf("\n", i) === -1 ? s.length : s.indexOf("\n", i);
      for (let k = i; k < j; k++) out[k] = " ";
      i = j; continue;
    }
    i += 1;
  }
  return out.join("");
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(tsx?|json|mdx?)$/.test(name)) yield p;
  }
}

const hits = [];
const files = [...SCAN.flatMap((d) => [...walk(d)]), ...LOOSE];
for (const file of files) {
  const raw = readFileSync(file, "utf8");
  if (!raw.includes(EM)) continue;
  const masked = /\.(tsx?|mjs)$/.test(file) ? maskComments(raw) : raw;
  masked.split("\n").forEach((line, n) => {
    if (line.includes(EM)) hits.push(`${relative(ROOT, file)}:${n + 1}  ${raw.split("\n")[n].trim()}`);
  });
}

if (hits.length) {
  console.error(`check-no-emdash: okunan metinde ${hits.length} uzun tire var.\n`);
  for (const h of hits) console.error("  " + h);
  console.error(
    "\nTireyi kaldır ve yerine ilişkiyi söyleyen işareti koy:" +
      "\n  :  açıklama getiriyorsa      ;  iki bağımsız yargıyı ayırıyorsa" +
      "\n  ,  ara söz ya da bağlaçsa    .  aslında yeni bir cümleyse",
  );
  process.exit(1);
}
console.log("✓");
