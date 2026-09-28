"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import { Upload, Close, CaretLeft, CaretRight, Image as ImageGlyph, Success, Failure, Delete } from "./icons.js";
import { toneOf } from "./tone.js";

/**
 * FileUpload — ürün görselleri.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */

/**
 * Yüklenmekte olan ya da yüklenmiş bir DOSYA · ızgaradaki görselden ayrı.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */
export type UploadFile = {
  id: string;
  name: string;
  /**
   * 0-100 while the file is still going up. Given, the row carries a bar and the percentage.
   * TR: Dosya hâlâ giderken 0-100. Verilirse satır bir çubuk ve yüzde taşıyor.
   */
  progress?: number;
  /**
   * The finished file's size, written by the caller ("1,8 MB"): the kit formats no bytes, because
   * the unit and the separator are a locale. TR: Biten dosyanın boyutu, çağıranın yazdığı gibi
   * ("1,8 MB"): kit bayt biçimlemiyor, çünkü birim de ayraç da bir yerel.
   */
  size?: string;
  /**
   * What went wrong, in the caller's words. Given, the row turns critical · and the reason sits
   * NEXT TO the file name rather than under it: a list of failures reads as a list, not as three
   * paragraphs. TR: Neyin ters gittiği, çağıranın sözcükleriyle. Verilirse satır kritik oluyor ·
   * ve sebep dosya adının ALTINDA değil YANINDA: arka arkaya gelen hatalar bir liste olarak
   * okunmalı, üç paragraf olarak değil.
   */
  error?: string;
} & Record<string, unknown>;

export type UploadItem = {
  id: string;
  /**
   * The preview address: `URL.createObjectURL(file)` or a URL from the server. TR: Önizleme
   * adresi: `URL.createObjectURL(file)` ya da sunucudan gelen URL.
   */
  url: string;
  name: string;
} & Record<string, unknown>;

export function FileUpload({
  items,
  files,
  onAdd,
  onRemove,
  onReorder,
  accept = "image/*",
  multiple = true,
  disabled = false,
  labels,
  className,
  ...rest
}: {
  items: readonly UploadItem[];
  /**
   * The file ROWS under the well: what is going up right now, what arrived, what was refused.
   * They are not the image grid · a row is a transfer, a tile is a product image, and the two
   * answer different questions. TR: Kuyunun altındaki dosya SATIRLARI: şu anda ne gidiyor, ne
   * geldi, ne reddedildi. Izgaradan ayrı · satır bir aktarım, karo bir ürün görseli.
   */
  files?: readonly UploadFile[];
  onAdd?: (files: File[]) => void;
  onRemove?: (id: string) => void;
  /**
   * Places the dragged or stepped item at `target` in the list. TR: Sürüklenen ya da okla
   * taşınan ögeyi listenin `hedef` sırasına koyar.
   */
  onReorder?: (id: string, hedef: number) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  labels: {
    drop: string;
    browse: string;
    /** The quiet line under the sentence: "PNG, JPG · max 10 MB". TR: Cümlenin altındaki sessiz satır. */
    hint?: string;
    /** The button that stops a transfer in flight. TR: Süren bir aktarımı durduran düğme. */
    cancel?: string;
    remove: string;
    moveLeft: string;
    moveRight: string;
    /** The badge the first image carries: "kapak", "cover" TR: İlk görselin taşıdığı rozet: "kapak", "cover" */
    primary: string;
  };
  className?: string;
  /** `data-*` hooks pass through. TR: `data-*` kancaları geçiyor. */
  [k: `data-${string}`]: unknown;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  /* Sürüklenen ögenin kimliği state'te, `dataTransfer`de değil: Safari
     `dragover` sırasında `getData`yı boş döndürüyor, dolayısıyla bırakma
     hedefini oradan okuyup işaretlemek mümkün değil. */
  const [tasinan, setTasinan] = useState<string | null>(null);
  const [hedef, setHedef] = useState<string | null>(null);

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
    <div {...dataProps(rest)} className={cn("flex flex-col gap-4", className)}>
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
        className="tamga-drop-well flex flex-col items-center gap-3 px-6 py-10 text-center"
      >
        {/* KARO YÜKSELİYOR, ikon çıplak değil: kesik kenarlı bir kuyunun
            ortasındaki çıplak bir glif zemine gömülüyor, karo ona bir nesne
            veriyor · tasarımın kuyusu da böyle. */}
        <span aria-hidden className="tamga-drop-tile">
          <Icon icon={Upload} size="md" weight="bold" />
        </span>
        {/* CÜMLE TEK PARÇA: "…buraya bırak ya da bilgisayardan seç". Seçme
            eylemi cümlenin İÇİNDE bir bağlantı · ayrı bir düğme, aynı şeyi iki
            kez söylüyordu. */}
        <p className="text-body font-bold text-ink">
          {labels.drop}{" "}
          <button
            type="button"
            className="tamga-link"
            disabled={disabled}
            onClick={() => input.current?.click()}
          >
            {labels.browse}
          </button>
        </p>
        {labels.hint ? <p className="text-small text-ink-faint">{labels.hint}</p> : null}
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

      {files?.length ? (
        <ul className="flex flex-col gap-2">
          {files.map(({ id: dosya, name, progress, size, error, ...rest }) => (
            <li key={dosya} {...rest} className="tamga-file-row" data-error={error ? true : undefined}>
              <Icon
                icon={error ? Failure : progress === undefined ? Success : ImageGlyph}
                size="sm"
                weight={progress === undefined ? "fill" : "bold"}
                className="shrink-0"
                style={{ color: error ? toneOf("danger").fg : "var(--color-accent)" }}
              />
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="flex items-center justify-between gap-3 text-small font-semibold">
                  <span className="min-w-0 truncate">
                    {name}
                    {error ? (
                      <span className="font-medium text-ink-faint"> · {error}</span>
                    ) : null}
                  </span>
                  {progress !== undefined ? (
                    <span className="shrink-0 font-mono text-caption tabular-nums text-ink-faint">
                      {progress}%
                    </span>
                  ) : size ? (
                    <span className="shrink-0 font-mono text-caption text-ink-faint">{size}</span>
                  ) : null}
                </span>
                {progress !== undefined ? (
                  <span className="tamga-file-bar">
                    <span style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
                  </span>
                ) : null}
              </span>
              <button
                type="button"
                className="tamga-icon-btn tamga-icon-btn-sm tamga-icon-btn-ghost shrink-0"
                aria-label={
                  progress !== undefined ? (labels.cancel ?? labels.remove) : labels.remove
                }
                onClick={() => onRemove?.(dosya)}
              >
                <Icon icon={progress !== undefined ? Close : Delete} size="xs" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {items.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map(({ id: oge, url, name, ...rest }, i) => (
            <li
              key={oge}
              {...rest}
              draggable={!disabled && items.length > 1}
              onDragStart={(e) => {
                setTasinan(oge);
                /* Firefox bir yük olmadan sürüklemeyi hiç başlatmıyor. */
                e.dataTransfer.setData("text/plain", oge);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragEnd={() => {
                setTasinan(null);
                setHedef(null);
              }}
              onDragOver={(e) => {
                if (!tasinan || tasinan === oge) return;
                /* `preventDefault` olmadan `drop` hiç tetiklenmiyor: tarayıcının
                   varsayılanı "buraya bırakılamaz". */
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setHedef(oge);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (tasinan && tasinan !== oge) onReorder?.(tasinan, i);
                setTasinan(null);
                setHedef(null);
              }}
              data-tasinan={tasinan === oge || undefined}
              data-hedef={hedef === oge || undefined}
              className="tamga-card tamga-tasi relative overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={name} className="aspect-square w-full object-cover" />

              {i === 0 ? (
                <span className="tamga-chip absolute top-1.5 left-1.5">{labels.primary}</span>
              ) : null}

              <span className="tamga-gutter flex items-center gap-1 py-1.5">
                <button
                  type="button"
                  className="tamga-mini-btn"
                  aria-label={labels.moveLeft}
                  disabled={i === 0}
                  onClick={() => onReorder?.(oge, i - 1)}
                >
                  <Icon icon={CaretLeft} size="xs" />
                </button>
                <button
                  type="button"
                  className="tamga-mini-btn"
                  aria-label={labels.moveRight}
                  disabled={i === items.length - 1}
                  onClick={() => onReorder?.(oge, i + 1)}
                >
                  <Icon icon={CaretRight} size="xs" />
                </button>
                <button
                  type="button"
                  className="tamga-mini-btn ml-auto"
                  aria-label={labels.remove}
                  onClick={() => onRemove?.(oge)}
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
