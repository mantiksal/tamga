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
import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "src");
const dist = join(here, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

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

const kb = (n) => `${Math.round(n / 1024)} kB`;
console.log(
  `✓ tamga-ui — ${files.length} CSS dosyası: ${files.join(" · ")} · ` +
    `${kb(once)} → ${kb(sonra)} (yorumlar kaynakta kaldı)`,
);
