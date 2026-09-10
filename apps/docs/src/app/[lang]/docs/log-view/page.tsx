import { LogViewDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("log-view")!.title[lang] };
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
        Bir panelde log göstermek <code>&lt;pre&gt;</code> yazmaktan ibaret <em>görünür</em>, ve
        değildir. Üç şey ayrı ayrı yanlış gider.
      </>
    ),
    scroll: (
      <>
        <strong>Kaydırma yalnız zaten alttaysa yapılıyor.</strong> Yukarıda bir şey okuyan kişiyi
        her yeni satırda aşağı fırlatmak, bu bileşenin yapabileceği en can sıkıcı şey, ve
        &quot;hep en alta git&quot; davranışının varsayılan olduğu her log görüntüleyicide
        yaşanır.
      </>
    ),
    aria: (
      <>
        <code>role=&quot;log&quot;</code> var ama <code>aria-live</code>{" "}
        <strong>yok</strong>, ve bu bilinçli: saniyede üç satır akan bir bölgeyi duyurmak sesli
        okuyucuyu kullanılamaz hâle getirir. Rol, ekran okuyucunun bunu bir günlük olarak
        tanımasını sağlıyor; kullanıcı isterse kendisi okur.
      </>
    ),
    time: (
      <>
        Zaman damgası <strong>sabit genişlikte</strong> ve <code>tabular-nums</code>: değişken
        genişlikli rakamlarda her satırın metni birkaç piksel kayar ve sütun okunmaz olur.
      </>
    ),
    wrap: (
      <>
        <code>wrap</code> kapalıyken satırlar yatay kayar. Sarmak zaman damgası hizasını bozar,
        kesmek bilgiyi yok eder, o yüzden üçüncü yol.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Klavyeyle kaydırılabilir taşma için <Xref to="scroll-x">Scroll x</Xref>; tek bir komut
        için <Xref to="code">Code</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        Showing logs in a panel <em>looks</em> like writing a <code>&lt;pre&gt;</code>, and it is
        not. Three separate things go wrong.
      </>
    ),
    scroll: (
      <>
        <strong>It only scrolls if you were already at the bottom.</strong> Throwing someone
        reading further up down to the end on every new line is the most irritating thing this
        component can do, and it happens in every log viewer where &quot;always jump to the
        bottom&quot; is the default.
      </>
    ),
    aria: (
      <>
        <code>role=&quot;log&quot;</code> is there but <code>aria-live</code> is{" "}
        <strong>not</strong>, deliberately: announcing a region that streams three lines a second
        makes a screen reader unusable. The role lets the reader recognise it as a log; the user
        reads it when they choose to.
      </>
    ),
    time: (
      <>
        The timestamp is <strong>fixed width</strong> and <code>tabular-nums</code>: with variable
        width digits every line&apos;s text shifts by a few pixels and the column becomes
        unreadable.
      </>
    ),
    wrap: (
      <>
        With <code>wrap</code> off, lines scroll horizontally. Wrapping breaks the timestamp
        alignment and truncating destroys information, hence the third way.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        For keyboard-scrollable overflow, <Xref to="scroll-x">Scroll x</Xref>; for a single
        command, <Xref to="code">Code</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("log-view")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" grid={false} code={`<LogView
  lines={lines}
  label="…"
  height={320}
  follow
/>`}>
        <div className="w-full">
          <LogViewDemo lang={lang} />
        </div>
      </Demo>
      <P>{t.time}</P>
      <P>{t.wrap}</P>

      <H2>{t.rules}</H2>
      <Note>{t.scroll}</Note>
      <Note>{t.aria}</Note>

      <H2>Props</H2>
      <Props of="LogView" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
