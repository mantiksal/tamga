"use client";

import { useMemo, useRef, useState } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Combobox } from "./combobox.js";
import { Input } from "./input.js";
import { DILIMLER, KODLAR } from "./phone-data.js";

type Ulke = { iso: string; kod: string; sira: number };

const ULKELER: Ulke[] = KODLAR.split(" ").map((parca) => {
  const [, iso = "", kod = "", sira = "0"] = /^([A-Z]{2})(\d+)(?:\/(\d+))?$/.exec(parca) ?? [];
  return { iso, kod, sira: Number(sira) };
});
const ISO = new Map(ULKELER.map((u) => [u.iso, u]));

/**
 * The country a time zone sits in ("Europe/Istanbul" → "TR"), for a phone field's first guess.
 * `undefined` for a zone that is not a country's (UTC, Antarctica). TR: Bir saat diliminin ülkesi;
 * telefon alanının ilk tahmini için. Bir ülkenin olmayan dilimde (UTC, Antarktika) `undefined`.
 */
export function countryForTimeZone(timeZone: string | null | undefined): string | undefined {
  return timeZone ? DILIMLER[timeZone] : undefined;
}

/*
 * NUMARAYI ÜLKEYE AYIRMAK. En uzun ülke kodu kazanıyor (+1268 Antigua, +1 değil); bir kod birden çok
 * ülkenin ise (+1, +7) önce alanın kendi ülkesi, sonra kodun sahibi. Başında "+" olmayan bir değer
 * de uluslararası okunuyor: eski kayıtlar numarayı yalnız rakamla tutuyordu ("905550000000").
 */
function coz(deger: string, varsayilan: string): { iso: string; ulusal: string } {
  const rakam = deger.replace(/\D/g, "");
  if (!rakam) return { iso: varsayilan, ulusal: "" };
  const adaylar = ULKELER.filter((u) => rakam.startsWith(u.kod));
  const uzun = Math.max(0, ...adaylar.map((u) => u.kod.length));
  const enUzun = adaylar.filter((u) => u.kod.length === uzun);
  const secilen =
    enUzun.find((u) => u.iso === varsayilan) ?? [...enUzun].sort((a, b) => a.sira - b.sira)[0];
  return secilen
    ? { iso: secilen.iso, ulusal: rakam.slice(secilen.kod.length) }
    : { iso: varsayilan, ulusal: rakam };
}

/* Yazılan ulusal numaradan saklanacak değer: baştaki 0 düşüyor (0555 → +90555), boş numara boş. */
function birlestir(iso: string, ulusal: string): string {
  const rakam = ulusal.replace(/\D/g, "").replace(/^0+/, "");
  const ulke = ISO.get(iso);
  return rakam && ulke ? `+${ulke.kod}${rakam}` : "";
}

/**
 * A phone number as a country and the number within it. The value is E.164 ("+905551234567") or
 * empty; the person never types the "+" or the country code. TR: Bir telefon numarası, ülke ve o
 * ülkedeki numara olarak. Değer E.164 ya da boş; kişi "+" işaretini ve ülke kodunu hiç yazmıyor.
 *
 * WHY A COUNTRY LIST, NOT ONE BOX WITH A HINT: a hint can only show one country's example, and a
 * reader from elsewhere is left to know their own code and the "+". The list names the country in
 * the page's language (`Intl.DisplayNames`) and is searchable by name or by code. TR: NEDEN TEK
 * KUTU VE BİR ÖRNEK DEĞİL: örnek tek bir ülkeninkini gösterebiliyor, başka ülkeden okuyan kendi
 * kodunu ve "+"yı bilmek zorunda kalıyordu.
 *
 * THE FIRST GUESS IS THE CALLER'S (`defaultCountry`), usually from the person's time zone through
 * `countryForTimeZone`. A stored number decides its own country. TR: İLK TAHMİN ÇAĞIRANIN; çoğu
 * zaman kişinin saat diliminden. Kayıtlı bir numara kendi ülkesini kendisi söylüyor.
 */
export function PhoneField({
  value,
  onChange,
  defaultCountry = "TR",
  locale,
  labels,
  disabled = false,
  invalid = false,
  id,
  "aria-describedby": tarif,
  className,
  ...rest
}: {
  /** E.164 ("+905551234567") or "". TR: E.164 ya da boş. */
  value: string;
  onChange: (value: string) => void;
  /** ISO 3166 code of the first guess. TR: İlk tahminin ISO 3166 kodu. */
  defaultCountry?: string;
  /** Language the country names are written in; the browser's when omitted. TR: Ülke adlarının dili. */
  locale?: string;
  labels: {
    /** Accessible name of the country list. TR: Ülke listesinin erişilebilir adı. */
    country: string;
    /** Accessible name of the number box. TR: Numara kutusunun erişilebilir adı. */
    number: string;
    empty: string;
    clear: string;
    open: string;
  };
  disabled?: boolean;
  invalid?: boolean;
  /** Goes to the number box, so a `Field` label points at what is typed. TR: Numara kutusuna gidiyor. */
  id?: string;
  "aria-describedby"?: string;
  className?: string;
  [k: `data-${string}`]: unknown;
}) {
  const ilk = ISO.has(defaultCountry) ? defaultCountry : "TR";
  const [hal, setHal] = useState(() => coz(value, ilk));
  /* DIŞARIDAN GELEN DEĞER: kendi yazdığımızın aynısı değilse (kayıt yüklendi, form sıfırlandı)
     yeniden çözülüyor. Aynısıysa dokunulmuyor, yoksa yazılan boşluklar her tuşta siliniyordu. */
  const son = useRef(value);
  if (value !== son.current) {
    son.current = value;
    if (value !== birlestir(hal.iso, hal.ulusal)) setHal(coz(value, ilk));
  }

  const secenekler = useMemo(() => {
    let adlar: Intl.DisplayNames | null = null;
    try {
      adlar = new Intl.DisplayNames(locale ? [locale] : undefined, { type: "region" });
    } catch {
      adlar = null;
    }
    return ULKELER.map((u) => ({
      value: u.iso,
      label: `${adlar?.of(u.iso) ?? u.iso} +${u.kod}`,
    })).sort((a, b) => a.label.localeCompare(b.label, locale));
  }, [locale]);

  function yaz(iso: string, ulusal: string) {
    setHal({ iso, ulusal });
    const yeni = birlestir(iso, ulusal);
    son.current = yeni;
    onChange(yeni);
  }

  return (
    <span
      {...dataProps(rest)}
      className={cn("flex flex-col gap-2 sm:flex-row", className)}
    >
      <Combobox
        options={secenekler}
        value={hal.iso}
        /* Temizlemek bir ülke değil: liste boşalınca son seçim kalıyor. */
        onChange={(iso) => (iso ? yaz(iso, hal.ulusal) : undefined)}
        placeholder={labels.country}
        aria-label={labels.country}
        labels={{ empty: labels.empty, clear: labels.clear, open: labels.open }}
        disabled={disabled}
        invalid={invalid}
        className="shrink-0 sm:w-56"
      />
      <Input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        aria-label={labels.number}
        aria-describedby={tarif}
        aria-invalid={invalid || undefined}
        invalid={invalid}
        disabled={disabled}
        value={hal.ulusal}
        onChange={(e) => yaz(hal.iso, e.target.value)}
        className="min-w-0 flex-1"
      />
    </span>
  );
}
