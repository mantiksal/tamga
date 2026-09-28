"use client";

import { useState, type CSSProperties } from "react";
import {
  Avatar,
  Beacon,
  Button,
  Card,
  CardBody,
  Icon,
  Input,
  Segmented,
  Slider,
  StatusChip,
  Switch,
  toneOf,
} from "tamga-ui";
import { Check, Close, Search, Terminal } from "tamga-ui/icons";

/**
 * Ölçü sayfasının canlı yarısı.
 *
 * DEĞERLERİN TAM LİSTESİ TOKEN'LAR SAYFASINDA. Buradaki demolar token'ın
 * ADINI gösteriyor; ölçüler arkada gerçek token'la çalışıyor.
 */

const YESIL = toneOf("positive");
const KIRMIZI = toneOf("danger");
const SARI = toneOf("caution");

/** Beş rolün kök yarıçaptan sapması · `theme.css`teki calc zincirinin aynısı. */
const ROLLER = [
  ["--radius-chip", -2],
  ["--radius-ctl", 0],
  ["--radius-btn", 1],
  ["--radius-card", 2],
  ["--radius-panel", 4],
] as const;

export function YaricapOrnegi({
  labels,
}: {
  labels: { search: string; save: string; live: string; knob: string; roles: string[] };
}) {
  const [k, setK] = useState(6);
  return (
    <div className="flex w-full flex-col items-center gap-4.5">
      {/* KÖK DEĞİŞİYOR, ÖTEKİLER KENDİLİĞİNDEN GELİYOR. Beşi de burada yeniden
          bildiriliyor çünkü özel değerler ANNEDE çözülüyor: `:root`ta hesaplanan
          `--radius-card` çocuğa hesaplanmış hâliyle miras kalır, ve alttaki
          `--radius`ı değiştirmek onu geri hesaplatmaz. Zincir `theme.css`teki
          zincirin aynısı — demo gerçekten aynı hesabı koşuyor. */}
      <div
        className="docs-ol-kart w-full max-w-105"
        style={
          {
            "--radius": `${k}px`,
            "--radius-chip": "calc(var(--radius) - 2px)",
            "--radius-ctl": "var(--radius)",
            "--radius-btn": "calc(var(--radius) + 1px)",
            "--radius-card": "calc(var(--radius) + 2px)",
            "--radius-panel": "calc(var(--radius) + 4px)",
          } as CSSProperties
        }
      >
        <Card>
          <CardBody className="flex flex-wrap items-center gap-3">
            <span className="relative flex flex-1 basis-35 items-center">
              <Icon
                icon={Search}
                size="xs"
                weight="duotone"
                aria-hidden
                className="pointer-events-none absolute left-2.5 text-ink-faint"
              />
              <Input leading full readOnly placeholder={labels.search} />
            </span>
            <Button variant="primary">{labels.save}</Button>
            <StatusChip label={labels.live} state="positive" dot />
          </CardBody>
        </Card>
      </div>
      {/* KONTROL KARTI KENDİ KÖŞESİNİ KORUYOR: düğmeyi çeviren şeyin de
          çevrilmesi, neyin değiştiğini okunmaz hâle getiriyordu. */}
      <div className="docs-ol-knob">
        <Slider label={labels.knob} value={k} onChange={setK} min={4} max={14} step={1} suffix="px" />
        <div className="flex flex-wrap gap-1.5">
          {ROLLER.map(([token, d], i) => (
            <span key={token} className="docs-ol-rol">
              <span className="docs-ol-kare" style={{ borderRadius: `${Math.max(0, k + d)}px` }} />
              <code className="font-mono font-bold">{token}</code>
              <span className="text-ink-faint">{labels.roles[i]}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Doğru/yanlış kartlarının başlığı · bir durum çipi DEĞİL, bir yargı. */
function Yargi({ ok, text }: { ok: boolean; text: string }) {
  return (
    <span className="docs-ol-yargi" style={{ color: ok ? YESIL.fg : KIRMIZI.fg }}>
      <Icon icon={ok ? Check : Close} size="xs" weight="bold" />
      {text}
    </span>
  );
}

export function YuvarlakOrnegi({
  labels,
}: {
  labels: {
    right: string;
    wrong: string;
    live: string;
    draft: string;
    name: string;
    roundOk: string;
    roundNo: string;
  };
}) {
  return (
    <div className="docs-ol-ikili">
      <div className="docs-ol-kutu">
        <Yargi ok text={labels.right} />
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={labels.name} size={40} />
          <Beacon state="positive" live={false} label={labels.live} />
          <StatusChip label={labels.draft} state="caution" dot={false} />
        </div>
        <span className="docs-ol-alt">{labels.roundOk}</span>
      </div>
      <div className="docs-ol-kutu">
        <Yargi ok={false} text={labels.wrong} />
        {/* HAP ELDE ÇİZİLİ, VE BAŞKA TÜRLÜSÜ MÜMKÜN DEĞİL: kit hap köşeli bir
            rozet ya da çip ÜRETMİYOR. Karşı örneğin gerçek bileşenden
            çıkarılamaması, kuralın kodda durduğunun kanıtı. */}
        <div className="flex flex-wrap items-center gap-4">
          <span
            className="docs-ol-hap"
            style={{ background: KIRMIZI.mark, color: "var(--color-inverse-ink)" }}
          >
            12
          </span>
          <span className="docs-ol-hap" style={{ background: SARI.bg, color: SARI.fg }}>
            {labels.draft}
          </span>
        </div>
        <span className="docs-ol-alt">{labels.roundNo}</span>
      </div>
    </div>
  );
}

export function KenarOrnegi({
  labels,
}: {
  labels: { right: string; wrong: string; rows: readonly (readonly [string, string, string])[] };
}) {
  /* İKİ TABLO DA ELDE ÇİZİLİ, ve bilerek: sağdaki kalın kenar kitten
     çıkmıyor (öyle bir seçenek yok), soldakini kitten alsaydık iki taraf
     farklı dolgu ve farklı satır yüksekliği taşır, karşılaştırma da
     kenar kalınlığını değil o farkı gösterirdi. */
  const tablolar = [
    { ok: true, tag: labels.right, w: "1px", c: "var(--color-edge)" },
    { ok: false, tag: labels.wrong, w: "3px", c: "var(--color-edge-strong)" },
  ];
  return (
    <div className="docs-ol-ikili">
      {tablolar.map((tb) => (
        <div key={tb.w} className="flex min-w-0 flex-col gap-2.5">
          <Yargi ok={tb.ok} text={tb.tag} />
          <div className="docs-ol-tablo" style={{ borderWidth: tb.w, borderColor: tb.c }}>
            {labels.rows.map(([no, ad, tutar]) => (
              <div
                key={no}
                className="docs-ol-satir"
                style={{ borderBottomWidth: tb.w, borderBottomColor: tb.c }}
              >
                <span className="font-mono text-caption text-ink-faint">{no}</span>
                <span className="truncate font-semibold">{ad}</span>
                <span className="font-mono font-bold">{tutar}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function RitimOrnegi({
  labels,
}: {
  labels: {
    showGrid: string;
    search: string;
    save: string;
    segA: string;
    segB: string;
    view: string;
    ritimRows: readonly (readonly [string, string])[];
    ritimTags: readonly (readonly [string, string])[];
  };
}) {
  const [izgara, setIzgara] = useState(false);
  const [gorunum, setGorunum] = useState("a");
  return (
    <div className="flex w-full flex-col gap-3.5">
      <Switch on={izgara} onChange={setIzgara} label={labels.showGrid} />
      <div className="docs-ol-ritim">
        <div className="docs-ol-ritim-ic">
          {/* ÜÇÜ DE `--control`: bir düğme bir girdinin yanına konduğunda
              hizalanıyor çünkü ikisi de aynı token'ı okuyor, kimse elle
              ölçmüyor. */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="relative flex flex-1 basis-35 items-center">
              <Icon
                icon={Search}
                size="xs"
                weight="duotone"
                aria-hidden
                className="pointer-events-none absolute left-2.5 text-ink-faint"
              />
              <Input leading full readOnly placeholder={labels.search} />
            </span>
            <Segmented
              label={labels.view}
              value={gorunum}
              onChange={setGorunum}
              options={[
                { value: "a", label: labels.segA },
                { value: "b", label: labels.segB },
              ]}
            />
            <Button variant="primary">{labels.save}</Button>
          </div>
          <div className="docs-ol-liste">
            {labels.ritimRows.map(([ad, token], i) => (
              <div key={i} className={token === "--row" ? "tamga-list-row" : "tamga-list-row tamga-list-row-sm"}>
                <span className="flex-1 font-semibold">{ad}</span>
                <code className="font-mono text-caption text-ink-faint">{token}</code>
              </div>
            ))}
          </div>
        </div>
        {/* IZGARA İŞARETLEME DEĞİL ÖLÇÜ: 8px'lik yatay çizgiler ve olukta
            duran dikey çizgi, satırların o çizgilere OTURDUĞUNU gösteriyor.
            `pointer-events: none` · üstündeki kontroller tıklanabilir kalıyor. */}
        {izgara ? (
          <>
            <span aria-hidden className="docs-ol-izgara" />
            <span aria-hidden className="docs-ol-oluk" />
            <span aria-hidden className="docs-ol-oluk-ad">--gutter</span>
          </>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {labels.ritimTags.map(([token, ne]) => (
          <span key={token} className="docs-ol-rol">
            <code className="font-mono font-bold">{token}</code>
            <span className="text-ink-faint">{ne}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function YarimOrnegi({
  labels,
}: {
  labels: { right: string; wrong: string; halfOk: string; halfNo: string };
}) {
  return (
    <div className="docs-ol-ikili">
      <div className="docs-ol-kutu">
        <Yargi ok text={labels.right} />
        <span className="docs-ol-cizgi" />
        <span className="docs-ol-cizgi docs-ol-cizgi-8" />
        <code className="font-mono text-caption text-ink-faint">{labels.halfOk}</code>
      </div>
      <div className="docs-ol-kutu">
        <Yargi ok={false} text={labels.wrong} />
        {/* YARIM PİKSEL BURADA KASITLI: tarayıcı 0.5px'lik bir çizgiyi
            yuvarlayamıyor ve gri bir bulanıklık basıyor. Görülmesi gereken
            şey tam olarak bu, o yüzden ölçüler token DEĞİL. */}
        <span className="docs-ol-cizgi docs-ol-yarim" />
        <span className="docs-ol-cizgi docs-ol-kalin" />
        <code className="font-mono text-caption text-ink-faint">{labels.halfNo}</code>
      </div>
    </div>
  );
}

export function KapiOrnegi({
  labels,
}: {
  labels: { gateTitle: string; gate: readonly (readonly [string, string, string])[] };
}) {
  return (
    <div className="docs-ol-kapi">
      <div className="docs-ol-kapi-bar">
        <Icon icon={Terminal} size="sm" weight="bold" />
        {labels.gateTitle}
      </div>
      {labels.gate.map(([isaret, nerede, mesaj]) => (
        <div key={nerede} className="docs-ol-kapi-satir">
          <span data-gecti={isaret === "✓" || undefined}>{isaret}</span>
          <span>
            <span className="docs-ol-kapi-yer">{nerede}</span> {mesaj}
          </span>
        </div>
      ))}
    </div>
  );
}
