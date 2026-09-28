import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import type { Tone } from "./tone.js";
import { toneOf } from "./tone.js";
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
  look = "solid",
  letters = 2,
  status,
  ...rest
}: {
  name: string;
  size?: number;
  /**
   * The photo. Without it the tile carries initials; a photo that FAILS to load is the
   * browser's broken-image mark, not the initials. TR: Fotoğraf. Yoksa karo baş harfleri
   * taşıyor; yüklenEMEyen bir fotoğrafta baş harfler değil tarayıcının kırık görsel işareti
   * kalıyor.
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
   * `solid` the accent tile with light initials, `soft` the light tile with dark ones. Two, not
   * a palette: an avatar is not a status, and a wall of differently coloured tiles reads as a
   * legend nobody wrote. TR: `solid` vurgu karosu ve açık baş harfler, `soft` açık karo ve koyu
   * harfler. İki tane, bir palet değil: avatar bir durum değil, ve farklı renkli karolardan
   * oluşan bir duvar, kimsenin yazmadığı bir lejant gibi okunuyor.
   */
  look?: "solid" | "soft";
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
  /**
   * A presence mark on the tile's bottom-right corner, in the tone's own colour. It is the ONE
   * place colour is allowed on an avatar: the tile stays monochrome because identity is text,
   * and this square is not identity but health. Absent by default · a mark on every avatar is
   * a legend nobody wrote. TR: Karonun sağ alt köşesinde, tonun kendi rengiyle bir varlık
   * işareti. Avatarda rengin izinli olduğu TEK yer: kimlik metin olduğu için karo tek renkli
   * kalıyor, ve bu kare kimlik değil sağlık. Varsayılanı yok · her avatarda duran bir işaret,
   * kimsenin yazmadığı bir lejant olurdu.
   */
  status?: Tone;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  /* KÖŞE ÖLÇÜYLE BÜYÜYOR (4 · 5 · 7 · 8): 24 pikselde 8'lik bir köşe kareyi
     daire yapıyor, 56'da 4'lük bir köşe onu keskin bırakıyor. */
  const kose = size <= 28 ? "var(--radius-chip)" : size <= 36 ? "calc(var(--radius) - 1px)" : size <= 44 ? "var(--radius-btn)" : "var(--radius-card)";
  /* TABAN YALNIZ BÜYÜKLERDE: 24 piksellik bir karo bir satırın içinde duruyor
     ve orada bir taban, satırı kalabalıklaştırıyor. */
  const taban = size >= 56 ? "4px 4px 0 var(--color-edge-strong)" : size >= 40 ? "3px 3px 0 var(--color-edge-strong)" : undefined;

  const box = {
    width: size,
    height: size,
    borderRadius: bare ? undefined : kose,
    boxShadow: bare ? undefined : taban,
    /* 0.42, not 0.34: at the old ratio a 26px avatar produced 9px initials, which read as a
       smudge next to a 16px icon glyph. Initials ARE the glyph when an avatar sits in a control. */
    fontSize: Math.max(11, Math.round(size * 0.42)),
  };
  /* DURUM İŞARETİ KARONUN DIŞINA TAŞIYOR, ve bu yüzden saran bir kutu gerekiyor:
     karonun kendisi `overflow`u kırpabilen bir `img` olabiliyor. */
  if (status) {
    const t = toneOf(status);
    const mark = Math.max(8, Math.round(size * 0.3));
    return (
      <span className="relative inline-flex shrink-0">
        <Avatar name={name} size={size} src={src} bare={bare} look={look} letters={letters} {...rest} />
        <span
          className="absolute rounded-[var(--radius-mark)]"
          style={{
            right: -mark / 3,
            bottom: -mark / 3,
            width: mark,
            height: mark,
            background: t.mark,
            /* Halka zemin renginde: onsuz işaret karonun kenarına yapışıp
               kenarın bir parçası gibi okunuyor. */
            boxShadow: "0 0 0 2px var(--color-shell)",
          }}
          aria-hidden
        />
      </span>
    );
  }

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- avatars come from arbitrary remote hosts; the optimiser would need every one allow-listed
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={cn("shrink-0 object-cover", !bare && "tamga-avatar")}
        style={box}
      />
    );
  }
  return (
    <span
{...dataProps(rest)}
      className={cn(
        /* ÇIPLAK AVATAR RENGİNİ DE AĞIRLIĞINI DA MİRAS ALIYOR, ve önceden
           `text-ink font-semibold` basıyordu. Çıplak olmasının anlamı kendi
           zemini olmaması · yani üstünde durduğu şeyin rengini bilmiyor, ve
           mürekkebi sabitlemek onu renkli bir zeminde okunmaz yapıyordu. */
        "inline-flex shrink-0 items-center justify-center",
        !bare && "tamga-avatar font-display font-extrabold",
      )}
      data-look={bare ? undefined : look}
      style={box}
      aria-hidden
    >
      {initials(name, letters)}
    </span>
  );
}

/**
 * Üst üste binen ekip · örtüşme boyuna ORANLI (dörtte bir), ve üstteki karonun
 * etrafında arka plan renginde bir AYIRICI HALKA var: onsuz bitişen 1px kenarlar
 * tek çizgi oluyor. `surface` bu yüzden prop, halka zeminin rengi olmalı.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
export function AvatarStack({
  names,
  extra,
  size = 24,
  surface = "var(--color-shell)",
  ...rest
}: {
  names: string[];
  extra?: number;
  size?: number;
  /**
   * The colour of the ground behind the stack; the separating ring is drawn in it. TR: Yığının
   * arkasındaki zeminin rengi; ayırıcı halka bu renkte çizilir.
   */
  surface?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const overlap = Math.round(size / 4);
  const ring = { boxShadow: `0 0 0 2px ${surface}` };
  /* Karoların kendi baş harfleri `aria-hidden` — üst üste binmiş harfler ekran
     okuyucuda anlamsız bir dizi olurdu. Adlar bir kez, düz metin olarak
     veriliyor: "Berika Sultan, Deniz Kara ve 7 kişi daha". */
  const spoken = [...names, extra ? `+${extra}` : null].filter(Boolean).join(", ");
  return (
    <div {...dataProps(rest)} className="flex items-center" role="img" aria-label={spoken}>
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
        /* ARTAKALAN KARO YÜKSELİYOR, ötekiler yükselmiyor: yığının sonunda
           duran ve bir SAYI taşıyan bu karo bir kişi değil bir özet · tabanı
           onu yüzlerin dizisinden ayırıyor. */
        <span
          className="inline-flex items-center justify-center rounded-[var(--radius-mark)] border-[1.5px] border-edge-strong bg-shell font-mono text-caption font-bold text-ink"
          style={{
            width: size,
            height: size,
            marginLeft: -overlap,
            /* Taban komşularıyla AYNI renkte: avatar karoları `--color-edge-strong`
               ile yükseliyor, özet karosu soluk bir gölgeyle onların arasında
               başka bir malzemeden yapılmış gibi duruyordu. */
            boxShadow: `0 0 0 2px ${surface}, 3px 3px 0 var(--color-edge-strong)`,
          }}
        >
          +{extra}
        </span>
      ) : null}
    </div>
  );
}
