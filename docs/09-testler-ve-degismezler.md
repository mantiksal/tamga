# 09 · Testler ve değişmezler

Kit neyi ölçüyor, neyi ölçmüyor, ve her ölçümün arkasındaki gerekçe. Kod
dosyalarında **başlık** duruyor; kanıt burada. Kural:
[`CLAUDE.md` · Yorumlar](../CLAUDE.md).

Ölçümün üç yeri var ve karıştırılmamalı:

| nerede | ne ölçülüyor |
| --- | --- |
| `scripts/check-*.mjs` | Kitin KAYNAĞINA bakan kapılar: fizik, ölçek, token paritesi, kontrast, sınıf tanımları. Metin değil ilişki ölçüyorlar. |
| `src/*.test.ts` | Saf mantık: sayfalayıcı aritmetiği, ton rolleri, palet kademeleri. DOM yok. |
| `src/**/*.test.tsx` | Çizilen çıktı: şablon davranışı ve erişilebilirlik değişmezleri, jsdom ile. |

---

## `kit.test.ts` · neden bir süre yoktu ve neden artık var

On projenin bağlı olduğu bir kütüphanenin sıfır testi vardı, üstelik onu tüketen
ürünün kendi test paketi varken. Bir bileşenin görünüşü gözle yakalanıyordu; ama
kitte GÖRÜNMEYEN mantık da var, ve o mantık sessizce yanlış olabiliyor.

Burada test edilen şey saf fonksiyonlar: bir sayfalayıcının hangi numaraları
göstereceği, bir skorun hangi tona düşeceği, bir nabzın hangi rütbeyi kazanacağı.
Üçü de DOM'suz, ve üçü de yanlış olduğunda hiçbir hata vermiyor: yalnız yanlış
çiziyor.

Render ayrı dosyalarda: şablonların davranışı `src/patterns/*.test.tsx` içinde
jsdom ile ölçülüyor. Bir zamanlar burada "render tüketen ürünün story'lerinde
kanıtlanıyor" yazıyordu; o story'ler kaldırıldı ve ölçüm kite taşındı. Yasanın
GÖRSEL tarafını `scripts/check-physics.mjs` kitin kendi CSS'ini okuyarak,
ilişkisel olarak ölçüyor.

### Rol sayısı bir tripwire

Yedinci ton rolü eklenirse `kit.test.ts` düşer, ve düşmesi gerekir: rol sayısı
bir ürün kararı değil, kitin sözleşmesi. Tripwire iki kez işini yaptı.

**Dörtten beşe.** Beşincisi `info`. Öbür dördü "bir şey yanlış mı" sorusuna cevap
veriyor; yalnızca BİLDİRMEK isteyen ürünün elinde "raporlamıyor" diyen bir gri
ile "çözüldü" diyen bir yeşilden başkası yoktu.

**Beşten altıya.** Altıncısı `elevated`, ve o da bir tonlama değil eksik bir
aralık: bir listede "hazırlanıyor" ile "iade sürecinde" iki ayrı durum, ikisi de
bir hata değil, ve `caution` ile `danger` dışında yer olmadığı için ikisi aynı
renge düşüyordu. Liste iki ayrı şeyi tek renkte gösteriyordu.

---

## `a11y.test.tsx` · erişilebilirlik değişmezleri

**Ne olduğu, ve ne olmadığı.** Bu bir axe taraması DEĞİL. Altı değişmez ölçüyor
ve hepsi kitin KENDİ verdiği sözler:

1. Etkileşimli her elemanın erişilebilir bir adı var.
2. `aria-hidden` bir ağaç, odaklanabilir bir şey saklamıyor.
3. Rol çiftleri tam: `radio` bir `radiogroup` içinde, `tab` bir `tablist`
   içinde, `option` bir `listbox` içinde.
4. Alanın altındaki not kontrole bağlı.
5. Sayfanın bir birinci düzey başlığı var.
6. `segmented` tema anahtarı `.dark` sınıfına dokunmuyor.

**Neden axe değil:** axe bir kütüphane, ve bu depoya yeni kütüphane girmiyor. O
bir karar ve kararın sahibi burası değil. Bu dosya karar verilene kadar boşluğu
KAPATMIYOR, sadece daraltıyor. Kapsamadıkları: kontrast
(`check-token-contrast` ölçüyor), odak sırası, canlı bölge davranışı, ve burada
çizilmeyen bileşenler.

**Önceki ölçüm neden kayboldu:** 48 story üzerinde axe koşuyordu ve o story'ler
tüketen üründeydi; Storybook kaldırılınca ölçüm de kalktı. Kitin sözü kitin
deposunda ölçülmeliydi, orada değil.

### 4 · Alanın altındaki not kontrole bağlı

`Field`'in `description`ı ve `error`ı gevşek birer paragraf olarak çiziliyordu:
ne id'leri vardı ne de kontrole giden bir `aria-describedby`. Yani kuralı
açıklayan ya da yazılanın nesi yanlış diyen tek cümle, ekran okuyucu kullanan
kişiye hiç ulaşmıyordu. Bir hatanın yalnız renkle söylenmesi formlardaki en eski
kusur.

Bağlantı çağırana bırakılmadı, bileşende kuruldu: tek bir üründe 94 çağrı yeri
onu yapmamıştı, ve bu tam olarak "kütüphanenin isteyeceği değil borçlu olduğu
kural" tanımı. Tek bir eleman çocuğu klonlanıyor ki bağı kontrolün kendisi
taşısın; üstünde var olan bir `aria-describedby` korunuyor ve bu ona ekleniyor.

### 5 · Sayfanın bir birinci düzey başlığı var

`PageBand` bir `h2` çiziyordu ve kabuk hiçbir başlık çizmiyor. Yani ürün elle
yazdığı `<h1>`i bırakıp kitin şeridine geçtiği anda belgesinin birinci düzey
başlığını kaybediyordu: ekran okuyucu kullanan biri için sayfanın adı hiç
söylenmemiş oluyordu, ve kusur gözle görünmediği için ürün tarafında fark
edilmiyordu.

Şerit sayfanın adı. Bölüm başlığı gereken yerde `SectionHead` var.

### 6 · `segmented` tema anahtarı `.dark`a dokunmuyor

Gerekçesi [Yüzey ve kabuk](gerekce/05-yuzey-ve-kabuk.md) altında. Buraya bir test
olarak da yazıldı, çünkü kusur GÖZLE bulundu, ölçümle değil:
`getComputedStyle` her iki durumda da tutarlı cevap veriyordu, çünkü token'ların
kendisi doğruydu. Yanlış olan, hangi bloğun yürürlükte olduğuydu.

---

## `data-props.test.tsx` · kanca gerçekten DOM'a iniyor

Bu testin sebebi bir gün değil, üst üste beş gündü: bir test ya da stil kancası
gerektiği her seferinde bileşen onu sessizce düşürdü, tüketici bileşeni bırakıp
sınıfını elle yazdı, ve sınıfla gelmesi gereken korumaları (kırpma, kaydırma,
klavye) kaybetti. Hiçbirinde hata yoktu: geçen taraf geçtiğini sanıyor, alan
taraf hiç çizmiyor.

Testte altı temsilci var; kuralın tamamını `check-data-props` kapısı tarıyor.
Test kapının ölçemediğini ölçüyor: niteliğin gerçekten DOM'a indiğini. Kuralın
kendisi [Kitaplık](gerekce/09-kitaplik.md) altında.

---

## `palette.test.ts` · üç kademe, ve iki kez yeniden yazıldı

Testler iki kez yeniden yazıldı, çünkü her seferinde bir aşırı düzeltmeyi
kilitliyorlardı.

1. **hâl:** her nötr markanın tonundan. Kırmızı markada kâğıtlar pembeydi.
2. **hâl:** hiçbir nötr markadan etkilenmiyor. Bu sefer mürekkep her markada
   aynı lacivert kaldı; oysa tasarım, kahverengi bir marka seçildiğinde YAZIYI
   da kahverengileştiriyor.
3. **hâl** (tasarımın kendi üreticisinden): üç kademe, TAM · KISITLI · SABİT.

Dört test o üç kademeyi tutuyor. Biri düşerse kademe kaymış demektir, ve kaymanın
gözle fark edilmesi zor: iki marka arasındaki fark ancak yan yana konunca
görünüyor.

### Renk kutusunun çentiği · gölgede kalan bir kusurun kapısı

Görünüm ekranındaki kutular SEÇİLEN HAM rengi gösteriyor; çentikleri de
`makePalette(hex).light.accentInk`ten geliyor. Bir süre `--color-accent-ink`
token'ıyla çiziliyorlardı ve koyu temada antrasit marka seçilince palet vurguyu
açıp mürekkebi koyultuyordu: koyu kutunun üstünde koyu çentik, 1.4 kontrast,
görünmez. Hiçbir kapı yakalamadı, çünkü token'ların kendi kontrastı doğruydu;
kusur ham hex ile token'ın EŞLEŞMEMESİNDEYDİ.

Ölçülen tam olarak o: ham zeminin üstünde o zeminin kendi mürekkebi. Eşik metin
eşiği (AA 4.5) değil işaret eşiği (3.0), çünkü çentik kalın çizgili bir glif,
gövde metni değil.

---

## `wizard-template.test.tsx` · sihirbazın sözü

Bir sihirbazın sözü şudur: "bu kadar adım, sonra bitti". Testler o sözü tutuyor:
liste her zaman görünür, tam bir adım güncel, ve neyin bittiği birinin
işaretlemeyi hatırlaması gereken bir bayrağa değil KONUMA bağlı.

Kancalar şeridin kendisinden geliyor. Şeridi `Steps` çiziyor ve durumu
`.tamga-step-mark[data-state]` ile söylüyor (`todo · current · done`). Testler o
niteliği okuyor, çünkü ölçtükleri şey şablonun `Steps`e doğru `current` indeksini
geçmesi.

### Kimlik şeride kadar iniyor

Şablon bir zamanlar `steps.map((s) => s.label)` yapıyordu: `key` tam bu sınırda
çöpe gidiyordu, yani bir adıma kanca takmanın yolu yoktu ve tüketen taraf ölçümü
etikete bağlamak zorunda kalıyordu. Etiket çevriliyor; dil değiştiği an o ölçüm
kırılır.

Bir test o sınırı tutuyor: adımın kendi elemanı kimliğini taşıyor, ve kancayla
`aria-current` aynı adımda buluşuyor. "Şu adım, ve şu an açık olan o" ancak ikisi
birlikte ölçülebiliyor.
