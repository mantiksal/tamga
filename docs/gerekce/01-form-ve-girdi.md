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


### Maskeli sır alanı · `PasswordInput`un tersi.

Parola alanına bir şey YAZILIR; buraya yazılmaz, okunur ve kopyalanır. O yüzden
salt-okunur, ve asıl düğmesi kopyalama.

Maske ilk ve son birkaç karakteri bırakıyor. Tamamen gizlemek, kullanıcının
"hangi anahtar bu" sorusunu cevapsız bırakıyor: üç anahtarı olan biri hangisine
baktığını bilemez.

### Etiket girdisi.

Enter ya da virgül bir etiketi kapatıyor; boşken Backspace sonuncuyu siliyor.
İkincisi küçük görünüyor ama en çok kullanılan yol: yanlış yazılan bir etiketi
silmek için fareye uzanmak, akışı kesen tek şey.

Yinelenen ETİKET SESSİZCE YUTULUYOR, hata verilmiyor. Aynı etiketi iki kez
yazmak bir hata değil bir tekrar, ve kullanıcı zaten istediğini almış oluyor.

### Çoklu seçim · neden `Combobox` yetmiyor.

`Combobox` tek seçim yapıyor, bu birden çok. Ayrı bileşen olmasının sebebi
görünüm değil DAVRANIŞ: tek seçimde liste seçince kapanıyor, çoklu seçimde
KAPANMIYOR. Üç şey seçecek biri listeyi üç kez açmak zorunda kalmamalı.

Seçilenler girdinin İÇİNDE çip olarak duruyor, altında ayrı bir listede değil:
seçim ile seçilenler arasındaki mesafe arttıkça kullanıcı neyi seçtiğini görmek
için gözünü iki yere birden koymak zorunda kalıyor.

KLAVYE OLMADAN BU KONTROL YARIM. Etiket eklemenin doğal yolu YAZIP ENTER'A
BASMAK: kullanıcı "adidas" yazıp Enter, "nike" yazıp Enter diyor ve iki çip
ekliyor. Önce yalnız fareyle çalışıyordu; yazdıktan sonra listeye uzanıp
tıklamak gerekiyordu, ve klavyeyle gezen biri hiç seçim yapamıyordu. Tuş
tablosu kodun yanında duruyor.

### Zamanlama girdisi · neden cron değil.

Bir cron ifadesi (yıldız-eğik-beş biçimi) bir geliştirici için okunur, bir panel
kullanıcısı için değil. Üstelik yanlış yazılan bir cron ifadesi hata vermiyor,
sadece yanlış zamanda çalışıyor. Bu bileşen kürasyonlu bir liste sunuyor:
kürasyonlu seçenek, serbestlik değil.

Aralıklar dakika olarak veriliyor, çevirisi çağıranın: "5 dakika" ile "5
minutes" arasındaki farkı kit bilemez.

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

`onReorder(id, hedef)` · ADIM DEĞİL HEDEF SIRA. İlk imza `(id, -1 | 1)` idi
ve ok düğmeleri için yetiyordu; sürükleme gelince yetmedi, çünkü 4. görseli
kapak yapmak tek adım değil. İki callback (biri ok, biri sürükleme) bir işi
iki yerden anlatmak olurdu, o yüzden tek anlam kaldı: "bu ögeyi şu sıraya
koy". Ok düğmeleri `i - 1` / `i + 1` gönderiyor.

BIRAKMA KUYUSU KARELİ KÂĞIT DEĞİL. Kuyu bir süre `.tamga-art-well` kullanıyordu,
yani ÇİZİM zemini ("kâğıt üstünde bir alet", bkz. `04-bos-ve-hata.md`). Orada
kareler iş yapıyor: göze ölçek veriyor ve büyük bir çizimi dekoratif lekeden
ayırıyor. Bırakma alanında ise bir çizim değil bir CÜMLE ve iki satır ipucu var,
ve 8 piksellik ızgara sözcüklerle yarışıyor. Kuyunun kendi sınıfı oldu
(`.tamga-drop-well`): vurgunun en soluk zemini üstünde kesik bir kenar · "buraya
bırakılabilir" demenin en sessiz yolu. `.tamga-art-well` değişmedi, çizimleri o
çizmeye devam ediyor.

VE TAKAS DEĞİL KAYDIRMA. Çağıran taraf ögeyi `splice` ile çıkarıp hedefe
sokuyor; takas yapsa 4. görseli kapak yapmak kapağı 4. sıraya fırlatırdı ve
kullanıcı "başka bir şey bozuldu" derdi. Kit bunu zorlamıyor ama dokümandaki
örnek doğru olanı gösteriyor · kopyalanan şey o.

SÜRÜKLENEN KART SOLUK, SAYDAM DEĞİL: `opacity: .45` "taşınıyor" demek için
yeterli; daha aşağısı kartı silinmiş gibi gösteriyor. Bırakma hedefi ise
kenarını ve gölgesini `--color-accent-line`a çeviriyor: kitte "buraya
girecek" işareti bu, yeni bir çizgi icat edilmedi.

KART IZGARASI BIRAKMA ALANININ İÇİNDE DEĞİL, KARDEŞİ. İçinde olsaydı bir
kartın üstüne bırakmak yukarı çıkıp "dosya bırakıldı" sayılırdı ve `onAdd` boş
bir listeyle çağrılırdı; `stopPropagation` yazmak yerine iki alanı ayrı
tutmak, aynı hatayı bir daha yapılamaz kılıyor.

KİT DOSYA YÜKLEMEZ. `onAdd` seçilen `File` nesnelerini verir; nereye
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


### Açık biçim yıkamayla, dolguyla değil.

Araç çubuğunda aynı anda ÜÇ düğme açık olabiliyor (kalın + italik + liste).
Üçünü de dolu vurguyla boyamak, "sayfada bir birincil eylem" kuralını çiğniyor
ve çubuğu bir uyarı gibi okutuyor: göz önce oraya gidiyor, oysa oradaki şey bir
eylem değil, metnin hâli. Açık düğme `--color-accent-bg` yıkaması + koyu kenar
alıyor, basılı kalıyor; dolgu birincil eyleme ayrılmış durumda.


### Çıktı: `<b>` yerine `<strong>`.

Tarayıcının `bold` komutu `<b>` üretiyor, ve `<b>` modern HTML'de hiçbir anlam
taşımayan bir sunum etiketi; kalın düğmesinin söylediği şey ise "bu önemli", yani
`<strong>`. Fark akademik değil, ölçüldü: bir vitrinin etiket beyaz listesinde
`<strong>` vardı, `<b>` yoktu, ve kalın yazılan her şey mağazada sessizce düz
metne dönüyordu.

`<i>` DOKUNULMADAN KALIYOR: onun aksine `<i>` hâlâ anlamı olan bir etiket (başka
bir ses tonu, teknik terim, yabancı sözcük) ve tarayıcının doğal çıktısı.

---

## `slider.tsx`

### Kendi dosyasında, çünkü YENİ BİR KONTROL.

Native `<input type="range">` kitin daha önce hiç kullanmadığı bir eleman;
kendi hover, basılma ve odak durumları var. O gün `check-states-stories`
bunu doğru yakalamıştı; kapı Storybook'la birlikte gitti, kural kaldı: bir
kontrol, ALTI durumu da bir yerde gösterilmeden kite girmez. Bugün o yer
doküman sayfası.

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

### Açılır bölümün iki kılığı, ve kılığı kabın vermesi.

Tasarım ikisini birden çiziyor. `Collapsible` tek başına (ya da bir kartın
içinde) bir SATIR: kendi kenarı yok, komşusundan tek bir kuralla ayrılıyor.
`Accordion`un içindeyse bir KART: açık olan 3px taban kazanıyor ve başlığı
yıkanıyor.

SEBEP ÖLÇÜLDÜ: tek yüzeyin içinde çizgiyle ayrılmış satırlarda hangisinin açık
olduğu yalnız OKUN YÖNÜNDEN okunuyordu · üç bölümlü bir listede göz her
seferinde okları taramak zorunda kalıyordu. Açık bölüm taban kazanınca uzaktan
görünüyor.

KILIĞI KAP VERİYOR (`Accordion look`), her bölüme bir prop koymak yerine: aynı
kararı her çağrı yerinde tekrar almak, bir listede iki farklı kılık çıkma yolu
demekti.


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


---

## `square-picker.tsx`

### Logodan amblem seçme · otomatik kesme değil.

Sorulan soru şuydu: yüklenen logoyu ayırıp amblemi kendiliğinden çıkaramaz mıyız?
Çıkaramayız, ve denememesi gerekiyor.

* Dosyada "amblem" diye işaretli bir şey yok. SVG'de bazen bir grup id'si olur ama
  bu tasarımcının keyfine bağlı; PNG'de hiç yok.
* Konum sabit değil: amblem solda, üstte, sağda olabilir, yazının içine gömülü
  olabilir, ya da hiç olmayabilir (yalnız kelime-logo).
* Hata SESSİZ ve KALICI olur. Yanlış kesim patlamıyor; yarım bir harf panelin her
  sayfasının sol üstünde duruyor ve kimse bunun otomatik kesildiğini bilmiyor.

Bu yüzden kesimi İNSAN yapıyor: kare bir çerçeve, sürüklenip boyutlanıyor. Sonuç
tahmin değil karar.

ÇERÇEVE ORANLA TUTULUYOR (0 ile 1 arası), piksel ile değil: önizleme ekrandan
ekrana farklı ölçekte çiziliyor, oran her ölçekte aynı yeri gösteriyor. Ekrana
çizilirken piksele dönüyor ve dönüşüm TEK YERDE (`kenarPx`). Kesim matematiği ile
çerçevenin CSS'i ayrı ayrı hesaplansaydı kullanıcının gördüğü kare ile kesilen kare
farklı olurdu, ve fark sessiz olurdu.


---

## `radio-group.tsx`

### Üstten hizalı ve tam genişlik.

İkisi de iki satırlık bir seçenek yüzünden değişti. `items-center` tek satırlık
etiketlerde doğru duruyordu; altına bir açıklama satırı eklenince işaret iki satırın
ORTASINA kaçıyor ve neyi işaretlediği belirsizleşiyor. İşaret ilk satıra ait.

`w-full` de aynı sebeple: düğme içeriği kadar genişken açıklama erkenden sarıyor ve
seçenekler farklı genişliklerde tırtıklı bir sütun oluşturuyordu. Tam genişlik
hepsini aynı sol kenara ve aynı sarma noktasına oturtuyor.


---

## `primitives.tsx`

### Uyarının gövdesi bir `div`, `p` değil.

Bir uyarının gövdesi çoğu zaman tek bir cümle değil bir LİSTE oluyor ("üç alan
eksik", her biri kendi alanına giden bir bağlantı), ve `<p>` içindeki bir `<ul>`
geçersiz HTML: tarayıcı listeyi paragrafın dışına çıkarıyor, sunucunun ürettiği ağaç
ile istemcininki ayrışıyor, hidrasyon patlıyor. Hata vermeyen bir kırılma değil,
konsola düşen bir kırılma, ama sebebi uyarının kendisinde aranmıyordu.

### Etiket kırpılır, ok kırpılmaz.

`.tamga-btn` `white-space: nowrap` taşıyor ve etiketi saran span'in `min-width`i
`auto`ydu, yani metin kabından uzunsa esnek kutu onu KÜÇÜLTMÜYORDU. Sonuç,
`justify-between`in dağıtacak boşluğu kalmaması ve okun metnin dibine yapışıp sağ
dolguyu taşması. Uzun bir seçenek ("Kargoya verilmeyenler") yan yana duran kısa bir
seçeneğe göre hizasız görünüyordu, ve sebebi hizalama değil TAŞMAYDI.

`min-w-0` + `truncate` etiketi üç noktayla kesiyor, `shrink-0` oku yerinde tutuyor:
ok artık her kontrolde aynı yerde.

### Çoklu seçimde büyüteç sabit, çiplerin peşinde değil.

Önce esnek kutunun SON çocuğuydu: çipler sarınca satır atlıyor ve ikinci, üçüncü
satırın sağ altına düşüyordu. Bir simge bir yer işaretidir; yeri her seçimde
değişiyorsa işaret olmaktan çıkıyor. Kitin kendi `data-leading` mekanizmasıyla sol başa
sabitlendi (`.tamga-input[data-leading]` 40 piksel sol dolgu açıyor) ve ilk satıra
hizalı duruyor: kutu büyüdükçe simge yerinde kalıyor.

### Ağaç seçicide kaydırma alanının iç boşluğu şart.

Ağacın en solundaki açma oku kutunun sol sınırına yapışıyordu, ve `.tamga-mini-btn`
hover'da `translate(-1px,-1px)` ile kalkıyor: o bir piksel kaydırma kabının dışına
çıkıyor ve `overflow-y: auto` onu kırpıyor (bir eksen `visible` değilse öteki de
olamaz). Düğmenin gölgesi de sağa aşağı 2 piksel, o da kırpılıyordu. Dört piksellik iç
boşluk, kontrolün kendi fiziğine yer açıyor.
