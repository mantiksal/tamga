import { dataProps } from "../lib/data-props.js";
/**
 * A card header. It carries the card's own left line and is closed by the
 * single rule weight used everywhere else.
 */
export function SectionHead({
  title,
  eyebrow,
  description,
  size = "base",
  meta,
  mono = false,
  action,
  ...rest
}: {
  title: string;
  /**
   * The short word above the title, in the accent: which area of the product this section
   * belongs to. TR: Başlığın üstündeki kısa sözcük, vurgu renginde: bu bölümün ürünün hangi
   * alanına ait olduğu.
   */
  eyebrow?: string;
  /** One quiet line under the title. TR: Başlığın altındaki tek sessiz satır. */
  description?: string;
  /**
   * `base` a card's own header strip, `lg` a section of a PAGE: a bigger title, no closing rule
   * and no gutter of its own. `sub` a row INSIDE a card that opens a sub-section: no band
   * behind it, a rule under it, and `meta` becomes a count chip beside the title.
   * TR: `base` bir kartın kendi başlık şeridi, `lg` bir SAYFANIN bölümü · daha büyük başlık,
   * kapatan kural yok, kendi iç boşluğu yok. `sub` bir kartın İÇİNDE alt bölüm açan satır ·
   * arkasında şerit yok, altında kural var, ve `meta` başlığın yanında bir sayı çipi oluyor.
   */
  size?: "base" | "lg" | "sub";
  meta?: string;
  /**
   * set when the title is an identifier: a host, service or region TR: başlık bir
   * tanımlayıcıysa verin: bir sunucu, servis ya da bölge adı
   */
  mono?: boolean;
  action?: React.ReactNode;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  if (size === "lg") {
    /* SAYFA BÖLÜMÜNÜN BAŞI: kartın şeridi değil · kendi kuralı ve iç boşluğu
       yok, çünkü sayfanın ritmini kap veriyor. Üst etiket VURGU renginde:
       sessiz bir gri olduğunda başlıkla arasındaki bağ okunmuyordu. */
    return (
      <div {...dataProps(rest)} className="flex flex-wrap items-end gap-4">
        <div className="flex min-w-60 flex-1 flex-col gap-1.5">
          {eyebrow ? <span className="tamga-eyebrow">{eyebrow}</span> : null}
          <h3 className="font-display text-display leading-tight font-extrabold tracking-tight text-ink">
            {title}
          </h3>
          {description ? <p className="text-body text-ink-faint">{description}</p> : null}
        </div>
        {action ? <div className="flex flex-wrap items-center gap-3">{action}</div> : null}
      </div>
    );
  }

  if (size === "sub") {
    /* ALT BÖLÜM SATIRI: kartın İÇİNDE ikinci bir başlık. Şeridi yok çünkü kart
       zaten bir kere şerit taşıyor; ayıran şey altındaki kural. */
    return (
      <div {...dataProps(rest)} className="tamga-subhead">
        <strong className="font-display text-subhead text-ink">{title}</strong>
        {meta ? <span className="tamga-sayac tabular-nums">{meta}</span> : null}
        {action ? <div className="ml-auto flex items-center gap-2">{action}</div> : null}
      </div>
    );
  }

  return (
    <div {...dataProps(rest)} className="tamga-head tamga-gutter tamga-section">
      <h3 className={`text-subhead font-semibold ${mono ? "font-mono text-control font-bold" : ""}`}>
        {title}
      </h3>
      {meta ? <span className="tamga-label">{meta}</span> : null}
      {action ? <div className="ml-auto flex items-center gap-2">{action}</div> : null}
    </div>
  );
}
