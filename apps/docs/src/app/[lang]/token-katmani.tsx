"use client";

import { useEffect, useState } from "react";
import { paletteVars, makePalette } from "tamga-ui/palette";
import {
  Button,
  Card,
  CardBody,
  CardHead,
  Dot,
  Kpi,
  Label,
  ScoreRing,
  Sparkline,
  StatusChip,
  Switch,
} from "tamga-ui";
import type { Locale } from "@/i18n/config";

/**
 * TOKEN KATMANININ KANITI: aynı bileşenler, üç ürün, üç yüz.
 *
 * NEDEN ÜÇ EKRAN GÖRÜNTÜSÜ DEĞİL. Bu bölümün iddiası "ürün değişir, sistem
 * yerinde kalır". Üç resim koysaydık iddia bir söz olarak kalırdı; burada
 * ziyaretçi düğmeye basıyor ve AYNI DOM'un yeniden boyandığını görüyor.
 * Bileşenler yeniden kurulmuyor bile: değişen tek şey kabın üstündeki simge
 * sözlüğü.
 *
 * DEĞİŞEN İKİ ŞEY, VE İKİSİ DE TOKEN: renk (bir hex'ten üretilen palet) ve
 * yazı ailesi (`--font-*`). Boşluk, ölçek ve davranış her üçünde de aynı;
 * zaten mesele bu.
 *
 * KÖŞE YARIÇAPI DENENDİ VE ÇIKARILDI. Üç ürün üç farklı `--radius-ctl`
 * taşıyordu (10px · 6px · 2px) ve teknik olarak doğruydu: yarıçap gerçekten
 * bir token. Ama ekranda sonuç, kitin köşesinin ne olduğunu bilmeyen bir
 * ziyaretçiye üç farklı düğme göstermekti; hangisinin "gerçek" olduğu
 * okunmuyordu. Bir tanıtım sayfasının işi yeteneği sergilemek değil, sistemi
 * TANITMAK. Kitin köşesi tek: `--radius-ctl` 4px, `--radius-card` 6px, ve
 * önizleme de onu gösteriyor.
 *
 * PALET TEK HEX'TEN ÜRETİLİYOR (`makePalette`), elle yazılmış üç tondan değil.
 * Sayfa böylece kitin kendi üretecini de gösteriyor; elle seçilmiş renkler
 * koysaydık sayfa üreteci anlatıp kullanmamış olurdu.
 *
 * SİMGELER KABA YAZILIYOR, KÖKE DEĞİL. CSS özel değişkenleri kalıtsal olduğu
 * için bir `<div>`e yazılan palet yalnız o kutunun içini döndürüyor: sayfanın
 * geri kalanı, üst şerit ve menü kendi temasında kalıyor. Köke yazsaydık
 * "önizleme" bir önizleme olmaktan çıkardı.
 *
 * YAZI AİLELERİ SİSTEM YIĞINI. Kit hiçbir web fontu yüklemiyor ve bu sayfa da
 * yüklememeli: tek bir gösteri için üç font indirmek, sitenin ilk boyanmasını
 * kitin kendi kuralına aykırı biçimde geciktirir.
 */

const SISTEM_SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const SISTEM_SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
const SISTEM_MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

type Iki = { tr: string; en: string };

/**
 * Bir ürünün kendi SÖZLÜĞÜ.
 *
 * ÖNCE YOKTU VE BU DEMOYU ÇÜRÜTÜYORDU. Üç düğme yalnız rengi değiştiriyordu:
 * fotoğraf uygulamasında "Stok · 48 kalem" yazıyordu, takım panosunda
 * "Sipariş 248". Bu bölümün iddiası "aynı sistem, başka ürün"; içerik tek bir
 * ürünün kaldığı sürece sayfa tam tersini kanıtlıyordu.
 *
 * Eylem adları (Kaydet · Vazgeç · Sil) üçünde de aynı, çünkü onlar ürünün değil
 * ARAYÜZÜN sözcükleri. Değişen şey neyin sayıldığı, neyin listelendiği ve
 * durumların adı.
 */
type Sozluk = {
  skor: Iki;
  bant: Iki;
  sayac: Iki;
  kartBaslik: Iki;
  kartMeta: Iki;
  kartGovde: Iki;
  acik: Iki;
  bekleyen: Iki;
  sessiz: Iki;
  kod: string;
  anahtarAd: Iki;
};

type Urun = {
  anahtar: string;
  ad: Iki;
  marka: string;
  yazi: string;
  sozluk: Sozluk;
};

const URUNLER: Urun[] = [
  {
    anahtar: "foto",
    ad: { tr: "Fotoğraf uygulaması", en: "Photo editor" },
    marka: "#6d4aff",
    yazi: SISTEM_SANS,
    sozluk: {
      skor: { tr: "Kalite", en: "Quality" },
      bant: { tr: "iyi", en: "good" },
      sayac: { tr: "Dışa aktarım", en: "Exports" },
      kartBaslik: { tr: "Albüm", en: "Album" },
      kartMeta: { tr: "48 fotoğraf", en: "48 photos" },
      kartGovde: {
        tr: "Ham dosyalar yüklendikleri sırayla işleniyor.",
        en: "Raw files are processed in the order they arrive.",
      },
      acik: { tr: "İşlendi", en: "Processed" },
      bekleyen: { tr: "Kuyrukta", en: "Queued" },
      sessiz: { tr: "Taslak", en: "Draft" },
      kod: "IMG-2481",
      anahtarAd: { tr: "Otomatik yedekleme", en: "Auto backup" },
    },
  },
  {
    anahtar: "ticaret",
    ad: { tr: "E-ticaret paneli", en: "Commerce dashboard" },
    marka: "#e02938",
    yazi: SISTEM_SANS,
    sozluk: {
      skor: { tr: "Sağlık", en: "Health" },
      bant: { tr: "iyi", en: "good" },
      sayac: { tr: "Sipariş", en: "Orders" },
      kartBaslik: { tr: "Stok", en: "Stock" },
      kartMeta: { tr: "48 kalem", en: "48 items" },
      kartGovde: {
        tr: "Depodan düşen her kalem aynı akşam sayılıyor.",
        en: "Every item leaving the warehouse is counted the same evening.",
      },
      acik: { tr: "Yayında", en: "Live" },
      bekleyen: { tr: "Bekliyor", en: "Waiting" },
      sessiz: { tr: "Sessiz", en: "Quiet" },
      kod: "SIP-2481",
      anahtarAd: { tr: "Bildirimler", en: "Notifications" },
    },
  },
  {
    anahtar: "gorev",
    ad: { tr: "Takım görev panosu", en: "Team task board" },
    marka: "#0a7a5f",
    yazi: SISTEM_SERIF,
    sozluk: {
      skor: { tr: "Tamamlanma", en: "Completion" },
      bant: { tr: "iyi", en: "good" },
      sayac: { tr: "Kapanan görev", en: "Closed tasks" },
      kartBaslik: { tr: "Sprint", en: "Sprint" },
      kartMeta: { tr: "48 görev", en: "48 tasks" },
      kartGovde: {
        tr: "Devralınan her görev sahibiyle birlikte taşınıyor.",
        en: "Every task that moves carries its owner with it.",
      },
      acik: { tr: "Devam ediyor", en: "In progress" },
      bekleyen: { tr: "İncelemede", en: "In review" },
      sessiz: { tr: "Arşiv", en: "Archived" },
      kod: "GRV-2481",
      anahtarAd: { tr: "Günlük özet", en: "Daily digest" },
    },
  },
];

export function TokenKatmani({
  lang,
  labels,
}: {
  lang: Locale;
  /**
   * Arayüzün kendi sözcükleri: üç üründe de aynı, çünkü bir eylem adı ürünün
   * değil ARAYÜZÜN kelimesidir.
   */
  labels: { group: string; save: string; cancel: string; delete: string; edit: string };
}) {
  const [secili, setSecili] = useState(URUNLER[1]!);

  /* KOYU TEMAYI İZLİYOR. Palet iki yüzlü (`light` / `dark`) ve yalnız açığını
     yazsaydık, sitenin koyu temasında kutu açık zeminde açık mürekkep
     gösterirdi: okunmayan bir önizleme. Kök sınıfı bir `MutationObserver` ile
     izleniyor, çünkü tema anahtarı sınıfı çalışma zamanında değiştiriyor ve
     bir kez okumak yetmiyor. */
  const [koyu, setKoyu] = useState(false);
  useEffect(() => {
    const kok = document.documentElement;
    const oku = () => setKoyu(kok.classList.contains("dark"));
    oku();
    const gozcu = new MutationObserver(oku);
    gozcu.observe(kok, { attributes: true, attributeFilter: ["class"] });
    return () => gozcu.disconnect();
  }, []);

  const s = secili.sozluk;
  const cift = makePalette(secili.marka);
  const stil: Record<string, string> = {
    ...paletteVars(koyu ? cift.dark : cift.light),
    "--font-sans": secili.yazi,
    "--font-display": secili.yazi,
    "--font-mono": SISTEM_MONO,
  };

  return (
    <div className="flex flex-col gap-5">
      {/* SEÇİCİ ÖNİZLEMENİN DIŞINDA, ve bilerek: kendisi de yeniden boyansaydı
          hangi rengin nereden geldiği karışırdı. Seçici sitenin teması,
          kutunun içi ürünün teması. */}
      <div role="radiogroup" aria-label={labels.group} className="flex flex-wrap gap-2">
        {URUNLER.map((u) => {
          const acik = u.anahtar === secili.anahtar;
          return (
            <button
              key={u.anahtar}
              type="button"
              role="radio"
              aria-checked={acik}
              onClick={() => setSecili(u)}
              className="tamga-btn tamga-btn-sm"
              data-active={acik || undefined}
              style={
                acik
                  ? {
                      borderColor: "var(--color-ink)",
                      background: "var(--color-hover)",
                      color: "var(--color-ink)",
                    }
                  : undefined
              }
            >
              {/* Ürünün rengi seçenekte de duruyor: hangi düğmenin hangi yüzü
                  açtığı basmadan önce okunuyor. */}
              <span
                aria-hidden
                className="size-3 shrink-0 rounded-[var(--radius-ctl)]"
                style={{ background: u.marka }}
              />
              {u.ad[lang]}
            </button>
          );
        })}
      </div>

      {/* ÖNİZLEME BU BİLEŞENİN İÇİNDE, dışarıdan `children` olarak gelmiyor.
          Gelseydi sözcükler seçimden bağımsız kalırdı — ve bir süre öyleydi:
          fotoğraf uygulaması "Stok · 48 kalem" gösteriyordu. Renk ve sözlük
          aynı seçimin iki yüzü, o yüzden aynı yerde duruyorlar. */}
      <div style={stil} className="rounded-[var(--radius-card)]">
        <div className="tamga-card docs-grid grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6">
            <span className="flex flex-wrap items-center gap-3">
              <Button variant="primary">{labels.save}</Button>
              <Button>{labels.cancel}</Button>
              <Button variant="danger">{labels.delete}</Button>
            </span>
            <span className="flex flex-wrap items-center gap-3">
              <StatusChip label={s.acik[lang]} state="positive" dot />
              <StatusChip label={s.bekleyen[lang]} state="caution" dot />
              <StatusChip label={s.kod} state="danger" mono live />
              <span className="flex items-center gap-2 text-small">
                <Dot state="neutral" /> {s.sessiz[lang]}
              </span>
            </span>
            <span className="flex flex-wrap items-center gap-8">
              <ScoreRing value={87} size={96} label={s.skor[lang]} bandLabel={s.bant[lang]} />
              <Kpi
                label={s.sayac[lang]}
                value={248}
                delta={12}
                chart={
                  <Sparkline
                    values={[42, 38, 45, 51, 47, 60, 58, 66, 61, 72, 68, 80]}
                    tone="positive"
                  />
                }
                className="min-w-52"
              />
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHead action={<Button size="sm">{labels.edit}</Button>}>
                <h3 className="text-subhead font-semibold text-ink">{s.kartBaslik[lang]}</h3>
                <Label>{s.kartMeta[lang]}</Label>
              </CardHead>
              <CardBody>{s.kartGovde[lang]}</CardBody>
            </Card>
            <span className="flex items-center gap-4">
              <Switch on label={s.anahtarAd[lang]} />
              <span className="text-body">{s.anahtarAd[lang]}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
