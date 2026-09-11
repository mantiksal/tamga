# Changelog

Versions follow [semver](https://semver.org/). Through `0.x`, breaking changes may land in a
**minor** release; each one is listed below under "Breaking", together with how to move across it.

> 🇹🇷 Türkçe için [tamga.org.tr/tr](https://tamga.org.tr/tr).

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
