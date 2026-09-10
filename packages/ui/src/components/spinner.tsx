"use client";

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
export function Spinner({ size = 16, label }: { size?: number; label: string }) {
  const w = Math.max(2.5, size * 0.22);
  return (
    <span
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
