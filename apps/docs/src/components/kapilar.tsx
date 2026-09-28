"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "tamga-ui";
import { Check, Close, RunNow } from "tamga-ui/icons";

/**
 * Sürüm öncesi kontroller · canlandırma, gerçek çıktıyla.
 *
 * NEDEN BU BİLEŞEN VAR. Ana sayfa kontrolleri bir sayı ve elle yazılmış bir
 * adlar listesiyle anlatıyordu; ziyaretçi için bu bir liste, bir kanıt değil.
 * Anlatılacak şey kuralların kendisi de değil: ZİNCİRİN TAKILDIĞI. Hatayı
 * ziyaretçi seçiyor, kontroller o karede duruyor, arkasındakiler hiç koşmuyor.
 *
 * SAYILAR UYDURULMUYOR. Sıra `counts.kontroller`den (yani `verify` betiğinin
 * kendisinden) geliyor; hata satırları dört ihlalin gerçekten koşturulmuş
 * çıktısından. Yakalama yöntemi: docs/07-dokuman-sitesi.md.
 */

export type KapiSenaryo = { id: string; kapi: string | null; olcum: string | null };

export type KapiMetin = {
  baslik: string;
  canlandirma: string;
  komut: string;
  soru: string;
  oynat: string;
  /** `{n}` toplam kontrol. */
  seritAdi: string;
  /** `{n}` sıra, `{ad}` kontrolün adı · koşarken okunan satır. */
  kosuyor: string;
  /** `{n}` takıldığı sıra, `{kapi}` kontrolün teknik adı. */
  durdu: string;
  /** `{n}` hiç çalışmayan kontrol sayısı. */
  kalan: string;
  gecti: string;
  varsayim: string;
  senaryolar: Record<string, { ad: string; baslik: string; sonuc: string }>;
  /** Kontrolün teknik adından okunur adına. */
  adlar: Record<string, string>;
};

/* Kare başına 90 ms: on sekiz kontrol 1.6 saniyede akıyor. Daha yavaşı
   beklemeye, daha hızlısı hiç akmamışa dönüyor. */
const KARE_MS = 90;

export function KapiZinciri({
  zincir,
  senaryolar,
  labels: t,
}: {
  zincir: readonly string[];
  senaryolar: readonly KapiSenaryo[];
  labels: KapiMetin;
}) {
  const [secili, setSecili] = useState(senaryolar[0]?.id ?? "yok");
  /* AÇILIŞTA BİTMİŞ: ziyaretçi önce bütün kontrollerin geçtiğini görüyor,
     durmayı sonra. Ters sırada sistem "sürekli kırılan bir şey" okunuyor. */
  const [ilerleme, setIlerleme] = useState(zincir.length);
  const zamanlayici = useRef<ReturnType<typeof setInterval> | null>(null);
  const oncekiSecili = useRef(secili);

  const senaryo = senaryolar.find((s) => s.id === secili) ?? senaryolar[0]!;
  /* TAKILDIĞI SIRA DEMODA DEĞİL ZİNCİRDE: kontrolün adı sabit, sırası değil.
     Zincire bir kontrol eklenince bu sayı kendiliğinden kayıyor. */
  const durakIndeks = senaryo.kapi ? zincir.indexOf(senaryo.kapi) : -1;
  const hedef = durakIndeks === -1 ? zincir.length : durakIndeks + 1;
  const bitti = ilerleme >= hedef;
  const dustu = bitti && durakIndeks !== -1;
  const kalan = zincir.length - hedef;

  const koy = (kaynak: string, degerler: Record<string, string | number>) =>
    kaynak.replace(/\{(\w+)\}/g, (_, k) => String(degerler[k] ?? ""));
  const adi = (kontrol: string) => t.adlar[kontrol] ?? kontrol;

  function calistir(hedefSira: number) {
    if (zamanlayici.current) clearInterval(zamanlayici.current);
    /* HAREKETİ AZALTANDA HİÇ AKMIYOR, son kareye gidiyor: akış bir süs değil
       bir bilgi, ve bilgi hareketin içinde saklı kalmamalı. */
    const azalt =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (azalt) {
      setIlerleme(hedefSira);
      return;
    }
    setIlerleme(0);
    zamanlayici.current = setInterval(() => {
      setIlerleme((n) => {
        if (n + 1 >= hedefSira) {
          if (zamanlayici.current) clearInterval(zamanlayici.current);
          return hedefSira;
        }
        return n + 1;
      });
    }, KARE_MS);
  }

  /* Senaryo seçmek = seçip HEMEN çalıştırmak. Ayrı bir "çalıştır" düğmesi,
     ziyaretçiyi hiçbir şey söylemeyen ikinci bir tıklamaya zorluyordu.

     KARŞILAŞTIRMA ÖNCEKİ SEÇİMLE, "ilk koşu mu" bayrağıyla DEĞİL: geliştirme
     kipinde React etkileri iki kez çağırıyor ve bayrak ikinci çağrıda düşüp
     açılışta canlandırmayı başlatıyordu · kutu daha okunmadan akıyordu. */
  useEffect(() => {
    if (oncekiSecili.current === secili) return;
    oncekiSecili.current = secili;
    calistir(hedef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secili]);

  useEffect(
    () => () => {
      if (zamanlayici.current) clearInterval(zamanlayici.current);
    },
    [],
  );

  return (
    <div className="home-zincir">
      <div className="home-zincir-bas">
        <span className="home-zincir-ad">
          <strong>{t.baslik}</strong>
          <span className="home-zincir-rozet">{t.canlandirma}</span>
        </span>
        <code className="home-zincir-komut">{t.komut}</code>
        {/* Düğme yeniden KOŞTURMUYOR, yeniden OYNATIYOR · adı da onu söylüyor. */}
        <button type="button" className="home-zincir-oynat" onClick={() => calistir(hedef)}>
          <Icon icon={RunNow} size="xs" weight="bold" />
          {t.oynat}
        </button>
      </div>

      {/* RADYO GRUBU GERÇEKTEN RADYO GRUBU: tek sekme durağı, seçimi oklar
          taşıyor. Görünür bir başlığı yok · kümenin adı `aria-label`de. */}
      <div
        className="home-zincir-secim"
        role="radiogroup"
        aria-label={t.soru}
        onKeyDown={(e) => {
          const yon =
            e.key === "ArrowRight" || e.key === "ArrowDown"
              ? 1
              : e.key === "ArrowLeft" || e.key === "ArrowUp"
                ? -1
                : 0;
          if (!yon) return;
          e.preventDefault();
          const i = senaryolar.findIndex((s) => s.id === secili);
          const sonraki = senaryolar[(i + yon + senaryolar.length) % senaryolar.length]!;
          setSecili(sonraki.id);
          e.currentTarget.querySelector<HTMLButtonElement>(`[data-id="${sonraki.id}"]`)?.focus();
        }}
      >
        {senaryolar.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            data-id={s.id}
            aria-checked={s.id === secili}
            tabIndex={s.id === secili ? 0 : -1}
            className="home-zincir-sec"
            onClick={() => (s.id === secili ? calistir(hedef) : setSecili(s.id))}
          >
            {t.senaryolar[s.id]?.ad ?? s.id}
          </button>
        ))}
      </div>

      <div className="home-zincir-alt">
        <ol className="home-zincir-serit" aria-label={koy(t.seritAdi, { n: zincir.length })}>
          {zincir.map((kontrol, i) => (
            <li
              key={kontrol}
              title={`${i + 1}. ${adi(kontrol)} · ${kontrol}`}
              /* GEÇEN KARE SESSİZ, YEŞİL DEĞİL · yeşil "kontrol koştu" demek
                 olsaydı on beş yeşilin yanında duran tek pembe kaybolurdu.
                 Renk sapmayı işaretliyor (Yasa 3), ve şerit ancak hepsi
                 geçtiğinde yeşile dönüyor: orada yeşil "sürüm çıkabilir"
                 demek oluyor. Koşarken sıradaki kare mavi · o an bakılacak
                 yer orası. */
              data-durum={
                i + 1 === hedef && dustu && bitti
                  ? "takildi"
                  : i === ilerleme && !bitti
                    ? "kosuyor"
                    : i < ilerleme
                      ? bitti && !dustu
                        ? "tamam"
                        : "gecti"
                      : "kosmadi"
              }
            />
          ))}
        </ol>
        <span className="home-zincir-uc">
          <span>1</span>
          <span>{zincir.length}</span>
        </span>

        {/* SONUÇ BİR CANLI BÖLGE: şerit ekran okuyucuya bir şey söylemiyor,
            cümle söylüyor. */}
        <div className="home-zincir-sonuc" data-dustu={dustu || undefined} aria-live="polite">
          {!bitti ? (
            <strong className="home-zincir-kosuyor">
              {koy(t.kosuyor, { n: ilerleme + 1, ad: adi(zincir[ilerleme] ?? "") })}
            </strong>
          ) : dustu ? (
            <>
              <strong>
                <Icon icon={Close} size="xs" weight="bold" />
                {koy(t.durdu, { n: hedef, kapi: senaryo.kapi ?? "" })}
              </strong>
              <span>{t.senaryolar[senaryo.id]?.baslik}</span>
              {senaryo.olcum ? <code>{senaryo.olcum}</code> : null}
              <span className="home-zincir-kalan">
                {t.senaryolar[senaryo.id]?.sonuc} {koy(t.kalan, { n: kalan })}
              </span>
            </>
          ) : (
            <>
              <strong>
                <Icon icon={Check} size="xs" weight="bold" />
                {t.gecti}
              </strong>
              <span>{t.senaryolar[senaryo.id]?.baslik}</span>
            </>
          )}
        </div>

        {/* "BU HATA KODDA YOK" · rozet kutunun canlı koşmadığını söylüyor ama
            hatanın kurgu olduğunu söylemiyordu, ve iki cümle arasındaki fark
            büyük: biri "şu an koşmuyor", öteki "böyle bir hatamız yok". */}
        <p className="home-zincir-varsayim">{t.varsayim}</p>
      </div>
    </div>
  );
}
