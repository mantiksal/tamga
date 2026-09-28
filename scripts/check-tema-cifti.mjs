#!/usr/bin/env node
/**
 * TEMA ÇİFTİ KAPISI — sabit bir zeminin üstünde dönen bir mürekkep.
 *
 * NE YAKALIYOR. Kitin renkleri iki gruba ayrılıyor: temayla DÖNENLER
 * (`--color-ink` açıkta lacivert, koyuda açık gri) ve iki temada SABİT olanlar
 * (`--color-critical-mark` iki temada da bordo, `--color-inverse-ink` iki temada
 * da beyaz). Bir kural sabit bir zeminle dönen bir mürekkebi eşleştirdiğinde
 * açık temada doğru görünüyor ve koyu temada yazı zemine dönüyor. Gözle
 * bulmanın tek yolu koyu temayı açıp bütün ekranları gezmek; kimse gezmez.
 *
 * ÜÇ KEZ OLDU, ve üçü de aynı biçimde: seçim çubuğu (`--color-ink` zemini koyu
 * temada açığa dönüp beyaz yazıyı yok etti), vurgulu bağlantı (sabit açık mavi
 * yıkamanın üstünde dönen mürekkep, kontrast 1.36) ve tehlike ikon düğmesi
 * (sabit bordo plaka + `--color-page`, koyu temada 2.96). İlk ikisi tek tek
 * düzeltildi ve kapı yoktu; bu kapı sınıfın kendisini ölçüyor.
 *
 * NE GÖRMÜYOR, ve bilerek: zemini bir kuralda, yazısını başka bir kuralda alan
 * çiftler (`.tamga-chip` + `.tamga-chip-danger`) burada eşleşmiyor · CSS'i
 * gerçekten çözmek gerekir. Bu kapı TEK bir kuralda hem `background` hem `color`
 * yazan yerleri ölçüyor, çünkü kusurun çıktığı yer tam orası.
 */
import { readFileSync } from "node:fs";
import { bloklar, oran } from "./token-oku.mjs";

const AA = 4.5;
const { kitAcik, kitKoyu } = bloklar();

const hexMi = (v) => typeof v === "string" && /^#[0-9a-f]{3,8}$/i.test(v);

/* Bir token bir başkasına `var()` ile bakabiliyor; zincirin sonundaki hex'i al. */
function coz(t, ad, derinlik = 0) {
  const v = t.get(ad);
  if (!v) return null;
  if (hexMi(v)) return v;
  const m = /var\((--[a-z0-9-]+)\)/i.exec(v);
  return m && derinlik < 6 ? coz(t, m[1], derinlik + 1) : null;
}

const css = readFileSync(new URL("../packages/ui/src/kit.css", import.meta.url), "utf8");
/* En içteki bloklar: `@layer`/`@media` sarmalayıcıları bu desenle eşleşmiyor,
   kural gövdeleri eşleşiyor. */
const kurallar = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];

const tokeni = (govde, ozellik) => {
  const m = new RegExp(`(?:^|;|\\s)${ozellik}\\s*:\\s*([^;]+)`, "i").exec(govde);
  if (!m) return null;
  const t = /var\((--[a-z0-9-]+)/.exec(m[1]);
  return t ? t[1] : null;
};

const hatalar = [];
let olcum = 0;

for (const [, sec, govde] of kurallar) {
  /* Seçiciden önce gelen yorum bloğu eşleşmenin içinde kalıyor; mesajda yalnız
     seçici okunsun diye atılıyor. */
  const secici = sec.replace(/\/\*[\s\S]*?\*\//g, " ").trim().replace(/\s+/g, " ");
  if (!secici.includes(".tamga")) continue;

  const zeminAd = tokeni(govde, "background") ?? tokeni(govde, "background-color");
  const yaziAd = tokeni(govde, "color");
  if (!zeminAd || !yaziAd) continue;

  const za = coz(kitAcik, zeminAd), zk = coz(kitKoyu, zeminAd);
  const ya = coz(kitAcik, yaziAd), yk = coz(kitKoyu, yaziAd);
  if (!za || !zk || !ya || !yk) continue;

  const zeminSabit = za.toLowerCase() === zk.toLowerCase();
  const yaziSabit = ya.toLowerCase() === yk.toLowerCase();
  /* İkisi de sabit ya da ikisi de dönüyorsa çift tutarlı: bu kapının konusu
     değil, okunurluğu `check-token-contrast` ölçüyor. */
  if (zeminSabit === yaziSabit) continue;

  olcum++;
  const oa = oran(ya, za), ok = oran(yk, zk);
  if (Math.min(oa, ok) < AA) {
    hatalar.push(
      `${secici}\n     zemin ${zeminAd} ${zeminSabit ? "(iki temada sabit)" : "(temayla dönüyor)"} · ` +
        `yazı ${yaziAd} ${yaziSabit ? "(iki temada sabit)" : "(temayla dönüyor)"}\n` +
        `     açık ${oa.toFixed(2)} · koyu ${ok.toFixed(2)} — biri AA ${AA} altında`,
    );
  }
}

if (hatalar.length) {
  console.error("✗ Sabit zemin ile dönen mürekkep eşleşmiyor:\n");
  for (const h of hatalar) console.error("  " + h + "\n");
  console.error(
    "Sabit bir zeminin mürekkebi de SABİT olmalı (örn. --color-inverse-ink,\n" +
      "--color-accent-soft-ink), dönen bir zeminin mürekkebi de dönmeli.",
  );
  process.exit(1);
}

console.log(`✓ Tema çiftleri tutarlı — ${olcum} karışık çift, ikisi de AA ${AA} üstünde.`);
