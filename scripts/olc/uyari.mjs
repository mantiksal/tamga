#!/usr/bin/env node
/**
 * TARAYICI ÖLÇÜMÜ · satır içi Alert'te karo (başlığın içinde), eylem ve kapatma
 * başlığın İLK satırının ortasında mı; banner'da karo, eylem ve kapatma metin
 * bloğunun ortasında mı (gövdeliyken karo 2 px aşağıda). Gövdesiz, gövdeli ve
 * 390px'te çok satıra inen başlık; fark en çok 1 px. Doğrudan Chrome (CDP); elle: `pnpm olc:uyari [klasör]`
 * (klasör verilirse ekran görüntüsü oraya).
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
const olc = async (genislik) => {
  await gonder("Emulation.setDeviceMetricsOverride", { width: genislik, height: 900, deviceScaleFactor: 2, mobile: false });
  await gonder("Page.navigate", { url: "http://localhost:6070/tr/docs/alert" });
  for (let i = 0; i < 30; i++) { await new Promise((r) => setTimeout(r, 2000)); if (await js(`document.querySelectorAll('.tamga-alert').length >= 3`)) break; }
  return JSON.parse(await js(`(() => {
    const r = (el) => el.getBoundingClientRect(); const orta = (b) => b.top + b.height / 2;
    const out = [];
    for (const a of document.querySelectorAll(".tamga-alert")) {
      const tile = a.querySelector(".tamga-alert-tile"); const p = a.querySelector(".tamga-alert-baslik");
      const rg = document.createRange(); rg.selectNodeContents(p); const satirlar = rg.getClientRects(); const satir = satirlar[0];
      const kapat = a.querySelector(".tamga-alert-kapat"); const eylem = a.querySelector(".tamga-alert-eylem");
      /* Satır içi: karo başlığın içinde, eylem ve kapatma ilk satırın ortasında. Banner: karo,
         eylem ve kapatma metin BLOĞUNUN ortasında (0.14.1); alta sarmış eylem ölçülmüyor. */
      const banner = a.dataset.look === "banner"; const metin = a.querySelector(".tamga-alert-metin");
      const eksen = banner ? orta(r(metin)) : orta(satir);
      const sarmis = (e) => e && r(e).top >= r(metin).bottom;
      out.push({ baslik: p.textContent.slice(0, 22), look: banner ? "banner" : "inline", govde: metin.querySelector(".tamga-alert-govde") ? "gövdeli" : "gövdesiz", satir: Math.round(r(p).height / satir.height), karo: +(orta(r(tile)) - eksen).toFixed(1), kapat: kapat && !sarmis(kapat) ? +(orta(r(kapat)) - eksen).toFixed(1) : null, eylem: eylem && !sarmis(eylem) ? +(orta(r(eylem)) - eksen).toFixed(1) : null });
    }
    const uzun = [...document.querySelectorAll(".tamga-alert-baslik")].sort((a, b) => b.textContent.length - a.textContent.length)[0];
    const kap = uzun.closest(".tamga-alert").parentElement;
    kap.scrollIntoView({ block: "start" });
    const b = kap.getBoundingClientRect();
    return JSON.stringify({ uyarilar: out, kutu: { x: b.x + window.scrollX, y: b.y + window.scrollY, w: b.width, h: Math.min(b.height, 640) } });
  })()`));
};
const genis = await olc(1280);
const dar = await olc(390);
if (klasor) {
  const k = dar.kutu;
  const shot = await gonder("Page.captureScreenshot", { format: "png", clip: { x: Math.max(0, k.x - 4), y: Math.max(0, k.y - 4), width: k.w + 8, height: k.h + 8, scale: 2 } });
  writeFileSync(`${klasor}/uyari-390.png`, Buffer.from(shot.result.data, "base64"));
}
ws.close(); proc.kill();
let hata = 0;
const soyle = (k, m) => { if (!k) { console.log("✗ " + m); hata = 1; } };
const hepsi = [...genis.uyarilar.map((u) => ({ ...u, en: 1280 })), ...dar.uyarilar.map((u) => ({ ...u, en: 390 }))];
soyle(hepsi.some((u) => u.govde === "gövdesiz" && u.satir === 1), "sayfada tek satırlı uyarı yok");
soyle(hepsi.some((u) => u.govde === "gövdeli"), "sayfada gövdeli uyarı yok");
soyle(hepsi.some((u) => u.en === 390 && u.satir >= 2), "390px'te çok satıra inen başlık yok");
for (const u of hepsi) {
  const ad = u.en + "px " + u.look + " " + u.govde + " " + u.satir + " satır · " + u.baslik;
  /* Gövdeli uyarıda karo bilerek 2 px aşağıda: iki satırlık bloğun yanında göz onu yüksek okuyor. */
  /* Banner'da gövdeli karo bilerek 2 px aşağıda (data-body); satır içi karo başlığın satırında. */
  const beklenen = u.look === "banner" && u.govde === "gövdeli" ? 2 : 0;
  const eksen = u.look === "banner" ? "metin bloğuyla" : "ilk satırla";
  soyle(Math.abs(u.karo - beklenen) <= 1, ad + ": karo " + eksen + " hizalı değil (" + u.karo + ", beklenen " + beklenen + ")");
  soyle(u.kapat === null || Math.abs(u.kapat) <= 1, ad + ": kapatma " + eksen + " hizalı değil (" + u.kapat + ")");
  soyle(u.eylem === null || Math.abs(u.eylem) <= 1, ad + ": eylem " + eksen + " hizalı değil (" + u.eylem + ")");
}
console.log(JSON.stringify(hepsi));
console.log(hata ? "✗ Uyarı hizası ölçümü başarısız." : "✓ Satır içi uyarıda karo, eylem ve kapatma ilk satırda, banner'da metin bloğunun ortasında; gövdesiz, gövdeli ve 390px'te çok satırlı (" + hepsi.length + " ölçüm).");
process.exit(hata);
