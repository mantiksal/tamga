"use client";

import { Galeri, type GaleriOgesi } from "@/components/gallery";
import type { Locale as Dil } from "@/i18n/config";
import {
  Ayarlar,
  BaskaUrun,
  DurumSayfasi,
  Durumlar,
  Giris,
  Kayit,
  KullaniciDetayi,
  KullaniciListesi,
  Pano,
  Sihirbaz,
  SiparisListesi,
  YeniKullanici,
} from "./ekranlar";

/**
 * Şablon kataloğu: her kart bütün uygulamayı çiziyor, modal aynı uygulamayı
 * gerçek boyunda ve tıklanabilir açıyor. Gerekçe: docs/07-dokuman-sitesi.md
 */

/* Tek öğelik bölüm yok: iki sütunlu ızgarada yanında bir delik bırakıyor. */
const G = {
  uygulama: { tr: "Uygulama", en: "The app" },
  liste: { tr: "Liste", en: "List" },
  kayit: { tr: "Kayıt", en: "Record" },
  ayar: { tr: "Ayarlar", en: "Settings" },
  oturumsuz: { tr: "Oturumsuz", en: "Signed out" },
};

const OGELER: GaleriOgesi[] = [
  {
    key: "app-shell",
    grup: G.uygulama,
    tur: "paket",
    boy: "ekran",
    ad: { tr: "Uygulama kabuğu", en: "App shell" },
    aciklama: {
      tr: "Oturum açmış her ekranın içinde durduğu çerçeve. Buradaki ray beş giriş ve bir destek masasının sözlüğü: menü kabukta yazılmıyor, çünkü bir kenar çubuğundaki her giriş o ürünün sözlüğüdür.",
      en: "The frame every signed-in screen sits in. This rail has five entries and a helpdesk's vocabulary: the menu is not written in the shell, because every entry in a sidebar is that product's vocabulary.",
    },
    ornek: (lang) => <BaskaUrun lang={lang} />,
    kod: `<AppShell
  brand={<Marka />}
  nav={[{ key: "talep", href: "/talepler", label: "Talepler", icon: TalepIkon }, …]}
  activePath={usePathname()}
  topbar={<UstSerit />}
  labels={{ home: "Ana sayfa", primaryNav: "Ana gezinme" }}
>
  {children}
</AppShell>`,
  },
  {
    key: "overview",
    grup: G.uygulama,
    tur: "paket",
    boy: "ekran",
    ad: { tr: "Pano", en: "Dashboard" },
    aciklama: {
      tr: "Bir kahraman, sonra ızgara. İki kahramanı olan bir ekranın kahramanı yoktur, ve bir pano tam böyle eşit karolardan oluşan bir duvara dönüşür.",
      en: "One hero, then a grid. A screen with two heroes has no hero, which is exactly how a dashboard becomes a wall of equal tiles.",
    },
    ornek: (lang) => <Pano lang={lang} />,
    kod: `<OverviewTemplate
  title="Bugün"
  subtitle="37 sipariş hazırlanmayı bekliyor"
  actions={<Button><Icon icon={Download} size="xs" />Dışa aktar</Button>}
  hero={<CiroKarti />}
  labels={{ loading: "Yükleniyor", ...hata }}
>
  <Kpi label="Sipariş" value="218" unit="adet" delta={12} better="up" />
  …
</OverviewTemplate>`,
  },
  {
    key: "list-users",
    grup: G.liste,
    tur: "paket",
    boy: "ekran",
    ad: { tr: "Kullanıcılar", en: "Users" },
    aciklama: {
      tr: "Her liste ekranının şekli: şerit, filtreler, sayaç satırı, tablo, sayfalama. Satırın adı bağlantı, seçim kutuları solda, satır eylemleri sağda.",
      en: "The shape of every list screen: a band, filters, a count row, the table, pagination. The row's name is the link, the checkboxes sit left, the row actions right.",
    },
    ornek: (lang) => <KullaniciListesi lang={lang} />,
    kod: `<ListTemplate
  title="Kullanıcılar"
  subtitle="48 kullanıcı · 3 davet bekliyor"
  actions={<Button variant="primary"><Icon icon={Plus} size="xs" />Yeni kullanıcı</Button>}
  filters={<><StatusChip label="Aktif" state="positive" /> …</>}
  state={durum}
  loadingRows={pageSize}
  error={{ code, requestId }}
  empty={<p>Bu filtreyle kullanıcı kalmadı.</p>}
  labels={{ loading: "Yükleniyor", ...hata }}
>
  <CountRow count={48} unit="kullanıcı" pageSize={boy} onPageSize={setBoy} … />
  <Table>…</Table>
  <Pagination page={sayfa} pageSize={boy} total={48} onChange={setSayfa} … />
</ListTemplate>`,
  },
  {
    key: "list-orders",
    grup: G.liste,
    tur: "paket",
    boy: "ekran",
    ad: { tr: "Siparişler", en: "Orders" },
    aciklama: {
      tr: "Aynı şablon, başka bir tablo ve on bir satır. Durum bir renk değil bir çip: bir sütunu renkle okumak, renk körü bir okuyucuyu sütunsuz bırakır.",
      en: "The same template, a different table and eleven rows. State is a chip rather than a colour: reading a column by colour alone leaves a colour-blind reader with no column.",
    },
    ornek: (lang) => <SiparisListesi lang={lang} />,
    kod: `<ListTemplate title="Siparişler" subtitle="1.284 sipariş · son 30 gün" …>
  <CountRow count={1284} unit="sipariş" aside={<p>12 tanesi 24 saati geçti</p>} … />
  <Table>
    <thead>
      <tr>
        {/* SortHeader kendisi bir th */}
        <SortHeader direction="desc" className="w-36">Tarih</SortHeader>
        …
      </tr>
    </thead>
    <tbody>…</tbody>
  </Table>
  <Pagination page={sayfa} pageSize={boy} total={1284} onChange={setSayfa} … />
</ListTemplate>`,
  },
  {
    key: "list-states",
    grup: G.liste,
    tur: "paket",
    boy: "ekran",
    ad: { tr: "Dört durum", en: "Four states" },
    aciklama: {
      tr: "Yüklenirken iskelet, hatada `code · request_id`, boşta bir slot, hazırda çağıranın tablosu. Boş bilerek slot: boş bir kullanıcı listesi davettir, boş bir iade listesi iyi haberdir.",
      en: "A skeleton while loading, `code · request_id` on error, a slot when empty, the caller's table when ready. Empty is a slot on purpose: an empty user list is an invitation, an empty returns list is good news.",
    },
    ornek: (lang) => <KullaniciListesi lang={lang} durum="loading" />,
    /* Modal içeriği dört çerçeveli ekran taşıyor; dışına bir çerçeve daha
       çizmek kart içinde kart üretiyordu. */
    tam: (lang) => <Durumlar lang={lang} />,
    tamCerceve: "yok",
    kod: `<ListTemplate state="loading" loadingRows={25} … />
<ListTemplate state="empty" empty={<BosCumle />} … />
<ListTemplate state="error" error={{ code, requestId }} … />
<ListTemplate state="ready" …><Table>…</Table></ListTemplate>`,
  },
  {
    key: "detail",
    grup: G.kayit,
    tur: "paket",
    boy: "ekran",
    ad: { tr: "Kullanıcı detayı", en: "User detail" },
    aciklama: {
      tr: "Sekmeler rota, durum değil: her biri adresi değiştirdiği için bağlantı. Burada boş hâli yok: bir liste meşru olarak boş olabilir, bir kayıt olamaz; olmayan kayıt 404'tür.",
      en: "Tabs are routes, not state: each changes the address, so each is a link. There is no empty state here: a list may legitimately be empty, a record may not; a missing record is a 404.",
    },
    ornek: (lang) => <KullaniciDetayi lang={lang} />,
    kod: `<DetailTemplate
  breadcrumb={[{ label: "Kullanıcılar", href: "/kullanicilar" }, { label: ad }]}
  title={ad}
  subtitle="Yönetici · 14 Mart 2025'ten beri"
  actions={<><Button>Düzenle</Button><Button variant="danger">Sil</Button></>}
  tabs={[{ key: "genel", label: "Genel", href: "?sekme=genel" }, …]}
  activeTab="genel"
  labels={{ loading: "Yükleniyor", breadcrumb: "Künye", tabs: "Sekmeler", ...hata }}
>
  {gövde}
</DetailTemplate>`,
  },
  {
    key: "detail-form",
    grup: G.kayit,
    tur: "paket",
    boy: "ekran",
    ad: { tr: "Yeni kullanıcı", en: "New user" },
    aciklama: {
      tr: "Aynı detay şablonu, sekmesiz ve formla. Kaydet tek yerde: kayan yüzeyin dibindeki şeritte, çünkü yirmi alanlık bir formda her zaman görünen tek yer orası.",
      en: "The same detail template, without tabs and with a form. Save lives in one place, the bar stuck to the bottom of the scrolling surface, because that is the only spot always visible in a twenty-field form.",
    },
    ornek: (lang) => <YeniKullanici lang={lang} />,
    kod: `<DetailTemplate
  breadcrumb={[{ label: "Kullanıcılar", href: "/kullanicilar" }, { label: "Yeni kullanıcı" }]}
  title="Yeni kullanıcı"
  labels={{ loading: "Yükleniyor", breadcrumb: "Künye", tabs: "Sekmeler", ...hata }}
>
  <Card>…</Card>
  <SaveBar changed labels={{ save: "Kaydet", cancel: "Vazgeç" }} />
</DetailTemplate>`,
  },
  {
    key: "settings",
    grup: G.ayar,
    tur: "paket",
    boy: "ekran",
    ad: { tr: "Ayarlar", en: "Settings" },
    aciklama: {
      tr: "Kazara dokuzuncu bir bölüm büyütmeye en açık ekran burası. Kapsam gösteriliyor, tahmin edilmiyor: bir ayarın kişiye mi çalışma alanına mı ait olduğu, onu kimin değiştirebileceğini belirliyor.",
      en: "This is the screen most likely to grow a ninth section by accident. Scope is shown, not guessed: whether a setting belongs to the person or the workspace decides who may change it.",
    },
    ornek: (lang) => <Ayarlar lang={lang} />,
    kod: `<SettingsTemplate
  sections={[{ key: "ekip", label: "Ekip", href: "/ayarlar/ekip", scope: "workspace" }, …]}
  activeSection="bildirim"
  title="Bildirimler"
  actions={<Button variant="primary">Kaydet</Button>}
  labels={{ sections: "Ayar bölümleri", scope: { personal: "Kişisel", … }, … }}
>
  <SettingsPanel title="Günlük özet" inheritedFrom="çalışma alanından geliyor">
    <Switch label="E-posta gönder" on={acik} onChange={setAcik} />
  </SettingsPanel>
</SettingsTemplate>`,
  },
  {
    key: "wizard",
    grup: G.ayar,
    tur: "paket",
    boy: "ekran",
    ad: { tr: "Kurulum sihirbazı", en: "Setup wizard" },
    aciklama: {
      tr: 'Form her şeyi bir kerede sorar; sihirbaz bir söz verir: bu kadar adım ve bitti. "Bitti" konumsal, çağıranın taşıması gereken bir bayrak değil.',
      en: 'A form asks for everything at once; a wizard makes a promise: this many steps and you are done. "Done" is positional, not a flag the caller has to maintain.',
    },
    ornek: (lang) => <Sihirbaz lang={lang} />,
    kod: `<WizardTemplate
  steps={[{ key: "hesap", label: "Hesap" }, { key: "magaza", label: "Mağaza" }, …]}
  activeStep="magaza"
  title="Mağazanı tanıt"
  back={<Button>Geri</Button>}
  next={<Button variant="primary">İleri</Button>}
  labels={hata}
>
  {adiminFormu}
</WizardTemplate>`,
  },
  {
    key: "sign-in",
    grup: G.oturumsuz,
    tur: "paket",
    boy: "ekran",
    ad: { tr: "Giriş", en: "Sign in" },
    aciklama: {
      tr: "Uygulama çerçevesi yok, ve bu bir eksik değil bir karar: gidilecek bir yer henüz yok, ve açamayacağın menüler sunan bir çerçeve yalan söyler. Sağlayıcılar formun üstünde.",
      en: "No app chrome, and that is a decision rather than an omission: there is nowhere to navigate yet, and a chrome offering menus you cannot open is a chrome that lies. The providers sit above the form.",
    },
    ornek: (lang) => <Giris lang={lang} />,
    kod: `<AuthTemplate brand={<Marka />} title="Tekrar hoş geldin" subtitle="Mağaza paneline giriş yap." footer={kaydolBaglantisi}>
  <AuthProviders dividerLabel="ya da">
    <Button><Icon icon={GoogleLogo} size="xs" />Google ile devam et</Button>
  </AuthProviders>
  <form>…</form>
</AuthTemplate>`,
  },
  {
    key: "register",
    grup: G.oturumsuz,
    tur: "paket",
    boy: "ekran",
    ad: { tr: "Kayıt", en: "Register" },
    aciklama: {
      tr: "Aynı şablon, yan panelli. Asimetri kasıtlı: giriş yapan kişi acelesi olan dönen bir kullanıcı, kaydolan kişi hâlâ karar veriyor, ve yan panel o kararı veriyor.",
      en: "The same template with a side panel. The asymmetry is deliberate: somebody signing in is a returning user in a hurry, somebody registering is still deciding, and the panel is what helps them decide.",
    },
    ornek: (lang) => <Kayit lang={lang} />,
    kod: `<AuthTemplate
  brand={<Marka />}
  title="Mağazanı aç"
  subtitle="Kurulum üç adım sürüyor, kart istemiyoruz."
  footer={girisBaglantisi}
  aside={<KurulumdanSonra />}
>
  {form}
</AuthTemplate>`,
  },
  {
    key: "public",
    grup: G.oturumsuz,
    tur: "paket",
    boy: "ekran",
    ad: { tr: "Durum sayfası", en: "Status page" },
    aciklama: {
      tr: "Oturumsuz ulaşılan yüzeyler. Neden rayı gizlenmiş uygulama çerçevesi değil: beyaz etiketli bir alan adında bu sayfa müşterinin kendi sayfasıdır, ve orada bizim rayımızın belirmesi bir sızıntıdır.",
      en: "The surfaces reachable without a session. Why not the app shell with the rail hidden: on a white-label domain this page is the customer's own, and our rail appearing there would be a leak.",
    },
    ornek: (lang) => <DurumSayfasi lang={lang} />,
    kod: `<PublicTemplate
  brand={<Marka />}
  title="Mağaza · Durum"
  subtitle="Son 90 gün"
  headerAside={<Button size="sm">Abone ol</Button>}
  footer="Bu sayfa herkese açıktır."
  labels={{ loading: "Yükleniyor", ...hata }}
>
  {icerik}
</PublicTemplate>`,
  },
];

const ETIKET = {
  tr: {
    hepsi: "Tümü",
    kapat: "Kapat",
    sayac: (n: number) => `${n} ekran`,
    paket: "paket",
    tarif: "tarif",
    kopyala: "Kodu kopyala",
    kopyalandi: "Kopyalandı",
  },
  en: {
    hepsi: "All",
    kapat: "Close",
    sayac: (n: number) => `${n} screens`,
    paket: "package",
    tarif: "recipe",
    kopyala: "Copy code",
    kopyalandi: "Copied",
  },
};

export function SablonGalerisi({ lang }: { lang: Dil }) {
  return <Galeri ogeler={OGELER} lang={lang} labels={ETIKET[lang]} />;
}
