import { Button } from "tamga-ui";
import {
  AzaltilmisOrnegi,
  DonguOrnegi,
  EgriOrnegi,
  KademeOrnegi,
  SinyalOrnegi,
} from "./ornek";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { sayfaMeta } from "@/content/meta";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return sayfaMeta("motion", lang);
}

/**
 * Hareketin gerekçesi.
 *
 * DEĞER LİSTESİ YOK, ve bu bilinçli: adların ve değerlerin tam listesi
 * Token'lar sayfasında, kaynaktan üretiliyor. Burada da yazsaydık bir gün
 * biri değişir, öteki değişmez, ve hangisinin doğru olduğu bilinmezdi.
 * Bu sayfa "kaç milisaniye" değil "neden o kademe" sorusunu cevaplıyor.
 */
const T = {
  tr: {
    save: "Kaydet",
    cancel: "Vazgeç",
    live: "Yayında",

    whatFor: "Bu sayfa ne işe yarıyor",
    whatForP: (
      <>
        <strong>Bir bileşen hareket edecekse önce buraya bakılır.</strong> Kitte ham bir süre ya da
        ham bir eğri yazılmaz: hepsi token. Renkte ham hex'e gösterilen titizliğin harekette
        gösterilmemesi için bir sebep yok: ikisi de aynı hastalık.
      </>
    ),
    born: (
      <>
        Bu kademeler bir dağılmadan doğdu. Bir arayüzde on altı ham süre elle yazılmıştı ve çoktan
        ayrışmışlardı: bildirim 200ms, ilerleme çubuğu 240ms, sayfa girişi 340ms; üçü de{" "}
        <em>bir şey belirir</em> işini yapıyor, üç ayrı hızda. Kimse bir satıra bakıp &laquo;burası
        yanlış&raquo; diyemiyordu; yalnızca his olarak dengesizdi. Token'ın çözdüğü şey tam olarak
        bu: ayrışmayı <em>görünür</em> yapmak.
      </>
    ),

    demo: {
      names: ["Basma", "Renk ve ton", "Panel ve bildirim", "Rota açılışı"],
      play: "Oynat",
      reset: "Geri al",
      signature: "İmza eğrisi",
      overshoot: "Overshoot · böyle değil",
      live: "Yayında",
      loading: "Yükleniyor",
      breath: "iskelet nefesi",
      beacon: "canlı işaret nabzı",
      bar: "yükleme çubukları",
      setting: "Azaltılmış hareket",
      save: "Kaydet",
      onlyColour: "yalnız renk",
      colourDot: "renk + nokta",
      full: "renk + nokta + metin",
      stepsHint: "Dördü aynı anda çıkar; hangisinin ne iş için olduğu hızından okunur.",
      curvesHint: "Kesik çizgi hedef. Overshoot hedefi geçip geri döner; kitte tanımlı değil.",
    },
    ipucu: {
      steps: "Oynat: aynı mesafe, dört kademe.",
      press: "Üstüne gel, bas: basma kademesi.",
      curves: "Oynat: imza eğrisi ile tanımlanmamış overshoot yan yana.",
      loops: "İskelet nefes alır, canlı işaret nabız atar, çubuklar yürür.",
      reduced: "Anahtarı aç: döngüler durur, iskelet ortada park eder, buton hâlâ basılır.",
      colour: "Hareket kapansa da bilgi aynı: renk, nokta ve metin birlikte.",
    },
    steps: "Dört süre kademesi",
    stepsP: (
      <>
        Kademeler işe göre ayrılmış, göze göre değil: <strong>basma</strong> her kontrolün
        tıklamaya cevabı · <strong>hızlı</strong> renk ve ton geçişleri · <strong>temel</strong>{" "}
        panel, balon, bildirim, değer değişimi · <strong>yavaş</strong> rota düzeyinde açılış. Bir
        geçişin hangi kademede olduğuna &laquo;ne kadar sürmeli&raquo; diye değil,{" "}
        <em>ne olduğu</em> sorularak karar veriliyor.
      </>
    ),
    pressWhy: (
      <>
        <strong>Basma kademesi ayrı, ve bilerek en küçüğü.</strong> Bir kontrol tıklamaya 100ms'de
        cevap verince mekanik hissediyor; sert offsetli bir düğmenin bütün amacı bu. Daha yavaşı
        gecikme olarak okunuyor, ve gecikme bir aletin söyleyebileceği en kötü şey.
      </>
    ),

    curves: "Üç eğri, ve olmayan dördüncüsü",
    curvesP: (
      <>
        Giren ya da yer değiştiren her şey tek bir imza eğrisi kullanıyor. İkincisi basma için ve{" "}
        <em>aynı eğri</em>: basmak farklı bir fizik değil. Üçüncüsü yalnız iki döngüde: nefes alan
        işaret ve iskelet.
      </>
    ),
    noOvershoot: (
      <>
        <strong>Overshoot'lu eğri yok, ve bu bir zevk değil bir sınır.</strong> Zıplayan tek bir
        şey olmayan bir arayüzde bir overshoot eğrisi tanımlamak, onu er ya da geç başka bir yere
        sızdırmak demek. Bir kez konduğunda &laquo;niye burada var da şurada yok&raquo; sorusunun
        savunulabilir bir cevabı kalmıyor.
      </>
    ),

    loops: "Beş döngü: uzun olmalarına izin verilen tek grup",
    loopsP: (
      <>
        Döngüler süre merdiveninin dışında: bir iskelet nefesi ya da canlı bir işaretin nabzı,
        en yavaş geçişten kat kat uzun. İzin verilen tek istisna bunlar, çünkü işleri{" "}
        <em>geçmek</em> değil <em>durmadan sürmek</em>.
      </>
    ),

    reduced: "Azaltılmış hareket",
    reducedP: (
      <>
        <code>prefers-reduced-motion: reduce</code> altında <strong>dekoratif olan durur,</strong>{" "}
        işlevsel geri bildirim kalır. Giriş animasyonları, nabız, süzülme ve bildirimin kayması
        gider; basma ve odak <em>kalır</em>: onlar süs değil, sistemin cevabı. Süre de
        kısaltılmıyor: basma kademesi zaten 100ms.
      </>
    ),
    reducedSkeleton: (
      <>
        <strong>Duran bir iskelet boş bir kutu olamaz.</strong> Nefes durduğunda iskelet çubuğu
        döngünün iki ucundan birine değil <em>ortasına yakın</em> park ediyor; durduğu yerde hâlâ
        &laquo;burada bir şey yüklenecek&raquo; diye okunsun diye. Aynı sebeple duran bir yükleme
        göstergesi görünür kalıyor; kaybolan bir gösterge, biten bir iş gibi okunur.
      </>
    ),

    colour: "Renk tek sinyal değil",
    colourP: (
      <>
        Hareketin taşıdığı hiçbir anlam tek başına durmuyor. Bir durum çipi renk <em>ve</em> nokta{" "}
        <em>ve</em> metin taşıyor; nabız da kendi başına bir şey söylemiyor, altındaki renk ve
        etiket söylüyor. Hareketi kapatan biri bilgi kaybetmiyor.
      </>
    ),

    tokensLink: "Token'lar",
    physicsLink: "Fizik",
    tokensNote: (
      <>
        Sürelerin ve eğrilerin <strong>tam listesi ve değerleri</strong> Token'lar sayfasında,
        kaynaktan üretiliyor. Burada tekrarlanmıyor: bir değer iki yerde yazılırsa bir gün biri
        yalan söyler.
      </>
    ),
  },
  en: {
    save: "Save",
    cancel: "Cancel",
    live: "Live",

    whatFor: "What this page is for",
    whatForP: (
      <>
        <strong>Read this before making anything move.</strong> The kit never writes a raw duration
        or a raw curve: they are all tokens. There is no reason to be strict about raw hex in
        colour and relaxed about it in motion: it is the same disease.
      </>
    ),
    born: (
      <>
        These steps came out of a drift. One interface had sixteen raw durations written by hand,
        and they had already come apart: a toast at 200ms, a progress bar at 240ms, a page reveal at
        340ms, all three doing the job of <em>something appears</em>, at three different speeds.
        Nobody could point at a line and call it wrong; it only felt uneven. That is exactly what a
        token fixes: it makes the drift <em>visible</em>.
      </>
    ),

    demo: {
      names: ["Press", "Colour and tone", "Panel and toast", "Route transition"],
      play: "Play",
      reset: "Reset",
      signature: "The signature curve",
      overshoot: "Overshoot · not this",
      live: "Live",
      loading: "Loading",
      breath: "the skeleton's breath",
      beacon: "the live mark's pulse",
      bar: "loading bars",
      setting: "Reduced motion",
      save: "Save",
      onlyColour: "colour only",
      colourDot: "colour + dot",
      full: "colour + dot + text",
      stepsHint: "All four leave at once; which one is for which job is read off its speed.",
      curvesHint: "The dashed line is the target. Overshoot passes it and comes back; the kit has no such curve.",
    },
    ipucu: {
      steps: "Play: same distance, four steps.",
      press: "Hover, then press: the press step.",
      curves: "Play: the signature curve next to an undefined overshoot.",
      loops: "The skeleton breathes, the live mark pulses, the bars walk.",
      reduced: "Flip the switch: the loops stop, the skeleton parks mid-sweep, the button still presses.",
      colour: "With motion off the information is the same: colour, dot and text together.",
    },
    steps: "Four duration steps",
    stepsP: (
      <>
        The steps are split by job, not by feel: <strong>press</strong> is every control&rsquo;s
        answer to a click · <strong>quick</strong> is colour and tone · <strong>base</strong> is
        panels, popovers, toasts and value changes · <strong>slow</strong> is a route-level reveal.
        You pick a step by asking <em>what this is</em>, never &ldquo;how long should it take&rdquo;.
      </>
    ),
    pressWhy: (
      <>
        <strong>Press is its own step, and the smallest on purpose.</strong> A control that answers
        a click in 100ms feels mechanical, which is the whole point of a hard-offset button.
        Anything slower reads as lag, and lag is the worst thing an instrument can say.
      </>
    ),

    curves: "Three curves, and the fourth one that does not exist",
    curvesP: (
      <>
        Everything that enters or moves uses one signature curve. The second is for a press and is{" "}
        <em>the same curve</em>: pressing is not a different physics. The third belongs to two
        loops only: the breathing mark and the skeleton.
      </>
    ),
    noOvershoot: (
      <>
        <strong>No curve overshoots, and that is a boundary rather than a taste.</strong> In an
        interface where nothing bounces, defining an overshoot curve means leaking it somewhere
        else sooner or later. Once it exists, &ldquo;why here and not there&rdquo; has no
        defensible answer.
      </>
    ),

    loops: "Five loops: the only group allowed to run long",
    loopsP: (
      <>
        Loops sit outside the duration ladder: a skeleton&rsquo;s breath or a live mark&rsquo;s
        pulse runs many times longer than the slowest transition. They are the one permitted
        exception, because their job is not to <em>cross</em> but to <em>keep going</em>.
      </>
    ),

    reduced: "Reduced motion",
    reducedP: (
      <>
        Under <code>prefers-reduced-motion: reduce</code>{" "}
        <strong>the decorative stops</strong> and functional feedback stays. Reveals, the pulse, the
        float and the toast&rsquo;s slide all go; press and focus <em>remain</em>: they are the
        system answering, not decoration. Durations are not shortened either: the press step is
        already 100ms.
      </>
    ),
    reducedSkeleton: (
      <>
        <strong>A stopped skeleton must not become an empty box.</strong> When the breath stops the
        bar parks <em>near the middle</em> of the cycle rather than at either end, so that standing
        still it still reads as &ldquo;something is loading here&rdquo;. For the same reason a
        stopped loading indicator stays visible; an indicator that disappears reads as a finished
        job.
      </>
    ),

    colour: "Colour is never the only signal",
    colourP: (
      <>
        Nothing motion carries stands on its own. A status chip carries colour <em>and</em> a dot{" "}
        <em>and</em> a label; the pulse says nothing by itself either; the colour and the label
        underneath say it. Someone who turns motion off loses no information.
      </>
    ),

    tokensLink: "Tokens",
    physicsLink: "Physics",
    tokensNote: (
      <>
        The <strong>full list of durations and curves, with their values</strong>, is on the Tokens
        page, generated from source. It is not repeated here: a value written in two places will
        one day lie in one of them.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("motion")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <H2>{t.whatFor}</H2>
      <P>{t.whatForP}</P>
      <P>{t.born}</P>

      <H2>{t.steps}</H2>
      <P>{t.stepsP}</P>
      {/* SAYFADA DEĞER LİSTESİ YOK: demo token'ın yalnız ADINI gösteriyor,
          animasyon arkada gerçek değerle koşuyor · süreler Token'lar
          sayfasında duruyor ve iki yerde iki gerçek olmasın. */}
      <Demo
        ipucu={t.ipucu.steps} labels={dict.demo} align="start" code={`transition: transform var(--duration-press) var(--ease-instrument);
transition: transform var(--duration-quick) var(--ease-instrument);
transition: transform var(--duration-base)  var(--ease-instrument);
transition: transform var(--duration-slow)  var(--ease-instrument);`}>
        <KademeOrnegi labels={t.demo} />
      </Demo>
      <Demo
        ipucu={t.ipucu.press}
        labels={dict.demo}
        code={`<Button variant="primary">${t.save}</Button>
<Button>${t.cancel}</Button>`}
      >
        <Button variant="primary">{t.save}</Button>
        <Button>{t.cancel}</Button>
      </Demo>
      <P>{t.pressWhy}</P>

      <H2>{t.curves}</H2>
      <P>{t.curvesP}</P>
      <Demo
        ipucu={t.ipucu.curves} labels={dict.demo} align="start" code={`/* ${t.demo.signature} */
transition-timing-function: var(--ease-instrument);

/* ${t.demo.overshoot} */
transition-timing-function: cubic-bezier(.34, 1.56, .64, 1);`}>
        <EgriOrnegi labels={t.demo} />
      </Demo>
      <Note>{t.noOvershoot}</Note>

      <H2>{t.loops}</H2>
      <P>{t.loopsP}</P>
      <Demo
        ipucu={t.ipucu.loops} labels={dict.demo} align="start" code={`<Skeleton />
<StatusChip label="${t.live}" state="positive" dot live severity={50} />
<Spinner look="bars" label="${t.demo.loading}" />`}>
        <DonguOrnegi labels={t.demo} />
      </Demo>

      <H2>{t.reduced}</H2>
      <P>{t.reducedP}</P>
      <Demo
        ipucu={t.ipucu.reduced} labels={dict.demo} align="start" code={`@media (prefers-reduced-motion: reduce) {
  .tamga-skeleton::after { animation: none; opacity: 0.42 }
  .tamga-beacon[data-live="true"] { animation: none }
}`}>
        <AzaltilmisOrnegi labels={t.demo} />
      </Demo>
      <P>{t.reducedSkeleton}</P>

      <H2>{t.colour}</H2>
      <P>{t.colourP}</P>
      <Demo
        ipucu={t.ipucu.colour} labels={dict.demo} align="start" code={`<StatusChip label="${t.live}" state="positive" dot />`}>
        <SinyalOrnegi labels={t.demo} />
      </Demo>

      <Note>
        {t.tokensNote} <Xref to="tokens">{t.tokensLink}</Xref> ·{" "}
        <Xref to="physics">{t.physicsLink}</Xref>
      </Note>
    </>
  );
}
