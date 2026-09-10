"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHead,
  Checkbox,
  Descriptions,
  Field,
  Icon,
  IconButton,
  Input,
  Kpi,
  Label,
  LineChart,
  ListRow,
  Pagination,
  PasswordInput,
  Progress,
  Select,
  SelectAll,
  SelectRow,
  SortHeader,
  Sparkline,
  StatusChip,
  Switch,
  Table,
  Textarea,
} from "tamga-ui";
import { CountRow, SaveBar } from "tamga-ui/blocks";
import {
  AuthProviders,
  AuthTemplate,
  DetailTemplate,
  ListTemplate,
  OverviewTemplate,
  PublicTemplate,
  SettingsPanel,
  SettingsTemplate,
  WizardTemplate,
} from "tamga-ui/patterns";
import { Delete, Download, GithubLogo, GoogleLogo, More, Plus } from "tamga-ui/icons";
import type { Locale as Dil } from "@/i18n/config";
import { DESTEK, DurmusBaglanti, Marka, Uygulama } from "./kabuk";
import { KULLANICILAR, SIPARISLER, TALEPLER, type Ton } from "./veri";

/**
 * Şablonların canlı ekranları. Veriyi, metni ve bağlantıyı bu dosya veriyor —
 * şablonun üç kuralı (ADR-0004) burada uygulanıyor.
 */

const S = {
  tr: {
    hata: { title: "Yüklenemedi", body: "Bu bölüm getirilemedi.", retry: "Yeniden dene" },
    yukleniyor: "Yükleniyor",
    kaydet: "Kaydet",
    vazgec: "Vazgeç",
    duzenle: "Düzenle",
    sil: "Sil",
    silAria: (ad: string) => `${ad} sil`,
    digerAria: (ad: string) => `${ad} için diğer işlemler`,
    disaAktar: "Dışa aktar",
    secTumu: "Tümünü seç",
    secSatir: (ad: string) => `${ad} satırını seç`,
    sayfada: "Sayfada",
    onceki: "Önceki",
    sonraki: "Sonraki",
    sayfa: (n: number) => `Sayfa ${n}`,
    ozet: (a: number, b: number, t: number) => `${a}-${b} / ${t.toLocaleString("tr")}`,

    /* pano */
    panoBaslik: "Bugün",
    panoAlt: "37 sipariş hazırlanmayı bekliyor",
    ciro: "Bugünün cirosu",
    ciroDeger: "84.320 ₺",
    ciroAlt: "Dünle aynı saatte 71.980 ₺",
    saatler: ["09", "10", "11", "12", "13", "14", "15", "16", "17"],
    ciroSeri: "Ciro",
    kpi: [
      ["Sipariş", "218", "adet", 12],
      ["Yeni müşteri", "34", "kişi", 5],
      ["İade", "7", "adet", -18],
      ["Sepet ortalaması", "387", "₺", 3],
    ] as const,
    cokSatan: "En çok satan ürünler",
    cokSatanNot: "Son yedi gün, adet.",
    urunler: [
      ["Koşu tayt · siyah", 148],
      ["Termal içlik · M", 121],
      ["Antrenman çorabı · 3'lü", 96],
      ["Su şişesi · 750 ml", 74],
      ["Dizlik · L", 51],
    ] as const,
    sonHareketler: "Son hareketler",
    hareketler: [
      ["Ada Yılmaz", "SIP-10428'i onayladı", "2 dk"],
      ["Baran Çelik", "Koşu tayt fiyatını güncelledi", "18 dk"],
      ["Ceyda Aksu", "İade #219'u kapattı", "1 sa"],
      ["Ege Demir", "42 ürünü içeri aktardı", "3 sa"],
    ] as const,
    stokUyari: "Stoğu biten 12 ürün var.",
    stokGor: "Listeyi gör",

    /* kullanıcılar */
    kullanicilar: "Kullanıcılar",
    kullaniciAlt: "48 kullanıcı · 3 davet bekliyor",
    yeniKullanici: "Yeni kullanıcı",
    kullaniciBirim: "kullanıcı",
    aktif: "Aktif",
    davetli: "Davetli",
    kapali: "Kapalı",
    thAd: "Ad",
    thEposta: "E-posta",
    thRol: "Rol",
    thSonGoruldu: "Son görüldü",
    thDurum: "Durum",
    davetBekleyen: "davet bekliyor",
    bosKullanici: "Bu filtreyle kullanıcı kalmadı. Rol filtresini gevşetin.",

    /* yeni kullanıcı */
    yeniAlt: "Davet e-postası kaydettiğinde gidiyor.",
    ad: "Ad",
    soyad: "Soyad",
    eposta: "E-posta",
    epostaNot: "Davet bağlantısı bu adrese gider.",
    telefon: "Telefon",
    rol: "Rol",
    rolNot: "Rol, hangi ekranları göreceğini belirler.",
    depo: "Bağlı depo",
    secin: "Seçiniz",
    depolar: ["İstanbul · Merkez", "İzmir · Ege", "Ankara · İç Anadolu"],
    roller: ["Yönetici", "Editör", "Depo", "Muhasebe"],
    kimlik: "Kimlik",
    kimlikNot: "Bu bilgiler faturalarda ve bildirimlerde görünür.",
    yetki: "Yetki",
    yetkiNot: "Sonradan da değiştirilebilir.",
    not: "Not",
    notNot: "Yalnız yöneticiler görür.",
    kaydedilmemis: "Kaydedilmemiş değişiklik var",

    /* kullanıcı detayı */
    detayAlt: "Yönetici · 14 Mart 2025'ten beri",
    sekmeGenel: "Genel",
    sekmeSiparis: "Siparişler",
    sekmeEtkinlik: "Etkinlik",
    kunye: "Künye",
    kunyeSatir: ["E-posta", "Telefon", "Rol", "Depo", "Kayıt"],
    kunyeDeger: ["ada@ornek.com", "0500 000 00 00", "Yönetici", "İstanbul · Merkez", "14 Mart 2025"],
    sonSiparisler: "Onayladığı son siparişler",
    etkinlikBaslik: "Etkinlik",
    etkinlikler: [
      ["SIP-10428'i onayladı", "2 dk"],
      ["Koşu tayt fiyatını güncelledi", "18 dk"],
      ["İade #219'u kapattı", "1 sa"],
      ["Yeni kullanıcı davet etti", "dün"],
    ] as const,

    /* siparişler */
    siparisler: "Siparişler",
    siparisAlt: "1.284 sipariş · son 30 gün",
    siparisBirim: "sipariş",
    hazirlaniyor: "Hazırlanıyor",
    kargoda: "Kargoda",
    teslim: "Teslim edildi",
    iptal: "İptal",
    thNo: "Sipariş",
    thMusteri: "Müşteri",
    thTarih: "Tarih",
    thKalem: "Kalem",
    thTutar: "Tutar",
    bekleyenTutar: "tanesi 24 saati geçti",
    bosSiparis: "Bu tarih aralığında sipariş yok.",

    /* talepler */
    talepler: "Talepler",
    talepAlt: "38 açık talep · 6'sı geciken",
    talepBirim: "talep",
    yeniTalep: "Yeni talep",
    thTalep: "Talep",
    thKonu: "Konu",
    thMusteriAd: "Müşteri",
    thOncelik: "Öncelik",
    thGuncelleme: "Güncelleme",
    yuksek: "Yüksek",
    orta: "Orta",
    dusuk: "Düşük",
    bosTalep: "Bu filtreyle açık talep yok.",

    /* ayarlar */
    bolumler: {
      profil: "Profil",
      ekip: "Ekip",
      bildirim: "Bildirimler",
      odeme: "Ödeme",
      kargo: "Kargo",
      alan: "Alan adı",
    },
    bolumlerAd: "Ayar bölümleri",
    kapsam: { personal: "Kişisel", workspace: "Çalışma alanı", mixed: "Karma" },
    bildirimAlt: "Kime, ne zaman, hangi kanaldan.",
    gunlukOzet: "Günlük özet",
    gunlukOzetNot: "Her sabah 09:00'da dünün siparişleri özetlenip gönderilir.",
    devralindi: "çalışma alanından geliyor",
    epostaAc: "E-posta gönder",
    ozetSaati: "Gönderim saati",
    stokUyarisi: "Stok uyarısı",
    stokUyarisiNot: "Bir ürün eşiğin altına düştüğünde haber verilir.",
    esik: "Eşik (adet)",
    yeniSiparis: "Yeni sipariş",
    yeniSiparisNot: "Sipariş geldiği anda kime haber verileceği.",
    alici: "Alıcılar",

    /* sihirbaz */
    adimlar: { hesap: "Hesap", magaza: "Mağaza", odeme: "Ödeme" },
    sihirbazBaslik: "Mağazanı tanıt",
    sihirbazAlt: "Bu bilgiler faturalarında ve kargo etiketlerinde görünecek.",
    geri: "Geri",
    ileri: "İleri",
    magazaAdi: "Mağaza adı",
    magazaAdiNot: "Müşterinin sipariş onayında gördüğü ad.",
    /* ÖRNEK VERİ UYDURMA BİR AD TAŞIR, GERÇEK BİR MÜŞTERİNİNKİNİ DEĞİL: depo
       public, ve bir şablon örneğinin kimin panelinden alındığını söylemesi
       gerekmiyor. */
    magazaAdiOrnek: "Örnek Mağaza",
    vergiNo: "Vergi numarası",
    vergiDairesi: "Vergi dairesi",
    adres: "Fatura adresi",
    parabirimi: "Para birimi",
    parabirimleri: ["₺ Türk lirası", "$ ABD doları", "€ Euro"],

    /* oturum */
    girisBaslik: "Tekrar hoş geldin",
    girisAlt: "Mağaza paneline giriş yap.",
    girisFooter: "Hesabın yok mu? Kaydol.",
    kayitBaslik: "Mağazanı aç",
    kayitAlt: "Kurulum üç adım sürüyor, kart istemiyoruz.",
    kayitFooter: "Zaten hesabın var mı? Giriş yap.",
    yaDa: "ya da",
    google: "Google ile devam et",
    github: "GitHub ile devam et",
    parola: "Parola",
    parolaNot: "En az 10 karakter.",
    goster: "Göster",
    gizle: "Gizle",
    beniHatirla: "Beni hatırla",
    girisYap: "Giriş yap",
    hesapAc: "Hesap aç",
    yanBaslik: "Kurulumdan sonra",
    yanMaddeler: [
      "Ürünlerini tek dosyayla içeri aktar",
      "Kargo firmanı bağla",
      "İlk siparişini al",
    ],
    yanNot: "Kurulum ortalama 11 dakika sürüyor.",

    /* kamusal */
    kamusalBaslik: "Mağaza · Durum",
    kamusalAlt: "Son 90 gün",
    aboneOl: "Abone ol",
    kamusalFooter: "Bu sayfa herkese açıktır. Olaylar 90 gün saklanır.",
    hepsiCalisiyor: "Bütün servisler çalışıyor",
    calisiyor: "Çalışıyor",
    yavas: "Yavaş",
    servisler: [
      ["Mağaza", "positive", "Çalışıyor", 99.98],
      ["Ödeme", "positive", "Çalışıyor", 99.99],
      ["Kargo entegrasyonu", "caution", "Yavaş", 99.21],
      ["Yönetim paneli", "positive", "Çalışıyor", 99.95],
    ] as const,
    gecmis: "Son olaylar",
    olaylar: [
      ["8 Eylül", "Kargo entegrasyonunda 34 dakika gecikme", "caution", "Çözüldü"],
      ["27 Ağustos", "Ödeme sağlayıcısında kısa kesinti", "caution", "Çözüldü"],
      ["3 Ağustos", "Planlı bakım", "neutral", "Tamamlandı"],
    ] as const,
    calismaSuresi: "Çalışma süresi",

    /* dört durum: etiketler durumun ADI, cümlesi değil */
    durumYukleniyor: "iskelet satırlar",
    durumBos: "ekranın kendi cümlesi",
    durumHata: "code · request_id",
    durumHazir: "çağıranın tablosu",
  },
  en: {
    hata: { title: "Could not load", body: "This section could not be fetched.", retry: "Try again" },
    yukleniyor: "Loading",
    kaydet: "Save",
    vazgec: "Cancel",
    duzenle: "Edit",
    sil: "Delete",
    silAria: (ad: string) => `Delete ${ad}`,
    digerAria: (ad: string) => `More actions for ${ad}`,
    disaAktar: "Export",
    secTumu: "Select all",
    secSatir: (ad: string) => `Select the row for ${ad}`,
    sayfada: "Per page",
    onceki: "Previous",
    sonraki: "Next",
    sayfa: (n: number) => `Page ${n}`,
    ozet: (a: number, b: number, t: number) => `${a}–${b} of ${t.toLocaleString("en")}`,

    panoBaslik: "Today",
    panoAlt: "37 orders are waiting to be packed",
    ciro: "Revenue today",
    ciroDeger: "$3,180",
    ciroAlt: "$2,715 at the same hour yesterday",
    saatler: ["09", "10", "11", "12", "13", "14", "15", "16", "17"],
    ciroSeri: "Revenue",
    kpi: [
      ["Orders", "218", "orders", 12],
      ["New customers", "34", "people", 5],
      ["Returns", "7", "orders", -18],
      ["Average basket", "38", "$", 3],
    ] as const,
    cokSatan: "Best selling products",
    cokSatanNot: "Last seven days, units.",
    urunler: [
      ["Running tights · black", 148],
      ["Thermal base layer · M", 121],
      ["Training socks · 3-pack", 96],
      ["Water bottle · 750 ml", 74],
      ["Knee sleeve · L", 51],
    ] as const,
    sonHareketler: "Recent activity",
    hareketler: [
      ["Ada Yılmaz", "approved ORD-10428", "2 min"],
      ["Baran Çelik", "updated the running tights price", "18 min"],
      ["Ceyda Aksu", "closed return #219", "1 hr"],
      ["Ege Demir", "imported 42 products", "3 hrs"],
    ] as const,
    stokUyari: "12 products are out of stock.",
    stokGor: "See the list",

    kullanicilar: "Users",
    kullaniciAlt: "48 users · 3 invitations pending",
    yeniKullanici: "New user",
    kullaniciBirim: "users",
    aktif: "Active",
    davetli: "Invited",
    kapali: "Disabled",
    thAd: "Name",
    thEposta: "Email",
    thRol: "Role",
    thSonGoruldu: "Last seen",
    thDurum: "Status",
    davetBekleyen: "invitations pending",
    bosKullanici: "No users match this filter. Try loosening the role filter.",

    yeniAlt: "The invitation email goes out when you save.",
    ad: "First name",
    soyad: "Last name",
    eposta: "Email",
    epostaNot: "The invitation link goes to this address.",
    telefon: "Phone",
    rol: "Role",
    rolNot: "The role decides which screens they see.",
    depo: "Home warehouse",
    secin: "Choose",
    depolar: ["Istanbul · Central", "Izmir · Aegean", "Ankara · Anatolia"],
    roller: ["Admin", "Editor", "Warehouse", "Finance"],
    kimlik: "Identity",
    kimlikNot: "This shows on invoices and notifications.",
    yetki: "Access",
    yetkiNot: "It can be changed later.",
    not: "Note",
    notNot: "Only admins see it.",
    kaydedilmemis: "Unsaved changes",

    detayAlt: "Admin · since 14 March 2025",
    sekmeGenel: "Overview",
    sekmeSiparis: "Orders",
    sekmeEtkinlik: "Activity",
    kunye: "Details",
    kunyeSatir: ["Email", "Phone", "Role", "Warehouse", "Joined"],
    kunyeDeger: [
      "ada@example.com",
      "+90 500 000 00 00",
      "Admin",
      "Istanbul · Central",
      "14 March 2025",
    ],
    sonSiparisler: "Orders they approved",
    etkinlikBaslik: "Activity",
    etkinlikler: [
      ["approved ORD-10428", "2 min"],
      ["updated the running tights price", "18 min"],
      ["closed return #219", "1 hr"],
      ["invited a new user", "yesterday"],
    ] as const,

    siparisler: "Orders",
    siparisAlt: "1,284 orders · last 30 days",
    siparisBirim: "orders",
    hazirlaniyor: "Packing",
    kargoda: "Shipped",
    teslim: "Delivered",
    iptal: "Cancelled",
    thNo: "Order",
    thMusteri: "Customer",
    thTarih: "Placed",
    thKalem: "Items",
    thTutar: "Total",
    bekleyenTutar: "of them are past 24 hours",
    bosSiparis: "No orders in this date range.",

    talepler: "Tickets",
    talepAlt: "38 open tickets · 6 overdue",
    talepBirim: "tickets",
    yeniTalep: "New ticket",
    thTalep: "Ticket",
    thKonu: "Subject",
    thMusteriAd: "Company",
    thOncelik: "Priority",
    thGuncelleme: "Updated",
    yuksek: "High",
    orta: "Medium",
    dusuk: "Low",
    bosTalep: "No open tickets match this filter.",

    bolumler: {
      profil: "Profile",
      ekip: "Team",
      bildirim: "Notifications",
      odeme: "Payments",
      kargo: "Shipping",
      alan: "Domain",
    },
    bolumlerAd: "Settings sections",
    kapsam: { personal: "Personal", workspace: "Workspace", mixed: "Mixed" },
    bildirimAlt: "Who hears about what, when, and on which channel.",
    gunlukOzet: "Daily digest",
    gunlukOzetNot: "Every morning at 09:00, yesterday's orders are summarised and sent.",
    devralindi: "inherited from the workspace",
    epostaAc: "Send email",
    ozetSaati: "Send at",
    stokUyarisi: "Low stock alert",
    stokUyarisiNot: "You are told when a product drops below its threshold.",
    esik: "Threshold (units)",
    yeniSiparis: "New order",
    yeniSiparisNot: "Who hears about an order the moment it lands.",
    alici: "Recipients",

    adimlar: { hesap: "Account", magaza: "Store", odeme: "Payments" },
    sihirbazBaslik: "Tell us about your store",
    sihirbazAlt: "This shows on your invoices and shipping labels.",
    geri: "Back",
    ileri: "Next",
    magazaAdi: "Store name",
    magazaAdiNot: "The name a customer sees on their order confirmation.",
    magazaAdiOrnek: "Example Store",
    vergiNo: "Tax number",
    vergiDairesi: "Tax office",
    adres: "Billing address",
    parabirimi: "Currency",
    parabirimleri: ["$ US dollar", "€ Euro", "₺ Turkish lira"],

    girisBaslik: "Welcome back",
    girisAlt: "Sign in to your store panel.",
    girisFooter: "No account? Register.",
    kayitBaslik: "Open your store",
    kayitAlt: "Setup takes three steps, and no card.",
    kayitFooter: "Already have an account? Sign in.",
    yaDa: "or",
    google: "Continue with Google",
    github: "Continue with GitHub",
    parola: "Password",
    parolaNot: "At least 10 characters.",
    goster: "Show",
    gizle: "Hide",
    beniHatirla: "Keep me signed in",
    girisYap: "Sign in",
    hesapAc: "Create account",
    yanBaslik: "After setup",
    yanMaddeler: [
      "Import your products from one file",
      "Connect your carrier",
      "Take your first order",
    ],
    yanNot: "Setup takes 11 minutes on average.",

    kamusalBaslik: "Store · Status",
    kamusalAlt: "Last 90 days",
    aboneOl: "Subscribe",
    kamusalFooter: "This page is public. Incidents are kept for 90 days.",
    hepsiCalisiyor: "All services are operational",
    calisiyor: "Operational",
    yavas: "Degraded",
    servisler: [
      ["Storefront", "positive", "Operational", 99.98],
      ["Payments", "positive", "Operational", 99.99],
      ["Carrier integration", "caution", "Degraded", 99.21],
      ["Admin panel", "positive", "Operational", 99.95],
    ] as const,
    gecmis: "Recent incidents",
    olaylar: [
      ["8 September", "34 minutes of delay in the carrier integration", "caution", "Resolved"],
      ["27 August", "Short outage at the payment provider", "caution", "Resolved"],
      ["3 August", "Planned maintenance", "neutral", "Completed"],
    ] as const,
    calismaSuresi: "Çalışma süresi",

    durumYukleniyor: "skeleton rows",
    durumBos: "the screen's own sentence",
    durumHata: "code · request_id",
    durumHazir: "the caller's table",
  },
} as const;

/* Sözlükler YAPISINA göre alınıyor, `S["tr"]` tipine göre değil: `as const` iki
   dile iki farklı dizgi-literal tipi veriyor ve biri ötekine atanamıyor. */
const ortak = (s: { yukleniyor: string; hata: { title: string; body: string; retry: string } }) => ({
  loading: s.yukleniyor,
  ...s.hata,
});
const HATA = { code: "upstream_timeout", requestId: "req_8f2a11" };
const sayfaMetin = (s: {
  onceki: string;
  sonraki: string;
  sayfa: (n: number) => string;
  ozet: (a: number, b: number, t: number) => string;
}) => ({
  previous: s.onceki,
  next: s.sonraki,
  page: s.sayfa,
  summary: s.ozet,
});

/* ------------------------------------------------------------------ pano -- */

export function Pano({ lang }: { lang: Dil }) {
  const s = S[lang];
  const enCok = Math.max(...s.urunler.map(([, n]) => n));
  return (
    <Uygulama lang={lang} aktif="/">
      <OverviewTemplate
        title={s.panoBaslik}
        subtitle={s.panoAlt}
        actions={
          <Button>
            <Icon icon={Download} size="xs" />
            {s.disaAktar}
          </Button>
        }
        hero={
          <Card>
            <CardBody>
              {/* TEK GRAFİK. Sayının yanında bir `Sparkline`, altında da aynı
                  serinin `LineChart`ı vardı: aynı veriyi iki kez çizmek, kartın
                  kendi içinde "iki kahraman" yapmak — bu şablonun uyardığı
                  hatanın ta kendisi. Kıvılcım çizgisi gitti, sayı ile grafik
                  kaldı. */}
              <p className="text-small text-ink-faint">{s.ciro}</p>
              <p className="mt-1 text-display font-semibold tabular-nums text-ink">
                {s.ciroDeger}
              </p>
              <p className="mt-1 text-small text-ink-faint">{s.ciroAlt}</p>
              <div className="mt-4">
                <LineChart
                  labels={[...s.saatler]}
                  series={[
                    { name: s.ciroSeri, values: [4.2, 7.8, 11.4, 19.6, 28.1, 41.7, 55.2, 71.4, 84.3] },
                  ]}
                  height={120}
                />
              </div>
            </CardBody>
          </Card>
        }
        labels={ortak(s)}
      >
        {s.kpi.map(([ad, deger, birim, delta]) => (
          <Kpi key={ad} label={ad} value={deger} unit={birim} delta={delta} better="up" />
        ))}

        <div className="col-span-full grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHead>
              <div>
                <h3 className="text-subhead font-semibold text-ink">{s.cokSatan}</h3>
                <Label>{s.cokSatanNot}</Label>
              </div>
            </CardHead>
            <CardBody>
              <div className="flex flex-col gap-3">
                {s.urunler.map(([ad, adet]) => (
                  <div key={ad} className="flex items-center gap-3">
                    <span className="w-44 shrink-0 truncate text-ink">{ad}</span>
                    <span className="min-w-0 flex-1">
                      <Progress value={Math.round((adet / enCok) * 100)} ariaLabel={ad} />
                    </span>
                    <span className="w-10 shrink-0 text-right tabular-nums text-ink">{adet}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHead>
              <h3 className="text-subhead font-semibold text-ink">{s.sonHareketler}</h3>
            </CardHead>
            {s.hareketler.map(([kisi, ne, neZaman]) => (
              <ListRow key={ne}>
                <Avatar name={kisi} size={24} />
                <span className="min-w-0 flex-1 truncate text-ink">
                  <strong className="font-medium">{kisi}</strong> {ne}
                </span>
                <Label>{neZaman}</Label>
              </ListRow>
            ))}
            <ListRow href="#">
              <span className="min-w-0 flex-1 truncate text-ink-soft">{s.stokUyari}</span>
              <Label>{s.stokGor}</Label>
            </ListRow>
          </Card>
        </div>
      </OverviewTemplate>
    </Uygulama>
  );
}

/* ------------------------------------------------------------ kullanıcı -- */

function KullaniciTablosu({ lang }: { lang: Dil }) {
  const s = S[lang];
  const satirlar = KULLANICILAR[lang];
  const [secili, setSecili] = useState<Set<string>>(new Set());
  const hepsi = secili.size === satirlar.length;

  return (
    <Table>
      <thead>
        <tr>
          <th className="w-10">
            <SelectAll
              checked={hepsi}
              indeterminate={secili.size > 0 && !hepsi}
              label={s.secTumu}
              onChange={(a) => setSecili(a ? new Set(satirlar.map((r) => r[1])) : new Set())}
            />
          </th>
          {/* `SortHeader` KENDİSİ bir `<th>`: sarmalamak `<th>` içinde `<th>`
              demek, geçersiz HTML, ve hidrasyon patlıyor. Genişlik ve hizayı
              da kendisi alıyor. */}
          <SortHeader direction="asc">{s.thAd}</SortHeader>
          <th>{s.thEposta}</th>
          <th className="w-32">{s.thRol}</th>
          <th className="w-36">{s.thSonGoruldu}</th>
          <th className="w-28">{s.thDurum}</th>
          <th className="w-24" />
        </tr>
      </thead>
      <tbody>
        {satirlar.map(([ad, eposta, rol, gorulme, ton, durum]) => (
          <tr key={eposta}>
            <td>
              <SelectRow
                checked={secili.has(eposta)}
                label={s.secSatir(ad)}
                onChange={(a) => {
                  const next = new Set(secili);
                  if (a) next.add(eposta);
                  else next.delete(eposta);
                  setSecili(next);
                }}
              />
            </td>
            <td>
              <span className="flex items-center gap-2.5">
                <Avatar name={ad} size={26} />
                <a href="#" className="tamga-link font-medium">
                  {ad}
                </a>
              </span>
            </td>
            <td className="font-mono text-caption">{eposta}</td>
            <td>{rol}</td>
            <td className="text-ink-faint">{gorulme}</td>
            <td>
              <StatusChip label={durum} state={ton as Ton} />
            </td>
            <td className="text-right">
              <span className="flex items-center justify-end gap-1">
                <IconButton size="sm" aria-label={s.silAria(ad)}>
                  <Icon icon={Delete} size="xs" />
                </IconButton>
                <IconButton size="sm" aria-label={s.digerAria(ad)}>
                  <Icon icon={More} size="xs" />
                </IconButton>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export function KullaniciListesi({
  lang,
  durum,
  cercevesiz,
}: {
  lang: Dil;
  durum?: "ready" | "loading" | "empty" | "error";
  cercevesiz?: boolean;
}) {
  const s = S[lang];
  const [sayfa, setSayfa] = useState(1);
  const [boy, setBoy] = useState(25);

  const ekran = (
    <ListTemplate
      title={s.kullanicilar}
      subtitle={s.kullaniciAlt}
      actions={
        <Button variant="primary">
          <Icon icon={Plus} size="xs" />
          {s.yeniKullanici}
        </Button>
      }
      filters={
        <>
          <StatusChip label={s.aktif} state="positive" />
          <StatusChip label={s.davetli} state="caution" />
          <StatusChip label={s.kapali} state="neutral" />
        </>
      }
      state={durum}
      loadingRows={8}
      error={HATA}
      /* Boş hâlin cümlesi EKRANIN: şablon yalnız yerini veriyor. */
      empty={<p className="py-10 text-center text-ink-soft">{s.bosKullanici}</p>}
      labels={ortak(s)}
    >
      <CountRow
        count={48}
        unit={s.kullaniciBirim}
        aside={
          <p className="text-small text-ink-soft">
            <strong className="tabular-nums text-[var(--color-warn)]">3</strong> {s.davetBekleyen}
          </p>
        }
        pageSize={boy}
        pageSizeOptions={[25, 50, 100]}
        onPageSize={setBoy}
        labels={{
          format: (n) => n.toLocaleString(lang),
          perPage: s.sayfada,
          records: s.kullaniciBirim,
        }}
      />
      <KullaniciTablosu lang={lang} />
      <div className="tamga-gutter py-3">
        <Pagination
          page={sayfa}
          pageSize={boy}
          total={48}
          onChange={setSayfa}
          labels={sayfaMetin(s)}
        />
      </div>
    </ListTemplate>
  );

  if (cercevesiz) return ekran;
  return (
    <Uygulama lang={lang} aktif="/kullanicilar">
      {ekran}
    </Uygulama>
  );
}

/** Dört durum yan yana; dördü de kendi çerçevesinde, dışarıda çerçeve yok. */
export function Durumlar({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {(
        [
          ["loading", s.durumYukleniyor],
          ["empty", s.durumBos],
          ["error", s.durumHata],
          ["ready", s.durumHazir],
        ] as const
      ).map(([d, ad]) => (
        <figure key={d} className="m-0 flex min-w-0 flex-col gap-2">
          <figcaption className="flex items-baseline gap-2">
            <code className="font-mono text-caption text-ink">{d}</code>
            <span className="text-small text-ink-faint">{ad}</span>
          </figcaption>
          <div className="tamga-card h-96 overflow-hidden">
            <KullaniciListesi lang={lang} durum={d} cercevesiz />
          </div>
        </figure>
      ))}
    </div>
  );
}

export function YeniKullanici({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <Uygulama lang={lang} aktif="/kullanicilar">
      <DetailTemplate
        breadcrumb={[{ label: s.kullanicilar, href: "#" }, { label: s.yeniKullanici }]}
        title={s.yeniKullanici}
        subtitle={s.yeniAlt}
        /* KAYDET TEK YERDE. Bir süre hem şeridin sağında hem alttaki kaydet
           şeridinde duruyordu: bir ekranda iki "Kaydet", "nereden kaydediyorum"
           sorusuna iki cevap demek. Sahibi kayan yüzeyin dibindeki şerit,
           çünkü yirmi alanlık bir formda her zaman görünen tek yer orası. */
        linkComponent={DurmusBaglanti}
        labels={{ ...ortak(s), breadcrumb: s.kunye, tabs: s.sekmeGenel }}
      >
        <div className="flex flex-col gap-4">
          <Card>
            <CardHead>
              <div>
                <h3 className="text-subhead font-semibold text-ink">{s.kimlik}</h3>
                <Label>{s.kimlikNot}</Label>
              </div>
            </CardHead>
            <CardBody>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={s.ad} htmlFor="yk-ad">
                  <Input id="yk-ad" full defaultValue="Jale" />
                </Field>
                <Field label={s.soyad} htmlFor="yk-soyad">
                  <Input id="yk-soyad" full defaultValue="Kurt" />
                </Field>
                <Field label={s.eposta} htmlFor="yk-eposta" description={s.epostaNot}>
                  <Input id="yk-eposta" full type="email" defaultValue="jale@ornek.com" />
                </Field>
                <Field label={s.telefon} htmlFor="yk-tel">
                  <Input id="yk-tel" full defaultValue="0500 000 00 00" />
                </Field>
              </div>
            </CardBody>
          </Card>

          <Card overflow="visible">
            <CardHead>
              <div>
                <h3 className="text-subhead font-semibold text-ink">{s.yetki}</h3>
                <Label>{s.yetkiNot}</Label>
              </div>
            </CardHead>
            <CardBody>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={s.rol} htmlFor="yk-rol" description={s.rolNot}>
                  <Select
                    className="w-full"
                    options={[...s.roller]}
                    value={s.roller[1]}
                    placeholder={s.secin}
                  />
                </Field>
                <Field label={s.depo} htmlFor="yk-depo">
                  <Select className="w-full" options={[...s.depolar]} placeholder={s.secin} />
                </Field>
              </div>
              <div className="mt-4">
                <Field label={s.not} htmlFor="yk-not" description={s.notNot}>
                  <Textarea id="yk-not" rows={3} full />
                </Field>
              </div>
            </CardBody>
          </Card>

          <SaveBar
            changed
            labels={{ save: s.kaydet, cancel: s.vazgec }}
            extra={<Label>{s.kaydedilmemis}</Label>}
          />
        </div>
      </DetailTemplate>
    </Uygulama>
  );
}

export function KullaniciDetayi({ lang }: { lang: Dil }) {
  const s = S[lang];
  const [ad] = KULLANICILAR[lang][0];
  return (
    <Uygulama lang={lang} aktif="/kullanicilar">
      <DetailTemplate
        breadcrumb={[{ label: s.kullanicilar, href: "#" }, { label: ad }]}
        title={ad}
        subtitle={s.detayAlt}
        actions={
          <>
            <Button>{s.duzenle}</Button>
            <Button variant="danger">{s.sil}</Button>
          </>
        }
        tabs={[
          { key: "genel", label: s.sekmeGenel, href: "#" },
          { key: "siparis", label: s.sekmeSiparis, href: "#" },
          { key: "etkinlik", label: s.sekmeEtkinlik, href: "#" },
        ]}
        activeTab="genel"
        linkComponent={DurmusBaglanti}
        labels={{ ...ortak(s), breadcrumb: s.kunye, tabs: s.sekmeGenel }}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHead>
                <span className="flex items-center gap-3">
                  <Avatar name={ad} size={40} />
                  <span>
                    <p className="text-body font-medium text-ink">{ad}</p>
                    <Label>{s.detayAlt}</Label>
                  </span>
                </span>
              </CardHead>
              <CardBody>
                <Descriptions
                  layout="compact"
                  items={s.kunyeSatir.map((term, i) => ({
                    term,
                    value: s.kunyeDeger[i],
                  }))}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHead>
                <h3 className="text-subhead font-semibold text-ink">{s.etkinlikBaslik}</h3>
              </CardHead>
              {s.etkinlikler.map(([ne, neZaman]) => (
                <ListRow key={ne} size="sm">
                  <span className="min-w-0 flex-1 truncate text-ink">{ne}</span>
                  <Label>{neZaman}</Label>
                </ListRow>
              ))}
            </Card>
          </div>

          <Card>
            <CardHead action={<Button size="sm">{s.disaAktar}</Button>}>
              <h3 className="text-subhead font-semibold text-ink">{s.sonSiparisler}</h3>
            </CardHead>
            <Table>
              <thead>
                <tr>
                  <th className="w-28">{s.thNo}</th>
                  <th>{s.thTarih}</th>
                  <th className="w-36">{s.thDurum}</th>
                  <th className="w-28 text-right">{s.thTutar}</th>
                </tr>
              </thead>
              <tbody>
                {SIPARISLER[lang].slice(0, 6).map(([no, , tarih, , ton, durum, tutar]) => (
                  <tr key={no}>
                    <td className="font-mono text-caption">
                      <a href="#" className="tamga-link">
                        {no}
                      </a>
                    </td>
                    <td className="text-ink-faint">{tarih}</td>
                    <td>
                      <StatusChip label={durum} state={ton as Ton} />
                    </td>
                    <td className="text-right tabular-nums text-ink">{tutar}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </div>
      </DetailTemplate>
    </Uygulama>
  );
}

/* --------------------------------------------------------------- sipariş -- */

export function SiparisListesi({ lang }: { lang: Dil }) {
  const s = S[lang];
  const [sayfa, setSayfa] = useState(1);
  const [boy, setBoy] = useState(25);
  return (
    <Uygulama lang={lang} aktif="/siparisler">
      <ListTemplate
        title={s.siparisler}
        subtitle={s.siparisAlt}
        actions={
          <Button>
            <Icon icon={Download} size="xs" />
            {s.disaAktar}
          </Button>
        }
        filters={
          <>
            <StatusChip label={s.hazirlaniyor} state="caution" />
            <StatusChip label={s.kargoda} state="neutral" />
            <StatusChip label={s.teslim} state="positive" />
            <StatusChip label={s.iptal} state="danger" />
          </>
        }
        empty={<p className="py-10 text-center text-ink-soft">{s.bosSiparis}</p>}
        labels={ortak(s)}
      >
        <CountRow
          count={1284}
          unit={s.siparisBirim}
          aside={
            <p className="text-small text-ink-soft">
              <strong className="tabular-nums text-[var(--color-critical)]">12</strong>{" "}
              {s.bekleyenTutar}
            </p>
          }
          pageSize={boy}
          pageSizeOptions={[25, 50, 100]}
          onPageSize={setBoy}
          labels={{
            format: (n) => n.toLocaleString(lang),
            perPage: s.sayfada,
            records: s.siparisBirim,
          }}
        />
        <Table>
          <thead>
            <tr>
              <th className="w-28">{s.thNo}</th>
              <th>{s.thMusteri}</th>
              <SortHeader direction="desc" className="w-36">
                {s.thTarih}
              </SortHeader>
              <th className="w-20 text-right">{s.thKalem}</th>
              <th className="w-40">{s.thDurum}</th>
              <th className="w-32 text-right">{s.thTutar}</th>
            </tr>
          </thead>
          <tbody>
            {SIPARISLER[lang].map(([no, musteri, tarih, kalem, ton, durum, tutar]) => (
              <tr key={no}>
                <td className="font-mono text-caption">
                  <a href="#" className="tamga-link">
                    {no}
                  </a>
                </td>
                <td>
                  <span className="flex items-center gap-2.5">
                    <Avatar name={musteri} size={24} />
                    <span className="truncate text-ink">{musteri}</span>
                  </span>
                </td>
                <td className="text-ink-faint">{tarih}</td>
                <td className="text-right tabular-nums">{kalem}</td>
                <td>
                  <StatusChip label={durum} state={ton as Ton} />
                </td>
                <td className="text-right font-medium tabular-nums text-ink">{tutar}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="tamga-gutter py-3">
          <Pagination
            page={sayfa}
            pageSize={boy}
            total={1284}
            onChange={setSayfa}
            labels={sayfaMetin(s)}
          />
        </div>
      </ListTemplate>
    </Uygulama>
  );
}

/* ----------------------------------------------------------------- kabuk -- */

/** Aynı kabuk, başka ürün: ray beş giriş, sözlük destek masası. */
export function BaskaUrun({ lang }: { lang: Dil }) {
  const s = S[lang];
  const ton: Record<string, Ton> = { danger: "danger", caution: "caution", neutral: "neutral" };
  return (
    <Uygulama lang={lang} nav={DESTEK(lang)} aktif="/talepler">
      <ListTemplate
        title={s.talepler}
        subtitle={s.talepAlt}
        actions={
          <Button variant="primary">
            <Icon icon={Plus} size="xs" />
            {s.yeniTalep}
          </Button>
        }
        filters={
          <>
            <StatusChip label={s.yuksek} state="danger" />
            <StatusChip label={s.orta} state="caution" />
            <StatusChip label={s.dusuk} state="neutral" />
          </>
        }
        empty={<p className="py-10 text-center text-ink-soft">{s.bosTalep}</p>}
        labels={ortak(s)}
      >
        <CountRow count={38} unit={s.talepBirim} labels={{ records: s.talepBirim }} />
        <Table>
          <thead>
            <tr>
              <th className="w-24">{s.thTalep}</th>
              <th>{s.thKonu}</th>
              <th className="w-44">{s.thMusteriAd}</th>
              <th className="w-28">{s.thOncelik}</th>
              <th className="w-28 text-right">{s.thGuncelleme}</th>
            </tr>
          </thead>
          <tbody>
            {TALEPLER[lang].map(([no, konu, musteri, t, oncelik, guncelleme]) => (
              <tr key={no}>
                <td className="font-mono text-caption">
                  <a href="#" className="tamga-link">
                    {no}
                  </a>
                </td>
                <td className="text-ink">{konu}</td>
                <td className="text-ink-soft">{musteri}</td>
                <td>
                  <StatusChip label={oncelik} state={ton[t] ?? "neutral"} />
                </td>
                <td className="text-right text-ink-faint">{guncelleme}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ListTemplate>
    </Uygulama>
  );
}

/** Anahtar artı görünür metin: `Switch`in `label`ı yalnız erişilebilir ad. */
function AnahtarSatiri({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <span className="flex items-center gap-3">
      <Switch label={label} on={on} onChange={onChange} />
      <span aria-hidden className="text-ink">
        {label}
      </span>
    </span>
  );
}

/* --------------------------------------------------------------- ayarlar -- */

export function Ayarlar({ lang }: { lang: Dil }) {
  const s = S[lang];
  const [ozet, setOzet] = useState(true);
  const [stok, setStok] = useState(false);
  return (
    <Uygulama lang={lang} aktif="/ayarlar">
      <SettingsTemplate
        sections={[
          { key: "profil", label: s.bolumler.profil, href: "#", scope: "personal" },
          { key: "ekip", label: s.bolumler.ekip, href: "#", scope: "workspace" },
          { key: "bildirim", label: s.bolumler.bildirim, href: "#", scope: "mixed" },
          { key: "odeme", label: s.bolumler.odeme, href: "#", scope: "workspace" },
          { key: "kargo", label: s.bolumler.kargo, href: "#", scope: "workspace" },
          { key: "alan", label: s.bolumler.alan, href: "#", scope: "workspace" },
        ]}
        activeSection="bildirim"
        title={s.bolumler.bildirim}
        subtitle={s.bildirimAlt}
        actions={<Button variant="primary">{s.kaydet}</Button>}
        linkComponent={DurmusBaglanti}
        labels={{ ...ortak(s), sections: s.bolumlerAd, scope: { ...s.kapsam } }}
      >
        <SettingsPanel
          title={s.gunlukOzet}
          description={s.gunlukOzetNot}
          inheritedFrom={s.devralindi}
        >
          <div className="flex flex-col gap-4">
            <AnahtarSatiri label={s.epostaAc} on={ozet} onChange={setOzet} />
            <div className="max-w-64">
              <Field label={s.ozetSaati} htmlFor="ay-saat">
                <Input id="ay-saat" full defaultValue="09:00" disabled={!ozet} />
              </Field>
            </div>
          </div>
        </SettingsPanel>

        <SettingsPanel title={s.stokUyarisi} description={s.stokUyarisiNot}>
          <div className="flex flex-col gap-4">
            <AnahtarSatiri label={s.epostaAc} on={stok} onChange={setStok} />
            <div className="max-w-64">
              <Field label={s.esik} htmlFor="ay-esik">
                <Input id="ay-esik" full defaultValue="5" disabled={!stok} />
              </Field>
            </div>
          </div>
        </SettingsPanel>

        <SettingsPanel title={s.yeniSiparis} description={s.yeniSiparisNot}>
          <div className="max-w-96">
            <Field label={s.alici} htmlFor="ay-alici">
              <Input id="ay-alici" full defaultValue="ada@ornek.com, depo@ornek.com" />
            </Field>
          </div>
        </SettingsPanel>
      </SettingsTemplate>
    </Uygulama>
  );
}

export function Sihirbaz({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <Uygulama lang={lang} aktif="/ayarlar">
      <WizardTemplate
        steps={[
          { key: "hesap", label: s.adimlar.hesap },
          { key: "magaza", label: s.adimlar.magaza },
          { key: "odeme", label: s.adimlar.odeme },
        ]}
        activeStep="magaza"
        title={s.sihirbazBaslik}
        subtitle={s.sihirbazAlt}
        back={<Button>{s.geri}</Button>}
        next={<Button variant="primary">{s.ileri}</Button>}
        labels={s.hata}
      >
        <div className="flex flex-col gap-4">
          <Field label={s.magazaAdi} htmlFor="sh-ad" description={s.magazaAdiNot}>
            <Input id="sh-ad" full defaultValue={s.magazaAdiOrnek} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={s.vergiNo} htmlFor="sh-vn">
              <Input id="sh-vn" full defaultValue="1234567890" />
            </Field>
            <Field label={s.vergiDairesi} htmlFor="sh-vd">
              <Input id="sh-vd" full defaultValue="Kadıköy" />
            </Field>
          </div>
          <Field label={s.adres} htmlFor="sh-adres">
            <Textarea id="sh-adres" rows={2} full />
          </Field>
          <div className="max-w-64">
            <Field label={s.parabirimi} htmlFor="sh-pb">
              <Select
                className="w-full"
                options={[...s.parabirimleri]}
                value={s.parabirimleri[0]}
                placeholder={s.secin}
              />
            </Field>
          </div>
        </div>
      </WizardTemplate>
    </Uygulama>
  );
}

/* ---------------------------------------------------------------- oturum -- */

function Saglayicilar({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <AuthProviders dividerLabel={s.yaDa}>
      <Button>
        <Icon icon={GoogleLogo} size="xs" />
        {s.google}
      </Button>
      <Button>
        <Icon icon={GithubLogo} size="xs" />
        {s.github}
      </Button>
    </AuthProviders>
  );
}

export function Giris({ lang }: { lang: Dil }) {
  const s = S[lang];
  const [hatirla, setHatirla] = useState(true);
  return (
    <AuthTemplate
      brand={<Marka />}
      title={s.girisBaslik}
      subtitle={s.girisAlt}
      footer={s.girisFooter}
    >
      <Saglayicilar lang={lang} />
      <form className="flex flex-col gap-4">
        <Field label={s.eposta} htmlFor="gr-eposta">
          <Input id="gr-eposta" full type="email" defaultValue="ada@ornek.com" />
        </Field>
        <Field label={s.parola} htmlFor="gr-parola">
          <PasswordInput labels={{ show: s.goster, hide: s.gizle }} />
        </Field>
        {/* Anahtar DEĞİL onay kutusu: `Switch`in etiketi yalnız erişilebilir
            ad, ekranda metin taşımıyor — formun ortasında adsız bir topuz
            kalıyordu. Bir onay kutusunun etiketi görünür. */}
        <Checkbox label={s.beniHatirla} checked={hatirla} onChange={setHatirla} />
        <Button variant="primary" full type="submit">
          {s.girisYap}
        </Button>
      </form>
    </AuthTemplate>
  );
}

export function Kayit({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <AuthTemplate
      brand={<Marka />}
      title={s.kayitBaslik}
      subtitle={s.kayitAlt}
      footer={s.kayitFooter}
      aside={
        <div className="flex flex-1 flex-col justify-center gap-5 p-10">
          <p className="text-subhead font-semibold text-ink">{s.yanBaslik}</p>
          <ol className="flex flex-col gap-4">
            {s.yanMaddeler.map((m, i) => (
              <li key={m} className="flex items-baseline gap-3">
                <span className="font-mono text-caption text-ink-faint">0{i + 1}</span>
                <span className="text-ink-soft">{m}</span>
              </li>
            ))}
          </ol>
          <p className="text-small text-ink-faint">{s.yanNot}</p>
        </div>
      }
    >
      <Saglayicilar lang={lang} />
      <form className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={s.ad} htmlFor="ky-ad">
            <Input id="ky-ad" full />
          </Field>
          <Field label={s.soyad} htmlFor="ky-soyad">
            <Input id="ky-soyad" full />
          </Field>
        </div>
        <Field label={s.eposta} htmlFor="ky-eposta">
          <Input id="ky-eposta" full type="email" />
        </Field>
        <Field label={s.parola} htmlFor="ky-parola" description={s.parolaNot}>
          <PasswordInput labels={{ show: s.goster, hide: s.gizle }} />
        </Field>
        <Button variant="primary" full type="submit">
          {s.hesapAc}
        </Button>
      </form>
    </AuthTemplate>
  );
}

/* --------------------------------------------------------------- kamusal -- */

export function DurumSayfasi({ lang }: { lang: Dil }) {
  const s = S[lang];
  return (
    <PublicTemplate
      brand={<Marka />}
      title={s.kamusalBaslik}
      subtitle={s.kamusalAlt}
      headerAside={<Button size="sm">{s.aboneOl}</Button>}
      footer={s.kamusalFooter}
      labels={ortak(s)}
    >
      <div className="flex flex-col gap-4">
        <Card>
          <CardHead>
            <span className="flex items-center gap-2">
              <StatusChip label={s.hepsiCalisiyor} state="positive" live />
            </span>
          </CardHead>
          {s.servisler.map(([ad, ton, durum, oran]) => (
            <ListRow key={ad}>
              <span className="min-w-0 flex-1 truncate text-ink">{ad}</span>
              <span className="hidden w-40 sm:block">
                <Sparkline
                  values={[100, 100, 99.9, 100, 99.4, 100, 100]}
                  tone={ton as Ton}
                  height={18}
                />
              </span>
              <span className="w-16 text-right tabular-nums text-ink-faint">
                {oran.toFixed(2)}%
              </span>
              <StatusChip label={durum} state={ton as Ton} />
            </ListRow>
          ))}
        </Card>

        <Card>
          <CardHead>
            <h3 className="text-subhead font-semibold text-ink">{s.gecmis}</h3>
          </CardHead>
          {s.olaylar.map(([tarih, olay, ton, sonuc]) => (
            <ListRow key={olay}>
              <span className="w-28 shrink-0 text-ink-faint">{tarih}</span>
              <span className="min-w-0 flex-1 truncate text-ink">{olay}</span>
              <StatusChip label={sonuc} state={ton as Ton} />
            </ListRow>
          ))}
        </Card>
      </div>
    </PublicTemplate>
  );
}
