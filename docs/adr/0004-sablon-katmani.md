# ADR-0004 · Şablon katmanı

**Durum:** ✅ Kabul edildi · 2026-09-09

## Bağlam

Bir önceki üründe "bir ekran" diye bir nesne yoktu. Her rota kendi çerçevesini kuruyordu: başlık
bandı, eylem şeridi, filtre satırı, yüklenirken ne görüneceği. On altı neredeyse özdeş rota büyüdü
ve on altı kopya zamanla birbirinden kaydı: biri iskeleti dört satır tutuyordu, öteki bir dönen
simge gösteriyordu, üçüncüsü boş hâli hiç düşünmemişti.

Kopyalar kötü niyetten doğmadı. Kopyalamayı **önerilmez** kılan hiçbir şey yoktu, ve öneri bir
mekanizma değildir.

## Karar

Bir **şablon katmanı** var: bir ekranın şekli bir nesne, ve o nesne `tamga-ui/patterns`ten
geliyor. Sekiz şablon: liste, özet, detay, ayar, sihirbaz, oturum, kamusal, kabuk.

Şablon seçip slot dolduran bir rota kendi kromunu **icat edemez**. Mekanizmanın tamamı bu:
çoğaltma önerilmez değil, imkânsız olur.

### Üç kural, hepsinde geçerli

1. **Şablon slot alır, veri çekmez.** Hiçbiri istek atmaz, sorgu bilmez. Durum bir prop olarak
   geliyor; sorgunun sahibi kararı veriyor. Bir şablonun ne gösterdiğini öğrendiği an, o artık bir
   şablon değil bir ekrandır.
2. **Sözcükler dışarıdan.** Şablonlar `labels` alıyor, bir çeviri kancası çağırmıyor. Kütüphane bir
   i18n kütüphanesi seçemez, çünkü seçtiği an tüketiciye de onu dayatır. Asılları `next-intl`
   çağırıyordu ve tam bu yüzden Next dışına çıkamıyorlardı.
3. **Bağlantılar da dışarıdan.** `linkComponent` verilmezse düz `<a>`. Next uygulaması `next/link`
   geçiyor, bir örnek hiçbir şey geçmiyor. Yönlendirici bilen bir şablon yalnız o yönlendiricinin
   içinde çizilebilirdi.

### Dört durum, tek sahip

Her eşzamansız yüzeyin dört hâli var, ve üçü her yerde aynı olduğu için şablona ait:

| durum | ne çizilir |
| --- | --- |
| `loading` | iskelet satırlar, **sözleşmeden** boyutlanmış (`loadingRows`) |
| `error` | `code · request_id` (api-kontrati.html A4) |
| `empty` | bir **slot**, gerçekten ekrana özel olan tek durum |
| `ready` | çağıranın tablosu |

Boş bilerek slot: boş bir "Kullanıcılar" ilkini eklemeye davettir, boş bir "İadeler" iyi haberdir.
Bunlar farklı cümleler ve bir şablon onları yazamaz.

İskeletin satır sayısı **gerçekten gelecek olan sayı**. Dört satır tutup yirmi beş satır indiren
bir iskelet, tam olarak engellemek için var olduğu şeyi yapar: sayfayı zıplatır.

### Şablona özel kararlar

- **Detay · sekmeler rota, durum değil.** Her biri adresi değiştirdiği için bağlantı; düğme olarak
  çizmek geri düğmesini, orta tıkı ve birine sekme bağlantısı göndermeyi kaybettirirdi. Burada
  "boş" hâli yok: bir liste meşru olarak boş olabilir, bir kayıt olamaz. Olmayan kayıt 404'tür, ve
  o bir rotanın cevabıdır. **Sekmeler isteğe bağlı**: "yeni kayıt" ekranı da bir detay ekranıdır
  (aynı iz, aynı başlık, aynı eylem şeridi) ama sekmesi yoktur, çünkü henüz bir kayıt yoktur.
- **Özet · bir kahraman, sonra ızgara.** Kahraman bir slot çünkü iki özet ekranı oraya farklı
  şeyler koyuyor; ama ilişki aynı: tam olarak bir şey cevaptır. İki kahramanı olan bir ekranın
  kahramanı yoktur, ve bir pano tam böyle eşit karolardan oluşan bir duvara dönüşür.
- **Ayarlar · kapsam gösteriliyor, tahmin edilmiyor.** Bir ayarın kişiye mi çalışma alanına mı ait
  olduğu, onu kimin değiştirebileceğini belirliyor. Paneller arasındaki boşluğu şablon veriyor:
  boşluksuz yığılan iki kart tek bir uzun kutu gibi okunuyordu.
- **Sihirbaz · "bitti" konumsal.** Açık adımdan öncekilerin hepsinden geçilmiş; çağıranın taşıması
  gereken bir bayrak yok. Tek kaynak, kayma yok.
- **Oturum · uygulama çerçevesi yok.** Gidilecek bir yer henüz yok, ve açamayacağın menüler sunan
  bir çerçeve yalan söyler. Kayıtta yan panel var, girişte yok: giriş yapan kişi acelesi olan dönen
  bir kullanıcı, kaydolan kişi hâlâ karar veriyor.
- **Kamusal · rayı gizlenmiş uygulama çerçevesi değil.** Beyaz etiketli bir alan adında bu sayfa
  müşterinin kendi sayfasıdır, ve orada bizim rayımızın belirmesi bir müşterinin tedarikçisinin bir
  başka müşterinin markasına sızması olur.
- **Kabuk · menü kabukta yazılmıyor.** Bir kenar çubuğundaki her giriş o ürünün sözlüğüdür ve
  kütüphane hiçbir ürünün sözlüğünü taşımaz (K12, ADR-0001). Açık girişi de çağıran söylüyor
  (`activePath`), bir yönlendirici kancası değil.

## Değerlendirilen alternatifler

**Layout dosyaları (Next `layout.tsx`).** Çerçeveyi verir ama ekranın şeklini vermez: başlık bandı,
dört durum ve boş hâlin slotu yine her rotada yeniden yazılırdı. Sorun çerçeve değil tekrardı.

**Bir "ekran" bileşeni, tek ve genel.** Sekiz farklı şekli bir bileşene sığdırmak on beş prop'luk
bir anahtar tahtası üretiyordu; çağrı yeri hangi kombinasyonun geçerli olduğunu bilemezdi.

**Kopyala-yapıştır şablonlar (tarif).** Bloklar için doğru cevap bu, çünkü blok bir soyutlama
maliyeti taşımıyor. Ekran şekli için yanlış: kopyalar kayar, ve ADR'nin çıkış noktası tam olarak
kayan on altı kopyaydı.

## Sonuçlar

- Şablonlar **ayrı bir girişte** (`tamga-ui/patterns`), ana `tamga-ui`de değil. Bir bileşen ile bir
  ekran şekli aynı şey değil: kitin bileşenleri hiçbir düzen dayatmıyor, şablonlar dayatıyor. Ayrı
  giriş, bir ürünün "yalnız bileşenleri alayım" diyebilmesi demek.
- Yeni bir ekran türü, yeni bir şablon **değil** ilk önce bir slot arayışıdır. Sekizi de bir
  ekranın şeklini anlatıyor; dokuzuncu ancak gerçekten yeni bir şekil varsa gelir.
- Tüketici dokümanı: `/docs/templates`: sekiz şablon, on iki canlı ekran.
