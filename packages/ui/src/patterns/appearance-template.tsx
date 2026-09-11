"use client";

import { useState, type ReactNode } from "react";
import { ColorSwatches, ImageField, ThemeCards, type SwatchOption, type ThemeChoice } from "../components/appearance.js";
import { LogoTile } from "../components/chrome.js";
import { Segmented } from "../components/segmented.js";
import { SquarePicker } from "../components/square-picker.js";
import { Button } from "../components/button.js";
import { Label } from "../components/surface.js";
import { SettingsPanel } from "./settings-template.js";

/**
 * The Appearance screen: logo, mark, brand colour, theme, sidebar.
 *
 * WHY A WHOLE SCREEN AND NOT FIVE PARTS. Every panel grows an appearance
 * setting, and the kit not giving one is why two products drew their own hex
 * box. Handing over the parts would not have fixed it: each product arranges
 * them differently and they drift apart again, which is the thing this layer
 * exists to prevent (ADR-0004).
 *
 * IT STORES NOTHING. `value` comes in, `onChange` goes out, `onSave` belongs
 * to the caller. Where the preference lives (session, account, browser) is a
 * product decision and a template that learns it stops being a template.
 *
 * THE PALETTE IS NOT APPLIED HERE EITHER. This screen reports the chosen
 * colour; turning it into tokens is `makePalette` plus `paletteVars`, and the
 * product decides when that happens, because the product owns the root
 * element.
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
  brand: { title: string; description: string; swatches: readonly SwatchOption[]; custom: string };
  theme: { title: string; description: string; light: string; dark: string; system: string; group: string };
  rail: { title: string; description: string; narrow: string; wide: string; free: string; group: string };
  picker: { title: string; hint: string; size: string; cancel: string; confirm: string; close: string };
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

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (dirty && !saving) onSave();
      }}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-ink">{labels.title}</h1>
        <p className="w-full text-control leading-relaxed text-ink-soft">{labels.description}</p>
      </div>

      {/* LOGO VE AMBLEM ÖNCE. Bir marka ekranında ilk sorulan şey renk değil
          işaret; renk işaretin yanında seçiliyor. */}
      <SettingsPanel accent title={labels.logo.title} description={labels.logo.description}>
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
      </SettingsPanel>

      <SettingsPanel accent title={labels.mark.title} description={labels.mark.description}>
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
      </SettingsPanel>

      <SettingsPanel accent title={labels.brand.title} description={labels.brand.description}>
        <ColorSwatches
          options={labels.brand.swatches}
          value={value.brand}
          onChange={(hex) => onChange({ ...value, brand: hex })}
          customLabel={labels.brand.custom}
        />
      </SettingsPanel>

      <SettingsPanel accent title={labels.theme.title} description={labels.theme.description}>
        <ThemeCards
          value={value.theme}
          onChange={(t) => onChange({ ...value, theme: t })}
          labels={labels.theme}
        />
      </SettingsPanel>

      <SettingsPanel accent title={labels.rail.title} description={labels.rail.description}>
        <Segmented
          label={labels.rail.group}
          value={value.rail}
          onChange={(r) => onChange({ ...value, rail: r })}
          options={[
            { value: "narrow" as const, label: labels.rail.narrow },
            { value: "wide" as const, label: labels.rail.wide },
            { value: "free" as const, label: labels.rail.free },
          ]}
        />
      </SettingsPanel>

      {extra}

      {value.logo ? (
        <SquarePicker
          open={picking}
          source={value.logo}
          onClose={() => setPicking(false)}
          onPick={(square) => onChange({ ...value, mark: square })}
          labels={labels.picker}
        />
      ) : null}

      {/* KAYDET SOLDA, DURUM SAĞDA. İki düğme bir kümedir ve kümenin yanında
          duran bir cümle onları böler. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex flex-wrap items-center gap-3">
          <Button variant="primary" type="submit" disabled={!dirty} busy={saving} busyLabel={labels.saving}>
            {labels.save}
          </Button>
          <Button type="button" disabled={saving} onClick={onReset}>
            {labels.reset}
          </Button>
        </span>
        <Label>{dirty ? labels.dirty : labels.clean}</Label>
      </div>
    </form>
  );
}
