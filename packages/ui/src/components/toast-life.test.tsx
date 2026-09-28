import { describe, expect, it, vi, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Toast } from "./overlay.js";

/**
 * Bildirimin ömrü · sayaç görünmeyen bir davranış, o yüzden sayıyla sınanıyor.
 *
 * Gerekçe: docs/gerekce/07-katman-ve-diyalog.md
 */

afterEach(() => {
  vi.useRealTimers();
});

function ilerle(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe("Toast · ömür", () => {
  it("eylemsiz bildirim 5 saniyede gidiyor", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast title="Kaydedildi" dismissLabel="Kapat" onDismiss={onDismiss} />);

    ilerle(4900);
    expect(onDismiss).not.toHaveBeenCalled();
    ilerle(200);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  /* 8 saniye bir zevk değil: "Geri al" gitmeden önce hem OKUNABİLMELİ hem
     ULAŞILABİLMELİ, ve 5 saniye ikisine yetmiyor. */
  it("eylemli bildirim 8 saniye duruyor", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(
      <Toast title="Arşive taşındı" dismissLabel="Kapat" onDismiss={onDismiss} action={<button>Geri al</button>} />,
    );

    ilerle(5200);
    expect(onDismiss).not.toHaveBeenCalled();
    ilerle(3000);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("üstüne gelince sayaç duruyor, çekilince kalan süreden devam ediyor", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast title="Kaydedildi" dismissLabel="Kapat" onDismiss={onDismiss} />);
    const kutu = screen.getByRole("status");

    ilerle(3000);
    fireEvent.pointerEnter(kutu);
    ilerle(20000);
    expect(onDismiss).not.toHaveBeenCalled();

    fireEvent.pointerLeave(kutu);
    ilerle(1900);
    expect(onDismiss).not.toHaveBeenCalled();
    ilerle(200);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("`duration={0}` kapatılana kadar duruyor", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast title="Ödeme alınamadı" dismissLabel="Kapat" onDismiss={onDismiss} duration={0} />);

    ilerle(60000);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  /* Assertive bir bölge, okuyucunun o an okuduğu cümleyi kesiyor: bedeli
     yalnız gerçekten kesmeye değen bildirim ödeyebilir. */
  it("yalnız danger assertive duyuruluyor", () => {
    render(<Toast title="Ödeme alınamadı" tone="danger" dismissLabel="Kapat" />);
    expect(screen.getByRole("alert")).toBeTruthy();

    render(<Toast title="Kaydedildi" tone="positive" dismissLabel="Kapat" />);
    expect(screen.getByRole("status")).toBeTruthy();
  });
});
