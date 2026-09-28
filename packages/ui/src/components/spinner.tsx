"use client";
import { dataProps } from "../lib/data-props.js";

/**
 * Bars — three uprights marching, echoing the stems in the wordmark and
 * reading as a level meter, which is what this product measures.
 */
/**
 * The accessible name is a REQUIRED prop, not a default (docs/08 rule 5 — primitives receive
 * translated strings, they never fetch translations themselves). A default of "Close" is the
 * worst of both worlds: it satisfies the compiler and ships English into every other language,
 * silently, because nobody sees an aria-label until they are already using a screen reader.
 */
export function Spinner({
  size = 16,
  look = "bars",
  label,
  ...rest
}: {
  size?: number;
  /**
   * `bars` three uprights, the inline one that fits inside a button. `dots` three equal squares
   * blinking in turn, for a line of text. `pixels` the mark's own 3×3 grid, for a panel waiting
   * on its first data. `ring` the familiar circle, for a whole screen. `square` a raised box
   * turning on its own axis, for a wait that owns the view.
   * TR: `bars` üç dikme · bir düğmenin içine sığan satır içi hâli. `dots` sırayla yanıp sönen üç
   * eş kare, bir metin satırı için. `pixels` markanın kendi 3×3 ızgarası, ilk verisini bekleyen
   * bir panel için. `ring` alışıldık çember, bütün bir ekran için. `square` kendi ekseninde
   * dönen yükselmiş bir kutu, görüntüyü sahiplenen bir bekleme için.
   *
   * THE DEFAULT STAYS `bars` because most waiting in this kit happens inside a control, where a
   * spinning circle is a foreign object. TR: Varsayılan `bars` kalıyor, çünkü bu kitte bekleme
   * çoğunlukla bir kontrolün İÇİNDE oluyor ve orada dönen bir çember yabancı bir nesne.
   */
  look?: "bars" | "dots" | "pixels" | "ring" | "square";
  label: string;
  [k: `data-${string}`]: unknown;
}) {
  const w = Math.max(2.5, size * 0.22);

  if (look === "pixels") {
    /* Markanın kendi ızgarası: dokuz kare, köşegen boyunca gecikmeli nabız.
       Sıra köşegen çünkü satır satır yanan bir ızgara "yükleniyor" değil
       "tarama yapılıyor" diye okunuyor. */
    const hucre = Math.max(3, (size - 6) / 3);
    return (
      <span
        {...dataProps(rest)}
        role="status"
        aria-label={label}
        className="tamga-spin-pixels"
        style={{ gridTemplateColumns: `repeat(3, ${hucre}px)` }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            style={{
              width: hucre,
              height: hucre,
              animationDelay: `${((i % 3) + Math.floor(i / 3)) * 90}ms`,
            }}
          />
        ))}
      </span>
    );
  }

  if (look === "dots") {
    /* Üç kare `size` genişliğe tam oturuyor: 3 × (size/4) + 2 × (size/8) = size.
       Aradaki boşluk kareden dar, yoksa üçü bir grup değil üç ayrı işaret. */
    const nokta = Math.max(3, size / 4);
    return (
      <span
        {...dataProps(rest)}
        role="status"
        aria-label={label}
        className="tamga-spin-dots"
        style={{ gap: nokta / 2, height: size }}
      >
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: nokta, height: nokta, animationDelay: `${i * 180}ms` }} />
        ))}
      </span>
    );
  }

  if (look === "square") {
    return (
      <span
        {...dataProps(rest)}
        role="status"
        aria-label={label}
        className="tamga-spin-square"
        style={{ width: size, height: size }}
      />
    );
  }

  if (look === "ring") {
    return (
      <span
        {...dataProps(rest)}
        role="status"
        aria-label={label}
        className="tamga-spin-ring"
        style={{ width: size, height: size, borderWidth: Math.max(2, size * 0.1) }}
      />
    );
  }

  return (
    <span
{...dataProps(rest)}
      role="status"
      aria-label={label}
      className="inline-flex items-end justify-between"
      style={{ width: size, height: size }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="tamga-spin-part"
          style={{
            width: w,
            height: "100%",
            transformOrigin: "bottom",
            background: "currentColor",
            animation: `tamga-bar var(--duration-bar) var(--ease-breath) ${i * 140}ms infinite`,
          }}
        />
      ))}
    </span>
  );
}
