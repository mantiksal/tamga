#!/usr/bin/env node
/**
 * KAPI: kitin CSS'i yapısal olarak sağlam.
 *
 * NEDEN VAR. Bir yorum bloğunu bozmak CSS'te HATA VERMEZ. Ayrıştırıcı hata
 * kurtarmaya geçiyor ve kapanmamış bir yorumdan sonraki İLK KURALI yutuyor.
 * Sonuç: kural dosyada duruyor, `grep` buluyor, tarayıcıya iniyor, ve hiç
 * uygulanmıyor. Hiçbir yerde hata yok.
 *
 * 2026-09-09'da bu tam olarak yaşandı: `.tamga-cell-open` yazıldı, dist'e
 * girdi, sunuldu, ve hücre hâlâ kırpıyordu. Sebep üç satır yukarıdaki, açılmamış
 * bir yorum kapatmasıydı. Teşhis tarayıcıda stil sayfalarını tek tek tarayarak
 * bulundu; yani gözle bulunamayacak bir hataydı. (Bu dosyanın ilk hâli de aynı
 * hatayı yaptı: açıklamanın içine konan bir yorum kapatması JSDoc'u erken
 * bitirdi ve Node dosyayı ayrıştıramadı.)
 *
 * NE BAKIYOR: yorumların dengesi, süslü parantezlerin dengesi, ve bir METİN
 * token'ının DOLGU olarak kullanılmaması.
 *
 * ÜÇÜNCÜSÜ NEDEN. `--color-accent-line` sayfaya karşı 4.5 kontrast ARANARAK
 * üretiliyor: yüzden hep daha koyu, çünkü işi metin ve saç teli çizgi olmak.
 * Dolgu olarak kullanıldığında o nesne aynı ekrandaki her düğmeden koyu çıkıyor
 * ve marka rengi seçilince fark büyüyor. 2026-09-11'de adım şeridinde tam olarak
 * bu vardı, ve hiçbir şey hata vermiyordu: renkler geçerli, kontrast yeterli,
 * yalnız bütünlük yok. Gözle bakmadan görünmeyen, bakınca da "neden acaba"
 * dedirten bir hata — yani tam bir kapı işi.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN = [join(ROOT, "packages/ui/src"), join(ROOT, "apps/docs/src")];

function* walk(dir) {
  for (const ad of readdirSync(dir)) {
    const p = join(dir, ad);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (ad.endsWith(".css")) yield p;
  }
}

const hatalar = [];
for (const base of SCAN) {
  for (const dosya of walk(base)) {
    const s = readFileSync(dosya, "utf8");
    const rel = relative(ROOT, dosya);

    /* Yorumlar sırayla yürünüyor: her açılış bir kapanışla eşleşmeli, ve
       eşi olmayan bir kapanış tek başına duramaz. */
    let i = 0, acik = false, acikSatir = 0;
    let satir = 1;
    while (i < s.length) {
      if (s[i] === "\n") satir++;
      if (!acik && s.startsWith("/*", i)) { acik = true; acikSatir = satir; i += 2; continue; }
      if (acik && s.startsWith("*/", i)) { acik = false; i += 2; continue; }
      if (!acik && s.startsWith("*/", i)) {
        hatalar.push(`  ${rel}:${satir}  eşi olmayan yorum kapatması, sonraki kural sessizce yutulur`);
        i += 2; continue;
      }
      i += 1;
    }
    if (acik) hatalar.push(`  ${rel}:${acikSatir}  kapanmamış yorum`);

    /* Süslü parantez dengesi, yorumlar çıkarıldıktan sonra. */
    const kod = s.replace(/\/\*[\s\S]*?\*\//g, "");

    /* `--color-edge`, `--color-line`, `--color-tick` DOLGU OLABİLİR: bir saç
       teli çizgi, kendi zemini boyanmış 1 piksellik bir kutudur. Aksanın metin
       sürümü olamaz — onun ölçülmüş eşi yok. */
    for (const [n, satirIcerik] of kod.split("\n").entries()) {
      const m = satirIcerik.match(/\bbackground(?:-color)?\s*:\s*var\(\s*(--color-accent-line)\s*\)/);
      if (m) {
        hatalar.push(
          `  ${rel}:${n + 1}  \`${m[1]}\` dolgu olarak kullanılmış; o bir metin/çizgi token'ı, zemin için \`--color-accent\` ya da bir yüzey token'ı kullan`,
        );
      }
    }
    const ac = (kod.match(/\{/g) || []).length;
    const kapa = (kod.match(/\}/g) || []).length;
    if (ac !== kapa) hatalar.push(`  ${rel}  süslü parantez dengesiz: ${ac} açık, ${kapa} kapalı`);
  }
}

if (hatalar.length) {
  console.error(`check-css: ${hatalar.length} yapısal sorun.\n`);
  for (const h of hatalar) console.error(h);
  console.error(
    "\n  Bozuk bir yorum CSS'te hata vermez: ayrıştırıcı kurtarmaya geçer ve" +
      "\n  sonraki kuralı yutar. Kural dosyada durur, hiç uygulanmaz.",
  );
  process.exit(1);
}
console.log("✓ CSS yapısı sağlam — yorumlar, bloklar ve token rolleri yerinde.");
