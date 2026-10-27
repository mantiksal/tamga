import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DetailTemplate } from "./detail-template.js";

/**
 * Bir detay ekranının çerçevesi, gövdesi ne yaparsa yapsın yerinde kalıyor.
 *
 * SEKMELER ÇÖZÜLMÜŞ GELİYOR ve bu bilinçli: hangi sekmelerin olduğu, nereye
 * gittikleri ve ne yazdıkları ürünün kilitli kararı. Şablon o kararı tanımıyor,
 * yalnız verilen listeyi çiziyor — o yüzden buradaki testler "doğru sekmeler mi"
 * diye sormuyor, "verilen liste doğru çiziliyor mu" diye soruyor. İlk soru
 * kararı veren ürünün kendi testinin işi.
 */

const trail = [{ label: "Kayıtlar", href: "/records" }, { label: "bir-kayit" }];

const tabs = [
  { key: "overview", label: "Özet", href: "/records/42" },
  { key: "history", label: "Geçmiş", href: "/records/42/history" },
  { key: "settings", label: "Ayarlar", href: "/records/42/settings" },
];

const LABELS = {
  loading: "Yükleniyor",
  breadcrumb: "Neredesin",
  tabs: "Bölüm gezinmesi",
  title: "Bir şey ters gitti",
  body: "Tekrar denenebilir.",
  retry: "Tekrar dene",
};

function renderDetail(activeTab = "overview", extra: Record<string, unknown> = {}) {
  return render(
    <DetailTemplate breadcrumb={trail} title="bir-kayit" tabs={tabs} activeTab={activeTab} labels={LABELS} {...extra}>
      <p>sekme gövdesi</p>
    </DetailTemplate>,
  );
}

const renderedTabs = () =>
  Array.from(document.querySelectorAll("[data-tab]")).map((el) => el.getAttribute("data-tab"));

describe("DetailTemplate · sekmeler verildiği gibi", () => {
  it("verilen listeyi sırasıyla çiziyor, adı ve yoluyla", () => {
    renderDetail();
    expect(renderedTabs()).toEqual(tabs.map((t) => t.key));
    for (const tab of tabs) {
      const link = document.querySelector(`[data-tab="${tab.key}"]`);
      expect(link, `${tab.key} çizilmemiş`).not.toBeNull();
      expect(link!.getAttribute("href")).toBe(tab.href);
      expect(link!.textContent).toBe(tab.label);
    }
  });

  it("sekmesiz bir detay ekranı sekme çubuğu çizmiyor", () => {
    render(
      <DetailTemplate breadcrumb={trail} title="bir-kayit" labels={LABELS}>
        <p>gövde</p>
      </DetailTemplate>,
    );
    expect(document.querySelector("[data-tab]")).toBeNull();
    expect(screen.getByText("gövde")).toBeInTheDocument();
  });

  it("tam bir sekmeyi işaretliyor, ve o açık olan", () => {
    renderDetail("history");
    const current = Array.from(document.querySelectorAll("[data-tab]")).filter((el) =>
      el.hasAttribute("aria-current"),
    );
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAttribute("data-tab", "history");
  });
});

describe("DetailTemplate · durumlar", () => {
  it("yüklenirken sekme çubuğu ve başlık kalıyor — nesne hâlâ BU nesne", () => {
    renderDetail("history", { state: "loading" });

    expect(screen.getByRole("heading", { name: "bir-kayit" })).toBeInTheDocument();
    expect(renderedTabs()).toEqual(tabs.map((t) => t.key));
    expect(screen.queryByText("sekme gövdesi")).not.toBeInTheDocument();
    expect(document.querySelector('[aria-busy="true"]')).not.toBeNull();
  });

  it("hata gövdenin yerine geçiyor ve zarfın satırını taşıyor", () => {
    renderDetail("overview", {
      state: "error",
      error: { code: "server_error", requestId: "req_44a1" },
    });

    expect(screen.getByText("server_error · req_44a1")).toBeInTheDocument();
    expect(screen.queryByText("sekme gövdesi")).not.toBeInTheDocument();
    /* Gövde düşünce gezinme kullanılabilir kalıyor: öteki sekmeler pekâlâ yüklenebilir. */
    expect(renderedTabs()).toEqual(tabs.map((t) => t.key));
  });

  it("hazır hâl çağıranın gövdesini gösteriyor", () => {
    renderDetail("history", { state: "ready" });
    expect(screen.getByText("sekme gövdesi")).toBeInTheDocument();
  });
});

/* BAŞLIK PAGEBAND İLE AYNI: `h1`, gösterim yüzü, 24px, extrabold; alt başlık
   gövde boyu. Liste sayfasında büyük, detayda küçük bir `h2` kalıyordu. */
describe("DetailTemplate · başlık PageBand ile aynı", () => {
  it("h1, PageBand'in yüzü; uzun başlık kırılabilir; alt başlık text-body", () => {
    renderDetail("overview", { subtitle: "Yönetici" });
    const h1 = screen.getByRole("heading", { level: 1, name: "bir-kayit" });
    for (const sinif of ["font-display", "text-display-sm", "font-extrabold", "leading-tight", "break-words"]) expect(h1.className).toContain(sinif);
    expect(document.querySelector("h2")).toBeNull();
    expect(screen.getByText("Yönetici").className).toMatch(/text-body/);
  });
});

/* DURUM SATIRI ÜRÜNÜN. Şablon yalnız yerini tutuyor: kimlik satırının altında, sekmelerden önce,
   ve verilmezse hiç çizilmiyor (boş bir 8px kalmasın). */
describe("DetailTemplate · status", () => {
  it("kimlik satırının altında, sekmelerden önce çiziliyor", () => {
    const { container } = renderDetail("overview", {
      subtitle: "web · ornek.com",
      status: <span data-urun-satiri>Çalışıyor</span>,
    });
    const satir = container.querySelector("[data-detail-status]")!;
    expect(satir.querySelector("[data-urun-satiri]")).not.toBeNull();
    const kimlik = screen.getByText("web · ornek.com");
    expect(kimlik.compareDocumentPosition(satir) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const nav = container.querySelector("nav[aria-label='Bölüm gezinmesi']")!;
    expect(satir.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("verilmezse yer tutmuyor", () => {
    const { container } = renderDetail();
    expect(container.querySelector("[data-detail-status]")).toBeNull();
  });
});
