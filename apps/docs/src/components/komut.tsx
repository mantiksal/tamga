"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "tamga-ui";
import { Check, Copy } from "tamga-ui/icons";

/**
 * Kopyalanabilir kurulum komutu — hero'daki ikinci eylem.
 *
 * NEDEN BİR DÜĞME, BİR KOD BLOĞU DEĞİL. Hero'da okunacak bir şey değil
 * ALINACAK bir şey var: ziyaretçi komutu okumuyor, terminaline yapıştırıyor.
 * Bir kod bloğu o işi de yapar ama yanındaki birincil düğmeyle aynı satırda
 * durmaz; burada ikisi akranlar.
 */
export function KomutKopyala({
  komut,
  labels,
}: {
  komut: string;
  labels: { kopyala: string; kopyalandi: string };
}) {
  const [alindi, setAlindi] = useState(false);
  const zaman = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(zaman.current), []);

  return (
    <button
      type="button"
      className="tamga-btn font-mono"
      aria-label={alindi ? labels.kopyalandi : labels.kopyala}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(komut);
          setAlindi(true);
          clearTimeout(zaman.current);
          zaman.current = setTimeout(() => setAlindi(false), 1400);
        } catch {
          /* İzin yoksa hiçbir şey olmuyor: sahte bir "kopyalandı" yalan olur. */
        }
      }}
    >
      <span aria-hidden className="text-ink-faint">
        $
      </span>
      {komut}
      <Icon icon={alindi ? Check : Copy} size="xs" weight="bold" />
    </button>
  );
}
