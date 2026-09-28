"use client";

import { useState } from "react";
import { Button, Delta, Icon, Rise } from "tamga-ui";
import { RunNow } from "tamga-ui/icons";

/**
 * Tırmanış ancak BİR KEZ görülüyor: bileşen bağlandığında oynuyor ve bitiyor.
 * "Tekrar oynat" onu yeni bir `key` ile yeniden bağlıyor · başka türlü bu
 * sayfaya ikinci kez bakan kişi hareketi hiç göremezdi.
 */
export function RiseOrnek({
  label,
  replay,
  better,
  worse,
  flat,
}: {
  label: string;
  replay: string;
  better: string;
  worse: string;
  flat: string;
}) {
  const [tur, setTur] = useState(0);
  const bicim = (n: number) => `₺${Math.round(n).toLocaleString("tr-TR")}`;

  return (
    <div className="flex w-full flex-wrap items-center gap-9">
      <span className="flex flex-col gap-1">
        <span className="text-small font-semibold text-ink-faint">{label}</span>
        <Rise key={tur} value={28460} format={bicim} className="text-display-lg" />
      </span>

      <span className="flex flex-col gap-2.5">
        <Delta value={better} better />
        <Delta value={worse} better={false} />
        <Delta value={flat} better />
      </span>

      <Button size="sm" onClick={() => setTur((t) => t + 1)}>
        <Icon icon={RunNow} size="xs" weight="bold" />
        {replay}
      </Button>
    </div>
  );
}
