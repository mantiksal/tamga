#!/usr/bin/env node
/**
 * Ölçek kontrolü — kitin ve doküman sitesinin kendi ölçeğine uyup uymadığı.
 *
 * NEDEN VAR. Ürün (`dashboard-v5`) bu guard'ı yıllardır taşıyor ve gerekçesi
 * orada yazılı: aynı ihlal incelemede dört kez elle yakalandı (`p-[10px]`,
 * `p-[8px]`, `w-[76px]`, `text-[11px]`) ve her seferinde başka bir dosyaya
 * yayılmış hâlde bulundu.
 *
 * KİTİN KENDİSİNDE YOKTU. Ve yokluğu ölçüldü: bu betik yazıldığında kitte
 * `text-[10px]` duruyordu — üstelik `--text-micro` ADIYLA ölçekte zaten
 * vardı. Uydurmak değil, bakmamak hatasıydı; ve tam da guard'ın yakaladığı şey
 * bu. Doküman sitesinde de on beş yerde `text-[15px]` vardı, `--docs-small`
 * dururken.
 *
 * ÖLÇÜT: köşeli ayraçla yazılmış her boyut/boşluk/yarıçap/tip değeri ihlaldir.
 * Ölçek adımına EŞİT olsa bile — `p-[8px]` ile `p-2` aynı pikseli çizer ama
 * sistemin dışına çıkar, ve bir sonraki kişinin `p-[9px]`'i aynı derecede
 * normal görünür.
 *
 * SERBEST OLANLAR:
 *   - Token biçimi: `w-(--docs-wrap)`, `max-w-[var(--docs-measure)]`. Uydurulmuş
 *     bir sayı değil, adı olan bir karar.
 *   - Hareket: `duration-[var(--duration-base)]` — orada ham sayı zaten ayrı
 *     bir kuralın ihlali.
 *   - Varyant seçicileri: `data-[state=open]`, `[&_svg]`, `group-data-[…]`.
 *   - Izgara şablonları: `grid-cols-[minmax(0,14rem)_1fr]` — bir sayı değil,
 *     bir düzen tarifi.
 *
 * TEK İSTİSNA `text-[…]`. Tailwind'de `text-` hem punto hem renk demek, ve
 * ayracın içinde bir `var()` varken hangisi olduğunu ANLAYAMIYOR: renk seçiyor.
 * Yani `text-[var(--docs-small)]` `color: var(--docs-small)` üretiyor, o da
 * `color: 15px` demek. Geçersiz bir `var()` ikamesi CSS'te düşmez, `unset`
 * olur; renk kalıtsal olduğu için öğe rengini ANNESİNDEN alır. Sonuç: punto
 * hiç uygulanmaz, ve üstüne öğenin kendi rengi sessizce silinir. Sitede yirmi
 * yerde vardı; footer'daki GitHub ve npm bağlantıları bu yüzden mavi değil
 * mürekkep rengindeydi. Doğrusu `text-[length:var(--docs-small)]`.
 *
 * GERÇEK BİR İSTİSNA ÇIKARSA buraya bir izin listesi EKLEME; izin listeleri
 * sessizce çürür. Değeri `globals.css`'e token'ların yanına, neden ölçek dışı
 * olduğunu söyleyen bir yorumla koy ve token biçiminde kullan.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const ROOTS = [
  join(root, "packages", "ui", "src"),
  join(root, "apps", "docs", "src"),
];

/** Ölçek taşıyan utility'ler. `grid-cols` ve `duration` bilerek yok. */
const PROPS =
  "p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|" +
  "w|h|min-w|min-h|max-w|max-h|size|text|rounded|top|right|bottom|left|inset|leading|tracking";
const BRACKET = new RegExp(`(?<![\\w-])(?:${PROPS})-\\[([^\\]]+)\\]`, "g");

/** Uzunluk taşıyan token'lar: adında `color` geçmeyen `--docs-*` / `--home-*`
    ve kitin tip ölçeği. Bunlar `text-[…]` içinde `length:` öneki ister. */
const LENGTH_TOKEN = /var\(--(?!color-)(?:docs|home|text|row|space)-[a-z0-9-]+\)/;

/** Sabit renk — token dışı her hex ve rgb. */
const COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(/g;

const errors = [];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === "dist") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

for (const base of ROOTS) {
  for (const file of walk(base)) {
    const raw = readFileSync(file, "utf8");
    /* Yorumlar çıkarılıyor: bu dosyaların yorumları ihlalleri ANLATIYOR, ve
       bir guard'ın kendi açıklamasını suçlaması onu gürültüye çevirir. */
    const src = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    const rel = relative(root, file);

    for (const m of src.matchAll(BRACKET)) {
      const value = m[1];
      /* Token biçimi serbest — uydurulmuş sayı değil, adı olan bir karar. */
      if (/var\(|^--/.test(value)) {
        /* ...ama `text-[var(--x)]` renk olarak derlenir. Uzunluk taşıyan bir
           token oraya girmişse `length:` öneki şart. */
        if (/^text-\[var\(/.test(m[0]) && LENGTH_TOKEN.test(value)) {
          errors.push(`  ${rel}: ${m[0]} → text-[length:${value}] (punto olarak derlenmiyor)`);
        }
        continue;
      }
      /* `data-[state=open]` gibi seçiciler ve `[&_svg]` bu düzene uymaz ama
         yine de elenmeli: içinde `=` ya da `&` varsa bir ölçü değildir. */
      if (/[=&]/.test(value)) continue;
      errors.push(`  ${rel}: ${m[0]}`);
    }

    /* Renk taraması yalnız `className` ve `style` içinde: bir kod ÖRNEĞİ
       (tema sayfası, kullanıcıya "şunu yaz" diyen blok) hex içerebilir ve
       içermeli. */
    for (const m of src.matchAll(/(?:className|style)=\{?[^}\n]*/g)) {
      for (const c of m[0].matchAll(COLOR)) {
        errors.push(`  ${rel}: sabit renk ${c[0]}`);
      }
    }
  }
}

if (errors.length) {
  console.error("✗ Ölçek kontrolü başarısız — ölçeği olan bir yerde ölçek dışına çıkılmış:");
  console.error([...new Set(errors)].join("\n"));
  console.error(
    "\n  Değer gerçekten ölçek dışıysa globals.css'e bir token olarak, gerekçesiyle koy.",
  );
  process.exit(1);
}

console.log("✓ Kit ve doküman kendi ölçeklerinde — uydurulmuş boyut ya da sabit renk yok.");
