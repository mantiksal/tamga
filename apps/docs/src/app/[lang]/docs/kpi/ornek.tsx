"use client";

import { Kpi, KpiGrid, Sparkline } from "tamga-ui";
import { ArrowUUpLeft, Clock, CurrencyDollar, Gavel, Receipt, Undo, Users, Warning } from "tamga-ui/icons";

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

/** Izgaranın karosu: solda ikon kutusu, sayının üstünde etiket. */
export function KaroIzgara({
  revenue,
  orders,
  customers,
  returns,
}: {
  revenue: string;
  orders: string;
  customers: string;
  returns: string;
}) {
  return (
    <KpiGrid className="w-full">
      <Kpi icon={CurrencyDollar} iconTone="info" label={revenue} value="842.350" unit="₺" />
      <Kpi icon={Receipt} iconTone="info" label={orders} value="1.284" />
      <Kpi icon={Users} iconTone="info" label={customers} value="312" />
      {/* Dördüncü karo TONSUZ: kutu şeffaf kalıyor, ve tonun bir ANLAM taşıdığı
          buradan görünüyor · hepsi renkliyse renk hiçbir şey söylemiyor. */}
      <Kpi icon={Undo} label={returns} value="%2,4" />
    </KpiGrid>
  );
}

const EGRI = [42, 38, 45, 51, 47, 60, 58, 66, 61, 72, 68, 80];

/** Ayrıntılı hâl: sayının yanında eğri, altında değişim. */
export function AyrintiliKarolar({
  orders,
  revenue,
  latency,
}: {
  orders: string;
  revenue: string;
  latency: string;
}) {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <Kpi
        look="detail"
        icon={Receipt}
        iconTone="info"
        label={orders}
        value={248}
        delta={12}
        chart={<Sparkline values={EGRI} tone="positive" />}
      />
      <Kpi look="detail" icon={CurrencyDollar} iconTone="info" label={revenue} value="18.420" unit="₺" delta={-4} />
      <Kpi look="detail" icon={Clock} label={latency} value={24} unit="ms" delta={8} better="down" />
    </div>
  );
}
