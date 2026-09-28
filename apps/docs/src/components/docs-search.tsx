"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, Icon, Kbd } from "tamga-ui";
import { Search } from "tamga-ui/icons";
import { ALL_PAGES, navGruplari } from "@/content/nav";
import { yol } from "@/content/yollar";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * Doküman araması — 96 sayfa için tek giriş.
 *
 * NEDEN BİR KUTU DEĞİL BİR DÜĞME. Şeritteki şey aramanın kendisi değil, onu
 * açan kısayol: gerçek girdi diyalogda. Şeritte canlı bir input dursaydı her
 * tuşa basışta sayfa altındaki listeyi yeniden çizmesi gerekirdi, ve o liste
 * şeridin altında kalan 40 pikselde açılamaz.
 *
 * Eşleşme TÜRKÇE KÜÇÜK HARFE göre: `toLocaleLowerCase("tr")` olmadan "İkonlar"
 * araması "ikonlar" yazana sonuç vermiyor (I/İ ayrımı).
 *
 * Gerekçe: docs/07-dokuman-sitesi.md
 */
export function DocsSearch({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [acik, setAcik] = useState(false);
  const [q, setQ] = useState("");
  const [vurgu, setVurgu] = useState(0);
  const girdi = useRef<HTMLInputElement>(null);
  const router = useRouter();

  /* Sayfanın hangi grupta olduğu sonuç satırında yazıyor: "Bileşenler" ile
     "Çekirdek" arasındaki fark, aynı adı taşıyan iki sayfayı ayıran tek şey. */
  const grupAdi = useMemo(() => {
    const m = new Map<string, string>();
    for (const g of navGruplari(lang)) for (const p of g.sayfalar) m.set(p.slug, g.baslik[lang]);
    return m;
  }, [lang]);

  const kucuk = (s: string) => s.toLocaleLowerCase("tr");
  const sonuclar = useMemo(() => {
    const t = kucuk(q.trim());
    if (!t) return ALL_PAGES.slice(0, 8);
    return ALL_PAGES.filter(
      (p) => kucuk(p.title[lang]).includes(t) || kucuk(p.blurb[lang]).includes(t) || p.slug.includes(t),
    ).slice(0, 12);
  }, [q, lang]);

  /* ⌘K / Ctrl+K her yerden açıyor. `preventDefault` şart: Firefox'ta ⌘K
     adres çubuğunun arama alanına odaklanıyor. */
  useEffect(() => {
    const tus = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAcik(true);
      }
    };
    document.addEventListener("keydown", tus);
    return () => document.removeEventListener("keydown", tus);
  }, []);

  useEffect(() => {
    if (acik) {
      setQ("");
      setVurgu(0);
      /* Odak bir kare sonra: diyalog daha DOM'a girmemişken `focus()`
         hiçbir şey yapmıyor ve kullanıcı boş bir kutuya yazmaya başlıyor. */
      const t = setTimeout(() => girdi.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [acik]);

  function tusGezinme(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setVurgu((v) => Math.min(v + 1, sonuclar.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setVurgu((v) => Math.max(v - 1, 0));
    } else if (e.key === "Enter" && sonuclar[vurgu]) {
      e.preventDefault();
      setAcik(false);
      router.push(yol(lang, sonuclar[vurgu].slug));
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAcik(true)}
        className="docs-search-btn"
        aria-label={dict.nav.searchAria}
      >
        <Icon icon={Search} size="sm" />
        {/* DAR EKRANDA YALNIZ İKON. Metin ve kısayol şeritte 200 pikselden
            fazla yer kaplıyor; telefonda o yer gezinmenin. Düğmenin kendisi
            kalıyor, çünkü arama telefonda daha da gerekli: orada ray yok. */}
        <span className="docs-search-btn-text hidden dil:block">{dict.nav.search}</span>
        <span className="hidden dil:inline-flex">
          <Kbd>⌘K</Kbd>
        </span>
      </button>

      <Dialog
        open={acik}
        onClose={() => setAcik(false)}
        title={dict.nav.searchAria}
        closeLabel={dict.nav.menuKapat}
        size="lg"
      >
        <div className="docs-kit flex flex-col gap-3">
          <input
            ref={girdi}
            className="tamga-input w-full"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setVurgu(0);
            }}
            onKeyDown={tusGezinme}
            placeholder={dict.nav.search}
            aria-label={dict.nav.searchAria}
            data-autofocus
          />
          {sonuclar.length === 0 ? (
            <p className="docs-search-empty">{dict.nav.searchEmpty}</p>
          ) : (
            <ul className="docs-search-list">
              {sonuclar.map((p, i) => (
                <li key={p.slug}>
                  <Link
                    href={yol(lang, p.slug)}
                    onClick={() => setAcik(false)}
                    className="docs-search-row"
                    data-vurgu={i === vurgu}
                    onMouseEnter={() => setVurgu(i)}
                  >
                    <span className="docs-search-row-ad">{p.title[lang]}</span>
                    <span className="docs-search-row-grup">{grupAdi.get(p.slug) ?? ""}</span>
                    <span className="docs-search-row-blurb">{p.blurb[lang]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Dialog>
    </>
  );
}
