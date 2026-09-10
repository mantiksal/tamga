"use client";

import { Children, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { Icon } from "./icon.js";
import { PlainLink as PlainAnchor, type LinkComponent } from "./link.js";
import { Check, Customize } from "./icons.js";
import { toneOf, type Tone } from "./tone.js";

/* ------------------------------------------------------------------ *
 * Okunacak şeyler: anahtar/değer, sayı, kod, adım, sayaç, tuş.
 *
 * Beşi de üründe HAM yazılmış hâlde duruyordu — `<dl>` beş dosyada, `<code>`
 * sekiz dosyada, KPI karosu kendi 28 satırında. Yani tasarımları zaten
 * verilmişti; eksik olan tek şey, o tasarımın bir kez yazılmış olmasıydı.
 * ------------------------------------------------------------------ */

/**
 * Anahtar/değer listesi — detay sayfalarının omurgası.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
export function Descriptions({
  items,
  layout = "wide",
  className,
}: {
  items: readonly { term: string; value: ReactNode; mono?: boolean }[];
  /**
   * `wide` at page width, `compact` inside a card. TR: `wide` sayfa genişliğinde, `compact` bir
   * kartın içinde.
   */
  layout?: "wide" | "compact";
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid",
        layout === "wide"
          ? "gap-x-8 gap-y-4 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
          : "gap-x-4 gap-y-2.5 sm:grid-cols-[minmax(0,8rem)_minmax(0,1fr)]",
        className,
      )}
    >
      {items.map((it) => (
        <div key={it.term} className="contents">
          <dt className="text-small text-ink-faint">{it.term}</dt>
          <dd className={cn("min-w-0 text-body text-ink", it.mono && "font-mono tabular-nums")}>
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Tek bir sayı, büyük. Sektörde adı "stat" ya da "KPI kartı".
 *
 * `SkeletonKpi` kitte YILLARCA vardı ve yerini tuttuğu bileşen yoktu — bir
 * iskelet, var olmayan bir şeyin yerini tutuyordu. Kitin en tuhaf açığıydı.
 *
 * TIKLANABİLİR OLMASI SONRADAN GELDİ, ve gelmek zorundaydı. İlk hâli yalnız
 * okunuyordu; oysa bir panodaki sayı neredeyse hiçbir zaman salt okunur
 * değildir. Ölçüldü: bir ürün panelinde bu karo iki kez elle yeniden yazılmış,
 * çünkü biri bir EKRAN AÇIYOR ("37 iade bekliyor" → iade listesi), öteki bir
 * FİLTRE UYGULUYOR (aynı listeyi o adıma indiriyor). Kitin karosu ikisini de
 * yapamadığı için iki kopya doğdu ve ikisi birbirine benzemez oldu. Yeteneği
 * eksik bir bileşen, olmayan bir bileşenden daha çok kopya üretiyor.
 *
 * ÜÇ HÂL, VE SEMANTİK ELEMAN HER BİRİNDE FARKLI:
 *
 *   okunur   `<div>`     — sayı bir bilgi
 *   `href`   `<a>`       — sayı bir yere gidiyor
 *   `onClick` `<button>` — sayı bir şeyi değiştiriyor, `pressed` ile açık/kapalı
 *
 * Üçünü tek elemanla yapmak (her şey `<div onClick>`) klavyeyle gezilemeyen
 * ve ekran okuyucunun hiç duyurmadığı bir kart üretir.
 *
 * FİZİK YALNIZ TIKLANABİLİR HÂLDE. Kitin 1. yasası (kenar + kaymış gölge,
 * hover'da yükselme, basınca oturma) tıklanan şeyler içindir; okunan bir
 * karonun hover'da oynaması, tıklanabilir olduğu yalanını söyler.
 *
 * Sayı `tabular-nums`: değişen bir sayaç, rakam genişlikleri eşit olmadığı
 * sürece her güncellemede yatay olarak zıplar.
 *
 * `delta` bir yön taşır ama İYİ/KÖTÜ taşımaz — artan bir hata oranı da
 * artıştır. Anlamı `better` veriyor: yükselmesi mi iyi, düşmesi mi.
 *
 * SAYI HER ZAMAN MÜREKKEP RENGİNDE. Bir süre `attention` diye bir bayrak
 * vardı ve sayıyı kritik renge boyuyordu; kaldırıldı. Tek tüketicisinde beş
 * karonun üçü kırmızıydı, ve üç kırmızı hiçbir şeyi öne çıkarmıyor — yalnız
 * paneli alarm hâlinde gösteriyor. Bir sayının kötü olduğunu söylemenin yeri
 * `delta` (yönü ve anlamı olan bir değişim) ya da karonun açtığı ekranın
 * kendisi; karonun rengi değil.
 *
 * `accent` DENENDİ VE KALDIRILDI. Karonun sol kenarında verinin kendi rengini
 * (bir iade adımının rengi) taşıyan ince bir şerit vardı. Tek tüketicisi vardı
 * ve o tüketici reddetti: renk zaten listedeki rozette ve çiplerde duruyordu,
 * kartın kenarında üçüncü kez söylenince aynı bileşen iki ekranda farklı
 * görünüyordu. Tüketicisi olmayan bir prop, `SkeletonKpi`ın yıllarca yaşadığı
 * boşluğun aynısı: duruyor, belgeleniyor, hiçbir şeyin yerini tutmuyor.
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
  href,
  onClick,
  pressed,
  linkComponent: Link = PlainAnchor,
  className,
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
  /** Where the number leads. Makes the tile a link. TR: Sayının götürdüğü yer. Karoyu bağlantı yapar. */
  href?: string;
  /** What the number toggles. Makes the tile a button. TR: Sayının açıp kapadığı şey. Karoyu düğme yapar. */
  onClick?: () => void;
  /** Whether that toggle is currently on. TR: O anahtarın şu an açık olup olmadığı. */
  pressed?: boolean;
  /** The router's link, so the tile does not force a full page load. TR: Yönlendiricinin bağlantısı, karo tam sayfa yüklemeye zorlamasın diye. */
  linkComponent?: LinkComponent;
  className?: string;
}) {
  const tone: Tone =
    delta === undefined || delta === 0
      ? "neutral"
      : (delta > 0) === (better === "up")
        ? "positive"
        : "danger";
  const c = toneOf(tone);

  const govde = (
    <>
      {icon ? (
        <span className="tamga-kpi-tile" aria-hidden>
          <Icon icon={icon} size="base" />
        </span>
      ) : null}

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="tamga-label">{label}</span>
        <span className="mt-1 flex items-end gap-2">
          <span className="font-mono text-display-sm leading-none font-bold tabular-nums text-ink">
            {value}
          </span>
          {unit ? (
            <span className="font-mono text-small font-medium text-ink-faint">{unit}</span>
          ) : null}
          {delta !== undefined ? (
            <span className="ml-auto font-mono text-small tabular-nums" style={{ color: c.mark }}>
              {delta > 0 ? "+" : ""}
              {delta}%
            </span>
          ) : null}
        </span>
        {note ? <span className="mt-1 text-caption text-ink-faint">{note}</span> : null}
        {chart ? <span className="mt-4 block">{chart}</span> : null}
      </span>
    </>
  );

  const sinif = cn("tamga-kpi", (href || onClick) && "tamga-kpi-live", className);

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
 * KPI karolarının ızgarası.
 *
 * NEDEN AYRI BİR BİLEŞEN: karoların dizilişi her ekranda elle yazılıyordu
 * (`grid gap-4 sm:grid-cols-2 xl:grid-cols-5`) ve ekrandan ekrana tutmuyordu —
 * biri dörtlü, öteki beşli, bir üçüncüsü boşluğu 3 veriyordu. Izgara karonun
 * kendi işi değil ama karo KÜMESİNİN işi, ve tek yerde durunca hepsi tutuyor.
 *
 * SÜTUN SAYISI VERİLMİYOR, SAYILIYOR: kaç karo varsa o kadar sütun (en çok
 * altı). Elle verilen bir sütun sayısı, karo eklenince yalnız o ekranda
 * güncelleniyor ve tek başına kalan bir karo tam satırı kaplıyor.
 */
export function KpiGrid({ children, className }: { children: ReactNode; className?: string }) {
  const sayi = Math.min(Children.count(children), 6);
  return (
    <div
      className={cn("tamga-kpi-grid", className)}
      style={{ "--tamga-kpi-cols": sayi } as CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Kod bloğu, kopyalanabilir.
 *
 * Bir panelde bu her zaman aynı üç şeydir: API anahtarı, webhook adresi,
 * kurulum komutu. Üçünde de kullanıcının yaptığı tek şey KOPYALAMAK — o yüzden
 * kopyalama düğmesi bir seçenek değil, bileşenin kendisi.
 *
 * Kopyalama panosu her yerde çalışmaz (HTTPS olmayan bir kaynakta, ya da
 * izin verilmemişse). Başarısızlık SESSİZ olmamalı: düğme metni değişmezse
 * kullanıcı kopyalandığını sanır ve boş yapıştırır.
 */
export function Code({
  children,
  labels,
  className,
}: {
  /** The text to be copied itself. TR: Kopyalanacak metnin kendisi. */
  children: string;
  labels: { copy: string; copied: string; failed: string };
  className?: string;
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

  return (
    <div className={cn("tamga-code-block tamga-surface relative overflow-hidden", className)}>
      <pre className="tamga-scroll-x px-4 py-3 font-mono text-caption text-ink">{children}</pre>
      <button
        type="button"
        onClick={copy}
        className="tamga-mini-btn absolute top-2 right-2 w-auto gap-1 px-2"
        aria-label={labels.copy}
      >
        <Icon icon={state === "done" ? Check : Customize} size="xs" />
        <span className="text-caption">
          {state === "done" ? labels.copied : state === "failed" ? labels.failed : labels.copy}
        </span>
      </button>
    </div>
  );
}

/**
 * Klavye tuşu.
 *
 * `<kbd>` KULLANILIYOR, `<span>` değil: bir ekran okuyucu için "Ctrl" ile
 * "bir tuşa basılacak" arasındaki fark bu elemanda yaşıyor.
 */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "tamga-surface inline-flex h-5 min-w-5 items-center justify-center px-1.5 font-mono text-caption text-ink-soft",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/**
 * Sayaç rozeti — bir ikonun köşesindeki rakam.
 *
 * `StatusChip` bir DURUM taşır ("Yayında"), bu bir SAYI taşır ("3"). İkisi
 * ayrı bileşen çünkü ayrı şeyler: durum okunur, sayı sayılır.
 *
 * `max` üstünde "+" ile kesiliyor. Kesilmezse dört haneli bir sayı rozetin
 * kutusunu şişirir ve altındaki ikonu ezer.
 *
 * Sıfır GÖSTERİLMEZ: "0 bildirim" bir bilgi değil, gürültüdür.
 */
export function Badge({
  count,
  max = 99,
  tone = "danger",
  label,
  className,
  children,
}: {
  count: number;
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
}) {
  if (count <= 0) return <>{children}</>;
  const c = toneOf(tone);
  const shown = count > max ? `${max}+` : String(count);
  const dot = (
    <span
      className="inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-mono text-micro leading-none font-semibold tabular-nums"
      style={{ background: c.mark, color: "var(--color-page)" }}
    >
      <span aria-hidden>{shown}</span>
      <span className="sr-only">
        {count} {label}
      </span>
    </span>
  );
  if (!children) return dot;
  return (
    <span className={cn("relative inline-flex", className)}>
      {children}
      <span className="absolute -top-1 -right-1">{dot}</span>
    </span>
  );
}

/**
 * Adım göstergesi.
 *
 * Üründe bir sihirbaz şablonu vardı ve adım göstergesi yoktu — yani kullanıcı
 * kaçıncı adımda olduğunu ve kaç adım kaldığını bilmiyordu. Bir sihirbazın
 * varlık sebebi tam olarak budur.
 *
 * `<ol>` kullanılıyor: adımlar SIRALI ve sıra bilgi taşıyor. Ekran okuyucu
 * "3 öğeli liste, öğe 2" der; `<div>`'lerle bu bilgi kaybolur.
 *
 * Tamamlanan adım bir onay işareti alıyor, aktif olan aksan kenarı, gelecek
 * olan sönük. Üç durum üç ayrı görsel dil — çünkü "neredeyim" ve "ne kaldı"
 * ayrı iki soru.
 */
export function Steps({
  steps,
  current,
  className,
}: {
  steps: readonly string[];
  /** The active step, counting from zero. TR: Sıfırdan sayan aktif adım. */
  current: number;
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex items-center gap-3">
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
              {s}
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
