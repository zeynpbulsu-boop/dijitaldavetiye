"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useT } from "@/lib/i18n/provider";

export function Testimonials() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section id="testimonials" ref={ref} className="border-b border-line bg-paper py-24 lg:py-36">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 grid grid-cols-12 items-end gap-x-6 gap-y-6 border-b border-line pb-8 lg:mb-20"
        >
          <div className="col-span-12 lg:col-span-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — {t.testimonials.eyebrow}
            </span>
            <h2
              className="mt-4 font-display text-brand-ink"
              style={{ fontSize: "clamp(40px, 6vw, 84px)", lineHeight: 0.98, letterSpacing: "-0.03em" }}
            >
              {t.testimonials.headline_prefix}
              <span className="italic text-brand-cognac">{t.testimonials.headline_accent}</span>.
            </h2>
          </div>
          <div className="col-span-12 flex items-center gap-3 lg:col-span-4 lg:justify-end">
            <div aria-hidden className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-brand-cognac">
                  <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7L12 17.8 5.7 21.2l1.7-7L2 9.5l7.1-.6L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-[12px] uppercase tracking-[0.2em] text-brand-mute">
              {t.testimonials.rating}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-3 lg:gap-x-12">
          {t.testimonials.reviews.map((r, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative border-t border-brand-ink/15 pt-7"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-cognac/15">
                    <span className="font-display italic text-brand-cognac" style={{ fontSize: "17px" }}>{r.initials}</span>
                  </span>
                  <div>
                    <p className="font-display text-brand-ink" style={{ fontSize: "18px", lineHeight: 1.15 }}>{r.couple}</p>
                    <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.22em] text-brand-mute">{r.where}</p>
                  </div>
                </div>
                <div aria-hidden className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-brand-cognac">
                      <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7L12 17.8 5.7 21.2l1.7-7L2 9.5l7.1-.6L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>

              <blockquote
                className="font-display text-brand-ink"
                style={{ fontSize: "20px", lineHeight: 1.45, letterSpacing: "-0.01em" }}
              >
                <span aria-hidden className="text-brand-cognac">&ldquo;</span>
                {r.quote}
                <span aria-hidden className="text-brand-cognac">&rdquo;</span>
              </blockquote>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
