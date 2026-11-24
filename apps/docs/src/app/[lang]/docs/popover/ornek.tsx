"use client";

import { useState } from "react";
import { Button, ListRow, Popover } from "tamga-ui";

/* KONTROLLÜ PANEL: açık olup olmadığını sayfa tutuyor, bir satır seçilince kapatıyor. */
export function KontrolluPopover({ tetik, baslik, satirlar, sayac }: { tetik: string; baslik: string; satirlar: string[]; sayac: string }) {
  const [acik, setAcik] = useState(false);
  const [secilen, setSecilen] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-start gap-3">
      <Popover
        open={acik}
        onOpenChange={setAcik}
        title={baslik}
        trigger={
          <Button>
            {tetik}
            <span className="tamga-sayac tabular-nums">{satirlar.length}</span>
          </Button>
        }
      >
        <div className="-mx-1 flex flex-col">
          {satirlar.map((s) => (
            <ListRow
              key={s}
              size="sm"
              onClick={() => {
                setSecilen(s);
                setAcik(false);
              }}
            >
              {s}
            </ListRow>
          ))}
        </div>
      </Popover>
      <span className="text-small text-ink-faint">
        {sayac}: {secilen ?? "–"}
      </span>
    </div>
  );
}
