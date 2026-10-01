import { RiseOrnek } from "./ornek";
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
  return sayfaMeta("rise", lang);
}

/**
 * Sayfa metni, iki dilli. Gerekçesi öteki sayfalarla aynı: sözlük ARAYÜZ
 * metinleri içindir, sayfa içeriği sayfayla yaşar.
 */
const T = {
  tr: {
    lead: (
      <>
        Değişim göstergesi: sayı <strong>sıfırdan hedefe yükselerek</strong> geliyor, yanındaki
        çip yönü ve işareti söylüyor. Bir panonun açılışında gözü sayıya götüren şey bu.
      </>
    ),
    label: "Bugünkü ciro",
    replay: "Tekrar oynat",
    better: "+12,4%",
    worse: "−3,1%",
    flat: "0,0%",
    bicim: (
      <>
        <code>format</code> sayının <strong>yolda</strong> nasıl yazıldığını da belirliyor,
        yalnız sonunda değil: kit ne para birimi bilir ne binlik ayracı, ve biçimlenmemiş bir ara
        değer (28460,318) tırmanışı okunmaz yapıyor.
      </>
    ),
    yavas: (
      <>
        Tırmanış <strong>yavaşlayarak</strong> varıyor. Sabit hızla artan bir sayaç, sayı
        durduğunda &ldquo;kesildi&rdquo; gibi duruyor; son çeyrekte yavaşlayan bir sayı{" "}
        <em>vardı</em> diyor.
      </>
    ),
    motion: (
      <>
        <strong>Azaltılmış harekette tırmanış yok:</strong> sayı hedefinde beliriyor. Değişen bir
        sayı, hareket duyarlılığı olan biri için kayan bir sayfadan daha yorucu · göz onu okumaya
        çalışıyor.
      </>
    ),
    delta: "Delta: değişimin kendisi",
    deltaP: (
      <>
        Çip <strong>dolu</strong>, yıkamalı değil: bir KPI&apos;ın yanında duran bu çip küçük ve
        sönük bir yıkamayla görünmüyor. İyi haber <strong>vurgu renginde</strong>, yeşilde değil ·
        yeşil bir DURUM rengi (&ldquo;çözüldü&rdquo;), oysa yükselen bir ciro bir durum değil bir
        hareket. Kötü haber kırmızı kalıyor.{" "}
        <code>better</code> zorunlu ve bir tercih değil bir <strong>anlam</strong>: artış ciroda
        iyi, yanıt süresinde kötü. <strong>Duran değişim renksiz</strong> · sıfır ne iyi ne kötü.
      </>
    ),
    rules: "Kurallar",
    related: "İlgili",
    rel: (
      <>
        Sayının kendisi için <Xref to="kpi">Kpi</Xref>; blokların aşağıdan girmesi için{" "}
        <Xref to="reveal">Reveal</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        The change indicator: the number arrives by <strong>climbing from zero to its target</strong>,
        and the chip beside it says the direction and the sign. It is what takes the eye to the
        number when a dashboard opens.
      </>
    ),
    label: "Revenue today",
    replay: "Play again",
    better: "+12.4%",
    worse: "−3.1%",
    flat: "0.0%",
    bicim: (
      <>
        <code>format</code> decides how the number is written <strong>on the way up</strong>, not
        only at the end: the kit knows no currency and no thousands separator, and an unformatted
        intermediate value (28460.318) makes the climb unreadable.
      </>
    ),
    yavas: (
      <>
        The climb <strong>slows as it arrives</strong>. A counter rising at a constant speed looks
        <em> cut off</em> when it stops; one that eases in the last quarter says it{" "}
        <em>arrived</em>.
      </>
    ),
    motion: (
      <>
        <strong>With reduced motion there is no climb:</strong> the number appears at its target.
        A changing number is harder on someone sensitive to motion than a sliding page · the eye
        keeps trying to read it.
      </>
    ),
    delta: "Delta: the change itself",
    deltaP: (
      <>
        The chip is <strong>filled</strong>, not washed: it stands beside a KPI, it is small, and
        a faint wash does not show. Good news takes the <strong>accent</strong>, not green · green
        is a STATE colour (&ldquo;resolved&rdquo;), while a rising revenue is not a state but a
        movement. Bad news stays red.{" "}
        <code>better</code> is required and it is not a taste but a <strong>meaning</strong>: a
        rise is good for revenue and bad for response time. <strong>A flat change has no
        colour</strong> · zero is neither good nor bad.
      </>
    ),
    rules: "Rules",
    related: "Related",
    rel: (
      <>
        For the number itself, <Xref to="kpi">Kpi</Xref>; for blocks entering from below,{" "}
        <Xref to="reveal">Reveal</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("rise")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo yuzey labels={dict.demo} align="start" grid={false} code={`<Rise value={28460} format={(n) => \`₺\${Math.round(n).toLocaleString("tr-TR")}\`} />

<Delta value="${t.better}" better />
<Delta value="${t.worse}" better={false} />`}>
        <RiseOrnek
          label={t.label}
          replay={t.replay}
          better={t.better}
          worse={t.worse}
          flat={t.flat}
        />
      </Demo>
      <P>{t.bicim}</P>
      <P>{t.yavas}</P>

      <H2>{t.rules}</H2>
      <Note>{t.motion}</Note>

      <H2>Props</H2>
      <Props of="Rise" lang={lang} etiketli />

      <H2>{t.delta}</H2>
      <P>{t.deltaP}</P>
      <Props of="Delta" lang={lang} etiketli />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
