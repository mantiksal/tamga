"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Icon } from "tamga-ui";
import { Check, Close, Failure, Success } from "tamga-ui/icons";
/* ÖLÇÜM KİTİN KENDİ MATEMATİĞİ. Sayfanın kontrast tablosu `check-token-contrast`
   ile AYNI iki işlevi çağırıyor: burada ikinci bir uygulama yazmak, kapıdan
   başka bir sonuç üreten bir sayfa demekti. */
import { contrast, deltaL } from "tamga-ui/palette";

/** Sayfanın örnek renkleri · sonuncusu kapıdan GEÇMEYEN örnek (sarı). */
const HEX = ["#D6336C", "#1E4FD8", "#0A7A5F", "#6D4AFF", "#F2C230"];
const RADII = [4, 8, 12];
/* Mürekkebin iki adayı · kitin `--color-inverse-ink` ve `--color-edge-strong`
   değerleri. Burada düz metin, çünkü ölçüm bir CSS değişkeniyle değil bir
   SAYIYLA yapılıyor. */
const BEYAZ = "#ffffff";
const KOYU = "#0a1f3d";
/** Kitin koyu temadaki kendi vurgusu · "unutulmuş token" örneğinde çıkan renk. */
const KIT_KOYU_ACCENT = "#709dfd";

type Secim = {
  accent: string;
  accentIndex: number;
  setAccent: (i: number) => void;
  radius: number;
  setRadius: (r: number) => void;
  onAccent: string;
};

const Ctx = createContext<Secim | null>(null);

function useSecim() {
  const s = useContext(Ctx);
  if (!s) throw new Error("TemaAlani içinde kullanılmalı");
  return s;
}

/** Bir rengin üstünde okunan mürekkep: beyaz mı koyu mu, ölçülerek. */
function murekkep(hex: string) {
  return contrast(hex, BEYAZ) >= contrast(hex, KOYU) ? BEYAZ : KOYU;
}

/** İki rengi oranla karıştırıyor · yalnız bu sayfanın örnekleri için. */
function mix(a: string, b: string, p: number) {
  const n = (h: string) => parseInt(h.slice(1), 16);
  const [x, y] = [n(a), n(b)];
  const kanal = [16, 8, 0].map((s) =>
    Math.round((((x >> s) & 255) * p + ((y >> s) & 255) * (1 - p))),
  );
  return `#${kanal.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Sayfanın seçimini tutan kap · bölümler ayrı ayrı çiziliyor ama hepsi AYNI
 * accent'i okuyor: yukarıdan rengi değiştirince aşağıdaki kontrast tablosu da
 * yeniden hesaplanıyor, ve sayfanın bütün iddiası bu.
 */
export function TemaAlani({ children }: { children: ReactNode }) {
  const [accentIndex, setAccent] = useState(0);
  const [radius, setRadius] = useState(12);
  const accent = HEX[accentIndex] ?? HEX[0]!;
  /* Accent üstündeki yazı ÖLÇÜLEREK seçiliyor: beyaz mı koyu mu, hangisi o
     rengin üstünde daha çok ayrışıyorsa. */
  const onAccent = murekkep(accent);
  return (
    <Ctx.Provider value={{ accent, accentIndex, setAccent, radius, setRadius, onAccent }}>
      {children}
    </Ctx.Provider>
  );
}

/** Ekranda o an geçerli olan tema renkleri · kapının ölçtüğü şey bunlar. */
function useTemaRenkleri() {
  const [renk, setRenk] = useState({ ground: "#fffefb", edge: "#0a1f3d", rule: "#e3dfd6" });
  useEffect(() => {
    const oku = () => {
      const s = getComputedStyle(document.documentElement);
      const al = (ad: string, yedek: string) => s.getPropertyValue(ad).trim() || yedek;
      setRenk({
        ground: al("--color-shell", "#fffefb"),
        edge: al("--color-edge-strong", "#0a1f3d"),
        rule: al("--color-div", "#e3dfd6"),
      });
    };
    oku();
    /* Tema kökteki sınıfla değişiyor: sayfa ekranda olanı ölçmeli, kendi
       varsayımını değil. */
    const gozlemci = new MutationObserver(oku);
    gozlemci.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => gozlemci.disconnect();
  }, []);
  return renk;
}

export function MarkaKutusu({
  labels,
}: {
  labels: {
    accentLabel: string;
    radiusLabel: string;
    names: string[];
    radiusNotes: Record<number, string>;
    product: string;
    title: string;
    live: string;
    field: string;
    toggle: string;
    cancel: string;
    save: string;
  };
}) {
  const { accent, accentIndex, setAccent, radius, setRadius, onAccent } = useSecim();
  const [acik, setAcik] = useState(true);
  const ad = labels.names[accentIndex] ?? "";
  const kod = `/* <${labels.product}>/src/globals.css */
@import "tailwindcss";
@import "tamga-ui/styles.css";
@source "../../node_modules/tamga-ui/dist";

:root {
  --color-accent: ${accent};   /* ${ad} */
  --radius: ${radius}px;${radius === 4 ? "             " : "            "}/* ${labels.radiusNotes[radius]} */
}`;

  /* KÖŞELER TEK SAYIDAN TÜREMELİ, ve bu örneğin bütün noktası o: kart r+2,
     kontrol r, anahtar r-2, topuz r-4 · `--radius` değişince hepsi dönüyor. */
  const r = (fark: number, taban = 2) => `${Math.max(taban, radius + fark)}px`;
  /* Odak gölgesi accent'in yumuşak tonu: dolu accent, bir alanın kenarında
     düğme gibi okunuyor. */
  const accentYumusak = mix(accent, BEYAZ, 0.45);

  return (
    <div className="tamga-card overflow-hidden">
      <div className="tamga-head tamga-gutter tamga-section flex-wrap gap-x-5">
        <span className="flex items-center gap-2">
          <code className="font-mono text-caption font-bold text-ink-faint">--color-accent</code>
          <span role="radiogroup" aria-label={labels.accentLabel} className="flex gap-1.5">
            {HEX.map((hex, i) => (
              <button
                key={hex}
                type="button"
                role="radio"
                aria-checked={i === accentIndex}
                title={hex}
                onClick={() => setAccent(i)}
                className="docs-renk-kutu"
                data-on={i === accentIndex || undefined}
                style={{ background: hex, color: murekkep(hex) }}
              >
                {i === accentIndex ? <Icon icon={Check} size="xs" weight="bold" /> : null}
              </button>
            ))}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <code className="font-mono text-caption font-bold text-ink-faint">--radius</code>
          <span className="tamga-segment tamga-segment-sm" role="group" aria-label={labels.radiusLabel}>
            {RADII.map((v) => (
              <button
                key={v}
                type="button"
                data-active={v === radius}
                onClick={() => setRadius(v)}
                className="font-mono"
              >
                {v}px
              </button>
            ))}
          </span>
        </span>
      </div>

      <div className="grid min-w-0 sm:grid-cols-2">
        <pre className="docs-code m-0 rounded-none border-0 p-5">
          {kod}
        </pre>
        <div className="docs-nokta-zemin flex min-w-0 items-center justify-center p-5">
          <div
            className="w-full max-w-80 overflow-hidden border border-line bg-shell"
            style={{ borderRadius: r(2), boxShadow: "4px 4px 0 var(--color-line)" }}
          >
            <div className="flex items-center gap-2.5 border-b border-div px-3.5 py-3">
              <span
                className="font-display grid size-7 flex-none place-items-center border-[1.5px] border-edge-strong text-small font-black"
                style={{ background: accent, color: onAccent, borderRadius: r(0) }}
              >
                M
              </span>
              <strong className="flex-1 text-body">{labels.title}</strong>
              <span className="tamga-chip" style={{ background: "var(--color-resolved-bg)", color: "var(--color-resolved)" }}>
                <span className="tamga-mark" style={{ background: "var(--color-resolved-mark)" }} />
                {labels.live}
              </span>
            </div>
            <div className="flex flex-col gap-3 p-3.5">
              <span className="flex flex-col gap-1.5">
                <span className="text-small font-bold">{labels.field}</span>
                <span
                  className="block border-[1.5px] border-edge-strong bg-shell px-2.5 py-2 font-mono text-small font-bold"
                  style={{ borderRadius: r(0), boxShadow: `3px 3px 0 ${accentYumusak}` }}
                >
                  249,90 ₺
                </span>
              </span>
              <span className="flex items-center gap-2.5">
                <button
                  type="button"
                  role="switch"
                  aria-checked={acik}
                  aria-label={labels.toggle}
                  onClick={() => setAcik((v) => !v)}
                  className="relative h-6 w-10.5 flex-none border-[1.5px] border-edge-strong"
                  style={{ background: acik ? accent : "var(--color-sunk)", borderRadius: r(-2, 3) }}
                >
                  <span
                    className="absolute top-0.5 size-4.5 border-[1.5px] border-edge-strong bg-shell transition-[left]"
                    style={{ left: acik ? 20 : 2, borderRadius: r(-4) }}
                  />
                </button>
                <span className="text-small font-semibold">{labels.toggle}</span>
              </span>
              <span className="flex justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  className="tamga-btn tamga-btn-sm"
                  style={{ borderRadius: r(0) }}
                >
                  {labels.cancel}
                </button>
                <button
                  type="button"
                  className="tamga-btn tamga-btn-sm"
                  style={{ background: accent, color: onAccent, borderRadius: r(0) }}
                >
                  {labels.save}
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function KatmanListesi({
  labels,
}: {
  labels: { names: [string, string, string]; who: [string, string, string] };
}) {
  const { accent } = useSecim();
  const satirlar = [
    { kod: `--color-brand-500: ${accent}`, dolu: true },
    { kod: "--color-accent: var(--color-brand-500)", dolu: false },
    { kod: ".tamga-btn-primary { background: var(--color-accent) }", dolu: false },
  ];
  return (
    <div className="flex flex-col">
      {satirlar.map((s, i) => (
        <div key={i} className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-4">
          <div className="flex flex-col items-center">
            <span
              className="font-display grid size-10 flex-none place-items-center rounded-(--radius-btn) border-[1.5px] border-edge-strong text-subhead font-black"
              style={
                s.dolu
                  ? { background: "var(--color-accent)", color: "var(--color-accent-ink)", boxShadow: "3px 3px 0 var(--color-edge-strong)" }
                  : { background: "var(--color-shell)", boxShadow: "3px 3px 0 var(--color-edge-strong)" }
              }
            >
              {"①②③"[i]}
            </span>
            {/* Kesik bağlayıcı: üç katman ayrı kutular değil bir ZİNCİR. */}
            {i < 2 ? <span className="my-1.5 min-h-3.5 flex-1 border-l-[1.5px] border-dashed border-line" /> : null}
          </div>
          <div className="flex min-w-0 flex-col gap-2 pt-2 pb-4.5">
            <span className="flex flex-wrap items-center gap-2.5">
              <strong className="text-body font-extrabold">{labels.names[i]}</strong>
              <span className="tamga-tag tamga-tag-outline">{labels.who[i]}</span>
            </span>
            <code className="docs-code block rounded-(--radius-ctl) px-3 py-2.5 whitespace-nowrap">
              {s.kod}
            </code>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ParityKartlari({ labels }: { labels: { ok: string; bad: string } }) {
  const { accent } = useSecim();
  const koyuAccent = mix(accent, BEYAZ, 0.75);
  const kartlar = [
    {
      baslik: labels.ok,
      icon: Success,
      renk: "var(--color-resolved)",
      kod: `:root { --color-accent: ${accent}; }\n.dark { --color-accent: ${koyuAccent}; }`,
      acikZemin: accent,
      koyuZemin: koyuAccent,
    },
    {
      baslik: labels.bad,
      icon: Failure,
      renk: "var(--color-critical)",
      kod: `:root { --color-accent: ${accent}; }\n/* .dark { … } ✗ */`,
      acikZemin: accent,
      /* Unutulan token koyu temada kitin VARSAYILANINA düşüyor · marka yarım.
         Değer kitin koyu temadaki `--color-accent`i. */
      koyuZemin: KIT_KOYU_ACCENT,
    },
  ];
  return (
    <div className="grid gap-3.5 sm:grid-cols-2">
      {kartlar.map((k) => (
        <div key={k.baslik} className="tamga-card flex flex-col overflow-hidden">
          <span className="tamga-head tamga-gutter tamga-section">
            <Icon icon={k.icon} size="sm" weight="fill" style={{ color: k.renk }} />
            <strong className="flex-1 text-small">{k.baslik}</strong>
          </span>
          <pre className="docs-code m-0 rounded-none border-0 px-3.5 py-3">
            {k.kod}
          </pre>
          <span className="flex h-8.5">
            <span className="docs-tema-acik grid flex-1 place-items-center border-t-[1.5px] border-r border-edge-strong">
              <span
                className="h-4.5 w-14 rounded-(--radius-mark) border-[1.5px] border-edge-strong"
                style={{ background: k.acikZemin }}
              />
            </span>
            <span className="docs-tema-koyu grid flex-1 place-items-center border-t-[1.5px] border-edge-strong">
              <span
                className="docs-tema-koyu-kenar h-4.5 w-14 rounded-(--radius-mark) border-[1.5px]"
                style={{ background: k.koyuZemin }}
              />
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function KontrastTablosu({
  labels,
}: {
  labels: {
    measure: string;
    rule: string;
    value: string;
    result: string;
    pass: string;
    fail: string;
    rows: [string, string, string, string];
  };
}) {
  const { accent, onAccent } = useSecim();
  const { ground, edge, rule } = useTemaRenkleri();

  const metin = contrast(accent, onAccent);
  const baglanti = contrast(accent, ground);
  const dKenar = deltaL(edge, ground);
  const dCizgi = deltaL(rule, ground);

  const satirlar = [
    { ad: labels.rows[0], kural: "≥ 4.5", deger: metin.toFixed(2), gecti: metin >= 4.5, bg: accent, fg: onAccent },
    { ad: labels.rows[1], kural: "≥ 4.5", deger: baglanti.toFixed(2), gecti: baglanti >= 4.5, bg: ground, fg: accent },
    { ad: labels.rows[2], kural: "ΔL* ≥ 10", deger: dKenar.toFixed(1), gecti: dKenar >= 10, bg: ground, fg: edge },
    { ad: labels.rows[3], kural: "ΔL* 4-16", deger: dCizgi.toFixed(1), gecti: dCizgi >= 4 && dCizgi <= 16, bg: ground, fg: rule },
  ];

  return (
    <div className="tamga-card overflow-x-auto">
      <div className="min-w-130">
        <div className="tamga-head tamga-gutter tamga-section grid grid-cols-[minmax(0,1.4fr)_110px_90px_80px] gap-3.5">
          {[labels.measure, labels.rule, labels.value, labels.result].map((b) => (
            <span key={b} className="tamga-label-section">
              {b}
            </span>
          ))}
        </div>
        {satirlar.map((s) => (
          <div
            key={s.ad}
            className="tamga-gutter grid grid-cols-[minmax(0,1.4fr)_110px_90px_80px] items-center gap-3.5 py-3"
            style={{ borderBottom: "1px dashed var(--color-line)" }}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              {/* ÖRNEK KUTU ÖLÇÜMÜN KENDİSİ: satırda yazan sayı, bu kutunun
                  okunup okunmadığının sayısı. */}
              <span
                aria-hidden
                className="grid h-5.5 w-8.5 flex-none place-items-center rounded-(--radius-mark) border-[1.5px] border-edge-strong text-caption font-extrabold"
                style={{ background: s.bg, color: s.fg }}
              >
                Aa
              </span>
              <span className="text-body">{s.ad}</span>
            </span>
            <code className="font-mono text-caption text-ink-faint">{s.kural}</code>
            <code className="font-mono text-small font-bold tabular-nums">{s.deger}</code>
            <span
              className="tamga-chip justify-self-start"
              style={
                s.gecti
                  ? { background: "var(--color-resolved-bg)", color: "var(--color-resolved)" }
                  : { background: "var(--color-critical-bg)", color: "var(--color-critical)" }
              }
            >
              <Icon icon={s.gecti ? Check : Close} size="xs" weight="bold" />
              {s.gecti ? labels.pass : labels.fail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
