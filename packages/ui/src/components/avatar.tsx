import { cn } from "../lib/cn.js";
function initials(name: string, count: 1 | 2) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, count)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/** Square, monochrome. Identity is text — color is reserved for health. */
export function Avatar({
  name,
  size = 32,
  src,
  bare = false,
  letters = 2,
}: {
  name: string;
  size?: number;
  /**
   * falls back to initials when absent or broken TR: yoksa ya da yüklenemezse baş harflere
   * düşer
   */
  src?: string;
  /**
   * Drop the avatar's own frame. For when it sits INSIDE a control that already has one: a
   * bordered tile inside a bordered button is a box in a box, and it made the account control
   * the odd one out on a toolbar where every other button holds a bare glyph. TR: Avatarın
   * kendi çerçevesini kaldır. Zaten çerçevesi olan bir kontrolün İÇİNDE duruyorsa: çerçeveli
   * bir düğmenin içindeki çerçeveli bir karo kutu içinde kutudur, ve hesap kontrolünü her
   * düğmesi çıplak bir simge taşıyan bir araç çubuğunda tek başına farklı gösteriyordu.
   */
  bare?: boolean;
  /**
   * How many initials to show. An avatar standing alone carries two, the least it takes to
   * point at a person. But two do not fit in an OVERLAPPING stack: the tile above clips the
   * right of the one below and "BS" reads as "B" plus half an "S". A photo does not have this
   * problem, because half a face is still a face; half a letter cannot be read. `AvatarStack`
   * passes 1 for exactly that reason. TR: Kaç baş harf gösterileceği. Tek başına duran bir
   * avatar iki harf taşır; bir kişiyi işaret etmek için gereken en az şey o. Ama ÖRTÜŞEN bir
   * yığında iki harf sığmaz: üstteki karo alttakinin sağını keser ve "BS", "B" ile yarım bir
   * "S" olarak okunur. Fotoğrafta bu sorun değildir, çünkü yarım bir yüz hâlâ bir yüzdür; bir
   * harf ise yarım okunamaz. `AvatarStack` bu yüzden 1 geçiyor.
   */
  letters?: 1 | 2;
}) {
  const box = {
    width: size,
    height: size,
    /* 0.42, not 0.34: at the old ratio a 26px avatar produced 9px initials, which read as a
       smudge next to a 16px icon glyph. Initials ARE the glyph when an avatar sits in a control. */
    fontSize: Math.max(11, Math.round(size * 0.42)),
  };
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- avatars come from arbitrary remote hosts; the optimiser would need every one allow-listed
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={cn("shrink-0 object-cover", !bare && "rounded-[var(--radius-mark)] border border-edge")}
        style={box}
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-semibold text-ink",
        !bare && "rounded-[var(--radius-mark)] border border-edge bg-hover",
      )}
      style={box}
      aria-hidden
    >
      {initials(name, letters)}
    </span>
  );
}

/**
 * Üst üste binen ekip.
 *
 * İKİ ŞEY AYRI AYRI YANLIŞTI ve ikisi de aynı sonucu veriyordu: karolar
 * birbirine yapışıp tek bir karışık blok olarak okunuyordu.
 *
 * Birincisi ÖRTÜŞME SABİTTİ — her boyutta 8px. Bir 24px karoda bu üçte bir
 * demek, ve iki baş harften biri kapanıyor. Şimdi boyuna oranlı: dörtte bir,
 * yani karo büyüdükçe örtüşme de büyüyor ama oran sabit kalıyor.
 *
 * İkincisi AYIRICI HALKA YOKTU. Avatarın kendi 1px kenarı yeterli sanılmıştı
 * ve değildi: iki karo bitişince o kenarlar tek bir çizgi oluyor, ve
 * hangisinin önde olduğu okunmuyor. Üstteki karonun etrafına ARKA PLAN
 * RENGİNDE bir halka koyunca, üstteki alttakini gerçekten kesiyor.
 *
 * `surface` bu yüzden bir prop: halka, yığının ÜSTÜNDE DURDUĞU zeminin rengi
 * olmalı. Varsayılan kart zemini (`--color-shell`), çünkü bir ekip listesi
 * neredeyse her zaman bir kartın içindedir — ama sayfa zemininde duracaksa
 * çağıran onu söyler. Bulanıklık yok: `0 0 0` yayılımsız bir halka, gölge
 * değil.
 */
export function AvatarStack({
  names,
  extra,
  size = 24,
  surface = "var(--color-shell)",
}: {
  names: string[];
  extra?: number;
  size?: number;
  /**
   * The colour of the ground behind the stack; the separating ring is drawn in it. TR: Yığının
   * arkasındaki zeminin rengi; ayırıcı halka bu renkte çizilir.
   */
  surface?: string;
}) {
  const overlap = Math.round(size / 4);
  const ring = { boxShadow: `0 0 0 2px ${surface}` };
  /* Karoların kendi baş harfleri `aria-hidden` — üst üste binmiş harfler ekran
     okuyucuda anlamsız bir dizi olurdu. Adlar bir kez, düz metin olarak
     veriliyor: "Berika Sultan, Deniz Kara ve 7 kişi daha". */
  const spoken = [...names, extra ? `+${extra}` : null].filter(Boolean).join(", ");
  return (
    <div className="flex items-center" role="img" aria-label={spoken}>
      {names.map((n, i) => (
        <span
          key={n + i}
          className="rounded-[var(--radius-mark)]"
          style={{ marginLeft: i === 0 ? 0 : -overlap, ...ring }}
        >
          <Avatar name={n} size={size} letters={1} />
        </span>
      ))}
      {extra ? (
        <span
          className="inline-flex items-center justify-center rounded-[var(--radius-mark)] border border-edge bg-shell font-mono text-caption font-bold text-ink"
          style={{ width: size, height: size, marginLeft: -overlap, ...ring }}
        >
          +{extra}
        </span>
      ) : null}
    </div>
  );
}
