/**
 * The kit's public surface.
 *
 * Everything a consumer can import lives here. A component that is not exported
 * from this file is an implementation detail and may change without a major
 * version — that is the contract the `exports` map in package.json enforces.
 */

/* --- foundations ------------------------------------------------------- */
export { cn } from "./lib/cn.js";
export {
  type Tone,
  type ToneStyle,
  tones,
  toneOf,
  TONE_RANK,
  rankOf,
  neutral,
  accent,
} from "./components/tone.js";
export { useFocusTrap, useListKeys } from "./components/a11y.js";

/* --- controls ---------------------------------------------------------- */
export {
  Button,
  buttonVariants,
  type ButtonProps,
  IconButton,
  iconButtonVariants,
  MiniButton,
} from "./components/button.js";
export { Input, inputVariants, type InputProps, Textarea, type TextareaProps } from "./components/input.js";

/* --- seçim kontrolleri -------------------------------------------------- */
export { Checkbox } from "./components/checkbox.js";
export { RadioGroup } from "./components/radio-group.js";
export { Switch } from "./components/switch.js";
export { Segmented } from "./components/segmented.js";
export { Tabs, type TabItem } from "./components/tabs.js";
export { RichText, type RichTextFormat } from "./components/rich-text.js";
export { TreeSelect, type TreeNode } from "./components/tree-select.js";

/* --- yüzeyler ----------------------------------------------------------- */
export { Card, CardHead, CardBody, Table, Label } from "./components/surface.js";

/* --- veri ---------------------------------------------------------------- */
export { Pagination, pageWindow } from "./components/pagination.js";
export { SortHeader, SelectAll, SelectRow, SelectionBar, type SortDirection } from "./components/data-table.js";
export { Sparkline } from "./components/sparkline.js";
export { TimelineStrip } from "./components/timeline-strip.js";

/* --- gelişmiş girdi ------------------------------------------------------ */
export { NumberInput } from "./components/number-input.js";
export { Combobox, type ComboOption } from "./components/combobox.js";
export { FileUpload, type UploadItem } from "./components/file-upload.js";
export { DatePicker, Calendar, type DateISO, type DateRange } from "./components/date-picker.js";

/* --- display ----------------------------------------------------------- */
export { Avatar, AvatarStack } from "./components/avatar.js";
export { StatusChip, Delta, Dot } from "./components/badge.js";
export { Icon, type IconSize } from "./components/icon.js";
export { Progress } from "./components/progress.js";
export { SectionHead } from "./components/section.js";
export { Spinner } from "./components/spinner.js";
export { ScoreRing, ScoreMeter, ScoreMatrix, type ScoreProps } from "./components/gauge.js";

/* --- structure & overlays ---------------------------------------------- */
export {
  Separator,
  Beacon,
  Alert,
  Breadcrumb,
  Field,
  Select,
  Sheet,
} from "./components/primitives.js";
export {
  DropdownMenu,
  type MenuItem,
  Popover,
  Tooltip,
  Toast,
  type ToastTone,
  ToastViewport,
  ConfirmDialog,
  Dialog,
} from "./components/overlay.js";

/* --- boş durum sistemi -------------------------------------------------- */
export {
  type Art,
  type EmptyLayout,
  type EmptyRoute,
  SaysBubble,
  EmptyNote,
  EmptyState,
  EmptyTile,
  EmptyBlank,
} from "./components/empty-state.js";

/* --- states ------------------------------------------------------------ */
export { ErrorState } from "./components/error-state.js";
export { LiveScope, useLiveClaim } from "./components/live-scope.js";
export {
  Skeleton,
  SkeletonText,
  SkeletonRows,
  SkeletonKpi,
  SkeletonCard,
  SkeletonTable,
  SkeletonOptions,
  SkeletonPanel,
  SkeletonPageBand,
} from "./components/skeleton.js";

/* --- düzen ve kabuk ---------------------------------------------------- *
 * Buradan aşağısı, sınıfı olup bileşeni olmayan şeylerin kapandığı yer.
 * Gerekçesi `components/layout.tsx`'in başında. */
export {
  Surface,
  ScrollX,
  Rise,
  Swap,
  ListRow,
  CellActions,
  PageBand,
  Link,
} from "./components/layout.js";
export { ThemeToggle, LocaleSwitcher, LogoTile, AccountButton } from "./components/chrome.js";
export {
  ColorSwatches,
  ThemeCards,
  ImageField,
  type SwatchOption,
  type ThemeChoice,
} from "./components/appearance.js";
export { SquarePicker } from "./components/square-picker.js";
export { prepareImage, cropSquare, IMAGE_ACCEPT, type ImageError } from "./lib/image.js";
export { RailLink } from "./components/rail-link.js";
export { Slider } from "./components/slider.js";

/* --- açılır bölümler --------------------------------------------------- */
export { Accordion, Collapsible } from "./components/disclosure.js";

/* --- okunacak şeyler --------------------------------------------------- */
export { Descriptions, Kpi, KpiGrid, Code, Kbd, Badge, Steps } from "./components/display.js";

/* --- gelişmiş girdiler ------------------------------------------------- */
export {
  PasswordInput,
  SecretField,
  TagsInput,
  MultiSelect,
  ScheduleInput,
} from "./components/advanced-input.js";

/* --- grafik ve günlük -------------------------------------------------- */
export { LineChart, type Series } from "./components/chart.js";
export { PieChart, type PieSlice } from "./components/pie.js";
export { BarChart, type Bar } from "./components/bar.js";
export { StackedBarChart, type StackSeries } from "./components/stacked-bar.js";
export { LogView, type LogLine } from "./components/log-view.js";
