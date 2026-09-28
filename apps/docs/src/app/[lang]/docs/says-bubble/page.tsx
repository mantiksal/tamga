import { SaysBubble, Icon } from "tamga-ui";
import { Sparkle } from "tamga-ui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("says-bubble")!.title[lang] };
}

/**
 * Sayfa metni, iki dilli. Sözlük ARAYÜZ metinleri içindir; sayfa içeriği
 * sayfayla yaşar, ve iki dil yan yana durduğu için biri unutulunca görünüyor.
 */
const T = {
  tr: {
    lead: (
      <>
        Konuşma balonu: müşteri mesajları, sipariş notları ve asistan önerileri. Üç taraf var ve{" "}
        <strong>taraf konuşandır</strong> · okuyan kişi sol kenarda karşı tarafı, sağ kenarda
        kendi sözlerini arıyor, ad okumadan.
      </>
    ),
    soru: "Merhaba, siparişime hediye paketi eklenebilir mi?",
    soruSaat: "14:05",
    yanit: "Tabii, ücretsiz ekledik. Kargoya verildiğinde bilgilendireceğiz.",
    yanitSaat: "14:07 · Görüldü",
    oneriBaslik: "Öneri:",
    oneri: "Bu müşteri son 3 siparişinde hediye paketi istedi. Varsayılan olarak eklemek ister misin?",
    kose: (
      <>
        Balonun <strong>konuşana bakan köşesi küçük</strong> (8 · 8 · 8 · 2), ötekiler kart
        köşesi. Kuyruk yok: bir kuyruk döndürülmüş kare demek, ve kitin hiçbir yerinde
        döndürülmüş kare yok.
      </>
    ),
    taban: (
      <>
        Bu tarafın balonu <strong>taban taşıyor</strong> (3px), gelen mesaj taşımıyor: gönderilen
        mesaj sayfanın üstünde duran bir nesne, gelen mesaj sayfanın kendisi.
      </>
    ),
    kesik: (
      <>
        Asistanın önerisi <strong>kesik kenarlı</strong>: kitin her yerinde kesik çizgi
        &ldquo;henüz gerçek içerik değil&rdquo; demek, ve bir öneri de henüz verilmemiş bir
        karar. Kabul edilince yerine gerçek mesaj geçiyor.
      </>
    ),
    meta: (
      <>
        Saat ve iletim durumu <strong>balonun içinde</strong>, altında değil: balonun altındaki
        bir satır uzun bir sohbetin ritmini bozuyor, ve her mesajın arasına bir boşluk daha
        koyuyor.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Çizimin konuştuğu balon için <Xref to="empty-state">Empty state</Xref>; tek satırlık bir
        bildirim için <Xref to="toast">Toast</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        The conversation bubble: customer messages, order notes and assistant suggestions. There
        are three sides, and <strong>the side is the speaker</strong> · a reader scans the left
        edge for the other party and the right edge for their own words, without reading a name.
      </>
    ),
    soru: "Hello, can a gift wrap be added to my order?",
    soruSaat: "14:05",
    yanit: "Of course, we added it free of charge. We will let you know when it ships.",
    yanitSaat: "14:07 · Seen",
    oneriBaslik: "Suggestion:",
    oneri: "This customer asked for gift wrap on their last 3 orders. Add it by default?",
    kose: (
      <>
        The corner <strong>facing the speaker is the small one</strong> (8 · 8 · 8 · 2), the rest
        are card corners. There is no tail: a tail means a rotated square, and there is no
        rotated square anywhere in the kit.
      </>
    ),
    taban: (
      <>
        This side&apos;s bubble <strong>carries a base</strong> (3px), the incoming one does not:
        a sent message is an object standing on the page, an incoming message is the page itself.
      </>
    ),
    kesik: (
      <>
        The assistant&apos;s suggestion is <strong>dashed</strong>: everywhere in the kit a dashed
        edge means &ldquo;not real content yet&rdquo;, and a suggestion is a decision not taken
        yet. Accepted, a real message takes its place.
      </>
    ),
    meta: (
      <>
        The time and the delivery state live <strong>inside</strong> the bubble, not under it: a
        line under the bubble breaks the rhythm of a long thread and adds another gap between
        every message.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        For the bubble a drawing speaks from, <Xref to="empty-state">Empty state</Xref>; for a
        one-line notice, <Xref to="toast">Toast</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("says-bubble")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo yuzey labels={dict.demo} align="start" grid={false} code={`<SaysBubble avatar="MA" meta="${t.soruSaat}">${t.soru}</SaysBubble>

<SaysBubble from="me" avatar="E" meta="${t.yanitSaat}">${t.yanit}</SaysBubble>

<SaysBubble from="assistant" avatar={<Icon icon={Sparkle} size="sm" weight="fill" />}>
  <strong>${t.oneriBaslik}</strong> …
</SaysBubble>`}>
        <div className="flex w-full max-w-155 flex-col gap-4">
          <SaysBubble avatar="MA" meta={t.soruSaat}>
            {t.soru}
          </SaysBubble>
          <SaysBubble from="me" avatar="E" meta={t.yanitSaat}>
            {t.yanit}
          </SaysBubble>
          <SaysBubble from="assistant" avatar={<Icon icon={Sparkle} size="sm" weight="fill" />}>
            <strong>{t.oneriBaslik}</strong> {t.oneri}
          </SaysBubble>
        </div>
      </Demo>
      <P>{t.kose}</P>
      <P>{t.taban}</P>

      <H2>{t.rules}</H2>
      <Note>{t.kesik}</Note>
      <Note>{t.meta}</Note>

      <H2>Props</H2>
      <Props of="SaysBubble" lang={lang} etiketli />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
