import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import { Refresh, Warning } from "./icons.js";
import { Button } from "./button.js";

/**
 * The third state, and the one the kit was missing.
 *
 * Gerekçe: docs/gerekce/04-bos-ve-hata.md
 */
export function ErrorState({
  title,
  description,
  detail,
  onRetry,
  retryLabel,
  compact = false,
  ...rest
}: {
  /**
   * What failed, in the reader's language. Required, with no default: a
   * default here would be an English sentence rendered inside every other
   * language, and nobody notices a wrong default until a user reports it.
   * TR: Neyin başarısız olduğu, okuyanın dilinde. Zorunlu ve varsayılansız:
   * buradaki bir varsayılan, her dilin içinde çizilen bir İngilizce cümle
   * olurdu, ve yanlış bir varsayılanı kimse bir kullanıcı bildirene kadar
   * fark etmiyor.
   */
  title: string;
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
  /**
   * inside a card or a panel rather than a whole page TR: bütün bir sayfa yerine bir kartın ya
   * da panelin içinde
   */
  compact?: boolean;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
} & (
  | { onRetry?: undefined; retryLabel?: undefined }
  /* THE TWO TRAVEL TOGETHER. A handler with no label drew a nameless button,
     and a label with no handler drew nothing at all, silently. Neither state
     is ever what the caller meant, so the type refuses both. */
  | {
      onRetry: () => void;
      /**
       * The retry button's words, in the reader's language. TR: Yeniden dene
       * düğmesinin sözcükleri, okuyanın dilinde.
       */
      retryLabel: string;
    }
)) {
  return (
    <div
{...dataProps(rest)}
      role="alert"
      aria-live="polite"
      /* ORTALANMIŞ: hata bölümün YERİNİ alıyor, kenarına iliştirilmiyor ·
         sola yaslı bir blok, boş kalan alanı hâlâ doldurulacak gibi
         gösteriyordu. */
      className={`tamga-gutter flex flex-col items-center gap-4 text-center ${compact ? "py-6" : "py-12"}`}
    >
      {/* A PLAQUE, not an outline. The failure is the loudest thing on the
          screen and an outlined square reads as one more empty box among the
          boxes that failed to fill. It casts a shadow like the artwork in an
          empty state does — a physical object on the page, not an affordance:
          it has no hover and no press, so nothing invites a click. */}
      <span
        className="flex size-13 items-center justify-center"
        style={{
          borderRadius: "var(--radius-card)",
          border: "1.5px solid var(--color-edge)",
          background: "var(--color-critical)",
          color: "var(--color-critical-ink)",
          boxShadow: "4px 4px 0 var(--color-edge)",
        }}
      >
        <Icon icon={Warning} size="lg" />
      </span>

      <div>
        <p className="font-display text-title font-extrabold tracking-tight text-ink">{title}</p>
        {description ? (
          <p className="mx-auto mt-1.5 max-w-[var(--measure)] text-body leading-relaxed text-ink-faint">
            {description}
          </p>
        ) : null}
        {/* The machine line is SEATED in a recess. It is the one part of this
            block meant to be selected and pasted into a ticket, and a bounded
            chip says "this is a value" where loose mono text says "small
            print". Seated, so it never competes with the retry. */}
        {detail ? (
          <p
            className="mt-3 inline-block max-w-[var(--measure)] break-words px-2 py-0.5 font-mono text-caption text-ink-faint"
            style={{
              background: "var(--color-sunk)",
              border: "1px solid var(--color-line)",
              borderRadius: "var(--radius-chip)",
            }}
          >
            {detail}
          </p>
        ) : null}
      </div>

      {/* YENİDEN DENE BİRİNCİL: bu ekranda yapılacak tek şey o, ve sayfadaki
          tek dolu düğme kuralını çiğnemiyor · hata hâlindeyken sayfa zaten
          başka bir şey sunmuyor. */}
      {onRetry ? (
        <Button variant="primary" onClick={onRetry}>
          <Icon icon={Refresh} size="sm" /> {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
