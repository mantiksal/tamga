"use client";

import { useState } from "react";
import { Field, Textarea } from "tamga-ui";

/**
 * Sayaç ancak YAZARKEN anlatıyor: sınırı aşınca kritik renge döndüğü, durağan
 * bir örnekte hiç görünmüyor.
 */
export function TextareaSayac({
  label,
  placeholder,
  initial,
  max = 120,
}: {
  label: string;
  placeholder: string;
  initial: string;
  max?: number;
}) {
  const [metin, setMetin] = useState(initial);
  return (
    <div className="w-full max-w-125">
      <Field label={label} count={{ value: metin.length, max }} htmlFor="aciklama">
        <Textarea
          id="aciklama"
          rows={4}
          full
          placeholder={placeholder}
          value={metin}
          invalid={metin.length > max}
          onChange={(e) => setMetin(e.target.value)}
        />
      </Field>
    </div>
  );
}
