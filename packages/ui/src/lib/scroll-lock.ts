import { useEffect } from "react";

/**
 * Modal açıkken arkadaki sayfanın kaymasını durdurur.
 *
 * NEDEN VAR. `Sheet` ve `Dialog` odağı hapsediyordu ve Escape'i dinliyordu ama
 * arkadaki sayfa kaymaya devam ediyordu. Kullanıcı panel açıkken tekerleği
 * çevirdiğinde arkadaki liste kayıyor, panel kapandığında da kendini bambaşka
 * bir yerde buluyordu. Odak zaten hapsedildiği için arkayla ETKİLEŞEMİYOR;
 * kaydırabilmesi bir yetenek değil, bir kaçak.
 *
 * ÇUBUK GENİŞLİĞİ TELAFİ EDİLİYOR. `overflow: hidden` kaydırma çubuğunu
 * kaldırıyor, ve çubuk kaybolunca sayfa o kadar genişleyip SIÇRIYOR. Kaybolan
 * genişlik kadar sağdan dolgu veriliyor; kapanınca geri alınıyor.
 *
 * PANELİN KENDİSİ KAYAR. Bu kilit yalnız `body`ye bakıyor; panelin gövdesi
 * kendi `overflow-y: auto` kabında, yani içeriği ekrandan uzunsa yine
 * okunabiliyor. Her şeyi birden kilitlemek erişilebilirlik hatası olurdu.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const { overflow, paddingRight } = document.body.style;
    const bosluk = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (bosluk > 0) document.body.style.paddingRight = `${bosluk}px`;

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [active]);
}
