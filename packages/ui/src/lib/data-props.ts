/**
 * `data-*` niteliklerini ayıklar, ve YALNIZ onları. Kit bileşenleri fazladan
 * prop yaymıyor; `data-*` eylemsiz olduğu için istisna. `aria-*` bu listede yok
 * bilerek: o, bileşenin hesapladığı erişilebilir adı sessizce eziyor.
 *
 * Gerekçe: docs/gerekce/09-kitaplik.md
 */
export function dataProps(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) if (k.startsWith("data-")) out[k] = v;
  return out;
}
