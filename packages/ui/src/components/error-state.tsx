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
   * The technical line: what support and a programmatic client can act on. TR: Teknik satır:
   * desteğin ve programatik istemcinin üzerinde işlem yapabileceği şey.
   *
   * İki parça bekliyor, bu sırayla: neyin bozulduğunun KARARLI MAKİNE ADI ve hatayı bir sunucu
   * kaydıyla eşleştiren KİMLİK, örneğin `quota_exceeded · req_8f2a…`. İkisinin de yerelleşmemesi
   * gerekiyor; insan cümlesi `description`a ait. Alanların adı ve hangi yanıtta zorunlu olduğu
   * ürünün API sözleşmesinin kararı, bu bileşenin değil.
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
