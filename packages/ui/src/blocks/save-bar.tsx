"use client";

import type { ReactNode } from "react";
import { Button } from "../components/button.js";

/**
 * KAYDET ŞERİDİ · kayan yüzeyin dibine yapışık, formun sonunda değil. Fiziği
 * `.tamga-save-bar`ta, ve orada `sticky bottom-0` tuzağı yazılı. Değişiklik
 * yoksa düğme kapalı.
 *
 * Gerekçe: docs/gerekce/08-blok-ve-sablon.md
 */
export function SaveBar({
  changed = true,
  busy = false,
  onCancel,
  extra,
  labels,
}: {
  /** With no change, save is disabled. TR: Değişiklik yoksa kaydet kapalı. */
  changed?: boolean;
  /** Saving is in progress: both buttons are locked and save shows a spinner. TR: Kaydetme sürüyor: iki düğme de kilitli, kaydet spinner gösteriyor. */
  busy?: boolean;
  onCancel?: () => void;
  /** Whatever the screen puts on the right of the bar: a counter, a warning line. TR: Şeridin sağında duran ekrana özel şey: bir sayaç, bir uyarı satırı. */
  extra?: ReactNode;
  labels: { save: string; cancel: string; saving?: string };
}) {
  return (
    <div className="tamga-save-bar" data-changed={changed}>
      <Button
        variant="primary"
        type="submit"
        disabled={!changed}
        busy={busy}
        busyLabel={labels.saving}
      >
        {labels.save}
      </Button>
      <Button type="button" onClick={onCancel} disabled={busy}>
        {labels.cancel}
      </Button>
      {extra && <span className="ml-auto">{extra}</span>}
    </div>
  );
}
