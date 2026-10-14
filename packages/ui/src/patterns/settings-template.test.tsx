import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { SettingsTemplate } from "./settings-template.js";

/**
 * İÇERİK SÜTUNU DARALABİLMELİ. `flex-1` tek başına "kalan yeri kapla" der,
 * "gerekirse içeriğinden küçül" demez: içine geniş bir tablo konunca sütun
 * tabloyu sıkıştırmak yerine sayfayı yana taşırıyordu ve tablonun kendi yatay
 * kaydırması hiç devreye giremiyordu. Panel bunu `[data-settings-state] > div
 * { min-width: 0 }` ile dışarıdan yamalamıştı. jsdom yerleşim ölçmez; test
 * sütunun o izni BİLDİRDİĞİNİ sınıyor.
 */
describe("SettingsTemplate · içerik sütunu", () => {
  it("min-w-0 bildiriyor", () => {
    render(
      <SettingsTemplate
        title="Ayarlar"
        activeSection="a"
        sections={[{ key: "a", label: "Genel", href: "#", scope: "personal" }]}
        labels={{
          loading: "Yükleniyor",
          sections: "Bölümler",
          scope: { personal: "Kişisel", workspace: "Çalışma alanı", mixed: "Karma" },
          title: "Hata",
          body: "Olmadı",
          retry: "Yeniden",
        }}
      >
        <table />
      </SettingsTemplate>,
    );
    const sutun = document.querySelector("[data-settings-state] > nav + div");
    expect(sutun).not.toBeNull();
    expect(sutun?.classList.contains("min-w-0")).toBe(true);
  });
});
