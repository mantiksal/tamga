import type { ReactNode } from "react";
import { Icon } from "tamga-ui";
import { Warning, type IconGlyph } from "tamga-ui/icons";
import propsJson from "@/content/props.json";

/**
 * Sayfa tipografisi.
 *
 * NEDEN KİTİN TİP SKALASINI KULLANMIYOR. Kitin skalası bir GÖSTERGE PANELİ için
 * ölçüldü: 13px gövde, 11px etiket, sıkı satır aralığı. Orada doğru — bir tablo
 * satırı taranır, okunmaz, ve ekrana ne kadar çok satır sığarsa o kadar iyidir.
 *
 * Bir doküman sitesi bunun tam tersi: her satır baştan sona OKUNUR. Aynı 13px
 * burada kısılmış, yorucu ve ucuz görünür. O yüzden bu site kitin RENKLERİNİ ve
 * FİZİĞİNİ alıyor ama kendi okuma ölçeğini kuruyor — 17px gövde, 1.75 satır
 * aralığı, iri başlıklar.
 *
 * Bu bir sapma değil, doğru katman ayrımı: tip skalası ürün yoğunluğu içindir,
 * düzyazı ayrı bir iştir.
 */

/**
 * Başlıktan bağlantı adı üretir.
 *
 * Türkçe harfler karşılıklarına çevriliyor (`ç→c`, `ş→s`, `ı→i` …). Ham
 * bırakmak da çalışırdı ama URL'de yüzde-kodlu bir çorba üretirdi
 * (`#şekil` → `#%C5%9Fekil`), ve bir bağlantı paylaşılabilir olmalı.
 */
const TR: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u",
};

export function slug(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşüâîû]/g, (c) => TR[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Bir düğümden düz metin — başlık `<code>` ya da vurgu içerebilir. */
function textOf(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 id={slug(textOf(children))} className="docs-h2">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="docs-h3">{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="docs-p">{children}</p>;
}

/**
 * Çevrilmemiş bir sayfanın kendi durumunu söylediği satır.
 *
 * Sessiz kalmak, okuyucuya sitenin bozuk olduğunu düşündürür. Bir cümle, o
 * yanlış anlamayı ve bir destek mesajını birden önler.
 */
export function Untranslated() {
  return (
    <div
      className="mb-9 border-l-3 py-3 pr-4 pl-4 text-[length:var(--docs-small)] leading-relaxed"
      style={{ borderColor: "var(--color-warn)", background: "var(--color-warn-bg)" }}
    >
      <strong>This page has not been translated yet.</strong> The Turkish text is shown below;
      the code examples and the API are identical in both languages.
    </div>
  );
}

/* ---------------------------- başlık bloğu ---------------------------- */

/**
 * H1 + blurb, ve sayfanın TEK kalın çizgisi.
 *
 * Metni sayfa geçiriyor ama kaynağı `nav.ts`: her sayfa `findPage(slug)` ile
 * okuyor, yani ad iki yerde yazılmıyor.
 */
/**
 * Sayfa adından bileşenin SEMBOLÜ.
 *
 * Menüde adlar ayrık yazılıyor ("Score ring"), kodda yazılacak şey bitişik
 * (`ScoreRing`); `nav.ts` bu kuralı zaten anlatıyor. Sembol buradan türüyor ve
 * `props.json`a karşı DOĞRULANIYOR: üretilen veride yoksa etiket hiç çizilmiyor.
 * Böylece kavram sayfaları (Kurulum, Tema) etiket almıyor, uydurulmuş bir
 * bileşen adı da basılmıyor.
 */
function sembolOf(title: string): string | null {
  const ad = title.replace(/\s+(.)/g, (_, c: string) => c.toUpperCase()).replace(/\s+/g, "");
  return ad in (propsJson as Record<string, unknown>) ? ad : null;
}

export function PageHead({
  title,
  blurb,
  gereksinimler,
}: {
  title: string;
  blurb: string;
  /** Sayfanın gerçekten bir gereksinimi varsa. Süs olarak eklenmez. */
  gereksinimler?: { icon: IconGlyph; label: string }[];
}) {
  const sembol = sembolOf(title);
  return (
    <header className="docs-head">
      <div className="flex flex-wrap items-center gap-3.5">
        <h1 className="docs-h1">{title}</h1>
        {/* Bileşen sayfasında adın YANINDA kodda yazılacak hâli duruyor:
            okuyucunun kopyalayacağı şey başlık değil sembol. */}
        {sembol ? <code className="docs-sembol">{`<${sembol}>`}</code> : null}
      </div>
      <p className="docs-lead">{blurb}</p>
      {gereksinimler?.length ? (
        <div className="mt-1 flex flex-wrap gap-2">
          {gereksinimler.map((g) => (
            <span key={g.label} className="docs-req">
              <Icon icon={g.icon} size="xs" weight="duotone" />
              {g.label}
            </span>
          ))}
        </div>
      ) : null}
    </header>
  );
}

/* ---------------------------- numaralı adım ---------------------------- */

/**
 * Sıralı bir işin bir adımı: solda numara, sağda iş.
 *
 * NUMARA BAŞLIKTA TEKRAR ETMİYOR. "1 · Paketi kur" diye yazmak, kutudaki sayıyı
 * ikinci kez söylemek olurdu; `Toc` başlığın metnini okuduğu için içindekiler
 * satırı yine "Paketi kur" diyor.
 *
 * `sonMu` çizgiyi kesiyor: son adımın altından inen kesik çizgi, olmayan bir
 * adımı işaret eder.
 */
export function Step({
  n,
  id,
  title,
  children,
  acik = false,
  sonMu = false,
}: {
  n: number;
  id: string;
  title: string;
  children: ReactNode;
  /** Sayfadaki tek dolu vurgu: "şu an buradasın" adımı. */
  acik?: boolean;
  sonMu?: boolean;
}) {
  return (
    <section className="docs-step">
      <div className="docs-step-rail">
        <span className="docs-step-num" data-current={acik}>
          {n}
        </span>
        {sonMu ? null : <span className="docs-step-line" />}
      </div>
      <div className="docs-step-body">
        {/* BAŞLIK NUMARAYI TEKRAR ETMİYOR ama içindekiler onu istiyor: bir TOC
            satırı sırayı da söylemek zorunda, yoksa "Paketi kur" ile "Kullan"
            arasındaki ilişki kaybolur. `data-toc` o iki ihtiyacı ayırıyor. */}
        <h2 id={id} className="docs-h2" data-toc={`${n} · ${title}`}>
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

/** Numarasız bölüm: sıralı olmayan işler için düz H2. */
export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="docs-step-body docs-bolum">
      <h2 id={id} className="docs-h2">
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ---------------------------- sebep listesi ---------------------------- */

/**
 * Numaralı sebep kartları.
 *
 * NEDEN MADDE İŞARETLİ LİSTE DEĞİL. Bir "neden böyle" listesi düz madde
 * işaretiyle yazıldığında göz onu paragrafın devamı sanıyor ve atlıyor; oysa
 * her madde bağımsız bir gerekçe. Numara sırayı değil SAYIYI söylüyor: üç
 * sebep var, üçü de okunmalı.
 */
export function Nedenler({ children }: { children: ReactNode[] }) {
  return (
    <div className="mt-3.5 grid gap-3.5">
      {children.map((c, i) => (
        <div key={i} className="docs-neden">
          <span className="docs-neden-no">{i + 1}</span>
          <p className="m-0">{c}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------- not ---------------------------- */

/**
 * Bir kuralın yanındaki uyarı.
 *
 * İLK CÜMLE KURALIN KENDİSİ, devamı sebebi: kalın yazılan yarım, atlanmaması
 * gereken yarım. Yeri de bilinçli — ilgili olduğu adımın İÇİNDE, sayfanın
 * sonunda değil: bir uyarı, ihlal edilebileceği yerde okunur.
 */
export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="docs-callout">
      <Icon icon={Warning} size="sm" weight="fill" />
      <p className="m-0">{children}</p>
    </div>
  );
}

/* ---------------------------- referans tablosu ---------------------------- */

export type RefSatir = { key: string; val: ReactNode; tag?: string };

/**
 * Ad + açıklama listesi. Düz metinle verilen böyle bir liste her zaman buna
 * çevriliyor: iki sütun hizalı olduğunda göz ada değil FARKA bakıyor.
 */
export function RefTable({ head, rows }: { head: [string, string]; rows: RefSatir[] }) {
  return (
    <div className="docs-table">
      <div className="docs-table-head docs-table-cell">
        <span>{head[0]}</span>
        <span>{head[1]}</span>
      </div>
      {rows.map((r) => (
        <div key={r.key} className="docs-table-row">
          <div className="docs-table-cell">
            <code className="docs-table-key">{r.key}</code>
            <span className="docs-table-val">
              {r.val}
              {r.tag ? <span className="docs-tag">{r.tag}</span> : null}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
