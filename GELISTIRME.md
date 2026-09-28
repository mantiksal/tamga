# Tamga'da çalışmak

Ekip içi el kitabı. Kiti kullanmak için değil, geliştirmek için. Kullanıcı dokümanı [tamga.org.tr](https://tamga.org.tr)'de.

## İlk gün

Sırayla oku:

1. Bu dosya
2. [CLAUDE.md](CLAUDE.md): çalışma disiplini (yapay zekâ için de, insanlar için de aynı kurallar)
3. Doküman sitesinde [Fizik](https://tamga.org.tr/tr/docs/fizik): dört yasa. Bir bileşene dokunmadan önce.
4. [docs/02-bilesen-ekleme.md](docs/02-bilesen-ekleme.md): bir bileşen eklemenin adımları

## Komutlar

```bash
pnpm install                      # bir kez
pnpm --filter tamga-docs dev      # doküman sitesi → localhost:6070
pnpm verify                       # bütün kontroller · commit'ten önce
pnpm --filter tamga-ui build      # yalnız kit
pnpm props                        # props tablolarını yeniden üret
pnpm changeset                    # sürüm notu
```

Bu depoda yalnız pnpm. Kiti kullanan projeler npm de kullanabilir.

## Depo

```
packages/ui/            kitin kendisi (npm: tamga-ui)
  src/components/       bileşenler, her biri kendi dosyasında
  src/kit.css           sınıflar ve fizik
  src/theme.css         token'lar
  src/index.ts          kamusal yüzey: burada olmayan şey iç detaydır
apps/docs/              doküman sitesi (Next.js)
  src/app/[lang]/       sayfalar, iki dilde, statik
  src/content/          nav.ts · *.json (üretilir, elle düzenleme)
scripts/                kontroller
docs/                   kararlar ve kılavuzlar
  adr/                  mimari karar kayıtları
  gerekce/              bileşen gerekçeleri
```

`dist/` depoda durmuyor; `prepare` betiği yayın anında üretiyor.

## Kontroller

`pnpm verify` sırayla koşturur; CI'da da koşar (`.github/workflows/verify.yml`). **Kontrolü değil kodu düzelt.** Bir kontrolü gevşetmek bir karardır: önce dokümandaki karşılığını değiştir, sonra kontrolü.

| Kontrol | Neyi garanti ediyor |
|---|---|
| `props` | Props tabloları kaynaktan üretiliyor |
| `check:names` | Kite ürün ya da müşteri adı sızmamış (aranan kelimeler `scripts/urun-adlari.json`, .gitignore'da) |
| `check:scale` | Uydurma boyut ya da sabit renk yok |
| `check:docs-i18n` | Her sayfa iki dilde, sözlükler eşit |
| `check:prop-coverage` | Her prop seçeneği dokümanda geçiyor |
| `check:no-emdash` | Okunan metinde uzun tire yok |
| `check:yorum` | Kodda bir yorum bloğu altı düzyazı satırını geçmiyor |
| `check:css` | CSS yapısal olarak sağlam |
| `check:physics` | Yükselen her yüzeyde kenar ve gölge aynı renk |
| `check:yuvarlak` | Tam yuvarlak yalnız radyo, skor halkası ve spinner'da |
| `check:olcu-hizasi` | Sekiz taban kontrolün hepsi `--control` yüksekliğini okuyor |
| `check:data-props` | Her bileşen `data-*` kabul ediyor |
| `check:item-hooks` | Liste bileşenlerinin öğeleri de kanca taşıyor |
| `check:kit-class` | Kullanılan her `tamga-*` sınıfı tanımlı |
| `check:token-parity` | Her token iki temada da tanımlı |
| `check:token-contrast` | Varsayılan palet okunurluk eşiklerini geçiyor |
| `check:tema-cifti` | Sabit bir zeminle temayla dönen bir mürekkep eşleşmiyor |
| `typecheck` | Tipler tutuyor |
| `tamga-ui build` | Kit derleniyor |
| `check:palette` | Palet üreticisi 40 tonda, iki temada ölçülüyor |
| `test` | Saf mantık sınanıyor |
| `build` | Doküman sitesi derleniyor |

Her kontrolün başında neden var olduğu yazılı; çoğu gerçek bir hatadan doğdu. Seni yakaladıysa önce o yorumu oku.

## Kararlar

- Neden böyle: [docs/adr/](docs/adr/)
- Nasıl çalışıyor: [docs/01-mimari.md](docs/01-mimari.md)
- Bileşen gerekçeleri: [docs/08-bilesen-gerekceleri.md](docs/08-bilesen-gerekceleri.md)

Koddan karar üretme. Cevap bu dosyalarda yoksa karar henüz verilmemiştir; sor.

**Yorumlar:** kod dosyasında yalnız tuzağın yanındaki iki satır ve yayınlanan gerekçeler (prop JSDoc, token yorumu) kalır. Kararlar `docs/adr/`, kılavuzlar `docs/`, kullanıcıya dönük her şey doküman sitesinde.

Yol haritası ve müşteriye özel kararlar bu depoda değil: kamusal bir depo hangi müşteri için ne yapılacağını anlatmaz.
