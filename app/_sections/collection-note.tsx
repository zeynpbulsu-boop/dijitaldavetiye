"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useT } from "@/lib/i18n/provider";

export function CollectionNote() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section ref={ref} className="relative border-b border-line bg-bg py-24 lg:py-36">
      <div className="mx-auto max-w-[760px] px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-cognac"
        >
          — {t.collection_note.eyebrow}
        </motion.span>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 font-display text-brand-ink"
          style={{ fontSize: "clamp(22px, 2.4vw, 32px)", lineHeight: 1.45, letterSpacing: "-0.012em" }}
        >
          {t.collection_note.body}
          <span className="italic text-brand-cognac">{t.collection_note.body_accent}</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.28em] text-brand-mute"
        >
          <span aria-hidden className="h-px w-12 bg-brand-mute/45" />
          <span>{t.collection_note.bottom_strip}</span>
          <span aria-hidden className="h-px w-12 bg-brand-mute/45" />
        </motion.div>
      </div>
    </section>
  );
}
