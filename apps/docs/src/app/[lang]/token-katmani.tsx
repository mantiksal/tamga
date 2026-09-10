"use client";

import { useEffect, useState } from "react";
import { paletStili, paletUret } from "tamga-ui/palette";
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
 * PALET TEK HEX'TEN ÜRETİLİYOR (`paletUret`), elle yazılmış üç tondan değil.
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

type Urun = {
  anahtar: string;
  ad: { tr: string; en: string };
  marka: string;
  yazi: string;
};

const URUNLER: Urun[] = [
  {
    anahtar: "foto",
    ad: { tr: "Fotoğraf uygulaması", en: "Photo editor" },
    marka: "#6d4aff",
    yazi: SISTEM_SANS,
  },
  {
    anahtar: "ticaret",
    ad: { tr: "E-ticaret paneli", en: "Commerce dashboard" },
    marka: "#e02938",
    yazi: SISTEM_SANS,
  },
  {
    anahtar: "gorev",
    ad: { tr: "Takım görev panosu", en: "Team task board" },
    marka: "#0a7a5f",
    yazi: SISTEM_SERIF,
  },
];

export function TokenKatmani({
  lang,
  children,
  labels,
}: {
  lang: Locale;
  /** Yeniden boyanacak canlı bileşenler. */
  children: React.ReactNode;
  labels: { group: string };
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

  const cift = paletUret(secili.marka);
  const stil: Record<string, string> = {
    ...paletStili(koyu ? cift.dark : cift.light),
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

      <div style={stil} className="rounded-[var(--radius-card)]">
        {children}
      </div>
    </div>
  );
}
