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
 * NE BAKIYOR: yorumların dengesi, süslü parantezlerin dengesi, bir METİN
 * token'ının DOLGU olarak kullanılmaması, ve bir sınıfın İKİ KEZ tanımlanmaması.
 *
 * DÖRDÜNCÜSÜ NEDEN. 2026-09-27'de bir sınıf yeniden adlandırıldı ve yeni ad
 * zaten kullanılıyordu (`.tamga-sayi`: rakamın yüzü). İki tanım aynı dosyada
 * durdu, sonraki kazandı, ve her sayı girdisi 18 piksellik bir sayaç çipine
 * dönüştü. Hiçbir şey hata vermedi: iki ad da tanımlıydı, yani `check-kit-class`
 * da haklı olarak geçti. Çakışmayı yalnız "bu ad ikinci kez mi tanımlanıyor"
 * sorusu yakalıyor.
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
/* Taranan her dosya adıyla birlikte saklanıyor: aşağıdaki seçici kapısı
   aynı kümeyi ikinci kez yürümesin. */
const dosyalar = [];

for (const base of SCAN) {
  for (const dosya of walk(base)) {
    const s = readFileSync(dosya, "utf8");
    const rel = relative(ROOT, dosya);
    dosyalar.push([rel, s]);

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

    /* Süslü parantez dengesi, yorumlar çıkarıldıktan sonra. Yorumun yerine
       SATIR SAYISI KADAR satır sonu konuyor: yoksa aşağıdaki hata mesajları
       dosyada olmayan satırları gösteriyor · ilk hâli tam bunu yaptı. */
    const kod = s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ""));
    const kodSatirlari = kod.split("\n");
    const tanimlar = new Map();

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
    /* AYNI SINIF AYNI BAĞLAMDA İKİ KEZ TANIMLANMASIN.

       Satır tahminiyle değil, süslü parantezleri yürüyerek: bir "tanım", ÖN
       BİLDİRİMİ tam olarak tek bir çıplak sınıf olan blok (`.tamga-x {`). Çok
       seçicili gruplar (virgüllü) ve durum seçicileri (`:hover`, `[data-x]`)
       zaten bunun dışında kalıyor, ve `@media` gibi bir sarmalayıcı anahtarın
       parçası · orada aynı sınıfı yeniden yazmak tam olarak `@media`nin işi.
       İlk hâli satır satır bakıyordu ve ikisini de yanlış okudu. */
    {
      let derinlik = 0;
      const sarmal = [];
      let onBildirim = "";
      for (let k = 0; k < kod.length; k++) {
        const ch = kod[k];
        if (ch === "{") {
          const pre = onBildirim.trim().replace(/\s+/g, " ");
          const satirNo = kod.slice(0, k).split("\n").length;
          if (pre.startsWith("@")) {
            sarmal.push({ derinlik, ad: pre });
          } else {
            const bare = pre.match(/^(\.[A-Za-z][\w-]*)$/);
            if (bare) {
              const anahtar = sarmal.map((x) => x.ad).join(" > ") + " > " + bare[1];
              const onceki = tanimlar.get(anahtar);
              if (onceki) {
                hatalar.push(
                  `  ${rel}:${satirNo}  \`${bare[1]}\` aynı bağlamda ikinci kez tanımlanıyor (ilki ${onceki}. satırda) — sonraki tanım öncekini sessizce eziyor`,
                );
              } else tanimlar.set(anahtar, satirNo);
            }
          }
          derinlik++;
          onBildirim = "";
          continue;
        }
        if (ch === "}") {
          derinlik--;
          if (sarmal.length && sarmal[sarmal.length - 1].derinlik === derinlik) sarmal.pop();
          onBildirim = "";
          continue;
        }
        if (ch === ";") {
          onBildirim = "";
          continue;
        }
        onBildirim += ch;
      }
    }

    const ac = (kod.match(/\{/g) || []).length;
    const kapa = (kod.match(/\}/g) || []).length;
    if (ac !== kapa) hatalar.push(`  ${rel}  süslü parantez dengesiz: ${ac} açık, ${kapa} kapalı`);
  }
}

/**
 * KIRPILAN ROZET KAPISI.
 *
 * NEDEN VAR, ve gerekçesi bir ölçüm: token sayfasındaki okunurluk rozeti tek
 * parça bir metindi (`white-space: nowrap`). En uzun rozet ("ΔL* 11.6
 * sayfada") 117.6px istiyor, durduğu renk yarısının içi 101.3px veriyor, ve
 * `.token-swatch`in `overflow: hidden`i farkı sessizce kesiyordu: ekranda
 * "ΔL* 11 sayfad…" yazıyordu. Hiçbir yerde hata çıkmıyor · kırpılan bir metin
 * CSS'e göre geçerli bir metin.
 *
 * NE SINIYOR: rozet SARMALI. `flex-wrap: wrap` olmadan ya da `nowrap` ile
 * geri yazıldığında kırpılma geri gelir. Genişliğin kendisi burada ölçülemez
 * (bir kapı düzen hesaplamıyor); ölçülebilen şey kararın kodda durup
 * durmadığı.
 */
{
  const yol = "apps/docs/src/app/globals.css";
  const metin = readFileSync(join(ROOT, yol), "utf8");
  const blok = metin.match(/\n\.token-badge \{([^}]*)\}/);
  if (!blok) {
    hatalar.push(`  ${yol}  .token-badge kuralı yok — adı değiştiyse bu kapıyı da güncelle`);
  } else {
    if (!/flex-wrap:\s*wrap/.test(blok[1]))
      hatalar.push(
        `  ${yol}  .token-badge \`flex-wrap: wrap\` bildirmiyor — sığmayan rozet kırpılır`,
      );
    if (/white-space:\s*nowrap/.test(blok[1]))
      hatalar.push(
        `  ${yol}  .token-badge \`white-space: nowrap\` taşıyor — rozet sarmaz, kırpılır`,
      );
  }
}

/**
 * ALT DİZE SEÇİCİSİ KAPISI · `[class*="h-dvh"]` yerine `[class~="h-dvh"]`.
 *
 * NEDEN VAR, ve gerekçesi bir hata: galeri, `h-dvh` taşıyan ekranlara
 * `height: 100%` basmak için `[class*='h-dvh']` yazıyordu. `*=` ALT DİZE
 * arıyor, ve `min-h-dvh` de o alt dizeyi taşıyor · yani yalnız `min-height`
 * alması gereken oturum ve kamusal ekranlara `height` de basılıyordu. Zemin
 * çerçevenin boyunda kalıyor, içerik altından taşıyor, ve aşağı kaydırınca
 * arka plan bir yerde kesiliyordu. 800px pencerede 91px, 620px'te 221px.
 *
 * Tailwind'in ölçü sınıfları İÇ İÇE GEÇİYOR (`h-dvh` ⊂ `min-h-dvh`,
 * `w-full` ⊂ `max-w-full`), yani bu bir kerelik bir dikkatsizlik değil bir
 * KALIP. `~=` boşlukla ayrılmış tokenı arıyor ve iç içe geçmeyi bitiriyor.
 */
{
  /* `.tsx` DE TARANIYOR, yalnız `.css` değil: bu seçiciler Tailwind'in
     rastgele varyantı olarak className'in İÇİNDE yazılıyor
     (`[&_[class*='h-dvh']]:h-full`), ve hatanın çıktığı yer tam orasıydı. */
  const tsx = [];
  for (const base of SCAN) {
    const yur = function* (dir) {
      for (const ad of readdirSync(dir)) {
        const p = join(dir, ad);
        if (statSync(p).isDirectory()) yield* yur(p);
        else if (ad.endsWith(".tsx") || ad.endsWith(".ts")) yield p;
      }
    };
    for (const d of yur(base)) tsx.push([relative(ROOT, d), readFileSync(d, "utf8")]);
  }
  const OLCU = /\[class\*=(["'])((?:min-|max-)?[hw]-[a-z0-9-]+)\1\]/g;
  for (const [yol, ham] of [...dosyalar, ...tsx]) {
    /* YORUMLAR SİLİNİYOR, satır sayısı korunuyor · ilk koşuşta kapı kendi
       gerekçe yorumumu yakaladı: kuralı ANLATAN satırda da `[class*=` geçiyor.
       Bir kapının kendi belgesini ihlal sanması, raporunu güvenilmez yapar. */
    const metin = ham
      .replace(/\/\*[\s\S]*?\*\//g, (y) => y.replace(/[^\n]/g, " "))
      .replace(/\/\/[^\n]*/g, (y) => " ".repeat(y.length));
    for (const m of metin.matchAll(OLCU)) {
      const satir = metin.slice(0, m.index).split("\n").length;
      hatalar.push(
        `  ${yol}:${satir}  ${m[0]} — alt dize eşleşmesi; \`[class~="${m[2]}"]\` yaz`,
      );
    }
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
