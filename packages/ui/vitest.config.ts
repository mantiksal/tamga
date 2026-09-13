import { defineConfig } from "vitest/config";

/**
 * İKİ ÇEŞİT TEST, TEK KOŞU.
 *
 * Kitin testleri uzun süre yalnız HESAP testiydi: renk matematiği, sayfa
 * aritmetiği. Onlar için bir ekrana gerek yok. Ama şablonların iddiaları
 * ekranla ilgili — "tek kahraman, asla iki", "sekme çubuğu her durumda yerinde
 * kalır" — ve o iddialar ancak bileşen gerçekten çizilirse sınanabilir.
 *
 * Bu iddialar bir zamanlar bir ÜRÜN deposunda sınanıyordu, çünkü şablonlar
 * oradaydı. Şablonlar buraya taşındı, testler orada yetim kaldı ve kitin
 * şablon katmanı bir süre hiç bakılmadan üç ürüne birden hizmet etti.
 *
 * `jsdom` gerçek bir tarayıcı değil: hafızada kurulan sahte bir sayfa. Yeterli,
 * çünkü buradaki sorular yerleşim ve yapı soruları — "bu nitelik var mı", "kaç
 * tane çizildi". Gerçek boyayı ölçen sorular (Yasa 1 fiziği) `check-physics`
 * kapısının işi.
 */
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test-setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
  },
});
