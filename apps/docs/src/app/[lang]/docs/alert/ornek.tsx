"use client";

import { useState } from "react";
import { Alert, Button } from "tamga-ui";
import type { Tone } from "tamga-ui";

/**
 * Kapatılabilir uyarılar · tasarımın kendi örneği de böyle çalışıyor.
 *
 * Neden canlı: `onDismiss` verilmiş bir uyarı "okuyanın kaldırabildiği mesaj",
 * verilmemiş olan "duran koşul" demek, ve bu farkı duran bir resim söylemiyor.
 */
export function UyariOrnegi({
  uyarilar,
  kapat,
  geriGetir,
}: {
  uyarilar: { state: Tone; title: string; body: string }[];
  kapat: string;
  geriGetir: string;
}) {
  const [acik, setAcik] = useState(() => uyarilar.map((_, i) => i));

  return (
    <div className="flex w-full flex-col items-start gap-4">
      {uyarilar.map((u, i) =>
        acik.includes(i) ? (
          <Alert
            key={u.title}
            state={u.state}
            title={u.title}
            dismissLabel={kapat}
            onDismiss={() => setAcik((a) => a.filter((x) => x !== i))}
          >
            {u.body}
          </Alert>
        ) : null,
      )}
      {acik.length < uyarilar.length ? (
        <Button size="sm" onClick={() => setAcik(uyarilar.map((_, i) => i))}>
          {geriGetir}
        </Button>
      ) : null}
    </div>
  );
}
