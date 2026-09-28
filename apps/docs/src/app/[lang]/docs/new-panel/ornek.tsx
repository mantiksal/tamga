"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ColorSwatches,
  Icon,
  ImageField,
  RailCards,
  ThemeCards,
  toneOf,
  type RailChoice,
  type SwatchOption,
  type ThemeChoice,
} from "tamga-ui";
import { Check, Close, Collapse, Customize, Edit, Expand, Lock } from "tamga-ui/icons";
import { makePalette } from "tamga-ui/palette";

/**
 * "Yeni panel" sayfasının canlı yarısı.
 *
 * SAYFANIN İDDİASI BİR RENKTEN BİR PANEL ÇIKTIĞI. Bunu anlatan bir paragraf
 * okunuyor ama inanılmıyor; bir renk seçip rayın, düğmenin ve paletin birlikte
 * döndüğünü görmek inandırıyor. Palet tablosu da elle yazılmıyor: `makePalette`
 * kitin kendi üreticisi, yani sayfadaki sayılar kapının ürettiği sayılar.
 */

/* ---------------------------------------------------------------- üç küme -- */

/** Sayfanın sözlüğündeki biçim: `[ad, ne, neden]`. */
type KumeMetin = readonly [string, string, string];

/** Değiştir · İsteğe bağlı · Dokunma · üç küme, üç ton. */
export function UcKume({ rows }: { rows: readonly (readonly string[])[] }) {
  /* TON BURADA ANLAM TAŞIYOR, süs değil: yeşil "güvenle değiştir", kırmızı
     "dokunma". Yasa 3 tam olarak bunu istiyor · renk bir sapmayı söylüyor. */
  const kumeler = [
    { ton: "positive", glif: Edit },
    { ton: "caution", glif: Customize },
    { ton: "danger", glif: Lock },
  ] as const;
  return (
    <div className="yp-uclu">
      {kumeler.map(({ ton, glif }, i) => {
        const h = toneOf(ton);
        const r = rows[i] as KumeMetin | undefined;
        if (!r) return null;
        const [ad, ne, neden] = r;
        return (
          <div key={ad} className="yp-kume">
            <span className="yp-kume-bas" style={{ background: h.bg, color: h.fg }}>
              <Icon icon={glif} size="xs" weight="bold" />
              {ad}
            </span>
            <span className="yp-kume-ne">{ne}</span>
            <span className="yp-kume-neden">{neden}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ ayarlar demo -- */

/** `ImageField`in istediği sekiz dizge · logo ve amblem için ayrı ayrı. */
type GorselMetin = {
  name: string;
  upload: string;
  replace: string;
  remove: string;
  empty: string;
  errorType: string;
  errorSize: string;
  errorUnreadable: string;
};

type AyarMetin = {
  baslik: string;
  kapsam: string;
  varliklar: string;
  varliklarNot: string;
  logo: GorselMetin;
  amblem: GorselMetin;
  renk: string;
  renkNot: string;
  kutular: readonly SwatchOption[];
  ozelRenk: string;
  ozelAd: string;
  tema: string;
  temaNot: string;
  acik: string;
  koyu: string;
  sistem: string;
  acikNot: string;
  koyuNot: string;
  sistemNot: string;
  ray: string;
  rayNot: string;
  rayDar: string;
  rayGenis: string;
  raySecsin: string;
  rayDarNot: string;
  rayGenisNot: string;
  raySecsinNot: string;
  markaAdi: string;
  onizleme: string;
  ornekBaslik: string;
  ornekEylem: string;
  ornekBaglanti: string;
  ornekSatir: readonly string[];
  paletBaslik: string;
  paletIpucu: string;
  tokenlar: readonly (readonly [string, keyof ReturnType<typeof makePalette>["light"]])[];
};

/**
 * Tek bir alan: solda ne sorulduğu, sağda kitin kendi kontrolü.
 *
 * Başlık ve açıklama kontrolün ÜSTÜNDE değil YANINDA · üç minyatür kartın
 * üstüne konan bir başlık, kartların kendisiyle aynı ağırlıkta okunuyordu.
 */
function Alan({ ad, not, children }: { ad: string; not: string; children: ReactNode }) {
  return (
    <div className="yp-alan">
      <span className="yp-alan-bas">
        <strong>{ad}</strong>
        <span>{not}</span>
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/**
 * KONTROLLERİN HEPSİ KİTİN KENDİSİ. Bu demo bir süre elle çizilmişti: renk
 * kareleri `<button>`, tema bir `Segmented`, yükleme yuvaları kesik kenarlı
 * birer `<span>`. Görünen şey kitin verdiği cevap değil o cevabın taklidiydi,
 * ve bir doküman sitesinde en pahalı yanlış budur.
 */
export function AyarlarDemosu({ labels: s }: { labels: AyarMetin }) {
  const [renk, setRenk] = useState("#1e4fd8");
  const [tema, setTema] = useState<ThemeChoice>("light");
  const [ray, setRay] = useState<RailChoice>("wide");
  const [logo, setLogo] = useState<string | null>(null);
  const [amblem, setAmblem] = useState<string | null>(null);
  /* "Kullanıcı seçsin" seçilince önizlemedeki ray GERÇEKTEN açılıp kapanıyor:
     üç seçeneğin farkı sözcükte değil, rayda bir tutamak olup olmamasında. */
  const [kullaniciDar, setKullaniciDar] = useState(false);

  /* "Sistem" ölü bir seçenek DEĞİL: doküman sitesinin kendi temasını izliyor,
     yani gerçekte ne yapacaksa burada da onu yapıyor. Gözlemci `class`
     değişimini dinliyor · tema anahtarı `documentElement`e yazıyor. */
  const [siteKoyu, setSiteKoyu] = useState(false);
  useEffect(() => {
    const oku = () => setSiteKoyu(document.documentElement.classList.contains("dark"));
    oku();
    const g = new MutationObserver(oku);
    g.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => g.disconnect();
  }, []);

  const etkinTema = tema === "system" ? (siteKoyu ? "dark" : "light") : tema;
  const etkinDar = ray === "narrow" || (ray === "free" && kullaniciDar);

  /* PALET HER DEĞİŞİKLİKTE YENİDEN ÜRETİLİYOR, ve üreteci kitin kendisi:
     sayfadaki sayılar `check-palette`in ölçtüğü sayılarla aynı matematikten
     çıkıyor. Elle yazılmış bir tablo ilk renk değişikliğinde yalan söylerdi. */
  const palet = useMemo(() => makePalette(renk), [renk]);
  const p = palet[etkinTema];
  const secili = s.kutular.find((k) => k.hex.toLowerCase() === renk.toLowerCase());

  return (
    <div className="yp-ayar">
      <div className="yp-ayar-bas">
        <strong>{s.baslik}</strong>
        <span className="yp-kapsam">{s.kapsam}</span>
      </div>

      <div className="yp-ayar-izgara">
        {/* VARLIKLAR ÖNCE, kitin kendi Görünüm ekranındaki sıra: bir markada
            ilk sorulan şey renk değil işaret. */}
        <Alan ad={s.varliklar} not={s.varliklarNot}>
          <div className="yp-gorseller">
            <ImageField
              value={logo}
              onChange={setLogo}
              maxEdge={512}
              labels={s.logo}
              preview={(src) => (
                /* eslint-disable-next-line @next/next/no-img-element -- data URI */
                <img src={src} alt="" className="max-h-full w-auto max-w-40 object-contain" />
              )}
            />
            <ImageField
              value={amblem}
              onChange={setAmblem}
              maxEdge={256}
              labels={s.amblem}
              preview={(src) => (
                /* eslint-disable-next-line @next/next/no-img-element -- data URI */
                <img src={src} alt="" className="size-10 object-contain" />
              )}
            />
          </div>
        </Alan>

        <Alan ad={s.renk} not={s.renkNot}>
          <div className="flex flex-col gap-3">
            <ColorSwatches
              options={s.kutular}
              value={renk}
              onChange={setRenk}
              customLabel={s.ozelRenk}
            />
            {/* SEÇİLENİN ADI VE KODU: yedi kutu "hangisi seçili"yi söylüyor ama
                bir marka rengi çoğu zaman bir koda göre seçiliyor. */}
            <span className="flex flex-wrap items-center gap-2 text-small font-bold text-ink">
              {secili ? secili.label : s.ozelAd}
              <span className="tamga-chip tamga-chip-mono">{renk}</span>
            </span>
          </div>
        </Alan>

        <Alan ad={s.tema} not={s.temaNot}>
          <ThemeCards
            value={tema}
            onChange={setTema}
            labels={{
              light: s.acik,
              dark: s.koyu,
              system: s.sistem,
              group: s.tema,
              lightNote: s.acikNot,
              darkNote: s.koyuNot,
              systemNote: s.sistemNot,
            }}
          />
        </Alan>

        <Alan ad={s.ray} not={s.rayNot}>
          <RailCards
            value={ray}
            onChange={setRay}
            labels={{
              narrow: s.rayDar,
              wide: s.rayGenis,
              free: s.raySecsin,
              group: s.ray,
              narrowNote: s.rayDarNot,
              wideNote: s.rayGenisNot,
              freeNote: s.raySecsinNot,
            }}
          />
        </Alan>
      </div>

      {/* ÖNİZLEME KENDİ PALETİNİ TAŞIYOR: token'lar burada yeniden bildiriliyor,
          yani içerideki her şey sayfanın değil SEÇİLEN rengin paletini okuyor. */}
      <div className="yp-onizleme-bas">{s.onizleme}</div>
      <div
        className="yp-onizleme"
        style={{
          background: p.page,
          color: p.ink,
          borderColor: p.edge,
        }}
      >
        <div
          className="yp-ray"
          data-genis={!etkinDar || undefined}
          style={{ background: p.rail, borderColor: p.edge, color: p.navIdle }}
        >
          {/* YÜKLENEN AMBLEM VE LOGO BURADA GÖRÜNÜYOR: yukarıdaki alan bir
              demo değil, önizlemenin kaynağı · dar ray amblemi, geniş ray
              logoyu gösteriyor, ve cümlenin doğruluğu ekranda sınanıyor. */}
          <span
            className="yp-amblem"
            style={{
              background: amblem ? "transparent" : p.accent,
              color: p.accentInk,
            }}
          >
            {amblem ? (
              /* eslint-disable-next-line @next/next/no-img-element -- data URI */
              <img src={amblem} alt="" className="size-full object-contain" />
            ) : (
              s.markaAdi.slice(0, 1)
            )}
          </span>
          {!etkinDar &&
            (logo ? (
              /* eslint-disable-next-line @next/next/no-img-element -- data URI */
              <img src={logo} alt="" className="yp-logo-onizleme" />
            ) : (
              <span style={{ color: p.ink }}>{s.markaAdi}</span>
            ))}
          {/* Tutamak yalnız "kullanıcı seçsin"de var · farkın kendisi bu. */}
          {ray === "free" && (
            <button
              type="button"
              className="yp-tutamak"
              style={{ color: p.navIdle, borderColor: p.edge }}
              aria-label={s.raySecsin}
              onClick={() => setKullaniciDar((v) => !v)}
            >
              <Icon icon={kullaniciDar ? Expand : Collapse} size="xs" weight="bold" />
            </button>
          )}
        </div>
        <div className="yp-govde">
          <strong style={{ color: p.ink }}>{s.ornekBaslik}</strong>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="yp-btn"
              style={{
                background: p.accent,
                /* MÜREKKEBİ PALET SEÇİYOR, bu sayfa değil: `makePalette`
                   vurgunun üstünde okunan rengi zaten hesaplıyor, ve ikinci bir
                   hesap iki gerçek üretirdi. */
                color: p.accentInk,
                borderColor: p.edgeStrong,
                boxShadow: `3px 3px 0 ${p.edgeStrong}`,
              }}
            >
              {s.ornekEylem}
            </button>
            <a href="#yp" style={{ color: p.accentLine, fontWeight: 600 }}>
              {s.ornekBaglanti}
            </a>
          </div>
          <div className="yp-satirlar" style={{ borderColor: p.line }}>
            {s.ornekSatir.map((r, i) => (
              <span
                key={r}
                style={{
                  background: i === 0 ? p.accentBg : "transparent",
                  borderColor: p.line,
                  color: p.inkSoft,
                }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* PALET TABLOSU: aynı renkten iki tema. Bir ürünün değiştirdiği TEK şey
          soldaki hex; sağdaki otuz token ondan türüyor. */}
      <div className="yp-onizleme-bas">{s.paletBaslik}</div>
      <div className="yp-palet">
        {(["light", "dark"] as const).map((t) => (
          <div key={t} className="yp-palet-sutun">
            <code className="yp-palet-bas">{t === "light" ? ":root" : ".dark"}</code>
            {s.tokenlar.map(([ad, anahtar]) => (
              <span key={ad} className="yp-palet-satir">
                <span className="yp-palet-kare" style={{ background: palet[t][anahtar] }} />
                <code className="flex-1 truncate">{ad}</code>
                <code className="text-ink-faint">{palet[t][anahtar]}</code>
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="yp-ipucu">{s.paletIpucu}</p>
    </div>
  );
}

/* ------------------------------------------------------------- kontrast -- */

type KontrastMetin = { resmi: string; birBasamak: string; kiyas: string; gecti: string; kaldi: string; rol: readonly string[] };

/**
 * ORANLAR SABİT YAZILI, ve bu bilinçli: sayfadaki üç sayı `check-token-contrast`
 * kapısının ÖLÇTÜĞÜ sayılar. Tarayıcıda basit WCAG formülüyle yeniden
 * hesaplamak başka sonuç veriyor (3.79 · 4.62 · 6.63) ve sayfa kapıyla
 * çelişirdi · iki gerçek, ikisi de yanlış.
 */
/* ÖRNEĞİN VERİSİ, ölçeğin değil: kurgusal bir markanın resmi kırmızısı, bir
   basamak koyusu, ve kıyas için kitin kendi mavisi. `check-scale` ham rengi
   `className`/`style` içinde aramıyor · burada sabit, orada değişken. */
const BEYAZ = "#ffffff";
const KONTRAST = [
  { hex: "#f93140", oran: 3.7, gecti: false },
  { hex: "#e02938", oran: 4.51, gecti: true },
  { hex: "#1e4fd8", oran: 5.22, gecti: true },
] as const;

export function KontrastKartlari({ labels: s }: { labels: KontrastMetin }) {
  const adlar = [s.resmi, s.birBasamak, s.kiyas];
  return (
    <div className="yp-uclu">
      {KONTRAST.map((k, i) => (
        <div key={k.hex} className="yp-kontrast">
          <span className="yp-kontrast-ornek" style={{ background: k.hex }}>
            <span style={{ color: BEYAZ }}>Aa</span>
          </span>
          <span className="flex flex-wrap items-center gap-2">
            <code className="yp-kontrast-hex">{k.hex}</code>
            <span
              className="yp-kontrast-rozet"
              style={{
                background: toneOf(k.gecti ? "positive" : "danger").bg,
                color: toneOf(k.gecti ? "positive" : "danger").fg,
              }}
            >
              <Icon icon={k.gecti ? Check : Close} size="xs" weight="bold" />
              {k.oran.toFixed(2)}
            </span>
          </span>
          <span className="yp-kume-neden">{adlar[i]}</span>
          {/* AA ÇİZGİSİ ÇUBUĞUN ÜSTÜNDE: bir oran tek başına bir sayı, eşiğin
              neresinde durduğu görülünce bir KARAR oluyor. */}
          <span className="yp-bar">
            <span
              style={{
                width: `${Math.min(100, (k.oran / 7) * 100)}%`,
                background: toneOf(k.gecti ? "positive" : "danger").mark,
              }}
            />
            <span className="yp-bar-esik" style={{ left: `${(4.5 / 7) * 100}%` }} />
          </span>
          <span className="yp-kume-neden">{s.rol[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- logo -- */

/** Logonun temsili: iki renkli bir sözcük. Gerçek müşteri logosu kullanılmaz. */
/* Zeminler SABİT, temayla dönmüyor: gösterilen şey logonun AÇIK ve KOYU
   zemindeki hâli · sayfanın teması değişince örnek de dönseydi iki hâlden biri
   hiç görünmezdi. */
const ACIK_ZEMIN = "#f4f2ec";
const KOYU_ZEMIN = "#101a2c";
const LOGO_RENK = "#f93140";
const LOGO_GRI = "#7f7f7f";

function LogoCizimi() {
  return (
    <span className="yp-logo-cizim">
      <span style={{ color: LOGO_RENK }}>mar</span>
      <span style={{ color: LOGO_GRI }}>ka</span>
    </span>
  );
}

export function LogoKartlari({
  labels: s,
}: {
  labels: { acik: string; koyu: string; yama: string; acikNot: string; koyuNot: string; yamaNot: string };
}) {
  return (
    <div className="yp-uclu">
      {[
        { ad: s.acik, not: s.acikNot, zemin: ACIK_ZEMIN, filtre: undefined, iyi: true },
        { ad: s.koyu, not: s.koyuNot, zemin: KOYU_ZEMIN, filtre: undefined, iyi: false },
        /* YAMA BİR ÇÖZÜM DEĞİL BİR KAÇIŞ: logoyu parlatmak onu okunur yapıyor
           ama markanın rengini de değiştiriyor · sarı, "işe yarıyor ama bedeli
           var" demek. */
        { ad: s.yama, not: s.yamaNot, zemin: KOYU_ZEMIN, filtre: "brightness(1.6)", iyi: null },
      ].map((k) => (
        <div key={k.ad} className="yp-kume">
          <span
            className="yp-kume-bas"
            style={
              k.iyi === null
                ? { background: toneOf("caution").bg, color: toneOf("caution").fg }
                : {
                    background: toneOf(k.iyi ? "positive" : "danger").bg,
                    color: toneOf(k.iyi ? "positive" : "danger").fg,
                  }
            }
          >
            {/* YAMANIN GLİFİ ✓ DEĞİL: onay işareti "sorun yok" diyor, oysa
                yama okunur yapıyor ve markanın rengini bozuyor · sürgü glifi
                "ayarlandı" diyor, "çözüldü" değil. */}
            <Icon
              icon={k.iyi === null ? Customize : k.iyi ? Check : Close}
              size="xs"
              weight="bold"
            />
            {k.ad}
          </span>
          <span className="yp-logo-zemin" style={{ background: k.zemin, filter: k.filtre }}>
            <LogoCizimi />
          </span>
          <span className="yp-kume-neden">{k.not}</span>
        </div>
      ))}
    </div>
  );
}
