import type { Locale } from "@/i18n/config";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Xref } from "@/components/xref";
import { Utilityler } from "@/components/utilities";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("tailwind")!.title[lang] };
}

const KURULUM = `/* src/app/globals.css */

@import "tailwindcss";
@import "tamga-ui/styles.css";

/* Tailwind v4 node_modules'u kendiliğinden taramaz; bu satır olmadan
   kite ÖZGÜ utility'ler üretilmez ve bileşenler yarı çıplak render olur. */
@source "../../node_modules/tamga-ui/dist";`;

const T = {
  tr: {
    lead: (
      <>
        Kitin token&apos;ları Tailwind v4&apos;ün <code>@theme</code>&apos;i üzerinden geliyor, yani
        çoğu doğrudan bir utility: <code>bg-shell</code>, <code>text-ink-faint</code>,{" "}
        <code>text-body</code>. Ama <strong>hepsi değil</strong>, ve hangisinin olmadığını bilmek
        yarım saat kazandırıyor.
      </>
    ),
    kurulumH: "Üç satır",
    kurulumP: (
      <>
        <code>@source</code> satırı isteğe bağlı değil: Tailwind v4 <code>node_modules</code>
        &apos;u kendiliğinden taramıyor. Ayrıntısı <Xref to="installation">Kurulum</Xref>&apos;da, ve
        orada bir tuzak da kayıtlı: yerel bir sembolik bağ (pnpm çalışma alanı, <code>file:</code>{" "}
        bağımlılığı) taranmıyor, yani hata yalnız geliştirirken çıkıyor.
      </>
    ),
    kuralH: "Neden bazıları utility üretmiyor",
    kuralP: (
      <>
        İki koşul birden gerekiyor. ① Token bir <code>@theme</code> bloğunda olacak; düz bir{" "}
        <code>:root</code> bloğundakini Tailwind hiç görmüyor. ② Ön eki Tailwind&apos;in{" "}
        <strong>ad alanlarından</strong> biri olacak (<code>--color-</code>, <code>--text-</code>,{" "}
        <code>--radius-</code>, <code>--shadow-</code>, <code>--ease-</code>, <code>--font-</code>
        …). <code>--duration-</code> ve <code>--measure-</code> ad alanı değil, yani{" "}
        <code>@theme</code> içinde olsalar bile utility çıkmıyor.
      </>
    ),
    kuralN: (
      <>
        Bu kural tahmin değil <strong>ölçüldü</strong>: 328 aday sınıfı kullanan geçici bir sayfa
        yazılıp build alındı ve üretilen CSS tarandı. 307&apos;si üretildi, 21&apos;i üretilmedi,
        ve üretilmeyenlerin hepsi iki koşuldan birini karşılamıyordu. Sonda silindi; kalan şey
        aşağıdaki tablo, ve o her build&apos;de kaynaktan yeniden hesaplanıyor.
      </>
    ),
    listeH: "Tam liste",
  },
  en: {
    lead: (
      <>
        The kit&apos;s tokens come through Tailwind v4&apos;s <code>@theme</code>, so most of them
        are utilities directly: <code>bg-shell</code>, <code>text-ink-faint</code>,{" "}
        <code>text-body</code>. But <strong>not all of them</strong>, and knowing which ones are
        missing saves half an hour.
      </>
    ),
    kurulumH: "Three lines",
    kurulumP: (
      <>
        The <code>@source</code> line is not optional: Tailwind v4 does not scan{" "}
        <code>node_modules</code> on its own. The detail is in{" "}
        <Xref to="installation">Installation</Xref>, along with a trap worth knowing: a local symlink (a
        pnpm workspace, a <code>file:</code> dependency) is not followed, so the failure appears
        only while developing.
      </>
    ),
    kuralH: "Why some produce no utility",
    kuralP: (
      <>
        Two conditions, both required. ① The token must sit in a <code>@theme</code> block;
        Tailwind never sees one in a plain <code>:root</code>. ② Its prefix must be one of
        Tailwind&apos;s <strong>namespaces</strong> (<code>--color-</code>, <code>--text-</code>,{" "}
        <code>--radius-</code>, <code>--shadow-</code>, <code>--ease-</code>, <code>--font-</code>
        …). <code>--duration-</code> and <code>--measure-</code> are not namespaces, so they
        produce nothing even inside <code>@theme</code>.
      </>
    ),
    kuralN: (
      <>
        This rule was <strong>measured</strong> rather than assumed: a temporary page using 328
        candidate classes was written, built, and the generated CSS scanned. 307 were produced, 21
        were not, and every one of the 21 failed one of the two conditions. The probe was deleted;
        what remains is the table below, recomputed from source on every build.
      </>
    ),
    listeH: "The full list",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const p = findPage("tailwind")!;
  const t = T[lang];

  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>

      <H2>{t.kurulumH}</H2>
      <P>{t.kurulumP}</P>
      <pre className="docs-code my-4">{KURULUM}</pre>

      <H2>{t.kuralH}</H2>
      <P>{t.kuralP}</P>
      <Note>{t.kuralN}</Note>

      <H2>{t.listeH}</H2>
      <Utilityler lang={lang} />
    </>
  );
}
