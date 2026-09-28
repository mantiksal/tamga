"use client";

import { useState, type ReactNode } from "react";
import { Icon, ScrollX, Segmented, Switch } from "tamga-ui";
import { Check, Code, Copy, Eye, HandPointing } from "tamga-ui/icons";

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
  /** Kontrol şeridinin başlığı: "Dene". */
  try: string;
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
  dene,
  render,
  /** noktalı zemin: bir bileşenin boşlukta yüzmediğini göstermek için */
  grid = true,
  /**
   * Önizlemede bileşenin altına bir KART koyar.
   *
   * Normalde bir kartın içinde yaşayan şeyler için (grafik, kırıntı yolu,
   * tablo): noktalı zeminin üstünde tek başına duran bir grafik, gerçek
   * panelde hiç görünmeyeceği bir hâlde gösterilmiş olur.
   */
  yuzey = false,
  /** yüksek örnekler için — varsayılan orta hizalı tek satır */
  align = "center",
  ipucu,
}: {
  /** Sabit örnek. `controls` verildiğinde `render` kullanılır, bu değil. */
  children?: ReactNode;
  /** Kontroller varken kod da onlara göre değişmeli — yoksa kopyalanan kod yalan olur. */
  code: string | ((v: ControlValues) => string);
  /** Sekme ve düğme metinleri. Kit gibi burası da çeviri çekmez, hazır metni alır. */
  labels: DemoLabels;
  grid?: boolean;
  yuzey?: boolean;
  /**
   * Kutunun altındaki tek satır: örnekte NE YAPILACAĞI ya da neye bakılacağı.
   *
   * Bir demo çoğu zaman kendi kendini anlatmıyor: "Oynat" düğmesi duruyor ama
   * basınca ne olacağını ve neye dikkat edileceğini söyleyen bir şey yok.
   * Paragrafa yazmak işe yaramıyor · satır kutunun İÇİNDE, içeriğe en yakın
   * yerde duruyor.
   */
  ipucu?: ReactNode;
  align?: "center" | "start";
  /**
   * Canlı kontroller. Storybook'un tek gerçek üstünlüğü buydu — `variant`'ı
   * çevirip sonucu görmek. İkinci bir site açmak yerine buraya kondu: iki yüzün
   * bedeli kaymadır, doküman bir şey der Storybook başkasını gösterir.
   */
  controls?: ControlSpec;
  /**
   * "Dene" şeridine giren ÖZEL kontroller.
   *
   * `controls` sonlu seçenek kümeleri ve açık/kapalı için; bir sayaç ya da bir
   * kısayol düğmesi o kalıba girmiyor. Bu prop verildiğinde demo kendi
   * durumunu kendi tutuyor ve şerit onun düğmelerini taşıyor.
   */
  dene?: ReactNode;
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
    <div className="docs-demo tamga-card-open">
      {/* ŞERİT BİR SEGMENT TAŞIYOR, alt çizgili sekme değil: bu ikisi bir
          panelin bölümleri değil, aynı şeyin İKİ GÖRÜNÜMÜ. Küçük boy, çünkü
          burası bir ARAÇ ÇUBUĞU: taban boy şeridi içeriğinden uzun yapıyor. */}
      <div className="docs-demo-bar">
        <Segmented
          size="sm"
          label={labels.controls}
          value={tab}
          onChange={(v) => setTab(v)}
          options={[
            {
              value: "preview" as const,
              label: (
                <>
                  <Icon icon={Eye} size="xs" weight="duotone" />
                  {labels.preview}
                </>
              ),
            },
            {
              value: "code" as const,
              label: (
                <>
                  <Icon icon={Code} size="xs" weight="duotone" />
                  {labels.code}
                </>
              ),
            },
          ]}
        />
        {/* Kopyala şeridin kendi ölçüsünde (28px): kitin küçük düğmesi 32 ve
            yanındaki segmentten uzun kalıyor. */}
        <button type="button" className="docs-demo-kopya ml-auto" onClick={copy} aria-label={labels.copyAria}>
          <Icon icon={copied ? Check : Copy} size="xs" weight="bold" />
          {copied ? labels.copied : labels.copy}
        </button>
      </div>

      {tab === "preview" ? (
        <div
          className={[
            grid ? "docs-demo-grid" : "",
            /* `docs-kit`: örnek kutusunun içi siteye değil KİTE ait. Site
               gövdeye kendi okuma ölçeğini veriyor ve kendi yazı boyutunu
               yazmayan her kit bileşeni onu miras alıyordu; kitin gövde ölçeği
               13px. */
            "docs-kit",
            "flex min-h-32 flex-wrap gap-x-10 gap-y-6 px-(--docs-govde-pad) py-9",
            align === "center" ? "items-center justify-center" : "items-start",
          ].join(" ")}
        >
          {yuzey ? <div className="tamga-card w-full px-6 py-5">{shown}</div> : shown}
        </div>
      ) : (
        <pre className="docs-cb-pre" style={{ background: "var(--color-inverse)" }}>
          {source}
        </pre>
      )}

      {ipucu ? (
        <p className="docs-demo-ipucu">
          <Icon icon={HandPointing} size="sm" weight="duotone" />
          {ipucu}
        </p>
      ) : null}

      {/* Kontrol şeridi her iki sekmede de duruyor. Kod sekmesindeyken de
          görünmesi bilinçli: değeri değiştirince kopyalanacak kodun da
          değiştiğini görmek, kontrollerin sahte olmadığının kanıtı. */}
      {controls || dene ? (
        /* KONTROL ŞERİDİ KAYIYOR, TAŞMIYOR.

           390 pikselde bu şerit sayfayı 186 piksel taşırıyordu: `flex-wrap`
           SATIRLARI sarıyor ama tek bir `Segmented`ı bölemiyor, ve altı
           seçenekli bir segment tek başına ekrandan geniş. Taşan bir şerit
           BÜTÜN SAYFAYI yatay kaydırılabilir yapıyor — okuyucu metni okurken
           sayfa sağa sola oynuyor.

           `ScrollX` taşmayı kendi içinde tutuyor: kaydırma şeride ait,
           belgeye değil. Kitin kendi bileşeni, ve bu tam olarak var olduğu
           durum. */
        <ScrollX label={labels.try} className="docs-demo-dene">
          <span className="docs-nav-baslik shrink-0 !px-0">{labels.try}</span>
          {dene}
          {Object.entries(controls ?? {}).map(([key, opt]) => (
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
