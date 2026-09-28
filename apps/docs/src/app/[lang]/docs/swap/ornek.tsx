"use client";

import { useState } from "react";
import { Button, Icon, Swap } from "tamga-ui";
import { Eye, EyeSlash, Pin, SortAscending, SortDescending, Star } from "tamga-ui/icons";

/**
 * Aç/kapa düğmeleri · `Swap`ın en sık kullanımı. Durum istemcide, çünkü
 * değişimin yanındaki hiçbir şeyi kaydırmadığı ancak TIKLANINCA görülüyor.
 *
 * AÇIK OLAN YUMUŞAK DOLGU ALIYOR: iki durumu yalnız glifin ağırlığıyla
 * ayırmak, bir sütun dolusu düğmede okunmuyordu · tasarım da açık olanı
 * dolduruyor.
 */
export function SwapToggles({
  labels,
}: {
  labels: {
    favourite: string;
    favourited: string;
    pin: string;
    pinned: string;
    visible: string;
    hidden: string;
    asc: string;
    desc: string;
  };
}) {
  const [fav, setFav] = useState(true);
  const [pinned, setPinned] = useState(true);
  const [gizli, setGizli] = useState(true);
  const [azalan, setAzalan] = useState(true);

  return (
    <>
      <Button variant={fav ? "soft" : "secondary"} onClick={() => setFav((f) => !f)} aria-pressed={fav}>
        <Swap
          showing={fav ? "b" : "a"}
          a={
            <>
              <Icon icon={Star} size="base" weight="regular" />
              {labels.favourite}
            </>
          }
          b={
            <>
              <Icon icon={Star} size="base" weight="fill" />
              {labels.favourited}
            </>
          }
        />
      </Button>

      <Button
        variant={pinned ? "soft" : "secondary"}
        onClick={() => setPinned((p) => !p)}
        aria-pressed={pinned}
      >
        <Swap
          showing={pinned ? "b" : "a"}
          a={
            <>
              <Icon icon={Pin} size="base" weight="regular" />
              {labels.pin}
            </>
          }
          b={
            <>
              <Icon icon={Pin} size="base" weight="fill" />
              {labels.pinned}
            </>
          }
        />
      </Button>

      <Button onClick={() => setGizli((g) => !g)} aria-pressed={gizli}>
        <Swap
          showing={gizli ? "b" : "a"}
          a={
            <>
              <Icon icon={Eye} size="base" weight="regular" />
              {labels.visible}
            </>
          }
          b={
            <>
              <Icon icon={EyeSlash} size="base" weight="regular" />
              {labels.hidden}
            </>
          }
        />
      </Button>

      <Button onClick={() => setAzalan((a) => !a)} aria-pressed={azalan}>
        <Swap
          showing={azalan ? "b" : "a"}
          a={
            <>
              <Icon icon={SortAscending} size="base" weight="bold" />
              {labels.asc}
            </>
          }
          b={
            <>
              <Icon icon={SortDescending} size="base" weight="bold" />
              {labels.desc}
            </>
          }
        />
      </Button>
    </>
  );
}
