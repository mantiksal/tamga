# Bileşen gerekçeleri · dizin

Kod dosyalarında **başlık** duruyor; kanıt burada. Bir bileşene dokunmadan önce ilgili bölümü oku:
neden o şekilde yazıldığı, hangi alternatifin neden reddedildiği, hangi somut hatanın karşılığı
olduğu.

> Bu dosyalar **bakanlar** için. Tüketicinin okuması gereken kurallar doküman sitesinde, her
> bileşenin kendi sayfasında. Buradakiler o kuralların **arkasındaki** ölçüm ve gerekçe.

Kural (bkz. [`CLAUDE.md` · Yorumlar](../CLAUDE.md)): kodda yalnız tuzağın yanındaki bir iki satır
ve yayınlanan gerekçeler (prop JSDoc'ları, token yorumları) kalır.

**Altı dosyaya bölünmüş, tek bir duvar değil:** bir bileşene bakan kişi yalnız kendi alanını okur,
ve uzun bir dosyayı hem insan hem model zor tarıyor.

| bölüm | ne var | dosyalar |
| --- | --- | --- |
| [Form ve girdi](gerekce/01-form-ve-girdi.md) | Kullanıcının bir DEĞER verdiği her şey: metin, sayı, tarih, seçim, dosya. | `advanced-input.tsx` · `combobox.tsx` · `date-picker.tsx` · `file-upload.tsx` · `number-input.tsx` · `rich-text.tsx` · `slider.tsx` · `tree-select.tsx` · `disclosure.tsx` |
| [Veri ve liste](gerekce/02-veri-ve-liste.md) | Bir kümeyi okutan şeyler: tablo, sayfalama, kayıt akışı. | `data-table.tsx` · `pagination.tsx` · `log-view.tsx` · `timeline-strip.tsx` |
| [Grafik ve ölçüm](gerekce/03-grafik-ve-olcum.md) | Sayıyı şekle çeviren şeyler. Hepsinin ortak kuralı: eksen etiketi olmayan grafik resimdir. | `bar.tsx` · `chart.tsx` · `pie.tsx` · `sparkline.tsx` · `stacked-bar.tsx` · `progress.tsx` |
| [Boş ve hata](gerekce/04-bos-ve-hata.md) | Bir yüzeyin dört hâlinden üçü: yüklenirken, boşken, kırıldığında. | `empty-state.tsx` · `error-state.tsx` · `skeleton.tsx` |
| [Yüzey ve kabuk](gerekce/05-yuzey-ve-kabuk.md) | Ekranın iskeleti: yüzeyler, sekmeler, ray, tema anahtarı. | `layout.tsx` · `surface.tsx` · `tabs.tsx` · `chrome.tsx` · `rail-link.tsx` · `display.tsx` |
| [İşaret ve ton](gerekce/06-isaret-ve-ton.md) | Bir şeyin hâlini renkle, glifle ya da nabızla söyleyen her şey. | `tone.ts` · `live-scope.tsx` · `icons.ts` · `button.tsx` |
