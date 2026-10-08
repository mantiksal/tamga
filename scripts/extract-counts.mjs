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
   değişiyor, ve iki yerde tutulmadığı için ayrışamıyor.

   ZİNCİRİN KENDİSİ DE ÇIKIYOR, yalnız uzunluğu değil: ana sayfadaki kapı
   şeridi adları ELLE yazıyordu ve 22 sayısının altında 13 ad duruyordu ·
   yenileri (yuvarlak, data-props, token-parity, palette) hiç eklenmemişti.
   Sayı kaynaktan, liste elden geldiği sürece ikisi ayrışıyor. */
const pkg = JSON.parse(oku("package.json"));
const adimlar = pkg.scripts.verify.split("&&").map((s) => s.trim()).filter(Boolean);
const zincir = adimlar.map((a) =>
  a
    .replace(/^BUILD_DIR=\S+\s+/, "")
    .replace(/^pnpm run /, "")
    .replace(/^pnpm --filter tamga-ui /, "ui:"),
);
const kapilar = zincir.length;

/* KONTROL, KAPI DEĞİL · ve fark ziyaretçi için önemli: zincirin adımlarının
   beşi üretim ve derleme işi (prop çıkarımı, typecheck, kitin build'i,
   testler, dokümanın build'i), geri kalanı bir KURALI denetleyen betik. Ana
   sayfa kural denetleyenlerle konuşuyor, çünkü anlatılan şey "derleniyor mu"
   değil "kurala uyuyor mu". `props` bir kapı ama kontrol değil: bir şeyi
   yasaklamıyor, bir şey üretiyor. İkisi de buradan sayılıyor; hiçbiri elle
   yazılmıyor. */
const kontroller = zincir.filter((a) => a.startsWith("check:"));

/* SÜRÜM DE BİR SAYI, ve elle yazılınca yanlış olan ilk şey o oldu: npm'de
   0.2.0 dururken doküman sitesinin şeridi "v0.0.0" diyordu. Kaynağı kitin
   kendi `package.json`ı; iki yerde tutulmuyor. */
const ui = JSON.parse(oku("packages", "ui", "package.json"));

/* HAZIR EKRAN ŞABLONLARI, `patterns/index.ts`in dışa verdiklerinden: ana sayfa
   "8 hazır ekran şablonu" diye bir sayı basıyor ve o sayı elle yazılırsa
   dokuzuncusu eklendiğinde yalan oluyor. `AppShell` sayılmıyor · o bir ekran
   değil, ekranların içinde durduğu kabuk. */
const patterns = oku("packages", "ui", "src", "patterns", "index.ts");
const sablonlar = new Set(
  [...patterns.matchAll(/\b([A-Z][A-Za-z]*Template)\b/g)].map((m) => m[1]),
);

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
  zincir,
  kontrol: kontroller.length,
  kontroller,
  sablon: sablonlar.size,
  sayfa: sayfalar,
  surum: ui.version,
};

/* KAPI DEMOSU ZİNCİRE BAĞLI. Ana sayfadaki canlandırma, gerçekten koşturulmuş
   dört ihlalin çıktısını oynatıyor (yakalama yöntemi docs/07'de). Kapı adı
   değişir ya da zincirdeki sırası kayarsa demo sessizce yalan söylerdi; burada
   duruyor. Sıra numarası demoda tutulmuyor, buradan üretiliyor. */
const demo = JSON.parse(oku("apps", "docs", "src", "content", "kapi-demo.json"));
/* EKİP EL KİTABININ KONTROL TABLOSU ZİNCİRLE AYNI OLACAK. Tablo elle yazılıyor
   ve iki kez ayrıştı: kök README'de başlık "Yirmi kapı" diyordu (zincir yirmi
   iki) ve iki kontrol tabloda hiç yoktu; tablo `GELISTIRME.md`ye taşınırken de
   dört kontrol eksik geldi. Sayıyı kaynaktan üretmek yetmiyor; LİSTE de
   kaynaktan denetlenmeli. */
const readme = oku("GELISTIRME.md");
const tabloda = [...readme.matchAll(/^\| `([^`]+)` \|/gm)].map((m) => m[1]);
/* Tek takma ad: zincirde `ui:build`, README'de insanın okuduğu hâli. */
const ayni = (a) => (a === "ui:build" ? "tamga-ui build" : a);
const readmeEksik = zincir.map(ayni).filter((a) => !tabloda.includes(a));
const readmeFazla = tabloda.filter((a) => !zincir.map(ayni).includes(a));
if (readmeEksik.length || readmeFazla.length) {
  console.error(
    "✗ GELISTIRME.md'nin kontrol tablosu zincirle uyuşmuyor:\n" +
      readmeEksik.map((a) => `  ${a} zincirde var, tabloda yok.`).join("\n") +
      readmeFazla.map((a) => `  ${a} tabloda var, zincirde yok.`).join("\n"),
  );
  process.exit(1);
}

const eksik = demo.senaryolar.filter((d) => d.kapi && !kontroller.includes(d.kapi));
/* HER KONTROLÜN İKİ DİLDE BİR ADI VAR. Şeritteki kareler `check:token-parity`
   değil "İki tema eksiksiz" diye okunuyor; adı olmayan bir kontrol karenin
   ipucunda çıplak slug bırakır, ve bunu kimse görmez. */
const adsiz = kontroller.filter((k) => !demo.adlar?.[k]?.tr || !demo.adlar?.[k]?.en);
if (eksik.length || adsiz.length) {
  console.error(
    "✗ Kapı demosu zincirle uyuşmuyor:\n" +
      eksik.map((d) => `  "${d.id}" senaryosu ${d.kapi} diyor, zincirde böyle bir adım yok.`).join("\n") +
      adsiz.map((k) => `  ${k} için iki dilli ad yok (kapi-demo.json · adlar).`).join("\n"),
  );
  process.exit(1);
}

writeFileSync(out, JSON.stringify(sayilar, null, 2) + "\n");
console.log(
  `✓ Sayılar sayıldı — ${sayilar.bilesen} bileşen · ${sayilar.sinif} sınıf · ` +
    `${sayilar.token} token · ${sayilar.ikon} ikon · ${sayilar.kapi} kapı (${sayilar.kontrol} kontrol) · ` +
    `${sayilar.sayfa} sayfa · v${sayilar.surum}.`,
);
