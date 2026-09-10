"use client";

import type { ReactNode } from "react";
import { Button } from "../components/button.js";

/**
 * KAYDET ŞERİDİ: kayan yüzeyin dibine yapışık.
 *
 * NEDEN FORMUN SONUNDA DEĞİL. Eski panellerin alışkanlığı kaydet düğmesini
 * formun en altına koymak; yirmi alanlık bir formda üstteki bir alanı
 * düzeltip kaydetmek için sonuna kadar kaydırmak gerekiyor. Şerit her zaman
 * görünür, ve kaydedilecek bir şey olup olmadığını da söylüyor.
 *
 * FİZİĞİ BİR SINIFTA (`.tamga-save-bar`), ve orada ölçülmüş bir tuzak yazılı:
 * `sticky bottom-0` şeridin alt kenarını yüzeyin İÇERİK kutusuna hizalıyor,
 * ama yüzeyin kendi alt dolgusu var ve içerik o boşluktan akıp geçiyordu.
 *
 * DEĞİŞİKLİK YOKSA KAYDEDİLECEK BİR ŞEY DE YOK: düğme kapalı. Tıklanıp
 * hiçbir şey olmayan bir düğme, olmayan bir düğmeden kötüdür.
 */
export function SaveBar({
  changed = true,
  busy = false,
  onCancel,
  extra,
  labels,
}: {
  /** Değişiklik yoksa kaydet kapalı. */
  changed?: boolean;
  /** Kaydetme sürüyor: iki düğme de kilitli, kaydet spinner gösteriyor. */
  busy?: boolean;
  onCancel?: () => void;
  /** Şeridin sağında duran ekrana özel şey: bir sayaç, bir uyarı satırı. */
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
