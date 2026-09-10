"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHead,
  Checkbox,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Field,
  Icon,
  IconButton,
  Input,
  Kpi,
  Label,
  LineChart,
  ListRow,
  PasswordInput,
  SelectionBar,
  Table,
} from "tamga-ui";
import { CountRow, FilterBar, SaveBar, type FilterValues } from "tamga-ui/blocks";
import { Delete, GithubLogo, GoogleLogo, Plus } from "tamga-ui/icons";
import { Galeri, type GaleriOgesi } from "@/components/gallery";
import type { Locale as Dil } from "@/i18n/config";

/**
 * Blok kataloğu: paketten gelenler ve tarifler.
 *
 * TARİFLER BİR SOYUTLAMA DEĞİL BELGELEME. Kitin bileşenlerinden kurulmuş hazır
 * bölümler; kopyalıyorsun ve senin oluyor. O yüzden "üç kere kuralı" onlara
 * işlemiyor: kimseyi bir API'ye bağlamıyorlar, ve maliyetleri sıfır.
 *
 * ÖRNEK SÖZLÜK NÖTR. Kite bir ürünün sözlüğü giremez ve katalog da aynı
 * disipline uyuyor: "kayıt", "kullanıcı", "değer". Bir sipariş kartı ya da bir
 * hasta özeti buraya girmez; onlar bir katman yukarının işi.
 *
 * ÖNİZLEMENİN İÇİ DE ÇEVRİLİYOR. Bir süre bütün örnekler Türkçe sabitti ve
 * İngilizce sayfa Türkçe bir katalog gösteriyordu. Bir sütun başlığı ya da bir
 * boş durum cümlesi de okunan metindir: dili almayan önizleme yarım kalıyor.
 */

const S = {
  tr: {
    filtre: {
      search: "Ara",
      all: "Tümü",
      allFilters: "Tüm filtreler",
      clearAll: "Hepsini temizle",
      clear: "Temizle",
      apply: "Uygula",
      noMatch: "Eşleşen yok",
      open: (l: string) => `${l} seç`,
      remove: (l: string) => `${l} filtresini kaldır`,
      rangeStart: "Başlangıç",
      rangeEnd: "Bitiş",
      calendar: { previousMonth: "Önceki ay", nextMonth: "Sonraki ay", open: "Takvimi aç", clear: "Temizle" },
      fileSearch: {
        label: "Dosya araması",
        title: "Dosyayla ara",
        choose: "Dosya seç",
        remove: "Kaldır",
        help: "İlk satırı alan adı, altı değerler olan bir dosya yükle.",
      },
    },
    locale: "tr-TR",
    durum: "Durum",
    durumlar: ["Açık", "Beklemede", "Kapalı"],
    oncelik: "Öncelik",
    oncelikler: ["Düşük", "Orta", "Yüksek"],
    sahip: "Sahip",
    kisiler: ["Ada", "Baran", "Ceyda"],
    kayitBaslik: "Kayıt",
    kayitKodu: "Kayıt kodu",
    etiketler: "Etiketler",
    etiketSecenek: ["acil", "yeni", "iade"],
    olusturma: "Oluşturma tarihi",
    kaynak: "Kaynak",
    kanal: "Kanal",
    kanallar: ["Web", "Mobil", "Çağrı"],
    notIcerigi: "Not içeriği",

    kayit: "kayıt",
    esigiGecen: "tanesi eşiği geçti",
    sayfada: "Sayfada",
    deger: "Değer",
    satirlar: ["Birinci kayıt", "İkinci kayıt"],

    secili: "kayıt seçili",
    secimiKaldir: "Seçimi kaldır",
    etiketEkle: "Etiket ekle",
    secilenleriSil: "Seçilenleri sil",
    kaydiSec: (n: number) => `${n}. kaydı seç`,
    ninciKayit: (n: number) => `${n}. kayıt`,

    duzenle: "Düzenle",
    sil: "Sil",
    silAria: (ad: string) => `${ad} sil`,
    kaydiSil: "Kaydı sil",
    vazgec: "Vazgeç",
    kapat: "Kapat",
    silmeUyarisi: "ve ona bağlı her şey kalıcı olarak silinecek. Bu işlem geri alınamaz.",

    bosBaslik: "Henüz kayıt yok",
    ilkKayit: "İlk kaydı oluştur",
    bosGovde: "Buraya eklediğin her kayıt listede görünecek.",

    formAlanlari: "Formun alanları buraya geliyor.",
    geriAl: "Değişikliği geri al",
    alanDegistir: "Bir alanı değiştir",
    kaydet: "Değişiklikleri kaydet",
    kaydedilmemis: "Kaydedilmemiş değişiklik var",
    hepsiKayitli: "Her şey kayıtlı",

    kimlik: "Kimlik",
    kimlikNot: "Bu bilgiler faturalarda ve bildirimlerde görünür.",
    ad: "Ad",
    soyad: "Soyad",
    eposta: "E-posta",
    epostaNot: "Giriş için de bu adres kullanılır.",
    telefon: "Telefon",

    hesabiKapat: "Hesabı kapat",
    hesapNot: "Kayıtların, dosyaların ve geçmişin kalıcı olarak silinir. Bu işlem geri alınamaz.",
    hesapOnay: "Bütün kayıtların, dosyaların ve geçmişin kalıcı olarak silinecek.",

    ucAlan: "Üç alan eksik",
    adBos: "boş bırakılamaz.",
    epostaGecersiz: "geçerli bir adres değil.",
    telHane: "on bir hane olmalı.",
    bosBirakilamaz: "Boş bırakılamaz.",

    kpi: [
      ["Bugün", "1.284", "kayıt"],
      ["Bekleyen", "37", "işlem"],
      ["Ortalama", "4,2", "saat"],
      ["Eşiği geçen", "12", "kayıt"],
    ],

    disaAktar: "Dışa aktar",
    onDortGun: "Son on dört gün",
    gunlukSayi: "Günlük kayıt sayısı.",
    gun: (n: number) => `${n}. gün`,

    sonHareketler: "Son hareketler",
    hareketler: [
      ["Ada", "kaydı güncelledi", "2 dk"],
      ["Baran", "yeni kayıt açtı", "18 dk"],
      ["Ceyda", "bir dosya ekledi", "1 sa"],
    ],

    googleIle: "Google ile devam et",
    githubIle: "GitHub ile devam et",
    yaDa: "ya da",
    parola: "Parola",
    goster: "Göster",
    gizle: "Gizle",
    girisYap: "Giriş yap",

    hataBaslik: "Yüklenemedi",
    hataGovde: "Bu bölüm getirilemedi. Yeniden dene, sürerse kodu destekle paylaş.",
    yenidenDene: "Yeniden dene",
  },
  en: {
    filtre: {
      search: "Search",
      all: "All",
      allFilters: "All filters",
      clearAll: "Clear all",
      clear: "Clear",
      apply: "Apply",
      noMatch: "No match",
      open: (l: string) => `Choose ${l}`,
      remove: (l: string) => `Remove the ${l} filter`,
      rangeStart: "Start",
      rangeEnd: "End",
      calendar: { previousMonth: "Previous month", nextMonth: "Next month", open: "Open calendar", clear: "Clear" },
      fileSearch: {
        label: "File search",
        title: "Search with a file",
        choose: "Choose a file",
        remove: "Remove",
        help: "Upload a file whose first row is the field name and the rest are values.",
      },
    },
    locale: "en-US",
    durum: "State",
    durumlar: ["Open", "Waiting", "Closed"],
    oncelik: "Priority",
    oncelikler: ["Low", "Medium", "High"],
    sahip: "Owner",
    kisiler: ["Ada", "Baran", "Ceyda"],
    kayitBaslik: "Record",
    kayitKodu: "Record code",
    etiketler: "Tags",
    etiketSecenek: ["urgent", "new", "return"],
    olusturma: "Created",
    kaynak: "Source",
    kanal: "Channel",
    kanallar: ["Web", "Mobile", "Phone"],
    notIcerigi: "Note contains",

    kayit: "records",
    esigiGecen: "of them are past the threshold",
    sayfada: "Per page",
    deger: "Value",
    satirlar: ["First record", "Second record"],

    secili: "records selected",
    secimiKaldir: "Clear selection",
    etiketEkle: "Add tag",
    secilenleriSil: "Delete selected",
    kaydiSec: (n: number) => `Select record ${n}`,
    ninciKayit: (n: number) => `Record ${n}`,

    duzenle: "Edit",
    sil: "Delete",
    silAria: (ad: string) => `Delete ${ad}`,
    kaydiSil: "Delete record",
    vazgec: "Cancel",
    kapat: "Close",
    silmeUyarisi: "and everything attached to it will be permanently deleted. This cannot be undone.",

    bosBaslik: "No records yet",
    ilkKayit: "Create the first record",
    bosGovde: "Every record you add shows up in this list.",

    formAlanlari: "The form's fields go here.",
    geriAl: "Undo the change",
    alanDegistir: "Change a field",
    kaydet: "Save changes",
    kaydedilmemis: "Unsaved changes",
    hepsiKayitli: "Everything is saved",

    kimlik: "Identity",
    kimlikNot: "This shows on invoices and notifications.",
    ad: "First name",
    soyad: "Last name",
    eposta: "Email",
    epostaNot: "This address is also used to sign in.",
    telefon: "Phone",

    hesabiKapat: "Close account",
    hesapNot: "Your records, files and history are permanently deleted. This cannot be undone.",
    hesapOnay: "All of your records, files and history will be permanently deleted.",

    ucAlan: "Three fields are missing",
    adBos: "cannot be left blank.",
    epostaGecersiz: "is not a valid address.",
    telHane: "must be eleven digits.",
    bosBirakilamaz: "Cannot be left blank.",

    kpi: [
      ["Today", "1,284", "records"],
      ["Waiting", "37", "jobs"],
      ["Average", "4.2", "hours"],
      ["Past threshold", "12", "records"],
    ],

    disaAktar: "Export",
    onDortGun: "Last fourteen days",
    gunlukSayi: "Records per day.",
    gun: (n: number) => `Day ${n}`,

    sonHareketler: "Recent activity",
    hareketler: [
      ["Ada", "updated a record", "2 min"],
      ["Baran", "opened a new record", "18 min"],
      ["Ceyda", "attached a file", "1 hr"],
    ],

    googleIle: "Continue with Google",
    githubIle: "Continue with GitHub",
    yaDa: "or",
    parola: "Password",
    goster: "Show",
    gizle: "Hide",
    girisYap: "Sign in",

    hataBaslik: "Could not load",
    hataGovde: "This section could not be fetched. Try again, and share the code with support if it persists.",
    yenidenDene: "Try again",
  },
} as const;

/* ---------------------------------------------------------------- liste -- */

function FiltreOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  const [values, setValues] = useState<FilterValues>({ durum: s.durumlar[0] });
  return (
    <FilterBar
      values={values}
      onChange={setValues}
      searchKey="ara"
      locale={s.locale}
      top={[
        { key: "durum", label: s.durum, kind: "select", options: [...s.durumlar] },
        { key: "oncelik", label: s.oncelik, kind: "select", options: [...s.oncelikler] },
        { key: "sahip", label: s.sahip, kind: "searchable", options: [...s.kisiler] },
      ]}
      drawer={[
        {
          title: s.kayitBaslik,
          fields: [
            { key: "kod", label: s.kayitKodu, kind: "text" },
            { key: "etiket", label: s.etiketler, kind: "multi", options: [...s.etiketSecenek] },
            { key: "olusturma", label: s.olusturma, kind: "dateRange" },
          ],
        },
        {
          title: s.kaynak,
          fields: [
            { key: "kanal", label: s.kanal, kind: "select", options: [...s.kanallar] },
            { key: "not", label: s.notIcerigi, kind: "text" },
          ],
        },
      ]}
      fileSearchKey="dosya"
      labels={s.filtre}
    />
  );
}

function SayacOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  const [pageSize, setPageSize] = useState(25);
  return (
    <Card>
      <CountRow
        count={1284}
        unit={s.kayit}
        aside={
          <p className="text-small text-ink-soft">
            <strong className="tabular-nums text-[var(--color-critical)]">12</strong> {s.esigiGecen}
          </p>
        }
        pageSize={pageSize}
        pageSizeOptions={[25, 50, 100]}
        onPageSize={setPageSize}
        labels={{ format: (n) => n.toLocaleString(lang), perPage: s.sayfada, records: s.kayit }}
      />
      <Table>
        <thead>
          <tr>
            <th>{s.kayitBaslik}</th>
            <th className="w-24 text-right">{s.deger}</th>
          </tr>
        </thead>
        <tbody>
          {s.satirlar.map((ad, i) => (
            <tr key={ad}>
              <td className="text-ink">{ad}</td>
              <td className="text-right tabular-nums">{[12, 7][i]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

function SecimOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  const [secili, setSecili] = useState<Set<number>>(new Set([1, 2, 3]));
  const satirlar = [1, 2, 3, 4];
  return (
    <Card>
      <SelectionBar
        count={secili.size}
        onClear={() => setSecili(new Set())}
        labels={{
          selected: (n) => (
            <>
              <strong className="tabular-nums">{n}</strong> {s.secili}
            </>
          ),
          clear: s.secimiKaldir,
        }}
      >
        <Button size="sm">{s.etiketEkle}</Button>
        <Button size="sm" variant="danger">
          {s.secilenleriSil}
        </Button>
      </SelectionBar>
      <Table>
        <tbody>
          {satirlar.map((n) => (
            <tr key={n}>
              <td className="w-8">
                <Checkbox
                  label={<span className="sr-only">{s.kaydiSec(n)}</span>}
                  checked={secili.has(n)}
                  onChange={(a) => {
                    const next = new Set(secili);
                    if (a) next.add(n);
                    else next.delete(n);
                    setSecili(next);
                  }}
                />
              </td>
              <td className="text-ink">{s.ninciKayit(n)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

function SatirEylemiOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  const [silinecek, setSilinecek] = useState<string | null>(null);
  return (
    <>
      <Card>
        <Table>
          <tbody>
            {s.satirlar.map((ad) => (
              <tr key={ad}>
                <td className="w-full max-w-0">
                  <a href="#" className="tamga-link block truncate">
                    {ad}
                  </a>
                </td>
                <td className="text-right">
                  <span className="flex items-center justify-end gap-2">
                    <Button size="sm">{s.duzenle}</Button>
                    <IconButton size="sm" aria-label={s.silAria(ad)} onClick={() => setSilinecek(ad)}>
                      <Icon icon={Delete} size="xs" />
                    </IconButton>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      <ConfirmDialog
        open={silinecek !== null}
        onClose={() => setSilinecek(null)}
        onConfirm={() => setSilinecek(null)}
        title={s.kaydiSil}
        confirmLabel={s.sil}
        cancelLabel={s.vazgec}
        closeLabel={s.kapat}
        tone="danger"
      >
        <strong>{silinecek}</strong> {s.silmeUyarisi}
      </ConfirmDialog>
    </>
  );
}

/* Vitrin için basit bir yer tutucu çizim: kit "ne çizildiğini" sormaz. */
const kutu = ({ size }: { size: number; float: boolean }) => (
  <span
    aria-hidden
    className="tamga-card flex items-center justify-center font-mono text-caption text-ink-faint"
    style={{ width: size * 0.7, height: size * 0.7 }}
  >
    art
  </span>
);

function BosListeOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <Card>
      <EmptyState
        art={kutu}
        title={s.bosBaslik}
        action={
          <Button variant="primary">
            <Icon icon={Plus} size="xs" />
            {s.ilkKayit}
          </Button>
        }
      >
        {s.bosGovde}
      </EmptyState>
    </Card>
  );
}

/* ----------------------------------------------------------------- form -- */

function KaydetOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  const [degisti, setDegisti] = useState(true);
  return (
    <div
      className="tamga-card flex min-h-56 flex-col gap-4 p-6"
      style={{ ["--surface-pad" as string]: "1.5rem" }}
    >
      <p className="text-ink-soft">{s.formAlanlari}</p>
      <Button size="sm" onClick={() => setDegisti((d) => !d)}>
        {degisti ? s.geriAl : s.alanDegistir}
      </Button>
      <SaveBar
        changed={degisti}
        labels={{ save: s.kaydet, cancel: s.vazgec }}
        extra={<Label>{degisti ? s.kaydedilmemis : s.hepsiKayitli}</Label>}
      />
    </div>
  );
}

function FormBolumuOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <Card>
      <CardHead>
        <div>
          <h3 className="text-subhead font-semibold text-ink">{s.kimlik}</h3>
          <Label>{s.kimlikNot}</Label>
        </div>
      </CardHead>
      <CardBody>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={s.ad} htmlFor="ad">
            <Input id="ad" full defaultValue="Ada" />
          </Field>
          <Field label={s.soyad} htmlFor="soyad">
            <Input id="soyad" full defaultValue="Yılmaz" />
          </Field>
          <Field label={s.eposta} htmlFor="eposta" description={s.epostaNot}>
            <Input id="eposta" full type="email" defaultValue="ada@ornek.com" />
          </Field>
          <Field label={s.telefon} htmlFor="tel">
            <Input id="tel" full defaultValue="0500 000 00 00" />
          </Field>
        </div>
      </CardBody>
    </Card>
  );
}

function TehlikeliBolgeOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  const [acik, setAcik] = useState(false);
  return (
    <>
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-body font-medium text-ink">{s.hesabiKapat}</h3>
              <Label>{s.hesapNot}</Label>
            </div>
            <Button variant="danger" onClick={() => setAcik(true)}>
              {s.hesabiKapat}
            </Button>
          </div>
        </CardBody>
      </Card>
      <ConfirmDialog
        open={acik}
        onClose={() => setAcik(false)}
        onConfirm={() => setAcik(false)}
        title={s.hesabiKapat}
        confirmLabel={s.hesabiKapat}
        cancelLabel={s.vazgec}
        closeLabel={s.kapat}
        tone="danger"
      >
        {s.hesapOnay}
      </ConfirmDialog>
    </>
  );
}

function DogrulamaOzetiOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <div className="flex flex-col gap-4">
      <Alert state="danger" title={s.ucAlan}>
        <ul className="mt-1 flex list-disc flex-col gap-1 pl-5">
          <li>
            <a href="#ad" className="tamga-link">
              {s.ad}
            </a>{" "}
            {s.adBos}
          </li>
          <li>
            <a href="#eposta" className="tamga-link">
              {s.eposta}
            </a>{" "}
            {s.epostaGecersiz}
          </li>
          <li>
            <a href="#tel" className="tamga-link">
              {s.telefon}
            </a>{" "}
            {s.telHane}
          </li>
        </ul>
      </Alert>
      <Field label={s.ad} htmlFor="ad2" error={s.bosBirakilamaz}>
        <Input id="ad2" full invalid />
      </Field>
    </div>
  );
}

/* ----------------------------------------------------------------- pano -- */

function KpiSeridiOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {s.kpi.map(([ad, deger, birim]) => (
        <Kpi key={ad} label={ad} value={deger} unit={birim} />
      ))}
    </div>
  );
}

function GrafikKartiOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <Card>
      <CardHead action={<Button size="sm">{s.disaAktar}</Button>}>
        <div>
          <h3 className="text-subhead font-semibold text-ink">{s.onDortGun}</h3>
          <Label>{s.gunlukSayi}</Label>
        </div>
      </CardHead>
      <CardBody>
        <LineChart
          labels={Array.from({ length: 14 }, (_, i) => s.gun(i + 1))}
          series={[
            { name: s.kayitBaslik, values: [9, 8, 8, 9, 12, 12, 13, 15, 14, 11, 12, 13, 15, 14] },
          ]}
          height={160}
        />
      </CardBody>
    </Card>
  );
}

function AktiviteOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <Card>
      <CardHead>
        <h3 className="text-subhead font-semibold text-ink">{s.sonHareketler}</h3>
      </CardHead>
      {s.hareketler.map(([kisi, ne, neZaman]) => (
        <ListRow key={kisi}>
          <span className="min-w-0 flex-1 truncate text-ink">
            <strong className="font-medium">{kisi}</strong> {ne}
          </span>
          <Label>{neZaman}</Label>
        </ListRow>
      ))}
    </Card>
  );
}

/* --------------------------------------------------------------- oturum -- */

function GirisKartiOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <div className="tamga-card w-full max-w-96 p-6">
      <div className="flex flex-col gap-2">
        <Button>
          <Icon icon={GoogleLogo} size="xs" />
          {s.googleIle}
        </Button>
        <Button>
          <Icon icon={GithubLogo} size="xs" />
          {s.githubIle}
        </Button>
      </div>
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-caption text-ink-faint">{s.yaDa}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <form className="flex flex-col gap-4">
        <Field label={s.eposta} htmlFor="giris-eposta">
          <Input id="giris-eposta" full type="email" />
        </Field>
        <Field label={s.parola} htmlFor="giris-parola">
          <PasswordInput labels={{ show: s.goster, hide: s.gizle }} />
        </Field>
        <Button variant="primary" full type="submit">
          {s.girisYap}
        </Button>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------- durum -- */

function HataEkraniOrnegi({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <Card>
      <ErrorState
        title={s.hataBaslik}
        description={s.hataGovde}
        detail="upstream_timeout · req_8f2a11"
        retryLabel={s.yenidenDene}
        onRetry={() => {}}
      />
    </Card>
  );
}

/* --------------------------------------------------------------- katalog -- */

const G = {
  liste: { tr: "Liste", en: "List" },
  form: { tr: "Form", en: "Form" },
  pano: { tr: "Pano", en: "Dashboard" },
  oturum: { tr: "Oturum", en: "Session" },
  durum: { tr: "Durum", en: "State" },
};

const OGELER: GaleriOgesi[] = [
  {
    key: "filter-bar",
    grup: G.liste,
    tur: "paket",
    ad: { tr: "FilterBar", en: "FilterBar" },
    aciklama: {
      tr: "Bir arama kutusu, en çok dört alan, gerisi çekmecede. Uygulanan her filtre çip olarak duruyor.",
      en: "One search box, at most four fields, the rest in a drawer. Every applied filter stays on as a chip.",
    },
    ornek: (lang) => <FiltreOrnegi lang={lang} />,
    kod: `<FilterBar
  values={values}
  onChange={setValues}
  searchKey="ara"
  top={[{ key: "durum", label: "Durum", kind: "select", options: [...] }]}
  drawer={[{ title: "Kayıt", fields: [...] }]}
  fileSearchKey="dosya"
  labels={{ search: "Ara", all: "Tümü", ... }}
/>`,
  },
  {
    key: "count-row",
    grup: G.liste,
    tur: "paket",
    ad: { tr: "CountRow", en: "CountRow" },
    aciklama: {
      tr: "Tablonun tepesindeki tek satırlık okuma: kaç kayıt, ekrana özel ikinci bir sayı, sayfa boyu.",
      en: "The one-line readout above a table: how many records, a second screen-specific number, the page size.",
    },
    ornek: (lang) => <SayacOrnegi lang={lang} />,
    kod: `<Card>
  <CountRow
    count={1284}
    unit="kayıt"
    aside={<p>12 tanesi eşiği geçti</p>}
    pageSize={pageSize}
    pageSizeOptions={[25, 50, 100]}
    onPageSize={setPageSize}
    labels={{ format: (n) => n.toLocaleString("tr"), perPage: "Sayfada", records: "kayıt" }}
  />
  <Table>…</Table>
</Card>`,
  },
  {
    key: "selection",
    grup: G.liste,
    tur: "tarif",
    ad: { tr: "Seçim şeridi", en: "Selection bar" },
    aciklama: {
      tr: "Seçim varken görünen şerit, tablonun içinde. Eylemler senin; şerit yalnız yerlerini ve cümleyi veriyor.",
      en: "The bar that appears while a selection is live, inside the table. The actions are yours; the bar only gives them a place and a sentence.",
    },
    ornek: (lang) => <SecimOrnegi lang={lang} />,
    kod: `<Card>
  <SelectionBar
    count={secili.size}
    onClear={() => setSecili(new Set())}
    labels={{ selected: (n) => <><strong>{n}</strong> kayıt seçili</>, clear: "Seçimi kaldır" }}
  >
    <Button size="sm">Etiket ekle</Button>
    <Button size="sm" variant="danger">Seçilenleri sil</Button>
  </SelectionBar>
  <Table>…</Table>
</Card>`,
  },
  {
    key: "row-actions",
    grup: G.liste,
    tur: "tarif",
    ad: { tr: "Satır eylemleri", en: "Row actions" },
    aciklama: {
      tr: "Satırın kendisi bağlantı, düzenle bir düğme, silme onay kapısının arkasında. Onay cümlesi neyin gideceğini sayıyor.",
      en: "The row itself is the link, edit is a button, delete sits behind a confirm gate. The confirm sentence names what will go.",
    },
    ornek: (lang) => <SatirEylemiOrnegi lang={lang} />,
    kod: `<td className="text-right">
  <span className="flex items-center justify-end gap-2">
    <Button size="sm">Düzenle</Button>
    <IconButton size="sm" aria-label={\`\${ad} sil\`} onClick={() => setSilinecek(ad)}>
      <Icon icon={Delete} size="xs" />
    </IconButton>
  </span>
</td>

<ConfirmDialog open={silinecek !== null} tone="danger" confirmLabel="Sil" …>
  <strong>{silinecek}</strong> ve ona bağlı her şey kalıcı olarak silinecek.
</ConfirmDialog>`,
  },
  {
    key: "empty-list",
    grup: G.liste,
    tur: "tarif",
    ad: { tr: "Boş liste", en: "Empty list" },
    aciklama: {
      tr: "Hiç kayıt yokken. Filtre boş döndürdüğünde başka bir cümle gerekiyor: bu ikisi aynı şey değil.",
      en: "When there is no record at all. A filter that returns nothing needs a different sentence: the two are not the same thing.",
    },
    ornek: (lang) => <BosListeOrnegi lang={lang} />,
    kod: `<Card>
  <EmptyState
    art="inbox"
    title="Henüz kayıt yok"
    action={<Button variant="primary"><Icon icon={Plus} size="xs" />İlk kaydı oluştur</Button>}
  >
    Buraya eklediğin her kayıt listede görünecek.
  </EmptyState>
</Card>`,
  },
  {
    key: "save-bar",
    grup: G.form,
    tur: "paket",
    ad: { tr: "SaveBar", en: "SaveBar" },
    aciklama: {
      tr: "Kayan yüzeyin dibine yapışık kaydet şeridi. Formun sonunda değil, çünkü yirmi alanlık bir formda sona kadar kaydırmak gerekiyor.",
      en: "The save bar stuck to the bottom of the scrolling surface. Not at the end of the form, because a twenty-field form makes you scroll to reach it.",
    },
    ornek: (lang) => <KaydetOrnegi lang={lang} />,
    kod: `<div className="tamga-card flex flex-col gap-4 p-6" style={{ "--surface-pad": "1.5rem" }}>
  {/* alanlar */}
  <SaveBar
    changed={degisti}
    onCancel={vazgec}
    labels={{ save: "Değişiklikleri kaydet", cancel: "Vazgeç" }}
  />
</div>`,
  },
  {
    key: "form-section",
    grup: G.form,
    tur: "tarif",
    ad: { tr: "Form bölümü", en: "Form section" },
    aciklama: {
      tr: "Başlık, bir cümlelik gerekçe, ve iki sütunlu alanlar. Gerekçe alanın ne işe yaradığını söylüyor, adını tekrar etmiyor.",
      en: "A title, a one-sentence reason, and fields in two columns. The reason says what the field is for; it does not repeat its name.",
    },
    ornek: (lang) => <FormBolumuOrnegi lang={lang} />,
    kod: `<Card>
  <CardHead>
    <div>
      <h3 className="text-subhead font-semibold text-ink">Kimlik</h3>
      <Label>Bu bilgiler faturalarda ve bildirimlerde görünür.</Label>
    </div>
  </CardHead>
  <CardBody>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Ad" htmlFor="ad"><Input id="ad" full /></Field>
      …
    </div>
  </CardBody>
</Card>`,
  },
  {
    key: "danger-zone",
    grup: G.form,
    tur: "tarif",
    ad: { tr: "Tehlikeli bölge", en: "Danger zone" },
    aciklama: {
      tr: "Geri alınamayan işlem, kendi kartında ve sayfanın en altında. Onay diyaloğu ne gideceğini sayıyor.",
      en: "The irreversible action, in its own card at the very bottom of the page. The confirm dialog names what will go.",
    },
    ornek: (lang) => <TehlikeliBolgeOrnegi lang={lang} />,
    kod: `<Card>
  <CardBody>
    <div className="flex flex-wrap items-center gap-4">
      <div className="min-w-0 flex-1">
        <h3 className="text-body font-medium text-ink">Hesabı kapat</h3>
        <Label>Kayıtların, dosyaların ve geçmişin kalıcı olarak silinir.</Label>
      </div>
      <Button variant="danger" onClick={() => setAcik(true)}>Hesabı kapat</Button>
    </div>
  </CardBody>
</Card>`,
  },
  {
    key: "validation",
    grup: G.form,
    tur: "tarif",
    ad: { tr: "Doğrulama özeti", en: "Validation summary" },
    aciklama: {
      tr: "Formun başında, her hata alanına giden bir bağlantıyla. Uzun bir formda hatayı aramak kullanıcının işi olmamalı.",
      en: "At the top of the form, with a link to each failing field. Hunting for the error in a long form should not be the user's job.",
    },
    ornek: (lang) => <DogrulamaOzetiOrnegi lang={lang} />,
    kod: `<Alert state="danger" title="Üç alan eksik">
  <ul className="mt-1 flex list-disc flex-col gap-1 pl-5">
    <li><a href="#ad" className="tamga-link">Ad</a> boş bırakılamaz.</li>
    …
  </ul>
</Alert>

<Field label="Ad" htmlFor="ad" error="Boş bırakılamaz.">
  <Input id="ad" full invalid />
</Field>`,
  },
  {
    key: "kpi-row",
    grup: G.pano,
    tur: "tarif",
    ad: { tr: "KPI şeridi", en: "KPI row" },
    aciklama: {
      tr: "Dört sayı, tek satır. Dörtten fazlası ezberlenmiyor; beşinci sayı ilk dördünü de zayıflatıyor.",
      en: "Four numbers, one row. More than four does not stick; a fifth number weakens the first four too.",
    },
    ornek: (lang) => <KpiSeridiOrnegi lang={lang} />,
    kod: `<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <Kpi label="Bugün" value="1.284" unit="kayıt" />
  <Kpi label="Bekleyen" value="37" unit="işlem" />
  <Kpi label="Ortalama" value="4,2" unit="saat" />
  <Kpi label="Eşiği geçen" value="12" unit="kayıt" />
</div>`,
  },
  {
    key: "chart-card",
    grup: G.pano,
    tur: "tarif",
    ad: { tr: "Grafik kartı", en: "Chart card" },
    aciklama: {
      tr: "Başlık, neyin çizildiğini söyleyen bir satır, grafik, ve sağda tek bir eylem. Eksen etiketi olmayan grafik, resimdir.",
      en: "A title, a line saying what is plotted, the chart, and a single action on the right. A chart with no axis labels is a picture.",
    },
    ornek: (lang) => <GrafikKartiOrnegi lang={lang} />,
    kod: `<Card>
  <CardHead action={<Button size="sm">Dışa aktar</Button>}>
    <div>
      <h3 className="text-subhead font-semibold text-ink">Son on dört gün</h3>
      <Label>Günlük kayıt sayısı.</Label>
    </div>
  </CardHead>
  <CardBody>
    <LineChart labels={gunler} series={[{ name: "Kayıt", values }]} height={160} />
  </CardBody>
</Card>`,
  },
  {
    key: "activity",
    grup: G.pano,
    tur: "tarif",
    ad: { tr: "Son hareketler", en: "Recent activity" },
    aciklama: {
      tr: "Kim, ne yaptı, ne zaman. Üç sütun değil tek satır: bir akış taranır, okunmaz.",
      en: "Who did what, and when. One line rather than three columns: a feed is scanned, not read.",
    },
    ornek: (lang) => <AktiviteOrnegi lang={lang} />,
    kod: `<Card>
  <CardHead><h3 className="text-subhead font-semibold text-ink">Son hareketler</h3></CardHead>
  {hareketler.map((h) => (
    <ListRow key={h.id}>
      <span className="min-w-0 flex-1 truncate text-ink">
        <strong className="font-medium">{h.kisi}</strong> {h.ne}
      </span>
      <Label>{h.neZaman}</Label>
    </ListRow>
  ))}
</Card>`,
  },
  {
    key: "sign-in",
    grup: G.oturum,
    tur: "tarif",
    ad: { tr: "Giriş kartı", en: "Sign-in card" },
    aciklama: {
      tr: "Sağlayıcılar formun ÜSTÜNDE: biri hangi yolla kaydolduysa geri de o yolla gelir, ve bunu parola alanının altına gömmek olmayan bir parolayı yazdırmak olur.",
      en: "The providers sit ABOVE the form: people come back the way they signed up, and burying that under the password field makes them type a password they never had.",
    },
    ornek: (lang) => <GirisKartiOrnegi lang={lang} />,
    kod: `<div className="tamga-card w-full max-w-96 p-6">
  <div className="flex flex-col gap-2">
    <Button><Icon icon={GoogleLogo} size="xs" />Google ile devam et</Button>
    <Button><Icon icon={GithubLogo} size="xs" />GitHub ile devam et</Button>
  </div>
  <div className="my-5 flex items-center gap-3">
    <span className="h-px flex-1 bg-line" />
    <span className="text-caption text-ink-faint">ya da</span>
    <span className="h-px flex-1 bg-line" />
  </div>
  <form className="flex flex-col gap-4">…</form>
</div>`,
  },
  {
    key: "error",
    grup: G.durum,
    tur: "tarif",
    ad: { tr: "Hata ekranı", en: "Error screen" },
    aciklama: {
      tr: "Teknik satır `code · request_id`: destek bu ikisiyle sunucu günlüğüne ulaşıyor. İnsan cümlesi her ekranda aynı, kod her seferinde başka.",
      en: "The technical line is `code · request_id`: support reaches the server log with those two. The human sentence is the same on every screen; the code differs every time.",
    },
    ornek: (lang) => <HataEkraniOrnegi lang={lang} />,
    kod: `<ErrorState
  title="Yüklenemedi"
  description="Bu bölüm getirilemedi. Yeniden dene, sürerse kodu destekle paylaş."
  detail={\`\${code} · \${requestId}\`}
  retryLabel="Yeniden dene"
  onRetry={yenidenDene}
/>`,
  },
];

const ETIKET = {
  tr: {
    hepsi: "Tümü",
    kapat: "Kapat",
    sayac: (n: number) => `${n} blok`,
    paket: "paket",
    tarif: "tarif",
    kopyala: "Kodu kopyala",
    kopyalandi: "Kopyalandı",
  },
  en: {
    hepsi: "All",
    kapat: "Close",
    sayac: (n: number) => `${n} blocks`,
    paket: "package",
    tarif: "recipe",
    kopyala: "Copy code",
    kopyalandi: "Copied",
  },
};

export function BlokGalerisi({ lang }: { lang: Dil }) {
  return <Galeri ogeler={OGELER} lang={lang} labels={ETIKET[lang]} />;
}
