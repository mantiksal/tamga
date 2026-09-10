import { ListRow, Dot, Label, IconButton, Icon, Surface } from "tamga-ui";
import { More } from "tamga-ui/icons";
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
    mail: "E-posta",
    mailMeta: "3 alıcı",
    hook: "Webhook",
    hookMeta: "bağlı değil",
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
    mail: "Email",
    mailMeta: "3 recipients",
    hook: "Webhook",
    hookMeta: "not connected",
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
                [t.slack, t.slackMeta, "positive"],
                [t.mail, t.mailMeta, "positive"],
                [t.hook, t.hookMeta, "neutral"],
              ] as const
            ).map(([name, meta, tone]) => (
              <ListRow key={name}>
                <Dot state={tone} />
                <span className="min-w-0 flex-1 text-body text-ink">{name}</span>
                <Label mono>{meta}</Label>
                <IconButton aria-label={t.more}>
                  <Icon icon={More} size="sm" />
                </IconButton>
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
