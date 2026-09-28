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


### `ScrollX` · asıl işi erişilebilirlik.

`overflow-x: auto` tek başına FARE için çalışıyor. Klavye kullanan biri o kutuya
hiç giremiyor: kaydırılabilir bir alan odaklanabilir değilse içindeki geniş
tabloyu yana kaydırmanın yolu yok, ve tarayıcılar bunu kendiliğinden çözmüyor.

`tabIndex={0}` + `role="region"` + bir ad, o kutuyu klavyeye açıyor. Ad zorunlu:
adsız bir `region` ekran okuyucunun landmark listesinde "bölge, bölge, bölge"
olarak birikiyor ve hiçbirinin ne olduğu bilinmiyor.

### `Swap` · iki durumun aynı yerde durması.

Bir düğmenin yazısı "Kaydet" iken "Kaydediliyor…" olduğunda düğme genişliyor ve
yanındaki her şey kayıyor. `Swap` ikisini de aynı ızgara hücresine koyuyor: kutu
her zaman UZUN olanın genişliğinde, yani hiçbir şey oynamıyor.

Gizlenen taraf `aria-hidden` alıyor. Almasaydı ekran okuyucu iki metni arka
arkaya okurdu ("Kaydet Kaydediliyor") ve hangisinin geçerli olduğu anlaşılmazdı.

### `ListRow` · tablo olmayan listeler.

Bir tabloya yetmeyen ama bir listeden fazlası olan şey: ayarlar satırı,
entegrasyon satırı, üye satırı. Sabit yükseklik ve alt kural, satırların
taranabilir kalmasını sağlıyor.

`href` verilirse bir bağlantıya, `onClick` verilirse bir düğmeye dönüyor; ikisi
de yoksa düz bir satır kalıyor. Bu ayrım önemli, çünkü tıklanabilir bir `<div>`
klavyeyle erişilemiyor ve ekran okuyucuya hiçbir şey söylemiyor.

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


### Kapalı sekme · gizlemek yerine kapatmak.

"Önce kaydet, sonra zenginleştir" akışında bir kayıt doğmadan fotoğrafı ya da
kategorisi olamaz. Sekmeleri o ana kadar gizlemek, kaydettikten sonra ekranın
altından dört yeni sekme çıkması demek; kullanıcı ne kazandığını değil neyin
değiştiğini anlamaya çalışıyor. Kapalı sekme yapılacak işin ŞEKLİNİ baştan
gösteriyor.

Kapalı sekme bir bağlantı DEĞİL: `<a>` üretmiyor, o yüzden sağ tıklayıp yeni
sekmede açılabilen ölü bir adres de bırakmıyor.

---

## `chrome.tsx`

### Kabuk parçaları.

BU DOSYA BİR KANITIN SONUCU. Aşağıdaki üç şey bağımsız iki projede ·
dashboard-v5 ve bu kitin doküman sitesinde · AYRI AYRI yazılmıştı. İkisi de
aynı kararları vermek zorunda kaldı: tercih nerede saklanır, `aria-label`
nasıl kurulur, sunucuda bilinmeyen bir tercih ilk boyamada nasıl davranır.

Bir mekanizmanın kite ait olduğunun en güçlü kanıtı budur: iki proje onu
habersizce yeniden icat etmişse, o mekanizma ikisinin de altındadır.


### Tema düğmesi · sunucu temayı bilmez.

İlk boyama her zaman açık temayla çıkıyor ve tercih `useEffect` içinde
uygulanıyor: yani koyu tema seçmiş biri bir kare boyunca açık ekran görüyor.
Bunu tamamen çözmenin tek yolu `<head>`'e engelleyici bir script koymak, ve o
script'in yeri KİT DEĞİL uygulamadır, çünkü kitin bir `<head>`'i yok.

`storageKey` bu yüzden bir prop: uygulama aynı anahtarı kendi script'inde de
okuyabilsin diye. İki taraf farklı anahtar kullanırsa tercih sessizce kaybolur.

Metinler dışarıdan geliyor. Kit çeviri yapmıyor, ve bir düğmenin adı içinde
metin olmadığı için erişilebilirliğin tamamı.

İKİ BİÇİM, VE SEBEBİ ORANTI. `icon` sıkışık bir araç çubuğuna giriyor: 40×40,
tek simge. Ama yanında bir dil anahtarı gibi ANAHTAR biçimli bir kontrol varsa
kare düğme onun iki katı yüksekliğinde duruyor ve şerit dengesiz görünüyor.
`switch` biçimi aynı iskeleti kullanıyor (iki uçta birer simge, ortada kayan bir
anahtar), yani ikisi yan yana aynı satırda oturuyor.

### `segmented` temayı asla sahiplenmiyor.

Sahiplik bir süre `dark` prop'unun verilip verilmediğine bakıyordu. `segmented`
onu hiç almıyor (tercihi `preference` taşıyor), yani kit "demek ki ben
tutuyorum" deyip `.dark` sınıfını İŞLETİM SİSTEMİNDEN basıyordu. Sonucu şu
oluyordu: ürün tercihi "açık" olan bir panelde, makinesi koyu temada olan bir
kullanıcı için sayfa açık geliyor (paleti ürün yazıyor) ama `.dark` üstte
kalıyor, ve paletin yazmadığı her token (durum renkleri) koyu geliyor. Açık bir
listede bordo çipler.

`segmented` zaten `preference` ile `onPreferenceChange`i ZORUNLU tutuyor, yani
tercihi tanımı gereği ürün tutuyor.

### Dil değiştirici · kit yönlendirme yapmaz.

`onChange` seçilen dili veriyor; nereye gidileceği (`router.push`, tam sayfa
yenileme, bir çerez yazıp yeniden yükleme) uygulamanın kararı ve
yönlendiricisine bağlı. Kitin `next/navigation`'a bağlanması, onu bir
framework'e bağlamak olurdu.

Etiketler ENDONİM olmalı: "English", "İngilizce" değil. Bir dili arayan kişi onu
kendi dilinde arıyor. Kit bunu zorlayamaz ama doküman söylüyor.

İki dilde SEGMENTED, üç ve fazlasında SELECT, kendiliğinden. İki seçenek yan
yana sığıyor ve tek tıkla değişiyor; beş dil yan yana konursa üst şeridi
dolduruyor ve altıncı dilde taşıyor.

### Marka karosu · `alt` bilerek boş.

Bir logonun etrafındaki kutu. Görsel yoksa baş harf, `Avatar`'la aynı gerekçe:
gri bir yer tutucu hiçbir şeyi temsil etmiyor, bir harf gerçekten o şeyi
işaret ediyor.

`alt` boş bırakılıyor ve bu bilinçli: karo neredeyse her zaman adı YANINDA yazan
bir şeyin yanında duruyor, ikisini de okutmak ekran okuyucuda adı iki kez
tekrarlıyor.

### Hesap düğmesi · neden bir bileşen, ve sayarak.

İki panelde de aynı şey elle kuruldu:
`<button className="tamga-icon-btn"><Avatar bare …/></button>`. `Avatar`ın
`bare` prop'u tam bu iş için var ve JSDoc'u bunu anlatıyor, ama bulunmadı;
ikinci kurulumda avatar kendi çerçevesiyle kondu ve şeritteki öteki
kontrollerden farklı boyda durdu. **Bulunmayan bir prop, olmayan proptur.**

ÖLÇÜ ŞERİDİN ÖLÇÜSÜ. Kare `--control` (40px), yani tema anahtarı ve öteki simge
düğmeleriyle birebir aynı. Bir araç çubuğunda yükseklik tek karardır; tek bir
kontrolün farklı durması bütün şeridi hizasız gösteriyor.

Fotoğraf yoksa baş harfler: `Avatar` zaten öyle davranıyor, ve bir hesabın
fotoğrafı olmaması normal hâl.

---

## `rail-link.tsx`

### Kendi dosyasında, çünkü YENİ BİR KONTROL.

Soru şu: bu dosya kitin daha önce görmediği bir kontrol mü getiriyor?
`.tamga-rail-link` kendi hover ve seçili fiziğini taşıyor · yani getiriyor.
Besteci bileşenlerle (var olan kontrolleri birleştirenlerle) aynı dosyada
durursa ikisi ayırt edilemez hâle geliyor.

Bunu bir zamanlar `check-states-stories` guard'ı dosya bazında ölçüyordu;
Storybook dashboard-v5'ten sökülünce o kapı da gitti ve kural kapısız kaldı.
Kuralın kendisi değişmedi, onu tutan şey değişti: artık gözden geçirme.

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


---

## `avatar.tsx`

### Üst üste binen ekip · iki ayrı kusur, aynı sonuç.

Karolar birbirine yapışıp tek bir karışık blok olarak okunuyordu.

Birincisi ÖRTÜŞMENİN SABİT olmasıydı: her boyutta 8 piksel. Bir 24 piksellik karoda
bu üçte bir demek, ve iki baş harften biri kapanıyor. Şimdi boyuna oranlı, dörtte
bir: karo büyüdükçe örtüşme de büyüyor ama oran sabit kalıyor.

İkincisi AYIRICI HALKANIN OLMAMASIYDI. Avatarın kendi 1 piksellik kenarı yeterli
sanılmıştı ve değildi: iki karo bitişince o kenarlar tek bir çizgi oluyor, ve
hangisinin önde olduğu okunmuyor. Üstteki karonun etrafına ARKA PLAN RENGİNDE bir
halka koyunca üstteki alttakini gerçekten kesiyor.

`surface` bu yüzden bir prop: halka, yığının ÜSTÜNDE DURDUĞU zeminin rengi olmalı.
Varsayılanı kart zemini (`--color-shell`), çünkü bir ekip listesi neredeyse her
zaman bir kartın içinde; sayfa zemininde duracaksa çağıran onu söylüyor. Bulanıklık
yok: `0 0 0` yayılımsız bir halka, gölge değil.


---

## `link.tsx`

### Yönlendiricinin bağlantısı dışarıdan verilir.

Kit hangi yönlendiricinin kullanıldığını bilmiyor ve bilmemeli (`next/link`,
`react-router`, ya da düz `a`). Bileşen bir `href` alıp `a` yazsaydı her tıklama tam
sayfa yüklerdi.

NEDEN `components/` ALTINDA, `patterns/` ALTINDA DEĞİL: burada doğmuştu, ama bir
BİLEŞEN de (`Kpi`) bağlantı olabildiği için şablon katmanına bağımlı olması
gerekiyordu. Bir bileşenin şablondan import etmesi katmanı ters çeviriyor; tip aşağı
indi, `patterns/shared.tsx` onu yeniden dışa vuruyor, ve dışarıdan bakan API hiç
değişmedi.

---

## Şeritlerin klavyesi

### Ok tuşları bir SÖZ.

`role="tablist"` ve `role="radiogroup"` ekran okuyucuya "buradan oklarla
geçilir" diye duyuruluyor. Oklar çalışmadığında kullanıcı şeritte sıkışıyor:
duyurulan yol yok, Tab tuşu da (tek durak varsa) şeridi bir bütün olarak
geçiyor. İkisi birden olunca rol bir YALAN oluyordu.

ŞERİTTE TEK DURAK VAR: seçili sekme / seçili segment (`tabIndex` 0, ötekiler
-1). Seçenek başına bir Tab durağı koymak, beş görünümlü bir seçiciyi klavyede
beş adım yapıyor · ve bir formda sekiz sekmelik bir şerit, alttaki ilk alana
sekiz basışla varılıyor demek.

ODAK SEÇİMLE BİRLİKTE TAŞINIYOR. Seçili sekme değişip odak eskisinde kalırsa
ekran okuyucu hâlâ öncekini okuyor, ve sonraki ok tuşu yanlış yerden başlıyor.

KAPALI SEKME ATLANIYOR. Ok tuşu gidilemeyen bir durağa götürürse şerit
kilitlenmiş gibi duruyor · oysa `disabled` sekme bilerek yerinde duruyor,
yapılacak işin şeklini göstermek için.

### Segmented bir radyo grubu.

Akranlar arasından TEK seçim, yani `radiogroup` + `radio`. Bir düğme grubu
(`group` + `aria-pressed`) olarak duyurulduğunda ekran okuyucu kaç seçenek
olduğunu ve kaçıncısının seçili olduğunu söylemiyordu · basılı düğmeler
birbirinden bağımsız sayılıyor.

`RadioGroup` hâlâ ayrı bir bileşen ve ayrı bir iş: o bir FORM alanı (etiketi,
yardım metni, hata satırı var), bu bir araç çubuğu kontrolü.

### Sekmenin sayacı ve rayın rozeti.

İkisi de aynı soruyu yanıtlıyor: "orada kaç tane var". Sekmede MONO bir çip,
çünkü öteki sekmelerin sayılarıyla karşılaştırılıyor. Rayda ise genişliğe göre
değişiyor · geniş rayda sayı, dar rayda yalnız bir kare: 40 piksellik bir kutuda
iki haneli sayı ikonun üstüne biniyor, ve okunmayan bir sayı "bir şey var"dan
fazlasını söylemiyor. Sayı o zaman `badgeLabel` ile ekran okuyucuya gidiyor.

### Aktif ray satırı yıkama alıyor.

Hover da aktif de yüzey rengindeyken ikisini ayıran tek şey gölgenin derinliği
(3 ve 4 piksel) kalıyordu, ve göz o farkı okumuyor. Aktif satır artık vurgu
yıkaması taşıyor · yıkama bir DOLGU değil, yani Yasa 2 duruyor: "buradasın"
hâlâ bir eylem gibi boyanmıyor.

### İpucu iki kez okunmasın.

`Tooltip` etiketi `aria-describedby` ile tetikleyiciye bağlıyor. Dar rayda
kontrolün `aria-label`i zaten o metin: bağ kurulursa ekran okuyucu "Siparişler,
Siparişler" diyor. `bind={false}` tam bu durum için · ipucu görsel kalıyor, ad
kontrolün kendisinde.

### Şeridin iki boyu, ve referansın ölçüleri.

Segment bir süre tek boydaydı (13,5px metin, 6px dolgu) ve bir ARAÇ ÇUBUĞUNA
konduğunda şerit içeriğinden uzun kalıyordu: doküman sitesinin örnek kutusunda
bar 55 piksele çıkıyor, referansta 45. `sm` o durum için · 2px kap dolgusu,
4px 10px düğme dolgusu, 13px metin.

REFERANSA GÖRE ÜÇ ÖLÇÜ DAHA DÜZELDİ: kabın köşesi 6 değil **7** (`--radius-btn`),
düğmeninki 4 değil **5**, ve düğmenin yatay dolgusu 12 değil **14**. Seçili
olmayan segment de artık TAM mürekkep: sönük bir seçenek "kapalı" diye
okunuyordu, oysa hepsi seçilebilir · ayrımı oturma yapıyor.

İKONLA METNİN ARASINDA 6px BOŞLUK VARDI VE YOKTU. `.tamga-segment > button`
`gap` taşımıyordu; ikon taşıyan her segment (tema anahtarı, örnek kutusunun
"Önizleme / Kod" şeridi) glifi sözcüğe yapıştırıyordu.

### Klasör sekmesi.

Tasarım iki tür sekme gösteriyor ve kitte yalnız biri vardı. Çizgili şerit
SAYFANIN görünümlerini ayırıyor; klasör ise bir YÜZEYİN bölümlerini · bir kartın
içindeki form bölümleri. Klasörde seçili sekmenin alt kenarı saydam ve sekme
panelin 1,5 pikseli kadar aşağı iniyor (`top: 1.5px`): iki çizgi tek çizgi
olarak okunuyor, sekme panelin ÜSTÜNE oturuyor.

ŞERİDİN DOLGUSU SEKMENİN İÇİNDE. Çizgili şeritte sekmeler arası boşluk 24
pikselti ve dolgu yoktu; alt çizgi sözcüğün kendisi kadar kalıyordu. Referansta
boşluk 4, dolgu 8×12 · çizgi sekmenin gövdesi kadar uzun.

### `Reveal` · ve adının neden değiştiği.

Sekiz piksel aşağıdan, sönükten giren blok. Azaltılmış harekette CSS onu
tamamen kapatıyor. `delay` bir listeyi sırayla açmak için ve basamak KÜÇÜK
tutulmalı: otuz satırlık bir listede 60ms'lik gecikme, sonuncuyu iki saniye
sonra gösteriyor ve bekleme hissi yaratıyor.

ADI `Rise`TI. Tasarım dilinde o ad BAŞKA bir şeyin adı: sıfırdan hedefe
yükselen SAYI (03.04). İki farklı şeyin aynı adı taşıması, ikisini de arayan
kişiyi yanlış yere götürüyordu · kendi doküman sayfamız bile "adı yanıltıcı
olabilir" diye başlıyordu. Ad tasarıma bırakıldı, bileşen `Reveal` oldu.

## Duyuru şeridi · iki ses, ve mavinin üstündeki mavinin ölçüsü

Tasarımın `page-band` (05.05) bölümü iki şerit gösteriyor: dolu vurgu zemininde bir kampanya
duyurusu, ve altında sarı yıkamalı bir "TEST MODU" şeridi. Bizim `PageBand`imiz başka bir şey
(sayfanın başlığı: üst etiket, `h1`, açıklama, eylemler), o yüzden şerit kendi bileşeni oldu:
`Announcement`.

İki ses bir süs değil: `loud` dolu vurgu ve **yükseliyor**, çünkü okuyanın bir şey yapması
gerekiyor ve bu kitte dolgu zaten eylem demek (Yasa 2). `quiet` yıkanmış ve **yükselmiyor**,
çünkü duran bir koşul yalnız okunmak istiyor. Tabanın olup olmaması bu cümlenin kendisi.

MAVİNİN ÜSTÜNDEKİ AÇIK MAVİ KOYU TEMADA TUTMUYOR. Tasarım dosyası şeridin ikon ve açıklamasını
`#A8CDF7` ile yazıyor, yani bizim `--color-accent-soft`umuz. O token iki temada da sabit, oysa
`--color-accent` koyu temada açılıyor (`#1e4fd8` → `#709dfd`): çift açık temada 4.03, koyuda
**1.61** ölçüyor. Şeridin mürekkebi bu yüzden iki temada da `--color-accent-ink` (6.47 / 5.54),
ve başlık ile açıklama arasındaki fark renkten değil **boy ve ağırlıktan** geliyor. Eylem
düğmesi tasarımdaki gibi kalıyor (`--color-accent-soft` zemin, kendi mürekkebiyle): o çift iki
temada da sabit.

Kip plakası ("TEST MODU") iki temada da koyu zemin + sarı yazı, 10.48. Sabit bir çift olduğu
için `check-tema-cifti` onu görmüyor (o yalnız KARIŞIK çiftlere bakıyor); bu yüzden çift
`check-token-contrast`in listesine yazıldı.

## Tema şeridi: üç seçenek önerilen, iki seçenek bir ürün kararı

`ThemeToggle variant="segmented"` üç basamak çiziyordu ve üçüncüsü zorunluydu. Gerekçesi
`preference` prop'unda yazılı ve hâlâ geçerli: "sistem" üçüncü bir ton değil, bir seçimin
YOKLUĞU · yalnız açık ve koyu sunan bir kontrol, makinenin cevabını okuyucunun hiç vermediği
bir karara çeviriyor.

Ama tasarımın 01.13'ü iki seçenekli bir şerit gösteriyor, ve iki seçenek sunmak meşru bir ürün
kararı (bir panel temayı zaten kendi tutuyor olabilir). Kural artık şu: `system` etiketi
verilirse üç basamak gelir, verilmezse iki. Yani basamağı isteyip istememeyi çağıran söylüyor ve
kit hiçbir şeyi varsayıyor değil.

Bir de biçim farkı var: ikide etiketler GÖRÜNÜYOR ("Açık tema" · "Koyu tema"), üçte yalnız glif
kalıyor ve ad `sr-only` olarak duruyor. Sebebi ölçü: üç metinli segment kontrolü bir araç
çubuğuna sığmayacak kadar uzatıyor, ikisi ise bir şerit gibi okunuyor.

## Segmentin yüksekliği: iki piksel ve bir vaat

Ölçü sayfası şunu yazıyor: _"bir düğme bir girdinin yanına konduğunda ikisi de aynı
yüksekliktedir, çünkü ikisi de aynı token'ı okuyor"_. Cümle doğruydu ama bir kontrol için
değildi: `.tamga-segment` yüksekliğini **dolgudan** alıyordu ve 42px ölçülüyordu, `--control`
ise 40. İki piksel; bir araç çubuğunda girdi ve düğme hizalanıyor, segment hizalanmıyordu.

Sabit yükseklik bir kez denenmiş ve geri alınmıştı, ve geri alınması doğruydu: yükseklik
segmentin **içindeki düğmeye** verilmişti, kuyu onun üstüne kendi 3px dolgusunu ve 1px kenarını
ekleyince 46px çıkıyordu. Doğru yer kuyunun kendisi: `height: var(--control)` + `align-items:
stretch`, öğeler ona geriliyor ve kendi dikey dolgularını bırakıyor.

Küçük boy (`-sm`) ve glif segmenti (`-icons`) `height: auto` ile tabanı geri alıyor: bir araç
çubuğunda 40 pikselin altında durmak onların var olma sebebi.

Bunu görünür yapan şey ölçü sayfasının ritim demosu oldu: girdi, segment ve düğme yan yana
konunca segmentin bir piksel taşması ekranda okunuyordu. Kapı `check-olcu-hizasi`: sekiz taban
kontrolün her biri `height: var(--control)` bildirmek zorunda, ve liste elle yazılı çünkü yeni
bir taban kontrolün hizalanıp hizalanmayacağı bir karar.
