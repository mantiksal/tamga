# ADR-0002 · CSS sınıf öneki `tamga-`

**Durum:** ✅ Kabul edildi (2026-09-07)

## Bağlam

Kitin 67 sınıfı `nb-` önekiyle geliyordu: `.nb-btn`, `.nb-card`, `.nb-input`. Önek bir çakışma
kalkanıdır; onsuz, sayfada `.card` tanımlayan başka bir kütüphane kitin kartlarını bozar. (Bootstrap
bunu öneksiz `.btn` / `.card` ile öğrendi ve sınıf adlarını artık geriye dönük olarak düzeltemiyor.)

`nb` **neobrutalizm**den geliyordu. Ama kitin kendi tasarım notu bu stilden bilinçli olarak
ayrıldığını yazıyor: *"Vurgu gölgeden gelir, kalın kenarlıktan değil; klasik neobrutalizmin 3px
kenarlığı yok."* Yani önek, artık olmadığımız bir stilin kısaltmasıydı.

Bunun bir emsali var: IBM'in Carbon'u `bx--` önekini yıllarca taşıdı; `bx` "Bluemix"ten geliyordu ve
o ürün çoktan yoktu. v11'de `cds--`'ye göç ettiler ve ekosistem büyüklüğü yüzünden bu büyük bir
operasyon oldu. Bizim durumumuzda henüz tek depo ve 737 kullanım vardı.

## Karar

**Önek `tamga-` oldu.** `.tamga-btn`, `.tamga-card`, `.tamga-chip`.

Ve maskotun adı da sınıflardan çıktı: ürüne ait bir önek `.tamga-art-*` oldu. Boş-durum slot sistemi
(sahne · kuyu · zemin · şerit · adımlar) jeneriktir: bir boşluğun nasıl doldurulacağını tarif eder.
İçine ne çizildiği ürünün kimliğidir.

## Değerlendirilen alternatifler

**A · Kısa kod (`mk-`, `mnt-`).** Salesforce `slds-`, Ant Design `ant-`, Google `mdc-` bu okuldan.
Reddedildi, ama zayıf farkla. Kısa kodun tek avantajı yazım kolaylığıdır ve **ölçüm o avantajın
burada olmadığını gösterdi:** 760 geçişin yalnız ~98'i ekran kodunda elle yazılıyor; gerisi
bileşenlerin kendi içinde. `<Button variant="primary">` yazılıyor, `tamga-btn`'i bileşen
koyuyor. Chakra, Polaris ve Spectrum da tam bu sebeple tam ad kullanıyor: sınıfı kütüphane üretir,
insan yazmaz.

**B · `ms-`.** Reddedildi, teknik sebeple: Tailwind'in kendi `ms-4` / `ms-auto` (margin-inline-start)
utility'leri var. Aynı `className` içinde `ms-btn ms-4` okunmaz hale gelir. Ayrıca Microsoft'un
Fluent'i `.ms-Button` kullanıyor.

**C · `mant-`.** Reddedildi: `mantine-` önekli popüler bir React kütüphanesi (Mantine) var; halka
açık bir pakette bu karışıklık üretir.

**D · `nb-` kalsın.** Reddedildi. Teknik olarak zararsızdı; bedeli her yeni geliştiricinin sorduğu
"nb ne demek?" sorusu ve cevabın "artık olmadığımız bir stilin kısaltması" olmasıydı. Ve pencere
kapanıyordu: bugün tek depoda bir bul-değiştir, üç müşteri projesi kurulduktan sonra major sürüm +
codemod + eşzamanlı yükseltme demekti.

## Sonuçlar

- **+** 760 geçiş, 111 dosya, tek mekanik dönüşümde. Yedi kapı yeşil kaldı.
- **+** Önek artık halka açık bir pakette benzersiz ve kendini açıklıyor: tarayıcıda "İncele" diyen
  biri `tamga-card` görünce neye baktığını anlıyor.
- **+** `check-class-defined` guard'ı sözlüğüyle birlikte taşındı; 67 sınıfın hepsinin tanımlı
  olduğunu doğrulamaya devam ediyor.
- **−** Prototipten kalan ekran görüntüleri ve eski notlar artık kodla aynı sınıf adlarını
  kullanmıyor. Kabul edildi.

### Bu dönüşümün öğrettiği iki şey

**1 · Kör bul-değiştir yapılmadı, ve iyi ki.** Kuru koşuda bir tuzak çıktı: bir story dosyasında
`onb-target` diye bir HTML `id`'si vardı (onboarding target). `s/nb-/tamga-/g` onu
`otamga-target` yapar ve `<Field>` ile `<Input>` arasındaki etiket bağını sessizce koparırdı.
Codemod, `nb-`'nin önüne harf ya da rakam geldiğinde dokunmuyor.

**2 · Ve yine de bir şey kaçtı.** `check-states-stories`'in sapma dedektörü `/\bnb-(btn|…)/` desenini
taşıyordu; codemod'un kuralı gereği (`\b`'deki `b` bir harf) atlandı. Yani o kural bir süre hiçbir
şeyi yakalayamaz durumda kaldı ve kimse fark etmezdi. Ders: **bir öneki değiştirirken guard'ların
kendi regex'leri de değişmelidir**: kod ve onu denetleyen kural aynı sözlüğü konuşur.

## İlgili

- ADR-0001 · ortak kütüphaneye taşıma
- `scripts/check-no-product-names.mjs` · maskot adının geri gelmesini engelleyen guard
