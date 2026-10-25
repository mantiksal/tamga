"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useDismiss, useListKeys } from "./a11y.js";
import { buttonVariants } from "./button.js";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import { CaretDown, CaretRight, Check, Search } from "./icons.js";
import { Input } from "./input.js";
import type { Tone } from "./tone.js";
import { toneOf } from "./tone.js";

/**
 * SelectPanel · düğmeden açılan seçim paneli: başlık, isteğe bağlı arama,
 * seçenekler. Tetik bir DÜĞME, metin kutusu değil: `Combobox`un kutusu
 * "buraya yaz" diyordu ve bir seçim yapıldığı anlaşılmıyordu.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

export type SelectPanelOption = {
  value: string;
  label: string;
  /** A state's colour square before the label, as in `Select`. TR: Etiketin önünde durum karesi, `Select`teki gibi. */
  tone?: Tone;
  /** The quiet second text beside the label: "2-3 days". TR: Etiketin yanındaki sessiz ikinci metin: "2-3 gün". */
  hint?: string;
} & Record<string, unknown>;

type Ortak = {
  options: readonly SelectPanelOption[];
  /** The line at the top of the panel: "Choose a carrier". TR: Panelin üstündeki satır: "Kargo seçin". */
  title: string;
  /** The trigger's text when nothing is chosen. TR: Hiçbir şey seçili değilken tetiğin metni. */
  placeholder: string;
  /** The trigger's accessible name; the visible text is a value, not a name. TR: Tetiğin erişilebilir adı; görünen metin bir değer, ad değil. */
  "aria-label": string;
  /**
   * A search box under the title; focus lands there on open, the list filters as you type.
   * TR: Başlığın altında arama kutusu; açılınca odak orada, yazdıkça liste süzülür.
   */
  searchable?: boolean;
  /**
   * Single choice only: a first option named like this, worth the empty value. Chosen, the
   * value empties; while searching it stays at the top. The way back sits where the way in
   * was. TR: Yalnız tek seçimde: bu adla, boş değerli bir ilk seçenek. Seçilince değer boşalır;
   * ararken de başta kalır. Geri dönüş yolu gidiş yoluyla aynı yerde.
   */
  allLabel?: string;
  /** Text before the value in the trigger: "Status:". TR: Tetikte değerin önündeki metin: "Durum:". */
  prefix?: string;
  /** The caret at the trigger's end; off for a chip that carries its own remove button. TR: Tetiğin ucundaki ok; kendi kaldırma düğmesini taşıyan çipte kapalı. */
  caret?: boolean;
  /** The trigger's look, from `Button`. TR: Tetiğin görünümü, `Button`dan. */
  variant?: "secondary" | "soft" | "ghost";
  /** The trigger's size, from `Button`. TR: Tetiğin boyu, `Button`dan. */
  size?: "base" | "sm";
  /**
   * `button` an ordinary button (default). `field` a form box like `Select`: full width,
   * the same height and edge as the inputs beside it, for a labelled filter row. TR: `button`
   * sıradan bir düğme (varsayılan). `field` `Select` gibi bir form kutusu: tam genişlik,
   * yanındaki kutularla aynı boy ve kenar, etiketli bir filtre satırı için.
   */
  look?: "button" | "field";
  disabled?: boolean;
  labels: {
    /** Shown when the search matches nothing. TR: Arama hiçbir şeyle eşleşmeyince. */
    noMatch: string;
    /** The search box's name and placeholder; falls back to `title`. TR: Arama kutusunun adı ve yer tutucusu; yoksa `title`. */
    search?: string;
    /** Multiple only: the button under the list that empties the choice. TR: Yalnız çoklu: listenin altında seçimi boşaltan düğme. */
    clear?: string;
  };
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
};

export type SelectPanelProps = Ortak &
  (
    | { multiple?: false; value?: string; onChange: (next: string) => void }
    /* Çoklu seçimde tetik özet gösterir ("Atlas +2"), panel seçimde açık kalır. */
    | { multiple: true; value: readonly string[]; onChange: (next: string[]) => void }
  );

export function SelectPanel({
  options,
  title,
  placeholder,
  "aria-label": ariaLabel,
  searchable = false,
  allLabel,
  prefix,
  caret = true,
  variant = "secondary",
  size = "base",
  look = "button",
  disabled = false,
  labels,
  className,
  multiple,
  value,
  onChange,
  ...rest
}: SelectPanelProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [sorgu, setSorgu] = useState("");
  const tetik = useRef<HTMLButtonElement>(null);
  const liste = useRef<HTMLDivElement>(null);
  const arama = useRef<HTMLInputElement>(null);
  const kapat = useCallback(() => setOpen(false), []);
  const kutu = useDismiss(open, kapat);
  /* Klavyeyle kapanınca odak tetiğe döner: panel kaybolup odak gövdeye düşerse
     ekran okuyucu kullanıcısı nerede olduğunu kaybediyor. */
  const kapatOdakla = useCallback(() => {
    setOpen(false);
    tetik.current?.focus();
  }, []);
  useListKeys({ open, containerRef: kutu, onClose: kapatOdakla });

  useEffect(() => {
    if (!open) {
      setSorgu("");
      return;
    }
    if (searchable) arama.current?.focus();
    else (liste.current?.querySelector("[data-tamga-option]") as HTMLElement | null)?.focus();
  }, [open, searchable]);

  const secili: readonly string[] = multiple ? (value as readonly string[]) : value ? [value as string] : [];
  const seciliSecenekler = secili
    .map((v) => options.find((o) => o.value === v))
    .filter((o): o is SelectPanelOption => Boolean(o));
  const q = sorgu.trim().toLocaleLowerCase();
  const gorunen = q ? options.filter((o) => o.label.toLocaleLowerCase().includes(q)) : options;

  const sec = (v: string) => {
    if (multiple) {
      const simdiki = value as readonly string[];
      (onChange as (n: string[]) => void)(simdiki.includes(v) ? simdiki.filter((x) => x !== v) : [...simdiki, v]);
      return;
    }
    (onChange as (n: string) => void)(v);
    kapatOdakla();
  };

  const ozet =
    seciliSecenekler.length === 0
      ? null
      : multiple && seciliSecenekler.length > 1
        ? `${seciliSecenekler[0]!.label} +${seciliSecenekler.length - 1}`
        : seciliSecenekler[0]!.label;

  const secenek = (o: { value: string; label: string; tone?: Tone; hint?: string }, kanca: Record<string, unknown> = {}) => {
    const isaretli = secili.includes(o.value) || (o.value === "" && secili.length === 0);
    return (
      <button
        {...kanca}
        key={o.value || "*"}
        type="button"
        role="option"
        aria-selected={isaretli}
        data-tamga-option
        data-selected={isaretli}
        className="tamga-option"
        onClick={() => sec(o.value)}
      >
        {o.tone ? <span aria-hidden className="tamga-mark shrink-0" style={{ background: toneOf(o.tone).mark }} /> : null}
        <span className="min-w-0 flex-1 truncate">{o.label}</span>
        {o.hint ? <span className="shrink-0 text-small text-ink-faint">{o.hint}</span> : null}
        {isaretli ? <Icon icon={Check} size="xs" weight="bold" className="shrink-0 text-[var(--color-accent-line)]" /> : null}
      </button>
    );
  };

  return (
    <div {...dataProps(rest)} ref={kutu} className={cn("tamga-select-panel", look === "field" && "tamga-select-panel-alan", className)}>
      {/* Kutu görünümünde tetik `Select`in sınıfını giyiyor: aynı boy, aynı kenar;
          uzun değer kesilir, tamamı title'da. */}
      <button
        ref={tetik}
        type="button"
        className={cn(look === "field" ? "tamga-select" : buttonVariants({ variant, size }), "tamga-select-panel-tetik")}
        title={look === "field" && ozet ? ozet : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-liste` : undefined}
        aria-label={ariaLabel}
        data-set={ozet ? "true" : undefined}
        disabled={disabled || undefined}
        onClick={() => setOpen((o) => !o)}
      >
        {prefix ? <span className="tamga-select-panel-onek">{prefix}</span> : null}
        {/* Kutu görünümü `Select`le aynı dili konuşur: boş değer ("Tümü") mürekkep
            renginde, ok `Select`in döndürülmüş glifi. Düğme görünümünde yer tutucu soluk. */}
        {look === "field" ? (
          <span className="min-w-0 flex-1 truncate">{ozet ?? placeholder}</span>
        ) : (
          <span className={cn("min-w-0 truncate", ozet ? "" : "tamga-select-panel-bos")}>{ozet ?? placeholder}</span>
        )}
        {caret ? (
          look === "field" ? (
            <Icon icon={CaretRight} size="xs" className="shrink-0 rotate-90" />
          ) : (
            <Icon icon={CaretDown} size="xs" weight="bold" className="shrink-0" />
          )
        ) : null}
      </button>
      {open ? (
        <div className="tamga-overlay tamga-menu tamga-select-panel-kutu">
          <span className="tamga-menu-baslik">{title}</span>
          {searchable ? (
            <span className="tamga-select-panel-arama">
              <Icon icon={Search} size="xs" aria-hidden className="pointer-events-none absolute left-2.5 text-ink-faint" />
              <Input
                ref={arama}
                type="search"
                full
                leading
                size="sm"
                aria-label={labels.search ?? title}
                placeholder={labels.search ?? title}
                value={sorgu}
                onChange={(e) => setSorgu(e.target.value)}
              />
            </span>
          ) : null}
          <div
            ref={liste}
            id={`${id}-liste`}
            role="listbox"
            aria-label={title}
            aria-multiselectable={multiple || undefined}
            className="tamga-select-panel-liste"
          >
            {allLabel && !multiple ? secenek({ value: "", label: allLabel }) : null}
            {gorunen.map(({ value: v, label, tone, hint, ...kanca }) => secenek({ value: v, label, tone, hint }, kanca))}
            {gorunen.length === 0 ? <span className="tamga-select-panel-yok">{labels.noMatch}</span> : null}
          </div>
          {multiple && labels.clear ? (
            <span className="tamga-select-panel-alt">
              <button type="button" className="tamga-link" onClick={() => (onChange as (n: string[]) => void)([])}>
                {labels.clear}
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
