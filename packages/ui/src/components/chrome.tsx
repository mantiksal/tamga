"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { Avatar } from "./avatar.js";
import { Icon } from "./icon.js";
import { Select } from "./primitives.js";
import { Switch } from "./switch.js";
import { ThemeDark, ThemeLight } from "./icons.js";

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
 * Açık/koyu tema düğmesi.
 *
 * SUNUCU TEMAYI BİLMEZ. İlk boyama her zaman açık temayla çıkar ve tercih
 * `useEffect` içinde uygulanır — yani koyu tema seçmiş biri bir kare boyunca
 * açık ekran görür. Bunu tamamen çözmenin tek yolu `<head>`'e engelleyici bir
 * script koymak, ve o script'in yeri KİT DEĞİL uygulamadır: kitin bir
 * `<head>`'i yoktur.
 *
 * `storageKey` bu yüzden bir prop: uygulama aynı anahtarı kendi script'inde
 * de okuyabilsin diye. İki taraf farklı anahtar kullanırsa tercih sessizce
 * kaybolur.
 *
 * Metinler dışarıdan geliyor. Kit çeviri yapmaz — ve bir düğmenin adı, içinde
 * metin olmadığı için erişilebilirliğin tamamıdır.
 *
 * İKİ BİÇİM, VE SEBEBİ ORANTI. `icon` sıkışık bir araç çubuğuna girer: 40×40,
 * tek simge. Ama yanında bir dil anahtarı gibi ANAHTAR biçimli bir kontrol
 * varsa, kare düğme onun iki katı yüksekliğinde durur ve şerit dengesiz
 * görünür. `switch` biçimi aynı iskeleti kullanıyor — iki uçta birer simge,
 * ortada kayan bir anahtar — yani ikisi yan yana aynı satırda oturuyor.
 */
export function ThemeToggle({
  labels,
  variant = "icon",
  storageKey = "tamga-theme",
  dark: controlled,
  onChange,
  className,
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
  labels: { toLight: string; toDark: string } | { light: string; dark: string };
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
  variant?: "icon" | "switch" | "select";
  storageKey?: string;
  className?: string;
}) {
  const owned = controlled === undefined;
  const [self, setSelf] = useState(false);
  const dark = owned ? self : controlled;

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
      <span className={cn("flex items-center gap-2", className)}>
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
 * Dil değiştirici.
 *
 * Kit YÖNLENDİRME YAPMAZ. `onChange` seçilen dili verir; nereye gidileceği —
 * `router.push`, tam sayfa yenileme, bir çerez yazıp yeniden yükleme —
 * uygulamanın kararı ve yönlendiricisine bağlı. Kitin `next/navigation`'a
 * bağlanması, onu bir framework'e bağlamak olurdu.
 *
 * Etiketler ENDONİM olmalı: "English", "İngilizce" değil. Bir dili arayan
 * kişi onu kendi dilinde arar. Kit bunu zorlayamaz ama doküman söyler.
 *
 * İki dilde SEGMENTED, üç ve fazlasında SELECT — kendiliğinden. İki seçenek
 * yan yana sığar ve tek tıkla değişir; beş dil yan yana konursa üst şeridi
 * doldurur ve altıncı dilde taşar.
 */
export function LocaleSwitcher({
  locales,
  current,
  onChange,
  label,
  className,
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
}) {
  if (locales.length <= 2) {
    return (
      <span className={cn("tamga-segment", className)} role="group" aria-label={label}>
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
  return (
    <select
      className={cn("tamga-input h-9 w-auto", className)}
      aria-label={label}
      value={current}
      onChange={(e) => onChange(e.target.value)}
    >
      {locales.map((l) => (
        <option key={l.value} value={l.value}>
          {l.label}
        </option>
      ))}
    </select>
  );
}

/**
 * Kare marka karosu.
 *
 * Bir logonun etrafındaki kutu. Görsel yoksa baş harf — `Avatar`'la aynı
 * gerekçe: gri bir yer tutucu hiçbir şeyi temsil etmez, bir harf gerçekten o
 * şeyi işaret eder.
 *
 * `alt` boş bırakılıyor ve bu bilinçli: karo neredeyse her zaman adı YANINDA
 * yazan bir şeyin yanında durur. İkisini de okutmak ekran okuyucuda adı iki
 * kez tekrarlar.
 */
export function LogoTile({
  name,
  src,
  size = "base",
  className,
}: {
  /**
   * The initial is built from it, and it is what shows when the image does not load. TR: Baş
   * harf buradan üretilir; görsel yüklenmezse görünen şey bu.
   */
  name: string;
  src?: string;
  size?: "base" | "sm";
  className?: string;
}) {
  return (
    <span className={cn("tamga-logo-tile", size === "sm" && "tamga-logo-tile-sm", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-contain p-1.5" />
      ) : (
        <span aria-hidden className="font-mono text-subhead font-semibold text-ink-faint">
          {name.trim().charAt(0).toLocaleUpperCase()}
        </span>
      )}
    </span>
  );
}

/**
 * Şeridin sağ ucundaki hesap düğmesi.
 *
 * NEDEN BİR BİLEŞEN, VE SAYARAK. İki panelde de aynı şey elle kuruldu:
 * `<button className="tamga-icon-btn"><Avatar bare …/></button>`. `Avatar`ın
 * `bare` prop'u tam bu iş için var ve JSDoc'u bunu anlatıyor, ama bulunmadı;
 * ikinci kurulumda avatar kendi çerçevesiyle kondu ve şeritteki öteki
 * kontrollerden farklı boyda durdu. Bulunmayan bir prop, olmayan proptur.
 *
 * ÖLÇÜ ŞERİDİN ÖLÇÜSÜ. Kare `--control` (40px), yani tema anahtarı ve öteki
 * simge düğmeleriyle birebir aynı. Bir araç çubuğunda yükseklik tek karardır;
 * tek bir kontrolün farklı durması bütün şeridi hizasız gösteriyor.
 *
 * FOTOĞRAF YOKSA BAŞ HARFLER: `Avatar` zaten öyle davranıyor, ve bir hesabın
 * fotoğrafı olmaması normal hâl.
 */
export function AccountButton({
  name,
  src,
  label,
  onClick,
  href,
  linkComponent: Link,
  className,
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
}) {
  const ic = (
    <Avatar name={name} src={src} size={38} bare />
  );
  const sinif = cn("tamga-icon-btn overflow-hidden p-0", className);

  if (href && Link) {
    return (
      <Link href={href} aria-label={label} className={sinif}>
        {ic}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} aria-label={label} className={sinif}>
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
