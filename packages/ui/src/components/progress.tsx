import { dataProps } from "../lib/data-props.js";
import { toneOf, yiginRenk, type Tone } from "./tone.js";
/**
 * Progress · ne kadar kaldığını söyler.
 *
 * ÇENTİKLER KALKTI: değeri sayı okumadan okutmak için konmuşlardı, ve sayı
 * artık çubuğun üstünde yazılı. Aynı bilgiyi iki kez söyleyen bir işaret,
 * ikisini de zayıflatıyor.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */

export function Progress({
  value = 0,
  look = "bar",
  blocks = 10,
  segments,
  label,
  valueText,
  ariaLabel,
  className = "",
  ...rest
}: {
  /**
   * 0–100; clamped, so a bad number cannot paint outside the track. `split` ignores it and reads
   * `segments` instead. TR: 0–100; sınırlanıyor, yani kötü bir sayı yolun dışına boyayamıyor.
   * `split` onu okumuyor, `segments`e bakıyor.
   */
  value?: number;
  /**
   * `bar` the striped track · a continuous quantity ("84% of the monthly target"). `blocks` a
   * row of cells · a COUNTABLE capacity, where "7 of 10" is the real sentence and a smooth bar
   * would be lying about precision. `split` one track cut into shares · a distribution that adds
   * up to a whole, with its legend underneath. TR: `bar` çizgili yol · sürekli bir nicelik
   * ("aylık hedefin %84'ü"). `blocks` hücre dizisi · SAYILABİLİR bir kapasite, asıl cümlenin
   * "10'da 7" olduğu yerde: orada düz bir çubuk, olmayan bir hassasiyeti iddia ediyor. `split`
   * paylara bölünmüş tek yol · bütünü tamamlayan bir dağılım, altında kendi lejantıyla.
   */
  look?: "bar" | "blocks" | "split";
  /** `blocks` only: how many cells the capacity has. TR: yalnız `blocks`: kapasitenin kaç hücresi var. */
  blocks?: number;
  /**
   * `split` only: the shares, in order. `label` is the whole legend line as the caller writes it
   * ("Delivered 48%") · the kit formats no percentages, because the sign and its place are a
   * locale. TR: yalnız `split`: paylar, sırayla. `label` lejant satırının tamamı, çağıranın
   * yazdığı gibi ("Teslim %48") · kit yüzde biçimlemiyor, çünkü işaret de yeri de bir yerel.
   */
  segments?: readonly ({ value: number; tone?: Tone; label?: string } & Record<string, unknown>)[];
  /**
   * The line above the bar, on the left: what is progressing. TR: Çubuğun üstündeki satır, solda:
   * ilerleyen şeyin adı.
   */
  label?: string;
  /**
   * What is written on the right, above the bar. Defaults to the percentage; give it the real
   * counts when they mean more ("3 / 5"). TR: Çubuğun üstünde sağda yazan. Varsayılanı yüzde;
   * gerçek sayılar daha çok şey söylüyorsa onları verin ("3 / 5").
   */
  valueText?: string;
  /**
   * the accessible name, when there is no visible label to borrow TR: ödünç alınacak görünür
   * bir etiket yoksa erişilebilir ad
   */
  ariaLabel?: string;
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const pct = Math.max(0, Math.min(100, value));

  const ust =
    label || valueText ? (
      <div className="tamga-progress-ust">
        <span>{label}</span>
        <span className="tamga-progress-deger">{valueText ?? `%${Math.round(pct)}`}</span>
      </div>
    ) : null;

  if (look === "blocks") {
    /* SON DOLU HÜCRE AÇIK TONDA: "burada duruyoruz" diyen tek işaret o · hepsi
       aynı dolulukta olduğunda saymak gerekiyor, oysa sayı zaten üstte yazılı. */
    const dolu = Math.round((pct / 100) * blocks);
    return (
      <div {...dataProps(rest)} className={className}>
        {ust}
        <div
          className="tamga-progress-bloklar"
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label ?? ariaLabel ?? "Progress"}
          style={{ gridTemplateColumns: `repeat(${blocks}, 1fr)` }}
        >
          {Array.from({ length: blocks }, (_, i) => (
            <span
              key={i}
              className="tamga-progress-blok"
              data-dolu={i < dolu || undefined}
              data-son={i === dolu - 1 || undefined}
            />
          ))}
        </div>
      </div>
    );
  }

  if (look === "split") {
    const paylar = segments ?? [];
    const toplam = paylar.reduce((n, p) => n + p.value, 0) || 1;
    return (
      <div {...dataProps(rest)} className={className}>
        {ust}
        <div className="tamga-progress-split" role="img" aria-label={label ?? ariaLabel ?? "Progress"}>
          {paylar.map(({ value: v, tone, label: _etiket, ...kanca }, i) => (
            <span
              {...kanca}
              key={i}
              style={{ width: `${(v / toplam) * 100}%`, background: tone ? toneOf(tone).mark : yiginRenk(i) }}
            />
          ))}
        </div>
        {paylar.some((p) => p.label) ? (
          <div className="tamga-progress-lejant">
            {paylar.map((p, i) => (p.label ? <span key={i}>{p.label}</span> : null))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div {...dataProps(rest)} className={className}>
      {/* ETİKET VE SAYI ÜSTTE, altta değil. Altta dururken göz önce çubuğu
          okuyup sonra adını arıyordu; bir ilerleme çubuğu tek başına "neyin"
          ilerlediğini söylemiyor. Sayı sağda ve mono: okunan bir sözcük değil
          karşılaştırılan bir değer. */}
      {ust}
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
      </div>
    </div>
  );
}
