"use client";

import { useMemo, useState } from "react";
import { Icon, Input, Label, MiniButton } from "tamga-ui";
import { Check, Copy, Search } from "tamga-ui/icons";
import ham from "@/content/tokens.json";

/**
 * TOKEN GALERİSİ.
 *
 * ÖNCEKİ HÂLİ BİR TABLOYDU ve 28 piksellik bir kare ile kırpılmış bir alt
 * satır taşıyordu. Bir token sayfasının tek işi rengi GÖSTERMEK; 28 piksel bir
 * rengi göstermiyor, ima ediyor.
 *
 * DÜZEN NORD'UN, GÖRSEL DİL BİZİM. Onlardan alınan şey üç sütun (örnek ·
 * açıklama · token), geniş satırlar, ve okunurluk oranının rengin İÇİNDE
 * durması. Alınmayan şey yumuşak gri kutuları: bizimki 1px kenar ve sert
 * ofset.
 *
 * İKİYE BÖLÜNMÜŞ BLOK. Nord'un tek bloğu var çünkü tek teması var. İki temamız
 * aynı anda görünmeli, yoksa okuyucu sayfayı iki kez gezmek zorunda kalıyor.
 *
 * VERİ ÜRETİLEN. `extract-tokens.mjs` her token için değeri, iki temayı,
 * kaynaktaki gerekçesini, ürettiği Tailwind utility'lerini ve okunurluk
 * oranını hesaplıyor. Elle yazılan bir liste ilk değer değişikliğinde yalan
 * söylerdi.
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
    tr: ["Yarıçap", "Dört adım, ve hepsi tek bir sayıdan türüyor."],
    en: ["Radius", "Four steps, all derived from one number."],
  },
  olcu: {
    tr: ["Ölçü", "Satır yüksekliği, kontrol yüksekliği, sol çizgi. Ekranın ritmi."],
    en: ["Measure", "Row height, control height, the left rule. The screen's rhythm."],
  },
  tipografi: {
    tr: ["Tipografi", "On adım, 11px'ten 40px'e. Gövde 13px: bir gösterge paneli için ölçüldü."],
    en: ["Typography", "Ten steps, 11px to 40px. Body is 13px, measured for a dashboard."],
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
  ornek: string;
  aciklama: string;
  token: string;
  bos: string;
  sayac: (n: number) => string;
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
    ornek: "Örnek",
    aciklama: "Açıklama",
    token: "Token",
    bos: "Bu aramayla token bulunamadı.",
    sayac: (n) => `${n} token`,
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
    ornek: "Example",
    aciklama: "Description",
    token: "Token",
    bos: "No token matches that search.",
    sayac: (n) => `${n} tokens`,
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
 * DOLGU YOK: ince bir kenar ve renkli yazı. Bir süre dolu bir plakaydı ve
 * okunuyordu, ama rengin üstüne ikinci bir kart çiziyordu; blok artık rengi
 * değil kutuyu gösteriyordu.
 *
 * Rengi sabit değil ÖLÇÜLMÜŞ (`extract-tokens.mjs`): mürekkep mi kâğıt mı,
 * üstünde durduğu renge karşı hangisi daha çok ayrışıyorsa o. En kötü rozet
 * 5.02:1, yani hepsi AA üstünde.
 *
 * Eşiği geçmeyen rozet renkle değil İŞARETLE ayrılıyor: bir ünlem ve daha
 * kalın bir kenar. Kritik rengi kullanmak cazipti ama o renk her zeminde
 * okunmuyor, ve okunmayan bir uyarı uyarı değildir.
 */
function Rozet({ k, s }: { k: Kontrast; s: Metinler }) {
  return (
    <span
      className={`token-badge ${k.gecti ? "" : "token-badge-kotu"}`}
      style={{ color: k.yazi ?? "inherit" }}
      title={k.tur === "oran" ? `WCAG ${k.deger}` : `ΔL* ${k.deger}`}
    >
      {k.gecti ? "" : "! "}
      {k.tur === "dL" ? "ΔL* " : ""}
      {k.deger} {s.karsi[k.karsi] ?? k.karsi}
    </span>
  );
}

function Ornek({ t, s }: { t: Token; s: Metinler }) {
  if (t.tur === "renk") {
    const tekTema = !t.koyu || t.koyu === t.acik;
    return (
      <div className="flex flex-col gap-1.5">
        <div className={`token-swatch ${tekTema ? "token-swatch-solo" : ""}`}>
          <span style={{ background: t.acik }}>
            {t.kontrastAcik && <Rozet k={t.kontrastAcik} s={s} />}
          </span>
          {!tekTema && (
            <span style={{ background: t.koyu! }}>
              {t.kontrastKoyu && <Rozet k={t.kontrastKoyu} s={s} />}
            </span>
          )}
        </div>
        <p className="flex flex-wrap gap-x-3 font-mono text-caption text-ink-faint">
          <span>
            {t.acik} <span className="text-ink-faint">{s.acik}</span>
          </span>
          {!tekTema ? (
            <span>
              {t.koyu} <span className="text-ink-faint">{s.koyu}</span>
            </span>
          ) : (
            <span>{s.ayni}</span>
          )}
        </p>
      </div>
    );
  }

  if (t.tur === "golge") {
    return (
      <div className="token-shadow-demo">
        <span style={{ boxShadow: t.acik }} />
      </div>
    );
  }

  if (t.tur === "yazi") {
    return (
      <div className="token-ornek flex items-center overflow-hidden text-ink" style={{ fontSize: t.acik }}>
        Aa <span className="ml-2 font-mono text-caption text-ink-faint">{t.acik}</span>
      </div>
    );
  }

  if (t.tur === "olcu") {
    const px = Number.parseFloat(t.acik);
    const genislik = Number.isFinite(px) ? Math.max(2, Math.min(200, px)) : 2;
    return (
      <div className="token-ornek flex flex-col justify-center gap-2">
        <span
          className="block h-2 rounded-(--radius-mark) bg-[var(--color-ink-faint)]"
          style={{ width: `${genislik}px` }}
        />
        <span className="font-mono text-caption text-ink-faint">{t.acik}</span>
      </div>
    );
  }

  return (
    <div className="token-ornek flex items-center">
      <span className="font-mono text-small text-ink-soft">{t.acik}</span>
    </div>
  );
}

/* GEREKÇE OKUNAN METİNDİR, yani okuyanın dilinde olmak zorunda. Açıklamalar
   kaynaktaki yorumdan geliyor ve o yorumlar İngilizce yazılmış; Türkçe sayfa
   bu yüzden İngilizce gerekçeler basıyordu. Karşılığı yorumun içinde `TR:`
   satırında, ve seçim burada yapılıyor. Karşılığı olmayan token kalmıyor:
   extract-tokens bir kapı, çevirisiz gerekçede build kırılıyor. */
const gerekce = (t: Token, lang: "tr" | "en") =>
  (lang === "tr" ? t.aciklamaTr : t.aciklama) ?? t.aciklama;

function Satir({ t, s, lang }: { t: Token; s: Metinler; lang: "tr" | "en" }) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const metin = `var(${t.ad})`;
  const aciklama = gerekce(t, lang);

  return (
    <div className="token-row">
      <Ornek t={t} s={s} />

      <div className="flex min-w-0 flex-col gap-2">
        <code className="font-mono text-body font-medium text-ink">{t.ad}</code>
        {aciklama && <p className="text-small leading-relaxed text-ink-soft">{aciklama}</p>}
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <span className="token-code">
          <span className="truncate">{metin}</span>
          <MiniButton
            aria-label={`${t.ad} ${s.kopyala}`}
            onClick={() => {
              navigator.clipboard?.writeText(metin);
              setKopyalandi(true);
              window.setTimeout(() => setKopyalandi(false), 1400);
            }}
          >
            <Icon icon={kopyalandi ? Check : Copy} size="xs" />
          </MiniButton>
        </span>
        {t.utilityleri.length > 0 && (
          <span className="flex flex-wrap gap-1.5">
            {t.utilityleri.slice(0, 3).map((u) => (
              <code key={u} className="font-mono text-caption text-ink-faint">
                {u}
              </code>
            ))}
            {t.utilityleri.length > 3 && (
              <span className="text-caption text-ink-faint">+{t.utilityleri.length - 3}</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

export function Tokenlar({ lang }: { lang: "tr" | "en" }) {
  const s = L[lang];
  const [ara, setAra] = useState("");

  const gruplar = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("tr");
    const suzulmus = q
      ? TOKENLAR.filter((t) =>
          `${t.ad} ${t.acik} ${t.koyu ?? ""} ${gerekce(t, lang) ?? ""} ${t.utilityleri.join(" ")}`
            .toLocaleLowerCase("tr")
            .includes(q),
        )
      : TOKENLAR;
    return SIRA.map((g) => [g, suzulmus.filter((t) => t.grup === g)] as const).filter(
      ([, liste]) => liste.length > 0,
    );
  }, [ara, lang]);

  const toplam = gruplar.reduce((n, [, liste]) => n + liste.length, 0);

  return (
    <div className="my-6 flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="relative flex items-center">
          <Icon
            icon={Search}
            size="xs"
            aria-hidden
            className="pointer-events-none absolute left-2.5 text-ink-faint"
          />
          <Input
            type="search"
            leading
            value={ara}
            onChange={(e) => setAra(e.target.value)}
            placeholder={s.ara}
            className="w-72"
          />
        </span>
        <Label>{s.sayac(toplam)}</Label>
      </div>

      {toplam === 0 && <p className="text-ink-soft">{s.bos}</p>}

      {gruplar.map(([grup, liste]) => {
        const [ad, alt] = BASLIK[grup]?.[lang] ?? [grup, ""];
        return (
          <section key={grup} className="flex flex-col">
            <h2 className="docs-h2" id={ad.toLocaleLowerCase("tr").replace(/\s+/g, "-")}>
              {ad}
            </h2>
            {alt && <p className="mb-2 text-ink-soft">{alt}</p>}

            {/* Sütun başlıkları bir kez, bölümün tepesinde. Her satırda
                tekrarlanan bir başlık, taranan bir listeyi yavaşlatıyor. */}
            <div className="token-row !border-b-2 !py-2 text-micro font-semibold uppercase tracking-wide text-ink-faint">
              <span>{s.ornek}</span>
              <span className="hidden lg:block">{s.aciklama}</span>
              <span className="hidden lg:block">{s.token}</span>
            </div>

            <div className="docs-kit">
              {liste.map((t) => (
                <Satir key={`${t.ad}-${t.grup}`} t={t} s={s} lang={lang} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
