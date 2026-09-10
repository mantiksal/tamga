# 01 · Mimari

> Kit nasıl kurulmuş ve neden böyle. Bir bileşen eklemeden önce bunu bilmek gerekmiyor
> ([`02-bilesen-ekleme.md`](02-bilesen-ekleme.md) yeter), ama bir şey tuhaf davrandığında cevap
> genelde burada.

---

## 1 · Bundler yok

Kit **`tsc` ile derleniyor.** Rollup, tsup, esbuild: hiçbiri yok.

```
packages/ui/build.mjs   →  CSS dosyalarını kopyalar
tsc                     →  .js + .d.ts üretir
```

**Neden:** bir kütüphanenin bundle'lanması, tüketicinin bundler'ının işini ikinci kez yapmak
demek. Kit ESM olarak çıkıyor ve tüketicinin Next/Vite'ı zaten ağaç sallıyor: `Button` alan bir
proje `DatePicker`'ı tarayıcıya hiç göndermiyor. Bundler eklemek bu davranışı iyileştirmiyor,
yalnız bir yapılandırma dosyası ve bir hata kaynağı ekliyor.

**Sonucu:** `dist/` kaynak ağacın birebir kopyası. Bir dosyayı ararken `dist`'e değil `src`'ye
bak; ikisi aynı.

## 2 · Kamusal yüz `index.ts`

```ts
// packages/ui/src/index.ts
export { Button, buttonVariants, type ButtonProps } from "./components/button";
```

`index.ts`'te olmayan her şey **iç detaydır** ve major sürüm beklemeden değişebilir. Bunu
`package.json`'daki `exports` haritası zorluyor: `tamga-ui/src/...` diye bir yol yok, yani
tüketici iç dosyalara ulaşamaz.

Üç giriş var:

| yol | ne |
| --- | --- |
| `tamga-ui` | bileşenler ve tipler |
| `tamga-ui/styles.css` | Tailwind + kit CSS'i (çoğu proje bunu alır) |
| `tamga-ui/kit.css` | **saf CSS**, tek bir Tailwind direktifi yok, Tailwind kullanmayan projeler için |
| `tamga-ui/theme.css` | yalnız token'lar |
| `tamga-ui/icons` | ikonlar |

## 3 · CSS üç katman

```
theme.css   token'lar        --color-accent, --text-body, --row, --duration-press
kit.css     sınıflar         .tamga-btn, .tamga-card, .tamga-option
styles.css  giriş            Tailwind + yukarıdaki ikisi
```

**Sınıflar token'lardan başka hiçbir şey okumaz.** Bir markayı değiştirmek `theme.css`'teki bir
bloğu değiştirmektir; `kit.css`'e dokunulmaz. Elli yedi sınıf aynı değişkenleri okuduğu için
panelin tamamı döner; yeni CSS yazılmaz.

**Tailwind bir bağımlılık değil, bir kolaylık.** Bileşenler hem `.tamga-*` sınıflarını hem
Tailwind utility'lerini kullanıyor; `kit.css` ise saf. Yani Tailwind'siz bir proje bileşenleri
alamaz ama CSS'i alabilir.

### Tuzak: `@source` sembolik bağın arkasına geçmiyor

Tüketici projede Tailwind'e kitin sınıflarını taratmak gerekiyor:

```css
@source "../../node_modules/tamga-ui/dist";
```

**Bu satır yerel bağ modunda çalışmaz.** pnpm çalışma alanı ve npm'in `file:` bağımlılığı paketi
`node_modules` altına bir *sembolik bağ* olarak kuruyor, ve Tailwind bağın arkasına geçmiyor.
Yayınlanmış pakette sorun yok (gerçek klasör), yani hata yalnız geliştirirken görünüyor, ve
sessiz: ortak utility'ler tüketicinin kendi kaynağından zaten üretildiği için çoğu şey doğru
görünüyor, yalnız kite ÖZGÜ olan biri kırılıyor.

Yerel geliştirmede gerçek yolu da ekle:

```css
@source "../../../../tamga/packages/ui/src";
```

## 4 · Tema çalışma anında

Renkler derlenmiyor. `theme.css` CSS değişkeni tanımlıyor, `.dark` onları yeniden tanımlıyor, ve
bir ürün kendi marka bloğunu üstüne yazıyor. Yani bir müşterinin rengi **veriden** gelebilir:
paneldeki bir ayardan, hesaptan, hiç build almadan.

**Değişen tek şey renk.** Boşluk, köşe, gölge, tipografi sabit; on panel aynı karakterde. Bu bir
kısıt değil ürünün kendisi: değişkeni de serbest bırakmak, on ayrı tasarım demek olurdu.

## 5 · Ton, kitin dört rolü

```ts
type Tone = "neutral" | "positive" | "caution" | "danger";
```

Kit **yalnız bunları** bilir. Ürünün durumları (`teslim edildi`, `kargoda`, `birinci seviye`) kendi
tarafında tek bir tabloyla eşlenir:

```ts
export const ORDER_TONE: Record<OrderState, Tone> = { teslim: "positive", … };
```

Kitin alan bilmemesi bir eksiklik değil sözleşme; `check-names` guard'ı sızmayı build'de
durduruyor.

## 6 · Doküman sitesi kitin canlı kanıtı

`apps/docs` Fumadocs ya da Nextra **değil**, kendi kitiyle yazıldı. Sebebi tek: site kitin dilini
konuşmuyorsa kit bir dil değildir. Önizlemelerdeki her şey `tamga-ui`'den geliyor; ekran
görüntüsü ya da kopyalanmış işaretleme yok, yani doküman ile gerçeğin ayrışması mekanik olarak
imkânsız.

**Props tabloları üretiliyor** (`scripts/extract-props.mjs`). Kaynağı sözdizimsel okuyor;
TypeScript'in klasik derleyici API'si kullanılmadı çünkü kit TypeScript 7'ye bağlı (Go
derleyicisi) ve onda o API yok. İkinci bir derleyici kurmak reddedildi: kiti derleyen sürüm ile
dokümanı okuyan sürüm ayrıştığı gün hangisinin doğru olduğu belli olmaz.

`props.json` **üretilen bir dosya**: `.gitignore`'da, her `dev`/`build`/`verify`'de yeniden
yazılıyor. Elle düzenleme.

## 7 · Sürüm

Changesets. `pnpm release` derler ve yayınlar. Tüketiciler **tam sürüm sabitlemesi** kullanıyor
(`"tamga-ui": "1.4.2"`, `^` yok), bir yamanın on projeye habersizce girmemesi için; Renovate
yükseltmeyi PR olarak açıyor.
