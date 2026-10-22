"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useDismiss } from "./a11y.js";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { uyar } from "../lib/uyar.js";
import { Icon } from "./icon.js";
import { Select } from "./primitives.js";
import { CaretLeft, CaretRight, CalendarPlus, Close } from "./icons.js";

/**
 * DatePicker — tek gün ve aralık; DateTimePicker — dilimli bir an.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

/**
 * `2026-04-15` — a day, no clock, no zone. Where a clock is needed to show it (the field's own
 * text) it is read as UTC midnight, so the day never shifts with the browser's zone. TR: Bir gün;
 * saat yok, dilim yok. Göstermek için saat gerektiğinde UTC gece yarısı okunur; gün tarayıcının
 * dilimiyle kaymaz.
 */
export type DateISO = string;

/**
 * `2026-04-15T14:30:00+03:00` — an instant written with the offset of the picker's `timeZone` at
 * that instant. The server turns it into UTC with `new Date(v).toISOString()`; the offset is
 * what keeps "14:30 in Istanbul" from drifting. TR: Seçicinin `timeZone`unun o andaki ofsetiyle
 * yazılmış bir an. Sunucu `new Date(v).toISOString()` ile UTC'ye çevirir; "İstanbul'da 14:30"u
 * kaydırmadan taşıyan şey o ofset.
 */
export type DateTimeISO = string;

export type DateRange = { from?: DateISO; to?: DateISO };

/* ── Dilim: duvar saati ↔ an. Hepsi Intl üzerinden; tarayıcının dilimi hiç okunmuyor. ── */

/** Bir duvar saati: yıl, sıfır tabanlı ay, gün, saat, dakika. Dilimsiz. */
export type Duvar = { y: number; m: number; d: number; h: number; mi: number };

const p2 = (n: number) => String(n).padStart(2, "0");

export const varsayilanDilim = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone;

const duvarBicim = new Map<string, Intl.DateTimeFormat>();
/** Bir anın `tz` dilimindeki duvar saati. */
function duvar(an: Date, tz: string): Duvar {
  let f = duvarBicim.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    duvarBicim.set(tz, f);
  }
  const al = (parts: Intl.DateTimeFormatPart[], t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const parts = f.formatToParts(an);
  return { y: al(parts, "year"), m: al(parts, "month") - 1, d: al(parts, "day"), h: al(parts, "hour") % 24, mi: al(parts, "minute") };
}

/** `tz` diliminin o andaki ofseti, dakika. */
function ofsetDk(an: Date, tz: string): number {
  const w = duvar(an, tz);
  return Math.round((Date.UTC(w.y, w.m, w.d, w.h, w.mi) - an.getTime()) / 60000 + an.getSeconds() / 60);
}

const SAAT_MS = 3600000;
/** Tahminin iki yanındaki ofsetler: bir geçiş yakındaysa öncesi ve sonrası, yoksa ikisi aynı. */
function ikiOfset(tahmin: number, tz: string) {
  return { once: ofsetDk(new Date(tahmin - 15 * SAAT_MS), tz), sonra: ofsetDk(new Date(tahmin + 15 * SAAT_MS), tz) };
}

/**
 * Bir duvar saatinin bu dilimde karşılık geldiği anlar, erken olan önce: sıfır
 * (DST boşluğu), bir, ya da iki (sonbaharda iki kez yaşanan saat).
 */
export function adaylar(w: Duvar, tz: string): Date[] {
  const tahmin = Date.UTC(w.y, w.m, w.d, w.h, w.mi);
  const { once, sonra } = ikiOfset(tahmin, tz);
  const out: Date[] = [];
  for (const o of once === sonra ? [once] : [once, sonra]) {
    const t = new Date(tahmin - o * 60000);
    if (ofsetDk(t, tz) === o) out.push(t);
  }
  return out.sort((x, y) => x.getTime() - y.getTime());
}

/**
 * Duvar saatinden an. Belirsiz saatte (sonbahar) SONRAKİ an, yani geçiş sonrası
 * standart ofset. Boşlukta (ilkbahar, olmayan saat) önceki ofsetle kurulur, bu
 * da saati İLERİ iter: 02:30 istenir, 03:30 döner. İki yarımkürede de aynı;
 * New York ve Berlin için testte sabit.
 */
export function anYap(w: Duvar, tz: string): Date {
  const a = adaylar(w, tz);
  if (a.length) return a[a.length - 1]!;
  const tahmin = Date.UTC(w.y, w.m, w.d, w.h, w.mi);
  return new Date(tahmin - ikiOfset(tahmin, tz).once * 60000);
}

/** Geçersiz girdi bileşeni düşürmez: dilim tarayıcınınkine, değer boşa düşer, konsol uyarır. */
function dilim(tz: string | undefined): string {
  const aday = tz ?? varsayilanDilim();
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: aday });
    return aday;
  } catch {
    uyar(`timeZone "${aday}" is not a valid IANA zone; using the browser's.`);
    return varsayilanDilim();
  }
}
const GUN = /^\d{4}-\d{2}-\d{2}$/;
export function gunOku(v: string | undefined, ad: string): DateISO | undefined {
  if (v === undefined) return undefined;
  if (GUN.test(v)) {
    /* `2026-02-30` Date.UTC'de 2 Mart'a taşar; gidip gelince aynı kalan gün gerçek. */
    const { y, m, d } = parcala(v);
    const t = new Date(Date.UTC(y, m, d));
    if (t.getUTCFullYear() === y && t.getUTCMonth() === m && t.getUTCDate() === d) return v;
  }
  uyar(`DatePicker: ${ad} "${v}" is not a YYYY-MM-DD day; ignored.`);
  return undefined;
}
function anOku(v: string | undefined, ad: string): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v);
  if (!Number.isNaN(d.getTime())) return d;
  uyar(`DateTimePicker: ${ad} "${v}" is not an ISO instant; ignored.`);
  return undefined;
}
const useGun = (v: string | undefined, ad: string) => useMemo(() => gunOku(v, ad), [v, ad]);

function isoWithOffset(an: Date, tz: string): DateTimeISO {
  const w = duvar(an, tz);
  const off = ofsetDk(an, tz);
  const isaret = off >= 0 ? "+" : "-";
  const mutlak = Math.abs(off);
  return `${w.y}-${p2(w.m + 1)}-${p2(w.d)}T${p2(w.h)}:${p2(w.mi)}:00${isaret}${p2(Math.floor(mutlak / 60))}:${p2(mutlak % 60)}`;
}

const iso = (y: number, m: number, d: number) => `${y}-${p2(m + 1)}-${p2(d)}`;
const gunParcasi = (an: Date, tz: string): DateISO => { const w = duvar(an, tz); return iso(w.y, w.m, w.d); };
const parcala = (d: DateISO) => { const [y, m, g] = d.split("-").map(Number); return { y: y!, m: m! - 1, d: g! }; };
const gunKaydir = (d: DateISO, adim: number): DateISO => {
  const { y, m, d: g } = parcala(d);
  const t = new Date(Date.UTC(y, m, g + adim));
  return iso(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
};

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
  timeZone,
  value: hamDeger,
  range,
  min: hamMin,
  max: hamMax,
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
  /**
   * The IANA zone that decides which day is "today". Defaults to the browser's. TR: "Bugün"ün
   * hangi gün olduğuna karar veren IANA dilimi. Varsayılan tarayıcınınki.
   */
  timeZone?: string;
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
  const tz = useMemo(() => dilim(timeZone), [timeZone]);
  const value = useGun(hamDeger, "value");
  const min = useGun(hamMin, "min");
  const max = useGun(hamMax, "max");
  /* ISO günler sözlük sırasıyla karşılaştırılıyor: `2026-04-05 < 2026-04-15`. */
  const kapali = (d: DateISO) => (min !== undefined && d < min) || (max !== undefined && d > max);
  const bugun = gunParcasi(new Date(), tz);

  /* AÇILAN AY DEĞERİN AYI. Değer yoksa bugün, bugün aralıktaysa; değilse en
     erken seçilebilir gün (bugün max'ı geçtiyse en geç). Bugünün ayı bütünüyle
     kapalıyken ızgarada sekme durağı kalmıyor, klavye takvime hiç giremiyordu.
     Yalnız ilk çizimde: açık bir takvim min/max değişince yerinden oynamaz. */
  const ayi = (d: DateISO) => { const { y, m } = parcala(d); return { y, m }; };
  const baslangic = value ?? (!kapali(bugun) ? bugun : max !== undefined && bugun > max ? max : (min ?? bugun));
  const [view, setView] = useState(ayi(baslangic));
  const kok = useRef<HTMLDivElement>(null);

  const first = weekStart(locale);
  const cells = useMemo(() => monthMatrix(view.y, view.m, first), [view, first]);
  const gorunenGunler = useMemo(
    () => cells.filter((d): d is number => d !== null).map((d) => iso(view.y, view.m, d)),
    [cells, view],
  );

  /* SEKME DURAĞI HEP GÖRÜNEN AYDA VE AÇIK BİR GÜNDE. `odak` yalnız tercihtir;
     ay değişince ya da odak kapalı/görünmez olunca durak seçili güne, o da
     yoksa ilk açık güne düşer · yoksa klavye ızgaraya hiç giremiyordu. */
  /* Durak görünümden bağımsız: görünen ayda değilse ilk açık güne düşüyor. */
  const [odak, setOdak] = useState<DateISO>(value ?? bugun);
  const gorunur = (d: DateISO | undefined): d is DateISO => d !== undefined && d.startsWith(`${view.y}-${p2(view.m + 1)}`);
  const etkinOdak =
    gorunur(odak) && !kapali(odak) ? odak
    : gorunur(value) && !kapali(value) ? value
    : gorunenGunler.find((d) => !kapali(d));

  /* Dışarıdan değer değişince görünüm ve durak onunla eşleşiyor. */
  const oncekiDeger = useRef(value);
  useEffect(() => {
    if (value === oncekiDeger.current) return;
    oncekiDeger.current = value;
    if (value) { setView(ayi(value)); setOdak(value); }
  }, [value]);

  const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(view.y, view.m, 1)),
  );
  const dayNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
    /* 2024-01-07 bir Pazar; oradan hafta başına kaydırıyoruz. */
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(Date.UTC(2024, 0, 7 + ((first + i) % 7)))));
  }, [locale, first]);
  /* Günün erişilebilir adı tam tarih: oklar ay sınırını geçince ekran okuyucu ayı duysun. */
  const tamTarih = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }), [locale]);

  const inRange = (d: DateISO) => (range?.from && range?.to ? d >= range.from && d <= range.to : false);
  const isEdge = (d: DateISO) => d === range?.from || d === range?.to || d === value;

  const git = (hedef: DateISO | null) => {
    if (!hedef) return;
    setOdak(hedef);
    setView(ayi(hedef));
    /* Odak DOM'a yeni günün düğmesi çizildikten sonra, YALNIZ bu takvimin içinde. */
    queueMicrotask(() => {
      (kok.current?.querySelector(`[data-gun="${hedef}"]`) as HTMLButtonElement | null)?.focus();
    });
  };
  /* Bir yönde ilk açık gün; 366 günde bulunamazsa yok. */
  const kaydir = (d: DateISO, adim: number): DateISO | null => {
    let aday = d;
    for (let i = 0; i < 366; i++) {
      aday = gunKaydir(aday, adim);
      if (!kapali(aday)) return aday;
    }
    return null;
  };
  const enYakinAcik = (d: DateISO): DateISO | null => (!kapali(d) ? d : (kaydir(d, 1) ?? kaydir(d, -1)));
  const tusla = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!etkinOdak) return;
    const { y, m, d } = parcala(etkinOdak);
    const haftaGunu = (new Date(Date.UTC(y, m, d)).getUTCDay() - first + 7) % 7;
    const aySinirla = (yy: number, mm: number) => iso(yy, mm, Math.min(d, new Date(Date.UTC(yy, mm + 1, 0)).getUTCDate()));
    const hedefler: Record<string, () => DateISO | null> = {
      ArrowRight: () => kaydir(etkinOdak, 1),
      ArrowLeft: () => kaydir(etkinOdak, -1),
      ArrowDown: () => kaydir(etkinOdak, 7),
      ArrowUp: () => kaydir(etkinOdak, -7),
      Home: () => enYakinAcik(gunKaydir(etkinOdak, -haftaGunu)),
      End: () => enYakinAcik(gunKaydir(etkinOdak, 6 - haftaGunu)),
      PageDown: () => enYakinAcik(m === 11 ? aySinirla(y + 1, 0) : aySinirla(y, m + 1)),
      PageUp: () => enYakinAcik(m === 0 ? aySinirla(y - 1, 11) : aySinirla(y, m - 1)),
    };
    const hedef = hedefler[e.key];
    if (!hedef) return;
    e.preventDefault();
    git(hedef());
  };
  /* Ay düğmesi, o ay tümüyle aralığın dışındaysa kapanır. */
  const oncekiKapali = min !== undefined && iso(view.y, view.m, 0) < min;
  const sonrakiKapali = max !== undefined && iso(view.m === 11 ? view.y + 1 : view.y, (view.m + 1) % 12, 1) > max;

  const satirlar: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) satirlar.push(cells.slice(i, i + 7));

  return (
    /* 17.5rem = 280px = yedi sutun x 40px. Uydurulmus bir genislik degil,
         satir olceginin toplami. */
    <div ref={kok} {...dataProps(rest)} className={cn("w-70", className)}>
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

      {/* IZGARA DESENİ: tek sekme durağı, oklar/Home/End/PageUp/PageDown içeride
          gezdiriyor; her hücre tam tarihle adlanıyor, seçili `aria-selected`,
          kapalı gerçekten `disabled` · ikinci bir `aria-disabled` yok. */}
      <div role="grid" aria-label={monthName} className="grid gap-px" onKeyDown={tusla}>
        <div role="row" className="grid grid-cols-7 gap-px">
          {dayNames.map((d) => (
            <span key={d} role="columnheader" className="pb-1 text-center text-caption text-ink-faint">
              {d}
            </span>
          ))}
        </div>
        {satirlar.map((satir, si) => (
          <div key={si} role="row" className="grid grid-cols-7 gap-px">
            {satir.map((d, i) => {
              if (d === null) return <span key={`x${i}`} role="gridcell" aria-hidden="true" />;
              const date = iso(view.y, view.m, d);
              const disi = kapali(date);
              return (
                <button
                  key={date}
                  type="button"
                  role="gridcell"
                  /* Seçili gün DOLGU alır: bir tarih bir değerdir, bir hedef değil;
                     checkbox ile aynı gerekçe (Yasa 2). */
                  className="tamga-gun"
                  data-gun={date}
                  data-selected={isEdge(date)}
                  data-today={date === bugun || undefined}
                  data-active={inRange(date) && !isEdge(date)}
                  aria-selected={isEdge(date)}
                  aria-label={tamTarih.format(new Date(`${date}T00:00:00Z`))}
                  disabled={disi}
                  tabIndex={date === etkinOdak ? 0 : -1}
                  onFocus={() => setOdak(date)}
                  onClick={() => onSelect?.(date)}
                >
                  {d}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Ortak alan: salt okunur girdi + temizle/aç düğmeleri ── */
function Alan({
  id,
  shown,
  placeholder,
  disabled,
  invalid,
  open,
  hasValue,
  labels,
  onToggle,
  onClear,
}: {
  id?: string;
  shown: string;
  placeholder: string;
  disabled: boolean;
  invalid: boolean;
  open: boolean;
  hasValue: boolean;
  labels: { open: string; clear: string };
  onToggle: () => void;
  onClear: () => void;
}) {
  return (
    <span className="relative flex items-center">
      <Icon icon={CalendarPlus} size="xs" className="pointer-events-none absolute left-3 text-ink-faint" />
      <input
        id={id}
        type="text"
        readOnly
        disabled={disabled}
        value={shown}
        placeholder={placeholder}
        onClick={() => !disabled && onToggle()}
        className="tamga-input w-full cursor-pointer pr-16 pl-9"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
      />
      <span className="absolute right-1.5 flex gap-0.5">
        {/* KAPALI ALANIN DÜĞMELERİ DE KAPALI: girdi `disabled` iken mini düğmeler
            açıktı, kilitli bir tarih temizlenebiliyordu. */}
        {hasValue ? (
          <button type="button" className="tamga-mini-btn" data-inset="true" aria-label={labels.clear} disabled={disabled} onClick={() => !disabled && onClear()}>
            <Icon icon={Close} size="xs" />
          </button>
        ) : null}
        <button type="button" className="tamga-mini-btn" data-inset="true" aria-label={labels.open} disabled={disabled} onClick={() => !disabled && onToggle()}>
          <Icon icon={CalendarPlus} size="xs" />
        </button>
      </span>
    </span>
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
  id,
  locale,
  timeZone,
  value: hamDeger,
  onChange,
  placeholder,
  labels,
  min,
  max,
  invalid = false,
  disabled = false,
  className,
  ...rest
}: {
  /** Reaches the field, so `Field htmlFor` can bind. TR: Alana iner, `Field htmlFor` bağlanabilir. */
  id?: string;
  locale: string;
  /** Which day is "today"; see `Calendar`. TR: "Bugün" hangi gün; bkz. `Calendar`. */
  timeZone?: string;
  value?: DateISO;
  onChange?: (next: DateISO | undefined) => void;
  placeholder: string;
  labels: { previousMonth: string; nextMonth: string; open: string; clear: string };
  /** The earliest selectable day, see `Calendar`. TR: Seçilebilen en erken gün, bkz. `Calendar`. */
  min?: DateISO;
  /** The latest selectable day. TR: Seçilebilen en geç gün. */
  max?: DateISO;
  /** Marks the field invalid (`aria-invalid`), like `Input`. TR: Alanı geçersiz işaretler (`aria-invalid`), `Input` gibi. */
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const [open, setOpen] = useState(false);
  /* Takvim dışarı tıklayınca ve Escape ile kapanıyor; kutu tetiği de kapsıyor. */
  const kapat = useCallback(() => setOpen(false), []);
  const kutu = useDismiss(open, kapat);
  const value = useGun(hamDeger, "value");
  /* Gün UTC gece yarısı okunuyor (bkz. `DateISO`): tarayıcı dilimi günü kaydırmıyor. */
  const shown = value
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`))
    : "";

  return (
    <div ref={kutu} {...dataProps(rest)} className={cn("relative", className)}>
      <Alan
        id={id}
        shown={shown}
        placeholder={placeholder}
        disabled={disabled}
        invalid={invalid}
        open={open}
        hasValue={Boolean(value)}
        labels={labels}
        onToggle={() => setOpen((v) => !v)}
        onClear={() => onChange?.(undefined)}
      />
      {open ? (
        /* Takvimin tıklaması sayfaya sızmıyor: `<label>` ile sarılmış bir alanda
           takvimin boşluğuna tıklama input'a yönlendiriliyor, takvim kendi
           kendine kapanıyordu. */
        <div className="tamga-overlay absolute z-30 mt-2 p-3" onClick={(e) => e.stopPropagation()}>
          <Calendar
            locale={locale}
            timeZone={timeZone}
            value={value}
            min={min}
            max={max}
            labels={labels}
            onSelect={(d) => { onChange?.(d); setOpen(false); }}
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
 *
 * YAYILAN HER DEĞER [min, max] İÇİNDE: gün, saat, dakika ya da öğle değişince
 * aday an sınırı deliyorsa en yakın geçerli saate kısılır ve seçimler ona
 * çekilir. Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */
export function DateTimePicker({
  id,
  locale,
  timeZone,
  value,
  onChange,
  placeholder,
  labels,
  min,
  max,
  minuteStep = 5,
  invalid = false,
  disabled = false,
  className,
  ...rest
}: {
  /** Reaches the field, so `Field htmlFor` can bind. TR: Alana iner, `Field htmlFor` bağlanabilir. */
  id?: string;
  locale: string;
  /**
   * The IANA zone the clock is shown and picked in, e.g. the workspace's `Europe/Istanbul`.
   * Defaults to the browser's; give it explicitly in a server-rendered app, or the server's zone
   * renders one clock and the browser another (a hydration mismatch). The value's offset is this
   * zone's offset at that instant. An invalid name falls back to the browser's, with a console
   * warning. TR: Saatin gösterildiği ve seçildiği IANA dilimi, ör. çalışma alanının
   * `Europe/Istanbul`u. Varsayılan tarayıcınınki; sunucuda çizilen bir uygulamada açıkça ver,
   * yoksa sunucu bir saati, tarayıcı başkasını çizer (hidrasyon uyuşmazlığı). Değerin ofseti bu
   * dilimin o andaki ofsetidir. Geçersiz ad tarayıcınınkine düşer, konsol uyarır.
   */
  timeZone?: string;
  /**
   * See `DateTimeISO`; any ISO instant is accepted in (`Z` or an offset). An unparseable one is
   * read as empty, with a console warning. TR: Bkz. `DateTimeISO`; içeri her ISO an kabul edilir
   * (`Z` ya da ofset). Okunamayan boş sayılır, konsol uyarır.
   */
  value?: DateTimeISO;
  /**
   * Fires with `DateTimeISO` in `timeZone`'s offset, e.g. `2026-04-15T14:30:00+03:00`, always
   * inside `[min, max]`. The product sends `new Date(v).toISOString()` to the server. TR:
   * `timeZone`un ofsetiyle `DateTimeISO` verir, ör. `2026-04-15T14:30:00+03:00`, hep `[min, max]`
   * içinde. Ürün sunucuya `new Date(v).toISOString()` gönderir.
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
    /** The AM/PM words when `Intl` has none for the locale; otherwise `Intl`'s. TR: Yerel için `Intl` vermezse öğle sözcükleri; yoksa `Intl`inkiler. */
    am?: string;
    pm?: string;
  };
  /**
   * The earliest selectable instant. Earlier days are disabled; on the boundary day earlier
   * hours and minutes are not offered, and a selection that would fall before it is clamped to
   * it. A stored `value` outside the range is still shown as it is; the next pick clamps. TR:
   * Seçilebilen en erken an. Önceki günler kapalı; sınır gününde önceki saat ve dakikalar
   * sunulmaz, öncesine düşecek bir seçim ona kısılır. Aralık dışı kayıtlı `value` yine olduğu
   * gibi gösterilir; sonraki seçim kısar.
   */
  min?: DateTimeISO;
  /** The latest selectable instant; the mirror of `min`. TR: Seçilebilen en geç an; `min`in aynası. */
  max?: DateTimeISO;
  /**
   * Minute options come every N minutes; 5 by default. A value whose minute is off the grid
   * (`:07`) is shown as it is, added to the options rather than rounded: the field never lies
   * about a stored value. TR: Dakika seçenekleri N dakikada bir; varsayılan 5. Dakikası ızgara
   * dışı bir değer (`:07`) olduğu gibi gösterilir, yuvarlanmak yerine seçeneklere eklenir: alan
   * kayıtlı değeri hiç yalanlamaz. Below 1, or not a number, reads as 1. TR: 1'in altı ya da
   * sayı olmayan 1 sayılır.
   */
  minuteStep?: number;
  /** Marks the field invalid (`aria-invalid`), like `Input`. TR: Alanı geçersiz işaretler (`aria-invalid`), `Input` gibi. */
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const tz = useMemo(() => dilim(timeZone), [timeZone]);
  const [open, setOpen] = useState(false);
  const kapat = useCallback(() => setOpen(false), []);
  const kutu = useDismiss(open, kapat);
  /* Sıfır ya da eksi adım sonsuz döngüydü; 1'e kısılıyor. */
  const adim = Math.max(1, Math.floor(minuteStep) || 1);

  const an = useMemo(() => anOku(value, "value"), [value]);
  const w = an ? duvar(an, tz) : undefined;
  const gun = w ? iso(w.y, w.m, w.d) : undefined;
  const simdi = duvar(new Date(), tz);
  /* Saat durumu değerden, değer yoksa şu andan: gün seçilir seçilmez anlamlı
     bir saat çıksın, 00:00 değil. */
  const [saat, setSaat] = useState(() => (w ?? simdi).h);
  const [dakika, setDakika] = useState(() => (w ? w.mi : Math.floor(simdi.mi / adim) * adim));
  useEffect(() => {
    if (!w) return;
    setSaat(w.h);
    setDakika(w.mi);
    /* eslint-disable-next-line react-hooks/exhaustive-deps -- yalnız dışarıdan gelen değer */
  }, [value, tz]);

  const minAn = useMemo(() => anOku(min, "min"), [min]);
  const maxAn = useMemo(() => anOku(max, "max"), [max]);
  const minGun = minAn ? gunParcasi(minAn, tz) : undefined;
  const maxGun = maxAn ? gunParcasi(maxAn, tz) : undefined;

  /* Bir duvar saatinin [min, max] içindeki anları: dilimde var olan her aday
     sayılır, yani belirsiz saatin iki yaşanışı da. */
  const icinde = (t: Date) => (!minAn || t.getTime() >= minAn.getTime()) && (!maxAn || t.getTime() <= maxAn.getTime());
  const anlar = (g: DateISO, h: number, mi: number) => {
    const { y, m, d } = parcala(g);
    return adaylar({ y, m, d, h, mi }, tz).filter(icinde);
  };
  const gecerli = (g: DateISO, h: number, mi: number) => anlar(g, h, mi).length > 0;
  /* Dakika ızgarası: adımın katları + (varsa) kayıtlı değerin ızgara dışı dakikası. */
  const izgara = useMemo(() => {
    const d = new Set<number>();
    for (let m = 0; m < 60; m += adim) d.add(m);
    if (w) d.add(w.mi);
    return [...d].sort((a, b) => a - b);
  }, [adim, w?.mi]);

  /* KISMA: istenen (saat, dakika) geçerli değilse ileri doğru ilk geçerli,
     o da yoksa geri doğru ilk geçerli. Yayılan her değer aralık içinde. */
  const kis = (g: DateISO, h: number, mi: number): { h: number; mi: number } | null => {
    if (gecerli(g, h, mi)) return { h, mi };
    const adaylar: { h: number; mi: number }[] = [];
    for (let hh = 0; hh < 24; hh++) for (const mm of izgara) adaylar.push({ h: hh, mi: mm });
    const sira = (a: { h: number; mi: number }) => a.h * 60 + a.mi;
    const istenen = h * 60 + mi;
    return (
      adaylar.find((a) => sira(a) > istenen && gecerli(g, a.h, a.mi)) ??
      [...adaylar].reverse().find((a) => sira(a) < istenen && gecerli(g, a.h, a.mi)) ??
      null
    );
  };
  const yay = (g: DateISO | undefined, h: number, mi: number) => {
    if (!g) return;
    const k = kis(g, h, mi);
    if (!k) return;
    setSaat(k.h);
    setDakika(k.mi);
    const secenekler = anlar(g, k.h, k.mi);
    /* Belirsiz saatte dış değer kendi anını korur; aynı belirsiz saatin içinde
       dakika değişince ofsetini korur (01:30-04:00 → 01:45-04:00); yoksa
       sonraki (standart ofset). */
    const belirsizde = an && w && adaylar(w, tz).length === 2 ? ofsetDk(an, tz) : undefined;
    const secim =
      (an && secenekler.find((t) => t.getTime() === an.getTime())) ??
      (belirsizde !== undefined ? secenekler.find((t) => ofsetDk(t, tz) === belirsizde) : undefined) ??
      secenekler[secenekler.length - 1]!;
    onChange?.(isoWithOffset(secim, tz));
  };

  /* Seçenekler: yalnız en az bir geçerli dakikası olan saatler, yalnız geçerli
     dakikalar · artı kayıtlı değerin kendi saati ve dakikası, aralık dışında
     kalsa da: kutu hep biçimli ve hep bir seçeneği gösteriyor. Gün yokken liste
     tam, kutular kapalı: saat seçmek bugünü yayıyordu. */
  const g = gun;
  const saatler = open ? Array.from({ length: 24 }, (_, h) => h).filter((h) => !g || h === w?.h || izgara.some((mm) => gecerli(g, h, mm))) : [];
  const dakikalar = open ? izgara.filter((mm) => !g || (w && saat === w.h && mm === w.mi) || gecerli(g, saat, mm)) : [];

  /* 12/24 saat yerelin kararı; öğle sözcükleri Intl'den, yoksa labels'tan, o da
     yoksa 24 saate düşülür · kit İngilizce yazmaz. */
  const onIki = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions().hour12 === true;
  const donem = useMemo(() => {
    if (!onIki) return null;
    const ad = (h: number) =>
      new Intl.DateTimeFormat(locale, { hour: "numeric", hour12: true, timeZone: "UTC" })
        .formatToParts(new Date(Date.UTC(2024, 0, 1, h)))
        .find((p) => p.type === "dayPeriod")?.value;
    const am = ad(9) ?? labels.am;
    const pm = ad(21) ?? labels.pm;
    return am && pm ? { am, pm } : null;
  }, [locale, onIki, labels.am, labels.pm]);
  const saatEtiketi = (h: number) => (donem ? String(h % 12 === 0 ? 12 : h % 12) : p2(h));

  const shown = an ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone: tz }).format(an) : "";

  return (
    <div ref={kutu} {...dataProps(rest)} className={cn("relative", className)}>
      <Alan
        id={id}
        shown={shown}
        placeholder={placeholder}
        disabled={disabled}
        invalid={invalid}
        open={open}
        hasValue={Boolean(value)}
        labels={labels}
        onToggle={() => setOpen((v) => !v)}
        onClear={() => onChange?.(undefined)}
      />
      {open ? (
        <div className="tamga-overlay absolute z-30 mt-2 p-3" onClick={(e) => e.stopPropagation()}>
          <Calendar
            locale={locale}
            timeZone={tz}
            value={gun}
            min={minGun}
            max={maxGun}
            labels={labels}
            /* Gün seçilince takvim AÇIK KALIYOR: saat daha seçilecek. */
            onSelect={(d) => yay(d, saat, dakika)}
          />
          <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
            <Select
              aria-label={labels.hour}
              placeholder={labels.hour}
              disabled={!g}
              value={String(saat)}
              onChange={(v) => yay(g, Number(v), dakika)}
              options={(donem ? saatler.filter((h) => (saat < 12 ? h < 12 : h >= 12)) : saatler).map((h) => ({ value: String(h), label: saatEtiketi(h) }))}
            />
            <Select
              aria-label={labels.minute}
              placeholder={labels.minute}
              disabled={!g}
              value={String(dakika)}
              onChange={(v) => yay(g, saat, Number(v))}
              options={dakikalar.map((m) => ({ value: String(m), label: p2(m) }))}
            />
            {donem ? (
              <Select
                aria-label={labels.period}
                placeholder={labels.period}
                disabled={!g}
                value={saat < 12 ? "am" : "pm"}
                onChange={(v) => yay(g, v === "am" ? saat % 12 : (saat % 12) + 12, dakika)}
                options={[{ value: "am", label: donem.am }, { value: "pm", label: donem.pm }]}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
