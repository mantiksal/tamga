#!/usr/bin/env node
/**
 * TARAYICI ÖLÇÜMÜ · ray girişi kesiliyor mu. Doğrudan Chrome (CDP), kütüphane
 * yok; verify zincirinde değil, elle: `pnpm olc:ray [url]`. Doküman sitesi
 * açık olmalı (varsayılan anasayfanın gerçek boyutlu kabuğu, 6070).
 * Seçili ve odaklı girişin boyalı alanı (kalkış + gölge + odak halkası) en
 * yakın kesen atasının içinde kalmalı; kapalı grup animasyon bitince görünmez.
 */
const CH = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const { spawn } = await import("node:child_process");
const port = 9690 + Math.floor(Math.random() * 200);
const proc = spawn(CH, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/tamga-olc-${port}`, "--window-size=1440,1000", "about:blank"], { stdio: "ignore" });
let list = null;
for (let i = 0; i < 30 && !list; i++) { await new Promise((r) => setTimeout(r, 1000)); try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch { /* bekle */ } }
const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
let id = 0; const bekle = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (bekle.has(m.id)) { bekle.get(m.id)(m); bekle.delete(m.id); } };
const gonder = (m, p) => new Promise((ok) => { const n = ++id; bekle.set(n, ok); ws.send(JSON.stringify({ id: n, method: m, params: p })); });
await new Promise((ok) => (ws.onopen = ok));
const js = async (e) => (await gonder("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true })).result?.result?.value;
/* Gerçek Tab: `:focus-visible` yalnız klavyeden gelen odakta yanıyor; programatik
   `focus()` tek başına halkayı çizmiyor, bir Tab'dan sonra çiziyor. */
const tab = async () => { for (const type of ["keyDown", "keyUp"]) await gonder("Input.dispatchKeyEvent", { type, key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 }); };
await gonder("Page.navigate", { url: process.argv[2] ?? "http://localhost:6070/tr" });
await new Promise((r) => setTimeout(r, 20000));
await tab();
const olc = async (sec) => {
  const bul = `[...document.querySelectorAll('${sec}')].find((x) => x.getBoundingClientRect().height > 0)`;
  await js(`(() => { const a = ${bul}; a?.scrollIntoView({ block: "center" }); a?.focus(); })()`);
  await tab();
  await js(`(() => { ${bul}?.focus(); })()`);
  return JSON.parse(await js(`(() => {
    const a = document.activeElement;
    if (!a || !a.classList.contains("tamga-rail-link")) return "null";
    const r = a.getBoundingClientRect();
    let k = a.parentElement;
    while (k && k !== document.documentElement && getComputedStyle(k).overflow === "visible" && getComputedStyle(k).overflowX === "visible" && getComputedStyle(k).overflowY === "visible") k = k.parentElement;
    k = k ?? document.documentElement;
    const kr = k.getBoundingClientRect(); const o = getComputedStyle(a);
    const halka = o.outlineStyle === "none" ? 0 : parseFloat(o.outlineWidth) + parseFloat(o.outlineOffset);
    const golge = parseFloat(o.boxShadow.match(/\\)\\s*(-?\\d+(?:\\.\\d+)?)px/)?.[1] ?? "0");
    const b = { top: r.top - halka, left: r.left - halka, right: r.right + Math.max(golge, halka), bottom: r.bottom + Math.max(golge, halka) };
    return JSON.stringify({ aktif: a.dataset.active === "true", halka, golge, kesen: k.tagName.toLowerCase() + "." + (k.className.split(" ")[0] || "?"),
      fazla: { ust: +(kr.top - b.top).toFixed(1), sol: +(kr.left - b.left).toFixed(1), sag: +(b.right - kr.right).toFixed(1), alt: +(b.bottom - kr.bottom).toFixed(1) } });
  })()`));
};
const out = { secili: await olc('.tamga-rail-link[data-active="true"]'), odakli: await olc('.tamga-rail-link:not([data-active="true"])') };
out.grup = JSON.parse(await js(`(async () => {
  const uyku = (ms) => new Promise((r) => setTimeout(r, ms));
  const dugme = document.querySelector('.tamga-rail-section[aria-expanded="true"]:not([data-locked])');
  if (!dugme) return "null";
  const govde = document.getElementById(dugme.getAttribute("aria-controls")).firstElementChild;
  const link = govde.querySelector(".tamga-rail-link");
  dugme.click(); await uyku(400);
  const kapali = { gorunurluk: getComputedStyle(govde).visibility, yukseklik: +govde.getBoundingClientRect().height.toFixed(1), linkGorunur: !!link && getComputedStyle(link).visibility === "visible" };
  dugme.click(); await uyku(30);
  const acilirken = getComputedStyle(govde).visibility;
  await uyku(400);
  return JSON.stringify({ kapali, acilirken, acik: getComputedStyle(govde).visibility });
})()`));
ws.close(); proc.kill();
console.log(JSON.stringify(out));
const icinde = (f) => f && Object.values(f.fazla).every((v) => v <= 0);
let hata = 0;
const soyle = (kosul, m) => { if (!kosul) { console.log("✗ " + m); hata = 1; } };
soyle(out.secili && out.secili.aktif, "seçili ray girişi bulunamadı ya da odaklanamadı");
soyle(out.secili && out.secili.halka > 0, "odak halkası çizilmedi; ölçüm anlamsız");
soyle(icinde(out.secili), "seçili girişin kalkışı, gölgesi ya da halkası kesiliyor");
soyle(icinde(out.odakli), "odaklı girişin halkası kesiliyor");
if (out.grup) {
  soyle(out.grup.kapali.gorunurluk === "hidden" && !out.grup.kapali.linkGorunur, "kapalı grup sızıyor");
  soyle(out.grup.acilirken === "visible" && out.grup.acik === "visible", "açılan grup gecikmeli görünüyor");
} else console.log("(açılır grup yok, sızma ölçülmedi)");
console.log(hata ? "✗ Ray kırpma ölçümü başarısız." : "✓ Ray girişinin kalkışı, gölgesi ve odak halkası kesilmiyor" + (out.grup ? "; kapalı grup sızmıyor." : "."));
process.exit(hata);
