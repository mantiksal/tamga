import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { DatePicker, DateTimePicker, Calendar } from "./date-picker.js";

/**
 * Açılan takvimin KAPANMA yolları; sınır, klavye ve saat.
 *
 * Dilim: testler makinenin dilimine BAĞLI DEĞİL · `timeZone` açıkça veriliyor
 * ve beklenen değerler o dilime göre yazılı. `TZ=UTC` ve `TZ=Europe/Istanbul`
 * ile ikisi de yeşil olmak zorunda.
 */

const ETIKETLER = { previousMonth: "Önceki ay", nextMonth: "Sonraki ay", open: "Takvimi aç", clear: "Temizle" };
const IST = "Europe/Istanbul";

const ac = (onChange = vi.fn()) => {
  render(<DatePicker locale="tr-TR" value="2026-04-15" onChange={onChange} placeholder="Tarih" labels={ETIKETLER} />);
  fireEvent.click(screen.getByRole("textbox"));
  expect(gun("20")).toBeTruthy();
  return onChange;
};
/* Gün düğmesinin adı artık tam tarih; metniyle buluyoruz. */
const gun = (n: string) => screen.queryAllByRole("gridcell").find((b) => b.textContent === n) as HTMLButtonElement | undefined;
const kapali = () => gun("20") === undefined;

describe("DatePicker · takvim nasıl kapanır", () => {
  it("bir gün seçilince kapanır ve değeri verir", () => {
    const onChange = ac();
    fireEvent.click(gun("20")!);
    expect(onChange).toHaveBeenCalledWith("2026-04-20");
    expect(kapali()).toBe(true);
  });
  it("dışarı tıklayınca kapanır", () => { ac(); fireEvent.mouseDown(document.body); expect(kapali()).toBe(true); });
  it("Escape ile kapanır", () => { ac(); fireEvent.keyDown(document, { key: "Escape" }); expect(kapali()).toBe(true); });
  it("takvimin tıklaması sayfaya sızmaz", () => {
    const ustTiklama = vi.fn();
    render(
      <div onClick={ustTiklama}>
        <DatePicker locale="tr-TR" value="2026-04-15" onChange={vi.fn()} placeholder="Tarih" labels={ETIKETLER} />
      </div>,
    );
    fireEvent.click(screen.getByRole("textbox"));
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

describe("DatePicker · min / max", () => {
  const acSinirli = () => {
    const onChange = vi.fn();
    render(<DatePicker locale="tr-TR" value="2026-04-15" min="2026-04-10" max="2026-04-20" onChange={onChange} placeholder="Tarih" labels={ETIKETLER} />);
    fireEvent.click(screen.getByRole("textbox"));
    return onChange;
  };
  it("aralık dışı günler kapalı ve seçilemiyor", () => {
    const onChange = acSinirli();
    expect(gun("9")).toBeDisabled();
    expect(gun("21")).toBeDisabled();
    fireEvent.click(gun("9")!);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(gun("12")!);
    expect(onChange).toHaveBeenCalledWith("2026-04-12");
  });
  it("ay tümüyle dışarıdaysa ay düğmesi kapanıyor", () => {
    acSinirli();
    expect(screen.getByRole("button", { name: "Önceki ay" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sonraki ay" })).toBeDisabled();
  });
});

describe("Calendar · sekme durağı ve klavye", () => {
  const tabStop = () => screen.getAllByRole("gridcell").find((b) => b.getAttribute("tabindex") === "0");
  it("aya geçince görünen ayda bir sekme durağı kalıyor (eskiden kalmıyordu)", () => {
    render(<Calendar locale="tr-TR" value="2026-04-15" labels={ETIKETLER} />);
    fireEvent.click(screen.getByRole("button", { name: "Sonraki ay" }));
    const durak = tabStop();
    expect(durak).toBeTruthy();
    expect(durak!.getAttribute("data-gun")).toMatch(/^2026-05-/);
  });
  it("seçili gün kapalıysa durak ilk AÇIK güne düşüyor, kapalı güne değil", () => {
    render(<Calendar locale="tr-TR" value="2026-04-15" min="2026-04-17" labels={ETIKETLER} />);
    const durak = tabStop()!;
    expect(durak.getAttribute("data-gun")).toBe("2026-04-17");
    expect(durak).not.toBeDisabled();
  });
  it("oklar kapalı günü atlıyor; Home/End hafta ucu; PageDown sonraki ay", () => {
    render(<Calendar locale="tr-TR" value="2026-04-15" min="2026-04-17" labels={ETIKETLER} />);
    fireEvent.keyDown(tabStop()!, { key: "ArrowRight" });
    expect(tabStop()!.getAttribute("data-gun")).toBe("2026-04-18");
    fireEvent.keyDown(tabStop()!, { key: "End" });
    /* 18 Nisan 2026 Cumartesi; Pazartesi başlayan haftanın sonu Pazar 19. */
    expect(tabStop()!.getAttribute("data-gun")).toBe("2026-04-19");
    fireEvent.keyDown(tabStop()!, { key: "PageDown" });
    expect(tabStop()!.getAttribute("data-gun")).toBe("2026-05-19");
    expect(screen.getByText("Mayıs 2026")).toBeTruthy();
  });
  it("dışarıdan değer değişince durak onunla eşleşiyor", () => {
    const { rerender } = render(<Calendar locale="tr-TR" value="2026-04-15" labels={ETIKETLER} />);
    rerender(<Calendar locale="tr-TR" value="2026-06-03" labels={ETIKETLER} />);
    expect(tabStop()!.getAttribute("data-gun")).toBe("2026-06-03");
    expect(screen.getByText("Haziran 2026")).toBeTruthy();
  });
  it("ızgara deseni: grid, satırlar, tam tarihli ad, aria-selected", () => {
    render(<Calendar locale="tr-TR" value="2026-04-15" labels={ETIKETLER} />);
    expect(screen.getByRole("grid")).toBeTruthy();
    const secili = gun("15")!;
    expect(secili.getAttribute("aria-selected")).toBe("true");
    expect(secili.getAttribute("aria-label")).toMatch(/15 Nisan 2026/);
    expect(secili).not.toHaveAttribute("aria-disabled");
  });
});

describe("DatePicker · alan sözleşmesi", () => {
  it("id ve invalid Input gibi", () => {
    render(<DatePicker id="bitis" invalid locale="tr-TR" onChange={vi.fn()} placeholder="Tarih" labels={ETIKETLER} />);
    const alan = screen.getByRole("textbox");
    expect(alan.id).toBe("bitis");
    expect(alan).toHaveAttribute("aria-invalid", "true");
  });
});

describe("DateTimePicker · dilim", () => {
  const SAATLI = { ...ETIKETLER, hour: "Saat", minute: "Dakika", period: "Öğle" };
  const acSaatli = (props: Partial<React.ComponentProps<typeof DateTimePicker>> = {}) => {
    const onChange = vi.fn();
    render(<DateTimePicker locale="tr-TR" timeZone={IST} value="2026-04-15T14:30:00+03:00" onChange={onChange} placeholder="Zaman" labels={SAATLI} {...props} />);
    fireEvent.click(screen.getByRole("textbox"));
    return onChange;
  };

  it("gün + saat, verilen dilimin ofsetiyle ISO döner · makinenin dilimi ne olursa olsun", () => {
    const onChange = acSaatli();
    fireEvent.click(gun("20")!);
    expect(onChange).toHaveBeenCalledWith("2026-04-20T14:30:00+03:00");
    expect(gun("20")).toBeTruthy();
  });

  it("gösterim verilen dilimde: UTC 22:30, İstanbul'da ertesi gün 01:30", () => {
    render(<DateTimePicker locale="tr-TR" timeZone={IST} value="2026-04-15T22:30:00Z" onChange={vi.fn()} placeholder="Zaman" labels={SAATLI} />);
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toMatch(/16 Nis 2026 01:30/);
  });

  it("min aynı günse önceki saatler sunulmuyor; gün seçimi saati sınıra kısıyor", () => {
    /* Bileşen KONTROLLÜ: seçenekler `value`dan türüyor, o yüzden gerçek bir
       sahip gibi değeri geri veriyoruz. Değer 20 Nisan 14:30, min 15 Nisan
       16:00; min gününe tıklanınca eldeki 14:30 sınırın altında → 16:00'a kısılır. */
    const onChange = vi.fn();
    function Sahip() {
      const [v, setV] = useState<string | undefined>("2026-04-20T14:30:00+03:00");
      return (
        <DateTimePicker locale="tr-TR" timeZone={IST} value={v} min="2026-04-15T16:00:00+03:00" onChange={(n) => { onChange(n); setV(n); }} placeholder="Zaman" labels={SAATLI} />
      );
    }
    render(<Sahip />);
    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(gun("15")!);
    expect(onChange).toHaveBeenLastCalledWith("2026-04-15T16:00:00+03:00");
    fireEvent.click(screen.getByRole("button", { name: "Saat" }));
    expect(screen.queryByRole("option", { name: "15" })).toBeNull();
    expect(screen.getByRole("option", { name: "16" })).toBeTruthy();
  });

  it("saat değişince dakika yeniden denetleniyor: min 12:30, saat 12'ye inince 12:10 değil 12:30", () => {
    const onChange = acSaatli({ value: "2026-04-15T14:10:00+03:00", min: "2026-04-15T12:30:00+03:00" });
    fireEvent.click(screen.getByRole("button", { name: "Saat" }));
    fireEvent.click(screen.getByRole("option", { name: "12" }));
    expect(onChange).toHaveBeenLastCalledWith("2026-04-15T12:30:00+03:00");
  });

  it("max'ı delen seçim kısılıyor", () => {
    const onChange = acSaatli({ value: "2026-04-15T14:30:00+03:00", max: "2026-04-15T15:20:00+03:00" });
    fireEvent.click(screen.getByRole("button", { name: "Saat" }));
    fireEvent.click(screen.getByRole("option", { name: "15" }));
    expect(onChange).toHaveBeenLastCalledWith("2026-04-15T15:20:00+03:00");
  });

  it("adıma uymayan dışarıdan gelen dakika seçeneklere ekleniyor; geçerli dakikası olmayan saat sunulmuyor", () => {
    acSaatli({ value: "2026-04-15T14:07:00+03:00", min: "2026-04-15T14:00:00+03:00", max: "2026-04-15T15:02:00+03:00" });
    fireEvent.click(screen.getByRole("button", { name: "Dakika" }));
    expect(screen.getByRole("option", { name: "07" })).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByRole("button", { name: "Saat" }));
    /* 15:00 sunulabilir (15:00 ≤ 15:02), 16 asla; min 14:58 olsa 14 de düşerdi. */
    expect(screen.getByRole("option", { name: "15" })).toBeTruthy();
    expect(screen.queryByRole("option", { name: "16" })).toBeNull();
  });

  it("DST: olmayan saat sunulmuyor (Berlin, 29 Mart 2026 02:xx)", () => {
    render(<DateTimePicker locale="de-DE" timeZone="Europe/Berlin" value="2026-03-29T01:30:00+01:00" onChange={vi.fn()} placeholder="Zeit" labels={{ ...SAATLI, hour: "Stunde", minute: "Minute", period: "Periode" }} />);
    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByRole("button", { name: "Stunde" }));
    expect(screen.queryByRole("option", { name: "02" })).toBeNull();
    expect(screen.getByRole("option", { name: "03" })).toBeTruthy();
  });

  it("DST: belirsiz saat (Berlin, 25 Ekim 2026 02:30) SONRAKİ ofsetle, +01:00", () => {
    const onChange = vi.fn();
    render(<DateTimePicker locale="de-DE" timeZone="Europe/Berlin" value="2026-10-25T02:30:00+02:00" onChange={onChange} placeholder="Zeit" labels={{ ...SAATLI, hour: "Stunde", minute: "Minute", period: "Periode" }} />);
    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(gun("25")!);
    expect(onChange).toHaveBeenLastCalledWith("2026-10-25T02:30:00+01:00");
  });

  it("12 saatlik yerelde öğle sözcükleri Intl'den, ve değişim kısılıyor", () => {
    const onChange = vi.fn();
    render(<DateTimePicker locale="en-US" timeZone={IST} value="2026-04-15T09:30:00+03:00" max="2026-04-15T20:00:00+03:00" onChange={onChange} placeholder="Time" labels={{ ...SAATLI, period: "Period" }} />);
    fireEvent.click(screen.getByRole("textbox"));
    fireEvent.click(screen.getByRole("button", { name: "Period" }));
    fireEvent.click(screen.getByRole("option", { name: "PM" }));
    /* 09:30 → 21:30 max'ı deler → 20:00'a kısılır. */
    expect(onChange).toHaveBeenLastCalledWith("2026-04-15T20:00:00+03:00");
  });
});
