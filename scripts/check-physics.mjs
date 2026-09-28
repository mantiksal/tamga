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
 * "1 ya da 1.5px kenar + N px sert offset, AYNI RENKTE. Bulanıklık yok, opaklık
 * yok." artı merdiven: 0 · 1 · 2 · 3 · 4 · 5 · 6 · 7.
 *
 *   A  bulanıklık sıfır          bulanıklık bir ölçü vermez
 *   B  offset çapraz (|x| = |y|) yoksa nesne basınca kendi gölgesinin yanına iner
 *   C  offset merdivende         ara değer icat edilmez
 *   D  kenar ve gölge aynı renk  formülün kendisi
 *   E  basılı hâl 0'a iner, ve kayma duruş offsetinin TAM KENDİSİ
 *   F  hover yükseliyorsa merdivende YUKARI çıkar ve kayma (-1px, -1px)
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
/* MERDİVEN 2026-09-24'TE ARALIK OLDU (0-7), SEÇİLMİŞ BİR KÜME DEĞİL.
   Önce `{0,1,2,3,4,6}` idi ve 5'i atlaması bilinçliydi: yukarı çıktıkça
   basamaklar büyüsün, ve "ne kadar yükselmiş" sorusunun altı cevabı olsun.
   Tasarım dili o boşluğu dolduruyor ve 5'i EN ÇOK kullanılan değer yapıyor
   (111 kullanım, ikincisi 4 ile 36); 7 de kartın hover'ında var. Kümeyi
   korumak, dilin tamamını bir basamak aşağı çekmek demekti.
   KAYBEDİLEN ŞEY SÖYLENMELİ: artık liste "kısa" değil, yani bu kural tek
   başına bir yükseltmenin ÖLÇÜSÜNÜ kısıtlamıyor. Geriye kalan dört kısıt
   duruyor ve asıl işi onlar yapıyor: tam sayı, çapraz, bulanıksız, kenarla
   aynı renk, ve basınca 0. */
const MERDIVEN = new Set([0, 1, 2, 3, 4, 5, 6, 7]);

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

const hatalarG = [];

/* ---- kuralları topla ---- */
const kurallar = [];
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const secici = m[1].trim().replace(/\s+/g, " ");
  if (!secici.includes(".tamga-")) continue;
  const g = m[2].match(/box-shadow:\s*([^;]+);/)?.[1]?.trim();
  const k = m[2].match(/transform:\s*([^;]+);/)?.[1]?.trim();
  /* KENAR 1px YA DA 1.5px. Kontroller kalın olanı alıyor (basılan bir tuşun
     çizgisi), yüzeyler ince olanı. Desen ikisini de tanımazsa "kenar bildirilmemiş"
     sayar ve D kuralı sessizce atlanır: renk eşleşmesi hiç denetlenmez. */
  const kenar = m[2].match(/border(?:-color)?:\s*(?:1(?:\.5)?px\s+solid\s+)?(var\([^)]+\)|#[0-9a-fA-F]+)/)?.[1];
  /* Kalınlığın KENDİSİ de bir kural (G), ve uzun süre yalnız yazılıydı. */
  const kalinlik = m[2].match(/border:\s*([\d.]+)px\s+(?:solid|dashed)/)?.[1];
  if (!g && !k) continue;
  /* Çoklu seçici tek kuraldır ama iki aileye yazılır. */
  for (const tek of secici.split(",").map((s) => s.trim()).filter((s) => s.includes(".tamga-"))) {
    kurallar.push({
      secici: tek, aile: soy(tek), durum: durumu(tek),
      golge: golgeyiAyir(g), kayma: kaymayiAyir(k), kenar, kalinlik,
      /* Eşleşme bir önceki `}`den sonra başlıyor, yani baştaki satır sonunu da
         içeriyor; seçicinin ilk harfine kadar atla. */
      satir: satirNo(m.index + m[0].search(/\S/)), tamGolge: g,
    });
  }
}

/* ---- G · kenar kalınlığı ---- *
 *
 * Yasanın yazılı yarısı: "Kenar iki kalınlıkta: 1.5px BASILAN şeylerde (buton,
 * girdi, anahtar), 1px DURAN yüzeylerde (kart, panel)." Bu cümle aylarca
 * dokümanda durdu ve hiçbir yerde ölçülmedi; sonuç, ikon düğmesinin 1px'te
 * kalması oldu · `tamga-btn` ve `tamga-mini-btn` 1.5px iken yanlarındaki ikon
 * düğmesi incecikti ve kimse fark etmedi, çünkü tek başına bakınca yanlış
 * görünmüyor.
 *
 * AYIRIM BASILIP BASILMADIĞI: bir kural `:active`inde oturuyorsa ya da bir
 * `transform` taşıyorsa o nesne basılıyor demektir. Basılmayan ama yükselen
 * şeyler (kart, panel, overlay) 1px alıyor.
 *
 * Muafiyet listesi yok: bir nesne ikisinden birine girmiyorsa aile adı burada
 * yazılı olmalı, ve yazmak bir karar.
 */
const YUZEY = new Set([
  "tamga-card", "tamga-kpi", "tamga-appearance", "tamga-raised",
  "tamga-surface", "tamga-rail-mini", "tamga-theme", "tamga-art",
]);
const basilanAileler = new Set(
  kurallar.filter((k) => /:active/.test(k.secici) && k.kayma).map((k) => k.aile),
);
for (const k of kurallar) {
  if (!k.kalinlik) continue;
  const yuzey = YUZEY.has(k.aile);
  const beklenen = yuzey ? "1" : basilanAileler.has(k.aile) ? "1.5" : null;
  if (beklenen === null) continue;
  if (k.kalinlik !== beklenen) {
    hatalarG.push({ k, metin: `G · ${yuzey ? "duran yüzey" : "basılan nesne"} ${beklenen}px kenar ister, ${k.kalinlik}px yazılmış` });
  }
}

const hatalar = [];
const ekle = (k, metin) => hatalar.push(`  ${DOSYA}:${k.satir}  ${k.secici}\n      ${metin}`);
for (const { k, metin } of hatalarG) ekle(k, metin);

/* ---- A · B · C · D: her gölge bildirimi ---- */
for (const k of kurallar) {
  const g = k.golge;
  if (!g || g.inset) continue;
  if (g.cozulemedi) { ekle(k, `gölge çözülemedi: "${g.cozulemedi}"`); continue; }

  if (g.blur !== 0) ekle(k, `A · bulanıklık ${g.blur}px, yasa bulanıklık tanımıyor`);
  /* ÇAPRAZLIK MUTLAK DEĞERDE ARANIYOR, ve bu 2026-09-24'te gevşedi.
     Kural `x === y` idi, yani gölge yalnız SAĞA-aşağı düşebiliyordu. Sağ kenara
     yaslanan bir çekmecede o yön nesnenin kendi boşluğuna bakıyor: gölge
     görünmüyor. Ayna görüntüsü (`-6px 6px`) hâlâ çapraz, hâlâ aynı uzunlukta,
     ve basınca hâlâ kendi gölgesinin ÜSTÜNE oturuyor · B'nin koruduğu şey
     bozulmuyor. Serbest bırakılan tek şey gölgenin hangi yana düştüğü. */
  if (Math.abs(g.x) !== Math.abs(g.y))
    ekle(k, `B · offset çapraz değil (${g.x}, ${g.y}); basınca nesne kendi gölgesinin yanına iner`);
  if (!MERDIVEN.has(Math.abs(g.x))) ekle(k, `C · ${Math.abs(g.x)}px merdivende yok (0 · 1 · 2 · 3 · 4 · 5 · 6 · 7)`);
  /* D'NİN ADLANDIRILMIŞ İSTİSNASI. Yasanın yazılı hâline 2026-09-25'te bir
     cümle eklendi (doküman sitesi /docs/fizik · "Tek istisna"): offset bir
     YÜKSEKLİK değil bir SİNYAL olduğunda farklı renkte olabiliyor. Odaklanan
     girdi katmanını yumuşak vurguda atıyor ("klavye burada"), bildirim
     katmanını vurguda atıyor ("buraya bak").
     İSTİSNA RENGE DEĞİL ADA BAĞLI. Renge bakan bir muafiyet, her bileşenin
     kendi rengini seçmesine kapı açardı ve yasa bir tavsiyeye dönerdi. Yalnız
     bu iki token geçiyor; üçüncüsü gerekiyorsa önce dokümanda adı konur. */
  const SINYAL_RENK = new Set(["var(--color-accent-soft)", "var(--color-accent)"]);
  /* Muaf seçiciler TEK TEK yazılı, bir desenle değil. `/:focus/` gibi bir
     desen, ileride eklenen her `:focus-within`i de sessizce affederdi · ve bir
     muafiyetin sessizce genişlemesi, muafiyetin kendisinden daha pahalı. */
  const SINYAL_SECICI = [':focus', '[aria-expanded="true"]', '.tamga-toast'];
  const sinyalMi = SINYAL_RENK.has(g.renk) && SINYAL_SECICI.some((x) => k.secici.includes(x));
  if (k.kenar && g.renk && k.kenar !== g.renk && !sinyalMi)
    ekle(k, `D · kenar ${k.kenar}, gölge ${g.renk}; yasa "kenar + N px sert offset, AYNI RENKTE" diyor`);
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
    /* F GEVŞEDİ 2026-09-24, VE MERDİVEN GEVŞEMEDİ. Kural "tam 1 basamak"tı ve
       merdivende 5 olmadığı için şu çıkıyordu: 4'te dinlenen hiçbir şey hover
       YAPAMIYORDU (4+1=5, merdivende yok). Yani iki kural birlikte, yasanın
       kendisinin izin verdiği bir yüksekliği kullanılamaz kılıyordu.
       Serbest bırakılan şey sıçramanın BOYU; değerlerin kendisi hâlâ C
       kuralıyla merdivene bağlı, yani ara değer yine icat edilemiyor. */
    if (k.golge.x <= yukseklik)
      ekle(k, `F · hover ${k.golge.x}px, duruş ${yukseklik}px; hover merdivende YUKARI çıkmalı`);
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
