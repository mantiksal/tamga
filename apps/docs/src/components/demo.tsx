"use client";

import { useState, type ReactNode } from "react";
import { Button, Icon, ScrollX, Segmented, Switch } from "tamga-ui";
import { Check, Copy } from "tamga-ui/icons";

/**
 * Bir örnek: canlı hâli, kodu, ve kodu alma yolu.
 *
 * ÖNİZLEME GERÇEK. İçerideki her şey `tamga-ui`'den geliyor — ekran
 * görüntüsü, kopyalanmış işaretleme ya da yeniden yazılmış bir taklit değil.
 * Kitte bir gölge değişirse bu kutu da değişir; doküman ile gerçeğin ayrışması
 * mekanik olarak imkânsız.
 *
 * KOD ELLE YAZILIYOR ve bu bilinçli. React ağacından kaynak üretmek mümkün ama
 * çıkan şey okunacak bir örnek değil, bir döküm olur (her prop, her sarmalayıcı,
 * her boşluk). Örnek insanın kopyalayacağı şeydir; onu insan yazar.
 */
/**
 * Bir kontrolün alabileceği değerler: seçenek listesi ya da açık/kapalı.
 *
 * Serbest metin ve renk seçici YOK, ve bu bir eksiklik değil karar: bir örnek
 * bileşenin NE YAPTIĞINI göstermek için var, kullanıcının onu istediği hâle
 * getirmesi için değil. Kürasyonlu seçenek, serbestlik değil — kitin kendi
 * kuralı burada da geçerli.
 */
/** Sekme ve düğme metinleri. Kit gibi burası da çeviri çekmez, hazır metni alır. */
export type DemoLabels = {
  preview: string;
  code: string;
  copy: string;
  copied: string;
  copyAria: string;
  /** Kaydırılabilir kontrol şeridinin erişilebilir adı. */
  controls: string;
};

export type ControlSpec = Record<string, readonly string[] | boolean>;
export type ControlValues = Record<string, string | boolean>;

function initial(spec: ControlSpec): ControlValues {
  const v: ControlValues = {};
  for (const [k, opt] of Object.entries(spec)) v[k] = Array.isArray(opt) ? opt[0] : Boolean(opt);
  return v;
}

export function Demo({
  children,
  code,
  labels,
  controls,
  render,
  /** kareli zemin: bir bileşenin boşlukta yüzmediğini göstermek için */
  grid = true,
  /** yüksek örnekler için — varsayılan orta hizalı tek satır */
  align = "center",
}: {
  /** Sabit örnek. `controls` verildiğinde `render` kullanılır, bu değil. */
  children?: ReactNode;
  /** Kontroller varken kod da onlara göre değişmeli — yoksa kopyalanan kod yalan olur. */
  code: string | ((v: ControlValues) => string);
  /** Sekme ve düğme metinleri. Kit gibi burası da çeviri çekmez, hazır metni alır. */
  labels: DemoLabels;
  grid?: boolean;
  align?: "center" | "start";
  /**
   * Canlı kontroller. Storybook'un tek gerçek üstünlüğü buydu — `variant`'ı
   * çevirip sonucu görmek. İkinci bir site açmak yerine buraya kondu: iki yüzün
   * bedeli kaymadır, doküman bir şey der Storybook başkasını gösterir.
   */
  controls?: ControlSpec;
  /** Kontroller varken örnek bir FONKSİYONDUR: değerler değişince yeniden çizilir. */
  render?: (v: ControlValues) => ReactNode;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [values, setValues] = useState<ControlValues>(() => initial(controls ?? {}));
  const shown = controls && render ? render(values) : children;
  const source = typeof code === "function" ? code(values) : code;

  async function copy() {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    /* `overflow-hidden` YOK, ve bu bir düzeltme.
       Kutu sekme şeridinin köşelerini kırpsın diye konmuştu, ama açılan her
       paneli de kırpıyordu: Combobox'ın listesi, DatePicker'ın takvimi ve
       MultiSelect'in seçenekleri önizlemenin içinde kesiliyor, yarısı
       görünmüyordu. Z-index sorunu değildi — hiçbir z-index bir `overflow`
       kırpmasını aşamaz. Sekme şeridinin zaten kendi alt kuralı var, yani
       kırpmaya ihtiyacı yoktu. */
    <div className="tamga-card tamga-card-open my-7">
      {/* Sekme şeridi: alt çizgi, kutu değil. Yasa 2'nin bilinçli istisnası —
          bir sekmeyi kutuya almak onu panelden koparır. */}
      <div className="flex items-center gap-1 border-b border-[var(--color-line)] px-2">
        {(
          [
            ["preview", labels.preview],
            ["code", labels.code],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-current={tab === id ? "true" : undefined}
            className="relative px-3 py-2.5 text-small font-medium"
            style={{
              color: tab === id ? "var(--color-ink)" : "var(--color-ink-faint)",
              boxShadow: tab === id ? "inset 0 -2px 0 var(--color-accent-line)" : undefined,
            }}
          >
            {label}
          </button>
        ))}

        <span className="ml-auto">
          <Button size="sm" variant="ghost" onClick={copy} aria-label={labels.copyAria}>
            <Icon icon={copied ? Check : Copy} size="xs" />
            {copied ? labels.copied : labels.copy}
          </Button>
        </span>
      </div>

      {tab === "preview" ? (
        <div
          className={[
            grid ? "docs-grid" : "",
            /* `docs-kit`: örnek kutusunun içi siteye değil KİTE ait. Site
               gövdeye 17px veriyor ve kendi yazı boyutunu yazmayan her kit
               bileşeni onu miras alıyordu; kitin gövde ölçeği 13px. */
            "docs-kit",
            "flex min-h-28 flex-wrap gap-5 px-8 py-9",
            align === "center" ? "items-center justify-center" : "items-start",
          ].join(" ")}
        >
          {shown}
        </div>
      ) : (
        <pre className="docs-code rounded-t-none border-0">{source}</pre>
      )}

      {/* Kontrol şeridi her iki sekmede de duruyor. Kod sekmesindeyken de
          görünmesi bilinçli: değeri değiştirince kopyalanacak kodun da
          değiştiğini görmek, kontrollerin sahte olmadığının kanıtı. */}
      {controls ? (
        /* KONTROL ŞERİDİ KAYIYOR, TAŞMIYOR.

           390 pikselde bu şerit sayfayı 186 piksel taşırıyordu: `flex-wrap`
           SATIRLARI sarıyor ama tek bir `Segmented`ı bölemiyor, ve altı
           seçenekli bir segment tek başına ekrandan geniş. Taşan bir şerit
           BÜTÜN SAYFAYI yatay kaydırılabilir yapıyor — okuyucu metni okurken
           sayfa sağa sola oynuyor.

           `ScrollX` taşmayı kendi içinde tutuyor: kaydırma şeride ait,
           belgeye değil. Kitin kendi bileşeni, ve bu tam olarak var olduğu
           durum. */
        <ScrollX
          label={labels.controls}
          className="flex items-center gap-x-6 gap-y-3 border-t border-[var(--color-line)] px-5 py-3"
        >
          {Object.entries(controls).map(([key, opt]) => (
            <span key={key} className="flex shrink-0 items-center gap-2.5">
              <span className="font-mono text-caption text-ink-faint">{key}</span>
              {Array.isArray(opt) ? (
                <Segmented
                  label={key}
                  value={values[key] as string}
                  onChange={(v) => setValues((s) => ({ ...s, [key]: v }))}
                  options={opt.map((o) => ({ value: o, label: o }))}
                />
              ) : (
                <Switch
                  label={key}
                  on={values[key] as boolean}
                  onChange={(v) => setValues((s) => ({ ...s, [key]: v }))}
                />
              )}
            </span>
          ))}
        </ScrollX>
      ) : null}
    </div>
  );
}
