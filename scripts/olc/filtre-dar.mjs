#!/usr/bin/env node
/**
 * TARAYICI ÖLÇÜMÜ · FilterBar'ın dar ekran geçişi. jsdom CSS hesaplamıyor, bu
 * yüzden birim testi yakalayamaz. Doğrudan Chrome (CDP); elle: `pnpm olc:filtre`.
 * 390 pikselde üst alanlar display: none ve dar düğme görünür; 1280'de tersi;
 * çekmece açılınca üst alanların dar kopyası masaüstünde yer almıyor.
 */
const CH = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const { spawn } = await import("node:child_process");
const url = process.argv[2] ?? "http://localhost:6070/tr/docs/blocks";
const sonuc = {};
for (const genislik of [390, 1280]) {
  const port = 9700 + Math.floor(Math.random() * 200);
  const proc = spawn(CH, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/tamga-olc-${port}`, `--window-size=${genislik},900`, "about:blank"], { stdio: "ignore" });
  let list = null;
  for (let i = 0; i < 30 && !list; i++) { await new Promise((r) => setTimeout(r, 1000)); try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch { /* bekle */ } }
  const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
  let id = 0; const bekle = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (bekle.has(m.id)) { bekle.get(m.id)(m); bekle.delete(m.id); } };
  const gonder = (m, p) => new Promise((ok) => { const n = ++id; bekle.set(n, ok); ws.send(JSON.stringify({ id: n, method: m, params: p })); });
  await new Promise((ok) => (ws.onopen = ok));
  const js = async (e) => (await gonder("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true })).result?.result?.value;
  await gonder("Emulation.setDeviceMetricsOverride", { width: genislik, height: 900, deviceScaleFactor: 1, mobile: genislik < 640 });
  await gonder("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, 20000));
  sonuc[genislik] = JSON.parse(await js(`(async () => {
    const uyku = (ms) => new Promise((r) => setTimeout(r, ms));
    const bar = document.querySelector(".tamga-filter-bar");
    if (!bar) return JSON.stringify({ hata: "filtre çubuğu yok" });
    const d = (el) => getComputedStyle(el).display;
    const genis = [...bar.querySelectorAll(".tamga-filter-row .tamga-filter-genis")].map(d);
    const ara = getComputedStyle(bar.querySelector(".tamga-filter-ara")).flexBasis;
    const dugme = [...bar.queruerySelectorAll?.("button") ?? bar.querySelectorAll("button")].find((b) => b.querySelector(".tamga-filter-dar"));
    const darMetin = dugme ? d(dugme.querySelector(".tamga-filter-dar")) : null;
    const genisMetin = dugme ? d(dugme.querySelector(".tamga-filter-genis")) : null;
    dugme?.click(); await uyku(400);
    const form = document.querySelector(".tamga-filter-bar form, [role=dialog] form");
    const darGrup = form?.querySelector(".tamga-filter-dar");
    const darGrupGorunum = darGrup ? d(darGrup) : "yok";
    /* Çip düzeni (look="chips"): boş çipler darda gizli, dolu çip sırası yatay kayıyor. */
    const cips = document.querySelector(".tamga-filter-cips");
    const r = (el) => el.getBoundingClientRect();
    const cip = cips && (() => {
      const ara = cips.querySelector(".tamga-filter-ara-sabit");
      const araKutu = ara.querySelector("input");
      const etiket = ara.querySelector("span, .tamga-filter-ara-etiket");
      const ilkCip = cips.querySelector(".tamga-filter-cip button");
      const dolu = cips.querySelector(".tamga-filter-cip[data-set]");
      const x = dolu && dolu.querySelector(".tamga-filter-cip-x");
      const temizle = [...cips.querySelectorAll("button")].find((b) => b.textContent.trim() === "Hepsini temizle" || b.textContent.trim() === "Clear all");
      const kart = cips.closest(".tamga-filter-bar");
      const sira = cips.querySelector(".tamga-filter-cip-sira");
      return {
        bosCip: [...cips.querySelectorAll(".tamga-filter-cip:not([data-set])")].map(d),
        doluCip: [...cips.querySelectorAll(".tamga-filter-cip[data-set]")].map(d),
        sira: getComputedStyle(sira).overflowX,
        aramaTaban: getComputedStyle(ara).flexBasis,
        /* 0.8.1 */
        etiketGorunur: !!etiket && r(etiket).height > 1 && r(etiket).width > 1,
        aramaYukseklik: Math.round(r(araKutu).height),
        cipYukseklik: ilkCip ? Math.round(r(ilkCip).height) : null,
        hizaFarki: ilkCip ? +Math.abs(r(araKutu).bottom - r(ilkCip).bottom).toFixed(1) : null,
        temizleAyniSatir: temizle && ilkCip ? Math.abs(r(temizle).top + r(temizle).height / 2 - (r(ilkCip).top + r(ilkCip).height / 2)) < 4 : null,
        xKenar: x ? getComputedStyle(x).borderStyle + "/" + getComputedStyle(x).boxShadow : null,
        /* ✕ çipin kendi kenarının içinde: çip kutusu (border) ✕'i kapsıyor. */
        xIcinde: x && dolu ? r(x).right <= r(dolu).right + 0.5 && r(x).left >= r(dolu).left - 0.5 : null,
        /* Önizleme ölçekli olabilir: dolgu, kartın görünen/yerleşim genişliği oranıyla ölçekleniyor. */
        tasma: kart && sira ? +(r(sira).right - (r(kart).right - parseFloat(getComputedStyle(kart).paddingRight) * (r(kart).width / kart.offsetWidth))).toFixed(1) : null,
        rects: kart && sira ? { kart: [r(kart).left, r(kart).right].map(Math.round), pad: getComputedStyle(kart).paddingRight, cips: [r(cips).left, r(cips).right].map(Math.round), sira: [r(sira).left, r(sira).right].map(Math.round), siraW: Math.round(r(sira).width), cipsW: Math.round(r(cips).width) } : null,
        kaydirmaTasma: sira ? sira.scrollWidth > sira.clientWidth : null,
      };
    })();
    return JSON.stringify({ ustAlanlar: genis, aramaTaban: ara, dugmeDar: darMetin, dugmeGenis: genisMetin, cekmeceDarGrup: darGrupGorunum, cip });
  })()`));
  ws.close(); proc.kill();
}
console.log(JSON.stringify(sonuc));
let hata = 0;
const soyle = (k, m) => { if (!k) { console.log("✗ " + m); hata = 1; } };
const dar = sonuc[390], genis = sonuc[1280];
soyle(dar && !dar.hata && genis && !genis.hata, "çubuk bulunamadı");
if (dar && genis && !dar.hata && !genis.hata) {
  soyle(dar.ustAlanlar.length > 0 && dar.ustAlanlar.every((v) => v === "none"), "390: üst alanlar gizlenmiyor");
  soyle(dar.aramaTaban === "0px", "390: aramanın tabanı 0 değil (" + dar.aramaTaban + ")");
  soyle(dar.dugmeDar !== "none" && dar.dugmeGenis === "none", "390: düğme dar metni göstermiyor");
  soyle(dar.cekmeceDarGrup !== "none" && dar.cekmeceDarGrup !== "yok", "390: çekmecede üst alan grubu yok");
  soyle(genis.ustAlanlar.length > 0 && genis.ustAlanlar.every((v) => v !== "none"), "1280: üst alanlar satırda görünmüyor");
  soyle(genis.dugmeDar === "none" && genis.dugmeGenis !== "none", "1280: düğme geniş metni göstermiyor");
  soyle(genis.cekmeceDarGrup === "none", "1280: üst alanlar çekmecede de görünüyor (iki kez)");
  if (dar.cip && genis.cip) {
    soyle(dar.cip.bosCip.length > 0 && dar.cip.bosCip.every((v) => v === "none"), "390 çipler: boş çipler gizlenmiyor");
    soyle(dar.cip.doluCip.every((v) => v !== "none") && dar.cip.sira === "auto", "390 çipler: dolu çipler kayan sırada değil");
    soyle(dar.cip.aramaTaban === "0px", "390 çipler: arama tabanı 0 değil (" + dar.cip.aramaTaban + ")");
    soyle(genis.cip.bosCip.every((v) => v !== "none") && genis.cip.aramaTaban === "280px", "1280 çipler: boş çipler görünmüyor ya da arama 280px değil");
    for (const [g, c] of [[1280, genis.cip], [390, dar.cip]]) {
      soyle(!c.etiketGorunur, g + " çipler: aramanın görünür etiketi gizli değil");
      soyle(c.cipYukseklik === null || c.aramaYukseklik === c.cipYukseklik, g + " çipler: arama ile çip yükseklikleri farklı (" + c.aramaYukseklik + "/" + c.cipYukseklik + ")");
      /* Hiza yalnız genişte: darda dolu çipler bilerek ikinci satırda. */
      soyle(g === 390 || c.hizaFarki === null || c.hizaFarki <= 1, g + " çipler: arama ile ilk çip aynı hizada değil (" + c.hizaFarki + "px)");
      soyle(c.xKenar === null || (c.xKenar.startsWith("none") && c.xKenar.endsWith("none")), g + " çipler: ✕ kendi kenarını/gölgesini taşıyor (" + c.xKenar + ")");
      soyle(c.xIcinde !== false, g + " çipler: ✕ çipin kenarının içinde değil");
      soyle(c.tasma === null || c.tasma <= 0.5, g + " çipler: çip sırası kartın sağından taşıyor (" + c.tasma + "px)");
    }
    soyle(genis.cip.temizleAyniSatir !== false, "1280 çipler: Hepsini temizle çiplerle aynı satırda değil");
  } else console.log("(çip düzeni sayfada yok, ölçülmedi)");
}
console.log(hata ? "✗ Dar ekran geçişi ölçümü başarısız." : "✓ Dar ekranda arama + Filtrele, genişte alanlar satırda; çekmecede çift alan yok; çip düzeni iki genişlikte de doğru.");
process.exit(hata);
