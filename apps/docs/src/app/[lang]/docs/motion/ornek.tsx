"use client";

import { useState } from "react";
import { Button, Icon, Skeleton, Spinner, StatusChip, Switch, toneOf } from "tamga-ui";
import { Check, Close, Play } from "tamga-ui/icons";

/**
 * Hareket sayfasının canlı yarısı.
 *
 * BU SAYFADA DEĞER LİSTESİ YOK: demolar token'ın yalnız ADINI gösteriyor,
 * animasyon arkada gerçek değerle koşuyor. Süreler ve eğriler Token'lar
 * sayfasında duruyor · bir sayı iki yerde yazarsa iki gerçek olur.
 */

const KADEME = ["--duration-press", "--duration-quick", "--duration-base", "--duration-slow"];
const YESIL = toneOf("positive");

export function KademeOrnegi({
  labels,
}: {
  labels: { names: string[]; play: string; reset: string; stepsHint: string };
}) {
  const [ucta, setUcta] = useState(false);
  return (
    <div className="flex w-full flex-col gap-3">
      {KADEME.map((token, i) => (
        <div key={token} className="docs-hr-satir">
          <span className="flex min-w-0 flex-col gap-px">
            <strong className="text-small font-extrabold">{labels.names[i]}</strong>
            <code className="truncate font-mono text-caption text-ink-faint">{token}</code>
          </span>
          {/* AYNI MESAFE, DÖRT HIZ: bir süre ancak başka bir sürenin yanında ve
              aynı yolu koşarken okunuyor · dört ayrı mesafede dördü de "hızlı"
              görünüyordu. */}
          <span className="docs-iz">
            <span
              className="docs-iz-kare"
              style={{ left: ucta ? "calc(100% - 28px)" : "4px", transitionDuration: `var(${token})` }}
            />
          </span>
        </div>
      ))}
      <div className="docs-hr-oynat">
        <Button size="sm" onClick={() => setUcta((v) => !v)}>
          <Icon icon={Play} size="xs" weight="bold" />
          {ucta ? labels.reset : labels.play}
        </Button>
        <span className="text-small text-ink-faint">{labels.stepsHint}</span>
      </div>
    </div>
  );
}

export function EgriOrnegi({
  labels,
}: {
  labels: { signature: string; overshoot: string; play: string; reset: string; curvesHint: string };
}) {
  const [ucta, setUcta] = useState(false);
  const satirlar = [
    {
      etiket: labels.signature,
      token: "--ease-instrument",
      icon: Check,
      renk: YESIL.fg,
      ease: "var(--ease-instrument)",
      yanlis: false,
    },
    {
      etiket: labels.overshoot,
      /* Ham `cubic-bezier` bilerek: bu eğrinin token'ı YOK, ve olmaması bu
         demonun bütün konusu. Bir ad verilse örnek kendi savını çürütürdü. */
      token: "cubic-bezier(.34, 1.56, .64, 1)",
      icon: Close,
      renk: toneOf("danger").fg,
      ease: "cubic-bezier(.34, 1.56, .64, 1)",
      yanlis: true,
    },
  ];
  return (
    <div className="flex w-full flex-col gap-3">
      {satirlar.map((r) => (
        <div key={r.token} className="docs-hr-satir">
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="docs-hr-etiket" style={{ color: r.renk }}>
              <Icon icon={r.icon} size="xs" weight="bold" />
              {r.etiket}
            </span>
            <code className="truncate font-mono text-caption text-ink-faint">{r.token}</code>
          </span>
          <span className="docs-iz docs-iz-hedefli">
            <span
              className="docs-iz-kare"
              data-yanlis={r.yanlis || undefined}
              style={{
                left: ucta ? "calc(100% - 52px)" : "6px",
                /* 700ms bu demonun kendi süresi, bir token DEĞİL: gerçek
                   kademelerde iki eğrinin farkı göz kırpması kadar sürüyor ve
                   hiç görünmüyor. */
                transitionDuration: "700ms",
                transitionTimingFunction: r.ease,
              }}
            />
          </span>
        </div>
      ))}
      <div className="docs-hr-oynat">
        <Button size="sm" onClick={() => setUcta((v) => !v)}>
          <Icon icon={Play} size="xs" weight="bold" />
          {ucta ? labels.reset : labels.play}
        </Button>
        <span className="text-small text-ink-faint">{labels.curvesHint}</span>
      </div>
    </div>
  );
}

type DonguEtiket = { live: string; loading: string; breath: string; beacon: string; bar: string };

/**
 * Üç döngü · iskelet nefesi, canlı işaretin nabzı, yürüyen çubuklar.
 *
 * `severity` VERİLİYOR çünkü `positive` tonunun kendi sırası yok (bir şeyin
 * çalışması bir sapma değil) ve sırasız bir talep nabız kazanamıyor. Burada
 * nabzın konusu tonun aciliyeti değil, döngünün kendisi.
 */
function Donguler({ labels }: { labels: DonguEtiket }) {
  return (
    <>
      {/* İSKELET KENDİ KARTINDA VE TAM GENİŞLİKTE: bir yer tutucu, yerini
          tuttuğu şeyin ölçüsünde durmadığında "yükleniyor" demiyor. */}
      <div className="docs-hr-iskelet">
        {[60, 88, 40].map((w, i) => (
          <Skeleton key={w} index={i} className="h-3" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="docs-hr-canli">
        <StatusChip label={labels.live} state="positive" dot live severity={50} />
        <Spinner look="bars" label={labels.loading} />
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          ["--duration-breath", labels.breath],
          ["--duration-beacon", labels.beacon],
          ["--duration-bar", labels.bar],
        ].map(([token, ne]) => (
          <span key={token} className="docs-hr-token">
            <code className="font-mono font-bold">{token}</code>
            <span className="text-ink-faint">{ne}</span>
          </span>
        ))}
      </div>
    </>
  );
}

export function DonguOrnegi({ labels }: { labels: DonguEtiket }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <Donguler labels={labels} />
    </div>
  );
}

export function AzaltilmisOrnegi({
  labels,
}: {
  labels: DonguEtiket & { setting: string; save: string };
}) {
  const [azalt, setAzalt] = useState(true);
  return (
    <div className="flex w-full flex-col gap-4" data-azalt={azalt || undefined}>
      {/* GERÇEK SAYFADA BU ANAHTAR YOK: ayar kullanıcının sisteminden geliyor.
          Burada yalnızca iki hâli yan yana göstermek için duruyor. */}
      <span className="flex flex-wrap items-center gap-3">
        <Switch on={azalt} onChange={setAzalt} label={labels.setting} />
        <code className="font-mono text-caption">prefers-reduced-motion: reduce</code>
      </span>
      <Donguler labels={labels} />
      {/* BASMA KALIYOR: azaltılmış hareket "hiçbir şey kıpırdamasın" demek
          değil · dönen ve nabız atan durur, bir düğme yine basılır. */}
      <span>
        <Button variant="primary" size="sm">
          {labels.save}
        </Button>
      </span>
    </div>
  );
}

export function SinyalOrnegi({
  labels,
}: {
  labels: { onlyColour: string; colourDot: string; full: string; live: string };
}) {
  const kartlar = [
    { ad: labels.onlyColour, nokta: false },
    { ad: labels.colourDot, nokta: true },
  ];
  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {kartlar.map((k) => (
        <div key={k.ad} className="docs-hr-sinyal">
          {/* SON KART GERÇEK `StatusChip`, İLK İKİSİ ELDE ÇİZİLİ · ve olması
              gerektiği gibi: kit noktasız ya da metinsiz bir durum çipi
              ÜRETMİYOR, demonun konusu da tam olarak o eksik hâller.
              Metin gizli ama YER KAPLIYOR: üç çip aynı genişlikte durmazsa
              karşılaştırma değil bir ölçü farkı okunuyor. */}
          <span className="tamga-chip" style={{ background: YESIL.bg, color: YESIL.fg }}>
            {k.nokta ? (
              <span className="tamga-mark inline-block" style={{ background: YESIL.mark }} />
            ) : null}
            <span className="invisible">{labels.live}</span>
          </span>
          <span className="docs-hr-sinyal-ad">{k.ad}</span>
        </div>
      ))}
      <div className="docs-hr-sinyal">
        <StatusChip label={labels.live} state="positive" dot />
        <span className="docs-hr-sinyal-ad">{labels.full}</span>
      </div>
    </div>
  );
}
