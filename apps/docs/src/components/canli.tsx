"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  AccountButton,
  Button,
  Card,
  CardBody,
  CardHead,
  Checkbox,
  DatePicker,
  ColorSwatches,
  ConfirmDialog,
  DropdownMenu,
  Field,
  ImageField,
  Icon,
  RailLink,
  IconButton,
  Input,
  Kbd,
  Kpi,
  KpiGrid,
  Label,
  PageBand,
  RailCards,
  ScrollX,
  Segmented,
  Sheet,
  Pagination,
  SortHeader,
  StatusChip,
  Switch,
  Table,
  ThemeCards,
  Toast,
  BarChart,
  type RailChoice,
  type SwatchOption,
  type ThemeChoice,
  type Tone,
} from "tamga-ui";
import { AppShell, type NavEntry } from "tamga-ui/patterns";
import { Delete, GridView, ListView, Plus, Search, Settings, SidebarSimple } from "tamga-ui/icons";
import { makePalette, paletteVars } from "tamga-ui/palette";
import { useMarkaRengi, VARSAYILAN_RENK } from "@/components/marka-rengi";

/**
 * Canlı önizleme: solda kontrol masası, sağda gerçekten çalışan bir panel.
 *
 * SAYFANIN KALBİ, ve iddiası tek cümle: "ekran görüntüsü değil, kurcala".
 * Paneli `AppShell` çiziyor, içindeki her şey kitin bileşenleri, ve rengi
 * ziyaretçinin yazdığı hex'ten `makePalette` üretiyor · yani ürünün markayı
 * uygulama yolu neyse burada da o çalışıyor.
 *
 * PANELİN TEMASI SAYFANIN TEMASI DEĞİL: ziyaretçi siteyi açık okurken paneli
 * koyu deneyebiliyor. İkisi ayrı token kümesi, ve panelinki masanın kararı.
 */

export type CanliMetin = {
  daralt: string;
  genislet: string;
  masa: string;
  canli: string;
  ad: string;
  adIpucu: string;
  renk: string;
  ozelRenk: string;
  kutular: readonly SwatchOption[];
  kontrast: string;
  kontrastIyi: string;
  kontrastZayif: string;
  temaMenu: string;
  acik: string;
  koyu: string;
  dar: string;
  genis: string;
  tasi: string;
  sifirla: string;
  ara: string;
  hesapAra: string;
  profil: string;
  gorunumAyarlari: string;
  cikis: string;
  /** Ray ve sayfa adları. */
  genelBakis: string;
  hesaplar: string;
  ayarlar: string;
  yeniHesap: string;
  kaydet: string;
  kpi: readonly (readonly [string, string, string])[];
  haftalik: string;
  gunler: readonly string[];
  sonHareketler: string;
  hareketler: readonly (readonly [string, string])[];
  durum: string;
  durumlar: readonly [string, string, string, string];
  plan: string;
  son: string;
  hesap: string;
  secili: string;
  arsivle: string;
  vazgec: string;
  bosSuzgec: string;
  /* SAYFALAMANIN SÖZCÜKLERİ, ve ikisi YER TUTUCULU DİZGİ: bu sözlük sunucu
     bileşeninden geliyor, oraya fonksiyon konamıyor (Next sınırı). Sayıyı
     yerleştiren taraf aşağıdaki istemci. */
  oncekiSayfa: string;
  sonrakiSayfa: string;
  /** "Sayfa {n}" */
  sayfaNo: string;
  /** "{ilk}–{son} / {toplam}" */
  sayfaOzet: string;
  /** Takvimin ay adlarını ve hafta başlangıcını belirleyen yerel: "tr-TR". */
  yerel: string;
  kayitSonra: string;
  takvim: { previousMonth: string; nextMonth: string; open: string; clear: string };
  kapat: string;
  detay: string;
  gorunum: string;
  panelKapsam: string;
  urunAdi: string;
  urunAdiNot: string;
  markaRengi: string;
  markaRengiNot: string;
  tema: string;
  temaNot: string;
  kenarMenusu: string;
  kenarMenusuNot: string;
  bildirimler: string;
  bildirimSecenek: readonly [string, string, string];
  arsivlendi: string;
  kaydedildi: string;
  sil: string;
  silBaslik: string;
  silGovde: string;
  silindi: string;
  logo: string;
  logoNot: string;
  amblem: string;
  amblemNot: string;
  ornegeDon: string;
  gorsel: {
    name: string;
    upload: string;
    replace: string;
    remove: string;
    empty: string;
    errorType: string;
    errorSize: string;
    errorUnreadable: string;
  };
  hesapMenu: string;
  hesapAdi: string;
  hesapPosta: string;
};

type Hesap = { ad: string; plan: string; durum: 0 | 1 | 2; son: string; kayit: string };

const HESAPLAR: readonly Hesap[] = [
  { ad: "Ayşe Demir", plan: "Kurumsal", durum: 0, son: "2 dk", kayit: "2026-09-28" },
  { ad: "Mert Aksoy", plan: "Pro", durum: 1, son: "dün", kayit: "2026-08-14" },
  { ad: "Zeynep Kaya", plan: "Pro", durum: 2, son: "3 gün", kayit: "2026-07-02" },
  { ad: "Can Öztürk", plan: "Ücretsiz", durum: 0, son: "1 sa", kayit: "2026-09-19" },
  { ad: "Elif Şahin", plan: "Kurumsal", durum: 0, son: "12 dk", kayit: "2026-06-11" },
  { ad: "Deniz Yılmaz", plan: "Pro", durum: 1, son: "2 gün", kayit: "2026-08-30" },
  { ad: "Burak Çelik", plan: "Kurumsal", durum: 0, son: "5 dk", kayit: "2026-09-30" },
  { ad: "Selin Arslan", plan: "Ücretsiz", durum: 2, son: "1 hafta", kayit: "2026-05-21" },
  { ad: "Emre Doğan", plan: "Pro", durum: 0, son: "40 dk", kayit: "2026-09-06" },
  { ad: "Gizem Koç", plan: "Kurumsal", durum: 1, son: "3 sa", kayit: "2026-07-25" },
  { ad: "Onur Taş", plan: "Ücretsiz", durum: 0, son: "9 dk", kayit: "2026-10-01" },
  { ad: "Pelin Aydın", plan: "Pro", durum: 2, son: "4 gün", kayit: "2026-06-03" },
];

const TONLAR: readonly Tone[] = ["positive", "caution", "danger"];
/* Örnek marka varlıkları: sitenin kendi logosu. Koyu sürüm YOK, çünkü panel
   kendi temasını taşıyor ve logo panelin içinde duruyor · açık panelde açık
   logo, koyu panelde koyu logo gerekirdi, o da ürünün kararı. */
/* Varsayılan ürün adı örnek markanın adı: logo onun logosu, ve ad değişince
   logo düşüyor · başka bir ürünün adının yanında duran bir logo yalan söyler. */
const VARSAYILAN_AD = "Mantıksal";
/** Adres üretirken Türkçe harflerin ASCII karşılığı. */
const TR_ASCII: Record<string, string> = {
  ı: "i", İ: "i", ş: "s", Ş: "s", ğ: "g", Ğ: "g",
  ü: "u", Ü: "u", ö: "o", Ö: "o", ç: "c", Ç: "c",
  â: "a", î: "i", û: "u",
};
const ORNEK_LOGO = "/mantiksal-logo.svg";
const ORNEK_LOGO_KOYU = "/mantiksal-logo-dark.svg";
const ORNEK_AMBLEM = "/mantiksal-mark.svg";
const HAFTA = [42, 58, 35, 71, 64, 28, 49];

/** `#1e4fd8` → `1E4FD8`: kod kutusunda okunan hâl. */
const buyuk = (hex: string) => hex.toUpperCase();

export function CanliOnizleme({ labels: t }: { labels: CanliMetin }) {
  const [urun, setUrun] = useState(VARSAYILAN_AD);
  /* RENK BÖLÜMLER ARASINDA ORTAK: "02 · Bileşenler"deki çip ile bu masa
     aynı değeri okuyor · birini değiştirmek ötekini de döndürüyor. */
  const [renk, setRenk] = useMarkaRengi();
  const [tema, setTema] = useState<ThemeChoice>("light");
  const [ray, setRay] = useState<RailChoice>("wide");
  /* "Serbest" rayın anlamı: kullanıcı daraltıp genişletebilir. O düğme olmadan
     serbest ile geniş aynı görünüyordu · seçeneğin bir karşılığı yoktu. */
  const [dar, setDar] = useState(false);
  const rayDar = ray === "narrow" || (ray === "free" && dar);
  /* Varsayılan ekran AYARLAR: panelin asıl numarası (renk, tema, ray) orada
     görünüyor; ziyaretçi genel bakışa bir tıkla dönüyor. */
  const [gorunum, setGorunum] = useState("/ayarlar");
  const [ara, setAra] = useState("");
  const [suzgec, setSuzgec] = useState(0);
  const [secili, setSecili] = useState<Set<string>>(new Set());
  const [acilan, setAcilan] = useState<Hesap | null>(null);
  const [bildirim, setBildirim] = useState<string | null>(null);
  const [anahtarlar, setAnahtarlar] = useState([true, true, false]);
  const [yon, setYon] = useState<"asc" | "desc">("asc");
  const [silinecek, setSilinecek] = useState<Hesap | null>(null);
  /* LOGO VE AMBLEM VARSAYILAN OLARAK TAMGA'NIN: panel boş bir kutu değil, ve
     ziyaretçi "burada ne duracak" sorusunu sormuyor · Ayarlar'dan kendi
     dosyasını yükleyebiliyor, örneğe de dönebiliyor. */
  const [logo, setLogo] = useState<string | null>(ORNEK_LOGO);
  const [amblem, setAmblem] = useState<string | null>(ORNEK_AMBLEM);

  const palet = useMemo(() => makePalette(renk), [renk]);
  const p = palet[tema === "dark" ? "dark" : "light"];
  /* ADRES TÜRKÇE HARFİ DÜŞÜRMÜYOR, ÇEVİRİYOR · "Mantıksal" önce
     "mant-ksal.app" oluyordu: `ı` ASCII olmadığı için tireye dönüyor ve adres
     kırık okunuyordu. Bir alan adı üretirken doğru davranış harfi karşılığına
     çevirmek. */
  const slug = useMemo(
    () =>
      (urun.trim() || "marka")
        .toLocaleLowerCase("tr")
        .replace(/[ıİşŞğĞüÜöÖçÇâîû]/g, (h) => TR_ASCII[h] ?? h)
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "marka",
    [urun],
  );

  /* SAYFA BOYU BEŞ: tablo panelin yarısını kaplamadan duruyor, ve on iki
     hesap üç sayfa ediyor · sayfalama bir süs değil, gerçekten gereken bir
     kontrol olarak görünüyor. */
  const SAYFA_BOYU = 5;
  const [sayfa, setSayfa] = useState(1);
  /* Tarih süzgeci GERÇEKTEN süzüyor: panelde duran bir kontrolün "demo olsun"
     diye hiçbir şey yapmaması, demonun kendi iddiasını çürütür. */
  const [tarih, setTarih] = useState<string>();

  const gorunenler = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("tr");
    const yonK = yon === "asc" ? 1 : -1;
    return HESAPLAR.filter(
      (h) =>
        (!q || h.ad.toLocaleLowerCase("tr").includes(q)) &&
        (suzgec === 0 || h.durum === suzgec - 1) &&
        /* ISO tarihler dizgi olarak da doğru sıralanıyor; `Date` kurmak gereksiz. */
        (!tarih || h.kayit >= tarih),
    ).sort((a, b) => a.ad.localeCompare(b.ad, "tr") * yonK);
  }, [ara, suzgec, yon, tarih]);

  /* SAYFA SÜZGEÇLE BİRLİKTE DARALIYOR: üçüncü sayfadayken süzgeç tek sonuca
     inerse kullanıcı boş bir tabloya bakar. Sayfa numarası durumda tutuluyor
     ama ÇİZİLEN değer her zaman kırpılmış olanı. */
  const sayfalar = Math.max(1, Math.ceil(gorunenler.length / SAYFA_BOYU));
  const aktifSayfa = Math.min(sayfa, sayfalar);
  const sayfadakiler = gorunenler.slice((aktifSayfa - 1) * SAYFA_BOYU, aktifSayfa * SAYFA_BOYU);

  const nav: readonly NavEntry[] = [
    { key: "genel", href: "/genel", label: t.genelBakis, icon: GridView },
    { key: "hesaplar", href: "/hesaplar", label: t.hesaplar, icon: ListView },
    { key: "ayarlar", href: "/ayarlar", label: t.ayarlar, icon: Settings },
  ];

  /* Ray bağlantısı bir SAYFA değiştirmiyor, görünüm değiştiriyor: `AppShell`
     `linkComponent` aldığı için rota bileşeni yerine bunu koyuyoruz. */
  const RayBaglanti = ({ href, children, ...rest }: { href: string; children?: ReactNode }) => (
    <a
      {...rest}
      href={href}
      onClick={(e) => {
        e.preventDefault();
        setGorunum(href);
      }}
    >
      {children}
    </a>
  );

  function sifirla() {
    setUrun(VARSAYILAN_AD);
    setRenk(VARSAYILAN_RENK);
    setTema("light");
    setRay("wide");
    setGorunum("/genel");
    setAra("");
    setSuzgec(0);
    setSecili(new Set());
    setAcilan(null);
    setBildirim(null);
    setAnahtarlar([true, true, false]);
    setLogo(ORNEK_LOGO);
    setAmblem(ORNEK_AMBLEM);
    setSilinecek(null);
  }

  const bant = (baslik: string, eylem?: ReactNode) => (
    <PageBand eyebrow={`${urun.trim() || "Marka"} › ${baslik}`} title={baslik} actions={eylem} />
  );

  const genel = (
    <div className="flex flex-col gap-5">
      {bant(
        t.genelBakis,
        <Button variant="primary" size="sm" onClick={() => setBildirim(t.kaydedildi)}>
          <Icon icon={Plus} size="xs" />
          {t.yeniHesap}
        </Button>,
      )}
      <KpiGrid>
        {t.kpi.map(([ad, deger, not]) => (
          <Kpi key={ad} label={ad} value={deger} note={not} />
        ))}
      </KpiGrid>
      <div className="canli-ikili">
        <Card>
          <CardHead>{t.haftalik}</CardHead>
          <CardBody>
            {/* AD SÜTUNU 3.2rem: varsayılan 10rem ve dar bir kartta çubuk
                yoluna yer bırakmıyor · günler üç harf, o kadar yer yeter. */}
            <BarChart
              labelWidth="3.2rem"
              bars={HAFTA.map((v, i) => ({
                key: t.gunler[i] ?? String(i),
                label: t.gunler[i] ?? "",
                value: v,
              }))}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHead>{t.sonHareketler}</CardHead>
          <CardBody>
            <ul className="canli-hareket">
              {t.hareketler.map(([metin, ne]) => (
                <li key={metin}>
                  <span>{metin}</span>
                  <span className="canli-zaman">{ne}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );

  const hesaplar = (
    <div className="flex flex-col gap-4">
      {bant(t.hesaplar)}
      <div className="flex flex-wrap items-center gap-3">
        <span className="canli-ara">
          <Icon icon={Search} size="xs" aria-hidden />
          <Input
            size="sm"
            type="search"
            leading
            value={ara}
            placeholder={t.hesapAra}
            onChange={(e) => {
              setAra(e.target.value);
              setSayfa(1);
            }}
          />
        </span>
        {/* 13rem: tarih + kitin iki ucundaki düğmeler. Dar kutuda değer kırpılıyor. */}
        <span className="w-52">
          <DatePicker
            locale={t.yerel}
            value={tarih}
            onChange={(v) => {
              setTarih(v);
              setSayfa(1);
            }}
            placeholder={t.kayitSonra}
            labels={t.takvim}
          />
        </span>
        <Segmented
          size="sm"
          label={t.durum}
          value={String(suzgec)}
          onChange={(v) => {
            setSuzgec(Number(v));
            setSayfa(1);
          }}
          options={t.durumlar.map((l, i) => ({ value: String(i), label: l }))}
        />
      </div>

      {secili.size > 0 ? (
        <div className="canli-secim">
          <strong>{`${secili.size} ${t.secili}`}</strong>
          <Button
            size="sm"
            onClick={() => {
              setBildirim(`${secili.size} ${t.arsivlendi}`);
              setSecili(new Set());
            }}
          >
            {t.arsivle}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSecili(new Set())}>
            {t.vazgec}
          </Button>
        </div>
      ) : null}

      <Card>
        {gorunenler.length === 0 ? (
          <CardBody>
            <p className="text-center text-ink-soft">{t.bosSuzgec}</p>
          </CardBody>
        ) : (
          <ScrollX label={t.hesaplar}>
            <Table>
              <thead>
                <tr>
                  <th scope="col" className="w-8">
                    <span className="sr-only">{t.secili}</span>
                  </th>
                  <SortHeader direction={yon} onSort={() => setYon(yon === "asc" ? "desc" : "asc")}>
                    {t.hesap}
                  </SortHeader>
                  <th scope="col">{t.plan}</th>
                  <th scope="col">{t.durum}</th>
                  <th scope="col" className="text-right">
                    {t.son}
                  </th>
                  <th scope="col" className="relative w-12 text-right">
                    <span className="sr-only">{t.sil}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sayfadakiler.map((h) => (
                  <tr key={h.ad} onClick={() => setAcilan(h)} className="cursor-pointer">
                    <td onClick={(e) => e.stopPropagation()}>
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
                    <td className="text-ink-soft">{h.plan}</td>
                    <td>
                      <StatusChip label={t.durumlar[h.durum + 1] ?? ""} state={TONLAR[h.durum] ?? "neutral"} />
                    </td>
                    <td className="text-right font-mono text-caption text-ink-faint">{h.son}</td>
                    <td className="text-right" onClick={(e) => e.stopPropagation()}>
                      {/* SİL BİR ONAY KAPISININ ARKASINDA · geri alınamayan bir
                          iş, ve satırın kendisi bir kapı değil. */}
                      <IconButton
                        size="sm"
                        variant="ghost"
                        aria-label={`${h.ad} ${t.sil}`}
                        onClick={() => setSilinecek(h)}
                      >
                        <Icon icon={Delete} size="xs" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollX>
        )}
      </Card>

      {/* SAYFALAMA YALNIZ GEREKİYORSA: tek sayfalık bir listenin altındaki
          sayfalayıcı, kullanıcıya olmayan bir yolu gösteriyor. */}
      {gorunenler.length > SAYFA_BOYU ? (
        <Pagination
          page={aktifSayfa}
          pageSize={SAYFA_BOYU}
          total={gorunenler.length}
          onChange={setSayfa}
          labels={{
            previous: t.oncekiSayfa,
            next: t.sonrakiSayfa,
            page: (n) => t.sayfaNo.replaceAll("{n}", String(n)),
            summary: (ilk, son, toplam) =>
              t.sayfaOzet
                .replaceAll("{ilk}", String(ilk))
                .replaceAll("{son}", String(son))
                .replaceAll("{toplam}", String(toplam)),
          }}
        />
      ) : null}
    </div>
  );

  const ayarlar = (
    <div className="flex flex-col gap-5">
      {bant(t.ayarlar)}
      <Card>
        <CardHead action={<span className="tamga-chip tamga-chip-mono">{t.panelKapsam}</span>}>
          {t.gorunum}
        </CardHead>
        <CardBody>
          <div className="flex flex-col gap-6">
            <Field label={t.urunAdi} description={t.urunAdiNot} htmlFor="canli-urun">
              <Input id="canli-urun" value={urun} onChange={(e) => setUrun(e.target.value)} />
            </Field>
            <div className="flex flex-col gap-2">
              <Label>{t.logo}</Label>
              <ImageField
                value={logo}
                onChange={setLogo}
                maxEdge={512}
                labels={{ ...t.gorsel, name: t.logo }}
                preview={(src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="max-h-full w-auto max-w-40 object-contain" />
                )}
                extra={
                  logo === ORNEK_LOGO ? undefined : (
                    <Button type="button" size="sm" onClick={() => setLogo(ORNEK_LOGO)}>
                      {t.ornegeDon}
                    </Button>
                  )
                }
              />
              <span className="text-small text-ink-soft">{t.logoNot}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t.amblem}</Label>
              <ImageField
                value={amblem}
                onChange={setAmblem}
                maxEdge={256}
                labels={{ ...t.gorsel, name: t.amblem }}
                preview={(src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="size-10 object-contain" />
                )}
                extra={
                  amblem === ORNEK_AMBLEM ? undefined : (
                    <Button type="button" size="sm" onClick={() => setAmblem(ORNEK_AMBLEM)}>
                      {t.ornegeDon}
                    </Button>
                  )
                }
              />
              <span className="text-small text-ink-soft">{t.amblemNot}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t.markaRengi}</Label>
              <ColorSwatches
                options={t.kutular}
                value={renk}
                onChange={(h) => setRenk(h.toLowerCase())}
                customLabel={t.ozelRenk}
              />
              <span className="text-small text-ink-soft">{t.markaRengiNot}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t.tema}</Label>
              <ThemeCards
                value={tema}
                onChange={setTema}
                labels={{ light: t.acik, dark: t.koyu, system: t.temaNot, group: t.tema }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t.kenarMenusu}</Label>
              <RailCards
                value={ray}
                onChange={setRay}
                labels={{ narrow: t.dar, wide: t.genis, free: t.kenarMenusuNot, group: t.kenarMenusu }}
              />
            </div>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHead>{t.bildirimler}</CardHead>
        <CardBody>
          <div className="flex flex-col gap-3">
            {/* ETİKETİ ÇAĞIRAN YAZIYOR: kitin `Switch`i içinde metin taşımıyor,
                `label` yalnız erişilebilir ad · görünür satırı biz kuruyoruz. */}
            {t.bildirimSecenek.map((ad, i) => (
              <label key={ad} className="canli-anahtar">
                <Switch
                  label={ad}
                  on={anahtarlar[i] ?? false}
                  onChange={(v) => setAnahtarlar((a) => a.map((x, j) => (j === i ? v : x)))}
                />
                <span>{ad}</span>
              </label>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="canli-izgara">
      {/* ---------------------------------------------------- kontrol masası */}
      <aside className="canli-masa">
        <div className="canli-masa-bas">
          <span className="canli-nokta" aria-hidden />
          <strong>{t.masa}</strong>
          <span className="canli-etiket">{t.canli}</span>
        </div>
        <div className="canli-masa-govde">
          <Field label={`1 · ${t.ad}`} description={t.adIpucu} htmlFor="canli-ad">
            <Input id="canli-ad" full value={urun} onChange={(e) => setUrun(e.target.value)} />
          </Field>

          <div className="flex flex-col gap-2">
            <Label>{`2 · ${t.renk}`}</Label>
            <ColorSwatches
              options={t.kutular}
              value={renk}
              onChange={(h) => setRenk(h.toLowerCase())}
              customLabel={t.ozelRenk}
            />
            {/* KONTRAST ORANI PALETTEN OKUNUYOR: düğmenin üstündeki yazının
                rengini `makePalette` seçiyor, ve okunurluk o seçime bağlı. */}
            <span className="flex flex-wrap items-center gap-2">
              <StatusChip
                label={`${t.kontrast} ${kontrast(p.accent, p.accentInk).toFixed(2)}`}
                state={kontrast(p.accent, p.accentInk) >= 4.5 ? "positive" : "caution"}
              />
              <span className="text-caption text-ink-faint">
                {kontrast(p.accent, p.accentInk) >= 4.5 ? t.kontrastIyi : t.kontrastZayif}
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{`3 · ${t.temaMenu}`}</Label>
            <Segmented
              size="sm"
              label={t.temaMenu}
              value={tema === "dark" ? "dark" : "light"}
              onChange={(v) => setTema(v as ThemeChoice)}
              options={[
                { value: "light", label: t.acik },
                { value: "dark", label: t.koyu },
              ]}
            />
            <Segmented
              size="sm"
              label={t.kenarMenusu}
              value={ray}
              onChange={(v) => setRay(v as RailChoice)}
              options={[
                { value: "narrow", label: t.dar },
                { value: "wide", label: t.genis },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t.tasi}</Label>
            <code className="canli-kod">{`makePalette("${buyuk(renk)}")`}</code>
          </div>

          <Button size="sm" onClick={sifirla}>
            {t.sifirla}
          </Button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- panel */}
      <div className="canli-pencere">
        <div className="canli-cubuk">
          <span className="canli-pencere-nokta" />
          <span className="canli-pencere-nokta" />
          <span className="canli-pencere-nokta" />
          <code className="canli-adres">{`${slug}.app`}</code>
        </div>
        {/* Panelin token'ları BURADA bildiriliyor: içerideki her bileşen
            sayfanın değil panelin paletini okuyor. */}
        <div className="canli-panel" style={{ ...paletteVars(p), background: p.page, color: p.ink }}>
          <AppShell
            nav={nav}
            activePath={gorunum}
            rail={rayDar ? "narrow" : "wide"}
            linkComponent={RayBaglanti}
            labels={{ home: urun.trim() || "Marka", primaryNav: t.genelBakis }}
            railFooter={
              ray === "free" ? (
                <RailLink label={dar ? t.genislet : t.daralt} showLabel={!dar} onClick={() => setDar((d) => !d)}>
                  <Icon icon={SidebarSimple} size="md" />
                </RailLink>
              ) : undefined
            }
            brand={
              /* DAR RAY AMBLEM, GENİŞ RAY LOGO · ikisi bir arada değil: logo
                 zaten amblemi taşıyor, yan yana konduğunda işaret iki kez
                 çiziliyordu. Ürün adı değiştiyse logo düşüyor, yerine amblem
                 ve ad geliyor: logo artık o ürünün logosu değil. */
              <span className="canli-marka">
                {rayDar ? (
                  amblem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={amblem} alt={urun.trim() || "Marka"} className="canli-amblem-gorsel" />
                  ) : (
                    <span className="canli-amblem" style={{ background: p.accent, color: p.accentInk }}>
                      {(urun.trim() || "M").slice(0, 1).toLocaleUpperCase("tr")}
                    </span>
                  )
                ) : logo && urun.trim() === VARSAYILAN_AD ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo === ORNEK_LOGO && tema === "dark" ? ORNEK_LOGO_KOYU : logo}
                    alt={urun.trim()}
                    className="canli-logo-gorsel"
                  />
                ) : (
                  <>
                    {amblem ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={amblem} alt="" className="canli-amblem-gorsel" />
                    ) : (
                      <span className="canli-amblem" style={{ background: p.accent, color: p.accentInk }}>
                        {(urun.trim() || "M").slice(0, 1).toLocaleUpperCase("tr")}
                      </span>
                    )}
                    <span className="truncate">{urun.trim() || "Marka"}</span>
                  </>
                )}
              </span>
            }
            topbar={
              <div className="canli-topbar">
                <span className="canli-arama">
                  <Icon icon={Search} size="xs" aria-hidden />
                  {t.ara}
                  <Kbd>⌘K</Kbd>
                </span>
                {/* AYARLAR DÜĞMESİ YOK: rayda zaten bir "Ayarlar" satırı var,
                    ve aynı yere iki kapı açmak menüyü değil kullanıcıyı
                    bölüyor. Hesap düğmesi kitin `AccountButton`ı. */}
                <span className="canli-hesap-kap">
                  <DropdownMenu
                    align="end"
                    trigger={<AccountButton name={t.hesapAdi} label={t.hesapMenu} />}
                    items={[
                      { kind: "label", label: `${t.hesapAdi} · ${t.hesapPosta}@${slug}.app` },
                      { label: t.profil },
                      { label: t.gorunumAyarlari, onSelect: () => setGorunum("/ayarlar") },
                      { kind: "separator" },
                      { label: t.cikis, state: "danger" },
                    ]}
                  />
                </span>
              </div>
            }
          >
            <div className="canli-sayfa">
              {gorunum === "/hesaplar" ? hesaplar : gorunum === "/ayarlar" ? ayarlar : genel}
            </div>
          </AppShell>

          {bildirim ? (
            <div className="canli-toast">
              <Toast
                tone="positive"
                title={bildirim}
                dismissLabel={t.kapat}
                onDismiss={() => setBildirim(null)}
              />
            </div>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={silinecek !== null}
        onClose={() => setSilinecek(null)}
        onConfirm={() => {
          setBildirim(`${silinecek?.ad ?? ""} ${t.silindi}`);
          setSilinecek(null);
        }}
        title={t.silBaslik}
        confirmLabel={t.sil}
        cancelLabel={t.vazgec}
        closeLabel={t.kapat}
      >
        {t.silGovde.replace("{ad}", silinecek?.ad ?? "")}
      </ConfirmDialog>

      <Sheet
        open={acilan !== null}
        onClose={() => setAcilan(null)}
        title={acilan?.ad ?? ""}
        closeLabel={t.kapat}
      >
        {acilan ? (
          <div className="flex flex-col gap-3">
            <Field label={t.plan}>
              <Input value={acilan.plan} readOnly />
            </Field>
            <Field label={t.durum}>
              <StatusChip label={t.durumlar[acilan.durum + 1] ?? ""} state={TONLAR[acilan.durum] ?? "neutral"} />
            </Field>
            <Label>{`${t.son}: ${acilan.son}`}</Label>
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}

/* WCAG kontrast oranı · iki renk arasındaki okunurluk. Kitin kendi ölçümüyle
   aynı formül; `check-token-contrast` de bunu kullanıyor. */
function kontrast(a: string, b: string) {
  const isik = (hex: string) => {
    const n = hex.replace("#", "");
    const [r, g, bl] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
    const k = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * k(r ?? 0) + 0.7152 * k(g ?? 0) + 0.0722 * k(bl ?? 0);
  };
  const [x, y] = [isik(a), isik(b)].sort((m, n) => n - m);
  return ((x ?? 0) + 0.05) / ((y ?? 0) + 0.05);
}
