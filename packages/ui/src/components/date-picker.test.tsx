import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DatePicker, DateTimePicker } from "./date-picker.js";

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

/**
 * SINIR VE SAAT. Ürün iki yerde tarayıcının kendi alanına düşmüştü: "bugünden
 * önce olmaz" diyen bir bitiş tarihi ve tarih+saat isteyen bir bakım penceresi.
 * Tarayıcı alanı her yerelde başka görünür ve kitin "takvim tek giriş yolu"
 * kararıyla çelişir. Burada: aralık dışı gün seçilemez, klavye onu atlar, saatli
 * değer dilimiyle döner.
 */
describe("DatePicker · min / max", () => {
  const acSinirli = () => {
    const onChange = vi.fn();
    render(
      <DatePicker locale="tr-TR" value="2026-04-15" min="2026-04-10" max="2026-04-20" onChange={onChange} placeholder="Tarih" labels={ETIKETLER} />,
    );
    fireEvent.click(screen.getByRole("textbox"));
    return onChange;
  };

  it("aralık dışı günler kapalı ve seçilemiyor", () => {
    const onChange = acSinirli();
    const dokuz = screen.getByRole("button", { name: "9" });
    const yirmiBir = screen.getByRole("button", { name: "21" });
    expect(dokuz).toBeDisabled();
    expect(dokuz).toHaveAttribute("aria-disabled", "true");
    expect(yirmiBir).toBeDisabled();
    fireEvent.click(dokuz);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "12" }));
    expect(onChange).toHaveBeenCalledWith("2026-04-12");
  });

  it("ay tümüyle dışarıdaysa ay düğmesi kapanıyor", () => {
    acSinirli();
    /* Mart'ın tamamı 10 Nisan'dan önce, Mayıs'ın tamamı 20 Nisan'dan sonra. */
    expect(screen.getByRole("button", { name: "Önceki ay" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sonraki ay" })).toBeDisabled();
  });

  it("klavye kapalı günü atlıyor", () => {
    const onChange = vi.fn();
    render(
      <DatePicker locale="tr-TR" value="2026-04-15" min="2026-04-17" onChange={onChange} placeholder="Tarih" labels={ETIKETLER} />,
    );
    fireEvent.click(screen.getByRole("textbox"));
    /* Seçili 15 odakta; 16 kapalı, sağ ok 17'ye atlamalı. */
    const onBes = screen.getByRole("button", { name: "15" });
    expect(onBes).toHaveAttribute("tabindex", "0");
    fireEvent.keyDown(onBes, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "17" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("button", { name: "16" })).toHaveAttribute("tabindex", "-1");
  });
});

describe("DateTimePicker", () => {
  const SAATLI = { ...ETIKETLER, hour: "Saat", minute: "Dakika", period: "Öğle" };

  it("gün + saat, kullanıcının dilimiyle ISO döner", () => {
    const onChange = vi.fn();
    render(
      <DateTimePicker locale="tr-TR" value="2026-04-15T14:30:00+03:00" onChange={onChange} placeholder="Zaman" labels={SAATLI} />,
    );
    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByRole("button", { name: "20" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    const v = onChange.mock.calls[0]![0] as string;
    /* Biçim dilimli ISO; an, yerel 20 Nisan 14:30'a eşit · makinenin dilimi ne olursa olsun. */
    expect(v).toMatch(/^2026-04-20T14:30:00[+-]\d\d:\d\d$/);
    expect(new Date(v).getTime()).toBe(new Date(2026, 3, 20, 14, 30).getTime());
    /* Takvim AÇIK KALIYOR: saat daha seçilecek. */
    expect(screen.getByRole("button", { name: "20" })).toBeTruthy();
  });

  it("min aynı günse önceki saatler sunulmuyor", () => {
    render(
      <DateTimePicker
        locale="tr-TR"
        value="2026-04-15T14:30:00+03:00"
        min="2026-04-15T12:00:00+03:00"
        onChange={vi.fn()}
        placeholder="Zaman"
        labels={SAATLI}
      />,
    );
    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByRole("button", { name: "Saat" }));
    expect(screen.queryByRole("option", { name: "11" })).toBeNull();
    expect(screen.getByRole("option", { name: "12" })).toBeTruthy();
    /* 14 Nisan kapalı, 15 Nisan açık. */
    expect(screen.getByRole("button", { name: "14" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "15" })).not.toBeDisabled();
  });
});
