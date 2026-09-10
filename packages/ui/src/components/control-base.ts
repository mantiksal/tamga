/* Seçim kontrollerinin paylaştığı tek değer. Beşi ayrı dosyada yaşıyor —
   guard'ın modeli "bir dosya = bir primitive" ve o model doğru: bir primitive
   kendi dosyasında olmazsa, durum story'sinin neyi kanıtladığı belirsizleşir. */
/** Etiketli kontrollerin ortak devre-dışı görünümü. */
const OFF = { opacity: 0.45, cursor: "not-allowed" } as const;

export { OFF };
