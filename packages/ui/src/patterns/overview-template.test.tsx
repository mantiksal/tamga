import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OverviewTemplate } from "./overview-template.js";

/**
 * Bir kahraman, sonra ızgara.
 *
 * Tuttuğu kural görsel değil YAPISAL: kahraman bölgesi bir kez var, ve kartları
 * şablon diziyor. Kartlarını her ekranın kendi dizmesi, iki farklı özet ekranı
 * demek — v1'in on altı paralel rotasının daha yumuşak hâli.
 */

const LABELS = {
  loading: "Yükleniyor",
  title: "Bir şey ters gitti",
  body: "Tekrar denenebilir.",
  retry: "Tekrar dene",
};

describe("OverviewTemplate", () => {
  it("bir kahraman bölgesi ve bir kart ızgarası çiziyor", () => {
    render(
      <OverviewTemplate title="Özet" labels={LABELS} hero={<p>skor</p>}>
        <p>kart</p>
      </OverviewTemplate>,
    );

    expect(document.querySelectorAll("[data-hero]")).toHaveLength(1);
    expect(document.querySelectorAll("[data-card-grid]")).toHaveLength(1);
    expect(screen.getByText("skor")).toBeInTheDocument();
    expect(screen.getByText("kart")).toBeInTheDocument();
  });

  it("kahramanı olmayan ekran kartlarını yine diziyor — bölge sadece yok", () => {
    render(
      <OverviewTemplate title="Özet" labels={LABELS}>
        <p>kart</p>
      </OverviewTemplate>,
    );

    expect(document.querySelector("[data-hero]")).toBeNull();
    expect(document.querySelector("[data-card-grid]")).not.toBeNull();
  });

  it("yükleme iki bölgeyi birden değiştiriyor ve kart sayısını ayırıyor", () => {
    render(
      <OverviewTemplate title="Özet" labels={LABELS} state="loading" loadingCards={4} hero={<p>skor</p>}>
        <p>kart</p>
      </OverviewTemplate>,
    );

    expect(screen.queryByText("skor")).not.toBeInTheDocument();
    expect(screen.queryByText("kart")).not.toBeInTheDocument();
    expect(document.querySelector('[aria-busy="true"]')).not.toBeNull();
  });

  it("hata içeriğin yerine geçiyor ve zarfın satırını taşıyor", () => {
    render(
      <OverviewTemplate
        title="Özet"
        labels={LABELS}
        state="error"
        error={{ code: "server_error", requestId: "req_1" }}
        hero={<p>skor</p>}
      >
        <p>kart</p>
      </OverviewTemplate>,
    );

    expect(screen.getByText("server_error · req_1")).toBeInTheDocument();
    expect(screen.queryByText("skor")).not.toBeInTheDocument();
  });

  it("başlık şeridi her durumda yerinde", () => {
    for (const state of ["ready", "loading", "error"] as const) {
      const { unmount } = render(
        <OverviewTemplate title="Özet" labels={LABELS} state={state}>
          <p>kart</p>
        </OverviewTemplate>,
      );
      expect(screen.getByRole("heading", { name: "Özet" })).toBeInTheDocument();
      unmount();
    }
  });
});
