#!/usr/bin/env node
/**
 * KAPI: hover, SEÇİLİ hâlin fiziğini ezmiyor.
 *
 * NEDEN VAR. Bu hata üç kez çıktı ve üçünde de gözle bulundu: rayda seçili
 * satır imlecin altında yıkanıyordu, segmentte seçili düğmenin gölgesi
 * büyüyüp nesne yerinde kalıyordu, onay kutusunda ise işaretlenen kutu imleç
 * üstündeyken geri kalkıyordu · tıklayan kişi hiçbir şey olmamış gibi
 * görüyordu. Yazılı karar hep aynıydı: "buradasın" imleçle değişmez.
 *
 * NEDEN `check-physics` GÖRMÜYOR. O kapı kaymayı MUTLAK ölçüyor ve hover'dan
 * tam (-1, -1) bekliyor. Seçili duruşun kendi ofseti varsa (segmentte -1)
 * hover aynı değeri yazarak kuralı geçiyor, ama nesne hiç kalkmıyor.
 *
 * NE İDDİA EDİYOR. Bir `:hover` kuralı `transform` ya da `box-shadow` yazıyorsa
 * ve aynı sınıfın bir DURUM kuralı (`[data-checked="true"]`, `[data-active]`,
 * `[aria-current]`, `[aria-pressed]`, `[aria-checked]`) aynı özellikleri
 * yazıyorsa, hover kuralı o durumu açıkça dışarıda bırakmak zorunda.
 */
import { readFileSync } from "node:fs";

const DURUM =
  /\[data-checked="true"\]|\[data-active="true"\]|\[aria-checked="true"\]|\[aria-current|\[aria-pressed="true"\]|\[data-selected="true"\]/;
const DISLAMA =
  /:not\(\[(data-checked|data-active|aria-checked|aria-pressed|data-selected|aria-current)[^\]]*\]\)/;
const FIZIK = /(^|;|\s)(transform|box-shadow)\s*:/;

const css = readFileSync(new URL("../packages/ui/src/kit.css", import.meta.url), "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);

/* Virgül parantezin İÇİNDE bölmüyor: `:is(.a, .b)` tek bir seçici. */
function parcala(metin) {
  const out = [];
  let derin = 0;
  let son = 0;
  for (let i = 0; i < metin.length; i++) {
    const c = metin[i];
    if (c === "(") derin++;
    else if (c === ")") derin--;
    else if (c === "," && derin === 0) {
      out.push(metin.slice(son, i));
      son = i + 1;
    }
  }
  out.push(metin.slice(son));
  return out.map((x) => x.trim()).filter(Boolean);
}

const kurallar = [];
let sira = 0;
for (const [, sec, govde] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const s = sec.trim();
  if (!s || s.startsWith("@")) continue;
  for (const tek of parcala(s)) kurallar.push({ sec: tek, govde, sira: sira++ });
}

/* Özgüllük: sınıf + öznitelik + sözde-sınıf sayısı. `:where` 0, `:is`/`:not`
   en büyük argümanı kadar · kademeyi belirleyen sayı bu. */
function ozgulluk(sec) {
  let s = sec.replace(/:where\([^()]*\)/g, "");
  let puan = 0;
  s = s.replace(/:(is|not|has)\(([^()]*)\)/g, (_, __, ic) => {
    puan += Math.max(...parcala(ic).map(ozgulluk));
    return "";
  });
  puan += (s.match(/\.[a-zA-Z0-9_-]+/g) ?? []).length;
  puan += (s.match(/\[[^\]]+\]/g) ?? []).length;
  puan += (s.match(/:[a-z-]+(\([^()]*\))?/g) ?? []).filter((p) => !p.startsWith("::")).length;
  return puan;
}

const siniflar = (sec) => sec.match(/\.tamga-[a-z0-9-]+/g) ?? [];
const durumlar = kurallar.filter((k) => DURUM.test(k.sec) && FIZIK.test(k.govde));
const hoverlar = kurallar.filter((k) => /:hover/.test(k.sec) && FIZIK.test(k.govde));

const ihlaller = [];
for (const d of durumlar) {
  for (const h of hoverlar) {
    if (!siniflar(d.sec).some((c) => h.sec.includes(c))) continue;
    if (DISLAMA.test(h.sec)) continue;
    const oh = ozgulluk(h.sec);
    const od = ozgulluk(d.sec);
    if (oh > od || (oh === od && h.sira > d.sira)) ihlaller.push({ d, h, od, oh });
  }
}

if (ihlaller.length) {
  console.error(`check-durum-hover: ${ihlaller.length} yerde hover seçili hâli eziyor.\n`);
  for (const { d, h, od, oh } of ihlaller) {
    console.error(`  durum (özgüllük ${od}): ${d.sec.replace(/\s+/g, " ")}`);
    console.error(`  hover (özgüllük ${oh}): ${h.sec.replace(/\s+/g, " ")}\n`);
  }
  console.error(`Seçili olanın ayrı bir hover'ı yok: "buradasın" imleçle değişmez.
Hover kuralına durumu dışlayan bir :not(...) ekle, ya da hover kuralını sil.`);
  process.exit(1);
}
console.log(
  `✓ Hover seçili hâli ezmiyor — ${durumlar.length} durum kuralı, ${hoverlar.length} hover kuralı karşılaştırıldı.`,
);
