"use client";

/**
 * LenisProvider — viral motion foundation #1
 *
 * Lenis smooth scroll bağlanır. GSAP ScrollTrigger sync **lazy** —
 * sadece useScrollTrigger() çağrılınca yüklenir (Faz 2 signature
 * moment'ları için). Default'ta Lenis solo çalışır (~7KB), GSAP
 * eklenmez (~50KB tasarruf).
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";

interface LenisContextValue {
  lenis: Lenis | null;
  reduced: boolean;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null, reduced: false });

export function useLenisInstance(): LenisContextValue {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      return;
    }
    if (typeof requestAnimationFrame === "undefined") return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, reduced }}>
      {children}
    </LenisContext.Provider>
  );
}
