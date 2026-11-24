import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { Progress } from "./progress.js";
import { Collapsible } from "./disclosure.js";
import { AuthTemplate } from "../patterns/auth-template.js";

/* Bir ürünün kiti dışarıdan yamaladığı beş yer kitin kendisine geçti (2026-11-24). Her biri
   bir yamanın yerini tutuyor; yama silinince davranış buradan gelir. */
const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");

describe("Progress blocks · dolu hücrelerin hepsi tek renk", () => {
  it("son dolu hücre açık tonda boyanmıyor", () => {
    expect(css).not.toMatch(/\.tamga-progress-blok\[data-son\]\s*\{/);
  });
  it("tone verilince dolu hücreler onun rengini alıyor", () => {
    render(<Progress look="blocks" blocks={3} value={34} tone="danger" ariaLabel="kota" />);
    const yol = screen.getByRole("progressbar") as HTMLElement;
    expect(yol.style.getPropertyValue("--tamga-progress-blok-dolu")).toContain("critical");
    expect(css).toMatch(/background:\s*var\(--tamga-progress-blok-dolu,\s*var\(--color-accent\)\)/);
  });
});

describe("Collapsible printOpen · kâğıtta açık", () => {
  it("kökte işaret, baskıda gövdenin hidden'ı kalkar", () => {
    const { container } = render(
      <Collapsible title="Geçti" printOpen>
        <p>gövde</p>
      </Collapsible>,
    );
    expect(container.querySelector(".tamga-collapsible[data-print-open]")).not.toBeNull();
    expect(css).toMatch(/\.tamga-collapsible\[data-print-open\] > \[hidden\]\s*\{\s*display: block !important/);
  });
});

describe("Satır içi Alert · başlık gövdeden ayrı", () => {
  it("16 px, yarı kalın", () => {
    expect(css).toMatch(
      /\.tamga-alert:not\(\[data-look\]\) \.tamga-alert-baslik \{[^}]*font-size: 1rem;[^}]*font-weight: var\(--weight-label\)/,
    );
  });
});

describe("AuthTemplate width", () => {
  it("wide 32rem (max-w-lg), varsayılan 24rem", () => {
    const { container, rerender } = render(
      <AuthTemplate title="Kayıt" width="wide">
        <form />
      </AuthTemplate>,
    );
    expect(container.querySelector(".max-w-lg")).not.toBeNull();
    rerender(
      <AuthTemplate title="Kayıt">
        <form />
      </AuthTemplate>,
    );
    expect(container.querySelector(".max-w-96")).not.toBeNull();
  });
});
