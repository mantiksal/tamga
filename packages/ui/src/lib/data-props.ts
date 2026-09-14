/**
 * `data-*` niteliklerini ayıklar — ve YALNIZ onları.
 *
 * KİT BİLEŞENLERİ FAZLADAN PROP YAYMIYOR ve bu bilinçli: 85 bileşenin 78'i böyle. Her şeyi
 * yaymak, çağıranın `className`i, `onClick`i ya da `style`ı bileşenin kendi davranışının üstüne
 * yazmasına izin vermek olurdu — "kürasyonlu seçenek, serbestlik değil" kararının tam tersi.
 *
 * AMA `data-*` BAŞKA. Eylemsizdir: HTML'de hiçbir davranışa bağlanmaz, yalnız bir kanca taşır —
 * bir testin tutunacağı, bir stilin seçeceği, bir analitiğin okuyacağı. Bileşeni bozamaz.
 *
 * Kabul etmemenin bedeli ölçüldü ve yüksek: bir `data-verdict` kancası gerektiği için tüketici
 * bileşeni bırakıp sınıfını elle yazıyor, ve o sınıfla birlikte gelen korumaları (kırpma,
 * erişilebilirlik, kaydırma) kaybediyor. Kanca sessizce düşüyor, hiçbir yerde hata vermiyor:
 * geçen taraf geçtiğini sanıyor, alan taraf hiç çizmiyor.
 *
 * `aria-*` BU LİSTEDE YOK, bilerek. O eylemsiz değil: bir `aria-label`, bileşenin kendi
 * hesapladığı erişilebilir adı sessizce ezer. Erişilebilirlik bir prop olarak AÇIKÇA istenir.
 */
export function dataProps(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) if (k.startsWith("data-")) out[k] = v;
  return out;
}
