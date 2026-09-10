"use client";

import { useMemo, useState } from "react";
import { Icon, Input, Label } from "tamga-ui";
import * as KIT_IKONLARI from "tamga-ui/icons";
import { Check, Search } from "tamga-ui/icons";
import ham from "@/content/icons.json";

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
  sayac: (n: number) => string;
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
};

const L: Record<"tr" | "en", Metinler> = {
  tr: {
    ara: "İkon ara",
    sayac: (n: number) => `${n} ikon`,
    bos: "Bu aramayla ikon bulunamadı.",
    kopyala: "adını kopyala",
    kopyalandi: "Kopyalandı",
    phosphorAdi: "Phosphor adı",
    tumH: "Tüm set",
    tumP: (n: number) =>
      `Phosphor'un ${n} glifinin hepsi \`tamga-ui/icons\`ten geliyor. Rolü olmayan, ürüne özgü bir şey için doğrudan glifi al.`,
    tumSayac: (g: number, n: number) => `${g} / ${n}`,
    tumBos: "Bu aramayla glif yok.",
    tumIpucu: "Aramaya yaz: bütün set taranıyor.",
    daha: (n: number) => `+${n} daha · aramayı daralt`,
  },
  en: {
    ara: "Search icons",
    sayac: (n: number) => `${n} icons`,
    bos: "No icon matches that search.",
    kopyala: "copy its name",
    kopyalandi: "Copied",
    phosphorAdi: "Phosphor name",
    tumH: "The full set",
    tumP: (n: number) =>
      `All ${n} of Phosphor's glyphs come through \`tamga-ui/icons\`. For something product-specific with no role, take the glyph directly.`,
    tumSayac: (g: number, n: number) => `${g} / ${n}`,
    tumBos: "No glyph matches that search.",
    tumIpucu: "Type in the search box: the whole set is scanned.",
    daha: (n: number) => `+${n} more · narrow the search`,
  },
};

function Kutu({ ikon, s }: { ikon: Ikon; s: Metinler }) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const glif = KAYIT[ikon.ad];
  if (!glif) return null;

  return (
    <button
      type="button"
      aria-label={`${ikon.ad} ${s.kopyala}`}
      title={ikon.phosphor !== ikon.ad ? `${s.phosphorAdi}: ${ikon.phosphor}` : ikon.ad}
      onClick={() => {
        navigator.clipboard?.writeText(ikon.ad);
        setKopyalandi(true);
        window.setTimeout(() => setKopyalandi(false), 1400);
      }}
      className="tamga-mini-btn flex h-auto w-full flex-col items-center gap-2 px-2 py-3"
    >
      <Icon icon={kopyalandi ? Check : glif} size="sm" />
      {/* Ad KIRPILMIYOR, sarıyor: kırpılmış bir ikon adı aramanın sonucunu
          okunamaz yapıyor, ve bu ızgaranın tek işi ad göstermek. */}
      <span className="w-full break-words text-center text-micro leading-tight text-ink-soft">
        {kopyalandi ? s.kopyalandi : ikon.ad}
      </span>
    </button>
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

function SerbestKutu({ ad, s }: { ad: string; s: Metinler }) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const glif = KAYIT[ad];
  if (!glif) return null;
  return (
    <button
      type="button"
      aria-label={`${ad} ${s.kopyala}`}
      title={ad}
      onClick={() => {
        navigator.clipboard?.writeText(ad);
        setKopyalandi(true);
        window.setTimeout(() => setKopyalandi(false), 1400);
      }}
      className="tamga-mini-btn flex h-auto w-full flex-col items-center gap-2 px-2 py-3"
    >
      <Icon icon={kopyalandi ? Check : glif} size="sm" />
      <span className="w-full break-words text-center text-micro leading-tight text-ink-faint">
        {kopyalandi ? s.kopyalandi : ad}
      </span>
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

  const gruplar = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("tr");
    const suzulmus = q
      ? IKONLAR.filter((i) =>
          `${i.ad} ${i.phosphor} ${i.grup}`.toLocaleLowerCase("tr").includes(q),
        )
      : IKONLAR;
    const sira: string[] = [];
    for (const i of suzulmus) if (!sira.includes(i.grup)) sira.push(i.grup);
    return sira.map((g) => {
      const [ad, aciklama] = GRUP[g]?.[lang] ?? [g, ""];
      return { ad, aciklama, liste: suzulmus.filter((i) => i.grup === g) };
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
    <div className="my-6 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="relative flex items-center">
          <Icon
            icon={Search}
            size="xs"
            aria-hidden
            className="pointer-events-none absolute left-2.5 text-ink-faint"
          />
          <Input
            type="search"
            leading
            value={ara}
            onChange={(e) => setAra(e.target.value)}
            placeholder={s.ara}
          />
        </span>
        <Label>{s.sayac(toplam)}</Label>
      </div>

      {toplam === 0 && <p className="text-ink-soft">{s.bos}</p>}

      {gruplar.map((g) => (
        <section key={g.ad} className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-subhead font-semibold text-ink">{g.ad}</h3>
            {g.aciklama && <Label>{g.aciklama}</Label>}
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2">
            {g.liste.map((i) => (
              <Kutu key={i.ad} ikon={i} s={s} />
            ))}
          </div>
        </section>
      ))}

      <section className="flex flex-col gap-3 border-t border-[var(--color-line)] pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-subhead font-semibold text-ink">{s.tumH}</h3>
            <Label>{s.tumP(TUM_ADLAR.length)}</Label>
          </div>
          {serbest !== null && <Label>{s.tumSayac(serbest.length, TUM_ADLAR.length)}</Label>}
        </div>

        {serbest === null ? (
          <p className="text-ink-soft">{s.tumIpucu}</p>
        ) : serbest.length === 0 ? (
          <p className="text-ink-soft">{s.tumBos}</p>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2">
              {serbest.slice(0, TAVAN).map((ad) => (
                <SerbestKutu key={ad} ad={ad} s={s} />
              ))}
            </div>
            {serbest.length > TAVAN && <Label>{s.daha(serbest.length - TAVAN)}</Label>}
          </>
        )}
      </section>
    </div>
  );
}
