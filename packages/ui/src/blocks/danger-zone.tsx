"use client";

import { useId, type ReactNode } from "react";
import { Button } from "../components/button.js";
import { Icon } from "../components/icon.js";
import { Warning } from "../components/icons.js";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";

/**
 * TEHLİKELİ BÖLGE · ayarlar sayfasının en altı, geri alınamayan eylemler.
 *
 * Üç ayar sayfası aynı bölgeyi üç ayrı biçimde elle yazıyordu; birinde kapalı
 * düğmenin gerekçesi yalnız `title=` ipucundaydı. Blok onay penceresi AÇMAZ:
 * tık çağırana gider, `ConfirmDialog`u ürün kurar · "adını yazdır" gibi
 * kararlar onda kalır. Gerekçe: docs/gerekce/08-blok-ve-sablon.md
 */
export type DangerAction = {
  key: string;
  /** The action's name, as a row title. TR: Eylemin adı, satır başlığı. */
  title: string;
  /** One sentence saying what will happen. TR: Ne olacağını söyleyen tek cümle. */
  description: string;
  /** The button's text. TR: Düğmenin metni. */
  label: string;
  /** The click is the caller's; open your `ConfirmDialog` here. TR: Tık çağıranın; `ConfirmDialog`unu burada aç. */
  onClick?: () => void;
  /**
   * Given, the row is closed and THIS SENTENCE is shown next to the button and bound to it with
   * `aria-describedby`. A disabled button is not a reason; a tooltip on one is invisible to most
   * browsers, to the keyboard and to touch. TR: Verilirse satır kapalı ve BU CÜMLE düğmenin
   * yanında görünür, `aria-describedby` ile ona bağlı. Kapalı düğme bir gerekçe değildir; üstündeki
   * ipucu çoğu tarayıcıda, klavyede ve dokunmatikte görünmez.
   */
  disabledReason?: string;
  /** The action is running: the button shows a spinner and locks. TR: Eylem sürüyor: düğme spinner gösterir ve kilitlenir. */
  busy?: boolean;
  /**
   * Shown under the row when a precondition stopped the action: the server said "do this first".
   * Put the kit's `Alert` (`state="caution"`) here. TR: Bir önkoşul eylemi durdurduğunda satırın
   * altında · sunucu "önce şunu yap" dedi. Kitin `Alert`ini (`state="caution"`) koy.
   */
  warning?: ReactNode;
} & Record<string, unknown>;

export function DangerZone({
  title,
  description,
  actions,
  className,
  ...rest
}: {
  title: string;
  description?: string;
  actions: readonly DangerAction[];
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const id = useId();
  return (
    /* KENAR VE KARO KIRMIZI, KART DEĞİL. Burası gerçekten bir sapma bölgesi
       (Yasa 3 izin verir) ama bütün kartı boyamak içindeki uyarıyı ve
       düğmeleri yutar; kenar, karo ve danger düğmeler yeter. Tehlike yalnız
       renkle söylenmiyor: başlık ve uyarı glifi de söylüyor (1.4.1). */
    <section {...dataProps(rest)} className={cn("tamga-danger-zone", className)} aria-labelledby={`${id}-b`}>
      <div className="tamga-danger-zone-head">
        <span className="tamga-danger-zone-tile" aria-hidden="true">
          <Icon icon={Warning} size="sm" weight="bold" />
        </span>
        <div className="min-w-0">
          <h3 id={`${id}-b`} className="text-subhead font-semibold text-ink">{title}</h3>
          {description ? <p className="mt-1 text-small leading-relaxed text-ink-soft">{description}</p> : null}
        </div>
      </div>
      <ul className="tamga-danger-zone-list">
        {actions.map(({ key, title: ad, description: ne, label, onClick, disabledReason, busy, warning, ...satir }, i) => {
          const gerekceId = `${id}-g${i}`;
          return (
            <li {...dataProps(satir)} key={key} data-action={key} data-disabled={disabledReason ? "true" : undefined} className="tamga-danger-zone-row">
              <div className="flex flex-wrap items-start gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-body font-semibold text-ink">{ad}</p>
                  <p className="text-small leading-relaxed text-ink-soft">{ne}</p>
                  {disabledReason ? (
                    <p id={gerekceId} className="tamga-danger-zone-reason" data-reason>
                      {disabledReason}
                    </p>
                  ) : null}
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onClick}
                  disabled={Boolean(disabledReason) || busy}
                  busy={busy}
                  aria-describedby={disabledReason ? gerekceId : undefined}
                >
                  {label}
                </Button>
              </div>
              {warning ? <div className="mt-3">{warning}</div> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
