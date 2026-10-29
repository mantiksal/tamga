"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import { Drag } from "./icons.js";

/**
 * Sıralanabilir liste · sürükle bırak, klavyeyle taşıma ve taşımanın duyurusu.
 *
 * Tutamak bir düğme (Boşluk tutar, oklar taşır, Esc vazgeçer); sürükleme işaretçi
 * olaylarıyla, çünkü HTML5 sürükle-bırakı dokunmatikte çalışmıyor.
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */
export function SortableList<T extends { key: string }>({
  items,
  onReorder,
  renderItem,
  itemLabel,
  labels,
  disabled = false,
  className,
  ...rest
}: {
  /** The rows. An item's `data-*` keys land on its row. TR: Satırlar. Öğenin `data-*` anahtarları kendi satırına iner. */
  items: readonly (T & Record<string, unknown>)[];
  /** Fires once, on drop, with every key in the new order. TR: Bırakınca bir kez, bütün anahtarlar yeni sırada. */
  onReorder: (keys: string[]) => void;
  /**
   * Draws one row; `handle` is the grip, put it where the row starts. TR: Bir satırı çizer;
   * `handle` tutamak, satırın başına koyun.
   */
  renderItem: (item: T, row: { handle: ReactNode; dragging: boolean }) => ReactNode;
  /** The item's name, as the announcements and the grip say it. TR: Öğenin adı; duyurular ve tutamak onu söylüyor. */
  itemLabel: (item: T) => string;
  /**
   * Every sentence is the caller's; `position` counts from 1. TR: Her cümle çağıranın; `position`
   * 1'den sayar.
   */
  labels: {
    /** The grip's accessible name: "Move Website". TR: Tutamağın erişilebilir adı: "Web sitesini taşı". */
    handle: (name: string) => string;
    /** How to use the grip, read once with it: "Space picks up, arrows move". TR: Tutamağın kullanımı, onunla bir kez okunur: "Boşluk tutar, oklar taşır". */
    instructions: string;
    picked: (name: string, position: number, total: number) => string;
    moved: (name: string, position: number, total: number) => string;
    dropped: (name: string, position: number, total: number) => string;
    cancelled: (name: string) => string;
  };
  /** Rows are drawn, nothing moves; the grips are gone. TR: Satırlar çiziliyor, hiçbir şey taşınmıyor; tutamaklar yok. */
  disabled?: boolean;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  /* TAŞIMA SÜRERKEN SIRA YERELDE, bırakınca çağırana gidiyor: her adımda
     `onReorder` ateşlenseydi bir sunucuya kaydeden ürün her ok tuşunda yazardı. */
  const [taslak, setTaslak] = useState<string[] | null>(null);
  const [tutulan, setTutulan] = useState<string | null>(null);
  const [duyuru, setDuyuru] = useState("");
  const satirlar = useRef(new Map<string, HTMLLIElement>());
  const ilk = useRef<string[]>([]);
  const talimatId = useId();

  const sira = taslak ?? items.map((i) => i.key);
  const bul = (key: string) => items.find((i) => i.key === key)!;
  const ad = (key: string) => itemLabel(bul(key));

  const tut = (key: string) => {
    ilk.current = items.map((i) => i.key);
    setTaslak(ilk.current);
    setTutulan(key);
    setDuyuru(labels.picked(ad(key), ilk.current.indexOf(key) + 1, items.length));
  };
  const tasi = (key: string, hedef: number) => {
    const simdi = sira.filter((k) => k !== key);
    const yer = Math.max(0, Math.min(hedef, simdi.length));
    simdi.splice(yer, 0, key);
    if (simdi.join() === sira.join()) return;
    setTaslak(simdi);
    setDuyuru(labels.moved(ad(key), yer + 1, items.length));
  };
  const birak = () => {
    if (!tutulan) return;
    const son = sira;
    setDuyuru(labels.dropped(ad(tutulan), son.indexOf(tutulan) + 1, items.length));
    setTutulan(null);
    setTaslak(null);
    if (son.join() !== ilk.current.join()) onReorder(son);
  };
  const vazgec = () => {
    if (!tutulan) return;
    setDuyuru(labels.cancelled(ad(tutulan)));
    setTutulan(null);
    setTaslak(null);
  };

  /* İşaretçinin altındaki yer: ortası işaretçinin üstünde kalan satır sayısı. */
  const yerBul = (key: string, y: number) =>
    sira.filter((k) => {
      if (k === key) return false;
      const r = satirlar.current.get(k)?.getBoundingClientRect();
      return r ? r.top + r.height / 2 < y : false;
    }).length;

  const tutamak = (key: string) =>
    disabled ? null : (
      <button
        type="button"
        className="tamga-sortable-handle"
        aria-label={labels.handle(ad(key))}
        aria-describedby={talimatId}
        aria-pressed={tutulan === key}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            if (tutulan === key) birak();
            else tut(key);
          } else if (tutulan === key && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
            e.preventDefault();
            tasi(key, sira.indexOf(key) + (e.key === "ArrowUp" ? -1 : 1));
          } else if (tutulan === key && e.key === "Escape") {
            e.preventDefault();
            vazgec();
          }
        }}
        /* Odak kaçarsa taşıma bırakılmış sayılıyor: tutulu kalmış görünmez bir öğe,
           bir sonraki ok tuşunu başka bir şeye çevirirdi. */
        onBlur={() => tutulan === key && birak()}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          tut(key);
        }}
        onPointerMove={(e) => {
          if (tutulan !== key || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
          tasi(key, yerBul(key, e.clientY));
        }}
        onPointerUp={(e) => {
          if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
          e.currentTarget.releasePointerCapture(e.pointerId);
          birak();
        }}
        onPointerCancel={vazgec}
      >
        <Icon icon={Drag} size="sm" weight="bold" />
      </button>
    );

  return (
    <div {...dataProps(rest)} className={cn("min-w-0", className)}>
      <span id={talimatId} className="sr-only">
        {labels.instructions}
      </span>
      <ul className="tamga-sortable">
        {sira.map((key) => {
          const item = bul(key);
          const suruklenen = tutulan === key;
          return (
            <li
              {...dataProps(item)}
              key={key}
              ref={(el) => {
                if (el) satirlar.current.set(key, el);
                else satirlar.current.delete(key);
              }}
              className="tamga-sortable-row"
              data-key={key}
              data-dragging={suruklenen || undefined}
            >
              {renderItem(item, { handle: tutamak(key), dragging: suruklenen })}
            </li>
          );
        })}
      </ul>
      {/* Duyuru KİBAR: taşıma sürerken okuyucu bir önceki cümleyi bitirebilmeli. */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {duyuru}
      </span>
    </div>
  );
}
