"use client";

import { useState } from "react";
import { AvatarStack } from "tamga-ui";

/**
 * Yığının canlı hâli · kişi eklenip çıkarılıyor.
 *
 * Neden canlı: yığının asıl sorusu "kaç kişiden sonra sayıya dönüyor" ve bunu
 * duran bir resim söylemiyor. Sınır `gorunen`de: üstü `+N` olarak toplanıyor.
 */
export function YiginOrnek({
  kisiler,
  ekle,
  cikar,
}: {
  kisiler: string[];
  ekle: string;
  cikar: string;
}) {
  const [sayi, setSayi] = useState(4);
  const gorunen = kisiler.slice(0, Math.min(sayi, 4));
  const artan = Math.max(0, sayi - gorunen.length);

  return (
    <span className="flex flex-wrap items-center gap-6">
      <AvatarStack names={gorunen} extra={artan || undefined} size={38} />
      <span className="flex gap-2">
        <button
          type="button"
          className="tamga-mini-btn"
          onClick={() => setSayi((n) => Math.min(kisiler.length + 8, n + 1))}
        >
          {ekle}
        </button>
        <button
          type="button"
          className="tamga-mini-btn"
          onClick={() => setSayi((n) => Math.max(1, n - 1))}
        >
          {cikar}
        </button>
      </span>
    </span>
  );
}
