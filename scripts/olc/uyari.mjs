#!/usr/bin/env node
/**
 * TARAYICI ÖLÇÜMÜ · Alert'te karo, eylem ve kapatma başlıkla hizalı mı. Tek
 * satırlı uyarıda başlıkla ortalı, gövdeli uyarıda başlığın ilk satırının
 * ortasında; ikisinde de fark en çok 1 px. Doğrudan Chrome (CDP); elle:
 * `pnpm olc:uyari [klasör]` (klasör verilirse ekran görüntüsü oraya).
 */
const CH = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const { spawn } = await import("node:child_process");
const { writeFileSync } = await import("node:fs");
const klasor = process.argv[2];
const port = 9690 + Math.floor(Math.random() * 200);
const proc = spawn(CH, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/tamga-olc-${port}`, "--window-size=1280,900", "about:blank"], { stdio: "ignore" });
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
await gonder("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 2, mobile: false });
await gonder("Page.navigate", { url: "http://localhost:6070/tr/docs/alert" });
for (let i = 0; i < 30; i++) { await new Promise((r) => setTimeout(r, 2000)); if (await js(`document.querySelectorAll('.tamga-alert').length >= 3`)) break; }
const sonuc = JSON.parse(await js(`(() => {
  const r = (el) => el.getBoundingClientRect(); const orta = (b) => b.top + b.height / 2;
  const out = [];
  for (const a of document.querySelectorAll(".tamga-alert")) {
    const tile = a.querySelector(".tamga-alert-tile"); const p = a.querySelector("p");
    const rg = document.createRange(); rg.selectNodeContents(p); const satir = rg.getClientRects()[0];
    const kapat = a.querySelector(".tamga-alert-kapat"); const eylem = a.querySelector(".tamga-alert-eylem");
    out.push({ baslik: p.textContent.slice(0, 22), rows: a.dataset.rows, karo: +(orta(r(tile)) - orta(satir)).toFixed(1), kapat: kapat ? +(orta(r(kapat)) - orta(satir)).toFixed(1) : null, eylem: eylem ? +(orta(r(eylem)) - orta(satir)).toFixed(1) : null, yukseklik: Math.round(r(a).height) });
  }
  const ilk = document.querySelector('[data-rows="single"]'); const b = ilk ? ilk.closest(".tamga-demo, section")?.getBoundingClientRect() ?? ilk.getBoundingClientRect() : null;
  return JSON.stringify({ uyarilar: out, kutu: b && { x: b.x + window.scrollX, y: b.y + window.scrollY, w: b.width, h: Math.min(b.height, 520) } });
})()`));
if (klasor && sonuc.kutu) {
  const k = sonuc.kutu;
  const shot = await gonder("Page.captureScreenshot", { format: "png", clip: { x: Math.max(0, k.x - 4), y: Math.max(0, k.y - 4), width: k.w + 8, height: k.h + 8, scale: 2 } });
  writeFileSync(`${klasor}/uyari-tek-satir.png`, Buffer.from(shot.result.data, "base64"));
}
ws.close(); proc.kill();
let hata = 0;
const soyle = (k, m) => { if (!k) { console.log("✗ " + m); hata = 1; } };
soyle(sonuc.uyarilar.some((u) => u.rows === "single"), "sayfada tek satırlı uyarı yok");
soyle(sonuc.uyarilar.some((u) => u.rows === "multi"), "sayfada gövdeli uyarı yok");
for (const u of sonuc.uyarilar) {
  const ad = (u.rows ?? "?") + " " + u.baslik;
  soyle(Math.abs(u.karo) <= 1, ad + ": karo başlıkla hizalı değil (" + u.karo + ")");
  soyle(u.kapat === null || Math.abs(u.kapat) <= 1, ad + ": kapatma başlıkla hizalı değil (" + u.kapat + ")");
  soyle(u.eylem === null || Math.abs(u.eylem) <= 1, ad + ": eylem başlıkla hizalı değil (" + u.eylem + ")");
}
console.log(JSON.stringify(sonuc.uyarilar));
console.log(hata ? "✗ Uyarı hizası ölçümü başarısız." : "✓ Karo, eylem ve kapatma başlıkla hizalı; tek satırlı ve gövdeli (" + sonuc.uyarilar.length + " uyarı).");
process.exit(hata);
