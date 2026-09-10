#!/usr/bin/env node
/**
 * KAPI: kullanılan her `tamga-*` sınıfı gerçekten tanımlı.
 *
 * NEDEN VAR. Bu depo bu hatayı bir kez yaşadı ve pahalıya geldi:
 * `.tamga-btn-success` beş dosyada kullanıldı, hiçbir yerde TANIMLI DEĞİLDİ.
 * Hiçbir şey patlamadı; tarayıcı bilmediği bir sınıfı sessizce yok sayar, ve
 * düğme "yeşil olmamış" değil "biraz farklı" görünüyordu. Bir yazım hatasının
 * bir tasarım kararı gibi görünmesi, bu kod tabanındaki en sinsi hata türü.
 *
 * `extract-props.mjs` bu olayı kendi gerekçesinde anıyor ama ona karşı bir kapı
 * yoktu: olay anlatılıyordu, engellenmiyordu.
 *
 * NEREYE BAKIYOR. Yalnız SINIF BAĞLAMLARINA, dosyanın tamamına değil:
 * `className` değerleri, `cva()` çağrılarının gövdesi, ve `animation`
 * bildirimleri (`tamga-bar` bir sınıf değil bir `@keyframes` adı, ama aynı ad
 * alanında yaşıyor ve yanlış yazıldığında aynı biçimde sessizce kayboluyor).
 *
 * Bağlamla sınırlı olması ŞART. İlk sürüm her dizgiye bakıyordu ve seksen
 * yanlış alarm üretti: `from "tamga-ui"` paket adı, `storageKey = "tamga-theme"`
 * bir depolama anahtarı, `--tamga-delay` bir CSS değişkeni. Hiçbiri sınıf değil.
 * Yanlış suçlayan bir kapı kapatılır, ve kapatılan kapı hiç olmayan kapıdır.
 *
 * NE YAKALAMAZ. Tanımlı olduğu hâlde YANLIŞ olan bir sınıf, ve sınıf adını
 * parça parça kuran bir kod. Bu kapı yalnız "böyle bir şey var mı" diye
 * soruyor.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const CSS = [
  join(ROOT, "packages/ui/src/kit.css"),
  join(ROOT, "packages/ui/src/theme.css"),
];
const SCAN = [join(ROOT, "packages/ui/src"), join(ROOT, "apps/docs/src")];

/* 1 · Tanımlar.
   Simge TANIMI iki nokta üstündeki addır; `var(--x)` bir kullanımdır ve tanım
   sayılmaz, yoksa kapı kendi aradığı hatayı onaylardı. */
const defined = new Set();
const tokens = new Set();
for (const file of CSS) {
  const css = readFileSync(file, "utf8");
  for (const m of css.matchAll(/\.(tamga-[a-z0-9-]+)/g)) defined.add(m[1]);
  for (const m of css.matchAll(/@keyframes\s+(tamga-[a-z0-9-]+)/g)) defined.add(m[1]);
  for (const m of css.matchAll(/(--(?:color|radius)-[a-z0-9-]+)\s*:/g)) tokens.add(m[1]);
}

/** `open` konumundan eşleşen kapanışa. Dizgi ve yorum atlanır. */
function matchBrace(src, open) {
  const pairs = { "{": "}", "(": ")" };
  const close = pairs[src[open]];
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      i++;
      while (i < src.length && src[i] !== q) {
        if (src[i] === "\\") i++;
        i++;
      }
      continue;
    }
    if (c === src[open]) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

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

/** Sınıf adının geçebileceği bölgeler: [başlangıç, bitiş) çiftleri. */
function classRegions(src) {
  const regions = [];
  /* className="…" ya da className={…} */
  for (const m of src.matchAll(/\bclassName\s*=\s*/g)) {
    const at = m.index + m[0].length;
    const c = src[at];
    if (c === "{") {
      const end = matchBrace(src, at);
      if (end > 0) regions.push([at, end + 1]);
    } else if (c === '"' || c === "'") {
      const end = src.indexOf(c, at + 1);
      if (end > 0) regions.push([at, end + 1]);
    }
  }
  /* cva(...) gövdesi: hem taban sınıf hem varyant değerleri. */
  for (const m of src.matchAll(/\bcva\s*\(/g)) {
    const at = src.indexOf("(", m.index);
    const end = matchBrace(src, at);
    if (end > 0) regions.push([at, end + 1]);
  }
  /* animation: `tamga-bar …` */
  for (const m of src.matchAll(/\banimation\s*:[^,;\n]*/g)) {
    regions.push([m.index, m.index + m[0].length]);
  }
  return regions;
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.tsx?$/.test(name)) yield p;
  }
}

const hits = [];
let seen = 0;
for (const dir of SCAN) {
  for (const file of walk(dir)) {
    const raw = readFileSync(file, "utf8");
    if (!raw.includes("tamga-") && !/--(color|radius)-/.test(raw)) continue;
    const src = maskComments(raw);
    /* SİMGELER DOSYANIN TAMAMINDA aranıyor, sınıf bölgesinde değil: kitte
       simgelerin çoğu `style={{...}}` içinde ya da SVG özniteliğinde geçiyor.
       Sınıfta gereken daraltma burada gereksiz, çünkü `var(--...)` ve
       `-(--...)` başka hiçbir şeye benzemiyor: yanlış suçlama riski yok. */
    for (const m of src.matchAll(/(?:var\(\s*|-\()(--(?:color|radius)-[a-z0-9-]+)/g)) {
      /* Adı ŞABLONLA KURAN kod atlanıyor: `var(--color-chart-${i})` gibi.
         Kapının bildiği tek şey "böyle bir ad var mı"; yarım bir ad üstünde
         karar veremez, ve veremediği yerde susması gerekir. */
      if (src[m.index + m[0].length] === "$") continue;
      seen++;
      if (tokens.has(m[1])) continue;
      const line = src.slice(0, m.index).split("\n").length;
      hits.push(`${relative(ROOT, file)}:${line}  ${m[1]}`);
    }
    for (const [start, end] of classRegions(src)) {
      for (const m of src.slice(start, end).matchAll(/(?<![-\w])tamga-[a-z0-9-]+/g)) {
        seen++;
        if (defined.has(m[0])) continue;
        const line = src.slice(0, start + m.index).split("\n").length;
        hits.push(`${relative(ROOT, file)}:${line}  ${m[0]}`);
      }
    }
  }
}

if (hits.length) {
  console.error(`check-kit-class: tanımsız ${hits.length} sınıf/simge kullanılıyor.\n`);
  for (const h of hits) console.error("  " + h);
  console.error("\nYa kit.css/theme.css'te tanımla ya da adı düzelt: tarayıcı bunu sana söylemez.");
  process.exit(1);
}
console.log(`✓ ${seen} sınıf ve simge kullanımı denetlendi, hepsi tanımlı.`);
