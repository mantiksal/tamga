# Grafik ve ölçüm

Sayıyı şekle çeviren şeyler. Hepsinin ortak kuralı: eksen etiketi olmayan grafik resimdir.

> Kod dosyalarında **başlık** duruyor; kanıt burada. Kural:
> [`CLAUDE.md` · Yorumlar](../../CLAUDE.md). Dizin: [gerekçeler](../08-bilesen-gerekceleri.md)


---

## `bar.tsx`

### Yatay çubuk grafik · SIRALAMA ve KARŞILAŞTIRMA.

NEDEN YATAY. Kategori adları uzun ("Al Thumama (Al Wakrah)", "İbrahim
Öztürk") ve dikey bir çubukta o adlar eksene eğik yazılıyor, ya da
kırpılıyor. Yatayda ad kendi satırında düz duruyor; okumak için kafa
çevirmek gerekmiyor.

NEDEN PASTA DEĞİL. Bir sıralama parça-bütün değildir. "En çok sipariş veren
on müşteri" 36 binin onu; pastadaki "%23.40" o on kişinin içindeki payı
söylüyor ve bu hiçbir soruya cevap vermiyor. Çubukta uzunluk doğrudan
SAYIYI gösteriyor ve karşılaştırma doğru kalıyor.

SIFIRLAR ÇAĞIRANIN İŞİ. Bu bileşen verdiğin her satırı çiziyor; hangi
satırların gösterileceğine karar vermek veriyi bilenin işi. (Eski panelde
lokasyon grafiği ülkedeki BÜTÜN illeri, üyesi olmayanları da dahil, tek tek
çiziyordu: dört çubuk ve üç yüz boş satır.)


---

## `chart.tsx`

### Çizgi grafik · eksenli, gerçek grafik.

`Sparkline` eksensizdir ve tek soruya cevap verir: yön ne? Bu onun
yapamadığını yapıyor · DEĞER okutuyor. Bir gecikme grafiğinde "yükseliyor"
yetmez; "kaç milisaniye" gerekir.

NEDEN BİR GRAFİK KÜTÜPHANESİ DEĞİL. Recharts ya da Chart.js bir
bağımlılıktır ve kendi görsel dilini getirir: kendi gölgesi, kendi
yuvarlatılmış çizgisi, kendi tooltip'i. Kitin dört yasasını o kütüphaneye
dayatmak, onu yeniden yazmakla aynı işi çıkarır. Buradaki SVG üç yüz satır
değil; ve tamamı kitin token'larıyla çiziliyor.

NE YAPMIYOR: yığılmış alanlar, ikinci eksen, zum, legend sürükleme. Onlar
gerekirse bir bağımlılık doğru cevap olur · ama gerekmeden getirilmez.


---

## `pie.tsx`

### Pasta / halka grafik · PARÇA-BÜTÜN, ve yalnız o.

NE ZAMAN KULLANILIR: dilimler bir BÜTÜNÜ oluşturuyorsa, ve sayıları azsa.
İki ya da üç dilimde göz oranı bir bakışta okuyor. Beşi geçtiğinde
okumuyor: küçük dilimler ayırt edilemiyor, etiketler çizginin ucunda
birbirine giriyor, ve grafik bir çubuk grafikten daha az şey söylüyor. O
yüzden `slices` beşle sınırlı; daha fazlası `BarChart`in işi.

NE ZAMAN KULLANILMAZ: bir SIRALAMA. "En çok sipariş veren on müşteri" bir
bütün değil, 36 binin onu; oradaki yüzdeler "bu on kişinin içinde" demek ve
hiçbir soruya cevap vermiyor.

HALKA VARSAYILAN, VE SEBEBİ ORTADAKİ BOŞLUK. Bir yüzde, paydası
görünmediğinde yarım bilgidir: "%75" ile "188/250" aynı şey değil. Halkanın
ortası toplamı yazacak yer veriyor. `inner={0}` tam pasta çiziyor.

NEDEN BİR GRAFİK KÜTÜPHANESİ DEĞİL: `LineChart`teki gerekçenin aynısı. Bir
kütüphane kendi görsel dilini getirir; buradaki SVG kitin token'larıyla
çiziliyor ve yüz satır değil.


---

## `sparkline.tsx`

### Sparkline · satır içi, eksensiz mini grafik.

Bir tablo hücresine sığar ve tek bir soruya cevap verir: "yön ne?" Eksen,
ızgara ve etiket YOK · onlar gerçek bir grafiğin işi. Bir sparkline
okunmaz, göz ucuyla görülür.

Son nokta bir kare ile işaretli: gözün nereye bakacağını söyleyen tek şey,
ve "şu an" ile "geçmiş" arasındaki farkı kuran işaret.


---

## `stacked-bar.tsx`

### Yığılmış sütun grafiği · HER GÜN İÇİN HEM TOPLAM HEM KIRILIM.

NE ZAMAN. Bir zaman ekseni var ve her noktada bütünün parçaları
gösterilecek: günlük sipariş tutarının duruma göre dağılımı gibi. Sütunun
TAM YÜKSEKLİĞİ o günün toplamı, içindeki dilimler kırılımı. Tek bakışta iki
soru birden cevaplanıyor.

NEDEN ÇOK ÇİZGİ DEĞİL. Dört ayrı çizgi kırılımı gösterir ama TOPLAMI
göstermez; okuyucunun dört değeri gözüyle toplaması gerekir. Toplam bu
grafikte çoğu zaman asıl sorudur.

NEDEN YATAY DEĞİL. `BarChart` sıralama içindir ve kategori adları uzundur.
Burada eksen ZAMAN, ve zaman soldan sağa akar.

NE YAPMIYOR: yüzde yığını (%100'e normalize), negatif değer, ikinci eksen.
Gerekirse ayrı bir bileşen olur; bu bileşenin yaptığı işi bulanıklaştırmaz.


---

## `progress.tsx`

### Progress · an instrument scale.

A solid fill over a ticked track: a tick every 10%, full-strength at 50%.
The ticks are the point. They let the value be read at a glance without
reading the number, which is what a gauge is for and what a plain bar cannot
do. It is a cousin of ScoreRing's ticks rather than a new idea.

It is deliberately NOT the segmented strip form. A segmented horizontal strip
reads as a TIMELINE · one mark per bucket, colour carrying state; borrowing
that shape for completion would read as history at a glance.

Always neutral. Progress reports completion, not state · a status colour
here would be a signal that is not true.
