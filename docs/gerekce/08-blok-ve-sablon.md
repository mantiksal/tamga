# Blok ve şablon

Bir bileşenden büyük olanlar: bir ekranın bölgesi (blok) ve bir ekranın tamamı
(şablon).

> Kod dosyalarında **başlık** duruyor; kanıt burada. Kural:
> [`CLAUDE.md` · Yorumlar](../../CLAUDE.md). Dizin: [gerekçeler](../08-bilesen-gerekceleri.md)


---

## `blocks/index.ts`

### Bir blok nedir.

Bir bileşenden büyük, bir şablondan küçük: birkaç bileşenin bir araya gelip TEK
BİR İŞ yaptığı bölüm. Filtre çubuğu bir düğme değil ama bir ekran da değil; bir
ekranın içindeki bir bölge.

ADR-0003'ün katman şeması "filtre paneli · toplu eylem çubuğu" diye ikisini de
`tamga-ui` kutusunun içine yazıyor. Toplu eylem çubuğu ZATEN VARDI: `SelectionBar`,
bir bileşen olarak, kendi doküman sayfasıyla. Buraya bir `BulkBar` yazıldı ve aynı
propları alan ikinci bir kopyaydı; silindi.

**Ders bu dosyanın başında duruyor:** yeni bir blok yazmadan önce kitin o işi
yapan bir bileşeni var mı diye bakılır. Bir tasarım sisteminin en sinsi hatası,
aynı şeyin iki adla iki yerde durmasıdır.

BURAYA NE GİRMEZ. Bir ürünün sözlüğünü taşıyan hiçbir şey. Bir sipariş kartı, bir
iade satırı, bir mülk özeti: bunlar e-ticaret ya da izleme katmanının işi. Blok,
alanı bilmeyen bölümdür.


---

## `filter-bar.tsx`

### Neden kitte.

Bir süre üründe durdu ve orada "kite taşınmadı, bilinçli" diye bir not vardı:
gerekçesi "Excel ile ara" ve "Tüm filtreler" gibi şeylerin bir e-ticaret paneli
kalıbı olması. Not yanlış çıktı, ve iki sebeple.

1. ADR-0003'ün katman şeması `tamga-ui` kutusunun içine zaten "filtre paneli ·
   toplu eylem çubuğu" yazıyor. Bir satır içi yorum, kilitli bir ADR'yi geçersiz
   kılmaz.
2. Notun işaret ettiği sözlük SÖZCÜKLERDİ, mekanizma değil. Metinler `labels`a
   çıkınca geriye kalan şey saf mekanizma: bir arama kutusu, en çok dört alan, bir
   çekmece, ve uygulanan filtrelerin çipleri. Dosyayla arama da bir alan adı değil
   bir yöntem; her yönetim listesi yapabilir.

### Üç madde, ve üçüncüsü en önemlisi.

Bir yönetim panelinin filtresi otuz alanı aynı anda açık tutmaya meyilli, hepsi
aynı görsel ağırlıkta. Buradaki fikir tek cümle: birkaçı üstte, gerisi çekmecede,
VE çekmecede bir şey açıksa bunu görüyorsun.

Gizli bir filtre açıkken kullanıcı listeyi eksik görüyor ve sebebini bulamıyor; bu,
filtreyi gizlemenin tek gerçek riski. O yüzden uygulanan her filtre tablonun
üstünde bir çip olarak duruyor, tek tıkla kalkıyor, ve çekmece düğmesinde aktif
sayıyı gösteren bir rozet var.

ENTER UYGULAR. Çekmecedeki alanlar bir `<form>` içinde ve "Uygula" o formun
`submit` düğmesi, yani Enter tarayıcının kendi davranışıyla çalışıyor: dinlenen
bir tuş değil, formun anlamı.

### Çubuk kendi yüzeyinde.

Öncesinde çıplak bir kaptı: sayfa şeridi, sonra serbest duran bir kontrol ızgarası,
sonra tablonun kartı. Üç ayrı görsel dil alt alta, ve hiçbiri ötekinin parçası gibi
durmuyordu. Filtreler tablonun ÜSTÜ değil, onunla aynı işin parçası; kendi kartında
toplanınca ekran üç yamadan iki nesneye iniyor.

`tamga-card-open` ŞART, `tamga-card` DEĞİL: kartın kırpması, içindeki her açılır
paneli (durum seçici, tarih takvimi, çoklu seçim) hücre sınırında keserdi. Çalışan
ama yarısı görünmeyen bir kontrol, ve hata vermediği için sebebi z-index'te aranan
klasik tuzak.

### Tarih aralığı iki sütun kaplıyor, bir sütunu ikiye bölmüyor.

Öncesinde tek bir alan yuvasının içinde `grid-cols-2` açıyordu, yani iki takvim bir
alanın yarısı kadar yere sıkışıyor ve ikisi de okunamaz hâle geliyordu. Üstelik
"gg.aa.yyyy" gibi sabit genişlikli bir yer tutucuyu taşımaları gerekiyor. Aralık iki
alan kadar yer istiyor, çünkü iki alan.

VE TEK BAŞINA KALAN ALAN SATIRI KAPLAMIYOR. `grow` sığmayanları alt satıra
indiriyor, ama orada tek başına kalan alan bütün satıra yayılıyordu: bir seçim
kutusu 1200 piksel genişliğinde, yanında da boş bir düğme. Tavan yarım satır, yani
sona düşen iki alan tasarımdaki gibi 50/50 bölüşüyor. Aralık bunun dışında: o
zaten iki alan.


### Esnek sarma, sabit ızgara değil.

Sabit sütunlu bir ızgara alan sayısını EKRANA dayatıyordu: yedi alan bir satıra
sıkışıyor, hiçbiri okunacak genişlikte kalmıyordu. Izgaraya taşma korkusuyla
geçilmişti, ama taşmayı yaratan şey sütun sayısı değil TABANSIZ esnemeydi, ve asıl
çözüm bir taban genişliği vermek (`basis`).

Arama iki pay alıyor, seçimler birer; sığmayan alt satıra iniyor ve orada aralarında
eşit bölüşüyorlar.

---

## `save-bar.tsx`

### Kaydet şeridi · neden formun sonunda değil.

Eski panellerin alışkanlığı kaydet düğmesini formun en altına koymak; yirmi
alanlık bir formda üstteki bir alanı düzeltip kaydetmek için sonuna kadar kaydırmak
gerekiyor. Şerit her zaman görünür, ve kaydedilecek bir şey olup olmadığını da
söylüyor.

Fiziği bir sınıfta (`.tamga-save-bar`), ve orada ölçülmüş bir tuzak yazılı:
`sticky bottom-0` şeridin alt kenarını yüzeyin İÇERİK kutusuna hizalıyor, ama
yüzeyin kendi alt dolgusu var ve içerik o boşluktan akıp geçiyordu.

Değişiklik yoksa kaydedilecek bir şey de yok: düğme kapalı. Tıklanıp hiçbir şey
olmayan bir düğme, olmayan bir düğmeden kötüdür.


---

## `count-row.tsx`

### Sayaç satırı · tablonun tepesindeki tek satırlık okuma.

KAÇ KAYIT OLDUĞU HER ZAMAN YAZIYOR. Filtre uygulandıktan sonra kaç kayda
bakıldığını söylemeyen bir liste, kullanıcıya saydırıyor.

Sağ taraf iki şey taşıyabiliyor ve ikisi de isteğe bağlı: ekrana özel ikinci bir
okuma (`aside`, "12 tanesi eşiği geçti" gibi) ve sayfa boyu seçimi. İkincisi
verilmezse hiç çizilmiyor, çünkü sayfalanmayan bir listeye sayfa boyu sormak
olmayan bir kontrolü öğretmek olurdu.


---

## `app-shell.tsx`

### Açık gezinme girişi · en uzun eşleşen kazanır.

Bir giriş kendi alt ağacına sahip: `/urunler`, `/urunler/42/fotograflar` üzerinde de
açık giriştir.

Kural önce "tam eşleşme yalnız `/` için" diye yazılıydı, ve bir özel durumu vardı:
kökün `/` olmadığı bir panelde (`/panel`) kök giriş altındaki HER rotayı yutuyordu,
yani sipariş detayında hem "Pano" hem "Siparişler" açık görünüyordu. Ölçüldü.

Kökün hangi yol olduğu ürünün bilgisi, kitin değil. O yüzden kite yeni bir prop
eklemek yerine kural genelleştirildi: yolu kapsayan girişlerden EN ÖZELİ açık. `/`
de bu kuralın kendiliğinden bir örneği, artık ayrıca yazılmıyor.


### Ray bağlantısı kitin `RailLink`i, elle çizilmiyor.

Burada elle bir `<Link className="tamga-rail-link">` vardı ve geniş rayda
`tamga-rail-link-wide` sınıfını atlıyordu: etiket 40 piksellik kutuda "İ..." diye
kırpılıyordu. Aynı kontrolün iki uygulaması vardı ve yenisi eksikti. `RailLink` artık
`linkComponent` de aldığı için elle çizmenin sebebi kalmadı; dar raydaki ipucu da onun
kendi işi.

### Kaydırılan yüzeyde `relative` bir sigorta.

Kaydırılan yüzey KONUMLU DEĞİLSE, içindeki her `position: absolute` eleman kapsayıcı
bloğunu `html`de arıyor, ve `sr-only` tam olarak öyle bir eleman. Bulduğu an belge
koordinatlarına yerleşiyor, belgeyi uzatıyor, ve `h-dvh overflow-hidden` olmasına
rağmen SAYFANIN KENDİSİ kayıyor: gövdenin altında boş bir alan beliriyor.

Bir tüketicide iki kez çıktı, ikisi de gözle bulundu, ve ikisinde de ilk şüpheli
yanlış yerdeydi. Yüzeyi konumlu yapmak sınıfın tamamını kapatıyor: içeride kaçan bir
mutlak eleman artık en fazla bu yüzeyin içinde kayıyor.

---

## `appearance-template.tsx`

### The Appearance screen: logo, mark, brand colour, theme, sidebar.

WHY A WHOLE SCREEN AND NOT FIVE PARTS. Every panel grows an appearance setting, and
the kit not giving one is why two products drew their own hex box. Handing over the
parts would not have fixed it: each product arranges them differently and they
drift apart again, which is the thing this layer exists to prevent (ADR-0004).

IT STORES NOTHING. `value` comes in, `onChange` goes out, `onSave` belongs to the
caller. Where the preference lives (session, account, browser) is a product
decision, and a template that learns it stops being a template.

THE PALETTE IS NOT APPLIED HERE EITHER. This screen reports the chosen colour;
turning it into tokens is `makePalette` plus `paletteVars`, and the product decides
when that happens, because the product owns the root element.
