# Architecture Decision Records (ADR)

Her ADR **tek bir temel kararı** kayıt altına alır: bağlamı, seçimi, değerlendirilen alternatifleri
ve sonuçları. Bunlar değişmez tarihtir; bir kararı değiştirmek için eskisini *düzenleme*, onu
*geçersiz kılan yeni* bir ADR yaz.

Kayıt başına format: **Bağlam → Karar → Değerlendirilen alternatifler → Sonuçlar → Durum.**

Yeni temel kararlar (bir bileşenin kamusal API'sinin değişmesi, bir token sözlüğünün yeniden
adlandırılması, dağıtım modelinin değişmesi) **implementasyondan önce** yeni numaralı bir ADR alır.

| # | Karar | Durum |
|---|-------|-------|
| [0001](../ozel/0001-ortak-kutuphaneye-tasima.md) | Tasarım sistemi ortak bir kütüphaneye taşındı (K1–K5, K12) | ✅ Kabul edildi · **iç** |
| [0002](0002-css-oneki.md) | CSS sınıf öneki `tamga-` (K6) | ✅ Kabul edildi |
| [0003](../ozel/0003-uc-katman-ve-musteri-panelleri.md) | Üç katman ve müşteri panelleri (K10, K12) | ✅ Kabul edildi · **iç** |
| [0004](0004-sablon-katmani.md) | Şablon katmanı: bir ekranın şekli bir nesne | ✅ Kabul edildi |

**İki kayıt bu klasörde değil, `docs/ozel/`de.** 0001 ve 0003 kararlarını müşteri adlarıyla,
onların bugünkü teknoloji yığınlarıyla ve iç değerlendirmelerle gerekçelendiriyor; `ozel/`
klasörü yayınlanan doküman sitesine girmiyor, o yüzden oraya konuldular. Numaralar boş
bırakılmadı, çünkü bir ADR dizisi tarihtir ve boşluk "böyle bir karar yok" demektir. Kararın
kendisi zaten yukarıdaki satırlarda yazılı ve kitin koduna yansımış durumda: kit hiçbir ürünün
sözlüğünü tanımıyor (`check-names`), ve şablon katmanı ADR-0004'te anlatılıyor.

> Bu paragraf bir süre "İki kayıt bu depoda **değil**" diyordu ve yanlıştı: ikisi de depoda,
> yalnız başka klasörde. Bir okuyucunun aradığı dosyayı "yok" sanıp aramayı bırakması, yanlış
> yerde araması kadar pahalı.

## Buraya ait olmayan kararlar

Bu depo bir **kütüphanedir** ve ürün kararlarını vermez. Saat dilimi, dil kümesi, yetki modeli,
terminoloji ve bilgi mimarisi, hepsi tüketen ürünün kararıdır ve o ürünün kendi ADR'lerine aittir.

Kitin bugünkü görsel kararları tüketen bir ürünün kendi tasarım belgesinde doğdu. Evrensel
olanlar taşındı ve artık doküman sitesinde yaşıyor (`/docs/fizik`, `/docs/olcu`, `/docs/hareket`);
o ürünün alanına özgü olanlar üründe kalır.

> Buradaki bağlantı bir süre `docs/03-fizik.md`'ye işaret ediyordu ve öyle bir dosya hiç olmadı:
> fizik doğrudan doküman sitesine yazıldı.
