"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import type { IconGlyph } from "./icons.js";
import { CaretRight } from "./icons.js";

/**
 * Açılıp kapanan bölümler.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

/** Tek bir açılır bölüm. */
export function Collapsible({
  title,
  defaultOpen = false,
  open,
  onOpenChange,
  icon,
  meta,
  note,
  unmountOnClose = false,
  className,
  children,
  ...rest
}: {
  /**
   * The head's text, or a node with text in it: "Accessibility · /pricing" with the path faint.
   * The button's accessible name is read from it, so it must carry words. TR: Başlığın metni ya
   * da içinde metin olan bir düğüm: yolu soluk "Erişilebilirlik · /fiyatlar". Düğmenin
   * erişilebilir adı buradan okunur, o yüzden sözcük taşımalı.
   */
  title: ReactNode;
  /**
   * The glyph at the head of the row, in the accent. It says what KIND of section this is before
   * the words are read. TR: Satırın başındaki glif, vurgu renginde. Sözcükler okunmadan önce bu
   * bölümün NE TÜR bir bölüm olduğunu söylüyor.
   */
  icon?: IconGlyph;
  /** The starting state when the section keeps its own. Ignored once `open` is given. TR: Bölüm durumunu kendi tutuyorsa başlangıç. `open` verilince yok sayılır. */
  defaultOpen?: boolean;
  /**
   * Given, the section is controlled: this is the open state, and a click only reports through
   * `onOpenChange` · the product decides, the way it decides whether to fetch when a row opens.
   * Absent, the section keeps the state itself. React's own controlled/uncontrolled contract.
   * TR: Verilirse bölüm kontrollü: açık durum budur, tık yalnız `onOpenChange` ile haber verir ·
   * satır açılınca veri çekilip çekilmeyeceğine karar verdiği gibi kararı ürün verir. Verilmezse
   * bölüm durumu kendi tutar. React'in kontrollü/kontrolsüz sözleşmesi.
   */
  open?: boolean;
  /** Fires with the next state on click and keyboard, in both modes. TR: Tık ve klavyede sıradaki durumla ateşlenir, iki modda da. */
  onOpenChange?: (open: boolean) => void;
  /**
   * The secondary text to the right of the title: a count, a state. TR: Başlığın sağındaki
   * ikincil metin: sayı, durum.
   */
  meta?: ReactNode;
  /**
   * A quiet line that stays visible when the section is CLOSED, between the head and the body,
   * inside the same frame: why a measurement did not count, when it last ran. `children` hide;
   * this does not. TR: Bölüm KAPALIYKEN de görünen sessiz satır, başlıkla gövde arasında, aynı
   * çerçevede: bir ölçümün neden sayılmadığı, en son ne zaman koştuğu. `children` gizlenir; bu
   * gizlenmez.
   */
  note?: ReactNode;
  /**
   * Off (default), the body stays in the DOM and is `hidden` when closed, so a search finds it and
   * its state survives. On, the body is not rendered while closed · for a body that is heavy to
   * mount or fetches on its own. TR: Kapalıyken (varsayılan) gövde DOM'da durur ve `hidden`dır;
   * arama bulur, durumu yaşar. Açıkken gövde kapalıyken hiç çizilmez · kurulması ağır ya da kendi
   * başına veri çeken bir gövde için.
   */
  unmountOnClose?: boolean;
  className?: string;
  children: ReactNode;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const id = useId();
  /* KONTROLLÜ Mİ: `open` verildiyse. İkisi birden verildiğinde `open` kazanır,
     `defaultOpen` yalnız ilk çizimde bile okunmaz · React'in kalıbı. */
  const kontrollu = open !== undefined;
  const [ic, setIc] = useState(defaultOpen);
  const acik = kontrollu ? open : ic;
  const degistir = () => {
    const sonraki = !acik;
    onOpenChange?.(sonraki);
    if (!kontrollu) setIc(sonraki);
  };
  return (
    /* KILIĞI KAP VERİYOR (`Accordion look`): satır mı kart mı · aynı kararı
       her çağrı yerinde tekrar almamak için. */
    <div
      {...dataProps(rest)}
      className={cn("tamga-collapsible", className)}
      data-open={acik || undefined}
    >
      <button
        type="button"
        className="tamga-collapsible-head"
        aria-expanded={acik}
        aria-controls={id}
        onClick={degistir}
      >
        {icon ? <Icon icon={icon} size="base" className="shrink-0 text-accent" /> : null}
        {/* Ok DÖNÜYOR, değişmiyor: iki ayrı ikon (sağ/aşağı) kullanmak geçişi
            bir takas yapardı; döndürmek onu bir hareket yapıyor ve hangi
            yönde gittiğini gösteriyor. */}
        <span className="min-w-0 flex-1 text-body font-bold text-ink">{title}</span>
        {meta ? <span className="text-small text-ink-faint">{meta}</span> : null}
        {/* Ok DÖNÜYOR, değişmiyor: iki ayrı ikon (sağ/aşağı) kullanmak geçişi
            bir takas yapardı; döndürmek onu bir hareket yapıyor. */}
        <Icon
          icon={CaretRight}
          size="xs"
          weight="bold"
          className="tamga-collapsible-caret shrink-0"
          style={{ transform: acik ? "rotate(90deg)" : undefined }}
        />
      </button>
      {note ? (
        <div className="tamga-collapsible-note" data-indent={icon ? "true" : undefined}>
          {note}
        </div>
      ) : null}
      {/* Gövde `hidden` ile DOM'da kalıyor (arama bulsun, durumu yaşasın);
          `unmountOnClose` ağır gövdeyi kapalıyken hiç çizmiyor. */}
      {unmountOnClose && !acik ? null : (
        <div
          id={id}
          hidden={!acik}
          className="tamga-collapsible-body"
          data-indent={icon ? "true" : undefined}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Açılır bölümler grubu.
 *
 * Yalnız bir kap: her bölüm kendi durumunu tutuyor. "Aynı anda tek bölüm
 * açık" davranışı BİLEREK yok — bir ayarlar sayfasında iki bölümü yan yana
 * karşılaştırmak yaygın bir iş, ve otomatik kapanma onu imkânsız kılar.
 * Gerekiyorsa çağıran kendi durumunu tutar.
 */
export function Accordion({
  look = "cards",
  className,
  children,
  ...rest
}: {
  /**
   * `cards` each section is its own card and the open one rises · a list where which one is open
   * can be read from across the screen. `list` the quiet stack inside one surface, for a card
   * that already has an edge. TR: `cards` her bölüm kendi kartı ve açık olan yükseliyor · bir
   * listede hangisinin açık olduğu uzaktan okunuyor. `list` tek bir yüzeyin içindeki sessiz
   * yığın, kenarı zaten olan bir kartın içi için.
   */
  look?: "cards" | "list";
  className?: string;
  children: ReactNode;
  [k: `data-${string}`]: unknown;
}) {
  return (
    <div
      {...dataProps(rest)}
      className={cn(look === "cards" ? "tamga-accordion-cards" : "tamga-surface overflow-hidden", className)}
    >
      {children}
    </div>
  );
}
