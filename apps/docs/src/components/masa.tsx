"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Calendar,
  Checkbox,
  ConfirmDialog,
  DropdownMenu,
  Icon,
  IconButton,
  Kbd,
  LineChart,
  NumberInput,
  RadioGroup,
  ScoreRing,
  Segmented,
  Slider,
  SortHeader,
  StatusChip,
  Steps,
  Switch,
  ScrollX,
  Table,
  Tabs,
  Tag,
  Toast,
  Tooltip,
  FileUpload,
  type UploadItem,
} from "tamga-ui";
import { FilterBar, type FilterValues } from "tamga-ui/blocks";
import {
  ArrowRight,
  Bell,
  ChartLine,
  Compass,
  Copy,
  CursorClick,
  Delete,
  Edit,
  Eyedropper,
  Layers,
  SquaresFour,
  Stack,
  Table as TableGlif,
  Textbox,
} from "tamga-ui/icons";
import { makePalette, paletteVars } from "tamga-ui/palette";
import { useMarkaRengi } from "@/components/marka-rengi";

/**
 * Masa: kitin on beş parçası, ziyaretçinin seçtiği renkte, hepsi çalışır hâlde.
 *
 * NEDEN TAKLİT DEĞİL GERÇEK. Karoların içi elle çizilmiş işaretleme olsaydı bu
 * bölüm bir ekran görüntüsü olurdu; kitte bir gölge değişince masa yalan
 * söylerdi. İçerideki her şey `tamga-ui`den geliyor, ve tıklanan her şey
 * gerçekten çalışıyor.
 *
 * RENK NASIL GEÇİYOR. `makePalette` seçilen hex'ten otuz token üretiyor,
 * `paletteVars` onları CSS değişkenine çeviriyor ve masanın kabına yazılıyor:
 * içerideki bileşenler sayfanın değil MASANIN paletini okuyor. Ürünün markayı
 * uygulama yolu da bu · sayfa burada kendi anlattığı mekanizmayı kullanıyor.
 */

export type MasaMetin = {
  renk: string;
  renkDegistir: string;
  kategoriler: readonly [string, string, string, string, string, string, string, string, string];
  alt: string;
  altVurgu: string;
  hepsiniGor: string;
  /** Karoların içindeki bütün metinler. */
  karo: {
    tabloAdi: string;
    hesap: string;
    durum: string;
    mrr: string;
    secili: string;
    sirala: string;
    satirSec: string;
    oncekiAy: string;
    sonrakiAy: string;
    kaydet: string;
    vazgec: string;
    duzenle: string;
    sil: string;
    bildirimler: string;
    otomatikYedek: string;
    aylik: string;
    yillik: string;
    fatura: string;
    ara: string;
    plan: string;
    tarih: string;
    suzgecYok: string;
    tumFiltreler: string;
    hepsiniTemizle: string;
    temizle: string;
    uygula: string;
    eslesmeYok: string;
    tumu: string;
    ac: string;
    kaldir: string;
    baslangic: string;
    bitis: string;
    gelir: string;
    gelirArtis: string;
    skor: string;
    hesabiSil: string;
    hesabiSilGovde: string;
    diyalogAc: string;
    kapat: string;
    bildirimYok: string;
    bildirimBaslik: string;
    bildirimAlt: string;
    adimlar: readonly [string, string, string, string];
    devam: string;
    geri: string;
    birak: string;
    secDosya: string;
    ipucu: string;
    dosyaKaldir: string;
    sola: string;
    saga: string;
    kapakEtiketi: string;
    sekmeler: readonly [string, string, string];
    segment: readonly [string, string, string];
    esik: string;
    artir: string;
    azalt: string;
    yayinda: string;
    beklemede: string;
    hata: string;
    okunmamis: string;
    proPlan: string;
    eylemler: string;
    kopyala: string;
    arsivle: string;
    kopyalandi: string;
    menuIpucu: string;
    durumlar: readonly [string, string, string];
    planlar: readonly [string, string, string];
  };
};

type Hesap = { ad: string; plan: string; durum: 0 | 1 | 2; mrr: string };

/* ÖRNEK VERİ NÖTR: bir panelin herkeste aynı olan sözlüğü (hesap, plan,
   durum). Bir ürünün alan sözlüğü buraya giremez · `check:names`in koruduğu
   sınır kitin içinde olduğu kadar bu sayfada da geçerli. */
const HESAPLAR: readonly Hesap[] = [
  { ad: "Ayşe Demir", plan: "Kurumsal", durum: 0, mrr: "₺4.200" },
  { ad: "Mert Aksoy", plan: "Pro", durum: 1, mrr: "₺1.850" },
  { ad: "Zeynep Kaya", plan: "Pro", durum: 2, mrr: "₺1.850" },
  { ad: "Can Öztürk", plan: "Ücretsiz", durum: 0, mrr: "₺0" },
  { ad: "Elif Şahin", plan: "Kurumsal", durum: 0, mrr: "₺3.400" },
];

const TONLAR = ["positive", "caution", "danger"] as const;

/** Karoların yerleşimi: [anahtar, kategori indeksi, genişlik, yükseklik]. */
/* YERLEŞİM BİR YAPBOZ: altı sütun, yedi satır, hiç boşluk yok.
     1 · table(3) takvim(2) dugme(1)
     2 · [table] [takvim] anahtar(1)
     3 · filtre(3) cizgi(2) halka(1)
     4 · diyalog(2) bildirim(2) yukleme(2)
     5 · adim(3) sekme(3)
     6 · surgu(2) cip(2) menu(2)
   Son satırın üçü yan yana: menü açık durduğu için satırın boyunu o
   belirliyor, ötekiler de o boya geriliyor. */
const KAROLAR = [
  ["table", 1, 3, 2],
  ["takvim", 2, 2, 2],
  ["dugme", 3, 1, 1],
  ["anahtar", 2, 1, 1],
  ["filtre", 4, 3, 1],
  ["cizgi", 5, 2, 1],
  ["halka", 5, 1, 1],
  ["diyalog", 6, 2, 1],
  ["bildirim", 7, 2, 1],
  ["yukleme", 2, 2, 1],
  ["adim", 8, 3, 1],
  ["sekme", 8, 3, 1],
  ["surgu", 2, 2, 1],
  ["cip", 7, 2, 1],
  ["menu", 6, 2, 1],
] as const;

/* Kategori glifleri: her biri o ailenin İŞİNİ çiziyor · veri bir tablo, form
   bir alan, eylem bir tıklama, blok bir yığın, grafik bir çizgi, katman üst
   üste iki yüzey, geri bildirim bir zil, gezinme bir pusula. */
const KATEGORI_GLIF = [SquaresFour, TableGlif, Textbox, CursorClick, Stack, ChartLine, Copy, Bell, Compass];

/* Karo başlıkları `KAROLAR` ile AYNI sırada: biri değişirse öteki de. */
const BASLIK = ["Table", "DatePicker", "Button", "Switch", "FilterBar", "LineChart", "ScoreRing", "ConfirmDialog", "Toast", "FileUpload", "Steps", "Tabs · Segmented", "Slider · NumberInput", "StatusChip · Badge · Kbd", "DropdownMenu · Tooltip"] as const;

export function Masa({
  labels: t,
  bilesen,
  docsHref,
}: {
  labels: MasaMetin;
  bilesen: number;
  docsHref: string;
}) {
  /* RENK BÖLÜMLER ARASINDA ORTAK: "01 · Canlı önizleme"nin kontrol masası
     ile aynı değer · birini değiştirmek ötekini de döndürüyor. */
  const [renk, setRenk] = useMarkaRengi();
  const [odak, setOdak] = useState<number | null>(null);

  /* Masanın teması sayfanınkini izliyor: aynı renk açıkta ve koyuda iki ayrı
     palet üretiyor, ve gösterilmesi gereken o an yürürlükte olanı. */
  const [koyu, setKoyu] = useState(false);
  useEffect(() => {
    const oku = () => setKoyu(document.documentElement.classList.contains("dark"));
    oku();
    const g = new MutationObserver(oku);
    g.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => g.disconnect();
  }, []);

  const palet = useMemo(() => makePalette(renk), [renk]);
  const p = palet[koyu ? "dark" : "light"];

  /* --- karoların kendi durumları: masadaki her parça gerçekten çalışıyor --- */
  const [secili, setSecili] = useState<Set<string>>(new Set([HESAPLAR[1]!.ad]));
  const [yon, setYon] = useState<"asc" | "desc">("asc");
  const [gun, setGun] = useState("2026-10-14");
  const [anahtar, setAnahtar] = useState({ bildirim: true, yedek: false });
  const [fatura, setFatura] = useState("aylik");
  const [filtre, setFiltre] = useState<FilterValues>({});
  const [esik, setEsik] = useState(62);
  const [adet, setAdet] = useState<number | null>(3);
  const [diyalog, setDiyalog] = useState(false);
  const [bildirimler, setBildirimler] = useState<{ id: number; baslik: string }[]>([]);
  const [adim, setAdim] = useState(1);
  const [dosyalar, setDosyalar] = useState<UploadItem[]>([]);
  const [sekme, setSekme] = useState("genel");
  const [aralik, setAralik] = useState("hafta");

  const etkin = odak;
  const satirlar = useMemo(() => {
    const k = yon === "asc" ? 1 : -1;
    return [...HESAPLAR].sort((a, b) => a.ad.localeCompare(b.ad, "tr") * k);
  }, [yon]);

  function bildirimEkle() {
    setBildirimler((b) => [{ id: Date.now(), baslik: t.karo.bildirimBaslik }, ...b].slice(0, 3));
  }

  const karoIcerik: Record<string, React.ReactNode> = {
    table: (
      /* TABLO KENDİ KABINDA KAYIYOR: dört sütun dar karoya sığmıyor ve kapsız
         bırakıldığında masadan taşıyordu (ölçüldü: 390 px'te 395 piksellik
         tablo, 342 piksellik masa). */
      <ScrollX label={t.karo.tabloAdi}>
        <Table>
        <thead>
          <tr>
            <th scope="col" className="w-8">
              <span className="sr-only">{t.karo.satirSec}</span>
            </th>
            <SortHeader direction={yon} onSort={() => setYon(yon === "asc" ? "desc" : "asc")}>
              {t.karo.hesap}
            </SortHeader>
            <th scope="col">{t.karo.durum}</th>
            <th scope="col" className="text-right">
              {t.karo.mrr}
            </th>
          </tr>
        </thead>
        <tbody>
          {satirlar.map((h) => (
            <tr key={h.ad}>
              <td>
                <Checkbox
                  compact
                  label={<span className="sr-only">{h.ad}</span>}
                  checked={secili.has(h.ad)}
                  onChange={(a) => {
                    const n = new Set(secili);
                    if (a) n.add(h.ad);
                    else n.delete(h.ad);
                    setSecili(n);
                  }}
                />
              </td>
              <td className="font-semibold">{h.ad}</td>
              <td>
                <StatusChip label={t.karo.durumlar[h.durum]} state={TONLAR[h.durum]} />
              </td>
              <td className="text-right font-mono tabular-nums">{h.mrr}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </ScrollX>
    ),
    takvim: (
      <Calendar
        value={gun}
        onSelect={setGun}
        locale="tr-TR"
        labels={{ previousMonth: t.karo.oncekiAy, nextMonth: t.karo.sonrakiAy }}
      />
    ),
    dugme: (
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" size="sm" onClick={bildirimEkle}>
          {t.karo.kaydet}
        </Button>
        <Button size="sm">{t.karo.vazgec}</Button>
        <IconButton size="sm" aria-label={t.karo.duzenle}>
          <Icon icon={Edit} size="xs" />
        </IconButton>
        <IconButton size="sm" variant="danger" aria-label={t.karo.sil}>
          <Icon icon={Delete} size="xs" />
        </IconButton>
      </div>
    ),
    anahtar: (
      <div className="flex flex-col gap-3">
        {/* ANAHTARIN YANINDA YAZI VAR: kitin `Switch`i içinde metin taşımıyor
            (`label` yalnız erişilebilir ad), görünür satırı çağıran kuruyor. */}
        <label className="masa-anahtar">
          <Switch
            label={t.karo.bildirimler}
            on={anahtar.bildirim}
            onChange={(v) => setAnahtar((a) => ({ ...a, bildirim: v }))}
          />
          <span>{t.karo.bildirimler}</span>
        </label>
        <label className="masa-anahtar">
          <Switch
            label={t.karo.otomatikYedek}
            on={anahtar.yedek}
            onChange={(v) => setAnahtar((a) => ({ ...a, yedek: v }))}
          />
          <span>{t.karo.otomatikYedek}</span>
        </label>
        <RadioGroup
          label={t.karo.fatura}
          look="chip"
          value={fatura}
          onChange={setFatura}
          options={[
            { value: "aylik", label: t.karo.aylik },
            { value: "yillik", label: t.karo.yillik },
          ]}
        />
      </div>
    ),
    filtre: (
      <div className="flex flex-col gap-2">
        <FilterBar
          values={filtre}
          onChange={setFiltre}
          searchKey="ara"
          locale="tr-TR"
          top={[
            { key: "durum", label: t.karo.durum, kind: "select", options: [...t.karo.durumlar] },
            { key: "plan", label: t.karo.plan, kind: "select", options: [...t.karo.planlar] },
            { key: "tarih", label: t.karo.tarih, kind: "dateRange" },
          ]}
          drawer={[]}
          labels={{
            search: t.karo.ara,
            all: t.karo.tumu,
            allFilters: t.karo.tumFiltreler,
            clearAll: t.karo.hepsiniTemizle,
            clear: t.karo.temizle,
            apply: t.karo.uygula,
            noMatch: t.karo.eslesmeYok,
            open: (l: string) => `${l} ${t.karo.ac}`,
            remove: (l: string) => `${l} ${t.karo.kaldir}`,
            rangeStart: t.karo.baslangic,
            rangeEnd: t.karo.bitis,
            calendar: {
              previousMonth: t.karo.oncekiAy,
              nextMonth: t.karo.sonrakiAy,
              open: t.karo.ac,
              clear: t.karo.temizle,
            },
          }}
        />
        {Object.keys(filtre).length === 0 ? (
          <span className="masa-ipucu">{t.karo.suzgecYok}</span>
        ) : null}
      </div>
    ),
    cizgi: (
      <div className="flex flex-col gap-2">
        <span className="flex items-baseline gap-2">
          <strong className="masa-sayi">{t.karo.gelir}</strong>
          <StatusChip label={t.karo.gelirArtis} state="positive" />
        </span>
        <LineChart
          height={72}
          labels={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
          series={[{ name: t.karo.gelir, values: [38, 42, 36, 52, 48, 61, 57, 69, 66, 78, 74, 86] }]}
        />
      </div>
    ),
    halka: (
      <div className="flex items-center justify-center py-1">
        <ScoreRing label={t.karo.skor} value={Math.round(40 + esik * 0.6)} size={96} />
      </div>
    ),
    diyalog: (
      <div className="flex flex-col gap-3">
        <Alert state="danger" title={t.karo.hesabiSil}>
          {t.karo.hesabiSilGovde}
        </Alert>
        <Button size="sm" onClick={() => setDiyalog(true)}>
          {t.karo.diyalogAc}
        </Button>
      </div>
    ),
    bildirim: (
      <div className="flex flex-col gap-2">
        {/* TETİK KARONUN İÇİNDE: ipucu "Kaydet'e bas" diyordu ve o düğme başka
            bir karodaydı · okuyan kişi basacak şeyi aynı kutuda arıyor. */}
        <span className="flex flex-wrap items-center gap-3">
          <Button size="sm" variant="primary" onClick={bildirimEkle}>
            {t.karo.kaydet}
          </Button>
          {bildirimler.length === 0 ? (
            <span className="masa-ipucu">{t.karo.bildirimYok}</span>
          ) : null}
        </span>
        {bildirimler.length === 0 ? null : (
          bildirimler.map((b) => (
            <Toast
              key={b.id}
              tone="positive"
              title={b.baslik}
              description={t.karo.bildirimAlt}
              dismissLabel={t.karo.kapat}
              onDismiss={() => setBildirimler((x) => x.filter((y) => y.id !== b.id))}
            />
          ))
        )}
      </div>
    ),
    adim: (
      <div className="flex flex-col gap-3">
        <Steps
          current={adim}
          steps={t.karo.adimlar.map((l, i) => ({ key: String(i), label: l }))}
        />
        <span className="flex items-center gap-2">
          <IconButton
            size="sm"
            aria-label={t.karo.geri}
            onClick={() => setAdim((a) => Math.max(0, a - 1))}
          >
            <Icon icon={ArrowRight} size="xs" className="rotate-180" />
          </IconButton>
          <Button size="sm" variant="primary" onClick={() => setAdim((a) => Math.min(3, a + 1))}>
            {t.karo.devam}
          </Button>
        </span>
      </div>
    ),
    yukleme: (
      <FileUpload
        items={dosyalar}
        multiple={false}
        onAdd={(f) =>
          setDosyalar(
            f.slice(0, 1).map((dosya) => ({
              id: dosya.name,
              url: URL.createObjectURL(dosya),
              name: dosya.name,
            })),
          )
        }
        onRemove={(id) => setDosyalar((d) => d.filter((x) => x.id !== id))}
        labels={{
          drop: t.karo.birak,
          browse: t.karo.secDosya,
          hint: t.karo.ipucu,
          remove: t.karo.dosyaKaldir,
          moveLeft: t.karo.sola,
          moveRight: t.karo.saga,
          primary: t.karo.kapakEtiketi,
        }}
      />
    ),
    sekme: (
      <div className="flex flex-col gap-3">
        <Tabs
          label={t.karo.sekmeler[0]}
          value={sekme}
          onChange={setSekme}
          items={t.karo.sekmeler.map((l, i) => ({ value: ["genel", "ekip", "fatura"][i]!, label: l }))}
        />
        <Segmented
          size="sm"
          label={t.karo.segment[1]}
          value={aralik}
          onChange={setAralik}
          options={t.karo.segment.map((l, i) => ({ value: ["gun", "hafta", "ay"][i]!, label: l }))}
        />
      </div>
    ),
    surgu: (
      <div className="flex flex-col gap-3">
        <Slider label={t.karo.esik} value={esik} onChange={setEsik} suffix="%" />
        <NumberInput
          value={adet}
          onChange={setAdet}
          min={0}
          look="quantity"
          labels={{ increase: t.karo.artir, decrease: t.karo.azalt }}
        />
      </div>
    ),
    cip: (
      /* ROZETİN KENDİ YERİ VAR: sayaç zilin köşesine biniyor, ve komşusuyla
         arasında normal bir boşluk bırakıldığında rozet o komşunun üstüne
         düşüyordu · sarmalayıcıya ek boşluk veriliyor. */
      <div className="masa-cipler">
        <StatusChip label={t.karo.yayinda} state="positive" />
        <StatusChip label={t.karo.beklemede} state="caution" />
        <StatusChip label={t.karo.hata} state="danger" />
        <span className="masa-rozet">
          {/* SAYAÇ BİR DÜĞMENİN KÖŞESİNDE, çıplak bir glifin değil: 16 piksellik
              bir ikonun köşesine oturan rozet ikonun kendisini örtüyordu. */}
          <Badge count={3} tone="danger" label={t.karo.okunmamis}>
            <IconButton size="sm" aria-label={t.karo.bildirimler}>
              <Icon icon={Bell} size="xs" />
            </IconButton>
          </Badge>
        </span>
        <span className="flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
        <Tag>{t.karo.proPlan}</Tag>
      </div>
    ),
    menu: (
      <div className="flex flex-col gap-3">
        {/* İPUCU MENÜNÜN ÜSTÜNDE: menü aşağı açılıyor ve altında ya da yanında
            duran her yazıyı örtüyor. */}
        <span className="masa-ipucu">{t.karo.menuIpucu}</span>
        {/* MENÜ AÇIK BAŞLIYOR: bu bir ürün ekranı değil bir afiş · karonun işi
            menünün nasıl göründüğünü göstermek, ve kapalı bir menü boş bir
            düğmeden ibaret. `defaultOpen` kitin bu yüzey için verdiği seçenek. */}
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu
            defaultOpen
            openOnHover
            trigger={<Button size="sm">{t.karo.eylemler}</Button>}
            items={[
              { label: t.karo.duzenle, icon: <Icon icon={Edit} size="xs" /> },
              { label: t.karo.kopyala, icon: <Icon icon={Copy} size="xs" /> },
              { label: t.karo.arsivle, icon: <Icon icon={Layers} size="xs" /> },
            ]}
          />
          <Tooltip label={t.karo.kopyalandi}>
            <IconButton size="sm" aria-label={t.karo.kopyala}>
              <Icon icon={Copy} size="xs" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    ),
  };

  const sayilar = KATEGORI_GLIF.map((_, i) =>
    i === 0 ? KAROLAR.length : KAROLAR.filter(([, k]) => k === i).length,
  );

  return (
    <>
      <div className="masa-bas">
        <div className="min-w-0" />
        {/* RENK KUTUSU BİR ETİKET: tarayıcının renk girdisi görünmez, üstüne
            serilmiş bir tetik · kitin `ColorSwatches`ında da aynı çözüm. */}
        <label className="masa-renk">
          <span className="masa-renk-ad">{t.renk}</span>
          <span className="masa-renk-kare" style={{ background: renk }} />
          <code>{renk.toUpperCase()}</code>
          <span className="masa-renk-degistir">
            <Icon icon={Eyedropper} size="xs" weight="bold" />
            {t.renkDegistir}
          </span>
          <input
            type="color"
            value={renk}
            onChange={(e) => setRenk(e.target.value.toLowerCase())}
            aria-label={t.renkDegistir}
            className="tamga-color-input"
          />
        </label>
      </div>

      {/* ŞERİTTEN ÇIKINCA DA SIFIRLANIYOR: odak masanın üstünde de şeridin
          üstünde de doğabiliyor, ve yalnız masaya `mouseleave` koymak imleç
          şeritten doğrudan sayfaya çıktığında aileyi sönük bırakıyordu. */}
      <div
        className="masa-kategoriler"
        role="toolbar"
        aria-label={t.kategoriler[0]}
        onMouseLeave={() => setOdak(null)}
      >
        {t.kategoriler.map((ad, i) => (
          /* SABİTLEME YOK, YALNIZ HOVER · tıklamak bir şeyi açıp bırakmıyor,
             imleç geldiğinde aile öne çıkıyor, çekilince bırakıyor. Klavye de
             aynı yoldan geçiyor: odak hover'ın karşılığı. */
          <button
            key={ad}
            type="button"
            aria-pressed={odak === null ? i === 0 : odak === i}
            className="masa-kategori"
            onMouseEnter={() => setOdak(i === 0 ? null : i)}
            onFocus={() => setOdak(i === 0 ? null : i)}
            onBlur={() => setOdak(null)}
          >
            <Icon icon={KATEGORI_GLIF[i]!} size="sm" weight="duotone" />
            {ad}
            <span className="masa-kategori-sayi">{sayilar[i]}</span>
          </button>
        ))}
      </div>

      {/* MASANIN KENDİSİ: paletin token'ları burada bildiriliyor, yani
          içerideki her bileşen sayfanın değil SEÇİLEN rengin paletini okuyor. */}
      {/* KAP AYRI BİR DÜĞÜM: kırılma noktası masanın kendi genişliği ve bir
          kap sorgusu KENDİ kabını biçimlendiremiyor · sorgu `.masa`ya
          yazıldığında hiç uygulanmıyordu (ölçüldü: 390 px'te hâlâ altı sütun,
          160 piksel yatay kayma). */}
      <div className="masa-kap">
        <div
          className="masa"
          style={{ ...paletteVars(p), background: p.page, boxShadow: `8px 8px 0 ${renk}` }}
        >
        {KAROLAR.map(([anahtar, kategori, w, h], i) => (
          <div
            key={anahtar}
            className="masa-karo"
            data-karo={anahtar}
            data-w={w}
            data-h={h}
            data-sonuk={etkin !== null && etkin !== kategori ? "true" : undefined}
            data-one={etkin === kategori ? "true" : undefined}
            style={etkin === kategori ? { boxShadow: `5px 5px 0 ${renk}` } : undefined}
          >
            <span className="masa-karo-bas">
              <span>{t.kategoriler[kategori]}</span>
              <span className="masa-karo-cizgi" />
              <code>{BASLIK[i]}</code>
            </span>
              <div className="masa-karo-govde">{karoIcerik[anahtar]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="masa-alt">
        <span>
          <strong>{t.alt.replace("{n}", String(bilesen))}</strong> {t.altVurgu}
        </span>
        <a href={docsHref} className="masa-hepsi">
          {t.hepsiniGor}
          <Icon icon={ArrowRight} size="xs" weight="bold" />
        </a>
      </div>

      {/* Diyalog GERÇEK: karo bir resim göstermiyor, bileşenin kendisini
          açıyor · perde, odak tuzağı ve Esc dahil. */}
      <ConfirmDialog
        open={diyalog}
        onClose={() => setDiyalog(false)}
        onConfirm={() => setDiyalog(false)}
        title={t.karo.hesabiSil}
        confirmLabel={t.karo.sil}
        cancelLabel={t.karo.vazgec}
        closeLabel={t.karo.kapat}
      >
        {t.karo.hesabiSilGovde}
      </ConfirmDialog>
    </>
  );
}
