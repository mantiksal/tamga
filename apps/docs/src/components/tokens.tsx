"use client";

import { useMemo, useState } from "react";
import { Icon, Input } from "tamga-ui";
import { Check, Close, Copy, Search } from "tamga-ui/icons";
import ham from "@/content/tokens.json";

/**
 * TOKEN GALERİSİ.
 *
 * ÖNCEKİ HÂLİ BİR TABLOYDU ve 28 piksellik bir kare ile kırpılmış bir alt
 * satır taşıyordu. Bir token sayfasının tek işi rengi GÖSTERMEK; 28 piksel bir
 * rengi göstermiyor, ima ediyor.
 *
 * İKİYE BÖLÜNMÜŞ BLOK: iki temamız aynı anda görünmeli, yoksa okuyucu sayfayı
 * iki kez gezmek zorunda kalıyor.
 *
 * VERİ ÜRETİLEN. `extract-tokens.mjs` her token için değeri, iki temayı,
 * kaynaktaki gerekçesini, ürettiği Tailwind utility'lerini ve okunurluk
 * oranını hesaplıyor.
 *
 * Gerekçe: docs/07-dokuman-sitesi.md
 */

type Kontrast = {
  tur: "oran" | "dL";
  deger: number;
  karsi: string;
  gecti: boolean;
  /** Rozetin yazı ve kenar rengi: üstünde durduğu renge karşı ölçülerek seçilmiş. */
  yazi: string | null;
};

type Token = {
  ad: string;
  aile: string;
  grup: string;
  tur: string;
  acik: string;
  koyu: string | null;
  aciklama: string | null;
  aciklamaTr: string | null;
  utilityleri: string[];
  kontrastAcik: Kontrast | null;
  kontrastKoyu: Kontrast | null;
};

const TOKENLAR = ham as Token[];

const SIRA = [
  "zemin",
  "murekkep",
  "cizgi",
  "aksan",
  "durum",
  "gezinme",
  "grafik",
  "golge",
  "yaricap",
  "olcu",
  "tipografi",
  "hareket",
  "rampa",
];

const BASLIK: Record<string, { tr: [string, string]; en: [string, string] }> = {
  zemin: {
    tr: ["Zeminler", "Sayfa, kart, çökük yüzey ve ray. Aralarındaki fark bir dolgu değil bir çizgi."],
    en: ["Grounds", "Page, card, sunk surface and rail. What separates them is a line, not a fill."],
  },
  murekkep: {
    tr: ["Mürekkep", "Üç ağırlık: başlık, gövde, ikincil. Üçü de AA geçiyor."],
    en: ["Ink", "Three weights: heading, body, secondary. All three pass AA."],
  },
  cizgi: {
    tr: ["Çizgi ve kenar", "Kural çizgisi ayırıyor, kenar yükseltiyor. Aynı renk değiller."],
    en: ["Line and edge", "The rule line divides, the edge lifts. They are not the same colour."],
  },
  aksan: {
    tr: ["Aksan", "Markanın değiştiği yer. Yedi token, iki temada."],
    en: ["Accent", "Where the brand changes. Seven tokens, in two themes."],
  },
  durum: {
    tr: ["Durum", "Marka değil ANLAM taşıyorlar: kırmızı her panelde aynı şeyi demeli."],
    en: ["Status", "These carry MEANING rather than brand: red must mean the same on every panel."],
  },
  gezinme: {
    tr: ["Gezinme", "Rayın kendi renkleri. Boştaki etiket de bir metin, o yüzden AA'ya tabi."],
    en: ["Navigation", "The rail's own colours. An idle label is text too, so it answers to AA."],
  },
  grafik: {
    tr: ["Grafik serisi", "Durum olmayan veri için. Kasten daha sessiz: bir grafik bir olayı bastıramaz."],
    en: ["Chart series", "For data that is not a status. Deliberately quieter: a chart cannot out-shout an event."],
  },
  golge: {
    tr: ["Yükselme", "Sert, bulanıksız, çapraz ofset. Bulanıklık bir ölçü vermiyor."],
    en: ["Elevation", "Hard, blurless, diagonal offset. Blur does not give a measure."],
  },
  yaricap: {
    tr: [
      "Yarıçap",
      "Beş rol tek bir sayıdan türüyor, rounded-* adımları da aynı düğmeden. Tam yuvarlak dışarıda: o bir ölçü değil bir biçim.",
    ],
    en: [
      "Radius",
      "Five roles derive from one number, and so do the rounded-* steps. Fully round stands outside: it is a shape, not a measure.",
    ],
  },
  olcu: {
    tr: ["Ölçü", "Satır yüksekliği, kontrol yüksekliği, sol çizgi. Ekranın ritmi."],
    en: ["Measure", "Row height, control height, the left rule. The screen's rhythm."],
  },
  tipografi: {
    tr: ["Tipografi", "On adım, 10px'ten 40px'e, ve üç yüz. Gövde 14.5px: bir gösterge paneli için ölçüldü."],
    en: ["Typography", "Ten steps, 10px to 40px, and three faces. Body is 14.5px, measured for a dashboard."],
  },
  hareket: {
    tr: ["Hareket", "Süreler ve eğriler. Kitin imzası, ve değiştirilmiyor."],
    en: ["Motion", "Durations and curves. The kit's signature, and it is not changed."],
  },
  rampa: {
    tr: ["Ham marka rampası", "Hiçbir şey doğrudan tüketmiyor: arayüz semantik token'lar."],
    en: ["Raw brand ramp", "Nothing consumes it directly: the semantic tokens are the interface."],
  },
};

type Metinler = {
  ara: string;
  temizle: string;
  hepsi: string;
  bos: string;
  sayac: (n: number, m: number) => string;
  acik: string;
  koyu: string;
  ayni: string;
  kopyala: string;
  /* Rozetin "neye karşı" yarısı. Üretilen veri bir ANAHTAR taşıyor; okunan
     metin burada, çünkü kaynağın dili sitenin dili değil. */
  karsi: Record<string, string>;
};

const L: Record<"tr" | "en", Metinler> = {
  tr: {
    ara: "Token, değer ya da utility ara",
    temizle: "Aramayı temizle",
    hepsi: "Hepsi",
    bos: "Bu aramayla token bulunamadı.",
    sayac: (n, m) => (n === m ? `${n} token` : `${n} / ${m} token`),
    acik: "açık",
    koyu: "koyu",
    ayni: "iki temada aynı",
    kopyala: "Kopyala",
    karsi: {
      murekkep: "mürekkep",
      sayfa: "sayfada",
      kart: "kartta",
      ray: "rayda",
      yuz: "yüzde",
      zemin: "zemininde",
    },
  },
  en: {
    ara: "Search a token, value or utility",
    temizle: "Clear the search",
    hepsi: "All",
    bos: "No token matches that search.",
    sayac: (n, m) => (n === m ? `${n} tokens` : `${n} / ${m} tokens`),
    acik: "light",
    koyu: "dark",
    ayni: "same in both themes",
    kopyala: "Copy",
    karsi: {
      murekkep: "against ink",
      sayfa: "on the page",
      kart: "on a card",
      ray: "on the rail",
      yuz: "on the face",
      zemin: "on its ground",
    },
  },
};

/**
 * Okunurluk rozeti, ve ROZETİN KENDİSİ DE OKUNUYOR.
 *
 * DOLGU YOK: ince bir kenar ve renkli yazı. Dolu bir plaka okunuyordu ama
 * rengin üstüne ikinci bir kart çiziyordu; blok artık rengi değil kutuyu
 * gösteriyordu. Rengi sabit değil ÖLÇÜLMÜŞ (`extract-tokens.mjs`).
 *
 * Eşiği geçmeyen rozet renkle değil İŞARETLE ayrılıyor: bir ünlem ve daha
 * kalın bir kenar. Kritik rengi kullanmak cazipti ama o renk her zeminde
 * okunmuyor, ve okunmayan bir uyarı uyarı değildir.
 */
function Rozet({ k, s }: { k: Kontrast; s: Metinler }) {
  return (
    <span
      className={`token-badge ${k.gecti ? "" : "token-badge-kotu"}`}
      style={{ color: k.yazi ?? "inherit", borderColor: k.yazi ?? "currentColor" }}
      title={`${k.tur === "oran" ? "WCAG" : "ΔL*"} ${k.deger}`}
    >
      {/* SAYI VE "NEYE KARŞI" İKİ AYRI PARÇA, tek bir metin değil · ve bu bir
          düzeltme. Tek parçayken rozet yarıya sığmıyor ve `overflow: hidden`
          onu kırpıyordu ("ΔL* 11 sayfad…"). En uzun rozet 117.6px istiyor,
          yarının içi 101.3px veriyor. İki parça `flex-wrap` ile sığdığında
          yan yana, sığmadığında alt alta duruyor: kısa rozet tek satır kalıyor,
          uzun olan ikinci satıra iniyor ve hiçbiri kırpılmıyor. */}
      <span>
        {k.gecti ? "" : "! "}
        {k.tur === "dL" ? "ΔL* " : ""}
        {k.deger}
      </span>
      <span>{s.karsi[k.karsi] ?? k.karsi}</span>
    </span>
  );
}

/**
 * Bir ölçü ÇUBUK olarak çizilebilir mi.
 *
 * Negatif ve rem değerleri çizilemiyor: -4px genişlikte bir çubuk yok, ve
 * 30rem okuma sütununu aşıyor. Onlar değer rozeti olarak gösteriliyor.
 *
 * BİR FONKSİYON, BİR BİLEŞEN DEĞİL, ve bu bir düzeltme: `<Olcu/>` her zaman
 * truthy bir React ögesi · `null` döndürse bile. `if (<Olcu/>)` yazılmıştı ve
 * hep doğruydu, yani çizilemeyen dört ölçü boş bir hücre gösteriyordu.
 */
function cubugu(t: Token) {
  const sayi = Number.parseFloat(t.acik);
  /* `ch` ORANLI ÇİZİLİYOR, gerçek genişliğiyle değil: 36ch da 54ch de 70ch de
     210 piksellik sütunu aşıyor ve üçü birden tam genişlikte, yani AYNI
     görünüyordu. En genişi (70ch) tam sütun, ötekiler onun oranında. */
  if (/ch$/.test(t.acik) && Number.isFinite(sayi))
    return (
      <span className="token-cubuk" style={{ width: `${(sayi / 70) * 100}%` }} aria-hidden />
    );
  if (/px$/.test(t.acik) && Number.isFinite(sayi) && sayi > 0 && sayi <= 400)
    return <span className="token-cubuk" style={{ width: t.acik }} aria-hidden />;
  return null;
}

function Ornek({ t, s }: { t: Token; s: Metinler }) {
  if (t.grup === "yaricap") {
    /* YARIÇAP GRUBUNUN TAMAMI KUTU, ve karar `tur`dan ÖNCE geliyor: beş rol
       `calc(var(--radius) + 2px)` diye yazılı, yani üretici onları "değer"
       sayıyor ve değer rozeti olarak çizilirlerdi. `calc()` geçerli bir
       `border-radius`, ve bir yarıçapı gösterecek tek şey köşenin kendisi. */
    return (
      <span className="token-olcu">
        <span className="token-yaricap" style={{ borderRadius: `var(${t.ad})` }} aria-hidden />
        <code className="token-mono">{t.acik}</code>
      </span>
    );
  }

  if (t.tur === "renk") {
    const tekTema = !t.koyu || t.koyu === t.acik;
    return (
      <>
        <span className={`token-swatch ${tekTema ? "token-swatch-solo" : ""}`}>
          <span style={{ background: t.acik }}>
            {t.kontrastAcik && <Rozet k={t.kontrastAcik} s={s} />}
          </span>
          {!tekTema && (
            <span style={{ background: t.koyu! }}>
              {t.kontrastKoyu && <Rozet k={t.kontrastKoyu} s={s} />}
            </span>
          )}
        </span>
        <span className="token-deger">
          <span>
            {t.acik} {s.acik}
          </span>
          <span>{tekTema ? s.ayni : `${t.koyu} ${s.koyu}`}</span>
        </span>
      </>
    );
  }

  if (t.tur === "golge") {
    /* GÖLGE `var()` İLE ÇİZİLİYOR, JSON'daki değerle değil: token'ın kendisi
       bir renkse (`--shadow-color`) sert ofset onun etrafına kuruluyor, bir
       gölgeyse olduğu gibi basılıyor. İkisi de temayla dönüyor · kopyalanmış
       bir hex koyu temada açık temanın gölgesini çizerdi. */
    const renkMi = /^(#|rgb|hsl|oklch)/.test(t.acik);
    return (
      <>
        <span className="token-golge">
          <span style={{ boxShadow: renkMi ? `4px 4px 0 var(${t.ad})` : `var(${t.ad})` }} />
        </span>
        <code className="token-mono">{t.acik}</code>
      </>
    );
  }

  if (/^--font-/.test(t.ad)) {
    /* YIĞININ İLK AİLESİ · geri kalanı yedek zinciri, ve bir yedek okunacak
       bir şey değil. Tam değer ad düğmesiyle kopyalanıyor. */
    const aile = t.acik.split(",")[0]?.replace(/["']/g, "").trim() ?? t.acik;
    return (
      <span className="token-yuz">
        <span style={{ fontFamily: `var(${t.ad})` }}>Aa</span>
        <code className="token-mono">{aile}</code>
      </span>
    );
  }

  if (t.tur === "yazi") {
    return (
      <span className="token-yazi">
        <span
          style={{
            fontSize: `var(${t.ad})`,
            fontFamily: /display|title/.test(t.ad) ? "var(--font-display)" : "var(--font-sans)",
          }}
        >
          Aa
        </span>
        <code className="token-mono">{t.acik}</code>
      </span>
    );
  }

  if (t.tur === "hareket") {
    /* ÜSTÜNE GELİNCE KOŞUYOR, ve durumu CSS'te: on bir satırın her biri için
       bir React state'i tutmak, hiçbir şey kazandırmayan on bir yeniden
       çizim demek. Eğri token'ında süre 700ms (gerçek kademelerde iki eğrinin
       farkı göz kırpması kadar sürüyor ve görülmüyor); süre token'ında eğri
       imza eğrisi. */
    const egriMi = /^--ease-/.test(t.ad);
    return (
      <>
        <span className="token-iz">
          <span
            className="token-iz-kare"
            style={{
              transitionDuration: egriMi ? "700ms" : `var(${t.ad})`,
              transitionTimingFunction: egriMi ? `var(${t.ad})` : "var(--ease-instrument)",
            }}
          />
        </span>
        <code className="token-mono">{t.acik}</code>
      </>
    );
  }

  if (t.tur === "olcu") {
    const cubuk = cubugu(t);
    if (cubuk !== null)
      return (
        <span className="token-olcu">
          {cubuk}
          <code className="token-mono">{t.acik}</code>
        </span>
      );
  }

  return (
    <span className="token-olcu">
      <code className="token-cip">{t.acik}</code>
    </span>
  );
}

/**
 * Gerekçedeki ters tırnaklı parçalar `code` olarak çiziliyor.
 *
 * Kaynaktaki yorumlar bir token ya da sınıf adını ters tırnak içinde yazıyor
 * (`--gutter`, `check-scale`) · düz metin olarak basılınca o tırnaklar ekranda
 * kalıyor ve gerekçe "üretilmiş" görünüyordu. Ayrıştırma tek kural: çift
 * ters tırnak arası bir ad.
 */
function metin(ham: string) {
  /* ÇIPLAK TOKEN ADI DA `code`: kaynaktaki yorumların hepsi ters tırnak
     kullanmıyor, ve `--color-brand-500` düz metin olarak satır sonunda
     tireden bölünüyordu · ekranda "- -color-brand-500" diye okunuyor. */
  return ham.split(/(`[^`]+`|--[a-z][a-z0-9-]+)/).map((p, i) => {
    if (p.startsWith("`") && p.endsWith("`") && p.length > 2)
      return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith("--")) return <code key={i}>{p}</code>;
    return p;
  });
}

/* GEREKÇE OKUNAN METİNDİR, yani okuyanın dilinde olmak zorunda. Açıklamalar
   kaynaktaki yorumdan geliyor ve o yorumlar İngilizce yazılmış; karşılığı
   yorumun içinde `TR:` satırında. Çevirisiz gerekçede extract-tokens kırılıyor. */
const gerekce = (t: Token, lang: "tr" | "en") =>
  (lang === "tr" ? t.aciklamaTr : t.aciklama) ?? t.aciklama;

function Satir({ t, s, lang }: { t: Token; s: Metinler; lang: "tr" | "en" }) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const aciklama = gerekce(t, lang);

  return (
    <div className="token-row">
      <div className="token-ornek">
        <Ornek t={t} s={s} />
      </div>

      <p className="token-aciklama">{aciklama ? metin(aciklama) : null}</p>

      <div className="token-sag">
        {/* ADIN KENDİSİ DÜĞME: kopyalanacak şey ad, ve ayrı bir kopyala
            düğmesi satıra dördüncü bir sütun ekliyordu. Bastığında çöküyor,
            yani kitin basma fiziği burada da geçerli. */}
        <button
          type="button"
          className="token-ad"
          title={s.kopyala}
          onClick={() => {
            navigator.clipboard?.writeText(`var(${t.ad})`);
            setKopyalandi(true);
            window.setTimeout(() => setKopyalandi(false), 1400);
          }}
        >
          <span className="truncate">{t.ad}</span>
          <Icon icon={kopyalandi ? Check : Copy} size="xs" weight="bold" className="shrink-0" />
        </button>
        {t.utilityleri.length > 0 && (
          <span className="token-util">
            {t.utilityleri.slice(0, 3).join(" · ")}
            {t.utilityleri.length > 3 ? ` +${t.utilityleri.length - 3}` : ""}
          </span>
        )}
      </div>
    </div>
  );
}

export function Tokenlar({ lang }: { lang: "tr" | "en" }) {
  const s = L[lang];
  const [ara, setAra] = useState("");
  const [grup, setGrup] = useState("all");

  /* İKİ AŞAMALI SÜZME, ve sırası önemli: çipler ARAMANIN sonucunu sayıyor,
     seçili grubunkini değil. Tersi olsaydı seçili olmayan her çip sıfır
     gösterir ve gruplar arasında gezmek imkânsız olurdu. */
  const bulunan = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("tr");
    if (!q) return TOKENLAR;
    return TOKENLAR.filter((t) =>
      `${t.ad} ${t.acik} ${t.koyu ?? ""} ${gerekce(t, lang) ?? ""} ${t.utilityleri.join(" ")}`
        .toLocaleLowerCase("tr")
        .includes(q),
    );
  }, [ara, lang]);

  const gosterilen = useMemo(
    () => (grup === "all" ? bulunan : bulunan.filter((t) => t.grup === grup)),
    [bulunan, grup],
  );

  const cipler = [
    { id: "all", ad: s.hepsi, n: bulunan.length },
    ...SIRA.filter((g) => bulunan.some((t) => t.grup === g)).map((g) => ({
      id: g,
      ad: BASLIK[g]?.[lang][0] ?? g,
      n: bulunan.filter((t) => t.grup === g).length,
    })),
  ];

  const gruplar = SIRA.map((g) => [g, gosterilen.filter((t) => t.grup === g)] as const).filter(
    ([, liste]) => liste.length > 0,
  );

  return (
    <div className="token-galeri" id="galeri">
      <div className="token-serit">
        <div className="token-serit-ust">
          <span className="token-ara" data-dolu={ara ? true : undefined}>
            <Icon
              icon={Search}
              size="sm"
              weight="duotone"
              aria-hidden
              className="pointer-events-none absolute left-3 text-ink-faint"
            />
            <Input
              type="search"
              leading
              full
              value={ara}
              onChange={(e) => setAra(e.target.value)}
              placeholder={s.ara}
              aria-label={s.ara}
            />
            {ara && (
              <button
                type="button"
                className="token-temizle"
                aria-label={s.temizle}
                onClick={() => setAra("")}
              >
                <Icon icon={Close} size="xs" weight="bold" />
              </button>
            )}
          </span>
          <span className="token-sayac">{s.sayac(gosterilen.length, TOKENLAR.length)}</span>
        </div>
        {/* ÇİP ŞERİDİ KAYIYOR, SARMIYOR: on üç grup sarınca şerit üç satıra
            çıkıyor ve sticky başlık okuma sütununun yarısını yiyordu. */}
        <div className="token-cipler">
          {cipler.map((c) => (
            <button
              key={c.id}
              type="button"
              className="token-cip-btn"
              aria-pressed={grup === c.id}
              data-secili={grup === c.id || undefined}
              onClick={() => setGrup(c.id)}
            >
              {c.ad}
              <span className="token-cip-n">{c.n}</span>
            </button>
          ))}
        </div>
      </div>

      {gosterilen.length === 0 && <p className="token-bos">{s.bos}</p>}

      {gruplar.map(([g, liste]) => {
        const [ad, alt] = BASLIK[g]?.[lang] ?? [g, ""];
        return (
          <section key={g} id={`g-${g}`} className="token-grup">
            <div className="token-grup-bas">
              <h2 className="token-h">{ad}</h2>
              <span className="token-grup-n">{liste.length}</span>
            </div>
            {alt && <p className="token-grup-alt">{alt}</p>}
            <div className="token-kart docs-kit">
              {liste.map((t) => (
                <Satir key={t.ad} t={t} s={s} lang={lang} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
