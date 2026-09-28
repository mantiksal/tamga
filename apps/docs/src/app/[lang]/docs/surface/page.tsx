import { Surface } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("surface")!.title[lang] };
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
    flat: "Düz: kenarı var, yükselmiyor",
    raised: "Yükseltilmiş: 1px kenar + 2px sert offset",
    lead: (
      <>
        İki yüzey, tek varyant. Fark yükseklik: <code>raised</code>, Yasa 1&apos;in formülünü
        ekliyor.
      </>
    ),
    when: (
      <>
        Düz olan bir şeyi <em>gruplar</em>, yükseltilmiş olan bir şeyi <em>öne çıkarır</em>. Bir
        sayfada her kutu yükselirse hiçbiri yükselmemiş olur.
      </>
    ),
    rel: (
      <>
        Başlık ve gövde bölmeli hâli <Xref to="card">Card</Xref>; sayfanın tepesindeki şerit{" "}
        <Xref to="page-band">Page band</Xref>.
      </>
    ),
    gap: (
      <>
        <strong>Bu bileşen yeni bir şey icat etmiyor.</strong> Sınıfı kitte zaten vardı; eksik
        olan, doğru işaretlemenin tek bir yerde durmasıydı. <code>.tamga-surface</code> kitte yıllarca
        vardı ve işaretlemesini her çağıran kendi yazıyordu; bedeli görünmezdi ama gerçekti.
      </>
    ),
    rules: "Kurallar",
    katmanH: "Beş katman",
    katmanP: (
      <>
        Kitin bütün yüzeyleri bu beş basamakta: <strong>çerçeve</strong> en altta (kabuğun
        kendisi, kesik kenarla çizildi çünkü bir yüzey değil bir <em>alan</em>),{" "}
        <strong>çukur</strong> sayfanın içine oyulmuş olan, <strong>zemin</strong> sayfanın
        kendisi, <strong>yüzey</strong> onun üstünde duran kart, ve <strong>yükseltilmiş</strong>{" "}
        · diyalog ve menü, kenarı koyu ve tabanı bir basamak uzun. Aradaki fark renkten çok{" "}
        <strong>kenar ve taban</strong>: yükselmeyi kenar taşıyor, dolgu değil.
      </>
    ),
    kCerceve: "Çerçeve",
    kCukur: "Çukur",
    kZemin: "Zemin",
    kYuzey: "Yüzey",
    kYukseltilmis: "Yükseltilmiş",
    kYukseltilmisAlt: "diyalog, menü",
    related: "İlgili",
  },
  en: {
    flat: "Flat: it has an edge, it does not lift",
    raised: "Raised: a 1px edge plus a 2px hard offset",
    lead: (
      <>
        Two surfaces, one variant. The difference is height: <code>raised</code> adds Law
        1&apos;s formula.
      </>
    ),
    when: (
      <>
        The flat one <em>groups</em> something; the raised one <em>brings it forward</em>. If
        every box on a page lifts, none of them has lifted.
      </>
    ),
    rel: (
      <>
        With a header and body, <Xref to="card">Card</Xref>; the strip at the top of a page,{" "}
        <Xref to="page-band">Page band</Xref>.
      </>
    ),
    gap: (
      <>
        <strong>This component invents nothing.</strong> The class was already in the kit; what
        was missing was one place holding the correct markup. <code>.tamga-surface</code> was in the kit for
        years and every caller wrote its markup by hand: the cost was invisible but real.
      </>
    ),
    rules: "Rules",
    katmanH: "Five layers",
    katmanP: (
      <>
        Every surface in the kit sits on one of these five steps: the <strong>chrome</strong> at
        the bottom (the shell itself, drawn with a dashed edge because it is not a surface but an{" "}
        <em>area</em>), the <strong>sunk</strong> one carved into the page, the{" "}
        <strong>page</strong> itself, the <strong>surface</strong> standing on it, and the{" "}
        <strong>raised</strong> one · dialogs and menus, with a dark edge and a base one step
        longer. What separates them is less colour than <strong>edge and base</strong>: the lift
        is carried by the edge, not by the fill.
      </>
    ),
    kCerceve: "Chrome",
    kCukur: "Sunk",
    kZemin: "Page",
    kYuzey: "Surface",
    kYukseltilmis: "Raised",
    kYukseltilmisAlt: "dialog, menu",
    related: "Related",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("surface")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<Surface>…</Surface>
<Surface raised>…</Surface>`}>
        <div className="flex w-full flex-col gap-5">
          <Surface className="p-5 text-body text-ink-soft">{t.flat}</Surface>
          <Surface raised className="p-5 text-body text-ink-soft">
            {t.raised}
          </Surface>
        </div>
      </Demo>
      <P>{t.when}</P>

      <H2>{t.katmanH}</H2>
      <Demo labels={dict.demo} align="start" grid={false} code={`<Surface>…</Surface>
<Surface raised>…</Surface>`}>
        <div className="grid w-full gap-4.5 rounded-(--radius-card) bg-[var(--color-band)] p-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { ad: t.kCerceve, kod: "--color-band", sinif: "border border-dashed border-ink-faint" },
            { ad: t.kCukur, kod: "--color-sunk", sinif: "border border-line bg-sunk" },
            { ad: t.kZemin, kod: "--color-page", sinif: "border border-line bg-page" },
            { ad: t.kYuzey, kod: "--color-shell", sinif: "tamga-card" },
          ].map((k) => (
            <span
              key={k.ad}
              className={`flex h-28 flex-col justify-end gap-0.5 rounded-(--radius-btn) p-3 ${k.sinif}`}
            >
              <strong className="text-small">{k.ad}</strong>
              <span className="font-mono text-caption text-ink-faint">{k.kod}</span>
            </span>
          ))}
          <Surface raised className="flex h-28 flex-col justify-end gap-0.5 p-3">
            <strong className="text-small">{t.kYukseltilmis}</strong>
            <span className="font-mono text-caption text-ink-faint">{t.kYukseltilmisAlt}</span>
          </Surface>
        </div>
      </Demo>
      <P>{t.katmanP}</P>

      <H2>{t.rules}</H2>
      <Note>{t.gap}</Note>

      <H2>Props</H2>
      <Props of="Surface" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
