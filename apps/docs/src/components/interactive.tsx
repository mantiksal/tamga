"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  Sheet,
  Popover,
  DropdownMenu,
  Select,
  Toast,
  ToastViewport,
  Icon,
  Checkbox,
  RadioGroup,
  Switch,
  Segmented,
  Tabs,
  Pagination,
  SortHeader,
  SelectAll,
  SelectRow,
  SelectionBar,
  Card,
  Table,
  NumberInput,
  Combobox,
  DatePicker,
  FileUpload,
  LocaleSwitcher,
  Accordion,
  Collapsible,
  Code,
  Steps,
  PasswordInput,
  SecretField,
  Slider,
  TagsInput,
  MultiSelect,
  ScheduleInput,
  LineChart,
  LogView,
  type SortDirection,
  type UploadItem,
  RichText,
  TreeSelect,
} from "tamga-ui";
import { More, Delete, Download, Refresh } from "tamga-ui/icons";
import { Demo, type DemoLabels } from "@/components/demo";

/**
 * Açılıp kapanan örnekler.
 *
 * Bir overlay'i "açık" hâliyle statik göstermek yalan olurdu: bu bileşenlerin
 * yarısı GEÇİŞ — odak nereye gidiyor, Escape ne yapıyor, dışarı tıklayınca ne
 * oluyor. O yüzden hepsi gerçek durumla çalışıyor; okuyan kişi tıklayıp
 * deneyebilir.
 */

import type { Locale } from "@/i18n/config";

/**
 * ÖRNEKLERİN METNİ DE İKİ DİLLİ, ve bu sayfa metninden daha kritik. Bir
 * okuyucu İngilizce bir sayfada Türkçe yazan bir buton gördüğünde sayfanın
 * çevrilmediğini değil, sitenin BOZUK olduğunu düşünür — çünkü etrafındaki her
 * şey İngilizce. Yarım çeviri, hiç çevirmemekten kötüdür.
 *
 * Metin sayfalardan PROP olarak geçirilmiyor, burada duruyor: bir örneğin
 * içindeki "Blue Train · LP" ya da "Stokta olanları göster" o ÖRNEĞİN verisi,
 * sayfanın anlatısı değil. Sayfadan geçirmek her demo için sekiz prop demek
 * olurdu ve unutulan biri sessizce Türkçe kalırdı.
 */
const D = {
  tr: {
    openDialog: "Diyaloğu aç",
    dialogTitle: "Bu kaydı silmek üzeresin",
    close: "Kapat",
    cancel: "Vazgeç",
    delete: "Sil",
    dialogBody:
      "Silinen kayıt geri gelmez. Bağlı olduğu üç sipariş kaydı etkilenmez, yalnız bu ürün listeden kalkar.",
    openSheet: "Paneli aç",
    sheetTitle: "Ürün ayrıntısı",
    save: "Kaydet",
    sheetBody:
      "Yan panel, sayfayı terk etmeden bir nesneye bakmak için. Diyalogdan farkı: karar istemiyor, bilgi veriyor, o yüzden dışarı tıklayınca kapanır.",
    filters: "Filtreler",
    filter: "Filtrele",
    clear: "Temizle",
    popoverBody: "Küçük bir form ya da kısa bir açıklama. Sayfayı karartmaz, akışı kesmez.",
    more: "Daha fazla",
    refresh: "Yenile",
    exportAll: "Dışa aktar",
    statuses: ["Taslak", "Yayında", "Arşiv"],
    pickStatus: "Durum seç",
    saved: "Kaydedildi",
    notSaved: "Kaydedilemedi",
    success: "Başarı",
    failure: "Hata",
    inStock: "Stokta olanları göster",
    onSale: "İndirimdekiler",
    disabled: "Devre dışı",
    orderState: "Sipariş durumu",
    pending: "Beklemede",
    shipping: "Kargoda",
    delivered: "Teslim edildi",
    notifications: "Bildirimler",
    maintenance: "Bakım modu",
    view: "Görünüm",
    list: "Liste",
    board: "Pano",
    calendar: "Takvim",
    productTabs: "Ürün sekmeleri",
    general: "Genel",
    stock: "Stok",
    images: "Görseller",
    activeTab: "Seçili sekme",
    prevPage: "Önceki sayfa",
    nextPage: "Sonraki sayfa",
    page: (n: number) => `Sayfa ${n}`,
    selected: (n: number) => `${n} kayıt seçildi`,
    clearSelection: "Seçimi temizle",
    selectAll: "Tümünü seç",
    selectRow: (name: string) => `${name} seç`,
    product: "Ürün",
    priceUp: "Fiyatı artır",
    priceDown: "Fiyatı azalt",
    stockUp: "Stoğu artır",
    stockDown: "Stoğu azalt",
    unit: "adet",
    searchProduct: "Ürün ara…",
    noResult: "Sonuç yok",
    openList: "Listeyi aç",
    pickDate: "Tarih seç",
    prevMonth: "Önceki ay",
    nextMonth: "Sonraki ay",
    openCalendar: "Takvimi aç",
    dropImages: "Görselleri buraya sürükle",
    browse: "Dosya seç",
    remove: "Kaldır",
    moveLeft: "Sola al",
    moveRight: "Sağa al",
    cover: "kapak",
  },
  en: {
    openDialog: "Open the dialog",
    dialogTitle: "You are about to delete this record",
    close: "Close",
    cancel: "Cancel",
    delete: "Delete",
    dialogBody:
      "A deleted record does not come back. The three orders attached to it are unaffected; only this product leaves the list.",
    openSheet: "Open the panel",
    sheetTitle: "Product detail",
    save: "Save",
    sheetBody:
      "A side panel is for looking at one object without leaving the page. Unlike a dialog it asks for nothing; it informs, which is why clicking outside closes it.",
    filters: "Filters",
    filter: "Filter",
    clear: "Clear",
    popoverBody: "A small form or a short explanation. It does not dim the page or break the flow.",
    more: "More",
    refresh: "Refresh",
    exportAll: "Export",
    statuses: ["Draft", "Published", "Archived"],
    pickStatus: "Pick a status",
    saved: "Saved",
    notSaved: "Could not save",
    success: "Success",
    failure: "Error",
    inStock: "Show items in stock",
    onSale: "On sale",
    disabled: "Disabled",
    orderState: "Order status",
    pending: "Pending",
    shipping: "Shipping",
    delivered: "Delivered",
    notifications: "Notifications",
    maintenance: "Maintenance mode",
    view: "View",
    list: "List",
    board: "Board",
    calendar: "Calendar",
    productTabs: "Product tabs",
    general: "General",
    stock: "Stock",
    images: "Images",
    activeTab: "Active tab",
    prevPage: "Previous page",
    nextPage: "Next page",
    page: (n: number) => `Page ${n}`,
    selected: (n: number) => `${n} selected`,
    clearSelection: "Clear selection",
    selectAll: "Select all",
    selectRow: (name: string) => `Select ${name}`,
    product: "Product",
    priceUp: "Increase price",
    priceDown: "Decrease price",
    stockUp: "Increase stock",
    stockDown: "Decrease stock",
    unit: "pcs",
    searchProduct: "Search products…",
    noResult: "No results",
    openList: "Open the list",
    pickDate: "Pick a date",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    openCalendar: "Open the calendar",
    dropImages: "Drag images here",
    browse: "Choose files",
    remove: "Remove",
    moveLeft: "Move left",
    moveRight: "Move right",
    cover: "cover",
  },
};

/** Her örnek dili alır; hiçbiri kendi başına bir dil varsaymaz. */
type L = { lang: Locale };


export function DialogDemo({ lang }: L) {
  const d = D[lang];
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        {d.openDialog}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={d.dialogTitle}
        closeLabel={d.close}
        footer={
          <>
            <Button onClick={() => setOpen(false)}>{d.cancel}</Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              {d.delete}
            </Button>
          </>
        }
      >
        {d.dialogBody}
      </Dialog>
    </>
  );
}

export function SheetDemo({ lang }: L) {
  const d = D[lang];
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{d.openSheet}</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={d.sheetTitle}
        closeLabel={d.close}
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            {d.save}
          </Button>
        }
      >
        <p className="mb-3">{d.sheetBody}</p>
      </Sheet>
    </>
  );
}

export function PopoverDemo({ lang }: L) {
  const d = D[lang];
  return (
    <Popover
      trigger={<Button>{d.filters}</Button>}
      title={d.filter}
      closeLabel={d.close}
      footer={<Button size="sm">{d.clear}</Button>}
    >
      <p>{d.popoverBody}</p>
    </Popover>
  );
}

export function MenuDemo({ lang }: L) {
  const d = D[lang];
  return (
    <DropdownMenu
      align="start"
      trigger={
        <button className="tamga-icon-btn" aria-label={d.more}>
          <Icon icon={More} size="sm" />
        </button>
      }
      items={[
        { label: d.refresh, icon: <Icon icon={Refresh} size="xs" />, onSelect: () => {} },
        { label: d.exportAll, icon: <Icon icon={Download} size="xs" />, onSelect: () => {} },
        { kind: "separator" },
        { label: d.delete, icon: <Icon icon={Delete} size="xs" />, state: "danger", onSelect: () => {} },
      ]}
    />
  );
}

export function SelectDemo({ lang }: L) {
  const d = D[lang];
  const [value, setValue] = useState<string>();
  return (
    <div className="w-64">
      <Select
        options={d.statuses}
        value={value}
        onChange={setValue}
        placeholder={d.pickStatus}
      />
    </div>
  );
}

const AGAC = {
  tr: [
    {
      id: "ayakkabi",
      label: "Ayakkabı",
      children: [
        { id: "kosu", label: "Koşu" },
        { id: "outdoor", label: "Outdoor" },
        { id: "gunluk", label: "Günlük" },
      ],
    },
    {
      id: "giyim",
      label: "Giyim",
      children: [
        { id: "tisort", label: "Tişört" },
        { id: "sort", label: "Şort" },
        { id: "mont", label: "Mont" },
      ],
    },
    { id: "aksesuar", label: "Aksesuar" },
  ],
  en: [
    {
      id: "shoes",
      label: "Shoes",
      children: [
        { id: "running", label: "Running" },
        { id: "outdoor", label: "Outdoor" },
        { id: "everyday", label: "Everyday" },
      ],
    },
    {
      id: "clothing",
      label: "Clothing",
      children: [
        { id: "tee", label: "T-shirt" },
        { id: "shorts", label: "Shorts" },
        { id: "jacket", label: "Jacket" },
      ],
    },
    { id: "accessories", label: "Accessories" },
  ],
};

const AGAC_ETIKET = {
  tr: { search: "Kategori ara", empty: "Eşleşen kategori yok", expand: "Aç", collapse: "Kapat" },
  en: { search: "Search categories", empty: "No matching category", expand: "Expand", collapse: "Collapse" },
};

export function TreeSelectDemo({ lang }: L) {
  const [value, setValue] = useState<string[]>([]);
  return (
    <div className="w-72">
      <TreeSelect
        nodes={AGAC[lang]}
        value={value}
        onChange={setValue}
        labels={AGAC_ETIKET[lang]}
        height={240}
      />
    </div>
  );
}

const EDITOR_ETIKET = {
  tr: {
    bold: "Kalın",
    italic: "İtalik",
    link: "Bağlantı",
    h3: "Başlık 3",
    h4: "Başlık 4",
    h5: "Başlık 5",
    ul: "Madde listesi",
    ol: "Numaralı liste",
    linkUrl: "Adres",
    linkApply: "Bağlantıyı uygula",
    linkCancel: "Vazgeç",
  },
  en: {
    bold: "Bold",
    italic: "Italic",
    link: "Link",
    h3: "Heading 3",
    h4: "Heading 4",
    h5: "Heading 5",
    ul: "Bullet list",
    ol: "Numbered list",
    linkUrl: "Address",
    linkApply: "Apply link",
    linkCancel: "Cancel",
  },
};

const EDITOR_BASLANGIC = {
  tr: "<p>Gün boyu konfor sağlayan <strong>hafif taban</strong> ve nefes alan üst yapı.</p>",
  en: "<p>An <strong>ultralight sole</strong> and a breathable upper, all day long.</p>",
};

export function RichTextDemo({ lang }: L) {
  const [html, setHtml] = useState(EDITOR_BASLANGIC[lang]);
  return (
    <div className="w-full max-w-xl">
      <RichText
        value={html}
        onChange={setHtml}
        allow={["bold", "italic", "link", "h3", "ul", "ol"]}
        labels={EDITOR_ETIKET[lang]}
        ariaLabel={lang === "tr" ? "Açıklama" : "Description"}
        rows={5}
      />
    </div>
  );
}

export function ToastDemo({ lang }: L) {
  const d = D[lang];
  const [items, setItems] = useState<{ id: number; tone: "positive" | "danger"; title: string }[]>([]);

  function push(tone: "positive" | "danger", title: string) {
    setItems((s) => [{ id: Date.now(), tone, title }, ...s].slice(0, 3));
  }

  return (
    <>
      <div className="flex gap-3">
        <Button onClick={() => push("positive", d.saved)}>{d.success}</Button>
        <Button variant="danger" onClick={() => push("danger", d.notSaved)}>
          {d.failure}
        </Button>
      </div>
      <ToastViewport position="bottom-right">
        {items.map((t) => (
          <Toast
            key={t.id}
            tone={t.tone}
            title={t.title}
            dismissLabel={d.close}
            onDismiss={() => setItems((s) => s.filter((x) => x.id !== t.id))}
          />
        ))}
      </ToastViewport>
    </>
  );
}

/* ---- seçim kontrolleri ---- */

export function CheckboxDemo({ lang }: L) {
  const d = D[lang];
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <Checkbox label={d.inStock} checked={a} onChange={setA} />
      <Checkbox label={d.onSale} checked={b} onChange={setB} />
      <Checkbox label={d.disabled} checked={false} disabled />
    </div>
  );
}

export function RadioDemo({ lang }: L) {
  const d = D[lang];
  const [v, setV] = useState("shipping");
  return (
    <RadioGroup
      label={d.orderState}
      value={v}
      onChange={setV}
      options={[
        { value: "pending", label: d.pending },
        { value: "shipping", label: d.shipping },
        { value: "delivered", label: d.delivered },
      ]}
    />
  );
}

export function SwitchDemo({ lang }: L) {
  const d = D[lang];
  const [on, setOn] = useState(true);
  const [off, setOff] = useState(false);
  return (
    <div className="flex items-center gap-6">
      <Switch on={on} onChange={setOn} label={d.notifications} />
      <Switch on={off} onChange={setOff} label={d.maintenance} />
      <Switch on={false} label={d.disabled} disabled />
    </div>
  );
}

export function SegmentedDemo({ lang }: L) {
  const d = D[lang];
  const [v, setV] = useState("list");
  return (
    <Segmented
      label={d.view}
      value={v}
      onChange={setV}
      options={[
        { value: "list", label: d.list },
        { value: "board", label: d.board },
        { value: "calendar", label: d.calendar },
      ]}
    />
  );
}

export function TabsDemo({ lang }: L) {
  const d = D[lang];
  const [t, setT] = useState("general");
  return (
    <div className="w-full">
      <Tabs
        label={d.productTabs}
        value={t}
        onChange={setT}
        items={[
          { value: "general", label: d.general },
          { value: "stock", label: d.stock },
          { value: "images", label: d.images },
        ]}
      />
      <p className="pt-5 text-[length:var(--docs-small)] text-ink-faint">
        {d.activeTab}: {({ general: d.general, stock: d.stock, images: d.images } as Record<string, string>)[t]}
      </p>
    </div>
  );
}

/* ---- veri ve gelişmiş girdi ---- */

export function PaginationDemo({ lang }: L) {
  const d = D[lang];
  const [page, setPage] = useState(3);
  return (
    <Pagination
      page={page}
      pageSize={25}
      total={240}
      onChange={setPage}
      labels={{
        previous: d.prevPage,
        next: d.nextPage,
        page: d.page,
        summary: (f, t, tot) => `${f}–${t} / ${tot}`,
      }}
      className="w-full"
    />
  );
}

/* Plak adları çevrilmiyor: bir ürün adı tanımlayıcıdır, metin değil. */
const ROWS = [
  { id: "r1", name: "Blue Train · LP", stock: 12 },
  { id: "r2", name: "Kind of Blue · LP", stock: 2 },
  { id: "r3", name: "A Love Supreme · LP", stock: 0 },
];

export function DataTableDemo({ lang }: L) {
  const d = D[lang];
  const [dir, setDir] = useState<SortDirection>("desc");
  const [sel, setSel] = useState<string[]>(["r1"]);

  const sorted = [...ROWS].sort((a, b) => (dir === "desc" ? b.stock - a.stock : a.stock - b.stock));
  const all = sel.length === ROWS.length;

  return (
    <Card className="w-full">
      <SelectionBar
        count={sel.length}
        onClear={() => setSel([])}
        labels={{ selected: d.selected, clear: d.clearSelection }}
      >
        <Button size="sm">{d.exportAll}</Button>
        <Button size="sm" variant="danger">
          {d.delete}
        </Button>
      </SelectionBar>

      <Table>
        <thead>
          <tr>
            <th className="w-10">
              <SelectAll
                checked={all}
                indeterminate={sel.length > 0 && !all}
                onChange={(v) => setSel(v ? ROWS.map((r) => r.id) : [])}
                label={d.selectAll}
              />
            </th>
            <th>{d.product}</th>
            <SortHeader direction={dir} onSort={setDir} align="right" className="w-24">
              {d.stock}
            </SortHeader>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.id}>
              <td>
                <SelectRow
                  checked={sel.includes(r.id)}
                  onChange={(v) => setSel((s) => (v ? [...s, r.id] : s.filter((x) => x !== r.id)))}
                  label={d.selectRow(r.name)}
                />
              </td>
              <td className="font-mono text-body text-ink">{r.name}</td>
              <td className="text-right font-mono tabular-nums">{r.stock}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

export function NumberInputDemo({ lang }: L) {
  const d = D[lang];
  const [price, setPrice] = useState<number | null>(249.9);
  const [stock, setStock] = useState<number | null>(12);
  return (
    <div className="flex w-full max-w-96 flex-col gap-4">
      <NumberInput
        value={price}
        onChange={setPrice}
        step={0.1}
        min={0}
        suffix="₺"
        full
        labels={{ increase: d.priceUp, decrease: d.priceDown }}
      />
      <NumberInput
        value={stock}
        onChange={setStock}
        min={0}
        max={999}
        suffix={d.unit}
        full
        labels={{ increase: d.stockUp, decrease: d.stockDown }}
      />
    </div>
  );
}

export function ComboboxDemo({ lang }: L) {
  const d = D[lang];
  const [v, setV] = useState<string>();
  return (
    <div className="w-full max-w-96">
      <Combobox
        value={v}
        onChange={setV}
        placeholder={d.searchProduct}
        labels={{ empty: d.noResult, clear: d.clearSelection, open: d.openList }}
        options={[
          { value: "p1", label: "Blue Train · LP", hint: "SKU-4471" },
          { value: "p2", label: "Kind of Blue · LP", hint: "SKU-4472" },
          { value: "p3", label: "A Love Supreme · LP", hint: "SKU-4473" },
          { value: "p4", label: "Giant Steps · LP", hint: "SKU-4474" },
        ]}
      />
    </div>
  );
}

export function DatePickerDemo({ lang }: L) {
  const d = D[lang];
  const [date, setDate] = useState<string>();
  return (
    <div className="w-full max-w-72">
      <DatePicker
        /* Ay ve gün adlarını Intl üretiyor; bileşen yalnız yereli bilir. */
        locale={lang === "tr" ? "tr-TR" : "en-US"}
        value={date}
        onChange={setDate}
        placeholder={d.pickDate}
        labels={{
          previousMonth: d.prevMonth,
          nextMonth: d.nextMonth,
          open: d.openCalendar,
          clear: d.clear,
        }}
      />
    </div>
  );
}

export function FileUploadDemo({ lang }: L) {
  const d = D[lang];
  const [items, setItems] = useState<UploadItem[]>([]);
  return (
    <FileUpload
      items={items}
      onAdd={(files) =>
        setItems((s) => [
          ...s,
          ...files.map((f) => ({ id: `${f.name}-${Date.now()}`, url: URL.createObjectURL(f), name: f.name })),
        ])
      }
      onRemove={(id) => setItems((s) => s.filter((x) => x.id !== id))}
      onReorder={(id, dir) =>
        setItems((s) => {
          const i = s.findIndex((x) => x.id === id);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= s.length) return s;
          const copy = [...s];
          [copy[i], copy[j]] = [copy[j]!, copy[i]!];
          return copy;
        })
      }
      labels={{
        drop: d.dropImages,
        browse: d.browse,
        remove: d.remove,
        moveLeft: d.moveLeft,
        moveRight: d.moveRight,
        primary: d.cover,
      }}
      className="w-full"
    />
  );
}

/* ------------------------------------------------------------------ *
 * Kontrollü örnekler.
 *
 * NEDEN AYRI BİR BİLEŞEN. `Demo`'nun kontrolleri `render` ve `code` olarak
 * FONKSİYON ister — değerler değişince yeniden çizebilmek için. Ama sayfalar
 * sunucu bileşeni ve React sunucudan istemciye fonksiyon geçirmeye izin vermez
 * ("Functions cannot be passed directly to Client Components"). JSX geçer,
 * dizgi geçer, fonksiyon geçmez.
 *
 * O yüzden kontrollü örnek buraya, istemci tarafına taşındı: sayfa yalnız
 * ÇEVRİLMİŞ METNİ geçiyor, fonksiyonlar bu dosyanın içinde kalıyor.
 * ------------------------------------------------------------------ */

export function ButtonPlayground({
  labels,
  label,
}: {
  labels: DemoLabels;
  /** Butonun üstündeki metin — çeviri sayfadan gelir, kit çeviri yapmaz. */
  label: string;
}) {
  return (
    <Demo
      labels={labels}
      controls={{
        variant: ["secondary", "primary", "success", "danger", "ghost", "link"],
        size: ["base", "sm"],
        full: false,
      }}
      render={(v) => (
        <span className={v.full ? "w-full max-w-80" : undefined}>
          <Button variant={v.variant as "primary"} size={v.size as "sm"} full={v.full as boolean}>
            {label}
          </Button>
        </span>
      )}
      code={(v) =>
        `<Button variant="${v.variant}"` +
        (v.size === "sm" ? ' size="sm"' : "") +
        (v.full ? " full" : "") +
        `>\n  ${label}\n</Button>`
      }
    />
  );
}

/** Dil değiştiricinin canlı örneği — kit yönlendirme yapmaz, demo da yapmaz. */
export function LocaleSwitcherDemo({ lang }: L) {
  const [v, setV] = useState(lang as string);
  return (
    <div className="flex flex-col items-center gap-4">
      <LocaleSwitcher
        locales={[
          { value: "tr", label: "Türkçe" },
          { value: "en", label: "English" },
        ]}
        current={v}
        onChange={setV}
        label={lang === "tr" ? "Dil" : "Language"}
      />
      <LocaleSwitcher
        locales={[
          { value: "tr", label: "Türkçe" },
          { value: "en", label: "English" },
          { value: "de", label: "Deutsch" },
          { value: "fr", label: "Français" },
        ]}
        current={v === "tr" || v === "en" ? v : "tr"}
        onChange={setV}
        label={lang === "tr" ? "Dil" : "Language"}
      />
    </div>
  );
}

/* ---- yeni bileşenlerin canlı örnekleri ---- */

const N = {
  tr: {
    general: "Genel", generalBody: "Panelin adı, saat dilimi ve varsayılan dil.",
    alerts: "Uyarılar", alertsBody: "Kim, ne zaman, hangi kanaldan haber alsın.",
    billing: "Faturalama", billingBody: "Plan, ödeme yöntemi ve fatura adresi.",
    threeItems: "3 madde", twoItems: "2 madde", oneItem: "1 madde",
    copy: "Kopyala", copied: "Kopyalandı", failed: "Kopyalanamadı",
    stepNames: ["Bilgiler", "Bağlantı", "Doğrulama", "Bitti"],
    pwPlaceholder: "Parolan", show: "Parolayı göster", hide: "Parolayı gizle",
    reveal: "Anahtarı göster", hideKey: "Anahtarı gizle",
    threshold: "Uyarı eşiği",
    tagsPh: "Etiket ekle ve Enter'a bas",
    removeTag: (t: string) => `${t} etiketini kaldır`,
    regionsPh: "Bölge seç…", noResult: "Sonuç yok", openList: "Listeyi aç",
    regionLabel: "Bölgeler",
    every: (n: number) => (n < 60 ? `${n} dakikada bir` : `${n / 60} saatte bir`),
    interval: "Kontrol aralığı",
    logLabel: "Çalışma günlüğü",
    chartLabels: ["00:00", "06:00", "12:00", "18:00", "23:00"],
  },
  en: {
    general: "General", generalBody: "The panel's name, time zone and default language.",
    alerts: "Alerts", alertsBody: "Who hears about what, when, and through which channel.",
    billing: "Billing", billingBody: "Plan, payment method and billing address.",
    threeItems: "3 items", twoItems: "2 items", oneItem: "1 item",
    copy: "Copy", copied: "Copied", failed: "Copy failed",
    stepNames: ["Details", "Connection", "Verify", "Done"],
    pwPlaceholder: "Your password", show: "Show password", hide: "Hide password",
    reveal: "Reveal the key", hideKey: "Hide the key",
    threshold: "Alert threshold",
    tagsPh: "Add a tag and press Enter",
    removeTag: (t: string) => `Remove the tag ${t}`,
    regionsPh: "Pick regions…", noResult: "No results", openList: "Open the list",
    regionLabel: "Regions",
    every: (n: number) => (n < 60 ? `Every ${n} minutes` : `Every ${n / 60} hours`),
    interval: "Check interval",
    logLabel: "Run log",
    chartLabels: ["00:00", "06:00", "12:00", "18:00", "23:00"],
  },
};

export function AccordionDemo({ lang }: L) {
  const n = N[lang];
  return (
    <Accordion>
      <Collapsible title={n.general} meta={n.threeItems} defaultOpen>
        <p className="text-body text-ink-soft">{n.generalBody}</p>
      </Collapsible>
      <Collapsible title={n.alerts} meta={n.twoItems}>
        <p className="text-body text-ink-soft">{n.alertsBody}</p>
      </Collapsible>
      <Collapsible title={n.billing} meta={n.oneItem}>
        <p className="text-body text-ink-soft">{n.billingBody}</p>
      </Collapsible>
    </Accordion>
  );
}

export function CodeDemo({ lang }: L) {
  const n = N[lang];
  const labels = { copy: n.copy, copied: n.copied, failed: n.failed };
  return (
    <div className="flex flex-col gap-4">
      <Code labels={labels}>npm install tamga-ui</Code>
      <Code labels={labels}>{`import { Button } from "tamga-ui";\nimport "tamga-ui/styles.css";`}</Code>
    </div>
  );
}

export function StepsDemo({ lang }: L) {
  const n = N[lang];
  const [i, setI] = useState(1);
  return (
    <div className="flex flex-col gap-5">
      <Steps steps={n.stepNames} current={i} />
      <span className="flex gap-2">
        <Button size="sm" onClick={() => setI((v) => Math.max(0, v - 1))}>
          ←
        </Button>
        <Button size="sm" onClick={() => setI((v) => Math.min(n.stepNames.length - 1, v + 1))}>
          →
        </Button>
      </span>
    </div>
  );
}

export function PasswordDemo({ lang }: L) {
  const n = N[lang];
  return (
    <div className="w-full max-w-96">
      <PasswordInput
        autoComplete="current-password"
        placeholder={n.pwPlaceholder}
        defaultValue="dogru-at-pil-zimba"
        labels={{ show: n.show, hide: n.hide }}
      />
    </div>
  );
}

export function SecretDemo({ lang }: L) {
  const n = N[lang];
  return (
    <div className="w-full max-w-md">
      <SecretField
        value="tk_live_9f2ac41ebd7740c8a1e5"
        labels={{ reveal: n.reveal, hide: n.hideKey, copy: n.copy, copied: n.copied, failed: n.failed }}
      />
    </div>
  );
}

export function SliderDemo({ lang }: L) {
  const n = N[lang];
  const [v, setV] = useState(72);
  return (
    <div className="w-full max-w-96">
      <Slider value={v} onChange={setV} min={0} max={100} suffix="%" label={n.threshold} />
    </div>
  );
}

export function TagsDemo({ lang }: L) {
  const n = N[lang];
  const [tags, setTags] = useState<string[]>(["jazz", "vinyl"]);
  return (
    <div className="w-full max-w-96">
      <TagsInput
        value={tags}
        onChange={setTags}
        placeholder={n.tagsPh}
        labels={{ remove: n.removeTag }}
      />
    </div>
  );
}

const REGIONS = [
  { value: "fra", label: "Frankfurt", hint: "eu-central" },
  { value: "ist", label: "İstanbul", hint: "eu-south" },
  { value: "lon", label: "London", hint: "eu-west" },
  { value: "nyc", label: "New York", hint: "us-east" },
  { value: "sin", label: "Singapore", hint: "ap-south" },
];

export function MultiSelectDemo({ lang }: L) {
  const n = N[lang];
  const [v, setV] = useState<string[]>(["fra", "ist"]);
  return (
    <div className="w-full max-w-md">
      <MultiSelect
        options={REGIONS}
        value={v}
        onChange={setV}
        placeholder={n.regionsPh}
        labels={{ empty: n.noResult, remove: (l) => `${l} ✕`, open: n.regionLabel }}
      />
    </div>
  );
}

export function ScheduleDemo({ lang }: L) {
  const n = N[lang];
  const [v, setV] = useState(5);
  return (
    <div className="w-full max-w-72">
      <ScheduleInput
        value={v}
        onChange={setV}
        options={[1, 5, 15, 30, 60, 360].map((m) => ({ minutes: m, label: n.every(m) }))}
        label={n.interval}
      />
    </div>
  );
}

export function LineChartDemo({ lang }: L) {
  const n = N[lang];
  return (
    <LineChart
      series={[
        { name: "p50", values: [18, 21, 19, 24, 22, 20, 23, 21, 19, 22], tone: "neutral" },
        { name: "p95", values: [42, 51, 47, 88, 64, 52, 71, 58, 49, 55], tone: "caution" },
      ]}
      labels={n.chartLabels}
      formatValue={(v) => `${v}ms`}
    />
  );
}

const LOG_TONES = ["neutral", "neutral", "caution", "neutral", "danger", "positive"] as const;

export function LogViewDemo({ lang }: L) {
  const n = N[lang];
  const lines = Array.from({ length: 24 }, (_, i) => ({
    id: `l${i}`,
    time: `10:${String(i * 2).padStart(2, "0")}:14`,
    text:
      lang === "tr"
        ? `kontrol tamamlandı · 200 · ${18 + (i % 9) * 3}ms · fra`
        : `check complete · 200 · ${18 + (i % 9) * 3}ms · fra`,
    tone: LOG_TONES[i % LOG_TONES.length],
  }));
  return <LogView lines={lines} label={n.logLabel} height={280} />;
}

/**
 * Offset merdiveni — Yasa 1'i sayı tablosu yerine ŞEKİL olarak gösterir.
 *
 * Bir tablo "3 = birincil buton" der ve okuyucu 3'ün ne kadar olduğunu
 * bilmez. Altı kutu yan yana konunca merdiven görünür hâle geliyor: ilki
 * gömülü, sonuncusu overlay düzleminde.
 */
export function OffsetLadder({ lang }: L) {
  const steps = [
    [0, lang === "tr" ? "basılı" : "pressed"],
    [1, lang === "tr" ? "mini buton" : "mini button"],
    [2, lang === "tr" ? "buton · kart" : "button · card"],
    [3, lang === "tr" ? "birincil" : "primary"],
    [4, lang === "tr" ? "birincil hover" : "primary hover"],
    [6, lang === "tr" ? "overlay" : "overlay"],
  ] as const;
  return (
    <div className="flex flex-wrap items-start gap-6 py-4">
      {steps.map(([n, label]) => (
        <span key={n} className="flex flex-col items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-ctl)] font-mono text-body text-ink"
            style={{
              background: "var(--color-shell)",
              border: "1px solid var(--color-edge)",
              /* Sert offset, bulanıklık YOK — anlatılan şeyin kendisi. */
              boxShadow: n ? `${n}px ${n}px 0 var(--color-edge)` : "none",
            }}
          >
            {n}
          </span>
          <span className="max-w-20 text-center text-caption text-ink-faint">{label}</span>
        </span>
      ))}
    </div>
  );
}
