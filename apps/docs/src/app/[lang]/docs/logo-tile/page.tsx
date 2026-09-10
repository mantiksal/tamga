import { LogoTile } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("logo-tile")!.title[lang] };
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
        Bir logonun etrafındaki kare kutu. Görsel yoksa <strong>baş harf</strong>,{" "}
        <Xref to="avatar">Avatar</Xref>&apos;la aynı gerekçe: gri bir yer tutucu hiçbir şeyi
        temsil etmez, bir harf gerçekten o şeyi işaret eder.
      </>
    ),
    alt: (
      <>
        <code>alt</code> bilerek <strong>boş</strong>. Karo neredeyse her zaman adı yanında yazan
        bir şeyin yanında durur; ikisini de okutmak ekran okuyucuda adı iki kez tekrarlar.
      </>
    ),
    rel: (
      <>
        Bir kişi için <Xref to="avatar">Avatar</Xref>; satır içinde kullanımı{" "}
        <Xref to="list-row">List row</Xref>.
      </>
    ),
    twice: (
      <>
        <strong>Bu bileşen iki yerde birden yazılmıştı</strong>: dashboard-v5&apos;te ve bu kitin
        doküman sitesinde, birbirinden habersizce. İkisi de aynı kararları vermek zorunda kaldı.
        Bir mekanizmanın kite ait olduğunun en güçlü kanıtı budur: iki proje onu yeniden icat
        etmişse, o mekanizma ikisinin de altındadır.
      </>
    ),
    size: (
      <>
        <code>base</code> 48px (varsayılan), <code>sm</code> 40px; ikincisi bir liste satırının
        içine sığması gerektiğinde.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
  },
  en: {
    lead: (
      <>
        The square box around a logo. With no image, an <strong>initial</strong>, the same
        reasoning as <Xref to="avatar">Avatar</Xref>: a grey placeholder represents nothing, a
        letter actually points at the thing.
      </>
    ),
    alt: (
      <>
        <code>alt</code> is deliberately <strong>empty</strong>. The tile almost always sits next
        to something whose name is written beside it; announcing both repeats the name twice.
      </>
    ),
    rel: (
      <>
        For a person, <Xref to="avatar">Avatar</Xref>; used inside a row,{" "}
        <Xref to="list-row">List row</Xref>.
      </>
    ),
    twice: (
      <>
        <strong>This component had been written in two places</strong>: in dashboard-v5 and in
        this kit&apos;s own docs site, independently. Both had to make the same decisions. That is
        the strongest evidence a mechanism belongs in the kit: if two projects reinvented it, it
        sits underneath both.
      </>
    ),
    size: (
      <>
        <code>base</code> is 48px (the default), <code>sm</code> is 40px; the second for when it
        has to fit inside a list row.
      </>
    ),
    rules: "Rules",
    related: "Related",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("logo-tile")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} code={`<LogoTile name="Slack" />
<LogoTile name="Webhook" size="sm" />`}>
        <LogoTile name="Slack" />
        <LogoTile name="PagerDuty" />
        <LogoTile name="Webhook" size="sm" />
      </Demo>

      <P>{t.size}</P>

      <H2>{t.rules}</H2>
      <Note>{t.alt}</Note>
      <Note>{t.twice}</Note>

      <H2>Props</H2>
      <Props of="LogoTile" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
