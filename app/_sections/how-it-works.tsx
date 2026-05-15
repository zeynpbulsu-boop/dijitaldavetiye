"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useT } from "@/lib/i18n/provider";

/**
 * HowItWorks — 4-step process grid, i18n-bound.
 */
export function HowItWorks() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="relative border-b border-line bg-bg-alt/40 py-24 lg:py-32"
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 grid grid-cols-12 items-end gap-x-6 gap-y-8 border-b border-line pb-8 lg:mb-24 lg:pb-10"
        >
          <div className="col-span-12 lg:col-span-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — {t.how_it_works.eyebrow}
            </span>
            <h2
              className="mt-4 font-display text-brand-ink"
              style={{
                fontSize: "clamp(40px, 6vw, 84px)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
              }}
            >
              {t.how_it_works.headline_prefix}
              <br className="hidden sm:inline" />
              <span className="italic text-brand-cognac">{t.how_it_works.headline_accent}</span>
              {t.how_it_works.headline_suffix}
            </h2>
          </div>
          <p
            className="col-span-12 max-w-[380px] text-brand-ink/70 lg:col-span-4 lg:justify-self-end lg:text-right"
            style={{ fontSize: "15px", lineHeight: 1.6 }}
          >
            {t.how_it_works.intro}
          </p>
        </motion.div>

        <ol className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {t.how_it_works.steps.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                delay: 0.2 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative"
            >
              <div className="mb-6 flex items-center gap-4 border-t border-brand-ink/15 pt-5 transition-colors duration-500 group-hover:border-brand-cognac">
                <span className="text-[12px] font-medium uppercase tracking-[0.28em] text-brand-cognac">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="h-px flex-1 bg-transparent" />
              </div>

              <h3
                className="font-display text-brand-ink"
                style={{
                  fontSize: "clamp(24px, 2.4vw, 30px)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.018em",
                }}
              >
                {step.title}
              </h3>
              <p
                className="mt-3 max-w-[280px] text-brand-ink/70"
                style={{ fontSize: "15px", lineHeight: 1.6 }}
              >
                {step.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
