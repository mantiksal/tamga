#!/usr/bin/env node
/**
 * TARAYICI ÖLÇÜMÜ · meşgul düğmede spinner ortada mı, genişlik korunuyor mu.
 * Doğrudan Chrome (CDP); elle: `pnpm olc:dugme`. Doküman sitesi açık olmalı.
 * Üç boy (sm, varsayılan, lg) × dört varyant (primary, soft, ghost, danger) × beş
 * spinner biçimi (bars, dots, pixels, ring, square): BOYANAN parçaların sınır
 * kutusunun merkezi (kökün değil · kök gerilmiş olabilir) düğmenin merkezinden en
 * çok 1 px uzakta; meşgul düğme, aynı metinli meşgul olmayan ikiziyle aynı genişlikte.
 * Spinner markup'ı doküman sitesinin spinner sayfasından alınıyor, elle yazılmıyor.
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
/* Önce spinner sayfası: beş biçimin gerçek markup'ı. */
await gonder("Page.navigate", { url: "http://localhost:6070/tr/docs/spinner" });
for (let i = 0; i < 30; i++) { await new Promise((r) => setTimeout(r, 2000)); if (await js(`document.querySelectorAll('[role="status"]').length >= 5`)) break; }
const bicimler = JSON.parse(await js(`(() => {
  const out = {};
  for (const el of document.querySelectorAll('[role="status"]')) {
    const ad = el.classList.contains("tamga-spin-dots") ? "dots" : el.classList.contains("tamga-spin-pixels") ? "pixels" : el.classList.contains("tamga-spin-ring") ? "ring" : el.classList.contains("tamga-spin-square") ? "square" : el.querySelector(".tamga-spin-part") ? "bars" : null;
    if (ad && !out[ad]) out[ad] = el.outerHTML;
  }
  return JSON.stringify(out);
})()`));
await gonder("Page.navigate", { url: process.argv[2] ?? "http://localhost:6070/tr/docs/button" });
for (let i = 0; i < 30; i++) { await new Promise((r) => setTimeout(r, 2000)); if (await js(`!!document.querySelector('.tamga-btn[data-busy]')`)) break; }
/* ESKI=1: düzeltme öncesi kuralı taklit et (kök kendi boyunda değil, inset onu geriyor) ·
   kapının bunu yakaladığını göstermek için. */
if (process.env.ESKI) await js(`(() => { const st = document.createElement("style"); st.textContent = '.tamga-btn[data-busy] > [role="status"] { position:absolute; inset:0; margin:auto; width:auto; height:auto }'; document.head.append(st); })()`);
const sonuc = JSON.parse(await js(`(() => {
  const bicimler = ${JSON.stringify(bicimler)};
  const eksik = ["bars", "dots", "pixels", "ring", "square"].filter((b) => !bicimler[b]);
  if (eksik.length) return JSON.stringify({ hata: "spinner sayfasında bulunamadı: " + eksik.join(", ") });
  const kap = document.createElement("div"); kap.style.cssText = "padding:40px;display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start"; document.body.append(kap);
  const r = (el) => el.getBoundingClientRect();
  const out = [];
  for (const boy of ["sm", "", "lg"]) for (const varyant of ["primary", "soft", "ghost", "danger"]) for (const bicim of Object.keys(bicimler)) {
    const sinif = ["tamga-btn", "tamga-btn-" + varyant, boy ? "tamga-btn-" + boy : ""].join(" ").trim();
    const mesgul = document.createElement("button"); mesgul.type = "button"; mesgul.className = sinif; mesgul.setAttribute("data-busy", "true"); mesgul.disabled = true;
    mesgul.innerHTML = bicimler[bicim] + '<span class="invisible" aria-hidden="true">Kaydediliyor</span>'; kap.append(mesgul);
    const ikiz = document.createElement("button"); ikiz.type = "button"; ikiz.className = sinif; ikiz.textContent = "Kaydediliyor"; kap.append(ikiz);
    const sp = mesgul.querySelector('[role="status"]');
    /* Boyanan sınırlar: çocuğu olan biçimlerde çocukların birleşimi, yoksa kökün kendisi. */
    const parcalar = sp.children.length ? [...sp.children] : [sp];
    const rects = parcalar.map(r);
    const b = r(mesgul);
    const sol = Math.min(...rects.map((x) => x.left)), sag = Math.max(...rects.map((x) => x.right)), ust = Math.min(...rects.map((x) => x.top)), alt = Math.max(...rects.map((x) => x.bottom));
    out.push({ boy: boy || "base", varyant, bicim, dx: +(((sol + sag) / 2) - (b.left + b.width / 2)).toFixed(1), dy: +(((ust + alt) / 2) - (b.top + b.height / 2)).toFixed(1), kokGenislik: Math.round(r(sp).width), genislik: Math.round(b.width), ikiz: Math.round(r(ikiz).width) });
  }
  return JSON.stringify(out);
})()`));
ws.close(); proc.kill();
let hata = 0;
if (sonuc.hata) { console.log("✗ " + sonuc.hata); hata = 1; }
else for (const s of sonuc) {
  const ok = Math.abs(s.dx) <= 1 && Math.abs(s.dy) <= 1 && Math.abs(s.genislik - s.ikiz) <= 1;
  if (!ok) hata = 1;
  if (!ok || s.varyant === "primary") console.log((ok ? "✓" : "✗") + " " + s.boy.padEnd(4) + " " + s.varyant.padEnd(7) + " " + s.bicim.padEnd(6) + " dx " + s.dx + " dy " + s.dy + " kök " + s.kokGenislik + " genişlik " + s.genislik + "/" + s.ikiz);
}
console.log(hata ? "✗ Meşgul düğme ölçümü başarısız." : "✓ Beş spinner biçimi, üç boy, dört varyant: boyanan parçalar ortada, genişlik korunuyor (" + sonuc.length + " düğme).");
process.exit(hata);
