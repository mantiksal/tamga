import type { ReactNode } from "react";

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

export function PageHead({ title, blurb }: { title: string; blurb: string }) {
  return (
    <header className="mb-12">
      <h1 className="docs-h1">{title}</h1>
      <p className="docs-lead">{blurb}</p>
    </header>
  );
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

export function Note({ children }: { children: ReactNode }) {
  return <div className="docs-note">{children}</div>;
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
