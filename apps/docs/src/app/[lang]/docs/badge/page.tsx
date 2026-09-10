import { Badge, Icon, IconButton } from "tamga-ui";
import { Bell } from "tamga-ui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("badge")!.title[lang] };
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
    rules: "Kurallar",
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
    rules: "Rules",
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
      <Demo labels={dict.demo} code={`<Badge count={3} label="${t.unread}">
  <IconButton aria-label="${t.notifications}"><Icon icon={Bell} size="sm" /></IconButton>
</Badge>`}>
        <Badge count={3} label={t.unread}>
          <IconButton aria-label={t.notifications}>
            <Icon icon={Bell} size="sm" />
          </IconButton>
        </Badge>
        <Badge count={140} label={t.unread}>
          <IconButton aria-label={t.notifications}>
            <Icon icon={Bell} size="sm" />
          </IconButton>
        </Badge>
        <Badge count={0} label={t.unread}>
          <IconButton aria-label={t.notifications}>
            <Icon icon={Bell} size="sm" />
          </IconButton>
        </Badge>
        <Badge count={7} tone="caution" label={t.unread} />
      </Demo>
      <P>{t.max}</P>

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
