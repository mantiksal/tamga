# CSS katmanları · sınıfların ve token'ların fiziği

`kit.css` kitin en kalabalık dosyası ve içindeki her sayı bir karar. Bu belge o
kararları taşıyor; kodda yalnız sınıfın adı ve tuzağın bir iki satırı duruyor. Sonda
`theme.css` ile `fonts.css` bölümleri var.

> Kural: [`CLAUDE.md` · Yorumlar](../../CLAUDE.md). Dizin:
> [gerekçeler](../08-bilesen-gerekceleri.md). TEK TEK TOKEN'ların gerekçesi `theme.css`
> içinde `TR:` taşıyan yorumlarda duruyor ve `extract-tokens` onları doküman sitesine
> çıkarıyor: onlar yayınlanan metin, buradakiler bakanlar için.

---

## Kitin kendisi

Bir süre izole bir adaydı (`.taslak`), çünkü bir referanstı. Referans olmayı
bıraktığı gün kapsam da kalktı: `tamga-*` global, token'lar her şeyle aynı
`@theme` içinde, ve taban katmanı bir sarmalayıcı div'i değil belgeyi biçimliyor.

Bunun yerini aldığı şey şuydu: `components/ui` altında, shadcn'den türemiş, on iki
bileşeni adıyla kopyalayan ikinci bir kit. İki kit demek "bir düğme neye benzer"
sorusunun iki cevabı demek, ve Storybook ikisini birden gösteriyordu. Artık tek kit
var.

---

## Nötr rampa · aksan tonuna çalınmış gri

Rampa aksan tonuna doğru renklendirilmiş ve LCh ile yazılı: asla HSL ile, ve asla
başka bir ürünün sayıları kopyalanarak. İki deneme başarısız oldu ve bu bölümün
uzun olmasının sebebi o iki başarısızlık.

**1. deneme:** Sentry'nin HSL doygunluğu (%14) eşlendi. HSL'in S'si algısal kroma
değil: aynı S ve L'de 258°'deki menekşe, mavinin gerçek kromasının yaklaşık 1.4
katını taşıyor. Onların sayısını eşlemek daha zayıf bir renklendirmeyi garanti
ediyordu. Rampa gri okundu.

**2. deneme:** LCh ile 277° tonunda, kroma yükseltilerek yeniden kuruldu. Yine gri,
ve sebebi daha kötü: 277°, Tailwind'in slate bandının (271 ile 283 arası) tam
ortası, ve kroma slate'in kendi kromasının altında kalıyordu (slate-900 C\* 14.45).
O ton bandının içinde ve o kromanın altında kalan bir renk, endüstrinin varsayılan
koyu grisinin KENDİSİ. Yalnız kromayı yükseltmek onu daha doygun bir slate
yapmıştı.

Bir renklendirmeyi renklendirme yapan şey kroma değil, nötr banttan TON UZAKLIĞI.
Sentry düşük kromayla (5.5 ile 12.7) kurtuluyor, çünkü tonu 299 ile 304° arasında:
slate'ten yaklaşık 20° uzakta, generik hiçbir şeyin yaşamadığı yerde. Bizim
mavimizin o lüksü yok, çünkü mavi nötr bandın kendisi.

Sonuç: ton 291°, yani kendi birincil rengimizin (`#12245c`) gerçek LCh tonu, ve
slate'in kenarını geçiyor. Kroma da slate'in 14.45'ini aşıyor, çünkü Sentry 20°
açıkken biz 8° açıyoruz. Sentry'nin kromasını geçmek bir tutarsızlık değil: mavi
ekseninde eşit algının bedeli bu. L\* zaten olduğu yere sabitlendi, yani rampa tek
bir kontrast değerini kıpırdatmadan renk kazanıyor.

    L*  5.9 -> C* 16      L* 19.9 -> C* 26      L* 85.1 -> C* 6.0
    L*  9.3 -> C* 19      L* 27.9 -> C* 31      L* 94.4 -> C* 2.8
    L* 14.2 -> C* 22      L* 61.9 -> C* 11

Açık tema bilerek sıcak kâğıt: gündüz kâğıt, gece gösterge ekranı, ve soğuk bir
zemin sıcak durum renklerinin ayrışmasını zorlaştırıyor.

### Koyu tema yüzü ters çeviriyor, ve çevirmek zorunda

İki temada da geçerli kural şu: YÜZ zeminden en uzak katman, TABAN da marka
lacivert. Açık temanın zemini kâğıt, o yüzden yüz orta-koyuya gidiyor ve beyaz
mürekkep taşıyor. Koyu temanın zemini neredeyse siyah, ve orada beyaz mürekkep
basmayı öldüren şeyin kendisi: dolguyu L\* 47'de tavanlıyor, oysa tabanın sayfadan
ayrışmak için L\* 26'ya çıkması gerekiyor. Geriye iki katman arasında en çok 21
ΔL\* kalıyor, yani açık temanın zaten sahip olduğundan az. Koyu mürekkep o tavanı
kaldırıyor, yüz L\* 66'ya çıkıyor, ve katmanlar 50 ile ayrışıyor. Ton açık temanın
284°'si yerine 272°: yüksek açıklıkta 284° periwinkle okunmaya başlıyor, 272° ise
sade mavi kalıyor.

### Marka lacivert KALKTI, ve kalkması bütün mesele

Bir taban aynı anda iki şeyi geçmek zorunda: üstündeki yüzü ve arkasındaki zemini.
Açık tema ikisini de yardımsız hâlledi (kâğıttan 79 ΔL\*, yüzden 29). Koyu temaya
olduğu gibi düşürüldüğünde `#12245c` yüzü 50 ile geçiyor ama sayfayı yalnız 10 ile:
sayfaya gömülüyor ve düğme tabanını tamamen kaybediyor. Yüzün yanında parlak olmak
yetmiyor, gözle görülür biçimde SAYFA OLMAMASI da gerekiyor. L\* 30 sayfadan 24
kazanıyor ve yüzden 36'yı hâlâ bırakıyor.

---

## Punto artık gövdede

Kit `--text-body: 13px`i "varsayılan: satırlar, hücreler, gövde metni" diye
tanımlıyordu ama hiçbir yer onu `body`ye uygulamıyordu. Sonuç: sınıfı olan her
metin ölçekte, sınıfı olmayan her metin tarayıcının 16 pikselinde, yani aynı
ekranda iki ayrı ölçek. Doküman sitesinde görünmedi çünkü o kendi okuma ölçeğini
yazıyor; bir tüketici panelinde tablo hücreleri %23 büyük çıktı ve fark oradan
yakalandı.

Tüketici kendi ölçeğini isterse yine yazabiliyor: bu bir varsayılan.

---

## Yüzeyler

### Çalışma yüzeyi · bir ekranı tutan tek kart

Etrafındaki kabuk (ray, başlık, zemin) tamamen `--color-page` ve arada ayırıcı bir
çizgi yok, yani tek bir sürekli çerçeve olarak okunuyor. Bu, o çerçevenin üstündeki
tek şey, ve kart yarıçapı değil KONTROL yarıçapını almasının sebebi bu: bu boyutta
daha keskin köşe onu bir düzlem olarak okutuyor, ve içindeki düğmelerle aynı ailede
tutuyor. Daha yumuşak bir köşe bütün ekranı bir widget gibi gösterirdi.

### Ekranın kutusu ayrı bir sınıf, ve sıra önemli

`tamga-surface`ın üstüne yalnız köşeyi yazıyor. Ayrı olması, yüzeyin her
kullanımının bu köşeyi almamasından: bir kod bloğu da, bir alt panel de
`tamga-surface`, ve onlar kontrol ölçeğinde kalmalı.

SIRA ÖNEMLİ, ve bir süre yanlıştı: bu blok `tamga-surface`ın ÜSTÜNDEYDİ. İkisi aynı
özgüllükte `border-radius` yazıyor, yani sonra gelen kazanıyor, ve ekranın kutusu
sessizce kontrol köşesine (6px) düşüyordu. Kimse fark etmiyordu, çünkü 6 ile 10
arasındaki fark yalnız yan yana konunca görünüyor. Buraya yeni bir kural
eklenecekse bu sınıfın ALTINA eklenmeli.

### Kırpmayı kapatan kaçış yolu

`.tamga-card`ın `overflow: hidden`ı tabloların köşe yuvarlaması için gerekli, ve
aynı satır kartın İÇİNDE açılan her paneli kesiyor: bir Combobox listesi, bir
DatePicker takvimi, bir satır menüsü. Panel çalışıyor, tıklanıyor, ama yarısı
görünmüyor. Z-index bunu çözmez; hiçbir yığın sırası bir `overflow` kırpmasını
aşamaz.

`CellActions` aynı tuzağın tablo hücresi karşılığıydı ve ayrı çözülmüştü; bu, kart
seviyesindeki hâli.

### Başlık şeridi kendi zemininde

Öncesinde kartın gövdesiyle aynı yüzeydeydi ve başlığı gövdeden ayıran tek şey
boşluktu. Zemin `page`: kartın bir basamak altı, yani şerit kartın İÇİNE gömülmüş
gibi okunuyor. Ölçüldü, tasarım diliyle aynı fark (ΔL\* 3.0'a karşı 2.7).

İKİ SINIF BİRDEN ARANIYOR, yalnız `tamga-head` değil. Kapatan çizgiyi
`tamga-section` veriyor ve kart başlıkları ikisini birlikte taşıyor; `Disclosure`
ise yalnız `tamga-head` kullanıyor. Tek sınıfa yazıldığında akordeon başlıkları da
hiç istemedikleri bir şerit ve çizgi kazanıyordu.

---

## Kayan bir ray, yükselen bir kontrolü kırpar

Ölçülen hata: menüsü uzun olan bir kenar çubuğunda `overflow-y: auto` gerekiyor,
ama CSS bir eksende `visible` dışında bir değer görünce ÖTEKİ ekseni de `auto`ya
çeviriyor. Yani dikey kaydırma isteyen bir kap yatayda da kırpıyor, ve seçili ray
girişinin 2 piksellik sert kaydırması tam kenarda kesiliyor: düğme sağdan ve alttan
eksik görünüyor. Hover'da kaydırma 3 piksele çıkıyor, basılınca yer değiştiriyor,
ve üçü de kırpılıyor.

Çözüm z-index DEĞİL: hiçbir yığın sırası bir `overflow` kırpmasını aşmaz.
Kaydırmanın sığacağı yer AÇILIYOR (`--offset-room`, kaydırmadan bir fazla).

---

## Basma fiziği

### Basma anında, dönüş yumuşak

İki yön de aynı 100ms yumuşamayı kullanıyordu, ve bir dokunmatik yüzey DOKUNUŞUNDA
bu basmanın hiç görülmemesi demekti: `:active` bir dokunuşta 10 ile 40ms sürüyor,
yani kontrol yolun üçte birine inip geri dönüyordu. Fiziksel bir tıklamayı basılı
tutmak ona tam 100ms veriyor, ve aynı düğmenin tıklamada doğru, dokunuşta ölü
hissettirmesinin sebebi buydu.

Artık basma anında, yalnız DÖNÜŞ animasyonlu. 15ms'lik bir dokunuş bile kontrolü
tamamen dibe indiriyor, ve gözün tıklama olarak okuduğu şey 100ms'lik geri
yüzüşün kendisi: algı hareketi istiyor, bekleyişi değil.

Değişen tek şey süre. Yol, gölge ve renk aynı.

### Basma yolunun tıklama kaybı

Yükselmiş bir kontrol basılınca sağ aşağı gidiyor: düğme ailesinde hover −1,−1 ve
`active` +4,+4, yani kutu imlecin altından 5 piksele kadar çıkıyor. `transform`
TIKLAMA ALANINI da birlikte taşıyor, yani üst ya da sol kenar boyunca o bandın
içinde duran bir imleç, düğme geri kalktığında ebeveynin üstünde kalıyor.
`mousedown` düğmeye iniyor, `mouseup` kabına iniyor, ve bir `click` olayı hiç
doğmuyor: kontrol hiçbir şey yapmıyor.

Dokunmatik yüzeyde fiziksel tıklamaya göre çok daha sık görünüyor: bir dokunuşun
bekleme süresi yok ve parmak bir iki piksel kayıyor, gerçek bir tıklama ise kutu
hareket ederken imleci sabit tutuyor. Aynı kusur, başka olasılık, ve "dokunma
bozuk" diye okunmasının sebebi tam olarak bu.

Çözüm, yol mesafesi kadar yukarı ve sola uzanan bir tıklama genişleticisi.
`transform` ile birlikte gidiyor, yani kontrol hareket ettikten sonra tam olarak
geride bıraktığı yeri kaplıyor. Yalnız yukarı ve sola büyüyor, asla aşağı ya da
sağa: o yüzden bir satırdaki ya da sütundaki sonraki kontrole uzanamıyor.

### İki fizik, tek gramer

**YÜKSELEN** sayfanın üstünde duruyor, ve basmak onu geri indiriyor: 1px kenar + N
px sert offset, basınca offseti yürüyüp onu çökertiyor. Düğmeler, kartlar, ray
satırları, segmentler, birincil eylem.

**OTURAN** yüzeyinin parçası ve hiç kalkmıyor. Cevabını DOLDURARAK ya da bir kural
çizerek veriyor, yol alarak değil. Sekmeler (alt çizgi), anahtarlar (dolu ray),
onay kutuları ve radyolar (dolu kutu), çipler (yalnız kenar, ve çip etkileşimli
bile değil).

Ayrım süsleme değil. Bir sekme sayfanın üstünde duran bir nesne değil, şeridin
parçası; onu "aşağı" itmek ne olduğu hakkında yalan söylemek olurdu. Tüketen bir
ürün iki fiziği başka adlarla anabilir; eşleşmek zorunda olan şey gramer, sınıf
adları değil.

Buradan çıkan kural: DERİNLİK BASILABİLİR DEMEK. Basılamayan hiçbir şey offset
almıyor, ve çipin kısa süre taşıdığı offseti kaybetmesinin sebebi tam olarak bu.

---

## Düğme varyantları

### Renkli varyantlar ayrı yazılı, ve yazılmak zorunda

Katmanın OFFSETİ boya ait (3px), RENGİ varyanta. İkisini tek kuralda birleştirecek
şey bir değişken (`--layer`) olurdu ve o yol kapalı: `check-physics` offseti düz
sayı olarak okuyor, `var()` gördüğü kuralı sessizce ATLIYOR. Sessizce atlanan bir
kural, kapının artık bakmadığı bir kural demek, ve dokuz satır fazladan yazmak
körleşmiş bir kapıdan ucuz.

İki sınıflı seçici tek sınıflıyı yeniyor, o yüzden bu blok varyantların üstünde
durmasına rağmen sıra önemli değil.

### Başarı ve tehlike aynı nesnenin iki rengi

İkisi de çerçeveli, asla dolu değil. Dolgu bir sayfadaki tek birincil eyleme ait:
bir taslağı yayınlamak ve bir kaydı silmek ikisi de önemli, ama ikisi de O eylem
değil, ve doldurmak bir görünüme iki bağıran düğme koymak olurdu.

Bu kural bir süre hiç yoktu: sınıf beş yerde kullanılıyor ve hiçbir yerde
tanımlanmıyordu, yani her "success" düğmesi sessizce nötr çiziliyordu. Yeşil
çözülmüş olana ait, ve bu düğme tam olarak onu yapıyor: çözülmüş renginin bir
kontrole dokunduğu tek yer.

### Sessiz durur, dokunulunca düğme olur

Eski kural "kenar yok, offset yok, dolayısıyla yükselme YOK" idi ve gerekçesi şuydu:
vazgeç ile kapat yoldan çekilmeli, yükselen her şey yanındaki eylemle yarışır.
Birinci yarısı hâlâ doğru ve duruyor: bu düğme DURURKEN bir nesne değil, düz bir
yazı.

Değişen ikinci yarısı. Ölçüldü: sınıf gerçekte vazgeç, kaldır ve sil için
kullanılıyor, yani tıklanacak şeyler. Hiç yükselmeyen bir kontrol, hover'da
tıklanabilir olduğunu söylemeyen tek kontroldü; kullanıcı onu bir etiket sanıyordu.
Artık sessizlik DURUŞTA, düğmelik ise DOKUNULDUĞUNDA: imleç geldiğinde kenarını ve
tabanını kazanıyor. Yarışma sorunu doğmuyor, çünkü yarışma dururken olur ve hover
tek seferde tek nesnede.

TABAN 2px, ailenin 4'ü değil: bu düğme ikincil olanın yanında duruyor ve onun kadar
yükselirse "hangisi asıl eylem" sorusu yeniden bulanıyor.

---

## Alanın içindeki ve yanındaki kontroller

### Sayı girdisinin okları bir spinner, mini düğme değil

`mini-btn` KULLANILAMAZ ve ilk sürüm onu kullanıyordu: o 32×32 bir kontrol, ikisi
üst üste 65 piksel ediyor, girdi ise 40. Oklar kutunun dışına taşıyordu; çalışıyorlardı
ama alanın içinde durmuyorlardı.

Bir spinner ayrı bir şekil: alanın SAĞ KENARINA yapışıyor, yüksekliğini ondan alıyor
ve kendi kutusu yok, girdiden tek bir dikey kuralla ayrılıyor. Yükselmiyor, çünkü bu
boyutta bir offset kenardan taşıyor (mini düğmenin yükselmemesiyle aynı gerekçe,
Yasa 1'in boyut istisnası).

### Alanın içindeki kontrol yükselmiyor

Parola gözü, temizle, kopyala. Sebebi Yasa 1: yükselen bir nesne KÂĞIDIN üstünde
durur, başka bir yükseltinin üstünde değil. Buraya `tamga-mini-btn` konmuştu (1px
kenar + 1px sert offset) ve zaten yükselmiş bir alanın içinde ikinci bir yükselen
nesne oluyordu: kendi zemini olmayan, üstüne cıvatalanmış gibi duran bir kutu.

Çözüm ŞEKLİ DEĞİŞTİRMEK değil, İLİŞKİYİ düzeltmek: bu düğme alanın yanında değil,
alanın PARÇASI. O yüzden `.tamga-stepper`in dilini konuşuyor: sağ kenara yapışıyor,
çerçevesi yok, yalnız soldan bir ayraç, ve alanın köşe yarıçapını sürdürüyor.

Yasa 2 de aynı yöne çıkıyor: sayfada tek dolu ya da yükselen şey birincil eylem
olur, ve parolayı göstermek birincil eylem değil.

### Alanın içindeki mini düğme düz, ve her zaman düz

Kendi sert offsetini taşıyan çerçeveli bir kutu, başka bir çerçeveli kutunun içine
konduğunda kabından kaçmış bir kontrol gibi okunuyor: offset tam olarak alanın kendi
kuralına iniyor ve iki kenar çarpışıyor. Burada nesne ALANIN kendisi, ve içinde duran
şey o nesnenin üstündeki ikinci bir nesne değil bir TUTAMAK (Yasa: derinlik
basılabilir demek, ve basılan şey alanın kendi imkânı).

Düğme ailesi koyu 1.5px kenar ve 2px offsete çıktığında ortaya çıktı: bir düğmeyi
nesne gibi okutan aynı değişiklik, alan içindeki düğmeyi kutu içinde kutu gibi
okutuyordu.

### Çok satırlı hâli · seçici `textarea`, modifier değil

`.tamga-input` `padding: 0 16px` taşıyor ve tek satır için bu DOĞRU: sabit `height`
metni zaten dikeyde ortalıyor, dikey padding eklemek onu bozardı.

Ama bir `<textarea>` aynı sınıfı alıp yüksekliğini `rows`tan aldığında o sıfır padding
görünür bir hataya dönüşüyor: ilk satır üst kenara YAPIŞIYOR. Aynı sınıfın iki farklı
yükseklik modelinde farklı davranması gerekiyor, ve ayrım elemanın kendisinde. O
yüzden seçici `textarea`, bir modifier değil: çağıranın hatırlaması gereken bir sınıf
olsaydı, unutulduğu her yerde metin kenara yapışırdı.

### Birimli alan

Değerin yanında duran sabit bir sözcük: "₺", "adet", "%". Bir sayı kutusu tek başına
ne ölçtüğünü söylemiyor ve kullanıcı birimi açıklamadan okumak zorunda kalıyor. Yer
tutucuya yazmak da olmuyor, çünkü değer girildiği an kayboluyor.

KUTU KENARI GRUBUN, alanın değil. İçerideki girdi kenarsız: iki kenar iç içe
geçtiğinde çift çizgi çıkıyor ve grup bir alan gibi okunmayı bırakıyor. Odak da
grubun, çünkü klavye içerideyken çerçevenin TAMAMI sertleşmeli, yalnız ortası değil.

### Küçük alan · neden ayrı bir ölçü değil

Yoğun bir yerdeki alan: bir tablo başlığındaki filtre satırı, bir araç çubuğu, bir
satır içi düzeltme. 32 piksel `.tamga-btn-sm` ile AYNI basamak, ve bu tesadüf değil:
filtre kutusunun yanında duran "Temizle" düğmesi de `sm` oluyor, ikisi aynı satırda
birbirini tutuyor. Yeni bir yükseklik uydurmak, yan yana gelen iki kontrolün 2 piksel
kayması demekti.

NE ZAMAN KULLANILMAZ: bir formun kendi alanları. Orada alan ASIL iş ve 40 piksel onun
hakkı; küçültmek yalnız yardımcı bir yüzeyde, verinin kendisinden daha çok yer
kaplamasın diye.

---

## Sayfalayıcı

### Sayfa düğmesi `.tamga-option` kullanamaz

İlk sürüm onu kullanıyordu, üstelik kodun yanındaki yorumda "seçili sayfa dolgu
almaz" yazarken. Yorum doğruydu, sınıf yalanlıyordu:
`.tamga-option[data-selected]` bir DOLGU ve sola oturan bir iç iz veriyor. Sonuç
ekranda üç ayrı yanlış oldu: dolu bir blok, sayının solunda başıboş duran dikey bir
çizgi, ve `width: 100%` olduğu için esneyen bir kutu.

Sayfa düğmesi rail'in dilini konuşuyor: seçili olan YÜKSELMİYOR, oturuyor. Kabuk
zemini, aksan kenarı, 2px sert offset. Yasa 2: "buradasın" bir eylem değildir.

### Her sayfa yükselmiş bir nesne, seçili olan basılmış

Bu bir tersine çevirme. Önce tersiydi: sayfalar düz yazıydı, seçili olan kenar ve
taban kazanıp YÜKSELİYORDU. Yükselmiş bir şey "beni tıkla" diyor, oysa seçili sayfa
zaten tıklanmış olan: kullanıcıya yapabileceği tek şeyi yanlış gösteriyordu. Tasarım
dili bunu fizikle söylüyor, hepsi birer tuş ve biri basılı. Yasa 2'nin kendisi.

MONO, çünkü okunan şey bir sözcük değil bir SAYI, ve yan yana duran rakamların aynı
genişlikte olması sırayı taranabilir yapıyor.

---

## Filtre satırı

Alanlar sığmayınca sarıyor, ve sona tek başına düşen bir alan bütün genişliğe
yayılıyordu: bir seçim kutusu 1200 piksel, yanında boş bir düğme. Tavan yarım satır,
yani sona düşen iki alan onu eşit bölüşüyor.

Boşluk burada bir özel özellik olarak duruyor ve tavan ONDAN türetiliyor. İki
bağımsız sayı olarak yazıldığında satırın boşluğu ilk değiştiğinde kayıyorlar, ve
kayma bir alan komşusunun yanına oturmak için bir piksel fazla genişleyene kadar
görünmüyor.

TAVAN İKİ KURALIN KÜÇÜĞÜ, ve ikinci kural sonradan geldi. Önce yalnız "yarım satır"
vardı. Yetmedi: satır başına ÜÇ alan düştüğünde hiçbiri yarım satırı aşmıyor ama üçü
birden 450'şer piksele yayılıyor, ve bir seçim kutusu 450 piksel genişliğinde bir
liste değil bir alan gibi okunmayı bırakıyor. Mutlak tavan bunu kapatıyor: bir kutu
ne kadar yer kalırsa kalsın 20rem'i geçmiyor, artan boşluk sağdaki düğmeye gidiyor.

---

## Seçim kutusu

### Doluysa koyu, boşsa soluk

Kitte `Select` bir `Button` olarak çiziliyordu, yani her zaman koyu kenarlı ve
katmanlı. Bir filtre çubuğunda yedi tanesi yan yana gelince ekran kara kutularla
doluyor ve hangisinin DOLU olduğu okunmuyordu, oysa bir filtrenin taşıdığı tek bilgi
tam olarak bu.

Tasarım dilinin kuralı: boş bir seçim kutusu bir alan gibi duruyor (soluk kenar,
tabansız), değer seçildiği an bir nesneye dönüşüyor (koyu kenar, 2px taban). Böylece
dolu filtreler ekrandan kendiliğinden öne çıkıyor.

### Değeri olan seçim yükselmiyor

Bir süre yükseliyordu. Bir filtre çubuğunda dolu olanlar taban kazanınca, boş
olanların yanında iki üç kutu birden bağırıyordu: aynı satırda aynı işi yapan
kontroller ayrı yüksekliklerde duruyordu. Üstelik bilgi zaten İKİ KEZ söyleniyor,
çubuğun altındaki uygulanan-filtre çipleri de onu söylüyor.

Tasarım dilinde bu kontrolün yükselmesi bir şey daha demek: AÇIK. O yüzden taban
`aria-expanded`a taşındı, ve "değeri var" yalnız çizginin sertleşmesiyle söyleniyor.

### Açık hâl · katman yumuşak vurguda

Kenar sertleşiyor ve taban beliriyor: panelin nereden açıldığını söyleyen şey bu.
Katmanın vurgu renginde olması Yasa 1 · D'nin adlandırılmış istisnası. Tasarım
dilinin kendi token'ı (`--focus-ring`) bunu sistematik olarak tanımlıyor: odaklanan
ya da açılan bir kontrolde offset bir yükseklik değil bir SİNYAL. Yasa önce
dokümanda değişti (/docs/fizik · "Tek istisna"), sonra kapıda, ve kapı renge değil
TOKEN ADINA bakıyor; yoksa her bileşen kendi rengini seçmeye başlardı.

---

## Kod bloğu, yazar metni, editör

### `Code`un dış kutusu

KOPYALAMA DÜĞMESİ MUTLAK KONUMLU ve sağ üste sabitli. Tek satırlık bir gövdede bu bir
hataya dönüşüyordu: kutu 42 piksel, düğme 32, üstte 9 altta 1.5 kalıyordu, yani düğme
ortalı değil ALTA YAPIŞIK görünüyordu.

İki kural birlikte çözüyor. `min-height` düğmenin altına ve üstüne eşit boşluk
bırakacak kadar yer açıyor (8 + 32 + 8), ve dikey ortalama tek satırlık gövdeyi o
yüksekliğin ortasına alıyor, yani metnin ortası ile düğmenin ortası aynı yere
düşüyor. Çok satırlı bir gövdede kutu zaten daha uzun: ortalamanın etkisi kalmıyor,
düğme sağ üstte kalıyor, ve orası bir kod bloğu için doğru yer.

### Yazar metni · bir sınıf, bileşen değil

Bir ürünün açıklaması, bir bilgi tabanı yazısı, bir notun gövdesi: kitin
denetlemediği, insanın yazdığı HTML. Buraya gelen şey zaten bir HTML dizgisi;
sarmalayan bir bileşen ona `dangerouslySetInnerHTML`den başka bir şey yapamaz, ve o
kararı çağıran vermeli. Kitin katkısı biçim: gelen etiketler kitin kendi ölçeğinde ve
kendi renginde çizilsin.

NE TEMİZLEMEZ: bu bir güvenlik sınırı DEĞİL. Hangi etiketin geçeceğine ürün karar
veriyor, çünkü beyaz liste ürünün vitrinine ait bir kural.

SIFIRLAMA GEREKİYOR, çünkü tarayıcının kendi başlık ve liste ölçüleri kitin
ölçeğiyle ilgisiz: `h3` 1.17em, `ul` 40 piksel girinti. Ölçek dışından gelen bir
sayı, uydurulmuş bir sayı kadar yanlış.

### Editör · araç çubuğu ile alan tek kutu

Çubuk ile alan AYRI ÖĞELER ama TEK bir kenarlık taşıyorlar: iki ayrı kutu,
aralarındaki çift çizgiyle "burada iki şey var" der, oysa burada bir tane var.

ODAK DIŞ KUTUDA. Yazılan yer içerideki `contenteditable`; odak halkası ona verilirse
çubuk halkanın dışında kalıyor ve kontrolün sınırı belirsizleşiyor. `:focus-within`
odağı dışarı taşıyor.

---

## Odak

Odak bir basamak büyüdü (2 ile 3 arası) ama RENGİ tek kaldı. Tasarım dilinde odak
"koyu kenar + soluk katman" diye çiziliyor; Yasa 1'in D kuralı buna izin vermiyor ve
vermemeli, çünkü kenar ile offset aynı nesnenin iki yüzü ve iki renk olduğunda gölge
nesneden kopuyor. Kapı bunu yazarken yakaladı. Seçilen renk `accent-line`, çünkü bir
odak halkasının işi "buradasın" demek ve o cümleyi vurgu rengi taşıyor; `edge-strong`
bunu nötr bir kenar gibi okuturdu.

Odak katmanında kenar KOYULAŞIYOR, katman YUMUŞAK VURGUDA kalıyor, ve bu Yasa 1 ·
D'nin adlandırılmış istisnası (doküman sitesi /docs/fizik). Buradaki offset nesnenin
ne kadar yükseldiğini değil KLAVYENİN NEREDE olduğunu söylüyor, yani bir yükseklik
değil bir sinyal. Kenarı da vurguya boyamak denendi ve alan bir hata gibi okunuyordu:
renkli bir çerçeve bu dilde "bir şey yanlış" demek. Kenar sertleşiyor (nesne
uyanıyor), katman renkleniyor (sinyal).

---

## Çipler

### Çip DÜZ, ve bu utangaçlık değil taşıyıcı bir karar

Bu sistemde derinlik "buna basabilirsin" demek, yani yükselmiş bir çip
veremeyeceği bir basmayı vadediyor. İki gün boyunca 2px offset taşıdı ve sorun tam
olarak o vaatti: bir durum etiketinin hiçbir yeri tıklanabilir değil. Ağırlık bunun
yerine kendi renginde 1px kenardan geliyor. Gerçekten basılması gereken bir şey çip
olmayı bırakıp mini düğme oluyor, ki o zaten var ve zaten yükseliyor.

### Kenarı yok

Bir süre `1px solid currentColor` vardı, yani çipin kendi metin rengiyle çizilmiş bir
çerçeve. Sonuç tasarımın yumuşak yıkaması değil, ton renginde bir KUTU oluyordu: bir
listede alt alta on tane durduğunda on çerçeve, ve göz duruma değil kutulara
takılıyordu. Çipi ayıran şey yıkamasının kendisi; çerçeve o yıkamayı bir nesneye
çeviriyor, oysa çip bir nesne değil bir İŞARET.

### Kaldırılabilir çip, durum çipi değil

`.tamga-chip` okunan bir işaret: kendi metniyle aynı renkte ince bir çizgi ve hiç
yüksekliği yok, çünkü basılmıyor. Bu ise TUTULAN bir şey (bir etiket, uygulanan bir
filtre) ve kaldırılabildiği için nesne fiziğinde.

Önce ikisi aynı sınıftı ve içine kitin `MiniButton`ı konuyordu: kenarlı bir kutunun
içinde kendi kenarı ve tabanı olan ikinci bir kutu, yani üst üste iki nesne. Tasarım
tersini yapıyor: YÜKSELEN dış çip, içinde kenarsız düz bir kare.

---

## Aktif sekme çizgisi sekmenin kendi kenarlığı

Önce şöyleydi: `position: absolute; bottom: -1px`, yani işaret sekmenin kutusunun BİR
PİKSEL ALTINA çiziliyordu ve şeridin kendi alt çizgisinin üstüne oturuyordu. Duran bir
şeritte doğru görünüyor.

Ama şerit KAYDIRILABİLİR olduğu anda kayboluyor. `overflow-x: auto` veren bir kap, CSS
gereği `overflow-y`yi de `auto` yapıyor (bir eksen `visible` değilse öteki de olamaz),
ve kutunun dışına çizilen o bir piksel kırpılıyor. On dokuz sekmeli bir şeritte aktif
sekme işaretsiz kalıyordu: şerit kitin şeridine "benzemiyordu" ve sebebi buydu.

Kenarlık kutunun İÇİNDE, yani kırpılacak bir taşma yok. Saydam bir kenarlık her
sekmede duruyor ki aktif olunca yükseklik değişmesin.

---

## Bildirim ters yüzeyde

Bu bir kez denenip geri alınmıştı. İlk denemede zemin `--color-ink`ten geliyordu ve
koyu temada mürekkep açıldığı için bildirim orada ters dönüyordu (açık kutu, koyu
yazı); ton işaretleri de koyu zeminde 1.99 ile 2.79 veriyordu, 3:1 eşiğinin altında.
Eksik olan şey bir karar değil bir TOKEN'dı: iki temada da koyu kalan bir yüzey
(`--color-inverse`) ve o yüzey için üretilmiş ton mürekkepleri (`--color-*-inverse`,
ölçüm 8.1 ile 10.5 arası). İkisi de artık var.

Katman vurgu renginde, kenarla aynı değil: Yasa 1 · D'nin adlandırılmış istisnası,
çünkü buradaki offset "bu kutu yüksek" değil "buraya bak" diyor.

---

## Adım şeridi · üç durum, üç fizik

Önce üçü de aynı şeydi: ince kenarlı bir daire, yalnız rengi değişiyordu. Renk tek
başına bir hiyerarşi kurmuyor, ve daire kitin hiçbir yerde kullanmadığı bir şekil. Kit
tam yuvarlağı yalnız avatarda ve noktada kullanıyor; bir adım işareti bir kontrol
boyunda bir işaret, o yüzden kontrolün yarıçapını alıyor.

    gelecek   düz durur: henüz bir şey olmadı
    şimdiki   YÜKSELİR: 2px sert kaydırma, aksan renginde · buradasın
    biten     OTURUR: dolu aksan, kaydırma yok · bitmiş bir iş kalkmaz

ÇİZGİ DE BİLGİ TAŞIYOR. Geçilen aralık aksan, kalanı kenar rengi: şerit yalnız
adımları saymıyor, ne kadar yol alındığını da gösteriyor. Bir ara 1px
`--color-line` idi ve kâğıdın üstünde neredeyse görünmüyordu.

---

## Seçenek işareti ve kabukları

### İşaret ilk satırın ortasına

Etiket tek satırken kutuyu dikeyde ortalamak doğru duruyor; altına bir açıklama satırı
eklenince işaret İKİ SATIRIN ortasına kaçıyor ve neyi işaretlediği belirsizleşiyor.
İşaret ilk satıra ait.

Sayı UYDURULMUYOR, satırdan hesaplanıyor: `1lh` öğenin kendi satır kutusu, `18px` de
işaretin boyu (yukarıdaki kuralın kendisi), ve fark ikiye bölününce işaret ilk satırın
tam ortasına oturuyor. Punto ya da satır aralığı değişirse hizalama kendiliğinden
düzeliyor.

### Kabuklar · aynı radyo grubunun iki başka biçimi

Değişen tek şey kabuk. Rol de (`radiogroup`/`radio`), işaret de, klavye davranışı da
aynı kalıyor, çünkü değişen görünüm, anlam değil. Bir tüketici "N'den biri"ni çip ya
da kart olarak çizmek istediğinde elinde yalnız sınıflar olsaydı rolü de klavyeyi de
kendi kurmak zorunda kalırdı, ve o iş her seferinde eksik yapılıyor.

SEÇİM ÇERÇEVEYLE, DOLGUYLA DEĞİL (Yasa 2). Seçili kabuk `accent-line` kenarı ve aynı
renkte 2px sert offset alıyor: kitin tema kartlarının zaten yaptığı şeyin aynısı, iki
yerde iki ayrı seçim dili olmasın diye.

### Seçili kart kenarla söylüyor, vurgu rengiyle değil

Uzun süre vurguylaydı (`accent-line` kenar + 2px katman) ve iki kusuru vardı.
Birincisi kitin geri kalanıyla çelişmesi: renk kutusu, tema kartı, ray satırı ve
segment, hepsi seçimi `--color-edge` ile ve yükselerek söylüyor, yalnız bu ikisi renk
değiştiriyordu. İkincisi markadan markaya kayması: açık bir markada `accent-line` ile
`edge` neredeyse aynı renge düşüyor ve seçim kayboluyor.

Yükseklik 3px: kart bir düğme değil bir SEÇİM, düğmenin 4px'inden bir basamak altta
duruyor.

---

## Anahtarın topuzu mutlak konumlu, esnek değil

Önce `inline-flex` + `padding: 2px` + `translateX(N)` ile kuruluyordu, yani topuzun
yolu üç sayıdan hesaplanıyordu: ray genişliği eksi kenar eksi dolgu eksi topuz. İkinci
bir boy eklendiğinde (tablo anahtarı) o hesap ikinci kez yazıldı, ve aynı
özgüllükteki iki kural birbirini ezdi: küçük anahtarın topuzu büyüğün yolunu alıp
raydan TAŞTI.

Tasarımın modeli bu değil: topuz `position: absolute` ve `top`/`left` ile duruyor. Her
boy kendi iki sayısını söylüyor, hiçbir şey hesaplanmıyor, ve bir boy ötekini
ezemiyor.

---

## İskelet ve ilerleme

İskelet nefes alıyor, asla parlamıyor. Süpüren bir gradyan varsayılan-SaaS işareti ve
bu üründe başka hiçbir yerde gradyan yok, yani buradaki tek istisna olurdu. Üstelik
hiçbir şeyin gelmemiş olması bütün mesele olan bir sayfada en gürültülü şey olurdu.
İki blok, bir değil: zemin hiç animasyon almıyor, yalnız üstündeki çubuk alıyor. Bu,
şeklin altında bir taban bırakıyor, yani döngünün her noktasında bir yer tutucu olarak
kalıyor, sayfaya doğru solup geri gelmiyor.

İlerleme bir çubuk değil bir GÖSTERGE ÖLÇEĞİ. Çentikler değerin sayıyı okumadan
okunmasını sağlıyor, ki bir göstergenin işi bu. Bilerek segmentli şerit biçiminde
DEĞİL: yatay segmentli bir şerit bir zaman çizelgesidir (kova başına bir işaret, renk
durum) ve aynı şekli tamamlanma için kullanmak onu geçmiş gibi okuturdu. Baştan sona
nötr, çünkü ilerleme tamamlanmayı bildiriyor asla sağlığı değil, ve buradaki bir durum
rengi yanlış bir sinyal olurdu.

Not: 2px offset taşıyor, yani kutusunun dışına boyuyor. Kapta yer ayrılmazsa offset
altındaki şeyin üstüne iniyor.

---

## Satır ve hücre

### Boşluk satırın, çağıranın değil

Bu sınıf yatay dolgu taşımıyordu ve her çağıran `tamga-gutter`ı elle ekliyordu:
ayarlar alt menüsü, iki iskelet, doküman örneği. Beşte beş bir gelenek değil eksik bir
kural, ve altıncı çağıran (bir blok tarifi) onu unutup kenardan kenara çizdi.

`.tamga-table` bunu zaten doğru yapıyordu
(`td:first-child { padding-left: var(--gutter) }`). Bir satır ile bir hücre aynı sol
kuralın üstünde duruyor; birinin hatırlatılmaya ihtiyacı olmamalı.

### Dikey dolgu hücrede, yükseklik satırda

Dolgu bir süre SIFIRDI. Yükseklik tek başına yetiyordu, çünkü her hücre tek satırdı:
20 piksellik metin 56 piksellik bir satırın ortasında kendiliğinden nefes alıyor.
Hücre iki üç satır taşıyınca (ürün adı + varyant + barkod) içerik 56'yı aşıyor ve
satırın üstünde altında hiçbir boşluk kalmıyordu, satırlar birbirine yapışıyordu.

İkisi birlikte doğru çalışıyor: `height` bir TABAN, yani tek satırlık tablolar eski
ritmini koruyor (20 + 24 < 56), çok satırlı hücreler ise dolgusu kadar büyüyor.

### Katman barındıran hücre kendi içeriğini kırpamaz

Yukarıdaki kısaltma üçlüsü (`overflow: hidden` + `nowrap` + `ellipsis`) metin için
doğru ve bir satırın eylem menüsü için ölümcül: panel hücrenin içinde mutlak konumlu,
yani `overflow: hidden` onu hücrenin kenarında kesiyor. Ölçüldü: menü çiziliyor, doğru
görünüyor, ve her tıklamayı yutuyor, çünkü `elementFromPoint` hücreyi döndürüyor.
Eylemlerin kısaltılmaya hiç ihtiyacı yok, o yüzden tablonun her yerde üç noktayı
kaybetmesi yerine hücre üçünden birden çıkıyor.

VE GERÇEKTEN ÜÇÜNDEN. Yorum üç diyordu, kural ikisini sıfırlıyordu: `white-space:
nowrap` duruyordu, ve o miras alınıyor, yani bu hücrenin içinde açılan her panel onu da
miras alıyordu. Bir siparişin ürünlerini listeleyen bir balon her satırı tek bir
bölünemez satırda çiziyor ve kendi kenarının dışına taşıyordu. Katman bozuk
görünüyordu; sebep üç seviye yukarıdaki bir tablo kuralıydı.

KIRPMA VE HİZA AYRI İKİ ŞEY. Bu kaçış uzun süre tek parçaydı ve sağa yaslamayı da
beraberinde getiriyordu, yani sola yaslı bir hücrede bir ipucu ya da açılır panel
barındırmak isteyen, hizasını da feda etmek zorunda kalıyordu. Yakalandığı yer: bir
tüketici listesinde durum rozetinin ipucu hücre kenarında kesiliyordu, ve tek çare
hücreyi sağa yaslamaktı.

SEÇİCİ `.tamga-table td` KADAR SPESİFİK OLMAK ZORUNDA: düz `.tamga-cell-open` (0,1,0)
yazılırsa kırpma kuralı `.tamga-table td` (0,1,1) onu yener ve sınıf hiçbir şey
yapmaz.

### Sıralanabilir başlık büyük harfi kaybediyordu

Sebebi mirasın kesilmesi. Tailwind'in preflight'ı `button { text-transform: none }`
basıyor, yani `th`in `uppercase`i içindeki `SortHeader` düğmesine GEÇMİYOR. Sonuç,
aynı tabloda sıralanabilir sütunların küçük harf, sıralanamayanların büyük harf
olması: gözle bakınca "başlıklar neden karışık" diye okunuyor ve sebebi hiçbir yerde
görünmüyor. `getComputedStyle(th)` hâlâ `uppercase` diyor, yani kusuru ölçüm değil GÖZ
buldu.

### Seçili satır iki adla gelebiliyor

`SettingsTemplate` menüsündeki açık bölümü `data-active` ile işaretliyor (bir GEZİNME
satırı: hangi sayfadasın), liste satırları ise `data-selected` ile (bir SEÇİM: hangi
kayıtları işaretledin). İkisi farklı anlam ama aynı görünüm, ve kural yalnız ikincisi
için yazılmıştı: ayarlar menüsünde hangi bölümde olduğun hiç görünmüyordu. Hiçbir şey
patlamadı, çünkü tarayıcı bilmediği bir nitelik seçicisini sessizce atlıyor.

### Satırın içindeki bağlantı mürekkep renginde durur

`.tamga-link` bir CÜMLENİN içindeki bağlantı, ve orada vurgu rengi doğru çünkü
çevresindeki metinden ayrılması gerekiyor. Bir tablo satırında ise bağlantı satırın
ASIL İÇERİĞİ: ürünün adı, müşterinin adı. Otuz satırlık bir liste otuz renkli metin
oluyordu ve göz hiçbirine takılmıyordu; renk "buraya bak" demeyi bıraktığı an bir
işaret olmaktan çıkıyor.

Tasarım dili bunu böyle çiziyor: duruşta mürekkep ve 600, hover'da vurgu ve altı
çizili. Tıklanabilir olduğu, üstüne gelindiğinde söyleniyor, çünkü bir tabloda zaten
her satırın tıklanabildiği öğrenilmiş bir şey.

---

## KPI karosu

Referans noktası yumuşak karttı (daire ikon rozeti, bulanık gölge, kenar yok);
buradaki karşılığı 1. yasa: 1px kenar, BULANIKSIZ kaymış gölge, ve daire yerine KARE
karo. Kit hiçbir yerde daire kullanmıyor (avatar ve nokta dışında) ve tek bir daire,
kartı ödünç alınmış gösteriyor.

İKON KARONUN ZEMİNİ `--color-hover`, marka rengi DEĞİL. Bir panoda dört karo yan yana
duruyor; dördünün de ikonu marka renginde parlarsa hiçbiri öne çıkmıyor ve göz asıl
bakması gereken sayıyı en son buluyor. Renk kartın kendi verisinin (`accent` şeridi)
ve dikkat isteyen sayının hakkı.

KENAR VE KATMAN `--color-edge`: NESNE çizgisi, ayraç çizgisi değil. Bir ara
`--color-line` yazılmıştı ("yüzeyler soluk" diye) ve iki ayrı işi karıştırıyordu.
`--color-edge` bir NESNENİN dış hattı (kart, karo), `--color-line` iki şeyi ayıran bir
KURAL (kesikli satır çizgisi). İkisi ayrı tonda, nesne çizgisi soğuk ve ayraç sıcak,
ve karo ayracın tonunu giyince kartların yanında başka bir gri gibi duruyordu.

FİZİK YALNIZ TIKLANABİLİR KAROda. `.tamga-kpi-live` bir stil değil bir SÖZ: bu karo
tıklanıyor. Okunan bir karo hover'da yükselirse tıklanabilir göründüğü hâlde hiçbir
şey yapmıyor, ve kullanıcı bir kez tıklayıp bir daha denemiyor. Kaymalar 1. yasanın
kendisi: hover'da −1/−1 ve gölge bir basamak yukarı, basınca duruş offseti kadar
iniyor ve gölge sıfırlanıyor. `--offset-room` tuzağı burada da geçerli: bu karolar bir
ızgarada duruyor ve ızgaranın kendisi kırpmıyor, ama kaydırılan bir kabın içine
konulursa `.tamga-rail-scroll` gibi bir dolgu gerekiyor.

SÜTUN SAYISI KARO SAYISINDAN geliyor (`--tamga-kpi-cols`), ekrandan verilmiyor. Elle
verilen bir sütun sayısı yeni bir karo eklendiğinde yalnız o ekranda güncelleniyor, ve
tek başına kalan bir karo bütün satırı kaplayıp panoyu dengesiz gösteriyor. Dar
ekranda iki sütun, geniş ekranda karo sayısı kadar: bir karo 40 piksellik ikon ve
display boyunda bir sayı taşıyor, üçten dar bir sütunda sayı sarıyor.

---

## Marka rengi kutusu ve tema kartı

### Kutunun kendisi o renk

Önce beyaz bir kutunun içinde 20 piksellik bir renk karesi duruyordu ve çentik bilerek
dışarıda bırakılmıştı; gerekçesi şuydu: "çentiğin kontrastı seçilen renge göre
değişir, açık bir renkte kaybolur". Gerekçe doğruydu, çözümü değil: çentiğin RENGİNİ
renge göre seçmek onu çözüyor (`luminance > 0.4` ise koyu mürekkep, değilse beyaz).
Kazanç büyük: 44 piksellik dolu bir kare rengi altı kat büyük gösteriyor, ve hangisi
seçili sorusu dışarıdan bir kenar rengiyle değil içindeki işaretle cevaplanıyor.
Kenar rengi, seçilen rengin yanında zaten okunmuyordu.

### Hover'da yükselmiyor, basıldığında oturmuyor

İkisi de denendi. Kutunun duruş yüksekliği iki farklı sayı (seçilmemiş 0, seçili 4), ve
tek bir hover merdiveni ikisine birden uymuyor: seçilmemişe göre ayarlanan hover,
seçili kutuyu fare üstüne gelince ALÇALTIYOR. Kapı bunu Yasa 1 · F ve E ile yakaladı,
ve haklıydı. Kutunun söyleyeceği tek şey zaten seçili olup olmadığı; onu da yükselerek
ve içindeki çentikle söylüyor.

### Tema kartı · panelin minyatürü

"Açık · Koyu · Sistem" üç kelimeydi, ve bir tema seçimi kelimeyle yapılmıyor:
kullanıcı sonucu görmek istiyor. Her seçenek panelin minyatürünü çiziyor (ray, gövde,
satırlar) ve "Sistem" ikisini bir karede yan yana gösteriyor, çünkü anlamı tam olarak
bu.

MİNYATÜR SABİT RENKLERLE, ve kitin tek istisnası bu. Seçenekler o an yürürlükteki
temayı değil SEÇİLİRSE ne olacağını gösteriyor; token kullanılsaydı üçü de aynı
görünürdü. Tek token: marka vurgusu, çünkü önizlemenin yarısı o.

---

## Görünüm ekranının düzeni

Beş ayrı kart DEĞİL, ve bir süre öyleydi: her bölüm kendi `SettingsPanel`i olan, sol
kenarında marka şeridi taşıyan bir kart. İki kusuru vardı. Birincisi RİTİM: beş kart
beş kez "yeni bir konu başlıyor" diyor, oysa beşi de tek bir konunun (panelin
görünüşü) parçaları. İkincisi HİZA: başlık üstte kontrol altta duruyordu, yani göz her
bölümde bir aşağı bir yukarı zikzak çiziyordu.

Tek kart, kesik ayraç, iki sütun: başlıklar tek bir sütunda, kontroller tek bir
sütunda.

---

## Biletin ayracı

PERFORASYON olarak çizilmişti: "buradan yırt" anlamında kesik bir kural. Temasta
yanlış çıktı, çünkü kesikli zaten "henüz gerçek içerik değil" demek (logonun sınır
kutusu). Aynı işaretin ikinci bir anlamı, bitmiş bir boş durumu bir yer tutucu gibi
okutuyor, ki söylediğinin tam tersi. Düz, kenar renginde, her ayraç gibi. Burada da
değiştirildi ki ikisi ayrışmasın: kopyası kendisiyle çelişen bir kit, kit değildir.

---

## Seçim çubuğu bir ada, şerit değil

Bir tablonun tepesinde tam genişlikte olduğunda, zaten bantlardan kurulu bir ekranda
bir bant daha oluyordu ve taşıdığı sayı aralarında kayboluyordu. Derli toplu,
yükselmiş bir ada olarak GELMİŞ bir şey gibi okunuyor, ki bir seçim tam olarak bu. Ters
zemin de bir ipucunun ters zemini olmasıyla aynı sebeple: içeriğin üstünde, parçası
değil.

`absolute` değil `sticky`: `absolute` tüketicinin sahip olmak için hiçbir sebebi
olmayan konumlanmış bir ata istiyor, ve yanlış olduğunda çubuğu sessizce sayfanın en
altına düşürüyor. `sticky` gerekmediği yerde hiçbir şeye mal olmuyor.

---

## Maskot süzülür, asla nabız atmaz

Ve bu ayrım, bir maskotun işaret ateşiyle aynı ekranı paylaşabilmesinin bütün sebebi.
Yasa 3 nabız atan tek şeyin işaret ateşi olduğunu söylüyor. Maskot muaf, çünkü başka
bir KANALDA hareket ediyor: işaret ateşi PARLAKLIK değiştiriyor, maskot KONUM.
Göz bir parlaklık değişimini "buraya bak", yavaş bir sürüklenmeyi de "bu şey canlı"
diye okuyor, yani ikisi aynı dikkat için yarışmıyor.

Bu muafiyetin bedeli: bu animasyon asla `opacity`ye dokunmamalı. Dokunduğu an maskot
ekrandaki tek gerçek sinyalle yarışmaya başlıyor.

---

## Kaydet şeridi · neden `::after`

`position: sticky; bottom: 0` şeridin alt kenarını yüzeyin İÇERİK kutusuna hizalıyor,
ama bir yüzey kendi alt dolgusunu taşıyor ve içerik o boşlukta şeridin İÇİNDEN akıp
geçiyordu. Uzantı tam olarak o dolguyu kaplıyor; zemin aynı renkte olduğu için ek yeri
görünmüyor. Boşluk `--surface-pad`ten okunuyor, ve onu tüketici kayan yüzeye
yazıyor.

NEGATİF KENAR BOŞLUĞU, tam-genişlik hilesi değil: şerit yüzeyi kenardan kenara
kaplıyor ama içeriği her şeyle aynı sol kuralın üstünde kalıyor.

---

## `theme.css` · token katmanı

Token'lar orada yaşıyor: renk rampası, semantik renkler, tip ölçeği, ölçü, şekil ve
hareket. Sınıflar `kit.css`te.

Tüketici kendi CSS'inde şu sırayı kuruyor:

```css
@import "tailwindcss";
@import "tamga-ui/styles.css";
:root { --color-accent: #d6336c; }   /* markanın tamamı */
```

`theme.css` Tailwind v4 gerektiriyor (`@theme` direktifi kullanıyor); `kit.css`
gerektirmiyor, o saf CSS.

**Kalıcı** (mekanizma, tartışmaya kapalı): token adları ve `@theme inline` köprüsü ·
her token HEM `:root` HEM `.dark` içinde (parite CI'da denetleniyor) · hareket yalnız
token üzerinden, ham süre ve eğri yasak · yükselme tek formülden geliyor, 1px kenar +
N px sert offset, bulanıklık yok.

**Değiştirilebilir** (ürünün kararı): rampanın DEĞERLERİ. Bir ürün kendi CSS girişinde
`:root` ve `.dark` blokları yazarak markasını veriyor. Token'ın ADI kitin, DEĞERİ
ürünün.

Kapılar: `check-token-parity` (her token iki temada da tanımlı mı),
`check-scale` (ham hex ve ölçek dışı sayı), `check-token-contrast` (paletin ölçülen
kontrastı). Buradaki bir değeri değiştirmeden önce ilgili karar belgesi güncelleniyor;
sıra hep aynı, önce doküman sonra değer.

`theme.css`in başlığı bir süre `check-hardcoded-colors` ve `check-motion-tokens` diye
iki kapı adı sayıyordu; **ikisi de hiç yazılmamıştı.** Hareketin token üzerinden
gitmesi bugün bir kural ama kapısı yok, yani gözden geçirmeye bağlı.

### Yüzeyler tek yerde tanımlı

Ölçü belgesinin §5'i açıktı ve uygulanmıyordu: yüzeyler `--radius-card` (6px)
alıyor, kenar 1px ve GÖLGE renginde (Yasa 1: kenar ile offset tek renk), ve vurgu sert
bir çapraz offsetten geliyor. shadcn'in `rounded-xl border shadow-sm`i üçünü birden
kırıyordu: `shadow-sm` BULANIK bir gölge, ki Yasa 1 onu doğrudan yasaklıyor, ve
bulanık bir gölge bir neobrutalist yüzeyi generik bir SaaS kartı gibi okutan şeyin
kendisi.

Rol takma adları da bu yüzden var: çağrı yerleri boyuta göre değil ROLE göre okuyor.

### Tip ölçeği · on basamak, dışında hiçbir şey

Kit 272 yerde 19 elle yazılmış boyutla çalışıyordu, içlerinde 12.5px, 13.5px ve 14.5px
gibi yarım pikseller vardı: hiçbir ekran onları temiz çizmiyor ve kimse onları
bilerek seçmemişti. Var olmalarının sebebi her birinin gerektiği anda yazılmasıydı,
yani "gövde metni kaç punto" sorusunun cevabı "12 ile 14 arasında bir yer" olmuştu.

Her basamağın TEK bir işi var. Role göre seçiliyor, o an bulunduğun yerde nasıl
göründüğüne göre değil.

### Şekil · tek düğme

İki gevşek sayı yerine bir `calc` ölçeği olarak yazılı, böylece "ürünü biraz
yumuşat" on dosyada sayı avlamak değil tek satırlık bir düzenleme kalıyor.

DEĞER bilerek keskin. Bu sabahın üçünde okunan bir gösterge, ve yoğun bir satır
tablosu kıvrılan köşelerden çok duran köşelerle hızlı taranıyor. Tüketen bir ürün
kendi yarıçapını seçmiyor: ürün tarafında bir basamak oynatmak tek düğmeyi ikiye
çeviriyor, ve iki düğme eninde sonunda üç oluyor.

### Hareket · süreler ve eğriler neden token

Tam olarak renklerin token olma sebebiyle: satır içinde yazıldıklarında kayıyorlar. Bu
blok var olmadan önce kit dört iş yapan 16 elle yazılmış değer taşıyordu ve zaten
dağılmışlardı: bir bildirim 200ms'de geliyor, bir ilerleme çubuğu 240ms'de hareket
ediyor, bir rota 340ms'de açılıyordu. Kimse bir satırı gösterip "bu yanlış"
diyemiyordu; yalnız düzensiz hissediliyordu.

`--press` kendi basamağı ve bilerek en küçüğü: bir tıklamaya 100ms'de cevap veren bir
kontrol mekanik hissettiriyor, ki sert offsetli bir düğmenin bütün mesele bu. Daha
yavaş olan her şey gecikme olarak okunuyor.

### Ölü katman silindi · 27 Eylül 2026

Üç turda temizlendi ve üçü de aynı sebepten doğdu: `tamga-` yeniden adlandırması
öncesinden kalan bir kat, kimse okumadığı hâlde bakım maliyeti üretiyordu.

**1. Sekiz `--sidebar-*` token'ı.** Rayın kendi fiziği `.tamga-rail-link` olarak
`kit.css`te yaşıyor ve `--color-nav-*` okuyor. Token sayfası `--sidebar-primary` için
kırmızı bir 1.08 kontrast uyarısı basıyordu, ve hiçbir yerde kullanılmayan bir rengin
uyarısı gerçek uyarıların arasında gürültü.

**2. Öneksiz sınıf katmanı (210 satır).** `.press-surface`, `.seated-surface`,
`.card-surface`, `.sunk-surface`, `.app-surface`, `.gutter`, `.rail-link`, artı iskelet
ve işaret nefesinin ikinci kopyası (`@keyframes skeleton-breath` · `beacon-breath` ve
`.animate-*` sınıfları). Gerçek fizik `kit.css`in `.tamga-*` ailesinde; bunların
hiçbirine kit, doküman sitesi, dashboard-v5 ya da gevrek paneli dokunmuyordu. Yanındaki
bir yorum "bu blok silindi" diyordu ve blok sekiz satır aşağıda duruyordu.

**3. 19 ölü `@theme inline` köprüsü.** `--color-background`, `--color-foreground`,
`--color-primary`, `--color-muted`, `--color-popover`, `--color-border`, `--color-input`
ve `-foreground` çiftleri. Yalnızca Tailwind utility'si üretiyorlardı
(`bg-background`, `text-muted-foreground` …), hiçbiri kullanılmıyordu, token sayfasında
da yoklardı: **266 utility eksildi** (1401 → 1135). Arkalarındaki ham token'lar duruyor,
yani kendi CSS'inde `var(--primary)` yazan bir ürün etkilenmiyor.

**Bilerek bırakılan: `--font-sans`.** Kitte hiçbir kural onu okumuyor, ama Tailwind'in
preflight'ı okuyor. Betikle süpürülseydi her tüketicinin yazı yüzü sessizce değişirdi:
bir token'ın "kullanılmıyor" görünmesi, onu okuyan tek şeyin çerçevenin kendisi olması
demek olabilir.

---

## `fonts.css` · yüzler paketin içinde

Kitin bir `<head>`i yok, yani bir `<link>` ekleyemiyor; token yalnız yüzün ADINI
söyleyebiliyordu ve getirmek tüketicinin işiydi. Bu sessiz bir kırılma üretiyordu:
yükleme unutulursa hiçbir şey hata vermiyor, yığın sistem fontuna düşüyor ve tasarım
başka bir yüzle çiziliyor. Üç aile olunca risk üçe katlanıyordu.

Dosyalar artık pakette. `@import "tamga-ui/styles.css"` diyen bir tüketici hiçbir şey
yapmıyor, yüzler onunla geliyor: kurulum adımı yok, unutulacak bir şey yok, çalışma
anında üçüncü bir sunucuya istek de yok.

İKİ ALT KÜME, VE TÜRKÇE İKİSİNİ DE İSTİYOR: `ı` ve `öüç` latin'de ama `ğ ş İ`
latin-ext'te. Tarayıcı `unicode-range`e bakıp yalnız gerekeni indiriyor; Türkçe bir
panelde ikisi de iniyor.

DEĞİŞKEN YÜZLER: her ailede tek dosya bütün ağırlıkları taşıyor (`font-weight` aralık
olarak yazılı), yani dört ayrı kesim indirilmiyor.

`swap`: yüz inene kadar metin yedek yığınla ÇİZİLİYOR. Görünmez metin bekletmek, bir
panelde yanlış yüzle bir kare göstermekten kötü.

Lisanslar `fonts/LICENSE-*.txt` içinde; üçü de SIL Open Font License.

---

## Koyu temada gömülü yüzey sayfanın üstünde yoktu

`--color-sunk` "sayfanın üstünde değil İÇİNDE duran içerik": filtre çubuğu, tablo
başlığı, kod bloğu, alt panel, iskelet yer tutucusu. Açık temada sayfadan ΔL\* 7.3
ayrılıyor. Koyu temada **1.1** ayrılıyordu, yani hiç: gömülü yüzey sayfayla aynı
zemindi ve bir filtre çubuğunun nerede başladığı görünmüyordu.

Kusur iskelette görünür hâle geldi. `.tamga-skeleton`ın tabanı `--color-sunk`, görünen
çubuğu ise nefes alan bir `::after` (opaklık 0.78 ↔ 0.06). Nefes dibe indiğinde geriye
yalnız taban kalıyor; açık temada taban sayfaya karşı 1.34 oranla duruyordu, koyuda
**1.02**: yer tutucu her nefeste tümden kayboluyordu.

Koyu temada AÇMAK yasak, ve bu daha önce ölçülmüş: `--color-band`in yorumu "koyu temada
açmak denendi ve kartı yok etti" diyor (ray ile kart yüzeyi arası ΔL\* 0.4). O yüzden
aşağı: `#0e1829` → `#020c21`, sayfadan ΔL\* 5.8. Sayı keyfî değil, rampanın kendi
sıkışması: koyu tema her çifti açığın ~0.8'inde tutuyor (kabuk/sayfa 4.5'e 4.2,
şerit/sayfa 3.4'e 4.2, hover/kabuk 2.5'e 3.1) ve 7.3 × 0.79 = 5.8. Kroma da düşmüyor:
yeni değerin kroması sayfanınkinin üstünde (14.5'e 13.7), tonu aynı (280°), yani rampa
renk kaybetmiyor.

**Üreticide de aynı kusur ayrıca duruyordu.** Kitin koyu yarısı elle yazılı, `makePalette`
kendi merdivenini koşturuyor (açık yarıları birebir aynı, koyu yarıları bağımsız), ve o
merdivende de gömülü basamağı yoktu: `l 0.209`, sayfanın `0.218`inin ΔL\* 1.0 altında. Yani
bir ürün kendi marka rengiyle palet üretse aynı görünmez filtre çubuğunu alıyordu. Basamak
rayın altına indi (`l 0.168`, açık temadaki sıra da bu) ve on marka renginde ΔL\* 4.9–5.2
ölçülüyor.

**İki kapı birden sessizdi**, çünkü ikisi de bu çifti hiç ölçmüyordu:
`check-token-contrast` yüzey ayrımını yalnız `--color-edge` ve `--color-line` için
soruyordu, `measurePalette` ise yalnız `navHoverBg · rail` için. İkisine de gömülü/sayfa
çifti eklendi, taban 2.0; "bir zeminin üstündeki ikinci zemin değişti diye okunsun"
tabanının aynısı. Eski değer geri konarak patlatıldı: kapı ΔL\* 1.1'i söylüyor.

## Okunurluk rozetinin kendi okunurluğu bir cümleydi, sayı değildi

`/tokenlar` sayfasındaki rozet bir rengin üstünde durup o rengin ölçümünü yazıyor, ve
mürekkebi sabit değil seçiliyor: adaylardan hangisi o rengin üstünde daha çok ayrışıyorsa
o. İki yerde de "garantili okunuyor", doküman tarafında ise "en kötü rozet 5.02, hepsi AA
üstünde" yazıyordu. Ölçüldü: 91 rozetin en zayıfı **4.27**, yani AA'nın altında.

Aday listesi iki uçtan (mürekkep · kâğıt) oluşuyordu ve orta parlaklıkta bir işaret rengi
iki ucun ikisine de yakın duruyor. `--color-elevated-mark` (#c8664a) üstünde koyu temanın
mürekkebi 3.18, kâğıdı 4.08 veriyordu. Üçüncü aday eklendi, basılan kenar
(`--color-edge-strong`): iki temada da neredeyse siyah, o rengin üstünde 5.27 veriyor, ve
açık temada zaten mürekkeple aynı değer olduğu için orayı hiç kıpırdatmıyor. Koyu taraftaki
üç işaret rengi 4.08/4.48/4.84'ten 5.27/5.78/6.25'e çıktı.

Açık taraftaki 4.27 duruyor, çünkü palet o rengin üstünde daha iyisini veremiyor (kâğıt
3.82). Yapılan şey sayıyı gizlemek değil görünür kılmak: çıkarıcı her koşuda en zayıf
rozeti adıyla yazıyor, ve iki yorumdaki "garanti" cümlesi ölçümle değiştirildi. Rozetin
uyarı hâli zaten renge değil işarete dayanıyor: bir ünlem ve kalınlaşan kenar.

## Sabit zemin + dönen mürekkep: üç kez düzeltildi, sonra ölçüldü

Kitin renkleri iki gruba ayrılıyor ve bu ayrım yazılı hiçbir yerde ölçülmüyordu: temayla
DÖNENLER (`--color-ink`, `--color-page`, `--color-shell`) ve iki temada SABİT olanlar
(`--color-critical-mark` bordo, `--color-accent-soft` açık mavi, `--color-inverse-ink`
beyaz). Bir kural bu iki gruptan birer tane eşleştirdiğinde açık temada doğru görünüyor,
koyu temada yazı zemine dönüyor.

Bu oturumda üç kez çıktı. Seçim çubuğu zeminini `--color-ink`ten alıyordu ve koyu temada o
token açığa döndüğü için beyaz yazı kayboldu; çözüm ters yüzeye taşımak oldu. Vurgulu
bağlantı sabit açık mavi bir yıkamanın üstüne dönen mürekkep koyuyordu, kontrast 1.36;
çözüm `--color-accent-soft-ink` adında ayrı bir token oldu. Üçüncüsü tehlike ikon düğmesi:
sabit bordo plaka (`--color-critical-mark`, iki temada #b8323f) üstüne `--color-page`, açık
temada 5.26 ve koyu temada 2.96. Tasarımın kendi dosyası bu çifti sabit yazmış (#9E2A3A
üstünde #fff), yani port sırasında dönen bir token seçilmesi bir çeviri hatasıydı.

Üçü de tek tek düzeltildi ve dördüncüyü durduracak hiçbir şey yoktu. `check-tema-cifti`
sınıfın kendisini ölçüyor: kit.css'te hem `background` hem `color` yazan her kuralı iki
temada hex'e kadar çözüyor, taraflardan yalnız biri sabitse çifti ölçüyor, ve iki temadan
biri AA altına düşerse duruyor. Bugün 12 karışık çift var, hepsi geçiyor. Görmediği şey
yazılı: zemini bir kuralda, mürekkebi başka bir kuralda alan çiftler · onun için CSS'i
gerçekten çözmek gerekir, ve kusurun çıktığı yer tek kuralın içiydi.

## Tasarımın token adları bizimkilerle çakışıyor, ve bir kez yanlış eşlendi

`docs/ozel/tasarim-dili/*.dc.html` kendi değişkenlerini kendi adlarıyla taşıyor, ve o adların
üçü bizim ad alanımızda BAŞKA bir şeyi işaret ediyor:

| tasarım | değer | bizdeki karşılığı |
| --- | --- | --- |
| `--edge` | `#0A1F3D` | `--color-edge-strong` |
| `--line` | `#C3C9D3` | `--color-edge` |
| `--dash` | `#D5D1C6` | `--color-line` |
| `--div` | `#E3DFD6` | `--color-div` |

Port sırasında `--edge` doğrudan `--color-edge` diye okundu, yani neredeyse siyah olan basamak
soluk griye düştü. Gözle yakalanması zor, çünkü sonuç "yanlış renk" değil "silik bir çizgi":
ayraçların bölüm ayracı kartın kendi kenarından ayırt edilemiyordu.

Dört yerde olmuştu ve dördü de düzeltildi: `Separator`ın kalın kuralı, duyuru şeridinin kenarı
ve tabanı, spinner'ın `square` kılığı, büyük `Dot`. Ayraç merdiveni artık tasarımın kendi
sırası: düz `--color-div`, kesikli `--color-line`, kalın `--color-edge-strong` (1.5px), dikey
`--color-edge`. Aradaki farkın kendisi bir bilgi · dört çizgi dört farklı şey söylüyor.

**Bir sonraki port için kural:** referanstan bir renk alırken adı değil DEĞERİ eşleştir.
`token-oku.mjs` iki tarafı da okuyabiliyor, ve bir hex karşılaştırması bu hatayı baştan
kapatıyor.

## Aynı sınıfı iki kez tanımlamak, hata vermeyen bir hata

Bir sınıf yeniden adlandırıldı ve yeni ad zaten kullanılıyordu: sekmenin sayacı `.tamga-sayi`
oldu, oysa `.tamga-sayi` rakamın YÜZÜNÜ veren sınıftı (`NumberInput` onu `tamga-input` ile
birlikte yazıyor). Aynı dosyada iki tanım kaldı, sonraki kazandı, ve her sayı girdisi 18
piksellik bir çipe dönüştü: yüksekliği çipin, dolgusu çipin, zemini çipin.

Hiçbir şey hata vermedi. CSS'te bu geçerli bir kural. `check-kit-class` de haklı olarak geçti:
iki ad da tanımlıydı, sorulan soru "bu ad tanımlı mı" idi. Eksik olan soru şuydu: **bu ad ikinci
kez mi tanımlanıyor.**

`check-css` artık onu soruyor. Yalnız çıplak tek sınıf seçicileri sayılıyor (`.tamga-x {`), ve
sarmalayıcı anahtarın parçası: bir `@media` içinde aynı sınıfı yeniden yazmak tam olarak
`@media`nin işi. Kapının ilk hâli iki sahte pozitif üretti ve ikisi de öğreticiydi · satır satır
bakmak (a) çok seçicili grupların son satırını çıplak sanıyor, (b) yorumları silerken satır
numarasını kaydırıyordu. Şimdi süslü parantezler yürünüyor.

Kapı kurulur kurulmaz dört gerçek tekrar buldu, ve biri sessizce yayınlanıyordu: akordeonun
başlığı `font-weight`ini kaybetmişti, çünkü aynı sınıfın satır görünümünden kalan eski bloğu
kart görünümünden gelen yeni blok tarafından eziliyordu. Tasarım 700 yazıyor; ekranda 400 vardı.

## `@theme inline` bir değişken yaymıyor · köprüden ayrılan yedi token

Köprü bloğu (`tamga:kopru`) shadcn biçimli adları kitin ad ailesine bağlayan takma adlar için
var: `--color-card: var(--card)`. Ama bloğun içinde takma ad OLMAYAN bildirimler de duruyordu:
üç yüz (`--font-sans`, `--font-display`, `--font-mono`), `--tracking-label` ve dört yarıçap
(`-sm`, `-md`, `-xl`, `-full`).

İki ayrı şey bozuluyordu, ve ikisi de ölçüldü:

**Yayınlanmıyorlardı.** `extract-tokens` o bloğu yalnız `var(--x)` satırları için okuyor, yani
bu yedi ad token referansına hiç girmiyordu. Tipografi sayfası üç yüzü anlatırken token
sayfasının tipografi grubunda o üç ad yoktu.

**`var()` ile ulaşılamıyorlardı.** `@theme inline`ın işi zaten bu: değeri kullanım yerine
yazıyor, bir custom property yaymıyor. Utility'ler (`rounded-md`, `tracking-label`) çalışıyordu
ama `var(--radius-md)` tarayıcıda boş dönüyordu, ve token sayfası her adı `var()` olarak
kopyalatıyor, yani kopyalanan şey sessizce hiçbir şey yapmıyordu. Ölçüldü: 145 token'ın 5'i
`var()` ile ulaşılamıyordu.

Kendi `@theme static` bloklarına ayrıldılar (`tamga:kopru-token`); `static` hem utility üretiyor
hem değişkeni yayıyor. Aynı sebeple `tamga:sabit-olcek` de `static` oldu: sade bir `@theme`
yalnız KULLANILAN değişkeni yayıyor ve rampanın hiçbir yerde okunmayan basamağı
(`--color-brand-600`) tarayıcıda hiç yoktu.

Geriye `--breakpoint-xs` kalıyor ve o KALMALI: bir kırılım noktası medya sorgusuna dönüşüyor,
custom property'ye değil. Listede duruyor çünkü gerçek bir karar, ama `var()` ile okunacak bir
şey değil.
