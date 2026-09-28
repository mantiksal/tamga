# Bileşen gerekçeleri · dizin

Kod dosyalarında **başlık** duruyor; kanıt burada. Bir bileşene dokunmadan önce ilgili bölümü oku:
neden o şekilde yazıldığı, hangi alternatifin neden reddedildiği, hangi somut hatanın karşılığı
olduğu.

> Bu dosyalar **bakanlar** için. Tüketicinin okuması gereken kurallar doküman sitesinde, her
> bileşenin kendi sayfasında. Buradakiler o kuralların **arkasındaki** ölçüm ve gerekçe.

Kural (bkz. [`CLAUDE.md` · Yorumlar](../CLAUDE.md)): kodda yalnız tuzağın yanındaki bir iki satır
ve yayınlanan gerekçeler (prop JSDoc'ları, token yorumları) kalır. Kuralın mekanik yarısını
**`check-yorum` kapısı** tutuyor: bir yorum bloğu altı düzyazı satırını geçemez, tek muafiyet
`TR:` taşıyan yayınlanan metin. Testlerin ve kapıların gerekçesi ayrı bir dosyada:
[Testler ve değişmezler](09-testler-ve-degismezler.md).

**On dosyaya bölünmüş, tek bir duvar değil:** bir bileşene bakan kişi yalnız kendi alanını okur,
ve uzun bir dosyayı hem insan hem model zor tarıyor.

| bölüm | ne var | dosyalar |
| --- | --- | --- |
| [Form ve girdi](gerekce/01-form-ve-girdi.md) | Kullanıcının bir DEĞER verdiği her şey: metin, sayı, tarih, seçim, dosya. | `advanced-input.tsx` · `combobox.tsx` · `date-picker.tsx` · `file-upload.tsx` · `number-input.tsx` · `rich-text.tsx` · `slider.tsx` · `tree-select.tsx` · `disclosure.tsx` · `primitives.tsx` · `square-picker.tsx` · `radio-group.tsx` |
| [Veri ve liste](gerekce/02-veri-ve-liste.md) | Bir kümeyi okutan şeyler: tablo, sayfalama, kayıt akışı. | `data-table.tsx` · `pagination.tsx` · `log-view.tsx` · `timeline-strip.tsx` |
| [Grafik ve ölçüm](gerekce/03-grafik-ve-olcum.md) | Sayıyı şekle çeviren şeyler. Hepsinin ortak kuralı: eksen etiketi olmayan grafik resimdir. | `bar.tsx` · `chart.tsx` · `pie.tsx` · `sparkline.tsx` · `stacked-bar.tsx` · `progress.tsx` |
| [Boş ve hata](gerekce/04-bos-ve-hata.md) | Bir yüzeyin dört hâlinden üçü: yüklenirken, boşken, kırıldığında. | `empty-state.tsx` · `error-state.tsx` · `skeleton.tsx` |
| [Yüzey ve kabuk](gerekce/05-yuzey-ve-kabuk.md) | Ekranın iskeleti: yüzeyler, sekmeler, ray, tema anahtarı. | `layout.tsx` · `surface.tsx` · `tabs.tsx` · `chrome.tsx` · `rail-link.tsx` · `display.tsx` · `avatar.tsx` · `link.tsx` |
| [İşaret ve ton](gerekce/06-isaret-ve-ton.md) | Bir şeyin hâlini renkle, glifle ya da nabızla söyleyen her şey. | `tone.ts` · `live-scope.tsx` · `icons.ts` · `button.tsx` |
| [Katman ve diyalog](gerekce/07-katman-ve-diyalog.md) | Sayfanın ÜSTÜNDE açılan her şey: menü, balon, ipucu, bildirim, diyalog. | `overlay.tsx` |
| [Blok ve şablon](gerekce/08-blok-ve-sablon.md) | Bir bileşenden büyük olanlar: bir ekranın bölgesi ve bir ekranın tamamı. | `blocks/index.ts` · `filter-bar.tsx` · `save-bar.tsx` · `count-row.tsx` · `app-shell.tsx` · `appearance-template.tsx` |
| [Kitaplık](gerekce/09-kitaplik.md) | Bileşen olmayanlar: renk matematiği, görsel işleme, odak ve kaydırma. | `lib/color.ts` · `lib/palette.ts` · `lib/image.ts` · `lib/scroll-lock.ts` · `lib/data-props.ts` · `components/a11y.ts` |
| [CSS katmanları](gerekce/10-kit-css.md) | Sınıfların ve token'ların fiziği: her sayının neden o sayı olduğu. | `kit.css` · `theme.css` · `fonts.css` |
