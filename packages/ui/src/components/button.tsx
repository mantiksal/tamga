import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn.js";
import { Spinner } from "./spinner.js";

/**
 * The button family, typed.
 *
 * Gerekçe: docs/gerekce/06-isaret-ve-ton.md
 */

export const buttonVariants = cva("tamga-btn", {
  variants: {
    variant: {
      /* the base button — everything else is this shape plus a colour */
      secondary: "",
      /* the one filled thing on a page */
      primary: "tamga-btn-primary",
      /* BİRİNCİL İLE İKİNCİL ARASINDA BİR BASAMAK: vurgunun açık tonunda dolu.
         "Bunu da yapabilirsin" diyen ama sayfanın tek dolu düğmesiyle
         yarışmayan eylem · bir kartın içindeki ikinci eylem. */
      soft: "tamga-btn-soft",
      /* confirming: status colour as an edge, never a fill */
      success: "tamga-btn-success",
      /* destructive: findable and deliberate, not loud */
      danger: "tamga-btn-danger",
      /* no edge, no offset, no lift — it is not an object on the page */
      ghost: "tamga-btn-ghost",
      /* reads as a link, behaves as a button. For a click that runs code but
         must not compete with the buttons beside it. If it NAVIGATES, use an
         anchor with .tamga-link instead — a fake link cannot be middle-clicked
         and misreports itself to a screen reader. */
      link: "tamga-btn-link",
      /* SESSİZ SATIR EYLEMİ: duruşta yazı, üstüne gelince katmanlı düğme.
         `ghost` ile aynı değil · ghost duruşta da hover'da da bir düğme, yalnız
         kenarsız. Bu ise bir LİSTEDE yaşıyor: otuz satırın her birinde bir
         düğme varsa otuz düğme ekranı yönetiyor ve asıl içerik (kaydın kendisi)
         onların arasında kayboluyor. Sessiz hâlde metin gibi duruyor, imleç
         geldiğinde ne olduğunu söylüyor. */
      quiet: "tamga-btn-quiet",
    },
    size: {
      base: "",
      /* 32px, for card headers and dense toolbars */
      sm: "tamga-btn-sm",
      /* 52px · a screen's ONE action: an empty state's call, a wizard's next */
      lg: "tamga-btn-lg",
    },
    full: { true: "w-full", false: "" },
  },
  defaultVariants: { variant: "secondary", size: "base", full: false },
});

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /**
     * The click is still running. TR: Tıklama hâlâ sürüyor.
     *
     * Sürerken düğme kilitleniyor ve etiketinin yerine bir spinner geçiyor.
     * Bunun düğmenin kendisinde olmasının sebebi ölçülebilir: her çağrı yeri
     * kendi kilidini yazdığında biri unutuluyor, ve unutulan yer çift gönderim
     * demek. Bir kez yazılan bir kural, altmış çağrı yerinde hatırlanan bir
     * kuraldan güvenli.
     */
    busy?: boolean;
    /**
     * What the spinner announces while `busy`. TR: Spinner sürerken ekran
     * okuyucunun söylediği şey.
     *
     * ZORUNLU DEĞİL AMA VARSAYILANI YOK: kit çeviri yapmıyor, ve "Loading"
     * diye İngilizce bir varsayılan her Türkçe panele İngilizce bir cümle
     * gönderirdi. Verilmezse düğmenin kendi metni okunuyor.
     */
    busyLabel?: string;
  };

export function Button({
  className,
  variant,
  size,
  full,
  busy = false,
  busyLabel,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      data-slot="button"
      data-busy={busy || undefined}
      aria-busy={busy || undefined}
      /* Kilit `disabled` ile: sürerken ikinci bir tıklama olayı hiç doğmuyor.
         `pointer-events: none` yetmezdi — klavye Enter'ı yine gönderirdi. */
      disabled={disabled || busy}
      className={cn(buttonVariants({ variant, size, full }), className)}
      {...props}
    >
      {busy ? (
        <>
          <Spinner size={16} label={busyLabel ?? ""} />
          {/* ETİKET KALIYOR ama görünmüyor: düğmenin genişliği sabit kalsın
              diye. Metni kaldırmak düğmeyi büzüyor ve yanındaki her şeyi
              kaydırıyor — tam da bir kaydetme anında. */}
          <span className="invisible" aria-hidden>
            {children}
          </span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

/* --------------------------- icon button -------------------------- */

export const iconButtonVariants = cva("tamga-icon-btn", {
  variants: {
    size: {
      /* 30px · bir tablo satırında, bir çip şeridinde */
      sm: "tamga-icon-btn-sm",
      /* 40px · şeridin ölçüsü: girdi, düğme ve ikon düğmesi aynı satırda */
      base: "",
      /* 50px · tek başına duran bir eylem (boş durum, bir tuvalin köşesi) */
      lg: "tamga-icon-btn-lg",
    },
    variant: {
      secondary: "",
      primary: "tamga-icon-btn-primary",
      soft: "tamga-icon-btn-soft",
      danger: "tamga-icon-btn-danger",
      /* duruşta nesne DEĞİL, üstüne gelince oluyor */
      ghost: "tamga-icon-btn-ghost",
    },
  },
  defaultVariants: { size: "base", variant: "secondary" },
});

/**
 * Kare ikon düğmesi · üç boy, ve köşe boyla birlikte büyüyor.
 *
 * `aria-label` ZORUNLU: okunacak metin yok.
 */
export function IconButton({
  className,
  size,
  variant,
  "aria-label": label,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof iconButtonVariants> & { "aria-label": string }) {
  return (
    <button
      data-slot="icon-button"
      aria-label={label}
      className={cn(iconButtonVariants({ size, variant }), className)}
      {...props}
    />
  );
}

export const miniButtonVariants = cva("tamga-mini-btn", {
  variants: {
    variant: {
      secondary: "",
      primary: "tamga-mini-btn-primary",
      soft: "tamga-mini-btn-soft",
      /* bir satırda üç eylem varsa üçü birden nesne olamaz */
      quiet: "tamga-mini-btn-quiet",
    },
  },
  defaultVariants: { variant: "secondary" },
});

/** Ailenin en sıkı üyesi: 28px, 2px taban, ve hover'da kenarı vurguya dönüyor. */
export function MiniButton({
  className,
  variant,
  "aria-label": label,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof miniButtonVariants> & { "aria-label": string }) {
  return (
    <button
      data-slot="mini-button"
      aria-label={label}
      className={cn(miniButtonVariants({ variant }), className)}
      {...props}
    />
  );
}
