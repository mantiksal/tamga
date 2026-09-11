"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn.js";

/**
 * Oturum öncesi ekranların çerçevesi: giriş · kayıt · sıfırlama · davet.
 *
 * Uygulama çerçevesi taşımıyor, ve kayıtta bir yan panel var girişte yok.
 * Gerekçe: docs/adr/0004-sablon-katmani.md
 */
export function AuthTemplate({
  brand,
  title,
  subtitle,
  children,
  footer,
  aside,
}: {
  /** The brand's mark. The mark, not the wordmark: this screen's job is one field and one button. TR: Markanın işareti. Sözcük markası değil işaret: bu ekranın işi tek alan ve tek düğme. */
  brand?: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /**
   * The panel on the screen's other half. Present on sign-up, absent on sign-in, and the
   * asymmetry is deliberate: the person signing in is a returning user in a hurry; the person
   * signing up is still deciding. Selling something to the first is noise; saying nothing to
   * the second wastes the screen. TR: Ekranın öteki yarısındaki panel. Kayıtta var, girişte
   * yok, ve asimetri kasıtlı: giriş yapan kişi acelesi olan, dönen bir kullanıcı; kaydolan kişi
   * hâlâ karar veriyor. Birinciye bir şey satmak gürültü, ikinciye hiçbir şey dememek ekranı
   * ziyan etmek.
   */
  aside?: ReactNode;
}) {
  const split = aside !== undefined;

  /* Form sütunu. Bölünmüş ekranda KART TAŞIMIYOR: yarının kendisi yüzey, ve bir
     panelin içinde yüzen kart, zaten kenarı olan bir şeyin etrafına çizilmiş
     bir kutudur. */
  /* BAŞLIK BLOĞU BİR BÜTÜN OLARAK HİZALANIYOR.
     Önce işaret sola yaslıydı (`items-start`) ama başlık dışarıdan gelen bir
     `text-center` ile ortalanıyordu: aynı bloğun üç parçası iki farklı hizada
     duruyordu, ve sebebi hiçbirinin kendi kararı değildi. Hizayı düzenin
     kendisi söylüyor: tek sütunda üçü de ortada, bölünmüş ekranda üçü de solda
     — çünkü orada blok bir sütunun başlangıcı, sayfanın merkezi değil. */
  const form = (
    <div className={cn("w-full max-w-96", split ? undefined : "text-center")}>
      <div
        className={cn(
          "mb-7 flex flex-col gap-3",
          split ? "items-start" : "items-center",
        )}
      >
        {brand}
        <div>
          <h1 className="text-title font-semibold text-ink">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-small leading-relaxed text-ink-faint">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {/* Gövde HER ZAMAN SOLA yaslı: bir etiket ortalanmaz, alanının solunda
          durur. Ortalanan şey sayfanın kimliği, doldurulan şey değil. */}
      <div className={cn("text-start", split ? undefined : "tamga-card p-6")}>{children}</div>

      {footer ? <p className="mt-6 text-small text-ink-faint">{footer}</p> : null}
    </div>
  );

  if (!split) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-page px-6 py-12">{form}</div>
    );
  }

  /* İki malzeme, aralarında tek bir sert kenar: bir yanda oturmuş bir kuyu, öte
     yanda çalışılan yüzey. Zeminde yüzen iki kart değil; yarıların kendisi
     zemin. */
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex items-center justify-center bg-page px-6 py-12 sm:px-10">{form}</div>

      {/* lg altında gizli, alt alta değil: sayfanın var olma sebebi form, ve
          telefonda alanlara ulaşmak için kaydırılan bir vaat bir engeldir. */}
      <aside className="tamga-art-well hidden border-l border-edge lg:flex lg:flex-col">
        {aside}
      </aside>
    </div>
  );
}

/**
 * Sağlayıcıyla giriş seçenekleri.
 *
 * Formun ÜSTÜNDE, altında değil: biri hangi yolla kaydolduysa geri de o yolla
 * gelir, ve bunu bir parola alanının altına gömmek ona sahip olmadığı bir
 * parolayı yazdırmaya çalışmak olur. Ayıraç "ya da" diyor, hiçbir şey demiyor
 * değil: üst üste iki düğme yığını tek bir bozuk liste gibi okunuyor.
 */
export function AuthProviders({
  children,
  dividerLabel,
}: {
  children: ReactNode;
  /** The word sitting on the divider. TR: Ayıracın üstündeki sözcük. */
  dividerLabel: string;
}) {
  return (
    <>
      <div className="flex flex-col gap-2">{children}</div>
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-caption text-ink-faint">{dividerLabel}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
    </>
  );
}
