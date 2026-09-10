/**
 * Kitin ikon kaydı.
 *
 * Gerekçe: docs/gerekce/06-isaret-ve-ton.md
 */
/** PHOSPHOR'UN TAMAMI DA BURADAN GEÇİYOR. */
export * from "@phosphor-icons/react/ssr";

/**
 * Bir glifin TİPİ, glifin kendisi değil.
 *
 * Bir ürün ikonları bir eşlemede tutmak istediğinde (`Record<string, ...>`)
 * o eşlemenin tipine ihtiyacı oluyor, ve tek kaynağı Phosphor'du: ürünün
 * `@phosphor-icons/react`ü doğrudan import etmesi gerekiyordu, yani kitin
 * gizlediği bağımlılık dışarı sızıyordu. Adı `Icon` değil `IconGlyph`, çünkü
 * `Icon` zaten kitin çizen BİLEŞENİ.
 */
export type { Icon as IconGlyph } from "@phosphor-icons/react";

export {
  /* eylemler */
  MagnifyingGlass as Search,
  ArrowsClockwise as Refresh,
  ArrowClockwise as RunNow,
  Pause,
  Plus,
  Trash as Delete,
  DownloadSimple as Download,
  UploadSimple as Upload,
  DotsThree as More,
  /* Bir değeri panoya almak: token adı, örnek kod, bir kimlik. Rolü her üründe
     aynı, o yüzden burada. Öncesinde kopyala düğmeleri `Customize`ı (sürgüler)
     kullanıyordu, yani "ayarla" glifi "kopyala" demeye çalışıyordu. */
  Copy,
  X as Close,
  Check,
  FunnelSimple as Filter,
  SlidersHorizontal as Customize,
  GearSix as Settings,
  Lifebuoy as Support,
  PencilSimple as Edit,
  FloppyDisk as Save,
  Printer as Print,
  ShareNetwork as Share,
  Archive,
  /* `Plus`ın eşi. Bir sayaç ya da bir yineleyici satır artırıp azaltıyorsa,
     azaltmanın da bir glifi olmak zorunda. */
  Minus,
  ArrowUUpLeft as Undo,
  ArrowUUpRight as Redo,
  ArrowsDownUp as Sort,
  /* Sürükleme tutamağı: sıralanabilir her listede aynı rol. */
  DotsSixVertical as Drag,

  /* yön ve gezinme */
  CaretDown,
  CaretLeft,
  CaretRight,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  List as Menu,
  House as Home,
  ArrowSquareOut as ExternalLink,
  ArrowsOut as Expand,
  ArrowsIn as Collapse,

  /* görünümler */
  Columns as BoardView,
  ListBullets as ListView,
  GitBranch as TimelineView,
  GridFour as GridView,

  /* durum ve nesneler */
  Bell,
  /* Bir kümedeki BİRİNİ "asıl olan" diye işaretlemek: ana fotoğraf, varsayılan
     adres, birincil kişi. Rolü her üründe aynı, o yüzden burada. Adı `Star`
     değil `Main`: çağrı yeri rolü okur, glifi değil. */
  Star as Main,
  Eye,
  EyeSlash,
  ShieldCheck,
  Warning,
  Tray as Empty,
  CalendarPlus,
  MoonStars as ThemeDark,
  Sun as ThemeLight,
  /* Dört geri bildirim işareti. `Warning` zaten vardı ama tek başına bir
     ailenin dörtte biriydi: bir arayüz "oldu", "olmadı", "dikkat" ve "şunu
     bil" demek zorunda, ve üçünü glifsiz bırakmak dördüncüyü de zayıflatıyor. */
  Info,
  Question as Help,
  CheckCircle as Success,
  XCircle as Failure,
  Clock,
  CalendarBlank as Calendar,
  File,
  FolderSimple as Folder,
  Image,
  Lock,
  LockOpen as Unlock,
  Key,
  Tag,
  PushPin as Pin,
  EnvelopeSimple as Mail,
  Phone,
  Play,
  Stop,

  /* metin biçimlendirme — bir editörün tuş takımı her üründe aynı şeyi yapar */
  TextB as Bold,
  TextItalic as Italic,
  LinkSimple as Link,
  ListBullets as BulletList,
  ListNumbers as NumberedList,
  TextAa as TextStyle,

  /* tuval ve görsel — bir görseli düzenleyen her üründe aynı fiiller */
  MagnifyingGlassPlus as ZoomIn,
  MagnifyingGlassMinus as ZoomOut,
  Crop,
  FlipHorizontal,
  FlipVertical,
  StackSimple as Layers,
  CircleHalf as Contrast,
  Eyedropper,
  PaintBrush as Brush,
  Palette,

  /* sağlayıcı işaretleri — oturum ekranlarının her üründe ihtiyacı olur */
  GoogleLogo,
  GithubLogo,
} from "@phosphor-icons/react/ssr";
