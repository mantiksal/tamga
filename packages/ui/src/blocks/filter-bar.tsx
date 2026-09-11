"use client";

import { useId, useState, type ReactNode } from "react";
import { Button, buttonVariants } from "../components/button.js";
import { MiniButton } from "../components/button.js";
import { Combobox } from "../components/combobox.js";
import { MultiSelect } from "../components/advanced-input.js";
import { DatePicker } from "../components/date-picker.js";
import { Icon } from "../components/icon.js";
import { Close, Customize, Search, Upload } from "../components/icons.js";
import { Input } from "../components/input.js";
import { Select, Sheet } from "../components/primitives.js";

/**
 * FİLTRE ÇUBUĞU.
 *
 * ─── NEDEN KİTTE ────────────────────────────────────────────────────────
 * Bir süre üründe durdu ve orada "kite taşınmadı, bilinçli" diye bir not
 * vardı: gerekçesi "Excel ile ara" ve "Tüm filtreler" gibi şeylerin bir
 * e-ticaret paneli kalıbı olması. Not yanlış çıktı ve iki sebeple:
 *
 *   ① ADR-0003'ün katman şeması `tamga-ui` kutusunun içine zaten
 *     "filtre paneli · toplu eylem çubuğu" yazıyor. Bir satır içi yorum,
 *     kilitli bir ADR'yi geçersiz kılmaz.
 *   ② Notun işaret ettiği sözlük SÖZCÜKLERDİ, mekanizma değil. Metinler
 *     `labels`a çıkınca geriye kalan şey saf mekanizma: bir arama kutusu, en
 *     çok dört alan, bir çekmece, ve uygulanan filtrelerin çipleri. Dosyayla
 *     arama da bir alan adı değil bir yöntem; her yönetim listesi yapabilir.
 *
 * ─── ÜÇ MADDE, VE ÜÇÜNCÜSÜ EN ÖNEMLİSİ ──────────────────────────────────
 * Bir yönetim panelinin filtresi otuz alanı aynı anda açık tutmaya meyleder,
 * hepsi aynı görsel ağırlıkta. Buradaki fikir tek cümle: birkaçı üstte,
 * gerisi çekmecede, VE çekmecede bir şey açıksa bunu görüyorsun.
 *
 * Gizli bir filtre açıkken kullanıcı listeyi eksik görür ve sebebini bulamaz;
 * bu, filtreyi gizlemenin tek gerçek riski. O yüzden uygulanan her filtre
 * tablonun üstünde bir çip olarak duruyor, tek tıkla kalkıyor, ve çekmece
 * düğmesinde aktif sayıyı gösteren bir rozet var.
 *
 * ─── ENTER UYGULAR ──────────────────────────────────────────────────────
 * Çekmecedeki alanlar bir `<form>` içinde ve "Uygula" o formun `submit`
 * düğmesi, yani Enter tarayıcının kendi davranışıyla çalışıyor: dinlenen bir
 * tuş değil, formun anlamı.
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

export type FilterField = {
  key: string;
  label: string;
  kind: FilterFieldKind;
  /** Falls back to `optionSource[key]`; with neither, the list is empty. TR: Verilmezse `optionSource[key]` kullanılır; ikisi de yoksa liste boş. */
  options?: string[];
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
}: {
  field: FilterField;
  values: FilterValues;
  write: (key: string, value: string) => void;
  optionSource: Record<string, string[]>;
  locale: string;
  labels: FilterBarLabels;
}) {
  const options = field.options?.length ? field.options : (optionSource[field.key] ?? []);

  if (field.kind === "dateRange") {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        <DatePicker
          locale={locale}
          value={values[rangeStart(field.key)] || undefined}
          onChange={(v) => write(rangeStart(field.key), v ?? "")}
          placeholder={labels.rangeStart}
          labels={labels.calendar}
        />
        <DatePicker
          locale={locale}
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
        options={options.map((o) => ({ value: o, label: o }))}
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
        options={options.map((o) => ({ value: o, label: o }))}
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
        options={[labels.all, ...options]}
        value={values[field.key]}
        onChange={(v) => write(field.key, v === labels.all ? "" : v)}
        placeholder={labels.all}
      />
    );
  }

  return (
    <Input
      full
      value={values[field.key] ?? ""}
      onChange={(e) => write(field.key, e.target.value)}
    />
  );
}

export type FilterBarProps = {
  values: FilterValues;
  onChange: (next: FilterValues) => void;
  /** The fields that stay on top. Four at most; the rest go to the drawer. TR: Üstte duran alanlar. En çok dört tane; gerisi çekmeceye. */
  top: readonly FilterField[];
  /** The groups inside the drawer. Grouped, not a flat pile. TR: Çekmecedeki gruplar. Düz bir yığın değil, gruplu. */
  drawer: readonly FilterGroup[];
  /** Where the option lists come from; this will arrive from the server. TR: Seçim listelerinin kaynağı; sunucudan gelecek. */
  optionSource?: Record<string, string[]>;
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
  /** A screen-specific button on the filter row, beside "All filters". TR: Filtre satırına, "Tüm filtreler"in yanına giren ekrana özel düğme. */
  extra?: ReactNode;
  /** For `DatePicker`'s calendar: "tr-TR", "en-GB". TR: `DatePicker`ın takvimi için: "tr-TR", "en-GB". */
  locale?: string;
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
  extra,
  locale = "en-GB",
  labels,
}: FilterBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const formId = useId();

  const active = Object.entries(values).filter(([, v]) => v);
  const drawerKeys = new Set(drawer.flatMap((g) => g.fields.map((f) => f.key)));
  const hiddenActive = active.filter(([k]) => drawerKeys.has(k)).length;

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

  return (
    <div className="flex flex-col gap-3">
      {/* IZGARA, ESNEK SATIR DEĞİL. Esnek satırda kontroller kabından taşıp
          sayfaya yatay kaydırma açıyor. Izgarada her sütunun tabanı
          `minmax(0, …)`, yani hiçbiri içeriğinin genişliğini dayatamıyor. */}
      <div className="grid items-end gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(10rem,1fr)_repeat(4,minmax(0,1.25fr))_auto]">
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-small font-medium text-ink">{labels.search}</span>
          {/* `leading` bir boolean: kite sol boşluğu açtırıyor, ikonu çağıran
              çiziyor. Böylece ikon seti kitin değil ürünün kararı kalıyor. */}
          <span className="relative flex items-center">
            <Icon
              icon={Search}
              size="xs"
              aria-hidden
              className="pointer-events-none absolute left-2.5 text-ink-faint"
            />
            <Input
              type="search"
              full
              leading
              placeholder={labels.search}
              value={values[searchKey] ?? ""}
              onChange={(e) => write(searchKey, e.target.value)}
            />
          </span>
        </label>

        {top.map((field) => (
          <div key={field.key} className="flex min-w-0 flex-col gap-1.5">
            <span className="text-small font-medium text-ink">{field.label}</span>
            <FieldControl
              field={field}
              values={values}
              write={write}
              optionSource={optionSource}
              locale={locale}
              labels={labels}
            />
          </div>
        ))}

        {/* Rozet AKTİF olanı sayıyor, toplam alan sayısını değil: "20" hiçbir
            şey söylemez, "2" ise listenin neden eksik olduğunu söyler. */}
        <Button onClick={() => setDrawerOpen(true)}>
          <Icon icon={Customize} size="xs" />
          {labels.allFilters}
          {hiddenActive > 0 && (
            <span className="ml-1 rounded-full bg-[var(--color-accent)] px-1.5 text-micro font-semibold text-[var(--color-accent-ink)] tabular-nums">
              {hiddenActive}
            </span>
          )}
        </Button>

        {extra}
      </div>

      {/* Uygulanan filtreler. Çekmecede olan da burada görünür; gizli kalan
          hiçbir filtre yok. */}
      {active.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {active.map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 rounded-(--radius-ctl) border border-[var(--color-edge)] bg-shell py-1 pl-2.5 pr-1 text-small text-ink"
            >
              <span className="text-ink-faint">{labelFor(key)}:</span>
              {value}
              <MiniButton aria-label={labels.remove(labelFor(key))} onClick={() => write(key, "")}>
                <Icon icon={Close} size="xs" />
              </MiniButton>
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
        title={labels.allFilters}
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
          className="flex flex-col gap-7"
        >
          {drawer.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-micro font-semibold uppercase tracking-wide text-ink-faint">
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
                  <Button type="button" size="sm" onClick={() => write(fileSearchKey, "")}>
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
                    accept=".xlsx,.xls,.csv"
                    className="sr-only"
                    onChange={(e) => write(fileSearchKey, e.target.files?.[0]?.name ?? "")}
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
