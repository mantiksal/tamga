import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { DropdownMenu } from "./overlay.js";

/* KAYDIRMA KAPATMIYOR. 0.18.0'da sayfa ya da bir kap kayınca menü kapanıyordu; tablo içindeki
   her menü açılır açılmaz kapandı, çünkü odak ilk öğeye geçince tarayıcı tablonun kabını
   kaydırıyordu. Menü tetikleyiciyi izler, tetikleyici görünür alandan çıkınca kapanır. */
describe("DropdownMenu · kaydırma", () => {
  it("bir kap kayınca açık kalır", () => {
    const { container, getByRole, queryByRole } = render(
      <div data-kap style={{ overflowX: "auto" }}>
        <DropdownMenu
          trigger={<button type="button">İşlemler</button>}
          items={[{ label: "Çöz" }, { label: "Onayla" }]}
        />
      </div>,
    );
    fireEvent.click(getByRole("button", { name: "İşlemler" }));
    expect(queryByRole("menu")).not.toBeNull();
    fireEvent.scroll(container.querySelector("[data-kap]")!);
    expect(queryByRole("menu")).not.toBeNull();
  });
});
