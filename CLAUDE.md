# Tamga · çalışma disiplini

> **Üst kural: doğruluk ve kalite her zaman token'dan önce gelir.** Aşağıdaki taktikler
> doğrulamanın *miktarını* değil, çıktısının *bağlama sızmasını* azaltır. Bir taktik doğruluğu
> riske atıyorsa o an için onu boşver: doğrula, sonra ucuzlat.

Bu dosya hem insanlar hem yapay zekâ için. Ekibe yeni katılan biri (ya da onun asistanı) önce
[`README.md`](README.md)'yi, sonra bunu okur.

## Bu proje nedir

**Kütüphane, framework değil.** Ekranları tüketen proje kurar; kit parçaları verir.

**Kit mekanizmayı taşır, ürün sözlüğü ve kimliği taşır.** Bu tek cümle en sık başvurulan sınır:
`TimelineStrip` kite girer, `UptimeBar` girmez; ikisi aynı koddur, biri alan adı taşır. Kit dört
nötr rol bilir (`neutral · positive · caution · danger`); ürünün "kargoda", "tükendi", "kritik"
sözlüğü kendi tarafında eşlenir.

## Fazın dışına taşma

| yapıyorsan | yapma |
| --- | --- |
| Bir bileşen ekliyorsan | Kitin fiziğini değiştirme: dört yasa tartışmaya açılmadan değişmez |
| Bir sayfa yazıyorsan | Bileşene dokunma; sayfa bileşeni ANLATIR, düzeltmez |
| Bir guard'ı geçemiyorsan | Guard'ı gevşetme (aşağıya bak) |
| Bir renk/boyut gerekiyorsa | `className`'e sayı yazma: token'a bak, yoksa token ekle |

## Gate'ler · sessiz koş

- İterasyonda: **`pnpm verify`**. Başarıda kapı başına tek `✓`. Ham `tsc`/`next build` çalıştırıp
  tüm çıktıyı bağlama **dökme**.
- Ham komut şartsa çıktıyı log'a yönlendir, yalnız kararı grep'le:
  `pnpm build > /tmp/b.log 2>&1; grep -E "error|✓" /tmp/b.log | head`.

**Gate'i değil kodu düzelt.** Her guard'ın başında neden var olduğu yazılı ve çoğu gerçek bir
hatadan doğdu. Guard seni yakaladıysa önce o yorumu oku.

**Sınanmamış guard kâğıt guard'dır.** Yeni bir guard yazdıysan kasıtlı bir ihlalle patlattığını
gör, sonra geri al. Yakalamadığını görmediğin bir guard, yakalamıyor olabilir.

## Build & dev sunucusu

- **`rm -rf .next && build`'i refleks olarak çalıştırma.** İterasyon için `next dev`'i canlı tut.
- **Bayat `.next` tuzağı:** ayakta bir dev sunucusu varken build alırsan ikisi aynı `.next`'i
  paylaşır ve testler kod hatası gibi görünen şeylerle düşer. Bu deponun geçmişinde bir kez
  yaşandı: 11 e2e testi birden düştü, sebep dev sunucusuydu. Süreci **bir kez** öldür.
- **Kit değişirse dev sunucusunu yeniden başlat.** Doküman sitesi kiti `dist`'ten okuyor;
  `pnpm --filter tamga-ui build` yeter sanma, Next modülü önbelleğe almış olabilir.
- Portlar: doküman **6070**. dashboard-v5 ayrı bir depoda ve **3005** kullanıyor.

## Tarayıcı ölçümü

- Görsel bir mekaniği **bir kez** ölç. Gate'lendiyse tekrar açma.
- **Gate yoksa ölç**, ve mümkünse bir gate ekle.
- Birden çok ölçümü **tek koşuda** topla.
- **Screenshot'u sayısal doğrulama için bağlama okuma.** İnsan gözü gerekiyorsa oku.

## Dosya okuma · doğruluk token'dan önce gelir

- **Gezinme/arama** (nerede, var mı): `offset`/`limit` ya da grep.
- **Anlamak/değiştirmek/sözleşme doğrulamak:** doğruluğun bağlı olduğu kadarını **TAM** oku. Bir
  API sözleşmesini grep'le doğrulama: kaçırılan bir kullanım, tasarruf edilen token'dan kat kat
  pahalı bir bug üretir.
- Zaten düzenlediğin dosyayı "doğrulamak için" tekrar okuma.

## Bir bileşen eklerken

Tam adımlar [`docs/02-bilesen-ekleme.md`](docs/02-bilesen-ekleme.md)'de. Özet:

1. **Önce sor: bu gerçekten yeni mi?** Var olanın varyantı yeni dosya değil, bir prop'tur.
2. **Sınıf var mı?** Kitin CSS'inde karşılığı olan ama bileşeni olmayan şeyler vardı; onlar için
   yeni bir şey icat etme, var olanın etrafına doğru işaretlemeyi koy.
3. **Metin yazma.** Kit çeviri yapmaz: görünen her metin prop olarak gelir. Bir `aria-label`
   bile.
4. **Yeni bir kontrol mü?** Kendi choreography'si varsa kendi dosyasına koy; `check-states-stories`
   dosya bazında çalışıyor ve besteci ile kontrolü ayırt edebilmeli.
5. **Doküman sayfası aynı partide yazılır.** Sonra yazılan doküman yazılmaz.

## Yorumlar

Bu depodaki yorumlar **kararı** anlatır, kodu değil. `// döngü` yazma; "neden bu şekilde ve
alternatifi neden reddedildi" yaz. Bir yorumun en değerli hâli, birinin ileride yapacağı hatayı
önleyenidir, ve bu depodaki yorumların çoğu gerçekten yapılmış bir hatadan doğdu.

**Yorum kodu yalanlamasın.** Bir kez oldu: sayfalayıcının yanında "seçili sayfa dolgu almaz"
yazıyordu ve sınıf dolgu veriyordu. Yorumu değiştirirken kodu, kodu değiştirirken yorumu kontrol
et.

### Nerede duracağı

Yorumlar bir süre **denemenin günlüğü** oldu: "önce şöyleydi, şu kırıldı, sonra böyle yaptık".
O anlatı değerli ama yeri kod değil: bir dosyayı açan kişi o dosyanın ne yaptığını okumak
istiyor, projenin tarihini değil. Kural:

| Nerede | Ne |
| --- | --- |
| **Kodda kalır** | Tuzağın **tam yanındaki** tek iki satır: "burada `overflow` kırpar", "`SortHeader` kendisi bir `<th>`". Okuyan kişi o satırı değiştirmek üzereyken görmeli. |
| **Kodda kalır** | Yayınlanan gerekçeler: prop JSDoc'ları ve token yorumları. Bunlar `extract-props`/`extract-tokens` ile doküman sitesine **üretiliyor**; silinirse sayfa boşalır. |
| **`docs/adr/`** | Bir daha tartışılmayacak kararlar: neden bu katman var, neden bu sınır çizildi. |
| **`docs/`** | Bir işi baştan sona anlatan kılavuzlar, ve deponun kendi iç notları. |
| **Doküman sitesi** | Tüketicinin okuması gereken her şey. |

Ölçü basit: **bu paragraf silinse kod yanlış yazılır mı?** Evet ise kalır. Hayır ama bilgi
değerliyse taşınır. İkisi de değilse gider.

## Oturum hijyeni

Faz sınırında `/clear` ile taze oturum daha ucuz. Commit'ler doğal kesme noktası.

## Commit

**Kullanıcı istemeden commit atma.** İstendiğinde: tek anlamlı commit, TR mesaj.
