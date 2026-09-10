# Architecture Decision Records (ADR)

Her ADR **tek bir temel kararı** kayıt altına alır: bağlamı, seçimi, değerlendirilen alternatifleri
ve sonuçları. Bunlar değişmez tarihtir; bir kararı değiştirmek için eskisini *düzenleme*, onu
*geçersiz kılan yeni* bir ADR yaz.

Kayıt başına format: **Bağlam → Karar → Değerlendirilen alternatifler → Sonuçlar → Durum.**

Yeni temel kararlar (bir bileşenin kamusal API'sinin değişmesi, bir token sözlüğünün yeniden
adlandırılması, dağıtım modelinin değişmesi) **implementasyondan önce** yeni numaralı bir ADR alır.

| # | Karar | Durum |
|---|-------|-------|
| 0001 | Tasarım sistemi ortak bir kütüphaneye taşındı (K1–K5, K12) | ✅ Kabul edildi · **iç** |
| [0002](0002-css-oneki.md) | CSS sınıf öneki `tamga-` (K6) | ✅ Kabul edildi |
| 0003 | Üç katman ve müşteri panelleri (K10, K12) | ✅ Kabul edildi · **iç** |
| [0004](0004-sablon-katmani.md) | Şablon katmanı: bir ekranın şekli bir nesne | ✅ Kabul edildi |

**İki kayıt bu depoda değil.** 0001 ve 0003 kararlarını müşteri adlarıyla, onların bugünkü
teknoloji yığınlarıyla ve iç değerlendirmelerle gerekçelendiriyor. Numaralar boş bırakılmadı,
çünkü bir ADR dizisi tarihtir ve boşluk "böyle bir karar yok" demektir; kayıtlar duruyor, yalnız
kamusal değiller. Kararın kendisi zaten yukarıdaki satırda yazılı ve kitin koduna yansımış
durumda: kit hiçbir ürünün sözlüğünü tanımıyor (`check-names`), ve şablon katmanı ADR-0004'te
anlatılıyor.

## Buraya ait olmayan kararlar

Bu depo bir **kütüphanedir** ve ürün kararlarını vermez. Saat dilimi, dil kümesi, yetki modeli,
terminoloji ve bilgi mimarisi, hepsi tüketen ürünün kararıdır ve o ürünün kendi ADR'lerine aittir.

Kitin bugünkü görsel kararları tüketen bir ürünün kendi tasarım belgesinde doğdu. Evrensel
olanların bu depoya taşınması (`docs/03-fizik.md`) açık bir iştir; o ürünün alanına özgü olanlar
üründe kalır.
