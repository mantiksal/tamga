"use client";

import { useState } from "react";
import { Icon, Input, Switch, toneOf } from "tamga-ui";
import { Check, Close, Terminal } from "tamga-ui/icons";

/**
 * Tipografi sayfasının canlı yarısı.
 *
 * PİKSEL DEĞERİ GÖSTERİLMİYOR: kademelerin tam listesi ve değerleri Token'lar
 * sayfasında, kaynaktan üretiliyor. Burada token'ın ADI ve İŞİ var, örnek de
 * gerçekten o kademede diziliyor.
 */

const YESIL = toneOf("positive");
const KIRMIZI = toneOf("danger");

/**
 * On kademe · token adı, yüz ve ağırlık.
 *
 * Ölçüler `var()` ile okunuyor, kopyalanmış piksel değeriyle değil: bir kademe
 * `theme.css`te değişirse bu satır da değişiyor, yani demo yalan söyleyemiyor.
 */
const KADEMELER = [
  ["--text-micro", "sans", 400, true],
  ["--text-caption", "mono", 700, false],
  ["--text-small", "sans", 400, true],
  ["--text-body", "sans", 400, false],
  ["--text-control", "sans", 500, false],
  ["--text-subhead", "sans", 700, false],
  ["--text-title", "display", 800, false],
  ["--text-display-sm", "display", 800, false],
  ["--text-display", "display", 900, false],
  ["--text-display-lg", "display", 900, false],
] as const;

const YUZ = {
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
  display: "var(--font-display)",
} as const;

export function SkalaOrnegi({
  labels,
}: {
  labels: { roles: readonly string[]; samples: readonly string[] };
}) {
  /* Varsayılan seçili `--text-body`: skalanın orta noktası değil, kitin
     VARSAYILANI · bir skala hangi kademenin öntanımlı olduğunu söylemeden
     okunmuyor. */
  const [secili, setSecili] = useState(3);
  return (
    <div className="docs-tip-skala">
      {KADEMELER.map(([token, yuz, agirlik, solgun], i) => (
        <button
          key={token}
          type="button"
          aria-pressed={i === secili}
          data-secili={i === secili || undefined}
          className="docs-tip-satir"
          onClick={() => setSecili(i)}
        >
          <span className="flex min-w-0 flex-col gap-0.5">
            <code className="font-mono text-caption font-bold">{token}</code>
            <span className="docs-tip-rol">{labels.roles[i]}</span>
          </span>
          <span
            className="docs-tip-ornek"
            style={{
              fontFamily: YUZ[yuz],
              fontSize: `var(${token})`,
              fontWeight: agirlik,
              color: solgun ? "var(--color-ink-faint)" : "var(--color-ink)",
              /* Görüntü kademeleri sayı taşıyor, ve bir KPI sütunda okunuyor. */
              fontVariantNumeric: i >= 7 ? "tabular-nums" : "normal",
            }}
          >
            {labels.samples[i]}
          </span>
        </button>
      ))}
    </div>
  );
}

const YUZLER = [
  { token: "--font-display", yuz: YUZ.display, buyuk: 900, ornek: 800, sikisik: true },
  { token: "--font-sans", yuz: YUZ.sans, buyuk: 600, ornek: 400, sikisik: false },
  { token: "--font-mono", yuz: YUZ.mono, buyuk: 700, ornek: 500, sikisik: false },
] as const;

export function YuzOrnegi({
  labels,
}: {
  labels: { faces: readonly (readonly [string, string, string])[]; letters: string };
}) {
  return (
    <div className="docs-tip-uclu">
      {YUZLER.map((f, i) => {
        const [ad, is, ornek] = labels.faces[i] ?? ["", "", ""];
        return (
          <div key={f.token} className="docs-tip-yuz">
            <div className="flex items-baseline justify-between gap-2">
              <span
                className="docs-tip-aa"
                style={{
                  fontFamily: f.yuz,
                  fontWeight: f.buyuk,
                  /* Red Hat 900'de kendi genişliğinden fazlasını alıyor; iki
                     harf yan yana ancak sıkıştırılınca bir ÖRNEK gibi duruyor. */
                  letterSpacing: f.sikisik ? "-0.03em" : undefined,
                }}
              >
                Aa
              </span>
              <code className="font-mono text-caption text-ink-faint">{f.token}</code>
            </div>
            <span className="flex flex-col gap-0.5">
              <strong className="docs-tip-ad">{ad}</strong>
              <span className="docs-tip-is">{is}</span>
            </span>
            <span
              className="docs-tip-cumle"
              style={{ fontFamily: f.yuz, fontWeight: f.ornek }}
            >
              {ornek}
            </span>
            {/* LATIN-EXT'İN YÜKLENDİĞİNİN KANITI: bu satırdaki harflerin her
                biri ikinci dosyadan geliyor, ve bir tanesi bile yedek yüze
                düşse üç kart yan yana bunu ele veriyor. */}
            <span className="docs-tip-harfler" style={{ fontFamily: f.yuz }}>
              {labels.letters}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function RakamOrnegi({
  labels,
}: {
  labels: { tabular: string; numLabels: readonly string[]; nums: readonly string[] };
}) {
  const [hizali, setHizali] = useState(false);
  const satirlar = labels.numLabels.map((ad, i) => [ad, labels.nums[i]] as const);
  return (
    <div className="flex w-full flex-col gap-3.5">
      {/* Kodun kendisi anahtarın etiketi: açılan şeyin ADI değil DEKLARASYONU
          gösteriliyor, çünkü okuyanın kopyalayacağı şey o. */}
      <span className="flex flex-wrap items-center gap-3">
        <Switch on={hizali} onChange={setHizali} label={labels.tabular} />
        <code className="font-mono text-caption">font-variant-numeric: tabular-nums</code>
      </span>
      <div className="docs-tip-ikili">
        {/* SOLDAKİ ANAHTARA BAĞLI, SAĞDAKİ DEĞİL: mono sütun zaten hizalı, ve
            karşılaştırmanın bütün konusu bu · bir sütun ya token'ı istiyor ya
            da mono yüzle yazılıyor. */}
        <div className="docs-tip-tablo">
          <div className="docs-tip-tablo-bas">Onest</div>
          {satirlar.map(([ad, v]) => (
            <div key={ad} className="docs-tip-tablo-satir">
              <span className="text-ink-faint">{ad}</span>
              <span
                className="font-bold"
                style={{ fontVariantNumeric: hizali ? "tabular-nums" : "proportional-nums" }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
        <div className="docs-tip-tablo">
          <div className="docs-tip-tablo-bas">JetBrains Mono</div>
          {satirlar.map(([ad, v]) => (
            <div key={ad} className="docs-tip-tablo-satir">
              <span className="text-ink-faint">{ad}</span>
              <span className="font-mono font-bold">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BuyukHarfOrnegi({
  labels,
}: {
  labels: { input: string; word: string; right: string; wrong: string; asWritten: string };
}) {
  const [kelime, setKelime] = useState(labels.word);
  return (
    <div className="flex w-full flex-col gap-3.5">
      <label className="flex max-w-80 flex-col gap-1.5">
        <span className="text-small font-bold">{labels.input}</span>
        <Input
          full
          value={kelime}
          onChange={(e) => setKelime(e.target.value.slice(0, 24))}
          className="font-mono font-bold"
        />
      </label>
      <div className="docs-tip-ikili">
        <div className="docs-ol-kutu">
          <span className="docs-tip-yargi" style={{ color: KIRMIZI.fg }}>
            <Icon icon={Close} size="xs" weight="bold" />
            {labels.wrong}
          </span>
          <code className="font-mono text-caption text-ink-faint">
            lang=&quot;tr&quot; · text-transform: uppercase
          </code>
          {/* DEMO TARAYICININ KENDİ DAVRANIŞINI KULLANIYOR, taklit etmiyor:
              `lang="tr"` altında `uppercase` "limit"i LİMİT diye basıyor ve
              gösterilmek istenen şey tam olarak bu. */}
          <span lang="tr" className="docs-tip-buyuk docs-tip-donusen">
            {kelime}
          </span>
        </div>
        <div className="docs-ol-kutu">
          <span className="docs-tip-yargi" style={{ color: YESIL.fg }}>
            <Icon icon={Check} size="xs" weight="bold" />
            {labels.right}
          </span>
          <code className="font-mono text-caption text-ink-faint">{labels.asWritten}</code>
          {/* Yerelden BAĞIMSIZ büyük harf: dönüşüm tarayıcıya değil yazana ait
              olduğunda i her zaman I oluyor. */}
          <span className="docs-tip-buyuk">{kelime.toLocaleUpperCase("en")}</span>
        </div>
      </div>
    </div>
  );
}

export function KapiOrnegi({
  labels,
}: {
  labels: { gateTitle: string; gate: readonly (readonly [string, string, string])[] };
}) {
  return (
    <div className="docs-ol-kapi">
      <div className="docs-ol-kapi-bar">
        <Icon icon={Terminal} size="sm" weight="bold" />
        {labels.gateTitle}
      </div>
      {labels.gate.map(([isaret, nerede, mesaj]) => (
        <div key={nerede} className="docs-ol-kapi-satir">
          <span data-gecti={isaret === "✓" || undefined}>{isaret}</span>
          <span>
            <span className="docs-ol-kapi-yer">{nerede}</span> {mesaj}
          </span>
        </div>
      ))}
    </div>
  );
}
