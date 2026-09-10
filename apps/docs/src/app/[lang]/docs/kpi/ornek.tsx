"use client";

import { Kpi, KpiGrid } from "tamga-ui";
import { ArrowUUpLeft, Gavel, Warning } from "tamga-ui/icons";

/**
 * Tıklanabilir karo örneği, istemcide.
 *
 * NEDEN AYRI DOSYA: sayfa bir sunucu bileşeni, `Kpi` bir istemci bileşeni, ve
 * `icon` bir FONKSİYON. Sunucudan istemciye fonksiyon geçirilemiyor ("Functions
 * cannot be passed directly to Client Components"), o yüzden simgeyi seçen kod
 * da istemcide olmak zorunda. Aynı kalıp `list-screen/ornek.tsx`te de var.
 *
 * ÜÇ KARO, DÖRT DEĞİL: doküman gövdesi 544 piksel geniş, ve dörde bölününce
 * her karoya 124 piksel düşüyordu — "Kargoya verilmemiş talep" üç satıra
 * sarıyor, sayı etiketin altında kayboluyordu. Bir örneğin işi bileşeni EN İYİ
 * hâlinde göstermek; sığmayan bir örnek bileşeni kötü gösteriyor.
 *
 * ETİKETLER KISA VE CÜMLESİZ. Karo bir CÜMLE taşımıyor: "Müşteri başvurdu,
 * henüz kimse bakmadı." satırı karonun yarısını kaplıyor ve okunmuyor. Bir
 * panoya bakan kişi cümle okumuyor, sayıya bakıyor.
 *
 * BAĞLANTILAR `#`: doküman sitesinde gidilecek bir iade listesi yok, ve
 * olmayan bir yere giden bir örnek, çalışan bir örnekten kötüdür.
 */
export function CanliKarolar({
  queue,
  action,
  alarm,
}: {
  queue: string;
  action: string;
  alarm: string;
}) {
  return (
    <KpiGrid>
      <Kpi href="#" icon={ArrowUUpLeft} label={queue} value="207" />
      <Kpi href="#" icon={Gavel} label={action} value="95" />
      <Kpi href="#" icon={Warning} label={alarm} value="2" />
    </KpiGrid>
  );
}
