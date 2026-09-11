import Link from "next/link";
import {
  Button,
  StatusChip,
  ScoreRing,
  Dot,
  Kpi,
  Sparkline,
  Switch,
  Card,
  CardHead,
  CardBody,
  Label,
  buttonVariants,
} from "tamga-ui";
import { SiteHeader } from "@/components/shell";
import { CodeDemo } from "@/components/interactive";
import { TokenKatmani } from "./token-katmani";
import { navFor } from "@/content/nav";
import { yol } from "@/content/yollar";
import SAYILAR from "@/content/counts.json";
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
    eyebrow: "Mantıksal'ın tasarım sistemi",
    title: "Panellerimizi bu sistemle kuruyoruz.",
    lead: "Tamga, arayüzlerimizi kurarken kullandığımız bileşen, token ve kural seti. Kendi ürünlerimiz için yazıldı, sonra herkese açıldı.",
    ctaDocs: "Dokümana git",
    ctaRepo: "GitHub",
    headerCta: "Doküman",
    meta: ["React 19", "MIT lisansı", "Türkçe ve İngilizce belge"],

    tokenEyebrow: "Token katmanı",
    tokenTitle: "Ürün değişir, sistem yerinde kalır.",
    tokenBody:
      "Boşluk, ölçek ve davranış her üründe sabit. Değişen sadece token dosyası: renk ve yazı ailesi. Aşağıdan bir ürün türü seçin, aynı bileşenlerin nasıl döndüğünü görün.",
    tokenGroup: "Ürün türü",
    proofNote: "Yukarıdakiler ekran görüntüsü değil. Hepsi pakete ait, canlı bileşenler.",

    whatTitle: "İçinde ne var",
    whatLead: "Kütüphaneler kod gönderir. Tamga kuralı da gönderiyor.",
    whatItems: [
      ["Token'lar", `Renk, tipografi, boşluk ve süre tek dosyada tanımlı. Bileşenler kendi değerlerini uydurmuyor, buradan okuyor: ${S.token} token, ${S.sinif} sınıf.`],
      [`Bileşenler`, `Her bileşenin kendi sayfası var: çalışan örnek, ne zaman kullanılacağı ve tipinden üretilmiş props tablosu. ${S.bilesen} bileşen, ${S.sayfa} sayfa.`],
      ["Desenler", "Form düzeni, doğrulama, boş durum, onay isteme. Bileşenlerin bir arada nasıl davrandığını anlatan katman."],
      ["Temalar", "Her marka bir token bloğu. Yeni bir marka eklemek için kod dalı açılmıyor, dosya yazılıyor."],
      ["Erişilebilirlik", "Klavye gezinmesi, görünür odak ve kontrast eşiği bileşenin kabul kriteri. Sonradan eklenen bir katman değil."],
      ["Değişiklik günlüğü", "Her sürümde neyin değiştiği ve kırıcı değişikliklerde nasıl geçileceği yazılı duruyor."],
    ],
    gatesNote: `${S.kapi} kapı bunları derleme anında denetliyor: ürün adı sızarsa, ölçek dışına çıkılırsa, bir prop belgelenmeden kalırsa ya da bir renk okunmazsa build duruyor.`,

    startTitle: "Üç satırda başla",
    startBody: "Sistem sıradan bir npm paketi olarak geliyor. React 19 bir peer dependency, yani kendi React'ini getirmiyor.",
    startCta: "Kurulumun tamamı",

    componentsTitle: `${S.bilesen} bileşen, ${S.sayfa} sayfa`,
    componentsBody:
      "Her bileşenin kendi sayfası var: canlı örnek, kurallar, tipten üretilmiş props tablosu ve ilgili bileşenler. Türkçe ve İngilizce.",
    componentsCta: "Hepsini gör",

    nameEyebrow: "Adı nereden geliyor",
    nameTitle: "Bir damganın işi, her yüzeyde aynı kalmaktı.",
    nameP1: "Tamga, bozkır halklarının hayvana, eşyaya ve taşa vurduğu mühürdü; bir şeyin kime ait olduğunu tek bakışta söylerdi. Kaşgarlı Mahmud, on birinci yüzyılda Oğuz boylarını sayarken yirmi birinin damgasını da çizmişti.",
    nameP2: "Bu işaretler süslü olsun diye değil, tanınsın diye çizildi. Kayaya kazınırken de sikkeye basılırken de kendisi kalması gerekiyordu.",
    nameP3: "Bir bileşenden beklediğimiz de bu. Hangi üründe, hangi ölçekte kullanılırsa kullanılsın kendisi kalması.",

    save: "Kaydet",
    cancel: "Vazgeç",
    delete: "Sil",
    live: "Yayında",
    waiting: "Bekliyor",
    quiet: "Sessiz",
    score: "Örnek skor 87 / 100",
    good: "İyi",
    orders: "Sipariş",
    stock: "Stok",
    stockMeta: "48 kalem",
    edit: "Düzenle",
    cardBody: "Gövde, başlıkla aynı yatay ritmi paylaşır.",
    notify: "Bildirimler",

    footerNote: "MIT lisansı",
    footerBy: "Mantıksal Yazılım A.Ş.",
    footerRepo: "GitHub'da incele",
  },
  en: {
    eyebrow: "A design system by Mantıksal",
    title: "The system our own interfaces are built on.",
    lead: "Tamga is the set of components, tokens and rules we use to build our own products. We wrote it for ourselves, then opened it up.",
    ctaDocs: "Read the docs",
    ctaRepo: "GitHub",
    headerCta: "Docs",
    meta: ["React 19", "MIT license", "Docs in English and Turkish"],

    tokenEyebrow: "The token layer",
    tokenTitle: "The product changes. The system does not.",
    tokenBody:
      "Spacing, scale and behavior hold steady across every product. The only thing that changes is the token file: color and typeface. Pick a product below and watch the same components come out different.",
    tokenGroup: "Product type",
    proofNote: "None of this is a screenshot. Every button, tag and card comes out of the package, and gets redrawn when the theme changes.",

    whatTitle: "What's inside",
    whatLead: "Libraries ship code. Tamga ships the rules too.",
    whatItems: [
      ["Tokens", `Color, type, spacing and duration live in one file. Components read from it instead of inventing their own values: ${S.token} tokens, ${S.sinif} classes.`],
      ["Components", `Each one has its own page: a working example, when to reach for it, and a props table generated from the types. ${S.bilesen} components, ${S.sayfa} pages.`],
      ["Patterns", "Form layout, validation, empty states, asking for confirmation. The layer that says how components behave together."],
      ["Themes", "A brand is a token file. Adding one takes a file, not a branch."],
      ["Accessibility", "Keyboard navigation, visible focus and contrast are acceptance criteria, not a pass we make later."],
      ["Changelog", "What changed in every release, and how to move across a breaking one."],
    ],
    gatesNote: `${S.kapi} gates enforce this at build time: if a product name leaks, if something goes off scale, if a prop is left undocumented or if a colour fails contrast, the build stops.`,

    startTitle: "Start in three lines",
    startBody: "The system arrives as an ordinary npm package. React 19 is a peer dependency, so it does not bring its own.",
    startCta: "Full installation",

    componentsTitle: `${S.bilesen} components, ${S.sayfa} pages`,
    componentsBody:
      "Every component has its own page: a live example, the rules, a props table generated from the types, and what it relates to. In English and Turkish.",
    componentsCta: "See them all",

    nameEyebrow: "Where the name comes from",
    nameTitle: "A tamga had one job: to stay itself on any surface.",
    nameP1: "A tamga was the mark steppe peoples burned into livestock, pressed onto goods and cut into stone. It said at a glance whose something was. Writing in the eleventh century, Mahmud al-Kashgari listed the Oghuz tribes and drew twenty-one of their marks.",
    nameP2: "These signs were not drawn to be admired. They were drawn to be recognized, and to survive being cut into rock or struck onto a coin.",
    nameP3: "That is what we want from a component. Whatever product it lands in and whatever size it runs at, it stays itself.",

    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    live: "Live",
    waiting: "Waiting",
    quiet: "Quiet",
    score: "Example score 87 / 100",
    good: "Good",
    orders: "Orders",
    stock: "Stock",
    stockMeta: "48 items",
    edit: "Edit",
    cardBody: "The body shares the header's horizontal rhythm.",
    notify: "Notifications",

    footerNote: "MIT licence",
    footerBy: "Mantıksal Yazılım A.Ş.",
    footerRepo: "Browse on GitHub",
  },
};

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = T[lang];

  return (
    <div className="min-h-dvh bg-page text-ink-soft">
      <SiteHeader
        lang={lang}
        dict={dict}
        cta={
          <Link
            href={yol(lang, "installation")}
            className={`${buttonVariants({ size: "sm" })} no-underline`}
          >
            {t.headerCta}
          </Link>
        }
      />

      <main className="mx-auto max-w-(--home-wrap) px-5 sm:px-7">
        {/* ── Hero ─────────────────────────────────────────────────────
            Ekranı doldurmuyor. `100vh` bir hero, sayfanın kendisini ilk
            karenin dışına iter — ve bu sayfanın işi bir şey satmak değil,
            bir şey GÖSTERMEK. */}
        <section className="pt-20 pb-16">
          <p className="docs-eyebrow">{t.eyebrow}</p>
          <h1 className="home-h1 mt-5">{t.title}</h1>
          <p className="home-lead mt-6">{t.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={yol(lang, "installation")}
              className={`${buttonVariants({ variant: "primary" })} no-underline`}
            >
              {t.ctaDocs}
            </Link>
            <a
              href="https://github.com/mantiksal/tamga"
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonVariants()} no-underline`}
            >
              {t.ctaRepo}
            </a>
          </div>

          {/* ÜÇ GERÇEK, ROZET DEĞİL. Bunlar bir durum bildirmiyor (`StatusChip`
              olamazlar) ve bir eylem değiller (düğme olamazlar); okunacak üç
              bilgi. O yüzden en sessiz biçim: ince dikey kurallarla ayrılmış
              bir satır. Bir kutuya alsaydık üç bilgi, altındaki canlı
              bileşenlerle aynı ağırlığa çıkardı. */}
          {/* AYIRAÇLAR DAR EKRANDA YOK.
              Kural çizgisi her öğenin ÖNÜNE giriyor (ilki hariç), ve liste
              sarınca ikinci satır bir çizgiyle başlıyordu: havada asılı, neyi
              neyden ayırdığı belirsiz bir işaret. Telefonda boşluk zaten
              ayırmaya yetiyor; çizgi, üçü tek satıra sığdığı yerde anlamlı. */}
          <ul className="mt-8 flex list-none flex-wrap items-center gap-x-5 gap-y-2 p-0 text-[length:var(--docs-small)] text-ink-faint sm:gap-x-4">
            {t.meta.map((m, i) => (
              <li key={m} className="flex items-center gap-4">
                {i > 0 && (
                  <span aria-hidden className="hidden h-3.5 w-px bg-[var(--color-line)] sm:block" />
                )}
                {m}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Token katmanı ───────────────────────────────────────────
            BÖLÜMÜN İDDİASI KENDİ ÜSTÜNDE DENENİYOR. "Ürün değişir, sistem
            yerinde kalır" cümlesinin altına üç ekran görüntüsü koymak, iddiayı
            bir söz olarak bırakırdı. Seçici aynı DOM'u yeniden boyuyor:
            bileşenler yeniden kurulmuyor bile, değişen tek şey kabın üstündeki
            simge sözlüğü. Kanıt, cümlenin kendisi kadar yer kaplıyor. */}
        <section id="sistem" className="pb-16">
          <p className="docs-eyebrow">{t.tokenEyebrow}</p>
          <h2 className="home-h2 mt-5">{t.tokenTitle}</h2>
          <p className="mt-5 max-w-2xl text-[length:var(--docs-text)] leading-relaxed text-ink-soft">
            {t.tokenBody}
          </p>

          <div className="mt-9">
          <TokenKatmani lang={lang} labels={{ group: t.tokenGroup }}>
          <div className="tamga-card docs-grid grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col gap-6">
              <span className="flex flex-wrap items-center gap-3">
                <Button variant="primary">{t.save}</Button>
                <Button>{t.cancel}</Button>
                <Button variant="danger">{t.delete}</Button>
              </span>
              <span className="flex flex-wrap items-center gap-3">
                <StatusChip label={t.live} state="positive" dot />
                <StatusChip label={t.waiting} state="caution" dot />
                <StatusChip label="EVT-2481" state="danger" mono live />
                <span className="flex items-center gap-2 text-small">
                  <Dot state="neutral" /> {t.quiet}
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-8">
                <ScoreRing value={87} size={96} label={t.score} bandLabel={t.good} />
                <Kpi
                  label={t.orders}
                  value={248}
                  delta={12}
                  chart={
                    <Sparkline
                      values={[42, 38, 45, 51, 47, 60, 58, 66, 61, 72, 68, 80]}
                      tone="positive"
                    />
                  }
                  className="min-w-52"
                />
              </span>
            </div>

            <div className="flex flex-col gap-6">
              <Card>
                <CardHead action={<Button size="sm">{t.edit}</Button>}>
                  <h3 className="text-subhead font-semibold text-ink">{t.stock}</h3>
                  <Label>{t.stockMeta}</Label>
                </CardHead>
                <CardBody>{t.cardBody}</CardBody>
              </Card>
              <span className="flex items-center gap-4">
                <Switch on label={t.notify} />
                <span className="text-body">{t.notify}</span>
              </span>
            </div>
          </div>
          </TokenKatmani>
          </div>
          <p className="mt-4 text-[length:var(--docs-small)] text-ink-faint">{t.proofNote}</p>
        </section>

        {/* ── İçinde ne var ───────────────────────────────────────────
            ALTI MADDE, VE HİÇBİRİ BAĞLANTI DEĞİL. Dördünün doküman sayfası
            var, ikisinin (erişilebilirlik, değişiklik günlüğü) yok; dördünü
            bağlayıp ikisini düz bırakmak, bağlantısı olmayan ikisini eksik
            gösterirdi. Altısı da bir okuma; gitmek isteyen üst şeritten
            dokümana giriyor.

            SAYILAR CÜMLENİN İÇİNDE, ayrı bir rakam ızgarasında değil. Bir
            landing'e iri sayılar dizmek, sayının kendisini iddia yapıyor;
            oysa buradaki sayılar iddiayı DESTEKLEYEN detaylar. */}
        <section id="icinde" className="home-section">
          <p className="docs-eyebrow">{t.whatTitle}</p>
          <h2 className="home-h2 mt-5">{t.whatLead}</h2>
          <dl className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {t.whatItems.map(([term, body]) => (
              <div key={term} className="border-l-2 border-[var(--color-accent-line)] pl-5">
                <dt className="text-subhead font-semibold text-ink">{term}</dt>
                <dd className="mt-1.5 text-[length:var(--docs-small)] leading-relaxed text-ink-soft">
                  {body}
                </dd>
              </div>
            ))}
          </dl>
          {/* KAPILAR BİR MADDE DEĞİL, ALTISININ ALTINDAKİ ÇİZGİ: altı sözün
              hepsini derleme anında tutan şey aynı mekanizma. */}
          <p className="mt-9 max-w-2xl border-t border-[var(--color-line)] pt-5 text-[length:var(--docs-small)] leading-relaxed text-ink-faint">
            {t.gatesNote}
          </p>
        </section>

        {/* ── Kurulum ─────────────────────────────────────────────────── */}
        <section className="home-section grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <h2 className="home-h2">{t.startTitle}</h2>
            <p className="mt-5 text-[length:var(--docs-text)] leading-relaxed text-ink-soft">
              {t.startBody}
            </p>
            <Link
              href={yol(lang, "installation")}
              className={`${buttonVariants()} mt-7 no-underline`}
            >
              {t.startCta}
            </Link>
          </div>
          <CodeDemo lang={lang} />
        </section>

        {/* ── Bileşenler ──────────────────────────────────────────────
            Tamamı değil, ilk on iki. Seksen bir kart bir landing'i bir
            dizine çevirir; dizinin yeri zaten dokümanın kendisi. */}
        <section className="home-section">
          <h2 className="home-h2">{t.componentsTitle}</h2>
          <p className="mt-5 max-w-2xl text-[length:var(--docs-text)] leading-relaxed text-ink-soft">
            {t.componentsBody}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {navFor(lang)
              .slice(0, 12)
              .map((p) => (
                <Link
                  key={p.slug}
                  href={yol(lang, p.slug)}
                  className="tamga-card tamga-rise block p-5 no-underline"
                >
                  <span className="block text-subhead font-semibold text-ink">{p.title[lang]}</span>
                  <span className="mt-1 block text-[length:var(--docs-small)] text-ink-faint">
                    {p.blurb[lang]}
                  </span>
                </Link>
              ))}
          </div>
          <Link
            href={yol(lang, "button")}
            className={`${buttonVariants({ variant: "primary" })} mt-9 no-underline`}
          >
            {t.componentsCta}
          </Link>
        </section>

        {/* ── Adı nereden geliyor ─────────────────────────────────────
            SAYFANIN SONUNDA, BAŞINDA DEĞİL. Bir ziyaretçinin ilk sorusu "bu
            ne" ve "nasıl kuruyorum"; adın hikâyesi ancak o ikisi cevaplandıktan
            sonra ilgi çekiyor. Başa konsaydı, aradığı şeye giden yolun önünde
            duran bir paragraf olurdu.

            ÖLÇÜ DAR. Bu bölüm okunmak için var, taranmak için değil; sayfanın
            geri kalanı iki sütunlu ve maddeli, burası tek sütun ve düz metin.
            Biçim, okuma hızının değiştiğini söylüyor. */}
        <section className="home-section border-t border-[var(--color-line)]">
          <p className="docs-eyebrow">{t.nameEyebrow}</p>
          <h2 className="home-h2 mt-5 max-w-3xl">{t.nameTitle}</h2>
          <div className="mt-7 flex max-w-[var(--docs-measure)] flex-col gap-5 text-[length:var(--docs-text)] leading-relaxed text-ink-soft">
            <p>{t.nameP1}</p>
            <p>{t.nameP2}</p>
            {/* SON PARAGRAF MÜREKKEP RENGİNDE: hikâye orada bir KURALA
                dönüşüyor, ve sayfanın bütün iddiası o cümlede toplanıyor. */}
            <p className="text-ink">{t.nameP3}</p>
          </div>
        </section>
      </main>

      <footer className="mt-8 border-t border-[var(--color-line)] py-10">
        <div className="mx-auto flex max-w-(--home-wrap) flex-wrap items-center gap-4 px-5 sm:px-7">
          <span className="text-[length:var(--docs-small)] text-ink-faint">
            {t.footerNote} ·{" "}
            <a
              href="https://mantiksal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="tamga-link"
            >
              {t.footerBy}
            </a>
          </span>
          <span className="ml-auto flex items-center gap-5">
            <a
              href="https://github.com/mantiksal/tamga"
              target="_blank"
              rel="noopener noreferrer"
              className="tamga-link text-[length:var(--docs-small)]"
            >
              {t.footerRepo}
            </a>
            <a
              href="https://www.npmjs.com/package/tamga-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="tamga-link text-[length:var(--docs-small)]"
            >
              npm
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
