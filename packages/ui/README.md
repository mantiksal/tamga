# tamga-ui

Mantıksal'ın ortak arayüz kütüphanesi: token'lar, fizik ve bileşenler.

Framework değil **kütüphane** — ekranları sen kurarsın, kit parçaları verir. Kit hiçbir ürünün
adını, sözlüğünü ya da kimliğini bilmez.

- **Bileşenler** `tamga-ui`
- **İkonlar** `tamga-ui/icons`
- **Bloklar** `tamga-ui/blocks` — bir bileşenden büyük, bir ekrandan küçük
- **Şablonlar** `tamga-ui/patterns` — ekranların şekli (liste, detay, ayar, oturum, kabuk)

Doküman sitesi: depoyu klonlayıp `pnpm install && pnpm --filter tamga-docs dev` (port **6070**).

---

## Kurulum

```bash
npm install tamga-ui
```

Paket npm'de yayında ve `mantiksal` organizasyonuna ait. Yayın ve depo bağlantıları
[npmjs.com/package/tamga-ui](https://www.npmjs.com/package/tamga-ui) sayfasında.

> **Bir makine okuyorsa:** paket sayfası (`npmjs.com/...`) tarayıcı dışı isteklere **403**
> döndürüyor; bu npm'in bot korumasıdır, paketle ilgisi yok. Sürüm ve metadata için kayıt
> defterini kullan: `https://registry.npmjs.org/tamga-ui` (200 döner, düz JSON).

### Yerel geliştirme

Kitin kendisini değiştirirken, tüketen projeye yayınlamadan bağlamak için:

```bash
npm install file:../tamga/packages/ui
```

> **Dikkat:** `file:` bir SEMBOLİK BAĞ kuruyor, ve Tailwind v4 `@source` taramasını sembolik
> bağın ardına götürmüyor. Sonuç sinsi: tipler çözülür, importlar çalışır, ama utility sınıfları
> üretilmediği için bileşenler yarı çıplak çıkar. Bu yolu yalnız kiti geliştirirken kullan;
> gerçek kurulum yukarıdaki tek satır.

### Gerekenler

| | |
| --- | --- |
| React | **19** (peer dependency) |
| Tailwind | **v4** |
| Node | 20+ |

Tailwind v4 bir tercih değil şart: bileşenler utility sınıfı kullanıyor ve o sınıfları **senin**
build'in üretiyor.

### CSS

```css
@import "tailwindcss";
@import "tamga-ui/styles.css";

@source "../../node_modules/tamga-ui/dist";
```

**`@source` satırını atlama.** Onsuz Tailwind kitin `dist/`i içindeki sınıfları taramaz, üretmez,
ve bileşenler **stilsiz** çıkar. Yol senin CSS dosyandan `node_modules`a göre; derinliğe göre
`../` sayısı değişir.

### Kullanım

```tsx
import { Button, StatusChip } from "tamga-ui";
import { Plus } from "tamga-ui/icons";

<Button variant="primary">
  <Icon icon={Plus} size="xs" />
  Yeni kayıt
</Button>;
```

---

## Kurulum anketi

**Bu bölüm kiti kuran kişi ya da ajan içindir.** Kit kurulduğunda proje çalışır ama KİMSESİZDİR:
mavi bir vurgu, baş harften bir karo, adsız bir kullanıcı. Aşağıdaki yedi sorunun cevabı
alınmadan kurulum bitmiş sayılmaz.

Her satırın son sütunu önemli: **cevap bir kere sorulup koda gömülmez, bir ayar ekranına da
konur.** Kurulumda sorulan her şey projenin üçüncü ayında da değiştirilebilir olmalı; yoksa
müşteri rengini değiştirmek istediğinde tek yol bir geliştiricinin CSS yazıp yeniden yayın
alması olur.

| # | Sorulacak | Nereye gider | Ayar ekranında |
| --- | --- | --- | --- |
| 1 | Ürünün adı | Kabuk, sekme başlığı, oturum ekranı | hayır, ürünün kimliği |
| 2 | **Marka rengi (tek hex)** | `paletUret()` → token'lar (aşağıda) | **evet** |
| 3 | Logo (geniş, yatay) | Oturum ekranı, geniş kenar çubuğu | **evet** |
| 4 | Amblem (kare) | Dar kenar çubuğu, sekme ikonu | **evet** |
| 5 | Varsayılan tema | `açık` · `koyu` · `sistem` | **evet** |
| 6 | Kenar çubuğu davranışı | `hep dar` · `hep geniş` · `kullanıcı seçsin` | **evet** |
| 7 | Arayüz dili / dilleri | Bütün `labels` prop'ları | duruma göre |

**2, 3 ve 4 birbirinden bağımsız sorulur.** Yüklenen bir logodan amblem OTOMATİK çıkarılamaz:
bir görsel dosyasında "amblem" diye işaretli bir şey yoktur, konumu sabit değildir (solda, üstte,
yazının içinde ya da hiç yok), ve yanlış kesim sessizdir. Yarım bir harf panelin her sayfasının
sol üstünde durur ve kimse bunun otomatik kesildiğini bilmez. Amblemi ya ayrı bir dosya olarak
iste, ya kullanıcıya logo üzerinde kare bir alan seçtir, ya da hiç isteme: amblem yoksa
`LogoTile` baş harften bir karo üretir ve bu çalışan bir cevaptır.

Sorulacakların ekranı `SettingsTemplate` ile kuruluyor; adım adım anlatımı doküman sitesinde
`/docs/yeni-panel` sayfasında.

---

## Renkleri değiştirmek

Bir bileşen hiçbir yerde sabit renk taşımıyor; hepsi token okuyor.

### Tek hex'ten bütün palet

`tamga-ui/palette` bir marka renginden iki temanın tamamını üretiyor. Elle üç token yazmaktan
daha güvenli, çünkü üreteç kontrastı ARAYARAK buluyor: yüzün açıklığını, üstündeki mürekkebin
AA eşiğini geçene kadar adım adım kaydırıyor. Kırk ton ve iki tema, bir kapının sürekli ölçtüğü
880 ölçüm.

```ts
import { paletUret, paletCss } from "tamga-ui/palette";

const cift = paletUret("#e02938");   // { light, dark }
document.documentElement.setAttribute("style", paletCss(cift));
```

Renk çalışma zamanında değişebiliyorsa (ayar ekranı) yol budur: token'lar kök elemana yazılıyor
ve kitin 87 sınıfı onları okuduğu için bütün panel tek satırda dönüyor, hiçbir CSS yeniden
derlenmeden.

### Ya da elle

Rengin sabit olduğu ve derleme zamanında bilindiği projelerde token'ları doğrudan geçersiz
kılabilirsin:

```css
@import "tamga-ui/styles.css";

:root {
  --color-accent: #2069c9;        /* birincil yüz */
  --color-accent-shadow: #12245c; /* yüzün altındaki taban */
  --color-accent-ink: #fdfcfa;    /* yüzün üstündeki mürekkep */
}
```

Bu yolda kontrastı kendin doğrulamak zorundasın: üreteç yok, kapı yok.

Bu yüzden **kendi bileşenlerinde de sabit renk yazma**: `text-ink`, `bg-shell`,
`var(--color-critical)` yaz. Palet değiştiğinde ekranların onunla birlikte döner; sabit yazılmış
her renk elle bulunup düzeltilir.

Token'ların tamamı doküman sitesinde (`/docs/tokens`), temayı değiştirmenin adımları
`/docs/tema` sayfasında.

---

## Lisans

MIT — [LICENSE](./LICENSE)
