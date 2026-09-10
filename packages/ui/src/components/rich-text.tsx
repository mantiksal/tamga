"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn.js";
import { Icon } from "./icon.js";
import { Bold, BulletList, Check, Close, Italic, Link, NumberedList } from "./icons.js";

/**
 * Biçimlendirilebilir metin.
 *
 * Gerekçe: docs/gerekce/01-form-ve-girdi.md
 */
export type RichTextFormat = "bold" | "italic" | "link" | "h3" | "h4" | "h5" | "ul" | "ol";

type Komut = { command: string; value?: string };

const KOMUTLAR: Record<RichTextFormat, Komut> = {
  bold: { command: "bold" },
  italic: { command: "italic" },
  link: { command: "createLink" },
  h3: { command: "formatBlock", value: "h3" },
  h4: { command: "formatBlock", value: "h4" },
  h5: { command: "formatBlock", value: "h5" },
  ul: { command: "insertUnorderedList" },
  ol: { command: "insertOrderedList" },
};

const SIMGELER: Partial<Record<RichTextFormat, typeof Bold>> = {
  bold: Bold,
  italic: Italic,
  link: Link,
  ul: BulletList,
  ol: NumberedList,
};

export function RichText({
  value,
  onChange,
  allow,
  labels,
  ariaLabel,
  rows = 10,
  disabled,
  className,
}: {
  /**
   * HTML. The kit does not sanitise it: which tags are valid is the product's rule. TR: HTML.
   * Kit onu temizlemez: hangi etiketin geçerli olduğu ürünün kuralı.
   */
  value: string;
  onChange: (next: string) => void;
  /**
   * The formats offered in the toolbar, in order. `bold` · `italic` · `link` · `h3` `h4` `h5`
   * heading levels · `ul` bullet list · `ol` numbered list. TR: Araç çubuğunda sunulacak
   * biçimler, sırasıyla. `bold` kalın · `italic` italik · `link` bağlantı · `h3` `h4` `h5`
   * başlık seviyeleri · `ul` madde listesi · `ol` numaralı liste.
   */
  allow: readonly RichTextFormat[];
  labels: {
    bold: string;
    italic: string;
    link: string;
    h3: string;
    h4: string;
    h5: string;
    ul: string;
    ol: string;
    /**
     * The label of the box that asks for the link address. TR: Bağlantı adresini soran kutunun
     * etiketi.
     */
    linkUrl: string;
    linkApply: string;
    linkCancel: string;
  };
  /**
   * The writing area's accessible name; needed even inside a `Field`. TR: Yazma alanının
   * erişilebilir adı; `Field` içinde bile gerekiyor.
   */
  ariaLabel: string;
  /**
   * The writing area's opening height, in rows. TR: Yazma alanının açılış yüksekliği, satır
   * olarak.
   */
  rows?: number;
  disabled?: boolean;
  className?: string;
}) {
  const alan = useRef<HTMLDivElement>(null);
  const [aktif, setAktif] = useState<Record<string, boolean>>({});
  const [baglantiAcik, setBaglantiAcik] = useState(false);
  const [adres, setAdres] = useState("");
  const secim = useRef<Range | null>(null);

  /*
   * BİÇİM ETİKETLE VERİLİYOR, STİLLE DEĞİL.
   *
   * `styleWithCSS` açıkken tarayıcı kalın için `<span style="font-weight:
   * bold">` yazıyor: hiçbir süzgeçten geçmeyen, hiçbir şey ifade etmeyen bir
   * çıktı. Kapalıyken etiket üretiyor, ve etiketin anlamı var.
   */
  useEffect(() => {
    try {
      document.execCommand("styleWithCSS", false, "false");
    } catch {
      /* Bazı tarayıcılar komutu tanımıyor; varsayılanları zaten etiket. */
    }
  }, []);

  /* `value` YALNIZ DIŞARIDAN DEĞİŞTİĞİNDE DOM'a yazılıyor. Karşılaştırma
     DOM'un kendi `innerHTML`i ile: eşitse dokunulmuyor, yoksa her tuş
     vuruşunda alan yeniden kurulur ve imleç başa atlar. */
  useEffect(() => {
    const el = alan.current;
    if (el && el.innerHTML !== value) el.innerHTML = value;
  }, [value]);

  /**
   * ÇIKTI: `<b>` YERİNE `<strong>`.
   *
   * Tarayıcının `bold` komutu `<b>` üretiyor, ve `<b>` modern HTML'de hiçbir
   * anlam taşımayan bir sunum etiketi; kalın düğmesinin söylediği şey ise
   * "bu önemli", yani `<strong>`. Fark akademik değil, ölçüldü: bir vitrinin
   * etiket beyaz listesinde `<strong>` vardı, `<b>` yoktu, ve kalın yazılan
   * her şey mağazada sessizce düz metne dönüyordu.
   *
   * `<i>` DOKUNULMADAN KALIYOR: onun aksine `<i>` hâlâ anlamı olan bir
   * etiket (başka bir ses tonu, teknik terim, yabancı sözcük) ve tarayıcının
   * doğal çıktısı.
   */
  function yayinla() {
    const el = alan.current;
    if (!el) return;
    onChange(el.innerHTML.replace(/<b>/g, "<strong>").replace(/<\/b>/g, "</strong>"));
  }

  /** Hangi biçimlerin şu an açık olduğunu tarayıcıdan sorar. */
  function durumTazele() {
    if (typeof document === "undefined") return;
    const d: Record<string, boolean> = {};
    for (const f of allow) {
      const k = KOMUTLAR[f];
      if (k.command === "formatBlock") {
        d[f] = document.queryCommandValue("formatBlock").toLowerCase() === k.value;
      } else if (k.command !== "createLink") {
        try {
          d[f] = document.queryCommandState(k.command);
        } catch {
          d[f] = false;
        }
      }
    }
    setAktif(d);
  }

  function uygula(f: RichTextFormat) {
    const k = KOMUTLAR[f];
    if (k.command === "createLink") {
      /* SEÇİM SAKLANIYOR. Adres kutusuna odak geçince `contenteditable`deki
         seçim kayboluyor ve bağlantı boşluğa uygulanıyor. */
      const s = window.getSelection();
      secim.current = s && s.rangeCount > 0 ? s.getRangeAt(0).cloneRange() : null;
      setBaglantiAcik(true);
      return;
    }
    alan.current?.focus();
    /* Başlık düğmesi AÇMA-KAPAMA: aynı seviyeye ikinci kez basmak paragrafa
       döndürüyor. Tek yönlü bir düğme, geri almanın yolunu göstermiyor. */
    const geriAl = k.command === "formatBlock" && aktif[f];
    document.execCommand(k.command, false, geriAl ? "p" : k.value);
    durumTazele();
    yayinla();
  }

  function baglantiUygula() {
    const el = alan.current;
    if (!el) return;
    el.focus();
    const s = window.getSelection();
    if (secim.current && s) {
      s.removeAllRanges();
      s.addRange(secim.current);
    }
    const temiz = adres.trim();
    if (temiz) document.execCommand("createLink", false, temiz);
    setBaglantiAcik(false);
    setAdres("");
    yayinla();
  }

  return (
    <div className={cn("tamga-editor", disabled && "tamga-editor-disabled", className)}>
      <div className="tamga-editor-bar" role="toolbar" aria-label={ariaLabel}>
        {allow.map((f) => {
          const simge = SIMGELER[f];
          return (
            <button
              key={f}
              type="button"
              disabled={disabled}
              title={labels[f]}
              aria-label={labels[f]}
              aria-pressed={KOMUTLAR[f].command === "createLink" ? undefined : (aktif[f] ?? false)}
              data-on={aktif[f] || undefined}
              /* `mousedown`ta engelleniyor: tıklama odağı alandan almazsa
                 seçim korunuyor ve komut seçili metne uygulanıyor. */
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => uygula(f)}
              className="tamga-editor-btn"
            >
              {simge ? <Icon icon={simge} size="sm" /> : <span className="font-semibold">{f.toUpperCase()}</span>}
            </button>
          );
        })}
      </div>

      {baglantiAcik && (
        <div className="tamga-editor-link">
          <input
            autoFocus
            value={adres}
            onChange={(e) => setAdres(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                baglantiUygula();
              }
              if (e.key === "Escape") setBaglantiAcik(false);
            }}
            placeholder={labels.linkUrl}
            aria-label={labels.linkUrl}
            className="tamga-input tamga-input-sm flex-1"
          />
          <button
            type="button"
            onClick={baglantiUygula}
            aria-label={labels.linkApply}
            className="tamga-editor-btn"
          >
            <Icon icon={Check} size="sm" />
          </button>
          <button
            type="button"
            onClick={() => setBaglantiAcik(false)}
            aria-label={labels.linkCancel}
            className="tamga-editor-btn"
          >
            <Icon icon={Close} size="sm" />
          </button>
        </div>
      )}

      <div
        ref={alan}
        contentEditable={!disabled}
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={ariaLabel}
        onInput={yayinla}
        onKeyUp={durumTazele}
        onMouseUp={durumTazele}
        onFocus={durumTazele}
        onPaste={(e) => {
          e.preventDefault();
          const metin = e.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, metin);
          yayinla();
        }}
        style={{ minHeight: `calc(${rows} * 1.65em)` }}
        className="tamga-editor-body tamga-prose"
      />
    </div>
  );
}
