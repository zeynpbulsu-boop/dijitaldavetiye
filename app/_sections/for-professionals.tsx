"use client";

/**
 * ForProfessionals — B2B section (Pressed Love + TDI'da var).
 *
 * Düğün organizatörü / wedding planner / event coordinator için
 * white-label partnership teklifi. 4 fayda + iletişim CTA.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const BENEFITS = [
  {
    n: "01",
    title: "White-label çözüm",
    body: "Dijital davetiyeyi kendi markanız altında sunabilirsiniz; biz arka planda işi yaparız.",
  },
  {
    n: "02",
    title: "Özel tasarım",
    body: "Müşterileriniz için size özel tema; tek seferlik kurulum, sonra sınırsız davetiye.",
  },
  {
    n: "03",
    title: "Öncelikli destek",
    body: "Tek bir iletişim noktası, hızlı yanıt, müşterilerinize özel revizyon hakkı.",
  },
  {
    n: "04",
    title: "Sabit fiyat",
    body: "Her davetiye için net fiyat — müşteriye fiyat verirken sürpriz yok.",
  },
];

export function ForProfessionals() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      ref={ref}
      className="relative border-b border-line bg-brand-ink py-24 lg:py-36"
    >
      <div className="container-wide max-w-[1280px]">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 grid items-end gap-8 sm:mb-20 lg:grid-cols-[1.4fr,1fr]"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — Profesyoneller İçin
            </span>
            <h2
              className="mt-4 font-display text-paper"
              style={{
                fontSize: "clamp(36px, 5.2vw, 64px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
              }}
            >
              Düğün organizatörü{" "}
              <span className="italic text-brand-cognac">misin?</span>
            </h2>
            <p className="mt-4 max-w-[540px] text-[15px] leading-[1.7] text-paper/70">
              Müşterilerine unutulmaz bir ilk izlenim sun. Sen
              organizasyonu yap; biz dijital davetiyeyi senin markan
              altında hazırlayalım.
            </p>
          </div>

          <a
            href="mailto:hello@nuve.app?subject=Partnership%20Inquiry"
            className="justify-self-start lg:justify-self-end inline-flex min-h-[52px] items-center justify-center rounded-full bg-paper px-7 text-[12px] uppercase tracking-[0.22em] text-brand-ink transition-all hover:tracking-[0.28em]"
          >
            Bizimle iletişime geç →
          </a>
        </motion.header>

        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <motion.li
              key={b.n}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                delay: 0.15 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="border-t border-paper/20 pt-6"
            >
              <span className="text-[12px] font-medium uppercase tracking-[0.28em] text-brand-cognac">
                {b.n}
              </span>
              <h3
                className="mt-3 font-display text-paper"
                style={{
                  fontSize: "clamp(20px, 2.2vw, 24px)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                }}
              >
                {b.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-paper/65">
                {b.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
