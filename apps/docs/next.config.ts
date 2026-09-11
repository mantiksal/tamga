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
  output: "standalone",
  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
};

export default config;
