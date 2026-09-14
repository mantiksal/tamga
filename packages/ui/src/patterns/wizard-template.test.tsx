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

/**
 * KİMLİK ŞERİDE KADAR İNİYOR.
 *
 * Şablon bir zamanlar `steps.map((s) => s.label)` yapıyordu: `key` tam bu
 * sınırda çöpe gidiyordu, yani bir adıma kanca takmanın yolu yoktu ve tüketen
 * taraf ölçümü etikete bağlamak zorunda kalıyordu. Etiket çevriliyor; dil
 * değiştiği an o ölçüm kırılır.
 *
 * Bu test o sınırı tutuyor: adımın kendi elemanı kimliğini taşıyor, ve
 * kancayla `aria-current` aynı adımda buluşuyor — "şu adım, ve şu an açık
 * olan o" ancak ikisi birlikte ölçülebiliyor.
 */
describe("Steps'in kimliği", () => {
  it("adımın kancası kendi <li>sine iniyor", () => {
    render(
      <WizardTemplate
        steps={steps.map((s) => ({ ...s, "data-step": s.key }))}
        activeStep="notify"
        title="Sihirbaz"
        labels={LABELS}
      >
        <p>gövde</p>
      </WizardTemplate>,
    );
    const notify = document.querySelector('[data-step="notify"]');
    expect(notify).not.toBeNull();
    /* Açık adım kancanın İÇİNDE: ikisi aynı adımda buluşmuyorsa kanca hangi
       adımın açık olduğunu söyleyemez, yani ilerlemeyi ölçmez. */
    expect(notify!.querySelector('[aria-current="step"]')).not.toBeNull();
    expect(document.querySelector('[data-step="target"]')!.querySelector('[aria-current="step"]')).toBeNull();
  });

  it("dil değişince adım düğümü yeniden kurulmuyor: React anahtarı etiket değil", () => {
    /* ASIL KUSUR BURADAYDI. Anahtar çevrilmiş etiketti, yani dil değiştiğinde
       React her adımı BAŞKA bir öğe sanıyor: eskisini söküp yenisini kuruyor.
       Görünen sonucu yok, ama odak, animasyon ve DOM'a tutunan her şey o anda
       kayboluyor. Kimlik etiketten ayrıldığı için düğüm artık yerinde kalıyor,
       yalnız metni değişiyor. */
    const tr = [
      { key: "target", label: "Hedef", "data-step": "target" },
      { key: "notify", label: "Bildirim", "data-step": "notify" },
    ];
    const en = [
      { key: "target", label: "Target", "data-step": "target" },
      { key: "notify", label: "Notify", "data-step": "notify" },
    ];
    const { rerender } = render(
      <WizardTemplate steps={tr} activeStep="notify" title="Sihirbaz" labels={LABELS}>
        <p>gövde</p>
      </WizardTemplate>,
    );
    const once = document.querySelector('[data-step="notify"]');
    /* Boşta geçmesin: kanca hiç inmeseydi iki taraf da null olurdu ve
       `null === null` bu testi yalancı bir yeşille geçirirdi. */
    expect(once).not.toBeNull();
    rerender(
      <WizardTemplate steps={en} activeStep="notify" title="Sihirbaz" labels={LABELS}>
        <p>gövde</p>
      </WizardTemplate>,
    );
    const sonra = document.querySelector('[data-step="notify"]');
    expect(sonra).toBe(once);
    expect(screen.getByText("Notify")).toBeTruthy();
  });
});
