"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../lib/cn.js";
import { inputVariants } from "./input.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import { Check, Clock, Close, Copy, Customize, Eye, EyeSlash, Key, Search } from "./icons.js";

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
  strength,
  invalid = false,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> & {
  labels: { show: string; hide: string };
  /**
   * The strength meter under the field: `value` bars lit out of `of`, and `note` the line saying
   * what is still missing. The kit LIGHTS the bars, it does not judge the password: what counts
   * as strong is a policy, and a policy belongs to the product. TR: Alanın altındaki güç
   * göstergesi: `of` çubuğun `value` tanesi yanıyor, `note` neyin eksik olduğunu söyleyen satır.
   * Kit çubukları YAKIYOR, parolayı yargılamıyor: neyin güçlü sayıldığı bir politika, ve politika
   * ürünün.
   */
  strength?: { value: number; of?: number; note?: string };
  /**
   * The field failed validation: it takes the error edge and sets `aria-invalid`, so the failure is
   * announced as well as shown. TR: Alan doğrulamadan geçemedi: hata kenarını alıyor ve
   * `aria-invalid` koyuyor, yani hata görünmekle kalmıyor duyuruluyor da.
   */
  invalid?: boolean;
}) {
  const [shown, setShown] = useState(false);
  const alan = (
    <span className="relative flex items-center">
      {/* SINIF TABLOSU KİTİN KENDİ TABLOSU. Burada `tamga-input` elle yazılıydı,
          yani `inputVariants`a bir kural eklendiği gün parola alanı onu almazdı:
          aynı kontrolün iki uygulaması. Genişlik kabuğun kendi kararı — alanın
          içinde bir düğme duruyor ve daralan bir alan onu metnin üstüne bindirir. */}
      <input
        type={shown ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={cn(inputVariants({ invalid }), "w-full pr-11", className)}
        {...props}
      />
      <button
        type="button"
        className="tamga-field-btn"
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

  if (!strength) return alan;

  const toplam = strength.of ?? 4;
  const yanan = Math.max(0, Math.min(toplam, strength.value));
  return (
    <span className="flex flex-col gap-2.5">
      {alan}
      {/* ÇUBUKLAR EŞİT GENİŞLİKTE: dolan tek bir çubuk "ne kadar" diyor, oysa
          buradaki soru "kaç kural karşılandı" · dördü de aynı boyda olmalı. */}
      <span className="tamga-guc" style={{ gridTemplateColumns: `repeat(${toplam}, 1fr)` }}>
        {Array.from({ length: toplam }, (_, i) => (
          <span key={i} data-dolu={i < yanan || undefined} />
        ))}
      </span>
      {strength.note ? <span className="text-small text-ink-faint">{strength.note}</span> : null}
    </span>
  );
}

/**
 * Maskeli sır · API anahtarı, webhook secret. `PasswordInput`un kardeşi ama işi
 * TERS: buraya yazılmıyor, okunup kopyalanıyor, o yüzden salt-okunur. Maske ilk
 * ve son birkaç karakteri bırakıyor.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */
export function SecretField({
  value,
  labels,
  visibleChars = 4,
  className,
  ...rest
}: {
  value: string;
  labels: { reveal: string; hide: string; copy: string; copied: string; failed: string };
  /**
   * How many characters stay visible at each end. TR: Baştan ve sondan açıkta kalan karakter
   * sayısı.
   */
  visibleChars?: number;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
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
    /* EYLEMLER ALANIN DIŞINDA, içinde değil. Bir sır YAZILMIYOR okunuyor: alan
       salt-okunur bir plaka, göster ve kopyala onun üstünde işlem yapan iki
       gerçek düğme · alanın içine sıkışmış iki mini düğme, kopyalamayı bir
       kenar süsü gibi gösteriyordu. */
    <span {...dataProps(rest)} className={cn("flex flex-wrap items-center gap-2.5", className)}>
      <span className="tamga-secret">
        <Icon icon={Key} size="xs" className="shrink-0 text-ink-faint" />
        <input readOnly value={shown ? value : masked} onFocus={(e) => e.currentTarget.select()} />
      </span>
      <button
        type="button"
        className="tamga-icon-btn"
        aria-label={shown ? labels.hide : labels.reveal}
        aria-pressed={shown}
        onClick={() => setShown((v) => !v)}
      >
        <Icon icon={shown ? EyeSlash : Eye} size="sm" />
      </button>
      <button type="button" className="tamga-btn" onClick={copy}>
        <Icon icon={copied === "done" ? Check : Copy} size="xs" />
        {copied === "done" ? labels.copied : copied === "failed" ? labels.failed : labels.copy}
      </button>
    </span>
  );
}

/**
 * Etiket girdisi · Enter ya da virgül bir etiketi kapatıyor, boşken Backspace
 * sonuncuyu siliyor. Yinelenen etiket SESSİZCE yutuluyor, hata verilmiyor.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */
export function TagsInput({
  value,
  onChange,
  placeholder,
  labels,
  max,
  className,
  ...rest
}: {
  value: readonly string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  labels: { remove: (tag: string) => string };
  /** The ceiling; the input closes once it is full. TR: Üst sınır; dolduğunda girdi kapanır. */
  max?: number;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const [draft, setDraft] = useState("");
  const [silinecek, setSilinecek] = useState<number | null>(null);
  const full = max !== undefined && value.length >= max;

  function commit() {
    const tag = draft.trim();
    setDraft("");
    if (!tag || value.includes(tag) || full) return;
    onChange([...value, tag]);
  }

  return (
    <span
{...dataProps(rest)}
      className={cn("tamga-input h-auto min-h-10 w-full flex-wrap items-center gap-1.5 py-1.5", className)}
      style={{ display: "flex" }}
    >
      {value.map((tag, i) => (
        /* `tamga-chip` DEĞİL `tamga-token`: çip okunan bir durum işareti, bu ise
           kaldırılabilen bir şey. İkisi aynı sınıftayken bir etiket, bir durumu
           söylüyormuş gibi okunuyordu. */
        <span key={tag} className="tamga-token" data-silinecek={i === silinecek || undefined}>
          {tag}
          <button
            type="button"
            aria-label={labels.remove(tag)}
            onClick={() => onChange(value.filter((x) => x !== tag))}
            className="tamga-token-x"
          >
            <Icon icon={Close} size="xs" />
          </button>
        </span>
      ))}
      {!full ? (
        <input
          value={draft}
          placeholder={value.length === 0 ? placeholder : undefined}
          onChange={(e) => {
            setDraft(e.target.value);
            setSilinecek(null);
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
              /* İKİ ADIM: ilk Backspace son etiketi İŞARETLİYOR, ikincisi
                 siliyor. Tek adımlı hâlinde bir tuş fazla basan kişi
                 yazdığı etiketi silip fark etmiyordu; işaretli hâl o bir
                 karelik duraklamayı veriyor. Başka bir tuş işareti kaldırıyor. */
              if (silinecek === value.length - 1) {
                onChange(value.slice(0, -1));
                setSilinecek(null);
              } else {
                setSilinecek(value.length - 1);
              }
            } else {
              setSilinecek(null);
            }
          }}
          className="min-w-24 flex-1 bg-transparent text-body text-ink outline-none"
        />
      ) : null}
    </span>
  );
}

/**
 * Çoklu seçim · aranabilir. `Combobox`tan ayrı olmasının sebebi görünüm değil
 * DAVRANIŞ: çoklu seçimde liste seçince KAPANMIYOR. Seçilenler girdinin içinde
 * çip olarak duruyor.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */
/* Kutuda yazıyla duran çip sayısı. Dördüncüden sonrası "+N". Tek başına
   YETMİYOR: uzun etiketlerde dört çip de üç satırı aşıyor, o yüzden kutunun
   ayrıca bir tavanı var (aşağıda) ve orada kayıyor. */
const GORUNEN_CIP = 4;

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  labels,
  className,
  ...rest
}: {
  options: readonly ({ value: string; label: string; hint?: string } & Record<string, unknown>)[];
  value: readonly string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  labels: { empty: string; remove: (label: string) => string; open: string };
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
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

  /* KLAVYE, ve onsuz bu kontrol yarım:
       Enter       vurgulanan seçeneği ekler/çıkarır, ve kutuyu boşaltır
       Ok tuşları  vurguyu gezdirir
       Backspace   kutu BOŞKEN son çipi kaldırır (yazarken silmeye karışmaz)
       Escape      listeyi kapatır */
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
{...dataProps(rest)}
      ref={box}
      className={cn("relative", className)}
      /* Odak kutunun DIŞINA çıkınca kapanıyor — tıklama dinleyicisiyle değil.
         Dışarı tıklamayı dinlemek klavyeyle çıkanı görmez ve liste açık kalır. */
      onBlur={(e) => {
        if (!box.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      {/* BÜYÜTEÇ SABİT, ÇİPLERİN PEŞİNDE DEĞİL: `data-leading` ile sol başa sabitli
          (`.tamga-input[data-leading]` 40px sol dolgu açıyor). Bir simge bir yer
          işaretidir; yeri her seçimde değişiyorsa işaret olmaktan çıkıyor.
          Gerekçe: docs/gerekce/01-form-ve-girdi.md */}
      {/* İKON KUTUNUN DIŞINDA, kökün içinde: kutu artık kayabiliyor ve içine
          konan mutlak bir öge içerikle birlikte kayıp gözden kaybolurdu. */}
      <Icon
        icon={Search}
        size="xs"
        aria-hidden
        className="pointer-events-none absolute left-3 top-3 z-10 text-ink-faint"
      />
      {/* TAVAN ÜÇ SATIR, sonrası kaydırma: uzun etiketli dört çip kutuyu üç
          satıra çıkarıyor ve altındaki alanı aşağı itiyordu. 26 x 4px = 104px =
          üç çip satırı (26) artı aralıkları (6) artı dolgu (6). */}
      <span
        className="tamga-input relative h-auto max-h-26 min-h-10 w-full flex-wrap items-center gap-1.5 overflow-y-auto py-1.5"
        data-leading="true"
        style={{ display: "flex" }}
      >
        {/* ÇİPLER SAYILI: ilk dördü yazılı, gerisi "+N" olarak tek çipte.
            Sınırsız çip kutuyu üç satıra çıkarıyor ve altındaki alanı aşağı
            itiyordu; seçilenlerin TAMAMI zaten listede işaretli duruyor. */}
        {chosen.slice(0, GORUNEN_CIP).map((o) => (
          <span key={o.value} className="tamga-token">
            {o.label}
            <button
              type="button"
              aria-label={labels.remove(o.label)}
              /* Aynı sebep: çipi kaldırmak odağı girdiden almamalı. */
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => toggle(o.value)}
              className="tamga-token-x"
            >
              <Icon icon={Close} size="xs" />
            </button>
          </span>
        ))}
        {chosen.length > GORUNEN_CIP ? (
          <span className="tamga-token" aria-hidden>
            +{chosen.length - GORUNEN_CIP}
          </span>
        ) : null}
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
        <div id={id} role="listbox" aria-multiselectable className="tamga-overlay tamga-menu absolute z-30 mt-2 max-h-64 w-full overflow-y-auto">
          {shown.length === 0 ? (
            <p className="px-4 py-3 text-small text-ink-faint">{labels.empty}</p>
          ) : (
            shown.map(({ value: v, label: etiket, hint, ...rest }, i) => {
              const on = value.includes(v);
              return (
                <button
                  key={v}
                  {...rest}
                  type="button"
                  role="option"
                  aria-selected={on}
                  data-selected={on}
                  /* Vurgulanan seçenek: Enter'ın hangisini ekleyeceğini
                     görmeden yazmak, karanlıkta tuşa basmak demek. */
                  data-active={i === active || undefined}
                  className="tamga-option w-full"
                  onMouseEnter={() => setActive(i)}
                  /* ODAK GİRDİDE KALIYOR, ve Safari'de bu bir SÜS DEĞİL: Safari
                     tıklanan düğmeye odak vermiyor, yani girdi odağı kaybediyor,
                     aşağıdaki `onBlur` listeyi kapatıyor ve seçenek tıklama
                     gerçekleşmeden DOM'dan siliniyor · seçim hiç olmuyordu. */
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => toggle(v)}
                >
                  <span className="flex-1 text-left">{etiket}</span>
                  {hint ? <span className="font-mono text-caption text-ink-faint">{hint}</span> : null}
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
 * Zamanlama girdisi · "her N dakikada bir". NEDEN CRON DEĞİL: kürasyonlu
 * seçenek, serbestlik değil. Aralıklar dakika olarak veriliyor, çevirisi
 * çağıranın.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */
export function ScheduleInput({
  days,
  onDaysChange,
  from,
  to,
  onFromChange,
  onToChange,
  labels,
  summary,
  className,
  ...rest
}: {
  /** Selected weekdays, 0 Sunday to 6 Saturday. TR: Seçili günler, 0 Pazar ile 6 Cumartesi arası. */
  days: readonly number[];
  onDaysChange: (next: number[]) => void;
  /** "09:00". TR: "09:00". */
  from: string;
  to: string;
  onFromChange: (next: string) => void;
  onToChange: (next: string) => void;
  /**
   * Every visible word. `dayNames` starts at Sunday and is written short ("Pzt"); `zone` is the
   * line after the hours ("Istanbul (GMT+3)"), and it is optional. TR: Görünen her sözcük.
   * `dayNames` Pazar'dan başlıyor ve kısa yazılıyor ("Pzt"); `zone` saatlerin ardındaki satır
   * ("İstanbul (GMT+3)") ve isteğe bağlı.
   */
  labels: {
    days: string;
    dayNames: readonly string[];
    hours: string;
    between: string;
    zone?: string;
  };
  /**
   * The schedule in one human sentence, built by the caller: "Every weekday between 09:00 and
   * 18:00". The kit cannot write it, because the sentence is grammar and the kit does not
   * translate. TR: Zamanlamanın tek cümlelik insan hâli, çağıran kuruyor: "Her hafta içi
   * 09:00-18:00 arası". Kit yazamaz, çünkü cümle bir dilbilgisi işi ve kit çeviri yapmaz.
   */
  summary: string;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const secili = new Set(days);
  const cevir = (g: number) => {
    const next = new Set(secili);
    if (next.has(g)) next.delete(g);
    else next.add(g);
    onDaysChange([...next].sort((a, b) => a - b));
  };

  return (
    <div {...dataProps(rest)} className={cn("flex flex-col gap-4", className)}>
      {/* GÜNLER YEDİ DÜĞME, bir çoklu seçim listesi değil: yedi seçenek bir
          listeyi açmaya değmez, ve hangi günlerin seçili olduğu tek bakışta
          görünmek zorunda. Seçili gün BASILI duruyor (Yasa 2'nin kendisi). */}
      <div role="group" aria-label={labels.days} className="flex flex-wrap gap-2">
        {labels.dayNames.map((ad, g) => (
          <button
            key={ad}
            type="button"
            aria-pressed={secili.has(g)}
            onClick={() => cevir(g)}
            className="tamga-gun-btn"
            data-on={secili.has(g) || undefined}
          >
            {ad}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 text-body">
        <span className="font-semibold text-ink">{labels.hours}</span>
        <input
          type="time"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          aria-label={labels.hours}
          className="tamga-input tamga-sayi w-auto"
        />
        <span className="text-ink-faint">{labels.between}</span>
        <input
          type="time"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          aria-label={labels.between}
          className="tamga-input tamga-sayi w-auto"
        />
        {labels.zone ? <span className="text-ink-faint">{labels.zone}</span> : null}
      </div>

      {/* ÖZET CÜMLE, ve kontrollerin altında: yedi düğme ile iki saat kutusu
          birlikte bir CÜMLE kuruyor, ama o cümleyi okuyucu kafasında kurmak
          zorunda kalmamalı. Geçersiz bir kombinasyon da burada görünür olur. */}
      <p className="tamga-ozet">
        <Icon icon={Clock} size="xs" weight="bold" className="text-accent" />
        {summary}
      </p>
    </div>
  );
}
