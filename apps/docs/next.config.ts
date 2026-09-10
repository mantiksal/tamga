import type { NextConfig } from "next";

const config: NextConfig = {
  /* Kit kaynaktan değil derlenmiş dist'ten geliyor, yani transpilePackages gerekmiyor.
     Bu bilinçli: site paketi tam olarak bir müşteri projesinin göreceği hâliyle
     tüketiyor — exports haritası eksikse burada patlar, üretimde değil. */
  reactStrictMode: true,
};

export default config;
