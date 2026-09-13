import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PublicTemplate } from "./public-template.js";

/**
 * Kamusal yüzeyler BİRİNİN markasını taşıyor, ve o biri çoğu zaman kiti kuran
 * ürün değil.
 *
 * Korunan sızıntı iki yönlü: kurulan ürünün işareti bir müşterinin beyaz
 * etiketli alan adına taşınması, ya da markası olması gereken bir sayfanın
 * marka-sız çizilmesi. İkisi de sessiz — sayfa kuran kişiye doğru, sahibine
 * yanlış görünüyor.
 */

const LABELS = {
  loading: "Yükleniyor",
  title: "Bir şey ters gitti",
  body: "Tekrar denenebilir.",
  retry: "Tekrar dene",
};

describe("PublicTemplate · bu kimin sayfası", () => {
  it("marka verilmezse hiçbir şey çizmiyor — varsayılanı ürün koyar", () => {
    render(<PublicTemplate title="Durum" labels={LABELS} />);

    const brand = document.querySelector("[data-brand]");
    expect(brand).not.toBeNull();
    /* Kitin kendi işareti YOK ve olmamalı: buraya bir şey koymak, kiti kuran
       her ürünün sayfasına kitin kimliğini basmak olurdu. */
    expect(brand!.querySelector("svg, img")).toBeNull();
  });

  it("beyaz etiketli sayfa sahibin işaretini çiziyor — ek olarak değil, yerine", () => {
    render(<PublicTemplate title="Acme Durum" labels={LABELS} brand={<span data-owner>ACME</span>} />);

    expect(screen.getByText("ACME")).toBeInTheDocument();
    const brand = document.querySelector("[data-brand]");
    expect(brand!.querySelectorAll("[data-owner]")).toHaveLength(1);
  });

  it("uygulama çerçevesi yok — oturumsuz gidilecek bir yer de yok", () => {
    render(<PublicTemplate title="Durum" labels={LABELS} />);
    expect(document.querySelector("[data-nav]")).toBeNull();
  });
});

describe("PublicTemplate · durumlar", () => {
  it("hazır hâl içeriği gösteriyor", () => {
    render(
      <PublicTemplate title="Durum" labels={LABELS}>
        <p>gövde</p>
      </PublicTemplate>,
    );
    expect(screen.getByText("gövde")).toBeInTheDocument();
  });

  it("yüklenirken ve hatada başlık yerinde kalıyor, sayfa başka bir siteye benzemesin diye", () => {
    for (const state of ["loading", "error"] as const) {
      const { unmount } = render(
        <PublicTemplate title="Acme Durum" labels={LABELS} brand={<span>ACME</span>} state={state}>
          <p>gövde</p>
        </PublicTemplate>,
      );
      expect(screen.getByText("ACME")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Acme Durum" })).toBeInTheDocument();
      expect(screen.queryByText("gövde")).not.toBeInTheDocument();
      unmount();
    }
  });

  it("hata zarfın satırını taşıyor", () => {
    render(
      <PublicTemplate
        title="Rapor doğrulama"
        labels={LABELS}
        state="error"
        error={{ code: "not_found", requestId: "req_7" }}
      />,
    );
    expect(screen.getByText("not_found · req_7")).toBeInTheDocument();
  });

  it("alt satır opsiyonel ve verildiği gibi çiziliyor", () => {
    const { unmount } = render(
      <PublicTemplate title="Durum" labels={LABELS} footer={<span>Acme A.Ş.</span>} />,
    );
    expect(screen.getByText("Acme A.Ş.")).toBeInTheDocument();
    unmount();

    render(<PublicTemplate title="Durum" labels={LABELS} />);
    expect(document.querySelector("footer")).toBeNull();
  });
});
