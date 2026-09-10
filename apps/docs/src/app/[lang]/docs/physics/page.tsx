import { Button, StatusChip, LiveScope } from "tamga-ui";
import { OffsetLadder } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("physics")!.title[lang] };
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
    save: "Kaydet", cancel: "Vazgeç", confirm: "Onayla", remove: "Sil",
    live: "Yayında", waiting: "Bekliyor", failed: "Hata", quiet: "Sessiz",
    critical: "Kritik", warning: "Uyarı", healthy: "Sağlıklı",

    ladderWhat: "ne",
    ladderLegend: `0  basılı hâl · 1  mini buton · 2  buton, kart, input odağı
3  birincil buton · 4  hover · 6  overlay düzlemi`,
    whatFor: "Bu sayfa ne işe yarıyor",
    whatForP: (
      <>
        <strong>Bir bileşen yazmadan önce bir kez okunur, ve incelemede
        gösterilir.</strong> Kitteki her bileşen bu dört yasadan türüyor; bir
        şey ötekilere benzemiyorsa neredeyse her zaman bunlardan birini
        çiğnemiştir. Yasalar zevk değil <em>sınır</em>: neyin serbest olduğunu
        değil, neyin olmadığını söylüyorlar, ve on ayrı paneli birbirine
        benzeten şey tam olarak o sınırlar.
      </>
    ),
    character: (
      <>
        Kitin karakteri tek cümlede: <strong>kâğıt üstünde bir alet.</strong> Yüzeyler gerçek
        yükseklikte durur ve basılınca gerçekten iner. Hiçbir şey bulanık gölgeyle sahte derinlik
        taklidi yapmaz.
      </>
    ),
    wrongLabel: "böyle değil",
    rightLabel: "böyle",

    l1: "Yasa 1: tek yükseltme formülü",
    l1p: (
      <>
        Yükselen her nesne aynı formülden gelir: <strong>1px kenar + N px sert offset, aynı
        renkte.</strong> Bulanıklık yok, opaklık yok. Offset önemi kodlar, renk anlamı kodlar.
      </>
    ),
    l1ladder: "Merdiven: soldan sağa 0, 1, 2, 3, 4, 6",
    l1press: (
      <>
        Üstüne gel, bas. Birincil buton 3px&apos;ten 4&apos;e çıkar; basınca ikisi de 0&apos;a iner
        ve gerçekten gömülür. Bu bir animasyon değil, aynı formülün başka bir adımı.
      </>
    ),
    l1wrong: (
      <>
        Soldaki üçü neden yasak: <strong>bulanık gölge</strong> nesneyi kâğıdın üstünde
        yüzdürür ve yüksekliğini belirsiz bırakır; bulanıklık bir ölçü vermez.{" "}
        <strong>Gradyan</strong> iki renk arasına yüz ara ton koyar ve hiçbiri bir şey söylemez.{" "}
        <strong>Cam</strong> okunabilirliği tesadüfe bırakır: altındaki içerik değişince metin
        kaybolur.
      </>
    ),

    l2: "Yasa 2: dolgu eylem demek, çerçeve seçim demek",
    l2p: (
      <>
        Sayfada <strong>tek bir dolu buton</strong> olur: birincil eylem. &quot;Buradasın&quot; ya
        da &quot;bu seçildi&quot; diyen her şey çerçeve + offset alır.
      </>
    ),
    l2wrong: (
      <>
        Soldaki ekranda iki dolu buton var ve <strong>hangisinin gerçek eylem olduğu
        okunmuyor</strong>: göz ikisinde birden duruyor. Sağdakinde tek bir dolu şey var; geri
        kalanı okunabilir ama ikinci sırada.
      </>
    ),
    l2note: (
      <>
        Üç istisna bilinçli: <strong>sekme</strong> → alt çizgi (kutu onu panelden koparırdı) ·{" "}
        <strong>seçili satır</strong> → yıkama + sol kural (çoklu seçimde her satırı çerçevelemek
        gürültü olur) · <strong>switch</strong> → dolgu (akranlar arası seçim değil, açık/kapalı
        durumu).
      </>
    ),

    l3: "Yasa 3: renk sapma ve etkileşim içindir",
    l3p: (
      <>
        Aksan <strong>yalnızca</strong> etkileşim taşır: birincil buton, link, odak halkası,
        seçili satır. Durum renkleri <strong>yalnızca</strong> durum taşır. İkisi karışırsa ekran
        renkli olur ama hiçbir renk bir şey söylemez.
      </>
    ),
    l3after: (
      <>
        <strong>Sessize alınan tek nötr durumdur</strong>, yani gri bir satır kendi başına
        &quot;raporlamıyor&quot; demektir. Bu ancak gri tek renksiz durum kaldığı sürece işe yarar.
      </>
    ),

    l4: "Yasa 4: ekranda tek parlaklık nabzı",
    l4p: (
      <>
        Bir ekranda <strong>bir</strong> şey nabız atar, ve o en ciddi olandır. Kıtlık mekanizmanın
        kendisi: iki şey nabız atıyorsa ikisi de anlamını kaybeder.
      </>
    ),
    l4demo: "Üçü de nabız atmak istiyor; yalnız en ciddisi atıyor",
    l4after: (
      <>
        Kit bunu <Xref to="live-scope">Live scope</Xref> ile yapar; nabız atmak isteyen her öğe
        bir <em>talep</em> gönderir, en yüksek rütbeli kazanır. Rütbeyi kim hak eder,{" "}
        <strong>ürünün kararıdır</strong>: kit yalnız bir varsayılan verir (<code>danger</code>{" "}
        atar, diğerleri atmaz).
      </>
    ),
    notUs: (
      <>
        <strong>Ne değiliz:</strong> gradyan yok · bulanık gölge yok · cam efekti yok · süpüren
        shimmer yok · yuvarlak hap rozet yok · yarım piksel yok.
      </>
    ),
  },
  en: {
    save: "Save", cancel: "Cancel", confirm: "Confirm", remove: "Delete",
    live: "Live", waiting: "Waiting", failed: "Failed", quiet: "Quiet",
    critical: "Critical", warning: "Warning", healthy: "Healthy",

    ladderWhat: "what",
    ladderLegend: `0  pressed · 1  mini button · 2  button, card, input focus
3  primary button · 4  hover · 6  the overlay plane`,
    whatFor: "What this page is for",
    whatForP: (
      <>
        <strong>Read it once before writing a component, and point at it in
        review.</strong> Every component in the kit derives from these four
        laws; when something does not match the others, it has almost always
        broken one of them. The laws are not taste but a <em>boundary</em>:
        they say what is not allowed rather than what is, and that boundary is
        exactly what makes ten separate panels look related.
      </>
    ),
    character: (
      <>
        The kit&apos;s character in one sentence: <strong>an instrument on paper.</strong> Surfaces
        sit at a real height and genuinely go down when pressed. Nothing fakes depth with a blurred
        shadow.
      </>
    ),
    wrongLabel: "not this",
    rightLabel: "this",

    l1: "Law 1: one lift formula",
    l1p: (
      <>
        Every object that lifts comes from the same formula: <strong>a 1px edge plus an N px hard
        offset, in the same colour.</strong> No blur, no opacity. The offset encodes importance;
        the colour encodes meaning.
      </>
    ),
    l1ladder: "The ladder: 0, 1, 2, 3, 4, 6 from left to right",
    l1press: (
      <>
        Hover, then press. The primary button goes from 3px to 4; on press both drop to 0 and are
        genuinely sunk. This is not an animation, it is another step of the same formula.
      </>
    ),
    l1wrong: (
      <>
        Why the three on the left are forbidden: a <strong>blurred shadow</strong> floats the
        object above the paper and leaves its height undefined; blur gives no measurement. A{" "}
        <strong>gradient</strong> puts a hundred intermediate tones between two colours and none of
        them says anything. <strong>Glass</strong> leaves legibility to chance: when the content
        beneath changes, the text disappears.
      </>
    ),

    l2: "Law 2: a fill means an action, an outline means a selection",
    l2p: (
      <>
        There is <strong>one filled button</strong> on a page: the primary action. Anything that
        says &quot;you are here&quot; or &quot;this is selected&quot; gets an outline plus an
        offset.
      </>
    ),
    l2wrong: (
      <>
        The screen on the left has two filled buttons and <strong>which one is the real action is
        unreadable</strong>: the eye stops on both. The one on the right has a single filled
        thing; the rest are legible but second.
      </>
    ),
    l2note: (
      <>
        Three exceptions are deliberate: <strong>tabs</strong> → an underline (a box would cut them
        off from the panel) · <strong>a selected row</strong> → a wash plus a left rule (outlining
        every row in a multi-selection is noise) · <strong>switch</strong> → a fill (not a choice
        among peers but an on/off state).
      </>
    ),

    l3: "Law 3: colour is for deviation and interaction",
    l3p: (
      <>
        The accent carries <strong>only</strong> interaction: the primary button, a link, the focus
        ring, a selected row. Status colours carry <strong>only</strong> status. Mix the two and
        the screen becomes colourful while no colour says anything.
      </>
    ),
    l3after: (
      <>
        <strong>Muted is the only neutral state</strong>, so a grey row on its own means &quot;not
        reporting&quot;. That only works for as long as grey stays the single colourless state.
      </>
    ),

    l4: "Law 4: one brightness pulse per screen",
    l4p: (
      <>
        <strong>One</strong> thing pulses on a screen, and it is the most serious one. Scarcity is
        the mechanism itself: if two things pulse, both lose their meaning.
      </>
    ),
    l4demo: "All three ask to pulse; only the most serious one does",
    l4after: (
      <>
        The kit does this with <Xref to="live-scope">Live scope</Xref>; every element that wants
        to pulse sends a <em>request</em> and the highest-ranked one wins. Who deserves the rank is{" "}
        <strong>the product&apos;s decision</strong>: the kit only supplies a default
        (<code>danger</code> pulses, the others do not).
      </>
    ),
    notUs: (
      <>
        <strong>What we are not:</strong> no gradients · no blurred shadows · no glass effects · no
        sweeping shimmer · no pill-shaped badges · no half pixels.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("physics")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <H2>{t.whatFor}</H2>
      <P>{t.whatForP}</P>
      <P>{t.character}</P>
      <Note>{t.notUs}</Note>

      <H2>{t.l1}</H2>
      <P>{t.l1p}</P>
      {/* MERDİVENİN LEJANDI DA ÇEVRİLİYOR. Türkçe sabitti ve İngilizce sayfada
          da Türkçe basılıyordu: bir kod bloğunun yorumu da okunan metindir. */}
      <Demo labels={dict.demo} align="start" grid={false} code={`/* offset  ${t.ladderWhat} */
${t.ladderLegend}`}>
        <div className="w-full">
          <OffsetLadder lang={lang} />
        </div>
      </Demo>
      <P>{t.l1ladder}</P>

      <Demo
        labels={dict.demo}
        code={`<Button variant="primary">${t.save}</Button>
<Button>${t.cancel}</Button>`}
      >
        <Button variant="primary">{t.save}</Button>
        <Button>{t.cancel}</Button>
      </Demo>
      <P>{t.l1press}</P>

      {/* KARŞI ÖRNEK. Bir kural, çiğnendiğinde ne olduğu görülmeden ikna
          etmez — ve bu üç şeklin neden yasak olduğu yan yana konunca bir
          cümleden daha hızlı anlaşılıyor. */}
      <Demo labels={dict.demo} code={`/* ${t.wrongLabel} */`}>
        <span className="flex flex-wrap items-center gap-4">
          <span className="docs-wrong docs-wrong-shadow">blur</span>
          <span className="docs-wrong docs-wrong-gradient">gradient</span>
          <span className="docs-wrong docs-wrong-glass">glass</span>
          <span className="docs-wrong docs-wrong-pill">pill</span>
          <span className="mx-2 text-ink-faint">→</span>
          <Button variant="primary">{t.rightLabel}</Button>
        </span>
      </Demo>
      <P>{t.l1wrong}</P>

      <H2>{t.l2}</H2>
      <P>{t.l2p}</P>
      <Demo labels={dict.demo} code={`/* ${t.wrongLabel} · ${t.rightLabel} */`}>
        <span className="flex flex-wrap items-center gap-8">
          <span className="flex items-center gap-2">
            <Button variant="primary">{t.save}</Button>
            <Button variant="primary">{t.remove}</Button>
          </span>
          <span className="text-ink-faint">→</span>
          <span className="flex items-center gap-2">
            <Button variant="primary">{t.save}</Button>
            <Button variant="danger">{t.remove}</Button>
          </span>
        </span>
      </Demo>
      <P>{t.l2wrong}</P>
      <Note>{t.l2note}</Note>

      <H2>{t.l3}</H2>
      <P>{t.l3p}</P>
      <Demo
        labels={dict.demo}
        code={`<StatusChip label="${t.live}" state="positive" dot />`}
      >
        <StatusChip label={t.live} state="positive" dot />
        <StatusChip label={t.waiting} state="caution" dot />
        <StatusChip label={t.failed} state="danger" dot />
        <StatusChip label={t.quiet} state="neutral" dot />
      </Demo>
      <P>{t.l3after}</P>

      <H2>{t.l4}</H2>
      <P>{t.l4p}</P>
      <Demo labels={dict.demo} code={`<LiveScope>
  <StatusChip label="${t.critical}" state="danger"   dot live />
  <StatusChip label="${t.warning}"  state="caution"  dot live />
  <StatusChip label="${t.healthy}"  state="positive" dot live />
</LiveScope>`}>
        <LiveScope>
          <StatusChip label={t.critical} state="danger" dot live />
          <StatusChip label={t.warning} state="caution" dot live />
          <StatusChip label={t.healthy} state="positive" dot live />
        </LiveScope>
      </Demo>
      <P>{t.l4demo}</P>
      <P>{t.l4after}</P>
    </>
  );
}
