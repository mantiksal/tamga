import Link from "next/link";
import { buttonVariants, Icon, Sparkline, StatusChip, type Tone } from "tamga-ui";
import {
  ArrowRight,
  CaretLeft,
  CaretRight,
  Layout,
  Palette,
  Shapes,
  SquaresFour,
  TerminalWindow,
  Translate,
} from "tamga-ui/icons";

/* Hero'nun üç bilgisinin glifleri, `meta` ile AYNI sırada. Kit Phosphor'un
   tamamını da geçiriyor; bunlar kürasyonlu kümede yok ama aynı kapıdan
   geliyor. */
const HERO_GLIF = [SquaresFour, Layout, Translate];

/* Dört sayı kartının glifleri, `sayiKartlari` ile AYNI sırada. */
const SAYI_GLIF = [SquaresFour, Layout, Translate, Shapes];
import { SiteHeader } from "@/components/shell";
import { KomutKopyala } from "@/components/komut";
import { Baslamak } from "@/components/baslamak";
import { CanliOnizleme } from "@/components/canli";
import { navFor } from "@/content/nav";
import { yol } from "@/content/yollar";
import SAYILAR from "@/content/counts.json";
import KAPI_DEMO from "@/content/kapi-demo.json";
import { KapiZinciri } from "@/components/kapilar";
import { Masa } from "@/components/masa";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

/**
 * Tanıtım sayfası — ve bilerek dokümandan AYRI.
 *
 * Bir zamanlar burası dokümanın kabuğunun içindeydi: yanında 81 satırlık bir
 * menü vardı ve "bu nedir" diye gelen birine hiçbir şey anlatmıyordu. Şimdi
 * kendi düzeninde, tam genişlikte, kendi tip ölçeğiyle.
 *
 * DÖRT ZİYARETÇİ VAR ve bu sayfa ikisi için: Ercüment ya da bir müşteri
 * ("nasıl görünüyor"), ve npm'den gelen bir yabancı ("bu ne"). Ekipten biri ve
 * projeye katılan bir freelancer zaten doğrudan dokümana gidiyor — onlara üst
 * şeritteki bağlantı yeter.
 *
 * SAYFA KENDİ KANITI. Buradaki her bileşen `tamga-ui`'den geliyor; ekran
 * görüntüsü, mockup ya da yeniden çizilmiş bir taklit yok. Bir kit tanıtımının
 * kendi kitini kullanmaması, söylediği şeyi çürütür.
 */

/**
 * SAYILAR YAZILMIYOR, SAYILIYOR.
 *
 * Bu sayfa "doksan altı bileşen", "elli yedi sınıf", "altı kapı" diyordu;
 * gerçek sayılar 102, 83 ve 13'tü. Üçü de bir zamanlar doğruydu ve hiçbiri
 * güncellenmedi. Bir tasarım sisteminin ana sayfasındaki yanlış sayı, o
 * sistemin disiplinine dair verebileceği en kötü reklam. `counts.json` her
 * build'de kaynaktan üretiliyor.
 */
const S = SAYILAR;

const T = {
  tr: {
    heroBaslik: "Hesaplar",
    heroSayi: "1.284",
    heroDavet: "Davet et",
    heroSatirlar: [
      ["Ayşe Demir", "Kurumsal", "Aktif", "2 dk"],
      ["Mert Aksoy", "Pro", "Davetli", "dün"],
      ["Zeynep Kaya", "Pro", "Askıda", "3 gün"],
      ["Can Öztürk", "Ücretsiz", "Aktif", "1 sa"],
    ] as const,
    heroAralik: "1–4 / 1.284",
    heroKpi: "Aktif kullanıcı · 30 gün",
    heroKpiDeger: "12.480",
    heroKpiArtis: "+8%",
    heroOnceki: "Önceki sayfa",
    heroSonraki: "Sonraki sayfa",
    canliTitle: "Ekran görüntüsü değil. Kurcala.",
    canliBody:
      "Aşağıdaki panel Tamga'nın bileşenleriyle kuruldu ve gerçekten çalışıyor: menüde gezin, hesapları süz, seç, arşivle. Sonra soldan kendi ürününün adını ve marka rengini gir; bütün panel o an senin markana döner.",
    canli: {
      masa: "Kontrol masası",
      canli: "canlı",
      ad: "Ürününün adı",
      adIpucu: "Menüde, sekmede ve adres çubuğunda.",
      renk: "Marka rengin",
      ozelRenk: "Kendi rengim",
      kutular: [
        { hex: "#1e4fd8", label: "Tamga mavisi" },
        { hex: "#e02938", label: "Kırmızı" },
        { hex: "#0f766e", label: "Zümrüt" },
        { hex: "#7c3aed", label: "Mor" },
        { hex: "#d97706", label: "Kehribar" },
        { hex: "#0a1f3d", label: "Lacivert" },
        { hex: "#db2777", label: "Pembe" },
        { hex: "#65a30d", label: "Yeşil" },
      ],
      kontrast: "Kontrast",
      kontrastIyi: "Düğme yazısı okunuyor.",
      kontrastZayif: "Düğme yazısı bu renkte zorlanıyor.",
      temaMenu: "Tema ve menü",
      acik: "Açık",
      koyu: "Koyu",
      dar: "Dar",
      genis: "Geniş",
      tasi: "Bunu projene taşı",
      sifirla: "Baştan başlat",
      ara: "Panelde ara",
      hesapAra: "Hesap ara",
      profil: "Profil",
      gorunumAyarlari: "Görünüm ayarları",
      cikis: "Çıkış yap",
      genelBakis: "Genel bakış",
      hesaplar: "Hesaplar",
      ayarlar: "Ayarlar",
      yeniHesap: "Yeni hesap",
      kaydet: "Kaydet",
      kpi: [
        ["Aktif kullanıcı", "12.480", "son 30 gün"],
        ["Yeni hesap", "184", "bu hafta"],
        ["Aylık gelir", "₺842K", "+12%"],
      ] as const,
      haftalik: "Haftalık kayıt",
      gunler: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"] as const,
      sonHareketler: "Son hareketler",
      hareketler: [
        ["Ayşe Demir kurumsal plana geçti", "2 dk"],
        ["Mert Aksoy davet edildi", "1 sa"],
        ["Zeynep Kaya askıya alındı", "3 gün"],
        ["Yedekleme tamamlandı", "dün"],
      ] as const,
      durum: "Durum",
      durumlar: ["Tümü", "Aktif", "Davetli", "Askıda"] as const,
      plan: "Plan",
      son: "Son",
      hesap: "Hesap",
      secili: "hesap seçili",
      arsivle: "Arşivle",
      vazgec: "Vazgeç",
      bosSuzgec: "Bu süzgeçle hesap kalmadı.",
      oncekiSayfa: "Önceki sayfa",
      sonrakiSayfa: "Sonraki sayfa",
      sayfaNo: "Sayfa {n}",
      sayfaOzet: "{ilk}–{son} / {toplam}",
      yerel: "tr-TR",
      kayitSonra: "Şu tarihten sonra",
      takvim: {
        previousMonth: "Önceki ay",
        nextMonth: "Sonraki ay",
        open: "Takvimi aç",
        clear: "Tarihi temizle",
      },
      kapat: "Kapat",
      detay: "Hesap detayı",
      gorunum: "Görünüm",
      panelKapsam: "panel",
      urunAdi: "Ürün adı",
      urunAdiNot: "Menüde, sekmede ve adres çubuğunda.",
      markaRengi: "Marka rengi",
      markaRengiNot: "Palet ve iki tema bu tek renkten üretilir.",
      tema: "Tema",
      temaNot: "Sistem",
      kenarMenusu: "Kenar menüsü",
      kenarMenusuNot: "Serbest",
      bildirimler: "Bildirimler",
      bildirimSecenek: ["Yeni hesap açılınca", "Plan değişince", "Haftalık özet"] as const,
      sil: "Sil",
      silBaslik: "Hesabı sil",
      silGovde: "{ad} ve bu hesaba bağlı bütün veriler kalıcı olarak silinecek.",
      silindi: "silindi",
      logo: "Logo",
      logoNot: "Geniş menüde duran tam logo.",
      amblem: "Amblem",
      amblemNot: "Dar menüdeki kare işaret. Yoksa baş harf çizilir.",
      ornegeDon: "Örneğe dön",
      gorsel: {
        name: "Görsel",
        upload: "Yükle",
        replace: "Değiştir",
        remove: "Kaldır",
        empty: "Henüz görsel yok",
        errorType: "Yalnız PNG, JPG ya da SVG.",
        errorSize: "Dosya çok büyük.",
        errorUnreadable: "Dosya okunamadı.",
      },
      hesapMenu: "Hesap menüsü",
      arsivlendi: "hesap arşivlendi",
      kaydedildi: "Yeni hesap oluşturuldu",
      hesapAdi: "Selin Er",
      hesapPosta: "selin",
    },
    markAdi: "Tamga amblemi",
    eyebrow: "Açık kaynak · MIT",
    title: "Yönetim panelleri için açık kaynak tasarım sistemi.",
    lead: "Bir paneli oluşturan tablo, form, filtre gibi bileşenleri ve bunlardan kurulmuş hazır ekranları tek pakette topluyor. Renkleri kendi markanıza göre ayarlayabilir, dokümanı Türkçe ya da İngilizce okuyabilirsiniz.",
    ctaDocs: "Bileşenlere göz at",
    ctaKurulum: "Kurulum",
    ctaRepo: "GitHub",
    headerCta: "Doküman",
    meta: [`${SAYILAR.bilesen} bileşen`, "Hazır ekranlar", "Türkçe ve İngilizce"],

    tokenEyebrow: "Token katmanı",

    whatTitle: "İçinde ne var",
    whatLead: "Bir panelin ihtiyaç duyduğu her parça. Hepsi senin renginde.",

    startTitle: "Üç adım. Beş dakika bile sürmüyor.",
    startBody:
      "Tamga sıradan bir npm paketi. Kur, stilini bağla, ilk bileşeni yaz. Yeni bir proje ya da bir sunucu gerekmiyor; var olan React projen yeterli.",
    gereksinim: ["React 19", "Tailwind v4", "Node 20+"] as const,
    baslamak: {
      adimlar: [
        ["Kur", "tek bir paket"],
        ["Stili bağla", "CSS dosyana üç satır"],
        ["İlk ekranı yaz", "bileşeni içe al, kullan"],
      ] as const,
      dosya2: "src/app/globals.css",
      dosya3: "src/app/page.tsx",
      adres: "localhost:3000",
      bekliyor: "bekliyor",
      calisiyor: "çalışıyor",
      ipucu1: "Paket kuruldu. Stili bağlayınca bileşenler giyinir.",
      ipucu2: "Stil bağlandı. İlk bileşeni yazınca burada görünür.",
      ipucu3: "Kaydet'e bas: senin ilk Tamga ekranın.",
      kaydet: "Kaydet",
      yayinda: "Yayında",
      kaydedildi: "Kaydedildi",
      rehber: "Kurulum rehberi",
      sablon: "Hazır ekranla başla",
    },

    componentsBody:
      "Her bileşenin kendi sayfası var: canlı örnek, kurallar, tipten üretilmiş props tablosu ve ilgili bileşenler. Türkçe ve İngilizce.",

    nameEyebrow: "Adı nereden geliyor",
    nameTitle: "Bir damganın işi, her yüzeyde aynı kalmaktı.",
    nameP1:
      "Tamga, bozkır halklarının hayvana, eşyaya ve taşa vurduğu mühürdü; bir şeyin kime ait olduğunu tek bakışta söylerdi. Kaşgarlı Mahmud, on birinci yüzyılda Oğuz boylarını sayarken yirmi birinin damgasını da çizmişti.",
    nameP2:
      "Bu işaretler süslü olsun diye değil, tanınsın diye çizildi. Kayaya kazınırken de sikkeye basılırken de kendisi kalması gerekiyordu.",
    nameP3:
      "Bir bileşenden beklediğimiz de bu. Hangi üründe, hangi ölçekte kullanılırsa kullanılsın kendisi kalması.",

    live: "Yayında",
    waiting: "Bekliyor",
    quiet: "Sessiz",
    score: "Örnek skor 87 / 100",
    good: "İyi",
    orders: "Sipariş",
    stock: "Stok",
    stockMeta: "48 kalem",
    cardBody: "Gövde, başlıkla aynı yatay ritmi paylaşır.",
    notify: "Bildirimler",

    /* Bölüm etiketleri numaralı: sayfa bir sıra izliyor ve okuyucu nerede
       olduğunu numaradan biliyor. */
    b01: "01 · Canlı önizleme",
    b02: "02 · Bileşenler",
    b03: "03 · Kontroller",
    b04: "04 · Hızlı başlangıç",
    b05: "05 · Adı nereden geliyor",
    sonSurum: `Son sürüm v${SAYILAR.surum}`,
    sayiKartlari: [
      [`${SAYILAR.bilesen}`, "bileşen", "Düğmeden takvime, tablodan diyaloğa."],
      [`${SAYILAR.sablon}`, "hazır ekran şablonu", "Liste, detay, ayarlar, giriş, pano…"],
      [`${SAYILAR.sayfa}`, "sayfa doküman", "Her biri Türkçe ve İngilizce."],
      [`${SAYILAR.ikon}`, "ikon", "Her üründe aynı anlama gelen."],
    ] as const,
    zincirTitle: `Her sürüm yayımlanmadan önce ${SAYILAR.kontrol} kontrolden geçiyor.`,
    zincirBody: `Kontrollerden biri bile takılırsa sürüm npm'e gönderilmiyor. Aşağıdan bir hata seçip kontrolleri çalıştırın, nerede takıldığını görün.`,
    zincir: {
      baslik: "Sürüm öncesi kontroller",
      canlandirma: "canlandırma",
      komut: "$ pnpm verify",
      soru: "Bir hata ekleyin",
      oynat: "Baştan oynat",
      seritAdi: "{n} kontrol, sırayla",
      kosuyor: "{n}. kontrol çalışıyor · {ad}",
      durdu: "{n}. kontrolde takıldı · {kapi}",
      kalan: "Sonraki {n} kontrol hiç çalışmadı.",
      gecti: "Bütün kontroller geçti: sürüm yayımlanabilir.",
      varsayim:
        "Buradaki hatalar kodda yok, burası bir varsayım. Satırlar gerçek: her biri bir kez kasten yapılıp zincir koşturuldu.",
      senaryolar: {
        yok: {
          ad: "Hata yok",
          baslik: `${SAYILAR.kontrol} kontrolün hepsi çalıştı, hiçbiri takılmadı.`,
          sonuc: "",
        },
        fizik: {
          ad: "Gölgeyi kenardan ayır",
          baslik:
            "Gölgenin rengi kenarın rengiyle aynı değil. Hiçbir şey hata vermez, yüzey yalnız ucuz hissettirir ve kimse nedenini bulamaz.",
          sonuc: "Sürüm yayımlanmadı.",
        },
        ceviri: {
          ad: "Bir metni çevirmeden bırak",
          baslik:
            "Bir sözlük anahtarı yalnız bir dilde var. Sayfa açılır, o dili kullanan kişi boş bir yer görür ve kimse hata bildirmez.",
          sonuc: "Sürüm yayımlanmadı.",
        },
        tema: {
          ad: "Koyu temada bir rengi unut",
          baslik:
            "Renk açık temada tanımlı, koyuda değil. Patlamaz: sessizce açık temanın değerine düşer, ve marka gece yarım kalır.",
          sonuc: "Sürüm yayımlanmadı.",
        },
        kontrast: {
          ad: "Okunmayan bir renk seç",
          baslik:
            "Yazı zeminin üstünde 2.17 kontrast veriyor, en az 4.5 olmalı. Bu eşiğin altındaki yazı birçok ekranda okunmuyor.",
          sonuc: "Sürüm yayımlanmadı.",
        },
      },
    },
    kurulumKomutu: "npm install tamga-ui",
    kopyala: "Kopyala",
    kopyalandi: "Kopyalandı",
    onizlemeBaslik: "Siparişler",
    onizlemeCiro: "Ciro",
    onizlemeCiroDeger: "₺48.2K",
    onizlemeSatirlar: [
      ["#1042", "Teslim edildi", "positive"],
      ["#1041", "Hazırlanıyor", "elevated"],
      ["#1040", "İade sürecinde", "caution"],
    ] as [string, string, string][],
    masaBody:
      "Tablodan takvime, diyalogdan bildirime: hepsi aynı fizikle basılıyor, aynı gölgeyle yükseliyor. Masadaki her parça çalışıyor; bir kategoriye gel, o aile öne çıksın.",
    masa: {
      renk: "Rengin",
      renkDegistir: "değiştir",
      kategoriler: [
        "Hepsi",
        "Veri",
        "Form",
        "Eylem",
        "Blok",
        "Grafik",
        "Katman",
        "Geri bildirim",
        "Gezinme",
      ] as const,
      alt: "{n} bileşenin 15'i",
      altVurgu: "bu masada. Hepsi aynı token'lardan, hepsi iki temada.",
      hepsiniGor: "Hepsini gör",
      karo: {
        tabloAdi: "Hesap tablosu",
        hesap: "Hesap",
        durum: "Durum",
        mrr: "Aylık",
        secili: "seçili",
        sirala: "Sırala",
        satirSec: "Satırı seç",
        oncekiAy: "Önceki ay",
        sonrakiAy: "Sonraki ay",
        kaydet: "Kaydet",
        vazgec: "Vazgeç",
        duzenle: "Düzenle",
        sil: "Sil",
        bildirimler: "Bildirimler",
        otomatikYedek: "Otomatik yedek",
        aylik: "Aylık",
        yillik: "Yıllık",
        fatura: "Faturalama",
        ara: "Ara",
        plan: "Plan",
        tarih: "Tarih",
        suzgecYok: "Süzgeç yok · bir alana tıkla",
        tumFiltreler: "Tüm filtreler",
        hepsiniTemizle: "Hepsini temizle",
        temizle: "Temizle",
        uygula: "Uygula",
        eslesmeYok: "Eşleşen yok",
        tumu: "Tümü",
        ac: "seç",
        kaldir: "filtresini kaldır",
        baslangic: "Başlangıç",
        bitis: "Bitiş",
        gelir: "₺842K",
        gelirArtis: "+12%",
        skor: "Sağlık skoru",
        hesabiSil: "Hesabı sil",
        hesabiSilGovde: "Ayşe Demir ve 3 aboneliği kalıcı olarak silinecek.",
        diyalogAc: "Diyaloğu aç",
        kapat: "Kapat",
        bildirimYok: "Kaydet'e bas, bir bildirim düşsün.",
        bildirimBaslik: "Değişiklikler kaydedildi",
        bildirimAlt: "Yeni ayarlar bütün ekibe uygulandı.",
        adimlar: ["Hesap", "Ekip", "Ödeme", "Bitti"] as const,
        devam: "Devam",
        geri: "Geri",
        birak: "Dosyayı buraya bırak",
        secDosya: "bilgisayardan seç",
        ipucu: "PNG, JPG · en çok 4 MB",
        dosyaKaldir: "Kaldır",
        sola: "Sola al",
        saga: "Sağa al",
        kapakEtiketi: "kapak",
        sekmeler: ["Genel", "Ekip", "Faturalar"] as const,
        segment: ["Gün", "Hafta", "Ay"] as const,
        esik: "Eşik",
        artir: "Artır",
        azalt: "Azalt",
        yayinda: "Yayında",
        beklemede: "Beklemede",
        hata: "Hata",
        okunmamis: "okunmamış bildirim",
        proPlan: "Pro plan",
        eylemler: "Eylemler",
        kopyala: "Kopyala",
        arsivle: "Arşivle",
        kopyalandi: "Kopyalandı",
        menuIpucu: "Düğmelerin üstüne gel: menü ve ipucu açılır.",
        durumlar: ["Etkin", "Beklemede", "Askıda"] as const,
        planlar: ["Ücretsiz", "Pro", "Kurumsal"] as const,
      },
    },
    hepsiniGoster: "Hepsini göster",
    footerNote: "MIT lisansı",
    footerBy: "Mantıksal Yazılım A.Ş.",
    footerRepo: "GitHub'da incele",
  },
  en: {
    heroBaslik: "Accounts",
    heroSayi: "1,284",
    heroDavet: "Invite",
    heroSatirlar: [
      ["Ayşe Demir", "Enterprise", "Active", "2 m"],
      ["Mert Aksoy", "Pro", "Invited", "yesterday"],
      ["Zeynep Kaya", "Pro", "Suspended", "3 d"],
      ["Can Öztürk", "Free", "Active", "1 h"],
    ] as const,
    heroAralik: "1–4 of 1,284",
    heroKpi: "Active users · 30 days",
    heroKpiDeger: "12,480",
    heroKpiArtis: "+8%",
    heroOnceki: "Previous page",
    heroSonraki: "Next page",
    canliTitle: "Not a screenshot. Poke at it.",
    canliBody:
      "The panel below is built from Tamga's components and really works: walk the menu, filter the accounts, select them, archive them. Then type your own product name and brand colour on the left; the whole panel turns into your brand.",
    canli: {
      masa: "Control desk",
      canli: "live",
      ad: "Your product's name",
      adIpucu: "In the menu, the tab and the address bar.",
      renk: "Your brand colour",
      ozelRenk: "My own colour",
      kutular: [
        { hex: "#1e4fd8", label: "Tamga blue" },
        { hex: "#e02938", label: "Red" },
        { hex: "#0f766e", label: "Emerald" },
        { hex: "#7c3aed", label: "Purple" },
        { hex: "#d97706", label: "Amber" },
        { hex: "#0a1f3d", label: "Navy" },
        { hex: "#db2777", label: "Pink" },
        { hex: "#65a30d", label: "Green" },
      ],
      kontrast: "Contrast",
      kontrastIyi: "The text on the button is readable.",
      kontrastZayif: "The text on the button struggles at this colour.",
      temaMenu: "Theme and menu",
      acik: "Light",
      koyu: "Dark",
      dar: "Narrow",
      genis: "Wide",
      tasi: "Take this to your project",
      sifirla: "Start over",
      ara: "Search the panel",
      hesapAra: "Search accounts",
      profil: "Profile",
      gorunumAyarlari: "Appearance settings",
      cikis: "Sign out",
      genelBakis: "Overview",
      hesaplar: "Accounts",
      ayarlar: "Settings",
      yeniHesap: "New account",
      kaydet: "Save",
      kpi: [
        ["Active users", "12,480", "last 30 days"],
        ["New accounts", "184", "this week"],
        ["Monthly revenue", "₺842K", "+12%"],
      ] as const,
      haftalik: "Sign-ups this week",
      gunler: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const,
      sonHareketler: "Recent activity",
      hareketler: [
        ["Ayşe Demir moved to Enterprise", "2 m"],
        ["Mert Aksoy was invited", "1 h"],
        ["Zeynep Kaya was suspended", "3 d"],
        ["Backup finished", "yesterday"],
      ] as const,
      durum: "State",
      durumlar: ["All", "Active", "Invited", "Suspended"] as const,
      plan: "Plan",
      son: "Last seen",
      hesap: "Account",
      secili: "accounts selected",
      arsivle: "Archive",
      vazgec: "Cancel",
      bosSuzgec: "No account matches this filter.",
      oncekiSayfa: "Previous page",
      sonrakiSayfa: "Next page",
      sayfaNo: "Page {n}",
      sayfaOzet: "{ilk}–{son} of {toplam}",
      yerel: "en-GB",
      kayitSonra: "Joined after",
      takvim: {
        previousMonth: "Previous month",
        nextMonth: "Next month",
        open: "Open the calendar",
        clear: "Clear the date",
      },
      kapat: "Close",
      detay: "Account detail",
      gorunum: "Appearance",
      panelKapsam: "panel",
      urunAdi: "Product name",
      urunAdiNot: "In the menu, the tab and the address bar.",
      markaRengi: "Brand colour",
      markaRengiNot: "The palette and both themes come from this one colour.",
      tema: "Theme",
      temaNot: "System",
      kenarMenusu: "Sidebar",
      kenarMenusuNot: "Free",
      bildirimler: "Notifications",
      bildirimSecenek: ["When an account is created", "When a plan changes", "Weekly summary"] as const,
      sil: "Delete",
      silBaslik: "Delete the account",
      silGovde: "{ad} and everything attached to this account will be deleted for good.",
      silindi: "deleted",
      logo: "Logo",
      logoNot: "The full logo, on the wide menu.",
      amblem: "Mark",
      amblemNot: "The square sign on the narrow menu. Without it, the initial is drawn.",
      ornegeDon: "Back to the sample",
      gorsel: {
        name: "Image",
        upload: "Upload",
        replace: "Replace",
        remove: "Remove",
        empty: "No image yet",
        errorType: "PNG, JPG or SVG only.",
        errorSize: "The file is too large.",
        errorUnreadable: "The file could not be read.",
      },
      hesapMenu: "Account menu",
      arsivlendi: "accounts archived",
      kaydedildi: "New account created",
      hesapAdi: "Selin Er",
      hesapPosta: "selin",
    },
    markAdi: "The Tamga mark",
    eyebrow: "Open source · MIT",
    title: "An open source design system for admin panels.",
    lead: "It brings the tables, forms and filters a panel is made of, and the ready-made screens built from them, into a single package. You can set the colours to your own brand and read the documentation in Turkish or English.",
    ctaDocs: "Browse the components",
    ctaKurulum: "Start the install",
    ctaRepo: "GitHub",
    headerCta: "Docs",
    meta: [`${SAYILAR.bilesen} components`, "Ready-made screens", "Turkish and English"],

    tokenEyebrow: "The token layer",
    proofNote:
      "None of this is a screenshot. Every button, tag and card comes out of the package, and gets redrawn when the theme changes.",

    whatTitle: "What's inside",
    whatLead: "Every piece a panel needs. All of them in your colour.",

    startTitle: "Three steps. It takes under five minutes.",
    startBody:
      "Tamga is an ordinary npm package. Install it, wire up the stylesheet, write your first component. You do not need a new project or a server; the React project you already have is enough.",
    gereksinim: ["React 19", "Tailwind v4", "Node 20+"] as const,
    baslamak: {
      adimlar: [
        ["Install", "a single package"],
        ["Wire up the style", "three lines in your CSS file"],
        ["Write the first screen", "import a component and use it"],
      ] as const,
      dosya2: "src/app/globals.css",
      dosya3: "src/app/page.tsx",
      adres: "localhost:3000",
      bekliyor: "waiting",
      calisiyor: "running",
      ipucu1: "The package is installed. Wire up the style and the components get dressed.",
      ipucu2: "The style is wired. Write the first component and it shows up here.",
      ipucu3: "Press Save: your first Tamga screen.",
      kaydet: "Save",
      yayinda: "Live",
      kaydedildi: "Saved",
      rehber: "Installation guide",
      sablon: "Start from a screen",
    },

    componentsBody:
      "Every component has its own page: a live example, the rules, a props table generated from the types, and what it relates to. In English and Turkish.",

    nameEyebrow: "Where the name comes from",
    nameTitle: "A tamga had one job: to stay itself on any surface.",
    nameP1:
      "A tamga was the mark steppe peoples burned into livestock, pressed onto goods and cut into stone. It said at a glance whose something was. Writing in the eleventh century, Mahmud al-Kashgari listed the Oghuz tribes and drew twenty-one of their marks.",
    nameP2:
      "These signs were not drawn to be admired. They were drawn to be recognized, and to survive being cut into rock or struck onto a coin.",
    nameP3:
      "That is what we want from a component. Whatever product it lands in and whatever size it runs at, it stays itself.",

    live: "Live",
    waiting: "Waiting",
    quiet: "Quiet",
    score: "Example score 87 / 100",
    good: "Good",
    orders: "Orders",
    stock: "Stock",
    stockMeta: "48 items",
    cardBody: "The body shares the header's horizontal rhythm.",
    notify: "Notifications",

    b01: "01 · Live preview",
    b02: "02 · Components",
    b03: "03 · Release checks",
    b04: "04 · Quick start",
    b05: "05 · Where the name comes from",
    sonSurum: `Latest release v${SAYILAR.surum}`,
    sayiKartlari: [
      [`${SAYILAR.bilesen}`, "components", "From a button to a calendar, a table to a dialog."],
      [`${SAYILAR.sablon}`, "ready-made screens", "List, detail, settings, sign-in, overview…"],
      [`${SAYILAR.sayfa}`, "documentation pages", "Every one of them in Turkish and English."],
      [`${SAYILAR.ikon}`, "icons", "Each meaning the same thing in every product."],
    ] as const,
    zincirTitle: `Every release passes ${SAYILAR.kontrol} checks before it is published.`,
    zincirBody: `If even one check fails, the release is never sent to npm. Pick a mistake below, run the checks, and see where it stops.`,
    zincir: {
      baslik: "Pre-release checks",
      canlandirma: "replay",
      komut: "$ pnpm verify",
      soru: "Introduce a mistake",
      oynat: "Play again",
      seritAdi: "{n} checks, in order",
      kosuyor: "Running check {n} · {ad}",
      durdu: "Stopped at check {n} · {kapi}",
      kalan: "The remaining {n} checks never ran.",
      gecti: "Every check passed: the release can ship.",
      varsayim:
        "None of these mistakes are in the code; this is a what-if. The lines are real: each one was introduced once and the chain was run.",
      senaryolar: {
        yok: {
          ad: "No mistake",
          baslik: `All ${SAYILAR.kontrol} checks ran and none of them stopped.`,
          sonuc: "",
        },
        fizik: {
          ad: "Give the shadow its own colour",
          baslik:
            "The shadow no longer matches the border. Nothing errors; the surface merely starts to feel cheap and nobody can say why.",
          sonuc: "The release did not ship.",
        },
        ceviri: {
          ad: "Leave a string untranslated",
          baslik:
            "A dictionary key exists in one language only. The page still opens, the reader of that language sees a blank, and nobody reports it.",
          sonuc: "The release did not ship.",
        },
        tema: {
          ad: "Forget a colour in dark mode",
          baslik:
            "The colour is defined in light and missing in dark. Nothing breaks: it silently falls back to the light value, and the brand is half-finished at night.",
          sonuc: "The release did not ship.",
        },
        kontrast: {
          ad: "Pick an unreadable colour",
          baslik:
            "The text sits at 2.17 contrast against its ground; 4.5 is the floor. Below that line text is unreadable on many screens.",
          sonuc: "The release did not ship.",
        },
      },
    },
    kurulumKomutu: "npm install tamga-ui",
    kopyala: "Copy",
    kopyalandi: "Copied",
    onizlemeBaslik: "Orders",
    onizlemeCiro: "Revenue",
    onizlemeCiroDeger: "$48.2K",
    onizlemeSatirlar: [
      ["#1042", "Delivered", "positive"],
      ["#1041", "Being prepared", "elevated"],
      ["#1040", "Return in progress", "caution"],
    ] as [string, string, string][],
    masaBody:
      "From a table to a calendar, a dialog to a notification: all of them are pressed with the same physics and lift with the same shadow. Every piece on the board works; hover a category and that family comes forward.",
    masa: {
      renk: "Your colour",
      renkDegistir: "change",
      kategoriler: [
        "All",
        "Data",
        "Form",
        "Action",
        "Block",
        "Chart",
        "Layer",
        "Feedback",
        "Navigation",
      ] as const,
      alt: "15 of {n} components",
      altVurgu: "are on this board. All from the same tokens, all in both themes.",
      hepsiniGor: "See them all",
      karo: {
        tabloAdi: "Account table",
        hesap: "Account",
        durum: "State",
        mrr: "Monthly",
        secili: "selected",
        sirala: "Sort",
        satirSec: "Select row",
        oncekiAy: "Previous month",
        sonrakiAy: "Next month",
        kaydet: "Save",
        vazgec: "Cancel",
        duzenle: "Edit",
        sil: "Delete",
        bildirimler: "Notifications",
        otomatikYedek: "Automatic backup",
        aylik: "Monthly",
        yillik: "Yearly",
        fatura: "Billing",
        ara: "Search",
        plan: "Plan",
        tarih: "Date",
        suzgecYok: "No filter · click a field",
        tumFiltreler: "All filters",
        hepsiniTemizle: "Clear all",
        temizle: "Clear",
        uygula: "Apply",
        eslesmeYok: "No match",
        tumu: "All",
        ac: "select",
        kaldir: "filter, remove",
        baslangic: "Start",
        bitis: "End",
        gelir: "₺842K",
        gelirArtis: "+12%",
        skor: "Health score",
        hesabiSil: "Delete the account",
        hesabiSilGovde: "Ayşe Demir and 3 subscriptions will be deleted for good.",
        diyalogAc: "Open the dialog",
        kapat: "Close",
        bildirimYok: "Press Save and a notification drops in.",
        bildirimBaslik: "Changes saved",
        bildirimAlt: "The new settings apply to the whole team.",
        adimlar: ["Account", "Team", "Payment", "Done"] as const,
        devam: "Continue",
        geri: "Back",
        birak: "Drop the file here",
        secDosya: "or choose from your computer",
        ipucu: "PNG, JPG · 4 MB at most",
        dosyaKaldir: "Remove",
        sola: "Move left",
        saga: "Move right",
        kapakEtiketi: "cover",
        sekmeler: ["General", "Team", "Invoices"] as const,
        segment: ["Day", "Week", "Month"] as const,
        esik: "Threshold",
        artir: "Increase",
        azalt: "Decrease",
        yayinda: "Live",
        beklemede: "Pending",
        hata: "Failed",
        okunmamis: "unread notifications",
        proPlan: "Pro plan",
        eylemler: "Actions",
        kopyala: "Copy",
        arsivle: "Archive",
        kopyalandi: "Copied",
        menuIpucu: "Hover the buttons: the menu and the tooltip open.",
        durumlar: ["Active", "Pending", "Suspended"] as const,
        planlar: ["Free", "Pro", "Enterprise"] as const,
      },
    },
    hepsiniGoster: "Show all",
    footerNote: "MIT licence",
    footerBy: "Mantıksal Yazılım A.Ş.",
    footerRepo: "Browse on GitHub",
  },
};



/**
 * Hero'nun sağındaki canlı önizleme.
 *
 * EKRAN GÖRÜNTÜSÜ DEĞİL, ve bu bütün mesele: bir kit tanıtımının kendi kitini
 * kullanmaması, söylediği şeyi çürütür. Satırlar kitin `StatusChip`i, çizgi
 * kitin `Sparkline`ı, kart kitin kendi yüzeyi.
 *
 * ÜÇ SATIR, VE ÜÇÜ DE AYRI TON: bir liste ekranının asıl işi "hangisi hangi
 * hâlde" sorusunu tek bakışta cevaplamak. Tek tonlu üç satır o işi göstermezdi.
 */
function HeroOnizleme({
  t,
}: {
  t: {
    heroBaslik: string;
    heroSayi: string;
    heroDavet: string;
    heroSatirlar: readonly (readonly [string, string, string, string])[];
    heroAralik: string;
    heroKpi: string;
    heroKpiDeger: string;
    heroKpiArtis: string;
    heroOnceki: string;
    heroSonraki: string;
  };
}) {
  const tonlar: Tone[] = ["positive", "caution", "danger", "positive"];
  return (
    <div className="relative">
      <div className="tamga-card overflow-hidden">
        <div className="tamga-head tamga-gutter flex items-center gap-3 py-3">
          <strong className="flex-1 text-control font-bold text-ink">{t.heroBaslik}</strong>
          <span className="tamga-chip tamga-chip-mono">{t.heroSayi}</span>
          <span className="tamga-btn tamga-btn-primary tamga-btn-sm" aria-hidden>
            {t.heroDavet}
          </span>
        </div>
        <div className="tamga-gutter flex flex-col py-1">
          {t.heroSatirlar.map(([ad, plan, durum, ne], i) => (
            <div
              key={ad}
              className="flex items-center gap-3 border-[var(--color-line)] py-3"
              style={{ borderTopWidth: i === 0 ? 0 : 1, borderTopStyle: "dashed" }}
            >
              {/* KARE AVATAR: tam yuvarlak bu kitte yalnız üç yerde, ve biri
                  avatar değil. */}
              <span className="home-hero-avatar">
                {ad
                  .split(" ")
                  .map((k) => k[0])
                  .join("")}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-body font-semibold text-ink">{ad}</span>
                <span className="text-caption text-ink-faint">{plan}</span>
              </span>
              <StatusChip label={durum} state={tonlar[i] ?? "neutral"} dot />
              <span className="w-12 text-right font-mono text-caption text-ink-faint">{ne}</span>
            </div>
          ))}
        </div>
        <div className="tamga-gutter flex items-center gap-2 border-t border-[var(--color-line)] py-3">
          <span className="tamga-mini-btn" aria-label={t.heroOnceki}>
            <Icon icon={CaretLeft} size="xs" weight="bold" />
          </span>
          <span className="tamga-mini-btn" aria-label={t.heroSonraki}>
            <Icon icon={CaretRight} size="xs" weight="bold" />
          </span>
          <span className="font-mono text-caption text-ink-faint">{t.heroAralik}</span>
        </div>
      </div>

      {/* KPI kartı tablonun sağ alt KÖŞESİNE biniyor, satırların üstüne değil:
          kartın tepesi tablonun ayak şeridiyle aynı hizada. Önce 40 pikseldi ve
          son iki satırın durum çiplerini örtüyordu; listenin asıl bilgisini
          kapatan bir süs, süs değil hata. Dar ekranda binme kalkıyor. */}
      <div
        className="tamga-raised mt-4 flex flex-col gap-1.5 p-4 lg:absolute lg:-right-5 lg:-bottom-20 lg:mt-0 lg:w-56"
        style={{ boxShadow: "6px 6px 0 var(--color-accent)" }}
      >
        <span className="text-caption text-ink-faint">{t.heroKpi}</span>
        <span className="flex items-baseline gap-2">
          <strong className="font-display text-display font-bold text-ink">{t.heroKpiDeger}</strong>
          <StatusChip label={t.heroKpiArtis} state="positive" />
        </span>
        <Sparkline values={[12, 18, 15, 22, 28, 26, 34]} />
      </div>
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = T[lang];

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-band)" }}>
      <SiteHeader
        lang={lang}
        dict={dict}
        duzen="tanitim"
        bolumler={
          <>
            {/* DÖRDÜNÜN İKİSİ SAYFADAN ÇIKIYOR. "Bileşenler" ve "Hızlı
                başlangıç" birer bölüme kaydırmıyor, dokümandaki karşılığını
                açıyor: ana sayfa o ikisini ANLATIYOR, ziyaretçinin oradan
                istediği ise listenin kendisi ve kurulum komutu. Kalan ikisi
                (önizleme, kontroller) sayfanın kendisinde yaşıyor, onların
                dokümanda bir karşılığı yok. */}
            {(
              [
                ["#canli", t.b01],
                [yol(lang, "accordion"), t.b02],
                ["#kontroller", t.b03],
                [yol(lang, "installation"), t.b04],
              ] as const
            ).map(([href, label]) => {
              /* Şeritte yalnız ADI geçiyor, numarası değil: numara sayfadaki
                 sırayı söylüyor, şeritteki bağlantı ise nereye gideceğini. */
              const ad = label.slice(label.indexOf("·") + 2);
              /* DOKÜMANA GİDEN İKİSİ YENİ SEKMEDE: ziyaretçi ana sayfayı
                 okumanın ortasında, ve bu sayfada bıraktığı yer (yazdığı
                 marka rengi, açtığı kart, koştuğu zincir) geri gelince
                 durmuyor · sekme onu olduğu gibi bırakıyor. `Link` değil
                 düz bağlantı: yeni sekmede istemci tarafı gezinme zaten
                 devreye girmiyor. */
              return href.startsWith("#") ? (
                <a key={href} href={href} className="home-bolum-link">
                  {ad}
                </a>
              ) : (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-bolum-link"
                >
                  {ad}
                </a>
              );
            })}
          </>
        }
        cta={
          <Link
            href={yol(lang, "installation")}
            className={`${buttonVariants({ variant: "primary", size: "sm" })} docs-header-cta no-underline`}
          >
            {t.headerCta}
          </Link>
        }
      />

      <main className="mx-auto max-w-(--home-wrap) px-6">
        {/* ── Açılış ───────────────────────────────────────────────────
            EKRANI DOLDURMUYOR. `100vh` bir hero, sayfanın kendisini ilk karenin
            dışına iter, ve bu sayfanın işi bir şey satmak değil GÖSTERMEK:
            sağdaki önizleme kitin kendi bileşenleriyle çizili. */}
        <section className="grid gap-14 pt-16 pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="docs-eyebrow flex items-center gap-2">
              <span aria-hidden className="inline-block size-2" style={{ background: "var(--color-accent)" }} />
              {t.eyebrow}
            </p>
            <h1 className="home-h1 mt-5">{t.title}</h1>
            <p className="home-lead mt-6">{t.lead}</p>
            {/* İKİ DÜĞME, BİR KOMUT SATIRI DEĞİL: kurulum komutu hero'daydı ve
                orada erken · ziyaretçi daha ne kurduğunu bilmiyor. Komut artık
                "04 · Hızlı başlangıç"ta, ilk adımın içinde. */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={yol(lang, "table")} className={`${buttonVariants({ variant: "primary" })} no-underline`}>
                {t.ctaDocs}
                <Icon icon={ArrowRight} size="xs" weight="bold" />
              </Link>
              <Link href={yol(lang, "installation")} className={`${buttonVariants()} no-underline`}>
                <Icon icon={TerminalWindow} size="xs" weight="bold" />
                {t.ctaKurulum}
              </Link>
            </div>

            {/* ÜÇ GERÇEK, ROZET DEĞİL. Bunlar bir durum bildirmiyor
                (`StatusChip` olamazlar) ve bir eylem değiller (düğme
                olamazlar); okunacak üç bilgi, o yüzden en sessiz biçim. */}
            <ul className="home-hero-bilgi">
              {t.meta.map((m, i) => (
                <li key={m}>
                  <Icon icon={HERO_GLIF[i]!} size="sm" weight="duotone" />
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <HeroOnizleme t={t} />
        </section>

        {/* ── 01 · Token katmanı ───────────────────────────────────────
            BÖLÜMÜN İDDİASI KENDİ ÜSTÜNDE DENENİYOR. "Ürün değişir, sistem
            yerinde kalır" cümlesinin altına üç ekran görüntüsü koymak iddiayı
            bir söz olarak bırakırdı. Seçici aynı DOM'u yeniden boyuyor. */}
        
        {/* 01 · CANLI ÖNİZLEME · sayfanın kalbi. Panel `AppShell` ile
            çiziliyor, içindeki her şey kitin bileşeni, rengi ziyaretçinin
            yazdığı hex'ten `makePalette` üretiyor. */}
        <section id="canli" className="home-bolum">
          <p className="home-etiket">{t.b01}</p>
          <h2 className="home-h2 mt-4 max-w-4xl">{t.canliTitle}</h2>
          <p className="home-lead mt-5 max-w-3xl">{t.canliBody}</p>
          <CanliOnizleme labels={t.canli} />
        </section>

        {/* ── 02 · İçinde ne var ───────────────────────────────────────
            ALTI KART, VE HİÇBİRİ BAĞLANTI DEĞİL. Dördünün doküman sayfası var,
            ikisinin (erişilebilirlik, değişiklik günlüğü) yok; dördünü bağlayıp
            ikisini düz bırakmak, bağlantısı olmayan ikisini eksik gösterirdi.
            O yüzden altısı da okunan bir kart ve hiçbiri yükselmiyor. */}
        {/* 02 · BİLEŞENLER. Altı söz kartı buradaydı; yerini masa aldı çünkü
            aynı şeyi ANLATMAK ile GÖSTERMEK arasındaki fark bu sayfanın
            tamamının konusu. Kapı şeridi kaldı: altı sözü derleme anında tutan
            mekanizmanın adı orada, hikâyesi bir alttaki bölümde. */}
        <section id="icinde" className="home-bolum">
          <p className="home-etiket">{t.b02}</p>
          <h2 className="home-h2 mt-4 max-w-4xl">{t.whatLead}</h2>
          <p className="home-lead mt-5">{t.masaBody}</p>

          <Masa
            labels={t.masa}
            bilesen={SAYILAR.bilesen}
            docsHref={yol(lang, "table")}
          />
        </section>

        {/* ── 03 · Kurulum ─────────────────────────────────────────────
            Kod kartı dokümanınkiyle AYNI bileşen: tanıtımda başka bir kod
            bloğu çizmek, iki yerde iki ayrı doğru üretirdi. */}
        {/* 03 · KONTROLLER. Ziyaretçinin sözcüğü "kontrol", deponunki "kapı";
            burada okuyanın sözcüğü geçiyor. Kuralları anlatmıyor, zincirin
            takıldığını gösteriyor: sıra `verify` betiğinden, hata satırları
            gerçekten koşturulmuş dört ihlalin çıktısından geliyor. */}
        <section id="kontroller" className="home-bolum">
          <div className="home-zincir-ust">
            <div>
              <p className="home-etiket">{t.b03}</p>
              <h2 className="home-h2 mt-4 max-w-4xl">{t.zincirTitle}</h2>
              <p className="home-lead mt-5">{t.zincirBody}</p>
            </div>
            <span className="home-surum-etiket">{t.sonSurum}</span>
          </div>

          {/* DÖRT SAYI, hepsi `counts.json`dan: bir bileşen eklendiğinde bu
              kartlar da değişiyor. Elle yazılmış bir sayı ana sayfada en uzun
              yaşayan yalan. */}
          <div className="home-sayilar">
            {t.sayiKartlari.map(([sayi, ad, alt], i) => (
              <div key={ad} className="home-sayi-kart">
                <Icon icon={SAYI_GLIF[i]!} size="lg" weight="duotone" />
                <strong className="home-sayi">{sayi}</strong>
                <span className="home-sayi-ad">{ad}</span>
                <span className="home-sayi-alt">{alt}</span>
              </div>
            ))}
          </div>

          <KapiZinciri
            zincir={SAYILAR.kontroller}
            senaryolar={KAPI_DEMO.senaryolar}
            labels={{
              ...t.zincir,
              /* Kontrol adları içerikte, sözlükte değil: `extract-counts` her
                 build'de hepsinin iki dilde bulunduğunu denetliyor. */
              adlar: Object.fromEntries(
                Object.entries(KAPI_DEMO.adlar).map(([anahtar, ad]) => [anahtar, ad[lang]]),
              ),
            }}
          />
        </section>

        <section id="kurulum" className="home-bolum">
          <div className="home-zincir-ust">
            <div>
              <p className="home-etiket">{t.b04}</p>
              <h2 className="home-h2 mt-4">{t.startTitle}</h2>
              <p className="home-lead mt-5 max-w-3xl">{t.startBody}</p>
            </div>
            {/* ÜÇ GEREKSİNİM BAŞLIKLA AYNI SATIRDA: "ne gerekiyor" sorusu
                adımlardan ÖNCE soruluyor, ve cevabı üç kelime. */}
            <ul className="home-gereksinim">
              {t.gereksinim.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <Baslamak
            labels={t.baslamak}
            dict={dict}
            rehberHref={yol(lang, "installation")}
            sablonHref={yol(lang, "templates")}
          />
        </section>

        {/* ── 04 · Bileşenler ──────────────────────────────────────── */}

        {/* ── 05 · Adı nereden geliyor ─────────────────────────────────
            SAYFANIN SONUNDA, BAŞINDA DEĞİL. Bir ziyaretçinin ilk sorusu "bu ne"
            ve "nasıl kuruyorum"; adın hikâyesi ancak o ikisi cevaplandıktan
            sonra ilgi çekiyor. */}
        <section className="home-bolum grid gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <span className="home-amblem">
            {/* AMBLEM İKİ RENKLİ VE MARKA RENGİNE DÖNMÜYOR: dış halka ile içteki
                sekiz kare ayrı renkte, ve bu işaretin kendisi · seçilen renge
                boyanınca tek renge düşüyor ve Tamga'nın amblemi olmaktan
                çıkıyordu. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tamga-mark-light.svg" alt={t.markAdi} className="w-1/2 dark:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tamga-mark-dark.svg" alt={t.markAdi} className="hidden w-1/2 dark:block" />
          </span>
          <div>
            <p className="home-etiket">{t.b05}</p>
            <h2 className="home-h2 mt-4">{t.nameTitle}</h2>
            <div className="mt-7 flex flex-col gap-5 text-[length:var(--docs-text)] leading-relaxed text-ink-faint">
              <p className="m-0">{t.nameP1}</p>
              <p className="m-0">{t.nameP2}</p>
              {/* SON PARAGRAF MÜREKKEP RENGİNDE: hikâye orada bir KURALA
                  dönüşüyor, ve sayfanın bütün iddiası o cümlede toplanıyor. */}
              <p className="m-0 font-semibold text-ink">{t.nameP3}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-edge)] py-8">
        <div className="mx-auto flex max-w-(--home-wrap) flex-col gap-4 px-6 sm:flex-row sm:items-center">
          <span className="flex items-center gap-3 text-[length:var(--docs-crumb)] text-ink-faint">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tamga-mark-light.svg" alt="" className="h-6 w-auto dark:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tamga-mark-dark.svg" alt="" className="hidden h-6 w-auto dark:block" />
            {t.footerNote} ·{" "}
            <a href="https://mantiksal.com" target="_blank" rel="noopener noreferrer" className="tamga-link">
              {t.footerBy}
            </a>
          </span>
          <span className="flex items-center gap-6 sm:ml-auto sm:gap-5">
            <a
              href="https://github.com/mantiksal/tamga"
              target="_blank"
              rel="noopener noreferrer"
              className="tamga-link text-[length:var(--docs-crumb)]"
            >
              {t.footerRepo}
            </a>
            <a
              href="https://www.npmjs.com/package/tamga-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="tamga-link text-[length:var(--docs-crumb)]"
            >
              npm
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
