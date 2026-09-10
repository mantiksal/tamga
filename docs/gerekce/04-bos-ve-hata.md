# Boş ve hata

Bir yüzeyin dört hâlinden üçü: yüklenirken, boşken, kırıldığında.

> Kod dosyalarında **başlık** duruyor; kanıt burada. Kural:
> [`CLAUDE.md` · Yorumlar](../../CLAUDE.md). Dizin: [gerekçeler](../08-bilesen-gerekceleri.md)


---

## `empty-state.tsx`

### BOŞ DURUM SİSTEMİ · dört slot, ve hiçbiri neyin eksik olduğunu bilmez.

Bu sistem bir maskotun etrafında doğdu ama maskot değil: bir boşluğun nasıl
doldurulacağını tarif ediyor. Dördü, boşluğun NEREDE olduğuna göre ayrılır:

  EmptyNote   içinde hiçbir şey olmayan SATIR   (tablo gövdesi, liste)
  EmptyState  içinde hiçbir şey olmayan YÜZEY   (banner · ticket · routes)
  EmptyTile   sunduğun bir SEÇİM                (şablon, başlangıç noktası)
  EmptyBlank  içinde hiçbir şey olmayan GÖVDE   (etrafında kutu yok)

Yeni bir çizim bir prop'a mal olur; yeni bir SLOT bir tasarım kararıdır ve
gerekçe ister. Bu çizgi, sistemin klip-art'a dönüşmesini engelleyen şey ·
PostHog'un kirpisi yüzlerce çizim olduğu için değil, tam üç işi olduğu için
çalışıyor.

ÇİZİM DIŞARIDAN GELİR. `art` bir render fonksiyonudur, ReactNode değil: slot
kendi boyutunu bilir ve çizim kendini o boyutta çizer. Böylece her ürün kendi
karakterini, fotoğrafını ya da hiçbir şeyini koyabilir · kit hangisi olduğunu
sormaz.

SAHNE HER ZAMAN KİTİN. Her slotun arkasında oturmuş bir kuyu var: `--muted`
zemin, kareli kâğıt (8px, layout'un kendi modülü). Kareler iş yapıyor · göze
ölçek verdiği için büyük bir çizim dekoratif leke gibi okunmuyor. Düz renkli
bir düzleme bırakılan sanat, başka birinin ürününe yapıştırılmış gibi durur.


---

## `error-state.tsx`

### The third state, and the one the kit was missing.

A surface has four: loading (skeleton), empty (nothing yet), error (we
tried and failed), and settled. Without this one, whoever builds a page
invents it · and everyone invents it differently.

Three parts, always: what failed, in plain words; the technical detail,
available but not shouted; and exactly one action, which is retry. It is
NOT an Alert · an alert reports something about the system while the page
still works. This replaces the content, because there is no content.

Colour: critical on the mark only, never a filled panel. A page that fails
to load is not more urgent than an event, and if it painted itself red
it would outrank every real signal on the screen.


---

## `skeleton.tsx`

### Skeletons.

The rule that matters: a skeleton holds the EXACT geometry of the thing it
replaces · same row height, same column widths, same gutter · so the moment
data lands nothing moves. A skeleton that guesses its own size is worse than
no skeleton at all, because it swaps a blank screen for a jumping one.

They breathe out of phase. A grid where every block pulses on the same beat
reads as one flashing object; staggering by 70ms per index makes the surface
read as filling in. The stagger is capped so a long list never ends up with a
visible travelling wave · that is a shimmer by another name.
