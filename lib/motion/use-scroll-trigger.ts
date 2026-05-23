"use client";

/**
 * useScrollTrigger — GSAP ScrollTrigger helper hook
 *
 * Mounted bir element için scroll-pinned timeline kurar.
 * prefers-reduced-motion → no-op.
 *
 * Örnek:
 *   const ref = useRef<HTMLDivElement>(null);
 *   useScrollTrigger(ref, (tl, st) => {
 *     tl.to(ref.current, { scale: 1.2 });
 *     // st.pin = true (default), st.scrub = true (default)
 *   });
 */

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollTriggerOptions {
  /** Pin element while it's in view (default: true). */
  pin?: boolean;
  /** Smooth scrub seconds (default: 0.5). false → no scrub. */
  scrub?: boolean | number;
  /** Start trigger position (default: "top top"). */
  start?: string;
  /** End trigger position (default: "+=100%" = pin for 1× viewport). */
  end?: string;
  /** Markers for debugging (dev only). */
  markers?: boolean;
}

export function useScrollTrigger(
  ref: RefObject<HTMLElement>,
  setup: (tl: gsap.core.Timeline, options: ScrollTrigger.Vars) => void,
  options: ScrollTriggerOptions = {}
) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const stVars: ScrollTrigger.Vars = {
      trigger: ref.current,
      start: options.start ?? "top top",
      end: options.end ?? "+=100%",
      pin: options.pin ?? true,
      scrub: options.scrub ?? 0.5,
      markers: options.markers ?? false,
    };

    const tl = gsap.timeline({ scrollTrigger: stVars });
    tlRef.current = tl;
    setup(tl, stVars);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      tlRef.current = null;
    };
    // Intentionally not depending on `setup` — caller controls re-init via ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, options.pin, options.scrub, options.start, options.end, options.markers]);

  return tlRef;
}
