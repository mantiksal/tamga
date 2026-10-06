import type { NextConfig } from "next";

const config: NextConfig = {
  /* DERLEME KLASÖRÜ ORTAMDAN, VE SEBEBİ ÖLÇÜLDÜ.

     Dev sunucusu ve `next build` ikisi de `.next`e yazıyordu. `verify`
     koşturulduğunda ayakta olan dev sunucusu okuduğu dosyaların altından
     çekildiği için BÜTÜN SAYFALARDA 500 vermeye başlıyordu — ve hata mesajı
     ("Unexpected non-whitespace character after JSON") sebebi hiç
     göstermiyordu. İki kez yaşandı, ikisinde de teşhis dakikalar aldı.

     `verify` artık `BUILD_DIR=.next-verify` ile ayrı klasöre yazıyor; dev
     `.next`te rahat bırakılıyor. Tüketen ürünün deposunda da aynı çözüm var. */
  distDir: process.env.BUILD_DIR || ".next",
  reactStrictMode: true,
  /* NEXT'İN DEV ROZETİ KAPALI · sol alttaki siyah "N" dairesi. Yalnız
     geliştirmede çıkıyor, ama bu sitenin ekran kaydı alınıyor ve kayıtta
     çerçevenin köşesinde duran bir framework logosu kitin işareti sanılıyor. */
  devIndicators: false,
  output: "standalone",
  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
  /* GÜVENLİK BAŞLIKLARI · site hiçbirini göndermiyordu.
     CSP burada YOK ve bilerek: temayı ilk boyamadan önce kuran satır içi script
     ya bir nonce ya da bir hash ister, ikisi de ayrı bir karar. */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default config;
