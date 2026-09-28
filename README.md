<p align="center">
  <a href="https://tamga.org.tr">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="apps/docs/public/tamga-dark.svg">
      <img src="apps/docs/public/tamga-light.svg" alt="Tamga" height="64">
    </picture>
  </a>
</p>

<h1 align="center">Yönetim panelleri için açık kaynak tasarım sistemi.</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/tamga-ui"><img src="https://img.shields.io/npm/v/tamga-ui?color=1E4FD8&label=npm" alt="npm"></a>
  <a href="https://github.com/mantiksal/tamga/actions/workflows/verify.yml"><img src="https://img.shields.io/github/actions/workflow/status/mantiksal/tamga/verify.yml?label=pnpm%20verify" alt="pnpm verify"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/lisans-MIT-0A1F3D" alt="MIT"></a>
</p>

<p align="center">
  <a href="https://tamga.org.tr/tr">Doküman</a> ·
  <a href="https://tamga.org.tr/tr/docs/kurulum">Kurulum</a> ·
  <a href="https://tamga.org.tr/tr/docs/sablonlar">Hazır ekranlar</a> ·
  <a href="README.en.md">English</a>
</p>

## Neler var

- **Bir panelin ihtiyaç duyduğu her parça.** Tablo, form, filtre, takvim, diyalog, bildirim, grafik: hepsi aynı ölçüden ve aynı gölgeden.
- **Hazır ekranlar.** Liste, detay, ayarlar, giriş, pano; bileşenlerden kurulmuş, kopyalayıp başlayabileceğin şablonlar.
- **Tek renkten marka.** Marka rengini ver, açık ve koyu temanın tamamı ondan üretilsin. Kod dalı açılmaz, bir renk kodu değişir.
- **Türkçe ve İngilizce.** Dokümanın her sayfası iki dilde.
- **Kendi kendini denetliyor.** Her sürüm yayımlanmadan önce 18 kontrolden geçiyor. Biri bile takılırsa sürüm npm'e gönderilmiyor.

## Gereksinimler

React 19 · Tailwind CSS v4 · Node 20+

## Kurulum

```bash
npm install tamga-ui
```

CSS dosyana üç satır ekle:

```css
@import "tailwindcss";
@import "tamga-ui/styles.css";
@source "../../node_modules/tamga-ui/dist";
```

> `@source` satırını atlama. Tailwind v4 `node_modules`'u kendiliğinden taramıyor; o satır olmadan bileşenler yarım görünür.

## Kullanım

```tsx
import { Button, StatusChip } from "tamga-ui";

export default function Page() {
  return (
    <>
      <Button variant="primary">Kaydet</Button>
      <StatusChip label="Yayında" state="positive" dot />
    </>
  );
}
```

Devamı [dokümanda](https://tamga.org.tr/tr/docs/kurulum).

## Markanı uygula

```ts
import { makePalette } from "tamga-ui/palette";

const { light, dark } = makePalette("#E02938");
```

## Katkı

Kod MIT lisanslı; dilediğin gibi kullanabilirsin. Dışarıdan pull request almıyoruz. Hata ya da öneri için [issue açabilirsin](https://github.com/mantiksal/tamga/issues).

Ekipten biriysen: [GELISTIRME.md](GELISTIRME.md).

## Lisans

[MIT](LICENSE) · [Mantıksal Yazılım A.Ş.](https://mantiksal.com)
