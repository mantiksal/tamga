"use client";
import { dataProps } from "../lib/data-props.js";

import type { Tone } from "./tone.js";
import { toneOf, rankOf } from "./tone.js";
import { useLiveClaim } from "./live-scope.js";
import { Icon } from "./icon.js";
import type { IconGlyph } from "./icons.js";

/* `live` is a REQUEST, not a decision. The element asks the nearest LiveScope
   to pulse and only the most severe asker wins — see live-scope.tsx. Call sites
   keep writing `live={m.health === "down"}` exactly as before; the counting is
   no longer their problem. */

export function StatusChip({
  label,
  state,
  look = "wash",
  dot = true,
  icon,
  live = false,
  mono = false,
  severity,
  ...rest
}: {
  label: string;
  state: Tone;
  /**
   * `wash` the tone's own ground with no edge · the default, and what a table of thirty rows
   * wants: an edge on each chip turns a column of states into a column of BOXES. `outline` the
   * surface with the tone as a line, for a chip standing alone in a header. `solid` the tone's
   * plate with its own ink, for a TERMINAL state ("delivered", "returned") that ends the row's
   * story. TR: `wash` tonun kendi zemini, kenarsız · varsayılan, ve otuz satırlık bir tablonun
   * istediği: her çipe kenar koymak durum sütununu KUTU sütununa çeviriyor. `outline` yüzeyin
   * üstünde ton bir çizgi olarak, bir başlıkta tek başına duran çip için. `solid` tonun
   * plakası ve kendi mürekkebi, satırın hikâyesini bitiren SON durum için ("teslim edildi",
   * "iade").
   *
   * `solid` Yasa 2 ile ("dolgu eylemdir") gerilimde ve bu yüzden opt-in: varsayılan `wash`
   * kalıyor. TR: `solid` Yasa 2 ile gerilimde, o yüzden isteğe bağlı: varsayılan `wash`.
   */
  look?: "wash" | "outline" | "solid";
  dot?: boolean;
  /**
   * A glyph in place of the dot. TR: Noktanın yerine bir glif.
   *
   * The dot says WHICH state; a glyph says what KIND of reading this is, and
   * some chips need the second. A duration ("16 days 10 hours") is not a state:
   * a coloured dot beside it claims there is a status to read, when the colour
   * is really saying the number crossed a threshold. A clock says the number is
   * a clock. Given, it replaces the dot rather than joining it · two marks in
   * one chip leave nothing leading. TR: Nokta HANGİ durum olduğunu söylüyor,
   * glif ise okumanın NE TÜR olduğunu. Bir süre ("16 gün 10 saat") bir durum
   * değil: yanındaki renkli nokta okunacak bir durum varmış gibi yapıyor, oysa
   * renk sayının bir eşiği geçtiğini söylüyor. Saat, sayının bir saat olduğunu
   * söylüyor. Verilirse noktanın YERİNE geçiyor.
   */
  icon?: IconGlyph;
  live?: boolean;
  /**
   * identifier-shaped labels (codes, short keys) keep the mono face TR: tanımlayıcı biçimli
   * etiketler (kodlar, kısa anahtarlar) mono yüzü korur
   */
  mono?: boolean;
  /**
   * explicit rank, once the API carries one; otherwise derived from state TR: API bir sıra
   * taşıdığında açık sıra; yoksa durumdan türetiliyor
   */
  severity?: number | null;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const h = toneOf(state);
  const pulses = useLiveClaim(live ? rankOf(state, severity) : null);
  /* Sınıf adları açık yazılıyor, şablonla üretilmiyor: `check-kit-class`
     şablon içindeki adı çözemiyor ve tanımsız sanıyor. */
  const kilik =
    look === "outline" ? "tamga-chip-outline" : look === "solid" ? "tamga-chip-solid" : "";
  const boya =
    look === "solid"
      ? { background: h.mark, color: h.markInk }
      : look === "outline"
        ? { color: h.fg, borderColor: h.fg }
        : { background: h.bg, color: h.fg };
  return (
    <span
{...dataProps(rest)}
      className={`tamga-chip ${kilik} ${mono ? "tamga-chip-mono" : ""}`}
      style={boya}
    >
      {icon ? (
        /* Glif çipin METNİYLE aynı renkte, `mark` ile değil: nokta kendi
           rengini taşıyor çünkü tek başına bir işaret; glif ise metnin bir
           parçası ve ayrı bir renk alması onu ikinci bir işaret yapardı. */
        <Icon icon={icon} size="xs" className={pulses ? "tamga-live" : undefined} />
      ) : dot ? (
        <span
          className={`tamga-mark inline-block ${pulses ? "tamga-live" : ""}`}
          /* DOLU ÇİPTE NOKTA METNİN RENGİNDE: plakanın üstünde plakanın kendi
             rengiyle çizilen bir nokta görünmez. */
          style={{ background: look === "solid" ? "currentColor" : h.mark }}
        />
      ) : null}
      {label}
    </span>
  );
}

/**
 * Değişim çipi · yön oku + yüzde, tonun kendi dolgusunda.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */
export function Delta({
  value,
  better,
  ...rest
}: {
  /** The change, written by the caller: "+12,4%", "-3,1%", "0,0%". TR: Değişim, çağıranın yazdığı biçimde. */
  value: string;
  /**
   * Whether this movement is the GOOD news. It is not a taste but a MEANING: a rise is good for
   * revenue and bad for response time, and the same green would say two different things on two
   * screens. TR: Bu hareketin İYİ haber olup olmadığı. Bir tercih değil bir ANLAM: artış ciroda
   * iyi, yanıt süresinde kötü · aynı yeşil iki ekranda iki farklı şey söylerdi.
   */
  better: boolean;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const sayi = value.replace(/[^0-9.,-]/g, "");
  const duran = /^0([.,]0+)?$/.test(sayi);
  const yukselen = !value.trimStart().startsWith("-") && !value.trimStart().startsWith("\u2212");

  /* İYİ HABER VURGU RENGİNDE, yeşilde değil: `positive` yeşili bir DURUM
     rengi ("çözüldü"), oysa yükselen bir ciro bir durum değil bir hareket ·
     tasarım da değişimi markanın kendi mavisiyle söylüyor. Kötü haber `danger`
     kalıyor: kırmızı zaten "burada bir sorun var" diyor.
     DURAN DEĞİŞİM RENKSİZ: sıfır ne iyi ne kötü. */
  const dolgu = duran
    ? undefined
    : better
      ? { background: "var(--color-accent)", color: "var(--color-accent-ink)" }
      /* Kötü haberin mürekkebi `--color-critical-ink`: dolgunun üstünde okunan
         mürekkep TEMAYLA birlikte dönüyor · sayfanın mürekkebi koyu temada
         kırmızı dolgunun üstünde 2.96'ya düşüyordu. */
      : { background: "var(--color-critical)", color: "var(--color-critical-ink)" };

  return (
    <span {...dataProps(rest)} className="tamga-delta" style={dolgu}>
      <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden>
        {duran ? (
          <path d="M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path
            d={yukselen ? "M2 9L6 4l2 2 3-4" : "M2 3l4 5 2-2 3 4"}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      {value}
    </span>
  );
}

/**
 * Solid square status mark used in dense tables. Uses `fg` rather than `mark`
 * so a single 10px square still reads at rest — bars can afford to be quieter,
 * a lone dot cannot.
 */
export function Dot({
  state,
  live = false,
  size = "base",
  severity,
  ...rest
}: {
  state: Tone;
  live?: boolean;
  /**
   * `sm` inside a dense table cell, `base` beside a line of text, `lg` a mark that stands on
   * its own · the large one takes an edge and a base, because at that size a flat square reads
   * as a swatch rather than a status. TR: `sm` sıkışık bir tablo hücresinde, `base` bir metin
   * satırının yanında, `lg` tek başına duran işaret · büyüğü kenar ve taban alıyor, çünkü o
   * boyda düz bir kare bir durumdan çok bir renk örneği gibi okunuyor.
   */
  size?: "sm" | "base" | "lg";
  /**
   * explicit rank, once the API carries one; otherwise derived from state TR: API bir sıra
   * taşıdığında açık sıra; yoksa durumdan türetiliyor
   */
  severity?: number | null;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const h = toneOf(state);
  const pulses = useLiveClaim(live ? rankOf(state, severity) : null);
  /* Sınıf adları açık yazılıyor, şablonla üretilmiyor: `check-kit-class`
     şablon içindeki adı çözemiyor ve tanımsız sanıyor. */
  const olcu =
    size === "sm" ? "tamga-dot-sm" : size === "lg" ? "tamga-dot-lg" : "tamga-dot-base";
  return (
    <span
{...dataProps(rest)}
      className={`tamga-dot ${olcu} ${pulses ? "tamga-live" : ""}`}
      style={{ background: h.fg }}
      aria-hidden
    />
  );
}
