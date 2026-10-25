"use client";

import { Fragment, useId, useState, type ReactNode } from "react";
import { Button, buttonVariants } from "../components/button.js";
import { Combobox } from "../components/combobox.js";
import { MultiSelect } from "../components/advanced-input.js";
import { DatePicker } from "../components/date-picker.js";
import { Icon } from "../components/icon.js";
import { Close, Customize, Search, Upload } from "../components/icons.js";
import type { IconGlyph } from "../components/icons.js";
import type { Tone } from "../components/tone.js";
import { Input } from "../components/input.js";
import { Select, Sheet } from "../components/primitives.js";
import { SelectPanel } from "../components/select-panel.js";

/**
 * FİLTRE ÇUBUĞU · birkaç alan üstte, gerisi çekmecede, VE çekmecede bir şey
 * açıksa bunu görüyorsun: uygulanan her filtre tablonun üstünde bir çip.
 * Çekmecedeki alanlar bir `<form>` içinde, yani Enter'ı tarayıcı uyguluyor.
 *
 * Gerekçe: docs/gerekce/08-blok-ve-sablon.md
 */

/** Filtre durumunun tamamı: anahtar → dizgi. Boş dizgi "filtre yok" demek. */
export type FilterValues = Record<string, string>;

export type FilterFieldKind =
  | "text"
  | "select"
  /** Aranabilir seçim: seçenek sayısı göz gezdirmenin ötesine geçtiğinde. */
  | "searchable"
  /**
   * ÇOKLU seçim, çip olarak. Tek seçimden farkı bir kolaylık değil bir ANLAM:
   * "Nike VEYA Adidas" ile "Nike" aynı soru değil.
   */
  | "multi"
  /** İKİ TARİH: başlangıç ve bitiş. Tek bir kutu bir aralık soramaz. */
  | "dateRange";

/**
 * An option whose stored VALUE differs from its shown LABEL: the address carries `critical`, the
 * box shows "Kritik". A plain string is both at once. TR: Saklanan DEĞERİ ile görünen ADI
 * farklı seçenek: adres `critical` taşır, kutu "Kritik" gösterir. Düz dizgi ikisi birden.
 */
export type FilterOption = { value: string; label: string };

export type FilterField = {
  key: string;
  label: string;
  kind: FilterFieldKind;
  /**
   * Plain strings, or `{ value, label }` pairs. Falls back to `optionSource[key]`; with neither,
   * the list is empty. TR: Düz dizgiler ya da `{ value, label }` çiftleri. Verilmezse
   * `optionSource[key]`; ikisi de yoksa liste boş.
   */
  options?: readonly (string | FilterOption)[];
  /**
   * Start a new row before this field. TR: Bu alandan önce yeni bir satır başlat.
   *
   * WHY IT IS NOT AUTOMATIC. Fields wrap when they run out of room, and where
   * they break is a question of pixels: the same bar breaks in one place on a
   * laptop and another on a monitor. Sometimes the break is MEANING, not fit ·
   * "what am I searching for" on one line, "how do I narrow it" on the next ·
   * and only the caller knows which. Given, the break holds at every width.
   * TR: NEDEN KENDİLİĞİNDEN OLMUYOR. Alanlar yer kalmayınca satır atlıyor ve
   * nerede atladıkları bir piksel meselesi: aynı çubuk dizüstünde başka, geniş
   * ekranda başka yerde kırılıyor. Bazen kırılma bir ANLAM ayrımı, sığma
   * meselesi değil · "neyi arıyorum" bir satırda, "nasıl daraltıyorum" ötekinde
   * · ve bunu yalnız çağıran biliyor. Verilirse kırılma her genişlikte duruyor.
   */
  break?: boolean;
  /**
   * `look="chips"` only: the line at the top of the chip's panel, "Choose a customer"; absent,
   * the label. TR: Yalnız `look="chips"`: çipin panelinin başlığı, "Müşteri seçin"; yoksa ad.
   */
  panelTitle?: string;
  /**
   * A glyph before the value, naming what this filter is about. TR: Değerin
   * önünde, bu filtrenin neyle ilgili olduğunu söyleyen glif.
   *
   * Five boxes side by side all reading "All" are told apart only by the label
   * above them, so the eye travels up and back down for each one. TR: Yan yana
   * duran ve hepsi "Tümü" yazan beş kutuyu ayıran tek şey üstlerindeki etiket
   * oluyor; göz her biri için yukarı çıkıp geri iniyor.
   */
  icon?: IconGlyph;
  /**
   * A tone per option, for a filter whose items ARE states. TR: Öğeleri birer
   * DURUM olan filtrede, seçenek başına ton.
   *
   * Keyed by the option's VALUE (its text, for a plain string). The swatch it
   * draws is the same square the table's chip draws, so the eye matches the
   * list to the rows without reading either. Only where the option really is a
   * state. TR: Anahtar seçeneğin DEĞERİ (düz dizgide metni). Çizdiği kare,
   * tablodaki çipin çizdiği karenin aynısı · göz listeyi satırlara okumadan
   * eşliyor. Yalnız seçenek gerçekten bir durumsa.
   */
  tones?: Record<string, Tone>;
};

export type FilterGroup = { title: string; fields: FilterField[] };

/* Tarih aralığı İKİ ANAHTAR tutuyor. Tek bir dizgeye sıkıştırmak, sunucuya iki
   ayrı parametre giderken burada tekrar ayrıştırmak demekti. */
export const rangeStart = (key: string) => `${key}Start`;
export const rangeEnd = (key: string) => `${key}End`;

export type FilterBarLabels = {
  /** The search box's placeholder. TR: Arama kutusunun yer tutucusu. */
  search: string;
  /**
   * The name of the "All" option, and it sits INSIDE the list as an option. TR: "Hepsi" seçeneğinin adı, ve LİSTENİN İÇİNDE bir seçenek olarak duruyor.
   *
   * Kullanıcı bir değer seçtikten sonra tekrar hepsini görmek istediğinde,
   * geri dönüş yolunun GİDİŞ YOLUYLA AYNI YERDE olması gerekiyor. Kontrolün
   * yanına bir çarpı koymak her filtreye ikinci bir düğme ekler ve ancak seçim
   * varken görünür, yani kullanıcı onu aramayı öğrenemez.
   */
  all: string;
  allFilters: string;
  /**
   * The narrow screen's button, "Filter"; the count of applied filters follows it. Absent,
   * `allFilters` is used. TR: Dar ekranın düğmesi, "Filtrele"; uygulanan filtre sayısı peşine
   * gelir. Yoksa `allFilters`.
   */
  filter?: string;
  clearAll: string;
  clear: string;
  apply: string;
  noMatch: string;
  /** Like "Choose <field>"; the accessible name of the button that opens the control. TR: "<alan> seç" gibi; kontrolü açan düğmenin erişilebilir adı. */
  open: (label: string) => string;
  /** Like "Remove the <filter> filter". TR: "<filtre> filtresini kaldır". */
  remove: (label: string) => string;
  rangeStart: string;
  rangeEnd: string;
  calendar: { previousMonth: string; nextMonth: string; open: string; clear: string };
  /** The search-by-file section; with no `fileSearchKey` it is not drawn at all. TR: Dosyayla arama bölümü; `fileSearchKey` verilmezse hiç çizilmiyor. */
  fileSearch?: { title: string; help: ReactNode; choose: string; remove: string; label: string };
};

function FieldControl({
  field,
  values,
  write,
  optionSource,
  locale,
  labels,
  panel = false,
}: {
  field: FilterField;
  values: FilterValues;
  write: (key: string, value: string) => void;
  optionSource: Record<string, readonly (string | FilterOption)[]>;
  locale: string;
  labels: FilterBarLabels;
  /** Çip düzeninde seçim alanları panel: tam genişlikte, boşken "Tümü". */
  panel?: boolean;
}) {
  const options = secenekler(field, optionSource);
  if (panel && (field.kind === "select" || field.kind === "searchable" || field.kind === "multi")) {
    return <PanelAlani field={field} values={values} write={write} optionSource={optionSource} labels={labels} />;
  }

  /* HER KONTROLÜN ADI VAR: alanın adı bir <span>, kontrole bağlı değil; ekran
     okuyucu beş kutuyu da "Tümü" diye okuyordu. */
  if (field.kind === "dateRange") {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        <DatePicker
          locale={locale}
          aria-label={`${field.label} ${labels.rangeStart}`}
          value={values[rangeStart(field.key)] || undefined}
          onChange={(v) => write(rangeStart(field.key), v ?? "")}
          placeholder={labels.rangeStart}
          labels={labels.calendar}
        />
        <DatePicker
          locale={locale}
          aria-label={`${field.label} ${labels.rangeEnd}`}
          value={values[rangeEnd(field.key)] || undefined}
          onChange={(v) => write(rangeEnd(field.key), v ?? "")}
          placeholder={labels.rangeEnd}
          labels={labels.calendar}
        />
      </div>
    );
  }

  if (field.kind === "multi") {
    /* Değerler virgülle tek bir dizgede: filtre durumunun tamamı
       `Record<string,string>` ve bir alanın tipi yüzünden o sözleşmeyi
       değiştirmek, her ekranı ilgilendirirdi. */
    const selected = (values[field.key] ?? "").split(",").filter(Boolean);
    return (
      <MultiSelect
        className="w-full"
        aria-label={field.label}
        options={options}
        value={selected}
        onChange={(next) => write(field.key, next.join(","))}
        placeholder={labels.all}
        labels={{
          empty: labels.noMatch,
          remove: labels.remove,
          open: labels.open(field.label),
        }}
      />
    );
  }

  if (field.kind === "searchable") {
    return (
      <Combobox
        className="w-full"
        aria-label={field.label}
        options={options}
        value={values[field.key] || undefined}
        onChange={(v) => write(field.key, v ?? "")}
        placeholder={labels.all}
        labels={{ empty: labels.noMatch, clear: labels.clear, open: labels.open(field.label) }}
      />
    );
  }

  if (field.kind === "select") {
    return (
      <Select
        className="w-full"
        aria-label={field.label}
        icon={field.icon}
        options={[
          labels.all,
          ...options.map((o) => ({ value: o.value, label: o.label, tone: field.tones?.[o.value] })),
        ]}
        /* BOŞ FİLTRE "TÜMÜ"NÜN KENDİSİ · liste açıldığında onay işareti orada
           duruyor. Ama DOLU DEĞİL: `set` ayrı geçiliyor, yoksa "Tümü" yazan
           her kutu kendini dolu sayıp çizgisini sertleştiriyordu ve çubuktaki
           asıl süzen kutu öne çıkmayı bırakıyordu. İki ayrı soru, iki ayrı
           prop: "listede hangisi seçili" ve "bu filtre uygulanmış mı". */
        value={values[field.key] || labels.all}
        set={Boolean(values[field.key])}
        onChange={(v) => write(field.key, v === labels.all ? "" : v)}
        placeholder={labels.all}
      />
    );
  }

  return (
    <Input
      full
      aria-label={field.label}
      value={values[field.key] ?? ""}
      onChange={(e) => write(field.key, e.target.value)}
    />
  );
}

/**
 * ÇİP-DÜĞME VE PANEL: tetik "Durum: Tümü ▾" ya da "Durum: Kritik"; paneli
 * `SelectPanel`, ilk seçeneği "Tümü" (geri dönüş yolu gidiş yoluyla aynı yerde).
 * Çipte boşken kenarlı küçük, doluyken yumuşak ve oksuz; ✕ ayrı düğme.
 */
function PanelAlani({
  field,
  values,
  write,
  optionSource,
  labels,
  cip = false,
}: {
  field: FilterField;
  values: FilterValues;
  write: (key: string, value: string) => void;
  optionSource: Record<string, readonly (string | FilterOption)[]>;
  labels: FilterBarLabels;
  cip?: boolean;
}) {
  const options = secenekler(field, optionSource).map((o) => ({ ...o, tone: field.tones?.[o.value] }));
  const ortak = {
    title: field.panelTitle ?? field.label,
    "aria-label": field.label,
    prefix: `${field.label}:`,
    placeholder: labels.all,
    searchable: field.kind === "searchable",
    labels: { noMatch: labels.noMatch, search: labels.search, clear: labels.clear },
    size: cip ? ("sm" as const) : ("base" as const),
    className: cip ? undefined : "tamga-select-panel-tam",
  };
  if (field.kind === "multi") {
    const selected = (values[field.key] ?? "").split(",").filter(Boolean);
    const dolu = selected.length > 0;
    return (
      <SelectPanel
        multiple
        {...ortak}
        options={options}
        value={selected}
        onChange={(n) => write(field.key, n.join(","))}
        variant={cip && dolu ? "soft" : "secondary"}
        caret={!(cip && dolu)}
      />
    );
  }
  const v = values[field.key] ?? "";
  return (
    <SelectPanel
      {...ortak}
      allLabel={labels.all}
      options={options}
      value={v}
      onChange={(n) => write(field.key, n)}
      variant={cip && v ? "soft" : "secondary"}
      caret={!(cip && v)}
    />
  );
}

/** Seçenekler tek biçimde: düz dizgi, değeri de adı da kendisi olan bir çift. */
function secenekler(field: FilterField, optionSource: Record<string, readonly (string | FilterOption)[]>): FilterOption[] {
  const ham = field.options?.length ? field.options : (optionSource[field.key] ?? []);
  return ham.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
}

export type FilterBarProps = {
  values: FilterValues;
  onChange: (next: FilterValues) => void;
  /** The fields that stay on top. Four at most; the rest go to the drawer. TR: Üstte duran alanlar. En çok dört tane; gerisi çekmeceye. */
  top: readonly FilterField[];
  /** The groups inside the drawer. Grouped, not a flat pile. TR: Çekmecedeki gruplar. Düz bir yığın değil, gruplu. */
  drawer: readonly FilterGroup[];
  /** Where the option lists come from; this will arrive from the server. Strings or `{ value, label }` pairs. TR: Seçim listelerinin kaynağı; sunucudan gelecek. Dizgiler ya da `{ value, label }` çiftleri. */
  optionSource?: Record<string, readonly (string | FilterOption)[]>;
  /**
   * THE KEY THE SEARCH BOX WRITES TO. TR: ARAMA KUTUSUNUN YAZDIĞI ANAHTAR.
   *
   * Prop, çünkü sunucunun beklediği ad ürünün kararı: kimi `q` diyor, kimi
   * `ara`, kimi `search`. Blok bir süre `q`yu sabitledi ve ilk tüketicide
   * sessizce kırdı: kutuya yazılan şey `q`ya gidiyor, ekran `ara`yı okuyor,
   * ve arama hiçbir şey yapmıyordu. Hata vermeyen bir kırılma en pahalısı.
   */
  searchKey?: string;
  /** The key for search-by-file if this screen has it; without it the section is not drawn. TR: Dosyayla arama bu ekranda varsa anahtarı; yoksa bölüm hiç çizilmiyor. */
  fileSearchKey?: string;
  /**
   * The chosen FILE, and `null` when it is removed. TR: Seçilen DOSYANIN kendisi, kaldırılınca
   * `null`.
   *
   * `values` holds strings, so the file section could only ever write the file's NAME there, and
   * the thing the screen has to read, parse or upload existed nowhere. Given this, the name still
   * lands in `values[fileSearchKey]` for the chip; the `File` comes here. TR: `values` dizgi
   * tutuyor, yani dosya bölümü oraya ancak dosyanın ADINI yazabiliyordu ve ekranın okuyacağı,
   * ayrıştıracağı ya da göndereceği şey hiçbir yerde yoktu. Verildiğinde ad yine çipe gidiyor,
   * `File` buraya geliyor.
   */
  onFile?: (file: File | null) => void;
  /**
   * What the picker accepts: `".xlsx,.csv"`, `"image/*"`. TR: Seçicinin kabul ettiği tür:
   * `".xlsx,.csv"`, `"image/*"`.
   *
   * The kit named the formats itself for a while (`.xlsx,.xls,.csv`), which is a product's
   * vocabulary living in a library: the same drawer may want a photo or a PDF. TR: Kit bir süre
   * türleri kendi sayıyordu; o bir ürünün sözlüğünün kütüphanede yaşamasıdır · aynı çekmece bir
   * fotoğraf ya da PDF de isteyebilir.
   */
  fileAccept?: string;
  /** A screen-specific button on the filter row, beside "All filters". TR: Filtre satırına, "Tüm filtreler"in yanına giren ekrana özel düğme. */
  extra?: ReactNode;
  /** For `DatePicker`'s calendar: "tr-TR", "en-GB". TR: `DatePicker`ın takvimi için: "tr-TR", "en-GB". */
  locale?: string;
  /**
   * `fields` the boxes with a label above each (today's layout). `chips` one line: a fixed
   * search box, then a chip-button per top field that always reads name and value together,
   * "Status: All" empty and "Status: Critical" set, with its own remove; each chip opens a
   * `SelectPanel` whose first option is "All". No separate applied-filters row: the chip is the
   * summary. Text and date-range fields keep their boxes. TR: `fields` her birinin üstünde adı
   * olan kutular (bugünkü düzen). `chips` tek satır: sabit arama kutusu, sonra her üst alan için
   * adı ve değeri hep birlikte okunan bir çip-düğme, boşken "Durum: Tümü", doluyken "Durum:
   * Kritik" ve kendi kaldırması; her çip ilk seçeneği "Tümü" olan bir `SelectPanel` açar. Ayrı bir
   * uygulanan-filtreler satırı yok: çip özetin kendisi. Metin ve tarih aralığı kutu kalır.
   */
  look?: "fields" | "chips";
  labels: FilterBarLabels;
};

export function FilterBar({
  values,
  onChange,
  top,
  drawer,
  optionSource = {},
  searchKey = "q",
  fileSearchKey,
  onFile,
  fileAccept,
  extra,
  locale = "en-GB",
  look = "fields",
  labels,
}: FilterBarProps) {
  const cipler = look === "chips";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const formId = useId();

  const active = Object.entries(values).filter(([, v]) => v);
  const drawerKeys = new Set(drawer.flatMap((g) => g.fields.map((f) => f.key)));
  const hiddenActive = active.filter(([k]) => drawerKeys.has(k)).length;
  /* Dar ekranın sayısı: aramadan başka her uygulanmış filtre · arama kutusu
     orada da görünür, sayılmasına gerek yok. */
  const darAktif = active.filter(([k]) => k !== searchKey).length;
  const darMetin = `${labels.filter ?? labels.allFilters}${darAktif > 0 ? ` · ${darAktif}` : ""}`;

  function write(key: string, value: string) {
    const next = { ...values };
    if (value) next[key] = value;
    else delete next[key];
    onChange(next);
  }

  const allFields = [...top, ...drawer.flatMap((g) => g.fields)];
  /* Aralık anahtarları (`dateStart`) alan listesinde YOK: adı, ait olduğu
     alandan türetiliyor. Yoksa çipte ham anahtar görünüyordu. */
  const labelFor = (key: string) => {
    const direct = allFields.find((f) => f.key === key)?.label;
    if (direct) return direct;
    const range = allFields.find(
      (f) => f.kind === "dateRange" && (rangeStart(f.key) === key || rangeEnd(f.key) === key),
    );
    if (range) {
      return `${range.label} ${rangeStart(range.key) === key ? labels.rangeStart : labels.rangeEnd}`;
    }
    if (key === searchKey) return labels.search;
    return key === fileSearchKey ? (labels.fileSearch?.label ?? key) : key;
  };
  /* Çip DEĞERİ değil ADI gösteriyor: `critical` saklanır, "Kritik" okunur. */
  const valueText = (key: string, value: string) => {
    const field = allFields.find((f) => f.key === key);
    if (!field || (field.kind !== "select" && field.kind !== "searchable" && field.kind !== "multi")) return value;
    const adlar = new Map(secenekler(field, optionSource).map((o) => [o.value, o.label]));
    return value.split(",").map((v) => adlar.get(v) ?? v).join(field.kind === "multi" ? ", " : ",");
  };
  const ustAlanlar = (sinif: string) =>
    top.map((field) => (
      <div key={field.key} className={`tamga-filter-alan ${field.kind === "dateRange" ? "sm:col-span-2" : ""}`}>
        <span className={sinif}>{field.label}</span>
        <FieldControl field={field} values={values} write={write} optionSource={optionSource} locale={locale} labels={labels} panel={cipler} />
      </div>
    ));
  const aramaKutusu = (
    <span className="relative flex items-center">
      <Icon icon={Search} size="xs" aria-hidden className="pointer-events-none absolute left-2.5 text-ink-faint" />
      <Input type="search" full leading placeholder={labels.search} value={values[searchKey] ?? ""} onChange={(e) => write(searchKey, e.target.value)} />
    </span>
  );
  const cekmeceDugmesi = (drawer.length > 0 || top.length > 0) && (
    <Button className={drawer.length > 0 ? "ml-auto" : "tamga-filter-dar ml-auto"} onClick={() => setDrawerOpen(true)}>
      <Icon icon={Customize} size="xs" />
      <span className="tamga-filter-genis">
        {labels.allFilters}
        {hiddenActive > 0 && <span className="tamga-count ml-1 tabular-nums">{hiddenActive}</span>}
      </span>
      <span className="tamga-filter-dar">{darMetin}</span>
    </Button>
  );

  return (
    /* FİLTRE ÇUBUĞU KENDİ YÜZEYİNDE, ve `tamga-card-open` ŞART: `tamga-card`ın
       kırpması içindeki her açılır paneli hücre sınırında keserdi.
       Gerekçe: docs/gerekce/08-blok-ve-sablon.md */
    /* Kutu kit sınıfında: şablonun filtre alanında yüzeyini bırakıp tam
       genişlik alıyor (bkz. kit.css `.tamga-filter-bar`). */
    <div className="tamga-card tamga-card-open tamga-filter-bar">
      {/* ESNEK SARMA, SABİT IZGARA DEĞİL: taşmayı yaratan şey sütun sayısı değil
          TABANSIZ esneme, o yüzden çözüm `basis`. Arama iki pay, seçimler birer.
          Gerekçe: docs/gerekce/08-blok-ve-sablon.md */}
      {cipler ? (
        <div className="tamga-filter-cips">
          <label className="tamga-filter-ara-sabit">
            <span className="text-small font-bold text-ink-faint">{labels.search}</span>
            {aramaKutusu}
          </label>
          <span className="tamga-filter-cip-sira">
            {top.map((field) =>
              field.kind === "select" || field.kind === "searchable" || field.kind === "multi" ? (
                <span key={field.key} className="tamga-filter-cip" data-set={values[field.key] ? "true" : undefined}>
                  <PanelAlani field={field} values={values} write={write} optionSource={optionSource} labels={labels} cip />
                  {values[field.key] ? (
                    <button type="button" className="tamga-filter-cip-x" aria-label={labels.remove(field.label)} onClick={() => write(field.key, "")}>
                      <Icon icon={Close} size="xs" />
                    </button>
                  ) : null}
                </span>
              ) : (
                /* Metin ve tarih aralığı çip olamaz: kutuları kalıyor. */
                <div key={field.key} className="tamga-filter-genis tamga-filter-alan" data-range={field.kind === "dateRange" || undefined}>
                  <span className="text-small font-bold text-ink-faint">{field.label}</span>
                  <FieldControl field={field} values={values} write={write} optionSource={optionSource} locale={locale} labels={labels} />
                </div>
              ),
            )}
            {darAktif > 0 ? (
              <Button variant="link" size="sm" onClick={() => onChange({})}>
                {labels.clearAll}
              </Button>
            ) : null}
          </span>
          {cekmeceDugmesi}
          {extra}
        </div>
      ) : (
      <div className="tamga-filter-row">
        {/* GÖRÜNÜM VE TABAN KİT SINIFINDA, Tailwind'de değil: dar ekranda `display:
            none` ve `flex-basis: 0` bileşen katmanından geliyor ve yardımcı katman
            onları ezerdi. Tarayıcıda ölçüldü. */}
        <label className="tamga-filter-ara">
          <span className="text-small font-bold text-ink-faint">{labels.search}</span>
          {/* `leading` bir boolean: kite sol boşluğu açtırıyor, ikonu çağıran
              çiziyor. Böylece ikon seti kitin değil ürünün kararı kalıyor. */}
          {aramaKutusu}
        </label>

        {top.map((field) => (
          /* TARİH ARALIĞI İKİ SÜTUN KAPLIYOR, bir sütunu İKİYE BÖLMÜYOR: iki takvim bir
             alanın yarısına sığmıyor. Tavan yarım satır, yani sona tek başına düşen alan
             bütün satıra yayılmıyor.
             Gerekçe: docs/gerekce/08-blok-ve-sablon.md */
          <Fragment key={field.key}>
            {/* SATIRI KIRAN ŞEY TAM GENİŞLİKTE, YÜKSEKLİKSİZ BİR ELEMAN.
                Esnek bir kapta satır atlatmanın tek yolu bu: `basis-full` kalan
                yeri doldurup sonrakini aşağı itiyor, `h-0` ise kendisi için yer
                kaplamıyor. Bir `<br>` esnek kapta hiçbir şey yapmaz. */}
            {field.break ? <span aria-hidden className="tamga-filter-genis tamga-filter-kir" /> : null}
          <div
            className={`tamga-filter-genis tamga-filter-alan ${field.kind === "dateRange" ? "" : "tamga-filter-cap"}`}
            data-range={field.kind === "dateRange" || undefined}
          >
            <span className="text-small font-bold text-ink-faint">{field.label}</span>
            <FieldControl
              field={field}
              values={values}
              write={write}
              optionSource={optionSource}
              locale={locale}
              labels={labels}
            />
          </div>
          </Fragment>
        ))}

        {/* Rozet AKTİF olanı sayıyor, toplam alan sayısını değil: "20" hiçbir
            şey söylemez, "2" ise listenin neden eksik olduğunu söyler. */}
        {/* ÇEKMECE DÜĞMESİ SATIRIN SAĞ UCUNDA (`ml-auto`). Alanların hemen
            yanında dururken onlarla aynı şeymiş gibi okunuyordu; oysa öbürleri
            bir DEĞER seçiyor, bu bir PANEL açıyor. Sağ uç, bir araç çubuğunda
            "bu listenin geri kalanı" demenin yeri. */}
        {/* ÇEKMECE BOŞSA DÜĞME DE YOK: bir alanı kalmayan "Tüm filtreler" boş bir panel
            açıyor, ve açan kişi aradığı filtrenin kaybolduğunu sanıyor. */}
        {/* DAR EKRANDA ÜST ALANLARIN TEK YOLU BU DÜĞME: çekmece boşken de
            çiziliyor, ama yalnız dar görünümde (`tamga-filter-dar`). Sayaç kitin
            `tamga-count`u: aynı rozet `Badge`de de geçiyor. */}
        {cekmeceDugmesi}

        {extra}
      </div>
      )}

      {/* Uygulanan filtreler (kutu düzeni). Çekmecede olan da burada görünür;
          gizli kalan hiçbir filtre yok. Çip düzeninde çipin kendisi özet. */}
      {!cipler && active.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {active.map(([key, value]) => (
            <span key={key} className="tamga-token">
              <span className="font-normal text-ink-faint">{labelFor(key)}:</span>
              {valueText(key, value)}
              {/* Kitin `MiniButton`ı DEĞİL: o kendi kenarını ve tabanını
                  taşıyor, yani kenarlı bir çipin içinde ikinci bir nesne
                  oluyordu. Kaldırma karesi çipin bir parçası, ayrı bir kutu
                  değil. */}
              <button
                type="button"
                className="tamga-token-x"
                aria-label={labels.remove(labelFor(key))}
                onClick={() => write(key, "")}
              >
                <Icon icon={Close} size="xs" />
              </button>
            </span>
          ))}
          <Button variant="link" size="sm" onClick={() => onChange({})}>
            {labels.clearAll}
          </Button>
        </div>
      )}

      <Sheet
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={cipler ? (labels.filter ?? labels.allFilters) : labels.allFilters}
        closeLabel={labels.calendar.clear}
        footer={
          <>
            <Button type="button" onClick={() => onChange({})}>
              {labels.clear}
            </Button>
            {/* `form` niteliği düğmeyi formun DIŞINDAN ona bağlıyor: `Sheet`
                altlığı ayrı bir slotta çiziyor. */}
            <Button type="submit" form={formId} variant="primary">
              {labels.apply}
            </Button>
          </>
        }
      >
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            setDrawerOpen(false);
          }}
          className="flex flex-col"
        >
          {/* ÜST ALANLAR DAR EKRANDA ÇEKMECENİN İLK, BAŞLIKSIZ GRUBU. */}
          {top.length > 0 && (
            <div className="tamga-filter-dar tamga-filter-grup border-b border-dashed border-line py-4.5 last:border-b-0">
              <div className="grid gap-3 sm:grid-cols-[repeat(2,minmax(0,1fr))]">{ustAlanlar("text-small text-ink-soft")}</div>
            </div>
          )}
          {drawer.map((group) => (
            /* GRUPLAR KESİKLİ ÇİZGİYLE AYRILIYOR, boşlukla değil. Yirmi alanlık
               bir çekmecede yalnız boşluk, grubun nerede bittiğini söylemiyor
               ve kullanıcı aşağı kaydırdıkça hangi başlığın altında olduğunu
               kaybediyor. Çizgi kesikli, çünkü gruplar ayrı şeyler değil aynı
               formun bölümleri (tablo satırlarındaki gerekçenin aynısı). */
            <div key={group.title} className="flex flex-col gap-3.5 border-b border-dashed border-line py-4.5 last:border-b-0">
              <p className="text-caption font-extrabold uppercase tracking-label text-ink-faint">
                {group.title}
              </p>
              {/* `sm:grid-cols-2` yerine açık `minmax(0,1fr)`: varsayılan `1fr`
                  taban genişliği `auto`dur, yani içerik kabından genişse sütun
                  büyür ve çekmece yatay kaydırma açar. */}
              <div className="grid gap-3 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
                {group.fields.map((field) => (
                  /* TARİH ARALIĞI İKİ KUTU, satırın tamamını alıyor. `label`
                     DEĞİL `div`: içinde iki ayrı kontrol var ve tek bir etiket
                     ikisini birden işaret edemez. */
                  <div
                    key={field.key}
                    className={`flex flex-col gap-1.5 ${field.kind === "dateRange" ? "sm:col-span-2" : ""}`}
                  >
                    <span className="text-small text-ink-soft">{field.label}</span>
                    <FieldControl
                      field={field}
                      values={values}
                      write={write}
                      optionSource={optionSource}
                      locale={locale}
                      labels={labels}
                      panel={cipler}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* DOSYAYLA ARAMA. Bir alan listesi değil bir dosya olduğu için
              gruplardan sonra, kendi başlığıyla. */}
          {fileSearchKey && labels.fileSearch && (
            <div>
              <p className="mb-3 text-micro font-semibold uppercase tracking-wide text-ink-faint">
                {labels.fileSearch.title}
              </p>
              <p className="mb-3 text-small leading-relaxed text-ink-soft">
                {labels.fileSearch.help}
              </p>
              {values[fileSearchKey] ? (
                <span className="flex items-center gap-2">
                  <span className="truncate text-small text-ink">{values[fileSearchKey]}</span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      write(fileSearchKey, "");
                      onFile?.(null);
                    }}
                  >
                    {labels.fileSearch.remove}
                  </Button>
                </span>
              ) : (
                /* Gizli girdi + etiket: tarayıcının kendi dosya düğmesi
                   biçimlendirilemiyor, ama etiket ona bağlanınca klavye ve
                   ekran okuyucu davranışı olduğu gibi kalıyor. */
                <label className={`${buttonVariants({})} cursor-pointer`}>
                  <Icon icon={Upload} size="xs" />
                  {labels.fileSearch.choose}
                  <input
                    type="file"
                    accept={fileAccept}
                    className="sr-only"
                    onChange={(e) => {
                      /* AD ÇİPE, DOSYA ÇAĞIRANA: ikisi ayrı şey ve blok bir
                         süre yalnız birincisini veriyordu. */
                      const dosya = e.target.files?.[0] ?? null;
                      write(fileSearchKey, dosya?.name ?? "");
                      onFile?.(dosya);
                    }}
                  />
                </label>
              )}
            </div>
          )}
        </form>
      </Sheet>
    </div>
  );
}
