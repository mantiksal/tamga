"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../lib/cn.js";
import { Icon } from "./icon.js";
import { Check, Close, Customize, Eye, EyeSlash, Search } from "./icons.js";

/* ------------------------------------------------------------------ *
 * Gelişmiş girdiler.
 *
 * Hepsinin ortak yanı: bir `<input>` ile yapılabilir GÖRÜNMESİ, ve
 * yapılamaması. Her biri tek bir somut hatanın karşılığı.
 * ------------------------------------------------------------------ */

/**
 * Parola alanı — göster/gizle düğmesiyle.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */
export function PasswordInput({
  labels,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> & {
  labels: { show: string; hide: string };
}) {
  const [shown, setShown] = useState(false);
  return (
    <span className="relative flex items-center">
      <input
        {...props}
        type={shown ? "text" : "password"}
        className={cn("tamga-input w-full pr-10", className)}
      />
      <button
        type="button"
        className="tamga-mini-btn absolute right-1.5"
        aria-label={shown ? labels.hide : labels.show}
        aria-pressed={shown}
        onClick={() => setShown((v) => !v)}
      >
        {/* GÖZ, güneş değil. Burası uzun süre `ThemeLight`/`ThemeDark`
            taşıdı, yani TEMA DÜĞMESİNİN glifleri: kullanıcı bir parola
            alanının yanında güneş görüyordu. `Eye`/`EyeSlash` ikon kaydında
            zaten duruyordu; uydurma değil, bakmama hatasıydı. */}
        <Icon icon={shown ? EyeSlash : Eye} size="xs" />
      </button>
    </span>
  );
}

/**
 * Maskeli sır — API anahtarı, webhook secret.
 *
 * `PasswordInput`'un kardeşi ama İŞİ TERS: parola alanına bir şey YAZILIR,
 * buraya yazılmaz — okunur ve kopyalanır. O yüzden salt-okunur, ve asıl
 * düğmesi kopyalama.
 *
 * Maske ilk ve son birkaç karakteri bırakıyor. Tamamen gizlemek, kullanıcının
 * "hangi anahtar bu" sorusunu cevapsız bırakır; üç anahtarı olan biri
 * hangisine baktığını bilemez.
 */
export function SecretField({
  value,
  labels,
  visibleChars = 4,
  className,
}: {
  value: string;
  labels: { reveal: string; hide: string; copy: string; copied: string; failed: string };
  /**
   * How many characters stay visible at each end. TR: Baştan ve sondan açıkta kalan karakter
   * sayısı.
   */
  visibleChars?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const timer = useRef<number>(undefined);

  /* Zamanlayıcı bir ref'te tutuluyor ve her tıklamada sıfırlanıyor.

     Öncesi çıplak bir `setTimeout`'tu ve iki şeyi birden bozuyordu: art arda
     iki tıklamada ilk zamanlayıcı hâlâ çalıştığı için etiket erken geri
     dönüyordu, ve bileşen 1.6 saniye içinde sökülürse zamanlayıcı ölü bir
     bileşene yazmaya çalışıyordu. */
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const masked =
    value.length <= visibleChars * 2
      ? "•".repeat(value.length)
      : `${value.slice(0, visibleChars)}${"•".repeat(8)}${value.slice(-visibleChars)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied("idle"), 1600);
  }

  return (
    <span className={cn("relative flex items-center", className)}>
      <input
        readOnly
        value={shown ? value : masked}
        className="tamga-input w-full pr-18 font-mono"
        /* Salt-okunur bir alan yine de odaklanabilir olmalı: kullanıcı onu
           seçip elle kopyalayabilsin. `disabled` bunu imkânsız kılardı. */
        onFocus={(e) => e.currentTarget.select()}
      />
      <span className="absolute right-1.5 flex gap-0.5">
        <button
          type="button"
          className="tamga-mini-btn"
          aria-label={shown ? labels.hide : labels.reveal}
          aria-pressed={shown}
          onClick={() => setShown((v) => !v)}
        >
          <Icon icon={shown ? EyeSlash : Eye} size="xs" />
        </button>
        <button
          type="button"
          className="tamga-mini-btn"
          aria-label={copied === "done" ? labels.copied : copied === "failed" ? labels.failed : labels.copy}
          onClick={copy}
        >
          <Icon icon={copied === "done" ? Check : Customize} size="xs" />
        </button>
      </span>
    </span>
  );
}

/**
 * Etiket girdisi.
 *
 * Enter ya da virgül bir etiketi kapatıyor; boşken Backspace sonuncuyu siliyor.
 * İkincisi küçük görünür ama en çok kullanılan yoldur — yanlış yazılan bir
 * etiketi silmek için fareye uzanmak, akışı kesen tek şeydir.
 *
 * Yinelenen ETİKET SESSİZCE YUTULUYOR, hata verilmiyor: aynı etiketi iki kez
 * yazmak bir hata değil, bir tekrardır, ve kullanıcı zaten istediğini almış
 * olur.
 */
export function TagsInput({
  value,
  onChange,
  placeholder,
  labels,
  max,
  className,
}: {
  value: readonly string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  labels: { remove: (tag: string) => string };
  /** The ceiling; the input closes once it is full. TR: Üst sınır; dolduğunda girdi kapanır. */
  max?: number;
  className?: string;
}) {
  const [draft, setDraft] = useState("");
  const full = max !== undefined && value.length >= max;

  function commit() {
    const tag = draft.trim();
    setDraft("");
    if (!tag || value.includes(tag) || full) return;
    onChange([...value, tag]);
  }

  return (
    <span
      className={cn("tamga-input h-auto min-h-10 w-full flex-wrap items-center gap-1.5 py-1.5", className)}
      style={{ display: "flex" }}
    >
      {value.map((tag) => (
        <span key={tag} className="tamga-chip gap-1">
          {tag}
          <button
            type="button"
            aria-label={labels.remove(tag)}
            onClick={() => onChange(value.filter((x) => x !== tag))}
            className="-mr-1 inline-flex items-center"
          >
            <Icon icon={Close} size="xs" />
          </button>
        </span>
      ))}
      {!full ? (
        <input
          value={draft}
          placeholder={value.length === 0 ? placeholder : undefined}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
              onChange(value.slice(0, -1));
            }
          }}
          className="min-w-24 flex-1 bg-transparent text-body text-ink outline-none"
        />
      ) : null}
    </span>
  );
}

/**
 * Çoklu seçim — aranabilir.
 *
 * `Combobox` tek seçim yapar; bu birden çok. Ayrı bileşen olmasının sebebi
 * görünüm değil DAVRANIŞ: tek seçimde liste seçince kapanır, çoklu seçimde
 * KAPANMAZ — üç şey seçecek biri listeyi üç kez açmak zorunda kalmamalı.
 *
 * Seçilenler girdinin İÇİNDE çip olarak duruyor, altında ayrı bir listede
 * değil: seçim ile seçilenler arasındaki mesafe arttıkça, kullanıcı neyi
 * seçtiğini görmek için gözünü iki yere birden koymak zorunda kalır.
 */
export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  labels,
  className,
}: {
  options: readonly { value: string; label: string; hint?: string }[];
  value: readonly string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  labels: { empty: string; remove: (label: string) => string; open: string };
  className?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const box = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);

  const shown = options.filter(
    (o) => !query || o.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  const chosen = options.filter((o) => value.includes(o.value));

  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }

  /**
   * KLAVYE, ve onsuz bu kontrol yarım.
   *
   * Etiket eklemenin doğal yolu YAZIP ENTER'A BASMAK: kullanıcı "adidas" yazıp
   * Enter, "nike" yazıp Enter diyor ve iki çip ekliyor. Önce yalnız fareyle
   * çalışıyordu; yazdıktan sonra listeye uzanıp tıklamak gerekiyordu, ve
   * klavyeyle gezen biri seçim yapamıyordu.
   *
   *   Enter       vurgulanan seçeneği ekler/çıkarır, ve kutuyu boşaltır
   *   Ok tuşları  vurguyu gezdirir
   *   Backspace   kutu BOŞKEN son çipi kaldırır (yazarken silmeye karışmaz)
   *   Escape      listeyi kapatır
   */
  function tus(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, shown.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      const o = shown[active] ?? shown[0];
      if (!o) return;
      e.preventDefault();
      toggle(o.value);
      setQuery("");
      setActive(0);
      return;
    }
    if (e.key === "Backspace" && query === "" && value.length > 0) {
      /* Yazarken Backspace harf siler; yalnız kutu boşken çipe dokunuyor. */
      e.preventDefault();
      onChange(value.slice(0, -1));
      return;
    }
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div
      ref={box}
      className={cn("relative", className)}
      /* Odak kutunun DIŞINA çıkınca kapanıyor — tıklama dinleyicisiyle değil.
         Dışarı tıklamayı dinlemek klavyeyle çıkanı görmez ve liste açık kalır. */
      onBlur={(e) => {
        if (!box.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      {/* BÜYÜTEÇ SABİT, ÇİPLERİN PEŞİNDE DEĞİL.
          Önce esnek kutunun SON çocuğuydu: çipler sarınca satır atlıyor ve
          ikinci, üçüncü satırın sağ altına düşüyordu. Bir simge bir yer
          işaretidir; yeri her seçimde değişiyorsa işaret olmaktan çıkıyor.
          Kitin kendi `data-leading` mekanizmasıyla sol başa sabitlendi
          (`.tamga-input[data-leading]` 40px sol dolgu açıyor), ve ilk satıra
          hizalı duruyor: kutu büyüdükçe simge yerinde kalıyor. */}
      <span
        className="tamga-input relative h-auto min-h-10 w-full flex-wrap items-center gap-1.5 py-1.5"
        data-leading="true"
        style={{ display: "flex" }}
      >
        <Icon
          icon={Search}
          size="xs"
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 text-ink-faint"
        />
        {chosen.map((o) => (
          <span key={o.value} className="tamga-chip gap-1">
            {o.label}
            <button
              type="button"
              aria-label={labels.remove(o.label)}
              onClick={() => toggle(o.value)}
              className="-mr-1 inline-flex items-center"
            >
              <Icon icon={Close} size="xs" />
            </button>
          </span>
        ))}
        <input
          value={query}
          placeholder={chosen.length === 0 ? placeholder : undefined}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={tus}
          onFocus={() => setOpen(true)}
          role="combobox"
          aria-expanded={open}
          aria-controls={id}
          aria-label={labels.open}
          className="min-w-24 flex-1 bg-transparent text-body text-ink outline-none"
        />
      </span>

      {open ? (
        <div id={id} role="listbox" aria-multiselectable className="tamga-overlay absolute z-30 mt-2 max-h-64 w-full overflow-y-auto py-1">
          {shown.length === 0 ? (
            <p className="px-4 py-3 text-small text-ink-faint">{labels.empty}</p>
          ) : (
            shown.map((o, i) => {
              const on = value.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={on}
                  data-selected={on}
                  /* Vurgulanan seçenek: Enter'ın hangisini ekleyeceğini
                     görmeden yazmak, karanlıkta tuşa basmak demek. */
                  data-active={i === active || undefined}
                  className="tamga-option w-full"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => toggle(o.value)}
                >
                  <span className="flex-1 text-left">{o.label}</span>
                  {o.hint ? <span className="font-mono text-caption text-ink-faint">{o.hint}</span> : null}
                  {on ? <Icon icon={Check} size="xs" /> : null}
                </button>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Zamanlama girdisi — "her N dakikada bir".
 *
 * NEDEN CRON DEĞİL. Bir cron ifadesi (yıldız-eğik-beş biçimi) bir geliştirici
 * için okunur, bir panel
 * kullanıcısı için değildir — ve yanlış yazılan bir cron ifadesi hata
 * vermez, sadece yanlış zamanda çalışır. Bu bileşen kürasyonlu bir liste
 * sunuyor: kürasyonlu seçenek, serbestlik değil.
 *
 * Aralıklar dakika olarak veriliyor, çevirisi çağıranın: "5 dakika" ile
 * "5 minutes" arasındaki farkı kit bilemez.
 */
export function ScheduleInput({
  value,
  onChange,
  options,
  label,
  className,
}: {
  /** The interval, in minutes. TR: Dakika cinsinden aralık. */
  value: number;
  onChange: (minutes: number) => void;
  /**
   * `[{ minutes: 5, label: "5 minutes" }, …]`: ordered and curated. TR: `[{ minutes: 5, label:
   * "5 dakika" }, …]`: sıralı ve kürasyonlu.
   */
  options: readonly { minutes: number; label: string }[];
  label: string;
  className?: string;
}) {
  return (
    <select
      className={cn("tamga-input w-full", className)}
      aria-label={label}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {options.map((o) => (
        <option key={o.minutes} value={o.minutes}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
