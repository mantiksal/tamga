# İşaret ve ton

Bir şeyin hâlini renkle, glifle ya da nabızla söyleyen her şey.

> Kod dosyalarında **başlık** duruyor; kanıt burada. Kural:
> [`CLAUDE.md` · Yorumlar](../../CLAUDE.md). Dizin: [gerekçeler](../08-bilesen-gerekceleri.md)


---

## `tone.ts`

### The tone scale · layer 3 of the palette.

WHY THE VOCABULARY IS NEUTRAL. This file used to be keyed on `Health`
(`ok · warn · down · idle · resolved`), which is THIS product's dictionary:
`down` means a site is unreachable and `resolved` means an event closed.
Neither word means anything in an e-commerce panel, where the same four
colours carry `teslim edildi · beklemede · iptal · taslak`.

So the kit speaks in ROLES and the product maps its own states onto them
(`config/health-tone.ts`). The rule this encodes: the kit carries the
MECHANISM, the product carries the DICTIONARY.

Collapsing five states into four roles cost nothing at the time: `ok` and
`resolved` were byte-identical here · the same three variables · because up
and resolved deliberately share one green (they belong to different domains
and almost never appear in the same list).

The scale has grown twice since, and each time because a real sentence had
nowhere to go. `info` came fifth: the other four all answer "is something
wrong", and a product that only wants to SAY something had to choose between a
grey that reads as "not reporting" and a green that reads as "solved".

`elevated` came sixth, and it is an INTERVAL rather than a shade. In an order
list "being prepared" and "return in progress" are two different states and
neither is a failure; with only `caution` and `danger` available they landed on
the same colour, and the list showed two things as one. `elevated` sits between
them: past the warning, not yet the failure.

Each role now carries THREE values, not two: text, mark and wash. A dot has to
carry at a few pixels and a sentence has to be read, and one colour cannot do
both · the darkness that makes a dot legible stops it reading as a dot.

Every value is a CSS variable, so the whole product follows the theme.


---

## `live-scope.tsx`

### The arbiter behind Law 3.

"The beacon is the only thing that pulses, and only one at a time.
   If two states qualify, the more severe one breathes; the other is
   static."                    · v2, docs/13-design-soul.md

That rule used to live in a Storybook note, and it was broken the day
it was written: three components each decided on their own that theirs
was urgent, nobody counted, and a screen ended up with three pulses.
Nobody had made a mistake · every component was right in its own box.
A rule that depends on a page author remembering it is not a rule.

So the arbitration moves here. Anything that wants to pulse asks; the
scope compares severities and lets exactly one through. Call sites do
not change and nobody has to know the rule exists.

WHAT COUNTS. Only brightness pulses are arbitrated · the beacon. The
mascot floats (position, not brightness) and is exempt; a skeleton
breathes but is an absence, not a signal, and disappears the moment
content arrives; a spinner lives inside a button that is mid-action.
See docs/acik-sorular.md for why that split is the resolution to a
contradiction v2 left open.


### Eşitlikte ilki kazanıyor.

Nesne anahtar sırası ekleme sırası, ve istekler etki sırasına göre kaydediliyor:
yani ağaç sırası. Katı bir `>` eşitlerin İLKİNİ tutuyor, ve "ilk" sayfada en yukarı
demek. (Karar: 2026-08-19, Ercüment.)

Gerekçe şu: işaretin VARLIĞI, onu hangi satırın taşıdığından daha önemli. Her
alternatif (zaman damgası, alan önceliği) daha hoş bir eşitlik bozma satın alıyor
ama bedeli çağrı yerlerinin başka türlü ihtiyaç duymadıkları veriyi taşıması.

### Nabız rütbesi bir varsayılan, politika değil.

`rankOf` yalnız `danger`a nefes veriyor, ve gerekçesi kitin hizmet ettiği her alanda
aynı: çok az işaret, anlamını yitirmiş bir işaretten küçük bir kusur. `caution`
kendi rengini zaten taşıyor; nabız "buraya, şimdi bak" için saklı.

Durumlarını daha ince sıralayan bir ürün açık bir rütbe geçiyor.

### Rozet, üstüne oturduğu şeyle birlikte gider.

`Badge` bir sarmalayıcı `span` kuruyor ve rozeti mutlak konumla köşeye koyuyor;
yani rozet, üstüne oturduğu şeyin ÇOCUĞU değil KARDEŞİ. Çocuğu yapmak mümkün
değil, çünkü `children` herhangi bir eleman olabilir ve onun içine yazmak o
elemanın kendi düzenine karışmak olur.

Bedeli ölçüldü: ikon düğmesi hover'da `translate(-1px,-1px)` ile kalkıyor, rozet
yerinde kalıyor ve köşeden kopuyor; basıldığında fark iki katına çıkıyor. Rozet
artık `:has()` ile aynı yolu gidiyor. İki sayı `.tamga-icon-btn`in kaymalarıyla
aynı olmak zorunda, ve ikisi kit.css'te yan yana duruyor.

### İkon düğmesinin gölgesi hover'da rengini değiştiriyordu.

Duruşta `--color-edge-strong` (lacivert), hover'da `--color-edge` (açık gri).
Yani imleç gelince düğme yükseliyor ama gölgesi SOLUYOR, ve göz bunu yükselme
değil "devre dışı kaldı" diye okuyor. Yasa 1 zaten söylüyor: kenar ile offset
aynı nesnenin iki yüzü, iki renk olduğunda gölge nesneden kopuyor.

---

## `icons.ts`

### Kitin ikon kaydı.

Phosphor'un SSR girişinden geliyor: o build'ler React context'i olmayan saf SVG
üretir, yani bir ikon Server Component içinde bir istemci sınırı sürüklemeden
çalışır.

Bu dosya ve `icon.tsx`, @phosphor-icons/react'e dokunmasına izin verilen tek iki
yer. Geri kalan her şey glifleri buradan alır · böylece set açık kalır ve
kütüphane değiştirilebilir olur.

ADLAR BİZİM, Phosphor'un değil. Çağrı yerleri ROL okur ("Search", "Delete"),
kütüphane adı değil ("MagnifyingGlass", "Trash").

BURAYA NE GİRER. Rolü her üründe aynı olan glifler: bir arama büyüteci her yerde
aramadır, bir çöp kutusu her yerde silmedir. Bir ürünün BİLGİ MİMARİSİNE ait
adlar buraya girmez · bir panelin kenar çubuğundaki her giriş o ürünün
sözlüğüdür. Onlar ürünün kendi kaydında yaşar ve bu dosyayı yeniden dışa vurur.

### PHOSPHOR'UN TAMAMI DA BURADAN GEÇİYOR.

Aşağıdaki adlandırılmış set bir KÜRASYON değil bir SÖZLÜK: rolü her üründe
aynı olan glifler, bizim adlarımızla. O liste kısa kalmalı, çünkü işi seçenek
sunmak değil aynı şeyi her yerde aynı işaretle söylemek.

Ama bir ürünün ihtiyacı listeyle bitmiyor, ve tüketicinin ikinci bir paket
kurup ikinci bir sarmalayıcı yazması saçmaydı: Phosphor zaten burada.
`export *` ile 1513 glifin hepsi `tamga-ui/icons`ten alınabiliyor.

MALİYETİ SIFIR. Phosphor'un SSR girişinde her glif kendi modülü; ESM yeniden
dışa vurumu ağaç sallamayı engellemiyor, yani on iki ikon alan bir tüketici
on iki ikon kadar ödüyor.

ÇAKIŞMA YOK: aşağıdaki açık dışa vurumlar `export *`ı gölgeliyor. `Search`
bizim `MagnifyingGlass`ımız kalıyor; kütüphanenin adı ("Trash") ile bizim
rolümüz ("Delete") yan yana duruyor ama rol her zaman kazanıyor.

HANGİSİNİ KULLANMALI. Rolü olan bir şey için ROLÜ: `Delete`, `Search`,
`Success`. Rolü olmayan, ürüne özgü bir şey için doğrudan glifi:
`Receipt`, `UsersThree`. İkincisi ürünün sözlüğüdür ve ürünün kendi
kaydında yaşamalı (bkz. `/docs/icons`).


---

## `button.tsx`

### The button family, typed.

The variants map to the `.tamga-*` classes rather than replacing them:
the design LANGUAGE stays in globals.css, where the whole system can
still be read top to bottom, and only the API moves into TypeScript.

The API is the point. `className="tamga-btn tamga-btn-succes"` is a silent
no-op · CSS never complains about a class it does not know · and this
project shipped exactly that twice: .tamga-btn-success and .tamga-btn-ghost
were used in seven places and defined in none, so those buttons
rendered as plain ones for weeks until someone noticed by eye.
`variant="succes"` is a type error before the file is even saved.

The other half of that guarantee is check-tokens.mjs, which fails the
build if a class named here is missing from the stylesheet. Between
them there is no way left for a variant to exist in name only.

## Karonun üstündeki glif: altı ton, altı mürekkep

`Alert`in glifi kendi karesinde duruyor ve o karenin zemini tonun `mark` rengi. Mürekkebi bir
süre `--color-page` idi: açık temada beyaza yakın olduğu için doğru görünüyordu, koyu temada
siyaha dönüyor ve glif plakaya gömülüyordu. Kritik tonda ölçüm **2.96**, yani bir grafik nesne
için geçerli olan 3.0 tabanının bile altında.

Tek bir mürekkep bu sorunu çözmüyor, çünkü altı plaka altı ayrı parlaklıkta. Ölçüldü:

| ton | plaka | beyaz | koyu plaka | seçilen |
| --- | --- | --- | --- | --- |
| positive | `#3e9a5c` | 3.51 | 4.69 | koyu |
| caution | `#d9a93a` | 2.17 | 7.59 | koyu |
| elevated | `#c8664a` | 3.85 | 4.27 | koyu |
| danger | `#b8323f` | **5.89** | 2.79 | beyaz |
| info | döner | 8.26 / 2.02 | 1.99 / 8.14 | **sayfa** |
| neutral | `#8a8f99` | 3.25 | 5.07 | koyu |

`info` ayrı duruyor çünkü plakası da temayla DÖNEN tek plaka (`#2447a8` → `#9db6f0`): orada
mürekkebin de dönmesi gerekiyor, ve `--color-page` ikisini birlikte çeviriyor (7.38 / 8.61).
Ötekilerde plaka sabit, dolayısıyla mürekkep de sabit olmak zorunda.

Eşik metnin 4.5'i değil **3.0**: bir glif grafik bir nesne, ve WCAG onu ayrı ölçüyor. Ayrı bir
eşik olmasaydı ya bu liste hiç ölçülmezdi ya da metin eşiği kalıp `elevated` (4.27) sebepsiz
düşerdi.

KAPI KAYNAĞI OKUYOR. İlk hâlinde çiftler `check-token-contrast`e elle yazılmıştı ve kasıtlı bir
ihlal denendiğinde kapı geçti: ölçtüğü şey `tone.ts`in kullandığı çift değil, kendi listesiydi.
Şimdi çiftler `tone.ts`ten okunuyor, ve aynı sabotaj kapıyı düşürüyor.
