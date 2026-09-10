import { Icon } from "./icon.js";
import { Refresh, Warning } from "./icons.js";
import { Button } from "./button.js";

/**
 * The third state, and the one the kit was missing.
 *
 * Gerekçe: docs/gerekce/04-bos-ve-hata.md
 */
export function ErrorState({
  title = "Could not load this",
  description,
  detail,
  onRetry,
  retryLabel = "Try again",
  compact = false,
}: {
  title?: string;
  /**
   * plain words: what the person cannot do right now TR: düz sözcüklerle: kişinin şu an ne
   * yapamadığı
   */
  description?: string;
  /**
   * The technical line. SETTLED 2026-08-19 (Ercüment, open question 5) by the locked envelope
   * (api-kontrati.html A4): print `code` and `meta.request_id`, in that order, e.g.
   * `quota_exceeded · req_8f2a…`. Why those two and not the HTTP status: `code` is the stable
   * machine name for what went wrong (it never localises, and it is what support and the
   * programmatic client both branch on), and `request_id` is what matches this failure to a
   * server log; the contract makes it mandatory on 500 and mirrors it in `X-Request-Id`. The
   * human sentence belongs in `description`, from the envelope's already-localised `message`.
   * TR: Teknik satır. 2026-08-19'da KARARA BAĞLANDI (Ercüment, açık soru 5): kilitli zarf
   * (api-kontrati.html A4) uyarınca `code` ve `meta.request_id`, bu sırayla, örneğin
   * `quota_exceeded · req_8f2a…`. Neden bu ikisi ve HTTP durumu değil: `code` neyin
   * bozulduğunun kararlı makine adı (hiç yerelleşmiyor, ve hem destek hem programatik istemci
   * ona bakarak dallanıyor), `request_id` ise bu hatayı bir sunucu kaydıyla eşleştiren şey;
   * kontrat onu 500'de zorunlu kılıyor ve `X-Request-Id` başlığında aynalıyor. İnsan cümlesi
   * zarfın zaten yerelleşmiş `message` alanından `description`'a ait.
   */
  detail?: string;
  onRetry?: () => void;
  retryLabel?: string;
  /**
   * inside a card or a panel rather than a whole page TR: bütün bir sayfa yerine bir kartın ya
   * da panelin içinde
   */
  compact?: boolean;
}) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`tamga-gutter flex flex-col items-start gap-4 ${compact ? "py-6" : "py-12"}`}
    >
      <span
        className="flex size-10 items-center justify-center border"
        style={{
          borderRadius: "var(--radius-ctl)",
          borderColor: "var(--color-critical)",
          color: "var(--color-critical)",
        }}
      >
        <Icon icon={Warning} size="base" />
      </span>

      <div>
        <p className="text-body font-medium text-ink">{title}</p>
        {description ? (
          <p className="mt-1 max-w-[var(--measure)] text-small leading-relaxed text-ink-faint">
            {description}
          </p>
        ) : null}
        {detail ? (
          <p className="mt-2 max-w-[var(--measure)] break-words font-mono text-caption text-ink-faint">
            {detail}
          </p>
        ) : null}
      </div>

      {onRetry ? (
        <Button onClick={onRetry}>
          <Icon icon={Refresh} size="sm" /> {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
