import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { Combobox } from "./combobox.js";
import { Select } from "./primitives.js";

/* SEÇENEĞİN GÖRSELİ (`media`): kanal türü listesi düz metindi, oysa aynı türler kanal listesinde
   markalarının logosuyla duruyordu; pencere renksiz kalıyordu (bir tüketici ürün, 2026-11-04).
   Görsel listede, seçili seçeneğinki kapalı kutuda da; kapalı seçenekte satırla soluk. */
const logo = (ad: string) => <span data-logo={ad}>{ad[0]}</span>;
const secenekler = [
  { value: "email", label: "E-posta", media: logo("email") },
  { value: "slack", label: "Slack", media: logo("slack") },
  { value: "teams", label: "Teams", media: logo("teams"), disabled: true },
];

describe("Select · media", () => {
  it("her seçeneğin görseli listede etiketin önünde", () => {
    const { getByRole, getAllByRole } = render(
      <Select aria-label="Tür" options={secenekler} placeholder="Tür seç" />,
    );
    fireEvent.click(getByRole("button", { name: "Tür" }));
    const satirlar = getAllByRole("option");
    expect(satirlar.map((s) => s.querySelector("[data-logo]")?.getAttribute("data-logo"))).toEqual([
      "email",
      "slack",
      "teams",
    ]);
    /* Görsel kendi kabında, kanca olarak düğmeye yayılmıyor. */
    expect(satirlar[0]!.getAttribute("media")).toBeNull();
    expect(satirlar[0]!.querySelector(".tamga-option-media [data-logo]")).not.toBeNull();
  });

  it("seçili seçeneğin görseli kapalı kutuda da", () => {
    const { getByRole } = render(
      <Select aria-label="Tür" options={secenekler} value="slack" placeholder="Tür seç" />,
    );
    const kutu = getByRole("button", { name: "Tür" });
    expect(kutu.querySelector('[data-logo="slack"]')).not.toBeNull();
    expect(kutu.textContent).toContain("Slack");
  });

  it("seçim yokken kutuda görsel yok", () => {
    const { getByRole } = render(<Select aria-label="Tür" options={secenekler} placeholder="Tür seç" />);
    expect(getByRole("button", { name: "Tür" }).querySelector("[data-logo]")).toBeNull();
  });

  it("kapalı seçenek seçilemiyor, görseli de satırıyla birlikte duruyor", () => {
    const { getByRole } = render(
      <Select aria-label="Tür" options={secenekler} placeholder="Tür seç" />,
    );
    fireEvent.click(getByRole("button", { name: "Tür" }));
    const teams = getByRole("option", { name: /Teams/ });
    expect((teams as HTMLButtonElement).disabled).toBe(true);
    expect(teams.querySelector(".tamga-option-media")).not.toBeNull();
  });
});

describe("Combobox · media", () => {
  it("listede görsel, seçilinin görseli yazılmazken arama glifinin yerinde", () => {
    const { getByRole, getAllByRole, container } = render(
      <Combobox
        aria-label="Tür"
        options={secenekler}
        value="email"
        placeholder="Ara"
        labels={{ clear: "Temizle", empty: "Sonuç yok", short: "Daha çok yazın", loading: "Yükleniyor" }}
      />,
    );
    /* Kutudaki görsel girdinin solundaki yuvada (listedekiler satırların içinde). */
    const yuva = () => container.querySelector("span.absolute.tamga-option-media");
    expect(yuva()?.querySelector('[data-logo="email"]')).not.toBeNull();
    fireEvent.focus(getByRole("combobox"));
    fireEvent.change(getByRole("combobox"), { target: { value: "s" } });
    /* Yazılınca arama glifi geri geliyor, kutudaki görsel kalkıyor. */
    expect(yuva()).toBeNull();
    const satirlar = getAllByRole("option");
    expect(satirlar.some((s) => s.querySelector('[data-logo="slack"]'))).toBe(true);
  });
});
