import type { Locale } from "@/i18n/config";
import { PageHead, H2, P, Note } from "@/components/prose";
import { Xref } from "@/components/xref";
import { findPage } from "@/content/nav";
import { BlokGalerisi } from "./ornekler";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: findPage("blocks")!.title[lang] };
}

const T = {
  tr: {
    lead: (
      <>
        Bir bileşenden büyük, bir <Xref to="templates">şablondan</Xref> küçük: birkaç bileşenin bir
        araya gelip <strong>tek bir iş</strong> yaptığı bölüm. Filtre çubuğu bir düğme değil ama
        bir ekran da değil; bir ekranın içindeki bir bölge. <code>tamga-ui/blocks</code>&apos;ten
        geliyorlar.
      </>
    ),
    girenH: "Buraya ne girer, ne girmez",
    girenP: (
      <>
        Girer: alanı bilmeyen her bölüm. Girmez: bir ürünün sözlüğünü taşıyan hiçbir şey. Bir
        sipariş kartı, bir iade satırı, bir mülk özeti bloğa değil ürünün kendi katmanına ait.
        <strong> Blok, alanı bilmeyen bölümdür.</strong>
      </>
    ),
    filtreH: "Filtre çubuğu",
    filtreP: (
      <>
        Bir yönetim panelinin filtresi otuz alanı aynı anda açık tutmaya meyleder, hepsi aynı
        görsel ağırlıkta. Buradaki fikir tek cümle: birkaçı üstte, gerisi çekmecede,{" "}
        <strong>ve çekmecede bir şey açıksa bunu görüyorsun</strong>. Gizli bir filtre açıkken
        kullanıcı listeyi eksik görür ve sebebini bulamaz; filtreyi gizlemenin tek gerçek riski
        budur, ve tek çaresi uygulanan her filtrenin bir çip olarak durması.
      </>
    ),
    filtreN: (
      <>
        Çekmecedeki alanlar bir <code>&lt;form&gt;</code> içinde ve &ldquo;Uygula&rdquo; onun
        <code> submit</code> düğmesi: Enter tarayıcının kendi davranışıyla çalışıyor, dinlenen bir
        tuş değil formun anlamı. Ve <code>searchKey</code> bir prop, çünkü sunucunun beklediği ad
        ürünün kararı. Blok bir süre <code>q</code>yu sabitledi ve ilk tüketicide sessizce kırdı:
        kutuya yazılan <code>q</code>ya gidiyor, ekran <code>ara</code>yı okuyordu. Hata vermeyen
        bir kırılma en pahalısı.
      </>
    ),
    seritH: "Bir blok mu, bir bileşen mi",
    seritP: (
      <>
        Sınır ince, ve testi tek soru: <strong>tek bir nesne mi, yoksa birkaç nesnenin bir araya
        gelip tek bir iş yaptığı bir bölge mi?</strong> Bir düğme bileşen. Bir tablo bileşen. Bir
        arama kutusu artı dört alan artı bir çekmece artı çipler, hep birlikte &ldquo;bu listeyi
        daralt&rdquo; işini yapıyorsa, o bir blok. Bir ekranın tamamıysa{" "}
        <Xref to="templates">şablon</Xref>.
      </>
    ),
    kaydetH: "Kaydet şeridi",
    kaydetP: (
      <>
        Kaydet düğmesi <strong>formun sonunda değil</strong>: yirmi alanlık bir formda üstteki bir
        alanı düzeltip kaydetmek için sonuna kadar kaydırmak gerekiyor. Fiziğinde ölçülmüş bir
        tuzak var: <code>sticky bottom-0</code> şeridin alt kenarını yüzeyin İÇERİK kutusuna
        hizalıyor, ama yüzeyin kendi alt dolgusu var ve içerik o boşluktan akıp geçiyordu.
      </>
    ),
    kararN: (
      <>
ADR-0003&apos;ün katman şeması <code>tamga-ui</code> kutusunun içine
        &ldquo;filtre paneli · toplu eylem çubuğu&rdquo; yazıyor. Filtre çubuğu buraya o kararla
        girdi. Toplu eylem çubuğu ise <strong>zaten vardı</strong>:{" "}
        <Xref to="selection-bar">SelectionBar</Xref>, bir bileşen olarak. Buraya ikinci bir kopya
        yazıldı ve silindi; yeni bir blok yazmadan önce kitte o işi yapan bir bileşen var mı diye
        bakmak, bu sayfanın ilk kuralı.
      </>
    ),
  },
  en: {
    lead: (
      <>
        Larger than a component, smaller than a <Xref to="templates">template</Xref>: a region
        where a few components come together to do <strong>one job</strong>. A filter bar is not a
        button, but it is not a screen either. They come from <code>tamga-ui/blocks</code>.
      </>
    ),
    girenH: "What belongs here, and what does not",
    girenP: (
      <>
        In: any region that does not know the domain. Out: anything carrying a product&apos;s
        vocabulary. An order card, a return row, a property summary belong to the product&apos;s
        own layer. <strong>A block is a region that does not know the domain.</strong>
      </>
    ),
    filtreH: "Filter bar",
    filtreP: (
      <>
        An admin panel&apos;s filter tends to keep thirty fields open at once, all at the same
        visual weight. The idea here is one sentence: a few on top, the rest in a drawer,{" "}
        <strong>and if something in the drawer is set, you can see it</strong>. With a hidden
        filter active the user sees an incomplete list and cannot find out why; that is the only
        real risk of hiding filters, and its one remedy is that every applied filter stands as a
        chip.
      </>
    ),
    filtreN: (
      <>
        The drawer&apos;s fields sit in a <code>&lt;form&gt;</code> and &ldquo;Apply&rdquo; is its{" "}
        <code>submit</code> button: Enter works through the browser&apos;s own behaviour rather
        than a listened key. And <code>searchKey</code> is a prop, because the name the server
        expects is the product&apos;s decision. The block hardcoded <code>q</code> for a while and
        broke its first consumer silently: the box wrote <code>q</code>, the screen read{" "}
        <code>ara</code>. A break that raises no error is the expensive kind.
      </>
    ),
    seritH: "A block or a component",
    seritP: (
      <>
        The line is thin, and the test is one question: <strong>is it a single object, or a region
        where several objects together do one job?</strong> A button is a component. A table is a
        component. A search box plus four fields plus a drawer plus chips, together doing
        &ldquo;narrow this list&rdquo;, is a block. A whole screen is a{" "}
        <Xref to="templates">template</Xref>.
      </>
    ),
    kaydetH: "Save bar",
    kaydetP: (
      <>
        The save button is <strong>not at the end of the form</strong>: on a twenty field form,
        fixing one field near the top means scrolling all the way down. Its physics carries a
        measured trap: <code>sticky bottom-0</code> aligns the bar with the surface&apos;s CONTENT
        box, but a surface has its own bottom padding, and content was flowing through that gap.
      </>
    ),
    kararN: (
      <>
ADR-0003&apos;s layer diagram writes &ldquo;filter panel · bulk action
        bar&rdquo; inside the <code>tamga-ui</code> box. The filter bar entered on that decision.
        The bulk action bar, however, <strong>already existed</strong>:{" "}
        <Xref to="selection-bar">SelectionBar</Xref>, as a component. A second copy was written
        here and deleted; checking whether the kit already has a component for the job, before
        writing a block, is this page&apos;s first rule.
      </>
    ),
  },
};

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const p = findPage("blocks")!;
  const t = T[lang];

  return (
    <>
      <PageHead title={p.title[lang]} blurb={p.blurb[lang]} />
      <P>{t.lead}</P>

      <BlokGalerisi lang={lang} />

      <H2>{t.girenH}</H2>
      <P>{t.girenP}</P>

      <H2>{t.filtreH}</H2>
      <P>{t.filtreP}</P>
      <Note>{t.filtreN}</Note>

      <H2>{t.seritH}</H2>
      <P>{t.seritP}</P>

      <H2>{t.kaydetH}</H2>
      <P>{t.kaydetP}</P>

      <Note>{t.kararN}</Note>
    </>
  );
}
