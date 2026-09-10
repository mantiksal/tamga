"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { Icon } from "./icon.js";
import { CaretDown, Close, Search } from "./icons.js";

/**
 * Combobox — aranabilir seçim.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

export type ComboOption<T extends string> = {
  value: T;
  label: string;
  /** Etiketin altındaki ikinci satır — SKU, e-posta, kategori. */
  hint?: string;
};

export function Combobox<T extends string>({
  options,
  value,
  onChange,
  onSearch,
  placeholder,
  labels,
  disabled = false,
  invalid = false,
  className,
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
  labels: { empty: string; clear: string; open: string };
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

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

  function commit(o: ComboOption<T>) {
    onChange?.(o.value);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={box} className={cn("relative", className)}>
      <span className="relative flex items-center">
        <Icon icon={Search} size="xs" className="pointer-events-none absolute left-3 text-ink-faint" />
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && shown[active] ? `${id}-opt-${active}` : undefined}
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
              setActive((i) => Math.min(i + 1, shown.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && open && shown[active]) {
              e.preventDefault();
              commit(shown[active]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className={cn(
            "tamga-input w-full pl-9",
            invalid && "tamga-input-invalid",
            selected && !query && "text-ink",
          )}
        />
        <span className="absolute right-1.5 flex items-center gap-0.5">
          {selected ? (
            <button
              type="button"
              className="tamga-mini-btn"
              aria-label={labels.clear}
              onClick={() => {
                onChange?.(undefined);
                setQuery("");
              }}
            >
              <Icon icon={Close} size="xs" />
            </button>
          ) : null}
          <button
            type="button"
            className="tamga-mini-btn"
            aria-label={labels.open}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon icon={CaretDown} size="xs" />
          </button>
        </span>
      </span>

      {open ? (
        <div
          id={`${id}-list`}
          role="listbox"
          className="tamga-overlay absolute z-30 mt-2 max-h-72 w-full overflow-y-auto py-1"
        >
          {shown.length === 0 ? (
            <p className="px-3 py-2.5 text-body text-ink-faint">{labels.empty}</p>
          ) : (
            shown.map((o, i) => (
              <button
                key={o.value}
                id={`${id}-opt-${i}`}
                type="button"
                role="option"
                aria-selected={o.value === value}
                data-selected={o.value === value}
                data-active={i === active}
                className="tamga-option w-full text-left"
                onMouseEnter={() => setActive(i)}
                onClick={() => commit(o)}
              >
                <span className="block truncate">{o.label}</span>
                {o.hint ? (
                  <span className="block truncate font-mono text-caption text-ink-faint">{o.hint}</span>
                ) : null}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
