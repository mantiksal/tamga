import { GorunumOrnek } from "./ornek";
import { Icon } from "tamga-ui";
import { BoardView, Contrast, Crop, Image, Palette } from "tamga-ui/icons";
import { Demo } from "@/components/demo";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { sayfaMeta } from "@/content/meta";
import { findPage } from "@/content/nav";

/* ÖRNEK KOD ŞABLONUN KENDİSİNİ GÖSTERİYOR, beş parçayı değil: önizlemede
   duran şey o. Parçaların tek tek kullanımı hemen altındaki kartlarda, ve
   ikisi aynı sayfada iki ayrı cevaba değil aynı cevabın iki katmanına
   bakıyor. */
const KOD = `<AppearanceTemplate
  value={gorunum}
  onChange={setGorunum}
  saved={kayitli}
  onSave={kaydet}
  onReset={geriAl}
  fallbackName="Marka"
  labels={…}
  extra={<LocaleSwitcher locales={diller} current={dil} onChange={setDil} label="Dil" />}
/>`;

/* Beş parça, sıraları ekrandaki sıra değil ÖĞRENME sırası: renk en çok
   sorulan, kesim en az. Her kart kendi props tablosuna gidiyor. */
const PARCALAR = [
  { ad: "ColorSwatches", glif: Palette },
  { ad: "ThemeCards", glif: Contrast },
  { ad: "RailCards", glif: BoardView },
  { ad: "ImageField", glif: Image },
  { ad: "SquarePicker", glif: Crop },
] as const;

/**
 * Sayfa metni, iki dilli. Gerekçe `docs/07-dokuman-sitesi.md`de: bir doküman
 * paragrafını JSON anahtarına çevirmek onu okunamaz yapıyor, ve asıl risk
 * çeviri değil AYRIŞMA.
 */
const T = {
  tr: {
    gorunum: {
      eyebrow: "Panel ayarları",
      title: "Görünüm",
      description: "Panelin logosu, rengi, teması ve menüsü. Bu ayarlar bütün kullanıcıları etkiliyor.",
      logo: {
        title: "Mağaza logosu",
        description: "Geniş rayda ve giriş ekranında duran tam logo.",
        pickMark: "Logodan amblem kes",
        field: {
          name: "Logo",
          upload: "Logo yükle",
          replace: "Değiştir",
          remove: "Kaldır",
          empty: "Henüz logo yok",
          errorType: "Yalnız PNG, JPG ya da SVG.",
          errorSize: "Dosya çok büyük.",
          errorUnreadable: "Dosya okunamadı.",
        },
      },
      mark: {
        title: "Amblem",
        description: "Dar rayda ve sekme simgesinde duran kare işaret.",
        fallbackNote: "Amblem yoksa baş harften bir karo çiziliyor; bu çalışan bir cevap.",
        field: {
          name: "Amblem",
          upload: "Amblem yükle",
          replace: "Değiştir",
          remove: "Kaldır",
          empty: "Henüz amblem yok",
          errorType: "Yalnız PNG, JPG ya da SVG.",
          errorSize: "Dosya çok büyük.",
          errorUnreadable: "Dosya okunamadı.",
        },
      },
      brand: {
        title: "Marka rengi",
        description: "Tek renk. Paletin iki temadaki otuz token'ı bundan üretiliyor.",
        swatches: [
          { hex: "#1e4fd8", label: "Tamga mavisi" },
          { hex: "#0f766e", label: "Zümrüt" },
          { hex: "#9e2a3a", label: "Bordo" },
          { hex: "#b45309", label: "Kehribar" },
          { hex: "#5b21b6", label: "Mor" },
          { hex: "#0a1f3d", label: "Lacivert" },
        ],
        custom: "Kendi rengim",
        customName: "Özel renk",
        preview: "Örnek",
        previewAction: "Yeni sipariş",
        lightNote: "Bu renk açık: üstündeki yazı koyuya dönüyor.",
      },
      theme: {
        title: "Tema",
        description: "Panelin açılış teması. Kullanıcı sonra kendi seçimini yapabiliyor.",
        light: "Açık",
        dark: "Koyu",
        system: "Sistem",
        group: "Tema",
        lightNote: "Gündüz çalışan ekran",
        darkNote: "Karanlık odada göz yormuyor",
        systemNote: "İşletim sistemi ne derse",
      },
      rail: {
        title: "Kenar menüsü",
        description: "Menü ne kadar yer kaplasın.",
        narrow: "Hep dar",
        wide: "Hep geniş",
        free: "Serbest",
        group: "Kenar menüsü",
        narrowNote: "Yalnız simgeler",
        wideNote: "Simge ve ad",
        freeNote: "Tutamak kullanıcıda",
      },
      picker: {
        title: "Amblemi seç",
        hint: "Kareyi sürükle, boyunu ayarla. Kesimi sen yapıyorsun, otomatik değil.",
        size: "Boyut",
        cancel: "Vazgeç",
        confirm: "Bu kareyi kullan",
        close: "Kapat",
      },
      save: "Kaydet",
      saving: "Kaydediliyor",
      reset: "Varsayılana dön",
      clean: "Her şey kayıtlı",
      dirty: "Kaydedilmemiş değişiklik var",
    },
    dil: {
      baslik: "Dil",
      rozet: "ürün ekler",
      aciklama: "Panelin arayüz dili.",
      not: "Kitin AppearanceTemplate'inde dil bölümü yok: şablon yalnız logo, amblem, renk, tema ve menüyü soruyor. Dil LocaleSwitcher ile ürünün kendi ayarı olarak ekleniyor; iki dilde anahtar, üçte liste.",
      markaAdi: "Marka",
      diller: [
        { value: "tr", label: "Türkçe" },
        { value: "en", label: "English" },
      ],
    },
    parcalar: [
      "Hazır renk kutuları + kendi rengin",
      "Üç tema, üç minyatür",
      "Menü genişliği, minyatürle",
      "Logo yükleme alanı",
      "Logodan kare kesim",
    ] as const,
    lead: "Her panelin bir görünüm ayarı oluyor, ve bu ekran kitin içinde geliyor.",
    nedenH: "Neden tek bir ekran, beş parça değil",
    nedenP: (
      <>
        Bu ekran iki üründe ayrı ayrı kuruldu, ve ikincisinde kit bir hex girdisi ile bir
        anahtardan başka bir şey vermediği için çıplak çıktı: renk kutuları yok, tema kelimeydi,
        logo alanı yoktu. Parçaları verip &ldquo;kendin diz&rdquo; demek bunu çözmezdi; her ürün
        başka türlü dizer ve ayrışma geri gelir. Şablon katmanı tam olarak bunun için var
        (ADR-0004).
      </>
    ),
    saklaH: "Hiçbir şey saklamıyor",
    saklaP: (
      <>
        <code>value</code> giriyor, <code>onChange</code> çıkıyor, <code>onSave</code> çağıranın.
        Tercihin nerede yaşadığı (oturum, hesap, tarayıcı) bir ÜRÜN kararı, ve onu öğrenen bir
        şablon şablon olmaktan çıkıyor. Paleti uygulamak da burada değil: seçilen rengi{" "}
        <Xref to="tokens">token</Xref>&apos;a çeviren <code>makePalette</code> ve{" "}
        <code>paletteVars</code>, ve bunu ne zaman yapacağına ürün karar veriyor çünkü kök eleman
        onun.
      </>
    ),
    parcaH: "Parçalar ayrı ayrı da alınabiliyor",
    parcaP: (
      <>
        Ekranın beş bloğu var ama beşi tek başına da kullanılabiliyor:{" "}
        <code>ColorSwatches</code>, <code>ThemeCards</code>, <code>RailCards</code>,{" "}
        <code>ImageField</code> ve <code>SquarePicker</code>. Bir ürünün ayarları farklıysa şablonu hiç almayıp parçaları
        dizmesi meşru; yasak olan şablonu alıp kromunu değiştirmek.
      </>
    ),
    temaH: "Tema üç kelime değil üç resim",
    temaP: (
      <>
        &ldquo;Açık · Koyu · Sistem&rdquo; üç kelimeydi, ve bir tema kelimeyle seçilmiyor:
        kullanıcı sonucu görmek istiyor. Her seçenek panelin minyatürünü çiziyor ve
        &ldquo;Sistem&rdquo; ikisini tek karede yan yana gösteriyor, çünkü anlamı tam olarak bu.
        Minyatürler kitin tek SABİT RENK istisnası: seçenekler o an yürürlükteki temayı değil
        seçilirse ne olacağını gösteriyor, token kullanılsaydı üçü de aynı görünürdü.
      </>
    ),
    rayH: "Kenar çubuğu da öyle",
    rayP: (
      <>
        <code>RailCards</code> aynı soruyu menü için soruyor, ve bir süre üç kelimelik bir{" "}
        <Xref to="segmented">Segmented</Xref> idi: &ldquo;Hep dar · Hep geniş · Kullanıcı
        seçsin&rdquo;. Aynı ekranda temanın resimle, menünün kelimeyle sorulması tutarsızdı · ve
        bir menünün ne kadar yer kaplayacağı okunacak değil görülecek bir şey. Üçüncü seçeneğin
        minyatüründe rayın dibinde bir daraltma düğmesi var, çünkü panelde de orada duruyor.
      </>
    ),
    amblemN: (
      <>
        <strong>Yüklenen bir logodan amblem otomatik çıkarılamaz.</strong> Bir görsel dosyasında
        &ldquo;amblem&rdquo; diye işaretli bir şey yok, konumu sabit değil (solda, üstte, yazının
        içinde ya da hiç yok), ve yanlış kesim sessiz. Yarım bir harf panelin her sayfasının sol
        üstünde durur ve kimse bunun otomatik kesildiğini bilmez. <code>SquarePicker</code> kesimi
        İNSANA yaptırıyor: kare bir çerçeve, sürükleniyor ve boyutlanıyor. Amblem hiç
        yüklenmezse <Xref to="logo-tile">LogoTile</Xref> baş harften bir karo üretiyor, ve bu
        çalışan bir cevap.
      </>
    ),
    propsH: "Props",
  },
  en: {
    gorunum: {
      eyebrow: "Panel settings",
      title: "Appearance",
      description: "The panel's logo, colour, theme and menu. These settings affect every user.",
      logo: {
        title: "Store logo",
        description: "The full logo, on the wide rail and the sign-in screen.",
        pickMark: "Cut a mark from the logo",
        field: {
          name: "Logo",
          upload: "Upload logo",
          replace: "Replace",
          remove: "Remove",
          empty: "No logo yet",
          errorType: "PNG, JPG or SVG only.",
          errorSize: "The file is too large.",
          errorUnreadable: "The file could not be read.",
        },
      },
      mark: {
        title: "Mark",
        description: "The square sign on the narrow rail and the tab icon.",
        fallbackNote: "With no mark, a tile is drawn from the initial; that is a working answer.",
        field: {
          name: "Mark",
          upload: "Upload mark",
          replace: "Replace",
          remove: "Remove",
          empty: "No mark yet",
          errorType: "PNG, JPG or SVG only.",
          errorSize: "The file is too large.",
          errorUnreadable: "The file could not be read.",
        },
      },
      brand: {
        title: "Brand colour",
        description: "One colour. The palette's thirty tokens, in two themes, come from it.",
        swatches: [
          { hex: "#1e4fd8", label: "Tamga blue" },
          { hex: "#0f766e", label: "Emerald" },
          { hex: "#9e2a3a", label: "Burgundy" },
          { hex: "#b45309", label: "Amber" },
          { hex: "#5b21b6", label: "Purple" },
          { hex: "#0a1f3d", label: "Navy" },
        ],
        custom: "My own colour",
        customName: "Custom colour",
        preview: "Preview",
        previewAction: "New order",
        lightNote: "This colour is light: the text on it turns dark.",
      },
      theme: {
        title: "Theme",
        description: "The theme the panel opens with. A user can still choose their own.",
        light: "Light",
        dark: "Dark",
        system: "System",
        group: "Theme",
        lightNote: "A screen that works by day",
        darkNote: "Easy on the eyes in a dark room",
        systemNote: "Whatever the operating system says",
      },
      rail: {
        title: "Sidebar",
        description: "How much room the menu takes.",
        narrow: "Always narrow",
        wide: "Always wide",
        free: "Free",
        group: "Sidebar",
        narrowNote: "Icons only",
        wideNote: "Icon and name",
        freeNote: "The handle is the user's",
      },
      picker: {
        title: "Pick the mark",
        hint: "Drag the square, set its size. You make the cut, not an algorithm.",
        size: "Size",
        cancel: "Cancel",
        confirm: "Use this square",
        close: "Close",
      },
      save: "Save",
      saving: "Saving",
      reset: "Back to default",
      clean: "Everything is saved",
      dirty: "There are unsaved changes",
    },
    dil: {
      baslik: "Language",
      rozet: "product adds",
      aciklama: "The interface language of the panel.",
      not: "The kit's AppearanceTemplate has no language section: it only asks about logo, mark, colour, theme and menu. Language is added with LocaleSwitcher as the product's own setting; a switch for two languages, a list for three.",
      markaAdi: "Brand",
      diller: [
        { value: "tr", label: "Türkçe" },
        { value: "en", label: "English" },
      ],
    },
    parcalar: [
      "Ready swatches + your own colour",
      "Three themes, three miniatures",
      "Menu width, as miniatures",
      "The logo upload field",
      "A square cut from the logo",
    ] as const,
    lead: "Every panel grows an appearance setting, and this one ships inside the kit.",
    nedenH: "Why one screen and not five parts",
    nedenP: (
      <>
        This screen was built twice in two products, and the second came out bare because the kit
        offered nothing but a hex input and a switch: no colour squares, the theme was a word,
        there was no logo field. Handing over the parts and saying &ldquo;arrange them
        yourself&rdquo; would not have fixed it; each product arranges them differently and they
        drift apart again. The pattern layer exists for exactly this (ADR-0004).
      </>
    ),
    saklaH: "It stores nothing",
    saklaP: (
      <>
        <code>value</code> comes in, <code>onChange</code> goes out, <code>onSave</code> belongs
        to the caller. Where the preference lives (session, account, browser) is a PRODUCT
        decision, and a template that learns it stops being a template. Applying the palette is
        not here either: turning the chosen colour into <Xref to="tokens">tokens</Xref> is{" "}
        <code>makePalette</code> plus <code>paletteVars</code>, and the product decides when that
        happens because the root element is its own.
      </>
    ),
    parcaH: "The parts can be taken on their own",
    parcaP: (
      <>
        The screen has five blocks, and all five work alone: <code>ColorSwatches</code>,{" "}
        <code>ThemeCards</code>, <code>RailCards</code>, <code>ImageField</code> and{" "}
        <code>SquarePicker</code>. If a
        product's settings are different, not taking the template and arranging the parts is
        legitimate; what is not allowed is taking the template and changing its chrome.
      </>
    ),
    temaH: "A theme is three pictures, not three words",
    temaP: (
      <>
        &ldquo;Light · Dark · System&rdquo; were three words, and a theme is not chosen with
        words: the person wants to see the result. Each option draws a miniature of the panel, and
        &ldquo;System&rdquo; shows both halves in one frame because that is exactly what it means.
        The miniatures are the kit's one HARDCODED COLOUR exception: the options show what the
        panel would look like if chosen, not the theme currently in force, and with tokens all
        three would look the same.
      </>
    ),
    rayH: "So is the sidebar",
    rayP: (
      <>
        <code>RailCards</code> asks the same question about the menu, and for a while it was a
        three-word <Xref to="segmented">Segmented</Xref>: &ldquo;Always narrow · Always wide ·
        Let the user choose&rdquo;. Asking the theme with pictures and the menu with words on one
        screen was inconsistent, and how much room a menu takes is something you see rather than
        read. The third option's miniature carries a collapse button at the foot of the rail,
        because that is where it sits in the panel.
      </>
    ),
    amblemN: (
      <>
        <strong>A mark cannot be extracted from an uploaded logo.</strong> Nothing in an image
        file is marked as &ldquo;the mark&rdquo;, its position is not fixed (left, on top, inside
        the wordmark, or absent), and a wrong crop is silent. Half a letter then sits in the top
        left of every page and nobody knows it was cropped automatically.{" "}
        <code>SquarePicker</code> gives the cut to a HUMAN: a square frame, dragged and resized.
        With no mark at all, <Xref to="logo-tile">LogoTile</Xref> draws a tile from the initial,
        and that is a working answer.
      </>
    ),
    propsH: "Props",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return sayfaMeta("appearance", lang);
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("appearance")!;
  const t = T[lang];

  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" grid={false} code={KOD}>
        <GorunumOrnek labels={t.gorunum} dil={t.dil} />
      </Demo>

      <H2>{t.nedenH}</H2>
      <P>{t.nedenP}</P>

      <H2>{t.saklaH}</H2>
      <P>{t.saklaP}</P>

      <H2>{t.temaH}</H2>
      <P>{t.temaP}</P>

      <H2>{t.rayH}</H2>
      <P>{t.rayP}</P>
      <Note>{t.amblemN}</Note>

      <H2>{t.parcaH}</H2>
      <P>{t.parcaP}</P>
      {/* KART BİR BAĞLANTI, bir kutu değil: beşi de aynı sayfadaki props
          tablosuna gidiyor, ve okuyan kişi "hangisi neydi" sorusunu tablonun
          başında değil burada cevaplıyor. */}
      <div className="gr-parcalar">
        {PARCALAR.map(({ ad, glif }, i) => (
          <a key={ad} href={`#props-${ad}`} className="home-kart gr-parca">
            <Icon icon={glif} size="md" weight="duotone" />
            <code className="gr-parca-ad">{ad}</code>
            <span className="gr-parca-ne">{t.parcalar[i]}</span>
          </a>
        ))}
      </div>

      <H2>{t.propsH}</H2>
      {(
        [
          "AppearanceTemplate",
          "ColorSwatches",
          "ThemeCards",
          "RailCards",
          "ImageField",
          "SquarePicker",
        ] as const
      ).map(
        (ad) => (
          <div key={ad} id={`props-${ad}`} className="mt-8 scroll-mt-24">
            <h3 className="text-subhead font-semibold text-ink">{ad}</h3>
            <Props of={ad} lang={lang} />
          </div>
        ),
      )}
    </>
  );
}
