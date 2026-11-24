import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListRow } from "./layout.js";

/* YÖNLENDİRİCİNİN BAĞLANTISI: href'li satır düz <a> çiziyordu, uygulama içi gezinme sayfayı
   yeniden yüklüyordu. Link ve Card ile aynı sözleşme. */
describe("ListRow · linkComponent", () => {
  it("verilince satır onunla çiziliyor, href ve sınıf geçiyor; verilmezse düz a", () => {
    const Router = ({ href, className, children, ...rest }: { href: string; className?: string; children?: React.ReactNode; [k: string]: unknown }) => (
      <a {...rest} href={href} className={className} data-router>{children}</a>
    );
    render(
      <>
        <ListRow href="/a" linkComponent={Router} data-testid="r">Yönlendirici</ListRow>
        <ListRow href="/b">Düz</ListRow>
      </>,
    );
    const r = screen.getByRole("link", { name: "Yönlendirici" });
    expect(r.hasAttribute("data-router")).toBe(true);
    expect(r.className).toContain("tamga-list-row");
    expect(screen.getByTestId("r")).toBe(r);
    expect(screen.getByRole("link", { name: "Düz" }).hasAttribute("data-router")).toBe(false);
  });
});
