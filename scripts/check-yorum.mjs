#!/usr/bin/env node
/**
 * KAPI: kodda bir yorum bloğu altı düzyazı satırını geçmiyor.
 *
 * NEDEN VAR. Bu depoda bir oturumda eklenen 3612 satırın 670'i yorumdu ve çoğu
 * "önce şöyleydi, şu kırıldı, sonra böyle yaptık" anlatısıydı. `CLAUDE.md`
 * ölçüyü zaten veriyor: bu paragraf silinse kod yanlış yazılır mı? Evet ise
 * kalır, hayır ama bilgi değerliyse taşınır. Kapı o ölçünün mekanik yarısı:
 * uzunluk. Bir tuzak iki satırda söylenir; altı satırı aşan bir blok anlatıya
 * kaçmıştır ve yeri `docs/gerekce/`.
 *
 * SAYILAN ŞEY DÜZYAZI. Açılış ve kapanış işaretleri, boş yıldız satırları ve
 * ayırıcı çizgiler ölçüye girmiyor: kural yorumun yer kaplamasını değil
 * anlatıya kaçmasını sınırlıyor.
 *
 * TEK MUAFİYET `TR:`. Prop JSDoc'ları ile token yorumları `extract-props` ve
 * `extract-tokens` ile doküman sitesine ÇIKIYOR, yani onlar yayınlanan metin;
 * silinirse sayfa boşalır. İkisi de iki dilli olmak zorunda (kapıları var), yani
 * `TR:` taşımak "bu yayınlanıyor"un mekanik karşılığı. Başka bir ignore listesi
 * YOK ve olmamalı: bir dosyayı muaf tutmak, kuralı o dosyada kapatmaktır.
 *
 * NE YAKALAMAZ: altı satıra sıkıştırılmış bir anlatı. O gözden geçirmenin işi.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "packages/ui/src");
const LIMIT = 6;

const dosyalar = [];
(function walk(dir) {
  for (const ad of readdirSync(dir)) {
    const p = join(dir, ad);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx|css)$/.test(ad)) dosyalar.push(p);
  }
})(SRC);

/** Bir bloğun düzyazı satırı: işaretler soyulduktan sonra metin kalanı. */
function duzyaziSayisi(satirlar) {
  return satirlar
    .map((l) => l.trim().replace(/^\/\*+|\*+\/$|^\*+|^\/\//g, "").trim())
    .filter((l) => l.length > 0 && !/^[-*=·_]+$/.test(l)).length;
}

const hatalar = [];
for (const dosya of dosyalar.sort()) {
  const rel = relative(ROOT, dosya);
  const satirlar = readFileSync(dosya, "utf8").split("\n");
  const css = dosya.endsWith(".css");
  let blok = null;
  let acik = false;

  const kapat = () => {
    if (!blok) return;
    const govde = satirlar.slice(blok.bas, blok.son + 1);
    const n = duzyaziSayisi(govde);
    if (n > LIMIT && !/\bTR:/.test(govde.join("\n"))) {
      hatalar.push(`  ${rel}:${blok.bas + 1}  ${n} düzyazı satırı (tavan ${LIMIT})`);
    }
    blok = null;
  };

  for (let i = 0; i < satirlar.length; i++) {
    const t = satirlar[i].trim();
    if (acik) {
      blok.son = i;
      if (t.includes("*/")) { acik = false; kapat(); }
      continue;
    }
    if (t.startsWith("/*") || t.startsWith("{/*")) {
      kapat();
      blok = { bas: i, son: i };
      if (t.includes("*/")) kapat();
      else acik = true;
      continue;
    }
    /* Ardışık `//` satırları TEK blok: üç ayrı satıra bölünmüş bir anlatı da
       anlatıdır, ve bölerek kapıdan geçmek kuralın etrafından dolaşmak olur. */
    if (!css && t.startsWith("//")) {
      if (blok && blok.son === i - 1) blok.son = i;
      else { kapat(); blok = { bas: i, son: i }; }
      continue;
    }
    kapat();
  }
  kapat();
}

if (hatalar.length) {
  console.error("✗ Yorum bloğu altı düzyazı satırını geçiyor:\n");
  for (const h of hatalar) console.error(h);
  console.error(
    `\n${hatalar.length} blok. Tuzağı kodda iki satırda söyle, anlatıyı ` +
      `docs/gerekce/ altındaki ilgili bölüme taşı ve koda "Gerekçe: <yol>" yaz.\n` +
      `Yayınlanan gerekçeler (prop JSDoc'u, token yorumu) muaf: onlar \`TR:\` taşıyor.`,
  );
  process.exit(1);
}

console.log(`✓ Yorumlar yerinde — ${dosyalar.length} dosya, altı satırı aşan blok yok.`);
