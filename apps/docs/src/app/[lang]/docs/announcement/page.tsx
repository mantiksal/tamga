import { Announcement, Button, Link } from "tamga-ui";
import { Lightning } from "tamga-ui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("announcement")!.title[lang] };
}

/**
 * Sayfa metni, iki dilli.
 *
 * Neden burada ve sözlükte değil: bir doküman paragrafını JSON anahtarına
 * çevirmek onu okunamaz hâle getirir ve yapıyı metinden koparır. Sözlük ARAYÜZ
 * metinleri içindir; sayfa içeriği sayfayla yaşar.
 */
const T = {
  tr: {
    lead: (
      <>
        Sayfanın en üstünde, tüm genişliği kaplayan şerit. Bir <em>ekranın</em> değil{" "}
        <em>hesabın</em> durumunu söyler: kampanya yaklaşıyor, test modundasın, fatura gecikti.
      </>
    ),
    kampanyaBaslik: "Efsane Cuma 3 gün sonra",
    kampanyaMetin: "İndirim kurallarını ve stok hedeflerini şimdiden hazırla.",
    kampanyaEylem: "Kampanyaya git",
    testTag: "TEST MODU",
    testMetin:
      "Ödemeler gerçek karttan çekilmiyor. Canlıya almadan önce sağlayıcı ayarlarını tamamla.",
    ayarlar: "Ayarlar",
    ikiSes: (
      <>
        <strong>İki ses, iki iş.</strong> <code>loud</code> dolu vurgu: okuyanın bir şey{" "}
        <strong>yapması</strong> gereken durum, ve bu kitte dolgu zaten eylem demek.{" "}
        <code>quiet</code> yıkama: yalnız <strong>okunması</strong> yeten, duran bir koşul · o
        yüzden tabanı da yok, çünkü yükselmeyen şerit sayfadan bir şey istemiyor.
      </>
    ),
    murekkep: (
      <>
        <strong>Dolu şeridin mürekkebi iki temada da <code>--color-accent-ink</code>.</strong>{" "}
        Tasarımın kendi dosyası orada açık maviyi kullanıyor ve bu koyu temada tutmuyor:{" "}
        <code>--color-accent-soft</code> iki temada sabit, <code>--color-accent</code> ise koyuda
        açılıyor, ve çift <strong>1.61</strong>&apos;e düşüyor. Hiyerarşi bu yüzden renkten değil{" "}
        <strong>boy ve ağırlıktan</strong> geliyor.
      </>
    ),
    tek: (
      <>
        Bir sayfada <strong>tek</strong> şerit. İki duyuru üst üste bindiğinde ikisi de okunmaz
        olur; ikinci bir şey söylenecekse yeri sayfanın içi, tepesi değil.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Bir ekranın kendi içindeki kalıcı mesaj <Xref to="alert">Alert</Xref>; geçici olanı{" "}
        <Xref to="toast">Toast</Xref>. Sayfanın başlığı <Xref to="page-band">Page band</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        A strip across the very top of the page. It reports the state of the{" "}
        <em>account</em> rather than of a <em>screen</em>: a campaign is coming, you are in test
        mode, an invoice is late.
      </>
    ),
    kampanyaBaslik: "Black Friday in 3 days",
    kampanyaMetin: "Set your discount rules and stock targets now.",
    kampanyaEylem: "Go to campaign",
    testTag: "TEST MODE",
    testMetin: "Cards are not charged. Finish the provider settings before you go live.",
    ayarlar: "Settings",
    ikiSes: (
      <>
        <strong>Two voices, two jobs.</strong> <code>loud</code> is the filled accent: something
        the reader should <strong>act</strong> on, and in this kit a fill already means action.{" "}
        <code>quiet</code> is the wash: a standing condition that only needs to be{" "}
        <strong>read</strong> · which is why it carries no base, since a strip that does not
        lift is not asking for anything.
      </>
    ),
    murekkep: (
      <>
        <strong>The filled strip&apos;s ink is <code>--color-accent-ink</code> in both themes.</strong>{" "}
        The design&apos;s own file uses light blue there and that does not hold in dark:{" "}
        <code>--color-accent-soft</code> is fixed across themes while <code>--color-accent</code>{" "}
        lightens, and the pair falls to <strong>1.61</strong>. Hierarchy therefore comes from{" "}
        <strong>size and weight</strong>, not colour.
      </>
    ),
    tek: (
      <>
        <strong>One</strong> strip per page. Two stacked announcements leave neither of them
        read; if there is a second thing to say, it belongs in the page, not above it.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        A message that stays inside a screen is <Xref to="alert">Alert</Xref>; a passing one is{" "}
        <Xref to="toast">Toast</Xref>. The page&apos;s own title is{" "}
        <Xref to="page-band">Page band</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("announcement")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo
        labels={dict.demo}
        align="start"
        code={`<Announcement
  icon={Lightning}
  title="${t.kampanyaBaslik}"
  action={<Button variant="soft">${t.kampanyaEylem}</Button>}
>
  ${t.kampanyaMetin}
</Announcement>

<Announcement look="quiet" tag="${t.testTag}" action={<Link href="/settings">${t.ayarlar}</Link>}>
  ${t.testMetin}
</Announcement>`}
      >
        <div className="flex w-full flex-col gap-4">
          <Announcement
            icon={Lightning}
            title={t.kampanyaBaslik}
            action={<Button variant="soft">{t.kampanyaEylem}</Button>}
          >
            {t.kampanyaMetin}
          </Announcement>
          <Announcement
            look="quiet"
            tag={t.testTag}
            action={<Link href="#announcement">{t.ayarlar}</Link>}
          >
            {t.testMetin}
          </Announcement>
        </div>
      </Demo>
      <P>{t.ikiSes}</P>
      <P>{t.murekkep}</P>

      <H2>{t.rules}</H2>
      <Note>{t.tek}</Note>

      <H2>Props</H2>
      <Props of="Announcement" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
