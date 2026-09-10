import type { ReactNode } from "react";
import { PageHead, H2, P, Note } from "@/components/prose";
import { findPage } from "@/content/nav";
import type { Locale } from "@/i18n/config";

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
 * güncellenip İngilizcesi unutulursa, iki farklı gerçek doğar. Yan yana
 * durduklarında bu unutuş görünür olur.
 */
const T = {
  tr: {
    s1: "1 · Paketi kur",
    p1: (
      <>
        React 19 bir <em>peer dependency</em>, yani kit kendi React&apos;ini getirmez, projenin
        React&apos;ini kullanır. İki kopya React aynı ağaçta çalışamaz.
      </>
    ),
    s2: "2 · CSS girişini kur",
    p2: <>Sıra önemli: kitin token&apos;ları Tailwind kurulduktan sonra gelmek zorunda.</>,
    note: (
      <>
        <strong>@source satırını atlama.</strong> Kitin bileşenleri Tailwind utility&apos;leri de
        kullanıyor. O satır olmadan yalnız senin kodunda geçen utility&apos;ler üretilir; kitin
        kendi kullandıkları sessizce eksik kalır ve bileşenler yarı çıplak render olur.
      </>
    ),
    s3: "3 · Kullan",
    s4: "Ayrı parçalar",
    p4: <>Her şeye ihtiyacın yoksa kit parça parça da alınabilir:</>,
    p5: (
      <>
        <code>kit.css</code> gerçekten saf CSS: içinde tek bir Tailwind direktifi yok. Tailwind
        kullanmayan bir projede de çalışır.
      </>
    ),
  },
  en: {
    s1: "1 · Install the package",
    p1: (
      <>
        React 19 is a <em>peer dependency</em>: the kit does not bring its own React, it uses
        yours. Two copies of React cannot live in one tree.
      </>
    ),
    s2: "2 · Set up the CSS entry",
    p2: <>Order matters: the kit&apos;s tokens must come after Tailwind is installed.</>,
    note: (
      <>
        <strong>Do not skip the @source line.</strong> The kit&apos;s components use Tailwind
        utilities too. Without that line only the utilities found in <em>your</em> code are
        generated; the ones the kit itself uses go missing silently and components render
        half-dressed.
      </>
    ),
    s3: "3 · Use it",
    s4: "Separate pieces",
    p4: <>If you do not need everything, the kit can be taken piece by piece:</>,
    p5: (
      <>
        <code>kit.css</code> really is plain CSS: not a single Tailwind directive inside. It works
        in a project without Tailwind too.
      </>
    ),
  },
} satisfies Record<Locale, Record<string, ReactNode>>;

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const t = T[lang];
  const p = findPage("installation")!;

  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />

      <H2>{t.s1}</H2>
      <pre className="docs-code my-4">{`pnpm add tamga-ui`}</pre>
      <P>{t.p1}</P>

      <H2>{t.s2}</H2>
      <P>{t.p2}</P>
      <pre className="docs-code my-4">{`/* src/app/globals.css */
@import "tailwindcss";
@import "tamga-ui/styles.css";

@source "../../node_modules/tamga-ui/dist";`}</pre>
      <Note>{t.note}</Note>

      <H2>{t.s3}</H2>
      <pre className="docs-code my-4">{`import { Button, StatusChip } from "tamga-ui";

export function Toolbar() {
  return (
    <div className="flex gap-3">
      <Button variant="primary">Kaydet</Button>
      <StatusChip label="Yayında" state="positive" dot />
    </div>
  );
}`}</pre>

      <H2>{t.s4}</H2>
      <P>{t.p4}</P>
      <pre className="docs-code my-4">{`tamga-ui             ${lang === "tr" ? "bileşenler" : "components"}
tamga-ui/styles.css  ${lang === "tr" ? "token + fizik, tek satırda" : "tokens + physics, in one line"}
tamga-ui/theme.css   ${lang === "tr" ? "yalnız token'lar (Tailwind v4 gerektirir)" : "tokens only (requires Tailwind v4)"}
tamga-ui/kit.css     ${lang === "tr" ? "yalnız sınıflar, saf CSS" : "classes only, plain CSS"}
tamga-ui/icons       ${lang === "tr" ? "kürasyonlu ikon seti" : "the curated icon set"}`}</pre>
      <P>{t.p5}</P>
    </>
  );
}
