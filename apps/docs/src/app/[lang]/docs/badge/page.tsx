import { Tag } from "tamga-ui";
import { NoktaRozeti } from "./ornek";
import { Demo } from "@/components/demo";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { TagSwatchDemo, BadgeDemo } from "@/components/interactive";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { sayfaMeta } from "@/content/meta";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return sayfaMeta("badge", lang);
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
    unread: "okunmamış bildirim",
    notifications: "Bildirimler",
    lead: (
      <>
        <Xref to="status-chip">Status chip</Xref> bir <em>durum</em> taşır
        (&quot;Yayında&quot;), bu bir <em>sayı</em> taşır (&quot;3&quot;). İkisi ayrı bileşen
        çünkü ayrı şeyler: durum okunur, sayı sayılır.
      </>
    ),
    max: (
      <>
        <code>max</code> üstünde &quot;+&quot; ile kesiliyor. Kesilmezse dört haneli bir sayı
        rozetin kutusunu şişirir ve altındaki ikonu ezer.
      </>
    ),
    zero: (
      <>
        <strong>Sıfır gösterilmez.</strong> &quot;0 bildirim&quot; bir bilgi değil, gürültüdür;
        ve rozet hiç çizilmediği için altındaki ikon yerinden oynamaz.
      </>
    ),
    label: (
      <>
        <code>label</code> zorunlu: rakam tek başına ekran okuyucuda &quot;üç&quot;tür. Neyin üçü
        olduğunu yalnız o metin söyler.
      </>
    ),
    yeni: "YENİ",
    etiketH: "Etiket rozeti: sayı değil durum",
    etiketP: (
      <>
        <code>Tag</code> bir özelliğin durumunu taşıyor: BETA, YENİ, PRO. <strong>Sayacın
        kardeşi ama aynı şey değil</strong> · sayaç bir MİKTAR taşır ve okununca kaybolur,
        etiket bir DURUM taşır ve yerinde durur. Üç biçim: <code>dashed</code> henüz gerçek
        değil (kesik kenar kitin her yerinde bunu söylüyor), <code>solid</code> şu anda yeni
        olan, <code>outline</code> ise sessiz duran gerçek · bir plan adı, bir kademe. Sözcüğü
        ürün yazıyor, biçimi kit veriyor.
      </>
    ),
    renkH: "Kullanıcının rengi: Yasa 3'e yazılı istisna",
    renkP: (
      <>
        Kullanıcı kendi etiketine bir renk seçebilir; <code>swatch</code> onu metnin önünde
        küçük bir işaret olarak taşır. Bu, &quot;renk yalnız sapma ve etkileşim içindir&quot;
        yasasının <strong>tek yazılı istisnası</strong>: renk kitin söylediği bir şey değil,
        kullanıcının verisi · bir kimlik işareti. Sınırı dar: zemin değil, metin rengi değil,{" "}
        <code>aria-hidden</code> · anlamı ad taşıyor. <strong>Ne zaman:</strong> kullanıcının
        oluşturduğu, adlandırdığı, renklendirdiği etiketler. <strong>Ne zaman asla:</strong> durum
        ya da önem bildirmek için · onun için <code>StatusChip</code> var. İşaretin halkası
        mürekkepten türüyor; çok açık ya da çok koyu bir renk iki temada da görünür kalıyor.
      </>
    ),
    rules: "Kurallar",
    sepet: "Sepet",
    yeniUrun: "Sepette yeni ürün var",
    noktaH: "Sayısız rozet",
    noktaP: (
      <>
        <code>dot</code> sayı taşımayan işaret: cevap &quot;dört tane var&quot; değil{" "}
        <strong>&quot;yeni bir şey var&quot;</strong> olduğunda. Kimsenin üzerine hareket
        etmeyeceği bir sayı, kimsenin okumadığı bir sayıdır · ve sayı gittiğinde işaret de
        küçülüyor. Ekran okuyucuya söyleyen şey yine <code>label</code>.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Durum için <Xref to="status-chip">Status chip</Xref>; yanıp sönen canlılık işareti{" "}
        <Xref to="beacon">Beacon</Xref>.
      </>
    ),
  },
  en: {
    unread: "unread notifications",
    notifications: "Notifications",
    lead: (
      <>
        <Xref to="status-chip">Status chip</Xref> carries a <em>state</em>
        (&quot;Live&quot;); this carries a <em>number</em> (&quot;3&quot;). They are separate
        components because they are separate things: a state is read, a number is counted.
      </>
    ),
    max: (
      <>
        Above <code>max</code> it is cut off with a &quot;+&quot;. Without that, a four-digit
        number swells the badge box and crushes the icon beneath it.
      </>
    ),
    zero: (
      <>
        <strong>Zero is not shown.</strong> &quot;0 notifications&quot; is noise, not information
, and because the badge is never drawn, the icon beneath it does not shift.
      </>
    ),
    label: (
      <>
        <code>label</code> is required: on its own the digit is just &quot;three&quot; to a screen
        reader. Only that text says three of what.
      </>
    ),
    yeni: "NEW",
    etiketH: "The label badge: a state, not a number",
    etiketP: (
      <>
        <code>Tag</code> carries the state of a feature: BETA, NEW, PRO. <strong>A sibling of
        the counter, not the same thing</strong> · a counter carries a QUANTITY and disappears
        once read, a tag carries a STATE and stays. Three looks: <code>dashed</code> for what is
        not real yet (a dashed edge says this everywhere in the kit), <code>solid</code> for what
        is new right now, and <code>outline</code> for the quiet standing fact · a plan name, a
        tier. The product writes the word, the kit gives the shape.
      </>
    ),
    renkH: "The user's colour: the written exception to Law 3",
    renkP: (
      <>
        A user can give their own label a colour; <code>swatch</code> carries it as a small mark
        before the text. This is the <strong>one written exception</strong> to &quot;colour is for
        deviation and interaction&quot;: the colour is not something the kit says, it is the
        user&apos;s data · an identity mark. The boundary is narrow: not a ground, not a text colour,{" "}
        <code>aria-hidden</code> · the name carries the meaning. <strong>When:</strong> labels the
        user creates, names and colours. <strong>Never:</strong> to signal status or severity · that
        is what <code>StatusChip</code> is for. The mark&apos;s ring derives from the ink, so a very
        light or very dark colour stays visible in both themes.
      </>
    ),
    rules: "Rules",
    sepet: "Cart",
    yeniUrun: "There is something new in the cart",
    noktaH: "The badge with no number",
    noktaP: (
      <>
        <code>dot</code> is the mark with no number: for when the answer is{" "}
        <strong>&quot;there is something new&quot;</strong> rather than &quot;there are
        four&quot;. A number nobody will act on is a number nobody reads · and with the number
        gone, the mark gets smaller too. What speaks to a screen reader is still{" "}
        <code>label</code>.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For a state, <Xref to="status-chip">Status chip</Xref>; for a blinking sign of life,{" "}
        <Xref to="beacon">Beacon</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("badge")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <BadgeDemo lang={lang} labels={dict.demo} unread={t.unread} notifications={t.notifications} />
      <P>{t.max}</P>

      <H2>{t.noktaH}</H2>
      <Demo labels={dict.demo} code={`<Badge dot tone="info" label="${t.yeniUrun}">
  <IconButton aria-label="${t.sepet}"><Icon icon={ShoppingCart} size="sm" /></IconButton>
</Badge>`}>
        <NoktaRozeti sepet={t.sepet} yeniUrun={t.yeniUrun} />
      </Demo>
      <P>{t.noktaP}</P>

      <H2>{t.etiketH}</H2>
      <P>{t.etiketP}</P>
      <Demo labels={dict.demo} code={`<Tag look="dashed">BETA</Tag>
<Tag look="solid">${t.yeni}</Tag>
<Tag look="outline">PRO</Tag>`}>
        <Tag look="dashed">BETA</Tag>
        <Tag look="solid">{t.yeni}</Tag>
        <Tag look="outline">PRO</Tag>
      </Demo>

      <H2>{t.renkH}</H2>
      <P>{t.renkP}</P>
      <Demo labels={dict.demo} align="start" code={`<Tag>PRO</Tag>
<Tag swatch="#1f7a46">Müşteri</Tag>
<Tag swatch={tag.color}>{tag.name}</Tag>

{/* tıklanabilir öneri: işaret Button'un içinde */}
<Button size="sm"><ColorMark color={tag.color} /> {tag.name}</Button>

{/* oluşturma formunda rengi ColorSwatches seçiyor; "renk yok" da bir seçenek */}
<ColorSwatches value={color} onChange={setColor} options={…} customLabel="…" noneLabel="…" />`}>
        <TagSwatchDemo lang={lang} />
      </Demo>
      <Props of="Tag" lang={lang} etiketli />

      <H2>{t.rules}</H2>
      <Note>{t.zero}</Note>
      <Note>{t.label}</Note>

      <H2>Props</H2>
      <Props of="Badge" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
