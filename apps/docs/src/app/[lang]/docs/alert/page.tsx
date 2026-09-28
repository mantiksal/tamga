import { Alert, Button } from "tamga-ui";
import { UyariOrnegi } from "./ornek";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("alert")!.title[lang] };
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
    stays: (
      <>
        Sayfanın içinde durur ve <strong>kalır</strong>: okunana kadar kaybolmaz.
      </>
    ),
    quotaTitle: "Kotanın %90'ındasın",
    quotaBody: "Bu ayki limitine yaklaştın. Yükseltmezsen ay sonunda yeni kayıt ekleyemezsin.",
    payTitle: "Ödeme alınamadı",
    payBody: "Kayıtlı kartın süresi dolmuş.",
    payAction: "Kartı güncelle",
    okTitle: "Doğrulandı",
    okBody: "Alan adın bize ait olduğunu kanıtladın.",
    rule: (
      <>
        Durum rengi <strong>sol kural</strong> ve hafif bir yıkama olarak gelir, dolgu değil.
        Yasa 2: dolgu eylem demektir, bir uyarı eylem değildir.
      </>
    ),
    rules: "Kurallar",
    kapat: "Kapat",
    geriGetir: "Uyarıları geri getir",
    dortTon: (
      <>
        Dört ton, dört iş: <strong>bilgi</strong> olan biteni söyler, <strong>başarı</strong>{" "}
        biten bir işi, <strong>uyarı</strong> yaklaşan bir sınırı, <strong>hata</strong> duran
        bir işi. Glif kendi karesinde duruyor · yıkanmış bir kutunun üstünde çıplak bir glif
        zemine karışıyor, ve dört uyarı yan yana geldiğinde hangisinin hangisi olduğu ancak
        renkten okunuyordu.
      </>
    ),
    karoMurekkebi: (
      <>
        <strong>Karonun mürekkebi tondan geliyor, sabit değil.</strong> Karo rengi iki temada da
        aynı plaka; üstüne temayla dönen bir mürekkep yazıldığında koyu temada glif plakaya
        gömülüyordu (kritikte ölçüm <strong>2.96</strong>). Her ton kendi mürekkebini taşıyor:
        kritik beyaz, <code>info</code> sayfayı takip ediyor (plaka da onunla dönüyor), ötekiler
        koyu plakayı. Kapı <code>tone.ts</code>&apos;in kendisini okuyor.
      </>
    ),
    infoTitle: "Yeni rapor hazır",
    infoBody: "Eylül satış raporu indirilebilir durumda.",
    successTitle: "Ürünler içe aktarıldı",
    successBody: "124 ürün başarıyla eklendi, 3 ürün atlandı.",
    stokTitle: "Stok azalıyor",
    stokBody: "3 ürün için tahmini tükenme süresi 5 günden az.",
    odemeTitle: "Ödeme alınamadı",
    odemeBody: "#TG-10471 numaralı siparişte kart onayı reddedildi.",
    notToast: (
      <>
        Bir eylemin SONUCUNU bildiriyorsan bu bileşen değil:{" "}
        <Xref to="toast">Toast</Xref> gelir ve gider. Alert bir DURUMU bildirir ve durum sürdükçe
        durur.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Bir şey yüklenemediyse <Xref to="error-state">Error state</Xref>; hiç yoksa{" "}
        <Xref to="empty-state">Empty state</Xref>.
      </>
    ),
  },
  en: {
    stays: (
      <>
        It sits inside the page and <strong>stays</strong>: it does not disappear until it is
        read.
      </>
    ),
    quotaTitle: "You are at 90% of your quota",
    quotaBody: "You are close to this month's limit. Without an upgrade you cannot add new records at month end.",
    payTitle: "Payment failed",
    payBody: "Your saved card has expired.",
    payAction: "Update card",
    okTitle: "Verified",
    okBody: "You proved the domain belongs to you.",
    rule: (
      <>
        The status colour arrives as a <strong>left rule</strong> and a faint wash, never a fill.
        Law 2: a fill means an action, and a warning is not an action.
      </>
    ),
    rules: "Rules",
    kapat: "Dismiss",
    geriGetir: "Bring the alerts back",
    dortTon: (
      <>
        Four tones, four jobs: <strong>info</strong> reports what happened,{" "}
        <strong>success</strong> a finished job, <strong>caution</strong> an approaching limit,{" "}
        <strong>danger</strong> a job that has stopped. The glyph sits in its own square · on a
        washed box a bare glyph sinks into the ground, and with four alerts stacked the only
        thing telling them apart was colour.
      </>
    ),
    karoMurekkebi: (
      <>
        <strong>The tile&apos;s ink comes from the tone, it is not one colour.</strong> The tile
        is the same fixed plate in both themes; an ink that follows the theme sank the glyph
        into that plate at night (critical measured <strong>2.96</strong>). Each tone now
        carries its own: critical takes white, <code>info</code> follows the page (its plate
        flips with it), the rest take the dark plate. The gate reads <code>tone.ts</code> itself.
      </>
    ),
    infoTitle: "A new report is ready",
    infoBody: "September's sales report is ready to download.",
    successTitle: "Products imported",
    successBody: "124 products added, 3 skipped.",
    stokTitle: "Stock is running low",
    stokBody: "3 products are estimated to run out in under 5 days.",
    odemeTitle: "Payment failed",
    odemeBody: "The card was declined on order #TG-10471.",
    notToast: (
      <>
        If you are reporting the RESULT of an action, this is not the component:{" "}
        <Xref to="toast">Toast</Xref> comes and goes. An alert reports a STATE and stays for as
        long as the state lasts.
      </>
    ),
    related: "Related",
    rel: (
      <>
        If something failed to load, <Xref to="error-state">Error state</Xref>; if there is nothing
        there at all, <Xref to="empty-state">Empty state</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("alert")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.stays}</P>
      <Demo
        labels={dict.demo}
        align="start"
        code={`<Alert state="caution" title="${t.quotaTitle}">
  ${t.quotaBody}
</Alert>

<Alert state="danger" title="${t.payTitle}" action={<Button size="sm">${t.payAction}</Button>}>
  ${t.payBody}
</Alert>`}
      >
        <div className="flex w-full flex-col gap-4">
          <Alert state="caution" title={t.quotaTitle}>
            {t.quotaBody}
          </Alert>
          <Alert state="danger" title={t.payTitle} action={<Button size="sm">{t.payAction}</Button>}>
            {t.payBody}
          </Alert>
          <Alert state="positive" title={t.okTitle}>
            {t.okBody}
          </Alert>
        </div>
      </Demo>
      <P>{t.rule}</P>

      <Demo
        labels={dict.demo}
        align="start"
        code={`<Alert state="info" title="${t.infoTitle}" dismissLabel="${t.kapat}" onDismiss={…}>
  ${t.infoBody}
</Alert>`}
      >
        <UyariOrnegi
          kapat={t.kapat}
          geriGetir={t.geriGetir}
          uyarilar={[
            { state: "info", title: t.infoTitle, body: t.infoBody },
            { state: "positive", title: t.successTitle, body: t.successBody },
            { state: "caution", title: t.stokTitle, body: t.stokBody },
            { state: "danger", title: t.odemeTitle, body: t.odemeBody },
          ]}
        />
      </Demo>
      <P>{t.dortTon}</P>
      <P>{t.karoMurekkebi}</P>

      <H2>{t.rules}</H2>
      <Note>{t.notToast}</Note>

      <H2>Props</H2>
      <Props of="Alert" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
