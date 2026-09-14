import type { Locale } from "@/i18n/config";
import { PageHead, H2, P, Note } from "@/components/prose";
import { IkonIzgarasi } from "@/components/icons-grid";
import { findPage } from "@/content/nav";
import counts from "@/content/counts.json";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("icons")!.title[lang] };
}

const T = {
  tr: {
    lead: (
      <>
        Adlandırılmış {counts.ikon} rol, yedi grup, ve altlarında Phosphor&apos;un tamamı. Roller kısa kalıyor, çünkü{" "}
        <strong>bir ikon setinin işi seçenek sunmak değil, aynı şeyi her yerde aynı simgeyle
        söylemek.</strong> Tıkla, adı panoya gelsin.
      </>
    ),
    adH: "Adlar bizim, Phosphor'un değil",
    adP: (
      <>
        Çağrı yeri <strong>rolü</strong> okur, kütüphane adını değil: <code>Delete</code>,{" "}
        <code>Trash</code> değil. <code>Main</code>, <code>Star</code> değil. Rollerin yaklaşık yarısı
        bizim verdiğimiz adı taşıyor. Sebebi tek: kütüphane değişirse çağrı yerlerinin hiçbiri
        değişmemeli, ve bir yıldız simgesi her üründe &ldquo;asıl olan&rdquo; demeli, &ldquo;yıldız&rdquo;
        değil.
      </>
    ),
    agirlikH: "Varsayılan ağırlık duotone, ve iki istisnası",
    agirlikP: (
      <>
        Varsayılan ağırlık <strong>duotone</strong>, çünkü ikinci katmanı aksanı miras alıyor:
        ikonlar markanın rengini, ikon başına bir renk kodu yazılmadan taşıyor. Bir ikonun rengi
        metinden yalnız <strong>durum</strong> taşıdığında ayrışıyor; süs için asla.
      </>
    ),
    agirlikN: (
      <>
        <strong>Satır içi eylem ikonları bunun dışında ve kalın basılıyor.</strong> Duotone bir onay
        işareti kutu gibi render oluyor: bir onay işaretinin iç alanı yok, dolayısıyla ikinci katman
        dolduracak bir şey bulamıyor ve glifin tamamını boyuyor. Bu bir zevk kararı değil, glifin
        geometrisinin dayattığı bir istisna.
      </>
    ),
    boyutH: "Altı boyut, ve boyut da rolle seçiliyor",
    boyutP: (
      <>
        Boyutlar bir merdiven, ve aradaki değerler yok: bir ikon &laquo;biraz daha büyük&raquo;
        olamaz. Yanına konduğu şeyin kademesi hangisiyse ikon da onu alıyor, çünkü bir ikonun işi
        metnin yanında durmak; kendi başına bir ölçüsü yok.
      </>
    ),
    disariH: "Setinde olmayan bir glif",
    disariP: (
      <>
        Adlandırılmış set bir kürasyon değil bir <strong>sözlük</strong>: rolü her üründe aynı olan
        glifler. Kısa kalıyor, çünkü işi seçenek sunmak değil aynı şeyi her yerde aynı işaretle
        söylemek. Ama bir ürünün kendi sözlüğü ("sepet", "kutu", "talep") oraya hiç girmez, ve o
        glifler de bir yerden gelmek zorunda. Phosphor&apos;un tamamı aynı girişten geliyor;
        maliyeti sıfır, çünkü her glif kendi modülü ve on iki ikon alan bir tüketici on iki ikon
        kadar ödüyor.
      </>
    ),
    disariK: `// ürünün kendi IA kaydı — kite değil, ürüne ait
export { Receipt as SiparisIkon, UsersThree as KullaniciIkon } from "tamga-ui/icons";

// kullanım: kitin sarmalayıcısı, ürünün glifi
<Icon icon={SiparisIkon} size="base" />

// glifleri bir eşlemede tutmak gerekirse tipi de aynı girişten geliyor
import type { IconGlyph } from "tamga-ui/icons";
const IKON: Record<string, IconGlyph> = { siparis: SiparisIkon };`,
    disariN: (
      <>
        Kitin <code>Icon</code>&apos;u ağırlığı, boyu ve tonu tek karardan veriyor; hangi glifi
        çizdiğini sormuyor. Yani ürünün kendi glifi de kitin fiziğine uyuyor.{" "}
        <strong>Rol her zaman kazanıyor:</strong> <code>Search</code> bizim büyütecimiz kalıyor,
        kütüphanenin <code>MagnifyingGlass</code>&apos;ı da ayrıca duruyor. Rolü olan bir şeyi rolüyle
        çağır; rol adı, çağrı yerinin ne yaptığını söylüyor, hangi glifi çizdiğini değil.
      </>
    ),
    girenH: "Buraya ne girer",
    girenP: (
      <>
        Rolü <strong>her üründe aynı</strong> olan glifler: bir arama büyüteci her yerde aramadır,
        bir çöp kutusu her yerde silmedir. Bir ürünün bilgi mimarisine ait adlar girmez; bir
        panelin kenar çubuğundaki her giriş o ürünün sözlüğüdür ve kendi kaydında yaşar.
      </>
    ),
    girenN: (
      <>
        Bu dosya ve <code>icon.tsx</code>, <code>@phosphor-icons/react</code>&apos;a dokunmasına
        izin verilen tek iki yer. Geri kalan her şey glifleri buradan alır; böylece set açık kalır
        ve kütüphane değiştirilebilir olur.
      </>
    ),
  },
  en: {
    lead: (
      <>
        {counts.ikon} named roles in seven groups, and Phosphor&apos;s whole set underneath them. The roles stay few, because{" "}
        <strong>an icon set&apos;s job is not to offer choice, it is to say the same thing with the
        same mark everywhere.</strong> Click one to copy its name.
      </>
    ),
    adH: "The names are ours, not Phosphor's",
    adP: (
      <>
        A call site reads the <strong>role</strong>, not the library name: <code>Delete</code>, not{" "}
        <code>Trash</code>. <code>Main</code>, not <code>Star</code>. Roughly half the roles carry a
        name of ours. One reason: if the library changes, no call site should, and a star glyph
        should mean &ldquo;the main one&rdquo; in every product rather than &ldquo;star&rdquo;.
      </>
    ),
    agirlikH: "Duotone by default, with two exceptions",
    agirlikP: (
      <>
        The default weight is <strong>duotone</strong>, because its second layer inherits the
        accent: icons carry the brand colour without a colour written per icon. An icon&rsquo;s
        colour diverges from the text only when it carries <strong>state</strong>; never for
        decoration.
      </>
    ),
    agirlikN: (
      <>
        <strong>Inline action icons are the exception and render bold.</strong> A duotone check mark
        renders as a box: a check has no interior, so the second layer finds nothing to fill and
        paints the whole glyph. This is not a taste decision but an exception the glyph&rsquo;s
        geometry forces.
      </>
    ),
    boyutH: "Six sizes, and size is chosen by role too",
    boyutP: (
      <>
        The sizes are a ladder with nothing in between: an icon cannot be &ldquo;a bit bigger&rdquo;.
        It takes the step of whatever it sits next to, because an icon&rsquo;s job is to stand
        beside text; it has no measurement of its own.
      </>
    ),
    disariH: "A glyph the set does not have",
    disariP: (
      <>
        The named set is a <strong>vocabulary</strong> rather than a curation: glyphs whose role is
        the same in every product. It stays short because its job is not to offer choice, it is to
        say the same thing with the same mark everywhere. But a product&apos;s own vocabulary
        (&ldquo;cart&rdquo;, &ldquo;box&rdquo;, &ldquo;ticket&rdquo;) never enters it, and those
        glyphs have to come from somewhere. All of Phosphor comes through the same entry point, and
        it costs nothing: each glyph is its own module, so a consumer importing twelve icons pays
        for twelve.
      </>
    ),
    disariK: `// the product's own IA registry — it belongs to the product, not the kit
export { Receipt as OrderIcon, UsersThree as UserIcon } from "tamga-ui/icons";

// usage: the kit's wrapper, the product's glyph
<Icon icon={OrderIcon} size="base" />

// if the glyphs have to live in a map, its type comes from the same door
import type { IconGlyph } from "tamga-ui/icons";
const ICONS: Record<string, IconGlyph> = { order: OrderIcon };`,
    disariN: (
      <>
        The kit&apos;s <code>Icon</code> settles weight, size and tone in one decision; it never
        asks which glyph it is drawing. So a product&apos;s own glyph still obeys the kit&apos;s
        physics. <strong>Phosphor&apos;s three thousand are not re-exported here</strong>, because
        the moment they are, the kit&apos;s names (&ldquo;Delete&rdquo;) live beside the
        library&apos;s (&ldquo;Trash&rdquo;) and call sites start confusing the two.
      </>
    ),
    girenH: "What belongs here",
    girenP: (
      <>
        Glyphs whose role is <strong>the same in every product</strong>: a magnifier is search
        everywhere, a bin is delete everywhere. Names belonging to one product&apos;s information
        architecture do not enter; every entry in a panel&apos;s sidebar is that product&apos;s
        vocabulary and lives in its own registry.
      </>
    ),
    girenN: (
      <>
        This file and <code>icon.tsx</code> are the only two places allowed to touch{" "}
        <code>@phosphor-icons/react</code>. Everything else takes its glyphs from here, which keeps
        the set open and the library replaceable.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const p = findPage("icons")!;
  const t = T[lang];

  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>

      <IkonIzgarasi lang={lang} />

      <H2>{t.adH}</H2>
      <P>{t.adP}</P>

      <H2>{t.agirlikH}</H2>
      <P>{t.agirlikP}</P>
      <Note>{t.agirlikN}</Note>

      <H2>{t.boyutH}</H2>
      <P>{t.boyutP}</P>

      <H2>{t.disariH}</H2>
      <P>{t.disariP}</P>
      <pre className="docs-code my-4">{t.disariK}</pre>
      <Note>{t.disariN}</Note>

      <H2>{t.girenH}</H2>
      <P>{t.girenP}</P>
      <Note>{t.girenN}</Note>
    </>
  );
}
