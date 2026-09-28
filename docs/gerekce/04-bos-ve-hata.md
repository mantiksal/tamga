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


### The speech bubble, and why it is in the system.

It is the one part of the mascot that IS in the system: 1px edge plus a 2px hard
offset, exactly like every other raised object. That pairing is the whole trick,
because it lets pixel art sit inside a strict interface without either one
looking lost.

The line is real text, not decoration, so it is readable. Keep it to one short
sentence: the bubble is a voice, not a paragraph.

### `EmptyState` · three layouts, one set of content.

They are NOT three styles of the same picture. Each answers a different question
about the screen underneath:

  banner  wide and horizontal: art left, words centre, action at the far right
          edge, numbered base plate underneath. Reads as a strip across the top
          of a working screen.
  ticket  a narrow tag pinned to a big surface, with a perforation and one
          full-width action. For a single unambiguous next step.
  routes  the words and the figure on the left, a list of ways in on the right.
          Two buttons ask a yes/no question; a list answers "what can I even do
          here", which is what somebody arriving actually wants to know.

Each one also wants a different drawing. The layout decides the shape; the
drawing decides what the emptiness FEELS like, and those are two choices, not
one.

### `EmptyBlank` · no box drawn around the nothing.

This is the one that goes straight onto the page, not inside a card. A bordered
panel needs content to bound; when the entire screen is empty there is nothing to
bound, and the border becomes a frame around a void. So there is no border, no
ground, no offset. The only structure is a hard floor rule as wide as the figure:
enough to say he is standing somewhere, not enough to be a box.

Reach for it when somebody lands on a section they have never used. For an empty
area INSIDE a working screen, use `EmptyState` instead: that one has a card
around it because the rest of the screen does too.

### `EmptyTile` · a real button, and a spine instead of a banner.

It obeys raised physics: 1px edge, 2px offset, lifts under the cursor, presses
flat when clicked. A template you cannot pick has no business looking like a
card.

The category colour is a 3px SPINE under the art rather than a coloured banner
behind it. A wall of coloured banners would out-shout a real event (Yasa 3); a
rule carries the same grouping and outranks nothing.

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
