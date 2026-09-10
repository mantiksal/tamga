#!/usr/bin/env node
/**
 * İkon kaydını KAYNAKTAN çıkarır → apps/docs/src/content/icons.json
 *
 * Token ve props tablolarıyla aynı disiplin: liste elle yazılırsa bir ikon
 * eklendiğinde doküman sessizce eksik kalır, ve eksik olduğunu kimse görmez.
 *
 * İKİ AD BİRDEN: kitin verdiği rol adı (`Delete`) ve Phosphor'daki gerçek adı
 * (`Trash`). İkincisi dokümanda görünüyor çünkü aradığın glifi Phosphor adıyla
 * biliyor olabilirsin; ama kopyalanacak olan her zaman rol adı.
 *
 * GRUPLAR DA KAYNAKTAN: `icons.ts` içindeki `/* eylemler *\/` gibi tek satırlık
 * yorumlar bölüm başlığı olarak kullanılıyor. Kaynakta zaten gruplanmış bir
 * listeyi dokümanda ikinci kez gruplamak, iki listeyi ayrı ayrı bakıma mahkûm
 * etmek olurdu.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const kaynak = join(root, "packages", "ui", "src", "components", "icons.ts");
const out = join(root, "apps", "docs", "src", "content", "icons.json");

const src = readFileSync(kaynak, "utf8");

/* KAPANIŞ, AÇILIŞTAN SONRA ARANIYOR — ve bir kez aranmadığı için bu betik
   sessizce SIFIR ikon üretti.

   Ölçülen hata: `icons.ts`e listenin ÜSTÜNE bir satır eklendi
   (`export type { Icon as IconGlyph } from "@phosphor-icons/react";`) ve o
   satır `} from "@phosphor-icons` kalıbına uyuyordu. `indexOf` dosyanın
   başından aradığı için kapanışı AÇILIŞTAN ÖNCE buldu, `slice` boş dizgi
   döndürdü, liste boşaldı. Hiçbir şey patlamadı: `icons.json` `[]` oldu,
   doküman sitesinin ikon sayfası boşaldı, ve bu betik "✓ 0 ikon çıkarıldı"
   diye BAŞARIYLA bitti.

   İki değişiklik birden: kapanış açılıştan sonra aranıyor, ve boş sonuç artık
   bir HATA. "Sıfır tane bulundu" bir başarı değil; bu depoda üretilen her
   liste için doğru. */
const bas = src.indexOf("export {");
const son = src.indexOf('} from "@phosphor-icons', bas);
if (bas < 0 || son < 0) {
  console.error("extract-icons: `icons.ts` içinde adlandırılmış dışa vurum bloğu bulunamadı.");
  process.exit(1);
}
const govde = src.slice(bas, son);

const ikonlar = [];
const grupAciklamalari = new Map();
let grup = "diger";
let aciklama = null;
let blok = false;
let biriken = "";

for (const ham of govde.split("\n")) {
  const satir = ham.trim();
  if (!satir) continue;

  if (blok) {
    const bitis = satir.indexOf("*/");
    if (bitis < 0) {
      biriken += " " + satir.replace(/^\*+/, "");
      continue;
    }
    biriken += " " + satir.slice(0, bitis).replace(/^\*+/, "");
    aciklama = biriken.replace(/\s+/g, " ").trim();
    blok = false;
    biriken = "";
    continue;
  }

  if (satir.startsWith("/*")) {
    const bitis = satir.indexOf("*/");
    if (bitis < 0) {
      blok = true;
      biriken = satir.slice(2);
      continue;
    }
    const metin = satir.slice(2, bitis).trim();
    /* BÖLÜM BAŞLIĞI = TEK SATIR, NOKTASIZ. Gerekçe yorumları cümle kuruyor ve
       nokta ile bitiyor; başlıklar bir isim tamlaması. Ayrımı önce uzunluk
       yapıyordu (70 karakter) ve "metin biçimlendirme ..." başlığı 71 karakter
       olduğu için gerekçe sanılıp beş ikon yanlış gruba düşmüştü: uydurulmuş
       bir eşik, uydurulduğu gün çalışıp ertesi gün bozulur.

       Başlıkta uzun tire varsa öncesi AD, sonrası AÇIKLAMA. Böylece tire
       üretilen dosyaya hiç girmiyor, ve doküman sitesinin tire kapısı
       üretilmiş içeriği de denetleyebiliyor. */
    if (!metin.includes(".")) {
      const [ad, ...kalan] = metin.split("—");
      /* GRUP ANAHTARI SLUG, metnin kendisi değil.
         Kaynaktaki başlıklar Türkçe ("yön ve gezinme") ve doküman sitesi iki
         dilli: İngilizce sayfa Türkçe başlıklar gösteriyordu. Anahtar bir
         TANIMLAYICI, etiket sayfanın sözlüğünden geliyor. */
      grup = ad
        .trim()
        .toLocaleLowerCase("tr")
        .replace(/[^a-zçğıöşü0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
        .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u");
      grupAciklamalari.set(grup, kalan.join("—").trim() || null);
    } else {
      aciklama = metin;
    }
    continue;
  }

  const m = satir.match(/^([A-Za-z0-9]+)(?:\s+as\s+([A-Za-z0-9]+))?,$/);
  if (m) {
    /* PER-İKON GEREKÇE YAYINLANMIYOR. Kaynaktaki yorum bakımcının dili
       (burada Türkçe) ve bu site iki dilli; çevrilmemiş bir gerekçeyi
       İngilizce sayfada basmak, sayfayı yarım gösteriyor. Gerekçe kaynakta
       duruyor, orada okunması gereken kişi zaten kaynağı açıyor. */
    ikonlar.push({ ad: m[2] ?? m[1], phosphor: m[1], grup });
    aciklama = null;
  }
}

/* BOŞ LİSTE BİR HATA, BİR SONUÇ DEĞİL. Yukarıdaki `slice` hatası tam olarak
   burada yakalanabilirdi ve yakalanmadı: betik boş bir dizi yazıp "✓" dedi. */
if (ikonlar.length === 0) {
  console.error("extract-icons: hiç ikon çıkmadı. `icons.ts` içindeki blok ya boş ya da ayrıştırılamadı.");
  process.exit(1);
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(ikonlar, null, 2) + "\n");

const gruplar = new Set(ikonlar.map((i) => i.grup));
console.log(`✓ ${ikonlar.length} ikon çıkarıldı — ${gruplar.size} grup.`);
