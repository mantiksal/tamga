/**
 * Yapı adımı — şimdilik yalnız kopyalama.
 *
 * CSS'in dönüştürülmesi gerekmiyor: theme.css Tailwind v4 direktifleri taşır ve
 * tüketicinin build'inde çözülür, kit.css zaten saf CSS. Yani "derleme" burada
 * src/ -> dist/ kopyalamaktan ibaret. Bileşenler geldiğinde (adım 1c) buraya
 * bir TS derleyicisi eklenecek; o zamana kadar bir bağımlılık taşımıyoruz.
 *
 * dist/ üzerinden yayınlıyoruz (src/ değil) çünkü exports haritası kalıcı olmalı:
 * kaynak düzeni değiştiğinde tüketicinin import satırı değişmemeli.
 *
 * YORUMLAR KAYNAKTA KALIYOR, YAYINLANANDA KALMIYOR. `kit.css` 157 yorum taşıyordu
 * ve hepsi bizim iç gerekçelerimizdi: hangi tuzağa nasıl düşüldüğü, hangi kuralın
 * neden böyle. Onlar kiti DOĞRU TUTAN şeyler, ama kiti KURAN kişinin işi değil, ve
 * her kurulumda indiriliyorlardı. Kaynakta duruyorlar; indirilen dosya yalnız
 * kuralları taşıyor.
 */
import { readdir, readFile, writeFile, mkdir, rm, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "src");
const dist = join(here, "dist");

/* ------------------------------------------------------------------ *
 * `dist` SİLİNMİYOR, ÜSTÜNE YAZILIYOR — ve bunun somut bir sebebi var.
 *
 * Eskiden ilk satır `rm -rf dist` idi. Doğru görünüyordu: eski çıktı gider,
 * yenisi gelir. Ama `dist` yalnız yayınlanan bir klasör değil, AYAKTA DURAN
 * BİR SUNUCUNUN OKUDUĞU klasör: doküman sitesinin CSS'i oradan geliyor
 * (`@import ".../dist/styles.css"`). Silme ile yeniden yazma arasındaki
 * pencere `tsc`yi de kapsıyordu, yani saniyeler.
 *
 * Sonuç iki kez aynı gün yaşandı: `verify` koşarken doküman sitesi
 * "Can't resolve './theme.css'" diye patladı, ve turbopack o hatayı
 * ÖNBELLEĞE ALDIĞI için dosya geri geldiğinde bile 500 vermeye devam etti.
 * Hata koda benziyordu, oysa yarış durumuydu.
 *
 * Şimdi her dosya yerinde değiştiriliyor: pencere tek bir dosyanın yazılma
 * süresi kadar. Silmenin asıl işi (kaynaktan kalkan bir dosyanın çıktıda
 * kalmaması) kayboldu mu? Hayır: aşağıda BEKLENEN çıktı kümesi kaynaktan
 * hesaplanıp fazlası temizleniyor. Ve o temizlik `tsc`den ÖNCE yapılıyor,
 * çünkü tsc'nin ne üreteceği kaynak ağacından zaten biliniyor.
 * ------------------------------------------------------------------ */
await mkdir(dist, { recursive: true });

/** `src` altındaki her dosya; test dosyaları tsconfig'te zaten hariç. */
async function* kaynaklar(d) {
  for (const n of await readdir(d, { withFileTypes: true })) {
    const p = join(d, n.name);
    if (n.isDirectory()) yield* kaynaklar(p);
    else yield p;
  }
}
async function* ciktilar(d) {
  try {
    for (const n of await readdir(d, { withFileTypes: true })) {
      const p = join(d, n.name);
      if (n.isDirectory()) yield* ciktilar(p);
      else yield p;
    }
  } catch {
    /* dist henüz yok */
  }
}

const beklenen = new Set();
for await (const yol of kaynaklar(src)) {
  const bagil = yol.slice(src.length + 1);
  if (bagil.endsWith(".css")) {
    beklenen.add(join(dist, bagil));
  } else if (/\.tsx?$/.test(bagil) && !/\.test\.tsx?$/.test(bagil)) {
    const govde = bagil.replace(/\.tsx?$/, "");
    beklenen.add(join(dist, `${govde}.js`));
    beklenen.add(join(dist, `${govde}.d.ts`));
    beklenen.add(join(dist, `${govde}.d.ts.map`));
  }
}

let bayat = 0;
for await (const yol of ciktilar(dist)) {
  if (!beklenen.has(yol)) {
    await rm(yol, { force: true });
    bayat++;
  }
}

const { version } = JSON.parse(await readFile(join(here, "package.json"), "utf8"));
const banner = `/*! tamga-ui ${version} · MIT · https://tamga.org.tr */\n`;

/* Naif bir `/*…*\/` silmesi bir dizgenin içindeki işareti de yer. Ölçüldü: bu üç
   dosyanın hiçbir dizgesinde yorum işareti yok, ama kural gelecekte de tutsun diye
   dizgeler önce yerinden alınıyor, sonra geri konuyor. */
function yorumsuz(css) {
  const dizgeler = [];
  const korunmus = css.replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, (m) => {
    dizgeler.push(m);
    return `\u0000${dizgeler.length - 1}\u0000`;
  });
  return korunmus
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\u0000(\d+)\u0000/g, (_, i) => dizgeler[Number(i)]);
}

const files = (await readdir(src)).filter((f) => f.endsWith(".css"));
let once = 0;
let sonra = 0;
for (const f of files) {
  const ham = await readFile(join(src, f), "utf8");
  const cikti = banner + yorumsuz(ham).replace(/^\n+/, "");
  once += ham.length;
  sonra += cikti.length;
  await writeFile(join(dist, f), cikti);
}

if (bayat) console.log(`  ${bayat} bayat çıktı silindi (kaynağı kalmamış).`);

const kb = (n) => `${Math.round(n / 1024)} kB`;
console.log(
  `✓ tamga-ui — ${files.length} CSS dosyası: ${files.join(" · ")} · ` +
    `${kb(once)} → ${kb(sonra)} (yorumlar kaynakta kaldı)`,
);
