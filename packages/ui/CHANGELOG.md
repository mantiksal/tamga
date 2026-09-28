# Changelog

Versions follow [semver](https://semver.org/). Through `0.x`, breaking changes may land in a
**minor** release; each one is listed below under "Breaking", together with how to move across it.

> 🇹🇷 Türkçe için [tamga.org.tr/tr](https://tamga.org.tr/tr).

## 0.5.0

> The Soft Neo Brutalism port: every component, every token and the physics behind them. The
> renames are under "Breaking", each with the line that moves you across.

### Removed

- **A dead layer of unprefixed classes is gone.** `theme.css` still carried `.press-surface`,
  `.seated-surface`, `.card-surface`, `.sunk-surface`, `.app-surface`, `.gutter`, `.rail-link` and
  a second copy of the skeleton and beacon keyframes (`.animate-skeleton-breath`,
  `.animate-beacon-breath`). All of it predates the `tamga-` rename: the real physics lives in
  `kit.css` as the `.tamga-*` family, and nothing in the kit, the docs site or either consuming
  panel referenced a single one of these. One comment beside them even claimed a block had been
  deleted while the block sat eight lines below it. 210 lines.

- **27 token names the kit itself never read.** `--shadow-raised`, `--shadow-pressed`,
  `--shadow-seated-pressed`, `--shadow-overlay`, `--shadow-ambient`, `--shadow-rim`, the ten
  `-foreground` pairs, `--primary`, `--secondary`, `--muted`, `--popover`, `--beacon`, `--input`,
  `--duration-instant`, `--table-min-wide`, `--table-min-widest`, `--color-danger-solid` and
  `--radius-lg`. They were printed on the token page, so a consumer could reasonably read them as
  part of the kit's vocabulary, and the vocabulary was stale: the page listed `--shadow-raised` as
  `2px 2px 0 0 var(--shadow-color)` while the kit actually paints
  `2px 2px 0 var(--color-edge-strong)`. A name the kit does not read is a name nothing keeps
  honest. The token page goes from 162 entries to 136, and every entry left is one the kit uses.

  Migration: each has an equivalent in the kit's own family, and in most cases the same value
  (`--primary-foreground` and `--color-accent-ink` were both `#fdfcfa` light / `#12245c` dark).
  Kept: the raw brand ramp (`--color-brand-50/100/400/600`), which is documented as raw material
  that the semantic tokens derive from rather than something the interface consumes.

- **19 `@theme inline` bridges nobody could reach.** `--color-background`, `--color-foreground`,
  `--color-primary`, `--color-muted`, `--color-popover`, `--color-border`, `--color-input`, the
  `-foreground` pairs and the rest of the shadcn-compat naming existed only to generate Tailwind
  utilities (`bg-background`, `text-muted-foreground`, …). Nothing used them, and they were not on
  the token page either, so they were not an offering to consumers, just weight: **266 fewer
  generated utilities** (1401 → 1135). The raw tokens behind them are untouched, so a product that
  writes `var(--primary)` in its own CSS still works.

  Kept on purpose: `--font-sans`. No rule in the kit reads it, but Tailwind's preflight does, so
  removing it would have quietly changed the typeface of every consumer.

### Added

- **`DropdownMenu` takes `defaultOpen`.** A documentation surface has to be able to show the open
  panel; until now the only way was a click, so a menu on a poster page was an empty button. Not
  for a product screen: a menu that is open before anyone asked for it covers what is under it.

### Changed

- **`FileUpload`'s drop zone is no longer squared paper.** It reused `.tamga-art-well`, a ground
  designed for ILLUSTRATIONS ("an instrument on paper"); behind a sentence and two lines of hint
  text the 8px ruling competes with the words. The well now has its own class
  (`.tamga-drop-well`): a dashed edge on the accent's palest ground, which is the quietest way to
  say "you can drop something here". `.tamga-art-well` is unchanged and still draws illustrations.

### Fixed

- **`Calendar` now opens on the month of its `value`.** It always opened on the current month, so
  a date handed to it from another month left the grid showing today with no selection anywhere in
  sight: the caller had given a date and the calendar appeared to have ignored it. With no `value`
  it still opens on today.

### Changed

- **`ColorSwatches`: the free-colour square now carries an eyedropper.** Its empty state was a
  checkered ground and nothing else. The ground says "no colour here" but not what the square is
  FOR, and this square does something none of the other six do: it opens a colour picker. The
  glyph says that. Once a free colour is chosen the eyedropper gives way to the check mark the
  presets use, so the "which one is selected" reading stays the same across all seven.

- **The chart family now matches the design reference.** Eight components changed, all of them
  visual: the bar chart's rows fade to 0.4 around the one you point at (a painted row background
  turned five rows into five boxes), the pie's first series takes the accent instead of the
  categorical palette's olive, the score ring is a filled arc rather than a 32-segment dial, the
  score meter became a five-band scale with a pointer rather than a filling bar, and progress
  moved its label and number above the track and dropped the ticks that used to stand in for the
  number.

  Two rules came out of it and they hold across the family: **the first series is the accent**
  (`seriRenk`), because most charts have one series and it is the page's real information; and
  **emphasis is opacity, never a painted ground**.

  The sparkline lost its area fill and baseline: both gave an axis-less line the look of an axis,
  promising a scale it cannot deliver. It also lost its end marker by default (`mark` turns it
  back on), because in a column of sparklines it repeats on every row.


- **The form family now matches the design reference.** Nine components, and each change answers a
  complaint someone actually had: the combobox now **bolds the matched letters** in each option, so
  a long list shows you why a row is in it; the date picker's cells are a 36px grid with a framed
  today instead of text in a table; multi select shows **four chips and then `+N`**, because a field
  holding eleven selections used to grow taller than the form; tags input asks twice before
  destroying — the first Backspace marks the last tag, the second removes it; and tree select draws
  a **mixed** parent when only some children are picked, instead of an unchecked one that lies.

  Two of them are rebuilds rather than edits. **Rich text's active button is a wash, not a fill**:
  three formats can be on at once, and three filled buttons broke the one-primary-action rule and
  made the toolbar read like a warning. **Schedule input** is described under Breaking.

  Number input keeps its own rule: while the field has focus it shows **what you typed**, and
  formats only on blur. Formatting mid-keystroke moves the caret out from under the cursor, which is
  how "1.500" becomes "1.5001" — measured, not imagined.


- **The table and list family now matches the design reference.** `SortHeader` draws a neutral
  two-way glyph on sortable columns that are not sorted, and keeps the **direction** arrow for the
  sorted one, now in the accent colour. Before this, an unsorted header carried nothing at all, so
  nothing on screen said the header was clickable and sorting was found by accident.

  `SelectAll` stopped drawing its own box. It was a `role="checkbox"` span that painted a plain
  square when checked, while the row boxes beside it painted `Checkbox`'s tick: two different
  marks in one column, visible only when everything was selected. It is a `Checkbox` with
  `indeterminate` now — same component, same size, same keyboard.

  `ListRow` highlights on `--color-hover`, the token the table already used (it was on
  `--color-sunk`, so a list beside a table showed two different greys), and it takes `min-height`
  rather than `height`, because a row with a title *and* a sub-line was overflowing its box.

  `LogView` gained level badges and dashed row rules: 13px mono at a 1.7 line height, a fixed
  78px timestamp column, and a badge whose **slot** is fixed width while the badge hugs its text,
  so the message column starts at the same place on every line.


- **The overlay family now matches the design reference.** `Dialog` enters instead of appearing:
  160ms, opacity plus a scale from .98 (it settles, it does not grow), with the scrim fading
  alongside it, and `prefers-reduced-motion` turning both off while leaving the dialog open.

  **The scrim is the ink at 45%**, not a warm brown at 32%. The dialog page states the rule —
  everything behind it becomes unreachable — and at 32% the page behind stayed comfortably
  readable, so the dialog read as a card rather than as a gate. Same hue as the ink, so the dim
  is one colour deepening rather than a second colour cast over the page.

  `Popover` grew an arrow, drawn as two stacked triangles (edge colour under, surface colour 2px
  down), aligned 22px from the trigger's side rather than centred on the 288px panel, because an
  arrow leaving the middle points at empty space instead of at what opened it. `Tooltip` keeps
  its own arrow: that bubble is `fixed` and measured in JS, so it is detached from the trigger's
  box and the arrow is its only tie.

  `Tooltip` also waits now: **400ms on hover, nothing on keyboard focus**, `Esc` closes it, and
  the label is bound with `aria-describedby` to a copy that is always in the DOM — a screen
  reader reads the description the moment focus lands, while the bubble may not be open yet.


- **The shell family now matches the design reference.** `Tabs` underlines the active tab with
  **3px** sitting on the strip's own rule rather than a 1px line the same weight as it. The rail's
  active row takes an accent **wash**: hover and active were both the surface colour, so the only
  thing separating them was 3px of shadow against 4px, which the eye does not read. It is still a
  wash and not a fill, so "you are here" is still not painted as an action.

  `LogoTile`'s letter is the display face at its heaviest, in the accent colour. Drawn in muted
  mono it read as a *code* rather than as a brand, and this tile stands in for an image.

  **Keyboard, and it is a promise.** `role="tablist"` and `role="radiogroup"` announce "move with
  the arrows"; while the arrows did nothing, that role was a lie. Both strips now move with ←/→,
  jump with Home/End, carry focus along with the selection, skip disabled tabs, and expose a
  **single tab stop** — an eight-tab strip used to cost eight presses to get past.

  **`Segmented` is a radio group**, not a group of pressed buttons: as buttons, a screen reader
  did not say how many choices there were or which one was chosen, because pressed buttons count
  as independent of each other. `RadioGroup` stays a separate component for a separate job — it
  is a form field, with a label, help text and an error line; this is a toolbar control.


- **The design's own kit was read section by section — all 96 of them.** Six reference files
  (actions, form, data, feedback, layout, extras), each section compared against its page and its
  component. What came out of it is in the entries above and below; the ones that changed
  behaviour rather than measurements are marked as such.

  The appearance screen's five parts (`ColorSwatches`, `ThemeCards`, `RailCards`, `ImageField`,
  `SquarePicker`) were documented in prose with no live example on the page — the one thing a
  screen built out of **pictures instead of words** cannot be explained without. Its page opens
  with the real thing now.


- **An accordion is a stack of cards, and the open one rises.** Every section used to be a row
  inside one surface, separated by rules, and which one was open could only be read from the
  direction of its caret. Each is its own card now (1.5px edge, r7); open, it takes a 3px base
  and a washed head, and its body indents to the title's text column.

  `SectionHead` grew a second size. `base` stays the card's own strip; **`lg` is a section of a
  PAGE** — a 30px title, an eyebrow above it **in the accent** (in a quiet grey it read as a
  separate line rather than part of the title), a line under it, and no closing rule, because
  the container sets the page's rhythm.


- **Avatars are brand tiles now.** They were grey-on-grey with one 3px corner at every size. The
  **corner grows with the size** (4 · 5 · 7 · 8) — at 24px an 8px corner turns the square towards
  a circle, and at 56 a 4px corner leaves it sharp — the edge is 1.5px like every other pressed
  thing, and **only the large ones (40 up) carry a base**, because a 24px tile lives inside a row
  and a base there crowds it. Two fills, `solid` and `soft`; not a palette, because an avatar is
  not a status.

  `ErrorState` is **centred** and its retry is the primary button: the block replaces a section
  rather than being pinned to its left edge, and in that state the screen offers nothing else.


- **`Code` is the dark block it was drawn as.** It was a light surface with a copy button parked
  in its corner, over the first line. It is now the inverse surface in both themes, with a strip
  carrying the **filename** and the copy button, and **line numbers** that cannot be selected —
  someone dragging to copy the code was taking the numbers with it. The reference puts an accent
  shadow under it; Law 1 says the edge and the offset are one colour, and the law comes first.

  `Alert` carries the **tone's glyph in its own tile** (the four feedback marks derive from the
  tone, so the same tone cannot be a triangle on one screen and a circle on the next). Its 3px
  left border is gone: the comment above it had said "the tone is the wash, not the left rule"
  for a long time while the rule kept drawing it.


- **The form family, the same way.** A failing field is **washed**, not only outlined: with four
  fields in a form the eye was hunting for the bad one along the edges. Its error line carries a
  filled warning glyph, because colour alone is not a mark. And **disabled is a different object,
  not a faded one** — a dashed edge on a sunk ground, the rule already written for buttons and
  applied only there; checkbox, radio and switch were fading to 45% opacity instead.

  `Select` options can carry a `hint`, the quiet second value on the right of a row ("2-3 days",
  "₺49"): under the label it doubles the list's height, and what is being read is still one
  choice.


- **The action family went through the reference one section at a time.** `IconButton` has three
  sizes — 30, 40 and 50 — and **the corner grows with the size** (5 · 7 · 8), because one radius
  across three sizes makes the small one look round and the large one sharp; its base is 3px, not
  2, which had left it sitting at the same height as the mini button beside it. `MiniButton` is
  28px, the reference's own measure.

  Both gained the fills they were missing (`primary`, `soft`, `danger`, `ghost` / `quiet`), and
  **`ghost` is not an object at rest**: no edge, no base, it appears under the pointer. Thirty
  rows each carrying a three-dot button would otherwise be thirty objects.

  `Steps` marks the current step with a **light accent fill** rather than an outline: the done
  ones are filled dark, and an outlined current step read as one of the empty ones ahead of it.
  `Kbd` is layered now (1.5px edge, 2px base) — in this kit depth is the mark of what can be
  pressed, and a shortcut describes something to press.


- **Measured against the reference, component by component.** `Segmented` is 7px around the well
  and 5px around each button (it was 6 and 4), pads 6×14, and keeps **full ink on the unselected
  options**: a faded option read as *disabled*, while what separates them is the seat. It also
  gained the **6px gap between a glyph and its word** that it never had, which is why every
  icon-bearing segment glued the two together.

  `Tabs` underlines the **body** of a tab, not the word: 4px between tabs with 8×12 padding
  inside each, rather than 24px between bare words. `Kpi` follows the reference's two shapes (see
  Added), and `StackedBarChart` draws its slices in **one hue's ramp** instead of the categorical
  palette: stacked slices are parts of ONE measure, and in four different colours each slice
  reads as a measure of its own while the total disappears. Each slice keeps a 1px edge with no
  bottom border, so two slices share one line.

  **`KpiGrid` asks its container, not the screen.** The rule was three media queries plus a count
  of the tiles, and the measured failure was this: on a 1494px screen, inside a 790px column, it
  opened four columns, each tile fell to 190px and the number was clipped. It is now
  `auto-fit` with a 210px floor. `SkeletonKpi`'s bars gained `max-w-full` for the same reason: a
  skeleton that overflows its card is not carrying the geometry it stands in for.

  **The slider's handle sits on its rail.** WebKit aligns the thumb to the TOP of a track with an
  explicit height rather than centring it, so the square hung below the rail by half its height.


- **The default brand is `#1E4FD8`.** The palette generator's reference brand was already this
  blue, but the default theme still shipped the older, greyer `#2069c9` — so a product that picked
  the very colour the kit is built around got a different palette than the kit's own default. The
  accent family moves with it in both themes; in dark the hue shifts to match while every value
  keeps its lightness, because each of those lightness numbers has a written argument beside it.

  The selected-row ground moves with it and this one is worth saying out loud: `#ecedf3` had a
  chroma of 0.008 — all but colourless — so a selected row sat one step lighter than a hovered one
  and the two did not read apart. It is `#dce9fb` now: what separates them is hue, not lightness.
  White ink on the primary fill goes from 5.22:1 to 6.47:1.

### Added

- **`Announcement`, the strip across the top of a page.** The design's `page-band` section is an
  announcement strip; this kit's `PageBand` is the page's own title block (eyebrow, `h1`,
  subtitle, actions). Two different things under one name, so the strip became its own component.
  Two looks, and the difference is a sentence rather than a style: `loud` is the filled accent and
  it LIFTS, because the reader is meant to act on it and in this kit a fill already means action;
  `quiet` is a wash with no base, because a standing condition ("you are in test mode") only asks
  to be read. Its ink is `--color-accent-ink` in both themes rather than the design's light blue:
  `--color-accent-soft` is fixed across themes while `--color-accent` lightens at night, and the
  pair measures 4.03 in light but **1.61** in dark. Hierarchy comes from size and weight instead.

- **`Spinner` gained the two looks the design shows and the kit was missing:** `dots`, three equal
  squares blinking in turn for the side of a line of text, and `square`, a raised box turning on
  its own axis with its shadow, for a wait that owns the view. `bars`, `pixels` and `ring` are
  unchanged, and `bars` stays the default.

- **`Avatar` takes a `status` mark.** A square in the tile's bottom-right corner in the tone's own
  colour, with a ring in the ground behind it. It is the one place colour is allowed on an avatar:
  the tile stays monochrome because identity is text, and this mark is not identity but health.
  No default · a mark on every avatar would be a legend nobody wrote.

- **`Dot` takes a `size`** (`sm` · `base` · `lg`). The large one carries an edge and a base,
  because at 14px a flat square reads as a swatch rather than a status; the small one drops them,
  because at 6px an edge swallows the square.

- **`RichText` takes `hint`**, the quiet mono note at the end of the toolbar saying what the
  editor accepts ("Markdown supported"). The toolbar also moved onto the header strip's ground
  and took the box's own edge weight under it: on the sunk ground it read as a second box inside
  the editor.

- **`TimelineStrip` takes `steps`**, the second shape of the same question. The buckets measure a
  RUN (24 hours, one health each); the steps name the STATIONS (an order's history): icon tiles
  on a line, with the line drawn twice · a quiet one end to end and an accent one up to where it
  stands now. Only the steps that happened are raised, because a base under something that has
  not happened read as if it had.

- **`ThemeToggle variant="segmented"` can offer two.** It demanded all three labels and threw
  otherwise. The three-way stays the recommendation and the reason stands (see `preference`:
  "system" is the absence of a choice, not a third shade), but offering two is a legitimate
  product decision, so the step now follows the label: no `system` label, no `system` step. With
  two the labels are visible; with three only the glyph is, because three words stretch the
  control past any toolbar.

- **`TimelineStrip` takes `className`**, like every other surface in the kit.

- **`Progress` takes two more looks.** `blocks` is a row of cells for a COUNTABLE capacity, where
  the real sentence is "7 of 10" and a smooth bar would claim a precision that does not exist;
  the last filled cell takes the light tone, the one mark that says where we are. `split` is one
  track cut into shares, for a distribution that adds up to a whole, with its legend underneath.
  The caller writes the legend line · the kit formats no percentages, because the sign and its
  place are a locale.

- **`PasswordInput` takes `strength`**, the meter under the field: so many bars lit out of four,
  and a line saying what is still missing. The kit LIGHTS the bars and does not judge the
  password: what counts as strong is a policy, and a policy belongs to the product.

- **`NumberInput` takes `look="quantity"`**, the joined control with the buttons flanking the
  value, for a count that is CLICKED into place. The value there is not an editable field: with
  two buttons doing the whole job, a typed invalid value has nothing to gain. `field` (the text
  field with the stepper on its edge) stays the default, for numbers that are typed.

- **`LogView` takes `filters`**, the level bar over the stream. The kit draws the bar and marks
  the chosen one; which levels exist, what they are called and the filtering itself stay with the
  caller · a log view that filtered its own lines would have to know what a level means.

- **`FileUpload` takes `files`**, the transfer rows under the well: one going up (a bar and a
  percentage), one that arrived (its size, written by the caller · the kit formats no bytes), one
  refused (the row turns critical and carries the reason beside the file name, not under it).
  `labels.hint` adds the quiet line about accepted types, and the well's glyph now sits in a
  raised tile: a bare glyph in the middle of a dashed area sinks into it.

- **`EmptyNote` takes `icon`**, and with it the note collapses to a single line: a card that is
  empty inside an otherwise full screen deserves a sentence, not a picture.

- **`EmptyTile` takes `icon`**, which turns the tile into the grid's empty cell · dashed and
  groundless while it waits, solid and raised under the pointer. The dashed edge says "not
  content yet", the lift says "this is a control".

- **`Label` takes `look="section"`**, the heading over a group of fields: letter-spaced and
  heavier, because it names a region rather than annotating a number.

- **`Select` options take a `label`**, for when the stored value is not the text to show: a locale
  is kept as `tr` and read as "Türkçe".

- **`StatusChip` takes a `look`.** `wash` (the default, unchanged) has no edge, because in a
  table of thirty rows an edge on every chip turns the status column into a column of boxes.
  `outline` carries the tone as a line on the surface, for a chip standing alone. `solid` is the
  tone's plate with its own ink, for a TERMINAL state that ends the row's story ("delivered",
  "returned"); it stands in tension with Law 2, a fill means action, which is exactly why it is
  opt-in and not the default.

- **`Beacon` takes `edged`**, for a mark that sits ON a control: it grows a step (12 → 14) and
  takes the pressed edge, and its fill turns into the tone's wash. A solid square touching a
  button's own edge reads as part of that edge. The beacon's own size also went from 8px to 12px
  · 8 is the measure of a dot beside a line of text, not of a mark that has to be found across a
  screen.

- **`Beacon` takes `look="ping"` and a `state`.** `pulse` (the existing breath) says a STATE: it
  is live, it is streaming. `ping`, a ring expanding out of the mark and fading, says a CALL:
  "there is something new here" · which is what the design attaches to a control's corner. The
  core stays under the ring, otherwise the mark disappears at the faint end of the beat.

- **`Badge` takes `dot`**, a mark with no number, for when the answer is "there is something new"
  rather than "there are four". `count` is now optional, since a dot has none to show.

- **`Separator` takes `look` and `label`.** `plain` is the quiet rule, `dashed` a provisional one,
  `strong` the one that separates two SECTIONS and therefore takes the edge colour rather than the
  line colour, and `label` carries a word in the middle ("or"), which turns the separator into a
  choice rather than a break.

- **`SectionHead` takes `size="sub"`**, the row that opens a sub-section INSIDE a card: no band
  behind it, a rule under it, and `meta` becomes a count chip beside the title instead of a label.

- **`Button` takes `size="lg"`** (52px, one step up the shadow ladder at 5px). A screen's single
  action: an empty state's call, a wizard's next.

- **`Alert` takes `onDismiss` and `dismissLabel`.** Without them an alert is a standing condition
  the reader cannot clear; with them, a message they have finished with. The control is a ghost
  icon button: inside a washed box, a second bordered object competes with the message itself.

- **A tone now carries `markInk`, the glyph that reads ON its `mark`** · and it is not one colour
  for all six. See Fixed below for what it repairs.

### Fixed

- **`LineChart`'s hover marker rendered as a pill, and the chart showed a stray tooltip.** Two
  costs of the same decision: the `viewBox` is 100×100 with `preserveAspectRatio="none"` so that
  coordinates behave like percentages. A `<rect width={14} height={14}>` drawn inside it measured
  **252 × 22 px** on a 1800×160 chart, and the comment beside it claimed `vectorEffect` kept the
  size — that property preserves stroke width, not geometry. The marker now sits in the HTML layer
  (`.tamga-chart-mark`), positioned in percentages and sized in pixels, so it is square at every
  width. Separately, the accessible name was given with `<title>`, which browsers render as a
  native tooltip: hovering the chart popped a box reading "Kayıt: 14" — with the wrong number, as
  the title always names the LAST value rather than the hovered one. The name is now `aria-label`:
  same sentence for a screen reader, no bubble on screen.

- **Eight tokens were declared but never published.** `--font-sans`, `--font-display`,
  `--font-mono`, `--tracking-label` and four radii (`-sm`, `-md`, `-xl`, `-full`) all exist in
  `theme.css`, all are used, and all generate Tailwind utilities — and none of them appeared in the
  token reference. They sit in the bridge `@theme inline` block, which the extractor read only for
  `var(--x)` aliases. The typography page describes three faces; the token page's typography group
  did not carry their names. For a consumer, a name that is not published does not exist. A gate
  now diffs every declaration in a `:root`/`@theme` body against the published list.

- **Twenty-two tokens carried no rationale at all**, and the cause was a pattern rather than
  twenty-two oversights: one comment sits above a RUN of declarations (the six `--color-*-inverse`,
  `--chart-2..5`, `--mark-dot` and its radius) and the parser correctly binds it to the first name
  only. All twenty-two are written; the extractor now stops on a token with no rationale. Every one
  of the 145 tokens carries a bilingual one.

- **Three token comments described a kit that no longer exists**, and they are published: the
  token page is generated from them. `--font-display` said "headings are the same face, heavier:
  never a separate display cut" while the token itself reads `"Red Hat Display"`, two lines under
  a `--font-sans` comment that already describes three faces. `--font-mono` said "Mono is the same
  face too" and went on to explain that Red Hat Mono was *not* taken "because it would make the kit
  a two-family system" — the token reads `"JetBrains Mono"` and the kit has been a three-family
  system since the port. `--radius-full` said "avatars and the live dot ONLY"; it is read by the
  score ring alone, and fully round lives in three places (`check:yuvarlak` says so in its own
  output). All three rewritten to what the code does.

- **`Segmented` was two pixels taller than every control beside it.** `--control` is 40px and the
  input, the button, the select and the icon button all read it; the segment took its height from
  padding and measured 42. On a toolbar the input and the button lined up and the segment did not,
  which is exactly what the measure page promises cannot happen. A fixed height had been tried once
  and rolled back for a good reason: it was given to the button INSIDE the well, and the well then
  added its own 3px padding and 1px edge on top of it and came out at 46. The height belongs to the
  well itself, with the items stretching into it. `-sm` and the icon segment take `height: auto` and
  are unchanged, because standing under 40px on a toolbar is their whole reason to exist. Found by
  the measure page's own rhythm demo; held by a new gate, `check:olcu-hizasi`, which requires all
  eight base controls to declare `height: var(--control)`.

- **Every number input turned into an 18px chip.** A class rename landed on a name that was
  already taken: the tab counter became `.tamga-sayi`, which is what `NumberInput` uses for the
  numeral's FACE. Two definitions of the same class, the later one winning, and the field
  inherited the chip's box · 18px tall, chip padding, chip background. Nothing errored: both
  names were defined, so the class-name gate passed too. The counter is `.tamga-sayac` now, and
  `check-css` gained the question that catches this shape: is this class defined twice in the
  same context? It immediately found four more, all real:

  - `.tamga-collapsible-head` and `-body` existed twice (a row-shaped port and a card-shaped one)
    and the later pair had quietly dropped the header's `font-weight` and its background
    transition. The design writes 700; the accordion had been shipping unbolded headers.
  - `.tamga-sheet-end` was split across two blocks (mirrored shadow in one, animation in the
    other); they are one block now.
  - `.tamga-eyebrow` was pasted twice, identically.
  - the docs' `.docs-search-btn` carried its radius and height in a second block below itself.

- **The popover was drawn as a card, and it showed.** It carried a header strip with its own
  background, a rule under it, a second rule over the footer and a boxed close button · three
  horizontal lines inside a 288px panel, so the eye read the box instead of what was in it. The
  design's popover is one padded surface: a bold title line, the content, a right-aligned footer,
  and nothing else. `closeLabel` is optional now and draws a quiet corner control when given:
  a popover is dismissed with Escape or by clicking away, and the thing that must be closed
  deliberately is a dialog.

- **`SecretField` hid its actions inside the field.** Two mini buttons crammed against the right
  edge made copying look like trim. A secret is read, not typed: the value now sits in a sunk
  read-only plate with a key glyph, and reveal and copy are two real buttons beside it, the copy
  one carrying its label as the design writes it.

- **A selected radio card only changed its edge.** The design fills it with the soft accent, and
  the note that said "selection by edge, not by the accent colour" was about a different token
  (`--color-accent-line`, which collapses into `--color-edge` on a light brand).
  `--color-accent-soft` is fixed in both themes and carries its own ink, so the wash joins the
  edge and the lift rather than replacing them. `look="card"` also stopped forcing a three-column
  grid: three priced shipping options read down a column, and the container's layout is the
  caller's decision.

- **A rising sparkline was grey.** `positive` fell into the muted stroke, which contradicted the
  decision already written on the `Delta` chip: good news is the accent, not green, because a
  rising trend is a movement rather than a state. Neutral stays quiet; a trend line only takes a
  colour when it is carrying good or bad news.

- **The number input's operator glyphs were duotone.** `Icon`'s default weight is duotone, which
  is right for an icon that carries the brand and wrong for a control's operator: duotone draws
  its second layer quieter, and a single-stroke mark like a plus or a minus turns into a faded
  sketch of itself. The plus, the minus and the two stepper carets are `bold` now, which is what
  the design writes for them.

- **`LocaleSwitcher` drew the browser's `<select>`, not the kit's.** Above two locales it fell
  back to a native control: the OS arrow, the OS dropdown, and none of the kit's rules. It uses
  the kit's `Select` now.

- **The separator family was drawn one step off, because the design's token names collide with
  this kit's.** In the design's own file `--edge` is `#0A1F3D`, a near-black navy · this kit's
  `--color-edge` is `#c3c9d3`, a pale grey, and the near-black one is `--color-edge-strong`. Its
  `--line` is our `--color-edge`, and its `--dash` is our `--color-line`. Read as if the names
  matched, the ladder came out flat: the section rule was drawn in pale grey where the design
  asks for near-black. The four rules now sit where they belong · plain `--color-div`, dashed
  `--color-line`, strong `--color-edge-strong` at 1.5px, vertical `--color-edge`. The same
  mis-mapping had reached three more places from this cycle, all corrected: the announcement
  strip's border and base, the spinner's `square`, and the large `Dot`.

- **The announcement strip's title was navy on blue.** The kit's base layer paints every
  `strong` with `--color-ink`, which is right for page copy and wrong on a surface carrying its
  own ink: the title measured about 1.9 against the accent ground while the line under it was
  readable. Inside the strip, `strong` inherits now (6.47).

- **The `+N` tile in an `AvatarStack` was raised in a different colour from the faces beside
  it.** The avatar tiles lift with `--color-edge-strong`; the summary tile had a pale base, so
  it read as being made of another material.

- **In dark, the glyph inside an alert's tile sank into its own plate.** The tile is painted in
  the tone's `mark`, which is a fixed plate in both themes, and the glyph was `--color-page`,
  which is not: near-white in light, near-black at night. On critical it measured **2.96**, under
  the 3.0 floor that applies to a graphical object. One ink cannot fix six plates, so each tone
  now carries its own, picked by measurement: critical takes white (5.89), `info` follows the page
  (7.38 / 8.61) because its plate is the one that flips too, and the rest take the fixed dark
  plate (4.27-7.59). `check-token-contrast` measures these six pairs at the 3.0 glyph floor, and
  it reads the pairs out of `tone.ts` rather than from a list of its own: written by hand, the
  gate passed a deliberate sabotage of the mapping, because what it measured was its own list.

- **The `+N` tile in an `AvatarStack` now carries its own base.** It is the one tile in the row
  that is not a person but a summary, and the offset is what steps it out of the row of faces.

- **The dropdown menu's group heading was a row-sized label.** It is the name of a GROUP, not of a
  row: caption size, heavy, letter-spaced, with the tighter padding the design gives it (10px
  rather than 16px, which had left a second misalignment down the menu's left edge). Casing stays
  with the caller · the kit does not touch text, and `text-transform` would hand Turkish's i/İ to
  the browser.

### Breaking

- **`ScoreMatrix` is a density grid now, not a waffle of one score.** The design's 03.15 is a
  two-dimensional heatmap · rows for one band (a weekday), columns for the other (an hour), and a
  cell's colour reporting the amount at their crossing. What stood under that name here was a
  10×10 waffle rendering a single 0-100 score, which `ScoreRing` and `ScoreMeter` already answer.
  The new props are `rows`, `columns`, `levels`, `legend` and `cellTitle`; colour comes from the
  brand ramp rather than the tone family, because a cell reports an AMOUNT and not a state, and
  the step is computed against the grid's own maximum · an absolute threshold would make one grid
  impossible to compare with another week's numbers.

- **`.tamga-tab-sayi` is now `.tamga-sayac`.** The count chip stopped belonging to tabs when
  `SectionHead size="sub"` started carrying one beside its title, and a class named after tabs in
  that position would have made the name a lie. It was briefly `.tamga-sayi`, which was already
  taken by the numeral face `NumberInput` wears · see the Fixed entry. The `count` prop on `Tabs`
  is unchanged; only a consumer styling the kit's internals by class name is affected.

- **In dark, a sunk surface was the page.** `--color-sunk` is the ground for content that sits *in*
  the page rather than on it: filter bars, table headers, code blocks, sub-panels, skeleton
  placeholders. In light it sits ΔL* 7.3 under the page; in dark it sat **1.1** under it, which is
  to say nowhere. The skeleton made it visible: its base is `--color-sunk` and the bar you actually
  see is a breathing `::after` (opacity 0.78 ↔ 0.06), so at the bottom of every breath only the
  base was left, and against the page it measured a ratio of 1.02. The placeholder vanished and
  came back, once per breath. Dark cannot fix this by going lighter (`--color-band` carries that
  measurement: lightening dark surfaces collapsed the card to ΔL* 0.4), so sunk went down instead,
  `#0e1829` → `#020c21`, ΔL* 5.8 under the page. The number is the ramp's own compression, not a
  taste call: dark holds every other surface pair at ~0.8 of light's separation, and 7.3 × 0.79 =
  5.8. Chroma does not drop with it (14.5 against the page's 13.7, same 280° hue).

- **`makePalette` generated the same invisible surface for every brand.** The kit's dark half is
  written by hand and the generator runs its own ladder, and the generated ladder had the same
  missing rung: dark `sunk` sat at `l 0.209`, ΔL* 1.0 under the `l 0.218` page it is supposed to sit
  under, and it is now `l 0.168`.
  A product generating a palette from its own brand colour inherited the invisible filter bar. The
  rung now sits below the rail, which is also its order in light, and measures ΔL* 4.9–5.2 across
  the ten brand colours the suite covers.

- **Two gates were silent on it, so both now measure it.** Surface separation was only ever asked
  of `--color-edge` and `--color-line` (`check-token-contrast`) and of `navHoverBg · rail`
  (`measurePalette`). Both now carry the sunk/page and sunk/shell pairs against the same 2.0 floor
  that already stood for "a second ground on top of a ground must read as changed". Verified by
  putting the old value back: the gate names ΔL* 1.1 and fails.

- **The danger icon button's glyph nearly disappeared in dark.** `.tamga-icon-btn-danger` fills with
  `--color-critical-mark`, which is the same wine red in both themes, and painted its glyph with
  `--color-page`, which is not: near-white in light (5.26) and near-black in dark (2.96). The design
  writes this pair as fixed (`#fff` on `#9E2A3A`), and the ink is now `--color-inverse-ink`, white in
  both themes, 5.89 on the plate either way. The pair is measured by `check-token-contrast` now.

- **A new gate measures the whole class: a theme-fixed ground under a theme-flipping ink.**
  `check-tema-cifti` resolves every kit rule that sets both `background` and `color` down to hex in
  both themes, and fails when exactly one side is theme-fixed and either theme falls under AA. This
  same shape had already been fixed three times by hand this cycle (the selection bar, the marked
  link at 1.36, and the danger icon button), each time without anything to stop the fourth. It
  measures 12 mixed pairs today. What it deliberately does not see: a ground and an ink split across
  two rules, which needs real CSS resolution rather than a per-rule read.

- **A comment claimed `--color-hover` was sunk's value; it is not, in either theme.** Light hover
  is `#f7f5ef` and sunk `#e1ddd3`; dark hover is `#1a2842` and sunk `#020c21`. The two had drifted
  apart long before, on both sides, and the comment was still asserting the old identity.

- **A tall `Dialog` cut off its own close button.** The panel had no bound: content taller than the
  window made a `wide` dialog 1014px tall inside a 783px viewport, and since the shell centres its
  child, 116px was clipped off the top and 116px off the bottom. The title and the close control
  live in that top 116px. Escape still worked; the mouse had no way out. The body scroll that
  fixes this had been written for `size="full"` only, and the other three sizes overflowed in
  silence. The panel is now bounded and the body scrolls, with the header and footer held in
  place.

- **Nine things the port had skipped.** Comparing `kit.css` class by class against the last commit
  turned up 58 untouched classes; most are layout utilities and the mascot's furniture and were
  right to leave alone, but nine were still speaking the old language:

  - `Button size="sm"` carried the full-size 4px layer and 4px press, so the only thing "small"
    about it was its width. It now steps down to 3px, like every other reduced control.
  - A selected `RadioGroup` card or chip was marked with the accent colour and a 2px layer, while
    every other selection in the kit — swatch, theme card, rail row, segment — is marked with the
    edge and a lift. On a light brand the accent and the edge fall close enough together that the
    selection disappeared.
  - An invalid field sat at 2px while focus moved to 3px, so clicking into a field with an error
    RAISED it.
  - `Progress` had a 1px edge and a flat ink fill. It takes the 1.5px edge, a 3px layer, and a
    striped accent fill with a hard right edge, so where the fill stops is exact at any brand.
  - `Slider` was round — both the track and the thumb — against the kit's own written rule that
    only the radio, the score ring and the ring spinner are circles. The thumb is now a 24px
    square that can actually be grabbed.
  - `RichText`'s toolbar buttons were flat, and an active one filled with plain ink, a colour the
    kit uses nowhere else. They are boxed now, and an active one fills with the accent and sits on
    its own base.
  - `ImageField` was a thin 1px box; empty, it was a dashed rectangle with a normal surface
    inside, so a filled field and an empty one read at the same weight. Empty is now hatched, the
    same hatch the custom colour swatch uses.
  - `LogoTile` took the 1.5px edge and the button radius.
  - `Surface` drew its edge with `--color-edge`, the colour reserved for an object's own rule, so
    the screen's ground read as heavily as the cards standing on it. It uses `--color-line`.

### Added

- **A gate for the roundness rule** (`check:yuvarlak`). The rule was written down in two places
  and enforced nowhere, which is why the slider stayed round for months without anyone noticing —
  on its own it does not look wrong; what is wrong is that it disagrees with everything beside it.
  The gate reads `kit.css` and allows `border-radius: 50%` only on a named list of selectors, so
  adding a circle is now a decision someone has to write down.

### Breaking

- **`LogView` takes a `labels` object.** New required prop: `labels={{ newLines: (n) => … }}`,
  the text of the button described under Added. It is required rather than optional because a kit
  that silently drops a behaviour when a string is missing is worse than one that asks for the
  string.

- **Two names went back to the design's vocabulary.** The kit had invented both, and in the
  design each name belongs to a different component:

  `Rise` was a block sliding in from below; in the design it is **the number climbing from zero
  to its target**. The animation is now **`Reveal`** (class `.tamga-rise` → `.tamga-reveal`), and
  `Rise` is the change indicator. Our own docs page for it opened with "the name may be
  misleading", which was the warning.

  `SaysBubble` was the bubble over an empty state's drawing; in the design it is **the
  conversation bubble** (a customer message, our reply, an assistant's suggestion). The drawing's
  bubble is now **`ArtSays`**, which `EmptyState` uses internally, and `SaysBubble` is the chat
  bubble. With both under one name, whoever looked for an empty state and whoever looked for a
  chat found the wrong component.

- **`Delta` is a chip, not an inline percentage.** A trend glyph plus the value, filled with the
  tone's own ink: beside a KPI the old outline version was too quiet to read. Good news takes the
  **accent**, not green — green is a STATE colour ("resolved") while a rising revenue is a
  movement — bad news stays red, and a flat change has no colour at all. `mono` is gone; the chip
  sets its own numerals.

- **`ScheduleInput` is now a weekly schedule, not an interval `<select>`.** It used to take
  `value` (minutes), `onChange` and an `options` list and render a single `<select>` — a native
  select wearing a component name, which is the one thing a kit should not ship. It now takes
  `days` (0 Sunday to 6 Saturday), `from`, `to`, their change handlers, a `labels` object and a
  ready `summary` sentence, and it draws seven day buttons over an hour range.

  Migration: for choosing an interval use `Select` with your own options — that is literally what
  the old component was. For a weekly window, the new props are on the
  [Schedule input](https://tamga.org.tr/docs/schedule-input) page; the summary line is the
  caller's sentence, because "Every weekday" and "Her hafta içi" are not a translation the kit can
  make.

- **`FileUpload.onReorder` takes a target index, not a direction.** `(id, -1 | 1)` became
  `(id, target)`. The first signature was enough for the two arrow buttons; dragging broke it,
  because moving the fourth image to the front is not a step. Two callbacks would have told one
  story from two places, so there is one meaning left: *put this item at this index*.

  Migration: the arrow buttons now send `i - 1` / `i + 1`, so a handler that swapped two entries
  keeps working for them — but for dragging it must **splice**, not swap, or making the fourth
  image the cover flings the cover into fourth place. The docs page shows the splice form.

- **`SettingsPanel` no longer takes `accent`.** The brand-coloured left edge existed for one
  screen — the appearance screen — and that screen stopped stacking panels (see below), so the
  prop had no caller left and its documented reason no longer described anything. Drop the prop;
  nothing replaces it. A product that wants a coloured edge on a panel is describing a different
  component, not a variant of this one.

- **`AppearanceLabels.brand` gained four required strings** — `customName`, `preview`,
  `previewAction` and `lightNote` — because the brand row now names the chosen colour, prints its
  hex, and shows a sample of it. The kit does not write text, so all four come from the caller.

### Added

- **`Accordion.look`** — `cards` (the default) or `list`. The design draws both: sections as
  their own raised cards, and the quiet stack inside one surface. The container decides, because
  a prop on every section is the same decision taken again at every call site.

- **`ScrollX.controls` and `ScrollX.title`** — the two arrow buttons at the head of a strip, as
  the design draws them. A click moves the strip by **one visible width** (90% of it, so the card
  at the edge is not swallowed), never by "one card": that would need the strip to know what a
  card is. The arrows do not replace the keyboard; the strip is focusable and scrolls with the
  arrow keys already.

- **`Collapsible.icon`** — the glyph at the head of the row, in the accent: it says what kind of
  section this is before the words are read.

- **`EmptyState` has a fourth layout, `plain`** — the dashed card the design draws: an icon tile
  (`icon`, `tone`), a line and the first step, with no mascot. `art` is optional now. It is the
  shape most screens need, and the dashed edge is the kit's own word for "not real content yet":
  filled, the same place holds a solid card.

- **`Tag`** — the label badge: BETA, NEW, PRO. A sibling of `Badge` but not the same thing: a
  counter carries a QUANTITY and disappears once read, a tag carries a STATE and stays. Three
  looks — `dashed` for what is not real yet (a dashed edge says exactly that everywhere in the
  kit), `solid` for what is new right now, `outline` for the quiet standing fact. The product
  writes the word, the kit gives the shape.

- **`Spinner.look`** — `bars` (the default, the inline one that fits inside a control), `pixels`
  (the mark's own 3×3 grid, pulsing along the diagonal, for a panel waiting on its first data)
  and `ring` (the familiar circle, for a whole screen). The kit had only the bars, so every
  screen-level wait borrowed a control-sized spinner.

- **`Descriptions.split`** — breaks the list into as many columns as fit (280px floor). At page
  width a six-row list was leaving the right half empty; split, it reads as two short lists. Each
  column keeps its own label column, so the values still line up.

- **`Code.filename`** — the name on the strip. Without it the strip still stands and holds the
  copy button.

- **`InputGroup`** — the prefix/suffix box: a currency, a domain, a unit, a search glyph, a
  shortcut key. The class for it had been in the kit with no component to draw it. A prefix is a
  **piece**, not a string, so an `<Icon />` fits where "₺" fits, and the focus ring wraps the
  whole box: one object, not two.

- **`Field.required`, `Field.note`, `Field.info` and `Field.count`.** The asterisk is a glyph
  rather than a word (a word is a translation, and the kit makes none), `note` is the caller's
  quiet word at the far end of the label row, `info` a mark that sits outside the `<label>` so
  clicking it does not focus the control, and `count` the character counter under the control —
  on the FIELD, because a textarea knows how many characters it holds, not how many it is
  allowed.

- **`Button.variant="soft"`** — a step between primary and secondary, filled in the accent's
  light tone. The action that says "you can also do this" without competing with the page's one
  filled button.

- **`Link.look`** — `inline` (the default), `standalone` with an arrow that steps forward under
  the pointer, `quiet` for a footer where twenty links cannot all be in the accent, and `marked`
  for the one address in a paragraph that has to be found.

- **`Kbd.inline`** — the quieter key for a row in a shortcut list, where twenty layered boxes
  would turn the list into a keypad.

- **`Card` can lead somewhere.** `href` (with `linkComponent`) or `onClick` makes the card a real
  `<a>` or `<button>` and gives it the raised physics: it lifts under the pointer and presses
  flat. A product card was being hand-rolled as a clickable `div`, which is invisible to the
  keyboard and silent to a screen reader.

- **`SaysBubble`** — the conversation bubble, in three sides: `them` (left, quiet surface),
  `me` (right, accent fill with a base) and `assistant` (a dashed, washed suggestion). The corner
  facing the speaker is the small one; there is no tail, because a tail means a rotated square
  and the kit has none. Time and delivery state live inside the bubble, where they do not break
  the rhythm of a long thread.

- **`Kpi.look`** — `tile` (the default) is what a KPI grid is built from: a 40px icon box on the
  left, the label over the number. `detail` is the taller card for a number that carries a curve
  beside it and a change under it, the delta now drawn as a chip rather than an inline
  percentage. The two are separate because of room: a card that fits a curve is taller than a
  tile four of which stand side by side.

- **`Tabs.look="folder"` and `TabPanel`.** The design has two kinds of tab and the kit had one.
  The line separates views of the page; the folder separates sections of one surface, sitting ON
  its panel — the active tab's bottom edge is transparent and the tab drops by the panel's 1.5px
  border, so the two read as one body.

- **`Segmented.size="sm"`** — the strip that lives in a toolbar. At the base size a segment
  stands taller than the row it sits in; the docs example box's bar was 55px against the
  reference's 45.

- **`yiginRenk` / `yiginRenkleri`** (from `tamga-ui/tone`) — the brand ramp a stacked chart's
  slices step through, beside `seriRenk` for separate measures. Two names, so the two cases
  cannot be confused.

- **`RailLink.badge`** (with `badgeLabel`) — how many things wait behind an entry. On a wide rail
  it is the number; on a narrow one only a square, because a two-digit number sits on top of the
  icon in a 40px box, and an unreadable number says no more than "there is something". The number
  itself goes to the screen reader through `badgeLabel`, which is why that one is required.

- **`TabItem.count`** — the mono chip beside a tab's label: how many rows are in that tab. Mono,
  because it is a number compared with the other tabs' numbers rather than a word to be read.

- **`Tooltip.bind`** — turns off the `aria-describedby` tie. On for everything except a trigger
  whose accessible name is already the tooltip's text: a narrow rail item is labelled
  "Orders" and its tip says "Orders", and a screen reader read it twice.

- **`Toast` has its own lifetime.** "It comes, and it goes" was the component's one sentence and
  the going was left to the caller: every product wrote its own `setTimeout`, and the ones that
  did not left notifications on screen. It is **5 seconds now, 8 with an `action`** ("Undo" has
  to be readable *and* reachable before it leaves), `duration={0}` keeps it until dismissed, and
  **the timer pauses while the pointer or keyboard focus is on it** — the hand reaching for
  "Undo" travels straight across the toast.

  `role` follows the tone: **`alert` only for `danger`**, because an assertive region cuts into
  the sentence a screen reader is reading. Everything else stays `status`.

- **`MenuItem.shortcut`** — the keyboard shortcut drawn on the right of a menu row as a `Kbd`. It
  does not bind the key: a menu that binds a global shortcut would fight the page that already
  has one.

- **`LogView` says how many lines you missed.** Following only when you are already at the bottom
  is the right behaviour, but it has a price: a line that arrives while you are reading further up
  is out of sight, and without a word about it the stream looks stopped. A "↓ 12 new lines" button
  now appears in that case and takes you down; the counter resets the moment you reach the bottom.

- **`LogLine.level`** — the level badge's word ("INFO", "WARN", "UYARI"). The kit draws the badge
  and colours it from `tone`; the product writes the word, because a log level is not a string the
  kit can translate.

- **`FileUpload` reorders by dragging** as well as with the arrow buttons. The dragged card fades
  to 0.45 (lower reads as deleted) and the card it would land on takes the accent edge — the kit's
  existing "this is the target" mark, not a new line invented for it. The arrows stay, because
  drag-and-drop does not exist for someone on a keyboard.

- **`Checkbox.indeterminate`** — renders `aria-checked="mixed"` with a minus glyph. A parent row
  whose children are partly selected had to be drawn either checked or unchecked, and both were
  false; `TreeSelect` and any "select all" header need this third state.

- **`NumberInput.locale`** — which thousands separator and decimal mark to draw. It was hardcoded
  to the browser's locale, so a Turkish panel viewed in an English browser showed `1,500.50` in a
  form that submits `1.500,50`.

- **`RailCards`.** The sidebar width was a three-word `Segmented`: "Always narrow · Always wide ·
  Let the user choose". On the same screen the theme was asked with pictures and this with words,
  and how much room a menu takes is something you see rather than read. Three miniatures now, and
  the third carries a collapse button at the foot of the rail because that is where it sits in the
  panel.

- **`ThemeCards` takes a one-line note under each name** (`lightNote`, `darkNote`, `systemNote`),
  and "System" is drawn as one panel cut on a diagonal rather than two rectangles side by side.
  Two rectangles say "there are two themes"; the diagonal says "same panel, the device decides".

- **`PageBand` takes an `eyebrow`.** A short line above the title, for the question a title leaves
  open — whether a setting applies to everyone or only to the person reading it.

### Changed

- **The appearance screen is one card with dashed rows, not five stacked cards.** Five cards said
  "a new subject starts here" five times, for five parts of one subject; and with the title above
  the control in each, the eye zigzagged down the screen. Titles now sit in one column and
  controls in another, split by the card's own width rather than the viewport, so the breakpoint
  is right whether the rail is open or shut.

- **A colour swatch is the colour.** It was a white box holding a 20px square, with the check mark
  deliberately left out because "its contrast changes with the chosen colour and disappears on a
  light one". The reason was right and the remedy was not: the ink is now taken from the palette
  that colour generates, so a light swatch gets dark ink and a dark one white. The square is 44px
  and the check sits inside it.

  The swatch no longer lifts on hover or sits on press. Its resting height is two different
  numbers (0 unselected, 4 selected) and one hover ladder cannot serve both — tuned for the
  unselected box, hover LOWERED the selected one. Law 1 · E and F caught it.

## 0.4.4

### Added

- **A fifth tone: `info`.** The scale answered one question — is something wrong — in four ways:
  solved, heading there, broken, or not reporting. A product that only wants to SAY something had
  to choose between a grey that reads as "not reporting" and a green that reads as "solved". Both
  are a lie about the same sentence. `info` is blue because blue is the one hue this palette has
  never attached urgency to, and like the other three it never decorates. It never pulses either:
  "worth knowing" and "look here, now" are not the same sentence, and the pulse stays with the
  second.

  New tokens: `--color-info` and `--color-info-bg`, in both themes. The dark value leans toward
  cyan rather than the brand's navy, for the same reason the other statuses stay warm there — a
  navy signal sinks into a navy ground.

### Changed

- **`Toast` takes its tone as the surface, not as a mark on its edge.** It was a white box with a
  ten-pixel square in the corner. A toast is on screen for about two seconds, and what gets read in
  that time is the colour of the box, not a square beside the text. The wash was already designed
  for this — `--color-*-bg` is documented as "a tint, not a fill" — so the tone now paints the
  surface and the square stays as the secondary cue. `neutral` is unchanged and stays uncoloured,
  which is its whole job on this scale.

  The edge and the drop stay neutral on purpose: painting them in the tone as well put a hard frame
  around a soft wash, and the box ended up shouting in the exact way the wash exists to prevent.

  **This changes how every existing toast looks without any change at the call site.** Nothing to
  migrate; if a product wants the old white box, `tone="neutral"` is it.

### Fixed

- **A toast no longer overflows a container narrower than itself.** Its width was fixed at 320px,
  so a narrow parent got a toast hanging out of it, and a 360px phone got one hanging off the
  screen (320 plus two 24px gutters does not fit). The measurement moved to `ToastViewport`, which
  is the thing that knows how much room there is: the column is 20rem and shrinks by the gutters
  when the screen is narrower.

- **The contrast gate now measures a status colour on its own wash.** It only ever checked
  `critical` against the shell, so the pair that a chip, a row and a toast actually put on screen
  was never measured — and a new tone could be added without anything looking. The five pairs are
  gated now, including `silent` on `chart-fill`, which had already failed once and was recorded in
  a comment rather than a gate.

## 0.4.3

### Fixed

- **`AppShell` marks the most specific entry, not every entry above it.** The rule was "an entry
  owns its subtree, except `/`, which matches exactly". That holds only when the root really is
  `/`. In a panel mounted under `/panel`, the root entry swallowed every route beneath it: on an
  order's detail page both "Dashboard" and "Orders" showed as current. The wrong answer was the
  sneaky kind, because the right entry was lit too, so nothing looked missing.

  Which path is the root is the product's knowledge, not the library's, so this did not become a
  new prop. The rule was generalised instead: of the entries containing the path, the longest one
  wins. `/` is now an instance of that rule rather than an exception to it, and the special case is
  gone.



### Added

- **Every list-taking component now passes per-item attributes.** Anything an item object carries
  beyond its known fields lands on that item's own element: `Tabs`, `Combobox`, `MultiSelect`,
  `ColorSwatches`, `FileUpload`, `Descriptions`, `ScheduleInput`. Three components already did;
  these seven did not.

  This is not a convenience. Without the hook a caller leaves the component and hand-writes the
  class, and leaves the role, the keyboard and the wrapper behind with it. The asymmetry was found
  three separate times and cost three separate releases, each time because the fix was applied to
  the one component that hurt rather than to the family. A gate now asks the question when a new
  list-taking component is added.

  The three chart series are exempt with a reason: their items are drawn marks rather than elements,
  and those props already carry data arrays, where a free-form key would be ambiguous.

### Fixed

- **`Descriptions` put the caller's `data-*` on every row instead of on the list.** The spread sat
  inside the item loop, so one hook became N copies and the `<dl>` itself carried none. The gate that
  checks a component accepts `data-*` had passed it, because that gate asks whether the attribute is
  accepted, not where it lands.

- **`AppShell`'s content surface is positioned.** It scrolls, and it was not `relative`, so any
  absolutely positioned element inside it — `sr-only` text is exactly that — looked for its
  containing block on `html`, landed in document coordinates and stretched the document. The page
  itself then scrolled despite `h-dvh overflow-hidden`, leaving an empty band under the body.

  A consumer hit this twice and found it by eye both times; in neither case was the first suspect
  the right one, because at rest nothing looks wrong. Positioning the surface closes the whole class:
  an escaping element can now travel no further than the surface it lives in.



Two gaps that products had been paying for, both found by a gate that asks a product not to
hand-write a kit class. Each one had pushed a caller off the component entirely.

### Added

- **An accessibility invariant suite.** Twenty-three renders, three invariants: every interactive
  element has an accessible name, no `aria-hidden` subtree hides something focusable, and role pairs
  are complete (`radio` inside `radiogroup`, `tab` inside `tablist`, `option` inside `listbox`).

  This is not an axe sweep and does not claim to be. The previous sweep ran over a consuming
  product's stories and disappeared with them, which was the wrong home for it: a promise the
  library makes has to be measured in the library. What is not covered is written at the top of the
  file — contrast (a separate gate already measures it), focus order, live-region behaviour, and any
  component the suite does not render.

- **`RadioGroup` options carry their own attributes.** Anything beyond `value` and `label` lands on
  that option's button. The sibling components for picking one of several things had carried
  per-option hooks since 0.3.1 and 0.4.0; this one had not, so a caller who needed to point at a
  single choice left the component behind and hand-wrote the class, which meant leaving the role and
  the keyboard behind with it. The kit's own attributes are written after the caller's, so a hook
  cannot overwrite `aria-checked`.

- **`AppShell` draws section headings.** `NavEntry` takes an optional `section`; the rail groups
  consecutive entries by it and draws a heading when the group changes. Wide rails only: in a 40px
  box a heading does not read, and there grouping is carried by spacing.

  A panel whose menu is split into seven named groups could not express that, so it drew its own
  rail and left behind everything the template brings. The field is flat rather than a nested list
  of groups, for two reasons: nesting would have been a breaking change, and a nested shape makes an
  empty group possible. Here a heading exists only if an entry has one.



**A step now has an identity of its own.** `Steps` took a plain `readonly string[]`, so a step was
nothing but its translated label. Two consequences followed, and both were silent.

The React key was the label. Change the language and every step becomes, to React, a different
element: the old node is torn down and a new one built in its place. Nothing looks wrong, but
anything holding on to that node goes with it. Two steps sharing a label collided the same way.

And there was no way to reach a single step. A caller who needed to point at one, to test it or to
style it, had nothing to point with; the only thing in the DOM that told steps apart was the
translated text, which is the one thing that changes underneath a test. The sibling component for
picking one of several options had carried per-option hooks since 0.3.1. The step strip had not,
and a gate exemption recorded that gap as though it were a decision.

### Breaking

- **`Steps.steps`** is now `readonly Step[]` instead of `readonly string[]`, where
  `Step = { key: string; label: string } & Record<string, unknown>`. Anything beyond `key` and
  `label` lands on that step's `<li>`.

  ```diff
  - <Steps steps={["Details", "Connection", "Done"]} current={1} />
  + <Steps
  +   steps={[
  +     { key: "details", label: "Details" },
  +     { key: "connection", label: "Connection" },
  +     { key: "done", label: "Done" },
  +   ]}
  +   current={1}
  + />
  ```

  The key is an identifier, so it is not translated; the label is. A caller that already had keys
  for its steps passes them straight through.

- **`WizardStep` is now an alias of `Step`.** It was a second declaration of the same shape, and
  the template flattened it to labels before drawing the strip, which is exactly where the identity
  was being dropped. Code that already builds `{ key, label }` objects needs no change.

### Added

- **`RadioGroup.look`** — `list` (default), `chip` or `card`. Only the shell changes: the role, the
  mark, the keyboard behaviour and `aria-checked` are identical in all three, and the selected shell
  takes an outline and a hard offset rather than a fill.

  The card shape was missing, so a product that wanted "one of N, drawn as cards" built it from a
  stack of bare buttons. The picture came out right and the meaning did not: a screen reader
  announced three separate buttons instead of one choice among three. Rebuilding the role and the
  keyboard at every call site is work, and it is done incompletely every time.

  A second line goes inside `label`, which is already a `ReactNode`. There is no separate `hint`
  field, because a prop that means something in only one shell is a lie told to everyone reading the
  props table.

- **`PasswordInput.invalid`** — the sibling text field had it, this one did not, so a caller marking
  a wrong password had to write the kit's class by hand. The class is only half of it: the hand-written
  route never carried `aria-invalid`, so the error was visible and never announced.

### Fixed

- The step strip no longer remounts its list items when labels change.

- **`PasswordInput` now reads the kit's own class table** instead of writing `tamga-input` by hand.
  A rule added to the table reached every text field except this one, which is the same defect the
  library asks its consumers not to introduce.

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
