import { ErrorState } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("error-state")!.title[lang] };
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
        Bir şey yüklenemediğinde ekranda ne yazacağı bir tasarım kararı değil, bir{" "}
        <strong>destek kararı</strong>: yazan şey, kullanıcı sana yazdığında sorunu bulmana
        yetmelidir.
      </>
    ),
    title: "Siparişler yüklenemedi",
    desc: "Bağlantı kurulamadı. Birkaç saniye sonra tekrar dene.",
    retry: "Tekrar dene",
    compact: "Sıkışık hâli",
    compactWhy: "Bir kartın ya da panelin içinde, tüm sayfa değilken:",
    chartTitle: "Grafik çizilemedi",
    two: "İki cümle, iki okuyucu",
    twoWhy: (
      <>
        <code>description</code> düz kelimelerle yazılır: &quot;bağlantı kurulamadı&quot;, &quot;bu
        sayfayı görme yetkin yok&quot;. <code>detail</code> hiç çevrilmez ve hiç yorumlanmaz;
        olduğu gibi basılır, çünkü kopyalanıp yapıştırılacaktır.
      </>
    ),
    rules: "Kurallar",
    detail: (
      <>
        <strong>Teknik satırda tam olarak iki şey olur: <code>code</code> ve{" "}
        <code>request_id</code>.</strong> HTTP durumu değil: <code>code</code> neyin bozulduğunun
        makine adıdır (çevrilmez, ve destek de programatik istemci de ona bakar),{" "}
        <code>request_id</code> ise bu hatayı sunucu günlüğündeki satırla eşleştiren şeydir.
        &quot;500 Internal Server Error&quot; ikisini de yapmaz.
      </>
    ),
    notEmpty: (
      <>
        Bir şey <em>bozulmadıysa</em>, yalnızca <em>boşsa</em>, bu bileşen değil:{" "}
        <Xref to="empty-state">Empty state</Xref>. İkisini karıştırmak, boş bir listeyi hata gibi
        göstermek demektir.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Sayfada kalan uyarı <Xref to="alert">Alert</Xref>; gelip geçen bildirim{" "}
        <Xref to="toast">Toast</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        What appears on screen when something fails to load is not a design decision but a{" "}
        <strong>support decision</strong>: what it says must be enough for you to find the problem
        when the user writes to you.
      </>
    ),
    title: "Orders could not be loaded",
    desc: "The connection failed. Try again in a few seconds.",
    retry: "Try again",
    compact: "The compact form",
    compactWhy: "Inside a card or a panel, when it is not the whole page:",
    chartTitle: "The chart could not be drawn",
    two: "Two sentences, two readers",
    twoWhy: (
      <>
        <code>description</code> is written in plain words: &quot;the connection failed&quot;,
        &quot;you do not have access to this page&quot;. <code>detail</code> is never translated
        and never interpreted; it is printed as it is, because it will be copied and pasted.
      </>
    ),
    rules: "Rules",
    detail: (
      <>
        <strong>The technical line holds exactly two things: <code>code</code> and{" "}
        <code>request_id</code>.</strong> Not the HTTP status: <code>code</code> is the machine
        name of what broke (never translated, and both support and a programmatic client read it),
        while <code>request_id</code> is what matches this error to a line in the server log.
        &quot;500 Internal Server Error&quot; does neither.
      </>
    ),
    notEmpty: (
      <>
        If nothing <em>broke</em> and the thing is merely <em>empty</em>, this is not the
        component: <Xref to="empty-state">Empty state</Xref>. Confusing the two means showing an
        empty list as an error.
      </>
    ),
    related: "Related",
    rel: (
      <>
        A warning that stays on the page is <Xref to="alert">Alert</Xref>; a passing notification
        is <Xref to="toast">Toast</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("error-state")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<ErrorState
  title="${t.title}"
  description="${t.desc}"
  detail="quota_exceeded · req_8f2ac41e"
  onRetry={refetch}
  retryLabel="${t.retry}"
/>`}>
        <div className="w-full">
          <ErrorState
            title={t.title}
            description={t.desc}
            detail="quota_exceeded · req_8f2ac41e"
            retryLabel={t.retry}
          />
        </div>
      </Demo>

      <H2>{t.compact}</H2>
      <P>{t.compactWhy}</P>
      <Demo labels={dict.demo} align="start" code={`<ErrorState compact title="${t.chartTitle}" detail="timeout · req_1c04" />`}>
        <div className="tamga-card w-full p-6">
          <ErrorState compact title={t.chartTitle} detail="timeout · req_1c04b8" />
        </div>
      </Demo>

      <H2>{t.two}</H2>
      <div className="docs-code my-6">{`title        ${lang === "tr" ? "ne olmadı            → herkes" : "what failed          → everyone"}
description  ${lang === "tr" ? "şimdi ne yapabilir   → kullanan kişi" : "what to do now       → the person using it"}
detail       code · request_id    → ${lang === "tr" ? "sen ve destek" : "you and support"}`}</div>
      <P>{t.twoWhy}</P>

      <H2>{t.rules}</H2>
      <Note>{t.detail}</Note>
      <Note>{t.notEmpty}</Note>

      <H2>Props</H2>
      <Props of="ErrorState" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
