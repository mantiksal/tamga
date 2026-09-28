#!/usr/bin/env node
/**
 * KAPI: tam yuvarlak yalnız üç yerde.
 *
 * NEDEN VAR. Tasarım dilinin yazılı cümlesi şu: "Tam yuvarlak yok · yalnızca
 * radyo, skor halkası ve halka spinner daireseldir." Sebebi keyfi değil ·
 * onay kutusu ÇOKLU bir seçim, radyo TEKLİ bir seçim, ve şekil farkı bunu tek
 * bakışta söylüyor. Kitin geri kalanı duran köşelerle çiziliyor, çünkü yoğun
 * bir satır listesi kıvrılan köşelerden çok duran kenarlarla taranıyor.
 *
 * VE KURAL YAZILIYDI AMA KAPISI YOKTU. Soft Neo Brutalism portu bittikten
 * sonra 2026-09-26'da tarandığında Slider'ın hem rayı (`rounded-full`) hem
 * topuzu (`border-radius: 50%`) hâlâ yuvarlaktı · aylardır öyleydi, hiçbir
 * kapı görmedi, ve gözle de kimse fark etmedi çünkü tek başına bakınca
 * yanlış görünmüyor. Yanlış olan, yanındaki her şeyle çelişmesi.
 *
 * NE İDDİA EDİYOR. `kit.css`te `border-radius: 50%` (ya da `9999px`,
 * `--radius-full`) yalnız aşağıdaki muafiyet listesindeki seçicilerde
 * geçebilir. Liste SEÇİCİ adına bakıyor, renge ya da bağlama değil: bir
 * muafiyet eklemek, adını buraya yazmayı gerektiriyor.
 *
 * SVG'de çizilen daireler (halka spinner) bu kapının dışında: onlar `<circle>`,
 * CSS köşesi değil. Skor halkası 2026-09-27'de SVG'den CSS'e geçti (conic
 * gradient), o yüzden artık listede.
 */
import { readFileSync } from "node:fs";

/*
 * MUAFİYETLER İKİ DOKÜMANDAN GELİYOR, ve ikisi tam olarak aynı şeyi söylemiyor.
 * Tasarım dilinin README'si "yalnızca radio, skor halkası ve halka spinner"
 * diyor; kitin kendi ölçü sayfası (`/docs/olcu`) buna avatarı ve canlı noktayı
 * ekliyor: "Tam yuvarlak iki şeye ayrıldı: avatar ve canlı nokta." Kiti
 * yöneten doküman kitin kendisininki, o yüzden liste beşli. Fark burada
 * yazılı ki bir gün biri "bu ikisi nereden çıktı" diye sorduğunda cevabı
 * aramak zorunda kalmasın.
 */
const MUAF = [
  /\.tamga-radio\b/, // tekli seçim · yasanın kendisi
  /\.tamga-avatar\b/, // kişi fotoğrafı · yuvarlak olan gerçek dünyadaki şey
  /\.tamga-dot\b/, // canlılık noktası
  /\.tamga-beacon\b/,
  /\.tamga-live\b/,
  /\.tamga-ring\b/, // skor halkası · tanımı gereği daire
  /\.tamga-ring-ic\b/, // halkanın iç diski
  /* Halka spinner · README'nin üçlü listesindeki üçüncü madde. Bir süre
     kitte hiç yoktu (spinner yalnız çubuklardı), o yüzden liste de onu
     tanımıyordu. */
  /\.tamga-spin-ring\b/,
];

const ham = readFileSync(new URL("../packages/ui/src/kit.css", import.meta.url), "utf8");
/* YORUMLAR SİLİNİYOR AMA SATIR SAYISI KORUNUYOR · ilk koşuşta kapı kendi
   gerekçe yorumumu yakaladı ("`border-radius: 50%` idi" diye yazıyordu) ve
   rapor ettiği seçici bambaşkaydı. Bir kapının kendi belgesini ihlal sanması,
   raporunu da güvenilmez yapar. */
const kaynak = ham.replace(/\/\*[\s\S]*?\*\//g, (y) => y.replace(/[^\n]/g, " "));
const satirlar = kaynak.split("\n");
const yuvarlak = /border-radius:\s*(50%|9999px|var\(--radius-full\))/;

/** Bir satırın hangi kural bloğunda olduğunu bulmak için geriye doğru en yakın seçiciyi ara. */
function seciciBul(i) {
  for (let j = i; j >= 0; j--) {
    const s = satirlar[j].trim();
    if (s.endsWith("{") && !s.startsWith("@") && !s.startsWith("/*")) return s.slice(0, -1).trim();
  }
  return "(bilinmiyor)";
}

const ihlaller = [];
satirlar.forEach((satir, i) => {
  if (!yuvarlak.test(satir)) return;
  const sec = seciciBul(i);
  if (MUAF.some((m) => m.test(sec))) return;
  ihlaller.push({ satir: i + 1, sec, metin: satir.trim() });
});

if (ihlaller.length) {
  console.error(`check-yuvarlak: ${ihlaller.length} ihlal.\n`);
  for (const k of ihlaller) {
    console.error(`  packages/ui/src/kit.css:${k.satir}  ${k.sec}`);
    console.error(`      ${k.metin}`);
  }
  console.error(`
Tam yuvarlak yalnız radyo, skor halkası ve halka spinner için · yazılı hâli
doküman sitesi /docs/fizik. Gerçekten yuvarlak olması gereken yeni bir şey
varsa muafiyet listesi bu dosyanın başında, ve oraya yazmak bir KARAR.`);
  process.exit(1);
}
console.log("✓ Tam yuvarlak yalnız muaf üç yerde — kitin köşeleri duruyor.");
