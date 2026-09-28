"use client";

import { useMemo, useState } from "react";
import { Icon, Input, toneOf } from "tamga-ui";
import { ArrowBendDownRight, Check, Close, Copy, Flask, Question, Search, Success } from "tamga-ui/icons";
import ham from "@/content/tokens.json";

/**
 * Hangi token hangi Tailwind utility'sini üretiyor.
 *
 * ÜRETİLEN veriden: `extract-tokens.mjs` her token için iki şeye bakıyor,
 * hangi blokta olduğuna ve ön ekine. Elle yazılan bir liste ilk token
 * taşındığında yalan söylemeye başlardı.
 *
 * ÜRETMEYENLER DE LİSTELENİYOR, ve asıl değerli kısım o: bir geliştirici
 * `rounded-card` yazıp neden çalışmadığını aramak yerine burada karşılığını
 * görüyor.
 *
 * Gerekçe: docs/07-dokuman-sitesi.md
 */

type Token = {
  ad: string;
  grup: string;
  tur: string;
  acik: string;
  koyu: string | null;
  utilityleri: string[];
};

const TOKENLAR = ham as Token[];
const YESIL = toneOf("positive");
const SARI = toneOf("caution");

/**
 * Tailwind v4'ün AD ALANLARI · `extract-tokens.mjs` ile aynı küme.
 *
 * İKİ YERDE YAZILI OLMASI BİR BORÇ, ve bilerek alındı: üretici bu listeyi
 * `utilityleri` alanını HESAPLAMAK için kullanıyor, buradaki kopya ise
 * kullanıcının yazdığı ve kitte OLMAYAN bir ad için ② koşulunu sınıyor ·
 * yani üretilen veride karşılığı olmayan bir soru. Üçüncü bir tüketici
 * çıktığı gün `counts.json` gibi üretilen bir dosyaya taşınır.
 */
const AD_ALANLARI = [
  "color",
  "text",
  "radius",
  "shadow",
  "ease",
  "font",
  "font-weight",
  "spacing",
  "breakpoint",
  "container",
  "inset-shadow",
  "drop-shadow",
  "blur",
  "perspective",
  "aspect",
  "animate",
  "tracking",
  "leading",
];

/** Adın hangi ad alanına girdiği · en uzun eşleşme kazanıyor (`font-weight` > `font`). */
function adAlani(ad: string): string | null {
  const n = ad.replace(/^--/, "");
  return (
    AD_ALANLARI.filter((p) => n === p || n.startsWith(`${p}-`)).sort((a, b) => b.length - a.length)[0] ??
    null
  );
}

/** Utility üretmeyen bir token'ın yerine ne yazılacağı. */
function kacisYolu(ad: string): string {
  if (ad.startsWith("--radius")) return `rounded-(${ad})`;
  if (ad.startsWith("--shadow-")) return `shadow-[var(${ad})]`;
  if (ad.startsWith("--duration-")) return `duration-[var(${ad})]`;
  if (ad.startsWith("--measure")) return `max-w-[var(${ad})]`;
  return `[var(${ad})]`;
}

type Metinler = {
  ara: string;
  temizle: string;
  token: string;
  yerine: string;
  varH: string;
  yokH: string;
  bos: string;
  kopyala: string;
  sayac: (a: number, b: number, c: number) => string;
  daha: (n: number) => string;
  az: string;
  deneH: string;
  c1: string;
  c2: string;
  c1ok: string;
  c1no: string;
  c1na: string;
  c1unk: string;
  c2ok: (p: string) => string;
  c2no: (p: string) => string;
  rOk: (n: number) => string;
  rNo: string;
  rUnk: string;
  whyNs: string;
  whyRoot: string;
};

const L: Record<"tr" | "en", Metinler> = {
  tr: {
    ara: "Token ya da utility ara",
    temizle: "Aramayı temizle",
    token: "token",
    yerine: "yerine",
    varH: "Utility üreten token'lar",
    yokH: "Üretmeyenler, ve yerine ne yazılacağı",
    bos: "Bu aramayla eşleşen yok.",
    kopyala: "Kopyala",
    sayac: (a, b, c) => `${a} token, ${b} utility · ${c} üretmeyen`,
    daha: (n) => `+${n} daha`,
    az: "azalt",
    deneH: "Dene: bir token adı yaz",
    c1: "@theme bloğunda",
    c2: "Tailwind ad alanı",
    c1ok: "utility üretiyor, yani @theme içinde",
    c1no: "ad alanı doğru ama utility yok: düz bir :root'ta duruyor",
    c1na: "bakılmadı, ② zaten geçmiyor",
    c1unk: "kitte bu adda bir token yok",
    c2ok: (p) => `--${p}- bir ad alanı`,
    c2no: (p) => `--${p}- ad alanı değil`,
    rOk: (n) => `${n} utility üretiyor`,
    rNo: "Utility yok. Yerine:",
    rUnk: "Bu ad kitte yok.",
    whyNs: "ad alanı değil",
    whyRoot: "@theme dışında",
  },
  en: {
    ara: "Search a token or utility",
    temizle: "Clear the search",
    token: "token",
    yerine: "instead",
    varH: "Tokens that produce utilities",
    yokH: "The ones that do not, and what to write instead",
    bos: "Nothing matches that search.",
    kopyala: "Copy",
    sayac: (a, b, c) => `${a} tokens, ${b} utilities · ${c} without`,
    daha: (n) => `+${n} more`,
    az: "less",
    deneH: "Try it: type a token name",
    c1: "In a @theme block",
    c2: "A Tailwind namespace",
    c1ok: "it produces utilities, so it sits in @theme",
    c1no: "the namespace is right but there is no utility: it sits in a plain :root",
    c1na: "not checked, ② already fails",
    c1unk: "the kit has no token by that name",
    c2ok: (p) => `--${p}- is a namespace`,
    c2no: (p) => `--${p}- is not a namespace`,
    rOk: (n) => `produces ${n} utilities`,
    rNo: "No utility. Write instead:",
    rUnk: "The kit has no such name.",
    whyNs: "not a namespace",
    whyRoot: "outside @theme",
  },
};

/** Kopyalayan çip · 1.4 sn boyunca geçtiğini söylüyor. */
function Kopya({
  metin,
  baslik,
  className,
}: {
  metin: string;
  baslik: string;
  className: string;
}) {
  const [alindi, setAlindi] = useState(false);
  return (
    <button
      type="button"
      className={className}
      title={baslik}
      data-alindi={alindi || undefined}
      onClick={() => {
        navigator.clipboard?.writeText(metin);
        setAlindi(true);
        window.setTimeout(() => setAlindi(false), 1400);
      }}
    >
      {alindi ? "✓ " : ""}
      {metin}
    </button>
  );
}

const ORNEKLER = [
  "color-accent",
  "text-body",
  "radius-card",
  "radius",
  "duration-base",
  "measure",
  "shadow-hover",
  "row",
];

/**
 * DENEME KUTUSU · kural iki koşul, ve kutu ikisini AYRI AYRI gösteriyor.
 *
 * Bir kural metni okunuyor ama denenmiyor; burada yazılan ad iki koşuldan
 * hangisine takıldığını söylüyor, ve takılıyorsa yerine ne yazılacağını.
 * ① için kaynağa bakmak gerekmiyor: token utility ÜRETİYORSA `@theme`
 * içindedir · üretilen veri o soruyu zaten cevaplamış.
 */
function Deneme({ s }: { s: Metinler }) {
  const [yazilan, setYazilan] = useState("radius-card");
  const ad = `--${yazilan.replace(/^-+/, "").trim()}`;
  const bulunan = TOKENLAR.find((t) => t.ad === ad);
  const alan = adAlani(ad);
  const onek = ad.replace(/^--/, "").split("-")[0] ?? "";
  const utilVar = (bulunan?.utilityleri.length ?? 0) > 0;
  const durum1 = !bulunan ? "unk" : !alan ? "na" : utilVar ? "ok" : "no";

  const kutular = [
    {
      n: "①",
      baslik: s.c1,
      detay: { ok: s.c1ok, no: s.c1no, na: s.c1na, unk: s.c1unk }[durum1],
      gecti: durum1 === "ok" ? true : durum1 === "no" ? false : null,
    },
    {
      n: "②",
      baslik: s.c2,
      detay: alan ? s.c2ok(alan) : s.c2no(onek),
      gecti: Boolean(alan),
    },
  ];

  const sonuc = !bulunan
    ? { ton: "bilinmiyor", baslik: s.rUnk, kod: null }
    : utilVar
      ? { ton: "var", baslik: s.rOk(bulunan.utilityleri.length), kod: bulunan.utilityleri.slice(0, 4).join("  ") }
      : { ton: "yok", baslik: s.rNo, kod: kacisYolu(ad) };

  return (
    <section id="dene" className="tw-dene">
      <div className="tw-dene-bar">
        <Icon icon={Flask} size="sm" weight="duotone" />
        <strong>{s.deneH}</strong>
      </div>
      <div className="tw-dene-ic">
        {/* İKİ TİRE SABİT VE GİRDİNİN DIŞINDA: her token onunla başlıyor, yani
            yazdırmak kullanıcıya bir şey sormuyor · yanlış yazılmasına izin
            veriyor. Yine de baştaki tireler kırpılıyor, çünkü yapıştıran
            biri tam adı yapıştırıyor. */}
        <label className="tw-dene-girdi">
          <code aria-hidden>--</code>
          <Input
            full
            value={yazilan}
            onChange={(e) => setYazilan(e.target.value)}
            aria-label={s.deneH}
            className="font-mono font-bold"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ORNEKLER.map((o) => (
            <button
              key={o}
              type="button"
              className="tw-ornek"
              data-secili={yazilan === o || undefined}
              onClick={() => setYazilan(o)}
            >
              --{o}
            </button>
          ))}
        </div>
        <div className="tw-kosullar">
          {kutular.map((k) => (
            <div key={k.n} className="tw-kosul">
              <span
                className="tw-kosul-n"
                style={
                  k.gecti === true
                    ? { background: YESIL.bg, color: YESIL.fg }
                    : k.gecti === false
                      ? { background: toneOf("danger").bg, color: toneOf("danger").fg }
                      : undefined
                }
              >
                {k.n}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <strong>{k.baslik}</strong>
                <span className="tw-kosul-alt">{k.detay}</span>
              </span>
            </div>
          ))}
        </div>
        <div
          className="tw-sonuc"
          style={
            sonuc.ton === "var"
              ? { background: YESIL.bg, color: YESIL.fg }
              : sonuc.ton === "yok"
                ? { background: SARI.bg, color: SARI.fg }
                : undefined
          }
        >
          {/* Üç sonucun üç glifi: geçti · yerine şunu yaz · böyle bir ad yok.
              Ortadaki bir OK, çünkü söylediği şey bir hata değil bir YÖNLENDİRME. */}
          <Icon
            icon={sonuc.ton === "var" ? Success : sonuc.ton === "yok" ? ArrowBendDownRight : Question}
            size="md"
            weight={sonuc.ton === "bilinmiyor" ? "duotone" : "fill"}
            className="shrink-0"
          />
          <span className="flex min-w-0 flex-col gap-1.5">
            <strong>{sonuc.baslik}</strong>
            {sonuc.kod && <code className="tw-sonuc-kod">{sonuc.kod}</code>}
          </span>
        </div>
      </div>
    </section>
  );
}

/** Utility üreten bir token'ın satırı · çipler ilk altı, gerisi açılır. */
function VarSatir({ t, s, acikMi }: { t: Token; s: Metinler; acikMi: boolean }) {
  const [acik, setAcik] = useState(false);
  const hepsi = t.utilityleri;
  const goster = acik || acikMi ? hepsi : hepsi.slice(0, 6);
  return (
    <div className="tw-satir">
      <span className="tw-ad">
        {t.tur === "renk" && (
          <span className="tw-kare" style={{ background: t.acik }} aria-hidden />
        )}
        <code>{t.ad}</code>
      </span>
      <div className="flex min-w-0 flex-wrap gap-1.5">
        {goster.map((u) => (
          <Kopya key={u} metin={u} baslik={s.kopyala} className="tw-util" />
        ))}
        {!acikMi && hepsi.length > 6 && (
          <button type="button" className="tw-daha" onClick={() => setAcik((v) => !v)}>
            {acik ? s.az : s.daha(hepsi.length - 6)}
          </button>
        )}
      </div>
    </div>
  );
}

export function Utilityler({ lang }: { lang: "tr" | "en" }) {
  const s = L[lang];
  const [ara, setAra] = useState("");

  const { var_, yok, utilSayisi } = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("tr");
    const hepsi = q
      ? TOKENLAR.filter((t) =>
          `${t.ad} ${t.utilityleri.join(" ")}`.toLocaleLowerCase("tr").includes(q),
        )
      : TOKENLAR;
    const v = hepsi.filter((t) => t.utilityleri.length > 0);
    return {
      var_: v,
      yok: hepsi.filter((t) => t.utilityleri.length === 0),
      utilSayisi: v.reduce((n, t) => n + t.utilityleri.length, 0),
    };
  }, [ara]);

  return (
    <>
      <Deneme s={s} />

      <div className="tw-liste">
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
            <span className="token-sayac">{s.sayac(var_.length, utilSayisi, yok.length)}</span>
          </div>
        </div>

        {var_.length === 0 && yok.length === 0 && <p className="token-bos">{s.bos}</p>}

        {var_.length > 0 && (
          <section className="tw-bolum">
            <h3 className="tw-h">
              <span className="tw-h-n" style={{ background: YESIL.bg, color: YESIL.fg }}>
                <Icon icon={Check} size="xs" weight="bold" />
              </span>
              {s.varH}
              <code className="tw-h-sayi">{var_.length}</code>
            </h3>
            <div className="tw-kart">
              {var_.map((t) => (
                <VarSatir key={t.ad} t={t} s={s} acikMi={ara.trim().length > 0} />
              ))}
            </div>
          </section>
        )}

        {yok.length > 0 && (
          <section className="tw-bolum">
            <h3 className="tw-h">
              <span className="tw-h-n" style={{ background: SARI.bg, color: SARI.fg }}>
                <Icon icon={ArrowBendDownRight} size="xs" weight="bold" />
              </span>
              {s.yokH}
              <code className="tw-h-sayi">{yok.length}</code>
            </h3>
            <div className="tw-kart">
              <div className="tw-satir tw-baslik">
                <span>{s.token}</span>
                <span>{s.yerine}</span>
              </div>
              {yok.map((t) => (
                <div key={t.ad} className="tw-satir tw-satir-orta">
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <code className="tw-ad-kod">{t.ad}</code>
                    {/* SEBEP HANGİ KOŞULA TAKILDIĞINI SÖYLÜYOR: ad alanı doğru
                        ama utility yoksa geriye tek açıklama kalıyor · token
                        düz bir `:root`ta. */}
                    <span className="tw-neden">{adAlani(t.ad) ? s.whyRoot : s.whyNs}</span>
                  </span>
                  <Kopya metin={kacisYolu(t.ad)} baslik={s.kopyala} className="tw-kacis" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
