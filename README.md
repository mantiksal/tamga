# Tamga

> **Mantıksal'ın ortak arayüz kütüphanesi.** Token'lar, fizik ve bileşenler tek yerde; bir
> düzeltme burada yapılır, sürüm numarasıyla her projeye akar.

Framework değil **kütüphane**: ekranlarını sen kurarsın, kit sana parçaları verir. Ürünün adını,
sözlüğünü ve kimliğini kit hiç bilmez.

### Bugün nasıl kullanılır

Paket **henüz npm'de değil** (`0.1.0`, yayınlanmadı). Tüketen bir projede:

```bash
pnpm install                    # bu depoda
pnpm --filter tamga-ui pack     # tamga-ui-0.1.0.tgz

# tüketen projede
npm install ../tamga/packages/ui/tamga-ui-0.1.0.tgz
```

`dist/` depoda durmuyor (üretilmiş çıktı commit edilmez) ama paketin `prepare` betiği onu
kurulum anında üretiyor, yani tüketicinin ayrı bir build adımı yok.

Yayınlandığında tek satır olacak:

```bash
npm install tamga-ui
```

**Tüketicinin şartları:** React 19, Tailwind v4, Node 20+. Kurulumun tamamı ve `@source`
uyarısı [`packages/ui/README.md`](packages/ui/README.md) içinde.

---

## Beş dakikada oryantasyon

**Yeni katıldıysan sırayla şunları oku:**

1. **Bu dosya**: depo neye benziyor, ne çalıştırılır.
2. **[`CLAUDE.md`](CLAUDE.md)**: çalışma disiplini. Bir yapay zekâya okutacaksan **bu dosyayı**
   okut; insanlar için de aynı kurallar geçerli.
3. **[doküman sitesinin Fizik sayfası](http://localhost:6070/tr/docs/physics)**: dört yasa. Bir
   bileşene dokunmadan önce bir kez okunur.
4. **[`docs/02-bilesen-ekleme.md`](docs/02-bilesen-ekleme.md)**: bir bileşen eklemenin adımları.
5. Gerisi ihtiyaç doğunca.

---

## Depo haritası

```
packages/ui/          kitin kendisi · yayınlanan paket (tamga-ui)
  src/components/     bileşenler, her biri kendi dosyasında
  src/kit.css         sınıflar ve fizik
  src/theme.css       token'lar (renk, tip, boşluk, süre)
  src/index.ts        KAMUSAL YÜZEY · burada olmayan şey iç detaydır

apps/docs/            doküman sitesi (Next.js, port 6070)
  src/app/[lang]/     92 sayfa × 2 dil, statik üretiliyor
  src/components/     sitenin kendi parçaları (Demo · Props · Xref · Shell)
  src/content/        nav.ts (menü) · *.json (ÜRETİLİR, elle düzenleme)

scripts/              kapılar · aşağıya bak
docs/                 kararlar ve oyun kitapları
  01-mimari.md        katmanlar
  02-bilesen-ekleme.md  bir bileşen eklemenin adımları
  07-dokuman-sitesi.md  doküman sitesinin iç notları
  08-bilesen-gerekceleri.md  bileşen gerekçeleri · DİZİN
  gerekce/           altı başlıkta gerekçeler (form · veri · grafik · boş · yüzey · işaret)
  adr/                mimari karar kayıtları
```

> **Yorumlar nerede durur.** Kod dosyalarında yalnız tuzağın yanındaki tek iki satır ve yayınlanan
> gerekçeler (prop JSDoc'ları, token yorumları) kalır; ikincisi doküman sitesine üretiliyor.
> Kararlar `docs/adr/`de, kılavuzlar `docs/`de, tüketicinin okuyacağı her şey doküman sitesinde.
> Kural: [`CLAUDE.md` · Yorumlar](CLAUDE.md).

## Komutlar

```bash
pnpm install               # bir kez
pnpm --filter tamga-docs dev    # doküman sitesi → localhost:6070
pnpm verify                # BÜTÜN KAPILAR · commit'ten önce bunu koştur
pnpm --filter tamga-ui build    # yalnız kiti derle
pnpm props                 # props tablolarını yeniden üret
pnpm changeset             # sürüm notu yaz (yayın öncesi)
```

> `pnpm` sadece bu depoda. Kiti tüketen projeler npm kullanabilir; paket sıradan bir npm paketi.

---

## Yedi kapı

`pnpm verify` şunları sırayla koşturur. **Kapıyı değil kodu düzelt**: bir guard'ı gevşetmek
gerekiyorsa bu bir karardır: önce dokümandaki karşılığını değiştir, sonra guard'ı.

| kapı | ne kanıtlıyor |
| --- | --- |
| `props` | Props tabloları kaynaktan üretiliyor; elle yazılan bir tablo ilk değişiklikte yalan söyler |
| `check:names` | Kite ürün/müşteri adı ya da alan sözlüğü sızmamış. Aranan kelimeler depoda değil: `scripts/urun-adlari.json` (`.gitignore`da, biçimi `.example.json` dosyasında) |
| `check:scale` | Uydurulmuş boyut ve sabit renk yok; ölçeği olan yerde ölçek dışına çıkılmamış |
| `check:docs-i18n` | Her sayfa iki dilli, sözlükler paritede |
| `check:prop-coverage` | Bir prop'un her seçeneği dokümanda geçiyor; okunmayan seçenek yok sayılır |
| `check:no-emdash` | Okunan metinde uzun tire yok; tire, iki yargı arasındaki ilişkiyi seçmemenin yolu |
| `check:css` | CSS yapısal olarak sağlam: yorumlar ve bloklar dengeli, bir kural sessizce yutulmuyor |
| `check:kit-class` | Kullanılan her `tamga-*` sınıfı tanımlı; tarayıcı bilmediği sınıfı sessizce yok sayar |
| `typecheck` | Tipler tutuyor |
| `test` | Saf mantık sınanıyor: sayfalayıcı aritmetiği, ton rolleri, nabız rütbesi |
| `build` | Derleniyor, 166 statik sayfa üretiliyor |

Kapılar **CI'da da koşuyor** (`.github/workflows/verify.yml`): yerelde koşturmayı unutan bir dal
yeşil görünüp kırık gelemez.

Her guard'ın başında **neden var olduğu** yazılı, ve çoğu gerçek bir hatadan doğdu. Bir guard
seni yakaladıysa yorumunu oku: cevabı orada.

---

## Kararlar nerede

- **Neden böyle** → [`docs/adr/`](docs/adr/), mimari karar kayıtları
- **Nasıl çalışıyor** → [`docs/01-mimari.md`](docs/01-mimari.md)
- **Bileşen nasıl eklenir** → [`docs/02-bilesen-ekleme.md`](docs/02-bilesen-ekleme.md)

Yol haritası, eksik envanteri ve müşteri adı geçen iki ADR bu depoda değil: bir tasarım
sisteminin kamusal deposu, hangi müşteri için ne yapılacağını ya da o müşterinin bugünkü
sistemini anlatmaz. Kitin kendi gerekçeleri (`docs/gerekce/`, ADR-0002, ADR-0004) burada ve
dışarıdan okuyan biri için asıl değerli olan kısım onlar.

**Koddan karar üretme.** Bir bileşenin adı, davranışı ya da sınırı tartışılıyorsa cevap bu
dosyalardadır; yoksa henüz verilmemiş bir karardır ve sorulması gerekir.

---

## Dışarıdan katkı

Depo kapalı, paket açık. Kodu kullanabilirsin (MIT), ama dışarıdan commit ve pull request
almıyoruz; bu bilinçli bir karar, gerekçesi [`docs/adr/`](docs/adr/) altında.

## Lisans

MIT · [`LICENSE`](LICENSE).
