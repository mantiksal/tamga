# Kitaplık

Bileşen olmayanlar: renk matematiği, görsel işleme, odak ve kaydırma yardımcıları,
prop ayıklama. Hiçbiri bir şey çizmiyor, ama hepsinin bir kararı var.

> Kod dosyalarında **başlık** duruyor; kanıt burada. Kural:
> [`CLAUDE.md` · Yorumlar](../../CLAUDE.md). Dizin: [gerekçeler](../08-bilesen-gerekceleri.md)


---

## `lib/color.ts`

### Neden bir bağımlılık değil.

İhtiyaç küçük ve KAPIYA bağlı: paletin doğru olup olmadığını
`check-token-contrast` ölçüyor, ve ölçenle üretenin aynı aritmetiği kullanması
gerekiyor. `lib/color.test.ts` ikisinin aynı sayıyı verdiğini kanıtlıyor.

### Neden OKLCH.

Palet "aynı açıklıkta, başka renk" üretmek zorunda: mor bir markanın zemini ile
mavi bir markanın zemini AYNI açıklıkta olmalı, yoksa biri ötekinden koyu görünür
ve kontrast eşikleri kayar. HSL bunu yapamıyor, çünkü HSL'de %50 sarı ile %50 mavi
bambaşka parlaklıkta. OKLab algısal olarak düzgün, yani L sabit tutulduğunda
açıklık gerçekten sabit kalıyor.

### Hex okuyucu geçersiz girdide fırlatıyor.

Önce sessizce `NaN` üretiyordu ve palet gri bir şeye düşüyordu: bir kullanıcı hex
kutusuna `#7c3aed` yazarken ara adımlarda (`#7`, `#7c`) panel griye dönüyor, sonra
geri geliyordu. Hata vermeyen bir bozulma en pahalısı, çünkü sebebi rengin
kendisinde aranıyor.

Kit KATI, çağıran toleranslı: yarım yazılmış bir kodun ne anlama geldiği ekranın
kararı (bkz. `isHex`).


---

## `lib/palette.ts`

Üç kademenin tam gerekçesi `docs/ozel/10-tasarim-dili-yenileme.md`'de; testlerin
tuttuğu şey [Testler ve değişmezler](../09-testler-ve-degismezler.md) altında.

Koyu temada kâğıtlar da kısıtlı kademeye geçiyor. Sıcak marka muhafızı: açık bir
nötrün (L > 0.7) tonu, marka sıcaksa (< 75 ya da > 340) 78'e sabitleniyor ve doyumu
0.8 ile çarpılıyor.


---

## `lib/image.ts`

### Turning an uploaded file into something a panel can carry.

NO LIBRARY, and none is needed: a `<canvas>` and `drawImage`.

A DATA URI, NOT AN OBJECT URL. `URL.createObjectURL` dies with the tab, so a logo
chosen today would be gone tomorrow. A data URI survives in storage and goes
straight into `<img src>`. When a server arrives this file becomes an upload call
and nothing else changes: screens already hold a STRING and do not care whether it
is a data URI or an `https://` address.

WHY IT IS RESIZED. `localStorage` holds about 5 MB per browser and a phone photo
alone is 4 MB. Writing one unresized throws `QuotaExceeded`, and the thing that gets
lost may not be the logo but whatever else was being saved at that moment.

THE RATIO IS KEPT, NOTHING IS CROPPED. Cropping to fit a square is the most common
and most silent mistake: the logo looks fine and its edge is gone. The long side is
pulled to the limit, the short side follows.

PNG, NOT JPEG. Logos are flat and transparent; JPEG turns transparency into solid
black and rings the edges.


---

## `lib/scroll-lock.ts`

### Neden var.

`Sheet` ve `Dialog` odağı hapsediyordu ve Escape'i dinliyordu ama arkadaki sayfa
kaymaya devam ediyordu. Kullanıcı panel açıkken tekerleği çevirdiğinde arkadaki
liste kayıyor, panel kapandığında da kendini bambaşka bir yerde buluyordu. Odak
zaten hapsedildiği için arkayla ETKİLEŞEMİYOR; kaydırabilmesi bir yetenek değil, bir
kaçak.

ÇUBUK GENİŞLİĞİ TELAFİ EDİLİYOR. `overflow: hidden` kaydırma çubuğunu kaldırıyor, ve
çubuk kaybolunca sayfa o kadar genişleyip SIÇRIYOR. Kaybolan genişlik kadar sağdan
dolgu veriliyor, kapanınca geri alınıyor.

PANELİN KENDİSİ KAYAR. Bu kilit yalnız `body`ye bakıyor; panelin gövdesi kendi
`overflow-y: auto` kabında, yani içeriği ekrandan uzunsa yine okunabiliyor. Her şeyi
birden kilitlemek erişilebilirlik hatası olurdu.


---

## `lib/data-props.ts`

### Kit bileşenleri fazladan prop yaymıyor.

Bu bilinçli: 85 bileşenin 78'i böyle. Her şeyi yaymak, çağıranın `className`i,
`onClick`i ya da `style`ı bileşenin kendi davranışının üstüne yazmasına izin vermek
olurdu, yani "kürasyonlu seçenek, serbestlik değil" kararının tam tersi.

AMA `data-*` BAŞKA. Eylemsizdir: HTML'de hiçbir davranışa bağlanmıyor, yalnız bir
kanca taşıyor. Bir testin tutunacağı, bir stilin seçeceği, bir analitiğin okuyacağı
bir kanca, ve bileşeni bozamaz.

Kabul etmemenin bedeli ölçüldü ve yüksek: bir `data-verdict` kancası gerektiği için
tüketici bileşeni bırakıp sınıfını elle yazıyor, ve o sınıfla birlikte gelen
korumaları (kırpma, erişilebilirlik, kaydırma) kaybediyor. Kanca sessizce düşüyor,
hiçbir yerde hata vermiyor: geçen taraf geçtiğini sanıyor, alan taraf hiç çizmiyor.

`aria-*` BU LİSTEDE YOK, bilerek. O eylemsiz değil: bir `aria-label`, bileşenin
kendi hesapladığı erişilebilir adı sessizce eziyor. Erişilebilirlik bir prop olarak
AÇIKÇA istenir.


---

## `components/a11y.ts`

### İlk kontrol, ya da açıkça istenen kontrol.

Varsayılan olarak ilk odaklanabilir eleman odağı alıyor ve çoğu panelde doğrusu bu.
Ama bir onay diyaloğunda ilk kontrol kapatma çarpısı, ikinci sıradaki ise "Sil":
Enter'a basan biri kaydı siliyor. Yıkıcı bir diyalogda güvenli olan varsayılan
olmalı.

`autoFocus` NİTELİĞİ BURADA ÇALIŞMIYOR: React onu bağlarken bu etki henüz koşmamış
oluyor, sonra tuzak odağı ilk elemana çekiyor ve niteliğin etkisi siliniyor. O
yüzden mekanizma DOM üzerinden: panelin içinde `data-autofocus` taşıyan bir eleman
varsa odak onun.

`focusable` listesinden seçiliyor ki gizli ya da devre dışı bir elemana odak
verilmesin: kapalı bir düğmeye odaklanmak, odağı hiç vermemekle aynı şey ama
sessizce.
