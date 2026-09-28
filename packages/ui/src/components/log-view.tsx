"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { toneOf, type Tone } from "./tone.js";

/**
 * Log görüntüleyici.
 *
 * Gerekçe: docs/gerekce/02-veri-ve-liste.md
 */

export type LogLine = {
  id: string;
  /**
   * Pre-formatted; the kit knows no time format. TR: Önceden biçimlendirilmiş; kit saat biçimi
   * bilmez.
   */
  time?: string;
  /**
   * The level badge's word: "INFO", "ERROR", "HATA". The kit draws the badge, the product
   * writes it. TR: Seviye etiketinin sözcüğü: "INFO", "ERROR", "HATA". Rozeti kit çizer,
   * sözcüğü ürün yazar.
   */
  level?: string;
  text: string;
  tone?: Tone;
};

export function LogView({
  lines,
  label,
  labels,
  filters,
  height = 320,
  follow = true,
  wrap = false,
  className,
  ...rest
}: {
  lines: readonly LogLine[];
  /**
   * The region's name; it shows in the landmark list for keyboard navigation. TR: Bölgenin adı;
   * klavyeyle gezinende landmark listesinde görünür.
   */
  label: string;
  /**
   * `newLines` is the button that appears when lines arrive while you are reading further up:
   * "↓ 12 new lines". TR: `newLines`, yukarıda okurken satır geldiğinde beliren düğme: "↓ 12
   * yeni satır".
   */
  labels: { newLines: (n: number) => string };
  /**
   * The level filter bar over the stream. The kit draws the bar and marks the chosen one; WHICH
   * levels exist and what they are called is the product's vocabulary, and the filtering itself
   * happens on the caller's side · a log view that filters its own lines would have to know what
   * a level means. TR: Akışın üstündeki seviye filtresi. Çubuğu kit çiziyor ve seçili olanı
   * işaretliyor; hangi seviyelerin olduğu ve adları ürünün sözlüğü, ve süzme çağıranın tarafında
   * kalıyor · kendi satırlarını süzen bir günlük, bir seviyenin ne demek olduğunu bilmek
   * zorunda kalırdı.
   */
  filters?: {
    options: readonly ({ value: string; label: string } & Record<string, unknown>)[];
    value: string;
    onChange: (value: string) => void;
  };
  height?: number;
  /** Scroll to the bottom when a new line arrives. TR: Yeni satır geldiğinde en alta kay. */
  follow?: boolean;
  /**
   * Wrap long lines. Off, it scrolls horizontally. TR: Uzun satırları sar. Kapalıyken yatay
   * kayar.
   */
  wrap?: boolean;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const box = useRef<HTMLDivElement>(null);
  /* Okunmamış satırlar SAYILIYOR, sadece "yeni var mı" değil: sayı, aşağı
     inmeye değer mi kararını veren şey. Son görülen uzunluk bir ref'te
     tutuluyor çünkü render'ı tetiklemesi gereken şey sayı, uzunluk değil. */
  const gorulen = useRef(lines.length);
  const [yeni, setYeni] = useState(0);

  function altta(el: HTMLDivElement) {
    /* 32px tolerans: tam altta olmayı beklemek, bir piksellik kaydırmada
       takibi kapatıyor. */
    return el.scrollHeight - el.scrollTop - el.clientHeight < 32;
  }

  function dibeGit() {
    const el = box.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    gorulen.current = lines.length;
    setYeni(0);
  }

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const eklenen = Math.max(0, lines.length - gorulen.current);
    /* SADECE ZATEN ALTTAYSA kaydır. Yukarıda bir şey okuyan kişiyi aşağı
       fırlatmak, bu bileşenin yapabileceği en can sıkıcı şey — ve "hep en
       alta git" davranışının varsayılan olduğu her log görüntüleyicide
       yaşanır. Fırlatmamanın bedeli, gelen satırın görünmemesi: düğme tam
       onun için var. */
    if (follow && altta(el)) {
      el.scrollTop = el.scrollHeight;
      setYeni(0);
    } else if (eklenen > 0) {
      setYeni((n) => n + eklenen);
    }
    gorulen.current = lines.length;
  }, [lines, follow]);

  return (
    <div {...dataProps(rest)} className={cn("tamga-log", className)} style={{ height }}>
      {filters ? (
        /* SEÇİLİ FİLTRE DOLU DÜĞME: Yasa 2 burada tam yerinde · seçmek bir
           eylem, ve dolu olan hangi kesitin açık olduğunu tek bakışta veriyor. */
        <div className="tamga-log-filtre">
          {filters.options.map(({ value: v, label: etiket, ...kanca }) => (
            /* Çağıranın kancaları ÖNCE, kitin nitelikleri SONRA: tersi olsaydı
               bir `aria-pressed` kancası kitin kendi durumunu ezerdi. */
            <button
              {...kanca}
              key={v}
              type="button"
              className={`tamga-btn tamga-btn-sm ${v === filters.value ? "tamga-btn-primary" : ""}`}
              aria-pressed={v === filters.value}
              onClick={() => filters.onChange(v)}
            >
              {etiket}
            </button>
          ))}
        </div>
      ) : null}
      <div
        ref={box}
        className="tamga-log-akis"
        data-filtreli={filters ? true : undefined}
        /* `log` rolü: ekran okuyucu bunu bir günlük olarak tanır ve — kritik
           olarak — `aria-live` OLMADAN sessiz kalır. Akan bir bölgeyi
           duyurmak sesli okuyucuyu boğar; kullanıcı isterse kendisi okur. */
        role="log"
        aria-label={label}
        tabIndex={0}
        onScroll={(e) => {
          if (yeni > 0 && altta(e.currentTarget)) setYeni(0);
        }}
      >
        {lines.map((l) => {
          const c = l.tone ? toneOf(l.tone) : null;
          return (
            <div key={l.id} className="tamga-log-satir" data-wrap={wrap || undefined}>
              {l.time ? (
                /* Zaman damgası SABİT GENİŞLİKTE ve `tabular-nums`: değişken
                   genişlikli rakamlarda her satırın metni birkaç piksel kayar
                   ve sütun okunmaz olur. */
                <span className="tamga-log-saat tabular-nums">{l.time}</span>
              ) : null}
              {/* Rozetin YUVASI sabit genişlikte, rozetin kendisi metni kadar:
                  "INFO" ile "ERROR" farklı genişlikte, ve mesaj sütunu her
                  satırda başka yerden başlarsa akış okunmuyor. Yuva bir süre
                  CSS'te vardı ama işaretlemede yoktu. */}
              {l.level ? (
                <span className="tamga-log-yuva">
                  <span
                    className="tamga-log-seviye"
                    style={c ? { background: c.bg, color: c.fg } : undefined}
                  >
                    {l.level}
                  </span>
                </span>
              ) : null}
              <span className="tamga-log-metin" style={c && !l.level ? { color: c.mark } : undefined}>
                {l.text}
              </span>
            </div>
          );
        })}
      </div>

      {yeni > 0 ? (
        <button type="button" className="tamga-log-yeni" onClick={dibeGit}>
          ↓ {labels.newLines(yeni)}
        </button>
      ) : null}
    </div>
  );
}
