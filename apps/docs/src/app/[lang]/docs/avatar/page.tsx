import { Avatar } from "tamga-ui";
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
  return sayfaMeta("avatar", lang);
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
    foto: "foto",
    durumH: "Köşedeki durum",
    durumP: (
      <>
        <code>status</code> karonun sağ alt köşesine tonun kendi rengiyle bir kare koyuyor:
        avatarda rengin izinli olduğu <strong>tek yer</strong>. Karo tek renkli kalıyor çünkü
        kimlik metindir; bu kare kimlik değil <strong>sağlık</strong>. Varsayılanı yok · her
        avatarda duran bir işaret, kimsenin yazmadığı bir lejant olurdu.
      </>
    ),
    kisi: "Elif Yıldız",
    rol: "Mağaza yöneticisi",
    yanyana: (
      <>
        Adın yanında: avatar <strong>40px</strong>, ad ve rol iki satır · satır yüksekliği
        sıkışık, çünkü ikisi tek bir blok olarak okunmalı.
      </>
    ),
    hesapH: "Şeritteki hesap düğmesi",
    hesapP: (
      <>
        <code>AccountButton</code> avatarı şeridin ölçüsüne oturtuyor: kare, <code>--control</code>{" "}
        (40px), yani tema anahtarıyla ve öteki simge düğmeleriyle birebir aynı. Bir araç
        çubuğunda yükseklik tek karardır; tek bir kontrolün farklı durması bütün şeridi hizasız
        gösteriyor. İki panelde de bu elle kuruldu (<code>tamga-icon-btn</code> içine{" "}
        <code>bare</code> bir avatar) ve ikincisinde <code>bare</code> bulunamadığı için avatar
        kendi çerçevesiyle kondu: kutu içinde kutu. Bulunmayan bir prop, olmayan proptur.
      </>
    ),
    olcek: (
      <>
        <strong>Köşe ölçüyle birlikte büyüyor</strong> (4 · 5 · 7 · 8): 24 pikselde 8&apos;lik
        bir köşe kareyi daireye yaklaştırıyor, 56&apos;da 4&apos;lük bir köşe onu keskin
        bırakıyor. <strong>Taban yalnız büyüklerde</strong> (40&apos;tan itibaren): 24 piksellik
        bir karo bir satırın içinde duruyor ve orada bir taban satırı kalabalıklaştırıyor. İki
        dolgu var, <code>solid</code> ve <code>soft</code> · bir palet değil, çünkü avatar bir
        durum değil.
      </>
    ),
    rules: "Kurallar",
    name: (
      <>
        <code>name</code> görsel varken de <strong>zorunlu</strong>: <code>alt</code> metni ondan
        üretiliyor, ve görsel yokken karoya düşen baş harfler de. Bir avatarın adı olmadan
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
    foto: "photo",
    durumH: "The mark in the corner",
    durumP: (
      <>
        <code>status</code> puts a square in the tile&apos;s bottom-right corner in the
        tone&apos;s own colour: the <strong>one place</strong> colour is allowed on an avatar.
        The tile stays monochrome because identity is text; this square is not identity but{" "}
        <strong>health</strong>. There is no default · a mark on every avatar would be a legend
        nobody wrote.
      </>
    ),
    kisi: "Elif Yıldız",
    rol: "Store manager",
    yanyana: (
      <>
        Beside a name: the avatar at <strong>40px</strong>, name and role on two tight lines,
        because the pair has to read as one block.
      </>
    ),
    hesapH: "The account button in the top bar",
    hesapP: (
      <>
        <code>AccountButton</code> fits the avatar to the bar&apos;s measure: a square at{" "}
        <code>--control</code> (40px), exactly like the theme toggle and every other icon button.
        On a toolbar, height is one decision; a single control standing at a different size makes
        the whole strip look misaligned. Both panels built this by hand (a <code>bare</code>{" "}
        avatar inside <code>tamga-icon-btn</code>) and in the second one <code>bare</code> was
        never found, so the avatar arrived with its own frame: a box inside a box. A prop nobody
        finds is a prop that does not exist.
      </>
    ),
    olcek: (
      <>
        <strong>The corner grows with the size</strong> (4 · 5 · 7 · 8): at 24px an 8px corner
        turns the square towards a circle, and at 56 a 4px corner leaves it sharp.{" "}
        <strong>Only the large ones carry a base</strong> (from 40 up): a 24px tile lives inside
        a row, and a base there crowds it. There are two fills, <code>solid</code> and{" "}
        <code>soft</code> · not a palette, because an avatar is not a status.
      </>
    ),
    rules: "Rules",
    name: (
      <>
        <code>name</code> is <strong>required</strong> even when there is an image: the{" "}
        <code>alt</code> text is built from it, and so are the initials the tile falls back to
        when there is no image. An avatar shown without a name is announced as &quot;image&quot;
        by a screen reader.
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
      <Demo labels={dict.demo} code={`<Avatar name="${t.kisi}" size={24} letters={1} />
<Avatar name="${t.kisi}" size={32} letters={1} />
<Avatar name="${t.kisi}" size={40} letters={1} />
<Avatar name="Mert Aksoy" size={56} look="soft" />
<Avatar name="Zeynep Kaya" size={40} look="soft" status="info" />`}>
        <Avatar name={t.kisi} size={24} letters={1} />
        <Avatar name={t.kisi} size={32} letters={1} />
        <Avatar name={t.kisi} size={40} letters={1} />
        <Avatar name="Mert Aksoy" size={56} look="soft" />
        <span
          className="tamga-avatar docs-gorsel inline-flex items-center justify-center font-mono text-ink-faint"
          style={{
            width: 56,
            height: 56,
            borderRadius: "var(--radius-card)",
            boxShadow: "4px 4px 0 var(--color-edge-strong)",
            fontSize: 10,
          }}
        >
          {t.foto}
        </span>
        <Avatar name="Zeynep Kaya" size={40} look="soft" status="info" />
        <span className="flex items-center gap-2.5">
          <Avatar name={t.kisi} size={40} letters={1} />
          <span className="flex flex-col leading-tight">
            <strong className="text-body">{t.kisi}</strong>
            <span className="text-caption text-ink-faint">{t.rol}</span>
          </span>
        </span>
      </Demo>
      <P>{t.olcek}</P>
      <P>{t.initials}</P>
      <P>{t.yanyana}</P>

      <H2>{t.durumH}</H2>
      <P>{t.durumP}</P>

      <H2>{t.withImage}</H2>
      <Demo labels={dict.demo} code={`<Avatar name="Tamga" src="/tamga-mark-light.svg" size={40} />`}>
        <Avatar name="Tamga" src="/tamga-mark-light.svg" size={40} />
        <Avatar name="Tamga" src="/tamga-mark-light.svg" size={56} />
      </Demo>

      <H2>{t.hesapH}</H2>
      <P>{t.hesapP}</P>
      <Props of="AccountButton" lang={lang} etiketli />

      <H2>{t.rules}</H2>
      <Note>{t.name}</Note>

      <H2>Props</H2>
      <Props of="Avatar" lang={lang} etiketli />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
