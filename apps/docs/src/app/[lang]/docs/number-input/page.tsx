import { NumberInputDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("number-input")!.title[lang] };
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
        Fiyat, stok, ağırlık. <code>&lt;input type=&quot;number&quot;&gt;</code> bunu üç somut
        sebeple karşılamıyor:
      </>
    ),
    r1: (
      <>
        Tarayıcının kendi okları 12px&apos;lik, tema tanımayan, dokunmatik ekranda tutulamayan
        kontrollerdir, ve her tarayıcı farklı çizer.
      </>
    ),
    r2: (
      <>
        <strong>Fare tekerleği alanın üstündeyken değeri değiştirir.</strong> Uzun bir formda
        sayfayı kaydırırken stok adedini sessizce bozar.
      </>
    ),
    r3: (
      <>
        Ondalık ayracı yereldir: Türkçe klavyeden <code>12,5</code> gelir,{" "}
        <code>type=&quot;number&quot;</code> bunu boş değer olarak okur.
      </>
    ),
    how: (
      <>
        Alan <code>type=&quot;text&quot;</code> + <code>inputMode=&quot;decimal&quot;</code>:
        mobil klavye yine sayısal açılır, ama biçimlendirme bizde kalır. Yukarı/aşağı ok tuşları
        da çalışır.
      </>
    ),
    rules: "Kurallar",
    labels: (
      <>
        İki okun <code>labels</code>&apos;ı zorunlu: metinsiz iki düğme ekran okuyucuda
        &quot;düğme, düğme&quot;dir. Kit çeviri yapmaz.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Sayı olmayan tek satırlık her şey için <Xref to="input">Input</Xref>; etiket ve hata
        satırı için <Xref to="field">Field</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        Price, stock, weight. <code>&lt;input type=&quot;number&quot;&gt;</code> does not cover
        this, for three concrete reasons:
      </>
    ),
    r1: (
      <>
        The browser&apos;s own arrows are 12px controls that ignore your theme and cannot be hit on
        a touch screen, and every browser draws them differently.
      </>
    ),
    r2: (
      <>
        <strong>The mouse wheel changes the value while the pointer is over the field.</strong> In
        a long form, scrolling the page silently corrupts a stock count.
      </>
    ),
    r3: (
      <>
        The decimal separator is local: a Turkish keyboard produces <code>12,5</code>, and{" "}
        <code>type=&quot;number&quot;</code> reads that as an empty value.
      </>
    ),
    how: (
      <>
        The field is <code>type=&quot;text&quot;</code> plus{" "}
        <code>inputMode=&quot;decimal&quot;</code>: the mobile keyboard still opens numeric, but
        formatting stays with us. The up and down arrow keys work too.
      </>
    ),
    rules: "Rules",
    labels: (
      <>
        <code>labels</code> for the two arrows is required: two buttons with no text are
        &quot;button, button&quot; to a screen reader. The kit does not translate.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For anything single-line that is not a number, <Xref to="input">Input</Xref>; for a label
        and an error line, <Xref to="field">Field</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("number-input")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <ul className="my-4 ml-5 list-disc space-y-2 text-control">
        <li>{t.r1}</li>
        <li>{t.r2}</li>
        <li>{t.r3}</li>
      </ul>
      <Demo labels={dict.demo} align="start" code={`<NumberInput
  value={price}
  onChange={setPrice}
  step={0.1}
  min={0}
  suffix="₺"
  labels={{ increase: "…", decrease: "…" }}
/>`}>
        <NumberInputDemo lang={lang} />
      </Demo>
      <P>{t.how}</P>

      <H2>{t.rules}</H2>
      <Note>{t.labels}</Note>

      <H2>Props</H2>
      <Props of="NumberInput" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
