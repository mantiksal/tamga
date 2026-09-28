"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button, Dialog, Icon } from "tamga-ui";
import { CaretLeft, CaretRight, Check, Copy } from "tamga-ui/icons";
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
   * `"yok"` içeriğin ÇERÇEVEYİ KENDİ TAŞIDIĞINI söylüyor · bir kartın içine
   * ikinci bir kart çizmemek için. Bugün kullanan yok, ve olmaması iyi: bir
   * ekran görüntüsünün nerede bittiğini söyleyen çizgi her ekranda aynı olmalı.
   */
  tamCerceve?: "ekran" | "yok";
  /** Hem kartta hem modalde çizilen şey. */
  ornek: (lang: Dil) => ReactNode;
  /** Modal içeriği farklıysa (daha uzun bir hâli); yoksa `ornek` kullanılıyor. */
  tam?: (lang: Dil) => ReactNode;
  /**
   * Bu öğeyi çizen KİT BİLEŞENİNİN adı (`ListTemplate`).
   *
   * Adın kendisi ("Kullanıcılar") ekranın ne olduğunu söylüyor, bu ise hangi
   * şablondan çıktığını · ve okuyucunun aradığı şey çoğu zaman ikincisi:
   * "bu ekranı hangi bileşen veriyor".
   */
  bilesen?: string;
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
    paket: string;
    tarif: string;
    kopyala: string;
    kopyalandi: string;
    /** Pencere şeridi: "3 / 12", önceki, sonraki. */
    sira: (n: number, toplam: number) => string;
    onceki: string;
    sonraki: string;
  };
}) {
  const { kok, olcek } = useSahneOlcegi();
  const [suzgec, setSuzgec] = useState<string | null>(null);
  /* AÇIK OLAN BİR İNDEKS, bir nesne değil: ileri/geri gezinmek için sıradaki
     öğeyi bilmek gerekiyor, ve sıra GÖRÜNEN listenin sırası · bir gruba
     süzülmüşken "sonraki", o grubun sonrakisi olmalı. */
  const [acikIndeks, setAcikIndeks] = useState<number | null>(null);
  const [kopyalandi, setKopyalandi] = useState(false);

  /* Grup ANAHTARI dilden bağımsız (Türkçe ad), etiketi dile bağlı: dil
     değiştiğinde seçili çip kaybolmuyor. */
  const gruplar = useMemo(() => {
    const sira: Metin[] = [];
    for (const o of ogeler) if (!sira.some((g) => g.tr === o.grup.tr)) sira.push(o.grup);
    return sira;
  }, [ogeler]);

  const gorunen = suzgec ? ogeler.filter((o) => o.grup.tr === suzgec) : ogeler;
  const acik = acikIndeks === null ? null : (gorunen[acikIndeks] ?? null);

  /* DÖNGÜSEL: sondaki "sonraki" başa dönüyor. Bir katalogda gezinirken
     sonuncuda takılmak, listeyi kapatıp yeniden açmayı gerektiriyor. */
  const git = (yon: number) =>
    setAcikIndeks((i) => (i === null ? null : (i + yon + gorunen.length) % gorunen.length));

  /* ←/→ GEZİNİYOR, Esc kapatıyor · kapatmayı `Dialog` zaten yapıyor. Dinleyici
     yalnız pencere açıkken bağlı: kapalıyken sayfadaki ok tuşları kaydırma
     için, ve onları yutmak sayfayı kilitler. */
  useEffect(() => {
    if (acikIndeks === null) return;
    const tus = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") git(1);
      else if (e.key === "ArrowLeft") git(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", tus);
    return () => window.removeEventListener("keydown", tus);
  }, [acikIndeks, gorunen.length]);

  return (
    <div
      ref={kok}
      className="my-6 flex flex-col gap-10"
      style={olcek ? ({ ["--galeri-olcek" as string]: String(olcek) } as React.CSSProperties) : undefined}
    >
      {/* ŞERİT BAŞLIĞIN ALTINA YAPIŞIYOR: on dört kartlık bir katalogda filtre
          yukarıda kalırsa bir gruba bakmak için her seferinde başa dönmek
          gerekiyor · token ve ikon sayfalarıyla aynı şerit.

          ÇİPLER, açılır liste değil: seçenek sayısı az ve hepsi bir bakışta
          görünmeli. Bir açılır liste, "ne var ne yok" sorusunu tekrar
          gizlerdi. Her çip KENDİ SAYISINI taşıyor, çünkü "kaç tane" sorusu
          "hangileri"nden önce geliyor. */}
      <div className="galeri-serit">
        <button
          type="button"
          className="galeri-cip"
          data-active={suzgec === null}
          onClick={() => {
            setSuzgec(null);
            setAcikIndeks(null);
          }}
        >
          {labels.hepsi}
          <span className="galeri-cip-n">{ogeler.length}</span>
        </button>
        {gruplar.map((g) => (
          <button
            key={g.tr}
            type="button"
            className="galeri-cip"
            data-active={suzgec === g.tr}
            /* Süzgeç değişince açık pencere kapanıyor: indeks GÖRÜNEN listeye
               göre, ve liste değişince aynı indeks başka bir öğeyi gösterirdi. */
            onClick={() => {
              setSuzgec(g.tr);
              setAcikIndeks(null);
            }}
          >
            {g[lang]}
            <span className="galeri-cip-n">
              {ogeler.filter((o) => o.grup.tr === g.tr).length}
            </span>
          </button>
        ))}
        {/* LEJANT: iki kare, iki cümle yerine. Rozetin dolu mu çerçeveli mi
            olduğu kartlarda görülüyor ama ne DEMEK olduğu görülmüyor.

            YALNIZ LİSTEDE OLAN TÜR YAZILIYOR: şablonların hepsi paket, ve
            orada bir "tarif" karesi hiç karşılığı olmayan bir sözcük. */}
        <span className="galeri-lejant">
          {(["paket", "tarif"] as const)
            .filter((tur) => ogeler.some((o) => o.tur === tur))
            .map((tur) => (
              <span key={tur}>
                <span className="galeri-lejant-kare" data-tur={tur} />
                {tur === "paket" ? labels.paket : labels.tarif}
              </span>
            ))}
        </span>
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
                      /* `~=` İLE EŞLEŞİYOR, `*=` İLE DEĞİL · ve bu bir düzeltme:
                         `[class*='h-dvh']` alt dize arıyor ve `min-h-dvh`i DE
                         yakalıyordu. Oturum ve kamusal ekranlara `height: 100%`
                         basılıyor, zemin çerçevenin boyunda kalıyor, içerik
                         altından taşıyordu · aşağı kaydırınca arka plan bir
                         yerde kesiliyordu. `~=` boşlukla ayrılmış TOKENI arıyor. */
                      className={`galeri-onizleme docs-kit pointer-events-none block${
                        o.boy === "ekran"
                          ? " [&_[class~='min-h-dvh']]:min-h-full [&_[class~='h-dvh']]:h-full"
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
                          onClick={() => setAcikIndeks(gorunen.indexOf(o))}
                        >
                          {o.ad[lang]}
                        </button>
                        {/* Rozet: paketten mi geliyor, kopyalanacak bir tarif
                            mi. Okuyucunun ilk sorusu bu, o yüzden adın
                            yanında. */}
                        <span className="galeri-rozet" data-tur={o.tur}>
                          {o.tur === "paket" ? labels.paket : labels.tarif}
                        </span>
                        {/* Bileşen adı: "Kullanıcılar" ekranın ne olduğunu
                            söylüyor, `ListTemplate` hangi şablondan çıktığını. */}
                        {o.bilesen && <code className="galeri-bilesen">{o.bilesen}</code>}
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
        onClose={() => setAcikIndeks(null)}
        title={acik ? acik.ad[lang] : ""}
        closeLabel={labels.kapat}
        size="wide"
      >
        {acik && acikIndeks !== null && (
          <div className="flex flex-col gap-4">
            {/* GEZİNME ŞERİDİ: bir katalogda ikinci ekrana bakmak için pencereyi
                kapatıp yeniden açmak gerekmiyor. Ok tuşları da aynı işi
                yapıyor, ve sayaç kaçıncısında olduğunu söylüyor. */}
            <div className="galeri-gezinme">
              <button
                type="button"
                className="tamga-icon-btn tamga-icon-btn-sm"
                aria-label={labels.onceki}
                onClick={() => git(-1)}
              >
                <Icon icon={CaretLeft} size="xs" />
              </button>
              <button
                type="button"
                className="tamga-icon-btn tamga-icon-btn-sm"
                aria-label={labels.sonraki}
                onClick={() => git(1)}
              >
                <Icon icon={CaretRight} size="xs" />
              </button>
              <span className="galeri-gezinme-ad">
                {acik.bilesen && <code>{acik.bilesen}</code>}
                <span>{acik.grup[lang]}</span>
                <span className="galeri-gezinme-sira">
                  {labels.sira(acikIndeks + 1, gorunen.length)}
                </span>
              </span>
            </div>
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
                  ? "docs-kit galeri-ekran [&_[class~='min-h-dvh']]:min-h-full [&_[class~='h-dvh']]:h-full"
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
