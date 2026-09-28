"use client";

import { useMemo, useState } from "react";
import { Icon, Input, Segmented, toneOf } from "tamga-ui";
import type { IconSize } from "tamga-ui";
import * as KIT_IKONLARI from "tamga-ui/icons";
import {
  ArrowLeft,
  ArrowSquareOut,
  Bell,
  Calendar,
  Check,
  Close,
  Copy,
  Failure,
  Folder,
  Plus,
  Search,
  Settings,
  SquaresFour,
  Success,
  Warning,
} from "tamga-ui/icons";
import ham from "@/content/icons.json";

/** `Icon`un aldığı dört ağırlık · varsayılan duotone. */
type Agirlik = "duotone" | "regular" | "bold" | "fill";
const AGIRLIKLAR: Agirlik[] = ["duotone", "regular", "bold", "fill"];

/**
 * Altı boy, ve YANINDA DURDUĞU metin kademesi.
 *
 * Eşleme demo için: bir ikonun kendi ölçüsü yok, yanına konduğu şeyin
 * kademesini alıyor · merdiven ancak o eşi ile birlikte okunuyor.
 */
const BOYLAR: readonly (readonly [IconSize, string])[] = [
  ["xs", "--text-caption"],
  ["sm", "--text-small"],
  ["base", "--text-body"],
  ["md", "--text-control"],
  ["lg", "--text-title"],
  ["xl", "--text-title"],
];

/**
 * İkon tarayıcısı — ÜRETİLEN veriden, ama GLİFLER canlı.
 *
 * Liste `scripts/extract-icons.mjs` ile `icons.ts`ten çıkarılıyor; çizilen
 * simge ise `tamga-ui/icons`ten ADIYLA aranıyor. Yani iki uçtan da kaynağa
 * bağlı: bir ikon eklendiği an listede belirir, kaldırıldığı an kaybolur, ve
 * arada bir ekran görüntüsü yok.
 *
 * TIKLAYINCA KOPYALANAN ŞEY ROL ADI. Aradığın glifi Phosphor adıyla biliyor
 * olabilirsin (`Trash`), o yüzden o ad da yazılı ve arama onu da tarıyor; ama
 * koda giren her zaman kitin verdiği rol adı (`Delete`). Kitin kendi kuralı:
 * çağrı yeri ROLÜ okur, glifi değil.
 */

type Ikon = {
  ad: string;
  phosphor: string;
  /** Slug, etiket değil: etiket aşağıdaki sözlükten geliyor. */
  grup: string;
};

/**
 * GRUP ETİKETLERİ SAYFANIN SÖZLÜĞÜNDE, kaynağın yorumunda değil.
 *
 * Kaynaktaki başlıklar Türkçe ("yön ve gezinme") ve doğrudan basılıyordu:
 * İngilizce sayfa Türkçe başlıklar gösteriyordu. Bir grup adı bir ETİKETTİR,
 * ve doküman sitesi iki dilli olduğu için etiketin de iki dili olmak zorunda.
 * Kaynaktaki yorum bakımcının dili; okuyucunun dili burada yaşıyor.
 */
const GRUP: Record<string, { tr: [string, string]; en: [string, string] }> = {
  eylemler: {
    tr: ["Eylemler", "Bir şeyi başlatan, durduran, silen glifler."],
    en: ["Actions", "Glyphs that start, stop or delete something."],
  },
  "yon-ve-gezinme": {
    tr: ["Yön ve gezinme", "Oklar ve şeritler; bir yere işaret ediyorlar."],
    en: ["Direction and navigation", "Arrows and carets; they point somewhere."],
  },
  gorunumler: {
    tr: ["Görünümler", "Aynı verinin farklı düzenleri: pano, liste, zaman çizelgesi."],
    en: ["Views", "The same data in different layouts: board, list, timeline."],
  },
  "durum-ve-nesneler": {
    tr: ["Durum ve nesneler", "Bir şeyin hâlini ya da bir nesneyi gösterenler."],
    en: ["State and objects", "Glyphs for a state, or for a thing."],
  },
  "tuval-ve-gorsel": {
    tr: ["Tuval ve görsel", "Bir görseli düzenleyen her üründe aynı fiiller."],
    en: ["Canvas and image", "The same verbs in every product that edits an image."],
  },
  "metin-bicimlendirme": {
    tr: ["Metin biçimlendirme", "Bir editörün tuş takımı her üründe aynı şeyi yapıyor."],
    en: ["Text formatting", "An editor's keypad does the same job in every product."],
  },
  "saglayici-isaretleri": {
    tr: ["Sağlayıcı işaretleri", "Oturum ekranlarının her üründe ihtiyacı oluyor."],
    en: ["Provider marks", "Every product's sign-in screen needs these."],
  },
};

const IKONLAR = ham as Ikon[];
const KAYIT = KIT_IKONLARI as unknown as Record<string, Parameters<typeof Icon>[0]["icon"]>;

type Metinler = {
  ara: string;
  temizle: string;
  sayac: (n: number, m: number) => string;
  bos: string;
  kopyala: string;
  kopyalandi: string;
  phosphorAdi: string;
  tumH: string;
  tumP: (n: number) => string;
  tumSayac: (g: number, n: number) => string;
  tumBos: string;
  tumIpucu: string;
  daha: (n: number) => string;
  rolSutun: string;
  kendiAdi: (n: number) => string;
  wVarsayilan: string;
  wDurum: string;
  wSatirIci: string;
  wNeden: string;
  eylemler: readonly string[];
  eslesme: readonly string[];
};

const L: Record<"tr" | "en", Metinler> = {
  tr: {
    ara: "Rol ya da Phosphor adı ara",
    temizle: "Aramayı temizle",
    sayac: (n, m) => (n === m ? `${n} rol` : `${n} / ${m} rol`),
    bos: "Bu aramayla ikon bulunamadı.",
    kopyala: "adını kopyala",
    kopyalandi: "Kopyalandı",
    phosphorAdi: "Phosphor adı",
    tumH: "Tüm set",
    /* Ters tırnak YOK: bu metin düz bir `span`a basılıyor ve ekranda tırnağın
       kendisi görünüyordu. */
    tumP: (n: number) =>
      `Setinde olmayan bir glif aynı girişten geliyor: tamga-ui/icons · ${n} glif.`,
    tumSayac: (g: number, n: number) => `${g} / ${n}`,
    tumBos: "Bu aramayla glif yok.",
    tumIpucu: "Aramaya yaz: bütün set taranıyor.",
    daha: (n: number) => `+${n} daha · aramayı daralt`,
    rolSutun: "Rol (kodda)",
    /* "Rollerin 36'i" yanlış ve sayıya göre değişiyor (36'sı, 40'ı, 3'ü):
       Türkçede bir ekin biçimi son heceye bağlı, ve bir sayı şablonu o eki
       doğru üretemiyor. Cümle eki istemeyecek şekilde kuruluyor. */
    kendiAdi: (n) => `${n} rol kendi adını taşıyor.`,
    wVarsayilan: "varsayılan",
    wDurum: "Renk yalnız durum taşıdığında ayrışıyor.",
    wSatirIci: "satır içi eylem",
    wNeden: "Onay, kapat, ekle, kopyala: iç alanı olmayan glifler kalın basılıyor.",
    eylemler: ["Onayla", "Kapat", "Ekle", "Kopyala"],
    eslesme: [
      "çip metni yanında",
      "küçük metin yanında",
      "gövde metni yanında",
      "girdi yanında",
      "başlık yanında",
      "boş durum işareti",
    ],
  },
  en: {
    ara: "Search a role or Phosphor name",
    temizle: "Clear the search",
    sayac: (n, m) => (n === m ? `${n} roles` : `${n} / ${m} roles`),
    bos: "No icon matches that search.",
    kopyala: "copy its name",
    kopyalandi: "Copied",
    phosphorAdi: "Phosphor name",
    tumH: "The full set",
    tumP: (n: number) =>
      `A glyph the set lacks comes through the same door: tamga-ui/icons · ${n} glyphs.`,
    tumSayac: (g: number, n: number) => `${g} / ${n}`,
    tumBos: "No glyph matches that search.",
    tumIpucu: "Type in the search box: the whole set is scanned.",
    daha: (n: number) => `+${n} more · narrow the search`,
    rolSutun: "Role (in code)",
    kendiAdi: (n) => `${n} roles carry a name of their own.`,
    wVarsayilan: "default",
    wDurum: "Colour diverges only when it carries state.",
    wSatirIci: "inline action",
    wNeden: "Check, close, add, copy: glyphs with no interior render bold.",
    eylemler: ["Confirm", "Close", "Add", "Copy"],
    eslesme: [
      "beside chip text",
      "beside small text",
      "beside body text",
      "beside an input",
      "beside a title",
      "an empty-state mark",
    ],
  },
};

function Kutu({
  ikon,
  s,
  agirlik,
  boy,
}: {
  ikon: Ikon;
  s: Metinler;
  agirlik: Agirlik;
  boy: IconSize;
}) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const glif = KAYIT[ikon.ad];
  if (!glif) return null;

  return (
    <button
      type="button"
      aria-label={`${ikon.ad} ${s.kopyala}`}
      title={ikon.phosphor !== ikon.ad ? `${ikon.ad} · ${s.phosphorAdi}: ${ikon.phosphor}` : ikon.ad}
      data-alindi={kopyalandi || undefined}
      onClick={() => {
        navigator.clipboard?.writeText(ikon.ad);
        setKopyalandi(true);
        window.setTimeout(() => setKopyalandi(false), 1400);
      }}
      className="ik-kutu"
    >
      {/* GLİF ALANI SABİT: boyut şeridi 14'ten 32'ye çıkıyor ve alan da onunla
          büyüseydi ızgara her seçimde yeniden dizilirdi. */}
      <span className="ik-glif">
        <Icon icon={kopyalandi ? Check : glif} size={boy} weight={agirlik} />
      </span>
      <code className="ik-ad">{kopyalandi ? `✓ ${s.kopyalandi}` : ikon.ad}</code>
      {/* PHOSPHOR ADI SATIRI BOŞKEN DE DURUYOR: kırk sekiz rol kendi adını
          taşıyor, ve satır kaybolunca ızgara tırtıklı oluyordu. */}
      <span className="ik-ph">{ikon.phosphor === ikon.ad ? "" : ikon.phosphor}</span>
    </button>
  );
}

/** Rol ↔ Phosphor · adın neden bizim olduğunu altı satırda gösteren tablo. */
export function AdTablosu({ lang }: { lang: "tr" | "en" }) {
  const s = L[lang];
  const degisen = IKONLAR.filter((i) => i.ad !== i.phosphor);
  /* SEÇİLMİŞ ALTI SATIR, ilk altı değil: `Delete ← Trash` kuralı bir bakışta
     anlatıyor, `Bold ← TextB` anlatmıyor. */
  const secili = ["Delete", "Main", "Search", "Settings", "More", "Close"]
    .map((ad) => degisen.find((i) => i.ad === ad))
    .filter((i): i is Ikon => Boolean(i));
  return (
    <div className="ik-tablo">
      <div className="ik-tablo-satir ik-tablo-bas">
        <span />
        <span>{s.rolSutun}</span>
        <span />
        <span>Phosphor</span>
      </div>
      {secili.map((i) => (
        <div key={i.ad} className="ik-tablo-satir">
          <Icon icon={KAYIT[i.ad]!} size="md" />
          <code className="ik-rol">{i.ad}</code>
          <Icon icon={ArrowLeft} size="xs" weight="bold" className="text-ink-faint" />
          <code className="ik-eski">{i.phosphor}</code>
        </div>
      ))}
      <p className="ik-tablo-alt">{s.kendiAdi(IKONLAR.length - degisen.length)}</p>
    </div>
  );
}

/** İki ağırlık kartı · varsayılan duotone, ve geometrinin dayattığı istisna. */
export function AgirlikKartlari({ lang }: { lang: "tr" | "en" }) {
  const s = L[lang];
  const notr = [Bell, Folder, Calendar, Settings];
  const durum = [
    { glif: Success, renk: toneOf("positive").fg },
    { glif: Warning, renk: toneOf("caution").fg },
    { glif: Failure, renk: toneOf("danger").fg },
  ];
  const eylem = [Check, Close, Plus, Copy];
  return (
    <div className="ik-agirlik">
      <div className="ik-kart">
        <span className="ik-kart-bas">
          <code className="ik-etiket ik-etiket-acik">duotone</code>
          {s.wVarsayilan}
        </span>
        <span className="ik-sira">
          {notr.map((g, i) => (
            <Icon key={i} icon={g} size="xl" />
          ))}
        </span>
        <span className="ik-sira">
          {durum.map((d, i) => (
            <Icon key={i} icon={d.glif} size="xl" style={{ color: d.renk }} />
          ))}
        </span>
        <span className="ik-kart-alt">{s.wDurum}</span>
      </div>
      <div className="ik-kart">
        <span className="ik-kart-bas">
          <code className="ik-etiket">bold</code>
          {s.wSatirIci}
        </span>
        {/* GERÇEK MİNİ DÜĞMELER: kalın glifin sebebi onun bir düğmenin içinde
            durması, ve çıplak bir glif bunu göstermiyor. */}
        <span className="flex flex-wrap gap-2">
          {eylem.map((g, i) => (
            <button key={i} type="button" className="tamga-mini-btn" aria-label={s.eylemler[i]}>
              <Icon icon={g} size="sm" weight="bold" />
            </button>
          ))}
        </span>
        <span className="ik-kart-alt">{s.wNeden}</span>
      </div>
    </div>
  );
}

/** Altı boyut · tek başına ve metnin yanında, çünkü ikonun işi yanında durmak. */
export function BoyMerdiveni({ lang }: { lang: "tr" | "en" }) {
  const s = L[lang];
  return (
    <div className="ik-merdiven">
      {BOYLAR.map(([ad, metin], i) => (
        <div key={ad} className="ik-merdiven-satir">
          <code className="ik-boy-ad">size=&quot;{ad}&quot;</code>
          <span className="ik-glif">
            <Icon icon={Bell} size={ad} />
          </span>
          {/* İKON YALNIZ BAŞINA DEĞİL METNİN YANINDA ölçülüyor: bir ikonun
              kendi ölçüsü yok, yanına konduğu kademeyi alıyor. */}
          <span className="ik-yaninda" style={{ fontSize: `var(${metin})` }}>
            <Icon icon={Bell} size={ad} className="shrink-0" />
            <span className="truncate">{s.eslesme[i]}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * ROL ADI OLMAYAN GLİFLER — Phosphor'un tamamı.
 *
 * `Icon` eki olanlar atlanıyor: Phosphor her glifi hem `Acorn` hem `AcornIcon`
 * diye veriyor, ve aynı şeyi iki kez listelemek arama sonucunu ikiye katlıyor.
 * Rol adı taşıyanlar da atlanıyor; onlar yukarıdaki sözlükte, ve koda giren
 * her zaman rol adı olmalı.
 */
const ROLLER = new Set(IKONLAR.map((i) => i.ad));
const TUM_ADLAR = Object.keys(KAYIT)
  .filter((n) => !n.endsWith("Icon") && !ROLLER.has(n) && /^[A-Z]/.test(n))
  .sort();

function SerbestKutu({
  ad,
  s,
  agirlik,
  boy,
}: {
  ad: string;
  s: Metinler;
  agirlik: Agirlik;
  boy: IconSize;
}) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const glif = KAYIT[ad];
  if (!glif) return null;
  return (
    <button
      type="button"
      aria-label={`${ad} ${s.kopyala}`}
      title={ad}
      data-alindi={kopyalandi || undefined}
      onClick={() => {
        navigator.clipboard?.writeText(ad);
        setKopyalandi(true);
        window.setTimeout(() => setKopyalandi(false), 1400);
      }}
      className="ik-kutu"
    >
      <span className="ik-glif">
        <Icon icon={kopyalandi ? Check : glif} size={boy} weight={agirlik} />
      </span>
      <code className="ik-ad">{kopyalandi ? `✓ ${s.kopyalandi}` : ad}</code>
      <span className="ik-ph" />
    </button>
  );
}

/* Arama boşken TAMAMI ÇİZİLMİYOR. Bin beş yüz SVG'yi bir kerede basmak sayfayı
   saniyelerce donduruyor, ve o listede gezinerek bir şey bulunmuyor zaten;
   bulunma yolu arama. Yazınca sonuç, yazmayınca ipucu. */
const TAVAN = 120;

export function IkonIzgarasi({ lang }: { lang: "tr" | "en" }) {
  const s = L[lang];
  const [ara, setAra] = useState("");
  const [agirlik, setAgirlik] = useState<Agirlik>("duotone");
  /* Izgarada varsayılan `lg`: 24px bir glifin BİÇİMİNİ okutan en küçük ölçü,
     ve buradaki soru "hangi glif", "hangi kademe" değil. */
  const [boy, setBoy] = useState<IconSize>("lg");

  const gruplar = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("tr");
    const suzulmus = q
      ? IKONLAR.filter((i) => `${i.ad} ${i.phosphor} ${i.grup}`.toLocaleLowerCase("tr").includes(q))
      : IKONLAR;
    const sira: string[] = [];
    for (const i of suzulmus) if (!sira.includes(i.grup)) sira.push(i.grup);
    return sira.map((g) => {
      const [ad, aciklama] = GRUP[g]?.[lang] ?? [g, ""];
      return { slug: g, ad, aciklama, liste: suzulmus.filter((i) => i.grup === g) };
    });
  }, [ara, lang]);

  const toplam = gruplar.reduce((n, g) => n + g.liste.length, 0);

  /* `null` = henüz aranmadı. Boş dizi ile karışmasın: biri "yazmadın", öteki
     "yazdın ama yok" demek, ve ikisine aynı cümleyi yazmak yanlış olur. */
  const serbest = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("en");
    if (!q) return null;
    return TUM_ADLAR.filter((ad) => ad.toLocaleLowerCase("en").includes(q));
  }, [ara]);

  return (
    <section id="set" className="ik-set">
      <div className="token-serit">
        <div className="token-serit-ust">
          <span className="token-ara" data-dolu={ara ? true : undefined}>
            <Icon
              icon={Search}
              size="sm"
              weight="duotone"
              aria-hidden
              className="pointer-events-none absolute left-3 text-ink-faint"
            />
            <Input
              type="search"
              leading
              full
              value={ara}
              onChange={(e) => setAra(e.target.value)}
              placeholder={s.ara}
              aria-label={s.ara}
            />
            {ara && (
              <button
                type="button"
                className="token-temizle"
                aria-label={s.temizle}
                onClick={() => setAra("")}
              >
                <Icon icon={Close} size="xs" weight="bold" />
              </button>
            )}
          </span>
          <span className="token-sayac">{s.sayac(toplam, IKONLAR.length)}</span>
        </div>
        {/* AĞIRLIK VE BOY BÜTÜN IZGARAYI ÇEVİRİYOR: bir ağırlığı tek bir glifte
            görmek yetmiyor · duotone'un ne yaptığı ancak seksen dokuz glif
            birden dönünce okunuyor. */}
        <div className="ik-ayar">
          <span className="ik-ayar-grup">
            <code>weight</code>
            <Segmented
              size="sm"
              label="weight"
              value={agirlik}
              onChange={setAgirlik}
              options={AGIRLIKLAR.map((w) => ({ value: w, label: w }))}
            />
          </span>
          <span className="ik-ayar-grup">
            <code>size</code>
            <Segmented
              size="sm"
              label="size"
              value={boy}
              onChange={setBoy}
              options={BOYLAR.map(([b]) => ({ value: b, label: b }))}
            />
          </span>
        </div>
      </div>

      {toplam === 0 && <p className="token-bos">{s.bos}</p>}

      {gruplar.map((g) => (
        <div key={g.slug} className="ik-grup">
          <div className="token-grup-bas">
            <h3 className="token-h">{g.ad}</h3>
            <span className="token-grup-n">{g.liste.length}</span>
          </div>
          {g.aciklama && <p className="token-grup-alt">{g.aciklama}</p>}
          <div className="ik-izgara">
            {g.liste.map((i) => (
              <Kutu key={i.ad} ikon={i} s={s} agirlik={agirlik} boy={boy} />
            ))}
          </div>
        </div>
      ))}

      {/* PHOSPHOR'UN TAMAMI BİR IZGARA DEĞİL BİR KAPI: bin beş yüz glifi
          basmak sayfayı donduruyor ve o listede gezinerek bir şey
          bulunmuyor. Arama yazıldığında set taranıyor; yazılmadığında
          gidilecek yer gösteriliyor. */}
      {serbest === null ? (
        <a className="ik-kapi" href="https://phosphoricons.com" target="_blank" rel="noreferrer">
          <span className="ik-kapi-karo">
            <Icon icon={SquaresFour} size="md" weight="duotone" />
          </span>
          <span className="flex flex-1 flex-col gap-0.5">
            <strong>{s.tumH}</strong>
            <span className="ik-kapi-alt">{s.tumP(TUM_ADLAR.length)}</span>
          </span>
          <Icon icon={ArrowSquareOut} size="sm" weight="bold" className="shrink-0" />
        </a>
      ) : (
        <div className="ik-grup">
          <div className="token-grup-bas">
            <h3 className="token-h">{s.tumH}</h3>
            <span className="token-grup-n">{s.tumSayac(serbest.length, TUM_ADLAR.length)}</span>
          </div>
          {serbest.length === 0 ? (
            <p className="token-bos">{s.tumBos}</p>
          ) : (
            <>
              <div className="ik-izgara">
                {serbest.slice(0, TAVAN).map((ad) => (
                  <SerbestKutu key={ad} ad={ad} s={s} agirlik={agirlik} boy={boy} />
                ))}
              </div>
              {serbest.length > TAVAN && <p className="token-grup-alt">{s.daha(serbest.length - TAVAN)}</p>}
            </>
          )}
        </div>
      )}
    </section>
  );
}
