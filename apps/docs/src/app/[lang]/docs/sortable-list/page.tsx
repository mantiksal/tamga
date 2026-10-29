import { SortableListDemo } from "@/components/interactive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Demo } from "@/components/demo";
import { Xref } from "@/components/xref";
import { Props } from "@/components/props";
import { sayfaMeta } from "@/content/meta";
import { findPage } from "@/content/nav";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return sayfaMeta("sortable-list", lang);
}

/** Sayfa metni, iki dilli. Gerekçe `docs/07-dokuman-sitesi.md`de. */
const T = {
  tr: {
    lead: (
      <>
        Bir sıranın kendisi bir karar olduğunda: bir durum sayfasında hangi hizmetin önce
        göründüğü, bir menünün öğeleri, bir kontrol listesinin adımları. Satırı tutamağından tutup
        sürükleyin; sıra siz sürükledikçe değişiyor, bırakınca <code>onReorder</code> yeni sırayı
        bir kez veriyor.
      </>
    ),
    klavyeH: "Sürüklemek tek yol değil",
    klavyeP: (
      <>
        Fareyle sürüklemek klavye kullanan, ekran okuyucu kullanan ya da titreyen bir elle dokunan
        biri için yok. Tutamak bu yüzden bir düğme: <strong>Boşluk tutar, oklar taşır, Boşluk
        bırakır, Esc vazgeçer</strong>. Her adım sesli söyleniyor (<code>labels.picked</code>,{" "}
        <code>moved</code>, <code>dropped</code>, <code>cancelled</code>), çünkü taşınan şeyin
        nerede olduğu ekranda bir yer, ekran okuyucuda bir sayı: &ldquo;4 öğeden 2. sırada&rdquo;.
        Nasıl kullanılacağı <code>labels.instructions</code> ile tutamağa bağlı, bir kez okunuyor.
        Odak tutamaktan kaçarsa taşıma bırakılmış sayılıyor.
      </>
    ),
    tasarH: "Sıra taşınırken yerelde",
    tasarP: (
      <>
        <code>onReorder</code> her adımda değil bırakınca ateşleniyor: bir sunucuya kaydeden ürün
        her ok tuşunda yazmamalı. Sıra değişmediyse hiç ateşlenmiyor. Tutulan satır yükseliyor,
        kitin fiziğiyle: elde olan şey öne çıkıyor ve kayarken de nerede olduğu okunuyor.
        Sürükleme işaretçi olaylarıyla, HTML5 sürükle-bırakıyla değil: o dokunmatikte çalışmıyor.
      </>
    ),
    rules: "Kurallar",
    grup: (
      <>
        <strong>Gruplar arası taşıma burada yok.</strong> Bir öğenin hangi gruba gideceği ürünün
        sözlüğü; iki liste yan yana konup bir <Xref to="dropdown-menu">DropdownMenu</Xref>{" "}
        &ldquo;Gruba taşı&rdquo; seçeneğiyle bağlanabilir. Satırın kendisi de çağıranın:{" "}
        <code>renderItem</code> satırı çiziyor, <code>handle</code>&apos;ı satırın başına koyun.
        Yalnız bakabilen biri için <code>disabled</code> verin: satırlar kalıyor, tutamaklar
        gidiyor.
      </>
    ),
    related: "İlgili",
    rel: (
      <>
        Satırın kendisi için <Xref to="list-row">ListRow</Xref> ya da{" "}
        <Xref to="card">Card</Xref>; satır menüsü için <Xref to="dropdown-menu">DropdownMenu</Xref>.
      </>
    ),
  },
  en: {
    lead: (
      <>
        When an order is itself a decision: which service shows first on a status page, the items
        of a menu, the steps of a checklist. Take a row by its grip and drag it; the order changes
        as you drag, and on drop <code>onReorder</code> hands over the new order once.
      </>
    ),
    klavyeH: "Dragging is not the only way",
    klavyeP: (
      <>
        Dragging with a mouse does not exist for someone on a keyboard, on a screen reader, or
        touching with an unsteady hand. So the grip is a button: <strong>Space picks up, the
        arrows move, Space drops, Esc cancels</strong>. Every step is spoken (
        <code>labels.picked</code>, <code>moved</code>, <code>dropped</code>,{" "}
        <code>cancelled</code>), because where the moving thing is, is a place on screen and a
        number on a screen reader: &ldquo;position 2 of 4&rdquo;. How to use it is bound to the
        grip through <code>labels.instructions</code> and read once. If focus leaves the grip, the
        move counts as dropped.
      </>
    ),
    tasarH: "The order stays local while it moves",
    tasarP: (
      <>
        <code>onReorder</code> fires on drop, not on every step: a product that saves to a server
        should not write on every arrow key. If the order did not change, it does not fire at all.
        The row being held rises, with the kit&apos;s physics: the thing in hand comes forward and
        stays readable while it slides. Dragging uses pointer events, not HTML5 drag and drop: that
        one does not work on touch.
      </>
    ),
    rules: "Rules",
    grup: (
      <>
        <strong>Moving between groups is not here.</strong> Which group an item goes to is the
        product&apos;s vocabulary; put two lists side by side and connect them with a{" "}
        <Xref to="dropdown-menu">DropdownMenu</Xref> &ldquo;Move to group&rdquo; option. The row
        itself is the caller&apos;s too: <code>renderItem</code> draws it, put the{" "}
        <code>handle</code> where the row starts. For someone who may only look, pass{" "}
        <code>disabled</code>: the rows stay, the grips go.
      </>
    ),
    related: "Related",
    rel: (
      <>
        For the row itself, <Xref to="list-row">ListRow</Xref> or <Xref to="card">Card</Xref>; for
        a row menu, <Xref to="dropdown-menu">DropdownMenu</Xref>.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const p = findPage("sortable-list")!;
  const t = T[lang];
  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>
      <Demo labels={dict.demo} align="start" code={`<SortableList
  items={services}
  itemLabel={(s) => s.name}
  onReorder={(keys) => save(keys)}
  renderItem={(s, { handle }) => (
    <ListRow>{handle} {s.name}</ListRow>
  )}
  labels={{ handle, instructions, picked, moved, dropped, cancelled }}
/>`}>
        <SortableListDemo lang={lang} />
      </Demo>

      <H2>{t.klavyeH}</H2>
      <P>{t.klavyeP}</P>

      <H2>{t.tasarH}</H2>
      <P>{t.tasarP}</P>

      <H2>{t.rules}</H2>
      <Note>{t.grup}</Note>

      <H2>Props</H2>
      <Props of="SortableList" lang={lang} />

      <H2>{t.related}</H2>
      <P>{t.rel}</P>
    </>
  );
}
