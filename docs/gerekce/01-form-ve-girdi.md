# Form ve girdi

Kullanıcının bir DEĞER verdiği her şey: metin, sayı, tarih, seçim, dosya.

> Kod dosyalarında **başlık** duruyor; kanıt burada. Kural:
> [`CLAUDE.md` · Yorumlar](../../CLAUDE.md). Dizin: [gerekçeler](../08-bilesen-gerekceleri.md)


---

## `advanced-input.tsx`

### Parola alanı · göster/gizle düğmesiyle.

NEDEN GÖSTER DÜĞMESİ. Yazdığını göremeyen kişi hata yapar ve hatayı
göremez; parola alanlarındaki en yaygın başarısızlık yanlış yazımdır, çalınma
değil. Görünürlük varsayılan olarak KAPALI, ama açılabilir olmalı.

Düğme `type="button"`: unutulursa forma gönderim tetikler ve kullanıcı
parolasını görmeye çalışırken formu yollar. Bu, `<button>`'ın varsayılanının
`submit` olmasından doğan klasik hatadır.

`autoComplete` çağırandan geliyor ve boş bırakılamaz: giriş ekranında
`current-password`, kayıt ekranında `new-password`. Yanlış olan, parola
yöneticisine yanlış şeyi kaydettirir.


---

## `combobox.tsx`

### Combobox · aranabilir seçim.

NEDEN `Select` YETMİYOR. `Select` sabit ve kısa bir küme içindir: durum,
öncelik, tema. Beş yüz ürünün olduğu bir listede kaydırarak seçim yapmak
mümkün değil; kullanıcı ARAR. Ayrı bir bileşen olmasının sebebi bu, süsleme
değil.

ERİŞİLEBİLİRLİK SÖZLEŞMESİ (WAI-ARIA combobox kalıbı). Bir combobox'ı yanlış
yapmak kolay, ve yanlışlığı yalnız ekran okuyucu kullanan biri fark eder:
  · girdi `role="combobox"` + `aria-expanded` + `aria-controls`
  · liste `role="listbox"`, satırlar `role="option"` + `aria-selected`
  · ODAK GİRDİDE KALIR. Ok tuşları seçimi `aria-activedescendant` ile
    taşır · odağı listeye taşımak yazmayı imkânsız kılardı.

SUNUCU ARAMASI DA MÜMKÜN. `onSearch` verilirse süzme yapılmaz: gelen
`options` olduğu gibi gösterilir. Beş yüz kayıt istemcide süzülür, elli bin
kayıt sunucuda · ve bu kararı ürün verir, kit değil.


---

## `date-picker.tsx`

### DatePicker · tek gün ve aralık.

DİL BURADA BİR PROP DEĞİL, BİR YETENEK. Ay ve gün adları çevrilmez;
`Intl.DateTimeFormat` ile ÜRETİLİR. Sebebi tembellik değil doğruluk:
haftanın hangi günle başladığı yerele göre değişir (Türkçe'de Pazartesi,
İngilizce'de Pazar), ay adları çekim alır, ve bir dil listesi elle yazıldığı
anda dokuzuncu dilde eksik kalır.

O yüzden bileşen `locale` alır ve geri kalanını tarayıcı bilir. Bu, kitin
"çeviri çekmez" kuralının ihlali değil: çeviri getirmiyoruz, TARİH
BİÇİMLENDİRMESİ yapıyoruz · ikisi farklı iş.

ZAMAN DİLİMİ YOK. Bileşen yalnız YIL-AY-GÜN ile çalışır. Bir sipariş filtresi
"15 Nisan" ister, "15 Nisan 00:00 UTC+3" değil; saat karıştırıldığında gün
sınırında bir kayma doğar ve kimse sebebini bulamaz.


---

## `file-upload.tsx`

### FileUpload · ürün görselleri.

NEDEN SIRALAMA VAR. Bir e-ticaret panelinde görsellerin SIRASI veridir:
ilk görsel kartta görünen görseldir. Sıralamayı desteklemeyen bir yükleyici,
kullanıcıyı hepsini silip doğru sırayla yeniden yüklemeye zorlar · ve bu,
gerçekten yapılan şeydir.

SIRALAMA OK TUŞLARIYLA DA YAPILIR, yalnız sürükleyerek değil. Sürükle-bırak
klavye kullanan biri için yok hükmündedir; her karta sol/sağ düğmesi koymak
hem erişilebilir hem dokunmatik ekranda daha güvenilir.

KİT DOSYA YÜKLEMEZ. `onChange` seçilen `File` nesnelerini verir; nereye
gideceği, hangi uçla, hangi ilerleme göstergesiyle · ürünün kararı. Kit
seçmeyi, göstermeyi, sıralamayı ve silmeyi yapar.


---

## `number-input.tsx`

### NumberInput · fiyat, stok, ağırlık.

NEDEN `<input type="number">` YETMİYOR. Üç somut sebep, üçü de bir panelde
her gün karşılaşılan şeyler:

  · Tarayıcının kendi artır/azalt okları 12px'lik, tema tanımayan, dokunmatik
    ekranda tutulamayan kontrollerdir. Firefox ve Safari farklı çizer.
  · Fare tekerleği alanın üstündeyken değeri DEĞİŞTİRİR. Uzun bir formda
    sayfayı kaydırırken stok adedini sessizce bozar · kimsenin fark etmediği,
    herkesin başına gelen hata.
  · Ondalık ayracı yereldir: Türkçe klavyeden `12,5` gelir, `type="number"`
    bunu boş değer olarak okur.

Bu yüzden alan `type="text"` + `inputMode="decimal"`: mobil klavye yine
sayısal açılır, ama biçimlendirme bizde kalır.


---

## `rich-text.tsx`

### Biçimlendirilebilir metin.

NEDEN VAR. Kitte bir metin kutusu (`Textarea`) vardı ve düz metin alıyordu;
biçimlendirme isteyen her ekran ya ham HTML yazdırıyor ya da dışarıdan bir
editör getiriyordu. İkisi de kötü: birincisi içerik yazan kişiden etiket
bilgisi istiyor, ikincisi her üründe başka bir tuş takımı demek.

HANGİ BİÇİMLERİN SUNULACAĞI ÜRÜNÜN KARARI, kitin değil, ve `allow` bunun
için var. Bir vitrin gelen HTML'i süzüyor olabilir; süzgeçten geçmeyecek
bir düğmeyi göstermek, kullanıcıya var olmayan bir yetki sunmaktır. Kit
hangi etiketin nereye gittiğini bilemez, o yüzden sormaz: çağıran söyler.

KONTROLSÜZ DOM, ve bu bilinçli. `contenteditable`i her tuşta React'ten
yeniden yazmak imleci metnin başına atar; girdiyi DOM tutuyor, dışarıya
`onChange` ile bildiriliyor, ve `value` yalnız DIŞARIDAN değiştiğinde
(kayıt sonrası, vazgeç, başka bir kayda geçiş) DOM'a yazılıyor.

YAPIŞTIRMA DÜZ METİN. Bir kelime işlemciden ya da başka bir siteden
yapıştırılan içerik kendi `<span style>`larını, sınıflarını ve yazı
tiplerini getiriyor; onlar ne bu ekranda görünür ne vitrinde kalır, ama
kaydedilen HTML'i şişirir ve sonraki düzenlemeyi okunamaz yapar. Görünen
biçim düğmelerden geliyor, yapıştırmadan değil.

`execCommand` KULLANIYOR ve bunun bilinci var: standart onu "kullanımdan
kalkmış" sayıyor, ama yerine geçen bir tarayıcı API'si YOK ve bütün
motorlarda çalışıyor. Alternatifi bir belge modeli kütüphanesi getirmek;
bu kitin hiçbir çalışma zamanı bağımlılığı yok ve bir editör uğruna
kazanılacak şey, ödenecek boyuta değmiyor.


---

## `slider.tsx`

### Kendi dosyasında, çünkü YENİ BİR KONTROL.

Native `<input type="range">` kitin daha önce hiç kullanmadığı bir eleman;
kendi hover, basılma ve odak durumları var. `check-states-stories` bunu
doğru yakaladı · ve bir kontrol, durumları bir story'de gösterilmeden kite
girmez.

### Kaydırıcı.

Native `<input type="range">` KULLANILIYOR ve bu bilinçli: klavye desteği,
`aria-valuenow`, dokunmatik sürükleme · hepsi bedava geliyor ve elle
yazılan her kopyası bunların birini kaçırıyor. Değişen tek şey görünüm.

DEĞER HER ZAMAN GÖRÜNÜR. Bir kaydırıcı tek başına yalan söyler: kullanıcı
"yaklaşık üçte iki" görür, "%67" göremez. Eşik ayarlayan biri için o fark
ayarın kendisidir.


---

## `tree-select.tsx`

### Ağaç seçici · HİYERARŞİK ÇOKLU SEÇİM.

NE ZAMAN. Seçenekler düz bir liste değil bir AĞAÇ, ve seçim birden çok
olabiliyor: ürün kategorileri, yetki grupları, hesap planı. Düz bir çoklu
seçim kutusu bunu veremiyor, çünkü "Ayakkabı > Erkek > Koşu" ile "Giyim >
Erkek > Koşu" aynı adı taşıyor ve ancak yolu görünce ayırt ediliyor.

─── ÜÇ DURUMLU DEĞİL, AŞAĞI YAYILAN ────────────────────────────────────
Bir dalı işaretlemek ALTINDAKİLERİ de işaretliyor; ama bir çocuğu
işaretlemek üstünü işaretlemiyor. Üç durumlu (yarı işaretli) bir ağaç,
"üst kategori de seçildi mi" sorusunu belirsiz bırakıyor: kullanıcı üç
çocuktan üçünü seçtiğinde üst kategoriyi de seçmiş sayılıyor ve bu çoğu
zaman istenmiyor. Seçim ne ise o.

─── ARAMA DALLARI DEĞİL YAPRAKLARI SÜZÜYOR ─────────────────────────────
Eşleşen düğüm gösteriliyor VE ATALARI da gösteriliyor: yolu görünmeyen bir
eşleşme hangi ağaçtan geldiğini söylemiyor. Ataları eşleşmese bile duruyor,
ama seçilebilir kalıyorlar; süzme bir görünürlük işi, bir kilit değil.


---

## `disclosure.tsx`

### Açılıp kapanan bölümler.

Ürün bunu dört dosyada ham `<details>` ile yazıyordu. `<details>` doğru bir
eleman ve klavyeyle çalışıyor · sorun davranışta değil, ÜÇGENDE: tarayıcının
kendi `▶` işareti tema tanımaz, boyutu her tarayıcıda farklıdır ve
`list-style` ile gizlemek Safari'de çalışmaz. Yani her kullanım kendi
geçici çözümünü yazıyordu.

### Tek bir açılır bölüm.

`<details>` DEĞİL, ve bu bilinçli bir takas: `<details>` bedava klavye
desteği verir ama işaretini kontrol ettirmez. Burada `aria-expanded` +
`aria-controls` elle kuruluyor, karşılığında ok kitin kendi ikonu oluyor.

ARAMA UYARISI: kapalı içerik DOM'da duruyor, yalnız gizli. Tarayıcının
Ctrl+F'i onu bulamaz. İçinde aranacak metin varsa (uzun bir SSS) bunu
bilerek kabul et ya da bölümü açık başlat.
