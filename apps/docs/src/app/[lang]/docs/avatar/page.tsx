import { Avatar } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("avatar")!.title[lang] };
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
    initials: (
      <>
        Görsel yoksa <strong>baş harfler</strong>, gri bir silüet değil. Bir silüet bir kişiyi
        temsil etmez, yalnız bir boşluğu doldurur; baş harf ise gerçekten o kişiyi işaret eder ve
        16px&apos;lik bir ikonun yanında bir glif gibi okunur.
      </>
    ),
    withImage: "Görselle",
    rules: "Kurallar",
    name: (
      <>
        <code>name</code> görsel varken de <strong>zorunlu</strong>: görsel yüklenmezse baş
        harfler devreye girer, ve <code>alt</code> metni ondan üretilir. Bir avatarın adı olmadan
        gösterilmesi, ekran okuyucuda &quot;resim&quot; diye okunması demektir.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Birden çok kişi için <Xref to="avatar-stack">Avatar stack</Xref>.
      </>
    ),
  },
  en: {
    initials: (
      <>
        With no image, <strong>initials</strong>, not a grey silhouette. A silhouette represents
        nobody; it only fills a hole. An initial actually points at that person, and next to a
        16px icon it reads like a glyph.
      </>
    ),
    withImage: "With an image",
    rules: "Rules",
    name: (
      <>
        <code>name</code> is <strong>required</strong> even when there is an image: if the image
        fails to load the initials take over, and the <code>alt</code> text is built from it. An
        avatar shown without a name is announced as &quot;image&quot; by a screen reader.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For several people at once, <Xref to="avatar-stack">Avatar stack</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("avatar")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} code={`<Avatar name="Berika Sultan" />
<Avatar name="Deniz Kara" size={32} />
<Avatar name="Selin Aydın" size={48} />`}>
        <Avatar name="Berika Sultan" size={24} />
        <Avatar name="Deniz Kara" size={32} />
        <Avatar name="Selin Aydın" size={40} />
        <Avatar name="Emir Güngör" size={48} />
      </Demo>
      <P>{t.initials}</P>

      <H2>{t.withImage}</H2>
      <Demo labels={dict.demo} code={`<Avatar name="Deniz Kara" src="https://…/deniz.jpg" size={40} />`}>
        <Avatar name="Deniz Kara" size={40} />
        <Avatar name="Ayşe Yıldız" size={40} />
      </Demo>

      <H2>{t.rules}</H2>
      <Note>{t.name}</Note>

      <H2>Props</H2>
      <Props of="Avatar" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
