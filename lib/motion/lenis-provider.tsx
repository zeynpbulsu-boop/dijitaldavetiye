"use client";

/**
 * LenisProvider — viral motion foundation #1
 *
 * Lenis smooth scroll bağlanır, GSAP ScrollTrigger ile sync edilir.
 * Root layout'ta tüm uygulamayı sarar. prefers-reduced-motion → no-op.
 *
 * Awwwards 2026 SOTD pattern: Lenis + GSAP + scroll-driven motion
 * cinematik ağırlık hissi vermek için.
 */

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

    // Avoid initializing on browsers that lack rAF / matchMedia (safety net)
    if (typeof requestAnimationFrame === "undefined") return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    gsap.registerPlugin(ScrollTrigger);

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger once after fonts/images settle
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      window.clearTimeout(refreshTimer);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
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
