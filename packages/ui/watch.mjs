/**
 * Kit izleyicisi — kaynak değişince dist'i tazeler.
 *
 * NEDEN VAR. Tüketici (`apps/docs`, ve yerel bağlı bir panel) kiti `dist`ten
 * okuyor, yani bir kaynak değişikliği derlenene kadar görünmüyor. Derleme yarım
 * saniye, ama ELLE: unutulduğunda hata SESSİZ oluyor — panel eski kiti
 * gösteriyor, geliştirici "değişikliğim çalışmadı" diyor ve aslında bozuk
 * olmayan bir şeyi düzeltmeye başlıyor. Kaybedilen zaman derlemenin süresi
 * değil, yanlış yerde arama süresi.
 *
 * TSC'NİN KENDİ `--watch`İ YETMİYOR: CSS dosyalarını `build.mjs` kopyalıyor
 * (yorumları ayıklayarak), ve tsc onları hiç görmüyor. Yani bir `kit.css`
 * değişikliği tsc izleyicisinde sessiz kalırdı — tam olarak önlemeye çalıştığımız
 * hatanın CSS hâli.
 *
 * TEK KOŞU, SIRALI: iki değişiklik arka arkaya geldiğinde (kaydet + biçimlendir)
 * iki derleme birbirinin üstüne binmesin diye bir sonraki koşu öncekini bekliyor.
 */
import { watch } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KOK = dirname(fileURLToPath(import.meta.url));
const SRC = join(KOK, "src");

let kosuyor = false;
let tekrar = false;

function derle(sebep) {
  if (kosuyor) {
    tekrar = true;
    return;
  }
  kosuyor = true;
  const t0 = Date.now();
  const p = spawn("npm", ["run", "build"], { cwd: KOK, stdio: ["ignore", "ignore", "pipe"] });
  let hata = "";
  p.stderr.on("data", (d) => (hata += d));
  p.on("close", (kod) => {
    kosuyor = false;
    const sure = Date.now() - t0;
    if (kod === 0) console.log(`✓ ${sebep} → ${sure}ms`);
    else console.error(`✗ ${sebep} derlenmedi:\n${hata.trim().split("\n").slice(0, 8).join("\n")}`);
    if (tekrar) {
      tekrar = false;
      derle("ardışık değişiklik");
    }
  });
}

console.log("kit izleniyor: packages/ui/src");
derle("ilk derleme");

/* `recursive` macOS ve Windows'ta destekleniyor; Linux'ta Node 20+ ile geldi. */
watch(SRC, { recursive: true }, (_olay, dosya) => {
  if (!dosya) return;
  if (!/\.(ts|tsx|css)$/.test(dosya)) return;
  if (dosya.includes(".test.")) return;
  derle(dosya);
});
