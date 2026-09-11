#!/usr/bin/env node
/**
 * Props tablolarını KAYNAKTAN üretir.
 *
 * NEDEN ÜRETİLİYOR. Elle yazılmış bir props tablosu, bir prop eklendiği gün
 * yalan söylemeye başlar — ve yalanı kimse fark etmez, çünkü doküman derlenmez.
 * Bu proje aynı sessiz hatanın CSS karşılığını iki kez yaşadı
 * (`.tamga-btn-success` beş dosyada kullanıldı, hiçbir yerde tanımlı değildi).
 * Bir doküman da aynı biçimde bozulur; tek fark, kimsenin ekranda görmemesi.
 *
 * NEDEN TİP DENETLEYİCİSİ KULLANMIYOR. İlk sürüm TypeScript'in `createProgram`
 * + `TypeChecker` API'sini kullanıyordu ve çalışmadı: kit **TypeScript 7**'ye
 * bağlı, yani Go ile yazılmış yeni derleyiciye, ve onda klasik JS API'si yok.
 * `typescript/unstable/sync` altında bir denetleyici var ama deneysel ve şekli
 * tamamen başka.
 *
 * İkinci bir derleyici (TypeScript 5) kurmak mümkündü ve reddedildi: kiti
 * derleyen sürüm ile dokümanı okuyan sürüm ayrıştığı gün, ikisinin farklı
 * söylediği bir prop çıkar ve hangisinin doğru olduğu belli olmaz.
 *
 * Bunun yerine kaynak SÖZDİZİMSEL okunuyor, ve bu kod tabanında bu yeterli:
 * prop'lar zaten imzanın içinde düz yazılı. İki biçim var, ikisi de çözülüyor.
 *
 *   1. Satır içi nesne tipi          `}: { state?: Tone; title: string })`
 *   2. `cva` varyant tablosu         `variant: { primary: "…", danger: "…" }`
 *
 * DOM PROP'LARI ZATEN GİRMİYOR. `React.ComponentProps<"button">` iki yüzden
 * fazla özellik getirir (`onCopy`, `aria-braillelabel` …) ve bir tablo onlarla
 * dolarsa kimse bakmaz. Sözdizimsel okuma o tipi açmadığı için eleme
 * kendiliğinden oluyor — tablo bileşenin KENDİ API'sini gösteriyor, kalanı
 * için sayfa metni "geri kalan tüm <button> nitelikleri geçerli" diyor.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dilAyir } from "./dil.mjs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
/* ÜÇ KLASÖR, BİRİ DEĞİL.
   Bu betik uzun süre yalnız `components/`e bakıyordu, ve sonucu ölçüldü:
   dokuz ŞABLONUN ve on dört BLOĞUN hiçbirinin prop tablosu yoktu. Kitin en
   üst seviyedeki, en çok sonuç doğuran API'si doküman sitesinde hiç
   görünmüyordu. Kiti kuran biri `AppShell`in dar mı geniş mi olabileceğini
   öğrenemedi ve dar'a mahkûm sandı.

   Eksiklik sessizdi çünkü kapı da aynı listeye bakıyordu: belgelenmemiş bir
   dışa vurum aranıyordu ama şablonların propları hiç çıkarılmadığı için
   karşılaştırılacak bir şey yoktu. */
const srcDirs = [
  join(root, "packages", "ui", "src", "components"),
  join(root, "packages", "ui", "src", "patterns"),
  join(root, "packages", "ui", "src", "blocks"),
];
const out = join(root, "apps", "docs", "src", "content", "props.json");

/* ------------------------------------------------------------------ *
 * Denge sayaçlı tarama.
 *
 * Bunu regex ile yapmak mümkün DEĞİL: `labels: { previousMonth: string }`
 * içindeki süslü parantez, prop listesinin sonuymuş gibi okunur ve tablo
 * sessizce yarıda kesilir. Sessizce — yani tam olarak bu betiğin engellemek
 * için var olduğu hata türü.
 * ------------------------------------------------------------------ */

/** `open` konumundan başlayıp eşleşen kapanışın indeksini verir. Dizgi ve yorum atlanır. */
function matchBrace(src, open) {
  const pairs = { "{": "}", "(": ")", "[": "]", "<": ">" };
  const close = pairs[src[open]];
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      i++;
      while (i < src.length && src[i] !== q) {
        if (src[i] === "\\") i++;
        i++;
      }
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      i = src.indexOf("*/", i) + 1;
      continue;
    }
    if (c === "/" && src[i + 1] === "/") {
      i = src.indexOf("\n", i);
      if (i < 0) break;
      continue;
    }
    if (c === src[open]) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Bir gövdeyi üst seviye `;` / `,` ile böler — iç içe yapılara girmeden. */
function splitTop(body) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      i++;
      while (i < body.length && body[i] !== q) {
        if (body[i] === "\\") i++;
        i++;
      }
      continue;
    }
    if (c === "/" && body[i + 1] === "*") {
      i = body.indexOf("*/", i) + 1;
      continue;
    }
    if (c === "/" && body[i + 1] === "/") {
      i = body.indexOf("\n", i);
      if (i < 0) break;
      continue;
    }
    /* Ok fonksiyonu: `=>` bir parantez değil. Atlanmazsa `>` derinliği düşürür
       ve o satırdan sonraki her `;` iç içeymiş gibi okunur — iç nesnelerin
       üyeleri sessizce üst seviyeye sızar. */
    if (c === "=" && body[i + 1] === ">") { i++; continue; }
    if ("{([<".includes(c)) depth++;
    else if ("})]>".includes(c)) depth--;
    else if ((c === ";" || c === ",") && depth === 0) {
      parts.push(body.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(body.slice(start));
  return parts.filter((p) => p.trim());
}

/** Bir üyenin üstündeki yorumu belge metnine çevirir — iki dilli (bkz. dil.mjs). */
function docOf(chunk) {
  const m = chunk.match(/\/\*\*?([\s\S]*?)\*\//);
  const ham = m
    ? m[1]
        .split("\n")
        .map((l) => l.replace(/^\s*\*?\s?/, "").trim())
        .join(" ")
        .replace(/\s+/g, " ")
        .trim() || null
    : (chunk.match(/^\s*\/\/\s?(.*)$/m)?.[1].trim() ?? null);
  const { en, tr } = dilAyir(ham);
  return en || tr ? { en, tr } : null;
}

/** `{ a?: X; /** doc *\/ b: Y }` gövdesini prop listesine çevirir. */
function membersOf(body) {
  const props = [];
  for (const chunk of splitTop(body)) {
    const doc = docOf(chunk);
    /* Yorumu at, kalan satırdan `ad?: tip` çıkar. */
    const bare = chunk.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "").trim();
    const m = bare.match(/^(?:"([^"]+)"|([A-Za-z_$][\w$]*))(\?)?\s*:\s*([\s\S]+)$/);
    if (!m) continue;
    const pname = m[1] ?? m[2];
    /* `className` her bileşende var ve hiçbir şey öğretmez; sayfa iskeleti
       bunu bir kez söylüyor, altmış dört tabloda tekrarlamıyor. */
    if (pname === "className") continue;
    props.push({
      name: pname,
      type: m[4].replace(/\s+/g, " ").replace(/ \| /g, " · ").trim(),
      required: !m[3],
      default: null,
      doc: doc?.en ?? null,
      docTr: doc?.tr ?? null,
    });
  }
  return props;
}

/** Takma adları yerine koyar — `VariantProps<…>` araması açılmış metinde yapılır. */
function expandAliases(text, seen = new Set()) {
  let out = text;
  for (const m of text.matchAll(/\b([A-Z][\w$]*)\b/g)) {
    const body = aliases.get(m[1]);
    if (!body || seen.has(m[1])) continue;
    seen.add(m[1]);
    out += " & " + expandAliases(body, seen);
  }
  return out;
}

/** Bir tip ifadesindeki TÜM nesne gövdelerini toplar — takma adların içindekiler dahil. */
function typeLiterals(text, seen = new Set()) {
  const bodies = [];
  const scan = (t) => {
    let i = 0;
    while ((i = t.indexOf("{", i)) >= 0) {
      const end = matchBrace(t, i);
      if (end < 0) break;
      bodies.push(t.slice(i + 1, end));
      i = end + 1;
    }
  };
  scan(text);
  for (const m of text.matchAll(/\b([A-Z][\w$]*)\b/g)) {
    const body = aliases.get(m[1]);
    if (!body || seen.has(m[1])) continue;
    seen.add(m[1]);
    bodies.push(...typeLiterals(body, seen));
  }
  return bodies;
}

/* ------------------------------------------------------------------ */

/* KAMUSAL YÜZEY, KAYNAKTAKİ `export` DEĞİL.
   `shared.tsx` içindeki `ErrorSlot` ve `Busy` şablonların iç makinesi ama
   dosya düzeyinde `export` edilmek zorundalar (komşu dosyalar import ediyor).
   Tablo onları da listeleyince, tüketicinin hiç ulaşamayacağı iki bileşen
   doküman sitesine girmeye çalıştı. Ölçüt: giriş dosyalarından yeniden dışa
   vurulmuş mu. */
const girisler = [
  join(root, "packages", "ui", "src", "index.ts"),
  join(root, "packages", "ui", "src", "patterns", "index.ts"),
  join(root, "packages", "ui", "src", "blocks", "index.ts"),
];
const kamusal = new Set();
for (const g of girisler) {
  /* YORUMLAR AYIKLANIYOR, ve ayıklanmadığı için bir kez yanlış sonuç verdi:
     giriş dosyasındaki "`ErrorSlot` dışa vurulmuyor" açıklaması, adı kamusal
     kümeye sokuyordu. Bir listeyi kaynaktan çıkarırken kaynağın ANLATISI da
     eşleşiyor. */
  const src = readFileSync(g, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  for (const m of src.matchAll(/\b([A-Z][A-Za-z0-9_]*)\b/g)) kamusal.add(m[1]);
}

/** `[klasör, dosya]` çiftleri: aynı ad iki klasörde olabilir. */
const files = srcDirs.flatMap((d) =>
  readdirSync(d)
    .filter((f) => /\.tsx?$/.test(f) && f !== "index.ts")
    .map((f) => join(d, f)),
);
const result = {};
/** `buttonVariants` → { variant: {...}, defaults: {...} } */
const cvaTables = new Map();
/** `ButtonProps` → tip gövdesi metni */
const aliases = new Map();

/* 1 · Önce cva tabloları ve tip takma adları toplanıyor: bir bileşen kendi
      dosyasındaki bir takma ada ya da bir cva tablosuna atıfta bulunabilir. */
for (const f of files) {
  const src = readFileSync(f, "utf8");

  for (const m of src.matchAll(/(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*cva\(/g)) {
    const openArgs = src.indexOf("(", m.index + m[0].length - 1);
    const end = matchBrace(src, openArgs);
    const args = src.slice(openArgs + 1, end);
    const vIdx = args.indexOf("variants:");
    const dIdx = args.indexOf("defaultVariants:");
    const table = { variants: {}, defaults: {} };
    if (vIdx >= 0) {
      const vOpen = args.indexOf("{", vIdx);
      const vBody = args.slice(vOpen + 1, matchBrace(args, vOpen));
      for (const part of splitTop(vBody)) {
        const bare = part.replace(/\/\*[\s\S]*?\*\//g, "").trim();
        const km = bare.match(/^([A-Za-z_$][\w$]*)\s*:\s*\{/);
        if (!km) continue;
        const kOpen = bare.indexOf("{");
        const kBody = bare.slice(kOpen + 1, matchBrace(bare, kOpen));
        const opts = splitTop(kBody)
          .map((p) => p.replace(/\/\*[\s\S]*?\*\//g, "").trim().match(/^([A-Za-z_$][\w$]*|true|false)\s*:/))
          .filter(Boolean)
          .map((x) => x[1]);
        table.variants[km[1]] = opts;
      }
    }
    if (dIdx >= 0) {
      const dOpen = args.indexOf("{", dIdx);
      const dBody = args.slice(dOpen + 1, matchBrace(args, dOpen));
      for (const part of splitTop(dBody)) {
        const dm = part.trim().match(/^([A-Za-z_$][\w$]*)\s*:\s*(.+)$/);
        if (dm) table.defaults[dm[1]] = dm[2].trim();
      }
    }
    cvaTables.set(m[1], table);
  }

  /* Dışa aktarılmayanlar da alınıyor: `ScoreRing` props'unu `ScoreProps`
     üzerinden veriyor ve o tip dışa aktarılmıyor — ama tablo yine gerekli.

     Gövde REGEX ile değil süslü parantez eşlemesiyle alınıyor. `[\s\S]*?;`
     gövdenin İÇİNDEKİ ilk noktalı virgülde duruyordu: `type ScoreProps = {
     value: number;` — yani tip, ilk üyesinde kesiliyor ve geri kalan bütün
     prop'lar sessizce kayboluyordu. */
  for (const m of src.matchAll(/(?:export\s+)?type\s+([A-Za-z_$][\w$]*)\s*=\s*/g)) {
    const at = m.index + m[0].length;
    if (src[at] === "{") {
      const end = matchBrace(src, at);
      if (end > 0) aliases.set(m[1], src.slice(at, end + 1));
    } else {
      const nl = src.indexOf(";", at);
      if (nl > 0) aliases.set(m[1], src.slice(at, nl));
    }
  }
}

/* 2 · Sonra bileşenler. */
for (const f of files) {
  const src = readFileSync(f, "utf8");

  /* Jenerik bileşenler de yakalanmalı: `export function Tabs<T extends string>(`.
     Tip parametresi listesi atlanmazsa dört bileşen (Combobox · RadioGroup ·
     Segmented · Tabs) tabloya HİÇ girmiyordu — ve eksikliği ancak dışa
     aktarılanlarla karşılaştırınca görünüyor. */
  for (const m of src.matchAll(/export\s+function\s+([A-Z][\w$]*)\s*(?:<[^>]*>)?\s*\(/g)) {
    const name = m[1];
    const openParen = src.indexOf("(", m.index + m[0].length - 1);
    const closeParen = matchBrace(src, openParen);
    if (closeParen < 0) continue;
    const params = src.slice(openParen + 1, closeParen);

    /* Yıkım varsayılanları: tip sistemi bunları bilmez, yalnız imza taşır. */
    const defaults = new Map();
    if (params.trimStart().startsWith("{")) {
      const dOpen = params.indexOf("{");
      const dBody = params.slice(dOpen + 1, matchBrace(params, dOpen));
      for (const part of splitTop(dBody)) {
        const dm = part.replace(/\/\*[\s\S]*?\*\//g, "").trim().match(/^([A-Za-z_$][\w$]*)\s*=\s*([\s\S]+)$/);
        if (dm) defaults.set(dm[1], dm[2].replace(/\s+/g, " ").trim());
      }
    }

    /* Tip: ya satır içi `{...}` ya da bir takma ad. */
    const colon = params.indexOf(":", params.indexOf("}") >= 0 ? matchBrace(params, params.indexOf("{")) : 0);
    let typeText = colon >= 0 ? params.slice(colon + 1).trim() : "";
    let props = [];

    /* Tip bir KESİŞİM olabilir: `ScoreProps & { segments?: number }`. Yalnız
       ilk parçaya bakmak `segments`i, yalnız satır içine bakmak `value` ve
       `label`ı düşürürdü — ikisi de sessiz bir eksiklik. */
    props = typeLiterals(typeText).flatMap(membersOf);
    typeText = expandAliases(typeText);

    /* cva varyantları — `VariantProps<typeof xVariants>` nerede geçerse. */
    for (const vm of typeText.matchAll(/VariantProps<\s*typeof\s+([A-Za-z_$][\w$]*)\s*>/g)) {
      const table = cvaTables.get(vm[1]);
      if (!table) continue;
      for (const [key, opts] of Object.entries(table.variants)) {
        props.push({
          name: key,
          type: opts.join(" · "),
          required: false,
          default: table.defaults[key] ?? null,
          doc: null,
          docTr: null,
        });
      }
    }

    for (const p of props) if (defaults.has(p.name)) p.default = defaults.get(p.name);

    /* AYNI AD İKİ KEZ ÇIKMAZ. `expandAliases` kesişimleri açarken bir İÇ tipin
       üyesi de üst seviyeye sızabiliyor: `EmptyRoute.note` böyle `EmptyState`in
       prop'u sanılıp tabloda iki `note` satırı üretiyordu. İkisi de aynı ada
       basıldığı için React de "aynı anahtarlı iki çocuk" diye bağırıyordu.
       Bir prop tablosunda aynı adın iki satırı YANLIŞ BİLGİDİR; ikisinden
       gerekçesi olanı, o da yoksa ilki kalıyor. */
    const teklestir = new Map();
    for (const p of props) {
      const onceki = teklestir.get(p.name);
      if (!onceki || (!onceki.doc && p.doc)) teklestir.set(p.name, p);
    }
    props = [...teklestir.values()];

    /* Zorunlular önce: okuyucunun ilk sorusu "en az ne vermem gerekiyor". */
    props.sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name));
    /* Kamusal olmayan (giriş dosyasından vurulmayan) bileşen tabloya girmiyor. */
    if (kamusal.has(name)) result[name] = props;
  }
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(result, null, 2) + "\n");

/* KAPI: yayınlanan her prop gerekçesinin Türkçesi olacak. Site iki dilli ve
   yorumların bir kısmı İngilizce bir kısmı Türkçe yazılmıştı: iki dilin
   sayfası da yarı yarıya ötekini basıyordu. Biçim `dil.mjs`de. */
const cevirisiz = Object.entries(result).flatMap(([bilesen, props]) =>
  props.filter((p) => p.doc && !p.docTr).map((p) => `${bilesen}.${p.name}`),
);
if (cevirisiz.length) {
  console.error("✗ Çevirisiz prop gerekçesi — yorumun içine `TR:` satırı eklenmeli:\n");
  for (const ad of cevirisiz) console.error(`  ${ad}`);
  console.error(`\n${cevirisiz.length} prop. Biçim:  /** English note. TR: Türkçe not. *` + `/`);
  process.exit(1);
}

const empty = Object.entries(result).filter(([, p]) => p.length === 0).map(([k]) => k);
const total = Object.values(result).reduce((n, p) => n + p.length, 0);
console.log(`✓ Props kaynaktan üretildi — ${Object.keys(result).length} bileşen, ${total} prop.`);
if (empty.length) console.log(`  prop'suz: ${empty.join(", ")}`);
