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
/* Üçüncü sahne: 1280 piksel görünümde çip çubuğu 210 piksellik bir kaba sokuluyor ·
   telefonda sol menü açıkken kartın kaldığı genişlik. Dar düzen ekrana değil kaba
   bağlı olmalı; galeri önizlemesi kartı geniş tuttuğu için bu taşma orada görünmüyordu. */
for (const genislik of [390, 1280, "kap210", "izgara"]) {
  const port = 9700 + Math.floor(Math.random() * 200);
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
  const gorunum = typeof genislik === "string" ? 1280 : genislik;
  await gonder("Emulation.setDeviceMetricsOverride", { width: gorunum, height: 900, deviceScaleFactor: 1, mobile: gorunum < 640 });
  await gonder("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, 20000));
  /* Kap sahnesinde önce üç filtre dolduruluyor (her çipin panelinden ilk gerçek seçenek),
     sonra kart daraltılıyor: ezilen çip ancak dolu çiplerle görünür. */
  if (genislik === "kap210") await js(`(async () => {
    const uyku = (ms) => new Promise((r) => setTimeout(r, ms));
    const cips = document.querySelector(".tamga-filter-cips");
    for (let i = 0; i < 6; i++) {
      const bos = cips?.querySelector(".tamga-filter-cip:not([data-set]) button");
      if (!bos) break;
      bos.click(); await uyku(120);
      const secenek = [...document.querySelectorAll('[role="option"]')].find((o) => o.getAttribute("aria-selected") !== "true");
      secenek?.click(); await uyku(120);
    }
  })()`);
  if (genislik === "kap210") await js(`(() => {
    const daralt = (bar, w) => { if (!bar) return; for (let e = bar; e; e = e.parentElement) { if (getComputedStyle(e).transform !== "none") e.style.transform = "none"; } bar.style.width = w; bar.style.boxSizing = "border-box"; };
    daralt(document.querySelector(".tamga-filter-row")?.closest(".tamga-filter-bar"), "360px");
    daralt(document.querySelector(".tamga-filter-cips")?.closest(".tamga-filter-bar"), "210px");
  })()`);
  if (genislik === "izgara") {
    /* Izgara sahnesi: 6 alanlı grid çubuğu 1260 px kapta tek satır, 1000 px kapta eşit iki satır;
       arama dışında hiçbir alan öbürlerinden geniş değil. */
    sonuc.izgara = JSON.parse(await js(`(() => {
      const satir = document.querySelector(".tamga-filter-izgara"); if (!satir) return JSON.stringify(null);
      const bar = satir.closest(".tamga-filter-bar");
      for (let e = bar; e; e = e.parentElement) { if (getComputedStyle(e).transform !== "none") e.style.transform = "none"; }
      const olc = (w) => {
        bar.style.width = w + "px"; bar.style.boxSizing = "border-box";
        void bar.offsetWidth;
        const r = (el) => el.getBoundingClientRect();
        const ara = satir.querySelector(".tamga-filter-ara");
        const alanlar = [...satir.querySelectorAll(":scope > .tamga-filter-alan")];
        const genislikler = alanlar.map((a) => Math.round(r(a).width));
        const ustler = [...new Set([ara, ...alanlar].map((a) => Math.round(r(a).top)))];
        return { kap: w, display: getComputedStyle(satir).display, satirSayisi: ustler.length, satirGenislik: Math.round(r(satir).width), aramaGenislik: Math.round(r(ara).width), alanGenislikleri: genislikler, fark: Math.max(...genislikler) - Math.min(...genislikler) };
      };
      return JSON.stringify({ genis: olc(1260), dar: olc(1000) });
    })()`));
    ws.close(); proc.kill();
    continue;
  }
  sonuc[genislik] = JSON.parse(await js(`(async () => {
    const uyku = (ms) => new Promise((r) => setTimeout(r, ms));
    /* Kutu düzeninin çubuğu ve çip düzeninin çubuğu ayrı ayrı bulunuyor. */
    const bar = document.querySelector(".tamga-filter-row")?.closest(".tamga-filter-bar");
    if (!bar) return JSON.stringify({ hata: "filtre çubuğu yok" });
    const d = (el) => getComputedStyle(el).display;
    const genis = [...bar.querySelectorAll(".tamga-filter-row .tamga-filter-genis")].map(d);
    /* Çip çubuğunda kutu düzeninin araması yok; kap sahnesinde yalnız çipler ölçülüyor. */
    const araKutuDuzeni = bar.querySelector(".tamga-filter-ara");
    const ara = araKutuDuzeni ? getComputedStyle(araKutuDuzeni).flexBasis : "yok";
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
        /* Kartın YERLEŞİM genişliği: galeri önizlemesi kartı geniş kurup görsel olarak
           küçültüyor; @container yerleşime bakar, bu yüzden geniş kart darda da geniş düzendir. */
        kapGenisligi: kart.offsetWidth,
        /* 210 px kutu düzeni: arama ≥ 120 px, etiket gizli, uygulanan çip tek satır. */
        dar210: (() => {
          const eskiW = bar.style.width; bar.style.width = "210px"; void bar.offsetWidth;
          const inp = bar.querySelector(".tamga-filter-ara input");
          const ad = bar.querySelector(".tamga-filter-ara-ad");
          const tokenlar = [...bar.querySelectorAll(".tamga-token")];
          const out = { aramaGenislik: inp ? Math.round(r(inp).width) : null, adGorunur: ad ? r(ad).width > 1 && r(ad).height > 1 : null, cipYukseklikleri: tokenlar.map((t) => Math.round(r(t).height)), cipSayisi: tokenlar.length };
          bar.style.width = eskiW; void bar.offsetWidth;
          return out;
        })(),
        /* Dolu çipler ezilmesin: her çipin genişliği içeriğine eşit, sıra kendi içinde kayıyor. */
        doluCipSayisi: cips.querySelectorAll(".tamga-filter-cip[data-set]").length,
        ezilen: [...cips.querySelectorAll(".tamga-filter-cip[data-set]")].filter((c) => c.scrollWidth > c.clientWidth + 1 || [...c.querySelectorAll("button")].some((b) => b.scrollWidth > b.clientWidth + 1)).length,
        siraKayiyor: sira ? sira.scrollWidth > sira.clientWidth : null,
        ayrinti: (() => { const dugme = [...cips.querySelectorAll("button")].find((b) => b.querySelector(".tamga-filter-dar")); return { siraDisplay: sira && d(sira), dugmeDisplay: dugme && d(dugme), dugmeSag: dugme && Math.round(r(dugme).right), kartSag: Math.round(r(kart).right), kapTuru: getComputedStyle(kart).containerType, kartW: Math.round(r(kart).width) }; })(),
        dugmeIcinde: (() => { const dugme = [...cips.querySelectorAll("button")].find((b) => b.querySelector(".tamga-filter-dar")); const icSag = r(kart).right - parseFloat(getComputedStyle(kart).paddingRight) * (r(kart).width / kart.offsetWidth); return dugme ? r(dugme).right <= icSag + 0.5 && d(dugme) !== "none" : null; })(),
        araIcinde: (() => { const icSag = r(kart).right - parseFloat(getComputedStyle(kart).paddingRight) * (r(kart).width / kart.offsetWidth); return r(ara).right <= icSag + 0.5; })(),
      };
    })();
    return JSON.stringify({ ustAlanlar: genis, aramaTaban: ara, dugmeDar: darMetin, dugmeGenis: genisMetin, cekmeceDarGrup: darGrupGorunum, kapGenisligi: bar.offsetWidth, cip });
  })()`));
  ws.close(); proc.kill();
}
console.log(JSON.stringify(sonuc));
let hata = 0;
const soyle = (k, m) => { if (!k) { console.log("✗ " + m); hata = 1; } };
const genis = sonuc[1280], kapS = sonuc.kap210;
soyle(genis && !genis.hata && kapS && !kapS.hata, "çubuk bulunamadı");
if (genis && !genis.hata && kapS && !kapS.hata) {
  /* @container yerleşim genişliğine bakar: 390 sahnesinde galeri kartı geniş kuruyorsa
     dar ölçüm 1280 ekrandaki daraltılmış kap sahnesinden alınır. */
  const dar390 = sonuc[390] && !sonuc[390].hata && sonuc[390].kapGenisligi < 640 ? sonuc[390] : null;
  const dar = dar390 ?? kapS;
  const darAd = dar390 ? "390" : "360 px kap";
  if (!dar390) console.log("(390: kutu çubuğunun kartı yerleşimde " + (sonuc[390]?.kapGenisligi ?? "?") + " px, galeri geniş kuruyor; dar ölçüm " + darAd + " sahnesinde)");
  soyle(dar.ustAlanlar.length > 0 && dar.ustAlanlar.every((v) => v === "none"), darAd + ": üst alanlar gizlenmiyor");
  soyle(dar.aramaTaban === "120px", darAd + ": aramanın tabanı 7.5rem değil (" + dar.aramaTaban + ")");
  soyle(dar.dugmeDar !== "none" && dar.dugmeGenis === "none", darAd + ": düğme dar metni göstermiyor");
  soyle(dar.cekmeceDarGrup !== "none" && dar.cekmeceDarGrup !== "yok", darAd + ": çekmecede üst alan grubu yok");
  soyle(genis.ustAlanlar.length > 0 && genis.ustAlanlar.every((v) => v !== "none"), "1280: üst alanlar satırda görünmüyor");
  soyle(genis.dugmeDar === "none" && genis.dugmeGenis !== "none", "1280: düğme geniş metni göstermiyor");
  soyle(genis.cekmeceDarGrup === "none", "1280: üst alanlar çekmecede de görünüyor (iki kez)");

  const ortak = (ad, c, { hiza }) => {
    soyle(!c.etiketGorunur, ad + ": aramanın görünür etiketi gizli değil");
    soyle(c.cipYukseklik === null || c.aramaYukseklik === c.cipYukseklik, ad + ": arama ile çip yükseklikleri farklı (" + c.aramaYukseklik + "/" + c.cipYukseklik + ")");
    if (hiza) soyle(c.hizaFarki === null || c.hizaFarki <= 1, ad + ": arama ile ilk çip aynı hizada değil (" + c.hizaFarki + "px)");
    soyle(c.xKenar === null || (c.xKenar.startsWith("none") && c.xKenar.endsWith("none")), ad + ": ✕ kendi kenarını/gölgesini taşıyor (" + c.xKenar + ")");
    soyle(c.xIcinde !== false, ad + ": ✕ çipin kenarının içinde değil");
    soyle(c.tasma === null || c.tasma <= 0.5, ad + ": çip sırası kartın sağından taşıyor (" + c.tasma + "px)");
  };
  const darKap = (ad, c) => {
    if (c.bosCip.length > 0) soyle(c.bosCip.every((v) => v === "none"), ad + ": boş çipler gizlenmiyor");
    soyle(c.doluCip.every((v) => v !== "none") && c.sira === "auto", ad + ": dolu çipler kayan sırada değil");
    soyle(c.aramaTaban === "0px", ad + ": arama tabanı 0 değil (" + c.aramaTaban + ")");
    soyle(c.araIcinde, ad + ": arama kutusu kartın sağından taşıyor");
    soyle(c.dugmeIcinde, ad + ": Filtrele düğmesi kartın dışında");
    ortak(ad, c, { hiza: false });
  };
  if (!genis.cip) console.log("(çip düzeni sayfada yok, ölçülmedi)");
  else {
    soyle(genis.cip.bosCip.every((v) => v !== "none") && genis.cip.aramaTaban === "280px", "1280 çipler: boş çipler görünmüyor ya da arama 280px değil");
    soyle(genis.cip.temizleAyniSatir !== false, "1280 çipler: Hepsini temizle çiplerle aynı satırda değil");
    ortak("1280 çipler", genis.cip, { hiza: true });
    const cip390 = sonuc[390]?.cip && sonuc[390].cip.kapGenisligi < 640 ? sonuc[390].cip : null;
    if (cip390) darKap("390 çipler", cip390);
    soyle(kapS.cip, "210 px kap: çip çubuğu bulunamadı");
    if (kapS.cip) {
      darKap("210 px kap (1280 ekranda)", kapS.cip);
      const d = kapS.cip.dar210;
      if (d) {
        soyle(d.aramaGenislik !== null && d.aramaGenislik >= 120, "210 px kutu düzeni: arama kutusu 120 px'in altında (" + d.aramaGenislik + ")");
        soyle(d.adGorunur === false, "210 px kutu düzeni: aramanın etiketi görünür");
        soyle(d.cipSayisi > 0 && d.cipYukseklikleri.every((h) => h <= 32), "210 px kutu düzeni: uygulanan çip tek satır değil (" + d.cipYukseklikleri.join("/") + ")");
      }
      soyle(kapS.cip.doluCipSayisi >= 3, "210 px kap: en az üç dolu çip kurulamadı (" + kapS.cip.doluCipSayisi + ")");
      soyle(kapS.cip.ezilen === 0, "210 px kap: " + kapS.cip.ezilen + " dolu çip eziliyor (genişliği içeriğinden küçük)");
      soyle(kapS.cip.siraKayiyor === true, "210 px kap: çip sırası kaymıyor (scrollWidth ≤ clientWidth)");
    }
  }
}
const iz = sonuc.izgara;
if (!iz) console.log("(ızgara düzeni sayfada yok, ölçülmedi)");
else {
  soyle(iz.genis.display === "grid" && iz.dar.display === "grid", "ızgara: grid değil");
  soyle(iz.genis.satirSayisi === 1, "ızgara 1260 px: tek satır değil (" + iz.genis.satirSayisi + " satır)");
  soyle(Math.abs(iz.genis.aramaGenislik - 256) <= 1, "ızgara 1260 px: arama 16rem değil (" + iz.genis.aramaGenislik + ")");
  soyle(iz.genis.fark <= 1, "ızgara 1260 px: alanlar eşit değil (" + iz.genis.alanGenislikleri.join("/") + ")");
  /* Alanlar satırı dolduruyor: arama + alanlar + aralıklar = satır genişliği (hücrenin yarısına inen tavan yok). */
  const dolu = iz.genis.aramaGenislik + iz.genis.alanGenislikleri.reduce((a, b) => a + b, 0) + 12 * iz.genis.alanGenislikleri.length;
  soyle(Math.abs(dolu - iz.genis.satirGenislik) <= 4, "ızgara 1260 px: alanlar satırı doldurmuyor (" + dolu + " / " + iz.genis.satirGenislik + ")");
  soyle(iz.dar.satirSayisi === 2, "ızgara 1000 px: iki satır değil (" + iz.dar.satirSayisi + ")");
  soyle(iz.dar.fark <= 1, "ızgara 1000 px: alanlar eşit değil (" + iz.dar.alanGenislikleri.join("/") + ")");
  soyle(Math.abs(iz.dar.aramaGenislik - (2 * iz.dar.alanGenislikleri[0] + 12)) <= 4, "ızgara 1000 px: arama iki sütun değil (" + iz.dar.aramaGenislik + ")");
}
console.log(hata ? "✗ Dar ekran geçişi ölçümü başarısız." : "✓ Kutu düzeni dar/geniş; çip düzeni 1280'de ve 210 px kapta doğru: dar düzen kaba bağlı, taşma yok.");
process.exit(hata);
