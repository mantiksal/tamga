import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WizardTemplate } from "./wizard-template.js";

/**
 * Bir sihirbazın sözü şudur: "bu kadar adım, sonra bitti". Buradaki testler o
 * sözü tutuyor — liste her zaman görünür, tam bir adım güncel, ve neyin bittiği
 * birinin işaretlemeyi hatırlaması gereken bir bayrağa değil KONUMA bağlı.
 *
 * KANCALAR ŞERİDİN KENDİSİNDEN. Şeridi `Steps` çiziyor ve durumu
 * `.tamga-step-mark[data-state]` ile söylüyor (`todo · current · done`).
 * Bu testler o niteliği okuyor, çünkü ölçtükleri şey şablonun `Steps`e doğru
 * `current` indeksini geçmesi.
 */

const steps = [
  { key: "target", label: "Hedef" },
  { key: "frequency", label: "Sıklık" },
  { key: "notify", label: "Bildirim" },
  { key: "review", label: "Özet" },
];

const LABELS = { title: "Bir şey ters gitti", body: "Tekrar denenebilir.", retry: "Tekrar dene" };

function renderWizard(activeStep = "target", extra: Record<string, unknown> = {}) {
  return render(
    <WizardTemplate steps={steps} activeStep={activeStep} title="Kayıt ekle" labels={LABELS} {...extra}>
      <p>adım gövdesi</p>
    </WizardTemplate>,
  );
}

const marks = () => Array.from(document.querySelectorAll(".tamga-step-mark"));
const stateOf = (i: number) => marks()[i]?.getAttribute("data-state");

describe("WizardTemplate · söz görünür kalıyor", () => {
  it("her adımı sırayla gösteriyor", () => {
    renderWizard();
    const items = Array.from(document.querySelectorAll("ol > li")).map((el) => el.textContent);
    expect(items).toHaveLength(steps.length);
    for (const [i, step] of steps.entries()) expect(items[i]).toContain(step.label);
  });

  it("tam bir adımı güncel işaretliyor", () => {
    renderWizard("notify");
    expect(marks().filter((el) => el.getAttribute("data-state") === "current")).toHaveLength(1);
    expect(stateOf(2)).toBe("current");
    /* Ekran okuyucu için de tek: `aria-current="step"` etikette. */
    const current = document.querySelectorAll('[aria-current="step"]');
    expect(current).toHaveLength(1);
    expect(current[0].textContent).toBe("Bildirim");
  });

  it("biten konumsal — güncel adımdan öncekiler, sonrakiler değil", () => {
    renderWizard("notify");
    expect(marks().map((el) => el.getAttribute("data-state"))).toEqual([
      "done",
      "done",
      "current",
      "todo",
    ]);
  });

  it("ilk adımda hiçbir şey bitmiş değil", () => {
    renderWizard("target");
    expect(marks().filter((el) => el.getAttribute("data-state") === "done")).toHaveLength(0);
  });

  it("adım listesi hatayı atlatıyor — yerini kaybetmek hatadan beter", () => {
    renderWizard("frequency", {
      state: "error",
      error: { code: "validation_error", requestId: "req_3" },
    });

    expect(marks()).toHaveLength(steps.length);
    expect(stateOf(1)).toBe("current");
    expect(screen.getByText("validation_error · req_3")).toBeInTheDocument();
    expect(screen.queryByText("adım gövdesi")).not.toBeInTheDocument();
  });
});

describe("WizardTemplate · gezinme çağıranın", () => {
  it("verilen kontrolleri çiziyor, verilmeyince hiçbir şey çizmiyor", () => {
    const { unmount } = renderWizard("frequency", {
      back: <button>Geri</button>,
      next: <button>İleri</button>,
    });
    expect(screen.getByRole("button", { name: "Geri" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "İleri" })).toBeInTheDocument();
    unmount();

    renderWizard("frequency");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("konumu ekran okuyucuya bildiriyor", () => {
    renderWizard("review");
    expect(screen.getByText("4 / 4")).toBeInTheDocument();
  });
});
