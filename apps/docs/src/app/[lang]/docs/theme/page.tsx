import type { ReactNode } from "react";
import { PageHead, H2, P, Note } from "@/components/prose";
import { sayfaMeta } from "@/content/meta";
import { findPage } from "@/content/nav";
import { KatmanListesi, KontrastTablosu, MarkaKutusu, ParityKartlari, TemaAlani } from "./ornek";
import counts from "@/content/counts.json";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return sayfaMeta("theme", lang);
}

const T = {
  tr: {
    lead: (
      <>
        Token&apos;ın <strong>adı kitin, değeri ürünündür.</strong> Bir markayı değiştirmek, kitin
        dosyalarına dokunmak değil, kendi CSS girişine bir blok yazmaktır.
      </>
    ),
    s1: "Bir markanın tamamı",
    p1: (
      <>
        Bu kadar. {counts.sinif} sınıfın hepsi o değişkenlere baktığı için tüm panel dönüşür; yeni CSS
        derlenmez, hiçbir şey yeniden build edilmez.
      </>
    ),
    s2: "Üç katman",
    p2: <>Bileşen katmanına hiç dokunulmaz. Ürün ①&apos;i yazar, ②&apos;yi kit bağlar, ③ hiç değişmez.</>,
    s3: "Koyu tema",
    p3: (
      <>
        Kök elemana <code>.dark</code> sınıfı. Kit iki temayı da <em>her zaman</em> taşır; &quot;sadece
        açık tema&quot; bir yapılandırmadır, ayrı bir build değil; toggle&apos;ı koymazsın, o kadar.
        Bir müşteri iki yıl sonra koyu tema isterse cevap tek satır olmalı.
      </>
    ),
    note: (
      <>
        <strong>
          Her token hem <code>:root</code> hem <code>.dark</code> içinde olmak zorunda.
        </strong>{" "}
        Bir ürün token&apos;ı açık temada ezip koyuda unutursa, o token koyu temada kitin
        varsayılanına düşer ve marka yarım kalır. <code>check-token-parity</code> guard&apos;ı bunu
        CI&apos;da yakalar.
      </>
    ),
    marka: {
      accentLabel: "Vurgu rengi",
      radiusLabel: "Köşe yarıçapı",
      names: ["pembe", "mavi", "yeşil", "mor", "sarı"],
      radiusNotes: { 4: "kurumsal: daha keskin", 8: "kitin varsayılanı", 12: "perakende: daha yumuşak" },
      product: "urun",
      title: "Mağaza",
      live: "Yayında",
      field: "Fiyat",
      toggle: "Stok uyarısı",
      cancel: "Vazgeç",
      save: "Kaydet",
    },
    katman: {
      names: ["Ham rampa", "Semantik", "Bileşen"] as [string, string, string],
      who: ["ürün yazar", "kit bağlar", "hiç değişmez"] as [string, string, string],
    },
    parity: { ok: "İki temada da tanımlı", bad: "Koyu tema unutulmuş" },
    kapi: {
      measure: "Ölçüm",
      rule: "Kural",
      value: "Değer",
      result: "Sonuç",
      pass: "geçti",
      fail: "kaldı",
      rows: [
        "Accent üstünde metin",
        "Zeminde accent metin",
        "Kenar / zemin",
        "Kural çizgisi / zemin",
      ] as [string, string, string, string],
    },
    kapiIpucu: (
      <>
        Yukarıdaki örnekten accent&apos;i değiştir; ölçümler seçilen renkle yeniden hesaplanır.
        Sarı, kapıdan <strong>geçmeyen</strong> renk örneği. Sayfadaki dört satır açıklayıcı:
        gerçek kapı her tema için 44 ölçüm yapıyor.
      </>
    ),
    s4: "Kontrast kapısı",
    p4: (
      <>
        Renk seçmek serbest, ama okunmayan renk değil. <code>check-token-contrast</code> her tema
        için 44 ölçüm yapar: metin AA geçmeli (WCAG ≥ 4.5), yükselmeyi taşıyan{" "}
        <strong>kenar</strong> zeminden ΔL* ≥ 10 ayrı olmalı, kural çizgisi görünür ama sert
        olmamalı (ΔL* 4-16).
      </>
    ),
  },
  en: {
    lead: (
      <>
        A token&apos;s <strong>name belongs to the kit, its value to the product.</strong> Changing
        a brand does not mean touching the kit&apos;s files, it means writing one block in your own
        CSS entry.
      </>
    ),
    s1: "A whole brand",
    p1: (
      <>
        That is all. All {counts.sinif} classes read those variables, so the entire panel turns; no new CSS is
        compiled, nothing is rebuilt.
      </>
    ),
    s2: "Three layers",
    p2: <>The component layer is never touched. The product writes ①, the kit wires ②, ③ never changes.</>,
    s3: "Dark theme",
    p3: (
      <>
        A <code>.dark</code> class on the root element. The kit <em>always</em> carries both
        themes; &quot;light only&quot; is a configuration, not a separate build; you simply do not
        render the toggle. If a customer asks for dark two years later, the answer should be one
        line.
      </>
    ),
    note: (
      <>
        <strong>
          Every token must exist in both <code>:root</code> and <code>.dark</code>.
        </strong>{" "}
        If a product overrides a token in light and forgets dark, that token falls back to the
        kit&apos;s default at night and the brand is only half applied. The{" "}
        <code>check-token-parity</code> guard catches this in CI.
      </>
    ),
    marka: {
      accentLabel: "Accent colour",
      radiusLabel: "Corner radius",
      names: ["pink", "blue", "green", "purple", "yellow"],
      radiusNotes: { 4: "corporate: sharper", 8: "the kit default", 12: "retail: softer" },
      product: "product",
      title: "Store",
      live: "Live",
      field: "Price",
      toggle: "Stock alert",
      cancel: "Cancel",
      save: "Save",
    },
    katman: {
      names: ["Raw ramp", "Semantic", "Component"] as [string, string, string],
      who: ["product writes", "kit wires", "never changes"] as [string, string, string],
    },
    parity: { ok: "Defined in both themes", bad: "Dark theme forgotten" },
    kapi: {
      measure: "Measurement",
      rule: "Rule",
      value: "Value",
      result: "Result",
      pass: "pass",
      fail: "fail",
      rows: [
        "Text on accent",
        "Accent text on ground",
        "Edge / ground",
        "Rule line / ground",
      ] as [string, string, string, string],
    },
    kapiIpucu: (
      <>
        Change the accent in the example above; the measurements recompute with the chosen
        colour. Yellow is a colour that <strong>fails</strong> the gate. The four rows here are
        illustrative: the real gate takes 44 measurements per theme.
      </>
    ),
    s4: "The contrast gate",
    p4: (
      <>
        Picking a colour is free; picking an unreadable one is not.{" "}
        <code>check-token-contrast</code> takes 44 measurements per theme: text must pass AA
        (WCAG ≥ 4.5), the <strong>edge</strong> that carries elevation must sit ΔL* ≥ 10 off its
        ground, and the rule line must be visible without becoming a hard divider (ΔL* 4-16).
      </>
    ),
  },
/* `satisfies` kalktı: sözlük artık yalnız metin değil, örneklerin etiket
   demetlerini de taşıyor (renk adları, ızgara başlıkları). Bir `ReactNode`
   kısıtı onları reddediyordu; diller arası parite `check-docs-i18n`de zaten
   ölçülüyor. */
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const t = T[lang];
  const p = findPage("theme")!;

  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>

      {/* DÖRT BÖLÜM TEK SEÇİMİ PAYLAŞIYOR: yukarıdan rengi değiştirince aşağıdaki
          kontrast tablosu da yeniden hesaplanıyor, ve sayfanın iddiası bu. */}
      <TemaAlani>
        <H2>{t.s1}</H2>
        <div className="my-4">
          <MarkaKutusu labels={t.marka} />
        </div>
        <P>{t.p1}</P>

        <H2>{t.s2}</H2>
        <div className="my-4">
          <KatmanListesi labels={t.katman} />
        </div>
        <P>{t.p2}</P>

        <H2>{t.s3}</H2>
        <P>{t.p3}</P>
        <div className="my-4">
          <ParityKartlari labels={t.parity} />
        </div>
        <Note>{t.note}</Note>

        <H2>{t.s4}</H2>
        <P>{t.p4}</P>
        <div className="my-4">
          <KontrastTablosu labels={t.kapi} />
        </div>
        <P>{t.kapiIpucu}</P>
      </TemaAlani>
    </>
  );
}
