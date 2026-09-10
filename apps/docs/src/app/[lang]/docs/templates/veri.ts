/**
 * Örnek uygulamanın verisi: dolu tablolar, e-ticaret sözlüğü.
 * Gerekçe: docs/07-dokuman-sitesi.md
 */

export type Ton = "neutral" | "positive" | "caution" | "danger";

export const KULLANICILAR = {
  tr: [
    ["Ada Yılmaz", "ada@ornek.com", "Yönetici", "2 dk önce", "positive", "Aktif"],
    ["Baran Çelik", "baran@ornek.com", "Editör", "18 dk önce", "caution", "Davetli"],
    ["Ceyda Aksu", "ceyda@ornek.com", "Depo", "1 sa önce", "positive", "Aktif"],
    ["Deniz Kaya", "deniz@ornek.com", "Editör", "3 sa önce", "neutral", "Kapalı"],
    ["Ege Demir", "ege@ornek.com", "Depo", "dün", "positive", "Aktif"],
    ["Feyza Arslan", "feyza@ornek.com", "Muhasebe", "dün", "positive", "Aktif"],
    ["Görkem Şahin", "gorkem@ornek.com", "Editör", "3 gün önce", "caution", "Davetli"],
    ["Hazal Eren", "hazal@ornek.com", "Yönetici", "5 gün önce", "positive", "Aktif"],
    ["Işıl Toprak", "isil@ornek.com", "Depo", "2 hafta önce", "neutral", "Kapalı"],
  ],
  en: [
    ["Ada Yılmaz", "ada@example.com", "Admin", "2 min ago", "positive", "Active"],
    ["Baran Çelik", "baran@example.com", "Editor", "18 min ago", "caution", "Invited"],
    ["Ceyda Aksu", "ceyda@example.com", "Warehouse", "1 hr ago", "positive", "Active"],
    ["Deniz Kaya", "deniz@example.com", "Editor", "3 hrs ago", "neutral", "Disabled"],
    ["Ege Demir", "ege@example.com", "Warehouse", "yesterday", "positive", "Active"],
    ["Feyza Arslan", "feyza@example.com", "Finance", "yesterday", "positive", "Active"],
    ["Görkem Şahin", "gorkem@example.com", "Editor", "3 days ago", "caution", "Invited"],
    ["Hazal Eren", "hazal@example.com", "Admin", "5 days ago", "positive", "Active"],
    ["Işıl Toprak", "isil@example.com", "Warehouse", "2 weeks ago", "neutral", "Disabled"],
  ],
} as const;

export const SIPARISLER = {
  tr: [
    ["SIP-10428", "Ada Yılmaz", "12 Eyl 14:20", 3, "caution", "Hazırlanıyor", "1.240,00 ₺"],
    ["SIP-10427", "Baran Çelik", "12 Eyl 13:05", 1, "neutral", "Kargoda", "398,00 ₺"],
    ["SIP-10426", "Ceyda Aksu", "12 Eyl 11:47", 6, "positive", "Teslim edildi", "2.150,00 ₺"],
    ["SIP-10425", "Deniz Kaya", "12 Eyl 10:12", 2, "positive", "Teslim edildi", "760,00 ₺"],
    ["SIP-10424", "Ege Demir", "11 Eyl 18:33", 1, "danger", "İptal", "129,00 ₺"],
    ["SIP-10423", "Feyza Arslan", "11 Eyl 16:02", 4, "positive", "Teslim edildi", "1.875,50 ₺"],
    ["SIP-10422", "Görkem Şahin", "11 Eyl 15:41", 2, "neutral", "Kargoda", "540,00 ₺"],
    ["SIP-10421", "Hazal Eren", "11 Eyl 12:19", 9, "caution", "Hazırlanıyor", "3.410,00 ₺"],
    ["SIP-10420", "Işıl Toprak", "11 Eyl 09:58", 1, "positive", "Teslim edildi", "289,90 ₺"],
    ["SIP-10419", "Jale Kurt", "10 Eyl 21:30", 3, "positive", "Teslim edildi", "1.020,00 ₺"],
    ["SIP-10418", "Kaan Öz", "10 Eyl 19:44", 2, "neutral", "Kargoda", "615,00 ₺"],
  ],
  en: [
    ["ORD-10428", "Ada Yılmaz", "12 Sep 14:20", 3, "caution", "Packing", "$310.00"],
    ["ORD-10427", "Baran Çelik", "12 Sep 13:05", 1, "neutral", "Shipped", "$99.50"],
    ["ORD-10426", "Ceyda Aksu", "12 Sep 11:47", 6, "positive", "Delivered", "$537.50"],
    ["ORD-10425", "Deniz Kaya", "12 Sep 10:12", 2, "positive", "Delivered", "$190.00"],
    ["ORD-10424", "Ege Demir", "11 Sep 18:33", 1, "danger", "Cancelled", "$32.25"],
    ["ORD-10423", "Feyza Arslan", "11 Sep 16:02", 4, "positive", "Delivered", "$468.90"],
    ["ORD-10422", "Görkem Şahin", "11 Sep 15:41", 2, "neutral", "Shipped", "$135.00"],
    ["ORD-10421", "Hazal Eren", "11 Sep 12:19", 9, "caution", "Packing", "$852.50"],
    ["ORD-10420", "Işıl Toprak", "11 Sep 09:58", 1, "positive", "Delivered", "$72.45"],
    ["ORD-10419", "Jale Kurt", "10 Sep 21:30", 3, "positive", "Delivered", "$255.00"],
    ["ORD-10418", "Kaan Öz", "10 Sep 19:44", 2, "neutral", "Shipped", "$153.75"],
  ],
} as const;

export const TALEPLER = {
  tr: [
    ["#4821", "Fatura adresi güncellenmiyor", "Boyoz Yazılım", "danger", "Yüksek", "8 dk"],
    ["#4820", "SSO girişinde döngü", "Ege Lojistik", "danger", "Yüksek", "22 dk"],
    ["#4818", "Rapor dışa aktarımı boş geliyor", "Kuzey Market", "caution", "Orta", "1 sa"],
    ["#4815", "Yeni kullanıcı daveti ulaşmadı", "Deniz Tekstil", "caution", "Orta", "2 sa"],
    ["#4811", "Webhook imzası doğrulanmıyor", "Anadolu Kargo", "danger", "Yüksek", "3 sa"],
    ["#4809", "Toplu etiket yazdırma yavaş", "Boyoz Yazılım", "neutral", "Düşük", "dün"],
    ["#4802", "Karanlık temada logo kayboluyor", "Kuzey Market", "neutral", "Düşük", "dün"],
    ["#4797", "API oran sınırı yükseltme talebi", "Ege Lojistik", "caution", "Orta", "2 gün"],
  ],
  en: [
    ["#4821", "Billing address will not update", "Boyoz Software", "danger", "High", "8 min"],
    ["#4820", "SSO sign-in loops", "Ege Logistics", "danger", "High", "22 min"],
    ["#4818", "Report export comes back empty", "Kuzey Market", "caution", "Medium", "1 hr"],
    ["#4815", "New user invitation never arrived", "Deniz Textile", "caution", "Medium", "2 hrs"],
    ["#4811", "Webhook signature fails to verify", "Anadolu Freight", "danger", "High", "3 hrs"],
    ["#4809", "Bulk label printing is slow", "Boyoz Software", "neutral", "Low", "yesterday"],
    ["#4802", "Logo disappears in dark theme", "Kuzey Market", "neutral", "Low", "yesterday"],
    ["#4797", "Request to raise the API rate limit", "Ege Logistics", "caution", "Medium", "2 days"],
  ],
} as const;
