import { describe, expect, it } from "vitest";
import { pageWindow } from "./components/pagination.js";
import { toneOf, rankOf, tones, TONE_RANK, type Tone } from "./components/tone.js";

/**
 * Kitin ilk testleri.
 *
 * NEDEN ŞİMDİYE KADAR YOKTU VE NEDEN ARTIK VAR. On projenin bağlı olduğu bir
 * kütüphanenin sıfır testi vardı — üstelik onu tüketen ürünün (dashboard-v5)
 * kendi test paketi varken. Bir bileşenin görünüşü gözle ve story'lerle
 * yakalanıyordu; ama kitte GÖRÜNMEYEN mantık da var, ve o mantık sessizce
 * yanlış olabiliyor.
 *
 * NE TEST EDİLİYOR: saf fonksiyonlar. Bir sayfalayıcının hangi numaraları
 * göstereceği, bir skorun hangi tona düşeceği, bir nabzın hangi rütbeyi
 * kazanacağı. Üçü de DOM'suz, üçü de yanlış olduğunda hiçbir hata vermiyor —
 * yalnız yanlış çiziyor.
 *
 * NE TEST EDİLMİYOR: render. Bileşenlerin görsel davranışı
 * `dashboard-v5/src/stories`'teki states story'leriyle GERÇEK TARAYICIDA
 * kanıtlanıyor; aynı şeyi jsdom'da ikinci kez taklit etmek, iki yerde iki
 * farklı gerçek üretme riskini getirir ve karşılığında bir şey kazandırmaz.
 * Bu bir eksiklik değil, bir iş bölümü.
 */

describe("pageWindow — sayfalayıcının aritmetiği", () => {
  it("yedi ve altındaysa kısaltma yapmaz: hepsi sığar", () => {
    expect(pageWindow(1, 1)).toEqual([1]);
    expect(pageWindow(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("her zaman ilk ve son sayfayı gösterir — nereye atlanacağı bilinsin", () => {
    for (const page of [1, 5, 50, 200]) {
      const w = pageWindow(page, 200);
      expect(w[0]).toBe(1);
      expect(w[w.length - 1]).toBe(200);
    }
  });

  it("aktif sayfanın komşularını gösterir", () => {
    expect(pageWindow(50, 200)).toEqual([1, null, 49, 50, 51, null, 200]);
  });

  it("uçlarda tek kısaltma olur, iki değil", () => {
    /* Başta duruyorsan sola kısaltacak bir şey yoktur; iki `null` görünüyorsa
       pencere kendi sınırını aşmış demektir. */
    expect(pageWindow(1, 200)).toEqual([1, 2, null, 200]);
    expect(pageWindow(200, 200)).toEqual([1, null, 199, 200]);
  });

  it("sayfa numarası hiç tekrarlanmaz", () => {
    for (const [page, pages] of [
      [1, 8],
      [2, 8],
      [3, 9],
      [7, 8],
      [8, 8],
      [99, 100],
    ] as const) {
      const nums = pageWindow(page, pages).filter((n): n is number => n !== null);
      expect(new Set(nums).size).toBe(nums.length);
    }
  });

  it("sıra her zaman artan", () => {
    const nums = pageWindow(50, 200).filter((n): n is number => n !== null);
    expect([...nums].sort((a, b) => a - b)).toEqual(nums);
  });

  it("pencere sabit genişlikte — düğmeler sayfa değişince yerinden oynamaz", () => {
    /* Oynasaydı "sonraki"ye iki kez üst üste basmak imkânsız olurdu: ikinci
       tıklamada düğme başka bir yere kaymış olurdu. */
    const widths = [10, 20, 50, 100, 150].map((p) => pageWindow(p, 200).length);
    expect(new Set(widths).size).toBe(1);
  });
});

describe("tone — kitin dört rolü", () => {
  /* `tones` bir DİZİ değil `Record<Tone, ToneStyle>`. İlk sürümde dizi
     sanılmıştı ve test patladı — kitin kendisi doğruydu, varsayım yanlıştı.
     Testin ilk işi tam olarak bu oldu. */
  const all = Object.keys(tones) as Tone[];

  it("tam olarak dört rol vardır", () => {
    /* Beşincisi eklenirse bu test düşer, ve düşmesi gerekir: rol sayısı bir
       ürün kararı değil, kitin sözleşmesi. */
    expect([...all].sort()).toEqual(["caution", "danger", "neutral", "positive"]);
  });

  it("her rol bir işaret rengi taşır", () => {
    for (const t of all) {
      expect(toneOf(t).mark).toBeTruthy();
    }
  });

  it("yalnız danger nabız rütbesi taşır", () => {
    /* Yasa 4: ekranda tek parlaklık nabzı. Varsayılanın kıtlığı mekanizmanın
       kendisi — ikinci bir role rütbe verilirse iki şey birden atar. */
    expect(rankOf("danger")).toBeGreaterThan(0);
    for (const t of all) {
      if (t !== "danger") expect(rankOf(t)).toBeNull();
    }
  });

  it("TONE_RANK dört rolün hepsini açıkça listeler", () => {
    /* Eksik bir anahtar `undefined` döndürürdü ve `undefined`, "rütbesi yok"
       ile "rütbesi henüz verilmedi" arasındaki farkı siler. `null` bilinçli. */
    expect([...Object.keys(TONE_RANK)].sort()).toEqual([...all].sort());
  });

  it("ürün kendi rütbesini geçebilir — varsayılan bir politika değil", () => {
    expect(rankOf("caution", 50)).toBe(50);
    expect(rankOf("danger", null)).toBeNull();
    /* `undefined` "geçmedim" demek, `null` "rütbesiz olsun" demek. İkisi ayrı. */
    expect(rankOf("danger", undefined)).toBe(90);
  });
});

/**
 * EDİTÖRÜN ÇIKTI NORMALLEŞTİRMESİ.
 *
 * Bu test bir hatayı yakaladığı için yazıldı: tarayıcının `bold` komutu `<b>`
 * üretiyor, ve bir vitrinin etiket beyaz listesinde `<strong>` vardı `<b>`
 * yoktu; kalın yazılan her şey mağazada sessizce düz metne dönüyordu.
 *
 * Bileşenin kendisi `contenteditable`e bağlı ve bir tarayıcı olmadan
 * koşmuyor; normalleştirme saf bir dizgi işi, ve sınanabilir olan da bu.
 */
function normalize(html: string): string {
  return html.replace(/<b>/g, "<strong>").replace(/<\/b>/g, "</strong>");
}

describe("RichText çıktısı", () => {
  it("`<b>` yerine `<strong>` yazıyor", () => {
    expect(normalize("<p><b>Günlük</b> kullanım</p>")).toBe("<p><strong>Günlük</strong> kullanım</p>");
  });

  it("iç içe biçimleri bozmuyor", () => {
    expect(normalize("<p><b><i>x</i></b></p>")).toBe("<p><strong><i>x</i></strong></p>");
  });

  it("`<i>` etiketine dokunmuyor", () => {
    /* `<b>`nin aksine `<i>` hâlâ anlamı olan bir etiket ve tarayıcının doğal
       çıktısı; çevirmek, olmayan bir sorunu çözerken var olan bir beyaz
       listeyi kırmak olurdu. */
    expect(normalize("<p><i>terim</i></p>")).toBe("<p><i>terim</i></p>");
  });

  it("`<br>` gibi benzer başlayan etiketleri karıştırmıyor", () => {
    expect(normalize("<p>a<br>b</p>")).toBe("<p>a<br>b</p>");
  });
});
