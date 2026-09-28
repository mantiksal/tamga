import { AvatarStack } from "tamga-ui";
import { YiginOrnek } from "./ornek";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("avatar-stack")!.title[lang] };
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
    edge: (
      <>
        Üst üste binerler ve her biri <strong>arka plan renginde bir halka</strong> taşır, üstteki
        karo alttakini gerçekten keser. Avatarın kendi 1px kenarı yetmiyordu: iki karo bitişince o
        kenarlar tek bir çizgi oluyor ve hangisinin önde olduğu okunmuyordu.
      </>
    ),
    oneLetter: (
      <>
        <strong>Yığındaki karolar tek baş harf gösterir.</strong> İki harf sığmıyor: üstteki karo
        alttakinin sağını keser ve &quot;BS&quot;, &quot;B&quot; ile yarım bir &quot;S&quot; olarak
        okunur. Fotoğrafta bu sorun değil, çünkü yarım bir yüz hâlâ bir yüzdür; bir harf ise yarım
        okunamaz. Tek başına duran <Xref to="avatar">Avatar</Xref> iki harf taşımaya devam ediyor.
      </>
    ),
    surface: (
      <>
        <code>surface</code> halkanın rengi, yani yığının <em>arkasındaki</em> zemin. Varsayılan
        kart zemini, çünkü bir ekip listesi neredeyse her zaman bir kartın içindedir; sayfa
        zemininde duracaksa çağıran onu söyler.
      </>
    ),
    a11y: (
      <>
        Karoların baş harfleri <code>aria-hidden</code>: üst üste binmiş harfler ekran okuyucuda
        anlamsız bir dizi olurdu. Adlar bir kez, düz metin olarak veriliyor.
      </>
    ),
    rules: "Kurallar",
    ekip: ["Elif Yıldız", "Mert Aksoy", "Zeynep Kaya", "Can Öztürk"],
    ekle: "+ Kişi",
    cikar: "− Kişi",
    kacKisi: "3 kişi",
    inceliyor: "bu siparişi inceliyor",
    artan: (
      <>
        Son karo bir kişi değil bir <strong>özet</strong>: sayıyı taşıyor ve bu yüzden kendi
        tabanını da taşıyor · yüzlerin dizisinden böyle ayrılıyor.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Tek kişi için <Xref to="avatar">Avatar</Xref>.
      </>
    ),
  },
  en: {
    edge: (
      <>
        They overlap, and each carries a <strong>ring in the background colour</strong>, so the one
        on top genuinely cuts into the one beneath. The avatar&apos;s own 1px edge was not enough:
        two adjacent tiles turn those edges into a single line, and which one is in front stops
        being readable.
      </>
    ),
    oneLetter: (
      <>
        <strong>Tiles in a stack show one initial.</strong> Two do not fit: the tile on top cuts
        off the right of the one beneath, and &quot;BS&quot; reads as &quot;B&quot; plus half an
        &quot;S&quot;. On a photograph this is not a problem: half a face is still a face, but
        half a letter cannot be read. A standalone <Xref to="avatar">Avatar</Xref> still carries
        two.
      </>
    ),
    surface: (
      <>
        <code>surface</code> is the ring&apos;s colour, meaning the ground <em>behind</em> the
        stack. It defaults to the card surface, because a team list is almost always inside a card;
        if it sits on the page ground, the caller says so.
      </>
    ),
    a11y: (
      <>
        The tiles&apos; initials are <code>aria-hidden</code>: overlapping letters would be a
        meaningless string in a screen reader. The names are given once, as plain text.
      </>
    ),
    rules: "Rules",
    ekip: ["Elif Yıldız", "Mert Aksoy", "Zeynep Kaya", "Can Öztürk"],
    ekle: "+ Person",
    cikar: "− Person",
    kacKisi: "3 people",
    inceliyor: "are looking at this order",
    artan: (
      <>
        The last tile is not a person but a <strong>summary</strong>: it carries a number, and
        that is why it also carries its own base · it is how it steps out of the row of faces.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For one person, <Xref to="avatar">Avatar</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("avatar-stack")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo
        labels={dict.demo}
        code={`<AvatarStack names={${JSON.stringify(t.ekip)}} extra={8} size={38} />

<span className="flex items-center gap-2.5">
  <AvatarStack names={${JSON.stringify(t.ekip.slice(0, 3))}} size={26} />
  <strong>${t.kacKisi}</strong> ${t.inceliyor}
</span>`}
      >
        <div className="flex flex-col gap-6">
          <AvatarStack names={t.ekip} extra={8} size={38} />
          <span className="text-body text-ink-faint flex items-center gap-2.5">
            <AvatarStack names={t.ekip.slice(0, 3)} size={26} />
            <span>
              <strong className="text-ink">{t.kacKisi}</strong> {t.inceliyor}
            </span>
          </span>
          <YiginOrnek kisiler={t.ekip} ekle={t.ekle} cikar={t.cikar} />
        </div>
      </Demo>
      <P>{t.edge}</P>
      <P>{t.artan}</P>
      <P>{t.oneLetter}</P>

      <H2>{t.rules}</H2>
      <Note>{t.surface}</Note>
      <Note>{t.a11y}</Note>

      <H2>Props</H2>
      <Props of="AvatarStack" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
