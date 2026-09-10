/**
 * Progress — an instrument scale.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */

const TICKS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

export function Progress({
  value,
  label,
  showScale = false,
  ariaLabel,
  className = "",
}: {
  /**
   * 0–100; clamped, so a bad number cannot paint outside the track TR: 0–100; sınırlanıyor,
   * yani kötü bir sayı yolun dışına boyayamıyor
   */
  value: number;
  /**
   * the line under the bar; say the real counts, not just the percentage TR: çubuğun altındaki
   * satır; yalnız yüzdeyi değil gerçek sayıları söyleyin
   */
  label?: string;
  /**
   * 0 · 50 · 100 under the track, for the rare case the bar stands alone TR: yolun altında 0 ·
   * 50 · 100, çubuğun tek başına durduğu nadir durum için
   */
  showScale?: boolean;
  /**
   * the accessible name, when there is no visible label to borrow TR: ödünç alınacak görünür
   * bir etiket yoksa erişilebilir ad
   */
  ariaLabel?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className={className}>
      <div
        className="tamga-progress"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        /* a progressbar with no name is announced as nothing; fall back to the
           visible label, then to a plain description of what it is */
        aria-label={label ?? ariaLabel ?? "Progress"}
      >
        <div className="tamga-progress-fill" style={{ width: `${pct}%` }} />
        {TICKS.map((t) => (
          <span
            key={t}
            aria-hidden
            className="tamga-progress-tick"
            style={{
              left: `${t}%`,
              /* a tick over the fill has to cut out of it, not sit on it */
              background: t <= pct ? "var(--color-page)" : "var(--color-tick)",
              opacity: t === 50 ? 1 : 0.55,
            }}
          />
        ))}
      </div>

      {showScale ? (
        <div className="mt-1.5 flex justify-between font-mono text-micro text-ink-faint">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      ) : null}

      {label ? (
        <p className="mt-2 font-mono text-small text-ink-faint">{label}</p>
      ) : null}
    </div>
  );
}
