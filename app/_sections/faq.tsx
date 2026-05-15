"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useT } from "@/lib/i18n/provider";

export function Faq() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section id="faq" ref={ref} className="border-b border-line bg-bg py-24 lg:py-36">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex items-end justify-between border-b border-line pb-8 lg:mb-16"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — {t.faq.eyebrow}
            </span>
            <h2
              className="mt-4 font-display text-brand-ink"
              style={{ fontSize: "clamp(36px, 5.2vw, 68px)", lineHeight: 1.02, letterSpacing: "-0.025em" }}
            >
              {t.faq.headline_prefix}<span className="italic text-brand-cognac">{t.faq.headline_accent}</span>?
            </h2>
          </div>
          <span className="hidden text-[11px] uppercase tracking-[0.2em] text-brand-mute md:inline">№ 008</span>
        </motion.div>

        <ul className="divide-y divide-brand-ink/12 border-y border-brand-ink/12">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 py-6 text-left lg:py-8"
                >
                  <span className="w-9 shrink-0 text-[11px] font-medium uppercase tracking-[0.22em] text-brand-cognac">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-display text-brand-ink"
                    style={{ fontSize: "clamp(18px, 2vw, 26px)", lineHeight: 1.25, letterSpacing: "-0.012em" }}
                  >
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-ink/22 text-brand-cognac transition-all duration-500 group-hover:border-brand-cognac"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      backgroundColor: isOpen ? "rgba(140, 90, 60, 0.1)" : "transparent",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  className="grid overflow-hidden transition-all duration-500"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    paddingBottom: isOpen ? 28 : 0,
                  }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p
                      className="max-w-[640px] pl-14 text-brand-ink/75"
                      style={{ fontSize: "16px", lineHeight: 1.7 }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-center text-[13px] text-brand-mute">
          {t.faq.closing_prefix}
          <a
            href="mailto:info@nuve.app"
            className="text-brand-cognac underline decoration-brand-cognac/40 underline-offset-4 transition hover:decoration-brand-cognac"
          >
            info@nuve.app
          </a>
          {t.faq.closing_suffix}
        </p>
      </div>
    </section>
  );
}
