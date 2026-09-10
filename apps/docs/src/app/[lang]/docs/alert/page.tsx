import { Alert, Button } from "tamga-ui";
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

      <H2>{t.rules}</H2>
      <Note>{t.notToast}</Note>

      <H2>Props</H2>
      <Props of="Alert" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
