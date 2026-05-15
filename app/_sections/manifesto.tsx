"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useT } from "@/lib/i18n/provider";

export function Manifesto() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      ref={ref}
      id="manifesto"
      className="relative grain border-b border-line bg-bg-alt py-28 lg:py-40"
    >
      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex items-baseline justify-between border-b border-line pb-6"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
            — {t.manifesto.eyebrow}
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-brand-mute">
            {t.manifesto.number}
          </span>
        </motion.div>

        <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 lg:col-span-2"
          >
            <span
              className="block font-display text-brand-ink"
              style={{
                fontSize: "clamp(96px, 12vw, 180px)",
                lineHeight: 0.82,
                letterSpacing: "-0.04em",
              }}
              aria-hidden
            >
              {t.manifesto.drop_cap}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 lg:col-span-10"
          >
            <p
              className="max-w-[680px] font-display text-brand-ink/80"
              style={{
                fontSize: "clamp(20px, 2.2vw, 28px)",
                lineHeight: 1.55,
                letterSpacing: "-0.005em",
              }}
            >
              <span className="text-brand-ink">{t.manifesto.body_first}</span>
              {t.manifesto.body_main}
              <span className="italic text-brand-cognac">{t.manifesto.body_accent}</span>
              {t.manifesto.body_rest}
            </p>

            <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-8 md:grid-cols-4 lg:mt-20 lg:pt-10">
              {t.manifesto.specs.map((s, i) => <SpecLine key={i} k={s.k} v={s.v} />)}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SpecLine({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-brand-mute">
        {k}
      </div>
      <div
        className="mt-2 font-display text-brand-ink"
        style={{ fontSize: "22px", lineHeight: 1, letterSpacing: "-0.01em" }}
      >
        {v}
      </div>
    </div>
  );
}
