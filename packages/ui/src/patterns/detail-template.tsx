"use client";

import type { ReactNode } from "react";
import { Breadcrumb } from "../components/primitives.js";
import { Icon } from "../components/icon.js";
import { Warning } from "../components/icons.js";
import { toneOf } from "../components/tone.js";
import { SkeletonPanel } from "../components/skeleton.js";
import {
  Busy,
  ErrorSlot,
  PlainLink,
  type ErrorLabels,
  type LinkComponent,
  type TemplateError,
} from "./shared.js";

/**
 * Her nesne (detay) ekranının şekli: iz, başlık, eylemler, sekmeler, gövde.
 *
 * Sekmeler rota (bağlantı), durum değil; sekmesiz kullanım "yeni kayıt"
 * ekranıdır. Boş hâli yok. Taslak tutan bir düzenleyici de bağlantıyla geziyor
 * (`?tab=`): taslak sekmede değil ekranda yaşıyor, sekme yalnız bir görünüm. Gerekçe: docs/adr/0004-sablon-katmani.md
 */

export type DetailState = "ready" | "loading" | "error";

export type DetailTab = {
  /** A stable identity; comparisons and tests use this. TR: Kararlı kimlik; karşılaştırma ve testler bununla. */
  key: string;
  /** The translated label: the template draws the word it is given, it does not look one up. TR: Çevrilmiş etiket: şablon kendisine verilen sözcüğü çiziyor, aramıyor. */
  label: string;
  href: string;
  /** How many rows that tab holds ("Events 2"), drawn as the kit's `Tabs` count. TR: O sekmede kaç satır olduğu ("Olaylar 2"), kitin `Tabs` sayacıyla. */
  count?: number;
  /**
   * The tab holds something that stopped a save: the sentence a screen reader hears, like "2 fields
   * have an error". Drawn as a warning mark after the label. A form split over tabs showed its
   * error only on the open tab, and someone who saved from another one saw nothing. TR: Sekmede bir
   * kaydı durduran bir şey var: ekran okuyucunun duyduğu cümle, "2 alanda hata" gibi. Etiketin
   * ardında bir uyarı işareti olarak çiziliyor. Sekmelere bölünmüş bir form hatasını yalnız açık
   * sekmede gösteriyordu, ve başka bir sekmeden kaydeden biri hiçbir şey görmüyordu.
   */
  error?: string;
};

export type DetailTemplateProps = {
  /** The trail above the title. The last item is the current object and takes no href. TR: Başlığın üstündeki iz. Son öğe o anki nesnedir ve href almaz. */
  breadcrumb: { label: string; href?: string }[];
  title: string;
  /**
   * Beside the title, on its line: the object's one-word state (a `StatusChip`). The product's,
   * like `status`; the template keeps only the place. TR: Başlığın yanında, aynı satırda: nesnenin
   * tek sözcüklük hâli (bir `StatusChip`). `status` gibi ürünün; şablon yalnız yerini tutar.
   */
  titleAside?: ReactNode;
  /** Under the title: the object's identity line. TR: Başlığın altı: nesnenin kimlik satırı. */
  subtitle?: string;
  /**
   * Under the identity line: the object's state right now ("running", "shipped", "overdue"). The
   * template keeps only its place and the 8px above it; what goes in is the product's (a
   * `StatusChip`, a short line, a link), so a redesign of the line never touches the kit. On every
   * tab, because the header is. TR: Kimlik satırının altı: nesnenin şu anki hâli ("çalışıyor",
   * "kargoda", "gecikti"). Şablon yalnız yerini ve üstündeki 8px'i tutar; içi ürünündür (bir
   * `StatusChip`, kısa bir satır, bir bağlantı), yani satırın yeniden tasarımı kite dokunmaz. Her
   * sekmede, çünkü başlık her sekmede.
   */
  status?: ReactNode;
  actions?: ReactNode;

  /**
   * Sekmeler. VERİLMEZSE ŞERİT ÇİZİLMİYOR, ve bu bir kolaylık değil bir
   * ihtiyaç: "yeni kayıt" ekranı da bir detay ekranıdır (aynı iz, aynı
   * başlık, aynı eylem şeridi) ama sekmesi yoktur, çünkü henüz bir kayıt
   * yoktur. Boş bir dizi verilse tek başına duran bir çizgi kalıyordu. TR:
   * Tabs. WITHOUT THEM THE STRIP IS NOT DRAWN, and that is a need rather than
   * a convenience: a "new record" screen is a detail screen too (same
   * breadcrumb, same title, same action band) but it has no tabs, because
   * there is no record yet. An empty array left a lone rule hanging.
   */
  tabs?: readonly DetailTab[];
  /** Hangi sekmenin açık olduğu, `key` ile. TR: Which tab is open, by `key`. */
  activeTab?: string;

  state?: DetailState;
  error?: TemplateError;

  linkComponent?: LinkComponent;
  labels: { loading: string; breadcrumb: string; tabs: string } & ErrorLabels;

  /** The body of the open tab. The template does not know which tab it is, and must not. TR: Açık sekmenin gövdesi. Şablon hangi sekme olduğunu bilmiyor, bilmemeli. */
  children?: ReactNode;
};

export function DetailTemplate({
  breadcrumb,
  title,
  titleAside,
  subtitle,
  status,
  actions,
  tabs,
  activeTab,
  state = "ready",
  error,
  linkComponent: Link = PlainLink,
  labels,
  children,
}: DetailTemplateProps) {
  return (
    <div className="flex min-h-0 flex-col" data-detail-state={state}>
      <div className="tamga-gutter pt-4">
        {/* İZ KENDİ SATIRINDA, 12px üstte. Başlıkla aynı bloktayken eylemler izin hizasına
            çıkıyordu ve iz başlığa 6px'le yapışıyordu. */}
        <div className="mb-3">
          <Breadcrumb label={labels.breadcrumb} items={breadcrumb} />
        </div>
        {/* EYLEMLER BAŞLIK BLOĞUNUN ORTASINDA: başlık, kimlik ve durum satırıyla birlikte
            okunan şeyin yanında duruyorlar, iz satırında değil. */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1 basis-65">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="font-display text-display-sm leading-tight font-extrabold break-words text-ink">{title}</h1>
              {titleAside ? <div data-detail-title-aside>{titleAside}</div> : null}
            </div>
            {subtitle ? <p className="mt-1.5 text-body text-ink-soft">{subtitle}</p> : null}
            {/* `div`, not `p`: the product puts a chip, a link or a whole line in here. */}
            {status ? <div className="mt-2" data-detail-status>{status}</div> : null}
          </div>
          {actions ? <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      </div>

      {/* Sekme çubuğu her durumda YERİNDE KALIYOR: hâlâ yüklenen bir nesne yine
          BU nesnedir, ve o otururken gezinmesini oynatmak, iskeletin
          engellemek için var olduğu zıplamanın ta kendisi. */}
      {tabs && tabs.length > 0 ? (
        <nav aria-label={labels.tabs} className="tamga-gutter mt-4 flex gap-6 border-b border-line">
          {tabs.map((tab) => {
            const current = tab.key === activeTab;
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className="tamga-tab"
                data-active={current}
                data-tab={tab.key}
                aria-current={current ? "page" : undefined}
              >
                {tab.label}
                {tab.count !== undefined ? <span className="tamga-sayac tabular-nums">{tab.count}</span> : null}
                {/* GLİF VE CÜMLE: renk tek başına söylemiyor (1.4.1), cümle de görünür
                    satırı uzatmıyor; okuyucu onu sekmenin adıyla birlikte duyuyor. */}
                {tab.error ? (
                  <span className="inline-flex items-center" data-tab-error style={{ color: toneOf("danger").fg }}>
                    <Icon icon={Warning} size="sm" weight="fill" aria-hidden />
                    <span className="sr-only">{tab.error}</span>
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      ) : null}

      <div className="tamga-gutter min-h-0 flex-1 py-6">
        {state === "loading" ? (
          <Busy label={labels.loading}>
            <SkeletonPanel />
          </Busy>
        ) : null}

        {state === "error" ? <ErrorSlot error={error} labels={labels} /> : null}
        {state === "ready" ? children : null}
      </div>
    </div>
  );
}
