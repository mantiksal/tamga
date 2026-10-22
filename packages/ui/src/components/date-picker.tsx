"use client";

import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { useDismiss } from "./a11y.js";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import { Select } from "./primitives.js";
import { CaretLeft, CaretRight, CalendarPlus, Close } from "./icons.js";

/**
 * DatePicker — tek gün ve aralık.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

/** `2026-04-15` — saat yok, dilim yok. */
export type DateISO = string;

/**
 * `2026-04-15T14:30:00+03:00` — an instant with the user's offset. The server turns it into UTC
 * with `new Date(v).toISOString()`; the offset is what keeps "14:30 in Istanbul" from drifting.
 * TR: Kullanıcının dilimiyle bir an. Sunucu `new Date(v).toISOString()` ile UTC'ye çevirir;
 * "İstanbul'da 14:30"u kaydırmadan taşıyan şey o dilim.
 */
export type DateTimeISO = string;

/** Yerel bir anı, kullanıcının dilim kaymasıyla ISO 8601'e yazar. */
function isoWithOffset(d: Date): DateTimeISO {
  const p = (n: number) => String(n).padStart(2, "0");
  const off = -d.getTimezoneOffset();
  const isaret = off >= 0 ? "+" : "-";
  const mutlak = Math.abs(off);
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00${isaret}${p(Math.floor(mutlak / 60))}:${p(mutlak % 60)}`;
}

const gunParcasi = (d: Date): DateISO =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

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
  min,
  max,
  onSelect,
  labels,
  className,
  ...rest
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
  /**
   * The earliest selectable day. Days before it are disabled, the arrow keys skip them, and the
   * previous-month button closes once the whole month is out of reach. TR: Seçilebilen en erken
   * gün. Öncesi kapalı, ok tuşları atlar, ay tümüyle dışarıda kalınca önceki-ay düğmesi kapanır.
   */
  min?: DateISO;
  /** The latest selectable day; the mirror of `min`. TR: Seçilebilen en geç gün; `min`in aynası. */
  max?: DateISO;
  onSelect?: (date: DateISO) => void;
  labels: { previousMonth: string; nextMonth: string };
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const today = new Date();
  /* ISO günler sözlük sırasıyla karşılaştırılıyor: `2026-04-05 < 2026-04-15`. */
  const kapali = (d: DateISO) => (min !== undefined && d < min) || (max !== undefined && d > max);
  /* AÇILAN AY DEĞERİN AYI, bugünün ayı değil · ve bir süre bugünündü: başka bir
     aydan bir tarih verildiğinde takvim bu ayı açıyor, seçili gün hiç
     görünmüyor ve kullanıcı kendi verdiği tarihi arıyordu. Değer yoksa bugün. */
  const acilis = value ? new Date(`${value}T00:00:00`) : today;
  const [view, setView] = useState({ y: acilis.getFullYear(), m: acilis.getMonth() });

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

  /* BUGÜN İŞARETLİ, ve değildi: bir takvimde "hangi gün bugün" sorusu her
     zaman soruluyor, ve cevabı yoksa kullanıcı tarihi baştan sayıyor. */
  const bugun = iso(today.getFullYear(), today.getMonth(), today.getDate());

  const inRange = (d: DateISO) =>
    range?.from && range?.to ? d >= range.from && d <= range.to : false;
  const isEdge = (d: DateISO) => d === range?.from || d === range?.to || d === value;

  /* KLAVYE: tek bir gün sekmeyle alınır (odaktaki), oklar günler arasında
     gezer ve KAPALI GÜNLERİ ATLAR; ay sınırı geçilince görünüm de geçer. Her
     güne ayrı sekme durağı vermek otuz bir durak demekti. */
  const [odak, setOdak] = useState<DateISO>(() => value ?? bugun);
  const kaydir = (d: DateISO, adim: number): DateISO | null => {
    const t = new Date(`${d}T00:00:00`);
    for (let i = 0; i < 366; i++) {
      t.setDate(t.getDate() + adim);
      const aday = iso(t.getFullYear(), t.getMonth(), t.getDate());
      if (!kapali(aday)) return aday;
    }
    return null;
  };
  const tusla = (e: KeyboardEvent<HTMLDivElement>) => {
    const adim = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
    if (!adim) return;
    e.preventDefault();
    const hedef = kaydir(odak, adim);
    if (!hedef) return;
    setOdak(hedef);
    const t = new Date(`${hedef}T00:00:00`);
    setView({ y: t.getFullYear(), m: t.getMonth() });
    /* Odak DOM'a yeni günün düğmesi çizildikten sonra taşınıyor. */
    queueMicrotask(() => {
      (document.querySelector(`[data-gun="${hedef}"]`) as HTMLButtonElement | null)?.focus();
    });
  };
  /* Ay düğmesi, o ay tümüyle aralığın dışındaysa kapanır: önceki ayın son günü
     `min`den önceyse, sonraki ayın ilk günü `max`tan sonraysa. */
  const oncekiKapali = min !== undefined && iso(view.y, view.m, 0) < min;
  const sonrakiKapali =
    max !== undefined && iso(view.m === 11 ? view.y + 1 : view.y, (view.m + 1) % 12, 1) > max;

  return (
    /* 17.5rem = 280px = yedi sutun x 40px. Uydurulmus bir genislik degil,
         satir olceginin toplami. */
    <div {...dataProps(rest)} className={cn("w-70", className)}>
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          className="tamga-icon-btn"
          aria-label={labels.previousMonth}
          disabled={oncekiKapali}
          onClick={() => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 }))}
        >
          <Icon icon={CaretLeft} size="xs" />
        </button>
        <span className="flex-1 text-center text-body font-medium text-ink">{monthName}</span>
        <button
          type="button"
          className="tamga-icon-btn"
          aria-label={labels.nextMonth}
          disabled={sonrakiKapali}
          onClick={() => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 }))}
        >
          <Icon icon={CaretRight} size="xs" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px" onKeyDown={tusla}>
        {dayNames.map((d) => (
          <span key={d} className="pb-1 text-center text-caption text-ink-faint">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <span key={`x${i}`} />;
          const date = iso(view.y, view.m, d);
          const disi = kapali(date);
          return (
            <button
              key={date}
              type="button"
              /* Seçili gün DOLGU alır: bir tarih bir değerdir, bir hedef değil;
                 checkbox ile aynı gerekçe (Yasa 2). Kapalı gün gerçekten
                 `disabled`: tıklanmaz, okunurken "kapalı" denir, oklar atlar. */
              className="tamga-gun"
              data-gun={date}
              data-selected={isEdge(date)}
              data-today={date === bugun || undefined}
              data-active={inRange(date) && !isEdge(date)}
              aria-pressed={isEdge(date)}
              disabled={disi}
              aria-disabled={disi || undefined}
              tabIndex={date === odak ? 0 : -1}
              onFocus={() => setOdak(date)}
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
  min,
  max,
  disabled = false,
  className,
  ...rest
}: {
  locale: string;
  value?: DateISO;
  onChange?: (next: DateISO | undefined) => void;
  placeholder: string;
  labels: { previousMonth: string; nextMonth: string; open: string; clear: string };
  /** The earliest selectable day, see `Calendar`. TR: Seçilebilen en erken gün, bkz. `Calendar`. */
  min?: DateISO;
  /** The latest selectable day. TR: Seçilebilen en geç gün. */
  max?: DateISO;
  disabled?: boolean;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const [open, setOpen] = useState(false);
  /* TAKVİM DIŞARI TIKLAYINCA VE ESCAPE İLE KAPANIYOR, ve bir süre HİÇ
     kapanmıyordu: tek çıkış yolu bir tarih seçmekti, yani yanlışlıkla açan
     kişi ya bir tarih seçiyor ya da alanı yeniden tıklamayı buluyordu. Kutu
     tetiği de kapsıyor: tetiğe tıklama kendi anahtarına ulaşmalı, dışarı
     sayılmamalı. */
  const kapat = useCallback(() => setOpen(false), []);
  const kutu = useDismiss(open, kapat);
  const shown = value
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00Z`))
    : "";

  return (
    <div ref={kutu} {...dataProps(rest)} className={cn("relative", className)}>
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
              className="tamga-mini-btn" data-inset="true"
              aria-label={labels.clear}
              onClick={() => onChange?.(undefined)}
            >
              <Icon icon={Close} size="xs" />
            </button>
          ) : null}
          <button
            type="button"
            className="tamga-mini-btn" data-inset="true"
            aria-label={labels.open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon icon={CalendarPlus} size="xs" />
          </button>
        </span>
      </span>

      {open ? (
        <div
          className="tamga-overlay absolute z-30 mt-2 p-3"
          /* TAKVİMİN TIKLAMASI SAYFAYA SIZMIYOR. Tüketen taraf alanı bir
             `<label>` ile sarınca (kitin `Field`i sarmıyor, elle yazılan sarıyor)
             takvimin boşluğuna her tıklama tarayıcı tarafından INPUT'A
             yönlendiriliyor, yani takvim kendi kendine açılıp kapanıyordu. */
          onClick={(e) => e.stopPropagation()}
        >
          <Calendar
            locale={locale}
            value={value}
            min={min}
            max={max}
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

/**
 * Tarih + saat. AYRI BİR BİLEŞEN, `DatePicker`a bir prop değil: dönen değerin
 * biçimi farklı (gün değil, dilimli bir an) ve bir prop'a göre tip değiştiren
 * bir `onChange` çağıranı her kullanımda ikisini birden düşünmeye zorlardı.
 * Takvim aynı, saat satırı ayrı bir koreografi.
 *
 * Saat de "yanlış okunmaz": serbest metin değil, iki seçim. 12/24 saat yerelin
 * kararı (`Intl`), kitin değil. Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */
export function DateTimePicker({
  locale,
  value,
  onChange,
  placeholder,
  labels,
  min,
  max,
  minuteStep = 5,
  disabled = false,
  className,
  ...rest
}: {
  locale: string;
  /** See `DateTimeISO`: an instant with offset; any ISO instant is accepted in. TR: Bkz. `DateTimeISO`: dilimli bir an; içeri her ISO an kabul edilir. */
  value?: DateTimeISO;
  /**
   * Fires with `DateTimeISO` in the user's own offset, e.g. `2026-04-15T14:30:00+03:00`. The
   * product sends `new Date(v).toISOString()` to the server. TR: Kullanıcının kendi dilimiyle
   * `DateTimeISO` verir, ör. `2026-04-15T14:30:00+03:00`. Ürün sunucuya
   * `new Date(v).toISOString()` gönderir.
   */
  onChange?: (next: DateTimeISO | undefined) => void;
  placeholder: string;
  labels: {
    previousMonth: string;
    nextMonth: string;
    open: string;
    clear: string;
    /** Accessible name of the hour select. TR: Saat seçiminin erişilebilir adı. */
    hour: string;
    /** Accessible name of the minute select. TR: Dakika seçiminin erişilebilir adı. */
    minute: string;
    /** Accessible name of the AM/PM select; shown only in 12-hour locales. TR: Öğle öncesi/sonrası seçiminin adı; yalnız 12 saatlik yerellerde. */
    period: string;
  };
  /**
   * The earliest selectable instant. Earlier days are disabled; on the same day, earlier hours
   * and minutes are not offered. TR: Seçilebilen en erken an. Önceki günler kapalı; aynı günde
   * önceki saat ve dakikalar sunulmuyor.
   */
  min?: DateTimeISO;
  /** The latest selectable instant; the mirror of `min`. TR: Seçilebilen en geç an; `min`in aynası. */
  max?: DateTimeISO;
  /** Minute options come every N minutes; 5 by default. TR: Dakika seçenekleri N dakikada bir; varsayılan 5. */
  minuteStep?: number;
  disabled?: boolean;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const [open, setOpen] = useState(false);
  const kapat = useCallback(() => setOpen(false), []);
  const kutu = useDismiss(open, kapat);

  const an = value ? new Date(value) : undefined;
  const simdi = new Date();
  /* SAAT DURUMU DEĞERDEN, değer yoksa şu andan (adıma yuvarlanmış): gün seçilir
     seçilmez anlamlı bir saat çıksın, 00:00 değil. */
  const [saat, setSaat] = useState(() => (an ?? simdi).getHours());
  const [dakika, setDakika] = useState(() =>
    Math.floor((an ?? simdi).getMinutes() / minuteStep) * minuteStep,
  );
  useEffect(() => {
    if (!an) return;
    setSaat(an.getHours());
    setDakika(an.getMinutes());
    /* eslint-disable-next-line react-hooks/exhaustive-deps -- yalnız dışarıdan gelen değer */
  }, [value]);

  const minAn = min ? new Date(min) : undefined;
  const maxAn = max ? new Date(max) : undefined;
  const gun = an ? gunParcasi(an) : undefined;
  const minGun = minAn ? gunParcasi(minAn) : undefined;
  const maxGun = maxAn ? gunParcasi(maxAn) : undefined;

  /* Aynı günün içinde sınır saate kadar: aralık dışı saat SUNULMUYOR. */
  const saatUygun = (h: number) =>
    !(gun && minGun === gun && minAn && h < minAn.getHours()) &&
    !(gun && maxGun === gun && maxAn && h > maxAn.getHours());
  const dakikaUygun = (m: number) =>
    !(gun && minGun === gun && minAn && saat === minAn.getHours() && m < minAn.getMinutes()) &&
    !(gun && maxGun === gun && maxAn && saat === maxAn.getHours() && m > maxAn.getMinutes());

  /* 12/24 saat: yerelin kararı. Öğle öncesi/sonrası sözcükleri de yerelden. */
  const onIki = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions().hour12 === true;
  const donem = useMemo(() => {
    if (!onIki) return null;
    const ad = (h: number) =>
      new Intl.DateTimeFormat(locale, { hour: "numeric", hour12: true })
        .formatToParts(new Date(2024, 0, 1, h))
        .find((p) => p.type === "dayPeriod")?.value ?? (h < 12 ? "AM" : "PM");
    return { am: ad(9), pm: ad(21) };
  }, [locale, onIki]);

  const yay = (g: DateISO | undefined, h: number, m: number) => {
    if (!g) return;
    const [y, mo, d] = g.split("-").map(Number);
    onChange?.(isoWithOffset(new Date(y!, mo! - 1, d!, h, m)));
  };

  const saatler = Array.from({ length: 24 }, (_, h) => h).filter(saatUygun);
  const dakikalar = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep).filter(dakikaUygun);
  const saatEtiketi = (h: number) =>
    onIki ? String(h % 12 === 0 ? 12 : h % 12) : String(h).padStart(2, "0");

  const shown = an
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(an)
    : "";

  return (
    <div ref={kutu} {...dataProps(rest)} className={cn("relative", className)}>
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
            <button type="button" className="tamga-mini-btn" data-inset="true" aria-label={labels.clear} onClick={() => onChange?.(undefined)}>
              <Icon icon={Close} size="xs" />
            </button>
          ) : null}
          <button type="button" className="tamga-mini-btn" data-inset="true" aria-label={labels.open} onClick={() => setOpen((v) => !v)}>
            <Icon icon={CalendarPlus} size="xs" />
          </button>
        </span>
      </span>

      {open ? (
        <div className="tamga-overlay absolute z-30 mt-2 p-3" onClick={(e) => e.stopPropagation()}>
          <Calendar
            locale={locale}
            value={gun}
            min={minGun}
            max={maxGun}
            labels={labels}
            /* Gün seçilince takvim AÇIK KALIYOR: saat daha seçilecek. Dışarı
               tıklama ve Escape kapatıyor. */
            onSelect={(d) => yay(d, saat, dakika)}
          />
          <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
            <Select
              aria-label={labels.hour}
              placeholder={labels.hour}
              value={String(saat)}
              onChange={(v) => {
                const h = Number(v);
                setSaat(h);
                yay(gun, h, dakika);
              }}
              options={(onIki ? saatler.filter((h) => (saat < 12 ? h < 12 : h >= 12)) : saatler).map((h) => ({
                value: String(h),
                label: saatEtiketi(h),
              }))}
            />
            <Select
              aria-label={labels.minute}
              placeholder={labels.minute}
              value={String(dakika)}
              onChange={(v) => {
                const m = Number(v);
                setDakika(m);
                yay(gun, saat, m);
              }}
              options={dakikalar.map((m) => ({ value: String(m), label: String(m).padStart(2, "0") }))}
            />
            {donem ? (
              <Select
                aria-label={labels.period}
                placeholder={labels.period}
                value={saat < 12 ? "am" : "pm"}
                onChange={(v) => {
                  const h = v === "am" ? saat % 12 : (saat % 12) + 12;
                  setSaat(h);
                  yay(gun, h, dakika);
                }}
                options={[
                  { value: "am", label: donem.am },
                  { value: "pm", label: donem.pm },
                ]}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
