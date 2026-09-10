import type { Locale } from "@/i18n/config";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Xref } from "@/components/xref";
import { Tokenlar } from "@/components/tokens";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("tokens")!.title[lang] };
}

const T = {
  tr: {
    lead: (
      <>
        Token&apos;ın <strong>adı kitin, değeri ürünündür.</strong> Bu sayfa adların tam listesi:
        theme.css ve kit.css&apos;ten <strong>üretiliyor</strong>, elle yazılmıyor, yani
        bayatlayamaz. Değerleri nasıl değiştireceğin <Xref to="theme">Tema</Xref>&apos;da.
      </>
    ),
    ikiH: "İki ad ailesi, ve hangisini kullanacağın",
    ikiP: (
      <>
        Kit iki ad ailesi taşıyor. Gündelik işte kullanacağın <code>--color-page</code>,{" "}
        <code>--color-ink</code>, <code>--color-edge</code> ailesi: kitin sınıflarının okuduğu
        isimler bunlar. Öteki aile (<code>--background</code>, <code>--card</code>,{" "}
        <code>--primary</code>) shadcn şeklinde gelen köprü katmanı; kendi kodunda ona dokunman
        gerekmiyor.
      </>
    ),
    kapiH: "İki kapı bu listeyi koruyor",
    kapiP: (
      <>
        <code>check-token-parity</code>: bir token açık temada varsa koyuda da olacak. Unutulan
        token gece sessizce açık temanın değerine düşer ve marka yarım kalır; ekranda hiçbir şey
        patlamadığı için de kimse fark etmez.
      </>
    ),
    kapiN: (
      <>
        <code>check-token-contrast</code> her temada 44 ölçüm yapıyor: metin WCAG AA (≥ 4.5),
        yükselmeyi taşıyan kenar zeminden ΔL* ≥ 10 ayrı, kural çizgisi ΔL* 4-16 bandında. İlk
        koştuğunda iki gerçek hata buldu: ikincil metin çökük yüzeyde 4.41&apos;deymiş, ve
        gezinme etiketi açık temada 3.29&apos;daymış (koyuda 5.42, ve asimetri açığın hiç
        ölçülmediğinin işaretiydi).
      </>
    ),
  },
  en: {
    lead: (
      <>
        A token&apos;s <strong>name belongs to the kit, its value to the product.</strong> This
        page is the full list of names: <strong>generated</strong> from theme.css and kit.css
        rather than written by hand, so it cannot go stale. How to change the values is in{" "}
        <Xref to="theme">Theme</Xref>.
      </>
    ),
    ikiH: "Two name families, and which one you use",
    ikiP: (
      <>
        The kit carries two name families. The one you use day to day is{" "}
        <code>--color-page</code>, <code>--color-ink</code>, <code>--color-edge</code>: these are
        the names the kit&apos;s classes read. The other family (<code>--background</code>,{" "}
        <code>--card</code>, <code>--primary</code>) is the shadcn-shaped bridge layer; your own
        code never needs to touch it.
      </>
    ),
    kapiH: "Two gates protect this list",
    kapiP: (
      <>
        <code>check-token-parity</code>: if a token exists in light, it must exist in dark. A
        forgotten token silently falls back to the light value at night and the brand is only
        half applied; nothing breaks on screen, so nobody notices.
      </>
    ),
    kapiN: (
      <>
        <code>check-token-contrast</code> takes 44 measurements per theme: text at WCAG AA
        (≥ 4.5), the edge that carries elevation ΔL* ≥ 10 off its ground, the rule line inside a
        ΔL* 4-16 band. Its first run found two real failures: secondary text sat at 4.41 on a
        sunk surface, and the navigation label at 3.29 in light (5.42 in dark, and the asymmetry
        was the tell that light had never been measured).
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const p = findPage("tokens")!;
  const t = T[lang];

  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>

      <Tokenlar lang={lang} />

      <H2>{t.ikiH}</H2>
      <P>{t.ikiP}</P>

      <H2>{t.kapiH}</H2>
      <P>{t.kapiP}</P>
      <Note>{t.kapiN}</Note>
    </>
  );
}
