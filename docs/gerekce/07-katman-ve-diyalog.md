# Katman ve diyalog

Sayfanın ÜSTÜNDE açılan her şey: menü, balon, ipucu, bildirim, diyalog, yan panel.

> Kod dosyalarında **başlık** duruyor; kanıt burada. Kural:
> [`CLAUDE.md` · Yorumlar](../../CLAUDE.md). Dizin: [gerekçeler](../08-bilesen-gerekceleri.md)


---

## `overlay.tsx`

### Katman düzlemi.

Bu dosyadaki her şey 6 pikselde duruyor: sayfanın ulaşabildiği 4 pikselin
ötesinde, ve "bu şey havada" işaretinin tamamı bu. Yalnız `Dialog` ve `Sheet`
bir perde ekliyor. `Tooltip` tek istisna: o bir ETİKET, üstünde işlem yapılan
bir yüzey değil, bu yüzden hiç yükselmiyor.

### Menüde seçili satır · `MenuItem.checked`.

Menü iki farklı şey olabiliyor ve ikisinin erişilebilirlik sözleşmesi ayrı.
`checked` verilmeyen menü bir EYLEM listesidir: düz `menuitem`, bildirilecek
bir hâli yok, ve menülerin çoğu budur. `checked` verilen menü bir SEÇİMDİR:
satır kitin var olan seçili işaretini takıyor (`.tamga-option[data-selected]`,
Select katmanının kullandığı yıkama artı sol çizgi) ve kendini `menuitemradio`
/ `aria-checked` olarak bildiriyor.

Ayrım süsleme değil: altı özdeş menü satırı verilen bir ekran okuyucunun,
hangi dilde olduğunu öğrenmesinin başka yolu yok.

### İpucu oku.

`clip-path` ile sert bir üçgen kesiliyor: döndürülmüş kare yok, hizalanacak
kenarlık yok. Dolu mürekkep, keskin köşe, ait olduğu kabarcıkla aynı.

TUZAK, KUTUNUN OKLA BİRLİKTE DÖNMESİ. Dört yerleşim bir süre aynı 12×6
kutuyu paylaştı; yanlar 12 birim uzunluğunda bir DİKEN oldu, dikeyler 12 birim
genişliğinde bir KAMA. Aynı `clip-path`, ama kutusu onunla dönmemiş. Artık her
ok, hangi yöne bakarsa baksın, 12 taban ve 6 yükseklik.

### İpucu gecikiyor, ve bağlanıyor.

FARE BEKLİYOR, KLAVYE BEKLEMİYOR. Gecikmesiz bir ipucu, ekranı geçen farenin
arkasında sıra sıra kabarcık açıyor; Tab'la gelen kişi ise onu bilerek istedi.
400ms varsayılan, `delay` ile değişiyor, `0` değince açıyor.

`Esc` İPUCUNU DA KAPATIYOR. Odak tetikleyicide kalıyor, yani kabarcığın başka
çıkışı yok: ekranın bir kısmını kapatan bir kabarcık, klavye kullanan biri için
kaldırılamayan bir engel oluyordu.

ETİKET HER ZAMAN DOM'DA, GÖRÜNEN KOPYA DEĞİL. `aria-describedby` bağının hedefi
kaybolan bir eleman olamaz: ekran okuyucu açıklamayı ODAK ANINDA okumaya
çalışıyor, kabarcık ise o an henüz açılmamış oluyor. Bu yüzden etiket görünmez
bir kopyada sürekli duruyor ve kabarcık `aria-hidden` · metin iki kez okunmuyor.
Bağ `cloneElement` ile çocuğa iniyor, çünkü `aria-describedby` sarmalayıcıda
işe yaramıyor: okuyucu onu odaklanan ELEMANDA arıyor.


### Bildirimin kendi ömrü var.

"Gelir ve gider" bu bileşenin tek cümlesiydi ve gitme kısmı çağırana
bırakılmıştı: her ürün kendi `setTimeout`unu yazıyordu, ve yazmayan üründe
bildirim ekranda kalıyordu. Süre artık kitte: 5 saniye, `action` varsa 8 ·
"Geri al" gitmeden önce hem OKUNABİLMELİ hem ULAŞILABİLMELİ.

ÜSTÜNE GELİNCE SAYAÇ DURUYOR, kalan süre saklanıyor ve fare çekilince oradan
devam ediyor. Okumak için üstüne gelen kişiden bildirimi kaçırmak, bu bileşenin
yapabileceği en can sıkıcı şey · ve "Geri al" düğmesine uzanan fare tam oradan
geçiyor. Klavye odağı da durduruyor.

`alert` YALNIZ `danger`DA. Assertive bir bölge ekran okuyucunun o an okuduğu
cümleyi KESİYOR: bir kayıt onayı için bu bedel fazla, başarısız bir ödeme için
değil. Ötekiler `status`, yani sıranın sonunda okunuyor.

SÜREYİ KAPATMAK `duration={0}`. Onaylanması gereken ender bildirim için, ve
bilinçli olmak zorunda: kendiliğinden gitmeyen bir bildirim, kapatılmazsa
ekranda kalan bir uyarıdır · o zaman `Alert` doğru bileşen.


### Diyalog da giriyor.

Çekmece kayarak giriyordu, diyalog ise tek karede beliriyordu: perdeyle birlikte
yanıp sönen bir kutu, açılmış gibi değil YAPIŞTIRILMIŞ gibi okunuyor. Ölçek
.98'den başlıyor, yani kutu büyümüyor · yerine oturuyor. Büyüyen bir panel
dikkati merkeze çekip metni geciktiriyor, ve 160ms'de bu fark görülüyor.

PERDE DE AYNI ANDA AÇILIYOR (`tamga-scrim-in`), ve `prefers-reduced-motion`
ikisini birden kapatıyor: duran bir diyalog yine de AÇIK olmak zorunda.


### Perde mürekkebin %45'i.

Perde bir süre %32 opaklıkta sıcak bir kahveydi ve arkadaki sayfa rahat
okunuyordu: diyalog sayfasının kendi yazdığı kural ("arkadaki her şey erişilemez
hâle gelir") ekranda görünmüyordu · diyalog bir KAPI değil bir kart gibi
duruyordu. Şimdi mürekkebin kendisi: aynı renk koyulaşıyor, sayfanın üstüne
ikinci bir renk atılmıyor.


### Popover'ın oku ipucununkinden başka çiziliyor.

İpucunun kabarcığı TEK RENK (mürekkep) ve oku da öyle çizilebiliyor: dolu bir
üçgen, kabarcıkla aynı renk. Popover ise açık yüzeyde duruyor ve kenarı koyu ·
kenarsız bir üçgen panelin altında yamalı bir çıkıntı gibi duruyor.

Çözüm iki üçgen: alttaki `--color-edge-strong`, üstteki `--color-shell` ve 2px
aşağıda · aradan kalan 1.5px okun kenarı oluyor. Döndürülmüş kare değil, çünkü
kitin hiçbir yerinde döndürülmüş kare yok ve hizalanacak iki kenarlık, bu
kalınlıkta hep yarım piksel kayıyor.

OK TETİKLEYİCİNİN HİZASINDA, panelin ortasında değil: panel 288px, tetikleyici
çoğu zaman ondan dar, ve ortadan çıkan bir ok neyin altından çıktığını
göstermek yerine boşluğu işaret ediyor. 22px, hem `start` hem `end` hizasında
tetikleyicinin gövdesine denk gelen mesafe.

İPUCUNDA OK KALDI, tasarım notu "ok yok" dediği hâlde: o kabarcık `fixed` ve
JS ile ölçülüyor, yani tetikleyicisinin kutusuna DEĞİL görüntü alanına bağlı ·
tek bağı ok. Popover tetikleyicinin içinde doğuyor, ipucu doğmuyor.


### Kabarcık `fixed`, `absolute` DEĞİL.

Ölçülen hata: dar bir kenar çubuğunda ipucu hiç görünmüyordu. Sebep
`overflow`du. Menü kaydırılabilir olduğu için (`overflow-y: auto`, ki yatayı da
`auto` yapıyor) ipucu doğuyor, çiziliyor ve kabın dışında kaldığı için tamamen
kırpılıyordu. Bu, kitin üç kez karşılaştığı aynı tuzağın üçüncü yüzü: kart,
ray, şimdi ipucu.

Z-index çözmüyor; hiçbir yığın sırası bir `overflow` kırpmasını aşamaz. Çözüm
kabarcığı akıştan çıkarmak: `fixed` bir eleman en yakın kaydırma kabına değil
GÖRÜNTÜ ALANINA göre yerleşiyor, yani hiçbir kap onu kesemiyor.

Bunun bedeli konumun JS ile ölçülmesi: `fixed` bir elemanın CSS ile
tetikleyiciye hizalanmasının yolu yok. Ölçüm yalnız ipucu açılırken yapılıyor,
kapalıyken hiçbir maliyeti yok.

### Bildirim genişliği · kabın kararı, bildirimin değil.

`Toast` sabit `w-80`di ve dar bir kapta taşıyordu. `w-full max-w-80`e
çevrilince bu sefer TERS kırıldı: kap içeriğe göre daralan bir sütun olduğu
için `w-full` çöküyor ve bildirim 146 piksele iniyordu. Ölçü artık yığında
veriliyor: 320 piksel, ve ekran ondan darsa kenar boşluğu kadar küçülüyor
(bir telefonda 320 + 2×24 zaten sığmıyordu).

### Diyalog genişliği · bir varyant, ayrı bir bileşen değil.

Kitin kuralı: adı bölünen şey bileşen, ayarlanan şey prop.

`wide` bir ÖNİZLEME için var; bir bloğu ya da tam bir ekran şablonunu 448
pikselde göstermek, gösterdiğini gizlemek olur. `md` hâlâ varsayılan, çünkü
bir diyaloğun asıl işi bir KARAR sormak ve geniş bir karar kutusu, kararı daha
kolay yapmıyor.

`full` BİR ÇALIŞMA YÜZEYİ için: bir görsel düzenleyici, bir tuval, bir harita
seçici. Bunlar bir karar kutusu değil bir EKRAN, ve `wide` bile onlara az
geliyor; kalan kenar boşluğu tuvalden çalınan alan. Bu boyutta panelin kenarı,
yarıçapı ve kaydırma gölgesi de kalkıyor: yükseltilecek bir zemin kalmadığında
yükselme işareti de anlamsız. Nadir olması gerekiyor, çünkü bir formu tam ekran
açmak formu daha kolay doldurmuyor.

### Panel ekrandan taşamaz.

Ve taşıyordu: yalnız `full` boyu dikey bir akıştı, ötekiler serbest büyüyordu.
Uzun içerikli bir `wide` diyalog 1014 piksele çıkıp 783 piksellik pencerede
ORTALANIYOR, yani 116 piksel yukarıdan ve 116 piksel aşağıdan kesiliyordu. Ve
kesilen üst 116 pikselin içinde başlık ile KAPATMA DÜĞMESİ vardı: Escape
çalışıyordu ama fareyle kapatmanın yolu kalmıyordu.

`max-h-full` kabın (pencere eksi 24 piksel dolgu) sınırını koyuyor; `flex-col`
artı `overflow-hidden` de gövdenin kendi içinde kaymasını mümkün kılıyor.

### Onay diyaloğu · neden ayrı bir bileşen.

`Dialog` zaten var ve `ConfirmDialog` onun üstüne kurulu. Ayrı olmasının sebebi
şu: "emin misin" diyaloğu her seferinde elle kurulduğunda üç şey kayıyor, ve
üçü de güvenlikle ilgili.

1. **Onay düğmesi FİİLİ taşır, "Tamam"ı değil.** Bir kullanıcı diyaloğun
   metnini okumadan düğmeye basar; okuduğu tek şey düğmenin üstündeki
   kelimedir. "Tamam" hiçbir şey söylemez, "Sil" söyler.
2. **Odak VAZGEÇ'te açılır.** Yıkıcı bir diyalogda odağın onay düğmesinde
   olması, Enter'a basan birinin kaydı silmesi demek. Güvenli olan varsayılan
   olmalı. Düğmelerin sırası da bilinçli: yıkıcı düğme en sağda, yani farenin
   "ileri" yönünde değil.
3. **Geri alınamazlık yazılır.** Gövde metni ne olacağını değil NEYİN GERİ
   GELMEYECEĞİNİ söyler; kullanıcının kararı buna bağlı.

Kelimeler çağıranın: kit hiçbir dil bilmiyor, başlık, gövde ve iki düğmenin
etiketi dışarıdan geliyor.

### Perde yalnız fare için.

Escape ve Kapat düğmesi klavyeyi zaten karşılıyor. Perde erişilebilirlik
ağacında kalınca panelin ikisi de "Kapat" diye bildirilen iki kontrolü oluyordu.
