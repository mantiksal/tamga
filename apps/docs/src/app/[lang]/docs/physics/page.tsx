import { Button, Checkbox, Icon, StatusChip, LiveScope } from "tamga-ui";
import { Close, Prohibit } from "tamga-ui/icons";
import { OffsetLadder } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, H3, P, Note, slug } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { sayfaMeta } from "@/content/meta";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return sayfaMeta("physics", lang);
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
    ladderLegend: `0  basılı hâl · 2  ikon ve mini düğme, onay kutusu, segment
3  küçük düğme, anahtar, odak, seçili kart · 4  düğme, editör
5  kart, Kpi, overlay, düğme hover · 7  canlı Kpi hover`,
    basamaklar: [
      "basılı hâl",
      "merdivende var, bileşende kullanılmıyor",
      "ikon ve mini düğme, onay kutusu, segment",
      "küçük düğme, anahtar, odak, seçili kart",
      "düğme, editör",
      "kart, Kpi, overlay, düğme hover",
      "merdivende var, bileşende kullanılmıyor",
      "canlı Kpi hover",
    ],
    yasaAdlari: [
      "Tek yükseltme formülü",
      "Dolgu eylem, çerçeve seçim",
      "Renk sapma ve etkileşim içindir",
      "Ekranda tek parlaklık nabzı",
    ],
    notUsH: "Ne değiliz",
    notUsList: [
      "gradyan",
      "bulanık gölge",
      "cam efekti",
      "süpüren shimmer",
      "yuvarlak hap rozet",
      "yarım piksel",
      "overshoot'lu eğri",
      "büyük harf dönüşümü",
      "ham renk, ham süre, ham ölçü",
      "basılamayan bir şeye offset",
      "ekranda ikinci bir parlaklık nabzı",
    ],
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
        Yükselen her nesne aynı formülden gelir: <strong>bir kenar + N px sert offset, aynı
        renkte.</strong> Bulanıklık yok, opaklık yok. Offset önemi kodlar, renk anlamı kodlar.
        Kenar iki kalınlıkta: <strong>1.5px basılan şeylerde</strong> (buton, girdi, anahtar),
        <strong>1px duran yüzeylerde</strong> (kart, panel). Kalın çizgi bir tuşun çizgisi.
      </>
    ),
    l1istisnaH: "Tek istisna: katman bir yükseklik değil bir SİNYAL olduğunda",
    l1istisna: (
      <>
        &quot;Aynı renkte&quot; kuralının bir istisnası var ve adı konmuş bir token:{" "}
        <code>--focus-ring</code>. Odaklanan bir girdi kenarını koyultur ama katmanını{" "}
        <strong>yumuşak vurgu renginde</strong> atar. Sebep şu: orada offset nesnenin ne kadar
        yükseldiğini söylemiyor, <em>klavyenin şu an nerede olduğunu</em> söylüyor · yani bir
        yükseklik değil bir sinyal. Aynı ayrım bildirimde de geçiyor: kutu koyu, katmanı vurgu
        renginde, çünkü katman &quot;bu kutu yüksek&quot; değil &quot;buraya bak&quot; diyor.
      </>
    ),
    l1istisnaNot: (
      <>
        İstisna <strong>adlandırılmış olmakla</strong> sınırlı. Bir bileşen kendi başına farklı
        renkte bir katman seçemez; yalnız bu iki token kullanılabilir. Adı olmayan bir istisna,
        istisna değil sızıntıdır: kapı (<code>check-physics</code>) token adına bakıyor, renge
        değil.
      </>
    ),
    l1ladder: "Merdiven: soldan sağa 0, 1, 2, 3, 4, 5, 6, 7",
    l1press: (
      <>
        Üstüne gel, bas. Birincil buton 3px&apos;ten 4&apos;e çıkar; basınca ikisi de 0&apos;a iner
        ve gerçekten gömülür. Bu bir animasyon değil, aynı formülün başka bir adımı.
      </>
    ),
    l1boy: "Küçülen kontrol katmanını da küçültür",
    l1boyP: (
      <>
        Bir kontrolün <code>sm</code> hâli yalnız kısalmıyor, <strong>merdivende bir basamak
        da iniyor</strong>: <code>Button</code> 4&apos;te durur, <code>Button size=&quot;sm&quot;</code>{" "}
        3&apos;te, ve basışı da 3px olur. Sebebi yükseklik bir ÖLÇÜ olması: 32 piksellik bir düğme
        40 piksellik biriyle aynı kalınlıkta gölge taşırsa küçülen tek şey genişliği olur, ve iki
        boy yan yana durduğunda göz hangisinin küçük olduğunu gölgeden çıkaramaz. Katmanın RENGİ
        varyantın, offseti boyun · <code>primary sm</code> 3px&apos;lik accent taşır.
      </>
    ),
    l1kenar: "Kenar iki kalınlıkta, ve hangisi olduğu ölçülüyor",
    l1kenarP: (
      <>
        <strong>1.5px basılan şeylerde</strong> (düğme, ikon düğmesi, girdi, anahtar, segment
        öğesi, adım işareti), <strong>1px duran yüzeylerde</strong> (kart, Kpi, panel, overlay).
        Kalın çizgi bir tuşun çizgisidir; yüzey basılmıyor, o yüzden ince kalıyor. Bu cümle uzun
        süre yalnız yazılıydı ve ikon düğmesi 1px&apos;te kalmıştı · ailesinin tek istisnasıydı ve
        kimse görmedi, çünkü tek başına bakınca yanlış görünmüyor. Artık{" "}
        <code>check:physics</code> kuralın G maddesi olarak ölçüyor.
      </>
    ),
    l1hop: "Hover ne kadar yükseltir",
    l1hopP: (
      <>
        Hover merdivende <strong>yukarı çıkar</strong>, ama kaç basamak çıkacağı nesnenin kendi
        kararı: bir buton bir basamak, bir kart iki basamak yükselebilir. Serbest olan sıçramanın
        boyu; <strong>değerin kendisi değil</strong>, o hâlâ merdivenden seçiliyor.{" "}
        <em>Kural bir süre &quot;tam bir basamak&quot; idi, ve merdivende 5 olmadığı için 4&apos;te
        duran hiçbir şey hover yapamıyordu: iki kural birlikte, yasanın izin verdiği bir yüksekliği
        kullanılamaz kılıyordu.</em>
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
    l2renk: "Seçimin rengi kenar, vurgu değil",
    l2renkP: (
      <>
        Çerçeve seçimi işaretliyor, ama <strong>hangi renkte</strong> sorusu uzun süre
        cevapsızdı ve kitin içinde iki farklı cevap yaşıyordu. Doğrusu{" "}
        <code>--color-edge</code>: renk kutusu, tema kartı, ray kartı, segment ve ayar rayı hep
        bununla işaretleniyor, ve seçili olan bir de <strong>yükseliyor</strong> (3px, düğmenin
        4&apos;ünden bir basamak altta · çünkü bu bir eylem değil bir DURUM).{" "}
        <code>--color-accent-line</code> ile çizilen seçim iki şeyi birden kaybediyordu: kitin
        geri kalanıyla çelişiyordu, ve açık bir markada vurgu ile kenar aynı parlaklığa düşüp
        seçim tamamen kayboluyordu. Vurgu rengi seçimi değil, <em>seçilenin içindeki işareti</em>{" "}
        boyar: radyo noktası, çentik, ray çubuğu.
      </>
    ),
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
    grammar: "İki fizik, tek gramer: yükselen ve oturan",
    grammarP: (
      <>
        Kitte her kontrol iki fizikten birine ait. <strong>Yükselen</strong> yüzeyin üstünde durur ve
        basılınca yerine iner: düğme, tıklanabilir kart, ray öğesi, segment.{" "}
        <strong>Oturan</strong> yüzeyin bir parçasıdır ve <em>hiç</em> yükselmez: sekme, anahtar,
        onay kutusu, radyo.
      </>
    ),
    grammarSeated: (
      <>
        Oturan bir kontrol cevabını <strong>dolarak ya da çizgi çizerek</strong> veriyor: sekme alt
        çizgiyle, anahtar dolu izle, onay kutusu dolu kutuyla. Bir sekme sayfanın üstünde duran bir
        nesne değil, çubuğun kendisinin bir parçası; onu &laquo;aşağı itmek&raquo; ne olduğu
        hakkında yalan söylemek olurdu.
      </>
    ),
    grammarRule: (
      <>
        Buradan tek bir kural çıkıyor ve kitin her yerinde geçerli:{" "}
        <strong>derinlik basılabilir demektir.</strong> Basılamayan hiçbir şey offset almaz. Bir
        durum çipi iki gün offset taşıdı ve tam bu yüzden geri alındı: bir durum etiketi asla
        basılamaz, ve yükselmiş duran bir şey tıklanmayı bekliyor demektir.
      </>
    ),
    grammarSilent: (
      <>
        <strong>Oturan tarafın yasası bir YOKLUK yasası</strong> (hiç yükselmez), yani tam da
        sessizce çürüyen cins: duruş hâlinde doğru göründüğü için hiçbir ekran görüntüsü incelemesi
        yakalamıyor. Kitin fizik kapısı bu yüzden sayıyı değil <em>ilişkiyi</em> ölçüyor.
      </>
    ),
  },
  en: {
    save: "Save", cancel: "Cancel", confirm: "Confirm", remove: "Delete",
    live: "Live", waiting: "Waiting", failed: "Failed", quiet: "Quiet",
    critical: "Critical", warning: "Warning", healthy: "Healthy",

    ladderWhat: "what",
    ladderLegend: `0  pressed · 2  icon and mini button, checkbox, segment
3  small button, switch, focus, selected card · 4  button, editor
5  card, Kpi, overlay, button hover · 7  live Kpi hover`,
    basamaklar: [
      "pressed",
      "on the ladder, unused by any component",
      "icon and mini button, checkbox, segment",
      "small button, switch, focus, selected card",
      "button, editor",
      "card, Kpi, overlay, button hover",
      "on the ladder, unused by any component",
      "live Kpi hover",
    ],
    yasaAdlari: [
      "One lift formula",
      "Fill is action, outline is selection",
      "Colour is for deviation and interaction",
      "One brightness pulse per screen",
    ],
    notUsH: "What we are not",
    notUsList: [
      "gradients",
      "blurred shadows",
      "glass effects",
      "sweeping shimmer",
      "pill-shaped badges",
      "half pixels",
      "overshooting curve",
      "uppercase transform",
      "raw colours, durations or measurements",
      "offset on anything unpressable",
      "a second brightness pulse on a screen",
    ],
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
        Every object that lifts comes from the same formula: <strong>an edge plus an N px hard
        offset, in the same colour.</strong> No blur, no opacity. The offset encodes importance;
        the colour encodes meaning. The edge comes in two weights: <strong>1.5px on things that
        are pressed</strong> (button, input, switch) and <strong>1px on surfaces that only
        sit</strong> (card, panel). The heavier line is a key's line.
      </>
    ),
    l1istisnaH: "The one exception: when the offset is a SIGNAL, not a height",
    l1istisna: (
      <>
        There is one exception to &quot;in the same colour&quot;, and it has a name:{" "}
        <code>--focus-ring</code>. A focused input firms its edge but casts its offset in the{" "}
        <strong>soft accent</strong>. The reason: there the offset is not saying how high the
        object sits, it is saying <em>where the keyboard is</em> · a signal, not a height. The
        same distinction runs through the toast: a dark box with an accent offset, because the
        offset says &quot;look here&quot;, not &quot;this box is raised&quot;.
      </>
    ),
    l1istisnaNot: (
      <>
        The exception is limited to what is <strong>named</strong>. A component cannot pick a
        differently coloured offset on its own; only those two tokens. An unnamed exception is
        not an exception but a leak: the gate (<code>check-physics</code>) reads the token name,
        not the colour.
      </>
    ),
    l1ladder: "The ladder: 0, 1, 2, 3, 4, 5, 6, 7 from left to right",
    l1press: (
      <>
        Hover, then press. The primary button goes from 3px to 4; on press both drop to 0 and are
        genuinely sunk. This is not an animation, it is another step of the same formula.
      </>
    ),
    l1boy: "A smaller control carries a smaller layer",
    l1boyP: (
      <>
        The <code>sm</code> form of a control does not only get shorter, it{" "}
        <strong>drops a rung</strong>: <code>Button</code> rests at 4,{" "}
        <code>Button size=&quot;sm&quot;</code> at 3, and its press is 3px. Height is a MEASURE:
        if a 32px button carries the same layer as a 40px one, the only thing that shrank is its
        width, and with the two side by side the eye cannot tell which is the small one. The
        layer&apos;s COLOUR belongs to the variant, its offset to the size, so{" "}
        <code>primary sm</code> carries 3px of accent.
      </>
    ),
    l1kenar: "The edge has two weights, and which one is measured",
    l1kenarP: (
      <>
        <strong>1.5px on things that press</strong> (button, icon button, input, switch, segment
        item, step mark), <strong>1px on surfaces that stand</strong> (card, Kpi, panel, overlay).
        A thick line is the line of a key; a surface does not press, so it stays thin. This
        sentence sat in the docs for months and was measured nowhere, and the icon button stayed
        at 1px: the one exception in its own family, and nobody saw it, because on its own it
        does not look wrong. <code>check:physics</code> now measures it as clause G.
      </>
    ),
    l1hop: "How far a hover lifts",
    l1hopP: (
      <>
        A hover <strong>climbs the ladder</strong>, but how many rungs is the object&apos;s own
        decision: a button may rise one rung, a card two. What is free is the size of the hop;{" "}
        <strong>not the value itself</strong>, which is still chosen from the ladder.{" "}
        <em>The rule read &quot;exactly one rung&quot; for a while, and since the ladder has no 5,
        nothing resting at 4 could hover at all: the two rules together made a height the law
        allows unusable.</em>
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
    l2renk: "A selection is marked in the edge, not the accent",
    l2renkP: (
      <>
        An outline marks the selection, but <strong>in which colour</strong> went unanswered for a
        long time, and the kit carried two different answers. The right one is{" "}
        <code>--color-edge</code>: the colour swatch, the theme card, the rail card, the segment
        and the settings rail all mark with it, and a selected thing also{" "}
        <strong>lifts</strong> (3px, one rung below the button&apos;s 4, because this is a STATE
        and not an action). Drawing the selection in <code>--color-accent-line</code> lost two
        things at once: it disagreed with the rest of the kit, and on a light brand the accent and
        the edge fall to the same lightness and the selection disappears altogether. The accent
        paints the <em>mark inside</em> the selected thing: the radio dot, the check, the rail
        bar. Never the selection itself.
      </>
    ),
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
    grammar: "Two physics, one grammar: raised and seated",
    grammarP: (
      <>
        Every control in the kit belongs to one of two physics. <strong>Raised</strong> sits above
        the surface and goes down to its base when pressed: buttons, clickable cards, rail entries,
        segments. <strong>Seated</strong> is part of the surface and <em>never</em> lifts: tabs,
        switches, checkboxes, radios.
      </>
    ),
    grammarSeated: (
      <>
        A seated control answers by <strong>filling or drawing a line</strong>: a tab with an
        underline, a switch with a filled track, a checkbox with a filled box. A tab is not an
        object resting on the page, it is part of the bar itself; pushing it &ldquo;down&rdquo;
        would lie about what it is.
      </>
    ),
    grammarRule: (
      <>
        One rule falls out of this and holds everywhere in the kit:{" "}
        <strong>depth means pressable.</strong> Nothing that cannot be pressed gets an offset. A
        status chip carried one for two days and was reverted for exactly this reason: a status
        label can never be pressed, and something standing lifted is something waiting for a click.
      </>
    ),
    grammarSilent: (
      <>
        <strong>The seated law is a law of ABSENCE</strong> (it never lifts), which is precisely the
        kind that rots in silence: it looks correct at rest, so no screenshot review catches it.
        That is why the kit&rsquo;s physics gate measures the <em>relationship</em> rather than the
        number.
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

      {/* DÖRT YASA BİR HARİTA. Sayfa uzun ve dört yasa onun omurgası: kartlar
          hem "kaç tane" sorusunu bir bakışta cevaplıyor hem de ilgili başlığa
          götürüyor. Bağlantı, çünkü gidilen yer sayfanın kendi içinde. */}
      <div className="my-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[t.l1, t.l2, t.l3, t.l4].map((baslik, i) => (
          <a key={baslik} href={`#${slug(baslik)}`} className="docs-yasa-kart">
            <span className="docs-yasa-no">{i + 1}</span>
            <strong className="text-small leading-snug">{t.yasaAdlari[i]}</strong>
          </a>
        ))}
      </div>

      {/* SINIRIN LİSTESİ, CÜMLESİ DEĞİL. Aynı on bir madde bir paragraf olarak
          duruyordu ve okunmuyordu: bir yasak listesi taranır, okunmaz. */}
      <div className="tamga-card my-5 flex flex-col gap-3 p-4.5">
        <strong className="flex items-center gap-2 text-small font-extrabold">
          <Icon icon={Prohibit} size="sm" weight="bold" style={{ color: "var(--color-critical)" }} />
          {t.notUsH}
        </strong>
        <span className="flex flex-wrap gap-2">
          {t.notUsList.map((n) => (
            <span key={n} className="docs-degil">
              <Icon icon={Close} size="xs" weight="bold" style={{ color: "var(--color-critical)" }} />
              {n}
            </span>
          ))}
        </span>
      </div>

      <H2>{t.l1}</H2>
      <P>{t.l1p}</P>
      {/* MERDİVENİN LEJANDI DA ÇEVRİLİYOR. Türkçe sabitti ve İngilizce sayfada
          da Türkçe basılıyordu: bir kod bloğunun yorumu da okunan metindir. */}
      <Demo labels={dict.demo} align="start" grid={false} code={`/* offset  ${t.ladderWhat} */
${t.ladderLegend}`}>
        <div className="w-full">
          <OffsetLadder lang={lang} steps={t.basamaklar} />
        </div>
      </Demo>
      <P>{t.l1ladder}</P>

      <H3>{t.l1kenar}</H3>
      <P>{t.l1kenarP}</P>

      <H3>{t.l1boy}</H3>
      <P>{t.l1boyP}</P>

      <H3>{t.l1hop}</H3>
      <P>{t.l1hopP}</P>

      <Demo
        labels={dict.demo}
        code={`<Button variant="primary">${t.save}</Button>
<Button>${t.cancel}</Button>`}
      >
        <Button variant="primary">{t.save}</Button>
        <Button>{t.cancel}</Button>
      </Demo>
      <P>{t.l1press}</P>

      <H2>{t.l1istisnaH}</H2>
      <P>{t.l1istisna}</P>
      <Note>{t.l1istisnaNot}</Note>

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

      <H3>{t.l2renk}</H3>
      <P>{t.l2renkP}</P>
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

      <H2>{t.grammar}</H2>
      <P>{t.grammarP}</P>
      {/* YAN YANA: yükselen ile oturan arasındaki fark ancak ikisi aynı satırda
          dururken okunuyor. Tek başına bir sekme doğru görünüyor. */}
      <Demo
        labels={dict.demo}
        code={`<Button variant="primary">${t.save}</Button>
<Checkbox label="${t.confirm}" checked />`}
      >
        <span className="flex flex-wrap items-center gap-6">
          <Button variant="primary">{t.save}</Button>
          <Checkbox label={t.confirm} checked />
        </span>
      </Demo>
      <P>{t.grammarSeated}</P>
      <Note>{t.grammarRule}</Note>
      <P>{t.grammarSilent}</P>
    </>
  );
}
