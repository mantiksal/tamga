#!/usr/bin/env node
/**
 * TEMA PARİTESİ — bir token iki temada da olmak zorunda.
 *
 * NE YAKALIYOR. Bir ürün (ya da kitin kendisi) bir rengi açık temada tanımlar,
 * koyuda unutur. Ekranda hiçbir şey patlamaz: token koyu temada açık temanın
 * değerine düşer, ve marka gece yarım kalır. Bunu gözle bulmanın tek yolu koyu
 * temayı açıp bütün ekranları gezmek; kimse gezmez.
 *
 * DÖRT BLOK, İKİ AİLE. Kitin iki ad ailesi var ve ikisi de iki temalı:
 *
 *   tema ailesi  (--background, --card, --foreground …)  theme.css :root / .dark
 *   kit ailesi   (--color-page, --color-ink, --color-edge …)
 *                açık: theme.css @theme static · koyu: kit.css .dark
 *
 * KİT AİLESİNİN İKİ DOSYAYA BÖLÜNMÜŞ OLMASI tam olarak bu kapıyı gerektiren
 * şey: aynı token'ın iki yarısı iki ayrı dosyada duruyorsa, birini yazıp
 * ötekini unutmak an meselesidir.
 *
 * TEMADAN BAĞIMSIZ TOKEN'LAR MUAF, ve muafiyet ADA DEĞİL DEĞERE bakıyor. Bir
 * yarıçap, bir süre, bir yazı boyu gecede değişmez. İlk hâli "--color- ile
 * başlayanlar" diyordu; tema ailesinin adları o öneki taşımıyor (--background,
 * --card, --primary), yani o ailede kural hiç işlemiyordu. Şimdi kural şu: bir
 * token'ın DEĞERİ renkse (ya da adı --shadow- ile başlıyorsa) iki temada da
 * olacak. Bu kural iki aileye de aynı şekilde uyuyor.
 */
import { bloklar } from "./token-oku.mjs";

const { temaAcik, temaKoyu, kitAcik, kitKoyu } = bloklar();

/* Renk gibi görünen her değer: hex, rgb(), oklch(), hsl(), color-mix(). */
const RENK = /^(#[0-9a-f]{3,8}|rgba?\(|oklch\(|hsla?\(|color-mix\()/i;
const temayaBagli = (ad, deger) => ad.startsWith("--shadow-") || RENK.test(deger ?? "");

const hatalar = [];

function karsilastir(ad, acik, koyu) {
  const a = [...acik.keys()].filter((t) => temayaBagli(t, acik.get(t)));
  const k = [...koyu.keys()].filter((t) => temayaBagli(t, koyu.get(t)));
  for (const t of a) {
    if (!koyu.has(t)) hatalar.push(`${ad}: ${t} açık temada var, KOYUDA YOK (gece açığın değerine düşer)`);
  }
  for (const t of k) {
    if (!acik.has(t)) hatalar.push(`${ad}: ${t} koyu temada var, AÇIKTA YOK`);
  }
  return a.length;
}

const n1 = karsilastir("tema ailesi", temaAcik, temaKoyu);
const n2 = karsilastir("kit ailesi", kitAcik, kitKoyu);

if (hatalar.length) {
  console.error("✗ Tema paritesi bozuk:\n");
  for (const h of hatalar) console.error("  " + h);
  console.error(
    "\nHer token HEM açık HEM koyu blokta olacak. Tema ailesi: theme.css'in\n" +
      "tamga:tema-acik / tamga:tema-koyu blokları. Kit ailesi: theme.css'in\n" +
      "tamga:kit-acik bloğu ve kit.css'in tamga:kit-koyu bloğu.",
  );
  process.exit(1);
}

console.log(`✓ Tema paritesi tam — ${n1} tema rengi + ${n2} kit rengi, hepsi iki temada.`);
