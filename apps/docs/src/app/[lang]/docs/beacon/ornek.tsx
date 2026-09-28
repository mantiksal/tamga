"use client";

import { useState } from "react";
import { Beacon, Button, Icon, LiveScope } from "tamga-ui";
import { ChartLineUp } from "tamga-ui/icons";

/**
 * Köşeye iliştirilmiş çağrı · tıklanınca sönüyor.
 *
 * Neden canlı: işaretin sözü "tıklayınca söner" ve sönmeyen bir işaret bu sözü
 * tutmuyor. Konumlama doküman tarafında kalıyor: kite bir "köşe" propu koymak,
 * kitin bilmediği bir kabın ölçüsünü varsaymak olurdu.
 */
export function BeaconOrnegi({
  raporlar,
  yeniden,
}: {
  raporlar: string;
  yeniden: string;
}) {
  const [gorundu, setGorundu] = useState(false);

  /* HER İŞARET KENDİ KAPSAMINDA. Kitin kuralı "bir ekranda tek nabız" ve bir
     kapsamda en yüksek sıralı olan kazanıyor · üçü tek kapsama konduğunda
     ikisi sessizce duruyordu, ve bu sayfa tam da nabzı anlatıyor. */
  return (
    <span className="flex flex-wrap items-center gap-9">
      <LiveScope>
        <span className="relative inline-flex">
          <Button onClick={() => setGorundu(true)}>
            <Icon icon={ChartLineUp} size="xs" />
            {raporlar}
          </Button>
          {gorundu ? null : (
            <span className="absolute -top-1.5 -right-1.5">
              <Beacon look="ping" state="info" edged />
            </span>
          )}
        </span>
      </LiveScope>
      <span className="flex items-center gap-5">
        <LiveScope>
          <Beacon look="ping" state="info" />
        </LiveScope>
        <LiveScope>
          <Beacon look="ping" state="danger" />
        </LiveScope>
      </span>
      {gorundu ? (
        <Button size="sm" onClick={() => setGorundu(false)}>
          {yeniden}
        </Button>
      ) : null}
    </span>
  );
}
