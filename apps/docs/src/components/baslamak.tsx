"use client";

import { useState } from "react";
import { Button, Icon, StatusChip } from "tamga-ui";
import { Check, Package, Palette } from "tamga-ui/icons";
import { CodeBlock } from "@/components/kod";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * "Başlamak": üç adım, ve sağda ne olacağını gösteren bir pencere.
 *
 * ÜÇ ADIM SIRALI BİR İŞ, o yüzden numaralı ve aralarında bir çizgi var. Sağdaki
 * pencere adıma bağlı: ilk ikisinde bir ipucu, üçüncüde GERÇEK bileşenler ·
 * "kurduğunda bu çıkacak" cümlesinin ekrandaki karşılığı.
 */

export type BaslamakMetin = {
  adimlar: readonly (readonly [string, string])[];
  dosya2: string;
  dosya3: string;
  adres: string;
  bekliyor: string;
  calisiyor: string;
  ipucu1: string;
  ipucu2: string;
  ipucu3: string;
  kaydet: string;
  yayinda: string;
  kaydedildi: string;
  rehber: string;
  sablon: string;
};

const KOMUT = {
  pnpm: "pnpm add tamga-ui",
  npm: "npm install tamga-ui",
  yarn: "yarn add tamga-ui",
};

const STIL = `@import "tailwindcss";
@import "tamga-ui/styles.css";
@source "../../node_modules/tamga-ui/dist";`;

const EKRAN = `import { Button, StatusChip } from "tamga-ui";

export default function Page() {
  return (
    <main className="p-8 flex items-center gap-3">
      <StatusChip label="Yayında" state="positive" />
      <Button variant="primary">Kaydet</Button>
    </main>
  );
}`;

export function Baslamak({
  labels: t,
  dict,
  rehberHref,
  sablonHref,
}: {
  labels: BaslamakMetin;
  dict: Dictionary;
  rehberHref: string;
  sablonHref: string;
}) {
  /* ÜÇÜNCÜ ADIM SEÇİLİ AÇILIYOR: ziyaretçi önce SONUCU görüyor, adımları
     sonra. Birinciyle açılsaydı sağdaki pencere boş bir ipucu gösterirdi. */
  const [adim, setAdim] = useState(2);
  const [kaydedildi, setKaydedildi] = useState(false);

  return (
    <div className="bas-izgara">
      <ol className="bas-adimlar">
        {t.adimlar.map(([ad, alt], i) => (
          <li key={ad} data-secili={adim === i || undefined} onMouseEnter={() => setAdim(i)}>
            <button
              type="button"
              className="bas-no"
              aria-pressed={adim === i}
              onClick={() => setAdim(i)}
            >
              {i < adim ? <Icon icon={Check} size="sm" weight="bold" /> : i + 1}
            </button>
            <div className="bas-govde">
              <strong className="bas-ad">{ad}</strong>
              <span className="bas-alt">{alt}</span>
              {i === 0 ? (
                <CodeBlock pm={KOMUT} dict={dict} />
              ) : (
                <CodeBlock code={i === 1 ? STIL : EKRAN} file={i === 1 ? t.dosya2 : t.dosya3} dict={dict} />
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="bas-yan">
        {/* SAHTE TARAYICI, ve sahteliği belli: adres çubuğu bir girdi değil bir
            etiket. Gösterdiği şey gerçek · içindeki düğme ve çip kitin kendisi. */}
        <div className="bas-pencere">
          <div className="bas-cubuk">
            <span className="bas-nokta" />
            <span className="bas-nokta" />
            <span className="bas-nokta" />
            <code className="bas-adres">{t.adres}</code>
            <StatusChip
              label={adim === 2 ? t.calisiyor : t.bekliyor}
              state={adim === 2 ? "positive" : "neutral"}
              dot
            />
          </div>
          <div className="bas-sahne">
            {adim === 2 ? (
              <div className="flex flex-wrap items-center gap-3">
                <StatusChip
                  label={kaydedildi ? t.kaydedildi : t.yayinda}
                  state={kaydedildi ? "info" : "positive"}
                  dot
                />
                <Button variant="primary" onClick={() => setKaydedildi((k) => !k)}>
                  {t.kaydet}
                </Button>
                <span className="bas-ipucu">{t.ipucu3}</span>
              </div>
            ) : (
              <div className="bas-bos">
                <Icon icon={adim === 0 ? Package : Palette} size="lg" weight="duotone" />
                <span>{adim === 0 ? t.ipucu1 : t.ipucu2}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a href={rehberHref} className="bas-btn bas-btn-birincil">
            {t.rehber}
          </a>
          <a href={sablonHref} className="bas-btn">
            {t.sablon}
          </a>
        </div>
      </div>
    </div>
  );
}
