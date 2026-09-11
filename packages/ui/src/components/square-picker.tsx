"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "./button.js";
import { Dialog } from "./overlay.js";
import { Slider } from "./slider.js";
import { Label } from "./surface.js";
import { cropSquare } from "../lib/image.js";

/**
 * LOGODAN AMBLEM SEÇME — otomatik kesme DEĞİL.
 *
 * Sorulan soru şuydu: yüklenen logoyu ayırıp amblemi kendiliğinden çıkaramaz
 * mıyız? Çıkaramayız, ve denememesi gerekiyor:
 *
 *   · Dosyada "amblem" diye işaretli bir şey yok. SVG'de bazen bir grup id'si
 *     olur ama bu tasarımcının keyfine bağlı; PNG'de hiç yok.
 *   · Konum sabit değil: amblem solda, üstte, sağda olabilir, yazının içine
 *     gömülü olabilir, ya da hiç olmayabilir (yalnız kelime-logo).
 *   · Hata SESSİZ ve KALICI olur. Yanlış kesim patlamaz; yarım bir harf
 *     panelin her sayfasının sol üstünde durur ve kimse bunun otomatik
 *     kesildiğini bilmez.
 *
 * Bu yüzden kesimi İNSAN yapıyor: kare bir çerçeve, sürüklenip boyutlanıyor.
 * Sonuç tahmin değil karar.
 *
 * ÇERÇEVE ORANLA TUTULUYOR (0–1), piksel ile değil: önizleme ekrandan ekrana
 * farklı ölçekte çiziliyor, oran her ölçekte aynı yeri gösteriyor. Ekrana
 * çizilirken piksele dönüyor ve dönüşüm TEK YERDE (`kenarPx`): kesim
 * matematiği ile çerçevenin CSS'i ayrı ayrı hesaplansaydı, kullanıcının
 * gördüğü kare ile kesilen kare farklı olurdu — ve fark sessiz olurdu.
 */
export function SquarePicker({
  open,
  source,
  onClose,
  onPick,
  maxEdge = 256,
  labels,
}: {
  open: boolean;
  /** The image the square is cut out of. TR: Üzerinden kesilecek görsel. */
  source: string;
  onClose: () => void;
  onPick: (square: string) => void;
  /** Edge of the produced square, in pixels. TR: Üretilen karenin kenarı, piksel. */
  maxEdge?: number;
  labels: {
    title: string;
    hint: string;
    size: string;
    cancel: string;
    confirm: string;
    close: string;
  };
}) {
  const sahne = useRef<HTMLDivElement>(null);
  const [olcu, setOlcu] = useState({ en: 0, boy: 0 });
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [oran, setOran] = useState(0.6);
  const [suruyor, setSuruyor] = useState(false);

  /* Her açılışta baştan: bir önceki logonun çerçevesini yeni logoya taşımak,
     kullanıcıya alakasız bir yeri seçtirmenin en kolay yolu. */
  useEffect(() => {
    if (!open) return;
    setX(0);
    setY(0);
    setOran(0.6);
  }, [open, source]);

  /* Sahnenin gerçek boyu ÖLÇÜLÜYOR, tahmin edilmiyor: görsel yüklendikçe ve
     pencere daraldıkça değişiyor, ve çerçevenin pikseli ona bağlı. */
  useLayoutEffect(() => {
    const el = sahne.current;
    if (!el) return;
    const olc = () => setOlcu({ en: el.clientWidth, boy: el.clientHeight });
    olc();
    const gozcu = new ResizeObserver(olc);
    gozcu.observe(el);
    return () => gozcu.disconnect();
  }, [open, source]);

  /* KARE, SAHNENİN KISA KENARINA GÖRE. Bir logo 350×65 ise kare en fazla o 65
     pikselin kadarı olabilir; uzun kenara göre ölçseydik çerçeve görselin
     dışına taşardı. Kesim fonksiyonu da aynı kuralı kullanıyor. */
  const kenarPx = Math.min(olcu.en, olcu.boy) * oran;

  const tasi = useCallback(
    (olay: React.PointerEvent) => {
      const el = sahne.current;
      if (!suruyor || !el) return;
      const k = el.getBoundingClientRect();
      const nx = (olay.clientX - k.left - kenarPx / 2) / k.width;
      const ny = (olay.clientY - k.top - kenarPx / 2) / k.height;
      setX(Math.max(0, Math.min(1 - kenarPx / k.width, nx)));
      setY(Math.max(0, Math.min(1 - kenarPx / k.height, ny)));
    },
    [suruyor, kenarPx],
  );

  async function onayla() {
    onPick(await cropSquare(source, { x, y, size: oran }, maxEdge));
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={labels.title}
      closeLabel={labels.close}
      footer={
        <>
          <Button type="button" onClick={onClose}>
            {labels.cancel}
          </Button>
          <Button variant="primary" type="button" onClick={onayla}>
            {labels.confirm}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Label>{labels.hint}</Label>

        {/* DOLGU DIŞARIDA, SAHNE İÇERİDE. Konumlandırma bağlamı dolgusuz bir
            kutu olmak zorunda: yüzdeler dolgu kutusuna göre çözülüyor ve
            dolgulu bir kapta çerçeve ile görsel bir piksel kayıyor. */}
        <div className="rounded-[var(--radius-card)] border border-[var(--color-edge)] bg-[var(--color-shell)] p-4">
          <div
            ref={sahne}
            onPointerDown={(e) => {
              setSuruyor(true);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={tasi}
            onPointerUp={() => setSuruyor(false)}
            className="relative cursor-crosshair touch-none select-none overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- data URI; `next/image` optimizasyonu geçersiz */}
            <img src={source} alt="" className="pointer-events-none block w-full" draggable={false} />
            <span
              aria-hidden
              className="pointer-events-none absolute border-2 border-[var(--color-accent-line)]"
              style={{
                left: x * olcu.en,
                top: y * olcu.boy,
                width: kenarPx,
                height: kenarPx,
                /* Dışarısı karartılıyor: seçili kare kendi kenarlığından çok
                   çevresinin koyulmasıyla okunuyor. */
                boxShadow: "0 0 0 9999px rgb(0 0 0 / 0.35)",
              }}
            />
          </div>
        </div>

        <Slider
          label={labels.size}
          value={Math.round(oran * 100)}
          onChange={(v) => setOran(v / 100)}
          min={15}
          max={100}
          suffix="%"
        />
      </div>
    </Dialog>
  );
}
