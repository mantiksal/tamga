import { Alert, Button } from "tamga-ui";
import { UyariOrnegi } from "./ornek";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { sayfaMeta } from "@/content/meta";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return sayfaMeta("alert", lang);
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
    tekH: "Tek satır da olur",
    tekP: (
      <>
        Gövde zorunlu değil: yalnız başlıklı bir uyarı tek satır. O zaman karo, eylem ve kapatma
        düğmesi başlıkla <strong>ortalanır</strong>; gövdeli uyarıda ise başlığın ilk satırına
        hizalanırlar. İkisi de aynı bileşen, karar gövdenin olup olmamasından geliyor.
      </>
    ),
    tekKaydedildi: "Değişiklikler kaydedildi",
    tekYedek: "Yedekleme bu gece 03:00'te çalışacak",
    tekSinir: "Günlük istek sınırına yaklaştın",
    tekSertifika: "Sertifika 3 gün içinde doluyor",
    tekYenile: "Yenile",
    tekBildirim: "Bildirim ayarları güncellendi",
    bannerH: "Sayfa düzeyinde durum kutusu",
    bannerP: (
      <>
        <code>look</code> iki görünüm: <strong>inline</strong> (varsayılan) sayfanın içindeki sessiz
        kutu; <strong>banner</strong> bir nesnenin sayfasının en üstündeki tek cümlelik durum kutusu:
        &laquo;mağaza erişilemiyor&raquo;, &laquo;çalışıyor&raquo;, &laquo;bakımda&raquo;. Kartın
        koyu kenarı ve sert gölgesi, 44px karo, gösterim yüzüyle başlık, gövde boyunda metin. Satır
        içi uyarı o yerde küçük ve kenarsız kalıyordu. Altı ton aynı kutuda; eylem ve kapatma
        karonun ortasına hizalı.
      </>
    ),
    alignP: (
      <>
        <code>actionAlign</code> eylemin yeri: <strong>start</strong> (varsayılan) başlığın ilk
        satırında, karo gibi; <strong>center</strong> başlık ve gövdenin oluşturduğu bloğun
        ortasında · iki satırlık bir paragrafı bağlayan düğme yukarıda asılı kalmasın diye.
      </>
    ),
    bNotr: "Bakım penceresi planlandı", bNotrAlt: "Pazartesi 03:00'te 20 dakika kapalı kalacak.", bNotrEylem: "Takvimi gör",
    bBilgi: "Yeni sürüm hazır", bBilgiAlt: "Mağaza şablonunun 4.2 sürümü bu gece uygulanacak.",
    bOlumlu: "Mağaza çalışıyor", bOlumluAlt: "Son 24 saatte kesinti yok; ortalama yanıt 180 ms.",
    bUyari: "Sertifika 3 gün içinde doluyor", bUyariAlt: "Yenilenmezse ziyaretçiler güvenlik uyarısı görecek.", bUyariEylem: "Yenile",
    bYuksek: "Yanıt süresi yükseldi", bYuksekAlt: "Son bir saatte ortalama 2,4 saniye; eşik 1 saniye.",
    bTehlike: "Mağaza şu an erişilemiyor", bTehlikeAlt: "Son kontrol 2 dakika önce; sunucu yanıt vermedi.", bTehlikeEylem: "Yeniden dene",
    tekUzun: "Bu adresi izleyeceğiz: https://example.com/magaza/ayarlar/bildirimler",
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
    tekH: "One line is fine too",
    tekP: (
      <>
        The body is optional: a title-only alert is one line. Then the tile, the action and the
        dismiss button are <strong>centred</strong> on the title; with a body they line up with
        the title&apos;s first line. Same component, the decision comes from whether there is a
        body.
      </>
    ),
    tekKaydedildi: "Changes saved",
    tekYedek: "The backup runs tonight at 03:00",
    tekSinir: "You are close to the daily request limit",
    tekSertifika: "The certificate expires in 3 days",
    tekYenile: "Renew",
    tekBildirim: "Notification settings updated",
    bannerH: "The page-level status box",
    bannerP: (
      <>
        <code>look</code> has two looks: <strong>inline</strong> (the default) is the quiet box
        inside a page; <strong>banner</strong> is the one-sentence status box at the top of an
        object&apos;s page: &ldquo;the store is down&rdquo;, &ldquo;running&rdquo;, &ldquo;in
        maintenance&rdquo;. The card&apos;s strong edge and hard shadow, a 44px tile, a display-face
        title, body copy at body size. The inline alert looked small and edgeless in that spot. All
        six tones in the same box; the action and the dismiss sit on the tile&apos;s centre.
      </>
    ),
    alignP: (
      <>
        <code>actionAlign</code> places the action: <strong>start</strong> (default) on the
        title&apos;s first line, as the tile; <strong>center</strong> on the middle of the title and
        body block, so a button that closes a two-line paragraph does not hang at its top.
      </>
    ),
    bNotr: "Maintenance window scheduled", bNotrAlt: "Closed for 20 minutes on Monday at 03:00.", bNotrEylem: "See the calendar",
    bBilgi: "A new version is ready", bBilgiAlt: "Store template 4.2 rolls out tonight.",
    bOlumlu: "The store is running", bOlumluAlt: "No outage in the last 24 hours; average response 180 ms.",
    bUyari: "The certificate expires in 3 days", bUyariAlt: "Unless renewed, visitors will see a security warning.", bUyariEylem: "Renew",
    bYuksek: "Response time is up", bYuksekAlt: "2.4 seconds on average over the last hour; the threshold is 1 second.",
    bTehlike: "The store is unreachable right now", bTehlikeAlt: "Last check 2 minutes ago; the server did not answer.", bTehlikeEylem: "Try again",
    tekUzun: "We will watch this address: https://example.com/store/settings/notifications",
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

      <H2>{t.bannerH}</H2>
      <P>{t.bannerP}</P>
      <P>{t.alignP}</P>
      <Demo
        labels={dict.demo}
        align="start"
        code={`<Alert look="banner" state="danger" title="${t.bTehlike}" action={<Button size="sm">${t.bTehlikeEylem}</Button>}>
  ${t.bTehlikeAlt}
</Alert>
<Alert look="banner" state="positive" title="${t.bOlumlu}">
  ${t.bOlumluAlt}
</Alert>
<Alert look="banner" state="caution" title="${t.bUyari}" action={…}>…</Alert>
<Alert look="banner" state="elevated" title="${t.bYuksek}">…</Alert>
<Alert look="banner" state="info" title="${t.bBilgi}" dismissLabel="${t.kapat}" onDismiss={…}>…</Alert>
<Alert look="banner" state="neutral" title="${t.bNotr}" action={…}>…</Alert>`}
      >
        <div className="flex w-full flex-col gap-6" data-banner-ornek>
          <Alert look="banner" state="danger" title={t.bTehlike} action={<Button size="sm">{t.bTehlikeEylem}</Button>}>
            {t.bTehlikeAlt}
          </Alert>
          <Alert look="banner" state="positive" title={t.bOlumlu}>
            {t.bOlumluAlt}
          </Alert>
          <Alert look="banner" state="caution" title={t.bUyari} action={<Button size="sm">{t.bUyariEylem}</Button>}>
            {t.bUyariAlt}
          </Alert>
          <Alert look="banner" state="elevated" title={t.bYuksek}>
            {t.bYuksekAlt}
          </Alert>
          <UyariOrnegi kapat={t.kapat} geriGetir={t.geriGetir} look="banner" uyarilar={[{ state: "info", title: t.bBilgi, body: t.bBilgiAlt }]} />
          <Alert look="banner" state="neutral" title={t.bNotr} action={<Button size="sm">{t.bNotrEylem}</Button>}>
            {t.bNotrAlt}
          </Alert>
        </div>
      </Demo>

      <H2>{t.tekH}</H2>
      <P>{t.tekP}</P>
      <Demo
        labels={dict.demo}
        align="start"
        code={`<Alert state="positive" title="${t.tekKaydedildi}" />
<Alert state="info" title="${t.tekYedek}" />
<Alert state="caution" title="${t.tekSinir}" />
<Alert state="danger" title="${t.tekSertifika}" action={<Button size="sm">${t.tekYenile}</Button>} />
<Alert state="info" title="${t.tekBildirim}" dismissLabel="${t.kapat}" onDismiss={…} />
<Alert state="info" title="${t.tekUzun}" dismissLabel="${t.kapat}" onDismiss={…} />`}
      >
        <div className="flex w-full flex-col items-start gap-4">
          <Alert state="positive" title={t.tekKaydedildi} />
          <Alert state="info" title={t.tekYedek} />
          <Alert state="caution" title={t.tekSinir} />
          <Alert state="danger" title={t.tekSertifika} action={<Button size="sm">{t.tekYenile}</Button>} />
          <UyariOrnegi kapat={t.kapat} geriGetir={t.geriGetir} uyarilar={[{ state: "info", title: t.tekBildirim }, { state: "info", title: t.tekUzun }]} />
        </div>
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.notToast}</Note>

      <H2>Props</H2>
      <Props of="Alert" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
