import { Rise, Surface } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("rise")!.title[lang] };
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
    lead: (
      <>
        Aşağıdan giren blok: sekiz piksel aşağıdan, sönükten. <strong>Bir hover etkisi
        değil</strong>: adı yanıltıcı olabilir, bu bir <em>giriş</em> animasyonu.
      </>
    ),
    row: (n: number) => `Satır ${n}`,
    delay: (
      <>
        <code>delay</code> bir listeyi sırayla açmak için. Basamak <strong>küçük</strong>
        tutulmalı: otuz satırlık bir listede 60ms&apos;lik bir gecikme, sonuncuyu iki saniye sonra
        gösterir ve bekleme hissi yaratır.
      </>
    ),
    motion: (
      <>
        Azaltılmış harekette CSS animasyonu tamamen kapatıyor; blok olduğu yerde, tam
        görünürlükte belirir. Bu bir zarafet kaybı değil: hareket duyarlılığı olan biri için
        kayan bir sayfa okunamaz hâle gelir.
      </>
    ),
    rel: (
      <>
        Veri beklenirken yer tutmak için <Xref to="skeleton">Skeleton</Xref>; bu, veri{" "}
        <em>geldikten sonra</em> onu göstermek için.
      </>
    ),
    gap: (
      <>
        <strong>Bu bileşen yeni bir şey icat etmiyor.</strong> Sınıfı kitte zaten vardı; eksik
        olan, doğru işaretlemenin tek bir yerde durmasıydı. <code>.tamga-rise</code> kitte yıllarca
        vardı ve işaretlemesini her çağıran kendi yazıyordu; bedeli görünmezdi ama gerçekti.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
  },
  en: {
    lead: (
      <>
        A block that enters from below: eight pixels up, from faint. <strong>Not a hover
        effect</strong>: the name can mislead; this is an <em>entrance</em>.
      </>
    ),
    row: (n: number) => `Row ${n}`,
    delay: (
      <>
        <code>delay</code> is for opening a list in sequence. Keep the step <strong>small</strong>:
        in a thirty-row list a 60ms delay shows the last one two seconds later, and that reads as
        waiting.
      </>
    ),
    motion: (
      <>
        Under reduced motion the CSS turns the animation off entirely; the block appears in
        place, at full opacity. That is not a loss of polish: for someone sensitive to motion, a
        sliding page becomes unreadable.
      </>
    ),
    rel: (
      <>
        To hold the place while data is loading, <Xref to="skeleton">Skeleton</Xref>; this is for
        showing it <em>after</em> it arrives.
      </>
    ),
    gap: (
      <>
        <strong>This component invents nothing.</strong> The class was already in the kit; what
        was missing was one place holding the correct markup. <code>.tamga-rise</code> was in the kit for
        years and every caller wrote its markup by hand: the cost was invisible but real.
      </>
    ),
    rules: "Rules",
    related: "Related",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("rise")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`{rows.map((r, i) => (
  <Rise key={r.id} delay={i * 40}>…</Rise>
))}`}>
        <div className="flex w-full flex-col gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Rise key={i} delay={i * 60}>
              <Surface className="p-3 text-body text-ink-soft">{t.row(i + 1)}</Surface>
            </Rise>
          ))}
        </div>
      </Demo>
      <P>{t.delay}</P>

      <H2>{t.rules}</H2>
      <Note>{t.motion}</Note>
      <Note>{t.gap}</Note>

      <H2>Props</H2>
      <Props of="Rise" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
