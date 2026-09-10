#!/usr/bin/env node
/**
 * Token referansını KAYNAKTAN üretir → apps/docs/src/content/tokens.json
 *
 * NEDEN ELLE YAZILMIYOR. Props tablosuyla aynı sebep: elle yazılan bir token
 * listesi ilk değer değişikliğinde yalan söylemeye başlar ve yalanı kimse fark
 * etmez, çünkü doküman derlenmiyor. Bir token eklendiği an bu sayfada belirir,
 * kaldırıldığı an kaybolur.
 *
 * AÇIKLAMALAR DA KAYNAKTAN. theme.css ve kit.css'te her token'ın üstünde neden
 * o değerde olduğunu anlatan bir yorum var, ve o yorumlar dokümanın en değerli
 * kısmı: "#12245c L* 16, bizim gövde metnimiz L* 27 — yani bir dolgu değil bir
 * metin rengiydi". Bu cümleyi ikinci kez yazmak yerine oradan alıyoruz.
 *
 * ÜÇ KAYNAK, İKİ TEMA:
 *   theme.css tamga:kit-acik  +  kit.css tamga:kit-koyu   → kitin ad ailesi
 *   theme.css tamga:tema-acik +  theme.css tamga:tema-koyu → tema ailesi
 *   temadan bağımsız bloklar (yarıçap, ölçü, hareket)      → tek değer
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { oran, dL } from "./token-oku.mjs";
import { dilAyir } from "./dil.mjs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const KIT = join(root, "packages", "ui", "src");
const out = join(root, "apps", "docs", "src", "content", "tokens.json");

/** Bir bloğu, her bildirimin ÜSTÜNDEKİ yorumla birlikte okur. */
function bildirimler(dosya, isaretci) {
  const src = readFileSync(join(KIT, dosya), "utf8");
  const i = isaretci ? src.indexOf(isaretci) : 0;
  if (i < 0) throw new Error(`${dosya}: "${isaretci}" yok`);
  const bas = src.indexOf("{", i);
  const son = src.indexOf("\n}", bas);
  const govde = src.slice(bas + 1, son);

  /* Yorum ayrıştırması BİR DURUM MAKİNESİ, satır kalıbı değil. İlk hâli
     "`*` ile başlayan satır yorumun devamıdır" varsayıyordu; bu depodaki
     yorumlar hizalı sarıyor ("...against\n   the page — just under...") ve
     ikinci satır bir bildirim de yorum da olmadığı için biriken açıklama
     siliniyordu. En değerli yorumlar en uzun olanlar, yani tam olarak
     kaybedilenler. */
  const cikti = [];
  let yorum = null;
  let icinde = false;
  let biriken = "";

  for (const ham of govde.split("\n")) {
    const satir = ham.trim();

    if (icinde) {
      const bitis = satir.indexOf("*/");
      if (bitis < 0) {
        biriken += " " + satir;
        continue;
      }
      biriken += " " + satir.slice(0, bitis);
      yorum = temizle(biriken);
      icinde = false;
      biriken = "";
      continue;
    }

    if (!satir) continue;

    if (satir.startsWith("/*")) {
      const bitis = satir.indexOf("*/");
      if (bitis < 0) {
        icinde = true;
        biriken = satir.slice(2);
      } else {
        yorum = temizle(satir.slice(2, bitis));
      }
      continue;
    }

    const bildirim = satir.match(/^(--[a-z0-9-]+)\s*:\s*([^;]+);(.*)$/);
    if (bildirim) {
      /* Bildirimin ARDINDAN gelen aynı satırdaki yorum da açıklamadır, ve
         üstteki yorumdan daha yakın olduğu için o kazanır. */
      const sonda = bildirim[3].match(/\/\*([\s\S]*?)\*\//);
      cikti.push({
        ad: bildirim[1],
        deger: bildirim[2].trim(),
        aciklama: sonda ? temizle(sonda[1]) : yorum,
      });
      yorum = null;
      continue;
    }

    /* Bildirim de yorum da olmayan bir satır yorumu kesiyor: uzaktaki bir
       yorum bir token'ın açıklaması değildir. */
    yorum = null;
  }
  return cikti;
}

/**
 * Yorumdan YAYINLANACAK cümleyi çıkarır.
 *
 * İLK CÜMLE, hepsi değil. Kaynaktaki gerekçeler bir paragraf uzunluğunda ve
 * yerleri orası: bir tablo hücresine sığmıyorlar, sığdırılırsa da tablo
 * okunmuyor. İlk cümle ortalama 37 karakter, ve tam olarak Nord'un
 * "usage description" dediği şey. Tamamı merak edilirse kaynakta duruyor.
 *
 * BÖLÜM BAŞLIKLARI AÇIKLAMA DEĞİL. Kaynakta "3 · status" gibi başlık yorumları
 * var ve ayrıştırıcı onları ardından gelen ilk token'ın açıklaması sanıyordu:
 * --color-critical'ın açıklaması "3 · status" diye çıkıyordu, yani yanlış.
 */

/* SIRA ÖNEMLİ: önce DİL ayrılıyor, sonra her yarı iki cümleye kırpılıyor.
   Tersi yapıldığında Türkçe satır İngilizce iki cümlenin arkasında kalıp
   kesiliyordu, yani çeviri yazılmış ama hiç görünmüyordu. */
const temizle = (s) => {
  const tek = s.replace(/\s+/g, " ").trim();
  if (!tek) return null;
  if (/^\d+\s*·/.test(tek)) return null;
  /* Kesim YALNIZ NOKTADA. Önce iki nokta da cümle sonu sayılıyordu ve
     "overlay plane: dropdowns, popovers…" cümlesi "overlay plane:" diye
     kesiliyordu: iki nokta bu yorumlarda bir bitiş değil, "şunlar" demek.
     Nokta da yoksa cümle olduğu gibi geçiyor; ortalama 37 karakter. */
  /* İKİ CÜMLE. Bir tek cümle (ortalama 37 karakter) geniş bir açıklama
     sütununda cılız duruyordu; paragrafın tamamı ise tabloyu okunmaz yapıyor.
     İkisi arası: ne kaynağı tekrar yazıyoruz ne de hücreyi eziyoruz.

     NOKTA HER ZAMAN CÜMLE SONU DEĞİL. İlk hâli `[^.]+\.` diye bölüyordu ve
     "ΔL* 9.8 against the page" cümlesini 9 ile 8'in arasından kesiyordu:
     açıklama "8 against the page…" diye başlıyordu. Bölme artık noktanın
     ARDINDAN boşluk ve büyük harf istiyor, yani ondalık ayıraç bölmüyor. */
  const kirp = (metin_) => {
    if (!metin_) return null;
    const parcalar = metin_.split(/(?<=[^\d]\.)\s+(?=[A-ZÇĞİÖŞÜ])/);
    let m = parcalar.slice(0, 2).join(" ").trim();
    /* Tek bir uzun cümleye tavan: sütun bir paragrafı taşıyamıyor. */
    if (m.length > 260) {
      const kes = m.lastIndexOf(" ", 260);
      m = m.slice(0, kes > 0 ? kes : 260).trim() + "…";
    }
    return m || null;
  };

  const { en, tr } = dilAyir(tek);
  const kirpilmis = { en: kirp(en), tr: kirp(tr) };
  return kirpilmis.en || kirpilmis.tr ? kirpilmis : null;
};

/* ---- toplama ---- */

const kitAcik = bildirimler("theme.css", "tamga:kit-acik");
const kitKoyu = new Map(bildirimler("kit.css", "tamga:kit-koyu").map((d) => [d.ad, d.deger]));
const temaAcik = bildirimler("theme.css", "tamga:tema-acik");
const temaKoyu = new Map(bildirimler("theme.css", "tamga:tema-koyu").map((d) => [d.ad, d.deger]));

/** Ad → grup. Sıra önemli: ilk eşleşen kazanıyor. */
const GRUPLAR = [
  [/^--color-(page|shell|sunk|hover|band|rail|scrim|chart-fill)$/, "zemin"],
  [/^--color-ink/, "murekkep"],
  [/^--color-(line|edge|tick)$/, "cizgi"],
  [/^--color-accent/, "aksan"],
  [/^--color-(critical|warn|resolved|silent)/, "durum"],
  [/^--color-nav/, "gezinme"],
  [/^--color-chart-/, "grafik"],
  [/^--shadow-/, "golge"],
  [/^--radius/, "yaricap"],
  [/^--text-|^--font-|^--measure/, "tipografi"],
  [/^--duration-|^--ease-/, "hareket"],
  [/^--(gutter|row|control|table-min|offset-room|mark-|overlay-|dial-|dialog-)/, "olcu"],
  [/^--color-brand-/, "rampa"],
  [/^--breakpoint-/, "olcu"],
  /* Tema ailesinin adları --color- öneki taşımıyor; grupları elle eşleniyor. */
  [/^--(background|card|popover|sidebar$|sidebar-(?!foreground|primary-foreground|accent-foreground))/, "zemin"],
  [/^--(foreground|card-foreground|popover-foreground|muted-foreground|secondary-foreground|accent-foreground|sidebar-foreground|sidebar-primary-foreground|sidebar-accent-foreground)$/, "murekkep"],
  [/^--(border|input|ring|tick)$/, "cizgi"],
  [/^--(primary|primary-foreground|accent|secondary|muted|beacon|beacon-foreground)$/, "aksan"],
  [/^--(destructive|destructive-foreground|success|success-foreground|warning|warning-foreground)$/, "durum"],
  [/^--chart-/, "grafik"],
];
const grubu = (ad) => GRUPLAR.find(([re]) => re.test(ad))?.[1] ?? "diger";

/** Önizlemenin nasıl çizileceği. */
function turu(ad, deger) {
  if (ad.startsWith("--shadow-")) return "golge";
  if (/^(#|rgb|oklch|hsl|color-mix)/.test(deger)) return "renk";
  if (ad.startsWith("--duration-") || ad.startsWith("--ease-")) return "hareket";
  if (ad.startsWith("--text-")) return "yazi";
  if (/^-?[\d.]+(px|rem|em|ch)$/.test(deger)) return "olcu";
  return "deger";
}

/* KÖPRÜ BLOĞU: tema ailesi (`--background`) düz bir `:root`ta, yani Tailwind
   onu görmüyor; ama `@theme inline` içinde `--color-background: var(--background)`
   diye köprüleniyor ve utility ORADAN çıkıyor. Bu blok okunmadığında tema
   ailesinin tamamı "utility üretmiyor" diye işaretleniyordu, ki yanlıştı. */
const kopru = new Set(
  bildirimler("theme.css", "tamga:kopru")
    .filter((d) => d.deger.startsWith("var(--"))
    .map((d) => d.deger.slice(4, -1)),
);
const sabitOlcek = bildirimler("theme.css", "tamga:sabit-olcek");
const sabitRol = bildirimler("theme.css", "tamga:sabit-rol");
const sabitKit = bildirimler("kit.css", "tamga:sabit-kit");
const bos = new Map();

/**
 * TAILWIND UTILITY'Sİ ÜRETİLİYOR MU, ve iki koşul birden gerekiyor:
 *
 *   ① Token bir `@theme` bloğunda olacak. Düz bir `:root` bloğundakini
 *     Tailwind hiç görmüyor. `--radius-card` ve bütün `--shadow-*` ailesi bu
 *     yüzden utility üretmiyor: ikisi de `:root`ta.
 *   ② Ön eki Tailwind v4'ün AD ALANLARINDAN biri olacak. `--duration-*` ve
 *     `--measure-*` ad alanı değil, yani `@theme` içinde olsalar bile utility
 *     çıkmıyor.
 *
 * BU KURAL ÖLÇÜLDÜ, tahmin değil: 328 aday sınıfı kullanan geçici bir sayfa
 * yazılıp build alındı ve üretilen CSS tarandı. 307'si üretildi, 21'i
 * üretilmedi, ve üretilmeyenlerin hepsi yukarıdaki iki koşuldan birini
 * karşılamıyordu. Sonda sonra silindi; kalan şey bu kural.
 */
const AD_ALANLARI = {
  color: ["bg", "text", "border", "ring", "fill", "stroke", "outline", "decoration", "caret", "accent", "divide", "from", "via", "to"],
  text: ["text"],
  font: ["font"],
  ease: ["ease"],
  radius: ["rounded"],
  shadow: ["shadow"],
  tracking: ["tracking"],
  leading: ["leading"],
  spacing: ["p", "m", "gap", "w", "h"],
  container: ["max-w"],
  breakpoint: ["<variant>"],
};

function utilityleri(ad, temaBloguMu) {
  /* Köprüden geçen bir token `--color-<ad>` olarak görünüyor. */
  const koprulu = kopru.has(ad);
  if (!temaBloguMu && !koprulu) return [];
  const etkinAd = koprulu ? `--color-${ad.slice(2)}` : ad;
  const alan = Object.keys(AD_ALANLARI).find((n) => etkinAd.startsWith(`--${n}-`));
  if (!alan) return [];
  const kalan = etkinAd.slice(alan.length + 3);
  return AD_ALANLARI[alan].map((on) => (on === "<variant>" ? `${kalan}:` : `${on}-${kalan}`));
}

/**
 * OKUNURLUK ROZETİ: bir rengin yanında duran sayı.
 *
 * NORD'UN SAYFASINDA HER RENK BLOĞUNUN İÇİNDE BİR ORAN VAR ve tek bakışta
 * "bu renk yazı taşır mı" sorusunu cevaplıyor. Bizde de olmalı, ama SORU
 * GRUBA GÖRE DEĞİŞİYOR ve tek bir sayı ikisini birden söyleyemez:
 *
 *   zemin      üstündeki mürekkep okunuyor mu     WCAG oranı
 *   mürekkep   sayfada okunuyor mu                WCAG oranı
 *   aksan      yüzün üstündeki yazı okunuyor mu   WCAG oranı
 *   durum      zeminde ayırt ediliyor mu          WCAG oranı
 *   çizgi      görünüyor mu, sert mi              ΔL* (oran yanlış araç)
 *
 * Birim karışmasın diye rozet neyi ölçtüğünü de taşıyor.
 *
 * `karsi` BİR ANAHTAR, çevrilmiş bir metin değil. Bir süre "mürekkep" diye
 * Türkçe yazılıyordu ve İngilizce sayfada da öyle çıkıyordu: üretilen veri
 * kaynağın dilini taşıyorsa iki dilli bir site kurulamıyor. Karşılıkları
 * `components/tokens.tsx` içindeki sözlükte.
 */
function kontrasti(ad, grup, deger, palet) {
  if (!/^#[0-9a-f]{3,8}$/i.test(deger)) return null;
  const al = (k) => palet.get(k);
  /**
   * ROZETİN KENDİSİ DE OKUNMAK ZORUNDA, ve bu tesadüfe bırakılamaz.
   *
   * İKİ DENEME. Önce yeşil ya da kırmızı METİNDİ ve lacivert bir kartın
   * üstünde kayboluyordu: bir okunurluk ölçüsünün okunmaması kadar kötü bir
   * şey yok. Sonra dolu bir PLAKA oldu ve okundu, ama rengin üstüne ikinci
   * bir kart çizdi; blok artık rengi değil kutuyu gösteriyordu.
   *
   * Üçüncüsü ikisinin de kaçındığı şey: DOLGU YOK, ince bir kenar ve renkli
   * yazı. Ama rengi sabit değil ÖLÇÜLMÜŞ: mürekkep mi kâğıt mı, üstünde
   * durduğu renge karşı hangisi daha çok ayrışıyorsa o. Yani ilk denemenin
   * hafifliği, ikincisinin garantisiyle.
   */
  const okunur = (uzerinde) => {
    const murekkep = al("--color-ink");
    const kagit = al("--color-shell");
    if (!murekkep || !kagit || !/^#/.test(murekkep) || !/^#/.test(kagit)) return null;
    return oran(murekkep, uzerinde) >= oran(kagit, uzerinde) ? murekkep : kagit;
  };

  /* EŞİĞİ GEÇMEYEN ROZET RENGİYLE DEĞİL İŞARETİYLE ayrılıyor: yazısına bir
     ünlem giriyor ve kenarı kalınlaşıyor. Kritik rengi kullanmak cazipti ama
     o renk her zeminde okunmuyor, ve okunmayan bir uyarı uyarı değildir. */

  const kus = (tur, deger_, karsi, gecti) => ({
    tur,
    deger: deger_,
    karsi,
    gecti,
    /* Rozet HANGİ RENGİN üstünde duruyorsa ona göre: bloğun kendi yarısında.
       `deger` o yarının rengi. */
    yazi: okunur(deger),
  });

  const oranla = (a, b, karsi) => {
    if (!a || !b || !/^#/.test(a) || !/^#/.test(b)) return null;
    const r = Number(oran(a, b).toFixed(2));
    return kus("oran", r, karsi, r >= 4.5);
  };

  /* `*-foreground` KENDİ ZEMİNİNE KARŞI ölçülür, karta karşı değil.
     Beş token 1.00 gösteriyordu ve rozet kıpkırmızıydı: `--success-foreground`
     ile `--color-shell` aynı beyaz, yani oran 1. Matematik doğruydu,
     EŞLEŞTİRME yanlıştı. Bir mürekkep her zaman üstünde durduğu şeye karşı
     okunur; adın kendisi zemini söylüyor. */
  if (ad.endsWith("-foreground")) {
    const zemin = ad === "--foreground" ? "--background" : ad.slice(0, -"-foreground".length);
    return oranla(deger, al(zemin), "zemin");
  }

  if (grup === "zemin") return oranla(al("--color-ink"), deger, "murekkep");
  if (grup === "murekkep") return oranla(deger, al("--color-page"), "sayfa");
  if (grup === "durum" && !ad.endsWith("-bg")) return oranla(deger, al("--color-shell"), "kart");
  if (ad === "--color-accent" || ad === "--color-accent-hover" || ad === "--color-accent-active") {
    return oranla(al("--color-accent-ink"), deger, "murekkep");
  }
  if (ad === "--color-accent-ink") return oranla(deger, al("--color-accent"), "yuz");
  if (ad === "--color-nav-idle") return oranla(deger, al("--color-rail"), "ray");
  if (grup === "cizgi") {
    const zemin = al("--color-page");
    if (!zemin || !/^#/.test(zemin)) return null;
    const d = Number(dL(deger, zemin).toFixed(1));
    return kus("dL", d, "sayfa", d >= 4);
  }
  return null;
}

/* PALET İKİ AİLEYİ BİRDEN TAŞIYOR. `--card-foreground` tema ailesinde ama
   zemini (`--card`) de orada; kit ailesinin paletinde aranırsa bulunamıyor ve
   rozet hiç çizilmiyordu. Tek harita, iki aile. */
const paletAcik = new Map([
  ...kitAcik.map((d) => [d.ad, d.deger]),
  ...temaAcik.map((d) => [d.ad, d.deger]),
]);
const paletKoyu = new Map([...kitKoyu.entries(), ...temaKoyu.entries()]);

const tokenlar = [];
for (const [liste, koyu, aile, temaBloguMu] of [
  [kitAcik, kitKoyu, "kit", true],
  [temaAcik, temaKoyu, "tema", false],
  [sabitOlcek, bos, "sabit", true],
  [sabitRol, bos, "sabit", false],
  [sabitKit, bos, "sabit", false],
]) {
  for (const { ad, deger, aciklama } of liste) {
    tokenlar.push({
      ad,
      aile,
      grup: grubu(ad),
      tur: turu(ad, deger),
      acik: deger,
      koyu: koyu.get(ad) ?? null,
      aciklama: aciklama?.en ?? null,
      aciklamaTr: aciklama?.tr ?? null,
      utilityleri: utilityleri(ad, temaBloguMu),
      kontrastAcik: kontrasti(ad, grubu(ad), deger, paletAcik),
      kontrastKoyu: kontrasti(ad, grubu(ad), koyu.get(ad) ?? "", paletKoyu),
    });
  }
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(tokenlar, null, 2) + "\n");

const gruplar = new Set(tokenlar.map((t) => t.grup));
const aciklamali = tokenlar.filter((t) => t.aciklama).length;
const cevirisiz = tokenlar.filter((t) => t.aciklama && !t.aciklamaTr);
const utilityli = tokenlar.filter((t) => t.utilityleri.length).length;
const utilitySayisi = tokenlar.reduce((n, t) => n + t.utilityleri.length, 0);
/* KAPI: yayınlanan her gerekçenin Türkçesi olacak. Site iki dilli; tek dilli
   bir gerekçe, öteki dilin sayfasını yarım gösteriyor. */
if (cevirisiz.length) {
  console.error("✗ Çevirisiz token gerekçesi — yorumun içine `TR:` satırı eklenmeli:\n");
  for (const t of cevirisiz) console.error(`  ${t.ad}`);
  console.error(
    `\n${cevirisiz.length} token. Biçim:  /* English note. TR: Türkçe not. *` + `/`,
  );
  process.exit(1);
}

console.log(
  `✓ ${tokenlar.length} token çıkarıldı — ${gruplar.size} grup, ${aciklamali} tanesi iki dilli ` +
    `gerekçesiyle, ${utilityli} tanesi ${utilitySayisi} Tailwind utility'si üretiyor.`,
);
