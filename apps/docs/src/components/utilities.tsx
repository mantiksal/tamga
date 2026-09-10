"use client";

import { useMemo, useState } from "react";
import { Icon, Input, Label, Table } from "tamga-ui";
import { Search } from "tamga-ui/icons";
import ham from "@/content/tokens.json";

/**
 * Hangi token hangi Tailwind utility'sini üretiyor.
 *
 * ÜRETİLEN veriden: `extract-tokens.mjs` her token için iki şeye bakıyor,
 * hangi blokta olduğuna ve ön ekine. Elle yazılan bir liste ilk token
 * taşındığında yalan söylemeye başlardı, ve bu sayfanın tek işi doğru olmak.
 *
 * ÜRETMEYENLER DE LİSTELENİYOR, ve asıl değerli kısım o: bir geliştirici
 * `rounded-card` yazıp neden çalışmadığını aramak yerine burada karşılığını
 * görüyor.
 */

type Token = {
  ad: string;
  grup: string;
  tur: string;
  acik: string;
  utilityleri: string[];
};

const TOKENLAR = ham as Token[];

/** Utility üretmeyen bir token'ın yerine ne yazılacağı. */
function kacisYolu(ad: string): string {
  if (ad.startsWith("--radius")) return `rounded-(${ad})`;
  if (ad.startsWith("--shadow-")) return `shadow-[var(${ad})]`;
  if (ad.startsWith("--duration-")) return `duration-[var(${ad})]`;
  if (ad.startsWith("--measure")) return `max-w-[var(${ad})]`;
  return `[var(${ad})]`;
}

type Metinler = {
  ara: string;
  token: string;
  utility: string;
  yerine: string;
  varH: string;
  yokH: string;
  bos: string;
  sayac: (a: number, b: number) => string;
};

const L: Record<"tr" | "en", Metinler> = {
  tr: {
    ara: "Token ya da utility ara",
    token: "token",
    utility: "utility",
    yerine: "yerine",
    varH: "Utility üreten token'lar",
    yokH: "Üretmeyenler, ve yerine ne yazılacağı",
    bos: "Bu aramayla eşleşen yok.",
    sayac: (a, b) => `${a} token, ${b} utility`,
  },
  en: {
    ara: "Search a token or utility",
    token: "token",
    utility: "utility",
    yerine: "instead",
    varH: "Tokens that produce utilities",
    yokH: "The ones that do not, and what to write instead",
    bos: "Nothing matches that search.",
    sayac: (a, b) => `${a} tokens, ${b} utilities`,
  },
};

export function Utilityler({ lang }: { lang: "tr" | "en" }) {
  const s = L[lang];
  const [ara, setAra] = useState("");

  const { var_, yok, sayac } = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("tr");
    const eslesir = (t: Token) =>
      !q || `${t.ad} ${t.utilityleri.join(" ")}`.toLocaleLowerCase("tr").includes(q);
    const hepsi = TOKENLAR.filter(eslesir);
    const v = hepsi.filter((t) => t.utilityleri.length > 0);
    return {
      var_: v,
      yok: hepsi.filter((t) => t.utilityleri.length === 0),
      sayac: v.reduce((n, t) => n + t.utilityleri.length, 0),
    };
  }, [ara]);

  return (
    <div className="my-6 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="relative flex items-center">
          <Icon
            icon={Search}
            size="xs"
            aria-hidden
            className="pointer-events-none absolute left-2.5 text-ink-faint"
          />
          <Input
            type="search"
            leading
            value={ara}
            onChange={(e) => setAra(e.target.value)}
            placeholder={s.ara}
          />
        </span>
        <Label>{s.sayac(var_.length, sayac)}</Label>
      </div>

      {var_.length === 0 && yok.length === 0 && <p className="text-ink-soft">{s.bos}</p>}

      {var_.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-subhead font-semibold text-ink">{s.varH}</h3>
          <div className="tamga-scroll-x">
            <Table>
              <thead>
                <tr>
                  <th scope="col" className="w-64">
                    {s.token}
                  </th>
                  <th scope="col">{s.utility}</th>
                </tr>
              </thead>
              <tbody>
                {var_.map((t) => (
                  <tr key={t.ad}>
                    <td className="font-mono text-small text-ink">{t.ad}</td>
                    <td>
                      {/* Hepsi değil ilk beşi: bir renk yedi utility üretiyor
                          ve on dört tanesini yan yana basmak, satırı okunmaz
                          yapıp hiçbir şey öğretmiyor. */}
                      <span className="flex flex-wrap gap-1.5">
                        {t.utilityleri.slice(0, 5).map((u) => (
                          <code
                            key={u}
                            className="rounded-(--radius-mark) border border-[var(--color-line)] bg-[var(--color-sunk)] px-1.5 text-small text-ink-soft"
                          >
                            {u}
                          </code>
                        ))}
                        {t.utilityleri.length > 5 && (
                          <span className="text-small text-ink-faint">
                            +{t.utilityleri.length - 5}
                          </span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>
      )}

      {yok.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-subhead font-semibold text-ink">{s.yokH}</h3>
          <div className="tamga-scroll-x">
            <Table>
              <thead>
                <tr>
                  <th scope="col" className="w-64">
                    {s.token}
                  </th>
                  <th scope="col">{s.yerine}</th>
                </tr>
              </thead>
              <tbody>
                {yok.map((t) => (
                  <tr key={t.ad}>
                    <td className="font-mono text-small text-ink">{t.ad}</td>
                    <td>
                      <code className="rounded-(--radius-mark) border border-[var(--color-line)] bg-[var(--color-sunk)] px-1.5 text-small text-ink-soft">
                        {kacisYolu(t.ad)}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>
      )}
    </div>
  );
}
