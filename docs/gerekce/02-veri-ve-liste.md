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
