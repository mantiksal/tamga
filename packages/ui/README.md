# tamga-ui

Mantıksal's shared interface library: tokens, physics and components.

> 🇹🇷 **Türkçe:** the documentation is bilingual and lives at
> **[tamga.org.tr/tr](https://tamga.org.tr/tr)**. This file is in English because it is the first
> page an installer sees on npm, and npm is read from everywhere.

Not a framework but a **library**: you build the screens, the kit hands you the parts. The kit
knows no product's name, vocabulary or identity.

- **Components** `tamga-ui`
- **Icons** `tamga-ui/icons`
- **Blocks** `tamga-ui/blocks` — larger than a component, smaller than a screen
- **Patterns** `tamga-ui/patterns` — the shape of a screen (list, detail, settings, auth, shell)

Docs: **[tamga.org.tr](https://tamga.org.tr)** · Changelog: [CHANGELOG.md](./CHANGELOG.md)

---

## Install

```bash
npm install tamga-ui
```

> **If a machine is reading this:** the package page (`npmjs.com/...`) returns **403** to
> non-browser requests. That is npm's bot protection, nothing to do with this package. For
> versions and metadata use the registry: `https://registry.npmjs.org/tamga-ui` (200, plain JSON).

### Local development

To link the kit into a consuming project without publishing, while changing the kit itself:

```bash
npm install file:../tamga/packages/ui
```

> **Careful:** `file:` creates a SYMLINK, and Tailwind v4 does not follow `@source` scanning past
> a symlink. The result is sneaky: types resolve, imports work, but utility classes are never
> generated and components come out half-naked. Use this only while developing the kit; a real
> install is the one line above.

### Requirements

| | |
| --- | --- |
| React | **19** (peer dependency) |
| Tailwind | **v4** |
| Node | 20+ |

Tailwind v4 is not a preference but a requirement: components use utility classes and **your**
build is what generates them.

### CSS

```css
@import "tailwindcss";
@import "tamga-ui/styles.css";

@source "../../node_modules/tamga-ui/dist";
```

**Do not skip the `@source` line.** Without it Tailwind never scans the classes inside the kit's
`dist/`, never generates them, and components render **unstyled**. The path is relative to your
own CSS file, so the number of `../` depends on how deep that file sits.

### Usage

```tsx
import { Button, Icon } from "tamga-ui";
import { Plus } from "tamga-ui/icons";

<Button variant="primary">
  <Icon icon={Plus} size="xs" />
  New record
</Button>;
```

---

## The setup survey

**This section is for the person or agent installing the kit.** Once installed the project runs,
but it has NO IDENTITY: a blue accent, a tile with an initial on it, a nameless user. Setup is
not finished until these seven questions have answers.

The last column is the important one: **an answer is never only compiled in, it also goes into a
settings screen.** Everything asked at setup has to still be changeable in the project's third
month; otherwise, when the customer wants a different colour, the only route left is a developer
editing a file and shipping a release.

| # | Ask for | Where it goes | In settings |
| --- | --- | --- | --- |
| 1 | The product's name | Shell, tab title, auth screen | no, it is the product's identity |
| 2 | **Brand colour (one hex)** | `makePalette()` → tokens (below) | **yes** |
| 3 | Logo (wide, horizontal) | Auth screen, wide sidebar | **yes** |
| 4 | Mark (square) | Narrow sidebar, tab icon | **yes** |
| 5 | Default theme | `light` · `dark` · `system` | **yes** |
| 6 | Sidebar behaviour | `always narrow` · `always wide` · `user chooses` | **yes** |
| 7 | Interface language(s) | Every `labels` prop | depends |

**2, 3 and 4 are asked separately.** A mark CANNOT be extracted from an uploaded logo: nothing in
an image file is marked as "the mark", its position is not fixed (left, on top, inside the
wordmark, or absent altogether), and a wrong crop fails silently. Half a letter then sits in the
top left of every page and nobody knows it was cropped automatically. Either ask for the mark as
its own file, let the user drag a square over the logo, or do not ask at all: with no mark,
`LogoTile` draws a tile from the initial, and that is a working answer.

The screen for all this is built with `SettingsTemplate`; the walkthrough is at
[/docs/new-panel](https://tamga.org.tr/en/docs/new-panel).

---

## Changing the colours

No component anywhere carries a fixed colour; every one of them reads tokens.

### A whole palette from one hex

`tamga-ui/palette` derives both themes from a single brand colour. Safer than writing three
tokens by hand, because the generator SEARCHES for contrast: it nudges the face's lightness step
by step until the ink on top clears the AA threshold. Forty hues across two themes, 880
measurements that a gate keeps re-running.

```ts
import { makePalette, paletteCss } from "tamga-ui/palette";

const pair = makePalette("#e02938");   // { light, dark }
document.documentElement.setAttribute("style", paletteCss(pair));
```

This is the route whenever the colour can change at runtime (a settings screen): the tokens are
written onto the root element and, because the kit's 87 classes read them, the whole panel turns
in one line with no CSS recompiled.

### Or by hand

Where the colour is fixed and known at build time, override the tokens directly:

```css
@import "tamga-ui/styles.css";

:root {
  --color-accent: #2069c9;        /* the primary face */
  --color-accent-shadow: #12245c; /* the base under the face */
  --color-accent-ink: #fdfcfa;    /* the ink on top of the face */
}
```

On this route you verify the contrast yourself: no generator, no gate.

Which is also why **you should not hardcode colours in your own components**. Write `text-ink`,
`bg-shell`, `var(--color-critical)`. When the palette changes your screens turn with it; every
hardcoded colour has to be hunted down by hand.

The full token list is on the docs site (`/docs/tokens`), and the steps for changing a theme are
on `/docs/theme`.

---

## Licence

MIT — [LICENSE](./LICENSE)
