import { IconButton, Icon } from "tamga-ui";
import { Close, Delete, Edit, Plus, Star } from "tamga-ui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("icon-button")!.title[lang] };
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
    add: "Ekle",
    refresh: "Yenile",
    remove: "Sil",
    size: (
      <>
        <code>size</code> iki değer alır: <code>base</code> (40px, varsayılan) ve <code>sm</code>
        (32px). Daha küçüğü <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
    edit: "Düzenle",
    favourite: "Favori",
    close: "Kapat",
    boylar: (
      <>
        Üç boy: <code>sm</code> 30 piksel (tablo satırı, çip şeridi),{" "}
        <code>base</code> 40 (şeridin ölçüsü · girdi, düğme ve ikon düğmesi aynı satırda) ve{" "}
        <code>lg</code> 50 (tek başına duran bir eylem). <strong>Köşe ölçüyle birlikte
        büyüyor</strong> (5 · 7 · 8): aynı yarıçapı üç boya vermek küçüğü yuvarlak, büyüğü keskin
        gösteriyor.
      </>
    ),
    varyantlar: (
      <>
        Dolgu varyantları düğmeninkiyle aynı sözcükleri konuşuyor:{" "}
        <code>secondary</code> (varsayılan), <code>primary</code>, <code>soft</code>,{" "}
        <code>danger</code> ve <code>ghost</code>. <strong>Ghost duruşta bir nesne değil</strong>{" "}
        · kenarı ve tabanı yok, üstüne gelince beliriyor: otuz satırın her birinde duran bir üç
        nokta, otuz nesne demek olurdu.
      </>
    ),
    rules: "Kurallar",
    label: (
      <>
        <code>aria-label</code> tip olarak zorunlu ama asıl mesele o değil:{" "}
        <strong>içinde metin olmayan bir kontrolün ekran okuyucuda adı yoktur.</strong> Kitin
        kuralı gereği çeviriyi kit yapmaz; hazır metni çağıran geçer.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Metinli hâli <Xref to="button">Button</Xref>; bir girdinin ya da kartın içine
        sığması gereken daha küçüğü <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
  },
  en: {
    add: "Add",
    refresh: "Refresh",
    remove: "Delete",
    size: (
      <>
        <code>size</code> takes two values: <code>base</code> (40px, the default) and{" "}
        <code>sm</code> (32px). Anything smaller is <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
    edit: "Edit",
    favourite: "Favourite",
    close: "Close",
    boylar: (
      <>
        Three sizes: <code>sm</code> 30px (a table row, a chip strip), <code>base</code> 40 (the
        strip&apos;s measure · input, button and icon button on one line) and <code>lg</code> 50
        (an action standing on its own). <strong>The corner grows with the size</strong> (5 · 7 ·
        8): one radius across three sizes makes the small one look round and the large one sharp.
      </>
    ),
    varyantlar: (
      <>
        The fills speak the button&apos;s words: <code>secondary</code> (the default),{" "}
        <code>primary</code>, <code>soft</code>, <code>danger</code> and <code>ghost</code>.{" "}
        <strong>Ghost is not an object at rest</strong> · it has no edge and no base and appears
        under the pointer: a three-dot button on each of thirty rows would otherwise be thirty
        objects.
      </>
    ),
    rules: "Rules",
    label: (
      <>
        <code>aria-label</code> is required by the type, but that is not the point:{" "}
        <strong>a control with no text inside it has no name in a screen reader.</strong> By the
        kit&apos;s rule the kit never translates; the caller passes text that is already written.
      </>
    ),
    related: "Related",
    rel: (
      <>
        With text, <Xref to="button">Button</Xref>; smaller, to sit inside a field or a
        card, <Xref to="mini-button">Mini button</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("icon-button")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo
        labels={dict.demo}
        code={`<IconButton size="sm" aria-label="…"><Icon icon={Edit} size="xs" /></IconButton>
<IconButton aria-label="…"><Icon icon={Edit} size="base" /></IconButton>
<IconButton size="lg" aria-label="…"><Icon icon={Edit} size="lg" /></IconButton>

<IconButton variant="primary" aria-label="…"><Icon icon={Plus} size="base" /></IconButton>
<IconButton variant="soft" aria-label="…"><Icon icon={Star} size="base" weight="fill" /></IconButton>
<IconButton variant="danger" aria-label="…"><Icon icon={Delete} size="base" /></IconButton>
<IconButton variant="ghost" aria-label="…"><Icon icon={Close} size="base" /></IconButton>`}
      >
        {/* Üç boy yan yana: köşenin ölçüyle birlikte büyüdüğü ancak böyle
            görülüyor. */}
        <IconButton size="sm" aria-label={t.edit}>
          <Icon icon={Edit} size="xs" weight="bold" />
        </IconButton>
        <IconButton aria-label={t.edit}>
          <Icon icon={Edit} size="base" weight="bold" />
        </IconButton>
        <IconButton size="lg" aria-label={t.edit}>
          <Icon icon={Edit} size="lg" weight="bold" />
        </IconButton>

        <span className="h-8 w-px bg-[var(--color-div)]" aria-hidden />

        <IconButton variant="primary" aria-label={t.add}>
          <Icon icon={Plus} size="base" weight="bold" />
        </IconButton>
        <IconButton variant="soft" aria-label={t.favourite}>
          <Icon icon={Star} size="base" weight="fill" />
        </IconButton>
        <IconButton variant="danger" aria-label={t.remove}>
          <Icon icon={Delete} size="base" weight="bold" />
        </IconButton>
        <IconButton variant="ghost" aria-label={t.close}>
          <Icon icon={Close} size="base" weight="bold" />
        </IconButton>
      </Demo>

      <P>{t.boylar}</P>
      <P>{t.varyantlar}</P>
      <P>{t.size}</P>

      <H2>{t.rules}</H2>
      <Note>{t.label}</Note>

      <H2>Props</H2>
      <Props of="IconButton" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
