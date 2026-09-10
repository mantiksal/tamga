import { Swap, Button, Spinner } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("swap")!.title[lang] };
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
    save: "Kaydet",
    saving: "Kaydediliyor…",
    lead: (
      <>
        İki durumun <strong>aynı hücrede</strong> durması. Bir düğmenin yazısı
        &quot;Kaydet&quot;ten &quot;Kaydediliyor…&quot;a döndüğünde düğme genişler ve yanındaki
        her şey kayar. Swap ikisini de aynı ızgara hücresine koyuyor: kutu her zaman{" "}
        <strong>uzun olanın</strong> genişliğinde.
      </>
    ),
    aria: (
      <>
        Gizlenen taraf <code>aria-hidden</code> alıyor. Almasaydı ekran okuyucu iki metni arka
        arkaya okurdu: &quot;Kaydet Kaydediliyor&quot;, ve hangisinin geçerli olduğu
        anlaşılmazdı.
      </>
    ),
    rel: (
      <>
        Beklerken göstermek için <Xref to="spinner">Spinner</Xref>; yüzde biliniyorsa{" "}
        <Xref to="progress">Progress</Xref>.
      </>
    ),
    gap: (
      <>
        <strong>Bu bileşen yeni bir şey icat etmiyor.</strong> Sınıfı kitte zaten vardı; eksik
        olan, doğru işaretlemenin tek bir yerde durmasıydı. <code>.tamga-swap</code> kitte yıllarca
        vardı ve işaretlemesini her çağıran kendi yazıyordu; bedeli görünmezdi ama gerçekti.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
  },
  en: {
    save: "Save",
    saving: "Saving…",
    lead: (
      <>
        Two states in the <strong>same cell</strong>. When a button&apos;s text turns from
        &quot;Save&quot; to &quot;Saving…&quot; the button widens and everything beside it
        shifts. Swap puts both in one grid cell: the box is always as wide as the{" "}
        <strong>longer</strong> one.
      </>
    ),
    aria: (
      <>
        The hidden side gets <code>aria-hidden</code>. Without it a screen reader would read both
        texts one after the other: &quot;Save Saving&quot;, with no way to tell which one
        applies.
      </>
    ),
    rel: (
      <>
        To show that something is in progress, <Xref to="spinner">Spinner</Xref>; if you know the
        percentage, <Xref to="progress">Progress</Xref>.
      </>
    ),
    gap: (
      <>
        <strong>This component invents nothing.</strong> The class was already in the kit; what
        was missing was one place holding the correct markup. <code>.tamga-swap</code> was in the kit for
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
  const p = findPage("swap")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} code={`<Button variant="primary">
  <Swap
    showing={busy ? "b" : "a"}
    a={<>${t.save}</>}
    b={<><Spinner size={14} label="…" /> ${t.saving}</>}
  />
</Button>`}>
        <Button variant="primary">
          <Swap showing="a" a={t.save} b={t.saving} />
        </Button>
        <Button variant="primary">
          <Swap
            showing="b"
            a={t.save}
            b={
              <>
                <Spinner size={14} label={t.saving} /> {t.saving}
              </>
            }
          />
        </Button>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.aria}</Note>
      <Note>{t.gap}</Note>

      <H2>Props</H2>
      <Props of="Swap" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
