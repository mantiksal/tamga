"use client";

import { useState } from "react";
import { Button, Checkbox, SelectAll, SortHeader, StatusChip, Table } from "tamga-ui";
import type { SortDirection, Tone } from "tamga-ui";

/**
 * Tablonun tamamı: seçim, sıralama ve satır eylemi birlikte.
 *
 * Neden canlı: üçü de ancak TIKLANINCA görünüyor · seç-hepsini kutusunun üçüncü
 * hâli (bazıları seçili), sıralamanın yön değiştirmesi ve seçili satırın
 * yıkaması duran bir resimde yok.
 */
type Satir = { id: string; ad: string; tutar: number; durum: Tone; etiket: string };

export function TabloOrnegi({
  satirlar,
  basliklar,
  detay,
  secilen,
  secTumu,
}: {
  satirlar: readonly Satir[];
  basliklar: { id: string; musteri: string; tutar: string; durum: string };
  detay: string;
  /* SAYIYA GÖRE HAZIR METİNLER, fonksiyon değil: React sunucudan istemciye
     fonksiyon geçirmiyor, ve çoğul kuralı zaten bir çeviri meselesi · sayfa
     onları yazıp diziyi geçiyor. */
  secilen: readonly string[];
  secTumu: string;
}) {
  const [secili, setSecili] = useState<string[]>(["#TG-10482"]);
  const [sira, setSira] = useState<{ alan: "id" | "tutar"; yon: SortDirection }>({
    alan: "tutar",
    yon: "desc",
  });

  const sirali = [...satirlar].sort((a, b) => {
    const fark = sira.alan === "tutar" ? a.tutar - b.tutar : a.id.localeCompare(b.id);
    return sira.yon === "asc" ? fark : -fark;
  });

  return (
    <div className="tamga-card w-full overflow-hidden">
      <Table>
        <thead>
          <tr>
            <th className="w-11">
              <SelectAll
                checked={secili.length === satirlar.length}
                indeterminate={secili.length > 0 && secili.length < satirlar.length}
                label={secTumu}
                onChange={(v) => setSecili(v ? satirlar.map((s) => s.id) : [])}
              />
            </th>
            <SortHeader
              className="w-32"
              direction={sira.alan === "id" ? sira.yon : undefined}
              onSort={(yon) => setSira({ alan: "id", yon })}
            >
              {basliklar.id}
            </SortHeader>
            <th>{basliklar.musteri}</th>
            <SortHeader
              className="w-32 text-right"
              direction={sira.alan === "tutar" ? sira.yon : undefined}
              onSort={(yon) => setSira({ alan: "tutar", yon })}
            >
              {basliklar.tutar}
            </SortHeader>
            <th className="w-36">{basliklar.durum}</th>
            <th className="w-24" />
          </tr>
        </thead>
        <tbody>
          {sirali.map((r) => (
            <tr key={r.id} data-selected={secili.includes(r.id)}>
              <td>
                {/* Etiket ekran okuyucuda kalıyor, gözde değil: bir sütun
                    dolusu kutunun yanında yazılı bir sipariş no, satırdaki
                    numarayı ikinci kez söylerdi. */}
                <Checkbox
                  compact
                  checked={secili.includes(r.id)}
                  label={<span className="sr-only">{r.id}</span>}
                  onChange={(v) =>
                    setSecili((s) => (v ? [...s, r.id] : s.filter((x) => x !== r.id)))
                  }
                />
              </td>
              <td className="font-mono text-small font-bold">{r.id}</td>
              <td className="font-semibold">{r.ad}</td>
              <td className="text-right font-mono font-bold tabular-nums">
                ₺{r.tutar.toLocaleString("tr-TR")}
              </td>
              <td>
                <StatusChip label={r.etiket} state={r.durum} dot={false} />
              </td>
              <td className="text-right">
                <Button size="sm">{detay}</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* SEÇİM SAYISI TABLONUN ALTINDA, üstünde değil: seçim satırlarda
          yapılıyor ve sayının onlara yakın durması gerekiyor. */}
      <span className="tamga-gutter block py-2.5 text-small text-ink-faint">
        {secilen[secili.length] ?? secilen[0]}
      </span>
    </div>
  );
}
