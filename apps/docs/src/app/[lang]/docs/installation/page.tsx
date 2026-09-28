import type { ReactNode } from "react";
import { Atom, Hexagon, Wind } from "tamga-ui/icons";
import { CodeBlock } from "@/components/kod";
import { Note, P, PageHead, RefTable, Section, Step } from "@/components/prose";
import { findPage } from "@/content/nav";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("installation")!.title[lang] };
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
 */
const T = {
  tr: {
    s1: "Paketi kur",
    p1: (
      <>
        React 19 bir <em>peer dependency</em>, yani kit kendi React&apos;ini getirmez, projenin
        React&apos;ini kullanır. İki kopya React aynı ağaçta çalışamaz.
      </>
    ),
    s2: "CSS girişini kur",
    p2: <>Sıra önemli: kitin token&apos;ları Tailwind kurulduktan sonra gelmek zorunda.</>,
    note: (
      <>
        <strong>@source satırını atlama.</strong> Kitin bileşenleri Tailwind utility&apos;leri de
        kullanıyor. O satır olmadan yalnız senin kodunda geçen utility&apos;ler üretilir; kitin
        kendi kullandıkları sessizce eksik kalır ve bileşenler yarı çıplak render olur.
      </>
    ),
    s3: "Kullan",
    s4: "Ayrı parçalar",
    p4: <>Her şeye ihtiyacın yoksa kit parça parça da alınabilir:</>,
    p5: (
      <>
        <code>kit.css</code> gerçekten saf CSS: içinde tek bir Tailwind direktifi yok. Tailwind
        kullanmayan bir projede de çalışır.
      </>
    ),
    tablo: ["Giriş", "İçinde"] as [string, string],
    parcalar: [
      { key: "tamga-ui", val: "bileşenler" },
      { key: "tamga-ui/styles.css", val: "token + fizik, tek satırda", tag: "önerilen" },
      { key: "tamga-ui/theme.css", val: "yalnız token'lar", tag: "Tailwind v4" },
      { key: "tamga-ui/kit.css", val: "yalnız sınıflar, saf CSS" },
      { key: "tamga-ui/icons", val: "kürasyonlu ikon seti" },
    ],
  },
  en: {
    s1: "Install the package",
    p1: (
      <>
        React 19 is a <em>peer dependency</em>: the kit does not bring its own React, it uses
        yours. Two copies of React cannot live in one tree.
      </>
    ),
    s2: "Set up the CSS entry",
    p2: <>Order matters: the kit&apos;s tokens must come after Tailwind is installed.</>,
    note: (
      <>
        <strong>Do not skip the @source line.</strong> The kit&apos;s components use Tailwind
        utilities too. Without that line only the utilities found in <em>your</em> code are
        generated; the ones the kit itself uses go missing silently and components render
        half-dressed.
      </>
    ),
    s3: "Use it",
    s4: "Separate pieces",
    p4: <>If you do not need everything, the kit can be taken piece by piece:</>,
    p5: (
      <>
        <code>kit.css</code> really is plain CSS: not a single Tailwind directive inside. It works
        in a project without Tailwind too.
      </>
    ),
    tablo: ["Entry", "What is in it"] as [string, string],
    parcalar: [
      { key: "tamga-ui", val: "components" },
      { key: "tamga-ui/styles.css", val: "tokens + physics, in one line", tag: "recommended" },
      { key: "tamga-ui/theme.css", val: "tokens only", tag: "Tailwind v4" },
      { key: "tamga-ui/kit.css", val: "classes only, plain CSS" },
      { key: "tamga-ui/icons", val: "the curated icon set" },
    ],
  },
} satisfies Record<Locale, Record<string, ReactNode | unknown>>;

const KURULUM = {
  pnpm: "pnpm add tamga-ui",
  npm: "npm install tamga-ui",
  yarn: "yarn add tamga-ui",
};

const CSS_GIRISI = `@import "tailwindcss";
@import "tamga-ui/styles.css";

@source "../../node_modules/tamga-ui/dist";`;

const ORNEK = `import { Button, StatusChip } from "tamga-ui";

export function Toolbar() {
  return (
    <div className="flex gap-3">
      <Button variant="primary">Kaydet</Button>
      <StatusChip label="Yayında" state="positive" dot />
    </div>
  );
}`;

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const t = T[lang];
  const dict = await getDictionary(lang);
  const p = findPage("installation")!;

  return (
    <>
      <PageHead
        title={p.title[lang]}
        blurb={p.blurb[lang]}
        gereksinimler={[
          { icon: Atom, label: "React 19" },
          { icon: Wind, label: "Tailwind v4" },
          { icon: Hexagon, label: "Node 20+" },
        ]}
      />

      <Step n={1} id="paketi-kur" title={t.s1}>
        <CodeBlock pm={KURULUM} dict={dict} />
        <P>{t.p1}</P>
      </Step>

      <Step n={2} id="css-girisi" title={t.s2}>
        <P>{t.p2}</P>
        <CodeBlock code={CSS_GIRISI} file="src/app/globals.css" dict={dict} />
        <Note>{t.note}</Note>
      </Step>

      <Step n={3} id="kullan" title={t.s3} sonMu>
        <CodeBlock code={ORNEK} file="app/toolbar.tsx" dict={dict} />
      </Step>

      <Section id="ayri-parcalar" title={t.s4}>
        <P>{t.p4}</P>
        <RefTable head={t.tablo} rows={t.parcalar} />
        <P>{t.p5}</P>
      </Section>
    </>
  );
}
