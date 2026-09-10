# Doküman sitesi · iç notlar

Bu dosya **siteyi bakanlar** için. Tüketicinin okuması gereken hiçbir şey burada değil; o
`apps/docs` içindeki sayfalarda. Buradakiler siteyi kurarken çıkan kararlar ve tuzaklar.

---

## İçerik kaynaktan üretiliyor

Dört dosya her `dev` ve her `build` öncesinde yeniden üretiliyor (`predev` / `prebuild`), ve
hiçbiri depoda durmuyor:

| dosya | üreten | ne |
| --- | --- | --- |
| `props.json` | `extract-props.mjs` | 102 bileşenin prop'ları ve gerekçeleri |
| `tokens.json` | `extract-tokens.mjs` | token değerleri, iki tema, kontrast rozetleri, utility'ler |
| `icons.json` | `extract-icons.mjs` | adlandırılmış roller ve grupları |
| `counts.json` | `extract-counts.mjs` | bileşen · sınıf · token · ikon · kapı · sayfa sayıları |

**Neden elle yazılmıyor.** Elle yazılan bir tablo ilk değişiklikte yalan söylemeye başlar ve
yalanı kimse fark etmez, çünkü doküman derlenmiyor. Bu site aynı sessiz bozulmayı üç kez yaşadı:
"132 token" yazıyordu, sayfa 124 sayıyordu; "67 sınıf" yazıyordu, gerçek 87'ydi; "43 glif"
yazıyordu, 88 olmuştu.

**Kural:** doküman metninde bir sayı geçiyorsa `counts.json`dan gelecek. Sabit yazılmış her sayı
bir sonraki değişiklikte yalan olur.

## İki dil

Sayfa metni sayfanın kendi dosyasında, iki dilli bir `T` bloğunda, sözlükte değil. Bir doküman
paragrafını JSON anahtarına çevirmek onu okunamaz yapar. İkisi yan yana durduğunda birinin
güncellenip ötekinin unutulması **görünür** oluyor.

**Üretilen metinler de iki dilli.** Prop ve token gerekçeleri kaynaktaki yorumdan geliyor ve o
yorumların bir kısmı İngilizce bir kısmı Türkçe yazılmıştı: iki dilin sayfası da yarı yarıya
ötekini basıyordu. Konvansiyon `scripts/dil.mjs`de: yorumun içinde `TR:` satırı. İki kapı
çevirisiz gerekçede build'i kırıyor.

**Yol iç adı ile genel adresi ayrı.** Klasör adı Next'te doğrudan URL segmenti oluyor, yani elle
kurulmuş bir `[lang]` düzeni sayfa başına tek bir yazım taşıyabiliyor; Türkçe okuyan biri adres
çubuğunda `docs/icons` görüyordu. Bir süre bu "slug'lar çevrilmez" diye bir ilke gibi yazıldı ve
yanlıştı: kısıttı.

Çözüm **localized pathnames**: uygulama iç rotaya göre yazılıyor, middleware genel yolu ona
`rewrite` ediyor, `yol()` de bağlantıyı o dilde kuruyor (`content/yollar.ts`). Ters yön 308:
`/tr/docs/icons` doğrudan girilirse `/tr/docs/ikonlar`a gidiyor, tek kanonik adres kalıyor.

**Kavram sayfaları çevrildi, bileşen sayfaları çevrilmedi.** `Button` sayfasının başlığı iki dilde
de "Button" (`nav.ts` bunu bilerek yapıyor: kodda yazılacak şey `<Button>`), ve sayfa "Button"
derken yolun "dugme" demesi ikinci bir ad üretirdi.

Dil değiştirici de yolu **yeniden kuruyor**, öneki değiştirmiyor: önek değiştirmek
`/en/docs/ikonlar` üretiyor ve 404 veriyordu.

## Kapılar

`check-docs-i18n` iki dil paritesini, çevrilmemiş sayfaların uyarı gösterdiğini ve **kırık iç
bağlantıları** denetliyor. Bağlantı denetimi bir kez yalnız `<Xref>`e bakıyordu ve açılış
sayfasının şablon dizgisiyle yazılmış `href`lerini görmüyordu: slug'lar taşındığında sitenin ana
sayfasındaki "Kuruluma başla" düğmesi 404 verdi. Artık `/docs/<slug>` biçimindeki her dizgi
denetleniyor.

## Galeri (Bloklar ve Şablonlar)

Katalog sayfalarının ortak bileşeni `components/gallery.tsx`.

- **Kart bir `div`, `button` değil.** Önizlemenin içinde de düğmeler var, ve `<button>` içinde
  `<button>` geçersiz HTML: tarayıcı içtekini dışarı çıkarıyor, sunucunun ürettiği ağaç ile
  istemcininki ayrışıyor, hidrasyon patlıyor. Tıklama alanı yine kartın tamamı; ayaktaki düğmenin
  `::after`ı kartı kaplıyor ("gerilmiş bağlantı").
- **Blok kırpılıyor, ekran küçültülüyor.** Blokta soru "bu bölüm neye benziyor": kırpmak metni
  okunur bırakıyor. Ekranda soru "bu ekranın şekli ne": kırpmak yalnız başlık şeridini gösteriyor,
  ve ortalanmış oturum ekranlarını hiç göstermiyordu: iki kart bomboş duruyordu.
- **Ölçek JS'ten.** Sabit bir `scale()` yalnız tek bir kart genişliğinde oturuyor, ama kart
  genişliği ekranla değişiyor (ölçülen: 352px, varsayılan 259px). CSS iki uzunluğu bölüp birimsiz
  sayı vermediği için oran bir konteyner sorgusuyla da kurulamıyor; kuyu bir `ResizeObserver` ile
  ölçülüyor.
- **Modalin çerçevesi kart değil tek çizgi.** Kart olduğunda uygulamanın kendi yüzeyiyle üst üste
  biniyordu: diyaloğun kenarı, kartın kenarı, kabuğun yüzeyi, altmış piksel içinde üç eş merkezli
  çizgi. İçeriği kendi çerçevesini taşıyan öğeler (`tamCerceve: "yok"`) hiç çerçeve almıyor.

## Şablon önizlemeleri

- **Her ekran gerçek `AppShell` içinde.** Bir süre şablonlar beyaz bir kutuda tek başına
  duruyordu: rayı, üst şeridi, dolu bir tablosu olmayan bir "liste ekranı", yani bir ekran değil
  dikdörtgenler arasına yazılmış bir kelime kümesi.
- **Seyrek veri ekranı yalan gösteriyor.** Dört satırlık bir sipariş tablosu diye bir şey yok.
  Yoğunluk bir süs değil: bir liste ekranının nasıl davrandığı ancak dolu bir tabloda görünüyor.
- **Bağlantılar gezinmiyor.** Modal canlı ve tıklanabilir, ama örnek uygulamanın rayı var olmayan
  yollara işaret ediyor; okuyucu şablonu kurcalarken siteden dışarı atılıyordu. `linkComponent`
  ile gezinme kesiliyor, `href` yerinde kalıyor.
- **Örnek sözlük e-ticaret.** Kütüphaneye bir ürünün sözlüğü giremez (`check-names`, yalnız
  `packages/` tarar) ama dokümanın örneği bir şey anlatmak zorunda: "Kayıt" başlıklı bir liste bir
  ekranı değil bir yer tutucuyu gösteriyor. Önce plak dükkânıydı; kimse plak satmıyor.

## Portlar

Doküman sitesi **6070**. v2 ile çakışmasın diye ayrı.
