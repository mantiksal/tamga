"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

/**
 * The arbiter behind Law 3.
 *
 * Gerekçe: docs/gerekce/06-isaret-ve-ton.md
 */

type Arbiter = {
  claim: (id: string, severity: number) => void;
  release: (id: string) => void;
  winner: string | null;
};

const LiveContext = createContext<Arbiter | null>(null);

export function LiveScope({ children }: { children: React.ReactNode }) {
  const [claims, setClaims] = useState<Record<string, number>>({});

  const claim = useCallback((id: string, severity: number) => {
    setClaims((prev) => (prev[id] === severity ? prev : { ...prev, [id]: severity }));
  }, []);

  const release = useCallback((id: string) => {
    setClaims((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const winner = useMemo(() => {
    let best: string | null = null;
    let bestSeverity = -Infinity;
    /* Object key order is insertion order, and claims are registered in effect
       order — which is tree order. So a strict `>` keeps the FIRST of equals,
       and "first" means highest on the page. That is question 2's answer
       (SETTLED 2026-08-19, Ercüment: first of equals wins), and it lives here
       rather than in a doc nobody reads. The reasoning: the presence of the
       signal matters more than which row carries it, and every alternative
       (timestamp, domain priority) buys a nicer tie-break by making call sites
       thread data they do not otherwise need. */
    for (const [id, severity] of Object.entries(claims)) {
      if (severity > bestSeverity) {
        best = id;
        bestSeverity = severity;
      }
    }
    return best;
  }, [claims]);

  const value = useMemo(() => ({ claim, release, winner }), [claim, release, winner]);

  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
}

/**
 * Ask to pulse. Returns whether this element won.
 *
 * `severity === null` means the state does not qualify at all (healthy, silenced)
 * and never enters the contest.
 *
 * With no LiveScope above it, the answer is yes: a lone beacon in a Storybook
 * story has nothing to compete with, and a hook that returned false without a
 * provider would make every story look broken.
 */
export function useLiveClaim(severity: number | null): boolean {
  const arbiter = useContext(LiveContext);
  const id = useId();

  useEffect(() => {
    if (!arbiter || severity === null) return;
    arbiter.claim(id, severity);
    return () => arbiter.release(id);
    /* claim/release are stable; winner deliberately is not a dependency, or
       every re-election would re-register and start another one */
  }, [arbiter, id, severity]);

  if (severity === null) return false;
  if (!arbiter) return true;
  return arbiter.winner === id;
}
