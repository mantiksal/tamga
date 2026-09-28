"use client";

import { useState, type ReactNode } from "react";
import { luminance } from "../lib/color.js";
import { makePalette } from "../lib/palette.js";
import { ColorSwatches, ImageField, RailCards, ThemeCards, type SwatchOption, type ThemeChoice } from "../components/appearance.js";
import { LogoTile } from "../components/chrome.js";
import { SquarePicker } from "../components/square-picker.js";
import { Button } from "../components/button.js";
import { Icon } from "../components/icon.js";
import { CloudCheck } from "../components/icons.js";
import { Label } from "../components/surface.js";
import { PageBand } from "../components/layout.js";

/**
 * The Appearance screen: logo, mark, brand colour, theme, sidebar. It stores
 * nothing and it does not apply the palette either; both are the product's
 * call, because the product owns the root element.
 *
 * Gerekçe: docs/gerekce/08-blok-ve-sablon.md
 */

export type Appearance = {
  brand: string;
  theme: ThemeChoice;
  /** `free` means each user decides. TR: `free`, her kullanıcı kendi seçer demek. */
  rail: "narrow" | "wide" | "free";
  logo: string | null;
  mark: string | null;
};

export type AppearanceLabels = {
  title: string;
  description: string;
  logo: { title: string; description: string; field: ImageLabels; pickMark: string };
  mark: { title: string; description: string; field: ImageLabels; fallbackNote: string };
  brand: {
    title: string;
    description: string;
    swatches: readonly SwatchOption[];
    custom: string;
    /** What the chosen colour is called when it is not one of the swatches. TR: Seçilen renk hazırlardan biri değilken taşıdığı ad. */
    customName: string;
    /** The word above the sample, like "Preview". TR: Örneğin üstündeki kelime, "Önizleme" gibi. */
    preview: string;
    /** Text on the sample button, like "New product". TR: Örnek düğmenin üstündeki yazı, "Yeni ürün" gibi. */
    previewAction: string;
    /** Shown when the chosen colour is light enough that its ink turns dark. TR: Seçilen renk, üstündeki yazıyı koyulaştıracak kadar açık olduğunda görünüyor. */
    lightNote: string;
  };
  theme: {
    title: string;
    description: string;
    light: string;
    dark: string;
    system: string;
    group: string;
    lightNote?: string;
    darkNote?: string;
    systemNote?: string;
  };
  rail: {
    title: string;
    description: string;
    narrow: string;
    wide: string;
    free: string;
    group: string;
    narrowNote?: string;
    wideNote?: string;
    freeNote?: string;
  };
  picker: { title: string; hint: string; size: string; cancel: string; confirm: string; close: string };
  /** A line above the title saying whose setting this is. TR: Başlığın üstünde, bu ayarın kimin olduğunu söyleyen satır. */
  eyebrow?: string;
  save: string;
  saving: string;
  reset: string;
  clean: string;
  dirty: string;
};

type ImageLabels = {
  name: string;
  upload: string;
  replace: string;
  remove: string;
  empty: string;
  errorType: string;
  errorSize: string;
  errorUnreadable: string;
};

export function AppearanceTemplate({
  value,
  onChange,
  saved,
  onSave,
  onReset,
  saving = false,
  fallbackName,
  labels,
  extra,
}: {
  value: Appearance;
  onChange: (next: Appearance) => void;
  /** The stored version; "is anything unsaved" is answered by comparing with it. TR: Kayıtlı hâli; "kaydedilmemiş bir şey var mı" sorusu bununla cevaplanıyor. */
  saved: Appearance;
  onSave: () => void;
  onReset: () => void;
  saving?: boolean;
  /** The name a tile is drawn from when there is no mark. TR: Amblem yokken karonun çizildiği ad. */
  fallbackName: string;
  labels: AppearanceLabels;
  /** Extra panels the product adds, after the built-in ones. TR: Ürünün eklediği ek bölümler, hazır olanlardan sonra. */
  extra?: ReactNode;
}) {
  const [picking, setPicking] = useState(false);
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);
  const preset = labels.brand.swatches.find(
    (o) => o.hex.toLowerCase() === value.brand.toLowerCase(),
  );

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (dirty && !saving) onSave();
      }}
    >
      {/* BAŞLIK ŞERİDİ, elle çizilmiş bir `h1` değil · ve bir süre öyleydi.
          "Varsayılana dön" ekranın dibinde, "Kaydet"in yanında duruyordu ve
          orada yanlış komşuluktaydı: biri bu oturumdaki değişikliği yazıyor,
          öteki her şeyi siliyor. Şeridin eylem yuvası ikisini ayırıyor. */}
      <PageBand
        eyebrow={labels.eyebrow}
        title={labels.title}
        subtitle={labels.description}
        actions={
          <Button type="button" disabled={saving} onClick={onReset}>
            {labels.reset}
          </Button>
        }
      />

      <div className="tamga-appearance">
        {/* LOGO VE AMBLEM ÖNCE. Bir marka ekranında ilk sorulan şey renk değil
            işaret; renk işaretin yanında seçiliyor. */}
        <Bolum title={labels.logo.title} description={labels.logo.description}>
          <ImageField
            value={value.logo}
            onChange={(v) => onChange({ ...value, logo: v })}
            maxEdge={512}
            labels={labels.logo.field}
            preview={(src) => (
              /* eslint-disable-next-line @next/next/no-img-element -- data URI olabilir */
              <img src={src} alt="" className="max-h-full w-auto max-w-56 object-contain" />
            )}
            extra={
              value.logo ? (
                <Button type="button" onClick={() => setPicking(true)}>
                  {labels.logo.pickMark}
                </Button>
              ) : undefined
            }
          />
        </Bolum>

        <Bolum title={labels.mark.title} description={labels.mark.description}>
          <ImageField
            value={value.mark}
            onChange={(v) => onChange({ ...value, mark: v })}
            maxEdge={256}
            labels={labels.mark.field}
            preview={(src) => (
              /* eslint-disable-next-line @next/next/no-img-element -- data URI olabilir */
              <img src={src} alt="" className="size-12 object-contain" />
            )}
          />
          {/* AMBLEM YOKKEN NE GÖRÜNDÜĞÜ GÖSTERİLİYOR: "baş harf kullanılır"
              demek ile onu göstermek aynı şey değil, ve kullanıcı amblem
              yüklemeye değip değmeyeceğine bakarak karar veriyor. */}
          {!value.mark ? (
            <span className="mt-4 flex items-center gap-3">
              <LogoTile name={fallbackName} />
              <Label>{labels.mark.fallbackNote}</Label>
            </span>
          ) : null}
        </Bolum>

        <Bolum title={labels.brand.title} description={labels.brand.description}>
          <div className="flex flex-col gap-4">
            <ColorSwatches
              options={labels.brand.swatches}
              value={value.brand}
              onChange={(hex) => onChange({ ...value, brand: hex })}
              customLabel={labels.brand.custom}
            />
            {/* RENGİN KÜNYESİ VE ÖRNEĞİ. Yedi kutu "hangisi seçili"yi
                söylüyor ama seçilenin ADINI ve KODUNU söylemiyor, ve bir
                marka rengi çoğu zaman bir koda göre seçiliyor. Örnek de
                bunun için: dolu bir düğme, rengin gerçekte nerede
                görüneceğini kutudan daha iyi anlatıyor. */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 text-small font-bold text-ink">
                {preset ? preset.label : labels.brand.customName}
                <span className="tamga-chip tamga-chip-mono uppercase">{value.brand}</span>
              </span>
              <span className="ml-auto flex items-center gap-3">
                <Label>{labels.brand.preview}</Label>
                <span className="tamga-btn tamga-btn-primary tamga-btn-sm" aria-hidden>
                  {labels.brand.previewAction}
                </span>
              </span>
            </div>
            {ACIK(value.brand) ? <Label>{labels.brand.lightNote}</Label> : null}
          </div>
        </Bolum>

        <Bolum title={labels.theme.title} description={labels.theme.description}>
          <ThemeCards
            value={value.theme}
            onChange={(t) => onChange({ ...value, theme: t })}
            labels={labels.theme}
          />
        </Bolum>

        <Bolum title={labels.rail.title} description={labels.rail.description}>
          <RailCards
            value={value.rail}
            onChange={(r) => onChange({ ...value, rail: r })}
            labels={labels.rail}
          />
        </Bolum>

        {extra}
      </div>

      {value.logo ? (
        <SquarePicker
          open={picking}
          source={value.logo}
          onClose={() => setPicking(false)}
          onPick={(square) => onChange({ ...value, mark: square })}
          labels={labels.picker}
        />
      ) : null}

      {/* KAYDET SOLDA, DURUM SAĞDA · ve durum bir BULUT işareti taşıyor:
          "kaydedilmemiş değişiklik var" cümlesi tek başına okunmuyordu,
          çünkü yanında okunacak iki düğme duruyor. */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" type="submit" disabled={!dirty} busy={saving} busyLabel={labels.saving}>
          {labels.save}
        </Button>
        <span className="ml-auto flex items-center gap-2">
          <Icon icon={CloudCheck} size="sm" className="text-ink-faint" />
          <Label>{dirty ? labels.dirty : labels.clean}</Label>
        </span>
      </div>
    </form>
  );
}

/**
 * Tek kartın içindeki bir satır: solda ne olduğu, sağda kontrolü.
 *
 * `SettingsPanel` DEĞİL, ve beş bölüm bir süre onunla çiziliyordu. O bir
 * KART, ve beş kart yan yana dizildiğinde ekran beş ayrı konu gibi okunuyor;
 * oysa beşi de tek bir konunun parçası. Ayıran şey artık bir kesik çizgi.
 */
function Bolum({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="tamga-appearance-row" data-panel={title}>
      <div className="tamga-appearance-head">
        <strong className="text-body font-bold text-ink">{title}</strong>
        <span className="text-small leading-relaxed text-ink-soft">{description}</span>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/**
 * Seçilen rengin üstündeki yazı koyuya mı dönüyor.
 *
 * Soru "renk açık mı" değil: cevabı veren şey paletin o renk için seçtiği
 * MÜREKKEP, ve `ColorSwatches` de kutunun çentiğini aynı yerden alıyor. İki
 * ayrı eşik yazılsaydı biri koyu çentik çizerken öteki "renk açık" demiyor
 * olabilirdi.
 */
function ACIK(hex: string): boolean {
  return luminance(makePalette(hex).light.accentInk) < 0.4;
}
