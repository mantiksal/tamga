"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  Dialog,
  Field,
  Icon,
  IconButton,
  Input,
  Label,
  MiniButton,
  NumberInput,
  Pagination,
  Select,
  Sheet,
  SortHeader,
  StatusChip,
  Table,
  type SortDirection,
} from "tamga-ui";
import { Close, Delete, Plus, Search } from "tamga-ui/icons";

/**
 * KALIBIN ÇALIŞAN HÂLİ.
 *
 * Bu sayfa uzun süre yalnız METİNDİ, ve bir kalıp sayfasının okunup
 * anlaşılması yetmiyor: "bize sağlam bir CRUD yapısı lazım" diyen birine
 * açılacak bir şey olmalı. Yedi fiil burada gerçekten koşuyor; ekle bir kayıt
 * ekliyor, sil siliyor, sıralama gerçekten sıralıyor.
 *
 * KİTE HİÇBİR ŞEY EKLENMEDİ. Aşağıdaki her parça zaten kitte vardı; yeni olan
 * tek şey onların bir arada durduğu bu düzen. Zaten sayfanın iddiası da bu:
 * kit motorun parçalarını gönderiyor, motoru değil.
 */

export type OrnekMetinleri = {
  ara: string;
  durum: string;
  durumlar: [string, string, string, string];
  ekle: string;
  ad: string;
  stok: string;
  kayit: string;
  secili: string;
  seciliSil: string;
  secimiKaldir: string;
  duzenle: string;
  duzenleBaslik: string;
  sil: string;
  silBaslik: string;
  /** `{ad}` yerine kaydın adı geçer. */
  silGovde: string;
  topluSilBaslik: string;
  /** `{n}` yerine seçili sayısı geçer. */
  topluSilGovde: string;
  vazgec: string;
  kapat: string;
  kaydet: string;
  bos: string;
  sayfadakileriSec: string;
  /** `{ad}` yerine kaydın adı geçer. */
  satirSec: string;
  artir: string;
  azalt: string;
  onceki: string;
  sonraki: string;
  /** `{n}` yerine sayfa numarası geçer. */
  sayfa: string;
  filtreKaldir: string;
};

/**
 * METİNLER FONKSİYON DEĞİL KALIP, ve bu React'in bir kuralı değil bir sonucu:
 * bu bileşen istemcide, metinler ise sunucudaki sayfada yaşıyor, ve bir
 * fonksiyon o sınırı geçemiyor ("Functions cannot be passed directly to Client
 * Components"). Kalıp geçiyor; yerine koymayı bu taraf yapıyor.
 */
const doldur = (kalip: string, degerler: Record<string, string | number>) =>
  kalip.replace(/\{(\w+)\}/g, (_, anahtar) => String(degerler[anahtar] ?? ""));

type Plak = { id: number; ad: string; stok: number };

const BASLANGIC: Plak[] = [
  { id: 1, ad: "A Love Supreme", stok: 12 },
  { id: 2, ad: "Blue Train", stok: 0 },
  { id: 3, ad: "Kind of Blue", stok: 2 },
  { id: 4, ad: "Mingus Ah Um", stok: 7 },
  { id: 5, ad: "Moanin'", stok: 0 },
  { id: 6, ad: "Out to Lunch", stok: 21 },
  { id: 7, ad: "Saxophone Colossus", stok: 3 },
  { id: 8, ad: "Somethin' Else", stok: 15 },
  { id: 9, ad: "Speak No Evil", stok: 1 },
  { id: 10, ad: "The Sidewinder", stok: 9 },
  { id: 11, ad: "Waltz for Debby", stok: 4 },
];

const SAYFA_BOYU = 5;

/* Stok bir SAYI, durum bir OKUMA: eşikler burada, hücrede değil. Aynı sayının
   iki ayrı yerde iki ayrı renge boyanması böyle önleniyor. */
const TONLAR = ["positive", "caution", "danger"] as const;

function durumu(stok: number): 0 | 1 | 2 {
  if (stok === 0) return 2;
  if (stok <= 3) return 1;
  return 0;
}

/** Durum adı ve tonu TEK yerden: aynı sayının iki yerde iki renge boyanmaması
    için eşik de okuma da burada. */
function okuma(stok: number, durumlar: OrnekMetinleri["durumlar"]) {
  const i = durumu(stok);
  return { label: durumlar[i + 1] as string, state: TONLAR[i] };
}

export function CrudOrnegi({ t }: { t: OrnekMetinleri }) {
  const [kayitlar, setKayitlar] = useState<Plak[]>(BASLANGIC);
  const [ara, setAra] = useState("");
  const [filtre, setFiltre] = useState(t.durumlar[0]);
  const [sira, setSira] = useState<{ alan: "ad" | "stok"; yon: SortDirection }>({
    alan: "ad",
    yon: "asc",
  });
  const [sayfa, setSayfa] = useState(1);
  const [secili, setSecili] = useState<Set<number>>(new Set());
  const [ekleAcik, setEkleAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState<Plak | null>(null);
  const [silinecek, setSilinecek] = useState<Plak | null>(null);
  const [topluSil, setTopluSil] = useState(false);
  const [taslak, setTaslak] = useState<{ ad: string; stok: number | null }>({ ad: "", stok: 0 });

  const filtreAcik = filtre !== t.durumlar[0];

  const gorunen = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("tr");
    const suzulmus = kayitlar.filter((k) => {
      if (q && !k.ad.toLocaleLowerCase("tr").includes(q)) return false;
      if (filtreAcik && okuma(k.stok, t.durumlar).label !== filtre) return false;
      return true;
    });
    const yon = sira.yon === "asc" ? 1 : -1;
    return [...suzulmus].sort((a, b) =>
      sira.alan === "stok" ? (a.stok - b.stok) * yon : a.ad.localeCompare(b.ad, "tr") * yon,
    );
  }, [kayitlar, ara, filtre, filtreAcik, sira, t.durumlar]);

  const toplam = gorunen.length;
  const sonSayfa = Math.max(1, Math.ceil(toplam / SAYFA_BOYU));
  const gecerli = Math.min(sayfa, sonSayfa);
  const satirlar = gorunen.slice((gecerli - 1) * SAYFA_BOYU, gecerli * SAYFA_BOYU);
  const sayfadakiSecili = satirlar.filter((k) => secili.has(k.id)).length;

  function siralaya(alan: "ad" | "stok") {
    setSira((s) => ({ alan, yon: s.alan === alan && s.yon === "asc" ? "desc" : "asc" }));
    setSayfa(1);
  }

  function satirSec(id: number, acik: boolean) {
    const next = new Set(secili);
    if (acik) next.add(id);
    else next.delete(id);
    setSecili(next);
  }

  function kaydet() {
    if (!taslak.ad.trim()) return;
    const stok = taslak.stok ?? 0;
    if (duzenlenen) {
      setKayitlar((k) =>
        k.map((x) => (x.id === duzenlenen.id ? { ...x, ad: taslak.ad, stok } : x)),
      );
      setDuzenlenen(null);
    } else {
      setKayitlar((k) => [...k, { id: Math.max(0, ...k.map((x) => x.id)) + 1, ad: taslak.ad, stok }]);
      setEkleAcik(false);
    }
  }

  const alanlar = (
    <div className="flex flex-col gap-4">
      <Field label={t.ad} htmlFor="ornek-ad">
        <Input
          id="ornek-ad"
          full
          value={taslak.ad}
          onChange={(e) => setTaslak({ ...taslak, ad: e.target.value })}
        />
      </Field>
      <Field label={t.stok}>
        <NumberInput
          value={taslak.stok}
          onChange={(v) => setTaslak({ ...taslak, stok: v })}
          min={0}
          labels={{ increase: t.artir, decrease: t.azalt }}
        />
      </Field>
    </div>
  );

  return (
    <div className="my-6 flex w-full flex-col gap-4">
      {/* ① Başlık yok: bir doküman örneğinin başlığı sayfanın kendisi. Birincil
          eylem var, çünkü "Ekle" gösterilecek yedi fiilden biri. */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          {/* ② Ara: bir BULMA aracı, tek kutu. */}
          <label className="flex flex-col gap-1.5">
            <span className="text-small font-medium text-ink">{t.ara}</span>
            {/* `leading` bir boolean: kite sol boşluğu açtırıyor, ikonu çağıran
                çiziyor. İkon seti böylece kitin değil ürünün kararı kalıyor. */}
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
                onChange={(e) => {
                  setAra(e.target.value);
                  setSayfa(1);
                }}
                placeholder={t.ara}
              />
            </span>
          </label>
          {/* ③ Filtrele: bir DARALTMA aracı, seçim listesi. */}
          <label className="flex flex-col gap-1.5">
            <span className="text-small font-medium text-ink">{t.durum}</span>
            <Select
              options={[...t.durumlar]}
              value={filtre}
              onChange={(v) => {
                setFiltre(v);
                setSayfa(1);
              }}
              placeholder={t.durumlar[0]}
            />
          </label>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setTaslak({ ad: "", stok: 0 });
            setEkleAcik(true);
          }}
        >
          <Icon icon={Plus} size="xs" />
          {t.ekle}
        </Button>
      </div>

      {/* Uygulanan filtre ÇİP olarak duruyor: gizlenmiş bir filtre, listeyi
          eksik gösterip sebebini söylemeyen tek şey. */}
      {filtreAcik && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-(--radius-ctl) border border-[var(--color-edge)] bg-shell py-1 pl-2.5 pr-1 text-small text-ink">
            <span className="text-ink-faint">{t.durum}:</span>
            {filtre}
            <MiniButton aria-label={t.filtreKaldir} onClick={() => setFiltre(t.durumlar[0])}>
              <Icon icon={Close} size="xs" />
            </MiniButton>
          </span>
        </div>
      )}

      {/* Toplu işlem şeridi YALNIZ seçim varken. */}
      {secili.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-(--radius-card) border border-[var(--color-edge)] bg-shell px-4 py-2.5">
          <span className="text-body text-ink">
            <strong className="tabular-nums">{secili.size}</strong> {t.secili}
          </span>
          <Button size="sm" variant="danger" onClick={() => setTopluSil(true)}>
            {t.seciliSil}
          </Button>
          <Button variant="link" size="sm" onClick={() => setSecili(new Set())}>
            {t.secimiKaldir}
          </Button>
        </div>
      )}

      <Card>
        <div className="border-b border-[var(--color-line)] px-4 py-2.5">
          <Label>
            <strong className="tabular-nums text-ink">{toplam}</strong> {t.kayit}
          </Label>
        </div>

        {satirlar.length === 0 ? (
          /* Boş durumun İKİNCİ cümlesi: kayıt var, filtre eledi. */
          <p className="p-6 text-center text-ink-soft">{t.bos}</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <th scope="col" className="w-8">
                  <Checkbox
                    label={<span className="sr-only">{t.sayfadakileriSec}</span>}
                    checked={sayfadakiSecili === satirlar.length}
                    onChange={(acik) => {
                      const next = new Set(secili);
                      for (const k of satirlar) {
                        if (acik) next.add(k.id);
                        else next.delete(k.id);
                      }
                      setSecili(next);
                    }}
                  />
                </th>
                {/* ④ Sırala: yön SortHeader'da, karar bizde. */}
                <SortHeader
                  direction={sira.alan === "ad" ? sira.yon : undefined}
                  onSort={() => siralaya("ad")}
                >
                  {t.ad}
                </SortHeader>
                <SortHeader
                  align="right"
                  direction={sira.alan === "stok" ? sira.yon : undefined}
                  onSort={() => siralaya("stok")}
                >
                  {t.stok}
                </SortHeader>
                <th scope="col" className="w-40 text-right">
                  <span className="sr-only">{t.duzenle}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {satirlar.map((k) => (
                <tr key={k.id}>
                  <td>
                    <Checkbox
                      label={<span className="sr-only">{doldur(t.satirSec, { ad: k.ad })}</span>}
                      checked={secili.has(k.id)}
                      onChange={(a) => satirSec(k.id, a)}
                    />
                  </td>
                  <td>
                    <span className="flex items-center gap-2">
                      <span className="text-ink">{k.ad}</span>
                      <StatusChip {...okuma(k.stok, t.durumlar)} />
                    </span>
                  </td>
                  <td className="text-right tabular-nums text-ink">{k.stok}</td>
                  <td className="text-right">
                    <span className="flex items-center justify-end gap-2">
                      {/* ⑤ Düzenle: çekmecede, çünkü liste bağlamın kendisi.
                          Düğme `MiniButton` DEĞİL: o 32x32'lik kare yalnız
                          simge taşır, içine metin konunca kırpıyor. */}
                      <Button
                        size="sm"
                        aria-label={`${k.ad} ${t.duzenle}`}
                        onClick={() => {
                          setTaslak({ ad: k.ad, stok: k.stok });
                          setDuzenlenen(k);
                        }}
                      >
                        {t.duzenle}
                      </Button>
                      {/* ⑥ Sil: onay kapısının arkasında. */}
                      <IconButton
                        size="sm"
                        aria-label={`${k.ad} ${t.sil}`}
                        onClick={() => setSilinecek(k)}
                      >
                        <Icon icon={Delete} size="xs" />
                      </IconButton>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* ⑦ Sayfala: yalnız toplam bir sayfayı aşınca. */}
        {toplam > SAYFA_BOYU && (
          <div className="border-t border-[var(--color-line)] px-4 py-3">
            <Pagination
              page={gecerli}
              pageSize={SAYFA_BOYU}
              total={toplam}
              onChange={setSayfa}
              span={1}
              labels={{ previous: t.onceki, next: t.sonraki, page: (n) => doldur(t.sayfa, { n }) }}
            />
          </div>
        )}
      </Card>

      {/* Ekleme AYRI BİR YÜZEYDE: liste bağlam değil, yeni kayıt kendi işi. */}
      <Dialog
        open={ekleAcik}
        onClose={() => setEkleAcik(false)}
        title={t.ekle}
        closeLabel={t.kapat}
        footer={
          <>
            <Button type="button" onClick={() => setEkleAcik(false)}>
              {t.vazgec}
            </Button>
            <Button variant="primary" onClick={kaydet} disabled={!taslak.ad.trim()}>
              {t.kaydet}
            </Button>
          </>
        }
      >
        {alanlar}
      </Dialog>

      <Sheet
        open={duzenlenen !== null}
        onClose={() => setDuzenlenen(null)}
        title={t.duzenleBaslik}
        closeLabel={t.kapat}
        footer={
          <>
            <Button type="button" onClick={() => setDuzenlenen(null)}>
              {t.vazgec}
            </Button>
            <Button variant="primary" onClick={kaydet} disabled={!taslak.ad.trim()}>
              {t.kaydet}
            </Button>
          </>
        }
      >
        {alanlar}
      </Sheet>

      <ConfirmDialog
        open={silinecek !== null}
        onClose={() => setSilinecek(null)}
        onConfirm={() => {
          if (silinecek) setKayitlar((k) => k.filter((x) => x.id !== silinecek.id));
          setSilinecek(null);
        }}
        title={t.silBaslik}
        confirmLabel={t.sil}
        cancelLabel={t.vazgec}
        closeLabel={t.kapat}
      >
        {silinecek && doldur(t.silGovde, { ad: silinecek.ad })}
      </ConfirmDialog>

      <ConfirmDialog
        open={topluSil}
        onClose={() => setTopluSil(false)}
        onConfirm={() => {
          setKayitlar((k) => k.filter((x) => !secili.has(x.id)));
          setSecili(new Set());
          setTopluSil(false);
        }}
        title={t.topluSilBaslik}
        confirmLabel={t.seciliSil}
        cancelLabel={t.vazgec}
        closeLabel={t.kapat}
      >
        {doldur(t.topluSilGovde, { n: secili.size })}
      </ConfirmDialog>
    </div>
  );
}
