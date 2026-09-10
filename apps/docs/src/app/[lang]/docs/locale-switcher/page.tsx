import { LocaleSwitcherDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("locale-switcher")!.title[lang] };
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
        İki dilde <strong>segmented</strong>, üç ve fazlasında <strong>select</strong>,
        kendiliğinden. İki seçenek yan yana sığar ve tek tıkla değişir; beş dil yan yana konursa
        üst şeridi doldurur ve altıncı dilde taşar.
      </>
    ),
    noRouting: (
      <>
        <strong>Kit yönlendirme yapmaz.</strong> <code>onChange</code> seçilen dili verir;
        nereye gidileceği, <code>router.push</code>, tam sayfa yenileme, bir çerez yazıp yeniden
        yükleme, uygulamanın kararı ve yönlendiricisine bağlı. Kitin{" "}
        <code>next/navigation</code>&apos;a bağlanması, onu bir framework&apos;e bağlamak olurdu.
      </>
    ),
    endonym: (
      <>
        Etiketler <strong>endonim</strong> olmalı: &quot;English&quot;, &quot;İngilizce&quot;
        değil. Bir dili arayan kişi onu kendi dilinde arar. Kit bunu zorlayamaz; çeviri
        çağıranın işi, ama doğrusu budur.
      </>
    ),
    rel: (
      <>
        Üst şeritteki komşusu <Xref to="theme-toggle">Theme toggle</Xref>; iki akran arasında
        seçim <Xref to="segmented">Segmented</Xref>.
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
    rules: "Kurallar",
    related: "İlgili",
  },
  en: {
    lead: (
      <>
        <strong>Segmented</strong> for two languages, a <strong>select</strong> for three or more,
        on its own. Two options fit side by side and switch in one click; five languages side
        by side fill the top bar and overflow at the sixth.
      </>
    ),
    noRouting: (
      <>
        <strong>The kit does not navigate.</strong> <code>onChange</code> hands you the chosen
        language; where to go, <code>router.push</code>, a full reload, writing a cookie and
        reloading, is the application&apos;s decision and depends on its router. Binding the kit
        to <code>next/navigation</code> would bind it to a framework.
      </>
    ),
    endonym: (
      <>
        Labels should be <strong>endonyms</strong>: &quot;Türkçe&quot;, not &quot;Turkish&quot;.
        Somebody looking for a language looks for it in that language. The kit cannot enforce it;
        translation is the caller&apos;s job, but this is the right answer.
      </>
    ),
    rel: (
      <>
        Its neighbour in the top bar is <Xref to="theme-toggle">Theme toggle</Xref>; a choice
        between two peers is <Xref to="segmented">Segmented</Xref>.
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
    rules: "Rules",
    related: "Related",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("locale-switcher")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<LocaleSwitcher
  locales={[{ value: "tr", label: "Türkçe" }, { value: "en", label: "English" }]}
  current={lang}
  onChange={(next) => router.push(\`/\${next}\`)}
  label="…"
/>`}>
        <LocaleSwitcherDemo lang={lang} />
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.noRouting}</Note>
      <Note>{t.endonym}</Note>
      <Note>{t.twice}</Note>

      <H2>Props</H2>
      <Props of="LocaleSwitcher" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
