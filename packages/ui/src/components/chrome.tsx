"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Avatar } from "./avatar.js";
import { Icon } from "./icon.js";
import { Select } from "./primitives.js";
import { Segmented } from "./segmented.js";
import { Switch } from "./switch.js";
import { ThemeDark, ThemeLight, ThemeSystem } from "./icons.js";

/**
 * Kabuk parçaları.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */

/** Tarayıcı depolaması patlayabilir (özel pencere, kapalı site verisi). */
function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* tercih hatırlanmaz, sayfa yine çalışır */
  }
}

/**
 * Açık/koyu tema düğmesi · sunucu temayı bilmiyor, ilk kare her zaman açık
 * çıkıyor: engelleyici script uygulamanın işi, kitin bir `<head>`i yok.
 * `storageKey` bu yüzden prop, iki taraf aynı anahtarı okumak zorunda. İki
 * biçim (`icon` · `switch`) bir orantı kararı.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
/** The three answers a reader can give about theme. TR: Okuyucunun tema
 *  hakkında verebileceği üç cevap. */
export type ThemePreference = "light" | "dark" | "system";

export function ThemeToggle({
  labels,
  variant = "icon",
  preference,
  onPreferenceChange,
  storageKey = "tamga-theme",
  dark: controlled,
  onChange,
  className,
  ...rest
}: {
  /**
   * `icon` and `switch` need ACTION words, `select` needs STATE words. TR: `icon` ve `switch`
   * EYLEM sözcüğü ister, `select` DURUM sözcüğü.
   *
   * A button and a switch are pressed to DO something, so they are named by what pressing them
   * does ("switch to dark"). A select shows what is currently CHOSEN, so it is named by the
   * state ("Dark"). Reusing the action words in the select would put "Switch to dark theme" in
   * the box while the theme is already light: the control would be announcing its own opposite.
   * TR: Düğme ve anahtar bir şey YAPMAK için basılıyor, o yüzden basınca ne olacağıyla
   * adlandırılıyorlar ("koyu temaya geç"). Seçim kutusu ise o an SEÇİLİ olanı gösteriyor, yani
   * durumla adlandırılıyor ("Koyu"). Eylem sözcüklerini kutuda kullanmak, tema zaten açıkken
   * kutuda "Koyu temaya geç" yazması demekti: kontrol kendi tersini duyurur.
   */
  labels:
    | { toLight: string; toDark: string }
    | { light: string; dark: string }
    | { light: string; dark: string; system: string };
  /**
   * `segmented` only: which of the three the reader has chosen. TR: yalnız
   * `segmented`: okuyucunun üçünden hangisini seçtiği.
   *
   * WHY IT IS SEPARATE FROM `dark`. "System" is not a third shade, it is the
   * absence of a choice: the reader is saying "ask the machine". A boolean
   * cannot hold that, and a control that only offers two silently turns the
   * machine's answer into a decision the reader never made. TR: NEDEN `dark`TAN
   * AYRI. "Sistem" üçüncü bir ton değil, bir seçimin YOKLUĞU: okuyucu "makineye
   * sor" diyor. Bir boolean bunu tutamıyor, ve yalnız ikisini sunan bir kontrol
   * makinenin cevabını okuyucunun hiç vermediği bir karara dönüştürüyor.
   */
  preference?: ThemePreference;
  /** `segmented` only. TR: yalnız `segmented`. */
  onPreferenceChange?: (next: ThemePreference) => void;
  /**
   * The current theme, when the PRODUCT owns it. TR: O anki tema, temayı ÜRÜN tutuyorsa.
   *
   * Verildiğinde bu kontrol hafızasını bırakıyor: `localStorage`a yazmıyor, `.dark` sınıfına
   * dokunmuyor, yalnız gösteriyor ve `onChange` ile bildiriyor. Verilmediğinde tercihi kendi
   * saklıyor. Temayı zaten tutan bir uygulamada VER: yoksa iki yazar tek sınıf için yarışır.
   */
  dark?: boolean;
  /** Called when the reader asks for the other theme. TR: Okuyucu öteki temayı istediğinde çağrılıyor. */
  onChange?: (dark: boolean) => void;
  /**
   * `icon` a square button · `switch` the same shape as a language toggle · `select` a box that
   * says the current theme in words. TR: `icon` kare düğme · `switch` bir dil anahtarıyla aynı
   * şekil · `select` o anki temayı sözcükle yazan bir kutu.
   */
  variant?: "icon" | "switch" | "select" | "segmented";
  storageKey?: string;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  /* `segmented` TEMAYI ASLA SAHİPLENMİYOR: tercihi `preference` taşıyor, yani
     ürün tutuyor. Sahipliği `dark`ın verilip verilmediğine bakarak ölçmek,
     `.dark` sınıfını İŞLETİM SİSTEMİNDEN basmaya yol açıyordu.
     Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md */
  const owned = variant !== "segmented" && controlled === undefined;
  const [self, setSelf] = useState(false);
  /* `segmented` dalı buraya hiç gelmiyor (yukarıda dönüyor); `controlled`
     yalnız orada `undefined` olabiliyor, o yüzden yedek `false`. */
  const dark = owned ? self : (controlled ?? false);

  useEffect(() => {
    if (!owned) return;
    const saved = read(storageKey);
    const initial = saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setSelf(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, [owned, storageKey]);

  function toggle() {
    const next = !dark;
    onChange?.(next);
    if (!owned) return;
    setSelf(next);
    document.documentElement.classList.toggle("dark", next);
    write(storageKey, next ? "dark" : "light");
  }

  if (variant === "segmented") {
    /* DURUM SÖZCÜKLERİ ŞART: eksik bir etiket, ekran okuyucuya adsız bir düğme
       demek · kit çeviri üretmiyor (docs/08 kural 5). */
    if (!("light" in labels) || !("dark" in labels)) {
      throw new Error('ThemeToggle variant="segmented" için labels {light, dark} (ve tercihen system) olmalı');
    }
    if (preference === undefined || onPreferenceChange === undefined) {
      throw new Error('ThemeToggle variant="segmented" `preference` ve `onPreferenceChange` ister');
    }
    /* SİSTEM ETİKETİ VARSA ÜÇ, YOKSA İKİ · üçlü hâli önerilen kalıyor (bkz.
       `preference`). İkide etiketler görünüyor, üçte yalnız glif: üç metin
       kontrolü gereksiz uzatıyor.
       Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md */
    const ucluMu = "system" in labels;
    const secenek = (value: ThemePreference, icon: typeof ThemeLight, text: string) => ({
      value,
      label: (
        <>
          <Icon icon={icon} size="sm" />
          {ucluMu ? <span className="sr-only">{text}</span> : text}
        </>
      ),
    });
    return (
      <Segmented
        {...dataProps(rest)}
        className={cn(ucluMu && "tamga-segment-icons", className)}
        label={
          ucluMu
            ? `${labels.light} / ${labels.dark} / ${(labels as { system: string }).system}`
            : `${labels.light} / ${labels.dark}`
        }
        value={preference}
        onChange={onPreferenceChange}
        options={[
          secenek("light", ThemeLight, labels.light),
          secenek("dark", ThemeDark, labels.dark),
          ...(ucluMu
            ? [secenek("system", ThemeSystem, (labels as { system: string }).system)]
            : []),
        ]}
      />
    );
  }

  if (variant === "select") {
    /* DURUM SÖZCÜKLERİ ŞART, ve verilmediyse bu bir hata. Sessizce eylem
       sözcüklerine düşmek, kutuda kendi tersini yazan bir kontrol üretirdi. */
    if (!("light" in labels)) {
      throw new Error('ThemeToggle variant="select" için labels {light, dark} olmalı');
    }
    return (
      <Select
        options={[labels.light, labels.dark]}
        value={dark ? labels.dark : labels.light}
        onChange={(v) => {
          const next = v === labels.dark;
          if (next !== dark) toggle();
        }}
        placeholder={labels.light}
        aria-label={labels.light + " / " + labels.dark}
        className={cn("w-28", className)}
      />
    );
  }

  if (variant === "switch") {
    return (
      <span {...dataProps(rest)} className={cn("flex items-center gap-2", className)}>
        {/* Simgeler `aria-hidden`: anahtarın kendi adı zaten durumu söylüyor,
            ve üç şeyi birden okutmak aynı bilgiyi üç kez tekrarlardı. */}
        <Icon
          icon={ThemeLight}
          size="xs"
          aria-hidden
          className={dark ? "text-ink-faint" : "text-ink"}
        />
        <Switch
          on={dark}
          onChange={toggle}
          label={"toLight" in labels ? (dark ? labels.toLight : labels.toDark) : ""}
        />
        <Icon
          icon={ThemeDark}
          size="xs"
          aria-hidden
          className={dark ? "text-ink" : "text-ink-faint"}
        />
      </span>
    );
  }

  /* HANGİ GLİFİN GÖRÜNECEĞİNE CSS KARAR VERİYOR, React durumu değil.
     Sunucuda çizilen ilk kare temayı bilmiyor: durumla seçilen bir glif, tema
     çözülene kadar YANLIŞ olanı gösterip sonra takla atıyor. `dark:` yardımcısı
     kök sınıfla birlikte anında doğru olanı gösteriyor, hidrasyon beklemeden.
     Erişilebilir ad bunu yapamıyor (bir düğmenin tek bir adı olur), o yüzden o
     duruma bağlı kalıyor — ve kontrollü kullanımda ürün doğru değeri veriyor. */
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn("tamga-icon-btn", className)}
      aria-label={"toLight" in labels ? (dark ? labels.toLight : labels.toDark) : undefined}
    >
      <Icon icon={ThemeDark} size="sm" className="dark:hidden" />
      <Icon icon={ThemeLight} size="sm" className="hidden dark:block" />
    </button>
  );
}

/**
 * Dil değiştirici · kit YÖNLENDİRME YAPMAZ, `onChange` yalnız seçilen dili
 * verir. Etiketler endonim. İki dilde `Segmented`, üçten fazlasında `Select`.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
export function LocaleSwitcher({
  locales,
  current,
  onChange,
  label,
  className,
  ...rest
}: {
  /**
   * `[{ value: "tr", label: "Türkçe" }, …]`: the labels are endonyms. TR: `[{ value: "tr",
   * label: "Türkçe" }, …]`: etiketler endonim.
   */
  locales: readonly { value: string; label: string }[];
  current: string;
  onChange: (next: string) => void;
  /** The control's name: "Dil", "Language". TR: Kontrolün adı: "Dil", "Language". */
  label: string;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  if (locales.length <= 2) {
    return (
      <span {...dataProps(rest)} className={cn("tamga-segment", className)} role="group" aria-label={label}>
        {locales.map((l) => (
          <button
            key={l.value}
            type="button"
            data-active={l.value === current}
            aria-current={l.value === current ? "true" : undefined}
            onClick={() => onChange(l.value)}
          >
            {l.label}
          </button>
        ))}
      </span>
    );
  }
  /* ÜÇ VE ÜZERİ DİLDE KİTİN KENDİ SEÇİMİ, tarayıcınınki DEĞİL · bir süre düz
     bir `<select>` çiziliyordu: oku işletim sisteminin, açılan listesi
     işletim sisteminin, ve kitin hiçbir kuralı orada geçmiyordu. */
  return (
    <Select
      className={cn("w-auto min-w-40", className)}
      aria-label={label}
      placeholder={label}
      options={locales}
      value={current}
      onChange={onChange}
    />
  );
}

/**
 * Kare marka karosu · görsel yoksa baş harf. `alt` bilerek boş: karo
 * neredeyse her zaman adı yanında yazan bir şeyin yanında duruyor.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
export function LogoTile({
  name,
  src,
  size = "base",
  className,
  ...rest
}: {
  /**
   * The initial is built from it, and it is what shows when the image does not load. TR: Baş
   * harf buradan üretilir; görsel yüklenmezse görünen şey bu.
   */
  name: string;
  src?: string;
  size?: "base" | "sm";
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <span {...dataProps(rest)} className={cn("tamga-logo-tile", size === "sm" && "tamga-logo-tile-sm", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-contain p-1.5" />
      ) : (
        /* HARF MARKANIN HARFİ: display yüzü, en ağır kesim ve vurgu rengi.
           Mono ve soluk çizildiğinde karo bir logo yerine bir KOD gibi
           okunuyordu · oysa bu kutu görselin yerini tutuyor. */
        <span aria-hidden className="font-display text-subhead font-black text-accent">
          {name.trim().charAt(0).toLocaleUpperCase()}
        </span>
      )}
    </span>
  );
}

/**
 * Şeridin sağ ucundaki hesap düğmesi · ölçüsü şeridin ölçüsü (`--control`,
 * 40px), fotoğraf yoksa baş harfler.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
export function AccountButton({
  name,
  src,
  label,
  onClick,
  href,
  linkComponent: Link,
  className,
  ...rest
}: {
  /** The name initials are taken from; shown when there is no photo. TR: Baş harflerin çıkarıldığı ad; fotoğraf yoksa görünen bu. */
  name: string;
  src?: string;
  /** Accessible name: "Account menu", "Profile". The caller translates it. TR: Erişilebilir ad: "Hesap menüsü", "Profil". Çağıran çeviriyor. */
  label: string;
  onClick?: () => void;
  /** Makes the control a link instead of a button; not used together with `onClick`. TR: Verilirse düğme bir bağlantı olur; `onClick` ile birlikte kullanılmaz. */
  href?: string;
  linkComponent?: ComponentType<{ href: string; className?: string; children?: ReactNode; [k: string]: unknown }>;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const ic = (
    <Avatar name={name} src={src} size={38} bare />
  );
  const sinif = cn("tamga-account-btn", className);

  if (href && Link) {
    return (
      <Link href={href} aria-label={label} className={sinif}>
        {ic}
      </Link>
    );
  }
  if (href) {
    return (
      <a {...dataProps(rest)} href={href} aria-label={label} className={sinif}>
        {ic}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={label} className={sinif}>
      {ic}
    </button>
  );
}
