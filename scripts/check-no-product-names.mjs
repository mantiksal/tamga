#!/usr/bin/env node
/**
 * Ürün-adı denetimi — bu deponun bir numaralı kuralının mekanik karşılığı.
 *
 *   "Kütüphane ürünü bilmez."
 *
 * Kit tek bir üründen çekildi ve çekilirken o ürünün adını,
 * maskotunu ve alan sözlüğünü taşıyordu. Bunlar tek tek temizlendi; bu dosya
 * geri gelmelerini imkânsız kılmak için var. Elle yapılan bir temizlik geri
 * gelir, guard onu bir daha getirmez.
 *
 * ÜÇ SEBEP, biri ötekinden ağır:
 *
 * 1 · GÜVENLİK. Paket npm'de GENEL yayınlanacak (K3). Kaynağa sızan bir müşteri
 *     adı, bir iç not ya da bir hack açıklaması dünyaya açılır. Bu, geri
 *     alınamaz: npm'de 72 saat sonra bir sürüm silinemez.
 *
 * 2 · DOĞRULUK. Kit birden çok aileye hizmet ediyor: kendi SaaS ürünlerimiz,
 *     gelecek ürünler ve müşteri panelleri. Bir ailenin sözlüğü ötekinin
 *     yanlışıdır; bir izleme panelinin sözcüğü bir e-ticaret panelinde hiçbir
 *     şey ifade etmez.
 *
 * 3 · DÜRÜSTLÜK. "Kit nötrdür" bir iddia olarak kolay, kanıt olarak zordur.
 *     Bu dosya onu iddia olmaktan çıkarıp CI'ın koruduğu bir gerçeğe çevirir.
 *
 * NE YAPMALI, bir eşleşme çıkarsa: kelimeyi silme, ne olduğunu sor.
 *   · Bir MEKANİZMA mı? Nötr adıyla kalır — `HealthScore` → `Gauge` gibi.
 *   · Bir SÖZLÜK mü ("benim durumlarım şunlar")? Ürüne taşınır.
 *   · Bir KİMLİK mi (maskot, logo, marka)? Ürüne taşınır.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * TARANAN YER: DEPONUN TAMAMI, YALNIZ `packages/` DEĞİL.
 *
 * Kapı bir süre yalnız `packages/`e bakıyordu, çünkü derdi "npm paketine ürün
 * adı sızmasın"dı. Ama depo PUBLIC oluyor, ve o an sızıntının tanımı değişti:
 * `docs/` altındaki bir ADR bir müşterinin teknoloji yığınını ve kiracı
 * listesini yazıyordu, doküman sitesinin bir sayfası bir müşterinin marka
 * kırmızısını. Hiçbiri npm'e gitmiyordu; hepsi GitHub'a gidiyordu.
 *
 * Yayınlanan şey artık paket değil DEPO, ve kapının kapsamı onu takip ediyor.
 */
const SCAN = ["packages", "apps", "docs", "scripts", "README.md", "CLAUDE.md"];
const SKIP_DIR = new Set(["node_modules", "dist", ".git", ".next", "storybook-static"]);
const EXT = new Set([".ts", ".tsx", ".css", ".mjs", ".js", ".json", ".md", ".html"]);

/**
 * ADLAR DEPODA DEĞİL, YANINDA.
 *
 * Liste bir zamanlar burada, kaynağın içindeydi — ve depo public olduğu an bu
 * dosyanın kendisi bir müşteri listesi hâline geldi. Bir yasak kelime listesi,
 * yasakladığı kelimeleri barındırmak zorunda; tek çıkış yolu listeyi depodan
 * çıkarmak.
 *
 * `scripts/urun-adlari.json` `.gitignore`da. Yoksa örnek dosya kullanılıyor ve
 * kapı bunu SÖYLÜYOR: sessizce boş bir listeyle "temiz" demek, bu kapının
 * yakalamak için var olduğu sessiz hatanın ta kendisi olurdu.
 *
 * Dışarıdan gelen biri için gerçek liste zaten gereksiz: onun koruyacağı bir
 * müşteri adı yok. Bizim makinelerimizde ve CI'da dosya duruyor.
 */
function adlariOku() {
  const gercek = join(root, "scripts", "urun-adlari.json");
  const ornek = join(root, "scripts", "urun-adlari.example.json");
  for (const [yol, kaynak] of [
    [gercek, "scripts/urun-adlari.json"],
    [ornek, "scripts/urun-adlari.example.json"],
  ]) {
    try {
      const veri = JSON.parse(readFileSync(yol, "utf8"));
      return { names: veri.names ?? [], domain: veri.domain ?? [], kaynak };
    } catch {
      /* sıradaki */
    }
  }
  return { names: [], domain: [], kaynak: null };
}

const { names: NAMES, domain: DOMAIN, kaynak: LISTE_KAYNAGI } = adlariOku();

if (!LISTE_KAYNAGI) {
  console.error("check-names: ne `scripts/urun-adlari.json` ne de örneği okunabildi.");
  process.exit(1);
}

/** Kelime sınırıyla eşleşir: tam kelime yakalanır, içinde geçtiği uzun bir
    kelime yakalanmaz. */
const rx = (w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (SKIP_DIR.has(entry)) continue;
      yield* walk(full);
      continue;
    }
    if (EXT.has(entry.slice(entry.lastIndexOf(".")))) yield full;
  }
}

/* SCAN artık hem klasör hem TEK DOSYA taşıyor (`README.md`), ve `walk` bir
   klasör bekliyordu: kapı `ENOTDIR` ile patlıyordu. */
function* hedefler() {
  for (const giris of SCAN) {
    const tam = join(root, giris);
    if (statSync(tam).isDirectory()) yield* walk(tam);
    else yield tam;
  }
}

/**
 * YAYINLANAN = GIT'İN TAŞIDIĞI. Yoksayılan hiçbir dosya taranmıyor.
 *
 * Kapı bir ara `docs/ozel/` ve `scripts/urun-adlari.json` üzerinde patlıyordu —
 * ikisi de `.gitignore`da, yani ikisi de zaten public olmayacak. Elle bir
 * "atla" listesi yazmak çürür: yeni bir yoksayılan klasör açıldığında kimse
 * buraya eklemeyi hatırlamaz. Ölçüt doğrudan git'in kendisi, çünkü sorunun
 * gerçek hâli "bu dosya dışarı çıkacak mı".
 *
 * `git` yoksa (tarball'dan çıkarılmış bir kopya) hiçbir şey elenmiyor: bir
 * kapının şüphede kalırken TARAMASI, atlamasından iyidir.
 */
function yoksayilanlar(dosyalar) {
  if (dosyalar.length === 0) return new Set();
  try {
    const cikti = execFileSync("git", ["check-ignore", "--stdin"], {
      cwd: root,
      input: dosyalar.join("\n"),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
    return new Set(cikti.split("\n").filter(Boolean).map((y) => join(root, y)));
  } catch (e) {
    /* `git check-ignore` HİÇBİR eşleşme bulamazsa çıkış kodu 1 veriyor; bu bir
       hata değil "hepsi taranacak" demek. */
    if (e.status === 1) return new Set();
    return new Set();
  }
}

const tumu = [...hedefler()];
const elenen = yoksayilanlar(tumu.map((f) => relative(root, f)));

const hits = [];
{
  for (const file of tumu.filter((f) => !elenen.has(f))) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      for (const w of NAMES) if (rx(w).test(line)) hits.push([relative(root, file), i + 1, w, "ürün/müşteri adı", line]);
      for (const w of DOMAIN) if (rx(w).test(line)) hits.push([relative(root, file), i + 1, w, "alan sözlüğü", line]);
    });
  }
}

if (hits.length) {
  console.error(`✗ Kütüphane bir ürünü tanıyor — ${hits.length} yerde:\n`);
  for (const [file, line, word, kind] of hits) {
    console.error(`  ${file}:${line}  “${word}”  (${kind})`);
  }
  console.error(
    "\n  Kelimeyi silmeden önce ne olduğunu sor:\n" +
      "    mekanizma → nötr adıyla kalır      (HealthScore → Gauge)\n" +
      "    sözlük    → ürüne taşınır          (down · warn · resolved)\n" +
      "    kimlik    → ürüne taşınır          (maskot, logo, marka)\n",
  );
  process.exit(1);
}

console.log(`✓ Kütüphane hiçbir ürünü tanımıyor (${NAMES.length} ad + ${DOMAIN.length} alan sözcüğü tarandı).`);
