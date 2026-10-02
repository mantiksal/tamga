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

export type FilterField = {
  key: string;
  label: string;
  kind: FilterFieldKind;
  /** Falls back to `optionSource[key]`; with neither, the list is empty. TR: Verilmezse `optionSource[key]` kullanılır; ikisi de yoksa liste boş. */
  options?: string[];
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
   * Keyed by the option's own text. The swatch it draws is the same square the
   * table's chip draws, so the eye matches the list to the rows without reading
   * either. Only where the option really is a state. TR: Anahtar, seçeneğin
   * kendi metni. Çizdiği kare, tablodaki çipin çizdiği karenin aynısı · göz
   * listeyi satırlara okumadan eşliyor. Yalnız seçenek gerçekten bir durumsa.
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
        icon={field.icon}
        options={[
          labels.all,
          ...options.map((o) => (field.tones?.[o] ? { value: o, tone: field.tones[o] } : o)),
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
    /* FİLTRE ÇUBUĞU KENDİ YÜZEYİNDE, ve `tamga-card-open` ŞART: `tamga-card`ın
       kırpması içindeki her açılır paneli hücre sınırında keserdi.
       Gerekçe: docs/gerekce/08-blok-ve-sablon.md */
    <div className="tamga-card tamga-card-open flex flex-col gap-3.5 p-4">
      {/* ESNEK SARMA, SABİT IZGARA DEĞİL: taşmayı yaratan şey sütun sayısı değil
          TABANSIZ esneme, o yüzden çözüm `basis`. Arama iki pay, seçimler birer.
          Gerekçe: docs/gerekce/08-blok-ve-sablon.md */}
      <div className="tamga-filter-row">
        <label className="flex min-w-0 shrink grow-[2] basis-75 flex-col gap-1.5">
          <span className="text-small font-bold text-ink-faint">{labels.search}</span>
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
          /* TARİH ARALIĞI İKİ SÜTUN KAPLIYOR, bir sütunu İKİYE BÖLMÜYOR: iki takvim bir
             alanın yarısına sığmıyor. Tavan yarım satır, yani sona tek başına düşen alan
             bütün satıra yayılmıyor.
             Gerekçe: docs/gerekce/08-blok-ve-sablon.md */
          <Fragment key={field.key}>
            {/* SATIRI KIRAN ŞEY TAM GENİŞLİKTE, YÜKSEKLİKSİZ BİR ELEMAN.
                Esnek bir kapta satır atlatmanın tek yolu bu: `basis-full` kalan
                yeri doldurup sonrakini aşağı itiyor, `h-0` ise kendisi için yer
                kaplamıyor. Bir `<br>` esnek kapta hiçbir şey yapmaz. */}
            {field.break ? <span aria-hidden className="h-0 basis-full" /> : null}
          <div
            className={`flex min-w-0 shrink grow flex-col gap-1.5 ${
              field.kind === "dateRange" ? "basis-80" : "basis-40 tamga-filter-cap"
            }`}
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
        {drawer.length > 0 && (
        <Button className="ml-auto" onClick={() => setDrawerOpen(true)}>
          <Icon icon={Customize} size="xs" />
          {labels.allFilters}
          {hiddenActive > 0 && (
            /* Sayaç kitin `tamga-count`u, elle çizilmiş bir daire değil: aynı
               rozet `Badge`de de geçiyor ve ikisinin ayrı çizilmesi, işaret
               ailesi değiştiğinde yalnız birinin değişmesi demekti. */
            <span className="tamga-count ml-1 tabular-nums">
              {hiddenActive}
            </span>
          )}
        </Button>
        )}

        {extra}
      </div>

      {/* Uygulanan filtreler. Çekmecede olan da burada görünür; gizli kalan
          hiçbir filtre yok. */}
      {active.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {active.map(([key, value]) => (
            <span key={key} className="tamga-token">
              <span className="font-normal text-ink-faint">{labelFor(key)}:</span>
              {value}
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
          className="flex flex-col"
        >
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
