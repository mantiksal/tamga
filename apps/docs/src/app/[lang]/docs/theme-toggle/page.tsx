import { ThemeToggle } from "tamga-ui";
import { ThemeToggleIkili, ThemeToggleUclu } from "./uclu";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("theme-toggle")!.title[lang] };
}

/**
 * Sayfa metni, iki dilli.
 *
 * Neden burada ve sözlükte değil: bir doküman paragrafını JSON anahtarına
 * çevirmek onu okunamaz hâle getirir ve yapıyı metinden koparır. Sözlük ARAYÜZ
 * metinleri içindir ("Kopyala", "Önizleme"); sayfa içeriği sayfayla yaşar.
 *
 * İkisi aynı dosyada, çünkü asıl risk çeviri değil AYRIŞMA: Türkçesi
 * güncellenip İngilizcesi unutulursa iki farklı gerçek doğar. Yan yana
 * durduklarında bu unutuş görünür olur.
 *
 * ÖRNEKLERİN İÇİ DE ÇEVRİLİYOR — buton yazıları, yer tutucular, örnek veri.
 * Bir İngilizce sayfada "Kaydet" yazan bir buton, çevrilmemiş bir sayfadan
 * daha kötüdür: sayfa çevrilmiş görünür, ama ekrandaki şey değildir.
 */
const T = {
  tr: {
    toLight: "Açık temaya geç",
    toDark: "Koyu temaya geç",
    light: "Açık tema",
    dark: "Koyu tema",
    system: "Sistem teması",
    lead: "Açık ve koyu arasında geçiş. Tercih tarayıcıda saklanır, yoksa işletim sisteminden okunur.",
    flash: (
      <>
        <strong>Sunucu temayı bilmez.</strong> İlk boyama her zaman açık temayla çıkar ve tercih{" "}
        <code>useEffect</code> içinde uygulanır, yani koyu tema seçmiş biri bir kare boyunca açık
        ekran görür.
      </>
    ),
    fix: (
      <>
        Bunu tamamen çözmenin tek yolu <code>&lt;head&gt;</code>&apos;e engelleyici bir script
        koymak, ve o script&apos;in yeri <strong>kit değil uygulamadır</strong>: kitin bir{" "}
        <code>&lt;head&gt;</code>&apos;i yoktur. <code>storageKey</code> bu yüzden bir prop:
        uygulama aynı anahtarı kendi script&apos;inde de okuyabilsin diye. İki taraf farklı
        anahtar kullanırsa tercih sessizce kaybolur.
      </>
    ),
    rel: (
      <>
        Üst şeritteki komşusu <Xref to="locale-switcher">Locale switcher</Xref>.
      </>
    ),
    twice: (
      <>
        <strong>Bu bileşen iki yerde birden yazılmıştı</strong>: dashboard-v5&apos;te ve bu kitin
        doküman sitesinde, birbirinden habersizce. İkisi de aynı kararları vermek zorunda kaldı.
        Bir mekanizmanın kite ait olduğunun en güçlü kanıtı budur: iki proje onu yeniden icat
        etmişse, o mekanizma ikisinin de altındadır.
      </>
    ),
    variant: (
      <>
        Dört biçim var ve seçim ORANTI meselesi: kontrol, YANINDA DURANA benzemeli.{" "}
        <code>icon</code> (varsayılan) sıkışık bir araç çubuğuna girer: 40×40, tek simge. Ama
        yanında bir dil değiştirici gibi ANAHTAR biçimli bir kontrol varsa, kare düğme onun iki
        katı yüksekliğinde durur ve şerit dengesiz görünür. <code>switch</code> biçimi aynı
        iskeleti kullanıyor: iki uçta birer simge, ortada kayan bir anahtar.{" "}
        <code>select</code> ise komşusu bir SEÇİM KUTUSU olduğunda: dar bir şeritte kutu ile
        anahtar yan yana durunca ikisi iki ayrı dilden konuşuyor, biri kenarlı ve oklu öteki iki
        simge arasında bir topuz. Bu sitenin şeridinde üçünü de görebilirsin: telefonda kutu,
        geniş ekranda anahtar.
      </>
    ),
    ucluH: "Dördüncü biçim üç şey söylüyor, iki değil",
    ucluP: (
      <>
        <code>segmented</code> ötekilerden bir varyant değil, bir KAPSAM farkı: öbür üçü bir
        AÇIK/KOYU ikilisi, bu ise üçüncü bir cevabı da taşıyor · <em>sistem</em>. Ve sistem
        üçüncü bir ton değil, bir seçimin YOKLUĞU: okuyucu &quot;makineye sor&quot; diyor.
        Bir boolean bunu tutamıyor, ve yalnız ikisini sunan bir kontrol, makinenin cevabını
        okuyucunun hiç vermediği bir karara dönüştürüyor · bir kez dokunan kişi sistem
        tercihini sessizce kaybediyor ve şeritten geri alamıyor.
      </>
    ),
    ucluNot: (
      <>
        Bu biçim temayı KENDİ TUTMUYOR. <code>preference</code> ve{" "}
        <code>onPreferenceChange</code> zorunlu: tercihi zaten saklayan bir ürünün yanında ikinci
        bir yazar olmak, iki kaydın birbirini ezmesi demek. Etiketler de üçü birden zorunlu
        (<code>light · dark · system</code>), çünkü üç kare glif yan yana duruyor ve bir ekran
        okuyucu glif okuyamaz.
      </>
    ),
    etiketH: "Eylem sözcüğü ve durum sözcüğü ayrı şeyler",
    etiketP: (
      <>
        <code>icon</code> ve <code>switch</code> basılarak bir şey YAPILIYOR, o yüzden basınca ne
        olacağıyla adlandırılıyorlar: <code>toLight</code> · <code>toDark</code>.{" "}
        <code>select</code> ise o an SEÇİLİ olanı gösteriyor, yani durumla:{" "}
        <code>light</code> · <code>dark</code>. Eylem sözcüklerini kutuda kullanmak, tema zaten
        açıkken kutuda &ldquo;Koyu temaya geç&rdquo; yazması demekti: kontrol kendi tersini
        duyurur. Tip bunu zorunlu tutuyor, yanlış küme geçilemiyor.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
  },
  en: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    light: "Light theme",
    dark: "Dark theme",
    system: "System theme",
    lead: "Switching between light and dark. The preference is kept in the browser, or read from the operating system.",
    flash: (
      <>
        <strong>The server does not know the theme.</strong> The first paint always comes out
        light and the preference is applied inside <code>useEffect</code>, so someone who chose
        dark sees one light frame.
      </>
    ),
    fix: (
      <>
        The only complete fix is a blocking script in <code>&lt;head&gt;</code>, and that script
        belongs to <strong>the application, not the kit</strong>: a kit has no{" "}
        <code>&lt;head&gt;</code>. That is why <code>storageKey</code> is a prop, so the
        application can read the same key in its own script. If the two sides use different keys,
        the preference is lost silently.
      </>
    ),
    rel: (
      <>
        Its neighbour in the top bar is <Xref to="locale-switcher">Locale switcher</Xref>.
      </>
    ),
    twice: (
      <>
        <strong>This component had been written in two places</strong>: in dashboard-v5 and in
        this kit&apos;s own docs site, independently. Both had to make the same decisions. That is
        the strongest evidence a mechanism belongs in the kit: if two projects reinvented it, it
        sits underneath both.
      </>
    ),
    variant: (
      <>
        There are three forms and the choice is about PROPORTION: a control should look like
        whatever stands NEXT to it. There are four. <code>icon</code> (the default) fits a dense toolbar: 40×40,
        one glyph. But next to a switch-shaped control such as a locale switcher, the square
        button stands twice its height and the strip looks unbalanced. The <code>switch</code>{" "}
        form uses the same skeleton: a glyph at each end, a sliding switch between.{" "}
        <code>select</code> is for when the neighbour is a SELECT BOX: on a narrow strip a box
        and a switch side by side speak two different languages, one bordered with a caret, the
        other a knob between two glyphs. This site&apos;s bar shows all three: a box on a phone,
        a switch on a wide screen.
      </>
    ),
    ucluH: "The fourth form says three things, not two",
    ucluP: (
      <>
        <code>segmented</code> is not a variant of the other three but a difference in SCOPE: the
        others are a light/dark pair, this one carries a third answer · <em>system</em>. And
        system is not a third shade, it is the ABSENCE of a choice: the reader is saying
        &quot;ask the machine&quot;. A boolean cannot hold that, and a control offering only two
        turns the machine&apos;s answer into a decision the reader never made · one tap and the
        system preference is silently gone, with no way back from the strip.
      </>
    ),
    ucluNot: (
      <>
        This form does NOT own the theme. <code>preference</code> and{" "}
        <code>onPreferenceChange</code> are required: standing beside a product that already
        stores the preference, a second writer means two records overwriting each other. All
        three labels are required too (<code>light · dark · system</code>), because three square
        glyphs sit side by side and a screen reader cannot read a glyph.
      </>
    ),
    etiketH: "Action words and state words are different things",
    etiketP: (
      <>
        <code>icon</code> and <code>switch</code> are pressed to DO something, so they are named
        by what pressing them does: <code>toLight</code> · <code>toDark</code>.{" "}
        <code>select</code> shows what is currently CHOSEN, so it is named by the state:{" "}
        <code>light</code> · <code>dark</code>. Reusing the action words in the box would put
        &ldquo;Switch to dark theme&rdquo; in it while the theme is already light: the control
        would announce its own opposite. The type enforces this; the wrong set will not
        compile.
      </>
    ),
    rules: "Rules",
    related: "Related",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("theme-toggle")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} code={`<ThemeToggle
  variant="segmented"
  labels={{ light: "${t.light}", dark: "${t.dark}" }}
  preference={tercih}
  onPreferenceChange={setTercih}
/>

<ThemeToggle labels={{ toLight: "…", toDark: "…" }} />`}>
        <ThemeToggleIkili labels={{ light: t.light, dark: t.dark }} />
        <ThemeToggle labels={{ toLight: t.toLight, toDark: t.toDark }} />
      </Demo>

      <P>{t.variant}</P>

      <H2>{t.ucluH}</H2>
      <P>{t.ucluP}</P>
      <Demo
        labels={dict.demo}
        code={`<ThemeToggle
  variant="segmented"
  labels={{ light: "…", dark: "…", system: "…" }}
  preference={tercih}
  onPreferenceChange={setTercih}
/>`}
      >
        <ThemeToggleUclu labels={{ light: t.light, dark: t.dark, system: t.system }} />
      </Demo>
      <Note>{t.ucluNot}</Note>

      <H2>{t.etiketH}</H2>
      <P>{t.etiketP}</P>

      <H2>{t.rules}</H2>
      <Note>{t.flash}</Note>
      <P>{t.fix}</P>
      <Note>{t.twice}</Note>

      <H2>Props</H2>
      <Props of="ThemeToggle" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
