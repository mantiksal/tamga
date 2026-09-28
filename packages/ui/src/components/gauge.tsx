import { Fragment } from "react";
import { dataProps } from "../lib/data-props.js";
import { toneOf, type Tone } from "./tone.js";

/*
 * Aynı okumanın üç biçimi: halka, yatık ölçek, kare ızgara. Üçü de aynı
 * `ScoreProps`u alıyor, ve üçünde de İBRE YOK: ibreli bir kadran bir nesnenin
 * taklidi, bu kit taklit çizmiyor.
 */

export type ScoreProps = {
  value: number;
  /**
   * The accessible name. REQUIRED, and never derived here: the kit does not translate (docs/08:
   * primitives stay translation-free, the caller passes ready text). It used to build "Health
   * score 87 of 100, Degraded" in English inside this file, which shipped an untranslatable
   * string to every locale. TR: Erişilebilir ad. ZORUNLU, ve burada asla türetilmiyor: kit
   * çeviri yapmaz (docs/08: primitive'ler çevirisiz kalır, hazır metni çağıran geçer). Eskiden
   * bu dosyanın içinde İngilizce "Health score 87 of 100, Degraded" kuruluyordu, yani her dile
   * çevrilemez bir dizgi gönderiliyordu.
   */
  label: string;
  /**
   * Visible band text under the readout. Omitted = the readout shows no word. TR: Okumanın
   * altında görünen bant metni. Verilmezse okuma hiçbir sözcük göstermiyor.
   */
  bandLabel?: string;
  /**
   * The readout's width in pixels: the dial's diameter, the matrix's side, the
   * meter's track. TR: Okumanın piksel cinsinden genişliği: kadranın çapı,
   * matrisin kenarı, ölçeğin şeridi.
   */
  size?: number;
  /**
   * Draw `bandLabel` under the number. Off, the colour still carries the band.
   * TR: `bandLabel`ı sayının altına çiz. Kapalıyken bandı yine renk taşıyor.
   */
  showLabel?: boolean;
  /**
   * The PRODUCT decides the band's tone. The `band()` below is the kit's default (90 / 70 / 50)
   * and does not fit every product: in a warehouse dispatch rate the thresholds are 85 / 65 /
   * 50, and in an SLA they could be something else entirely. Without this prop a product would
   * write a label against its own threshold and stand it beside a dial the kit painted against
   * another: the text and the colour contradicted each other. Left out, the kit's default
   * thresholds. TR: Bandın tonunu ÜRÜN belirler. Aşağıdaki `band()` kitin varsayılanı (90 / 70
   * / 50) ve her ürüne uymuyor: depo sevk oranında eşikler 85 / 65 / 50, bir SLA'de bambaşka
   * olabilir. Bu prop olmadan ürün kendi eşiğine göre bir metin yazıp kitin başka bir eşiğe
   * göre boyadığı bir kadranla yan yana koyuyordu: yazı ile renk birbirini yalanlıyordu.
   * Verilmezse kitin varsayılan eşikleri.
   */
  tone?: Tone;
};

/* Where the readout changes colour. The thresholds are a kit default; a product
   that scores differently passes its own tone instead. Words are NOT decided
   here — see ScoreProps.label. */
function band(v: number): Tone {
  if (v >= 90) return "positive";
  if (v >= 70) return "caution";
  return "danger";
}


/* ---------- A · Ring — the conic ring ---------- */

/**
 * Skor halkası · 0-100 arası tek bir okuma.
 *
 * SEGMENTLİ KADRAN DEĞİL, DOLU YAY. Önce 32 parçalı bir kadran çiziyordu ve
 * parçalar bir ölçek vadediyordu; oysa okunan şey tek bir sayı ve o sayı zaten
 * ortada yazılı. Yay, ne kadarının dolduğunu bir bakışta söylüyor.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */
export function ScoreRing({
  value,
  label,
  bandLabel,
  size = 96,
  showLabel = true,
  tone,
  ...rest
}: ScoreProps & { [k: `data-${string}`]: unknown }) {
  const v = Math.min(100, Math.max(0, value));
  const c = toneOf(tone ?? band(v));

  return (
    <div {...dataProps(rest)} className="tamga-ring-wrap">
      <div
        className="tamga-ring"
        role="img"
        aria-label={label}
        style={
          {
            width: size,
            height: size,
            "--ring-renk": c.mark,
            "--ring-yay": `${v * 3.6}deg`,
          } as React.CSSProperties
        }
      >
        {/* Sayı halkanın ölçüsünden türüyor, tip skalasından değil: bu glif her
            çapta kadranla orantılı durmak zorunda. */}
        <span className="tamga-ring-ic" style={{ fontSize: Math.round(size * 0.25) }}>
          {Math.round(v)}
        </span>
      </div>
      {showLabel && bandLabel ? <span className="tamga-ring-etiket">{bandLabel}</span> : null}
    </div>
  );
}

/* ---------- B · Meter — the same reading, laid flat ---------- */

/**
 * Skor ölçeği · kademeli bir bandın üstünde KONUM.
 *
 * Dolan bir çubuk değil: beş bant sabit duruyor ve üçgen işaret skorun hangi
 * banda düştüğünü gösteriyor. Fark şu: bir çubuk "ne kadar" der, bu "hangisi"
 * der, ve bir memnuniyet ya da risk skorunda sorulan ikincisi.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */
export function ScoreMeter({
  value,
  label,
  bands,
  total = 100,
  size,
  tone,
  ...rest
}: Omit<ScoreProps, "bandLabel" | "showLabel"> & {
  /**
   * The five band names under the scale, worst to best. The kit does not translate, so they come
   * ready. Left out, only the bands are drawn. TR: Ölçeğin altındaki beş bandın adı, kötüden
   * iyiye. Kit çeviri yapmıyor, hazır geliyorlar. Verilmezse yalnız bantlar çiziliyor.
   */
  bands?: readonly [string, string, string, string, string];
  /** The scale's top, when it is not 100. TR: Ölçeğin tepesi, 100 değilse. */
  total?: number;
  [k: `data-${string}`]: unknown;
}) {
  const v = Math.min(total, Math.max(0, value));
  const pct = (v / total) * 100;

  return (
    <div
      {...dataProps(rest)}
      className="tamga-meter"
      style={{ maxWidth: size ?? "35rem" }}
      role="group"
      aria-label={label}
    >
      <div className="tamga-meter-ust">
        <span className="tamga-meter-ad">{label}</span>
        <span className="tamga-meter-sayi">
          {Math.round(v)}
          <span className="tamga-meter-toplam"> / {total}</span>
        </span>
      </div>
      <div className="tamga-meter-yol">
        {/* İŞARET BANTLARIN ÜSTÜNDE, içinde değil: bandın rengi ölçeğin kendisi,
            skor ise o ölçek üzerinde bir NOKTA. */}
        <span className="tamga-meter-ok" style={{ left: `calc(${pct}% - 7px)` }} aria-hidden />
        <div className="tamga-meter-bantlar">
          {BANT_RENKLERI.map((renk) => (
            <span key={renk} style={{ background: renk }} />
          ))}
        </div>
      </div>
      {bands ? (
        <div className="tamga-meter-adlar" aria-hidden>
          {bands.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* Kötüden iyiye beş bant. Sabit bir dizi, çünkü ölçeğin kendisi sabit: skor
   değişince bantlar değil İŞARET kayıyor. */
const BANT_RENKLERI = [
  "var(--color-critical-mark)",
  "var(--color-warning)",
  "var(--color-accent-bg)",
  "var(--color-accent-soft)",
  "var(--color-accent)",
] as const;

/* ---------- C · Matrix — a hundred squares, one per point ---------- */

/**
 * Skorun kare ızgara hâli · her kare bir puan.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */
export function ScoreMatrix({
  rows,
  columns,
  levels = 5,
  label,
  legend,
  cellTitle,
  ...rest
}: {
  /**
   * One row per band of the first dimension (a weekday, a region), with one value per column.
   * TR: Birinci boyutun her bandı için bir satır (bir gün, bir bölge), sütun başına bir değer.
   */
  rows: readonly ({ label: string; values: readonly number[] } & Record<string, unknown>)[];
  /** The marks over the columns (hours, weeks). TR: Sütunların üstündeki işaretler (saat, hafta). */
  columns: readonly string[];
  /**
   * How many steps of intensity. Five is the design's ramp and about the most an eye reads off a
   * grid without a number beside it. TR: Kaç yoğunluk basamağı. Beş, tasarımın rampası ve bir
   * gözün yanında sayı olmadan bir ızgaradan okuyabileceği en fazla basamak.
   */
  levels?: number;
  /** The grid's accessible name: what the two dimensions are. TR: Izgaranın erişilebilir adı: iki boyutun ne olduğu. */
  label: string;
  /** The two ends of the ramp, in the product's words: "few" and "many". TR: Rampanın iki ucu, ürünün sözcükleriyle. */
  legend?: { low: string; high: string };
  /**
   * The cell's own title, written by the caller: the kit knows neither the unit nor the day's
   * name. TR: Hücrenin kendi başlığı, çağıranın yazdığı: kit ne birimi bilir ne günün adını.
   */
  cellTitle?: (row: string, column: string, value: number) => string;
  [k: `data-${string}`]: unknown;
}) {
  const enBuyuk = Math.max(1, ...rows.flatMap((r) => [...r.values]));

  return (
    <div {...dataProps(rest)} className="tamga-yogunluk" role="img" aria-label={label}>
      <div
        className="tamga-yogunluk-izgara"
        style={{ gridTemplateColumns: `32px repeat(${columns.length}, minmax(26px, 1fr))` }}
      >
        <span />
        {columns.map((c) => (
          <span key={c} className="tamga-yogunluk-sutun">
            {c}
          </span>
        ))}
        {rows.map(({ label: satir, values, ...kanca }) => (
          <Fragment key={satir}>
            <span className="tamga-yogunluk-satir">{satir}</span>
            {values.map((v, i) => (
              /* BASAMAK EN BÜYÜĞE GÖRE: mutlak bir eşik, bir ızgarayı başka bir
                 haftanın rakamlarıyla kıyaslanamaz yapardı · burada okunan şey
                 "bu ızgarada yoğunluk nerede". */
              <span
                {...kanca}
                key={i}
                className="tamga-yogunluk-hucre"
                data-seviye={Math.round((v / enBuyuk) * (levels - 1))}
                title={cellTitle?.(satir, columns[i] ?? "", v)}
              />
            ))}
          </Fragment>
        ))}
      </div>
      {legend ? (
        <div className="tamga-yogunluk-lejant">
          {legend.low}
          {Array.from({ length: levels }, (_, i) => (
            <span key={i} data-seviye={i} />
          ))}
          {legend.high}
        </div>
      ) : null}
    </div>
  );
}
