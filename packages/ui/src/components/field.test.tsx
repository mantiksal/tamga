import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field, Input } from "../index.js";

/* ETİKET GİRİŞLE AYNI BOYDA (14,5 px), aralık 8 px. 13 px'lik etiket, alanlar
   arası boşluk açılınca giriş yazısının yanında küçük kalıyordu (Berika,
   2026-10-26). Etiketle kontrol arası 8 px; kontrolle alttaki yardım/hata metni
   arası 6 px kalıyor: yardım kutuya ait, etiket alanın başlığı. Sağ not sessiz. */
describe("Field · etiket boyu ve aralık", () => {
  it("etiket text-body font-bold; satır kontrolden 8 px (gap 6 + mb 2); not text-caption", () => {
    const { container } = render(
      <Field label="Ad" htmlFor="ad" note="isteğe bağlı" info={<span>i</span>} description="Yardım">
        <Input id="ad" />
      </Field>,
    );
    const etiket = screen.getByText("Ad");
    expect(etiket.tagName).toBe("LABEL");
    expect(etiket.className).toBe("text-body font-bold text-ink");
    const satir = etiket.parentElement!;
    expect(satir.className).toMatch(/\bmb-0\.5\b/);
    expect(satir.className).toMatch(/items-baseline/);
    expect(container.firstElementChild!.className).toBe("flex flex-col gap-1.5");
    expect(screen.getByText("isteğe bağlı").className).toMatch(/text-caption/);
  });
});
