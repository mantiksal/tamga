"use client";

import type { ReactNode } from "react";
import { SkeletonPanel } from "../components/skeleton.js";
import {
  Busy,
  ErrorSlot,
  PlainLink,
  type ErrorLabels,
  type LinkComponent,
  type TemplateError,
} from "./shared.js";

/**
 * Ayarlar alanı: tek hub, çok bölüm, iki kapsam.
 *
 * Bölüm listesi dışarıdan; kapsam gösteriliyor, tahmin edilmiyor.
 * Gerekçe: docs/adr/0004-sablon-katmani.md
 */

export type SettingsState = "ready" | "loading" | "error";

/** Bir ayarın kime ait olduğu. */
export type SettingsScope = "personal" | "workspace" | "mixed";

export type SettingsSection = {
  key: string;
  label: string;
  href: string;
  scope: SettingsScope;
};

export type SettingsTemplateProps = {
  sections: readonly SettingsSection[];
  /** The section currently open, by `key`. TR: Şu an açık bölüm, `key` ile. */
  activeSection: string;
  title: string;
  subtitle?: string;
  /** Section-level actions; usually a single "Save". TR: Bölüm düzeyindeki eylemler; genelde tek bir "Kaydet". */
  actions?: ReactNode;
  state?: SettingsState;
  error?: TemplateError;
  linkComponent?: LinkComponent;
  labels: {
    loading: string;
    sections: string;
    scope: Record<SettingsScope, string>;
  } & ErrorLabels;
  children?: ReactNode;
};

export function SettingsTemplate({
  sections,
  activeSection,
  title,
  subtitle,
  actions,
  state = "ready",
  error,
  linkComponent: Link = PlainLink,
  labels,
  children,
}: SettingsTemplateProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 sm:flex-row" data-settings-state={state}>
      <nav aria-label={labels.sections} className="shrink-0 sm:w-64 sm:border-r sm:border-line">
        <ul className="flex flex-col py-4">
          {sections.map((section) => {
            const current = section.key === activeSection;
            return (
              <li key={section.key}>
                <Link
                  href={section.href}
                  data-section={section.key}
                  data-scope={section.scope}
                  data-active={current}
                  aria-current={current ? "page" : undefined}
                  className="tamga-list-row tamga-list-row-sm flex items-center gap-2"
                >
                  <span className="min-w-0 flex-1 truncate">{section.label}</span>
                  <ScopeMark scope={section.scope} label={labels.scope[section.scope]} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="tamga-gutter min-h-0 flex-1 py-4">
        <div className="flex flex-wrap items-start gap-4">
          <div className="min-w-0">
            <h2 className="text-title font-semibold text-ink">{title}</h2>
            {subtitle ? <p className="text-small text-ink-faint">{subtitle}</p> : null}
          </div>
          {actions ? (
            <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </div>

        {/* PANELLER ARASINDA BOŞLUK, ve bu bir süs değil bir düzeltme: her
            `SettingsPanel` bir kart, ve boşluksuz yığıldıklarında iki kartın
            kenarı yan yana gelip tek bir çift çizgi oluyordu — sekiz ayar tek
            bir uzun kutu gibi okunuyordu. Boşluğu ŞABLON veriyor, çünkü
            panellerin arası şablonun ritmi, çağıranın tercihi değil. */}
        <div className="mt-6 flex flex-col gap-4">
          {state === "loading" ? (
            <Busy label={labels.loading}>
              <SkeletonPanel lines={5} />
            </Busy>
          ) : null}
          {state === "error" ? <ErrorSlot error={error} labels={labels} /> : null}
          {state === "ready" ? children : null}
        </div>
      </div>
    </div>
  );
}

/**
 * Bu ayar kimin.
 *
 * Kelime değil NOKTA: alt gezinme sekiz satırlık bir liste, ve sekiz kez
 * tekrarlanan bir kelime gürültü olurken taranabilir de olmuyor. Ad, `title` ve
 * erişilebilir etikette duruyor: istendiğinde var, sürekli bağırmıyor.
 */
function ScopeMark({ scope, label }: { scope: SettingsScope; label: string }) {
  return (
    <span
      title={label}
      aria-label={label}
      data-scope-mark={scope}
      className={
        scope === "workspace"
          ? "size-1.5 shrink-0 rounded-full bg-ink-faint"
          : scope === "mixed"
            ? "size-1.5 shrink-0 rounded-full bg-warning"
            : "size-1.5 shrink-0 rounded-full bg-transparent"
      }
    />
  );
}

/**
 * Değerinin nereden geldiğini söyleyen ayar paneli.
 *
 * Bir değer üst bir düzeyden miras alınıyorsa, bunu bilmeden değiştirmek üç
 * ekran açıp "bu alan neden böyle yazıyor" diye aramak demek.
 */
export function SettingsPanel({
  title,
  description,
  inheritedFrom,
  children,
}: {
  title: string;
  description?: string;
  /** Like "inherited from the workspace": a full sentence written by the caller. TR: "çalışma alanından geliyor" gibi, çağıran tarafından yazılmış tam cümle. */
  inheritedFrom?: string;
  children: ReactNode;
}) {
  return (
    /* `tamga-card-open`: panel KIRPMIYOR. `.tamga-card`ın `overflow: hidden`ı
       kartın kenarına yakın duran her yükselen kontrolün 2px sert kaydırmasını
       kesiyordu — seçili bir segment ya da bir renk kutusu kenardan eksik
       görünüyor, hover'da 3px'e çıkınca daha da eksiliyordu. Bir ayar panelinin
       içinde tablo yok, yani kırpmaya ihtiyacı da yok. */
    <section className="tamga-card tamga-card-open tamga-gutter py-4" data-panel={title}>
      {/* BAŞLIK BİR BASAMAK BÜYÜK. `text-body` idi ve panelin gövde metniyle
          aynı boydaydı: bir ayar bloğunun başlığı, altındaki açıklamadan
          ayrılmıyordu. Açıklama da `text-caption`tan `text-small`a çıktı —
          okunacak bir cümle, bir dipnot değil. */}
      <div className="flex flex-wrap items-baseline gap-2">
        <h3 className="text-subhead font-semibold text-ink">{title}</h3>
        {inheritedFrom ? (
          <span className="text-caption text-ink-faint" data-inherited-from>
            {inheritedFrom}
          </span>
        ) : null}
      </div>
      {description ? (
        <p className="mt-1 text-small leading-relaxed text-ink-soft">{description}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
