import type { ReactNode } from "react";
import { PageHead, H2, P, Note } from "@/components/prose";
import { findPage } from "@/content/nav";
import counts from "@/content/counts.json";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("theme")!.title[lang] };
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
} satisfies Record<Locale, Record<string, ReactNode>>;

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const t = T[lang];
  const p = findPage("theme")!;

  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>

      <H2>{t.s1}</H2>
      <pre className="docs-code my-4">{`/* <urun>/src/globals.css */
@import "tailwindcss";
@import "tamga-ui/styles.css";
@source "../../node_modules/tamga-ui/dist";

:root {
  --color-accent: #d6336c;   /* ${lang === "tr" ? "pembe" : "pink"} */
  --radius: 12px;            /* ${lang === "tr" ? "perakende: daha yumuşak" : "retail: softer" } */
}`}</pre>
      <P>{t.p1}</P>

      <H2>{t.s2}</H2>
      <pre className="docs-code my-4">{`① ${lang === "tr" ? "ham rampa   " : "raw ramp    "} --color-brand-500: #2069c9
② ${lang === "tr" ? "semantik    " : "semantic    "} --color-accent: var(--color-brand-500)
③ ${lang === "tr" ? "bileşen     " : "component   "} .tamga-btn-primary { background: var(--color-accent) }`}</pre>
      <P>{t.p2}</P>

      <H2>{t.s3}</H2>
      <P>{t.p3}</P>
      <Note>{t.note}</Note>

      <H2>{t.s4}</H2>
      <P>{t.p4}</P>
    </>
  );
}
