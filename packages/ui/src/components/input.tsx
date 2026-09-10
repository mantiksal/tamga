import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn.js";

/**
 * Text entry. Flat until focus, then it joins the raised family — an accent
 * edge plus a 2px accent offset.
 */
export const inputVariants = cva("tamga-input", {
  variants: {
    invalid: { true: "tamga-input-invalid", false: "" },
    full: { true: "w-full", false: "" },
    /**
     * `sm` 32px, düğmenin `sm`'iyle aynı basamak — yardımcı bir yüzey için:
     * bir filtre satırı, bir araç çubuğu. Formun kendi alanları `md` kalır.
     */
    size: { md: "", sm: "tamga-input-sm" },
  },
  defaultVariants: { invalid: false, full: false, size: "md" },
});

/**
 * `Textarea` NEDEN AYRI BİR TABLO.
 *
 * İkisi aynı `.tamga-input` sınıfını paylaşıyor ama seçenek kümeleri aynı
 * değil: 32px'lik bir `<textarea>` yok, yüksekliğini `rows` veriyor. Tek tablo
 * kalsaydı `Textarea` hiçbir şey yapmayan bir `size` prop'u kabul ederdi — ve
 * props tablosu KAYNAKTAN üretildiği için doküman da onu var gösterirdi.
 * Olmayan bir seçeneği belgelemek, eksik belgelemekten kötü.
 */
export const textareaVariants = cva("tamga-input", {
  variants: {
    invalid: { true: "tamga-input-invalid", false: "" },
    full: { true: "w-full", false: "" },
  },
  defaultVariants: { invalid: false, full: false },
});

export type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    /**
     * There is an icon absolutely positioned over the left of this field, so reserve room for it.
     * Opt-in on purpose: the padding used to be unconditional and every plain field opened with a
     * 40px hole where nothing was.
     */
    leading?: boolean;
  };

export function Input({ className, invalid, full, size, leading, ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      data-leading={leading || undefined}
      aria-invalid={invalid || undefined}
      className={cn(inputVariants({ invalid, full, size }), className)}
      {...props}
    />
  );
}

export type TextareaProps = React.ComponentProps<"textarea"> &
  VariantProps<typeof textareaVariants>;

export function Textarea({ className, invalid, full, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      aria-invalid={invalid || undefined}
      className={cn(textareaVariants({ invalid, full }), className)}
      {...props}
    />
  );
}
