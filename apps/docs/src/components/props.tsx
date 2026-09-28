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
  tr: {
    prop: "Prop",
    type: "Tip",
    def: "Varsayılan",
    desc: "Açıklama",
    required: "zorunlu",
    none: "–",
    empty: "Bu bileşenin kendi prop'u yok.",
  },
  en: {
    prop: "Prop",
    type: "Type",
    def: "Default",
    desc: "Description",
    required: "required",
    none: "–",
    empty: "This component takes no props of its own.",
  },
} as const;

type Prop = {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  doc: string | null;
  docTr: string | null;
};

export function Props({
  of,
  lang,
  etiketli = false,
}: {
  of: string;
  lang: Locale;
  /**
   * Tablonun üstünde `<BileşenAdı>` etiketi.
   *
   * Yalnız bir sayfada BİRDEN ÇOK tablo varsa veriliyor: tek tablolu bir
   * sayfada etiket, başlığın yanındaki sembolü ikinci kez söylemek olur. İki
   * tablolu bir sayfada ise "bu satırlar hangi bileşenin" sorusunun tek cevabı.
   */
  etiketli?: boolean;
}) {
  const rows = (props as Record<string, Prop[]>)[of];
  const t = L[lang];
  const gerekce = (p: Prop) => (lang === "tr" ? p.docTr : p.doc) ?? p.doc;

  if (!rows) return null;
  if (rows.length === 0) return <p className="docs-p">{t.empty}</p>;

  return (
    /* Dar ekranda tablo KENDİ içinde kayar; sayfa gövdesi yana kaymaz. Uzun bir
       birleşim tipi (`secondary · primary · success · danger · ghost · link`)
       bunu her zaman tetikler, o yüzden sarmalayıcı isteğe bağlı değil. */
    <div className="docs-props">
      {etiketli ? (
        <span className="docs-props-etiket">
          <code className="docs-sembol">{`<${of}>`}</code>
        </span>
      ) : null}
      <div className="docs-props-min">
        <div className="docs-props-row docs-table-head">
          <span>{t.prop}</span>
          <span>{t.type}</span>
          <span>{t.def}</span>
          <span>{t.desc}</span>
        </div>
        {rows.map((p) => (
          <div key={p.name} className="docs-props-row docs-table-row">
            <span className="flex flex-wrap items-center gap-1.5">
              <code className="docs-props-ad">{p.name}</code>
              {/* Zorunluluk renkle DEĞİL kelimeyle söyleniyor: bir tabloda
                  kırmızı bir hücre "hata" diye okunur, "gerekli" diye değil. */}
              {p.required ? <span className="docs-props-zorunlu">{t.required}</span> : null}
            </span>
            <code className="docs-props-tip">{p.type}</code>
            <code className="docs-props-var">{p.default ?? t.none}</code>
            {/* Gerekçe yoksa hücre BOŞ kalıyor: uydurulmuş bir açıklama,
                açıklaması olmayan bir proptan kötü. */}
            <span className="docs-props-aciklama">{gerekce(p) ?? ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
