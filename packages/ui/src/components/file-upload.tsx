"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { cn } from "../lib/cn.js";
import { Icon } from "./icon.js";
import { Upload, Close, CaretLeft, CaretRight } from "./icons.js";

/**
 * FileUpload — ürün görselleri.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

export type UploadItem = {
  id: string;
  /**
   * The preview address: `URL.createObjectURL(file)` or a URL from the server. TR: Önizleme
   * adresi: `URL.createObjectURL(file)` ya da sunucudan gelen URL.
   */
  url: string;
  name: string;
};

export function FileUpload({
  items,
  onAdd,
  onRemove,
  onReorder,
  accept = "image/*",
  multiple = true,
  disabled = false,
  labels,
  className,
}: {
  items: readonly UploadItem[];
  onAdd?: (files: File[]) => void;
  onRemove?: (id: string) => void;
  onReorder?: (id: string, direction: -1 | 1) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  labels: {
    drop: string;
    browse: string;
    remove: string;
    moveLeft: string;
    moveRight: string;
    /** The badge the first image carries: "kapak", "cover" TR: İlk görselin taşıdığı rozet: "kapak", "cover" */
    primary: string;
  };
  className?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  function take(list: FileList | null) {
    if (!list || disabled) return;
    onAdd?.(Array.from(list));
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setOver(false);
    take(e.dataTransfer.files);
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Bırakma alanı: kesikli kenar bu kitte "henüz gerçek içerik değil"
          demektir — burada tam olarak doğru anlam. */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        data-over={over}
        className="tamga-art-well flex flex-col items-center gap-3 px-6 py-10 text-center"
        style={{
          borderStyle: "dashed",
          borderColor: over ? "var(--color-accent-line)" : undefined,
        }}
      >
        <Icon icon={Upload} size="md" className="text-ink-faint" />
        <p className="text-body text-ink-faint">{labels.drop}</p>
        <button
          type="button"
          className="tamga-btn tamga-btn-sm"
          disabled={disabled}
          onClick={() => input.current?.click()}
        >
          {labels.browse}
        </button>
        <input
          ref={input}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => {
            take(e.target.files);
            /* Aynı dosyayı ikinci kez seçebilmek için: aksi hâlde `change`
               tetiklenmez ve kullanıcı "çalışmıyor" der. */
            e.target.value = "";
          }}
        />
      </div>

      {items.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((it, i) => (
            <li key={it.id} className="tamga-card relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.url} alt={it.name} className="aspect-square w-full object-cover" />

              {i === 0 ? (
                <span className="tamga-chip absolute top-1.5 left-1.5">{labels.primary}</span>
              ) : null}

              <span className="tamga-gutter flex items-center gap-1 py-1.5">
                <button
                  type="button"
                  className="tamga-mini-btn"
                  aria-label={labels.moveLeft}
                  disabled={i === 0}
                  onClick={() => onReorder?.(it.id, -1)}
                >
                  <Icon icon={CaretLeft} size="xs" />
                </button>
                <button
                  type="button"
                  className="tamga-mini-btn"
                  aria-label={labels.moveRight}
                  disabled={i === items.length - 1}
                  onClick={() => onReorder?.(it.id, 1)}
                >
                  <Icon icon={CaretRight} size="xs" />
                </button>
                <button
                  type="button"
                  className="tamga-mini-btn ml-auto"
                  aria-label={labels.remove}
                  onClick={() => onRemove?.(it.id)}
                >
                  <Icon icon={Close} size="xs" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
