# Doküman sitesi · iç notlar

Bu dosya **siteyi bakanlar** için. Tüketicinin okuması gereken hiçbir şey burada değil; o
`apps/docs` içindeki sayfalarda. Buradakiler siteyi kurarken çıkan kararlar ve tuzaklar.

---

## İçerik kaynaktan üretiliyor

Dört dosya her `dev` ve her `build` öncesinde yeniden üretiliyor (`predev` / `prebuild`), ve
hiçbiri depoda durmuyor:

| dosya | üreten | ne |
| --- | --- | --- |
| `props.json` | `extract-props.mjs` | bileşenlerin prop'ları ve gerekçeleri |
| `tokens.json` | `extract-tokens.mjs` | token değerleri, iki tema, kontrast rozetleri, utility'ler |
| `icons.json` | `extract-icons.mjs` | adlandırılmış roller ve grupları |
| `counts.json` | `extract-counts.mjs` | bileşen · sınıf · token · ikon · şablon · sayfa sayıları, sürüm, ve `verify` zincirinin kendisi (22 adım · 18 kontrol) |

**Neden elle yazılmıyor.** Elle yazılan bir tablo ilk değişiklikte yalan söylemeye başlar ve
yalanı kimse fark etmez, çünkü doküman derlenmiyor. Bu site aynı sessiz bozulmayı üç kez yaşadı:
"132 token" yazıyordu, sayfa 124 sayıyordu; "67 sınıf" yazıyordu, gerçek 87'ydi; "43 glif"
yazıyordu, 88 olmuştu.

**Ve dördüncüsü bu dosyanın kendisiydi.** Yukarıdaki tablo "102 bileşenin prop'ları" diyordu;
gerçek 123'e çıkmıştı. Kuralı yazan paragrafın üç satır üstünde duruyordu ve aylarca kimse
görmedi. Düzeltmesi sayıyı güncellemek DEĞİL, sayıyı kaldırmaktı: güncellenen bir sayı yalnız
saati sıfırlar.

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

## Kabuk ve sayfa blokları · 27 Eylül 2026

Sitenin tasarım dili baştan yazıldı. Ölçüler ve davranış bir tasarım referansından
geliyor; aşağıdakiler o referansın koda çevrilirken verilen kararları.

### Tek yeni renk yok

Kabuğun ihtiyaç duyduğu on beş rengin on beşi de kitte zaten tanımlıydı, başka adla.
`globals.css`in başındaki eşleme tablosu o karşılıkları yazıyor: kabuk zemini
`--color-band`, kart `--color-shell`, 1px kenar `--color-edge`, 1.5px kenar
`--color-edge-strong`, kod zemini `--color-inverse`, seçili zemin
`--color-accent-bg`. Site kitin canlı kanıtı olduğu için bu bir tercih değil bir
zorunluluk: doküman sitesi kendi paletini yazsaydı, kitin paletinin yeterli olup
olmadığı hiç sınanmazdı.

İki istisna var ve ikisi de yazılı: `--docs-cb-line` ve `--docs-cb-muted`. Kod
bloğunun sabit koyu yüzeyinde bir ayraç ve bir ikincil mürekkep gerekiyor; kitin ters
yüzey ailesi üç üye taşıyor (yüzey, mürekkep, kenar) ve bu ikisi yok. İkinci bir
tüketici çıktığı gün kite taşınırlar.

**Referansın koyu temasından üç yerde ayrıldık**, çünkü orada kitin kendi değeri var:
kesik çizgi rengi, seçili zeminin derinliği, ve vurgu. Referans koyu temada da
`#1E4FD8` diyor; kit koyu temada vurguyu açıyor (`#709dfd`) ve gerekçesi ölçülü
(yakın bir zeminde koyu mavi dolgu sayfadan ayrışmıyor). Doküman sitesinin kitin
düğmesinden başka bir düğme göstermesi, kitin kendisi hakkında yanlış bilgi olurdu.

### Kopyalanan markup değil, bileşen

Referans "kabuğu aynen kopyala" diyor. Bu bir tarayıcıda açılan tek dosyalık maket
için doğru, 96 sayfa için değil: kopyalanan bir blok, ölçüsü değiştiği gün 96 yerde
değiştirilmesi gereken bir blok demek ve biri mutlaka atlanır.

Bloklar `components/prose.tsx` içinde (`PageHead` · `Step` · `Section` · `Note` ·
`RefTable`) ve kod bloğu `components/kod.tsx` içinde. Sayfa yalnız kendi metnini
yazıyor.

**Kırıntı yolu ve önceki/sonraki kartları SAYFALARDA DEĞİL, kabukta.** İkisi de
rotadan türüyor: kabuk `pathname`i zaten biliyor, `nav.ts` de grubu ve okuma sırasını.
96 sayfaya elle yazılan bir şey, 96 kez unutulabilir.

### Okuma sırası tek kaynaktan

`nav.ts`teki menü sırası ile okuma sırası aynı şey. `okumaSirasi()` grupları
düzleştiriyor, `komsular()` önceki/sonrakini veriyor, `grupAdi()` kırıntı yolunun
ortasını. İkinci bir sıra dizisi tutulsaydı bir gün menüyle ayrışırdı.

### Adım numarası ile içindekiler

Numaralı bir adımın başlığı numarayı tekrar etmiyor (numara kutuda), ama içindekiler
sırayı söylemek zorunda: "Paketi kur" ile "Kullan" arasındaki ilişki numarasız
okunmuyor. `Step` başlığa `data-toc` yazıyor, `Toc` varsa onu okuyor.

### Aktif içindekiler satırı konumdan hesaplanıyor

Gözlemcinin "kesişiyor mu" cevabı yetmiyordu: dar bir bant tanımlanınca iki başlık
arasında hiçbir satır yanmıyordu, yani içindekiler tam da en çok işe yarayacağı yerde
susuyordu. Kural artık boşluk bırakmıyor: şeridin altını geçmiş SON başlık aktif.
`IntersectionObserver` yalnız tetikleyici, cevabın kendisi değil.

### Temanın sahibi site, kit değil · iki seçenek

Sitenin cevabı AÇIK ya da KOYU, üçüncüsü yok. Kitin `ThemeToggle`u bir de "sistem"
tutuyor ve o yüzden burada kullanılmıyor: kontrol kitin `Segmented`ı ile iki hücre
olarak kuruluyor, tercihi `components/tema.tsx` tutuyor.

İlk ziyarette başlangıç değerini yine işletim sistemi veriyor (`layout.tsx`teki
engelleyici script), ama okuyucu bir kez seçtiğinde tercih ikisinden biri oluyor.
Script engelleyici olmak zorunda: React bağlandıktan sonra çalışan bir etki, koyu
tema seçmiş birine bir kare açık ekran gösteriyor. Kitin dokümanı da bunu böyle
söylüyor, çünkü kitin bir `<head>`i yok.

### Şerit: arama · TR/EN · tema · GitHub

Dördü de aynı dili konuşuyor. Dil değiştirici bir süre anahtardı ve yanındaki tema
anahtarıyla karışıyordu: iki anahtar yan yana, hangisinin dili hangisinin temayı
değiştirdiği bakarak anlaşılmıyordu. İkisi de segment olunca seçili olan kendi adıyla
yazılı duruyor.

760 pikselin altında sürüm etiketi ile dil segmenti, aramanın da metni ve kısayolu
gizleniyor: şerit orada yalnız gezinmeyi taşıyor (menü, logo, arama ikonu, tema,
GitHub).

### Dördüncü yüz kalktı

Site bir ara Chakra Petch taşıyordu (Google'dan çekilen bir marka yüzü, yalnız en
büyük başlık tierinde). Kitin üç yüzü pakette geliyor ve "üç yüz, her birinin bir işi
var" kitin kilitli kararı; dördüncüsü hem bir ağ isteği hem o kararla çelişen bir
istisnaydı. Başlıklar artık `--font-display` (Red Hat Display) ile çiziliyor.

### Arama

96 sayfa için tek giriş: şeritteki şey aramanın kendisi değil onu açan düğme, gerçek
girdi diyalogda (⌘K / Ctrl+K her yerden açıyor). Eşleşme Türkçe küçük harfe göre:
`toLocaleLowerCase("tr")` olmadan "İkonlar" araması "ikonlar" yazana sonuç vermiyor.

### Bileşen sayfası şablonu

Bir bileşen sayfası şu sırayı izliyor: kırıntı yolu → başlık bloğu (H1 + `<Sembol>`
etiketi + blurb) → giriş paragrafı → örnek kutusu → kurallar → props → ilgili →
önceki/sonraki. İlk üçü ve son ikisi kabuktan geliyor, ortası sayfanın.

**Sembol başlıktan türüyor, elle yazılmıyor.** Menüde adlar ayrık ("Score ring"),
kodda bitişik (`ScoreRing`); `PageHead` boşlukları kaldırıp `props.json`a karşı
doğruluyor. Üretilen veride yoksa etiket hiç çizilmiyor, yani kavram sayfaları
(Kurulum, Tema) etiket almıyor ve uydurulmuş bir bileşen adı basılamıyor.

**Örnek kutusu kırpmıyor.** Referans `overflow: hidden` diyor; burada kutunun içinde
açılan paneller var (Combobox listesi, DatePicker takvimi, MultiSelect seçenekleri) ve
kırpma onları kutunun kenarında kesiyordu. Köşeleri şeridin kendi zemini ve alt kuralı
kapatıyor.

**Önizleme noktalı ızgarada** (16px modül, kitin 8px'inin iki katı): bir bileşenin
boşlukta yüzmediğini söylüyor ama çizgili bir zemin gibi bileşenin kendi kenarlarıyla
yarışmıyor. "Dene" şeridi önizlemeden KESİK çizgiyle ayrılıyor, çünkü altındaki şey
örneğin parçası değil örneği DEĞİŞTİREN şey.

**İçindekilerin ilk satırı "Örnek".** Kutunun başlığı yok, ve içindekilerde karşılığı
olmayan bir bölüm okuyucuya "buraya dönemezsin" demek. Kimliği `Toc` veriyor, kutunun
kendisi değil: bir sayfada birden çok örnek olabiliyor ve aynı id'yi iki kez basmak
geçersiz HTML olurdu.

**Props tablosu dört sütun** (prop · tip · varsayılan · açıklama), dar ekranda kendi
içinde kayıyor. Zorunluluk renkle değil KELİMEYLE söyleniyor: bir tabloda kırmızı bir
hücre "hata" diye okunur, "gerekli" diye değil. Açıklaması olmayan prop'un hücresi boş
kalıyor; uydurulmuş bir açıklama, açıklaması olmayan bir proptan kötü.

Bir sayfada birden çok tablo varsa her birinin üstünde `<BileşenAdı>` etiketi duruyor
(`etiketli` prop'u, on sayfada). Tek tablolu sayfada verilmiyor: orada etiket,
başlığın yanındaki sembolü ikinci kez söylemek olur.

**Referansın 10.5 ve 12.5 puntolarını almadık.** Ölçekte zaten 11.5 ve 12 var, ve
tipografi sayfasının kendi uyarısı tam bu: "bir tık büyük dursun" diye eklenen ara
değerler, 19 elle yazılmış boyutun nasıl doğduğunun hikâyesi.

### Kırılımlar ölçüden

Üç tanesi ve üçü de bir sütun kararı: ray 900 pikselde açılıyor (264 + 760 ondan önce
sığmıyor), içindekiler 1240'ta, tanıtım şeridindeki bölüm bağlantıları 1100'de.
Tailwind'in hazır adımları (`md`, `lg`, `xl`) bu ölçülerin hiçbirine denk gelmiyor, o
yüzden `@theme` içinde kendi adımlarımız var.

## Portlar

Doküman sitesi **6070**. v2 ile çakışmasın diye ayrı.

## Tema sayfası anlattığı şeyi gösteriyor

`/tr/docs/tema` uzun süre metin + iki kod bloğuydu: "bir markayı değiştirmek tek bir blok yazmak"
diyordu ve o bloğun ne yaptığını göstermiyordu. Sayfa yeniden kuruldu ve dört bölümün dördü de
artık canlı:

- **Bir markanın tamamı** · beş renk kutusu ve üç köşe yarıçapı. Seçim değişince hem soldaki kod
  bloğu hem sağdaki örnek panel dönüyor, ve köşeler tek sayıdan türüyor (kart r+2, kontrol r,
  anahtar r−2, topuz r−4): `--radius`ın ne yaptığı ancak hepsi birlikte değişince görünüyor.
- **Üç katman** · numaralı adımlar ve aralarında kesik bağlayıcı; ①'in kodu seçili rengi taşıyor.
- **Koyu tema** · iki kart yan yana: token iki temada da tanımlıyken ve koyu unutulmuşken. Alttaki
  iki şerit açık ve koyu zemini YAN YANA gösteriyor, ve bu yüzden tema değişkeni değil sabit değer
  kullanıyorlar (`docs-tema-acik` / `docs-tema-koyu`): tema token'ıyla çizilseydi iki kutu da aynı
  tarafı gösterirdi.
- **Kontrast kapısı** · dört satır, kitin kendi matematiğiyle (`contrast` ve `deltaL`,
  `tamga-ui/palette`ten) ve o an ekranda geçerli olan tema renkleriyle hesaplanıyor. Sarıyı
  seçince satırlardan biri "kaldı"ya dönüyor · kapının ne iş yaptığı o anda görülüyor.

METİN KAYNAKTAN BİREBİR KALDI. Yeniden tasarım bir yeniden yazma değil: paragraflar, not ve kapı
cümlesi eskisiyle aynı; değişen şey, her bölümün yanında artık onu gösteren bir örnek olması.

İKİ YAN BULGU:

`.docs-code` **hiçbir yerde tanımlı değildi.** Beş sayfa (`score-ring`, `status-chip`, `tailwind`,
`error-state`, galeri) kod bloklarını o sınıfla çiziyordu ve sınıfın karşılığı yoktu: ölçüldü,
saydam zemin ve sıfır dolgu. Kutu şimdi kitin ters yüzeyinde, iki temada da koyu.

ÖLÇÜM TUZAĞI, İKİNCİ KEZ: ekran dışı bir iframe'de tarayıcı geçişleri ilerletmiyor ve
`getComputedStyle` eski değeri döndürüyor. Bu sayfayı koyu temada tararken düğmeler "beyaz zemin +
açık yazı" görünüyordu; geçişleri kapatınca (`transition: none`) hepsi temizdi. Koyu tema ölçümü
yapan her betik bunu ilk satırında kapatmalı.

## Fizik sayfası: haritası ve merdiveni

Sayfanın blok sırası zaten tasarımın tarifiyle aynıydı; eksik olan üç şey vardı.

**Dört yasa kartları** (yeni). Sayfa uzun ve dört yasa onun omurgası: kartlar hem "kaç tane"
sorusunu bir bakışta cevaplıyor hem de ilgili başlığa götürüyor. Hedefler `H2`nin kendi
ürettiği kimliklere bağlı (`slug`), yani bir başlık yeniden yazıldığında bağlantı da onunla
geliyor · elle yazılmış bir çapa, ilk yeniden adlandırmada kırılırdı.

**"Ne değiliz"** listesi. Aynı on bir madde bir paragraf olarak duruyordu: bir yasak listesi
TARANIR, okunmaz. Şimdi etiketler hâlinde, her birinin başında kırmızı bir çarpı.

**Merdiven sekiz basamak ve tıklanabilir.** Beş durağan kare vardı; şimdi 0-7 arası sekiz kare,
her biri KENDİ offsetiyle çiziliyor ve tıklananın karşılığı altındaki satırda yazıyor ("4px ·
düğme, editör"). Basılınca kare gerçekten iniyor: Yasa 1'i anlatan sayfanın kendi merdiveni de o
yasaya uyuyor. 2-4 arası kareler `--color-edge-strong` taşıyor, ötekiler `--color-edge`: basılan
kontrollerin basamağı, kenarıyla da ayrılıyor.

Basamak metinleri sayfanın kendi lejantından geliyor. Bir süre bileşenin içinde ayrı bir liste
vardı ve yanlıştı: tasarım dili yenilenirken merdiven bir basamak kaydı, liste kaldı. İki yerde
iki gerçek olmasın diye tek kaynağa indi.

## Hareket sayfası: süreyi anlatmak yerine koşturmak

Sayfa dört süre kademesini, üç eğriyi ve beş döngüyü **yazıyordu**; hareketten bahseden bir
sayfada kıpırdayan tek şey iki düğmenin basılmasıydı. Beş demo eklendi ve hepsi kitin gerçek
token'larıyla koşuyor.

**Sayfada değer listesi YOK.** Demolar token'ın yalnız ADINI gösteriyor (`--duration-press`),
animasyon arkada gerçek değerle çalışıyor: süreler ve eğriler Token'lar sayfasında duruyor, ve
bir sayının iki yerde yazması iki gerçek demek. Metindeki "100ms", "200ms" cümleleri kaynağın
kendi cümleleri, onlar kaldı.

- **Kademeler** · dört satır, aynı iz, aynı mesafe, dört hız. "Oynat" dördünü birden gönderiyor
  ve fark ancak yan yana koşarken görülüyor. Ölçüldü: 0.1s · 0.16s · 0.24s · 0.34s, yani dört
  token'ın kendisi.
- **Eğriler** · imza eğrisi ile overshoot yan yana, izin sağında kesik hedef çizgisiyle. İkisi de
  700ms: bu demo içi bir süre, token DEĞİL · gerçek sürelerde iki eğrinin farkı göz kırpması
  kadar sürüyor ve görülmüyor. Yanlış olan kendi rengini taşıyor, yoksa "iki hız" gibi okunuyor.
- **Döngüler** · iskelet nefesi, canlı işaret nabzı, yükleme çubukları; üçünün de token adı
  altında yazılı.
- **Azaltılmış hareket** · aynı döngüler, üstünde bir anahtar. Açıkken döngüler duruyor ama
  nesneler YOK OLMUYOR: iskelet çubuğu nefesinin ortasına yakın park ediyor (.72), çünkü sönük
  uçta duran bir yer tutucu boş bir kutu gibi okunuyor. Düğme basılmaya devam ediyor · azaltılmış
  hareket "hiçbir şey kıpırdamasın" demek değil. Gerçek sayfada bu anahtar yok, ayar kullanıcının
  sisteminden geliyor.
- **Sinyaller** · yalnız renk · renk + nokta · renk + nokta + metin.

### Referansla hizalama · 28 Eylül 2026

Demolar kurulmuştu ama referansın düzeniyle eşleşmiyordu, ve dört fark ölçülerek kapandı:

**Önizleme zemini beyazdı.** Beş demo `grid={false}` ile kurulmuştu, yani noktalı zemin yoktu ve
önizleme kutunun kendi `--color-shell` zeminini gösteriyordu. Referansta her demo noktalı
`--bg` üstünde duruyor. Ölçüldü: altı önizleme de artık `rgb(244, 242, 236)` (koyuda
`rgb(16, 26, 44)`).

**İz solgun kenarla çizilmişti, ve bu ad çakışmasının dördüncü kurbanıydı.** Tasarımın `--line`ı
bizim `--color-edge`imiz; bizim `--color-line`ımız onun `--dash`ı. Solgunla çizilen iz noktalı
zeminin üstünde kayboluyordu. Kenar `--color-edge` (`#c3c9d3`), hedef çizgisi de aynı.

**Etiketler kendi genişliklerini alıyordu.** Dört iz dört ayrı yerde başlayınca karşılaştırma
bitiyor: satır artık `minmax(0, 11rem) minmax(0, 1fr)` ızgarası, ölçüldü 176px sabit sütun.
İskelet de tam genişlikte kendi kartında (589px) · üç çıplak çubuk "yükleniyor" değil "üç çizgi"
gibi okunuyordu.

**Yanlış karenin kenarı da kritik renge çevrilmişti.** Yalnız dolgu değişiyor: kenarı da
değiştirmek onu ayrı bir NESNE yapıyor, oysa karşılaştırılan şey kutu değil hareket.

**Demo kutusu bir ipucu satırı kazandı** (`ipucu` prop'u · `.docs-demo-ipucu`): önizlemenin
altında, kesik çizgiyle ayrılmış tek cümle. Bir demo çoğu zaman kendini anlatmıyor: "Oynat"
duruyor ama basınca neye bakılacağını söyleyen bir şey yok, ve paragrafa yazmak işe yaramıyor.
Altı demonun altısında var.

**Nabız için `severity` veriliyor.** `positive` tonunun kendi sırası yok (bir şeyin çalışması bir
sapma değil), ve sırasız bir talep nabız kazanamıyor: `StatusChip … live severity={50}`. Renk
demosundaki çip `severity` almıyor, yani sayfada tek nabız kalıyor (Yasa 4).

BİR HATA, VE ÖLÇÜM OLMASA GÖRÜLMEZDİ: kare önce `transform: translateX(calc(100% - 20px))` ile
yürütülüyordu ve hiç kıpırdamıyordu. Transform'da yüzde ELEMANIN KENDİ genişliğine göre çözülüyor
(20px), yani hesap sıfır çıkıyor. `left`in yüzdesi kapsayan kutuya bakıyor; kare artık izin
sonuna gidiyor ve eğri satırlarında tam hedef çizgisinde duruyor (369'a karşı 370).

## Ölçü sayfası: kuralı yazmak yerine çevirmek

Sayfa iki yarıçapı, kenarlığı, 8 piksel ritmini ve yarım piksel yasağını **yazıyordu** ve tek
canlı şeyi bir karttı. Altı demo eklendi; hepsi kitin gerçek token'larıyla çalışıyor ve değer
listesi yine Token'lar sayfasında kalıyor.

- **Yarıçap** · kaydırıcı `--radius`ı 4-14 arasında çeviriyor, beş rol yarıçapı `calc` zinciriyle
  birlikte kayıyor. Beşi de demo kutusunda YENİDEN bildiriliyor, ve bu şart: özel değerler ANNEDE
  çözülüyor, yani `:root`ta hesaplanmış `--radius-card` çocuğa hesaplanmış hâliyle miras kalıyor
  ve alttaki `--radius`ı değiştirmek onu geri hesaplatmıyor. Zincir `theme.css`tekinin aynısı, o
  yüzden demo gerçekten aynı hesabı koşuyor. Ölçüldü: düğme 6'dayken 4 · 6 · 7 · 8 · 10, 14'e
  çevrilince 12 · 14 · 15 · 16 · 18. Kontrol kartı kendi köşesini koruyor · çevrilenle çeviren
  aynı anda değişince neyin değiştiği okunmuyor.
- **Tam yuvarlak** · doğru/yanlış ikilisi. Hap karşı örneği ELDE çizili, ve başka türlüsü mümkün
  değil: kit hap köşeli bir rozet ya da çip üretmiyor, yani karşı örneğin gerçek bileşenden
  çıkarılamaması kuralın kodda durduğunun kanıtı.
- **Kenar** · aynı dört satırlık tablo iki kez, 1px `--color-edge` ve 3px `--color-edge-strong`.
  İkisi de elde çizili, bilerek: soldakini kitten alsaydık iki taraf farklı dolgu ve farklı satır
  yüksekliği taşır, karşılaştırma da kenar kalınlığını değil o farkı gösterirdi.
- **Ritim** · `--gutter` dolgulu bir kart, üstünde girdi + segment + düğme, altında `.tamga-list-row`
  ile iki normal iki sık satır. Anahtar açılınca 8 piksellik yatay ızgara ve olukta duran kesik
  dikey çizgi geliyor; ikisi de `pointer-events: none`. Ölçüldü: kontroller 40 · 40 · 40, satırlar
  56 · 56 · 48 · 48, kart dolgusu 24.
- **Yarım piksel** · 1px/8px ile 0.5px/7.5px yan yana. Bu demonun ölçüleri token DEĞİL ve olamaz:
  gösterilen şey skalanın dışına çıkmanın ekranda nasıl basıldığı.
- **Kapı** · örnek bir denetim çıktısı. Kutu HER İKİ TEMADA DA koyu, çünkü bir terminal penceresi
  temayla dönmüyor; üç işaret rengi (`--docs-cb-fail/-pass/-path`) de sabit, koyu temanın
  değerleri. Açık temanın kritik kırmızısı bu zeminde 3.0'ın altında ölçülüyordu.

İKİ DÜZELTME BU SAYFADAN ÇIKTI:

**`Segmented` iki piksel uzundu.** Ritim demosu üç kontrolü yan yana koyunca görüldü: 42'ye karşı
40. Kit tarafında düzeltildi ve `check:olcu-hizasi` ile kapatıldı; gerekçesi
`docs/gerekce/05-yuzey-ve-kabuk.md`'de.

**"Tam yuvarlak avatar ve canlı nokta" cümlesi artık doğru değildi.** Kitte avatar rol
yarıçapında (40px'te `--radius-btn`, ölçüldü 7px) ve canlı nokta `--mark-dot-radius` (2px). Tam
yuvarlak gerçekten üç yerde: `.tamga-radio`, `.tamga-ring` ve `.tamga-spin-ring` · `check-yuvarlak`
kendi çıktısında bunu zaten "üç yer" diye söylüyordu. Sayfa metni ve demo bu ölçüme göre yazıldı.

## Tipografi sayfası: skalayı yazmak yerine dizmek

Sayfa on kademeyi, yüzleri ve büyük harf yasağını **yazıyordu**; tek demosu altı satırlık sabit
bir listeydi. Beş demo eklendi ve hepsi gerçek token'larla diziliyor. Piksel değeri yine yok:
kademelerin tam listesi Token'lar sayfasında, kaynaktan üretiliyor.

- **Skala** · on satır alt alta, çünkü bir skala ancak sırayla okunduğunda skala gibi görünüyor.
  Her satır bir düğme; tıklanan kademe rolüyle birlikte öne çıkıyor. Boyutlar `var(--text-*)` ile
  okunuyor, kopyalanmış piksellerle değil · bir kademe `theme.css`te değişirse demo da değişiyor.
  Ölçüldü: `10 · 11 · 13 · 14.5 · 15 · 16 · 18 · 24 · 30 · 40`, yüzler `O J O O O O R R R R`,
  ağırlıklar `400 · 700 · 400 · 400 · 500 · 700 · 800 · 800 · 900 · 900`.
- **Yüzler** · üç kart, her biri kendi yüzünde bir "Aa", işi, bir cümle ve Türkçe harf satırı.
  Harf satırı bir süs değil bir KANIT: `latin-ext` dosyası yüklenmese o satırdaki harfler yedek
  yüze düşer ve üç kart yan yana bunu ele verir. Ölçüldü: altı dosyanın altısı da yüklü
  (üç aile × latin + latin-ext).
- **Rakamlar** · `tabular-nums` anahtarı. Sol sütun anahtara bağlı, sağdaki (mono) her zaman
  hizalı. Ölçüldü ve fark gerçek: anahtar kapalıyken Onest'te `₺111.111` (yedi rakam) 47px,
  `₺18.470` (beş rakam) 54.2px · yani UZUN sayı DAHA DAR. Açıkken 72.4 / 62.6 ve sıra düzeliyor.
- **Büyük harf** · düzenlenebilir bir kelime, iki kart. Sol kart `lang="tr"` + `uppercase`, sağ
  kart yazanın kendi büyük harfi. Tarayıcının GERÇEK davranışı kullanılıyor, taklit edilmiyor:
  "limit" solda **LİMİT**, sağda **LIMIT** basıyor.
- **Kapı** · örnek `check:scale` çıktısı, ölçü sayfasındaki kutunun aynısı.

KAPI ÖRNEĞİ KAPIYI TETİKLEDİ, ve muafiyet yazılmadı: `check-scale` bir `.tsx`te geçen
`text-` + `[13.5px]` kalıbını sınıf sanıyor ve haklı olarak durduruyor. Burada bir sınıf değil bir
çıktı metni var, ama kapının ikisini ayırt edememesi doğru · ayıracak kadar akıllı olsaydı gerçek
bir ihlali de kaçırırdı. Örnek metin bölündü, kapı olduğu gibi kaldı.

BİR KONTRAST HATASI, VE ÖLÇÜM OLMASA GÖRÜLMEZDİ: seçili satırın zemini önce
`--color-accent-soft` ile çizilmişti. O token her iki temada da AÇIK mavi (`#a8cdf7`) ve kendi
koyu mürekkebini (`--color-accent-soft-ink`) istiyor; koyu temada satırın açık mürekkebiyle
birlikte **1.2** ölçüldü. Doğrusu `--color-accent-bg`: seçili satırın kendi token'ı, temayla
dönüyor (`#dce9fb` / `#0e2458`). Düzeltmeden sonra açıkta 13.39 · 5.82, koyuda 12.31 · 6.12.

## Token'lar sayfası: galeri, ve sekiz kayıp ad

Sayfa üç sütunlu bir listeydi; galeri yeniden kuruldu ve **veride sekiz eksik bulundu.**

### Kaynakta duruyordu, yayınlanan listede yoktu

`--font-sans`, `--font-display`, `--font-mono`, `--tracking-label` ve dört yarıçap (`-sm`, `-md`,
`-xl`, `-full`). Hepsi gerçek, hepsi kullanılıyor, üçü tipografi sayfasının anlattığı üç yüzün ta
kendisi. Sebep: `tamga:kopru` bloğu yalnız `var(--x)` takma adları için okunuyordu ve o blokta
takma ad olmayan bildirimler de var. Bir tüketici için yayınlanmayan bir ad, var OLMAYAN bir ad.

Kapı: `extract-tokens` artık `:root`/`@theme` gövdesindeki her bildirimi listeyle karşılaştırıyor
(`yayinlanmayanlariDurdur`). İki meşru dışarıda kalma KURALLA ayrılıyor, listeyle değil: bir
kuralın iç değişkeni (`.tamga-filter-row { --filter-gap }`) zaten `:root` dışında, ve köprünün
takma adı hedefi yayınlandığı sürece kendini yayınlamıyor. Kasıtlı iki ihlalle sınandı.

### Yirmi iki token hiç açıklama taşımıyordu

Ve sebep tek tek unutmak değil bir kalıp: bir yorum bir DİZİ bildirimin üstünde duruyor
(`--color-*-inverse` altılısı, `--chart-2..5`, `--mark-dot` + `--mark-dot-radius`) ve ayrıştırıcı
onu haklı olarak yalnız ilkine bağlıyor. Sonuç sayfada boş bir sütun. Yirmi ikisi de yazıldı;
`extract-tokens` artık gerekçesiz token'da duruyor. **145/145 token iki dilli gerekçe taşıyor.**

### Galeri

- **Şerit başlığın altına yapışıyor** (`--docs-top`). 145 satırlık bir listede filtre yukarıda
  kalsaydı bir gruba bakmak için her seferinde başa dönmek gerekirdi. Arama ad, değer, açıklama ve
  utility'lerde arıyor (TR küçük harf) · `rounded-full` yazınca `--radius-full` geliyor.
- **Çipler ARAMANIN sonucunu sayıyor**, seçili grubunkini değil. Tersi olsaydı seçili olmayan her
  çip sıfır gösterir ve gruplar arası gezinmek imkânsız olurdu.
- **Süzme açıkken kutu bunu söylüyor**: kitin odak fiziği duruyor, üstüne yalnız "dolu" hâli
  ekleniyor · okuyucu aşağı kaydırınca odak gidiyor ama filtre duruyor.
- **Altı örnek türü**: renk (64px bölünmüş şerit + ölçülmüş okunurluk rozeti) · gölge · yazı ·
  yarıçap · ölçü çubuğu · hareket izi. Hareket izi üstüne gelince koşuyor ve durumu CSS'te:
  on bir satırın her biri için bir React state'i, hiçbir şey kazandırmayan on bir yeniden çizim.
- **Ad düğmesi kopyalıyor** (`var(--ad)`), ve basıldığında çöküyor.

İKİ DÜZELTME BURADA ÇIKTI:

**Yarıçap grubunun tamamı kutu olarak çiziliyor**, yalnız ham piksel taşıyanlar değil. Beş rol
`calc(var(--radius) + 2px)` diye yazılı, yani üretici onları "değer" sayıyor ve değer rozeti olarak
çiziliyorlardı. `calc()` geçerli bir `border-radius`, ve bir yarıçapı gösterecek tek şey köşenin
kendisi. Ölçüldü: 11 yarıçap, 11 kutu.

**Dört ölçü boş bir hücre gösteriyordu.** `<Olcu/>` her zaman truthy bir React ögesi · `null`
döndürse bile, ve kod `if (<Olcu/>)` diye yazılmıştı. Çizilebilirlik artık bir fonksiyonun
döndürdüğü değerle sınanıyor. Ölçüldü: 83 + 2 + 10 + 11 + 14 + 11 + 14 = **145**, yani her satır
bir örnek çiziyor.

İçindekiler girdisi için galeriye `sr-only` bir `h2` kondu: liste `main h2[id]`i okuyor ve galeri
bir başlık taşımadığı için içindekilerde hiç yoktu.

## Token galerisinde kayan yazılar

Üç kusur, üçü de aynı kökten: örnek hücresi dikey bir flex kabı ve çocukları varsayılan olarak
GERİLİYOR.

- **Değer rozetleri sütuna yayılıyordu.** `500` yazan bir rozet sütunun tamamı kadar genişleyip
  sayıyı sol köşesinde bırakıyordu: ekranda bir rozet değil, içinde kaymış bir yazı olan boş bir
  kutu. `align-items: flex-start` · rozet kendi metninin boyunda.
- **Yazı yığınları bir kutuya sığmıyordu.** `--font-sans`'ın değeri on aileli bir yedek zinciri;
  örnek hücresinde altı satır kaplıyor ve gösterdiği şey yüz değil bir metin bloğu oluyordu.
  Ölçüldü: örnek hücreleri 44-87px iken font token'ları 109 · 170 · 190px. Artık o yüzde bir
  "Aa" ve ailenin adı · üçü de 44px.
- **`ch` çubukları üçü de tam genişlikti.** 36ch, 54ch ve 70ch'in üçü de 210 piksellik sütunu
  aşıyor, yani `max-width: 100%` üçünü aynı yapıyordu. Artık en genişine (70ch) ORANLI.

Ayrıca gerekçelerdeki token adları `code` olarak çiziliyor ve sarmıyor: `--color-brand-500` satır
sonunda tireden bölünüp ekranda "- -color-brand-500" diye okunuyordu.

## Tailwind sayfası: kuralı okutmak yerine denetmek

Sayfa iki koşulu **yazıyordu** ve altında iki tablo vardı. Metin aynı kaldı; altına bir deneme
kutusu ve yeniden tasarlanmış bir liste geldi.

**Deneme kutusu.** Bir kural metni okunuyor ama denenmiyor. Kutuya bir token adı yazılıyor
(ya da sekiz hazır örnekten biri seçiliyor) ve iki koşul AYRI AYRI cevaplanıyor: ① `@theme`
bloğunda mı, ② ön eki bir Tailwind ad alanı mı. Numara kutusu üç hâl taşıyor · geçti, kaldı,
bakılmadı (② zaten geçmiyorsa ①'e bakılmıyor). Altında tek satırlık sonuç: kaç utility ürettiği
ve ilk dördü, ya da yerine yazılacak kaçış yolu, ya da "bu ad kitte yok".

① İÇİN KAYNAĞA BAKILMIYOR: bir token utility ÜRETİYORSA `@theme` içindedir, ve `utilityleri`
alanı o soruyu zaten cevaplamış. Ad alanı listesi ise iki yerde yazılı, ve bu bilinçli bir borç:
üretici onu `utilityleri`ni HESAPLAMAK için kullanıyor, buradaki kopya kitte OLMAYAN bir ad için
② koşulunu sınıyor · yani üretilen veride karşılığı olmayan bir soru.

**Liste.** Tablolar gitti, iki kart geldi: yeşil işaretli "utility üretenler" (satır = renk
karesi + token adı | kopyalanabilir utility çipleri, ilk altı, gerisi "+N daha" ile açılıyor,
aramada hepsi açık) ve sarı işaretli "üretmeyenler" (satır = token adı + hangi koşula takıldığı |
kopyalanabilir kaçış yolu). Şerit token sayfasınınkiyle aynı: başlığa yapışık, arama + temizle +
sayaç.

Ölçüldü: `103 token, 1143 utility · 42 üretmeyen` (103 + 42 = 145), `--color-accent` → 14 utility,
`--duration-base` → ② geçmiyor, `--radius-card` → ② geçiyor ① geçmiyor (düz bir `:root`ta),
olmayan bir ad → "bu ad kitte yok". Çip tıklanınca `font-sans` panoya gidiyor ve çip 1.4 sn yeşil.

## Rozetin sağı ile solu · ölçülen asimetri

Renk bloğunun içindeki okunurluk rozeti kendi metnine SARILIYORDU. Rozetin kendi dolgusu
eşitti (mürekkep sınırları 6.91 / 6.80 ölçüldü) ama kutu içindeki YERİ eşit değildi: solunda hep
6px, sağında 6 ile 9.5 arası değişen bir boşluk. Sebep basit ve görünür: "14.7" ile "16.31" bir
karakter farklı, yani rozet her satırda başka genişlikte çıkıyor ve doksan bir rozetin sağ kenarı
tırtıklı bir sütun oluyordu.

Rozet artık yarının genişliğini alıyor (`flex-direction: column` + gerilme), metni solda kalıyor
(ortalanmış bir sayı yanındaki satırın sayısıyla hizalanmıyor). Ölçüldü: 91 rozetin 91'i
`6/6`.

### Ve bu düzeltme İKİNCİ bir kusuru görünür yaptı

Gerilen rozet tek parça bir metin taşıyordu (`white-space: nowrap`). En uzun rozet
("ΔL* 11.6 sayfada") **117.6px** istiyor, durduğu renk yarısının içi **101.3px** veriyor, ve
`.token-swatch`in `overflow: hidden`i farkı sessizce kesiyordu: ekranda "ΔL* 11 sayfad…"
yazıyordu. Hiçbir yerde hata çıkmıyor · kırpılan bir metin CSS'e göre geçerli bir metin.

İLK ÖLÇÜMÜM BUNU KAÇIRDI, ve sebebi öğretici: rozeti kendi KUTUSUNA karşı ölçmüştüm
(`scrollWidth > clientWidth`), oysa kutu içeriği kadar geniş · taşan şey kutunun KAPSAYICIYA
göre yeriydi. Bir taşma ölçümü her zaman KIRPAN ataya karşı yapılmalı.

Sayı ile "neye karşı" artık iki ayrı parça ve rozet `flex-wrap: wrap` taşıyor: sığdığında yan
yana, sığmadığında alt alta. Kısa rozet tek satır kalıyor. Ölçüldü (Playwright 1440 · 1180 · 900 ·
620px, iki tema, ve Chrome 151'de canlı): taşan rozet **0/91**, kırpılan metin üç sayfada da
**0**. `check-css` rozetin `flex-wrap: wrap` taşımasını ve `nowrap` yazılmamasını sınıyor;
iki kasıtlı ihlalle patlatıldı.

## İkonlar sayfası: seti okutmak yerine çevirtmek

Izgara bir mini düğme listesiydi ve `weight`/`size` sabitti. Metin aynı kaldı; altına dört blok
geldi.

- **Set.** Başlığa yapışık şerit: arama (rol VE Phosphor adı taranıyor · "trash" yazınca rol
  `Delete` geliyor) + sayaç + `weight` ve `size` şeritleri. Ağırlık bütün ızgarayı çeviriyor,
  çünkü duotone'un ne yaptığı tek bir glifte değil seksen dokuz glif birden dönünce okunuyor.
  Kutu bir kart (üstüne gelince kalkıyor, basılınca çöküyor); içinde sabit 36px'lik glif alanı,
  rol adı ve altında soluk Phosphor adı. Glif alanı SABİT: boyut 14'ten 32'ye çıkarken alan da
  büyüseydi ızgara her seçimde yeniden dizilirdi. Phosphor satırı boşken de yer kaplıyor · otuz
  altı rol kendi adını taşıyor ve satır kaybolunca alt kenar tırtıklı oluyordu.
- **Tüm set bir IZGARA değil bir KAPI.** Bin dört yüz yetmiş glifi basmak sayfayı donduruyor ve
  o listede gezinerek bir şey bulunmuyor: arama yazılınca set taranıyor, yazılmayınca gidilecek
  yer gösteriliyor.
- **Rol ↔ Phosphor tablosu.** Altı satır, ve seçilmiş altı: `Delete ← Trash` kuralı bir bakışta
  anlatıyor, `Bold ← TextB` anlatmıyor. Eski ad üstü çizili · tablo bir eşleme değil bir
  DEĞİŞTİRME anlatıyor.
- **Ağırlık kartları.** duotone tarafında dört nötr glif ve üç durum glifi (renk yalnız durum
  taşıdığında ayrışıyor); bold tarafında dört GERÇEK mini düğme, çünkü kalın glifin sebebi onun
  bir düğmenin içinde durması ve çıplak bir glif bunu göstermiyor.
- **Boy merdiveni.** Altı satır: token adı · tek başına glif · METNİN YANINDA glif. İkonun kendi
  ölçüsü yok, yanına konduğu kademeyi alıyor, o yüzden merdiven ancak eşiyle birlikte okunuyor.
  Metin kademesi `var(--text-*)` ile okunuyor, kopyalanmış piksellerle değil.

Ölçüldü: 89 kutu · 7 grup · sayaç "89 rol" · `lg` seçiliyken glif 24px, `xs` seçilince 14px ·
tıklayınca "Search" panoya ve kutu 1.4 sn yeşil · "trash" araması 1/89 rol + Phosphor'dan
`Trash`, `TrashSimple` · yatay taşma 0.

## Bloklar katalogu: kart ve modal duruyor, şerit yenilendi

Katalog on dört öğenin hepsini zaten taşıyordu (referansın listesiyle birebir: FilterBar,
CountRow, Seçim şeridi, Satır eylemleri, Boş liste, SaveBar, Form bölümü, Tehlikeli bölge,
Doğrulama özeti, KPI şeridi, Grafik kartı, Son hareketler, Giriş kartı, Hata ekranı). Kart
ızgarası ve karta tıklayınca açılan canlı modal olduğu gibi kaldı; değişen şey kataloğun
mobilyası.

- **Şerit başlığın altına yapışıyor** (`--docs-top`). On dört kartlık bir katalogda filtre
  yukarıda kalırsa bir gruba bakmak için her seferinde başa dönmek gerekiyor. Token ve ikon
  sayfalarındaki şeritle aynı geometri, yani okuyucu üçünü aynı şey olarak tanıyor.
- **Her çip kendi sayısını taşıyor** (`Tümü 14 · Liste 5 · Form 4 · Pano 3 · Oturum 1 · Durum 1`).
  "Kaç tane" sorusu "hangileri"nden önce geliyor. Seçili çip YÜKSELİYOR, dolmuyor: dolgu eylem
  demek (Yasa 2).
- **Lejant şeridin sağında**: dolu mavi kare `paket`, çerçeveli kare `tarif`. Rozetin dolu mu
  çerçeveli mi olduğu kartlarda zaten görülüyordu ama ne DEMEK olduğu görülmüyordu. Lejant yalnız
  listede GERÇEKTEN olan türü yazıyor · şablonların hepsi paket, ve orada bir "tarif" karesi
  karşılığı olmayan bir sözcük olurdu.
- **Rozet: paket DOLU, tarif çerçeveli.** İkisi de çerçeveliyken ayrım yalnız yazı renginden
  okunuyordu, ve bir katalogda taranan şey renk değil biçim. Dolgu burada Yasa 2'yi çiğnemiyor:
  rozet bir eylem değil bir SINIF, ve iki sınıfı ayıran en hızlı işaret dolu/boş karşıtlığı.
- **Önizleme kuyusu noktalı zeminde**, düz çökük yüzeyde değil: bir blok bir SAHNEDE duruyor,
  bir kuyunun içine gömülü değil · doküman sitesinin örnek kutusuyla aynı zemin.
- Ölü bir etiket gitti: çipler sayıları taşıdığı için `sayac` artık hiçbir yerde çizilmiyordu.

Ölçüldü (Playwright + Chrome 151, iki tema, iki sayfa): bloklar 14 kart (3 paket · 11 tarif),
şablonlar 12 kart (12 paket · lejantta tek kare), şerit `sticky top=63px`, kırpılan metin 0,
yatay taşma 0. Karta tıklayınca modal açılıyor ve içindeki FilterBar hâlâ canlı: kod bloğu ve
"Kodu kopyala" yerinde.

## Şablon katalogu: pencerede gezinme

On iki ekranın hepsi zaten vardı (referansın tablosuyla birebir: AppShell · OverviewTemplate ·
ListTemplate ×3 · DetailTemplate ×2 · SettingsTemplate · WizardTemplate · AuthTemplate ×2 ·
PublicTemplate). Kutu ve modal olduğu gibi kaldı; eksik olan gezinmeydi.

- **Pencerede ‹ › ve klavye.** Bir katalogda ikinci ekrana bakmak için pencereyi kapatıp yeniden
  açmak gerekiyordu. Ok tuşları da aynı işi yapıyor, Esc kapatıyor (onu `Dialog` zaten yapıyor).
  Döngüsel: sonuncudan sonraki başa dönüyor · sonuncuda takılmak listeyi kapatmayı gerektiriyordu.
- **Açık olan bir İNDEKS, bir nesne değil**, ve indeks GÖRÜNEN listenin sırasına göre: bir gruba
  süzülmüşken "sonraki", o grubun sonrakisi. Süzgeç değişince pencere kapanıyor, çünkü aynı indeks
  değişen listede başka bir öğeyi gösterirdi.
- **Şerit kaçıncısında olduğunu söylüyor**: `AppShell · Uygulama · 1 / 12`.
- **Kutuda bileşen adı** (`ListTemplate`): "Kullanıcılar" ekranın ne olduğunu söylüyor, bu hangi
  şablondan çıktığını · ve okuyucunun aradığı çoğu zaman ikincisi.

Ok tuşları Playwright'ın gerçek tuş girişiyle ölçüldü: `3 → 4 → 5 → 4`, dört kez sola basınca
`1 / 12`'ye ve oradan döngüyle başa. Esc pencereyi kapatıyor. (Chrome eklentisinin tuş enjeksiyonu
modal bir `<dialog>`a hiç ulaşmıyor · orada olayın sayfaya geldiği doğrulanamıyor, kodun kendisi
doğrulanabiliyor.)

ESKİ TASARIM İZİ TARAMASI: bulanık gölge, tam yuvarlak, ham hex, `uppercase` ve kaldırılmış token
adları için doküman sitesinin tamamı tarandı. Tek gerçek bulgu token sayfasının metnindeydi: köprü
ailesi örneği olarak `--primary` yazılıydı, oysa o ad 0.5.0'da kaldırıldı ve yayınlanan listede
yok. `--border` ile değiştirildi. Bulanık gölge (`.docs-wrong-shadow`) fizik sayfasının KASITLI
karşı örneği, kalıyor.

## Üç şablon ekranı düzeltildi

**"Dört durum" dört ekranı yan yana diziyordu**, ve her biri kendi kutusunda kırpılıyordu: dört
dev "Kullanıcılar" başlığı, altlarında birkaç satırlık parça. Bir durumu ötekiyle karşılaştırmak
için ikisini de GÖRMEK gerekiyor, ve kırpılmış dört ekran hiçbirini göstermiyor. Artık TEK ekran
ve bir segment: başlık, filtreler ve şerit sabit kalıyor, yalnız gövde değişiyor · zaten şablonun
iddiası da bu. Seçili durumun adı `state="…"` olarak yazılı, altında ne anlattığını söyleyen bir
cümle. Modal çerçevesi de geri geldi (`tamCerceve: "yok"` dört çerçeveli içerik içindi, artık tek
ekran var).

**Giriş ekranı eksikti: "Şifremi unuttum" yoktu.** Logo ve alt bağlantı (`brand`, `footer`)
zaten geliyordu ama görülmüyordu, çünkü çerçeve kırpıyordu. Bağlantı parola alanına BİTİŞİK,
formun dibinde değil: aranan an, alanın boş kaldığı an · aşağıya konunca kullanıcı önce yanlış
parolayı deniyor. Alanın kendi etiket satırına giremiyor, çünkü `Field`in oradaki yeri (`note`)
bir sözcük alıyor, bir düğüm değil.

**Durum sayfası bir durum sayfasına benzemiyordu.** İki şey yanlıştı:

- Genel durum bir kartın başlığına iliştirilmiş küçük bir ÇİPTİ. Bir durum sayfasına gelen kişinin
  tek sorusu var ("çalışıyor mu") ve onu bir çipe gömmek soruyu aramaya çeviriyor. Artık tonun
  zeminini ve glifini birlikte taşıyan bir şerit.
- Servis başına bir SPARKLINE çiziliyordu, ve bu yanlış araçtı: bir çizgi grafik "kaç" sorusunu
  cevaplıyor, oysa bir durum sayfasının sorusu "hangi GÜN". Artık doksan kovalı bir `TimelineStrip`
  (`90 gün önce` → `Bugün`), her kova bir gün ve kendi erişilebilir cümlesiyle. Servis satırı alt
  alta iki parça oldu: yan yana sıkıştırıldığında şerit kırk pikselde kalıyordu.

**Çerçeve kayıyor, kırpmıyor.** `.galeri-ekran` `overflow: hidden`di: bir ekran çerçeveden uzunsa
gerisi ULAŞILAMIYORDU · durum sayfasının olay geçmişi böyle kayboluyordu. Bir çerçeve bir görüntü
alanı, ve kayamayan bir görüntü alanı görüntü alanı değil.

### Ve kaydırmayı açmak ikinci bir kusuru ortaya çıkardı

Giriş ekranının LOGOSU görünmüyordu, ve sebep kaydırma değil ORTALAMAYDI: oturum ve kamusal
ekranlar içeriğini `align-items: center` ile dikeyde ortalıyor, ve ortalanan bir öğe kabından
uzunsa taşma iki uca EŞİT dağılıyor. Üst yarıya kaydırarak ulaşılamıyor, çünkü `scrollTop`
negatife inemez: logo ve başlığın yarısı çerçevenin ÜSTÜNDE, erişilemez bir yerde kalıyordu.
Ölçüldü: `scrollTop: 0` iken bile içeriğin tepesi çerçeve kenarının 48px yukarısındaydı.

`align-items: safe center` tam bunun için var: sığdığında ortalıyor, sığmadığında başa yaslıyor.
Kural yalnız bu çerçevenin içinde, kitin kendi sınıfına dokunulmadan · `min-h-dvh` kancası zaten
burada kullanılıyor. Çerçeveye ayrıca `overscroll-behavior: contain` kondu: sonuna gelince
kaydırma arkadaki sayfaya geçmiyor.

Ölçüldü (on iki ekranın hepsi, sırayla): `scrollTop` hepsinde 0, üstü kırpılan ekran 0. Logo
açık ve koyu temada, 1000px ve 700px yükseklikte görünür.

### Ve bir üçüncüsü: aşağı kaydırınca ZEMİN kesiliyordu

`[class*='h-dvh']` ALT DİZE arıyor, ve `min-h-dvh` de o alt dizeyi taşıyor. Yani yalnız
`min-height` alması gereken oturum ve kamusal ekranlara `height: 100%` de basılıyordu: zemin
çerçevenin boyunda kalıyor, içerik altından taşıyor, ve kaydırınca arka plan bir yerde
kesiliyordu. Ölçüldü: 1000px pencerede 0, **800px'te 91px, 700px'te 163px, 620px'te 221px**
zeminsiz alan. Kusur `overflow: hidden` varken görünmüyordu · kaydırmayı açmak onu ortaya
çıkardı.

Tailwind'in ölçü sınıfları İÇ İÇE GEÇİYOR (`h-dvh` ⊂ `min-h-dvh`, `w-full` ⊂ `max-w-full`), yani
bu bir kerelik bir dikkatsizlik değil bir KALIP. Seçici `~=` oldu: boşlukla ayrılmış tokenı
arıyor. `check-css` artık `.css` ve `.tsx` dosyalarında `[class*="…"]` ile yazılmış ölçü
seçicilerini durduruyor · ilk yazışında kapı kendi gerekçe yorumumu yakaladı, yorumlar
ayıklandı, sonra kasıtlı ihlalle patlatıldı.

TARAMA: iki galeri (26 ekran) × dört pencere yüksekliği × iki tema = **96 ekran-görünüm**, zemin
boşluğu **0**.

BİR BONUS BULGU: İngilizce sözlükte `calismaSuresi: "Çalışma süresi"` yazıyordu, yani İngilizce
sayfa Türkçe bir başlık basıyordu. Karşılığı nötr seçildi, çünkü `check-names` izleme ürününün
alan sözlüğünü kitin deposunun dışında tutuyor ve ilk yazdığım sözcük oradan geçmedi · kapı
yorumun içindeki sözcüğü bile yakaladı.

## Yeni panel sayfası: bir renkten bir panel, okutmak yerine çevirtmek

Sayfa iki liste ve iki çıplak `<pre>` bloğuydu. Metin aynı kaldı; altına dört blok geldi.

- **Üç küme bir tablo değil üç kart.** Tablo 720 piksel taban genişliği istiyor ve üçüncü sütun
  dar ekranda dışarı düşüyordu. Başlık şeridi tonun zeminini alıyor, ve ton burada ANLAM taşıyor:
  yeşil "değiştir" (güvenli), sarı "isteğe bağlı", kırmızı "dokunma" (tehlikeli) · Yasa 3 tam
  olarak bunu istiyor.
- **Ayarlar demosu.** Sayfanın iddiası bir renkten bir panel çıktığı, ve bunu anlatan bir paragraf
  okunuyor ama inanılmıyor. Dört alan, altında canlı önizleme: ray, düğme, bağlantı ve seçili
  satır aynı anda dönüyor.
  - **KONTROLLER KİTİN KENDİSİ.** Demo bir süre elle çizilmişti: renk kareleri `<button>`, tema
    ve kenar çubuğu birer `Segmented`, yükleme yuvaları kesik kenarlı birer `<span>`. Görünen şey
    kitin verdiği cevap değil o cevabın TAKLİDİYDİ, ve bir doküman sitesinde en pahalı yanlış
    budur: okuyan kişi gördüğünü kitten bekliyor. Şimdi `ImageField` · `ColorSwatches` ·
    `ThemeCards` · `RailCards`, yani kitin kendi Görünüm ekranındaki sıra ve kontroller.
  - **Başlık kontrolün ÜSTÜNDE, yanında değil** · ve kitin Görünüm ekranında yanında duruyor.
    Sebep ölçü: bu demo doküman sütununda yaşıyor (kart 760 px, içi 726) ve iki sütuna
    bölününce kontrole 474 px kalıyor; üç minyatür kart (3x170 + 2x16 = 542) ikinci satıra
    sarıyor, okunan şey "üç seçenek" değil "iki artı bir" oluyordu.
  - **Yüklenen logo ve amblem önizlemeye giriyor**: dar ray amblemi, geniş ray logoyu gösteriyor,
    yani sayfanın cümlesi ekranda sınanabiliyor. Tarayıcıda ölçüldü: 40x16 bir logo 150 px'lik
    rayda taşmıyor, amblem 28x28 karoyu dolduruyor.
  - **Üç seçeneğin üçü de bir şey yapıyor.** "Sistem" ölü bir etiket değil, doküman sitesinin
    kendi temasını izliyor (`MutationObserver`, `documentElement`in sınıfı). "Kullanıcı seçsin"in
    "hep geniş"ten farkı rayda bir TUTAMAK olması, ve tutamak gerçekten açıp kapıyor. Ölçüldü:
    site koyuya dönünce önizleme de dönüyor, tutamak rayı 150px'ten 48px'e indiriyor ve sözcük
    markası kayboluyor.
  - **Düğmenin mürekkebini palet seçiyor**, sayfa değil: `makePalette` vurgunun üstünde okunan
    rengi zaten hesaplıyor (`accentInk`), ve ikinci bir hesap iki gerçek üretirdi.
- **Palet tablosu ÜRETİLİYOR.** `makePalette(hex)` kitin kendi üreticisi, yani sayfadaki sayılar
  `check-palette`in ölçtüğü sayılarla aynı matematikten çıkıyor. Elle yazılmış bir tablo ilk renk
  değişikliğinde yalan söylerdi. İki sütun: `:root` ve `.dark`.
- **Kontrast kartları.** Üç renk, üç oran, ve çubuğun üstünde AA 4.5 çizgisi: bir oran tek başına
  bir sayı, eşiğin neresinde durduğu görülünce bir KARAR oluyor. Oranlar SABİT yazılı ve bu
  bilinçli · sayfadaki üç sayı `check-token-contrast`ın ölçtüğü sayılar, tarayıcıda basit WCAG
  formülüyle yeniden hesaplamak başka sonuç veriyor (3.79 · 4.62 · 6.63) ve sayfa kapıyla
  çelişirdi.
- **Logo kartları.** Aynı logo üç zeminde. Yamanın glifi ✓ DEĞİL: onay işareti "sorun yok" diyor,
  oysa parlaklık filtresi okunur yapıyor ve markanın rengini bozuyor · sürgü glifi "ayarlandı"
  diyor, "çözüldü" değil.

Örnek renkleri `className`/`style` içinde değil sabitlerde: `check-scale` ham rengi orada arıyor
ve haklı · ama bu üç renk ölçeğin değil ÖRNEĞİN verisi (kurgusal bir markanın kırmızısı, logonun
gri yarısı). İki kod bloğu da dosya adı şeridi ve kopyala düğmesi olan gerçek `CodeBlock` oldu.

## Görünüm sayfası: parçalar değil ekranın kendisi

Sayfanın ilk başlığı **"neden tek bir ekran, beş parça değil"** diye soruyordu ve canlı örnek tam
da o beş parçayı yan yana diziyordu: `ColorSwatches`, `ThemeCards`, `RailCards`, bir `ImageField`.
Sayfa bir şey söylerken örneği başkasını gösteriyordu, ve `AppearanceTemplate` sayfanın ilk props
tablosu olduğu hâlde hiçbir yerde ÇİZİLMİYORDU.

- **Örnek artık şablonun kendisi.** `AppearanceTemplate`, gerçek `value`/`saved` çiftiyle: logo,
  amblem, marka rengi, tema, kenar menüsü · kesik çizgiler, bölüm sırası, `SquarePicker` ve
  kaydet şeridi şablonun kendi kararları. Tarayıcıda ölçüldü: logo yüklenince "Logodan amblem
  kes" ve "Kaldır" beliriyor, "Kaydet" ediniyor, durum satırı "Her şey kayıtlı"dan
  "Kaydedilmemiş değişiklik var"a dönüyor; pencere açılıyor, kare onaylanınca amblem doluyor.
- **Dil satırı `extra` ile ekleniyor**, ve bu sayfanın anlattığı sınırın kendisi: şablon dil
  sormuyor (logo, amblem, renk, tema, menü). Satır kitin `tamga-appearance-row` sınıfını giyiyor
  ki eklenen bir kutu gibi değil ekranın parçası gibi okunsun, içinde `LocaleSwitcher` ve
  yanında `StatusChip caution` · "ürün ekler".
- **Beş parça kartı**, her biri kendi props tablosuna gidiyor (`#props-<ad>`). Fizik
  `.home-kart`tan geliyor: bu GİDİLECEK bir kart, ve ana sayfadakiyle aynı şeyi yaptığı için
  aynı yükselmeyi yapıyor. Tablolar `scroll-mt-24` taşıyor, yoksa yapışkan başlık hedefi
  örtüyordu (ölçüldü: hedef 96 px'te duruyor).

Referansta olup kitte olmayan üç şey BİLEREK geçirilmedi · üçü de bir kit kararı, sayfa kararı
değil: "Logodan amblem kes" düğmesinin logo yokken de soluk durması (kit onu gizliyor), düğmelerin
altındaki biçim satırı ("PNG · JPG · SVG · maxEdge 512", `ImageField`de böyle bir prop yok), ve
amblemin nereden geldiğini söyleyen alt yazı ("Logodan kesildi" · "Ayrı dosyadan yüklendi", şablon
kaynağı saklamıyor).

## Liste ekranı sayfası: çalışan örnek zaten vardı, eksik olan üç şeydi

Sayfanın iskeleti ve CRUD örneği tasarımla zaten örtüşüyordu (aynı on bir kayıt, aynı eşikler,
aynı sayfa boyu, 57 px satır). Değişen üç şey:

- **Formda canlı durum çipi.** Stok bir SAYI, durum o sayının okunuşu; kullanıcı 3'ü 4 yaptığında
  listede ne göreceğini kaydetmeden önce görüyor. Eşik listedeki `okuma()` fonksiyonundan geliyor,
  ikinci bir eşik yazılmadı. Ölçüldü: stok 0 → "Tükendi", stok 4 → "Stokta".
- **"Örneği baştan başlat".** On bir kaydın beşini silip sayfayı yenilemek zorunda kalan okuyucu
  örneği bir daha denemiyor. Tek düğme bütün durumu geri veriyor · açık pencereler dahil.
- **Sayım satırları kart oldu, parça listesi çip.** Numara artık 26 px'lik dolu bir mono kare
  (`.docs-sayim-no`). `.docs-neden` ile bilerek AYRI: o bir SEBEP listesi (tek paragraf, vurgulu
  numara), bu bir SAYIM (ad + açıklama, sessiz numara); aynı sayfada ikisi de bulunabiliyor ve
  numaranın ağırlığı hangisini okuduğunu söylüyor. Sekiz parça bağlantısı nokta ile ayrılmış bir
  cümleydi; çip bir etiket değil bir KAPI, o yüzden gölgesi var ve hover'da yükseliyor.

Tarayıcıda baştan sona koşuldu: ara (11 → 2), stok sıralaması, ekle (sayaç 12), sayfadakileri seç
(5 kayıt seçili, onay gövdesi sayıyor, odak Vazgeç'te), toplu sil (7), sıfırla (11).

Ölçüm iki taşma çıkardı, ikisi de düzeltildi:

- **Örnek tablosu kapsızdı.** Dört sütun 390 px'e sığmıyor ve sayfayı kaydırıyordu; `ScrollX`
  içine alındı, kayan şey artık tablo. Fiil tablosu zaten kabındaydı.
- **1 piksellik gizli metin, 76 piksellik kayma.** `sr-only` mutlak konumlu, ve konumlanmış bir
  atası yoksa kapsayıcı bloğu SAYFA oluyor: kayan tablonun en sağındaki gizli sütun başlığı
  (`<span class="sr-only">Düzenle</span>`) belge genişliğini 527 px'e çıkarıyordu, hücre
  `relative` olunca 451'e döndü. Sayfanın kalan 61 pikseli doküman BAŞLIĞININ taşması ve her
  sayfada var.

## Ana sayfa · "03 · Kontroller": kuralı değil TAKILMAYI göstermek

Ana sayfa kapıları bir sayı ve bir etiket listesiyle anlatıyordu: `22 kapı` yazısının altında elle
yazılmış **13 ad** duruyordu · `check:yuvarlak`, `check:data-props`, `check:token-parity`,
`check:palette` ve ötekiler hiç eklenmemişti. Sayı kaynaktan, liste elden geldiği için ikisi
ayrışmıştı, ve bu tam olarak `extract-counts`ın var olma sebebi olan hatanın aynısı.

Yeni bölüm bir **canlandırma**: ziyaretçi bir hata seçiyor, zincir o kapıda duruyor, arkasındaki
adımlar hiç koşmuyor. Anlatılan şey kural değil sonuç · "bozuk bir şey yayımlanmıyor".

- **Sıra zincirin kendisinden.** `extract-counts.mjs` artık `verify` betiğini adım adım çıkarıp
  `counts.zincir` (22 adım) ve `counts.kontroller` (18 kontrol: `props` + `check:*`) olarak
  yazıyor; bileşen takıldığı sırayı `kontroller.indexOf(kapı)` ile buluyor. Demo hiçbir yerde sıra
  numarası tutmuyor: bir kontrol eklenince numara kendiliğinden kayıyor.

- **Ziyaretçiye 18, depoya 22.** Zincirin dördü derleme işi (typecheck, kitin build'i, testler,
  dokümanın build'i), on sekizi bir KURALI denetleyen betik. Ana sayfa on sekiziyle konuşuyor,
  çünkü anlatılan şey "derleniyor mu" değil "kurala uyuyor mu" · ve ikisi de tek kaynaktan
  sayıldığı için sayfada iki sayı dolaşmıyor. Dört senaryonun sırası iki sayımda da aynı (4 · 9 ·
  15 · 16), çünkü dördü de `check:palette`ten önce.
- **Hata satırları GERÇEK.** Dört ihlal depoda tek tek yapıldı ve zincir koşturuldu
  (2026-09-28): gölge rengini kenardan ayırmak `check:physics`i 9. adımda, bir sözlük anahtarını
  tek dilde bırakmak `check:docs-i18n`i 4'te, koyu temadan bir rengi silmek `check:token-parity`yi
  15'te, soluk mürekkebi açmak `check:token-contrast`ı 16'da düşürdü. Ekrandaki ölçüler
  (`2.17`, token adları) o koşuların çıktısı. Yakalama yöntemi: ilgili dosyayı boz, zincirin
  adımlarını sırayla koştur, ilk düşende dur, dosyayı geri yaz.
- **Demo zincire BAĞLI.** `extract-counts` her build'de senaryoların kapı adlarını zincirde
  arıyor; bir kapı yeniden adlandırılırsa build duruyor. (Kapı sınandı: uydurma bir adla çıkış 1.)
- **Renk sapmayı işaretliyor.** Geçen adımlar sessiz, duran adım tek başına renkli ve yükseliyor.
  Yeşil yalnız zincirin tamamı geçtiğinde beliriyor · orada "sürüm çıkabilir" demek oluyor. Kutu
  kitin kendi kapı renklerini kullanıyor (`--docs-cb-pass` · `--docs-cb-fail`), yenisini
  uydurmuyor.
- **Dürüstlük iki katmanlı.** Başlıkta "canlandırma" rozeti ve "Baştan oynat" düğmesi kutunun şu
  an bir şey koşturmadığını söylüyor; kutunun altındaki sessiz satır ise hatanın KURGU olduğunu
  söylüyor ("Buradaki hatalar kodda yok, burası bir varsayım"). İkisi ayrı cümle ve ikisi de
  gerekli: biri "şu an koşmuyor", öteki "böyle bir hatamız yok" demek. Satırların gerçek koşulardan
  geldiği de aynı cümlede duruyor.
- Radyo grubu gerçekten radyo grubu (tek sekme durağı, oklarla seçim), sonuç bir `aria-live`
  bölgesi, ve hareketi azaltılmış tarayıcıda canlandırma yok · doğrudan son kare.

Senaryolar **evrensel hatalar**: koyu temada unutulan renk, çevrilmeden kalan metin, okunmayan
kontrast, kenardan ayrılan gölge. Deponun kendi geçmişinden bir olay (ürün adı sızması gibi)
ziyaretçiye gösterilmiyor · o bir günah çıkarma olurdu, kanıt değil.

## Ana sayfa · "02 · Kutunun içi": altı söz kartı yerine masa

Bölüm altı kartla "içinde ne var" diye anlatıyordu: erişilebilirlik, değişiklik günlüğü, token'lar.
Hepsi doğruydu ve hiçbiri GÖSTERMİYORDU. Yeni tasarımın cevabı bir masa: on beş parça, yan yana,
ziyaretçinin seçtiği renkte, hepsi çalışır hâlde.

- **Karoların içi GERÇEK.** `Table` · `Calendar` · `Button` · `Switch` · `FilterBar` · `LineChart` ·
  `ScoreRing` · `Alert` + `ConfirmDialog` · `Toast` · `Steps` · `FileUpload` · `Tabs` + `Segmented` ·
  `Slider` + `NumberInput` · `StatusChip` + `Badge` + `Kbd` + `Tag` · `DropdownMenu` + `Tooltip`.
  Elle çizilmiş bir işaretleme olsaydı bu bölüm bir ekran görüntüsü olurdu ve kitte bir gölge
  değiştiğinde yalan söylerdi. Tıklanan her şey gerçekten çalışıyor: tablo sıralanıyor ve satır
  seçiyor, takvim gün seçiyor, "Kaydet" bildirim düşürüyor, sürgü skor halkasını çeviriyor.
- **Renk nasıl geçiyor.** `makePalette(hex)` otuz token üretiyor, `paletteVars` onları CSS
  değişkenine çeviriyor ve masanın kabına yazılıyor: içerideki bileşenler sayfanın değil MASANIN
  paletini okuyor. Ürünün markayı uygulama yolu da bu · bölüm kendi anlattığı mekanizmayı
  kullanıyor, taklidini değil.
- **Kategori odağı.** Bir kategorinin üstüne gelince o aile yükseliyor (marka renginde 5 px gölge),
  ötekiler 0.28 opaklığa iniyor; tıklamak sabitliyor. Sönen karo GİZLENMİYOR: masanın kaç parça
  taşıdığı hâlâ görünüyor.

İki tuzak ölçümle çıktı, ikisi de kayda değer:

- **Bir kap sorgusu kendi kabını biçimlendiremiyor.** `container-type` `.masa`nın üstündeydi ve
  `@container` kuralları da `.masa`yı hedefliyordu; hiçbiri uygulanmadı (390 px'te hâlâ altı sütun,
  160 piksel yatay kayma). Kap ayrı bir düğüm oldu (`.masa-kap`).
- **`.masa > *` yetmiyor.** Tek sütuna inen ızgarada `[data-w="3"]`in span'i daha güçlü seçiciyle
  duruyordu ve üç ÖRTÜK sütun açıyordu. Kural `[data-w]` üstünden yazıldı; `!important` gerekmedi.

Tablo karosu `ScrollX` içinde: dört sütun dar karoya sığmıyor ve kapsız bırakıldığında masadan
taşıyordu (390 px'te 395 piksellik tablo, 342 piksellik masa).

Ölçüm: 2 dil × 2 tema × 1440/1100/900/760/620/390 → on beş karo, sütunlar 6 → 4 → 1, taşma 0,
kırpılan metin 0, yatay kayma 0, konsol hatası 0.

### Kitte iki düzeltme

- **`Calendar` değerinin ayını açıyor.** Her zaman bugünün ayını açıyordu; başka bir aydan bir
  tarih verildiğinde seçili gün hiç görünmüyordu. Masadaki takvim bunu görünür yaptı.
- **`ColorSwatches`in serbest renk kutusunda damlalık var.** Boş hâli damalı bir zeminden ibaretti;
  zemin "burada renk yok" diyor ama ne YAPILACAĞINI söylemiyordu.

## Ana sayfa yeniden kuruldu: anlatan sayfadan KURCALANAN sayfaya

Sayfa altı bölümdü ve dördü metindi: "Panellerimizi bu sistemle kuruyoruz" başlığı, bir token
katmanı demosu, altı söz kartı, bir kurulum kod bloğu, bir bileşen ızgarası. Yeni sıra beş bölüm,
ve dördü ELLENİYOR:

| bölüm | ne yapıyor |
| --- | --- |
| Hero | "Yönetim panelleri için açık kaynak tasarım sistemi." · iki düğme, üç bilgi, sağda hesap listesi ve KPI kartı |
| 01 · Canlı önizleme | Solda kontrol masası, sağda sahte tarayıcıda GERÇEK `AppShell`: menüde gezin, hesapları süz, seç, arşivle, sil |
| 02 · Kutunun içi | On beş kit bileşeni, ziyaretçinin seçtiği renkte, hepsi çalışır hâlde |
| 03 · Kontroller | Bir hata seç, zincirin nerede takıldığını gör |
| 04 · Başlamak | Üç adım, sağda `localhost:3000` penceresi; üçüncü adımda gerçek Button ve StatusChip |
| 05 · Adı nereden geliyor | Amblem ve üç paragraf |

- **Token katmanı bölümü ile bileşen ızgarası kalktı.** İlki 01'in yaptığı işi daha az inandırıcı
  yapıyordu (bir ürün türü seçtiriyordu, panel dönmüyordu); ikincisi dokümanın kendi menüsünün
  kopyasıydı. `token-katmani.tsx` ve `anasayfa.tsx` silindi.
- **Marka rengi 01 ile 02 arasında ORTAK.** İki bölümü saran bir `Provider` yok: aralarında ortak
  bir React ağacı da yok ve öyle bir sarmalayıcı sunucuda çizilen her şeyi bir istemci bileşeninin
  çocuğu yapardı. `components/marka-rengi.ts` modül seviyesinde bir abonelik
  (`useSyncExternalStore`), sunucu çiziminde de aynı başlangıç değerini veriyor.
- **Panelin teması sayfanın teması DEĞİL.** Ziyaretçi siteyi açık okurken paneli koyu deneyebiliyor;
  panelin token'ları kabında `paletteVars` ile bildiriliyor.
- **Amblem marka rengine dönmüyor.** Bir ara maskeyle tek renge boyandı ve yanlıştı: amblem iki
  renkli (dış halka, iç kareler, merkez), tek renge düşünce Tamga'nın amblemi olmaktan çıkıyor.
  Koyu sürümün dış kareleri BEYAZ, merkezi `#0A1F3D` · ürünün gönderdiği çizimle birebir.

### Ana sayfanın H1'inde kerning kapalı

"Yönetim" yazıldığında Y'nin kolu ö'nün noktalarının altına giriyordu. Sebep harf aralığı değil
KERNING: Red Hat Display, Y'den sonraki yuvarlağı kolun altına çekiyor · 64 pikselde "Yö" çifti
9.3 piksel kısalıyor. `font-kerning: none` yalnız `.home-h1`de; gövde metninde fark ölçülemiyor
("tasarım" 0.3 piksel). Punto 76'dan 64'e indi, satır aralığı 0.98'den 1.08'e çıktı: Türkçede
noktalı harf çok (ö, ü, ı, i, ç, ş), yani sıkı bir başlık bu dilde daha çabuk çakışıyor.

### README'nin kapı tablosu artık denetleniyor

Tablo elle yazılıydı ve ayrışmıştı: başlık "Yirmi kapı" diyordu (zincir yirmi iki), iki kapı
(`check:olcu-hizasi`, `check:tema-cifti`) tabloda hiç yoktu, `check:yuvarlak`ın satırı ölçümle
yanlışlanmış bir cümle taşıyordu ("avatar ve canlı nokta"; doğrusu radyo, skor halkası, spinner),
palet 960 ölçüm diyordu (1040), build 199 sayfa diyordu (203), depo haritası 96 sayfa diyordu (98).
Hepsi düzeltildi, ve `extract-counts.mjs` artık tablodaki adları zincirle karşılaştırıyor: bir kapı
eklenip tabloya yazılmazsa build duruyor. (Kapı sınandı: bir adın harfi değiştirilince çıkış 1.)
