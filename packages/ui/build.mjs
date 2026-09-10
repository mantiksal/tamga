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
 */
import { readdir, mkdir, copyFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "src");
const dist = join(here, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const files = (await readdir(src)).filter((f) => f.endsWith(".css"));
for (const f of files) await copyFile(join(src, f), join(dist, f));

console.log(`✓ tamga-ui — ${files.length} CSS dosyası: ${files.join(" · ")}`);
