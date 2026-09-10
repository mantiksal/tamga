"use client";

import { useMemo, useState } from "react";
import { cn } from "../lib/cn.js";
import { Icon } from "./icon.js";
import { CaretLeft, CaretRight, CalendarPlus, Close } from "./icons.js";

/**
 * DatePicker — tek gün ve aralık.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

/** `2026-04-15` — saat yok, dilim yok. */
export type DateISO = string;

export type DateRange = { from?: DateISO; to?: DateISO };

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

function monthMatrix(year: number, month: number, firstDay: number) {
  const first = new Date(Date.UTC(year, month, 1));
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  /* Hafta başına göre kaydırma: Pazartesi başlayan bir takvimde Pazar 6'dır. */
  const lead = (first.getUTCDay() - firstDay + 7) % 7;
  const cells: (number | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/** Yerelin hafta başlangıcı. Tarayıcı biliyorsa ondan, bilmiyorsa Pazartesi. */
function weekStart(locale: string): number {
  try {
    const info = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const first = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay;
    /* Intl 1=Pazartesi … 7=Pazar; Date 0=Pazar. */
    if (first) return first % 7;
  } catch {
    /* eski tarayıcı: varsayılana düş */
  }
  return 1;
}

export function Calendar({
  locale,
  value,
  range,
  onSelect,
  labels,
  className,
}: {
  /**
   * `"tr-TR"`, `"en-US"`; month names and the first day of the week come from it. TR:
   * `"tr-TR"`, `"en-US"`; ay adları ve hafta başlangıcı buradan gelir.
   */
  locale: string;
  value?: DateISO;
  /**
   * Given, range mode: the first click is the start, the second the end. TR: Verilirse aralık
   * modu: ilk tıklama başlangıç, ikincisi bitiş.
   */
  range?: DateRange;
  onSelect?: (date: DateISO) => void;
  labels: { previousMonth: string; nextMonth: string };
  className?: string;
}) {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const first = weekStart(locale);
  const cells = useMemo(() => monthMatrix(view.y, view.m, first), [view, first]);

  const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(Date.UTC(view.y, view.m, 1)),
  );
  const dayNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    /* 2024-01-07 bir Pazar; oradan hafta başına kaydırıyoruz. */
    return Array.from({ length: 7 }, (_, i) =>
      fmt.format(new Date(Date.UTC(2024, 0, 7 + ((first + i) % 7)))),
    );
  }, [locale, first]);

  const inRange = (d: DateISO) =>
    range?.from && range?.to ? d >= range.from && d <= range.to : false;
  const isEdge = (d: DateISO) => d === range?.from || d === range?.to || d === value;

  return (
    /* 17.5rem = 280px = yedi sutun x 40px. Uydurulmus bir genislik degil,
         satir olceginin toplami. */
    <div className={cn("w-70", className)}>
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          className="tamga-icon-btn"
          aria-label={labels.previousMonth}
          onClick={() => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 }))}
        >
          <Icon icon={CaretLeft} size="xs" />
        </button>
        <span className="flex-1 text-center text-body font-medium text-ink">{monthName}</span>
        <button
          type="button"
          className="tamga-icon-btn"
          aria-label={labels.nextMonth}
          onClick={() => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 }))}
        >
          <Icon icon={CaretRight} size="xs" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {dayNames.map((d) => (
          <span key={d} className="pb-1 text-center text-caption text-ink-faint">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <span key={`x${i}`} />;
          const date = iso(view.y, view.m, d);
          return (
            <button
              key={date}
              type="button"
              /* Seçili gün DOLGU alır — bir tarih bir değerdir, bir hedef değil;
                 checkbox ile aynı gerekçe (Yasa 2). */
              className="tamga-option justify-center tabular-nums"
              data-selected={isEdge(date)}
              data-active={inRange(date) && !isEdge(date)}
              aria-pressed={isEdge(date)}
              onClick={() => onSelect?.(date)}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Alan + açılan takvim.
 *
 * Girdi salt-okunur: elle tarih yazmak, her yerelde farklı bir ayraç ve sıra
 * demektir (`15/04/2026` · `04/15/2026` · `2026-04-15`) ve yanlış okunan bir
 * tarih sessizce yanlış veri üretir. Takvim tek doğru giriş yolu.
 */
export function DatePicker({
  locale,
  value,
  onChange,
  placeholder,
  labels,
  disabled = false,
  className,
}: {
  locale: string;
  value?: DateISO;
  onChange?: (next: DateISO | undefined) => void;
  placeholder: string;
  labels: { previousMonth: string; nextMonth: string; open: string; clear: string };
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const shown = value
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00Z`))
    : "";

  return (
    <div className={cn("relative", className)}>
      <span className="relative flex items-center">
        <Icon icon={CalendarPlus} size="xs" className="pointer-events-none absolute left-3 text-ink-faint" />
        <input
          type="text"
          readOnly
          disabled={disabled}
          value={shown}
          placeholder={placeholder}
          onClick={() => !disabled && setOpen((v) => !v)}
          className="tamga-input w-full cursor-pointer pr-16 pl-9"
          aria-haspopup="dialog"
          aria-expanded={open}
        />
        <span className="absolute right-1.5 flex gap-0.5">
          {value ? (
            <button
              type="button"
              className="tamga-mini-btn"
              aria-label={labels.clear}
              onClick={() => onChange?.(undefined)}
            >
              <Icon icon={Close} size="xs" />
            </button>
          ) : null}
          <button
            type="button"
            className="tamga-mini-btn"
            aria-label={labels.open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon icon={CalendarPlus} size="xs" />
          </button>
        </span>
      </span>

      {open ? (
        <div className="tamga-overlay absolute z-30 mt-2 p-3">
          <Calendar
            locale={locale}
            value={value}
            labels={labels}
            onSelect={(d) => {
              onChange?.(d);
              setOpen(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
