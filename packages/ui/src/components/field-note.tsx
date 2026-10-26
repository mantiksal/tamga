import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import { Warning } from "./icons.js";
import { toneOf } from "./tone.js";

/* TEK HATA SATIRI · Field, RadioGroup ve Checkbox aynı çizimi kullanıyor.
   Kopya yazılmıyor: ürünler Field'ın satırını elle kopyalıyordu ve üçü
   birbirinden ayrışıyordu. Önek (errorPrefix) görünmez, ekran okuyucuya
   "Hata: …" dedirtiyor; sözcüğü çağıran veriyor, kit çeviri yapmaz. */
export function FieldNote({
  id,
  error,
  description,
  errorPrefix,
  className,
  as: Tag = "p",
  ...rest
}: {
  id?: string;
  error?: string;
  description?: string;
  errorPrefix?: string;
  className?: string;
  /** `span` when the line sits inside a button, where a paragraph is not allowed. TR: Satır bir düğmenin içindeyse `span`; orada paragraf olmaz. */
  as?: "p" | "span";
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  if (error) {
    return (
      <Tag {...dataProps(rest)} id={id} className={["tamga-field-hata", className].filter(Boolean).join(" ")} style={{ color: toneOf("danger").fg }}>
        <Icon icon={Warning} size="xs" weight="fill" />
        {errorPrefix ? <span className="sr-only">{errorPrefix} </span> : null}
        {error}
      </Tag>
    );
  }
  if (description) {
    return (
      <Tag {...dataProps(rest)} id={id} className={["block text-small text-ink-faint", className].filter(Boolean).join(" ")}>
        {description}
      </Tag>
    );
  }
  return null;
}

/** The id the note takes, or nothing when there is no note. TR: Notun alacağı kimlik; not yoksa yok. */
export function noteId(kok: string, error?: string, description?: string) {
  return error ? `${kok}-error` : description ? `${kok}-description` : undefined;
}

/** The JSDoc shared by the three carriers. TR: Üç taşıyıcının ortak prop açıklaması. */
export type NoteProps = {
  /** The quiet line under the control. TR: Kontrolün altındaki sessiz satır. */
  description?: string;
  /**
   * The error line: critical colour, a warning glyph, wired to the control with
   * `aria-describedby` and `aria-invalid`. While it shows, `description` is hidden. TR: Hata
   * satırı: kritik renk, uyarı glifi, kontrole `aria-describedby` ve `aria-invalid` ile bağlı.
   * Göründüğü sürece `description` gizlenir.
   */
  error?: string;
  /**
   * An invisible word before the error, for screen readers: "Error:". The caller writes it in
   * its own language; the kit does not translate. TR: Hatanın önünde, yalnız ekran okuyucunun
   * duyduğu bir sözcük: "Hata:". Çağıran kendi dilinde yazıyor; kit çeviri yapmaz.
   */
  errorPrefix?: string;
};
