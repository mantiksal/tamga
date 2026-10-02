import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DatePicker } from "./date-picker.js";

/**
 * Açılan takvimin KAPANMA yolları.
 *
 * Üçü de ürün tarafında bulundu ve ikisi kitte hiç yoktu: takvimin tek çıkışı
 * bir tarih seçmekti. Yanlışlıkla açan kişi ya istemediği bir tarihi seçiyor ya
 * da alanı yeniden tıklamayı keşfediyordu.
 */

const ETIKETLER = {
  previousMonth: "Önceki ay",
  nextMonth: "Sonraki ay",
  open: "Takvimi aç",
  clear: "Temizle",
};

const ac = (onChange = vi.fn()) => {
  render(
    <DatePicker locale="tr-TR" value="2026-04-15" onChange={onChange} placeholder="Tarih" labels={ETIKETLER} />,
  );
  fireEvent.click(screen.getByRole("textbox"));
  /* 15 Nisan 2026 bir Çarşamba; takvim o ayı açıyor. */
  expect(screen.getByRole("button", { name: "20" })).toBeTruthy();
  return onChange;
};

const kapali = () => screen.queryByRole("button", { name: "20" }) === null;

describe("DatePicker · takvim nasıl kapanır", () => {
  it("bir gün seçilince kapanır ve değeri verir", () => {
    const onChange = ac();
    fireEvent.click(screen.getByRole("button", { name: "20" }));
    expect(onChange).toHaveBeenCalledWith("2026-04-20");
    expect(kapali()).toBe(true);
  });

  it("dışarı tıklayınca kapanır", () => {
    ac();
    fireEvent.mouseDown(document.body);
    expect(kapali()).toBe(true);
  });

  it("Escape ile kapanır", () => {
    ac();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(kapali()).toBe(true);
  });

  it("takvimin tıklaması sayfaya sızmaz", () => {
    /* `<label>` İLE SARILMIŞ BİR ALANIN KUSURU BURADAN GELİYOR: tarayıcı,
       etiketin içinde kalan ve kendisi tıklanabilir olmayan bir yere yapılan
       tıklamayı input'a yönlendiriyor · takvimin boşluğu tam olarak öyle bir
       yer. Tıklama kutunun dışına çıkmazsa yönlendirme de olmuyor. */
    const ustTiklama = vi.fn();
    const onChange = vi.fn();
    render(
      <div onClick={ustTiklama}>
        <DatePicker locale="tr-TR" value="2026-04-15" onChange={onChange} placeholder="Tarih" labels={ETIKETLER} />
      </div>,
    );
    fireEvent.click(screen.getByRole("textbox"));
    /* Alanı AÇAN tıklama elbette sayfaya ulaşıyor; ölçülen şey ondan sonrası. */
    ustTiklama.mockClear();
    fireEvent.click(screen.getByText("Nisan 2026"));
    expect(ustTiklama).not.toHaveBeenCalled();
  });

  it("alanın kendi içine tıklamak kapatmaz · tetik dışarı sayılmaz", () => {
    ac();
    fireEvent.mouseDown(screen.getByRole("button", { name: "Sonraki ay" }));
    expect(kapali()).toBe(false);
  });
});
