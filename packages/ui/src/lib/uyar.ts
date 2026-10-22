/**
 * Geliştirme uyarısı. Kit kullanıcıya İngilizce yazmaz; bu satır kullanıcıya
 * değil geliştiriciye, konsola gider. Üretimde susar.
 *
 * DÜZ `process.env.NODE_ENV` YAZIMI ŞART: webpack DefinePlugin ve Vite `define`
 * yalnız bu kalıbı yerine koyuyor; isteğe bağlı zincirli eski yazım tarayıcıda
 * hiç değişmiyordu ve uyarılar üretim konsoluna düşüyordu. `process` yoksa
 * (bundler'sız tarayıcı) ReferenceError yakalanıyor ve uyarı gösteriliyor.
 */
declare const process: { env: { NODE_ENV?: string } };

export function uyar(mesaj: string) {
  try {
    if (process.env.NODE_ENV === "production") return;
  } catch {
    /* process tanımsız: geliştirme sayılır */
  }
  console.warn(`[tamga-ui] ${mesaj}`);
}
