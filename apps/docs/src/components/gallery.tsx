"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button, Dialog, Icon, Label } from "tamga-ui";
import { Check, Copy } from "tamga-ui/icons";
import type { Locale as Dil } from "@/i18n/config";

/**
 * GALERİ — bloklar ve şablonlar aynı iskeleti kullanıyor.
 *
 * ÖNCEKİ HÂLİ DÜZ AKIŞTI: başlık, paragraf, canlı örnek, başlık, paragraf.
 * Sayfayı açan kişi "ne var ne yok" sorusunun cevabını ancak sonuna kadar
 * kaydırarak alıyordu. Kart ızgarası o soruyu ilk ekranda cevaplıyor.
 *
 * KART BİR DÜĞME, içinde bir "aç" bağlantısı değil: tıklanacak şey
 * önizlemenin kendisi, ve küçük bir bağlantı hedefi 190 pikselden 12 piksele
 * indirirdi.
 *
 * ÖNİZLEME KIRPILIYOR, ÖLÇEKLENMİYOR. `transform: scale` metni okunmaz yapıyor
 * ve tıklama hedeflerini kaydırıyor. Kırpmak dürüst: üstteki bölge gerçek
 * boyutunda görünüyor, gerisi için kartı açıyorsun.
 *
 * ÖNİZLEME DE CANLI, resim değil. Kartın içindeki şey ile modalin içindeki şey
 * AYNI bileşen; bir ekran görüntüsü bayatlar, bu bayatlayamaz.
 */

/**
 * İKİ TÜR ÖĞE, ve ayrım okuyucu için önemli:
 *
 *   paket  `tamga-ui`den import ediyorsun. API yüzeyi, sürümle geliyor, bir
 *          hata düzeltilince sana da geliyor.
 *   tarif  Kitin bileşenlerinden kurulmuş hazır bir bölüm. Kopyalıyorsun ve
 *          SENİN oluyor: değiştirmekte özgürsün, ama düzeltmeler de gelmiyor.
 *
 * Tarifler bir soyutlama değil bir BELGELEME. O yüzden "üç kere kuralı" onlara
 * işlemiyor: kimseyi bir API'ye bağlamıyorlar.
 */
export type OgeTuru = "paket" | "tarif";

/** Kataloğun kendi metni de çevriliyor; `ornek` bu yüzden dili alan bir fonksiyon. */
export type Metin = { tr: string; en: string };

export type GaleriOgesi = {
  key: string;
  /** Kategori adı; çipler ve bölüm başlıkları buradan türüyor. */
  grup: Metin;
  tur: OgeTuru;
  ad: Metin;
  aciklama: Metin;
  /**
   * BLOK MU EKRAN MI. Bir blok tek bir bölge, 190 pikselde tanınıyor. Bir
   * şablon bir EKRAN: aynı kuyuda yalnız başlık şeridi görünüyordu ve kart
   * "ne var ne yok" sorusunu cevaplamıyordu. Ekran kartı daha derin, ve
   * modalde `h-dvh` taşıyan şablonlar sınırlı bir çerçeveye oturuyor.
   */
  boy?: "blok" | "ekran";
  /**
   * Modalin çerçevesi. Varsayılan olarak bir ekran kendi ince çizgisini alıyor;
   * `"yok"` içeriğin ÇERÇEVEYİ KENDİ TAŞIDIĞINI söylüyor. "Dört durum" tam bu:
   * içinde zaten dört çerçeveli ekran var, ve dışına bir çerçeve daha çizmek
   * kart içinde kart üretiyordu — dört küçük ekran büyük bir kartın kenarına
   * yapışıyor, alttaki ikisi de kırpılıyordu.
   */
  tamCerceve?: "ekran" | "yok";
  /** Hem kartta hem modalde çizilen şey. */
  ornek: (lang: Dil) => ReactNode;
  /** Modal içeriği farklıysa (daha uzun bir hâli); yoksa `ornek` kullanılıyor. */
  tam?: (lang: Dil) => ReactNode;
  /**
   * Kopyalanacak işaretleme. ELLE YAZILIYOR ve bu bilinçli: React ağacından
   * kaynak üretmek mümkün ama çıkan şey okunacak bir örnek değil bir döküm
   * olur (her prop, her sarmalayıcı). Örnek insanın kopyalayacağı şeydir.
   */
  kod?: string;
};

/**
 * Ekran sahnesinin genişliği. Önizleme GERÇEK bir ekran genişliğinde çiziliyor,
 * sonra kartın kuyusuna sığacak kadar küçültülüyor.
 */
const SAHNE_EN = 1080;

/**
 * Kuyu ile sahne arasındaki oran, ÖLÇÜLEREK.
 *
 * Sabit bir `scale()` denendi ve yanlıştı: kartın genişliği ekranla değişiyor
 * (iki sütunlu ızgarada ölçülen 352 piksel, varsayılan 259'du) ve sahne kuyuyu
 * doldurmayınca sağda gri bir şerit kalıyordu. CSS'te oran kurulamıyor, çünkü
 * `calc()` iki uzunluğu bölüp birimsiz bir sayı vermiyor.
 */
function useSahneOlcegi() {
  const kok = useRef<HTMLDivElement>(null);
  const [olcek, setOlcek] = useState<number | null>(null);
  useEffect(() => {
    const kuyu = kok.current?.querySelector<HTMLElement>('.galeri-onizleme[data-boy="ekran"]');
    if (!kuyu) return;
    const olc = () => setOlcek(kuyu.clientWidth / SAHNE_EN);
    olc();
    const gozlemci = new ResizeObserver(olc);
    gozlemci.observe(kuyu);
    return () => gozlemci.disconnect();
  }, []);
  return { kok, olcek };
}

export function Galeri({
  ogeler,
  lang,
  labels,
}: {
  ogeler: GaleriOgesi[];
  lang: Dil;
  labels: {
    hepsi: string;
    kapat: string;
    sayac: (n: number) => string;
    paket: string;
    tarif: string;
    kopyala: string;
    kopyalandi: string;
  };
}) {
  const { kok, olcek } = useSahneOlcegi();
  const [suzgec, setSuzgec] = useState<string | null>(null);
  const [acik, setAcik] = useState<GaleriOgesi | null>(null);
  const [kopyalandi, setKopyalandi] = useState(false);

  /* Grup ANAHTARI dilden bağımsız (Türkçe ad), etiketi dile bağlı: dil
     değiştiğinde seçili çip kaybolmuyor. */
  const gruplar = useMemo(() => {
    const sira: Metin[] = [];
    for (const o of ogeler) if (!sira.some((g) => g.tr === o.grup.tr)) sira.push(o.grup);
    return sira;
  }, [ogeler]);

  const gorunen = suzgec ? ogeler.filter((o) => o.grup.tr === suzgec) : ogeler;

  return (
    <div
      ref={kok}
      className="my-6 flex flex-col gap-10"
      style={olcek ? ({ ["--galeri-olcek" as string]: String(olcek) } as React.CSSProperties) : undefined}
    >
      {/* ÇİPLER, açılır liste değil: seçenek sayısı az ve hepsi bir bakışta
          görünmeli. Bir açılır liste, "ne var ne yok" sorusunu tekrar
          gizlerdi. */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="galeri-cip"
          data-active={suzgec === null}
          onClick={() => setSuzgec(null)}
        >
          {labels.hepsi}
        </button>
        {gruplar.map((g) => (
          <button
            key={g.tr}
            type="button"
            className="galeri-cip"
            data-active={suzgec === g.tr}
            onClick={() => setSuzgec(g.tr)}
          >
            {g[lang]}
          </button>
        ))}
        <Label className="ml-auto">{labels.sayac(gorunen.length)}</Label>
      </div>

      {gruplar
        .filter((g) => gorunen.some((o) => o.grup.tr === g.tr))
        .map((g) => (
          <section key={g.tr} className="flex flex-col gap-4">
            <h2 className="docs-h2 !mt-0" id={g.tr.toLocaleLowerCase("tr").replace(/\s+/g, "-")}>
              {g[lang]}
            </h2>
            <div className="galeri-izgara">
              {gorunen
                .filter((o) => o.grup.tr === g.tr)
                .map((o) => (
                  /* KART BİR `div`, `button` DEĞİL. Önizlemenin içinde de
                     düğmeler var ve `<button>` içinde `<button>` geçersiz
                     HTML: tarayıcı içtekini dışarı çıkarıyor, sunucu ile
                     istemcinin ağaçları ayrışıyor, hidrasyon patlıyor.
                     Tıklama alanı yine kartın tamamı, ama "gerilmiş düğme"
                     ile: ayaktaki düğmenin `::after`ı kartı kaplıyor. */
                  <div key={o.key} className="galeri-kart">
                    {/* `pointer-events-none`: önizlemedeki kontroller tıklamayı
                        yutmasın. Kartın işi açmak; örnekle oynamak modalde. */}
                    {/* `dvh` KUYUYA SIĞDIRILIYOR. Oturum ve kamusal şablonlar
                        içeriğini `min-h-dvh` içinde DİKEY ORTALIYOR: 300
                        piksellik kuyuda ortası ekranın çok altında kalıyordu ve
                        kart bomboş görünüyordu. Yüksekliği kuyuya bağlayınca
                        ortalama da kuyunun ortası oluyor. */}
                    <span
                      className={`galeri-onizleme docs-kit pointer-events-none block${
                        o.boy === "ekran"
                          ? " [&_[class*='min-h-dvh']]:min-h-full [&_[class*='h-dvh']]:h-full"
                          : ""
                      }`}
                      data-boy={o.boy ?? "blok"}
                    >
                      {/* Sahne gerçek ekran genişliğinde; kart onu kırpıyor.
                          Dar bir kutuda küçültülen bir ekran parçası, bloğu
                          tanıtmıyor bozuk gösteriyor. */}
                      <span className="galeri-sahne">{o.ornek(lang)}</span>
                    </span>
                    <span className="galeri-ayak">
                      <span className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          className="galeri-ac text-left text-subhead font-semibold text-ink"
                          onClick={() => setAcik(o)}
                        >
                          {o.ad[lang]}
                        </button>
                        {/* Rozet: paketten mi geliyor, kopyalanacak bir tarif
                            mi. Okuyucunun ilk sorusu bu, o yüzden adın
                            yanında. */}
                        <span className="galeri-rozet" data-tur={o.tur}>
                          {o.tur === "paket" ? labels.paket : labels.tarif}
                        </span>
                      </span>
                      <span className="text-small leading-relaxed text-ink-soft">
                        {o.aciklama[lang]}
                      </span>
                    </span>
                  </div>
                ))}
            </div>
          </section>
        ))}

      {/* MODAL CANLI VE TIKLANABİLİR: kartta oynayamadığın şeyle burada
          oynuyorsun. Bir ekran görüntüsü açan galeri, galeri değil katalog. */}
      <Dialog
        open={acik !== null}
        onClose={() => setAcik(null)}
        title={acik ? acik.ad[lang] : ""}
        closeLabel={labels.kapat}
        size="wide"
      >
        {acik && (
          <div className="flex flex-col gap-4">
            <p className="text-ink-soft">{acik.aciklama[lang]}</p>
            {/* EKRAN SINIRLI BİR ÇERÇEVEDE: şablonların bir kısmı `h-dvh`
                taşıyor ve diyaloğun içinde sayfayı taşırıyordu. Kırpmak
                ölçeklemekten dürüst: metin gerçek boyunda kalıyor.

                ÇERÇEVE BİR KART DEĞİL TEK ÇİZGİ. Önce `tamga-card`dı ve
                uygulamanın kendi yüzeyiyle üst üste biniyordu: diyaloğun
                kenarı, kartın kenarı, kabuğun yüzeyi — altmış piksel içinde üç
                eş merkezli çizgi. Bir ekran görüntüsünün çerçevesi yükselmez,
                yalnız nerede bittiğini söyler. */}
            <div
              className={
                acik.boy === "ekran" && acik.tamCerceve !== "yok"
                  ? "docs-kit galeri-ekran [&_[class*='min-h-dvh']]:min-h-full [&_[class*='h-dvh']]:h-full"
                  : "docs-kit"
              }
            >
              {(acik.tam ?? acik.ornek)(lang)}
            </div>
            {acik.kod && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard?.writeText(acik.kod ?? "");
                      setKopyalandi(true);
                      window.setTimeout(() => setKopyalandi(false), 1400);
                    }}
                  >
                    <Icon icon={kopyalandi ? Check : Copy} size="xs" />
                    {kopyalandi ? labels.kopyalandi : labels.kopyala}
                  </Button>
                </div>
                <pre className="docs-code">{acik.kod}</pre>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
