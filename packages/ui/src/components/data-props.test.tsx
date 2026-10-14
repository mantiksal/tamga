import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { Card } from "./surface.js";
import { SectionHead } from "./section.js";
import { SkeletonPanel } from "./skeleton.js";
import { Alert, Breadcrumb } from "./primitives.js";
import { ErrorState } from "./error-state.js";
import { ListRow } from "./layout.js";
import { Dialog } from "./overlay.js";
import { Kpi, Badge } from "./display.js";
import { Tabs } from "./tabs.js";
import { LineChart } from "./chart.js";
import { EmptyState } from "./empty-state.js";
import { Avatar } from "./avatar.js";

/**
 * `data-*` HER SUNAN BİLEŞENDEN GEÇER. Burada altı temsilci var; kuralın
 * tamamını `check-data-props` tarıyor. Test kapının ölçemediğini ölçüyor:
 * niteliğin gerçekten DOM'a indiğini.
 *
 * Gerekçe: docs/09-testler-ve-degismezler.md
 */

describe("data-* geçişi", () => {
  it("kart", () => {
    render(<Card data-testid="k">gövde</Card>);
    expect(document.querySelector('[data-testid="k"]')).not.toBeNull();
  });

  it("uyarı · bölüm başlığı · iskelet", () => {
    render(
      <>
        <Alert tone="caution" data-testid="u">dikkat</Alert>
        <SectionHead title="Başlık" data-testid="b" />
        <SkeletonPanel lines={2} data-testid="i" />
      </>,
    );
    for (const id of ["u", "b", "i"]) expect(document.querySelector(`[data-testid="${id}"]`), id).not.toBeNull();
  });

  it("kırıntı yolu · hata hâli", () => {
    render(
      <>
        <Breadcrumb label="nerede" items={[{ label: "Kök", href: "/" }, { label: "Şu an" }]} data-testid="y" />
        <ErrorState title="Ters gitti" description="Tekrar dene" data-testid="h" />
      </>,
    );
    for (const id of ["y", "h"]) expect(document.querySelector(`[data-testid="${id}"]`), id).not.toBeNull();
  });

  it("`aria-*` GEÇMİYOR: bileşenin kendi hesapladığı erişilebilir adı ezemesin", () => {
    // @ts-expect-error — tip de reddediyor, bu satır onu kanıtlıyor
    render(<Card aria-label="ezilmiş">gövde</Card>);
    expect(document.querySelector('[aria-label="ezilmiş"]')).toBeNull();
  });

  /* ÜÇ DAL, ÜÇ KÖK. `ListRow` `href` ile `<a>`, `onClick` ile `<button>`, yoksa
     `<div>` çiziyor ve kanca yalnız ilkinde geçiyordu: panel iki dalda satırın
     etrafına sarmalayıcı `div` koymak zorunda kalmıştı. Kanca kökün kendisinde
     olmalı, hangi kök olursa olsun. */
  it("liste satırı · üç dalda da kanca kökte", () => {
    render(
      <>
        <ListRow href="/a" data-testid="r-a">bağlantı</ListRow>
        <ListRow onClick={() => {}} data-testid="r-b">düğme</ListRow>
        <ListRow data-testid="r-c">düz</ListRow>
      </>,
    );
    const kok = (id: string) => document.querySelector(`[data-testid="${id}"]`);
    expect(kok("r-a")?.tagName).toBe("A");
    expect(kok("r-b")?.tagName).toBe("BUTTON");
    expect(kok("r-c")?.tagName).toBe("DIV");
    for (const id of ["r-a", "r-b", "r-c"]) expect(kok(id)?.classList.contains("tamga-list-row"), id).toBe(true);
  });

  /* KANCA PENCEREDE, BAŞLIK ŞERİDİNDE DEĞİL. `role="dialog"` taşıyan elemanı
     arayan bir test kancayı orada bulmalı; iki diyalog aynı anda açıkken
     ayırt edilebilmenin tek yolu bu. */
  it("diyalog · kanca role=dialog olan elemanda", () => {
    render(
      <Dialog open onClose={() => {}} title="Başlık" closeLabel="Kapat" data-testid="d">
        gövde
      </Dialog>,
    );
    const el = document.querySelector('[data-testid="d"]');
    expect(el).not.toBeNull();
    expect(el?.getAttribute("role")).toBe("dialog");
  });

  /* KÖK, İÇ ELEMAN DEĞİL · ve her dalda. Kapı genişletilince aynı kusur on
     bir bileşende daha çıktı: kanca ya iç bir elemana gidiyordu (grafiğin
     figürü değil içindeki div, rozetin sarmalayıcısı değil sayacı, boş hâlin
     kökü değil başlığı) ya da dalların birinde unutulmuştu. Temsilciler. */
  it("kök · her dal", () => {
    render(
      <>
        <Kpi label="a" value="1" data-testid="k1" />
        <Kpi label="b" value="2" onClick={() => {}} data-testid="k2" />
        <Kpi label="c" value="3" href="/x" data-testid="k3" />
        <Badge count={3} label="n" data-testid="b"><span>x</span></Badge>
        <Tabs label="t" value="a" onChange={() => {}} items={[{ value: "a", label: "A" }]} data-testid="t" />
        <LineChart series={[{ name: "s", values: [1, 2] }]} labels={["1", "2"]} data-testid="l" />
        <EmptyState layout="banner" title="boş" data-testid="e1" />
        <EmptyState layout="ticket" title="boş" data-testid="e2" />
        <Avatar name="Ad" size={24} status="positive" data-testid="av" />
      </>,
    );
    const kok = (id: string) => document.querySelector(`[data-testid="${id}"]`)!;
    expect(kok("k1").tagName).toBe("DIV");
    expect(kok("k2").tagName).toBe("BUTTON");
    expect(kok("k3").tagName).toBe("A");
    expect(kok("b").classList.contains("tamga-badge-wrap")).toBe(true);
    expect(kok("t").getAttribute("role")).toBe("tablist");
    expect(kok("l").tagName).toBe("FIGURE");
    expect(kok("e1").className).toContain("overflow-hidden");
    expect(kok("e2").className).toContain("justify-center");
    expect(kok("av").querySelector("[data-testid]"), "kanca içteki avatara ikinci kez gitmesin").toBeNull();
  });
});
