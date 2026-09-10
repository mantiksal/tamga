import type { Locale } from "@/i18n/config";
import counts from "@/content/counts.json";

/**
 * Sitenin haritası, veri olarak — ve iki dilli.
 *
 * Neden JSX değil: menü tek kaynaktan gelmezse bir sayfa eklenir ve menüye
 * yazılmayı unutur, ya da tersi. dashboard-v5'in `config/ia.ts`'i tam bu
 * sebeple veri; aynı disiplin.
 *
 * Buradaki `slug` İÇ addır ve çevrilmez: `<Xref to="icons">`, `findPage("icons")`.
 * Okuyucunun gördüğü adres ondan `content/yollar.ts` ile üretiliyor ve kavram
 * sayfalarında çevriliyor (`/tr/docs/ikonlar` · `/en/docs/icons`). Bileşen
 * sayfaları iki dilde de aynı, çünkü başlıkları da aynı: kodda yazılacak şey
 * `<Button>`.
 */

export type DocPage = {
  slug: string;
  title: Record<Locale, string>;
  blurb: Record<Locale, string>;
};

/**
 * Bir BİLEŞEN sayfası. Adı iki dilde de aynı — çünkü ad bileşenin kendisidir.
 *
 * `Checkbox`'ın Türkçesi yok: kodda yazacağın şey `<Checkbox>`. Başlığı "Onay
 * kutusu" diye çevirmek, okuyucunun aradığı kelimeyi menüden silmek olur.
 * Slug'lar için geçerli olan kural (tanımlayıcı çevrilmez) bileşen adları için
 * de geçerli; çevrilen tek şey ne işe yaradığını söyleyen satır.
 *
 * AMA MENÜDE AYRIK YAZILIR: "Score ring", `ScoreRing` değil. Sidebar bir kod
 * bloğu değil, bir menü — ve deve harfi bir menü satırında okumayı yavaşlatır,
 * göz kelime sınırını harf büyüklüğünden çıkarmak zorunda kalır. Sembolün tam
 * hâli sayfanın içinde, örnek kodda duruyor; zaten kopyalanacak yer orası.
 * (dashboard-v5'in Storybook'u da aynısını yapıyor: "Icon button", "Radio group".)
 */
const c = (slug: string, name: string, tr: string, en: string): DocPage => ({
  slug,
  title: { tr: name, en: name },
  blurb: { tr, en },
});

/** Bir KAVRAM sayfası. Bileşen değil, o yüzden adı da çevrilir. */
const k = (slug: string, tr: [string, string], en: [string, string]): DocPage => ({
  slug,
  title: { tr: tr[0], en: en[0] },
  blurb: { tr: tr[1], en: en[1] },
});

/**
 * Menünün BAŞINA sabitlenen üç sayfa.
 *
 * Bunlar bileşen değil; alfabeye karışmaları bir hataydı. "Kurulum" listenin
 * K harfinde, "Physics" P'de duruyordu — yani siteye ilk gelen kişinin ilk
 * ihtiyacı, elli iki bileşenin arasında aranan bir satırdı.
 *
 * Bu bir GRUPLAMA DEĞİL, ve fark önemli: gruplama okuyucuya bir soru sordurur
 * ("Checkbox seçimde mi formda mı?"). Burada soru yok — bu üçü listenin geri
 * kalanıyla aynı türden şey olmadığı için, hangisinin nerede olduğuna karar
 * vermek gerekmiyor. O yüzden başlığı da yok: bir çizgi yeterli.
 *
 * Sıra alfabetik değil OKUMA sırası: önce kur, sonra markanı geçir, sonra
 * fiziği anla.
 */
const START: DocPage[] = [
  k("installation", ["Kurulum", "Üç satırda başla"], ["Installation", "Start in three lines"]),
  k("theme", ["Tema", "Markanın tamamı bir blokta"], ["Theme", "A whole brand in one block"]),
  k("physics", ["Fizik", "Yükselme, basılma, dört yasa"], ["Physics", "Lift, press, four laws"]),
  /* DÖRDÜNCÜ SAYFA BİR KALIP, bileşen değil: kitin parçaları bir EKRANDA nasıl
     bir araya geliyor. Buraya girdi çünkü okuma sırası bozulmuyor — kur,
     markanı geçir, fiziği anla, bir ekran kur — ve alfabetik bileşen
     listesine girseydi bileşen sanılırdı. */
  /* Token referansı Tema'nın hemen ardında: Tema mekanizmayı anlatıyor
     ("adı kitin, değeri ürünün"), bu sayfa adların tam listesini veriyor.
     Ters sıra okuyucuyu 132 satırlık bir listeyle karşılardı. */
  k(
    "tokens",
    /* SAYI ELLE YAZILMIYOR. 132 diye duruyordu, sayfanın kendi sayacı 124
       diyordu: elle yazılan bir sayı ilk token eklendiğinde yalan oluyor ve
       yalanı kimse fark etmiyor. `counts.json` her build'de kaynaktan. */
    ["Token'lar", `${counts.token} ad, iki tema, kaynaktan`],
    ["Tokens", `${counts.token} names, two themes, from source`],
  ),
  /* Kurulum "nasıl kurulur", Tema "nasıl markalanır", Token'lar "adlar ne";
     bu sayfa üçünü bir işe bağlıyor: yeni bir müşteride ne yapıyorsun. */
  k(
    "tailwind",
    ["Tailwind", "Hangi token hangi utility"],
    ["Tailwind", "Which token is which utility"],
  ),
  k(
    "icons",
    ["İkonlar", `${counts.ikon} rol, artı Phosphor'un tamamı`],
    ["Icons", `${counts.ikon} roles, plus all of Phosphor`],
  ),
  k(
    "new-panel",
    ["Yeni panel", "Bir müşteride neyi değiştiriyorsun"],
    ["A new panel", "What you change for a customer"],
  ),
  k(
    "blocks",
    ["Bloklar", "Bileşenden büyük, şablondan küçük"],
    ["Blocks", "Bigger than a component, smaller than a template"],
  ),
  k(
    "templates",
    ["Şablonlar", "Sekiz şablon, on iki ekran"],
    ["Templates", "Eight templates, twelve screens"],
  ),
  k(
    "list-screen",
    ["Liste ekranı", "CRUD'un yedi fiili, tek ekranda"],
    ["List screen", "The seven verbs of CRUD, on one screen"],
  ),
];

/** Başa sabitlenen sayfalar — menü onları alfabeye sokmadan, sırayla basar. */
export const startPages = (): DocPage[] => START;

/**
 * MENÜ ARTIK GRUPLU, ve bu bir fikir değişikliği.
 *
 * Aşağıda "gruplama yok" diye yazılı bir karar var ve gerekçesi doğruydu:
 * gruplama bir varsayım taşır, okuyucunun aradığı şeyin hangi kümede olduğunu
 * bildiği varsayımı. "Checkbox seçim mi form mu?" sorusunun cevabı yalnız
 * listeyi YAZAN için açık.
 *
 * O karar BİLEŞENLER İÇİN hâlâ geçerli: alt liste düz ve alfabetik, tek bir
 * akordeonun içinde. Değişen şey menünün TAMAMI: sayfa sayısı 92'ye çıktı ve
 * bunların 78'i bileşen. Kurulum, Token'lar, Bloklar ve Şablonlar o 78'in
 * arasında kayboluyordu; okuyucu "bu sistemde ne var" sorusunu ancak kaydırarak
 * cevaplayabiliyordu.
 *
 * Yani gruplama bileşenleri BÖLMÜYOR, onları tek bir satıra KATLIYOR. Aradaki
 * fark bu: kimseye "hangi kümede" diye sordurmuyor, yalnız listenin kendisini
 * kapatılabilir yapıyor.
 */
export type NavGrubu = {
  key: string;
  baslik: Record<Locale, string>;
  sayfalar: DocPage[];
  /** Bileşenler grubu tek bir akordeon; ötekiler düz. */
  katlanir?: boolean;
};

const grup = (
  key: string,
  tr: string,
  en: string,
  sayfalar: DocPage[],
  katlanir = false,
): NavGrubu => ({ key, baslik: { tr, en }, sayfalar, katlanir });

const bul = (slug: string) => {
  const p = START.find((x) => x.slug === slug);
  if (!p) throw new Error(`nav: "${slug}" START içinde yok`);
  return p;
};

export function navGruplari(lang: Locale): NavGrubu[] {
  return [
    /* BAŞLANGIÇ: okuma sırası, alfabe değil. Kur, markanı geçir, fiziği anla. */
    grup("baslangic", "Başlangıç", "Getting started", [
      bul("installation"),
      bul("theme"),
      bul("physics"),
    ]),
    /* ÇEKİRDEK: sistemin kendisi. Nord'un "Core"u ile aynı ayrım, ve aynı
       sebeple: bunlar bir kılavuz değil bir ENVANTER. */
    grup("cekirdek", "Çekirdek", "Core", [
      bul("tokens"),
      bul("tailwind"),
      bul("icons"),
      bul("blocks"),
      bul("templates"),
    ]),
    /* KILAVUZ: bir işi baştan sona anlatan sayfalar. */
    grup("kilavuz", "Kılavuz", "Guides", [bul("new-panel"), bul("list-screen")]),
    /* BİLEŞENLER: 78 satır, tek akordeonun içinde, alfabetik. */
    grup("bilesenler", "Bileşenler", "Components", navFor(lang), true),
  ];
}

/**
 * Sayfalar — TEK düz liste, bölüm yok, bileşen başına bir satır.
 *
 * İKİ KARARIN ÜST ÜSTE GELDİĞİ YER BURASI.
 *
 * Birincisi: gruplama yok. Bir zamanlar "temeller" ve "bileşenler" diye iki
 * küme vardı. Gruplama bir varsayım taşır — okuyucunun aradığı şeyin hangi
 * kümede olduğunu bildiği varsayımı. Ama "Checkbox seçim mi form mu?", "Tablo
 * yüzey mi veri mi?" sorusunun cevabı yalnız listeyi YAZAN için açık; okuyan
 * her seferinde iki kümeye de bakıyordu.
 *
 * İkincisi: sayfa başına bir bileşen. Öncesinde bir "Form" sayfası vardı ve
 * içinde Input · Textarea · Field · Select otururdu. Dördü ayrı bileşen; ortak
 * yanları yalnız aynı formda kullanılmaları. `Textarea`'yı arayan kişi menüde
 * onu göremiyor, "Form"a girip sayfanın ortasını bulmak zorunda kalıyordu.
 * dashboard-v5'in Storybook'u aynı ayrımı yapıyor: her bileşen kendi satırı.
 *
 * SINIR: ayrı sayfa = ayrı bileşen. Aynı bileşenin VARYANTI sayfayı bölmez —
 * `Button`'ın altı varyantı, `StatusChip`'in dört rolü, `Skeleton`'ın hazır
 * kalıpları tek sayfada kalır. Bölünen şey ad, ayarlanan şey prop.
 *
 * Kaynak sırası alfabetik; kaynağı okuyanın bir sayfayı ararken `navFor`'u
 * zihninde çalıştırması gerekmesin diye.
 */
const PAGES: DocPage[] = [
  c("alert", "Alert", "Sayfada duran uyarı", "A warning that stays on the page"),
  c("avatar", "Avatar", "Baş harfler ya da görsel", "Initials, or an image"),
  c("avatar-stack", "Avatar stack", "Üst üste binen ekip", "A team, overlapping"),
  c("beacon", "Beacon", "Nabzın çıplak hâli", "The pulse, with nothing on it"),
  c("breadcrumb", "Breadcrumb", "Neredesin", "Where you are"),
  c("button", "Button", "Sayfada tek dolu buton", "One filled button per page"),
  c("card", "Card", "Kitin tek yükseltilmiş yüzeyi", "The kit's one raised surface"),
  c("checkbox", "Checkbox", "İşaretlendiğinde dolar", "It fills when checked"),
  c("combobox", "Combobox", "Uzun listede arayarak seçim", "Search to pick from a long list"),
  c("date-picker", "Date picker", "Yıl-ay-gün; saat yok", "Year-month-day; no clock"),
  c("dialog", "Dialog", "Bir karar ister", "It asks for a decision"),
  c("dot", "Dot", "Bir satır yüksekliğinde durum", "State, one row tall"),
  c("dropdown-menu", "Dropdown menu", "Tetikleyiciye yapışan eylem listesi", "An action list stuck to its trigger"),
  c("empty-blank", "Empty blank", "İçinde hiçbir şey olmayan gövde", "A body with nothing in it"),
  c("empty-note", "Empty note", "İçinde hiçbir şey olmayan satır", "A row with nothing in it"),
  c("empty-state", "Empty state", "İçinde hiçbir şey olmayan yüzey", "A surface with nothing on it"),
  c("empty-tile", "Empty tile", "Sunduğun bir seçim", "A choice you are offering"),
  c("error-state", "Error state", "code · request_id", "code · request_id"),
  c("field", "Field", "Etiket, açıklama, hata", "Label, description, error"),
  c("file-upload", "File upload", "Görseller, ve sıraları", "Images, and their order"),
  c("icon-button", "Icon button", "Metinsiz kontrol; adı şart", "A control with no text; a name is required"),
  c("input", "Input", "Tek satır", "A single line"),
  c("label", "Label", "Bir şeyi niteler, adlandırmaz", "It qualifies a thing; it does not name one"),
  c("live-scope", "Live scope", "Ekranda tek nabız", "One pulse per screen"),
  c("mini-button", "Mini button", "Satır içi en küçük kontrol", "The smallest inline control"),
  c("number-input", "Number input", "Fiyat, stok, ağırlık", "Price, stock, weight"),
  c("pagination", "Pagination", "Zor kısmı aritmetiği", "The hard part is the arithmetic"),
  c("popover", "Popover", "Akışı kesmeyen küçük bir iş", "A small job that does not break the flow"),
  c("progress", "Progress", "Ne kadar kaldığını söyler", "It says how much is left"),
  c("radio-group", "Radio group", "Üç seçenekten biri", "One out of three"),
  c("says-bubble", "Says bubble", "Çizim bir cümle söylediğinde", "When the drawing says a line"),
  c("score-matrix", "Score matrix", "Skorun kare ızgara hâli", "The score as a square grid"),
  c("score-meter", "Score meter", "Skorun yatık hâli", "The score, laid flat"),
  c("score-ring", "Score ring", "0-100 arası bir okuma", "A reading from 0 to 100"),
  c("section-head", "Section head", "Başlık, meta, sağdaki eylem", "Title, meta, the action at the right"),
  c("segmented", "Segmented", "Akranlar arası seçim", "A choice among peers"),
  c("select", "Select", "Sabit ve kısa bir küme", "A fixed, short set"),
  c("selection-bar", "Selection bar", "Seçili satırlarla ne yapılır", "What to do with the selected rows"),
  c("separator", "Separator", "Gruplama; dekorasyon değil", "Grouping; not decoration"),
  c("sheet", "Sheet", "Yandan girer, bilgi verir", "It enters from the side and informs"),
  c("skeleton", "Skeleton", "Ne geleceğini söyler", "It says what is coming"),
  c("sort-header", "Sort header", "Yön oku yalnız sıralı sütunda", "The arrow only on the sorted column"),
  c("sparkline", "Sparkline", "Eksensiz; tek soru: yön ne", "No axes; one question: which way"),
  c("spinner", "Spinner", "Bir şeyin sürdüğünü söyler", "It says something is taking time"),
  c("status-chip", "Status chip", "Durumu bir kelimeyle söyle", "Say the state in one word"),
  c("switch", "Switch", "Açık mı, kapalı mı", "On, or off"),
  c("table", "Table", "Taşmayı kendi içinde çözer", "It solves overflow inside itself"),
  c("tabs", "Tabs", "Alt çizgi; kutu değil", "An underline; not a box"),
  c("textarea", "Textarea", "Çok satır", "Many lines"),
  c("timeline-strip", "Timeline strip", "Kova başına bir işaret", "One mark per bucket"),
  c("toast", "Toast", "Gelir ve gider", "It comes, and it goes"),
  c("tooltip", "Tooltip", "Ek bilgi; gerekli bilgi değil", "Extra information; never required information"),
  c("accordion", "Accordion", "Açılıp kapanan bölümler", "Sections that open and close"),
  c("badge", "Badge", "Bir köşedeki sayı", "A number in a corner"),
  c("code", "Code", "Kopyalanmak için yazılmış", "Written to be copied"),
  c("descriptions", "Descriptions", "Anahtar ve değer", "A term and its value"),
  c("kbd", "Kbd", "Basılacak tuş", "The key to press"),
  c("kpi", "Kpi", "Tek bir sayı, büyük", "One number, large"),
  c("line-chart", "Line chart", "Eksenli, değer okutan", "With axes; it lets you read the value"),
  c("pie-chart", "Pie chart", "Parça-bütün, en çok beş dilim", "Part to whole, five slices at most"),
  c("bar-chart", "Bar chart", "Sıralama ve karşılaştırma", "Ranking and comparison"),
  c("link", "Link", "Gezinir; buton gezinmez", "It navigates; a button does not"),
  c("list-row", "List row", "Tabloya yetmeyen liste", "A list that is not a table"),
  c("locale-switcher", "Locale switcher", "İki dilde anahtar, üçte liste", "A switch for two, a list for three"),
  c("log-view", "Log view", "Akan satırlar, seni fırlatmadan", "Streaming lines that do not throw you"),
  c("logo-tile", "Logo tile", "Markanın kare kutusu", "A brand in a square"),
  c("multi-select", "Multi select", "Çoklu seçim; liste kapanmaz", "Many at once; the list stays open"),
  c("tree-select", "Tree select", "Ağaçtan çoklu seçim", "Many at once, from a tree"),
  c("page-band", "Page band", "Her ekranın tepesi", "The top of every screen"),
  c("password-input", "Password input", "Göster, çünkü yazdığını göremezsin", "Reveal it, because you cannot see what you typed"),
  c("rich-text", "Rich text", "Biçimlendirilebilir metin; düğmeleri ürün seçer", "Formatted text; the product picks the buttons"),
  c("rail-link", "Rail link", "İkon raylı gezinme", "Icon rail navigation"),
  c("rise", "Rise", "Aşağıdan giren blok", "A block that enters from below"),
  c("schedule-input", "Schedule input", "Cron değil, kürasyonlu aralık", "Not cron; a curated interval"),
  c("scroll-x", "Scroll x", "Klavyeyle de kayan taşma", "Overflow that a keyboard can scroll too"),
  c("secret-field", "Secret field", "Maskeli, okunur, kopyalanır", "Masked, read, copied"),
  c("slider", "Slider", "Değer her zaman görünür", "The value is always visible"),
  c("steps", "Steps", "Kaçıncı adım, kaç kaldı", "Which step, how many left"),
  c("surface", "Surface", "Kenarı var, yükselmiyor", "It has an edge; it does not lift"),
  c("swap", "Swap", "İki durum, tek hücre", "Two states, one cell"),
  c("tags-input", "Tags input", "Enter kapatır, Backspace siler", "Enter commits, Backspace removes"),
  c("theme-toggle", "Theme toggle", "Açık ve koyu", "Light and dark"),
];

/**
 * Menü, okuyucunun DİLİNDE sıralanmış.
 *
 * Bileşen adları iki dilde de aynı olduğu için sıra çoğunlukla değişmiyor —
 * ama tamamen değil: Türkçe'de Ç harfi C'den, İ harfi I'dan sonra gelir, ve
 * kavram sayfalarının adı gerçekten çevrilir ("Kurulum" listenin ortasında,
 * "Installation" başlarında).
 *
 * `localeCompare`'e yerel VERİLİYOR — argümansız çağrı koşan makinenin
 * yerelini kullanır, yani sunucuda üretilen sıra ile tarayıcıda beklenen sıra
 * ayrışabilir. Sıra sayfanın DİLİNİN kuralı, makinenin değil.
 */
export function navFor(lang: Locale): DocPage[] {
  return [...PAGES].sort((a, b) => a.title[lang].localeCompare(b.title[lang], lang));
}

export const ALL_PAGES = [...START, ...PAGES];

export function findPage(slug: string): DocPage | undefined {
  return ALL_PAGES.find((x) => x.slug === slug);
}
