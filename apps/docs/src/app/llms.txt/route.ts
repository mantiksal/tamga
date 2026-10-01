import SAYILAR from "@/content/counts.json";
import { navGruplari } from "@/content/nav";
import { SITE } from "@/content/site";
import { yol } from "@/content/yollar";

/**
 * `/llms.txt` · siteyi okuyan dil modelleri için tek sayfalık harita.
 *
 * Kiti soran insanların bir kısmı artık bir asistana soruyor; harita olmayınca
 * asistan 98 sayfayı tahmin ediyor. Liste `nav.ts`ten üretiliyor, bayatlayamaz.
 */
export const dynamic = "force-static";

export function GET() {
  const bolumler = navGruplari("en").map((grup) => {
    const satirlar = grup.sayfalar
      .map((sayfa) => `- [${sayfa.title.en}](${SITE}${yol("en", sayfa.slug)}): ${sayfa.blurb.en}`)
      .join("\n");
    return `## ${grup.baslik.en}\n\n${satirlar}`;
  });

  const govde = `# Tamga Design System

> An open source design system for admin panels, by Mantıksal. ${SAYILAR.bilesen} components, ${SAYILAR.token} tokens and ${SAYILAR.ikon} icons in one npm package (tamga-ui, MIT).

- Docs: ${SITE}/en (Turkish: ${SITE}/tr)
- Source: https://github.com/mantiksal/tamga
- Install: npm i tamga-ui, then import "tamga-ui/styles.css".

${bolumler.join("\n\n")}
`;

  return new Response(govde, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "s-maxage=86400" },
  });
}
