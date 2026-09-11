#!/usr/bin/env node
/**
 * Tanıtım sayfasının SAYILARI — kaynaktan.
 *
 * NEDEN. Ana sayfa "doksan altı bileşen", "elli yedi sınıf", "altı kapı" diye
 * yazıyordu. Gerçek sayılar sırasıyla 102, 81 ve 13'tü: üçü de bir zamanlar
 * doğruydu ve hiçbiri güncellenmedi. Bir tasarım sisteminin ana sayfasında
 * yanlış bir sayı, o sistemin kendi disiplinine dair en kötü reklam.
 *
 * Elle düzeltmek sorunu çözmez, ertelerdi. Sayılar artık her build'de
 * kaynaktan sayılıyor; bir bileşen eklendiğinde ana sayfa da değişiyor.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const oku = (...p) => readFileSync(join(root, ...p), "utf8");
const out = join(root, "apps", "docs", "src", "content", "counts.json");

const props = JSON.parse(oku("apps", "docs", "src", "content", "props.json"));
const tokens = JSON.parse(oku("apps", "docs", "src", "content", "tokens.json"));
const icons = JSON.parse(oku("apps", "docs", "src", "content", "icons.json"));

/* `.tamga-` ile başlayan benzersiz sınıf adları. Bir sınıfın birden çok kuralı
   olabilir (`:hover`, `[data-active]`), o yüzden küme. */
const kit = oku("packages", "ui", "src", "kit.css");
const siniflar = new Set(
  [...kit.matchAll(/\.(tamga-[a-z0-9-]+)/g)].map((m) => m[1]),
);

/* Kapılar `verify` betiğinin kendisinden: bir kapı eklendiğinde sayı da
   değişiyor, ve iki yerde tutulmadığı için ayrışamıyor. */
const pkg = JSON.parse(oku("package.json"));
const kapilar = pkg.scripts.verify.split("&&").filter((s) => s.trim()).length;

/* SÜRÜM DE BİR SAYI, ve elle yazılınca yanlış olan ilk şey o oldu: npm'de
   0.2.0 dururken doküman sitesinin şeridi "v0.0.0" diyordu. Kaynağı kitin
   kendi `package.json`ı; iki yerde tutulmuyor. */
const ui = JSON.parse(oku("packages", "ui", "package.json"));

/* Doküman sayfaları: nav'daki bileşen + kavram sayfaları. */
const nav = oku("apps", "docs", "src", "content", "nav.ts");
const sayfalar =
  (nav.match(/^\s*c\(/gm) ?? []).length + (nav.match(/^\s*k\(/gm) ?? []).length;

const sayilar = {
  bilesen: Object.keys(props).length,
  prop: Object.values(props).reduce((n, p) => n + p.length, 0),
  sinif: siniflar.size,
  token: tokens.length,
  ikon: icons.length,
  kapi: kapilar,
  sayfa: sayfalar,
  surum: ui.version,
};

writeFileSync(out, JSON.stringify(sayilar, null, 2) + "\n");
console.log(
  `✓ Sayılar sayıldı — ${sayilar.bilesen} bileşen · ${sayilar.sinif} sınıf · ` +
    `${sayilar.token} token · ${sayilar.ikon} ikon · ${sayilar.kapi} kapı · ` +
    `${sayilar.sayfa} sayfa · v${sayilar.surum}.`,
);
