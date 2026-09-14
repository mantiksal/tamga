import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { AppShell, ListTemplate, DetailTemplate, WizardTemplate, OverviewTemplate } from "./patterns/index.js";
import {
  Button, IconButton, MiniButton, Input, Textarea, Checkbox, Switch, RadioGroup, Segmented,
  Select, Pagination, StatusChip, Progress, Spinner, Steps, Tabs, Field, LogoTile, AccountButton,
} from "./index.js";
import { Search } from "./components/icons.js";

/**
 * ERİŞİLEBİLİRLİK DEĞİŞMEZLERİ.
 *
 * NE OLDUĞU, VE NE OLMADIĞI. Bu bir axe taraması DEĞİL. Üç değişmez ölçüyor ve
 * üçü de kitin KENDİ verdiği sözler:
 *
 *   1. Etkileşimli her elemanın erişilebilir bir adı var.
 *   2. `aria-hidden` bir ağaç, odaklanabilir bir şey saklamıyor.
 *   3. Rol çiftleri tam: `radio` bir `radiogroup` içinde, `tab` bir `tablist`
 *      içinde, `option` bir `listbox` içinde.
 *
 * NEDEN AXE DEĞİL: axe bir kütüphane, ve bu depoya yeni kütüphane girmiyor. O
 * bir karar ve kararın sahibi burası değil. Bu dosya karar verilene kadar
 * BOŞLUĞU KAPATMIYOR, sadece daraltıyor — ve neyi kapsamadığını söylüyor:
 * kontrast (`check-token-contrast` ölçüyor), odak sırası, canlı bölge
 * davranışı, ve burada ÇİZİLMEYEN bileşenler.
 *
 * ÖNCEKİ ÖLÇÜM NEDEN KAYBOLDU: 48 story üzerinde axe koşuyordu ve o story'ler
 * tüketen üründeydi; Storybook kaldırılınca ölçüm de kalktı. Kitin sözü kitin
 * deposunda ölçülmeliydi, orada değil.
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
