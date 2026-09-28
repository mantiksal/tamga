"use client";

import { useState } from "react";
import { LocaleSwitcher, StatusChip } from "tamga-ui";
import { AppearanceTemplate, type Appearance, type AppearanceLabels } from "tamga-ui/patterns";

/**
 * Görünüm ekranı, canlı ve BÜTÜN: parçalar değil şablonun kendisi.
 *
 * Sayfanın ilk başlığı "neden tek bir ekran, beş parça değil" diye soruyor, ve
 * bir süre örnek tam da o beş parçayı yan yana dizmişti · sayfa bir şey
 * söylerken örneği başka bir şey gösteriyordu. Kesik çizgiler, bölüm sırası,
 * SquarePicker ve kaydet şeridi şablonun kendi kararları; burada yeniden
 * kurulsalardı ilk değişiklikte ayrışırlardı.
 */

/** Dil satırının metinleri · bu satır ŞABLONDA YOK, `extra` ile ekleniyor. */
export type DilMetin = {
  baslik: string;
  rozet: string;
  aciklama: string;
  not: string;
  markaAdi: string;
  diller: readonly { value: string; label: string }[];
};

export function GorunumOrnek({ labels, dil }: { labels: AppearanceLabels; dil: DilMetin }) {
  const [deger, setDeger] = useState<Appearance>({
    brand: "#1e4fd8",
    theme: "light",
    rail: "free",
    logo: null,
    mark: null,
  });
  /* KAYITLI HÂL AYRI BİR STATE: "kaydedilmemiş değişiklik var" satırı ancak
     iki hâl karşılaştırılabildiğinde bir şey söylüyor, ve şablon saklamadığı
     için ikisini de çağıran tutuyor · sayfanın anlattığı şey tam olarak bu. */
  const [kayitli, setKayitli] = useState<Appearance>(deger);
  const [locale, setLocale] = useState(dil.diller[0]?.value ?? "tr");

  return (
    <AppearanceTemplate
      value={deger}
      onChange={setDeger}
      saved={kayitli}
      onSave={() => setKayitli(deger)}
      onReset={() => setDeger(kayitli)}
      fallbackName={dil.markaAdi}
      labels={labels}
      extra={
        /* `extra` ürünün kendi bölümü, ve satır kitin satırıyla aynı sınıfı
           giyiyor: ek bir bölüm eklenen bir kutu gibi değil, ekranın bir
           parçası gibi okunmalı. */
        <div className="tamga-appearance-row">
          <div className="tamga-appearance-head">
            <strong className="flex items-center gap-2 text-body font-bold text-ink">
              {dil.baslik}
              <StatusChip label={dil.rozet} state="caution" dot={false} />
            </strong>
            <span className="text-small leading-relaxed text-ink-soft">{dil.aciklama}</span>
          </div>
          <div className="flex min-w-0 flex-col items-start gap-3">
            <LocaleSwitcher
              locales={dil.diller}
              current={locale}
              onChange={setLocale}
              label={dil.baslik}
            />
            <span className="text-small leading-relaxed text-ink-faint">{dil.not}</span>
          </div>
        </div>
      }
    />
  );
}
