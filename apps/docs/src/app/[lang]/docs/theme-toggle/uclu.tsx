"use client";
import { useState } from "react";
import { ThemeToggle, type ThemePreference } from "tamga-ui";

/**
 * Üçlü biçimin demosu, kendi durumunu tutan bir sarmalayıcı.
 *
 * Sayfa bir sunucu bileşeni ve `segmented` biçimi tercihi ÜRÜNDEN istiyor
 * (`preference` + `onPreferenceChange`). Bu ayrım bileşenin sözleşmesinin
 * kendisi: kontrol ikinci bir yazar olmuyor. Demo da o sözleşmeyi göstermek
 * için gerçek bir durum tutuyor · burada temayı değiştirmiyor, yalnız seçimi.
 */
export function ThemeToggleUclu({
  labels,
}: {
  labels: { light: string; dark: string; system: string };
}) {
  const [tercih, setTercih] = useState<ThemePreference>("system");
  return (
    <ThemeToggle
      variant="segmented"
      labels={labels}
      preference={tercih}
      onPreferenceChange={setTercih}
    />
  );
}

/**
 * İKİ SEÇENEKLİ ŞERİT · tasarımın 01.13'ü bunu gösteriyor. Üçlü hâli önerilen
 * kalıyor ("sistem" bir seçimin yokluğu), ama iki seçenek sunmak bir ürün
 * kararı ve kit onu da çizebiliyor: `system` etiketi verilmeyince basamak da
 * gelmiyor.
 */
export function ThemeToggleIkili({ labels }: { labels: { light: string; dark: string } }) {
  const [tercih, setTercih] = useState<ThemePreference>("light");
  return (
    <ThemeToggle
      variant="segmented"
      labels={labels}
      preference={tercih}
      onPreferenceChange={setTercih}
    />
  );
}
