"use client";

import { useMemo, useState } from "react";
import { cn } from "../lib/cn.js";
import { Checkbox } from "./checkbox.js";
import { Icon } from "./icon.js";
import { CaretDown, CaretRight, Search } from "./icons.js";

/**
 * Ağaç seçici — HİYERARŞİK ÇOKLU SEÇİM.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

export type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
};

/** Bir düğümün ve altındaki her şeyin id'leri. */
function altIdler(node: TreeNode): string[] {
  return [node.id, ...(node.children ?? []).flatMap(altIdler)];
}

/** Aramaya uyan düğümler ve onların ataları. */
function suz(nodes: TreeNode[], q: string): TreeNode[] {
  if (!q) return nodes;
  const alt = q.toLocaleLowerCase("tr");
  const gez = (n: TreeNode): TreeNode | null => {
    const cocuklar = (n.children ?? []).map(gez).filter((c): c is TreeNode => c !== null);
    const kendi = n.label.toLocaleLowerCase("tr").includes(alt);
    if (!kendi && cocuklar.length === 0) return null;
    return { ...n, children: kendi ? n.children : cocuklar };
  };
  return nodes.map(gez).filter((n): n is TreeNode => n !== null);
}

export function TreeSelect({
  nodes,
  value,
  onChange,
  labels,
  searchable = true,
  height = 320,
  className,
}: {
  nodes: readonly TreeNode[];
  /** The ids of the selected nodes. TR: Seçili düğüm id'leri. */
  value: readonly string[];
  onChange: (next: string[]) => void;
  labels: { search: string; empty: string; expand: string; collapse: string };
  searchable?: boolean;
  height?: number;
  className?: string;
}) {
  const [q, setQ] = useState("");
  /* Kapalı olanlar tutuluyor, açık olanlar değil: varsayılan AÇIK.
     Bir kategori ağacı kapalı açıldığında kullanıcı önce her dalı tıklamak
     zorunda kalıyor, ve aradığı şeyin nerede olduğunu bilmiyor. */
  const [kapali, setKapali] = useState<Set<string>>(new Set());

  const gorunen = useMemo(() => suz([...nodes], q), [nodes, q]);
  const secili = useMemo(() => new Set(value), [value]);

  function cevir(node: TreeNode, acikMi: boolean) {
    const etkilenen = altIdler(node);
    const next = new Set(secili);
    for (const id of etkilenen) {
      if (acikMi) next.add(id);
      else next.delete(id);
    }
    onChange([...next]);
  }

  function Dal({ node, derinlik }: { node: TreeNode; derinlik: number }) {
    const cocuklar = node.children ?? [];
    const acik = !kapali.has(node.id);
    const isaretli = secili.has(node.id);
    return (
      <li role="none">
        <div
          className="flex items-center gap-1.5 rounded-(--radius-mark) py-1 hover:bg-[var(--color-hover)]"
          style={{ paddingLeft: `${derinlik * 18}px` }}
        >
          {cocuklar.length > 0 ? (
            <button
              type="button"
              className="tamga-mini-btn size-5 shrink-0"
              aria-label={acik ? labels.collapse : labels.expand}
              aria-expanded={acik}
              onClick={() => {
                const next = new Set(kapali);
                if (acik) next.add(node.id);
                else next.delete(node.id);
                setKapali(next);
              }}
            >
              <Icon icon={acik ? CaretDown : CaretRight} size="xs" />
            </button>
          ) : (
            /* Yaprakta da aynı genişlik: ok yoksa etiketler kayıyor ve ağaç
               dişli görünüyor. */
            <span className="size-5 shrink-0" aria-hidden />
          )}
          {/* KİTİN `Checkbox`I, çıplak bir `<input>` değil.
              Bir ara burada `className="tamga-checkbox"` yazan bir input
              vardı ve öyle bir sınıf yok: tarayıcı bilmediği sınıfı sessizce
              atıyor, kutu tarayıcının kendi görünüşünde kalıyordu. Kapı
              (`check:kit-class`) yakaladı. */}
          <Checkbox
            className="min-w-0 flex-1"
            checked={isaretli}
            onChange={(v) => cevir(node, v)}
            label={
              <span className={cn("truncate", isaretli ? "text-ink" : "text-ink-soft")}>
                {node.label}
              </span>
            }
          />
        </div>
        {acik && cocuklar.length > 0 && (
          <ul role="group">
            {cocuklar.map((c) => (
              <Dal key={c.id} node={c} derinlik={derinlik + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {searchable && (
        <span className="relative flex items-center">
          <Icon
            icon={Search}
            size="xs"
            aria-hidden
            className="pointer-events-none absolute left-2.5 text-ink-faint"
          />
          <input
            type="search"
            className="tamga-input w-full"
            data-leading="true"
            placeholder={labels.search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </span>
      )}
      {/* KAYDIRMA ALANININ İÇ BOŞLUĞU ŞART.
          Ağacın en solundaki açma oku kutunun sol sınırına yapışıyordu, ve
          `.tamga-mini-btn` hover'da `translate(-1px,-1px)` ile kalkıyor:
          o bir piksel kaydırma kabının dışına çıkıyor ve `overflow-y: auto`
          onu kırpıyor (bir eksen `visible` değilse öteki de olamaz). Düğmenin
          gölgesi de sağa-aşağı 2px, o da kırpılıyordu. Dört piksel iç boşluk,
          kontrolün kendi fiziğine yer açıyor. */}
      <div className="overflow-y-auto p-1" style={{ maxHeight: height }}>
        {gorunen.length === 0 ? (
          <p className="py-6 text-center text-ink-faint">{labels.empty}</p>
        ) : (
          <ul role="tree" className="flex flex-col">
            {gorunen.map((n) => (
              <Dal key={n.id} node={n} derinlik={0} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
