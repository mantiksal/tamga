import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { AppShell, ListTemplate, DetailTemplate, WizardTemplate, OverviewTemplate } from "./patterns/index.js";
import {
  Button, IconButton, MiniButton, Input, Textarea, Checkbox, Switch, RadioGroup, Segmented,
  Select, Pagination, StatusChip, Progress, Spinner, Steps, Tabs, Field, LogoTile, AccountButton,
  PageBand, ThemeToggle, DropdownMenu,
} from "./index.js";
import { Search } from "./components/icons.js";

/**
 * ERİŞİLEBİLİRLİK DEĞİŞMEZLERİ · altı tane, ve hepsi kitin kendi verdiği söz.
 * Bu bir axe taraması DEĞİL: axe bir kütüphane, ve bu depoya yeni kütüphane
 * girmiyor. Kapsamadıkları da yazılı.
 *
 * Gerekçe: docs/09-testler-ve-degismezler.md
 */

/** Görünür metin, `aria-label`, `aria-labelledby`, sarmalayan `<label>` ya da `alt`. */
function adiVarMi(el: Element, kok: Element): boolean {
  const etiket = el.getAttribute("aria-label");
  if (etiket && etiket.trim()) return true;

  const isaret = el.getAttribute("aria-labelledby");
  if (isaret) {
    for (const id of isaret.split(/\s+/)) {
      const hedef = kok.ownerDocument.getElementById(id);
      if (hedef && hedef.textContent?.trim()) return true;
    }
  }

  const id = el.getAttribute("id");
  if (id && kok.ownerDocument.querySelector(`label[for="${id}"]`)) return true;
  if (el.closest("label")) return true;

  if ((el.textContent ?? "").trim()) return true;
  const gorsel = el.querySelector("img[alt]");
  if (gorsel && (gorsel.getAttribute("alt") ?? "").trim()) return true;
  if ((el.getAttribute("title") ?? "").trim()) return true;
  return false;
}

const ETKILESIMLI = 'button, a[href], input:not([type="hidden"]), select, textarea, [role="button"], [role="radio"], [role="tab"], [role="switch"], [role="checkbox"]';
const ODAKLANABILIR = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const ROL_CIFTI: Record<string, string> = { radio: "radiogroup", tab: "tablist", option: "listbox" };

/** Üç değişmezi bir ağaçta ölçer. Yeni bir test yazan bunu çağırabilir. */
export function a11yKontrol(kok: HTMLElement, ad: string) {
  const isimsiz: string[] = [];
  for (const el of kok.querySelectorAll(ETKILESIMLI)) {
    if (el.closest('[aria-hidden="true"]')) continue;
    if (el.hasAttribute("disabled")) continue;
    if (!adiVarMi(el, kok)) isimsiz.push(`${el.tagName.toLowerCase()}${el.getAttribute("role") ? `[role=${el.getAttribute("role")}]` : ""}`);
  }
  expect(isimsiz, `${ad}: erişilebilir adı olmayan eleman`).toEqual([]);

  const saklanan: string[] = [];
  for (const gizli of kok.querySelectorAll('[aria-hidden="true"]')) {
    for (const o of gizli.querySelectorAll(ODAKLANABILIR)) {
      if (!o.hasAttribute("disabled")) saklanan.push(o.tagName.toLowerCase());
    }
  }
  expect(saklanan, `${ad}: aria-hidden bir ağaç odaklanabilir bir şey saklıyor`).toEqual([]);

  const oksuz: string[] = [];
  for (const [rol, ebeveyn] of Object.entries(ROL_CIFTI)) {
    for (const el of kok.querySelectorAll(`[role="${rol}"]`)) {
      if (!el.closest(`[role="${ebeveyn}"]`)) oksuz.push(`${rol} → ${ebeveyn} yok`);
    }
  }
  expect(oksuz, `${ad}: rol çifti eksik`).toEqual([]);
}

const L = { home: "Ana sayfa", primaryNav: "Menü" };
const HATA = { title: "Bir şey ters gitti", body: "Tekrar denenebilir.", retry: "Tekrar dene" };
const nav = [{ key: "a", href: "/a", label: "Kayıtlar", icon: Search, section: "Bölüm" }];

describe("erişilebilirlik değişmezleri · şablonlar", () => {
  const catalog: [string, React.ReactElement][] = [
    ["AppShell", <AppShell nav={nav} activePath="/a" rail="wide" labels={L}><p>gövde</p></AppShell>],
    ["ListTemplate", <ListTemplate title="Kayıtlar" labels={HATA}><p>gövde</p></ListTemplate>],
    ["DetailTemplate", <DetailTemplate title="Kayıt" breadcrumb={[{ label: "Kayıtlar", href: "/a" }, { label: "Kayıt" }]} labels={{ ...HATA, loading: "Yükleniyor", breadcrumb: "Yol", tabs: "Sekmeler" }}><p>gövde</p></DetailTemplate>],
    ["OverviewTemplate", <OverviewTemplate title="Özet" labels={HATA}><p>gövde</p></OverviewTemplate>],
    ["WizardTemplate", <WizardTemplate steps={[{ key: "a", label: "Bir" }, { key: "b", label: "İki" }]} activeStep="a" title="Sihirbaz" labels={HATA}><p>gövde</p></WizardTemplate>],
  ];
  for (const [ad, el] of catalog) {
    it(ad, () => a11yKontrol(render(el).container, ad));
  }
});

describe("erişilebilirlik değişmezleri · etkileşimli bileşenler", () => {
  const secenekler = [{ value: "a", label: "Bir" }, { value: "b", label: "İki" }];
  const catalog: [string, React.ReactElement][] = [
    ["Button", <Button>Kaydet</Button>],
    ["IconButton", <IconButton aria-label="Ara" />],
    ["MiniButton", <MiniButton aria-label="Kaldır" />],
    ["Input", <Field label="Ad" htmlFor="x"><Input id="x" /></Field>],
    ["Textarea", <Field label="Not" htmlFor="y"><Textarea id="y" /></Field>],
    ["Checkbox", <Checkbox label="Seç" checked onChange={() => {}} />],
    ["Switch", <Switch checked onChange={() => {}} labels={{ on: "Açık", off: "Kapalı" }} label="Yayında" />],
    ["RadioGroup", <RadioGroup label="Tür" value="a" options={secenekler} />],
    ["Segmented", <Segmented label="Görünüm" value="a" options={secenekler} />],
    ["Select", <Field label="Durum" htmlFor="z"><Select id="z" options={secenekler} value="a" onChange={() => {}} /></Field>],
    ["Pagination", <Pagination page={2} pageCount={5} onChange={() => {}} labels={{ previous: "Önceki", next: "Sonraki", page: (n) => `Sayfa ${n}` }} />],
    ["StatusChip", <StatusChip label="Yayında" state="positive" dot />],
    ["Progress", <Progress value={40} label="Yükleniyor" />],
    ["Spinner", <Spinner label="Yükleniyor" />],
    ["Steps", <Steps steps={[{ key: "a", label: "Bir" }, { key: "b", label: "İki" }]} current={0} />],
    ["Tabs", <Tabs items={[{ value: "a", label: "Bir" }, { value: "b", label: "İki" }]} value="a" onChange={() => {}} label="Sekmeler" />],
    ["LogoTile", <LogoTile name="Mağaza" />],
    ["AccountButton", <AccountButton name="Kişi" label="Hesap menüsü" />],
  ];
  for (const [ad, el] of catalog) {
    it(ad, () => a11yKontrol(render(el).container, ad));
  }
});

/**
 * DÖRDÜNCÜ DEĞİŞMEZ: alanın altındaki not kontrole bağlı. `description` ile
 * `error` bir süre gevşek paragraflardı; bir hatanın yalnız renkle söylenmesi
 * formlardaki en eski kusur. Üç test bağın kopmasında düşüyor.
 *
 * Gerekçe: docs/09-testler-ve-degismezler.md
 */
describe("Field · alt notun kontrole bağı", () => {
  it("açıklama kontrole bağlanıyor", () => {
    const { container } = render(
      <Field label="Ad" description="Kimliğinizdeki hâliyle yazın." htmlFor="a1">
        <Input id="a1" />
      </Field>,
    );
    const girdi = container.querySelector("input")!;
    const id = girdi.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(container.querySelector(`#${id}`)?.textContent).toBe("Kimliğinizdeki hâliyle yazın.");
  });

  it("hata kontrole bağlanıyor ve alanı geçersiz işaretliyor", () => {
    const { container } = render(
      <Field label="Ad" error="Bu alan boş kalamaz." htmlFor="a2">
        <Input id="a2" />
      </Field>,
    );
    const girdi = container.querySelector("input")!;
    const id = girdi.getAttribute("aria-describedby");
    expect(container.querySelector(`#${id}`)?.textContent).toBe("Bu alan boş kalamaz.");
    expect(girdi.getAttribute("aria-invalid")).toBe("true");
  });

  it("çağıranın kendi `aria-describedby`si korunuyor", () => {
    const { container } = render(
      <>
        <span id="disarisi">Dışarıdan bir not</span>
        <Field label="Ad" description="İçeriden bir not" htmlFor="a3">
          <Input id="a3" aria-describedby="disarisi" />
        </Field>
      </>,
    );
    const bag = container.querySelector("input")!.getAttribute("aria-describedby")!;
    expect(bag.split(" ")).toHaveLength(2);
    expect(bag.split(" ")[0]).toBe("disarisi");
  });
});

/**
 * BEŞİNCİ DEĞİŞMEZ: sayfanın bir birinci düzey başlığı var. Şerit sayfanın adı;
 * `PageBand` bir `h2` çizdiği sürece kite geçen ürün `<h1>`ini kaybediyordu.
 *
 * Gerekçe: docs/09-testler-ve-degismezler.md
 */
describe("PageBand · sayfanın birinci düzey başlığı", () => {
  it("şerit `h1` çiziyor", () => {
    const { container } = render(<PageBand title="Siparişler" subtitle="Hepsi" />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe("Siparişler");
  });

  it("şeridi kullanan şablon da `h1` veriyor", () => {
    const { container } = render(
      <ListTemplate
        title="Kayıtlar"
        labels={{ busy: "Yükleniyor", error: { title: "Hata", body: "Olmadı", retry: "Yeniden" } }}
        empty={<p>Boş</p>}
      >
        <p>Satırlar</p>
      </ListTemplate>,
    );
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });
});

/**
 * ALTINCI DEĞİŞMEZ: `segmented` tema anahtarı `.dark` sınıfına dokunmuyor.
 * Gözle bulundu, ölçümle değil: token'lar doğruydu, yanlış olan hangi bloğun
 * yürürlükte olduğuydu.
 *
 * Gerekçe: docs/09-testler-ve-degismezler.md
 */
describe("ThemeToggle · segmented temayı sahiplenmiyor", () => {
  it("`.dark` sınıfına dokunmuyor", () => {
    document.documentElement.classList.remove("dark");
    render(
      <ThemeToggle
        variant="segmented"
        labels={{ light: "Açık", dark: "Koyu", system: "Sistem" }}
        preference="light"
        onPreferenceChange={() => {}}
      />,
    );
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("tercih `dark` iken de sınıfa dokunmuyor · yazar üründür", () => {
    document.documentElement.classList.remove("dark");
    render(
      <ThemeToggle
        variant="segmented"
        labels={{ light: "Açık", dark: "Koyu", system: "Sistem" }}
        preference="dark"
        onPreferenceChange={() => {}}
      />,
    );
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

describe("DropdownMenu · odak, menüyü AÇAN kişinin hakkı", () => {
  /* Ana sayfa, `defaultOpen` menünün ilk seçeneği odağı aldığı için sayfanın
     3365. pikselinde açılıyordu: tarayıcı odaklanan ögeyi görünür kılmak
     zorunda. Kapı bu yüzden var · "açık" ile "az önce açıldı" aynı şey değil. */
  const items = [
    { kind: "item" as const, label: "Düzenle", onSelect: () => {} },
    { kind: "item" as const, label: "Sil", onSelect: () => {} },
  ];

  it("`defaultOpen` ile açık doğan menü odağı ÇALMIYOR", () => {
    const { container } = render(<DropdownMenu trigger={<button>Eylemler</button>} items={items} defaultOpen />);
    expect(container.querySelectorAll("[data-tamga-option]").length).toBe(2);
    expect(document.activeElement).toBe(document.body);
  });

  it("kullanıcı açtığında ilk seçenek odağı ALIYOR", () => {
    const { container } = render(<DropdownMenu trigger={<button>Eylemler</button>} items={items} />);
    fireEvent.click(container.querySelector("button")!);
    expect(document.activeElement).toBe(container.querySelector("[data-tamga-option]"));
  });
});
