#!/usr/bin/env node
/**
 * Seçenek kapsama kontrolü.
 *
 * NEDEN VAR. `Tooltip` dört yerleşimi de destekliyordu — `top` · `right` ·
 * `bottom` · `left` — ve doküman sayfası yalnız varsayılanı gösteriyordu. Kimse
 * hata yapmamıştı; sayfa doğruydu, sadece EKSİKTİ. Ve eksikliği ancak biri
 * gözle fark edince ortaya çıktı.
 *
 * Aynı boşluk `ToastViewport`'un dört köşesinde de vardı. İkisi de tek tek
 * düzeltildi — ve tek tek düzeltmek, üçüncüsünü bulmayı yine göze bırakır.
 *
 * KURAL: bir prop sonlu bir seçenek kümesi sunuyorsa, o bileşenin sayfası
 * seçeneklerin hepsinden BAHSETMEK zorunda. Göstermek zorunda değil —
 * gösterildiğini kanıtlayamayız — ama adı geçmiyorsa okuyucunun o seçenekten
 * haberi olmaz, ve haberi olmayan bir seçenek var olmamakla aynı şeydir.
 *
 * NE YAKALAMAZ. Adı geçen ama örneği olmayan bir seçenek. Bu bilinçli bir
 * sınır: "gerçekten render edildi mi" sorusunu ancak tarayıcı cevaplar, ve bu
 * guard statik. Eksik olanı bulmak, hiçbir şey bulmamaktan iyi.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const propsPath = join(root, "apps", "docs", "src", "content", "props.json");
const pagesDir = join(root, "apps", "docs", "src", "app", "[lang]", "docs");

if (!existsSync(propsPath)) {
  console.error("✗ props.json yok — önce `pnpm run props`.");
  process.exit(1);
}
const props = JSON.parse(readFileSync(propsPath, "utf8"));
const docs = join(root, "apps", "docs");

/** `secondary · primary · ghost` → ["secondary","primary","ghost"] */
function options(type) {
  const parts = type.split("·").map((p) => p.trim());
  if (parts.length < 2) return null;
  /* Yalnız dizgi ve boolean birleşimleri. `string · undefined` ya da
     `ReactNode · null` bir seçenek kümesi değil. */
  const clean = parts.map((p) => p.replace(/^["']|["']$/g, ""));
  const ok = clean.every((p) => /^[a-z][a-z0-9-]*$/i.test(p));
  if (!ok) return null;
  /* `true · false` bir anahtar, seçenek listesi değil — Switch'in `on`'unu
     "her iki değeri de göster" diye zorlamak anlamsız. */
  if (clean.length === 2 && clean.includes("true") && clean.includes("false")) return null;
  /* İLKEL TİP ADLARI SEÇENEK DEĞİL. `string · number` bir tip birleşimidir:
     `Kpi.value` hem dizgi hem sayı alır, ama "sayfa `string`ten bahsetmiyor"
     demek anlamsız. Bu ayrım olmadan guard doğru sayfaları suçlar, ve yanlış
     suçlayan bir guard kapatılır. */
  const PRIMITIVE = new Set([
    "string", "number", "boolean", "undefined", "null", "unknown", "any",
    "void", "never", "object", "symbol", "bigint",
  ]);
  if (clean.some((p) => PRIMITIVE.has(p))) return null;
  const opts = clean.filter((p) => p !== "undefined" && p !== "null");
  return opts.length >= 2 ? opts : null;
}

/** slug ↔ bileşen adı: `score-ring` → `ScoreRing`. */
function componentOf(slug) {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

const errors = [];
const slugs = readdirSync(pagesDir).filter((d) => existsSync(join(pagesDir, d, "page.tsx")));

for (const slug of slugs) {
  const src = readFileSync(join(pagesDir, slug, "page.tsx"), "utf8");
  /* Sayfanın `Props of="X"` ile hangi bileşenleri gösterdiği — bir sayfa
     birden çok bileşen taşıyabilir (Card + CardHead). */
  const shown = [...src.matchAll(/<Props of="([A-Za-z]+)"/g)].map((m) => m[1]);
  const names = shown.length ? shown : [componentOf(slug)];

  for (const name of names) {
    for (const p of props[name] ?? []) {
      const opts = options(p.type);
      if (!opts) continue;
      const missing = opts.filter((o) => !new RegExp(`\\b${o}\\b`).test(src));
      if (missing.length) {
        errors.push(
          `  ${slug}: ${name}.${p.name} ${opts.length} seçenek sunuyor, sayfa ` +
            `${missing.length} tanesinden hiç bahsetmiyor — ${missing.join(" · ")}`,
        );
      }
    }
  }
}

if (errors.length) {
  console.error("✗ Seçenek kapsama kontrolü başarısız — okunmayan bir seçenek yok sayılır:");
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("✓ Her sonlu seçenek kümesinin tamamı dokümanda geçiyor.");

/* ---- BELGELENMEYEN DIŞA VURUM ----
 *
 * `Delta`, `CellActions` ve `StackedBarChart` kitten dışa veriliyordu ve
 * doküman sitesinde adları HİÇ GEÇMİYORDU. Üçüncüsü zararsızdı; `CellActions`
 * değil: kendisi bir `<td>` ve bir `<td>`nin içine konduğunda geçersiz HTML
 * üretiyor, tarayıcı içtekini dışarı atıyor, React hidrasyon hatası veriyor.
 * O tuzağı ancak kaynağı okuyan biri biliyor, ve kimse kaynağı okumuyor.
 *
 * Bu kapı sayfa İSTEMİYOR: adın bir yerde geçmesi yetiyor. Bir alt parça
 * ebeveyninin sayfasında anlatılabilir (`CardBody` `card`ta, `SkeletonRows`
 * `skeleton`da). İstediği tek şey, hiçbir dışa vurumun sessizce var olmaması.
 */
const dokumanMetni = (() => {
  let metin = "";
  const gez = (d) => {
    for (const f of readdirSync(d)) {
      const q = join(d, f);
      if (statSync(q).isDirectory()) gez(q);
      else if (/\.tsx?$/.test(f)) metin += readFileSync(q, "utf8");
    }
  };
  gez(join(docs, "src", "app"));
  return metin;
})();

const belgesiz = Object.keys(props).filter(
  (ad) => !new RegExp(`\\b${ad}\\b`).test(dokumanMetni),
);

if (belgesiz.length) {
  console.error("✗ Belgelenmeyen dışa vurum — adı doküman sitesinde hiç geçmiyor:\n");
  for (const ad of belgesiz) console.error(`  ${ad}`);
  console.error(
    "\nKendi sayfası şart değil: bir alt parça ebeveyninin sayfasında anlatılabilir.\n" +
      "İstenen tek şey, hiçbir dışa vurumun sessizce var olmaması.",
  );
  process.exit(1);
}
