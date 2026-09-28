import { Sparkline } from "tamga-ui";
import type { Tone } from "tamga-ui";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("sparkline")!.title[lang] };
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
        Satır içi, eksensiz. Bir tablo hücresine sığar ve tek soruya cevap verir:{" "}
        <em>yön ne?</em> Eksen, ızgara ve etiket yok; onlar gerçek bir grafiğin işi. Bir
        sparkline okunmaz, göz ucuyla görülür.
      </>
    ),
    related: "İlgili",
    satirlar: [
      { ad: "Keten gömlek", delta: "+%38", tone: "positive", v: [30, 28, 34, 33, 40, 38, 46, 44, 52, 58, 62, 70] },
      { ad: "Seramik kupa seti", delta: "+%9", tone: "positive", v: [40, 34, 30, 42, 38, 36, 48, 46, 52, 50, 58, 62] },
      { ad: "Deri kartlık", delta: "-%21", tone: "danger", v: [64, 60, 58, 54, 52, 48, 44, 42, 38, 34, 30, 28] },
      { ad: "Bambu çorap", delta: "%0", tone: "neutral", v: [40, 62, 40, 62, 40, 62, 40, 62, 62, 62, 62, 62] },
    ],
    listeP: (
      <>
        Asıl yeri bir <strong>liste</strong>: ad solda, çizgi ortada, değişim sağda mono ·
        sparkline tek başına bir grafik değil, bir satırın <strong>üçüncü sütunu</strong>. Eksen
        yok, etkileşim yok, alan dolgusu yok: üçü de eksensiz bir çizgiye olmayan bir ölçek
        taklidi verirdi.
      </>
    ),
    rel: (
      <>
        Zaman içinde DURUM gösteriyorsan, değer değil, aradığın şey{" "}
        <Xref to="timeline-strip">Timeline strip</Xref>. Tek bir okuma için{" "}
        <Xref to="score-ring">Score ring</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        Inline, no axes. It fits in a table cell and answers one question: <em>which way?</em> No
        axis, no grid, no labels; those are a real chart&apos;s job. A sparkline is not read; it
        is caught out of the corner of the eye.
      </>
    ),
    related: "Related",
    satirlar: [
      { ad: "Linen shirt", delta: "+38%", tone: "positive", v: [30, 28, 34, 33, 40, 38, 46, 44, 52, 58, 62, 70] },
      { ad: "Ceramic mug set", delta: "+9%", tone: "positive", v: [40, 34, 30, 42, 38, 36, 48, 46, 52, 50, 58, 62] },
      { ad: "Leather card holder", delta: "-21%", tone: "danger", v: [64, 60, 58, 54, 52, 48, 44, 42, 38, 34, 30, 28] },
      { ad: "Bamboo socks", delta: "0%", tone: "neutral", v: [40, 62, 40, 62, 40, 62, 40, 62, 62, 62, 62, 62] },
    ],
    listeP: (
      <>
        Its real place is a <strong>list</strong>: the name on the left, the line in the middle,
        the change on the right in mono · a sparkline is not a chart on its own but a row's{" "}
        <strong>third column</strong>. No axis, no interaction, no area fill: each of those would
        lend an axis-less line a scale it does not have.
      </>
    ),
    rel: (
      <>
        If you are showing STATE over time rather than a value, what you want is{" "}
        <Xref to="timeline-strip">Timeline strip</Xref>. For a single reading,{" "}
        <Xref to="score-ring">Score ring</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("sparkline")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<span className="grid grid-cols-[minmax(0,1fr)_120px_80px] items-center gap-4">
  <span className="font-semibold">${t.satirlar[0]?.ad}</span>
  <Sparkline values={series} tone="positive" />
  <span className="text-right font-mono font-bold">${t.satirlar[0]?.delta}</span>
</span>`}>
        <div className="tamga-card w-full overflow-hidden">
          {t.satirlar.map((r, i) => (
            <span
              key={r.ad}
              className="grid grid-cols-[minmax(0,1fr)_120px_80px] items-center gap-4 px-4.5 py-3"
              style={
                i < t.satirlar.length - 1
                  ? { borderBottom: "1px dashed var(--color-line)" }
                  : undefined
              }
            >
              <span className="text-body font-semibold">{r.ad}</span>
              <Sparkline values={r.v} tone={r.tone as Tone} width={120} height={28} />
              <span className="text-right font-mono text-small font-bold">{r.delta}</span>
            </span>
          ))}
        </div>
      </Demo>
      <P>{t.listeP}</P>

      <H2>Props</H2>
      <Props of="Sparkline" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
