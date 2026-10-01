"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { Icon } from "./icon.js";
import { PlainLink as PlainAnchor, type LinkComponent } from "./link.js";
import { Check, Copy } from "./icons.js";
import { toneOf, type Tone } from "./tone.js";

/* Okunacak şeyler: anahtar/değer, sayı, kod, adım, sayaç, tuş.
   Gerekçeler: docs/gerekce/02-veri-ve-liste.md */

/**
 * Anahtar/değer listesi — detay sayfalarının omurgası.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
export function Descriptions({
  items,
  layout = "wide",
  split = false,
  className,
  ...rest
}: {
  items: readonly ({ term: string; value: ReactNode; mono?: boolean } & Record<string, unknown>)[];
  /**
   * `wide` at page width, `compact` inside a card. TR: `wide` sayfa genişliğinde, `compact` bir
   * kartın içinde.
   */
  layout?: "wide" | "compact";
  /**
   * Break the list into as many columns as fit. A six-row list at page width leaves the right
   * half empty; split, it reads as two short lists rather than one long one. Each column keeps
   * its own label column, so the values still line up. TR: Listeyi sığdığı kadar sütuna böl.
   * Sayfa genişliğinde altı satırlık bir liste sağ yarıyı boş bırakıyor; bölününce uzun bir
   * liste değil iki kısa liste okunuyor. Her sütun kendi etiket sütununu koruyor, yani değerler
   * yine hizalı.
   */
  split?: boolean;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <dl
      {...dataProps(rest)}
      className={cn(
        "grid",
        split && "tamga-desc-split",
        layout === "wide"
          ? "gap-x-8 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
          : "gap-x-4 sm:grid-cols-[minmax(0,8rem)_minmax(0,1fr)]",
        className,
      )}
    >
      {/* KANCA KABIN ÜSTÜNDE, SATIRIN DEĞİL — ve bir süre tersiydi.
          `dataProps(rest)` bu `map`in içindeydi, yani çağıranın TEK kancası her
          satıra kopyalanıyor ve `<dl>`e hiç inmiyordu. `check-data-props` bunu
          geçirdi çünkü o kapı niteliğin VARLIĞINA bakıyor, YERİNE değil. */}
      {/* `subgrid` şart: `display: contents` ile satırın kendi kutusu olmadığı
          için kenar da çizemiyor. Ayraç KESİKLİ, çünkü künyenin satırları ayrı
          şeyler değil, aynı künyenin parçaları. */}
      {items.map(({ term, value: deger, mono, ...rest }) => (
        <div
          {...rest}
          key={term}
          className="col-span-full grid grid-cols-subgrid items-baseline gap-y-1 border-b border-dashed border-line py-3 last:border-b-0"
        >
          <dt className="text-small text-ink-faint">{term}</dt>
          <dd
            className={cn(
              "min-w-0 text-body font-semibold text-ink",
              mono && "font-mono tabular-nums",
            )}
          >
            {deger}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Tek bir sayı, büyük. Üç hâl, üç ayrı eleman: okunur `<div>`, `href` ile
 * `<a>`, `onClick` ile `<button>`. Yönlendiren bir karo bir EKRAN açıyor,
 * `pressed` olan bir FİLTRE uyguluyor; ikisi ayrı sözleşme.
 *
 * Doküman: /docs/kpi
 */
export function Kpi({
  label,
  value,
  unit,
  icon,
  note,
  delta,
  better = "up",
  chart,
  look = "tile",
  href,
  onClick,
  pressed,
  iconTone,
  linkComponent: Link = PlainAnchor,
  className,
  ...rest
}: {
  label: string;
  value: string | number;
  unit?: string;
  /** A glyph in a tile at the left, saying what is counted. TR: Solda bir karo içinde, neyin sayıldığını söyleyen simge. */
  icon?: PhosphorIcon;
  /** One quiet line under the number. TR: Sayının altında tek sessiz satır. */
  note?: string;
  /** The percentage change against the previous value. TR: Bir öncekine göre yüzde değişim. */
  delta?: number;
  /** Which direction is the good news. TR: Hangi yön iyi haber. */
  better?: "up" | "down";
  /** An inline chart, such as a `Sparkline`. TR: Satır içi grafik, `Sparkline` gibi. */
  chart?: ReactNode;
  /**
   * `tile` the shape a KPI grid is built from: icon tile on the left, label over the number.
   * `detail` the taller card, for a number that carries a curve and a change beside it: icon and
   * label on top, the number and the chart side by side, the delta in a chip underneath. TR:
   * `tile`, bir KPI ızgarasının kurulduğu biçim: solda ikon karosu, sayının üstünde etiket.
   * `detail`, yanında bir eğri ve bir değişim taşıyan sayı için daha uzun kart: ikon ve etiket
   * üstte, sayı ile grafik yan yana, değişim altta bir çipte.
   */
  look?: "tile" | "detail";
  /** Where the number leads. Makes the tile a link. TR: Sayının götürdüğü yer. Karoyu bağlantı yapar. */
  href?: string;
  /** What the number toggles. Makes the tile a button. TR: Sayının açıp kapadığı şey. Karoyu düğme yapar. */
  onClick?: () => void;
  /** Whether that toggle is currently on. TR: O anahtarın şu an açık olup olmadığı. */
  pressed?: boolean;
  /**
   * The tone the icon box wears. TR: İkon kutusunun giydiği ton.
   *
   * It says what KIND of queue this tile counts, not whether the number is
   * good: a row of four tiles all in the same grey reads as one block, and the
   * eye has to read every label to tell them apart. Left out, the box stays
   * transparent. TR: Bu karonun NE TÜR bir kuyruğu saydığını söylüyor, sayının
   * iyi olup olmadığını değil: aynı gride duran dört karo tek bir blok gibi
   * okunuyor ve göz ayırt etmek için her etiketi okumak zorunda kalıyor.
   * Verilmezse kutu şeffaf kalıyor.
   */
  iconTone?: Tone;
  /** The router's link, so the tile does not force a full page load. TR: Yönlendiricinin bağlantısı, karo tam sayfa yüklemeye zorlamasın diye. */
  linkComponent?: LinkComponent;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const tone: Tone =
    delta === undefined || delta === 0
      ? "neutral"
      : (delta > 0) === (better === "up")
        ? "positive"
        : "danger";
  const c = toneOf(tone);

  const karo = icon ? (
    <span
      {...dataProps(rest)}
      className="tamga-kpi-tile"
      style={iconTone ? { background: toneOf(iconTone).bg, color: toneOf(iconTone).fg } : undefined}
      aria-hidden
    >
      {/* KARO İKONU DUOTONE DEĞİL, KALIN. Varsayılan duotone'un ikinci yarı saydam katmanı
          40 piksellik kenarlıklı bir karonun içinde zeminle karışıyor ve glif çamurlanıyor;
          karo zaten kendi kutusu, ikinci bir katmana ihtiyacı yok. */}
      <Icon icon={icon} size={look === "detail" ? "sm" : "base"} weight="bold" />
    </span>
  ) : null;

  /* DEĞER MONO DEĞİL DISPLAY YÜZÜNDE, ve ağırlığı en üst basamakta. Mono, bir
     SÜTUNDA okunan sayılar için: orada rakam genişliğinin eşit olması hizayı
     kuruyor. Bir KPI karosunda sütun yok, tek bir sayı var ve işi okunmak
     değil ÇARPMAK. */
  const sayi = (
    <span
      className={cn(
        "font-display leading-none font-extrabold tabular-nums text-ink",
        look === "detail" ? "text-display" : "text-display-sm",
      )}
    >
      {value}
    </span>
  );

  const birim = unit ? (
    <span className="font-mono text-small font-medium text-ink-faint">{unit}</span>
  ) : null;

  const degisim =
    delta !== undefined ? (
      /* ÇİP TONUN KENDİ ÇİFTİNİ GİYİYOR (yıkama + mürekkep), sabit bir vurgu
         yıkamasının üstünde ton rengi DEĞİL: koyu temada kırmızı mürekkep mavi
         yıkamanın üstünde 2.53 kontrasta düşüyordu · `bg`/`fg` çiftini
         `check-token-contrast` iki temada da ölçüyor. */
      <span className="tamga-kpi-delta" style={{ background: c.bg, color: c.fg, borderColor: c.fg }}>
        {delta > 0 ? "+" : ""}
        {delta}%
      </span>
    ) : null;

  const govde =
    look === "detail" ? (
      <>
        <span className="tamga-kpi-ust">
          {karo}
          {label}
        </span>
        <span className="tamga-kpi-orta">
          <span className="flex items-end gap-2">
            {sayi}
            {birim}
          </span>
          {chart ? <span className="shrink-0">{chart}</span> : null}
        </span>
        {note ? <span className="text-caption text-ink-faint">{note}</span> : null}
        {degisim}
      </>
    ) : (
      <>
        {karo}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="tamga-kpi-etiket">{label}</span>
          <span className="flex items-end gap-2">
            {sayi}
            {birim}
            {degisim ? <span className="ml-auto">{degisim}</span> : null}
          </span>
          {note ? <span className="text-caption text-ink-faint">{note}</span> : null}
          {chart ? <span className="mt-3 block">{chart}</span> : null}
        </span>
      </>
    );

  const sinif = cn(
    "tamga-kpi",
    look === "detail" && "tamga-kpi-detay",
    (href || onClick) && "tamga-kpi-live",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={sinif}>
        {govde}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={pressed}
        data-pressed={pressed || undefined}
        className={sinif}
      >
        {govde}
      </button>
    );
  }

  return <div className={sinif}>{govde}</div>;
}

/**
 * KPI karolarının ızgarası. Sütun sayısını KAP veriyor: karo 210 pikselin
 * altına inmiyor, sığmayan alt satıra geçiyor. Sayılan bir sütun sayısı bir
 * süre buradaydı ve kabı değil EKRANI ölçüyordu · dar bir sütunun içinde dört
 * karo açıp sayıları kırpıyordu.
 *
 * Doküman: /docs/kpi
 */
export function KpiGrid({ children, className, ...rest }: { children: ReactNode; className?: string; [k: `data-${string}`]: unknown }) {
  return (
    <div {...dataProps(rest)} className={cn("tamga-kpi-grid", className)}>
      {children}
    </div>
  );
}

/**
 * Kod bloğu, kopyalanabilir. Kopyalama panosu her yerde çalışmıyor (HTTPS
 * olmayan kaynak, izin verilmemiş); başarısızlık SESSİZ olmamalı, yoksa
 * kullanıcı kopyalandığını sanıp boş yapıştırıyor.
 *
 * Doküman: /docs/code
 */
export function Code({
  children,
  filename,
  labels,
  className,
  ...rest
}: {
  /** The text to be copied itself. TR: Kopyalanacak metnin kendisi. */
  children: string;
  /**
   * The name on the strip: "webhook.js", "docker-compose.yml". Left out, the strip still stands
   * and holds the copy button. TR: Şeritteki ad. Verilmezse şerit yine duruyor ve kopyala
   * düğmesini taşıyor.
   */
  filename?: string;
  labels: { copy: string; copied: string; failed: string };
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  const timer = useRef<number>(undefined);

  /* Zamanlayıcı bir ref'te tutuluyor ve her tıklamada sıfırlanıyor.

     Öncesi çıplak bir `setTimeout`'tu ve iki şeyi birden bozuyordu: art arda
     iki tıklamada ilk zamanlayıcı hâlâ çalıştığı için etiket erken geri
     dönüyordu, ve bileşen 1.6 saniye içinde sökülürse zamanlayıcı ölü bir
     bileşene yazmaya çalışıyordu. */
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(children);
      setState("done");
    } catch {
      setState("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1600);
  }

  const satirlar = children.replace(/\n$/, "").split("\n");

  return (
    <div {...dataProps(rest)} className={cn("tamga-code", className)}>
      {/* ŞERİT: solda dosya adı, sağda kopyala. Adsız bir blokta da şerit
          duruyor · düğmenin kodun üstüne binmemesi için bir yere ihtiyacı var,
          ve köşeye oturan bir düğme ilk satırı kapatıyordu. */}
      <div className="tamga-code-bar">
        <span className="min-w-0 flex-1 truncate font-mono text-caption">{filename}</span>
        <button type="button" onClick={copy} className="tamga-code-copy" aria-label={labels.copy}>
          <Icon icon={state === "done" ? Check : Copy} size="xs" weight="bold" />
          {state === "done" ? labels.copied : state === "failed" ? labels.failed : labels.copy}
        </button>
      </div>
      <pre className="tamga-code-pre">
        {satirlar.map((satir, i) => (
          /* SATIR NUMARASI SEÇİLEMİYOR (`user-select: none`): kodu kopyalamak
             için fareyle seçen kişi numaraları da alıyordu. */
          <span key={i} className="tamga-code-line">
            <span className="tamga-code-no" aria-hidden>
              {i + 1}
            </span>
            <span className="tamga-code-text">{satir}</span>
          </span>
        ))}
      </pre>
    </div>
  );
}

/**
 * Klavye tuşu.
 *
 * `<kbd>` KULLANILIYOR, `<span>` değil: bir ekran okuyucu için "Ctrl" ile
 * "bir tuşa basılacak" arasındaki fark bu elemanda yaşıyor.
 */
export function Kbd({
  children,
  inline = false,
  className,
}: {
  children: ReactNode;
  /**
   * The quieter key, for a row in a shortcut list. Twenty layered boxes down a list turn it into
   * a keypad. TR: Daha sessiz tuş, bir kısayol listesinin satırı için. Bir listede yirmi katmanlı
   * kutu, listeyi bir tuş takımına çeviriyor.
   */
  inline?: boolean;
  className?: string;
}) {
  return <kbd className={cn("tamga-kbd", inline && "tamga-kbd-inline", className)}>{children}</kbd>;
}

/**
 * Sayaç rozeti: bir ikonun köşesindeki SAYI (`StatusChip` bir DURUM taşır).
 * `max` üstünde "+" ile kesiliyor, yoksa dört hane kutuyu şişirip altındaki
 * ikonu eziyor. Sıfır gösterilmiyor.
 *
 * Doküman: /docs/badge
 */
/**
 * Etiket rozeti · bir özelliğin durumu: BETA, YENİ, PRO.
 *
 * SAYACIN (`Badge`) KARDEŞİ AMA AYNI ŞEY DEĞİL: sayaç bir MİKTAR taşıyor ve
 * okunduktan sonra kayboluyor; etiket bir DURUM taşıyor ve yerinde duruyor.
 * İkisini tek bileşene koymak, "sayı verilmemişse etiket" gibi bir kural
 * demekti.
 *
 * Gerekçe: docs/gerekce/06-isaret-ve-ton.md
 */
export function Tag({
  children,
  look = "outline",
  className,
  ...rest
}: {
  children: ReactNode;
  /**
   * `dashed` not real yet (beta, coming), `solid` the loudest one, for what is new right now,
   * `outline` the quiet standing fact (a plan name, a tier). TR: `dashed` henüz gerçek değil
   * (beta, yakında), `solid` en yükseği · şu anda yeni olan için, `outline` ise sessiz duran
   * gerçek (bir plan adı, bir kademe).
   */
  look?: "dashed" | "solid" | "outline";
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    /* Sınıf adları AÇIK yazılıyor, şablonla üretilmiyor: `check-kit-class`
       şablon içindeki adı çözemiyor ve tanımsız sanıyor · kapı haklı, çünkü
       üretilen bir ad silindiğinde de kimse görmüyor. */
    <span
      {...dataProps(rest)}
      className={cn(
        "tamga-tag",
        look === "dashed" && "tamga-tag-dashed",
        look === "solid" && "tamga-tag-solid",
        look === "outline" && "tamga-tag-outline",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Badge({
  count,
  max = 99,
  tone = "danger",
  dot = false,
  label,
  className,
  children,
  ...rest
}: {
  /** The number. Not needed when `dot` is set. TR: Sayı. `dot` verildiğinde gerekmiyor. */
  count?: number;
  /**
   * Show a mark with NO number. Use it when the answer is "there is something new" rather than
   * "there are four": a number nobody will act on is a number nobody reads. TR: Sayısız bir
   * işaret göster. Cevap &quot;dört tane var&quot; değil &quot;yeni bir şey var&quot; olduğunda:
   * kimsenin üzerine hareket etmeyeceği bir sayı, kimsenin okumadığı bir sayıdır.
   */
  dot?: boolean;
  max?: number;
  tone?: Tone;
  /**
   * What the number is: "unread notifications". The screen reader reads it. TR: Sayının ne
   * olduğu: "okunmamış bildirim". Ekran okuyucu bunu okur.
   */
  label: string;
  className?: string;
  /**
   * What the badge sits on (an icon, an avatar). Without it the badge stands alone. TR: Rozetin
   * üstüne oturacağı şey (ikon, avatar). Yoksa rozet tek başına durur.
   */
  children?: ReactNode;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  if (!dot && (count ?? 0) <= 0) return <>{children}</>;
  const c = toneOf(tone);
  const shown = (count ?? 0) > max ? `${max}+` : String(count ?? 0);
  const isaret = dot ? (
    <span
      {...dataProps(rest)}
      className="tamga-count-dot"
      style={{ background: c.mark }}
      role="status"
      aria-label={label}
    />
  ) : (
    /* DAİRE DEĞİL, KÖŞELİ KUTU · ve dolgu yerine YIKAMA + koyu kenar.
       Dolu daire, kitin işaret ailesinin (sert kareler) dışına düşüyordu ve
       sayıyı taşıyan tek nesne oydu. Tasarım dili sayacı bir etiket gibi
       çiziyor: yumuşak zemin, koyu çerçeve, koyu rakam. Böylece rakam
       okunuyor · dolu bir daire üstündeki açık rakam, iki hanede zaten
       sıkışıyordu. */
    <span
{...dataProps(rest)}
      className="tamga-count tabular-nums"
      style={{ background: c.bg, color: c.fg, borderColor: c.fg }}
    >
      <span aria-hidden>{shown}</span>
      <span className="sr-only">
        {count} {label}
      </span>
    </span>
  );
  if (!children) return isaret;
  /* Rozet, üstüne oturduğu şeyin KARDEŞİ: çocuğu yapmak mümkün değil, çünkü
     `children` herhangi bir eleman olabilir. Hover'da onunla birlikte gitmesini
     `.tamga-count-yuva` sağlıyor (kit.css, düğmenin kaymalarıyla aynı). */
  return (
    <span className={cn("tamga-badge-wrap relative inline-flex", className)}>
      {children}
      <span className="tamga-count-yuva">{isaret}</span>
    </span>
  );
}

/**
 * Bir adım: kimliği ve çevrilmiş etiketi. Kimlik etiketten AYRI, çünkü etiket
 * çevriliyor; React anahtarı olarak kullanılırsa dil değişince düğümler
 * yeniden kuruluyor. `key`/`label` dışındaki her şey adımın `<li>`sine iniyor.
 */
export type Step = { key: string; label: string } & Record<string, unknown>;

/**
 * Adım göstergesi. `<ol>` kullanılıyor: adımlar SIRALI ve sıra bilgi taşıyor;
 * `<div>`lerle ekran okuyucu "öğe 2 / 3" diyemiyor.
 *
 * Doküman: /docs/steps
 */
export function Steps({
  steps,
  current,
  className,
  ...rest
}: {
  /**
   * The steps, in order. Anything beyond `key` and `label` lands on that step's `<li>`, so a step
   * can carry the hook a test or a style needs. TR: Adımlar, sırasıyla. `key` ve `label` dışındaki
   * her şey o adımın `<li>`sine iniyor, yani bir adım testin ya da stilin ihtiyaç duyduğu kancayı
   * taşıyabiliyor.
   */
  steps: readonly Step[];
  /** The active step, counting from zero. TR: Sıfırdan sayan aktif adım. */
  current: number;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  return (
    <ol {...dataProps(rest)} className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      {steps.map(({ key, label, ...adimRest }, i) => {
        const done = i < current;
        const active = i === current;
        return (
          /* KANCA ADIMIN KENDİ ELEMANINDA. Sarmalayıcıya konsaydı "hangi adım"
             sorusunun cevabı olmazdı; `<li>` o adımın ta kendisi, ve içindeki
             `aria-current` ile birlikte "şu adım, ve şu an açık olan o" diye
             ölçülebiliyor. Kitin kendi nitelikleri sonra yazılıyor: çağıran
             `aria-current`i kazara ezemesin. */
          <li key={key} {...adimRest} className="flex items-center gap-3">
            {/* ÜÇ DURUM ÜÇ FİZİKLE, renkle değil: gelecek düz, şimdiki
                yükselir, biten oturur. Ölçü üçünde de aynı — `min-w` artı
                dolgu, genişliği içeriğe bırakıyordu ve `Check` glifi rakamdan
                geniş olduğu için adım tamamlandığı anda şerit kayıyordu.
                Fizik `kit.css`te (`.tamga-step-mark`), çünkü bu kitin kuralı,
                bu bileşenin tercihi değil. */}
            <span
              className="tamga-step-mark font-mono text-caption"
              data-state={done ? "done" : active ? "current" : "todo"}
              aria-hidden
            >
              {done ? <Icon icon={Check} size="xs" weight="bold" /> : i + 1}
            </span>
            <span
              className={cn("text-small", active ? "font-medium text-ink" : "text-ink-faint")}
              aria-current={active ? "step" : undefined}
            >
              {label}
            </span>
            {/* ÇİZGİ DE BİLGİ: geçilen aralık aksan, kalanı kenar rengi. */}
            {i < steps.length - 1 ? (
              <span aria-hidden className="tamga-step-line" data-done={done ? "true" : "false"} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Rise — sayı sıfırdan hedefe YÜKSELEREK geliyor.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */
export function Rise({
  value,
  format = (n) => String(Math.round(n)),
  duration = 900,
  className,
  ...rest
}: {
  value: number;
  /**
   * How the number is written on the way up, not only at the end: the kit knows no currency and
   * no thousands separator. TR: Sayının yolda nasıl yazıldığı, yalnız sonunda değil: kit ne para
   * birimi bilir ne binlik ayracı.
   */
  format?: (n: number) => string;
  /** How long the climb takes, in ms. TR: Tırmanışın süresi, ms. */
  duration?: number;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const [n, setN] = useState(value);
  const kare = useRef<number | null>(null);

  useEffect(() => {
    /* AZALTILMIŞ HAREKETTE TIRMANIŞ YOK: sayı hedefinde beliriyor. Hareket
       duyarlılığı olan biri için değişen bir sayı, kayan bir sayfadan daha
       yorucu · göz onu okumaya çalışıyor. */
    const durgun = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (durgun || duration <= 0) {
      setN(value);
      return;
    }

    const bas = performance.now();
    const adim = (t: number) => {
      const o = Math.min(1, (t - bas) / duration);
      /* Yavaşlayarak varıyor (`1-(1-o)³`): sabit hızla artan bir sayaç sayı
         durduğunda "kesildi" gibi duruyor. */
      setN(value * (1 - (1 - o) ** 3));
      if (o < 1) kare.current = requestAnimationFrame(adim);
    };
    kare.current = requestAnimationFrame(adim);
    return () => {
      if (kare.current !== null) cancelAnimationFrame(kare.current);
    };
  }, [value, duration]);

  return (
    <span
      {...dataProps(rest)}
      /* Sayı DEĞİŞİRKEN duyurulmuyor: `aria-live` olsaydı ekran okuyucu her
         karede yeni bir sayı okurdu. Son değer zaten metinde. */
      className={cn("font-display leading-none font-black tabular-nums text-ink", className)}
    >
      {format(n)}
    </span>
  );
}
