import { LookDemo, RadioDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("radio-group")!.title[lang] };
}

/**
 * Sayfa metni, iki dilli.
 *
 * Neden burada ve sözlükte değil: bir doküman paragrafını JSON anahtarına
 * çevirmek onu okunamaz hâle getirir ve yapıyı metinden koparır. Sözlük ARAYÜZ
 * metinleri içindir ("Kopyala", "Önizleme"); sayfa içeriği sayfayla yaşar.
 *
 * İkisi aynı dosyada, çünkü asıl risk çeviri değil AYRIŞMA: Türkçesi
 * güncellenip İngilizcesi unutulursa iki farklı gerçek doğar. Yan yana
 * durduklarında bu unutuş görünür olur.
 *
 * ÖRNEKLERİN İÇİ DE ÇEVRİLİYOR — buton yazıları, yer tutucular, örnek veri.
 * Bir İngilizce sayfada "Kaydet" yazan bir buton, çevrilmemiş bir sayfadan
 * daha kötüdür: sayfa çevrilmiş görünür, ama ekrandaki şey değildir.
 */
const T = {
  tr: {
    rules: "Kurallar",
    lookH: "Üç biçim, tek anlam",
    lookP: (
      <>
        <code>look</code> seçeneğin çizildiği kabuğu değiştiriyor: <strong>list</strong> alt alta,{" "}
        <strong>chip</strong> yan yana sarılan küçük kabuklar, <strong>card</strong> ikinci bir
        satır taşıyacak kadar yer veren bir kart yüzeyi. Değişen yalnız kabuk:{" "}
        <code>role=&quot;radiogroup&quot;</code>, <code>role=&quot;radio&quot;</code>,{" "}
        <code>aria-checked</code> ve klavye davranışı üçünde de aynı.
      </>
    ),
    lookN: (
      <>
        <strong>Bu varyant bir kolaylık değil, bir kapı.</strong> Kart biçimi kitte yokken ürünler
        onu ham <code>&lt;button&gt;</code> yığınlarıyla çiziyordu: görüntü doğru, anlam eksik.
        Ekran okuyucu &laquo;üç ayrı düğme&raquo; duyuruyordu, &laquo;üç seçenekten biri&raquo;
        değil. Rolü ve klavyeyi her çağrı yerinde yeniden kurmak gereken bir iş, ve her seferinde
        eksik yapılıyor.
      </>
    ),
    lookSecim: (
      <>
        Seçili kabuk <strong>çerçeve ve sert offset</strong> alıyor, dolgu değil (Yasa 2): dolgu
        eylem demek, &laquo;bu seçildi&raquo; bir eylem değil bir durumdur. İşaret üç biçimde de
        duruyor, çünkü kenar rengi tek başına bir sinyal olamaz.
      </>
    ),
    kanca: (
      <>
        <strong>Seçenekler kendi kancalarını taşıyor.</strong> <code>value</code> ve{" "}
        <code>label</code> dışındaki her şey o seçeneğin düğmesine iniyor, yani bir seçenek testin ya
        da stilin ihtiyaç duyduğu niteliği taşıyabiliyor. Kitin kendi nitelikleri sonra yazılıyor:
        bir kanca <code>aria-checked</code>&apos;i kazara ezemez.
      </>
    ),
    lookIkinci: (
      <>
        İkinci satır <code>label</code>&apos;in içinde: ayrı bir <code>hint</code> alanı yok. Etiket
        zaten <code>ReactNode</code>, ve yalnız tek bir biçimde anlamı olan bir prop, props
        tablosunda herkese gösterilen bir yalan olurdu.
      </>
    ),
    roles: (
      <>
        Grup <code>role=&quot;radiogroup&quot;</code>, satırlar <code>role=&quot;radio&quot;</code>.
        İkisi birden olmadan ekran okuyucu &quot;üç ayrı düğme&quot; duyurur, &quot;üç seçenekten
        biri&quot; değil.
      </>
    ),
    when: (
      <>
        Seçenekler uzunsa ya da üçten çoksa doğru olan bu. İki-üç kısa seçenek yatay sığıyorsa{" "}
        <Xref to="segmented">Segmented</Xref> daha az yer kaplar.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Çoklu seçim için <Xref to="checkbox">Checkbox</Xref>; uzun bir küme için{" "}
        <Xref to="select">Select</Xref> ya da <Xref to="combobox">Combobox</Xref>.
      </>
    ),
  },
  en: {
    rules: "Rules",
    lookH: "Three shells, one meaning",
    lookP: (
      <>
        <code>look</code> changes the shell each option is drawn in: <strong>list</strong> stacks
        them, <strong>chip</strong> wraps small shells inline, <strong>card</strong> gives a card
        surface with room for a second line. Only the shell changes:{" "}
        <code>role=&quot;radiogroup&quot;</code>, <code>role=&quot;radio&quot;</code>,{" "}
        <code>aria-checked</code> and the keyboard behaviour are the same in all three.
      </>
    ),
    lookN: (
      <>
        <strong>This variant is a gate rather than a convenience.</strong> While the card shape was
        missing from the kit, products drew it with stacks of bare <code>&lt;button&gt;</code>s: the
        picture was right, the meaning was not. A screen reader announced &ldquo;three separate
        buttons&rdquo;, not &ldquo;one of three options&rdquo;. Rebuilding the role and the keyboard
        at every call site is work, and it is done incompletely every time.
      </>
    ),
    lookSecim: (
      <>
        The selected shell takes <strong>an outline and a hard offset</strong>, never a fill (Law 2):
        a fill means an action, and &ldquo;this one is chosen&rdquo; is a state rather than an
        action. The mark stays in all three shells, because an edge colour cannot be the only signal.
      </>
    ),
    kanca: (
      <>
        <strong>Options carry their own hooks.</strong> Anything beyond <code>value</code> and{" "}
        <code>label</code> lands on that option&rsquo;s button, so a choice can carry the attribute a
        test or a style needs. The kit&rsquo;s own attributes are written after it, so a hook cannot
        accidentally overwrite <code>aria-checked</code>.
      </>
    ),
    lookIkinci: (
      <>
        The second line goes inside <code>label</code>: there is no separate <code>hint</code>
        field. The label is already a <code>ReactNode</code>, and a prop that only means something in
        one shell would be a lie told to everyone in the props table.
      </>
    ),
    roles: (
      <>
        The group is <code>role=&quot;radiogroup&quot;</code>, the rows are{" "}
        <code>role=&quot;radio&quot;</code>. Without both, a screen reader announces &quot;three
        separate buttons&quot; rather than &quot;one of three&quot;.
      </>
    ),
    when: (
      <>
        This is the right control when the options are long or there are more than three. If two
        or three short options fit side by side, <Xref to="segmented">Segmented</Xref> takes less
        room.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For multiple choice, <Xref to="checkbox">Checkbox</Xref>; for a long set,{" "}
        <Xref to="select">Select</Xref> or <Xref to="combobox">Combobox</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("radio-group")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <Demo labels={dict.demo} align="start" code={`<RadioGroup
  label="…"
  value={v}
  onChange={setV}
  options={[
    { value: "pending",   label: "…" },
    { value: "shipping",  label: "…" },
    { value: "delivered", label: "…" },
  ]}
/>`}>
        <RadioDemo lang={lang} />
      </Demo>

      <H2>{t.lookH}</H2>
      <P>{t.lookP}</P>
      <Demo labels={dict.demo} align="start" grid={false} code={`<RadioGroup look="card" … />
<RadioGroup look="chip" … />`}>
        <LookDemo lang={lang} />
      </Demo>
      <P>{t.lookSecim}</P>
      <Note>{t.lookN}</Note>
      <P>{t.lookIkinci}</P>
      <P>{t.kanca}</P>

      <H2>{t.rules}</H2>
      <Note>{t.roles}</Note>
      <P>{t.when}</P>

      <H2>Props</H2>
      <Props of="RadioGroup" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
