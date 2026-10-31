import { useCallback, useEffect, useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";

/*
 * AÇILAN LİSTE `fixed`, `absolute` DEĞİL · `DropdownMenu`'nün kararının aynısı. Kayan bir kabın
 * (bir yan panelin gövdesi, bir diyaloğun içi) altındaki alan açıldığında liste kabın kenarında
 * kırpılıyordu ve z-index bir kırpmayı aşamaz. Liste alanın genişliğinde, altına yer yoksa ve
 * üstünde varsa üstüne açılıyor; sayfa kayınca yerini yeniliyor.
 */
export function useFixedPanel(
  open: boolean,
  anchor: RefObject<HTMLElement | null>,
  panel: RefObject<HTMLElement | null>,
): CSSProperties | undefined {
  const [style, setStyle] = useState<CSSProperties | undefined>(undefined);
  const olc = useCallback(() => {
    const a = anchor.current;
    const p = panel.current;
    if (!a || !p) return;
    const r = a.getBoundingClientRect();
    const h = p.getBoundingClientRect().height;
    const bosluk = 8;
    const pay = 16;
    const altta = r.bottom + bosluk;
    const ustte = r.top - bosluk - h;
    const sigmiyor = altta + h > window.innerHeight - pay && ustte >= pay;
    setStyle({ position: "fixed", left: r.left, width: r.width, top: sigmiyor ? ustte : altta, marginTop: 0 });
  }, [anchor, panel]);

  useLayoutEffect(() => {
    if (!open) return setStyle(undefined);
    olc();
  }, [open, olc]);

  useEffect(() => {
    if (!open) return;
    const yenile = () => olc();
    window.addEventListener("scroll", yenile, true);
    window.addEventListener("resize", yenile);
    return () => {
      window.removeEventListener("scroll", yenile, true);
      window.removeEventListener("resize", yenile);
    };
  }, [open, olc]);

  return style;
}
