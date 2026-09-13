import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListTemplate } from "./list-template.js";

/**
 * Dört durum şablonun işi, ve aynı anda tam bir tanesi görünüyor.
 *
 * Korunan hata, elle yazılan her liste ekranının yaptığı hata: tablonun
 * arkasında kalan bir iskelet, gerçek satırların altında bir an parlayan boş
 * hâl, ya da yerine geçtiği içeriğin yanına çizilen bir hata. Üçü de mutlu
 * yolda görünmez ve kullanıcıya en kötü anda görünür.
 */

const body = <p>tablo</p>;
const empty = <p>henüz kayıt yok</p>;

const LABELS = {
  loading: "Yükleniyor",
  title: "Bir şey ters gitti",
  body: "Tekrar denenebilir.",
  retry: "Tekrar dene",
};

describe("ListTemplate · aynı anda tek durum", () => {
  it("hazır hâl çağıranın içeriğini gösteriyor, başka bir şey değil", () => {
    render(
      <ListTemplate title="Kayıtlar" labels={LABELS} empty={empty}>
        {body}
      </ListTemplate>,
    );

    expect(screen.getByText("tablo")).toBeInTheDocument();
    expect(screen.queryByText("henüz kayıt yok")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("yükleme içeriğin ARKASINA değil, YERİNE geçiyor", () => {
    render(
      <ListTemplate title="Kayıtlar" labels={LABELS} state="loading">
        {body}
      </ListTemplate>,
    );

    expect(screen.queryByText("tablo")).not.toBeInTheDocument();
    expect(document.querySelector('[aria-busy="true"]')).not.toBeNull();
  });

  it("boş hâl ekranın kendi cümlesini çiziyor, şablonunkini değil", () => {
    render(
      <ListTemplate title="Kayıtlar" labels={LABELS} state="empty" empty={empty}>
        {body}
      </ListTemplate>,
    );

    expect(screen.getByText("henüz kayıt yok")).toBeInTheDocument();
    expect(screen.queryByText("tablo")).not.toBeInTheDocument();
  });

  it("başlık şeridi ve filtreler her durumu atlatıyor — yalnız içerik bölgesi değişiyor", () => {
    const filters = <p>filtreler</p>;
    for (const state of ["ready", "loading", "empty", "error"] as const) {
      const { unmount } = render(
        <ListTemplate title="Kayıtlar" labels={LABELS} filters={filters} state={state} empty={empty}>
          {body}
        </ListTemplate>,
      );
      expect(screen.getByRole("heading", { name: "Kayıtlar" })).toBeInTheDocument();
      expect(screen.getByText("filtreler")).toBeInTheDocument();
      unmount();
    }
  });
});

describe("ListTemplate · hata satırı zarfın kendisi", () => {
  it("`code · request_id` yazıyor — desteğin üzerinde işlem yapabileceği iki alan", () => {
    render(
      <ListTemplate
        title="Kayıtlar"
        labels={LABELS}
        state="error"
        error={{ code: "server_error", requestId: "req_8f2a41c9" }}
      />,
    );

    expect(screen.getByText("server_error · req_8f2a41c9")).toBeInTheDocument();
  });

  it("istek kimliği olmayan zarf da düzgün okunuyor", () => {
    render(<ListTemplate title="Kayıtlar" labels={LABELS} state="error" error={{ code: "server_error" }} />);

    /* Boşta kalan ayraç yok: satır, VAR OLAN alanların birleşimi — delikli bir kalıp değil. */
    expect(screen.getByText("server_error")).toBeInTheDocument();
  });

  it("tekrar dene yalnız çağıran gerçekten deneyebiliyorsa çıkıyor", () => {
    const onRetry = vi.fn();
    const { unmount } = render(
      <ListTemplate title="Kayıtlar" labels={LABELS} state="error" error={{ code: "server_error", onRetry }} />,
    );
    screen.getByRole("button", { name: /tekrar dene/i }).click();
    expect(onRetry).toHaveBeenCalledOnce();
    unmount();

    render(<ListTemplate title="Kayıtlar" labels={LABELS} state="error" error={{ code: "server_error" }} />);
    expect(screen.queryByRole("button", { name: /tekrar dene/i })).not.toBeInTheDocument();
  });
});
