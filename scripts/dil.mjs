/**
 * İKİ DİLLİ KAYNAK YORUMU: `TR:` ile başlayan kısım Türkçe karşılığı.
 *
 * Doküman sitesi iki dilli ama ÜRETİLEN metinler kaynağın dilini taşıyordu:
 * kimi yorum İngilizce yazılmış kimi Türkçe, ve iki sayfa da yarı yarıya
 * öteki dili basıyordu. Bir gerekçe okunan metindir; okunan her metnin iki
 * dili olmak zorunda.
 *
 * ÇEVİRİ AYRI BİR DOSYADA DEĞİL YORUMUN İÇİNDE. Değeriyle aynı yerde durmayan
 * bir doküman, değer değiştiğinde güncellenmiyor — props.json ile tokens.json
 * zaten bu yüzden kaynaktan üretiliyor. İki dil de aynı yorumda yaşıyor,
 * birlikte değişiyor.
 *
 * Biçim:  English note. TR: Türkçe not.
 */
export function dilAyir(ham) {
  if (!ham) return { en: null, tr: null };
  const i = ham.search(/(^|\s)TR:\s/);
  if (i < 0) return { en: ham, tr: null };
  return {
    en: ham.slice(0, i).trim() || null,
    tr: ham.slice(i).replace(/^\s*TR:\s*/, "").trim() || null,
  };
}
