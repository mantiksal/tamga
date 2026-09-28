<p align="center">
  <a href="https://tamga.org.tr">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="apps/docs/public/tamga-dark.svg">
      <img src="apps/docs/public/tamga-light.svg" alt="Tamga" height="64">
    </picture>
  </a>
</p>

<h1 align="center">An open-source design system for admin panels.</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/tamga-ui"><img src="https://img.shields.io/npm/v/tamga-ui?color=1E4FD8&label=npm" alt="npm"></a>
  <a href="https://github.com/mantiksal/tamga/actions/workflows/verify.yml"><img src="https://img.shields.io/github/actions/workflow/status/mantiksal/tamga/verify.yml?label=pnpm%20verify" alt="pnpm verify"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-0A1F3D" alt="MIT"></a>
</p>

<p align="center">
  <a href="https://tamga.org.tr/en">Docs</a> ·
  <a href="https://tamga.org.tr/en/docs/installation">Installation</a> ·
  <a href="https://tamga.org.tr/en/docs/templates">Templates</a> ·
  <a href="README.md">Türkçe</a>
</p>

## What's inside

- **Every piece a panel needs.** Tables, forms, filters, date pickers, dialogs, toasts, charts: all on the same scale, with the same shadow.
- **Ready-made screens.** List, detail, settings, sign-in, dashboard; templates built from the components, ready to copy.
- **A brand from one colour.** Give it your brand colour and both light and dark themes are generated from it. No fork, one hex code.
- **Turkish and English.** Every docs page in both languages.
- **It checks itself.** Every release passes 18 checks before it ships. If one fails, nothing goes to npm.

## Requirements

React 19 · Tailwind CSS v4 · Node 20+

## Install

```bash
npm install tamga-ui
```

Add three lines to your CSS:

```css
@import "tailwindcss";
@import "tamga-ui/styles.css";
@source "../../node_modules/tamga-ui/dist";
```

> Don't skip the `@source` line. Tailwind v4 does not scan `node_modules` on its own; without it components render half-dressed.

## Usage

```tsx
import { Button, StatusChip } from "tamga-ui";

export default function Page() {
  return (
    <>
      <Button variant="primary">Save</Button>
      <StatusChip label="Live" state="positive" dot />
    </>
  );
}
```

More in the [docs](https://tamga.org.tr/en/docs/installation).

## Apply your brand

```ts
import { makePalette } from "tamga-ui/palette";

const { light, dark } = makePalette("#E02938");
```

## Contributing

The code is MIT licensed; use it however you like. We don't accept outside pull requests. For bugs or ideas, [open an issue](https://github.com/mantiksal/tamga/issues).

On the team? [GELISTIRME.md](GELISTIRME.md) (Turkish).

## License

[MIT](LICENSE) · [Mantıksal Yazılım A.Ş.](https://mantiksal.com)
