#!/usr/bin/env node
/**
 * Doküman sitesinin dil bütünlüğü.
 *
 * Bir doküman sitesinde en kolay yalan, çevrilmemiş bir sayfayı öteki dilde
 * sessizce göstermektir. Okuyucu İngilizce bir menüden girer, Türkçe bir sayfa
 * bulur ve sitenin bozuk olduğunu düşünür — kimse hata görmez, kimse bildirmez.
 *
 * Bu guard iki yönde de yalanı imkânsız kılar:
 *
 *   ① `TRANSLATED` listesindeki her sayfada GERÇEKTEN iki dilli bir `T` bloğu
 *      olacak — hem `tr:` hem `en:`. Listeye bir slug eklemek, çeviriyi
 *      yazmadan mümkün değil.
 *   ② Listede OLMAYAN her sayfa `<Untranslated />` gösterecek. Çevrilmemiş bir
 *      sayfa bunu kendisi söyler; sessiz kalamaz.
 *
 * Ayrıca: her sözlük anahtarı iki dilde de bulunacak. v1'in i18n'i tam olarak
 * buradan çürümüştü — bir dilde olup ötekinde olmayan anahtar, yalnız o dili
 * kullanan kişinin gördüğü boş bir metindir.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "apps", "docs");
const pagesDir = join(docs, "src", "app", "[lang]", "docs");

if (!existsSync(pagesDir)) {
  console.log("✓ Doküman sitesi yok — kontrol atlandı.");
  process.exit(0);
}


/* ---- Kırık iç bağlantı ----
 *
 * `<Xref to="confirm-dialog">` diye bir bağlantı vardı ve o slug hiç yoktu:
 * ConfirmDialog `dialog` sayfasında belgeleniyor. Sayfa 404 vermiyor, bağlantı
 * yalnız hiçbir yere gitmiyordu, ve doküman derlenmediği için kimse görmedi.
 * Dört kullanımı da aynı yanlış slugu taşıyordu, yani bir kez yazılıp
 * kopyalanmıştı; bir kapı olmadan bu tam olarak böyle çoğalıyor.
 */
function kirikXrefler(slugSeti) {
  const bulunan = [];
  const gez = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) gez(p);
      else if (/\.tsx?$/.test(f)) {
        const src = readFileSync(p, "utf8");
        for (const m of src.matchAll(/<Xref to="([^"]+)"/g)) {
          if (!slugSeti.has(m[1])) bulunan.push(`${relative(root, p)} → "${m[1]}"`);
        }
        /* ELLE YAZILAN `href` DE BİR BAĞLANTI. Kapı yalnız `<Xref>`e bakıyordu
           ve açılış sayfası yolu şablon dizgisiyle yazıyordu
           (`/${lang}/docs/kurulum`): slug'lar İngilizceye geçtiğinde `<Xref>`ler
           taşındı, o üç satır kaldı, ve sitenin ANA SAYFASINDAKİ "Kuruluma
           başla" düğmesi 404 verdi. Bir kapının kör noktası, tam olarak
           kimsenin bakmadığı yerdir. */
        for (const m of src.matchAll(/\/docs\/([a-z0-9-]+)/g)) {
          if (!slugSeti.has(m[1])) bulunan.push(`${relative(root, p)} → /docs/${m[1]}`);
        }
      }
    }
  };
  gez(join(docs, "src"));
  return bulunan;
}

const errors = [];

/* ---- Çeviri listesi ---- */
const listSrc = readFileSync(join(docs, "src", "content", "translated.ts"), "utf8");
const listed = new Set(
  [...(listSrc.match(/TRANSLATED: readonly string\[\] = \[([^\]]*)\]/s)?.[1] ?? "").matchAll(/"([^"]+)"/g)].map(
    (m) => m[1],
  ),
);

const slugs = readdirSync(pagesDir).filter((d) => existsSync(join(pagesDir, d, "page.tsx")));

for (const slug of slugs) {
  const src = readFileSync(join(pagesDir, slug, "page.tsx"), "utf8");
  const claimsTranslated = listed.has(slug);

  /* Gövde metni iki dilli mi? `T` bloğunda hem tr hem en anahtarı olmalı. */
  const hasBilingual = /const T = \{[\s\S]*?\btr:\s*\{/.test(src) && /const T = \{[\s\S]*?\ben:\s*\{/.test(src);
  const showsNotice = src.includes("<Untranslated />");

  if (claimsTranslated && !hasBilingual) {
    errors.push(
      `  ${slug}: TRANSLATED listesinde ama iki dilli bir \`T\` bloğu yok — liste gerçeği yansıtmıyor.`,
    );
  }
  if (!claimsTranslated && !showsNotice) {
    errors.push(
      `  ${slug}: çevrilmemiş ama <Untranslated /> göstermiyor — İngilizce okuyan kişi Türkçe metni sebepsiz görür.`,
    );
  }
  if (claimsTranslated && showsNotice) {
    errors.push(`  ${slug}: çevrilmiş ama hâlâ <Untranslated /> gösteriyor — uyarı kaldırılmalı.`);
  }
}

/* ---- Sözlük paritesi ---- */
function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}
const dictDir = join(docs, "src", "i18n", "dictionaries");
const dicts = Object.fromEntries(
  readdirSync(dictDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => [f.replace(".json", ""), flatten(JSON.parse(readFileSync(join(dictDir, f), "utf8")))]),
);
const [base, ...rest] = Object.keys(dicts);
for (const other of rest) {
  for (const key of dicts[base]) {
    if (!dicts[other].includes(key)) errors.push(`  sözlük: "${key}" ${base}'de var, ${other}'de yok.`);
  }
  for (const key of dicts[other]) {
    if (!dicts[base].includes(key)) errors.push(`  sözlük: "${key}" ${other}'de var, ${base}'de yok.`);
  }
}

/* Slug kümesi: nav'daki her bileşen ve kavram sayfası. */
const navSrc = readFileSync(join(docs, "src", "content", "nav.ts"), "utf8");
const slugSeti = new Set([...navSrc.matchAll(/\b[ck]\(\s*\n?\s*"([a-z0-9-]+)"/g)].map((m) => m[1]));
/* ---- Yerelleştirilmiş yol haritası ----
 *
 * Her sayfanın her dilde bir genel segmenti olmalı, ve iki sayfa aynı segmenti
 * paylaşmamalı: paylaşırlarsa middleware ikisinden birini seçer ve öteki
 * ulaşılamaz olur. Harita elle yazıldığı için bir sayfa eklenip haritaya
 * yazılmayı unutabilir; o zaman sayfa İNGİLİZCE adresle açılır ve kimse fark
 * etmez, çünkü çalışıyor.
 */
function yolHaritasi(slugListesi) {
  const hatalar = [];
  const src = readFileSync(join(docs, "src", "content", "yollar.ts"), "utf8");
  const bilinen = new Set([...src.matchAll(/^\s{2}"?([a-z0-9-]+)"?:\s*\{/gm)].map((m) => m[1]));
  for (const s of bilinen) {
    if (!slugListesi.includes(s)) hatalar.push(`  yollar.ts: "${s}" diye bir sayfa yok`);
  }
  /* Çakışma: iki iç slug aynı genel segmente düşerse. */
  for (const lang of ["tr", "en"]) {
    const gorulen = new Map();
    for (const s of slugListesi) {
      const m = src.match(new RegExp(`"?${s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}"?:\\s*\\{[^}]*${lang}:\\s*"([^"]+)"`));
      const genel = m ? m[1] : s;
      if (gorulen.has(genel)) hatalar.push(`  ${lang}: "${genel}" iki sayfaya birden düşüyor (${gorulen.get(genel)} · ${s})`);
      gorulen.set(genel, s);
    }
  }
  return hatalar;
}
for (const h of yolHaritasi(slugs)) errors.push(h);

/* Bağlantı denetimi YERELLEŞTİRİLMİŞ segmentleri de tanımalı: `/tr/docs/ikonlar`
   geçerli bir adres, kırık bir bağlantı değil. */
const yollarSrc = readFileSync(join(docs, "src", "content", "yollar.ts"), "utf8");
for (const m of yollarSrc.matchAll(/(?:tr|en):\s*"([a-z0-9-]+)"/g)) slugSeti.add(m[1]);

const kirik = kirikXrefler(slugSeti);
for (const k of kirik) errors.push(`  kırık bağlantı: ${k}`);

if (errors.length) {
  console.error("✗ Doküman dil bütünlüğü bozuk:\n");
  console.error(errors.join("\n"));
  process.exit(1);
}

const pending = slugs.filter((s) => !listed.has(s));
console.log(
  `✓ Doküman dili tutarlı — ${Object.keys(dicts).length} sözlük paritede, ` +
    `${listed.size}/${slugs.length} sayfa çevrildi, ${slugSeti.size} slug'a giden bağlantılar sağlam` +
    (pending.length ? `, ${pending.length} sayfa uyarısını gösteriyor: ${pending.join(" · ")}` : ""),
);
