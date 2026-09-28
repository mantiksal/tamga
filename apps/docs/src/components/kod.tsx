"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "tamga-ui";
import { Check, Copy } from "tamga-ui/icons";
import type { Dictionary } from "@/i18n/get-dictionary";

/** Paket yöneticileri, sırası sabit: varsayılan başta. */
const PM = ["pnpm", "npm", "yarn"] as const;
export type Pm = (typeof PM)[number];

/**
 * Kod bloğu — iki temada da koyu.
 *
 * NEDEN KİTİN `Code`U DEĞİL. Kitin bileşeni tek bir gövde ve bir kopyala
 * düğmesi taşıyor; buradaki şerit bir paket yöneticisi seçici ya da bir dosya
 * adı da taşıyor, ve ikisi de DOKÜMAN mobilyası: bir panelde paket yöneticisi
 * sekmesi olmaz. Kite girmesi için ikinci bir tüketici gerekiyor (üçe kadar
 * say kuralı); o gün gelirse `Code`un bir varyantı olur, yeni bir bileşen değil.
 *
 * VARSAYILAN pnpm, ve seçim HATIRLANIYOR: bir kurulum sayfasında beş kod bloğu
 * var ve her birinde yöneticiyi yeniden seçmek, aynı kararı beş kez vermek olur.
 *
 * Gerekçe: docs/07-dokuman-sitesi.md
 */
export function CodeBlock({
  code,
  pm,
  file,
  vurgu = false,
  dict,
}: {
  /** Tek gövde. `pm` verilirse kullanılmıyor. */
  code?: string;
  /** Paket yöneticisine göre üç ayrı komut. */
  pm?: Record<Pm, string>;
  /** Dosya adı şeridi. `pm` ile birlikte verilmez: şerit tek bir şey söyler. */
  file?: string;
  /** Tanıtım sayfasında: gölge vurgu renginde. Sayfadaki tek örnek olduğu için
      bir bloğun öne çıkması doğru; dokümanda sekiz blok var, hepsi çıkamaz. */
  vurgu?: boolean;
  dict: Dictionary;
}) {
  const [secili, setSecili] = useState<Pm>("pnpm");
  const [kopyalandi, setKopyalandi] = useState(false);
  const zaman = useRef<ReturnType<typeof setTimeout>>(undefined);

  /* SEÇİM OTURUMDA HATIRLANIYOR, kalıcı depoda değil: bir okuyucunun paket
     yöneticisi tercihi o ziyarete ait, ve `localStorage` bir ay sonra geri
     gelen birine sessizce eski cevabı verir. */
  useEffect(() => {
    if (!pm) return;
    try {
      const k = sessionStorage.getItem("docs-pm");
      if (k === "pnpm" || k === "npm" || k === "yarn") setSecili(k);
    } catch {
      /* depolama kapalıysa varsayılan kalıyor */
    }
  }, [pm]);

  /* Temizlenmeyen `setTimeout`: art arda tıklamada etiket erken dönüyordu. */
  useEffect(() => () => clearTimeout(zaman.current), []);

  const govde = pm ? pm[secili] : (code ?? "");

  async function kopyala() {
    try {
      await navigator.clipboard.writeText(govde);
      setKopyalandi(true);
      clearTimeout(zaman.current);
      zaman.current = setTimeout(() => setKopyalandi(false), 1400);
    } catch {
      /* İzin yoksa hiçbir şey olmuyor: sahte bir "kopyalandı" yalan olur. */
    }
  }

  function sec(m: Pm) {
    setSecili(m);
    try {
      sessionStorage.setItem("docs-pm", m);
    } catch {
      /* bkz. yukarısı */
    }
  }

  return (
    <div className="docs-cb" data-vurgu={vurgu || undefined}>
      <div className="docs-cb-bar">
        {pm
          ? PM.map((m) => (
              <button key={m} type="button" className="docs-cb-tab" data-active={m === secili} onClick={() => sec(m)}>
                {m}
              </button>
            ))
          : null}
        {file ? <span className="docs-cb-file">{file}</span> : null}
        <span className="flex-1" />
        <button type="button" className="docs-cb-copy" onClick={kopyala} aria-label={dict.demo.copyAria}>
          <Icon icon={kopyalandi ? Check : Copy} size="xs" weight="bold" />
          {kopyalandi ? dict.demo.copied : dict.demo.copy}
        </button>
      </div>
      <pre className="docs-cb-pre">{govde}</pre>
    </div>
  );
}
