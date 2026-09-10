import { PageBand, Button } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("page-band")!.title[lang] };
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
    title: "Ürünler",
    subtitle: "248 kayıt · son güncelleme 3 dk önce",
    add: "Ürün ekle",
    export: "Dışa aktar",
    lead: "Her ekranın tepesindeki şerit: başlık, ikincil satır, ve sağdaki eylemler.",
    right: (
      <>
        Eylem her zaman <strong>sağa yaslı</strong> ve başlığın taban çizgisinde. Başka yere
        koyan bir başlık altındaki listeden kopmuş görünür.
      </>
    ),
    twice: (
      <>
        <strong>Bu bileşen üründe zaten yazılmıştı</strong>: 23 satır, ve doğru yazılmıştı. Ama
        her ekranın tepesinde duran bir şeyin her projede yeniden yazılması, on panelde on farklı
        boşluk demek.
      </>
    ),
    rel: (
      <>
        Kartların arasındaki bölüm başlığı <Xref to="section-head">Section head</Xref>; nerede
        olduğunu söyleyen <Xref to="breadcrumb">Breadcrumb</Xref>.
      </>
    ),
    gap: (
      <>
        <strong>Bu bileşen yeni bir şey icat etmiyor.</strong> Sınıfı kitte zaten vardı; eksik
        olan, doğru işaretlemenin tek bir yerde durmasıydı. <code>.tamga-section</code> kitte yıllarca
        vardı ve işaretlemesini her çağıran kendi yazıyordu; bedeli görünmezdi ama gerçekti.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
  },
  en: {
    title: "Products",
    subtitle: "248 records · updated 3 min ago",
    add: "Add product",
    export: "Export",
    lead: "The strip at the top of every screen: a title, a secondary line, and the actions at the right.",
    right: (
      <>
        The action is always <strong>right-aligned</strong>, on the title&apos;s baseline. A
        heading that puts it elsewhere looks detached from the list beneath it.
      </>
    ),
    twice: (
      <>
        <strong>This component was already written in the product</strong>: 23 lines, and
        written correctly. But something that sits at the top of every screen being rewritten in
        every project means ten different gaps across ten panels.
      </>
    ),
    rel: (
      <>
        The section heading between cards is <Xref to="section-head">Section head</Xref>; the one
        that says where you are is <Xref to="breadcrumb">Breadcrumb</Xref>.
      </>
    ),
    gap: (
      <>
        <strong>This component invents nothing.</strong> The class was already in the kit; what
        was missing was one place holding the correct markup. <code>.tamga-section</code> was in the kit for
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
  const p = findPage("page-band")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" grid={false} code={`<PageBand
  title="${t.title}"
  subtitle="${t.subtitle}"
  actions={<><Button size="sm">${t.export}</Button><Button size="sm" variant="primary">${t.add}</Button></>}
/>`}>
        <div className="w-full">
          <PageBand
            title={t.title}
            subtitle={t.subtitle}
            actions={
              <>
                <Button size="sm">{t.export}</Button>
                <Button size="sm" variant="primary">
                  {t.add}
                </Button>
              </>
            }
          />
        </div>
      </Demo>
      <P>{t.right}</P>

      <H2>{t.rules}</H2>
      <Note>{t.twice}</Note>

      <H2>Props</H2>
      <Props of="PageBand" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
