"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Tone } from "./tone.js";
import { toneOf } from "./tone.js";
import { Icon } from "./icon.js";
import { CaretRight, Check, Close } from "./icons.js";
import { SkeletonOptions, SkeletonPanel } from "./skeleton.js";
import { useScrollLock } from "../lib/scroll-lock.js";
import { cn } from "../lib/cn.js";
import { useFocusTrap, useListKeys } from "./a11y.js";
import { useLiveClaim } from "./live-scope.js";
import { Button, MiniButton } from "./button.js";

export { Spinner } from "./spinner.js";

/* ------------------------------------------------------------------ *
 * Small primitives. Each one is the design language applied, not a new
 * idea — if a component here needs a rule that Foundations does not
 * already state, the rule is missing, not the component.
 * ------------------------------------------------------------------ */

export function Separator({ vertical = false }: { vertical?: boolean }) {
  return <span className={vertical ? "tamga-rule-v" : "tamga-rule-h"} role="separator" />;
}

/** Running is not a deviation, so the live mark stays neutral — the pulse carries it. */
export function Beacon({
  live = true,
  label,
  severity = 50,
}: {
  live?: boolean;
  label?: string;
  /**
   * a bare beacon outranks nothing in particular; give it a rank to compete TR: çıplak bir
   * işaret hiçbir şeye üstün gelmez; yarışması için ona bir sıra verin
   */
  severity?: number | null;
}) {
  const pulses = useLiveClaim(live ? severity : null);
  return (
    <span className="inline-flex items-center gap-2">
      <span className="tamga-beacon" data-live={pulses} />
      {label ? <span className="text-small text-ink-faint">{label}</span> : null}
    </span>
  );
}

export function Alert({
  state = "caution",
  title,
  children,
  action,
}: {
  state?: Tone;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  const h = toneOf(state);
  return (
    <div className="tamga-alert" style={{ borderLeftColor: h.mark }} role="status">
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium text-ink">{title}</p>
        {/* GÖVDE BİR `div`, `p` DEĞİL. Bir uyarının gövdesi çoğu zaman tek bir
            cümle değil bir LİSTE oluyor ("üç alan eksik", her biri kendi
            alanına giden bir bağlantı), ve `<p>` içindeki bir `<ul>` geçersiz
            HTML: tarayıcı listeyi paragrafın dışına çıkarıyor, sunucunun
            ürettiği ağaç ile istemcininki ayrışıyor, hidrasyon patlıyor. Hata
            vermeyen bir kırılma değil, konsola düşen bir kırılma — ama sebebi
            uyarının kendisinde aranmıyordu. */}
        {children ? (
          <div className="mt-1 text-small leading-relaxed text-ink-soft">{children}</div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Breadcrumb({
  items,
  label,
}: {
  items: { label: string; href?: string }[];
  /**
   * The landmark's accessible name; see the note on Spinner. TR: Landmark'ın erişilebilir adı;
   * Spinner'daki nota bakın.
   */
  label: string;
}) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-2 text-body">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="font-medium text-ink">
                  {item.label}
                </span>
              ) : (
                <a href={item.href ?? "#"} className="tamga-link">
                  {item.label}
                </a>
              )}
              {last ? null : (
                <Icon icon={CaretRight} size="xs" weight="bold" className="text-ink-faint" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Field({
  label,
  description,
  error,
  children,
  htmlFor,
}: {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-small font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-small" style={{ color: toneOf("danger").fg }}>
          {error}
        </p>
      ) : description ? (
        <p className="text-small text-ink-faint">{description}</p>
      ) : null}
    </div>
  );
}

/** A plain select: the same overlay as the searchable one, without the search. */
export function Select({
  options,
  value,
  onChange,
  placeholder,
  loading = false,
  loadingRows = 4,
  className,
}: {
  options: string[];
  value?: string;
  onChange?: (v: string) => void;
  /**
   * Visible when nothing is chosen; user-facing, so the caller supplies it translated. TR:
   * Hiçbir şey seçilmemişken görünür; kullanıcıya gösterildiği için çevirisini çağıran veriyor.
   */
  placeholder: string;
  /**
   * options not in yet; the list holds its shape instead of showing a spinner TR: seçenekler
   * henüz gelmedi; liste bir dönen simge göstermek yerine şeklini koruyor
   */
  loading?: boolean;
  /**
   * How many skeleton rows to hold while `loading`. SETTLED 2026-08-19 (open question 4): this
   * is never a taste value; it is the number of records that are actually coming, because the
   * whole point of the skeleton is that the panel does not resize when they land. Where that
   * number comes from (api-kontrati.html A7, KİLİTLİ): · paginated list → the request's
   * `page_size` (DRF default 25, max 100) · last page → `meta.count - (page - 1) * page_size` ·
   * cursor list → `page_size` (no `count` is returned, by design) · known-size menu → the item
   * count the caller already knows The default of 4 fits a menu, not a list. A list that leaves
   * it at 4 is a bug that looks like a design choice. TR: `loading` sürerken kaç iskelet satırı
   * tutulacağı. 2026-08-19'da KARARA BAĞLANDI (açık soru 4): bu asla bir zevk değeri değil;
   * gerçekten gelmekte olan kayıt sayısı, çünkü iskeletin bütün amacı kayıtlar geldiğinde
   * panelin yeniden boyutlanmaması. O sayının nereden geldiği (api-kontrati.html A7, KİLİTLİ):
   * · sayfalı liste → isteğin `page_size` değeri (DRF varsayılanı 25, en çok 100) · son sayfa →
   * `meta.count - (page - 1) * page_size` · imleçli liste → `page_size` (tasarım gereği `count`
   * dönmüyor) · boyu bilinen menü → çağıranın zaten bildiği öğe sayısı Varsayılan 4 bir menüye
   * uyuyor, bir listeye değil. 4'te bırakılmış bir liste, tasarım kararı gibi görünen bir
   * hatadır.
   */
  loadingRows?: number;
  /** Genişlik ve konum çağıranın. Varsayılan `w-56`; `w-full` verildiğinde
   *  tailwind-merge onu ezer, yani kontrol kabına uyar. */
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [inner, setInner] = useState(value ?? "");
  const box = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const current = value ?? inner;
  const close = useCallback(() => setOpen(false), []);
  useListKeys({ open: open && !loading, containerRef: list, onClose: close });

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  return (
    /* GENİŞLİK SABİT DEĞİL. Bir süre `w-56` yazılıydı ve `className` bile
       alınmıyordu; sonuç, kontrolün hiçbir ızgaraya ya da filtre çubuğuna
       sığmaması ve kabından taşarak yatay kaydırma açması. Bir form kontrolü
       kendi genişliğine karar veremez; kabı karar verir. */
    <div ref={box} className={cn("relative w-56", className)}>
      <Button full className="justify-between"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {/* ETİKET KIRPILIR, OK KIRPILMAZ.
            `.tamga-btn` `white-space: nowrap` taşıyor ve bu span'in `min-width`i
            `auto`ydu: yani metin kabından uzunsa esnek kutu onu KÜÇÜLTMÜYORDU.
            Sonuç, `justify-between`in dağıtacak boşluğu kalmaması ve okun
            metnin dibine yapışıp sağ dolguyu taşması. Uzun bir seçenek
            ("Kargoya verilmeyenler") yan yana duran kısa bir seçeneğe göre
            hizasız görünüyordu, ve sebebi hizalama değil TAŞMAYDI.
            `min-w-0` + `truncate` etiketi üç noktayla kesiyor, `shrink-0` oku
            yerinde tutuyor: ok artık her kontrolde aynı yerde. */}
        <span className={cn("min-w-0 truncate", current ? "" : "text-ink-faint")}>
          {current || placeholder}
        </span>
        <Icon icon={CaretRight} size="xs" className="shrink-0 rotate-90" />
      </Button>
      {open && (
        <div
          ref={list}
          role="listbox"
          className="tamga-overlay absolute left-0 top-[var(--overlay-below)] z-40 w-full overflow-hidden py-1"
          aria-busy={loading || undefined}
        >
          {loading && <SkeletonOptions rows={loadingRows} />}
          {!loading && options.map((o) => (
            <button
              key={o}
              role="option"
              aria-selected={o === current}
              data-tamga-option
              className="tamga-option"
              data-selected={o === current}
              onClick={() => {
                setInner(o);
                onChange?.(o);
                setOpen(false);
              }}
            >
              {o}
              {o === current && <Icon icon={Check} size="xs" weight="bold" className="ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Side panel. Overlay plane, so it carries the 6px offset and a scrim. */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  loading = false,
  closeLabel,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * Accessible name for the close control, supplied by the caller (docs/08 rule 5). TR: Kapatma
   * kontrolünün erişilebilir adı, çağıran veriyor (docs/08 kural 5).
   */
  closeLabel: string;
  /**
   * contents not in yet; the panel holds its shape instead of showing a spinner TR: içerik
   * henüz gelmedi; panel bir dönen simge göstermek yerine şeklini koruyor
   */
  loading?: boolean;
}) {
  /* the trap has to be called before any early return, so the hook lives here
     and the null is returned after it */
  const panel = useFocusTrap<HTMLElement>(open);
  useScrollLock(open);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* mouse affordance only: Escape and the Close button already cover the
            keyboard, and leaving this in the a11y tree gave the panel two
            controls both announced as "Close" */}
        <div className="tamga-scrim absolute inset-0" aria-hidden onClick={onClose} />
      <aside
        ref={panel}
        role="dialog"
        aria-modal
        aria-label={title}
        className="tamga-overlay relative z-10 flex h-full w-full max-w-md flex-col"
        style={{ borderRadius: 0 }}
        aria-busy={loading || undefined}
      >
        <div className="tamga-head tamga-gutter tamga-section">
          <h3 className="text-subhead font-semibold">{title}</h3>
          <MiniButton onClick={onClose} aria-label={closeLabel} className="ml-auto">
            <Icon icon={Close} size="xs" />
          </MiniButton>
        </div>
        <div className="tamga-gutter min-h-0 flex-1 overflow-y-auto py-6">
          {loading ? <SkeletonPanel lines={5} block={120} /> : children}
        </div>
        {footer ? (
          <div className="tamga-gutter flex justify-end gap-2 border-t border-line py-4">{footer}</div>
        ) : null}
      </aside>
    </div>
  );
}
