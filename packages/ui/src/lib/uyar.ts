/**
 * Geliştirme uyarısı. Kit kullanıcıya İngilizce yazmaz; bu satır kullanıcıya
 * değil geliştiriciye, konsola gider. Üretimde susar.
 */
export function uyar(mesaj: string) {
  const ortam = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
  if (ortam === "production") return;
  console.warn(`[tamga-ui] ${mesaj}`);
}
