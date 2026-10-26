#!/usr/bin/env node
/**
 * TARAYICI ÖLÇÜMÜ · Field etiketi: dar (390) ve geniş (1280) ekranda etiket tek
 * satırda mı, bilgi glifi ve sağ not etiketle aynı taban çizgisinde mi. Doğrudan
 * Chrome (CDP); elle: `pnpm olc:alan`. Ekran görüntüleri scratchpad'e değil,
 * verilen klasöre: `node scripts/olc/alan-etiket.mjs <klasör>`.
 */
const CH = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const { spawn } = await import("node:child_process");
const { writeFileSync } = await import("node:fs");
const klasor = process.argv[2];
const sonuc = {};
for (const genislik of [390, 1280]) {
  const port = 9690 + Math.floor(Math.random() * 200);
  const proc = spawn(CH, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/tamga-olc-${port}`, `--window-size=${genislik},900`, "about:blank"], { stdio: "ignore" });
  let list = null;
  for (let i = 0; i < 30 && !list; i++) { await new Promise((r) => setTimeout(r, 1000)); try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch { /* bekle */ } }
  const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
  let id = 0; const bekle = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (bekle.has(m.id)) { bekle.get(m.id)(m); bekle.delete(m.id); } };
  const gonder = (m, p) => new Promise((ok) => { const n = ++id; bekle.set(n, ok); ws.send(JSON.stringify({ id: n, method: m, params: p })); });
  await new Promise((ok) => (ws.onopen = ok));
  const js = async (e) => {
    const r = await gonder("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true });
    if (r.result?.exceptionDetails) throw new Error("sayfada hata: " + (r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text));
    return r.result?.result?.value;
  };
  await gonder("Emulation.setDeviceMetricsOverride", { width: genislik, height: 900, deviceScaleFactor: 2, mobile: genislik < 640 });
  await gonder("Page.navigate", { url: "http://localhost:6070/tr/docs/field" });
  for (let i = 0; i < 30; i++) { await new Promise((r) => setTimeout(r, 2000)); if (await js(`document.querySelectorAll('label[for]').length >= 2`)) break; }
  sonuc[genislik] = JSON.parse(await js(`(() => {
    const r = (el) => el.getBoundingClientRect();
    const metin = (el) => { const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }); const t = tw.nextNode(); if (!t) return null; const rg = document.createRange(); rg.selectNodeContents(t); return rg.getClientRects()[0]; };
    const out = [];
    for (const etiket of document.querySelectorAll('label[for]')) {
      const satir = etiket.parentElement; const kok = satir.parentElement;
      const kontrol = kok.querySelector("input, textarea, select, button, .tamga-select, .tamga-input");
      const et = metin(etiket); const lh = parseFloat(getComputedStyle(etiket).lineHeight);
      const not = [...satir.children].find((c) => c !== etiket && c.classList.contains("text-caption"));
      const glif = satir.querySelector("svg");
      out.push({
        etiket: etiket.textContent.trim().slice(0, 20), boyut: getComputedStyle(etiket).fontSize, satirlar: Math.round(r(etiket).height / lh),
        kontrolArasi: kontrol ? +(r(kontrol).top - r(satir).bottom).toFixed(1) : null,
        notTaban: not && et ? +(metin(not).bottom - et.bottom).toFixed(1) : null,
        glifOrta: glif && et ? +((r(glif).top + r(glif).height / 2) - (et.top + et.height / 2)).toFixed(1) : null,
      });
    }
    const ilk = document.querySelector('label[for]').closest(".tamga-demo, [data-demo], section") ?? document.querySelector('label[for]').parentElement.parentElement.parentElement;
    const b = ilk.getBoundingClientRect();
    return JSON.stringify({ alanlar: out, kutu: { x: b.x + window.scrollX, y: b.y + window.scrollY, w: b.width, h: Math.min(b.height, 700) } });
  })()`));
  if (klasor) {
    const k = sonuc[genislik].kutu;
    const shot = await gonder("Page.captureScreenshot", { format: "png", clip: { x: Math.max(0, k.x - 4), y: Math.max(0, k.y - 4), width: Math.min(genislik, k.w + 8), height: k.h + 8, scale: 2 } });
    writeFileSync(`${klasor}/alan-${genislik}.png`, Buffer.from(shot.result.data, "base64"));
  }
  ws.close(); proc.kill();
}
let hata = 0;
const soyle = (k, m) => { if (!k) { console.log("✗ " + m); hata = 1; } };
for (const g of [390, 1280]) for (const a of sonuc[g].alanlar) {
  const ad = g + " " + a.etiket;
  soyle(a.boyut === "14.5px", ad + ": etiket 14.5px değil (" + a.boyut + ")");
  soyle(a.satirlar === 1, ad + ": etiket " + a.satirlar + " satır");
  soyle(a.kontrolArasi === null || Math.abs(a.kontrolArasi - 8) <= 1, ad + ": etiketle kontrol arası 8 px değil (" + a.kontrolArasi + ")");
  soyle(a.notTaban === null || Math.abs(a.notTaban) <= 1, ad + ": sağ not etiketin taban çizgisinde değil (" + a.notTaban + ")");
  soyle(a.glifOrta === null || Math.abs(a.glifOrta) <= 2, ad + ": bilgi glifi etiketle aynı hizada değil (" + a.glifOrta + ")");
}
console.log(JSON.stringify(sonuc[1280].alanlar));
console.log(hata ? "✗ Alan etiketi ölçümü başarısız." : "✓ Etiket 14,5 px, tek satır, kontrolden 8 px; glif ve not taban çizgisinde (390 ve 1280).");
process.exit(hata);
