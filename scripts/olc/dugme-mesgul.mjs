#!/usr/bin/env node
/**
 * TARAYICI ÖLÇÜMÜ · meşgul düğmede spinner ortada mı, genişlik korunuyor mu.
 * Doğrudan Chrome (CDP); elle: `pnpm olc:dugme`. Doküman sitesi açık olmalı.
 * Üç boy (sm, varsayılan, lg) × dört varyant (primary, soft, ghost, danger):
 * spinner'ın merkezi düğmenin merkezinden en çok 1 px uzakta; meşgul düğme,
 * aynı metinli meşgul olmayan ikiziyle aynı genişlikte.
 */
const CH = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const { spawn } = await import("node:child_process");
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
await gonder("Page.navigate", { url: process.argv[2] ?? "http://localhost:6070/tr/docs/button" });
for (let i = 0; i < 30; i++) { await new Promise((r) => setTimeout(r, 2000)); if (await js(`!!document.querySelector('.tamga-btn[data-busy]')`)) break; }
const sonuc = JSON.parse(await js(`(() => {
  const ornek = document.querySelector('.tamga-btn[data-busy]');
  if (!ornek) return JSON.stringify({ hata: "meşgul düğme örneği yok" });
  const kap = document.createElement("div"); kap.style.cssText = "padding:40px;display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start"; document.body.append(kap);
  const r = (el) => el.getBoundingClientRect();
  const out = [];
  for (const boy of ["sm", "", "lg"]) for (const varyant of ["primary", "soft", "ghost", "danger"]) {
    const sinif = ["tamga-btn", "tamga-btn-" + varyant, boy ? "tamga-btn-" + boy : ""].join(" ").trim();
    const mesgul = ornek.cloneNode(true); mesgul.className = sinif; kap.append(mesgul);
    const ikiz = document.createElement("button"); ikiz.type = "button"; ikiz.className = sinif; ikiz.textContent = ornek.querySelector(".invisible")?.textContent ?? "Kaydet"; kap.append(ikiz);
    const b = r(mesgul); const s = r(mesgul.querySelector('[role="status"]'));
    out.push({ boy: boy || "base", varyant, dx: +((s.left + s.width / 2) - (b.left + b.width / 2)).toFixed(1), dy: +((s.top + s.height / 2) - (b.top + b.height / 2)).toFixed(1), genislik: Math.round(b.width), ikiz: Math.round(r(ikiz).width) });
  }
  return JSON.stringify(out);
})()`));
ws.close(); proc.kill();
let hata = 0;
if (sonuc.hata) { console.log("✗ " + sonuc.hata); hata = 1; }
else for (const s of sonuc) {
  const ok = Math.abs(s.dx) <= 1 && Math.abs(s.dy) <= 1 && Math.abs(s.genislik - s.ikiz) <= 1;
  if (!ok) hata = 1;
  console.log((ok ? "✓" : "✗") + " " + s.boy.padEnd(4) + " " + s.varyant.padEnd(7) + " dx " + s.dx + " dy " + s.dy + " genişlik " + s.genislik + "/" + s.ikiz);
}
console.log(hata ? "✗ Meşgul düğme ölçümü başarısız." : "✓ Spinner on iki düğmede de ortada; genişlik korunuyor.");
process.exit(hata);
