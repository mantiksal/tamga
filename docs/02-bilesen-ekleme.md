# 02 · Bir bileşen eklemek

> Adım adım oyun kitabı. En sık yapılan iş bu, ve en sık atlanan adım sonuncular.

---

## Adım 0 · gerçekten yeni mi

Üç soruyu sırayla sor. İkisinde "hayır" diyemiyorsan kod yazma.

**a) Var olanın varyantı mı?**
Yeni bir varyant **yeni bir dosya değil**, mevcut `cva` tablosuna bir satır ya da bir prop.
`Button`'ın altı varyantı, `StatusChip`'in dört rolü, `Skeleton`'ın dokuz hazır kalıbı; hiçbiri
ayrı bileşen değil.

**b) Sınıfı zaten var mı?**
Kitin CSS'inde karşılığı olan ama bileşeni olmayan şeyler oldu, ve bu bir hata türü:
`.tamga-check` yıllarca yalnız bir sınıftı, işaretlemesini her çağıran kendi yazdı, ve referans
uygulama `role` bile taşımıyordu. Böyle bir durumdaysan **yeni bir şey icat etme**: var olan
sınıfın etrafına doğru işaretlemeyi koy.

**c) Ürünün sözlüğünü mü taşıyor?**
`UptimeBar` kite giremez, `TimelineStrip` girer. Aynı kod, biri alan adı taşıyor. Adı nötrleştir
ya da üründe bırak.

## Adım 1 · dosya

`packages/ui/src/components/<ad>.tsx`.

**Kendi dosyası mı, var olana mı?** Ölçüt `check-states-stories`: bileşen **yeni bir kontrol**
getiriyorsa, yani kendi hover/basılma/seçili fiziği varsa, kendi dosyasında olmalı. Guard dosya
bazında çalışıyor ve bir kontrolü besteci bileşenlerden ayırt edebilmeli. `RailLink` ve `Slider`
bu yüzden ayrı dosyada.

## Adım 2 · kurallar

**Kit çeviri yapmaz.** Görünen her metin prop olarak gelir, bir `aria-label` bile. Bir bileşenin
içine yazılmış tek bir Türkçe ya da İngilizce kelime, dokuzuncu dilde kırılır.

```tsx
// yanlış
<button aria-label="Kapat">
// doğru
<button aria-label={labels.close}>
```

**Renk ve boyut token'dan.** `className`'e sayı yazma. Ölçek `theme.css`'te; aradığın adım orada
yoksa **önce token ekle**, gerekçesini yorumla yaz.

**Yasa 2'yi kontrol et.** Dolgu eylem demek. "Buradasın" ya da "bu seçildi" diyen bir şey
çerçeve + offset alır. Bu kural bir kez kitin kendi içinde çiğnendi (sayfalayıcı) ve yorumda
tersi yazıyordu.

**Klavye ve ekran okuyucu.** Tıklanabilir bir `<div>` yazma. Bir kontrolün adı yoksa vardır
diyemezsin. Kaydırılabilir bir kutu `tabIndex={0}` almazsa klavyeyle erişilemez.

## Adım 3 · dışa aktar

`packages/ui/src/index.ts`. Buraya yazılmayan şey iç detaydır ve tüketici ona ulaşamaz.

## Adım 4 · doküman sayfası (aynı partide)

Sonra yazılan doküman yazılmaz. Üç dosya:

1. **`apps/docs/src/content/nav.ts`**: bir satır. Ad **ayrık** yazılır: `Score ring`,
   `ScoreRing` değil. Menü bir kod bloğu değil.
2. **`apps/docs/src/app/[lang]/docs/<slug>/page.tsx`**: iki dilli `T = { tr, en }` bloğu.
   İskelet sabit:

   ```
   canlı örnek → ne işe yarar → Kurallar → Props → İlgili
   ```

3. **Canlı örnek durum tutuyorsa** `apps/docs/src/components/interactive.tsx`'e; o dosya
   `"use client"`. Örneğin metni oradaki `D = { tr, en }` sözlüğünden gelir; sayfadan prop
   geçirme.

**Props tablosunu yazma**, `<Props of="Ad" lang={lang} />` koy; tablo tipten üretiliyor.

**Bir prop'un her seçeneğinden bahset.** `check-prop-coverage` bunu zorluyor ve sebebi gerçek:
`Tooltip` dört yerleşimi destekliyordu, sayfa yalnız varsayılanı gösteriyordu. Okunmayan bir
seçenek yok sayılır.

## Adım 5 · yeni kontrolse states story

`check-states-stories` yeni bir kontrolü yakalarsa **guard'ı susturma**: `dashboard-v5`'in
`src/stories/` klasörüne bir states story yaz. Altı durum: rest · hover · press · focus-visible ·
disabled · loading, gerçek olaylarla gösterilir.

## Adım 6 · kapılar

```bash
pnpm verify
```

Kırmızıysa guard'ın başındaki yorumu oku; cevabı orada. **Kapıyı değil kodu düzelt.**

---

## Kontrol listesi

- [ ] Var olanın varyantı değil
- [ ] Sınıfı zaten yoktu (yoksa sarmalayıcı yazıldı, yeni sınıf icat edilmedi)
- [ ] Ürün sözlüğü taşımıyor
- [ ] Görünen tüm metin prop
- [ ] Renk ve boyut token'dan
- [ ] Klavyeyle çalışıyor, adı var
- [ ] `index.ts`'te dışa aktarıldı
- [ ] `nav.ts` + iki dilli sayfa yazıldı
- [ ] Her prop seçeneğinden sayfada bahsedildi
- [ ] Yeni kontrolse states story var
- [ ] `pnpm verify` yeşil
