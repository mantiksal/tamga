"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconButton,
  Badge,
  Field,
  Input,
  BarChart,
  Button,
  Dialog,
  Sheet,
  Popover,
  ConfirmDialog,
  DropdownMenu,
  MiniButton,
  Select,
  Toast,
  ToastViewport,
  Icon,
  Checkbox,
  RadioGroup,
  StackedBarChart,
  Switch,
  Segmented,
  TabPanel,
  Tabs,
  Pagination,
  SortHeader,
  SelectAll,
  SelectRow,
  SelectionBar,
  Card,
  CellActions,
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
  type Tone,
} from "tamga-ui";
import { Archive, Bell, Copy, CurrencyDollar, Delete, Download, Edit, Filter, More, Print, Refresh, Settings, Truck } from "tamga-ui/icons";
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
    satirKutusu: "Tablo satırındaki kutu (compact)",
    onSale: "İndirimdekiler",
    disabled: "Devre dışı",
    orderState: "Sipariş durumu",
    lookPlan: "Plan",
    lookBasic: "Başlangıç",
    lookBasicHint: "Tek kullanıcı, aylık rapor",
    lookTeam: "Takım",
    lookTeamHint: "On kullanıcıya kadar, haftalık rapor",
    lookScale: "Kurumsal",
    lookScaleHint: "Sınırsız kullanıcı, günlük rapor",
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
    dropImages: "Görselleri buraya bırak ya da",
    browse: "bilgisayardan seç",
    uploadHint: "PNG, JPG veya WEBP · en fazla 10 MB",
    cancelUpload: "Yüklemeyi iptal et",
    badType: "desteklenmeyen dosya türü",
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
    satirKutusu: "The checkbox in a table row (compact)",
    onSale: "On sale",
    disabled: "Disabled",
    orderState: "Order status",
    lookPlan: "Plan",
    lookBasic: "Starter",
    lookBasicHint: "One seat, a monthly report",
    lookTeam: "Team",
    lookTeamHint: "Up to ten seats, a weekly report",
    lookScale: "Scale",
    lookScaleHint: "Unlimited seats, a daily report",
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
    dropImages: "Drop images here or",
    browse: "choose from your computer",
    uploadHint: "PNG, JPG or WEBP · 10 MB at most",
    cancelUpload: "Cancel the upload",
    badType: "unsupported file type",
    remove: "Remove",
    moveLeft: "Move left",
    moveRight: "Move right",
    cover: "cover",
  },
};

/** Her örnek dili alır; hiçbiri kendi başına bir dil varsaymaz. */
type L = { lang: Locale };


/**
 * Çubuk grafik — sayılar YEREL biçimde.
 *
 * Bileşen dili bilmiyor ve bilmemeli; biçimleyici çağırandan geliyor. Ama bir
 * fonksiyon prop'u sunucu bileşeninden istemciye GEÇEMİYOR (React sunucudan
 * istemciye fonksiyon göndermiyor), o yüzden demo burada: sayfa sunucuda kalıyor,
 * biçimleyici istemcide kuruluyor. 3380 → "3.380" (tr) · "3,380" (en).
 */
export function BarChartDemo({ lang, bars }: L & { bars: readonly { label: string; value: number }[] }) {
  return (
    <BarChart
      bars={bars}
      className="w-full"
      labelWidth="7rem"
      formatValue={(v) => v.toLocaleString(lang === "tr" ? "tr-TR" : "en-US")}
    />
  );
}

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

/**
 * Onay diyaloğu · ve ÖN KOŞUL. Demoda kutucuk var, çünkü `confirmDisabled`ın
 * anlattığı şey ancak açılıp kapanınca görülüyor: aynı diyalog, bir kez
 * onaylanabilir bir kez onaylanamaz, ve ikinci hâlde gövde SEBEBİ yazıyor.
 */
export function ConfirmDemo({ lang }: L) {
  const d = D[lang];
  const n = N[lang];
  const [open, setOpen] = useState(false);
  const [engel, setEngel] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Button variant="danger" onClick={() => setOpen(true)}>
        {n.musteriSil}
      </Button>
      <Checkbox label={n.acikSiparis} checked={engel} onChange={setEngel} />
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title={n.musteriSilBaslik}
        confirmLabel={n.sil}
        cancelLabel={d.cancel}
        closeLabel={d.close}
        confirmDisabled={engel}
      >
        {engel ? n.acikSiparisGovde : n.musteriSilGovde}
      </ConfirmDialog>
    </div>
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
  const n = N[lang];
  /* Tasarımın kendi paneli: bir fiyat aralığı formu. Popover'ın asıl sözü
     "içinde form barındırabilir" ve bunu ancak gerçek bir form gösteriyor. */
  return (
    <Popover
      trigger={
        <Button>
          <Icon icon={Filter} size="xs" />
          {d.filters}
        </Button>
      }
      title={n.fiyatAraligi}
      footer={
        <>
          <Button size="sm" variant="ghost">
            {d.clear}
          </Button>
          <Button size="sm" variant="primary">
            {n.uygula}
          </Button>
        </>
      }
    >
      <span className="flex gap-2">
        <Input defaultValue="₺200" aria-label={n.enAz} className="tamga-sayi" />
        <Input defaultValue="₺2.000" aria-label={n.enCok} className="tamga-sayi" />
      </span>
    </Popover>
  );
}

/**
 * Hücre eylemleri · menü hücre sınırında KESİLMEDİĞİ için var.
 *
 * Demoda menünün açılabiliyor olması şart: kapalı hâlde bu bileşenin ne
 * yaptığı görünmüyor, ve gösterdiği şey tam olarak kırpmanın kapalı olması.
 */
export function CellActionsDemo({ lang }: L) {
  const d = D[lang];
  const n = N[lang];
  return (
    <Card className="w-full">
      <Table>
        <tbody>
          {ROWS.slice(0, 3).map((r) => (
            <tr key={r.id}>
              <td className="font-semibold">{r.name}</td>
              <td className="font-mono text-small text-ink-faint">{r.id.toUpperCase()}</td>
              <CellActions>
                <MiniButton aria-label={n.duzenle} title={n.duzenle}>
                  <Icon icon={Edit} size="xs" />
                </MiniButton>
                <DropdownMenu
                  align="end"
                  width={190}
                  trigger={
                    <MiniButton aria-label={d.more} title={d.more}>
                      <Icon icon={More} size="xs" />
                    </MiniButton>
                  }
                  items={[
                    { label: n.cogalt, icon: <Icon icon={Copy} size="xs" />, onSelect: () => {} },
                    { label: n.arsivle, icon: <Icon icon={Archive} size="xs" />, onSelect: () => {} },
                    { kind: "separator" },
                    { label: d.delete, icon: <Icon icon={Delete} size="xs" />, state: "danger", onSelect: () => {} },
                  ]}
                />
              </CellActions>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

export function MenuDemo({ lang }: L) {
  const d = D[lang];
  const n = N[lang];
  return (
    <DropdownMenu
      align="start"
      width={240}
      trigger={
        <button className="tamga-icon-btn" aria-label={d.more}>
          <Icon icon={More} size="sm" />
        </button>
      }
      /* Kısayol METNİ menüde, BAĞI değil: tuşu bağlayan sayfa, menü yalnız
         söylüyor. Bir menünün global kısayol bağlaması, zaten bağlamış olan
         sayfayla çakışırdı. */
      items={[
        { kind: "label", label: n.siparis },
        { label: n.kargola, icon: <Icon icon={Download} size="xs" />, shortcut: "⌘K", onSelect: () => {} },
        { label: n.fatura, icon: <Icon icon={Print} size="xs" />, shortcut: "⌘P", onSelect: () => {} },
        { label: d.refresh, icon: <Icon icon={Refresh} size="xs" />, shortcut: "R", onSelect: () => {} },
        { kind: "separator" },
        { label: n.iptal, icon: <Icon icon={Delete} size="xs" />, state: "danger", shortcut: "⌫", onSelect: () => {} },
      ]}
    />
  );
}

/* Referansın kendi listesi: kargo firmaları, ve her seçeneğin sağında sessiz
   bir teslim süresi · seçimi belirleyen şey firmanın adı kadar o süre. */
export function SelectDemo({ lang }: L) {
  const d = D[lang];
  const n = N[lang];
  const [value, setValue] = useState<string>();
  return (
    <div className="w-70">
      <Select
        icon={Truck}
        options={[
          { value: n.kargo1, hint: n.sure1 },
          { value: n.kargo2, hint: n.sure2 },
          { value: n.kargo3, hint: n.sure3 },
          { value: n.kargo4, hint: n.sure4 },
        ]}
        value={value}
        onChange={setValue}
        placeholder={n.kargoSec}
        aria-label={n.kargoFirmasi}
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

/* Tasarımın kendi içeriği: bir paragraf, içinde bir bağlantı, altında madde
   listesi · editörün sözü "biçimli metin" ve bunu ancak biçimli bir metin
   gösteriyor. Düz tek satır, araç çubuğunun ne işe yaradığını söylemiyordu. */
const EDITOR_BASLANGIC = {
  tr: '<p>%100 keten kumaştan, rahat kesim yazlık gömlek. <a href="#rich-text">Beden tablosuna</a> göz at.</p><ul><li>Nefes alan doku</li><li>Sedef düğmeler</li><li>30°C\u2019de yıkama</li></ul>',
  en: '<p>A relaxed-fit summer shirt in 100% linen. Check the <a href="#rich-text">size chart</a>.</p><ul><li>Breathable weave</li><li>Mother-of-pearl buttons</li><li>Wash at 30°C</li></ul>',
};

export function RichTextDemo({ lang }: L) {
  const [html, setHtml] = useState(EDITOR_BASLANGIC[lang]);
  return (
    <div className="w-full max-w-xl">
      <RichText
        value={html}
        onChange={setHtml}
        allow={["bold", "italic", "link", "ul", "ol"]}
        hint={lang === "tr" ? "Markdown destekler" : "Markdown supported"}
        labels={EDITOR_ETIKET[lang]}
        ariaLabel={lang === "tr" ? "Açıklama" : "Description"}
        rows={5}
      />
    </div>
  );
}

export function ToastDemo({ lang }: L) {
  const d = D[lang];
  const n = N[lang];
  const [items, setItems] = useState<
    { id: number; tone: "positive" | "danger"; title: string; undo?: boolean }[]
  >([]);

  function push(tone: "positive" | "danger", title: string, undo?: boolean) {
    setItems((s) => [{ id: Date.now(), tone, title, undo }, ...s].slice(0, 3));
  }

  return (
    <>
      <div className="flex gap-3">
        <Button onClick={() => push("positive", d.saved)}>{d.success}</Button>
        <Button variant="danger" onClick={() => push("danger", d.notSaved)}>
          {d.failure}
        </Button>
        {/* Eylemli bildirim 8 saniye duruyor, ötekiler 5: "Geri al"a uzanan
            elin önce cümleyi okuması gerekiyor. */}
        <Button onClick={() => push("positive", n.silindi, true)}>{n.geriAlmali}</Button>
      </div>
      <ToastViewport position="bottom-right">
        {items.map((t) => (
          <Toast
            key={t.id}
            tone={t.tone}
            title={t.title}
            action={
              t.undo ? (
                <Button size="sm" onClick={() => setItems((s) => s.filter((x) => x.id !== t.id))}>
                  {n.geriAl}
                </Button>
              ) : undefined
            }
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
  const [c, setC] = useState(true);
  return (
    <div className="flex flex-col gap-3">
      <Checkbox label={d.inStock} checked={a} onChange={setA} />
      <Checkbox label={d.onSale} checked={b} onChange={setB} />
      <Checkbox label={d.disabled} checked={false} disabled />
      {/* İKİNCİ YÜZ DE BURADA, ve bir süre değildi: sayfa yalnız form kutusunu
          gösteriyordu, tablo kutusunu ilk kez gören "bu kitin değil" diyordu. */}
      <Checkbox compact label={d.satirKutusu} checked={c} onChange={setC} />
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

/**
 * Aynı gruba iki kabuk.
 *
 * İkisi yan yana duruyor çünkü fark ancak öyle okunuyor: kart ikinci bir satır
 * taşıyor, çip taşımıyor. Seçim ikisinde de çerçeveyle, işaret ikisinde de
 * yerinde.
 */
export function LookDemo({ lang }: L) {
  const d = D[lang];
  const n = N[lang];
  const [v, setV] = useState("magaza");
  const [kim, setKim] = useState("vip");
  /* Tasarımın kendi ikilisi: solda fiyatlı kart seçenekleri, sağda düz liste ·
     kart tipi tam da "seçenekler arasında açıklama ya da fiyat farkı olduğunda"
     kullanılıyor, ve iki biçim yan yana durunca fark okunuyor. */
  const kargolar = [
    { value: "standart", ad: n.kargoStandart, alt: n.kargoStandartAlt, fiyat: "₺49" },
    { value: "hizli", ad: n.kargoHizli, alt: n.kargoHizliAlt, fiyat: "₺89" },
    { value: "magaza", ad: n.kargoMagaza, alt: n.kargoMagazaAlt, fiyat: n.ucretsiz },
  ];
  return (
    <div className="flex w-full flex-wrap items-start gap-8">
      <RadioGroup
        look="card"
        label={n.teslimat}
        value={v}
        onChange={setV}
        className="w-85 max-w-full"
        options={kargolar.map((o) => ({
          value: o.value,
          label: (
            <span className="flex w-full items-center gap-3">
              <span className="min-w-0 flex-1">
                <span className="text-body block font-semibold">{o.ad}</span>
                <span className="text-caption text-ink-faint block">{o.alt}</span>
              </span>
              <span className="shrink-0 font-mono text-small font-bold">{o.fiyat}</span>
            </span>
          ),
        }))}
      />
      <RadioGroup
        label={n.kimeGorunsun}
        value={kim}
        onChange={setKim}
        options={[
          { value: "tum", label: n.tumMusteriler },
          { value: "yeni", label: n.yeniMusteriler },
          { value: "vip", label: n.vipMusteriler },
        ]}
      />
      <RadioGroup
        look="chip"
        label={d.lookPlan}
        value={v}
        onChange={setV}
        options={kargolar.map((o) => ({ value: o.value, label: o.ad }))}
      />
    </div>
  );
}

export function SwitchDemo({ lang }: L) {
  const n = N[lang];
  const [ayarlar, setAyarlar] = useState([true, false, true]);
  /* ANAHTARIN ASIL YERİ BİR AYAR LİSTESİ: tek başına duran bir anahtar neyi
     açıp kapattığını söylemiyor · adı ve altındaki cümle onun yarısı. */
  const satirlar = [
    { ad: n.swSiparis, alt: n.swSiparisAlt },
    { ad: n.swBakim, alt: n.swBakimAlt },
    { ad: n.swStok, alt: n.swStokAlt },
  ];
  return (
    <div className="flex w-full max-w-130 flex-col">
      {satirlar.map((r, i) => (
        <span
          key={r.ad}
          className="flex items-center gap-4 py-3"
          style={{ borderBottom: "1px dashed var(--color-line)" }}
        >
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-body font-bold">{r.ad}</span>
            <span className="text-small text-ink-faint">{r.alt}</span>
          </span>
          <Switch
            on={ayarlar[i] ?? false}
            onChange={(v) => setAyarlar((a) => a.map((x, j) => (j === i ? v : x)))}
            label={r.ad}
          />
        </span>
      ))}
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

/**
 * İki tür bir arada · tarif ikisini yan yana gösteriyor ve sebebi görünür:
 * çizgili şerit SAYFANIN görünümlerini, klasör ise bir YÜZEYİN bölümlerini
 * ayırıyor.
 */
export function TabsDemo({ lang }: L) {
  const d = D[lang];
  const n = N[lang];
  const [t, setT] = useState("all");
  const [k, setK] = useState("general");

  const durum: Record<string, string> = {
    all: n.tumuMetin,
    live: n.yayindaMetin,
    draft: n.taslakMetin,
    archive: n.arsivMetin,
  };
  const klasor: Record<string, string> = {
    general: n.genelMetin,
    price: n.fiyatMetin,
    stock: n.stokMetin,
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-3.5">
        <Tabs
          label={d.productTabs}
          value={t}
          onChange={setT}
          items={[
            { value: "all", label: n.tumu, count: 128 },
            { value: "live", label: n.yayinda, count: 96 },
            { value: "draft", label: n.taslak, count: 21 },
            { value: "archive", label: n.arsiv, count: 11 },
          ]}
        />
        <p className="text-[length:var(--docs-small)] text-ink-faint">{durum[t]}</p>
      </div>

      <div className="flex flex-col">
        <Tabs
          look="folder"
          label={n.bolumler}
          value={k}
          onChange={setK}
          items={[
            { value: "general", label: n.genel },
            { value: "price", label: n.fiyat },
            { value: "stock", label: n.stok },
          ]}
        />
        <TabPanel className="text-ink-faint">{klasor[k]}</TabPanel>
      </div>
    </div>
  );
}

/* On dört gün, üç kanal · kırılımın işi toplamı BÖLMEK, o yüzden seriler
   gerçekçi oranlarda: web en büyük, pazaryeri en küçük ve dalgalı. */
const YIGIN = {
  web: [41, 37, 50, 46, 61, 57, 70, 44, 48, 54, 67, 72, 79, 76],
  mobil: [30, 34, 30, 41, 38, 45, 52, 32, 36, 40, 47, 52, 58, 55],
  pazar: [12, 15, 10, 17, 21, 19, 24, 14, 17, 20, 22, 25, 27, 29],
};

export function StackedBarDemo({ lang }: L) {
  const n = N[lang];
  const etiketler = YIGIN.web.map((_, i) => `${i + 1} ${n.eylul}`);
  return (
    <StackedBarChart
      labels={etiketler}
      height={260}
      series={[
        { name: n.web, values: YIGIN.web },
        { name: n.mobil, values: YIGIN.mobil },
        { name: n.pazaryeri, values: YIGIN.pazar },
      ]}
    />
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

/**
 * İKİ SÜTUN DA SIRALANABİLİR, biri değil: sıralı olmayan sütunun nötr glifi
 * ancak o zaman görünüyor, ve bu sayfanın anlattığı üç durumdan biri o.
 */
export function DataTableDemo({ lang }: L) {
  const d = D[lang];
  const [sira, setSira] = useState<{ key: "name" | "stock"; dir: SortDirection }>({
    key: "stock",
    dir: "desc",
  });
  const [sel, setSel] = useState<string[]>(["r1"]);

  const sorted = [...ROWS].sort((a, b) => {
    const yon = sira.dir === "desc" ? -1 : 1;
    return sira.key === "stock" ? (a.stock - b.stock) * yon : a.name.localeCompare(b.name) * yon;
  });
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
            <SortHeader
              direction={sira.key === "name" ? sira.dir : undefined}
              onSort={(dir) => setSira({ key: "name", dir })}
            >
              {d.product}
            </SortHeader>
            <SortHeader
              direction={sira.key === "stock" ? sira.dir : undefined}
              onSort={(dir) => setSira({ key: "stock", dir })}
              align="right"
              className="w-24"
            >
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

/**
 * Rozet · canlı sayaç.
 *
 * Tarifte "dene" satırı var, çünkü rozetin üç kuralı ancak DEĞİŞTİRİLİNCE
 * görülüyor: sıfırda çizilmiyor (ikon yerinden oynamıyor), `max`ı geçince
 * "99+" oluyor, ve ton yalnız rengi değiştiriyor. Üç sabit örnek bunu
 * gösteremiyordu.
 */
export function BadgeDemo({
  lang,
  labels,
  unread,
  notifications,
}: L & { labels: DemoLabels; unread: string; notifications: string }) {
  const [count, setCount] = useState(3);
  const [tone, setTone] = useState<Tone>("danger");
  const kod = `<Badge count={${count}}${tone === "danger" ? "" : ` tone="${tone}"`} label="${unread}">
  <IconButton aria-label="${notifications}"><Icon icon={Bell} size="sm" /></IconButton>
</Badge>`;

  return (
    <Demo
      labels={labels}
      code={kod}
      dene={
        <>
          <span className="flex shrink-0 items-center gap-2.5">
            <span className="font-mono text-caption text-ink-faint">count</span>
            <NumberInput
              value={count}
              onChange={(n) => setCount(Math.max(0, n ?? 0))}
              min={0}
              max={999}
              labels={{ increase: "+1", decrease: "−1" }}
              className="w-28"
            />
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            {[0, 3, 99, 140].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className="tamga-mini-btn font-mono"
                aria-pressed={count === n}
              >
                {n}
              </button>
            ))}
          </span>
          <span className="flex shrink-0 items-center gap-2.5">
            <span className="font-mono text-caption text-ink-faint">tone</span>
            <Segmented
              label="tone"
              value={tone}
              onChange={(v) => setTone(v)}
              options={[
                { value: "danger" as Tone, label: "danger" },
                { value: "caution" as Tone, label: "caution" },
                { value: "positive" as Tone, label: "positive" },
                { value: "info" as Tone, label: "info" },
              ]}
            />
          </span>
        </>
      }
    >
      <Badge count={count} tone={tone} label={unread}>
        <IconButton aria-label={notifications}>
          <Icon icon={Bell} size="sm" />
        </IconButton>
      </Badge>
      <Badge count={count} tone={tone} label={unread} />
    </Demo>
  );
}

export function NumberInputDemo({ lang }: L) {
  const d = D[lang];
  const n = N[lang];
  const [adet, setAdet] = useState<number | null>(3);
  const [esik, setEsik] = useState<number | null>(10);
  const [price, setPrice] = useState<number | null>(249.9);
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Tasarımın kendi ikilisi: tıklanan adet, yazılan eşik. */}
      <div className="flex flex-wrap items-end gap-8">
        <Field label={n.adet}>
          <NumberInput
            look="quantity"
            value={adet}
            onChange={setAdet}
            min={0}
            max={99}
            labels={{ increase: d.stockUp, decrease: d.stockDown }}
          />
        </Field>
        <Field label={n.kritikEsik}>
          <NumberInput
            value={esik}
            onChange={setEsik}
            min={0}
            max={999}
            locale={lang === "tr" ? "tr-TR" : "en-US"}
            className="w-40"
            labels={{ increase: d.stockUp, decrease: d.stockDown }}
          />
        </Field>
      </div>
      <div className="max-w-96">
        <Field label={n.fiyatEtiket}>
          <NumberInput
            value={price}
            onChange={setPrice}
            step={0.1}
            min={0}
            suffix="₺"
            locale={lang === "tr" ? "tr-TR" : "en-US"}
            full
            labels={{ increase: d.priceUp, decrease: d.priceDown }}
          />
        </Field>
      </div>
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
      onReorder={(id, hedef) =>
        setItems((s) => {
          const i = s.findIndex((x) => x.id === id);
          if (i < 0 || hedef < 0 || hedef >= s.length) return s;
          /* Takas değil kaydırma: 4. görseli kapak yapmak istiyorsan
             aradakiler bir sağa kaysın, kapak 4. sıraya fırlamasın. */
          const copy = [...s];
          const [tasinan] = copy.splice(i, 1);
          copy.splice(hedef, 0, tasinan!);
          return copy;
        })
      }
      labels={{
        drop: d.dropImages,
        browse: d.browse,
        hint: d.uploadHint,
        cancel: d.cancelUpload,
        remove: d.remove,
        moveLeft: d.moveLeft,
        moveRight: d.moveRight,
        primary: d.cover,
      }}
      /* Üç satır, üç durum · tasarımın kendi örneği de bu üçünü gösteriyor:
         giden, gelen, reddedilen. Gerçek bir yükleme olmadan görülmüyorlar. */
      files={[
        { id: "f1", name: "keten-gomlek-on.jpg", progress: 64 },
        { id: "f2", name: "keten-gomlek-arka.jpg", size: "1,8 MB" },
        { id: "f3", name: "katalog.pdf", error: d.badType },
      ]}
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
    logTumu: "Tümü", logHata: "Hata", logUyari: "Uyarı", logBilgi: "Bilgi",
    adet: "Adet", kritikEsik: "Kritik stok eşiği", fiyatEtiket: "Fiyat",
    teslimat: "Teslimat yöntemi",
    swSiparis: "Sipariş bildirimleri", swSiparisAlt: "Her yeni siparişte e-posta gönder.",
    swBakim: "Bakım modu", swBakimAlt: "Mağaza ziyaretçilere kapanır.",
    swStok: "Stok uyarısı", swStokAlt: "Eşiğin altına inen ürünleri bildir.",
    fiyatAraligi: "Fiyat aralığı", uygula: "Uygula", enAz: "En az fiyat", enCok: "En çok fiyat",
    yeniParola: "Yeni parola",
    pwZayif: "Zayıf", pwOrta: "Orta", pwIyi: "İyi", pwGuclu: "Güçlü",
    pwKural: "en az 8 karakter, bir büyük harf, bir rakam ve bir sembol",
    odemeAnahtari: "Ödeme API anahtarı",
    anahtarMeta: "Son kullanım: 2 saat önce · Oluşturan: Elif Yıldız",
    kargoStandart: "Standart kargo", kargoStandartAlt: "2-4 iş günü",
    kargoHizli: "Hızlı kargo", kargoHizliAlt: "Ertesi gün",
    kargoMagaza: "Mağazadan teslim", kargoMagazaAlt: "Kadıköy şubesi",
    ucretsiz: "Ücretsiz",
    kimeGorunsun: "Kimlere görünsün",
    tumMusteriler: "Tüm müşteriler", yeniMusteriler: "Yeni müşteriler", vipMusteriler: "VIP müşteriler",
    duzenle: "Düzenle",
    musteriSil: "Müşteriyi sil",
    musteriSilBaslik: "Müşteriyi sil?",
    musteriSilGovde: "Mert Aksoy ve sipariş geçmişi kalıcı olarak silinecek. Bu işlem geri alınamaz.",
    acikSiparis: "Müşterinin açık siparişi var",
    acikSiparisGovde: "Mert Aksoy'un 2 açık siparişi var. Açık siparişi olan bir müşteri silinemez; önce siparişleri kapatın.",
    sil: "Sil",
    geriAl: "Geri al",
    silindi: "Ürün arşive taşındı",
    geriAlmali: "Geri al düğmeli bildirim",
    siparis: "SİPARİŞ",
    kargoFirmasi: "Kargo firması", kargoSec: "Kargo firması seç",
    kargo1: "Yurtiçi Kargo", sure1: "2-3 gün",
    kargo2: "Aras Kargo", sure2: "1-2 gün",
    kargo3: "MNG Kargo", sure3: "2-4 gün",
    kargo4: "Sürat Kargo", sure4: "3-5 gün",
    eylul: "Eyl", web: "Web", mobil: "Mobil", pazaryeri: "Pazaryeri",
    tumu: "Tümü", yayinda: "Yayında", taslak: "Taslak", arsiv: "Arşiv",
    tumuMetin: "Mağazadaki bütün ürünler.",
    yayindaMetin: "Vitrinde görünen ürünler.",
    taslakMetin: "Henüz yayınlanmamış ürünler.",
    arsivMetin: "Satıştan kaldırılmış ürünler.",
    bolumler: "Ürün bölümleri",
    genel: "Genel", fiyat: "Fiyat", stok: "Stok",
    genelMetin: "Ürün adı, açıklama ve kategori.",
    fiyatMetin: "Liste fiyatı, indirim ve vergi oranı.",
    stokMetin: "Depo adedi, kritik eşik ve tedarik süresi.",
    islemler: "İşlemler",
    kargola: "Kargola",
    fatura: "Fatura yazdır",
    iptal: "Siparişi iptal et",
    cogalt: "Çoğalt",
    arsivle: "Arşivle",
    yeniSatir: (n: number) => (n === 1 ? "1 yeni satır" : `${n} yeni satır`),
    chartLabels: ["00:00", "06:00", "12:00", "18:00", "23:00"],
    thisPeriod: "Bu dönem",
    lastPeriod: "Geçen dönem",
    days: "Günler",
    dayNames: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
    hours: "Saat",
    between: "ile",
    zone: "arası · İstanbul (GMT+3)",
    everyDay: "Her gün",
    weekdays: "Her hafta içi",
    noDay: "Gün seçilmedi",
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
    logTumu: "All", logHata: "Error", logUyari: "Warning", logBilgi: "Info",
    adet: "Quantity", kritikEsik: "Low stock threshold", fiyatEtiket: "Price",
    teslimat: "Delivery method",
    swSiparis: "Order notifications", swSiparisAlt: "Send an e-mail on every new order.",
    swBakim: "Maintenance mode", swBakimAlt: "The store closes to visitors.",
    swStok: "Low stock alert", swStokAlt: "Report products that fall under the threshold.",
    fiyatAraligi: "Price range", uygula: "Apply", enAz: "Lowest price", enCok: "Highest price",
    yeniParola: "New password",
    pwZayif: "Weak", pwOrta: "Fair", pwIyi: "Good", pwGuclu: "Strong",
    pwKural: "at least 8 characters, one capital, one digit and one symbol",
    odemeAnahtari: "Payment API key",
    anahtarMeta: "Last used: 2 hours ago · Created by: Elif Yıldız",
    kargoStandart: "Standard shipping", kargoStandartAlt: "2-4 business days",
    kargoHizli: "Express shipping", kargoHizliAlt: "Next day",
    kargoMagaza: "Pick up in store", kargoMagazaAlt: "Kadıköy branch",
    ucretsiz: "Free",
    kimeGorunsun: "Who sees it",
    tumMusteriler: "All customers", yeniMusteriler: "New customers", vipMusteriler: "VIP customers",
    duzenle: "Edit",
    musteriSil: "Delete customer",
    musteriSilBaslik: "Delete customer?",
    musteriSilGovde: "Mert Aksoy and their order history will be permanently deleted. This cannot be undone.",
    acikSiparis: "The customer has open orders",
    acikSiparisGovde: "Mert Aksoy has 2 open orders. A customer with open orders cannot be deleted; close the orders first.",
    sil: "Delete",
    geriAl: "Undo",
    silindi: "Product moved to the archive",
    geriAlmali: "Notification with undo",
    siparis: "ORDER",
    kargoFirmasi: "Carrier", kargoSec: "Pick a carrier",
    kargo1: "Royal Mail", sure1: "2-3 days",
    kargo2: "DPD", sure2: "1-2 days",
    kargo3: "Evri", sure3: "2-4 days",
    kargo4: "Yodel", sure4: "3-5 days",
    eylul: "Sep", web: "Web", mobil: "Mobile", pazaryeri: "Marketplace",
    tumu: "All", yayinda: "Live", taslak: "Draft", arsiv: "Archive",
    tumuMetin: "Every product in the store.",
    yayindaMetin: "Products visible in the storefront.",
    taslakMetin: "Products not published yet.",
    arsivMetin: "Products taken off sale.",
    bolumler: "Product sections",
    genel: "General", fiyat: "Price", stok: "Stock",
    genelMetin: "Product name, description and category.",
    fiyatMetin: "List price, discount and tax rate.",
    stokMetin: "Warehouse count, critical threshold and lead time.",
    islemler: "Actions",
    kargola: "Ship",
    fatura: "Print invoice",
    iptal: "Cancel order",
    cogalt: "Duplicate",
    arsivle: "Archive",
    yeniSatir: (n: number) => (n === 1 ? "1 new line" : `${n} new lines`),
    chartLabels: ["00:00", "06:00", "12:00", "18:00", "23:00"],
    thisPeriod: "This period",
    lastPeriod: "Last period",
    days: "Days",
    dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    hours: "Hours",
    between: "to",
    zone: "· Istanbul (GMT+3)",
    everyDay: "Every day",
    weekdays: "Every weekday",
    noDay: "No day selected",
  },
};

/** İki kılık yan yana: kartlar ve tek yüzeyin içindeki sessiz yığın. */
export function AccordionDemo({ lang }: L) {
  const n = N[lang];
  const bolumler = (
    <>
      <Collapsible title={n.general} icon={Settings} meta={n.threeItems} defaultOpen>
        <p className="text-body text-ink-soft">{n.generalBody}</p>
      </Collapsible>
      <Collapsible title={n.alerts} icon={Bell} meta={n.twoItems}>
        <p className="text-body text-ink-soft">{n.alertsBody}</p>
      </Collapsible>
      <Collapsible title={n.billing} icon={CurrencyDollar} meta={n.oneItem}>
        <p className="text-body text-ink-soft">{n.billingBody}</p>
      </Collapsible>
    </>
  );
  return (
    <div className="flex w-full flex-col gap-8">
      <Accordion>{bolumler}</Accordion>
      <Accordion look="list">{bolumler}</Accordion>
    </div>
  );
}

export function CodeDemo({ lang }: L) {
  const n = N[lang];
  const labels = { copy: n.copy, copied: n.copied, failed: n.failed };
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Tek satırlık kurulum komutu da aynı blok: dosya adı yok, şerit yalnız
          kopyala düğmesini taşıyor. */}
      <Code labels={labels}>npm install tamga-ui</Code>
      <Code labels={labels} filename="webhook.js">{`import { createHmac } from "node:crypto";

export function verify(req, secret) {
  const signature = req.headers["x-tamga-signature"];
  const digest = createHmac("sha256", secret).update(req.rawBody).digest("hex");
  return signature === digest;
}`}</Code>
    </div>
  );
}


/** Adım kimlikleri: dilden bağımsız, `stepNames` ile aynı sırada. */
const ADIM_ANAHTARLARI = ["details", "connection", "verify", "done"] as const;

export function StepsDemo({ lang }: L) {
  const n = N[lang];
  const [i, setI] = useState(1);
  return (
    <div className="flex flex-col gap-5">
      {/* ANAHTARLAR ÇEVRİLMİYOR, etiketler çevriliyor. Gösterimin kendisi de
          bunu anlatıyor: bir adımın kimliği dile bağlı olamaz. */}
      <Steps
        steps={n.stepNames.map((label, j) => ({ key: ADIM_ANAHTARLARI[j] ?? label, label }))}
        current={i}
      />
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
  const [pw, setPw] = useState("dogru-at-pil");
  /* GÜCÜ ÜRÜN ÖLÇÜYOR, kit değil: dört kural, kaçı sağlanıyorsa o kadar çubuk.
     Kitin işi çubukları yakmak; neyin güçlü sayıldığı bir politika. */
  const kurallar = [pw.length >= 8, /[A-ZĞÜŞİÖÇ]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  const gecen = kurallar.filter(Boolean).length;
  const seviye = [n.pwZayif, n.pwZayif, n.pwOrta, n.pwIyi, n.pwGuclu][gecen] ?? n.pwZayif;
  return (
    <div className="w-full max-w-96">
      <Field label={n.yeniParola}>
        <PasswordInput
          autoComplete="new-password"
          placeholder={n.pwPlaceholder}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          labels={{ show: n.show, hide: n.hide }}
          strength={{ value: gecen, note: `${seviye} · ${n.pwKural}` }}
        />
      </Field>
    </div>
  );
}

export function SecretDemo({ lang }: L) {
  const n = N[lang];
  return (
    <div className="w-full">
      <Field label={n.odemeAnahtari} description={n.anahtarMeta}>
        <SecretField
          value="sk_live_9f2ac41ebd7740c8a1e5Q7"
          labels={{ reveal: n.reveal, hide: n.hideKey, copy: n.copy, copied: n.copied, failed: n.failed }}
        />
      </Field>
    </div>
  );
}

export function SliderDemo({ lang }: L) {
  const n = N[lang];
  const [v, setV] = useState(72);
  return (
    <div className="w-full max-w-96">
      <Slider
        value={v}
        onChange={setV}
        min={0}
        max={100}
        suffix="%"
        label={n.threshold}
        scale={["0%", "50%", "100%"]}
      />
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
  /* Tarifteki demo: hafta içi, 09:00 ile 18:00 arası. */
  const [gunler, setGunler] = useState<number[]>([1, 2, 3, 4, 5]);
  const [bas, setBas] = useState("09:00");
  const [bit, setBit] = useState("18:00");

  /* ÖZET CÜMLEYİ ÇAĞIRAN KURUYOR: kit çeviri yapmıyor, ve "hafta içi" ile
     "her gün" arasındaki fark bir dilbilgisi kararı. */
  const hepsi = gunler.length === 7;
  const haftaIci = gunler.length === 5 && [1, 2, 3, 4, 5].every((g) => gunler.includes(g));
  const gunMetni = hepsi
    ? n.everyDay
    : haftaIci
      ? n.weekdays
      : gunler.length === 0
        ? n.noDay
        : gunler.map((g) => n.dayNames[g]).join(", ");

  return (
    <div className="w-full max-w-md">
      <ScheduleInput
        days={gunler}
        onDaysChange={setGunler}
        from={bas}
        to={bit}
        onFromChange={setBas}
        onToChange={setBit}
        labels={{
          days: n.days,
          dayNames: n.dayNames,
          hours: n.hours,
          between: n.between,
          zone: n.zone,
        }}
        summary={`${gunMetni} · ${bas} - ${bit}`}
      />
    </div>
  );
}

export function LineChartDemo({ lang }: L) {
  const n = N[lang];
  return (
    <LineChart
      series={[
        { name: n.thisPeriod, values: [42, 51, 47, 88, 64, 52, 71, 58, 49, 55] },
        { name: n.lastPeriod, values: [38, 44, 46, 61, 58, 49, 62, 54, 47, 50], dashed: true },
      ]}
      labels={n.chartLabels}
      formatValue={(v) => `${v}ms`}
    />
  );
}

/* Seviye sözcüğü hem TR hem EN sayfada aynı: bir log seviyesi çevrilen bir
   arayüz metni değil, satırın kendisinde duran makine etiketi. */
/* Tasarımın kendi satırları: bir mağazanın günlüğü, jenerik "check complete"
   değil · bir günlüğün okunup okunmadığı ancak gerçek cümlelerle görülüyor. */
const LOG_SEVIYE = [
  { level: "INFO", tone: "info", tr: "Sipariş #TG-10482 oluşturuldu", en: "Order #TG-10482 created" },
  { level: "INFO", tone: "info", tr: "Ödeme sağlayıcısından onay alındı", en: "Payment provider approved" },
  { level: "WARN", tone: "caution", tr: "Stok eşiği aşıldı: TG-KTN-01 (8 adet)", en: "Stock threshold crossed: TG-KTN-01 (8 left)" },
  { level: "ERROR", tone: "danger", tr: "Kargo API yanıt vermedi (timeout 5000ms)", en: "Shipping API did not answer (timeout 5000ms)" },
  { level: "INFO", tone: "info", tr: "Kargo API yeniden denendi, başarılı", en: "Shipping API retried, succeeded" },
  { level: "WARN", tone: "caution", tr: "Kupon EFSANE25 kullanım limitinin %90'ına ulaştı", en: "Coupon EFSANE25 reached 90% of its limit" },
  { level: "DEBUG", tone: "neutral", tr: "Önbellek temizlendi: /urunler/giyim", en: "Cache cleared: /products/apparel" },
] as const;

function logSatiri(i: number, lang: "tr" | "en") {
  const s = LOG_SEVIYE[i % LOG_SEVIYE.length]!;
  const dk = String((i * 2) % 60).padStart(2, "0");
  return {
    id: `l${i}`,
    time: `14:${dk}:${String((i * 7) % 60).padStart(2, "0")}`,
    level: s.level,
    tone: s.tone,
    text: lang === "tr" ? s.tr : s.en,
  };
}

/**
 * AKAN demo, durağan liste değil: bu bileşenin asıl sözü ("yukarıdaysan seni
 * fırlatmam, sayıyı söylerim") ancak satır GELİRKEN görülüyor. Durağan bir
 * listede ne takip ne de düğme görünüyordu.
 */
export function LogViewDemo({ lang }: L) {
  const n = N[lang];
  const [sayi, setSayi] = useState(14);
  const [seviye, setSeviye] = useState("*");

  useEffect(() => {
    const t = setInterval(() => setSayi((s) => (s < 60 ? s + 1 : s)), 1600);
    return () => clearInterval(t);
  }, []);

  const lines = useMemo(
    () => Array.from({ length: sayi }, (_, i) => logSatiri(i, lang)),
    [sayi, lang],
  );

  /* SÜZME ÇAĞIRANIN TARAFINDA: kit çubuğu çiziyor, hangi seviyenin hangi
     düğmeye düştüğünü ürün biliyor. */
  const gorunen = seviye === "*" ? lines : lines.filter((l) => l.level === seviye);

  return (
    <LogView
      lines={gorunen}
      label={n.logLabel}
      labels={{ newLines: n.yeniSatir }}
      filters={{
        value: seviye,
        onChange: setSeviye,
        options: [
          { value: "*", label: n.logTumu },
          { value: "ERROR", label: n.logHata },
          { value: "WARN", label: n.logUyari },
          { value: "INFO", label: n.logBilgi },
        ],
      }}
      height={320}
    />
  );
}

/**
 * Offset merdiveni — Yasa 1'i sayı tablosu yerine ŞEKİL olarak gösterir.
 *
 * Bir tablo "4 = düğme" der ve okuyucu 4'ün ne kadar olduğunu bilmez. Kutular
 * yan yana konunca merdiven görünür hâle geliyor: ilki gömülü, sonuncusu
 * overlay düzleminde.
 */
export function OffsetLadder({ lang, steps }: L & { steps: readonly string[] }) {
  /* BASAMAKLAR KİTTEN ÖLÇÜLDÜ, hatırlanmadı. Liste bir süre yanlıştı: tasarım
     dili yenilenirken bütün merdiven bir basamak yukarı kaydı ve eski liste
     kaldı. Metin artık sayfanın kendi lejantından geliyor · iki yerde iki
     gerçek olmasın. */
  const [secili, setSecili] = useState(4);
  const [basili, setBasili] = useState<number | null>(null);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {steps.map((_, n) => {
          const on = n === secili;
          const bas = n === basili;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={on}
              onClick={() => setSecili(n)}
              onPointerDown={() => setBasili(n)}
              onPointerUp={() => setBasili(null)}
              onPointerLeave={() => setBasili(null)}
              className="flex aspect-square flex-col items-center justify-center gap-0.5 rounded-(--radius-ctl)"
              style={{
                background: on ? "var(--color-accent-bg)" : "var(--color-shell)",
                /* 2-4 BASILAN kontrollerin basamağı: kenarları da onların kenarı. */
                border: `${n >= 2 && n <= 4 ? 1.5 : 1}px solid var(--color-edge${n >= 2 && n <= 4 ? "-strong" : ""})`,
                /* Sert offset, bulanıklık YOK — anlatılan şeyin kendisi. */
                boxShadow: bas || !n ? "none" : `${n}px ${n}px 0 var(--color-edge)`,
                transform: bas && n ? `translate(${n}px, ${n}px)` : undefined,
              }}
            >
              <span className="font-display text-subhead font-black">{n}</span>
              <span className="font-mono text-micro text-ink-faint">px</span>
            </button>
          );
        })}
      </div>
      {/* SEÇİLİ BASAMAĞIN KARŞILIĞI: merdiven tek başına "sekiz kare" · hangi
          bileşenin nerede durduğunu söyleyen satır onu bir ÖLÇEK yapıyor. */}
      <span className="tamga-surface flex flex-wrap items-center gap-3 px-4 py-3">
        <code className="tamga-tag tamga-tag-outline font-mono">{secili}px</code>
        <span className="text-small text-ink-soft">{steps[secili]}</span>
      </span>
    </div>
  );
}
