# Changelog

Versions follow [semver](https://semver.org/). Through `0.x`, breaking changes may land in a
**minor** release; each one is listed below under "Breaking", together with how to move across it.

> 🇹🇷 Türkçe için [tamga.org.tr/tr](https://tamga.org.tr/tr).

## 0.3.2

**Every component that draws a host element now accepts `data-*`.** 98 of them; before this, 79 did
not.

A `data-*` attribute is inert: it binds to no behaviour, it only carries a hook for a test, a style
or an analytics reader. Refusing it cannot protect a component from anything. What it does instead
is push the caller off the component entirely — a hook is needed, the component will not take it,
so the class goes on a hand-written element and every guard that came with the component stays
behind: the clip that keeps a menu whole inside a card, the wrapper that lets a table scroll on a
narrow screen, the button that a keyboard can reach. None of it errors. The attribute is simply
absent, and so is the behaviour.

`aria-*` is deliberately not in this passthrough. It is not inert: an `aria-label` from outside
silently overrides the accessible name a component computed for itself. Accessibility is asked for
by an explicit prop.

`Segmented` and `Steps` are the two exceptions, and the reason is written into the gate: their hooks
belong to the individual option, not the wrapper, and `options[]` already carries them.

### Added

- **`Card.as`** — `div` (default), `section`, `article` or `ul`. A card is usually a *section*, and
  the element is document structure rather than a presentation choice.

### Internal

- **`check-data-props`** — a 17th gate. It reads every exported component that renders a host
  element and fails if it cannot take `data-*`. The five fixes that preceded this release were five
  separate discoveries of one defect, found one call site at a time; this gate finds all of them in
  one pass.

## 0.3.1

Three components refused something a consumer legitimately needed, and in each case the way out was
to drop the component and write its class by hand. A class without its component is the same paint
with none of the behaviour, so this release is about closing the reasons to reach for it.

### Added

- **`Link.linkComponent`** — the router's link, so an in-app link does not reload the page. Without
  it the component could only draw a plain `<a>`, and anything with client-side routing had to hand
  write `tamga-link` on its own link, taking the class and leaving behind the `rel="noopener
  noreferrer"` that `external` brings. `RailLink` and `AppShell` already solved this the same way;
  `Link` was the one that had not.
- **`Card.as`** — `div` (default), `section`, `article` or `ul`. A card is usually a *section*, and
  a component that refuses the element pushes the caller to write `tamga-card` by hand. That trade
  is worse than it looks: the hand-written version also loses `overflow="visible"`, which is the
  guard against a menu or a calendar being clipped at the card's edge. Nothing errors when that
  happens; the panel is simply half invisible and the first suspect is z-index, which cannot fix it.
- **`Segmented` options carry their own attributes.** Anything beyond `value` and `label` now lands
  on that option's button, so a filter strip can tag each choice with the hook a test or a style
  needs. Without it the whole control had to be hand-rolled, losing `aria-pressed` and the keyboard
  behaviour with it.

## 0.3.0

### Breaking

- **The Turkish aliases in `tamga-ui/palette` and the colour helpers are gone.** They were
  `@deprecated` through 0.2.x with the removal booked for this release; the mapping is the table
  under 0.2.0. Nothing in the two products that consume this kit still used them, and the kit's own
  documentation site did — which is the whole reason a deprecation window has an end.
  **Migration:** `paletUret` → `makePalette`, `paletStili` → `paletteVars`, `gecerliHex` → `isHex`,
  and so on down that table.

### Added

- **`ThemeToggle` can be driven from outside.** New optional `dark` and `onChange`. With them the
  control stops owning the preference: it writes no storage, touches no class, only shows and
  reports. Without them nothing changes.

  **You were affected if** your app already tracks the theme itself and also mounts this control.
  Two writers then fight over one `.dark` class: whichever runs last wins, and the two can disagree
  — token-driven colour saying one thing, `dark:`-driven utilities saying the other. Nothing errors.
  Pass `dark` and `onChange` and the control stops being the second writer.

### Fixed

- **`RailLink` dropped every extra prop.** `AppShell` passes `data-nav` to each rail entry and the
  attribute never reached the DOM — the passing side thought it had passed it, the receiving side
  never drew it, and nothing errored. Anyone hanging a test or a style on `[data-nav]` was hanging
  it on nothing. `RailLink` now spreads what it is given.
- **`ThemeToggle`'s icon variant no longer flashes the wrong glyph.** Which icon shows is decided
  by CSS rather than React state, so the first frame is right without waiting for hydration.
- **A checked checkbox drew its edge in its own fill colour**, so a filled control had no base under
  it. Filled accent objects follow the button's contract everywhere now: `accent` fill,
  `accent-shadow` edge, `accent-ink` ink.
- **An image tile's hover turned its border to the accent and left its shadow neutral**, which
  detaches the height from the object. Law 1 asks for one colour on both.

### Internal

- **`check-physics`** — a 16th gate. It reads `kit.css` and holds Law 1 against its written form:
  blur zero, offset diagonal, offset on the ladder (0 · 1 · 2 · 3 · 4 · 6), edge and shadow the same
  colour, a press that travels exactly the resting offset, a hover that rises exactly one step. It
  covers 61 elevations across 37 families.

  The law is the kit's, so its proof belongs here too. It used to be measured downstream, against a
  gallery the kit does not own.
- **The pattern layer has tests.** 35 of them. Until now the kit had 32 tests and not one of them
  rendered a component, while every consumer of `tamga-ui/patterns` depended on that layer.

## 0.2.1

### Added

- **`AppearanceTemplate`** (`tamga-ui/patterns`) — the whole appearance screen: logo, mark, brand
  colour, theme and sidebar width. This screen had been built twice, by hand, in two products, and
  the second one came out bare: a hex field instead of swatches, three words instead of three
  pictures, no logo area at all. Handing over the parts and saying "arrange them yourself" is what
  let them drift; that is the job the pattern layer exists for (ADR-0004).

  It stores NOTHING and applies NOTHING. `value` in, `onChange` and `onSave` out, every word from
  `labels`. Where the preference lives (session, account, browser) is a product decision, and
  turning the chosen colour into tokens stays the product's call too, because the root element is
  its own.

- **`ColorSwatches`, `ThemeCards`, `ImageField`** — the parts, for a screen that needs a different
  arrangement. `ThemeCards` draws a miniature of each option rather than naming it; a theme is not
  chosen by a word, it is chosen by seeing the result.
- **`SquarePicker`** — dragging a square over an uploaded logo to cut a mark out of it. A mark
  cannot be derived automatically, and this is the honest alternative: the human says where it is.
- **`prepareImage` and `cropSquare`** (`tamga-ui`) — resize and square-crop an uploaded file, with
  no library: a `<canvas>`. The ratio is kept and nothing is cropped silently; SVG passes through
  untouched, because baking a vector into a 512px PNG stops it being sharp.
- **`SettingsPanel.accent`** — a coloured left edge on a section block.

### Fixed

- **Completed steps were darker than everything else on the screen.** `StepStrip` filled them with
  `--color-accent-line`, which is the accent's TEXT variant: it is derived by SEARCHING for 4.5
  contrast against the page, so it is always darker than the face. Every button and badge on the
  same screen used `--color-accent`, and the gap widened with each new brand colour. The ink on top
  was measured against `accent`, never against `accent-line`, so that pairing was never checked at
  all. Filled accent objects now follow the button's contract everywhere: `accent` for the fill,
  `accent-shadow` for the edge, `accent-ink` for the ink.

  Nothing errored here: the colours were valid and the contrast gates passed. `check-css` now
  refuses `--color-accent-line` as a fill, so this class of mistake cannot pass silently again.

## 0.2.0

Most of this release came out of gaps found by two people using the kit **from the outside**:
one rewriting a photo application on top of it, another building an e-commerce panel from scratch.

### Breaking

- **`ErrorSlot` and `Busy` are no longer exported from `tamga-ui/patterns`.** They were the
  templates' internal machinery; templates already draw their own error and loading states, and
  offering these separately was an invitation to draw the same state two different ways.
  **Migration:** if you want that treatment, use the template (`ListTemplate`, `DetailTemplate`,
  `WizardTemplate`); all three draw the same slot from their `state` and `error` props.

- **`Kpi.accent` and `Kpi.attention` were removed.** Both let the tile change itself per screen:
  `accent` drew the data's own colour down the left edge, `attention` painted the number in the
  critical colour. Their only consumer rejected both — the colour was already on the badge in the
  list, and with three of five tiles red none of them led. The tile now looks the same on every
  screen.
  **Migration:** to say a number is bad, use `delta` (a change with a direction and a meaning) or
  the screen the tile opens.

### Renamed (the old names still work for one more version)

The names in `tamga-ui/palette` and the colour helpers were in Turkish; ADR-0001 says names are
English, and we wrote that rule. The old names remain as `@deprecated` aliases and **will be
removed in 0.3.0**.

| old | new |
| --- | --- |
| `gecerliHex` | `isHex` |
| `hexRgb` · `rgbHex` | `hexToRgb` · `rgbToHex` |
| `parlaklik` · `oran` · `acikligi` · `dL` | `luminance` · `contrast` · `lightness` · `deltaL` |
| `hexOklch` · `oklchHex` | `hexToOklch` · `oklchToHex` |
| `oranaGoreAcikligi` | `lightnessForContrast` |
| `paletUret` · `paletiOlc` | `makePalette` · `measurePalette` |
| `paletStili` · `paletCss` | `paletteVars` · `paletteCss` |
| `Palet` · `PaletCifti` · `Olcum` | `Palette` · `PalettePair` · `Measurement` |
| `{ ad, tur, deger, esik, gecti }` | `{ name, kind, value, threshold, passed }` |

### Added

- **`AppShell.rail`** — `narrow` (default) or `wide`. The rail could only ever be narrow before,
  and whoever installed the kit had no way to discover otherwise. On a narrow rail the labels now
  appear in the kit's own `Tooltip` rather than the browser's delayed `title` bubble.
- **`AppShell.railFooter`** — a control at the foot of the rail, an expand/collapse button say.
- **`AccountButton`** — the account control at the right end of the top bar. It fits the avatar to
  `--control` (40px), exactly the height of the theme toggle. Two panels had built this by hand.
- **`Sheet.side`** — `end` (default) for detail, `start` for navigation. The panel slides in from
  the edge it belongs to; with `prefers-reduced-motion` the slide is dropped.
- **`ThemeToggle variant="select"`** — for when its neighbour is a select box. This variant takes
  STATE words as `labels` (`{ light, dark }`), not action words, and the type enforces it.
- **`aria-label` on `Select`** — a select standing alone in a toolbar was announced as just
  "button".
- **`Kpi`** can now be pressed (`href` makes it a link, `onClick`/`pressed` a filter button) and
  takes an icon; **`KpiGrid`** derives its column count from how many children it has.
- **`paletteVars`** — turns a palette into a map of CSS variables, for applying it to a single box
  or to the root at runtime.

### Fixed

- The open section in a `SettingsTemplate` menu was never painted: the template writes
  `data-active` while the CSS only had a rule for `data-selected`.
- `WizardTemplate` drew its own step strip while the `Steps` component drew the same idea
  differently. The strip now lives in one place.
- `WizardTemplate`'s footer is sticky: on a long step form "Next" slid off the bottom of the
  screen.
- `.tamga-link` now carries `cursor: pointer`. An `<a>` without `href`, or a `<span>` styled as a
  link, was leaving the cursor at `auto`.

### Docs

- **The nine patterns and fourteen blocks now have prop tables.** The extractor only looked at
  `components/`, so the kit's highest-level API was invisible on the docs site. 103 → 117
  components, 439 → 612 props.
- The README said the package was not published yet. Installing is one line: `npm install tamga-ui`.

## 0.1.1

- The package homepage points at `tamga.org.tr`.

## 0.1.0

First release.
