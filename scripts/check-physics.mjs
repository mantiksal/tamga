#!/usr/bin/env node
/**
 * KAPI: Yasa 1 — tek yükseltme formülü.
 *
 * NEDEN VAR. Fizik bozulduğunda hiçbir şey hata vermez. Renkler geçerli kalır,
 * kontrast kapıları geçer, derleme yeşildir; panel yalnız "ucuz" hissettirmeye
 * başlar ve kimse nedenini bulamaz. Bu, adım şeridinin dolgusunu metin
 * token'ıyla yapan hatayla aynı sınıf: sessiz, ve ancak gözle ya da bir kapıyla
 * bulunuyor.
 *
 * BU ÖLÇÜM BİR YERDEN TAŞINDI. Önceden dashboard-v5'te iki Playwright testi
 * vardı ve Storybook'un sayfalarını açıp gerçek fareyle ölçüyordu. Ürün deposu
 * yanlış yerdi: yasa kitin malı, ölçümü de burada olmalı. Storybook söküldü,
 * ölçüm buraya geldi. Değiş tokuş bilinçli — tarayıcı testi dört düğme
 * varyantına bakıyordu, bu kapı YÜKSELEN HER SINIFA bakıyor; karşılığında
 * "kural yazıldı ama başka bir kural ezdi" hâlini göremiyor. O hâli `check-css`
 * (yutulan kural) ve `check-kit-class` (tanımsız sınıf) koruyor.
 *
 * NE İDDİA EDİYOR. Yasanın YAZILI metni (doküman sitesi, /docs/fizik):
 * "1px kenar + N px sert offset, AYNI RENKTE. Bulanıklık yok, opaklık yok."
 * artı merdiven: 0 · 1 · 2 · 3 · 4 · 6.
 *
 *   A  bulanıklık sıfır          bulanıklık bir ölçü vermez
 *   B  offset çapraz (x = y)     yoksa nesne basınca kendi gölgesinin yanına iner
 *   C  offset merdivende         ara değer icat edilmez
 *   D  kenar ve gölge aynı renk  formülün kendisi
 *   E  basılı hâl 0'a iner, ve kayma duruş offsetinin TAM KENDİSİ
 *   F  hover yükseliyorsa offset tam 1 büyür ve kayma (-1px, -1px)
 *
 * İddialar İLİŞKİSEL, sabit sayı değil: birincil buton 3'te durur, ikincil 2'de,
 * ve kapı ikisini de kendi duruş yüksekliğine göre ölçer. Token değişince
 * kırılmaz, yasa çiğnenince kırılır.
 *
 * NE YOK SAYIYOR. `inset` gölgeler (seçili satırın sol kuralı — Yasa 2'nin
 * yazılı istisnası), `none`, ve kenar rengini KENDİ kuralında bildirmeyen
 * satırlar: kenarı üst kuraldan miras alan bir satırda "aynı renk mi" sorusu
 * çıkarım gerektirir, ve çıkarım yapan kapı yanlış suçlar.
 */
import { readFileSync } from "node:fs";

const KOK = new URL("..", import.meta.url).pathname;
const DOSYA = "packages/ui/src/kit.css";
const MERDIVEN = new Set([0, 1, 2, 3, 4, 6]);

/* Yorumlar SİLİNMİYOR, boşluğa çevriliyor. Silince her yorum kadar satır kayıyor
   ve kapı insanı dosyanın yanlış yerine gönderiyor — bir kapının en sinir bozucu
   hâli, çünkü raporu doğru ama adresi yanlış. */
const css = readFileSync(KOK + DOSYA, "utf8").replace(/\/\*[\s\S]*?\*\//g, (y) => y.replace(/[^\n]/g, " "));

const satirNo = (i) => css.slice(0, i).split("\n").length;

const golgeyiAyir = (ham) => {
  if (!ham || /^none/.test(ham)) return null;
  if (/^inset/.test(ham)) return { inset: true };
  /* CSS'te birimsiz sıfır yasal: `0 0 0 var(--x)`. `px` şart koşmak basılı
     hâlin TAMAMINI çözülemedi sanmama yol açtı. */
  const m = ham.match(/^(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+([\d.]+)(?:px)?\s*(?:[\d.]+(?:px)?\s*)?(var\([^)]+\)|#[0-9a-fA-F]+)?/);
  if (!m) return { cozulemedi: ham };
  return { x: +m[1], y: +m[2], blur: +m[3], renk: m[4] ?? null };
};
const kaymayiAyir = (ham) => {
  const m = ham?.match(/translate\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px\s*\)/);
  return m ? { x: +m[1], y: +m[2] } : null;
};
const soy = (s) =>
  s.replace(/:(not\([^)]*\)|hover|active|focus-visible|focus|disabled)/g, "").replace(/\[[^\]]*\]/g, "").trim();
const durumu = (s) =>
  /:active/.test(s) ? "active" : /:focus-visible/.test(s) ? "focus" : /:hover/.test(s) ? "hover" : "rest";

/* ---- kuralları topla ---- */
const kurallar = [];
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const secici = m[1].trim().replace(/\s+/g, " ");
  if (!secici.includes(".tamga-")) continue;
  const g = m[2].match(/box-shadow:\s*([^;]+);/)?.[1]?.trim();
  const k = m[2].match(/transform:\s*([^;]+);/)?.[1]?.trim();
  const kenar = m[2].match(/border(?:-color)?:\s*(?:1px\s+solid\s+)?(var\([^)]+\)|#[0-9a-fA-F]+)/)?.[1];
  if (!g && !k) continue;
  /* Çoklu seçici tek kuraldır ama iki aileye yazılır. */
  for (const tek of secici.split(",").map((s) => s.trim()).filter((s) => s.includes(".tamga-"))) {
    kurallar.push({
      secici: tek, aile: soy(tek), durum: durumu(tek),
      golge: golgeyiAyir(g), kayma: kaymayiAyir(k), kenar,
      /* Eşleşme bir önceki `}`den sonra başlıyor, yani baştaki satır sonunu da
         içeriyor; seçicinin ilk harfine kadar atla. */
      satir: satirNo(m.index + m[0].search(/\S/)), tamGolge: g,
    });
  }
}

const hatalar = [];
const ekle = (k, metin) => hatalar.push(`  ${DOSYA}:${k.satir}  ${k.secici}\n      ${metin}`);

/* ---- A · B · C · D: her gölge bildirimi ---- */
for (const k of kurallar) {
  const g = k.golge;
  if (!g || g.inset) continue;
  if (g.cozulemedi) { ekle(k, `gölge çözülemedi: "${g.cozulemedi}"`); continue; }

  if (g.blur !== 0) ekle(k, `A · bulanıklık ${g.blur}px, yasa bulanıklık tanımıyor`);
  if (g.x !== g.y) ekle(k, `B · offset çapraz değil (${g.x}, ${g.y}); basınca nesne kendi gölgesinin yanına iner`);
  if (!MERDIVEN.has(Math.abs(g.x))) ekle(k, `C · ${Math.abs(g.x)}px merdivende yok (0 · 1 · 2 · 3 · 4 · 6)`);
  if (k.kenar && g.renk && k.kenar !== g.renk)
    ekle(k, `D · kenar ${k.kenar}, gölge ${g.renk}; yasa "1px kenar + N px sert offset, AYNI RENKTE" diyor`);
}

/* ---- E · F: aile içi ilişkiler ---- */
const aileler = new Map();
for (const k of kurallar) {
  if (!aileler.has(k.aile)) aileler.set(k.aile, { rest: [], hover: [], active: [], focus: [] });
  aileler.get(k.aile)[k.durum].push(k);
}
/* Bir varyant kaymayı temel aileden miras alır: `.tamga-btn-danger` yalnız rengi
   değiştirir, `translate`i `.tamga-btn` verir. En uzun önek kazanır. */
const mirasKayma = (aile, durum) => {
  /* ÖNCE AYNI AİLE. `.tamga-kpi-live[data-pressed]:hover` yalnız rengi
     değiştiriyor; kaymayı `.tamga-kpi-live:hover` veriyor ve nitelikli seçici
     onu ezmiyor. Yalnız önek ailelere bakmak bunu ihlal sanıyordu. */
  const kardes = aileler.get(aile)?.[durum]?.find((k) => k.kayma);
  if (kardes) return kardes.kayma;
  let en = null;
  for (const [a, d] of aileler) {
    if (a === aile || !aile.startsWith(a)) continue;
    if (d[durum].some((k) => k.kayma) && (!en || a.length > en.length)) en = a;
  }
  return en ? aileler.get(en)[durum].find((k) => k.kayma)?.kayma : null;
};

for (const [aile, d] of aileler) {
  const duruş = d.rest.find((k) => k.golge && !k.golge.inset && !k.golge.cozulemedi);
  if (!duruş || duruş.golge.x === 0) continue;
  const yukseklik = duruş.golge.x;

  for (const k of d.active) {
    if (!k.golge || k.golge.inset || k.golge.cozulemedi) continue;
    if (k.golge.x !== 0) ekle(k, `E · basılı hâl ${k.golge.x}px; yasa "basınca 0'a iner ve gerçekten gömülür" diyor`);
    const kayma = k.kayma ?? mirasKayma(aile, "active");
    if (!kayma) ekle(k, `E · basılı hâlde kayma yok; nesne gömülmüyor, yalnız gölgesini kaybediyor`);
    else if (kayma.x !== yukseklik || kayma.y !== yukseklik)
      ekle(k, `E · kayma (${kayma.x}, ${kayma.y}) duruş yüksekliği ${yukseklik}px ile eşit değil; 1:1 dibe oturma bozuluyor`);
  }

  for (const k of d.hover) {
    if (!k.golge || k.golge.inset || k.golge.cozulemedi) continue;
    if (k.golge.x === yukseklik) continue; /* renk hover'ı: yükselme iddiası yok */
    if (k.golge.x !== yukseklik + 1)
      ekle(k, `F · hover ${k.golge.x}px, duruş ${yukseklik}px; yükselme tam 1 basamaktır`);
    const kayma = k.kayma ?? mirasKayma(aile, "hover");
    if (!kayma) ekle(k, `F · hover'da gölge büyüyor ama nesne kalkmıyor; gölge nesneden koparsa yükseklik yalan olur`);
    else if (kayma.x !== -1 || kayma.y !== -1)
      ekle(k, `F · hover kayması (${kayma.x}, ${kayma.y}); yükselme (-1px, -1px)`);
  }

  for (const k of d.focus) {
    if (k.golge && !k.golge.inset && !k.golge.cozulemedi && k.golge.x === 0 && yukseklik > 0)
      ekle(k, `odakta yükseklik düzleşiyor; odak halka EKLER, yüksekliği almaz`);
  }
}

if (hatalar.length) {
  console.error(`check-physics: ${hatalar.length} yasa ihlali.\n`);
  for (const h of hatalar) console.error(h);
  console.error("\n  Yasanın yazılı hâli: doküman sitesi /docs/fizik · Yasa 1.");
  process.exit(1);
}
const say = kurallar.filter((k) => k.golge && !k.golge.inset && !k.golge.cozulemedi).length;
console.log(`✓ Yasa 1 tamam — ${aileler.size} ailede ${say} yükseltme, merdivende ve çapraz.`);
