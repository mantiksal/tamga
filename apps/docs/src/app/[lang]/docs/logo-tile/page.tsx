import { LogoTile } from "tamga-ui";
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
  return sayfaMeta("logo-tile", lang);
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
    surface: (
      <>
        <code>surface</code> karonun <strong>zeminini</strong> seçer. <code>auto</code> sayfanın
        temasını izler. Bir logo bir temaya göre çizilmiştir: koyu temanın beyaz logosu açık
        zeminde kaybolur. Koyuya göre çizilmiş görsel için <code>dark</code>, açığa göre çizilmiş
        için <code>light</code>; zemin, kenar ve baş harf sabit bir üçlü gelir, tema değişince
        karo değişmez.
      </>
    ),
    edge: (
      <>
        <code>edge</code> çerçeveyi seçer. <code>strong</code> (varsayılan) kitin koyu kenarı,
        ürünün kendi markası için. <code>soft</code> ince, açık bir çizgi: bir entegrasyon
        kataloğunda olduğu gibi pek çok üçüncü taraf logosu yan yana dururken, sert çerçeve
        logoların kendisiyle yarışır.
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
    surface: (
      <>
        <code>surface</code> picks the tile&apos;s <strong>ground</strong>. <code>auto</code> follows
        the page&apos;s theme. A logo is drawn for one theme: the dark theme&apos;s white logo
        vanishes on a light ground. Use <code>dark</code> for an image drawn for dark and{" "}
        <code>light</code> for one drawn for light; ground, edge and initial come as a fixed trio,
        and the tile does not change when the theme does.
      </>
    ),
    edge: (
      <>
        <code>edge</code> picks the frame. <code>strong</code> (the default) is the kit&apos;s dark
        edge, for the product&apos;s own brand. <code>soft</code> is a thin, light line: where many
        third-party logos sit side by side, as in an integrations catalogue, a hard frame competes
        with the logos themselves.
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
      <Demo labels={dict.demo} code={`<LogoTile name="Tamga" src="/tamga-mark-light.svg" />
<LogoTile name="Slack" />
<LogoTile name="Webhook" size="sm" />`}>
        <LogoTile name="Tamga" src="/tamga-mark-light.svg" />
        <LogoTile name="Slack" />
        <LogoTile name="PagerDuty" />
        <LogoTile name="Webhook" size="sm" />
      </Demo>

      <P>{t.size}</P>

      <P>{t.surface}</P>
      <Demo labels={dict.demo} code={`<LogoTile name="Tamga" src="/tamga-mark-light.svg" surface="auto" />
<LogoTile name="Tamga" src="/tamga-mark-light.svg" surface="light" />
<LogoTile name="Tamga" src="/tamga-mark-dark.svg" surface="dark" />
<LogoTile name="Koyu" surface="dark" />`}>
        <LogoTile name="Tamga" src="/tamga-mark-light.svg" surface="auto" />
        <LogoTile name="Tamga" src="/tamga-mark-light.svg" surface="light" />
        <LogoTile name="Tamga" src="/tamga-mark-dark.svg" surface="dark" />
        <LogoTile name="Koyu" surface="dark" />
      </Demo>
      <P>{t.edge}</P>
      <Demo labels={dict.demo} code={`<LogoTile name="Slack" edge="strong" />
<LogoTile name="Slack" edge="soft" />`}>
        <LogoTile name="Slack" edge="strong" />
        <LogoTile name="Slack" edge="soft" />
      </Demo>


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
