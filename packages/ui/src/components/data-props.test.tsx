import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { Card } from "./surface.js";
import { SectionHead } from "./section.js";
import { SkeletonPanel } from "./skeleton.js";
import { Alert, Breadcrumb } from "./primitives.js";
import { ErrorState } from "./error-state.js";

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
});
