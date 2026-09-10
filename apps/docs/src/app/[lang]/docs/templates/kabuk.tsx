"use client";

import { Avatar, Badge, Icon, IconButton, Input, ThemeToggle } from "tamga-ui";
import { AppShell, type LinkComponent, type NavEntry } from "tamga-ui/patterns";
import { Bell, Search, Support } from "tamga-ui/icons";
import {
  AyarIkon,
  BilgiIkon,
  KullaniciIkon,
  MusteriIkon,
  PanoIkon,
  RaporIkon,
  SiparisIkon,
  TalepIkon,
  UrunIkon,
} from "./urun-ikonlari";
import type { Locale as Dil } from "@/i18n/config";

/**
 * Örneklerin içinde durduğu uygulama. Oturum ve kamusal şablonlar bunun
 * dışında: gidilecek bir yer yokken çerçeve göstermek yalan söylemek olur.
 * Gerekçe: docs/07-dokuman-sitesi.md
 */

/** Önizlemedeki bağlantı gezinmiyor; `href` yerinde kalıyor. */
export const DurmusBaglanti: LinkComponent = ({ href, children, ...rest }) => (
  <a href={href} onClick={(e) => e.preventDefault()} {...rest}>
    {children}
  </a>
);

export function Marka() {
  /* Mantıksal ambleminin kendisi (`brand/mantiksal-amblem.svg`). Rengi
     `currentColor`: rayda mürekkep rengini alıyor, koyu temada da doğru. */
  return (
    <svg viewBox="0 0 3313 2898" width="22" height="20" aria-hidden fill="currentColor">
      <polygon points="2285.07 464.04 2673.45 985.2 1656.57 1751.53 639.65 985.2 1028.03 464.04 2285.07 464.04" />
      <polygon points="3312.64 630.46 2811.23 985.2 2128.16 2897.01 3312.64 1898.32 3312.64 630.46" />
      <polygon points="0.5 632.22 501.96 985.2 1184.94 2897.01 0.5 1898.32 0.5 632.22" />
    </svg>
  );
}

const U = {
  tr: {
    ara: "Sipariş, ürün ya da müşteri ara",
    bildirim: "Bildirimler",
    okunmamis: "okunmamış bildirim",
    destek: "Destek",
    temaAcik: "Açık tema",
    temaKoyu: "Koyu tema",
    anaSayfa: "Ana sayfa",
    anaGezinme: "Ana gezinme",
    hesap: "Ada Yılmaz",
    nav: {
      pano: "Pano",
      siparis: "Siparişler",
      urun: "Ürünler",
      kullanici: "Kullanıcılar",
      rapor: "Raporlar",
      ayar: "Ayarlar",
      talep: "Talepler",
      musteri: "Müşteriler",
      bilgi: "Bilgi bankası",
    },
  },
  en: {
    ara: "Search an order, product or customer",
    bildirim: "Notifications",
    okunmamis: "unread notifications",
    destek: "Support",
    temaAcik: "Light theme",
    temaKoyu: "Dark theme",
    anaSayfa: "Home",
    anaGezinme: "Primary navigation",
    hesap: "Ada Yılmaz",
    nav: {
      pano: "Dashboard",
      siparis: "Orders",
      urun: "Products",
      kullanici: "Users",
      rapor: "Reports",
      ayar: "Settings",
      talep: "Tickets",
      musteri: "Companies",
      bilgi: "Knowledge base",
    },
  },
} as const;

/** E-ticaret panelinin menüsü. Ürünün sözlüğü, kitin değil. */
export const MAGAZA = (lang: Dil): NavEntry[] => [
  { key: "pano", href: "/", label: U[lang].nav.pano, icon: PanoIkon },
  { key: "siparis", href: "/siparisler", label: U[lang].nav.siparis, icon: SiparisIkon },
  { key: "urun", href: "/urunler", label: U[lang].nav.urun, icon: UrunIkon },
  { key: "kullanici", href: "/kullanicilar", label: U[lang].nav.kullanici, icon: KullaniciIkon },
  { key: "rapor", href: "/raporlar", label: U[lang].nav.rapor, icon: RaporIkon },
  { key: "ayar", href: "/ayarlar", label: U[lang].nav.ayar, icon: AyarIkon },
];

/** BAŞKA bir ürünün menüsü — aynı kabuk, başka sözlük. */
export const DESTEK = (lang: Dil): NavEntry[] => [
  { key: "talep", href: "/talepler", label: U[lang].nav.talep, icon: TalepIkon },
  { key: "musteri", href: "/musteriler", label: U[lang].nav.musteri, icon: MusteriIkon },
  { key: "bilgi", href: "/bilgi", label: U[lang].nav.bilgi, icon: BilgiIkon },
  { key: "rapor", href: "/raporlar", label: U[lang].nav.rapor, icon: RaporIkon },
  { key: "ayar", href: "/ayarlar", label: U[lang].nav.ayar, icon: AyarIkon },
];

/**
 * Üst şerit KÜRESEL BAĞLAM taşıyor, iş değil: arama, bildirim, tema, hesap.
 * Ekranın kendi eylemleri (Yeni kullanıcı, Dışa aktar) burada değil, şeridin
 * altındaki başlık bandında — biri uygulamaya, öteki ekrana ait.
 */
function UstSerit({ lang }: { lang: Dil }) {
  const u = U[lang];
  return (
    <>
      <span className="relative flex min-w-0 flex-1 items-center">
        <Icon
          icon={Search}
          size="xs"
          className="pointer-events-none absolute left-2.5 text-ink-faint"
        />
        <Input aria-label={u.ara} placeholder={u.ara} className="w-full max-w-96 pl-8" />
      </span>
      <span className="ml-auto flex items-center gap-1.5">
        <Badge count={3} label={u.okunmamis}>
          <IconButton aria-label={u.bildirim}>
            <Icon icon={Bell} size="sm" />
          </IconButton>
        </Badge>
        <IconButton aria-label={u.destek}>
          <Icon icon={Support} size="sm" />
        </IconButton>
        <ThemeToggle labels={{ toLight: u.temaAcik, toDark: u.temaKoyu }} />
        {/* HESAP DA BİR DÜĞME, ve şeritteki ötekilerle AYNI KUTUDA. Çıplak bir
            28 piksellik avatar olarak duruyordu: yanındaki bildirim, destek ve
            tema düğmeleri `--control` karesindeyken hesap onlardan küçük ve
            hizasızdı. Avatar `bare` giriyor, çünkü çerçeveli bir karonun
            çerçeveli bir düğmenin içinde durması kutu içinde kutudur — prop'un
            gerekçesi zaten bu durum. */}
        <IconButton aria-label={u.hesap}>
          <Avatar name={u.hesap} size={22} bare />
        </IconButton>
      </span>
    </>
  );
}

export function Uygulama({
  lang,
  nav,
  aktif,
  children,
}: {
  lang: Dil;
  nav?: NavEntry[];
  aktif: string;
  children: React.ReactNode;
}) {
  const u = U[lang];
  return (
    <AppShell
      brand={<Marka />}
      nav={nav ?? MAGAZA(lang)}
      activePath={aktif}
      linkComponent={DurmusBaglanti}
      topbar={<UstSerit lang={lang} />}
      labels={{ home: u.anaSayfa, primaryNav: u.anaGezinme }}
    >
      {children}
    </AppShell>
  );
}
