#!/usr/bin/env node
/**
 * KAPI: sunan eleman çizen her bileşen `data-*` kabul eder.
 *
 * NEDEN VAR — ve bu kapının doğum hikâyesi tam olarak onun gerekçesi.
 *
 * 2026-09-13/14'te kite ÜST ÜSTE BEŞ düzeltme gitti ve beşi de aynı kusurdu:
 * `RailLink` `data-nav`i düşürüyordu · `Segmented` seçenek başına kanca kabul
 * etmiyordu · `Card` `data-verdict`i düşürüyordu · `Link` yönlendirici bağlantısı
 * almıyordu · `Card` anlamsal etiket almıyordu. Her biri bir çağrı yerinde tek tek
 * keşfedildi, her biri ayrı bir yayın turu oldu.
 *
 * Oysa hepsi TEK bir ölçümle çıkarılabilirdi: kitin hangi bileşeni tüketicinin
 * vermek istediğini kabul etmiyor. Ölçüm yapıldığında sayı şuydu: 79 bileşen.
 *
 * NEDEN `data-*` VE BAŞKASI DEĞİL. `data-*` EYLEMSİZDİR: HTML'de hiçbir davranışa
 * bağlanmaz, yalnız bir kanca taşır — bir testin tutunacağı, bir stilin seçeceği,
 * bir analitiğin okuyacağı. Bileşeni bozamaz. Reddetmenin bedeli ise yüksek ve
 * SESSİZ: kanca gerektiği an tüketici bileşeni bırakıp sınıfını elle yazıyor, ve
 * sınıfla gelmesi gereken korumaları (kırpma, kaydırma, klavye, erişilebilirlik)
 * kaybediyor. Hiçbir yerde hata çıkmıyor.
 *
 * `aria-*` bu kapının kapsamında DEĞİL, bilerek: o eylemsiz değil. Bir `aria-label`,
 * bileşenin kendi hesapladığı erişilebilir adı sessizce ezer. Erişilebilirlik açık
 * bir prop olarak istenir.
 *
 * NE BAKIYOR: `src/components` altında sunan bir eleman (`div`, `button`, `section`…)
 * çizen her dışa aktarılmış bileşen, `...rest` alıp `dataProps` ile yayıyor mu.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const KOK = new URL("..", import.meta.url).pathname;
const DIZIN = join(KOK, "packages/ui/src/components");
const HOST = /<(div|span|button|a|section|table|ul|li|td|th|p|h[1-6]|aside|nav|header|footer|form|ol)[\s>]/;

/* Bu üçü sunan eleman çiziyor ama `data-*` almıyor, ve sebebi yazılı:
   çağıranın kancası ÖĞEYE ait, sarmalayıcıya değil. Öğe başına geçiş
   `options`/`items` üzerinden zaten var. */
const MUAF = new Map([
  ["Segmented", "kanca seçeneğin kendisine iniyor (`options[].data-*`)"],
  ["Steps", "adım listesi düz metin alıyor, öğe başına kanca taşımıyor"],
]);

const hatalar = [];
for (const dosya of readdirSync(DIZIN).filter((f) => f.endsWith(".tsx") && !f.includes(".test."))) {
  const yol = join(DIZIN, dosya);
  const src = readFileSync(yol, "utf8");
  let satir = 1;
  for (const parca of src.split(/(?=\nexport function )/)) {
    const ad = parca.match(/^\nexport function (\w+)/)?.[1];
    const basSatir = satir;
    satir += parca.split("\n").length - 1;
    if (!ad || MUAF.has(ad)) continue;
    if (!HOST.test(parca)) continue;
    if (/\.\.\.rest|\.\.\.props|dataProps|\[k: `data-/.test(parca)) continue;
    hatalar.push(`  ${relative(KOK, yol)}:${basSatir}  ${ad}`);
  }
}

if (hatalar.length) {
  console.error(`check-data-props: ${hatalar.length} bileşen \`data-*\` kabul etmiyor.\n`);
  for (const h of hatalar) console.error(h);
  console.error(
    "\n  Kabul etmeyen bir bileşen, kanca gerektiği an BIRAKILIR ve sınıfı elle\n" +
      "  yazılır — sınıfla gelen korumalar da orada kalır. Çözüm iki satır:\n" +
      "    1) imzaya `...rest` ve `[k: `data-${string}`]: unknown`\n" +
      "    2) sunan elemana `{...dataProps(rest)}`\n",
  );
  process.exit(1);
}
console.log("✓ Sunan eleman çizen her bileşen `data-*` kabul ediyor.");
