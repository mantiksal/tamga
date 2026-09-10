/**
 * BLOK KATMANI — `tamga-ui/blocks`.
 *
 * BİR BLOK NEDİR. Bir bileşenden büyük, bir şablondan küçük: birkaç bileşenin
 * bir araya gelip TEK BİR İŞ yaptığı bölüm. Filtre çubuğu bir düğme değil ama
 * bir ekran da değil; bir ekranın içindeki bir bölge.
 *
 * ADR-0003'ün katman şeması "filtre paneli · toplu eylem çubuğu" diye ikisini
 * de `tamga-ui` kutusunun içine yazıyor. Toplu eylem çubuğu ZATEN VARDI:
 * `SelectionBar`, bir bileşen olarak, kendi doküman sayfasıyla. Buraya bir
 * `BulkBar` yazıldı ve aynı propları alan ikinci bir kopyaydı; silindi.
 *
 * DERS BU DOSYANIN BAŞINDA DURSUN: yeni bir blok yazmadan önce kitin o işi
 * yapan bir bileşeni var mı diye bakılır. Bir tasarım sisteminin en sinsi
 * hatası, aynı şeyin iki adla iki yerde durmasıdır.
 *
 * BURAYA NE GİRMEZ. Bir ürünün sözlüğünü taşıyan hiçbir şey. Bir sipariş
 * kartı, bir iade satırı, bir mülk özeti: bunlar e-ticaret ya da izleme
 * katmanının işi. Blok, alanı bilmeyen bölümdür.
 */
export {
  FilterBar,
  rangeStart,
  rangeEnd,
  type FilterBarLabels,
  type FilterBarProps,
  type FilterField,
  type FilterFieldKind,
  type FilterGroup,
  type FilterValues,
} from "./filter-bar.js";
export { SaveBar } from "./save-bar.js";
export { CountRow } from "./count-row.js";
