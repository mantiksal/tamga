# Yüzey ve kabuk

Ekranın iskeleti: yüzeyler, sekmeler, ray, tema anahtarı.

> Kod dosyalarında **başlık** duruyor; kanıt burada. Kural:
> [`CLAUDE.md` · Yorumlar](../../CLAUDE.md). Dizin: [gerekçeler](../08-bilesen-gerekceleri.md)


---

## `layout.tsx`

### Sınıfı olan ama bileşeni olmayan şeyler.

Bu dosyanın tamamı tek bir hatanın karşılığı. Checkbox yıllarca yalnız
`.tamga-check` olarak vardı: işaretlemesini her çağıran kendi yazdı ve
referans uygulama `role` bile taşımıyordu · ekran okuyucuya düz bir buton
olarak bildiriliyor, işaretli olup olmadığı hiç söylenmiyordu. Sınıf
doğruydu; eksik olan, doğru işaretlemenin TEK bir yerde durmasıydı.

Aynı boşluk on sınıfta daha vardı. Ürün onları elle `className` yazarak
kullanıyordu, yani her kullanım kendi kararını veriyordu.

AMA HER SINIF BİLEŞEN OLMADI. Ölçüt şu: sarmalayıcının ekleyecek bir şeyi
var mı · davranış, erişilebilirlik, ya da unutulabilecek bir kural? Yoksa
bileşen bir `<div>`'e ad takmaktan ibaret kalır ve kit şişer.
`.tamga-col` (yalnız bir sol kenarlık) bu yüzden sınıf olarak kaldı.


---

## `surface.tsx`

### YÜZEYLER · kart, tablo, sessiz etiket.

Üçü de kitte yalnız CSS sınıfı olarak yaşıyordu ve her çağıran kendi
sarmalayıcısını yazıyordu. Bedeli sınıfların YAN YANA GELME sırasıydı:
bir kart başlığı `tamga-head tamga-gutter tamga-section`
üçlüsünü birden ister, ve biri unutulduğunda kart sessizce yanlış boşlukla
çizilir · hata vermez, sadece ötekilere benzemez.

Sınıflar aynen duruyor; değişen tek şey doğru bileşimin bir yerde yazılı
olması.


---

## `tabs.tsx`

### Sekme şeridi.

İKİ AYRI ŞEY, ve tek bileşen ikisini de veriyor çünkü GÖRÜNTÜ aynı,
ANLAM farklı:

  Durum sekmesi  (`onChange`)  aynı sayfada bir bölümü değiştiriyor.
                               Semantiği `tablist` / `tab` / `aria-selected`:
                               bir widget.
  Yol sekmesi    (`href`)      başka bir adrese gidiyor. Semantiği `nav` +
                               `a` + `aria-current="page"`.

NEDEN AYRIM ÖNEMLİ. `role="tab"` bir bağlantıya konursa ekran okuyucu aynı
belgede bir `tabpanel` bekler ve bulamaz. Bağlantı da olmazsa kullanıcı
sekmeyi yeni pencerede açamaz, sağ tıklayamaz, tarayıcı geri tuşu
çalışmaz. İkisi de gerçek ihtiyaç, o yüzden ikisi de burada.

KAYDIRMA ŞERİDİN KENDİ İŞİ. On dokuz sekmeli bir rapor ekranı var ve
sekmeleri iki satıra sarmak seçili olanı bulmayı zorlaştırıyor. `scroll`
verildiğinde şerit yatay kayıyor, sekmeler daralmıyor. (Aktif çizginin
kırpılmaması için `.tamga-tab`ın kenarlığı kutunun İÇİNDE; kit.css'teki
gerekçeye bak.)


---

## `chrome.tsx`

### Kabuk parçaları.

BU DOSYA BİR KANITIN SONUCU. Aşağıdaki üç şey bağımsız iki projede ·
dashboard-v5 ve bu kitin doküman sitesinde · AYRI AYRI yazılmıştı. İkisi de
aynı kararları vermek zorunda kaldı: tercih nerede saklanır, `aria-label`
nasıl kurulur, sunucuda bilinmeyen bir tercih ilk boyamada nasıl davranır.

Bir mekanizmanın kite ait olduğunun en güçlü kanıtı budur: iki proje onu
habersizce yeniden icat etmişse, o mekanizma ikisinin de altındadır.


---

## `rail-link.tsx`

### Kendi dosyasında, çünkü YENİ BİR KONTROL.

`check-states-stories` guard'ı dosya bazında çalışıyor ve haklı olarak şunu
soruyor: bu dosya kitin daha önce görmediği bir kontrol mü getiriyor?
`.tamga-rail-link` kendi hover ve seçili fiziğini taşıyor · yani getiriyor.
Besteci bileşenlerle (var olan kontrolleri birleştirenlerle) aynı dosyada
durursa guard ikisini ayırt edemez ve ya yanlış suçlar ya da sessiz kalır.

### İkon raylı gezinme öğesi.

Dar kenar çubuğunun tek satırı: 40×40, yalnız bir ikon.

`label` ZORUNLU ve iki iş birden yapıyor · `aria-label` olarak ekran
okuyucuya adı veriyor, `title` olarak fareyle bekleyene aynı adı veriyor.
İkon-yalnız bir gezinmede bu ad tek tanımlayıcıdır; olmadığında kullanıcı
her simgeyi ezberlemek zorunda kalır.

`active` hem `data-active` (görsel) hem `aria-current="page"` (anlam)
veriyor. Yalnız görseli vermek, gören biri için doğru ekranı çizip
görmeyene hiçbir şey söylememek olurdu.


---

## `display.tsx`

### Anahtar/değer listesi · detay sayfalarının omurgası.

`<dl>` KULLANILIYOR ve bu görsel değil anlamsal bir seçim: bir ekran
okuyucu `<dl>` içinde "üç terim" der ve her terimi tanımıyla birlikte
okur. Aynı şeyi `<div>`'lerle çizmek görüntüyü verir, ilişkiyi vermez ·
ve gören biri için apaçık olan "bu değer bu etikete ait" bağı,
görmeyen biri için hiç kurulmaz.

Dar ekranda alt alta, geniş ekranda iki sütun. Kırılma noktası bileşenin
içinde: çağıranın hatırlaması gereken bir kural olarak bırakılırsa,
unutulduğu her yerde uzun bir değer etiketin üstüne biner.

İKİ GENİŞLİK VAR ve `compact` sonradan eklendi, çünkü aynı sorun üç ayrı
yerde tekrarladı: `wide`ın 14rem'lik terim sütunu bir sayfa genişliğinde
doğru, ama bir kartın içinde (yarım genişlik ya da yan panel) değeri kartın
ucuna itiyor ve "Banka / Kredi Kartı" üç satıra iniyor. Her çağıran bunu
`className` ile ezmek zorunda kalıyordu; ezilen bir varsayılan, varsayılan
değildir.
