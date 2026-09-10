import props from "@/content/props.json";
import type { Locale } from "@/i18n/config";

/**
 * Props tablosu — üretilen veriden.
 *
 * Veri `scripts/extract-props.mjs` tarafından kaynaktan çıkarılıyor ve her dev
 * sunucusunda, her build'de yeniden üretiliyor. Yani bu tablo bayatlayamaz: bir
 * prop eklendiği an burada belirir, kaldırıldığı an kaybolur.
 *
 * NEDEN ELLE YAZILMADI. Elle yazılan bir props tablosu ilk değişiklikte yalan
 * söylemeye başlar, ve yalanı kimse fark etmez çünkü doküman derlenmez. Bu
 * proje aynı sessiz bozulmanın CSS karşılığını iki kez yaşadı.
 *
 * BAŞLIKLAR ÇEVRİLİR, TİPLER ÇEVRİLMEZ. `variant`, `boolean`, `"secondary"` —
 * bunlar kodda yazacağın şeyler, yani tanımlayıcı. Türkçeleştirmek okuyucunun
 * kopyalayacağı metni bozar.
 *
 * GEREKÇE İSE ÇEVRİLİR, çünkü o okunan bir metin. Yorumların bir kısmı
 * İngilizce bir kısmı Türkçe yazılmıştı ve tablo kaynağın dilini basıyordu:
 * iki dilin sayfası da yarı yarıya ötekini gösteriyordu. Karşılığı kaynaktaki
 * yorumun `TR:` yarısında (scripts/dil.mjs), ve çevirisiz gerekçe kalmıyor —
 * extract-props bir kapı.
 */

const L = {
  tr: { prop: "prop", type: "tip", def: "varsayılan", required: "zorunlu", none: "–", empty: "Bu bileşenin kendi prop'u yok." },
  en: { prop: "prop", type: "type", def: "default", required: "required", none: "–", empty: "This component takes no props of its own." },
} as const;

type Prop = {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  doc: string | null;
  docTr: string | null;
};

export function Props({ of, lang }: { of: string; lang: Locale }) {
  const rows = (props as Record<string, Prop[]>)[of];
  const t = L[lang];
  const gerekce = (p: Prop) => (lang === "tr" ? p.docTr : p.doc) ?? p.doc;

  if (!rows) return null;
  if (rows.length === 0) return <p className="docs-p">{t.empty}</p>;

  return (
    /* Dar ekranda tablo KENDİ içinde kayar; sayfa gövdesi yana kaymaz. Uzun bir
       birleşim tipi (`secondary · primary · success · danger · ghost · link`)
       bunu her zaman tetikler, o yüzden sarmalayıcı isteğe bağlı değil. */
    <div className="tamga-card my-6 overflow-x-auto">
      <table className="w-full text-body">
        <thead>
          <tr className="border-b border-[var(--color-line)] text-left">
            <th className="p-3 font-medium text-ink">{t.prop}</th>
            <th className="p-3 font-medium text-ink">{t.type}</th>
            <th className="p-3 font-medium text-ink">{t.def}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <tr key={p.name} className={i < rows.length - 1 ? "border-b border-[var(--color-line)]" : undefined}>
              <td className="p-3 align-top">
                <code className="font-mono text-caption text-ink">{p.name}</code>
                {/* Zorunluluk renkle DEĞİL kelimeyle söyleniyor: bir tabloda
                    kırmızı bir hücre "hata" diye okunur, "gerekli" diye değil. */}
                {p.required ? (
                  <span className="ml-2 font-mono text-caption tracking-wide text-ink-faint uppercase">
                    {t.required}
                  </span>
                ) : null}
                {gerekce(p) ? (
                  <p className="mt-1 max-w-[var(--docs-prop-doc)] text-caption text-ink-faint">
                    {gerekce(p)}
                  </p>
                ) : null}
              </td>
              <td className="p-3 align-top font-mono text-caption text-ink-soft">{p.type}</td>
              <td className="p-3 align-top font-mono text-caption text-ink-faint">
                {p.default ?? t.none}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
