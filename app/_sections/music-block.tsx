"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useT } from "@/lib/i18n/provider";

export function MusicBlock() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const [pinned, setPinned] = useState(false);

  return (
    <section ref={ref} className="relative border-b border-line bg-bg py-24 lg:py-36">
      <div className="container-wide">
        <div className="grid grid-cols-12 items-center gap-x-6 gap-y-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 flex justify-center lg:col-span-6 lg:justify-start"
          >
            <button
              type="button"
              onClick={() => setPinned((p) => !p)}
              aria-pressed={pinned}
              aria-label={t.music.cta}
              className="group relative aspect-square w-full max-w-[440px]"
            >
              <div aria-hidden className="absolute inset-[-30px] rounded-full bg-brand-cognac/8 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />

              <div className={`vinyl relative h-full w-full rounded-full transition-[animation-duration] duration-1000 ${pinned ? "is-pinned" : ""}`}>
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} aria-hidden className="absolute rounded-full border border-brand-cream/8" style={{ inset: `${4 + i * 3}%` }} />
                ))}

                <div className="absolute inset-[34%] flex items-center justify-center rounded-full bg-brand-cognac shadow-[inset_0_0_0_1px_rgba(43,30,22,0.4)]">
                  <div className="text-center">
                    <p className="font-display italic text-brand-cream" style={{ fontSize: "26px", lineHeight: 1 }}>
                      {t.music.record_label_top}
                    </p>
                    <p className="mt-1 text-[8.5px] font-medium uppercase tracking-[0.28em] text-brand-cream/75">
                      {t.music.record_label_bottom}
                    </p>
                  </div>
                </div>

                <span aria-hidden className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-ink" />
                <div aria-hidden className="pointer-events-none absolute -right-4 top-4 h-[55%] w-2 origin-top rotate-[28deg] rounded-full bg-gradient-to-b from-brand-mute to-brand-ink/70 transition-transform duration-700 group-hover:rotate-[14deg]" />
              </div>

              <span className="absolute -bottom-9 left-0 right-0 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-brand-mute">
                {pinned ? t.music.label_playing : t.music.label_idle}
              </span>

              <style jsx>{`
                .vinyl {
                  background: radial-gradient(circle at center, #2b1e16 35%, #1a120c 35.3%, #1a120c 100%);
                  animation: spin 12s linear infinite;
                  box-shadow:
                    0 30px 60px -20px rgba(43, 30, 22, 0.5),
                    0 8px 20px -6px rgba(43, 30, 22, 0.25),
                    inset 0 0 0 1px rgba(242, 238, 230, 0.05);
                }
                .vinyl.is-pinned, .group:hover .vinyl { animation-duration: 4s; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @media (prefers-reduced-motion: reduce) { .vinyl { animation: none; } }
              `}</style>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 lg:col-span-6"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — {t.music.eyebrow}
            </span>
            <h2
              className="mt-4 font-display text-brand-ink"
              style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.02, letterSpacing: "-0.025em" }}
            >
              {t.music.headline_prefix}
              <span className="italic text-brand-cognac">{t.music.headline_accent}</span>
              .
            </h2>

            <div className="mt-7 space-y-5 text-brand-ink/75" style={{ fontSize: "17px", lineHeight: 1.7 }}>
              {t.music.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <button
              type="button"
              onClick={() => setPinned((p) => !p)}
              className="mt-8 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em] text-brand-cognac transition hover:text-brand-ink"
            >
              <span aria-hidden>↳</span>
              {t.music.cta}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
