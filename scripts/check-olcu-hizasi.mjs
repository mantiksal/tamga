#!/usr/bin/env node
/**
 * Kontrol yüksekliği hizası — bir araç çubuğunda yan yana duran her kontrol
 * aynı yükseklikte mi.
 *
 * NEDEN VAR. Ölçü sayfası şunu yazıyor: "bir düğme bir girdinin yanına
 * konduğunda ikisi de aynı yüksekliktedir, çünkü ikisi de aynı token'ı
 * okuyor". Cümle doğruydu ama BİR KONTROL İÇİN DEĞİLDİ: `.tamga-segment`
 * yüksekliğini dolgudan alıyordu ve 42px ölçülüyordu, `--control` ise 40.
 * İki piksel; bir araç çubuğunda girdi ve düğme hizalanıyor, segment
 * hizalanmıyordu. Sayfanın kendi demosu bunu görünür yaptı.
 *
 * Yükseklik önce segmentin İÇİNDEKİ düğmeye verilmiş, kuyu onun üstüne kendi
 * dolgusunu ekleyince 46px çıkmış, ve sabit yükseklik o yüzden tamamen
 * kaldırılmıştı. Doğru yer kuyunun kendisi; öğeler ona geriliyor.
 *
 * ÖLÇÜT: aşağıdaki listedeki her sınıf `height: var(--control)` bildirmeli.
 * Liste elle yazılı, ve `check-yuvarlak`ın muafiyet listesiyle aynı sebeple:
 * bu bir KARAR. Yeni bir taban kontrol eklendiğinde adını buraya yazmak, onun
 * hizalanıp hizalanmayacağına karar vermek demek.
 *
 * KÜÇÜK BOYLAR BİLEREK YOK (`-sm`, `-icons`): bir araç çubuğunda 40 pikselin
 * altında durmak onların var olma sebebi.
 */
import { readFileSync } from "node:fs";

/** Taban boydaki kontroller · yan yana geldiklerinde hizalanmaları GEREKEN küme. */
const KONTROLLER = [
  ".tamga-btn",
  ".tamga-icon-btn",
  ".tamga-input",
  ".tamga-input-group",
  ".tamga-select",
  ".tamga-segment",
  ".tamga-qty",
  ".tamga-secret",
];

const ham = readFileSync(new URL("../packages/ui/src/kit.css", import.meta.url), "utf8");
/* Yorumlar siliniyor, satır sayısı korunuyor: `check-yuvarlak`ta bir kapının
   kendi gerekçe yorumunu ihlal sanması bir kez yaşandı. */
const css = ham.replace(/\/\*[\s\S]*?\*\//g, (y) => y.replace(/[^\n]/g, " "));

/** Bir sınıfın TAM seçicili (`.x {`) bloğunu bul ve gövdesini döndür. */
function govde(sinif) {
  const i = css.indexOf(`\n  ${sinif} {`);
  if (i === -1) return null;
  const bas = css.indexOf("{", i) + 1;
  let derinlik = 1;
  let j = bas;
  while (j < css.length && derinlik > 0) {
    if (css[j] === "{") derinlik++;
    else if (css[j] === "}") derinlik--;
    j++;
  }
  return css.slice(bas, j - 1);
}

const kusurlu = [];
for (const sinif of KONTROLLER) {
  const g = govde(sinif);
  if (g === null) {
    kusurlu.push([sinif, "bu seçici kit.css'te yok — adı değiştiyse listeyi güncelle"]);
    continue;
  }
  const m = g.match(/(?:^|;|\s)height:\s*([^;}]+)/);
  if (!m) kusurlu.push([sinif, "yükseklik bildirmiyor · dolgudan gelen yükseklik hizalanmaz"]);
  else if (m[1].trim() !== "var(--control)") kusurlu.push([sinif, `height: ${m[1].trim()}`]);
}

if (kusurlu.length) {
  console.error(
    `check-olcu-hizasi: ${kusurlu.length} kontrol \`--control\` yüksekliğinde değil.\n`,
  );
  for (const [sinif, ne] of kusurlu) console.error(`  ${sinif}  →  ${ne}`);
  console.error(`
Bir araç çubuğunda yan yana duran kontroller aynı token'ı okumalı; ölçü sayfası
bunu yazılı olarak vadediyor. Küçük boy bir kontrol ekliyorsan taban değil
varyant sınıfına yaz (\`-sm\`), o zaten bu listede yok.`);
  process.exit(1);
}

console.log(`✓ Kontrol hizası tamam — ${KONTROLLER.length} taban kontrol, hepsi \`--control\`.`);
