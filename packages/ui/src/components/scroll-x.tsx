"use client";

import { useRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { dataProps } from "../lib/data-props.js";
import { Icon } from "./icon.js";
import { CaretLeft, CaretRight } from "./icons.js";

/**
 * Yatay kayan şerit.
 *
 * Gerekçe: docs/gerekce/05-yuzey-ve-kabuk.md
 */
export function ScrollX({
  label,
  title,
  controls,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  label: string;
  /** The strip's own heading, beside the arrows. TR: Şeridin kendi başlığı, okların yanında. */
  title?: ReactNode;
  /**
   * The two arrow buttons, with their accessible names. Each click moves the strip by one
   * visible width, not by one card: a card-sized step needs the strip to know what a card is.
   * TR: İki ok düğmesi ve erişilebilir adları. Her tıklama şeridi BİR GÖRÜNÜR GENİŞLİK
   * kaydırıyor, bir kart değil: kart boyu bir adım, şeridin kartın ne olduğunu bilmesini
   * gerektirir.
   */
  controls?: { left: string; right: string };
}) {
  const ref = useRef<HTMLDivElement>(null);

  function kaydir(yon: -1 | 1) {
    const el = ref.current;
    if (!el) return;
    /* 0.9: bir görünür genişliğin tamamı kaydırılırsa kenardaki kart hiç
       görünmeden geçiyor ve okuyan kişi yerini kaybediyor. */
    el.scrollBy({ left: yon * el.clientWidth * 0.9, behavior: "smooth" });
  }

  const serit = (
    <div
      ref={ref}
      className={cn("tamga-scroll-x", !controls && !title && className)}
      role="region"
      aria-label={label}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );

  if (!controls && !title) return serit;

  return (
    <div {...dataProps(props)} className={cn("flex flex-col gap-3.5", className)}>
      <div className="flex items-center gap-2.5">
        {title ? <span className="min-w-0 flex-1 font-display text-subhead font-extrabold text-ink">{title}</span> : <span className="flex-1" />}
        {controls ? (
          <>
            <button
              type="button"
              className="tamga-icon-btn tamga-icon-btn-sm"
              aria-label={controls.left}
              onClick={() => kaydir(-1)}
            >
              <Icon icon={CaretLeft} size="xs" weight="bold" />
            </button>
            <button
              type="button"
              className="tamga-icon-btn tamga-icon-btn-sm"
              aria-label={controls.right}
              onClick={() => kaydir(1)}
            >
              <Icon icon={CaretRight} size="xs" weight="bold" />
            </button>
          </>
        ) : null}
      </div>
      {serit}
    </div>
  );
}
