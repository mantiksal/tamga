# Veri ve liste

Bir kümeyi okutan şeyler: tablo, sayfalama, kayıt akışı.

> Kod dosyalarında **başlık** duruyor; kanıt burada. Kural:
> [`CLAUDE.md` · Yorumlar](../../CLAUDE.md). Dizin: [gerekçeler](../08-bilesen-gerekceleri.md)


---

## `data-table.tsx`

### DATA TABLE · ve neden tek bir `<DataTable data={…} />` DEĞİL.

shadcn'in "data table"ı bir bileşen değil bir TARİFTİR: TanStack Table'ı
kendi bileşenlerine bağlamayı gösterir. Sebebi iyi: bir tabloya veri
verdiğin an, o bileşen veri katmanı hakkında karar vermeye başlar ·
sıralama sunucuda mı istemcide mi, sayfa URL'de mi state'te mi, filtre
hangi biçimde gider. Bunlar ÜRÜN kararlarıdır ve bir kitin bilmemesi gerekir.

O yüzden kit bir tablo motoru göndermiyor; motorun eksik olan PARÇALARINI
gönderiyor. Üçü de kendi başına çalışır, veri görmez, karar vermez:

  SortHeader     "bu sütuna göre sıralı, artan" → başlık + yön işareti
  SelectAll      belirsiz (indeterminate) durumu doğru olan baş onay kutusu
  SelectionBar   "3 kayıt seçildi" + toplu eylemler

Sıralamayı, seçimi ve sayfayı ürün tutar; kit onları OKUNUR kılar.


### Sıralı olmayan sütunun glifi · ok değil, davet.

YÖN oku yalnız sıralı sütunda ve vurgu renginde: bir tabloda "neye göre sıralı"
sorusu, sıralamanın kendisinden daha sık sorulur. Ama sıralanabilir sütunlar bir
süre HİÇ glif taşımadı, ve o hâlde başlığın tıklanabilir olduğu hiçbir yerde
yazmıyordu · kullanıcı sıralamayı ancak kazara buluyordu.

Üçüncü bir işaret gerekiyordu, ve iki yönlü nötr glif (`Sort`) tam o: yön
söylemiyor, "bu başlık bir kontrol" diyor. Hepsine aynı YÖN okunu koymak
hangisinin etkin olduğunu okunmaz yapardı · reddedilen tasarım buydu, ve
reddedilme sebebi hâlâ geçerli.


### Baş kutu kendi kutusunu çizmiyor.

`SelectAll` bir süre `role="checkbox"` taşıyan bir `span`di ve işaretini kendi
eliyle basıyordu: işaretliyken `Checkbox`ın çentiği yerine düz bir KARE. Aynı
sütunda iki farklı işaret duruyordu, ve fark yalnız hepsi seçiliyken görünüyordu.

`Checkbox` üçüncü hâli (`indeterminate`) öğrendiği an bu kopyanın gerekçesi
bitti. Şimdi ikisi de aynı bileşen, aynı ölçü (`compact`), aynı klavye.


### Liste satırı ile tablo satırı aynı grileri kullanıyor.

İkisi aynı işi yapıyor ve yan yana durduklarında iki farklı vurgu grisi
okunuyordu: tablo `--color-hover`, liste `--color-sunk`. Kesik çizgide bir kez
düzeltilmişti, zeminde kalmış. Yükseklik de `height` iken `min-height` oldu:
satır iki satırlık (başlık + alt metin) olabiliyor ve sabit yükseklikte alt
metin kutudan taşıyordu.


### Seçim çubuğu bir şerit değil, bir ada.

Kendi genişliği kadar, ortalanmış, yükseltilmiş ve ters zeminde. Tam genişlikte bir
bant, zaten bantlardan kurulu bir ekranda bir bant daha oluyordu ve taşıdığı sayı
aralarında kayboluyordu.

`sticky`, yani nereye konursa oraya oturuyor; kaydırılan bir alanın içindeyse altta
asılı kalıyor. Seçim boşken hiç render edilmiyor, çünkü boş bir çubuk yer kaplıyor
ve bilgi vermiyor.

---

## `pagination.tsx`

### Pagination.

NEDEN BİLEŞEN OLDU. Sayfalama sözleşmesi bir üründe zaten kodluydu
(`page_size` varsayılan 25, son sayfa `count`tan türetilir) ama EKRANDA
GÖSTERECEK bir şey yoktu. Her liste ekranı kendi sayfalayıcısını yazmak
zorundaydı · ve bir sayfalayıcının zor kısmı görünüşü değil, aritmetiği:
kaç sayfa var, hangi numaralar gösterilir, kısaltma nereye konur.

NUMARA PENCERESİ. 200 sayfalık bir listede 200 düğme çizmek anlamsız; bu
bileşen her zaman İLK, SON ve aktif olanın etrafındaki komşuları gösterir,
aradaki boşluğa `…` koyar. Pencere sabit genişlikte, yani sayfa değiştikçe
düğmeler yerinden oynamaz · oynasaydı "sonraki"ye iki kez basmak imkânsız
olurdu.

TOPLAM SAYI OPSİYONEL. Bazı uçlar `count` döndürmez (imleç tabanlı
sayfalama). O durumda numaralar gizlenir, ileri/geri kalır.


---

## `log-view.tsx`

### Log görüntüleyici.

Bir panelde log göstermek `<pre>` yazmaktan ibaret GÖRÜNÜR, ve değildir.
Üç şey ayrı ayrı yanlış gider:

  1. Yeni satır geldiğinde kaydırma. Her seferinde en alta atlamak,
     yukarıda bir şey OKUYAN kişiyi sürekli aşağı fırlatır.
  2. Uzun satırlar. Sarmalamak zaman damgası hizasını bozar, kesmek
     bilgiyi yok eder.
  3. Ekran okuyucu. Saniyede üç satır akan bir bölgeyi `aria-live` ile
     duyurmak, sesli okuyucuyu kullanılamaz hâle getirir.

FIRLATMAMANIN BEDELİ VAR, ve ödenmesi gerekiyor. Takip yalnız zaten alttaysan
çalışınca, yukarıda okuyan kişiye gelen satır GÖRÜNMÜYOR: akış durmuş gibi
duruyor ve kullanıcı sayfayı yeniliyor. "↓ 12 yeni satır" düğmesi tam bu boşluk
için · sayıyı `labels.newLines` yazıyor çünkü çoğul kuralı dile göre değişiyor,
ve aşağı inildiği an sayaç sıfırlanıyor.

SAYAÇ BİR `ref`TE DEĞİL STATE'TE DEĞİL · İKİSİ DE. Son görülen satır sayısı bir
`ref`te (render tetiklemesi gerekmiyor), okunmamış sayısı state'te (düğmenin
metni o). İkisini de state yapmak her satırda iki render demekti.

SEVİYE ROZETİNİ KİT ÇİZER, SÖZCÜĞÜNÜ ÜRÜN YAZAR. `level` bir string, `tone`
rengi: "WARN" ile "UYARI" aynı rozet, ve kit hangisinin doğru olduğunu bilemez.
Rozetin YUVASI sabit genişlikte, rozetin kendisi metni kadar · yoksa mesaj
sütunu her satırda başka yerden başlıyor ve akış okunmuyor.

AKIŞ AÇIK ZEMİNDE. Tasarım notu "koyu panel" diyor; kitin referans markup'ı ise
log'u tablolarla aynı açık kartta çiziyor, ve kitte koyu kalan tek yüzey seçim
çubuğu · o da bir ADA. Sayfanın ortasındaki 320px'lik koyu blok, ekranın ağırlık
merkezini bir günlüğe verirdi. Markup kazandı.


---

## `timeline-strip.tsx`

### TimelineStrip · kova başına bir işaret, renk durumu taşır.

ADI NEDEN DEĞİŞTİ. Bu bileşen bir izleme ürününde doğdu ve orada o alanın
kelimesiyle anılıyordu: her çubuk bir zaman dilimindeki erişilebilirliği
gösteriyordu. Ama mekanizma alandan bağımsız · aynı şerit bir e-ticaret
panelinde günlük sipariş yoğunluğunu, bir depo panelinde stok durumunu
gösterir. Eski ad o ürünün sözlüğüne aitti, bu bileşenin değil.

KOVA BAŞINA BİR İŞARET, ve araya boşluk. Bitişik bir şerit tek bir sürekli
çubuk gibi okunur; boşluk "bunlar ayrı ölçümler" der. Gauge'un sert kare
segmentleriyle aynı işaret ailesi.
