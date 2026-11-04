"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { useFixedPanel } from "../lib/fixed-panel.js";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import { Kbd } from "./display.js";
import { CaretDown, Close, Search } from "./icons.js";
import { Spinner } from "./spinner.js";
import { toneOf, type Tone } from "./tone.js";

/**
 * Combobox — aranabilir seçim.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

export type ComboOption<T extends string> = {
  value: T;
  label: string;
  /** Etiketin altındaki ikinci satır: SKU, e-posta, kategori. */
  hint?: string;
  /**
   * The heading of the group this option belongs to; options of one group come together, and a
   * heading is drawn where the group changes. TR: Seçeneğin ait olduğu grubun başlığı; bir grubun
   * seçenekleri art arda gelir, grup değiştiği yerde başlık çizilir.
   */
  group?: string;
  /**
   * A square before the label, for an option that IS a state (the same `tamga-mark` as `Select`'s).
   * TR: Seçenek bir DURUMSA etiketin önünde kare (`Select`'tekiyle aynı `tamga-mark`).
   */
  tone?: Tone;
  /**
   * A picture before the label, the option's own mark (an `<img>` of a logo, a kit `Icon`), as on
   * `Select`. The chosen option's picture takes the search glyph's place while nothing is typed.
   * TR: Etiketin önünde seçeneğin kendi işareti (bir logonun `<img>`'i, kitin bir `Icon`'u),
   * `Select`'teki gibi. Seçilinin görseli, bir şey yazılmazken arama glifinin yerine geçiyor.
   */
  media?: ReactNode;
} & Record<string, unknown>;

/**
 * Eşleşen harfleri kalınlaştırır.
 *
 * ARAMA SONUCU NEDEN EŞLEŞTİĞİNİ SÖYLEMELİ: elli ilin arasından dördü
 * kaldığında okuyucu "neden bunlar" diye soruyor, cevabı harflerin kendisi.
 * Karşılaştırma Türkçe küçük harfe göre, yoksa "İ" ile "i" eşleşmiyor.
 */
function vurgula(metin: string, q: string) {
  const arama = q.trim();
  if (!arama) return metin;
  const i = metin.toLocaleLowerCase("tr").indexOf(arama.toLocaleLowerCase("tr"));
  if (i < 0) return metin;
  return (
    <>
      {metin.slice(0, i)}
      <b className="font-bold text-ink">{metin.slice(i, i + arama.length)}</b>
      {metin.slice(i + arama.length)}
    </>
  );
}

export function Combobox<T extends string>({
  options,
  value,
  onChange,
  onSearch,
  placeholder,
  labels,
  disabled = false,
  invalid = false,
  clearable = true,
  look = "select",
  shortcut,
  footer,
  header,
  empty,
  loading = false,
  minQuery = 0,
  "aria-label": ariaLabel,
  className,
  ...rest
}: {
  options: readonly ComboOption<T>[];
  value?: T;
  onChange?: (next: T | undefined) => void;
  /**
   * Given, filtering happens ON THE SERVER; the kit shows the list it receives as it is. TR:
   * Verilirse süzme SUNUCUDA yapılır; kit gelen listeyi olduğu gibi gösterir.
   */
  onSearch?: (query: string) => void;
  placeholder: string;
  labels: {
    empty: string;
    clear: string;
    open: string;
    /** Shown while `loading` instead of `empty`. TR: `loading` sürerken `empty` yerine. */
    loading?: string;
    /** Shown below `minQuery` instead of `empty`. TR: `minQuery`nin altında `empty` yerine. */
    short?: string;
    /**
     * What a screen reader hears when the list changes: "3 results". TR: Liste değişince ekran
     * okuyucunun duyduğu: "3 sonuç".
     */
    count?: (n: number) => string;
  };
  disabled?: boolean;
  invalid?: boolean;
  /**
   * Whether the choice can be emptied. `false` for a field that always holds a value (a time zone,
   * a country): an × that does nothing when pressed is a broken promise. TR: Seçim boşaltılabilir
   * mi. Her zaman bir değeri olan alan için `false` (saat dilimi, ülke): basınca bir şey yapmayan
   * bir × tutulmayan bir söz.
   */
  clearable?: boolean;
  /**
   * `search` is a box to type into and go, not a field that keeps a choice: no caret (a caret
   * says "pick from a list"), the list opens only once something is typed, and a pick does not
   * stay in the box. TR: `search` yazıp gidilen bir kutu, seçim tutan bir alan değil: ok yok
   * (ok "listeden seç" der), liste ancak bir şey yazılınca açılır ve seçilen kutuda kalmaz.
   */
  look?: "select" | "search";
  /**
   * A letter that, with ⌘ (Ctrl off a Mac), focuses the box from anywhere on the page; drawn in
   * the box as a key. For the ONE search of a page: two boxes bound to one key fight. TR: ⌘ (Mac
   * dışında Ctrl) ile sayfanın her yerinden kutuya odaklanan harf; kutuda tuş olarak çiziliyor.
   * Sayfanın TEK araması için: aynı tuşa bağlı iki kutu çakışır.
   */
  shortcut?: string;
  /**
   * A line under the list, inside the panel: a way to widen or narrow what is searched. TR:
   * Listenin altında, panelin içinde bir satır: aranan yeri genişletmenin ya da daraltmanın yolu.
   */
  footer?: ReactNode;
  /**
   * A line over the list, inside the panel: where this search looks ("In Acme"). A scope only in
   * the footer is missed. TR: Listenin üstünde, panelin içinde bir satır: aramanın nereye baktığı
   * ("Acme içinde"). Yalnız dipte duran kapsam gözden kaçıyor.
   */
  header?: ReactNode;
  /**
   * What stands where no option is, instead of `labels.empty`: a way forward ("Search everywhere")
   * rather than a dead end. TR: Seçenek yokken `labels.empty` yerine duran şey: bir çıkmaz yerine
   * ileri bir yol ("Her yerde ara").
   */
  empty?: ReactNode;
  /**
   * The answer to the current query is still coming: the list says so instead of "no results",
   * which would be a false answer. TR: Şu anki sorgunun cevabı henüz geliyor: liste "sonuç yok"
   * yerine bunu söyler; öteki yanlış bir cevap olurdu.
   */
  loading?: boolean;
  /**
   * Below this many characters nothing is searched, and the list says `labels.short`, not
   * `labels.empty`. TR: Bu kadar harfin altında arama yapılmaz; liste `labels.empty` değil
   * `labels.short` der.
   */
  minQuery?: number;
  /** The box's accessible name when no visible label is bound to it. TR: Bağlı görünür bir etiket yoksa kutunun erişilebilir adı. */
  "aria-label"?: string;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const liste = useRef<HTMLDivElement>(null);
  const girdi = useRef<HTMLInputElement>(null);
  const arama = look === "search";
  /* Aramada liste ancak bir şey yazılınca açılıyor: boş bir kutuya odaklanmak "sonuç yok" demez. */
  const acik = open && (!arama || query.trim() !== "");
  const yer = useFixedPanel(acik, box, liste);

  const selected = arama ? undefined : options.find((o) => o.value === value);
  const [mac, setMac] = useState(true);
  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);
  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcut.toLowerCase()) {
        e.preventDefault();
        girdi.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shortcut]);

  const shown = useMemo(() => {
    if (onSearch || query.trim() === "") return options;
    const q = query.trim().toLocaleLowerCase();
    return options.filter(
      (o) => o.label.toLocaleLowerCase().includes(q) || o.hint?.toLocaleLowerCase().includes(q),
    );
  }, [options, query, onSearch]);

  /* Dışarı tıklamak kapatır — bir combobox karar istemez, bilgi verir. */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => setActive(0), [query, open]);

  const kisa = query.trim().length < minQuery;
  /* Durum satırı: kısa sorgu, yükleniyor ya da boş. Sonuç varken yüklenmek listeyi silmez. */
  const durum =
    shown.length > 0 && !kisa
      ? null
      : kisa && labels.short
        ? "short"
        : loading
          ? "loading"
          : "empty";

  function commit(o: ComboOption<T>) {
    onChange?.(o.value);
    setQuery("");
    setOpen(false);
  }

  return (
    <div {...dataProps(rest)} ref={box} className={cn("relative", className)}>
      <span className="relative flex items-center">
        {selected?.media && !query ? (
          <span className="tamga-option-media pointer-events-none absolute left-2.5">{selected.media}</span>
        ) : (
          <Icon icon={Search} size="xs" className="pointer-events-none absolute left-3 text-ink-faint" />
        )}
        <input
          ref={girdi}
          type="text"
          role="combobox"
          aria-expanded={acik}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={acik && shown[active] ? `${id}-opt-${active}` : undefined}
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          placeholder={selected ? selected.label : placeholder}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            onSearch?.(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              /* Döngüsel: sonda aşağı basmak başa döner, kullanıcı tekrar yukarı tırmanmaz. */
              setActive((i) => (shown.length === 0 ? 0 : (i + 1) % shown.length));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => (shown.length === 0 ? 0 : (i - 1 + shown.length) % shown.length));
            } else if (e.key === "Enter" && acik && shown[active]) {
              e.preventDefault();
              commit(shown[active]);
            } else if (e.key === "Escape") {
              /* İlk basış kapatır, kapalıyken ikincisi yazılanı siler. İkisi de
                 Esc'i TÜKETİYOR: diyaloğun içinde diyaloğu da kapatıyordu. Üçüncü
                 basış (kapalı ve boş) diyaloğa gidiyor. */
              if (acik || query) {
                e.preventDefault();
                e.stopPropagation();
              }
              if (acik) setOpen(false);
              else if (query) {
                setQuery("");
                onSearch?.("");
              }
            }
          }}
          className={cn(
            "tamga-input w-full pl-9",
            invalid && "tamga-input-invalid",
            selected && !query && "text-ink",
          )}
        />
        <span className="absolute right-1.5 flex items-center gap-0.5">
          {selected && clearable ? (
            <button
              type="button"
              className="tamga-mini-btn" data-inset="true"
              aria-label={labels.clear}
              onClick={() => {
                onChange?.(undefined);
                setQuery("");
              }}
            >
              <Icon icon={Close} size="xs" />
            </button>
          ) : null}
          {arama ? (
            shortcut && !query ? (
              <Kbd className="pointer-events-none mr-1">
                {mac ? `⌘${shortcut.toUpperCase()}` : `Ctrl ${shortcut.toUpperCase()}`}
              </Kbd>
            ) : null
          ) : (
            <button
              type="button"
              className="tamga-mini-btn" data-inset="true"
              aria-label={labels.open}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon icon={CaretDown} size="xs" />
            </button>
          )}
        </span>
      </span>

      {acik ? (
        <div
          id={`${id}-list`}
          ref={liste}
          style={yer}
          role="listbox"
          className="tamga-overlay tamga-menu absolute z-30 mt-2 max-h-72 w-full overflow-y-auto"
        >
          {header ? (
            <div className="border-b border-line px-3 pt-1 pb-2 text-caption text-ink-faint">
              {header}
            </div>
          ) : null}
          {durum === "loading" ? (
            <p className="flex items-center gap-2 px-3 py-2.5 text-body text-ink-faint">
              <Spinner size={14} label={labels.loading ?? labels.empty} />
              {labels.loading}
            </p>
          ) : durum === "short" ? (
            <p className="px-3 py-2.5 text-body text-ink-faint">{labels.short}</p>
          ) : durum === "empty" ? (
            empty ?? <p className="px-3 py-2.5 text-body text-ink-faint">{labels.empty}</p>
          ) : (
            shown.map(({ value: v, label: etiket, hint, group, tone, media, ...rest }, i) => [
              group && group !== shown[i - 1]?.group ? (
                <p
                  key={`${v}-group`}
                  role="presentation"
                  className="px-3 pt-2.5 pb-1 text-caption font-extrabold uppercase tracking-label text-ink-faint"
                >
                  {group}
                </p>
              ) : null,
              <button
                key={v}
                {...rest}
                id={`${id}-opt-${i}`}
                type="button"
                role="option"
                aria-selected={v === value}
                data-selected={v === value}
                /* Yalnız etkin satırda: CSS `[data-active]`a bakıyor, "false" da eşleşip her satırı boyuyordu. */
                data-active={i === active || undefined}
                className="tamga-option w-full text-left"
                onMouseEnter={() => setActive(i)}
                onClick={() => commit(shown[i]!)}
              >
                {tone ? (
                  <span aria-hidden className="tamga-mark shrink-0" style={{ background: toneOf(tone).mark }} />
                ) : null}
                {media ? <span className="tamga-option-media">{media}</span> : null}
                <span className="block min-w-0 flex-1">
                  <span className="block truncate">{vurgula(etiket, query)}</span>
                  {hint ? (
                    <span className="block truncate font-mono text-caption text-ink-faint">{hint}</span>
                  ) : null}
                </span>
              </button>,
            ])
          )}
          {/* Pinned to the panel's foot: a long list must not scroll the way out of sight. */}
          {footer ? (
            <div className="sticky -bottom-[5px] mt-1 border-t border-line bg-shell px-2 pt-2 pb-1">
              {footer}
            </div>
          ) : null}
        </div>
      ) : null}
      {/* Liste değişince ekran okuyucu sonucu duyar; görsel kullanıcı listeyi zaten görüyor. */}
      {labels.count ? (
        <span className="sr-only" aria-live="polite">
          {acik && durum === null ? labels.count(shown.length) : acik && durum === "empty" ? labels.empty : ""}
        </span>
      ) : null}
    </div>
  );
}
