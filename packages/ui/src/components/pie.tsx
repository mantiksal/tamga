"use client";

import { useId, useState } from "react";
import { cn } from "../lib/cn.js";

/**
 * Pasta / halka grafik — PARÇA-BÜTÜN, ve yalnız o.
 *
 * Gerekçe: docs/gerekce/03-grafik-ve-olcum.md
 */

export type PieSlice = {
  label: string;
  value: number;
};

const R = 100;

/** Kutup koordinatından kartezyene; 0° saat 12 yönü. */
function nokta(aci: number, yaricap: number) {
  const rad = ((aci - 90) * Math.PI) / 180;
  return [R + yaricap * Math.cos(rad), R + yaricap * Math.sin(rad)] as const;
}

export function PieChart({
  slices,
  total,
  totalLabel,
  formatValue = String,
  inner = 0.58,
  size = 200,
  className,
}: {
  /**
   * Five slices at most: more does not read, and a chart that does not read is wrong
   * information. TR: En çok beş dilim: fazlası okunmuyor, ve okunmayan bir grafik yanlış
   * bilgidir.
   */
  slices: readonly PieSlice[];
  /**
   * The denominator. Left out, the sum of the slices; but it MUST be givable, because the
   * slices do not always cover the whole: if a query leaves out customers with no gender, the
   * percentages are percentages of that smaller set, and only the caller knows it. TR: Payda.
   * Verilmezse dilimlerin toplamı; ama VERİLEBİLMESİ şart, çünkü dilimler her zaman bütünü
   * kapsamıyor: bir sorgu cinsiyeti boş olan müşterileri dışarıda bırakıyorsa yüzdeler o eksik
   * kümenin yüzdesidir ve bunu ancak çağıran bilir.
   */
  total?: number;
  /**
   * The name of the total in the middle of the ring: "members", "orders". TR: Halkanın
   * ortasındaki toplamın adı: "üye", "sipariş".
   */
  totalLabel?: string;
  formatValue?: (v: number) => string;
  /**
   * 0 a full pie, between 0 and 1 the ring's thickness. TR: 0 tam pasta, 0 ile 1 arası halka
   * kalınlığı.
   */
  inner?: number;
  size?: number;
  className?: string;
}) {
  const id = useId();
  /* Üzerinde durulan dilimin indeksi. Grafik ile legend AYNI durumu paylaşıyor:
     legend satırına gelmek dilimi, dilime gelmek legend satırını vurguluyor.
     İkisi ayrı olsaydı kullanıcı hangi satırın hangi dilim olduğunu yine gözle
     eşleştirmek zorunda kalırdı, ki bu tam da legend'ın çözdüğü sorun. */
  const [uzerinde, setUzerinde] = useState<number | null>(null);
  const toplam = total ?? slices.reduce((n, s) => n + s.value, 0);
  const ic = R * inner;

  let aci = 0;
  const parcalar = slices.map((s, i) => {
    const pay = toplam > 0 ? s.value / toplam : 0;
    const bas = aci;
    const son = aci + pay * 360;
    aci = son;
    return { ...s, pay, bas, son, renk: `var(--color-chart-${(i % 5) + 1})` };
  });

  return (
    <div className={cn("flex flex-wrap items-center gap-6", className)}>
      <svg
        /* `viewBox` dilimin dışarı taşan halini de kapsıyor: üzerine gelinen
           dilim 6 birim dışarı kayıyor, ve kutu büyümezse kırpılıyor. */
        viewBox={`-8 -8 ${R * 2 + 16} ${R * 2 + 16}`}
        width={size}
        height={size}
        className="shrink-0 overflow-visible"
        role="img"
        aria-labelledby={id}
        onMouseLeave={() => setUzerinde(null)}
      >
        {/* Ekran okuyucu için dilimler METİN olarak da var: bir daire
            parçasının `d` niteliği kimseye bir şey anlatmıyor. */}
        <title id={id}>
          {parcalar
            .map((p) => `${p.label}: ${formatValue(p.value)} (%${(p.pay * 100).toFixed(1)})`)
            .join(", ")}
        </title>
        {parcalar.map((p, i) => {
          if (p.pay <= 0) return null;
          /* TEK DİLİM %100 İSE YAY ÇİZİLEMEZ: başlangıç ve bitiş noktası
             çakışır ve `A` komutu hiçbir şey çizmez. Tam daire ayrı bir yol. */
          if (p.pay >= 0.999) {
            return (
              <g key={p.label}>
                <circle cx={R} cy={R} r={R} fill={p.renk} />
                {ic > 0 && <circle cx={R} cy={R} r={ic} fill="var(--color-shell)" />}
              </g>
            );
          }
          const [x1, y1] = nokta(p.bas, R);
          const [x2, y2] = nokta(p.son, R);
          const [x3, y3] = nokta(p.son, ic);
          const [x4, y4] = nokta(p.bas, ic);
          const buyuk = p.son - p.bas > 180 ? 1 : 0;
          const d =
            ic > 0
              ? `M ${x1} ${y1} A ${R} ${R} 0 ${buyuk} 1 ${x2} ${y2} L ${x3} ${y3} A ${ic} ${ic} 0 ${buyuk} 0 ${x4} ${y4} Z`
              : `M ${R} ${R} L ${x1} ${y1} A ${R} ${R} 0 ${buyuk} 1 ${x2} ${y2} Z`;
          /* ÜZERİNE GELİNEN DİLİM DIŞARI KAYIYOR, büyümüyor.
             Büyütmek dilimin AÇISINI değiştirmiyor ama gözde öyle bir izlenim
             bırakıyor: bir oran grafiğinde en son isteyeceğin şey. Merkezden
             dışarı kaydırmak açıyı da yarıçapı da koruyor. */
          const orta = (p.bas + p.son) / 2;
          const [kx, ky] = nokta(orta, 6);
          const secili = uzerinde === i;
          return (
            <path
              key={p.label}
              d={d}
              fill={p.renk}
              /* Dilimler arasındaki ince ayraç zemin renginde: iki komşu
                 dilim aynı tonda olsa bile sınır görünüyor. */
              stroke="var(--color-shell)"
              strokeWidth={2}
              style={{
                transform: secili ? `translate(${kx - R}px, ${ky - R}px)` : undefined,
                /* Öteki dilimler soluyor: vurgulanan şey parlamıyor, çevresi
                   çekiliyor. Rengi açmak paleti bozardı. */
                opacity: uzerinde === null || secili ? 1 : 0.45,
                transition: "opacity var(--duration-press) var(--ease-standard), transform var(--duration-press) var(--ease-standard)",
              }}
              onMouseEnter={() => setUzerinde(i)}
            />
          );
        })}
        {/* ORTADAKİ SAYI ÜZERİNE GELİNCE O DİLİME DÖNÜŞÜYOR.
            Halkanın ortası zaten "payda" için ayrılmış bir yer; bir dilimin
            üzerindeyken orada toplamı göstermeye devam etmek, o boşluğu boşa
            harcamak olurdu. Ayrı bir tooltip kutusu da gerekmiyor: sayı zaten
            gözün baktığı yerde. */}
        {ic > 0 && toplam > 0 && (
          <>
            <text
              x={R}
              y={R - 4}
              textAnchor="middle"
              className="fill-[var(--color-ink)] font-semibold"
              style={{ fontSize: 26 }}
            >
              {uzerinde === null
                ? formatValue(toplam)
                : formatValue(parcalar[uzerinde]?.value ?? 0)}
            </text>
            <text
              x={R}
              y={R + 20}
              textAnchor="middle"
              className="fill-[var(--color-ink-faint)]"
              style={{ fontSize: 14 }}
            >
              {uzerinde === null
                ? (totalLabel ?? "")
                : `${parcalar[uzerinde]?.label} · %${((parcalar[uzerinde]?.pay ?? 0) * 100).toFixed(1)}`}
            </text>
          </>
        )}
      </svg>

      {/* LEGEND DİLİMİN ÜSTÜNE YAZILAN ETİKETİN YERİNE GEÇİYOR.
          Eski ekran etiketleri dilimlerin dışına, uzun kılavuz çizgileriyle
          koyuyor; küçük dilimlerde çizgiler grafiğin üstünden geçip
          birbirini kesiyor. Legend'da her satır aynı hizada ve sayı da
          yüzde de yanında. */}
      <dl className="min-w-0 flex-1 flex-col gap-2">
        {parcalar.map((p, i) => (
          <div
            key={p.label}
            className="flex cursor-default items-baseline gap-2.5 rounded-(--radius-mark) px-1.5 py-1 transition-[background] duration-(--duration-press)"
            style={{
              background: uzerinde === i ? "var(--color-hover)" : undefined,
              opacity: uzerinde === null || uzerinde === i ? 1 : 0.5,
            }}
            onMouseEnter={() => setUzerinde(i)}
            onMouseLeave={() => setUzerinde(null)}
          >
            <span
              aria-hidden
              className="size-2.5 shrink-0 translate-y-px rounded-(--radius-mark)"
              style={{ background: p.renk }}
            />
            <dt className="min-w-0 flex-1 truncate text-ink">{p.label}</dt>
            <dd className="shrink-0 tabular-nums text-ink">
              {formatValue(p.value)}
              <span className="ml-1.5 text-ink-faint">%{(p.pay * 100).toFixed(1)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
