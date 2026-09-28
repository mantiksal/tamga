import { ListRow, Label, Icon, Surface, toneOf } from "tamga-ui";
import { Bell, CaretRight, Link, Mail, Phone } from "tamga-ui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("list-row")!.title[lang] };
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
        Bir tabloya yetmeyen ama bir listeden fazlası olan şey: ayarlar satırı, entegrasyon
        satırı, üye satırı. Sabit yükseklik ve alt kural, satırların taranabilir kalmasını
        sağlıyor.
      </>
    ),
    slack: "Slack",
    slackMeta: "#uyarilar",
    slackAlt: "Kritik uyarılar bu kanala düşüyor",
    mail: "E-posta",
    mailMeta: "3 alıcı",
    mailAlt: "Günlük özet · her sabah 09:00",
    hook: "Webhook",
    hookMeta: "bağlı değil",
    hookAlt: "https://api.magaza.com/tamga/olay",
    sms: "SMS",
    smsMeta: "2 numara",
    smsAlt: "Yalnız kesinti bildirimlerinde",
    more: "Daha fazla",
    element: (
      <>
        <strong><code>href</code> verilirse bağlantı, <code>onClick</code> verilirse düğme.</strong>{" "}
        İkisi de yoksa düz bir satır kalır. Bu ayrım görsel değil sözleşmesel: tıklanabilir bir{" "}
        <code>&lt;div&gt;</code> klavyeyle erişilemez ve ekran okuyucuya hiçbir şey söylemez.
      </>
    ),
    rel: (
      <>
        Sütunlu veri için <Xref to="table">Table</Xref>; satır boşsa{" "}
        <Xref to="empty-note">Empty note</Xref>.
      </>
    ),
    gap: (
      <>
        <strong>Bu bileşen yeni bir şey icat etmiyor.</strong> Sınıfı kitte zaten vardı; eksik
        olan, doğru işaretlemenin tek bir yerde durmasıydı. <code>.tamga-list-row</code> kitte yıllarca
        vardı ve işaretlemesini her çağıran kendi yazıyordu; bedeli görünmezdi ama gerçekti.
      </>
    ),
    size: (
      <>
        İki yükseklik: <code>base</code> (varsayılan, ferah) ve <code>sm</code>, sıkışık bir
        panelde ya da bir kartın içinde. Üçüncüsü yok; bir skala ancak sınırlıyken skaladır.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
  },
  en: {
    lead: (
      <>
        The thing that is too little for a table and too much for a list: a settings row, an
        integration row, a member row. A fixed height and a bottom rule keep the rows scannable.
      </>
    ),
    slack: "Slack",
    slackMeta: "#alerts",
    slackAlt: "Critical alerts land in this channel",
    mail: "Email",
    mailMeta: "3 recipients",
    mailAlt: "Daily digest · every morning at 09:00",
    hook: "Webhook",
    hookMeta: "not connected",
    hookAlt: "https://api.store.com/tamga/event",
    sms: "SMS",
    smsMeta: "2 numbers",
    smsAlt: "Only for outage notices",
    more: "More",
    element: (
      <>
        <strong>With <code>href</code> it is a link, with <code>onClick</code> a button.</strong>{" "}
        With neither it stays a plain row. The distinction is not visual but contractual: a
        clickable <code>&lt;div&gt;</code> cannot be reached by keyboard and says nothing to a
        screen reader.
      </>
    ),
    rel: (
      <>
        For columnar data, <Xref to="table">Table</Xref>; when the row is empty,{" "}
        <Xref to="empty-note">Empty note</Xref>.
      </>
    ),
    gap: (
      <>
        <strong>This component invents nothing.</strong> The class was already in the kit; what
        was missing was one place holding the correct markup. <code>.tamga-list-row</code> was in the kit for
        years and every caller wrote its markup by hand: the cost was invisible but real.
      </>
    ),
    size: (
      <>
        Two heights: <code>base</code> (the default, roomy) and <code>sm</code>, for a dense
        panel or inside a card. There is no third; a scale is only a scale while it stays small.
      </>
    ),
    rules: "Rules",
    related: "Related",
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("list-row")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<ListRow href="/integrations/slack">…</ListRow>
<ListRow onClick={open}>…</ListRow>
<ListRow>…</ListRow>`}>
        <div className="w-full">
          <Surface className="overflow-hidden">
            {(
              [
                [t.slack, t.slackAlt, t.slackMeta, "positive", Bell],
                [t.mail, t.mailAlt, t.mailMeta, "positive", Mail],
                [t.sms, t.smsAlt, t.smsMeta, "neutral", Phone],
                [t.hook, t.hookAlt, t.hookMeta, "caution", Link],
              ] as const
            ).map(([name, alt, meta, tone, icon]) => (
              <ListRow key={name} href="#list-row">
                {/* Karo 40px: satırın kendi yüksekliği (56) içinde duran en büyük
                    kare · daha büyüğü satırı şişiriyor, daha küçüğü iki satırlık
                    metnin yanında kayboluyor. */}
                <span
                  className="tamga-logo-tile tamga-logo-tile-sm"
                  style={{ background: toneOf(tone).bg, color: toneOf(tone).fg }}
                >
                  <Icon icon={icon} size="sm" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <strong className="truncate text-body text-ink">{name}</strong>
                  <span className="truncate text-small text-ink-faint">{alt}</span>
                </span>
                <Label mono>{meta}</Label>
                <Icon icon={CaretRight} size="xs" className="text-ink-faint" />
              </ListRow>
            ))}
          </Surface>
        </div>
      </Demo>

      <P>{t.size}</P>

      <H2>{t.rules}</H2>
      <Note>{t.element}</Note>
      <Note>{t.gap}</Note>

      <H2>Props</H2>
      <Props of="ListRow" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
